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
      if (!wrapper || !done || !fail || typeof form.requestSubmit !== 'function') {
        reject(new Error('Native Webflow form state is unavailable.')); return;
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
      const finish = (error) => {
        if (settled) return;
        settled = true;
        observer?.disconnect();
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


/* Echo — Page 2 (Booking Review) staging integration.
 * Needs booking-v2 backend, Stripe.js v3, existing native Webflow forms and
 * a Designer-authored Booking Reference field on EACH receipt form.
 * Do not enable on production until signed webhook reconciliation is tested.
 */
(() => {
  'use strict';
  const form = document.getElementById('bac-main-review-form');
  if (!form || !document.getElementById('bac-form-wrapper-review')) return;
  if (form.dataset.echoReviewInitialized === 'true') return;
  form.dataset.echoReviewInitialized = 'true';

  const API = 'https://echo-stripe-logic.vercel.app/api/v2';
  const DRAFT_KEY = 'echo:new-booking:v2';
  const PREPARED_KEY = 'echo:prepared-booking:v2';
  const ATTEMPTED_KEY = 'echo:receipt-attempted:v2';
  const $ = id => document.getElementById(id);
  let draft, payload, prepared, stripe, elements, processing = false;
  const show = (id,yes) => { if ($(id)) $(id).style.display = yes ? '' : 'none'; };
  const content = (id,value) => { if ($(id)) $(id).textContent = value ?? ''; };
  const money = cents => '$' + (Number(cents)/100).toFixed(2);
  const trim = id => String(draft.fields[id] ?? '').trim();
  const dates = () => ['day1','day2','day3'].map(id => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trim(id));
    if (!m) throw new Error('Please choose three valid collection dates.');
    return m[3]+'-'+m[2]+'-'+m[1];
  });
  const contact = prefix => ({
    firstName:trim(prefix+'first-name'),surname:trim(prefix+'surname'),
    email:trim(prefix+'email-address'),phone:trim(prefix+'phone')
  });
  const dataErasure = () => Boolean(draft.fields['data-erasure-service-checkbox']);
  const isCommercial = () => draft.collectionType === 'Commercial';

  function createPayload() {
    const basic = {
      type:draft.collectionType,
      placeId:draft.addressSelection?.placeId,
      postcode:trim('post-code'),preferredDates:dates(),
      items:draft.items,
      instructions:trim('collection-instruction'),
      termsAccepted: draft.fields['bac-terms-and-conditions-checkbox'] === true
    };
    if (!isCommercial()) {
      basic.residentialContact=contact('bac-');
    } else {
      const sameAsBilling = draft.fields['contact-billing-same-checkbox'] === true;
      basic.business = {
        name:trim('bac-company-name'),
        size:trim('bac-company-size'),sector:trim('bac-business-sector'),
        onsiteName:trim('on-site-full-name'),onsitePhone:trim('on-site-phone'),
        dataErasure:dataErasure(),sameAsBilling,
        billing:contact('bac-billing-'),
        ...(!sameAsBilling ? {contact:contact('bac-contact-')} : {})
      };
    }
    return basic;
  }

  function message(text) {
    content('payment-status',text);
    show('payment-status-wrapper',Boolean(text));
    if (text) $('payment-status-wrapper')?.scrollIntoView({block:'nearest',behavior:'smooth'});
  }
  function busy(yes) {
    processing = yes;
    ['bac-pay','bac-submit'].forEach(id => {
      const el=$(id);
      if (el) {
        el.style.pointerEvents = yes ? 'none' : '';
        el.setAttribute('aria-disabled',String(yes));
      }
    });
  }
  async function request(path,method='GET',data) {
    const response = await fetch(API+path,{
      method,mode:'cors',credentials:'omit',cache:'no-store',
      headers:data ? {'Content-Type':'application/json'} : {},
      ...(data ? {body:JSON.stringify(data)} : {})
    });
    const parsed = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(parsed.error || 'Unable to reach booking service.');
    return parsed;
  }
  function getStatus() {
    return request('/bookings/status?reference='+encodeURIComponent(prepared.reference));
  }
  function renderItemLines() {
    const parent=$('item-summary-wrapper');
    const template=parent?.querySelector('.item-summary-wrapper-proxy');
    if (!parent || !template) throw new Error('The booking item summary template is missing.');
    template.style.display='none';
    parent.querySelectorAll('[data-echo-booking-line]').forEach(el=>el.remove());
    const anchor=$('item-summary-wrapper-des');
    for (const line of prepared.items) {
      const copy=template.cloneNode(true);
      copy.style.display='';
      copy.dataset.echoBookingLine='true';
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
      const cells=copy.querySelectorAll('.body2');
      const values=isCommercial() ?
        [line.name,'TBC',line.quantity+'x','TBC'] :
        [line.name,money(line.unitPriceCents),line.quantity+'x',money(line.lineTotalCents)];
      values.forEach((value,index)=>{if(cells[index]) cells[index].textContent=value;});
      if (anchor) parent.insertBefore(copy,anchor);
      else parent.append(copy);
    }
  }
  function renderSummary() {
    const billingContact=payload.business?.billing;
    const contactDetails=isCommercial() ?
      payload.business.sameAsBilling ? billingContact : payload.business.contact :
      payload.residentialContact;
    const parts=[
      ...(isCommercial()?[payload.business.name]:[]),
      contactDetails.firstName+' '+contactDetails.surname,
      contactDetails.email,contactDetails.phone
    ];
    content('review-contact-details',parts.join('\n'));
    $('review-contact-details').style.whiteSpace='pre-line';
    content('review-address',prepared.address);
    content('review-post-code',prepared.postcode);
    prepared.preferredDates.forEach((date,i)=>content('review-date'+(i+1),
      new Intl.DateTimeFormat('en-NZ',{timeZone:'UTC',day:'numeric',month:'short',year:'numeric'})
        .format(new Date(date+'T12:00:00Z'))));
    renderItemLines();
    const price=prepared.quote;
    content('review-subtotal',price?money(price.subtotalCents):'TBC');
    content('review-shipping',price?money(price.collectionCents):'TBC');
    content('review-grand-total',price?money(price.totalCents):'TBC');
    show('item-summary-wrapper-des',isCommercial() && dataErasure());
    show('tandc-text',isCommercial());
    show('bac-pay',!isCommercial());
    show('bac-submit',isCommercial());
    const cardParent=$('card-element')?.closest('[id="payment-wrapper"]');
    if(cardParent) cardParent.style.display=isCommercial()?'none':'';
  }

  function receiptFields() {
    const totalQuantity = prepared.items.reduce((sum,line)=>sum+line.quantity,0);
    const common = {
      'Collection-Address':prepared.address+', '+prepared.postcode,
      'Collection-Instruction':payload.instructions,
      'Collection-Dates':prepared.preferredDates.join(', '),
      'Total-Items':String(totalQuantity),
      'Booking-Reference':prepared.reference
    };
    const b=payload.business;
    if (!b) {
      return {
        formId:'res-payment-receipt',
        fields:{
          ...common,
          'First-Name':payload.residentialContact.firstName,
          'Surname':payload.residentialContact.surname,
          'Email':payload.residentialContact.email,
          'Phone':payload.residentialContact.phone,
          'Items':prepared.items.map(line =>
            [line.name,money(line.unitPriceCents),line.quantity+'x',money(line.lineTotalCents)].join(', ')
          ).join('\n'),
          'Subtotal':money(prepared.quote.subtotalCents),
          'Shipping':money(prepared.quote.collectionCents),
          'Grand-Total':money(prepared.quote.totalCents)
        }
      };
    }
    const c=b.sameAsBilling?b.billing:b.contact;
    return {
      formId:b.dataErasure?'com-booking-receipt':'com-payment-receipt',
      fields:{
        ...common,
        'On-site-Name':b.onsiteName,
        'On-site-Phone':b.onsitePhone,
        'Company-Name':b.name,
        'Company-Size':b.size,
        'Business-Sector':b.sector,
        'Contact-First-Name':c.firstName,
        'Contact-Surname':c.surname,
        'Contact-Email':c.email,
        'Contact-Phone':c.phone,
        'Billing-First-Name':b.billing.firstName,
        'Billing-Surname':b.billing.surname,
        'Billing-Email':b.billing.email,
        'Billing-Phone':b.billing.phone,
        'Items':prepared.items.map(line=>line.name+', '+line.quantity+'x').join('\n'),
        'Subtotal':'TBC','Shipping':'TBC','Grand-Total':'TBC'
      }
    };
  }

  function ensureWebflowReady() {
    const {formId,fields}=receiptFields();
    const receipt=$(formId);
    if (!receipt || !receipt.closest('.w-form') ||
        receipt.getAttribute('action') ||
        receipt.hasAttribute('redirect') || receipt.hasAttribute('data-redirect')) {
      throw new Error('Native Webflow receipt settings must be updated and published before accepting bookings.');
    }
    for (const name of Object.keys(fields)) {
      if (!receipt.elements.namedItem(name)) {
        throw new Error('Missing Webflow Designer receipt field: '+name);
      }
    }
    if (!window.EchoBookingNativeReceipt?.submitReceipt) {
      throw new Error('The native Webflow receipt helper is unavailable.');
    }
  }
  function redirectConfirmed() {
    sessionStorage.removeItem(ATTEMPTED_KEY);
    sessionStorage.removeItem(PREPARED_KEY);
    sessionStorage.removeItem(DRAFT_KEY);
    window.location.assign('/booking-confirmation?booking='+encodeURIComponent(prepared.reference));
  }
  async function submitReceiptOnce() {
    if (processing) return;
    if (sessionStorage.getItem(ATTEMPTED_KEY)===prepared.reference) {
      message('Your booking may already have been received by Webflow. Please do not submit again; we are checking its status.');
      return;
    }
    busy(true);
    try {
      ensureWebflowReady();
      sessionStorage.setItem(ATTEMPTED_KEY,prepared.reference);
      await window.EchoBookingNativeReceipt.submitReceipt(receiptFields());
      // Webflow has displayed its native success state; the signed webhook
      // will independently confirm the corresponding booking in the backend.
      window.location.assign('/booking-confirmation?booking='+encodeURIComponent(prepared.reference));
    } catch(error) {
      // A timeout has an unknown outcome: never resubmit blindly.
      if (!/timed out/i.test(error.message)) sessionStorage.removeItem(ATTEMPTED_KEY);
      message(error.message);
    } finally {busy(false);}
  }
  async function waitForPaid() {
    for (let attempts=0;attempts<18;attempts++) {
      const status=await getStatus();
      if (status.status === 'confirmed') {redirectConfirmed();return;}
      if (status.stage === 'receipt_required') {await submitReceiptOnce();return;}
      await new Promise(resolve=>setTimeout(resolve,1000));
    }
    message('Your payment may still be processing. Do not pay again. Please refresh this page to check the booking status.');
  }

  async function initializePayment() {
    if (typeof window.Stripe !== 'function') {
      throw new Error('Stripe.js has not loaded on the Review page.');
    }
    const intent=await request('/bookings/payment-intent','POST',{reference:prepared.reference});
    stripe=window.Stripe(intent.publishableKey);
    elements=stripe.elements({clientSecret:intent.clientSecret});
    elements.create('payment',{layout:'tabs'}).mount('#card-element');
  }

  async function load() {
    try {
      const raw=sessionStorage.getItem(DRAFT_KEY);
      draft=JSON.parse(raw||'null');
      if (!draft || draft.version !== 2) {
        window.location.replace('/book-a-collection');return;
      }
      payload=createPayload();
      const fingerprint=JSON.stringify(payload);
      const saved=JSON.parse(sessionStorage.getItem(PREPARED_KEY)||'null');
      if (saved?.fingerprint === fingerprint && saved.prepared?.reference &&
          Date.now()-saved.timestamp < 20*60*60*1000) {
        prepared=saved.prepared;
      } else {
        prepared=await request('/bookings/prepare','POST',payload);
        sessionStorage.setItem(PREPARED_KEY,JSON.stringify({
          fingerprint,prepared,timestamp:Date.now()
        }));
        sessionStorage.removeItem(ATTEMPTED_KEY);
      }
      renderSummary();
      // Fail closed BEFORE taking payment: if Webflow's receipt form cannot
      // submit natively, charging the customer would break Echo notifications.
      ensureWebflowReady();
      const status=await getStatus();
      if (status.status==='confirmed') {redirectConfirmed();return;}
      if (status.stage==='receipt_required' && !isCommercial()) {
        if (sessionStorage.getItem(ATTEMPTED_KEY)===prepared.reference) {
          message('Payment was received, and the Webflow receipt is still being checked. Please do not pay again.');
        } else await submitReceiptOnce();
        return;
      }
      if (!isCommercial()) await initializePayment();
      else message('');
    } catch(error) {
      message(error.message || 'Unable to load your booking. Please return to the previous page.');
      busy(true);
    }
  }

  form.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();},true);
  $('bac-pay')?.addEventListener('click',async event=>{
    event.preventDefault();
    if(processing || !stripe || !elements) return;
    busy(true);message('');
    try {
      ensureWebflowReady();
      const submitted=await elements.submit();
      if(submitted.error) throw new Error(submitted.error.message || 'Please review your payment details.');
      const result=await stripe.confirmPayment({
        elements,
        confirmParams:{return_url:window.location.origin+'/booking-review?payment_return=1'},
        redirect:'if_required'
      });
      if(result.error) throw new Error(result.error.message || 'Payment could not be completed.');
      await waitForPaid();
    } catch(error) {
      message(error.message || 'We were unable to complete the payment.');
    } finally {busy(false);}
  });
  $('bac-submit')?.addEventListener('click',async event=>{
    event.preventDefault();
    if(!processing && isCommercial() && prepared) await submitReceiptOnce();
  });

  show('payment-status-wrapper',false);
  show('bac-pay',false);
  show('bac-submit',false);
  load();
})();
