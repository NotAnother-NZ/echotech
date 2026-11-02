# Echo new-customer booking rebuild — frontend (WIP)

Three Webflow pages; **no sitewide booking JavaScript**:

1. Book A Collection (New): `booking.js` (planned)
2. Book A Collection (Review): `booking-review.js` (planned)
3. Booking Confirmation: `booking-confirmation.js` (initial isolated implementation here)

## Existing HTML contract

- Page 1: `#bac-form-wrapper-new`, `#bac-main-form`, `#res-form-button`, `#com-form-button`, `#address`, `#post-code`, `#day1`–`#day3`, `.form-product-option`, `.quantity[data-item-id]`, `#review-booking`.
- Page 2: `#bac-form-wrapper-review`, `#review-contact-details`, `#item-summary-wrapper`, `#card-element`, `#bac-pay`, `#bac-submit`, `#back-to-booking`.
- Page 3: `#text-header-top h1`, `#redirect-text`.
- **HTML change required:** Page 2 contains two `id="payment-wrapper"` values. Make IDs unique before enabling the new frontend.
- Remove only legacy booking scripts after the replacement is end-to-end tested. Keep other Webflow design and components.

## Behaviour contract

- All customers are new. Residential: independently validated NZD payment. Commercial (regardless of data erasure): quote request, prices TBC, no card collection.
- Three distinct preferred business days; apply CMS exclusions; user can return from review and edit without losing the draft.
- Item IDs must match `item1`–`item34`, not DOM positions; the `item1` option is hidden.
- A verified Google place ID and independently computed driving route must be used for service-area and shipping validation. Include Auckland, Wellington, Christchurch within an exact 50 km driving limit.
- Client-side price information is display-only. The payment backend must calculate prices itself from the approved catalogue.
- The existing Webflow Turnstile and browser extensions are not user-authored elements. Do not duplicate their scripts.
- Preserve commercial enquiry notifications and residential paid-booking receipts before retiring legacy hidden forms.
- Confirmation must display a verified success state only for a server-issued opaque reference with a persisted successful booking. Never regard `?respay=true` or a simple redirect as proof of payment.

## Activation status

The confirmation script is **not ready to load**: it depends on a new `GET /api/v2/bookings/status?reference=...` endpoint which must return `{ "status": "confirmed" | "pending" | "failed" }`. The backend endpoint has not been implemented or deployed. The other two page scripts remain to be built.

Until backend, payments, receipts and QA are complete, leave all production Webflow embeds unchanged.
