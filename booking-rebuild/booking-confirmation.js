/* Echo — Page 3 confirmation (staging only).
 * Never show a success state from a query parameter or browser-only signal.
 * A signed Webflow native form receipt (and successful Stripe payment for
 * residential bookings) must be recorded by the backend first.
 */
(() => {
  'use strict';
  const heading = document.querySelector('#text-header-top h1');
  const redirect = document.getElementById('redirect-text');
  if (!heading || !redirect) return;

  const params = new URLSearchParams(window.location.search);
  const reference = params.get('booking');
  const endpoint = 'https://echo-stripe-logic.vercel.app/api/v2/bookings/status';
  const controller = new AbortController();
  let ended = false, timer = null;

  function display(title, subtitle) {
    heading.textContent = title;
    redirect.textContent = subtitle;
  }
  function afterConfirmed() {
    sessionStorage.removeItem('echo:prepared-booking:v2');
    sessionStorage.removeItem('echo:new-booking:v2');
    sessionStorage.removeItem('echo:receipt-attempted:v2');
    display('Thanks! We’ve received your collection booking.', '');
    let remaining=10;
    function draw() {redirect.textContent='You will get redirected to the homepage in '+remaining;}
    draw();
    timer=setInterval(()=>{
      remaining--;
      if (remaining <= 0) {
        clearInterval(timer);
        window.location.assign('/');
      } else draw();
    },1000);
  }

  if (!reference || !/^echo_[A-Za-z0-9_-]{32}$/.test(reference)) {
    display('We could not verify a booking for this page.', 'Return to homepage');
    return;
  }

  function pause(milliseconds) {
    return new Promise(resolve=>{
      timer=setTimeout(resolve,milliseconds);
    });
  }
  async function poll() {
    display('We’re checking your booking confirmation.', 'Return to homepage');
    for(let i=0;i<14 && !ended;i++) {
      try {
        const result=await fetch(endpoint+'?reference='+encodeURIComponent(reference),{
          cache:'no-store',credentials:'omit',signal:controller.signal
        });
        if (result.status===404) {
          display('We could not find this booking.', 'Return to homepage');
          return;
        }
        if (result.ok) {
          const data=await result.json();
          if (data.status==='confirmed') {afterConfirmed();return;}
        }
      } catch(error) {
        if (ended || error.name==='AbortError') return;
      }
      if (i < 13) await pause(1500);
    }
    if (!ended) display('Your booking is still being verified.',
      'If you have already paid, please do not make another payment. Contact Echo if the confirmation does not arrive.');
  }
  window.addEventListener('pagehide',()=>{
    ended=true;
    controller.abort();
    if (timer!==null) clearTimeout(timer);
  },{once:true});
  poll();
})();
