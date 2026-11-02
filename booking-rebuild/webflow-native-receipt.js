/* Echo booking rebuild — native Webflow receipt adapter.
 * This module is for bundling into booking-review.js (Page 2 ONLY).
 * It is not a payment processor and must not be used sitewide.
 */
(() => {
  'use strict';

  const FORM_IDS = Object.freeze({
    residential: 'res-payment-receipt',
    commercial: 'com-payment-receipt',
    commercialDataErasure: 'com-booking-receipt'
  });

  function selectFormId(collectionType, dataErasureNeeded) {
    if (collectionType === 'Residential') return FORM_IDS.residential;
    if (collectionType === 'Commercial') {
      return dataErasureNeeded ? FORM_IDS.commercialDataErasure : FORM_IDS.commercial;
    }
    throw new Error('Unrecognised collection type.');
  }

  /**
   * Submit a native Webflow receipt form.
   *
   * IMPORTANT:
   * - Payment MUST already be verified, for residential bookings.
   * - Fields are passed by existing Webflow form input names, not CSS selectors.
   * - The caller must gate repeat submissions with a durable booking reference.
   * - The Webflow Designer redirect must be disabled for this specific form.
   * - Only native Webflow "Send to: Webflow" forms are supported.
   *
   * Resolves after Webflow displays the form success state; the caller should
   * then redirect to /booking-confirmation?booking=<opaque-reference>.
   */
  function submitReceipt({ formId, fields, timeoutMs = 30000 }) {
    return new Promise((resolve, reject) => {
      if (!Object.values(FORM_IDS).includes(formId)) {
        reject(new Error('Unknown receipt form.')); return;
      }
      const form = document.getElementById(formId);
      if (!(form instanceof HTMLFormElement)) {
        reject(new Error('The native Webflow receipt form was not found.')); return;
      }
      const wrapper = form.closest('.w-form');
      const done = wrapper?.querySelector('.w-form-done');
      const fail = wrapper?.querySelector('.w-form-fail');
      if (!wrapper || !done || !fail || typeof form.requestSubmit !== 'function' ||
          !window.Webflow || typeof window.Webflow.require !== 'function' ||
          !window.Webflow.require('forms')) {
        reject(new Error('Native Webflow form processing is unavailable.')); return;
      }
      if (form.getAttribute('action')) {
        reject(new Error('Receipt form has a custom action; Webflow notifications would be bypassed.'));
        return;
      }
      if (form.getAttribute('redirect') || form.getAttribute('data-redirect')) {
        reject(new Error('Remove the native receipt-form redirect in Webflow before using the new booking flow.'));
        return;
      }
      if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
        reject(new Error('Receipt fields are required.')); return;
      }
      if (form.dataset.echoReceiptPending === 'true' || form.dataset.echoReceiptAccepted === 'true') {
        reject(new Error('This receipt form has already been submitted or is processing.')); return;
      }
      for (const [name, value] of Object.entries(fields)) {
        const field = form.elements.namedItem(name);
        if (!field || !('value' in field) || typeof value === 'object') {
          reject(new Error(`Missing or invalid Webflow receipt field: ${name}`));
          return;
        }
        field.value = String(value ?? '');
      }

      form.dataset.echoReceiptPending = 'true';
      const submitter = form.querySelector('input[type="submit"],button[type="submit"]');
      if (submitter) submitter.disabled = false;

      let settled = false;
      let timer;
      let observer;
      // Native forms in this site use method=GET with no action.
      // If Webflow fails to intercept, never let the browser navigate with
      // customer data in a query string. Webflow handlers register earlier.
      const preventNativeNavigation = event => {
        if (event.target === form) event.preventDefault();
      };
      document.addEventListener('submit',preventNativeNavigation,false);
      const finish = (error) => {
        if (settled) return;
        settled = true;
        observer?.disconnect();
        document.removeEventListener('submit',preventNativeNavigation,false);
        window.clearTimeout(timer);
        delete form.dataset.echoReceiptPending;
        if (error) reject(error);
        else {
          form.dataset.echoReceiptAccepted = 'true';
          resolve({ formId });
        }
      };

      // Webflow sets its own .w-form-done / .w-form-fail display styles.
      const visible = (element) => window.getComputedStyle(element).display !== 'none';
      observer = new MutationObserver(() => {
        if (visible(done)) finish();
        else if (visible(fail)) finish(new Error('Webflow did not accept the booking receipt.'));
      });
      observer.observe(wrapper, {
        attributes: true, attributeFilter: ['style', 'class'], subtree: true
      });
      timer = window.setTimeout(
        () => finish(new Error('Webflow receipt confirmation timed out.')),
        Math.min(60000, Math.max(5000, timeoutMs))
      );
      try {
        // Dispatch the native submit event; NEVER call form.submit(),
        // which skips the submit event Webflow uses to handle its forms.
        form.requestSubmit();
      } catch (_error) {
        finish(new Error('Could not start the Webflow receipt submission.'));
      }
    });
  }

  // Temporary namespaced export; fold into booking-review.js at completion.
  window.EchoBookingNativeReceipt = Object.freeze({ selectFormId, submitReceipt });
})();
