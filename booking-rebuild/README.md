# Echo Booking — minimal staging integration

The original plan added a Neon booking database unnecessarily. The active
staging implementation now uses only **Stripe + Webflow + the existing
Vercel API**. Keep all changes on the draft branch until browser QA passes.

## Page scripts — staging only

| Page | Load | Purpose |
|---|---|---|
| Book A Collection (New) | `booking.js` | Build/validate a draft and save it in `sessionStorage` |
| Book A Collection (Review) | **First** `webflow-native-receipt.js`, **then** `booking-review-lite.js` | Verify server-calculated total, Stripe Payment Element for residential, native Webflow receipt |
| Booking Confirmation | `booking-confirmation-lite.js` | Verify native Webflow acceptance and (residential only) Stripe success before showing confirmation |

These files live in the `booking-rebuild/` folder of this repository.

**Do not load the older** `booking-review.js` or `booking-confirmation.js`;
they are superseded draft versions that relied on a database. Only install
new scripts on the corresponding Webflow pages, never sitewide. The separate
`webflow-native-receipt.js` is loaded once and only on Page 2.

## Required backend environment

The staging Vercel backend runs from
`Druhin13/echo-stripe-logic` feature branch
`feature/booking-rebuild-20261102`.

Preview configuration:
- `ECHO_BOOKING_V2_ENABLED=true`
- `GOOGLE_MAPS_SERVER_KEY` for Places/Routes
- `ECHO_ALLOWED_ORIGINS=https://echostg.webflow.io`
- `ECHO_DISABLED_DATES` (must be reconciled with live CMS)
- `STRIPE_TEST_SECRET_KEY` and `STRIPE_TEST_PUBLISHABLE_KEY`

**No Neon, database migration, or webhook secret is required to exercise the
normal booking flow.** Stripe retains PaymentIntents and Webflow retains
native form submissions.

The backend calculates item subtotal, driving-distance collection charge,
and total in NZD cents independently of untrusted browser values. A stable
checkout UUID is used as Stripe's idempotency key. The existing
`STRIPE_SECRET_KEY` is never read.

## Existing native Webflow receipt forms

Keep all three unchanged in identity and notification routing:

- `#res-payment-receipt` — residential, only after a paid Stripe PaymentIntent
- `#com-payment-receipt` — commercial without erasure, **no charge**
- `#com-booking-receipt` — commercial with erasure, **no charge**

Keep `Send to: Webflow`, `Email Notifications`, original input names and
recipient addresses. No backend mailer or custom form action.

The three forms **currently redirect automatically** to
`/booking-confirmation`. Remove that built-in redirect on the staging
version before enabling the new script. The script must wait until Webflow
shows its actual `.w-form-done` success state.

The script writes the Stripe PaymentIntent ID (residential) or booking
reference (commercial) into the existing `Items` field. **No new form field
is necessary.** Webflow automatically manages its own Turnstile.

## Remaining staging steps

1. Make the isolated Vercel Preview API reachable from the Webflow staging
   origin without leaking an authentication-bypass token. Preview currently
   has Vercel Authentication enabled, which blocks ordinary browser fetches.
   Do not disable production protection or embed bypass secrets in Webflow.
2. On staging, set `data-echo-booking-api` on
   `#bac-form-wrapper-review` and `#page-wrapper` to the **exact same**
   accessible Preview API base URL ending `/api/v2`.
3. Remove the three native receipt-form redirects **on staging only**.
   Preserve Webflow form processing and notifications.
4. Load the page-specific scripts; stop loading existing booking JS on
   those three staging pages. Check duplicate `payment-wrapper` IDs.
5. Test residential paid, declined, 3DS, reload, back, keyboard/mobile and
   native Webflow success/error. Test both commercial variants with no charge.
6. Verify three Webflow Forms dashboard records and matching email
   notifications, with item quantities and prices or TBC.

## Known browser-close limitation

If a customer closes the tab after Stripe pays but before the native
Webflow receipt is submitted, Stripe still has the successful payment but
Webflow may not have the form submission/email. The UI warns about closing,
but browsers cannot be forcibly kept open. This edge case requires
operational reconciliation before unattended production use.

No production Webflow pages, live Stripe keys, or live payment settings
have been modified.
