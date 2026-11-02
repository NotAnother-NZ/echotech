(() => {
  'use strict';

  // Page-specific script. Requires a durable booking status endpoint from the
  // new booking backend before it can be enabled on production Webflow pages.
  const heading = document.querySelector('#text-header-top h1');
  const redirect = document.getElementById('redirect-text');
  if (!heading || !redirect) return;

  const API_BASE = 'https://echo-stripe-logic.vercel.app';
  const params = new URLSearchParams(window.location.search);
  const reference = params.get('booking');
  const controller = new AbortController();

  function display(message, linkText) {
    heading.textContent = message;
    redirect.textContent = linkText;
  }
  function startCountdown() {
    let remaining = 10;
    const render = () => {
      redirect.textContent = `You will get redirected to the homepage in ${remaining}`;
    };
    render();
    const timer = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        window.clearInterval(timer);
        window.location.assign('/');
        return;
      }
      render();
    }, 1000);
    window.addEventListener('pagehide', () => window.clearInterval(timer), { once: true });
  }

  display('Checking your booking confirmation…', 'Return to homepage');

  // An opaque server-generated booking reference is required. Merely visiting
  // /booking-confirmation must never imply successful payment or submission.
  if (!reference || !/^[a-zA-Z0-9_-]{20,128}$/.test(reference)) {
    display('We could not verify a booking for this page.', 'Return to homepage');
    return;
  }

  async function verify() {
    try {
      const response = await fetch(
        `${API_BASE}/api/v2/bookings/status?reference=${encodeURIComponent(reference)}`,
        { cache: 'no-store', credentials: 'omit', signal: controller.signal }
      );
      if (!response.ok) throw new Error('Status endpoint unavailable');
      const data = await response.json();
      if (data?.status === 'confirmed') {
        display('Thanks! We’ve received your collection booking.', '');
        startCountdown();
      } else if (data?.status === 'pending') {
        display('Your booking is still being processed.', 'Please check your email for an update.');
      } else {
        display('We could not confirm this booking.', 'Please contact Echo if you have already paid.');
      }
    } catch (_error) {
      display('We could not check your booking right now.', 'Please contact Echo if you have already paid.');
    }
  }
  verify();
  window.addEventListener('pagehide', () => controller.abort(), { once: true });
})();
