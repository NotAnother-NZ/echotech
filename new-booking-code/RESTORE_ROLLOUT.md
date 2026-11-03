# Echo booking restoration — controlled staging rollout

**Do not merge or publish this work before a full client-test-mode payment
and native-Webflow receipt have been confirmed.** This is a restoration of
the original Webflow page flow, not deployment of the abandoned Neon rebuild.

## Goal / what stays

- Keep the existing three-page experience and original Webflow design.
- Preserve the **Residential** (paid) and two **Commercial** (no payment)
  receipt forms, their existing input names, Webflow Forms dashboard storage,
  and Webflow's built-in notification emails.
- Retain original Auckland and Wellington coverage **plus Christchurch**.
- Restore agency-managed script hosting, replacing only Echo's independently
  hosted booking-v3 script after QA.
- Keep all unrelated site scripts and page designs untouched.

## Staged scripts (load only on their matching pages)

| Webflow page | Staging script | Notes |
| --- | --- | --- |
| Book A Collection (New) | `new-booking-code/booking-v2.js` | Original form UX, 3 regions, precise distance, guarded parallel pricing, and structured draft hand-off |
| Book A Collection (Review) | `new-booking-code/native-receipt-restore.js` **before** `new-booking-code/review-restore.js` | Original CardElement appearance, server-priced Stripe PaymentIntent, native Webflow receipt |
| Booking Confirmation | `new-booking-code/confirmation-restore.js` | Checks Webflow acceptance; for residential also verifies Stripe status |
| Book A Collection (New) | existing `date-picker.js` | Keep exactly one Flatpickr initialisation; do not run duplicate date scripts |

**Do not load** the original `review.js` simultaneously with
`review-restore.js`, or the client's `booking-v3.js` simultaneously with
the restored `booking-v2.js`. Sitewide `bac-form.js` targets the older
`#bac-form-wrapper`, not `#bac-form-wrapper-new`; leave it alone pending
an audit of older pages.

New Preview API: `/api/v2` on the dedicated **restoration feature branch**
of `Druhin13/echo-stripe-logic`. Set `data-echo-booking-api` to its
Preview HTTPS API base on `#bac-form-wrapper-review` and the Confirmation
page's `#page-wrapper`.

## Webflow forms (all three are required)

- `#res-payment-receipt`: Residential, after a verified succeeded payment
- `#com-payment-receipt`: Commercial without data erasure, no payment
- `#com-booking-receipt`: Commercial with data erasure, no payment

Before changing anything, record a screenshot of every form's `Send to`
destinations, email recipient list and webhook URL list. On **staging**, remove
only n8n destinations, preserving `Webflow` and `Email notifications` on
every receipt form. Keep Webflow's built-in Turnstile; do not inject another.

The staging review adapter needs the native `redirect` / `data-redirect`
properties **cleared** for those three forms, to observe Webflow's genuine
`.w-form-done` state and redirect only after acceptance. The baseline
`/booking-confirmation` redirect has been restored in Designer for now;
clear these again deliberately when preparing staging, **not before**.

The Webflow Data API cannot edit per-form `Send to` webhook destinations
in this connection. Remove them manually through each form's Designer
settings. Do not confuse this with site/app-level API webhook settings.

## Test plan (required before production)

1. Check current published production scripts and baseline. Make no changes
   to live keys, production aliases or `main`.
2. Deploy the restoration branch to Vercel Preview (Node 24) and configure
   **client's Stripe test keys** only there.
3. Verify Google Places/Routes access for sample addresses in Auckland,
   Wellington and Christchurch; reject outside 50 km (50,001 m is invalid).
4. Remove n8n form destinations in staging only, preserve native Webflow
   storage/email and notifications. Clear native form redirects.
5. Install page-specific scripts and remove conflicting legacy scripts **in
   staging only**. Use exact commit-SHA URLs to avoid CDN cache confusion.
6. Residential: run Stripe test card success, decline, authentication, repeat
   click, Back, reload and payment-verified-receipt-failed recovery.
7. Commercial: submit both variants **without charging** and verify native
   Webflow Forms records and exactly the expected emails.
8. Reconcile a sample residential Stripe PaymentIntent ID against the
   corresponding native Webflow receipt entry. Confirm no second charge
   when the customer retries.
9. After QA and client sign-off, publish production changes in a controlled
   window; verify a safe real booking and check notification delivery.
10. Rotate the previously committed live Stripe server key after moving
    all server code to Vercel secret storage and coordinating the cutover.

## Outstanding caveat

A browser warning cannot force a tab to remain open. If the browser closes
after Stripe charges but before native Webflow accepts a receipt, the
Stripe payment exists without a Webflow form/email. This requires an
operational payment-to-form reconciliation plan before fully unattended
production payments. We must **not** claim that it has been eliminated.

This is a draft and has **not** been published or merged.
