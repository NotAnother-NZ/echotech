# Echo — three-page new-customer booking rebuild (WIP)

## Scope and files
The new integration is scoped to three specific Webflow pages, **not global sitewide scripts**:
- **Book A Collection (New)**: `booking.js`. Gathers a draft, enforces client UX validation, NZ Maps autocomplete, three dates, item counters, and saves to same-tab `sessionStorage`. It deliberately does **not** send the Page 1 Webflow form.
- **Book A Collection (Review)**: `booking-review.js`. Contains the native Webflow receipt helper and the review/payment flow. Fetches a trusted server-priced quote, confirms residential Stripe payment using Payment Element, then sends the **existing native Webflow receipt**. Commercial bookings never charge a card; their prices remain TBC.
- **Booking Confirmation**: `booking-confirmation.js`. Polls backend for a verified booking, only displays success after successful Webflow submission is confirmed by the signed webhook (and paid Stripe state for residential).

`webflow-native-receipt.js` is also retained as a readable standalone helper source, but is **already bundled into** `booking-review.js`. Do not load it separately.

## Existing Webflow selectors
Page 1: `#bac-form-wrapper-new`, `#bac-main-form`, `#res-form-button`, `#com-form-button`, `#address`, `#post-code`, `#day1`–`#day3`, `.form-product-option`, `.quantity[data-item-id]`, `#review-booking`.

Page 2: `#bac-form-wrapper-review`, `#review-contact-details`, `#item-summary-wrapper`, `#card-element`, `#bac-pay`, `#bac-submit`, `#back-to-booking`. Page 2 HTML currently repeats `id="payment-wrapper"`; give these wrappers unique IDs before cutover.

Page 3: `#text-header-top h1`, `#redirect-text`.

## Backend contract
New Vercel backend: `https://echo-stripe-logic.vercel.app/api/v2`. On the feature branch, it is gated by `ECHO_BOOKING_V2_ENABLED`, allowed origins, a separate Neon DB, a Places/Routes server key, and Stripe **test** credentials. Until this backend is deployed to a safe preview with its required env vars, the scripts will **not work**. Do not point staging Webflow at an incomplete production backend.

Critical validation (prices, weights, driving distances, customer fields) occurs on the server. A displayed `distance` or `total` from Page 1 cannot authorize Stripe charges.

## Existing native Webflow receipt forms — must keep
- `#res-payment-receipt` — residential after **verified** Stripe payment
- `#com-payment-receipt` — commercial without data erasure
- `#com-booking-receipt` — commercial with data erasure

**User requirement:** Echo receives native **Webflow Forms dashboard records and Webflow-generated email notifications**. Do not replace them with backend emails and do not use custom form actions.

Before staging integration:
1. Add a Webflow Designer-authored `Booking Reference` field (HTML name `Booking-Reference`) to all three forms, so the signed Webflow webhook can reconcile payment and receipt.
2. Remove their current built-in `/booking-confirmation` redirect settings **on staging**, so the script navigates only after Webflow displays its success state.
3. Keep `Send to: Webflow` plus `Email notifications` with Echo's original recipients; confirm recipient, subject and data in a published staging submission.
4. Ensure each form is processed natively by Webflow, including its built-in Turnstile. Never add Turnstile scripts manually.
5. Only then test real `requestSubmit()` calls from the hidden, disabled-by-default receipt forms. The helper checks that Webflow's forms module exists and prevents a browser-native `GET` fallback from leaking personal data in a URL. Browser testing is still essential.

The site currently has **two duplicate** `#payment-wrapper` IDs on Page 2. Fix in Designer before production QA.

## Dependencies
- Page 1: current Google Maps JavaScript Places Autocomplete library and Flatpickr. The old sitewide `date-picker.js` / `booking-v3.js` must **not** run simultaneously with the replacement on staging.
- Page 2: `<script src="https://js.stripe.com/v3/"></script>` before the dedicated page script, then `booking-review.js`. The bundled helper is included.
- Page 3: only the dedicated page script.
- Load each page-specific script using the corresponding Webflow Page settings; **do not add these to sitewide Footer/Head**.

## Recovery rules
- A payment is always attached to a durable backend booking and a fixed, server-calculated amount. Retrying/reloading uses the same booking reference; do **not** create a second payment without a new intentional booking.
- Once the native Webflow receipt submission starts, record an in-tab attempt so an uncertain result (timeout/navigation) doesn't silently send a duplicate native email. The server independently confirms only signed Webflow webhook events.
- If the browser closes after Stripe success before Webflow form submission, a paid-but-unsubmitted booking remains detectable on the backend, **but Webflow cannot guarantee a native notification**. Resolve this reliability limitation before production go-live.

## Validation / QA
Run syntax checks (`node --check booking-rebuild/*.js`) and test in the browser on a **published staging Webflow domain**. Exercise residential, commercial, commercial/data-erasure, Stripe success/3DS/decline, Webflow form rejection, postcode mismatch, 50 km boundary, availability/blackout, reload/back, rapid clicks, mobile, and browser close after payment.

Current status: **staging implementation only**. No forms or live Webflow scripts have been updated. None of the code is production-ready without backend deployment, secret scoping, native Webflow form changes and end-to-end QA.
