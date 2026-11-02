# Native Webflow submissions are required

**Decision (2 November 2026):** Echo must keep receiving booking submissions through Webflow's built-in Forms dashboard **and** the existing Webflow notification emails. Third-party emails or a backend-only booking record are not substitutes.

## Webflow-managed receipt forms on Page 2

| Scenario | Form | When to submit |
|---|---|---|
| New residential | `#res-payment-receipt` | After the payment has been verified as successful by our backend |
| New commercial, no data erasure | `#com-payment-receipt` | After the commercial booking request has been validated |
| New commercial, with data erasure | `#com-booking-receipt` | After the commercial booking request has been validated |

The second form's legacy name is misleading; it **does not** charge commercial customers. Keep existing IDs for compatibility and preserve the current Webflow notification routing.

## Designer settings (do not change in production until the new flow is staging-tested)

1. For each of the three receipt forms, leave **Send to: Webflow** and **Email notifications** enabled with Echo's existing configured recipients.
2. Do **not** configure a custom form action URL or set the form action to the new backend. The new backend handles payment and verification separately.
3. Remove the receipt forms' native redirect to `/booking-confirmation` *before enabling the new page-two script*. The JavaScript will only redirect after Webflow confirms it accepted the submission, using the backend-issued opaque booking reference. As of the original rendered HTML, these forms still have `redirect` and `data-redirect` attributes.
4. Each receipt form must have a valid Webflow form block, an enabled submit control, its default success/error states, and the site's native Webflow-managed anti-spam. The existing receipt wrappers are hidden; test whether each can be submitted programmatically on the *published staging site*, with the default Turnstile settings.
5. Add a Webflow Designer field named **Booking Reference** to each receipt form for reconciliation with payment records. Prefer Designer-authored fields over runtime-injected fields, because native form schema/notifications must be verified.
6. Confirm the three individual notification configurations (subject, recipients, body). Ensure the desired booking fields and payment status appear in the existing Webflow emails.

## Workflow and non-negotiable failure handling

- **Page 1**: validate/save a draft and navigate to Page 2. Do not submit a Webflow form on Page 1: this would send a premature booking email.
- **Commercial**: populate the corresponding receipt form, allow Webflow's native submit machinery to accept it, then navigate to Page 3. A successful custom backend call alone is not enough.
- **Residential**: perform a server-authoritative charge using Stripe and persist verified payment status, *then* populate/submit `#res-payment-receipt` natively. Never charge a customer twice due to receipt-submission retries. Show a specific recovery state if Webflow doesn't accept the receipt.
- **Page 3**: only display success when the server verifies both the booking/payment state and (where the integration tracks it) the Webflow receipt state. Navigating directly must not create a false confirmation.
- Keep all form receipt field names compatible with the current notification templates.

**Reliability limitation:** The public Webflow Data API documents listing/retrieving/updating submissions but not a supported endpoint to create a new native submission. Therefore, a client-side-only *post-payment* Webflow submission cannot be guaranteed if the browser closes, loses network access, or fails after the payment succeeds. A durable booking and Stripe webhook should detect paid-but-unsubmitted states. A Webflow `form_submission` webhook can reconcile received submissions. If absolutely guaranteed native Webflow email after payment is required, this remains an operational/integration limitation to resolve before production. Do not silently substitute a backend-sent email, since Echo expressly requires native Webflow notifications.

## Existing Frontend adapter

`webflow-native-receipt.js` is a staged helper to be bundled into the eventual Page 2 `booking-review.js`. It deliberately makes **no network calls** and is not a complete review/payment implementation. It submits through the native form's `requestSubmit()` method, waits for Webflow's success/error state, and rejects a still-configured native redirect.

**No changes have been made to the live Webflow site.**

Sources:
- https://help.webflow.com/hc/en-us/articles/33961347548563-How-do-I-add-forms-in-Webflow
- https://help.webflow.com/hc/en-us/articles/33961344521235-Form-submissions
- https://developers.webflow.com/data/reference/forms/list-submissions
- https://developers.webflow.com/data/reference/webhooks/events/form-submission
