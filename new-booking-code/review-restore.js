/* Echo — Page 2 restored agency booking review; staging only.
 * Native Webflow forms send their existing dashboard submissions and emails.
 * Residential payment truth comes from the Stripe PaymentIntent on our backend.
 * Requires native-receipt-restore.js to load before this file on Page 2.
 */
(() => {
  'use strict';
  const form=document.getElementById('bac-main-review-form');
  const wrap=document.getElementById('bac-form-wrapper-review');
  if (!form || !wrap || form.dataset.echoMinimalReview==='true') return;
  form.dataset.echoMinimalReview='true';

  const DRAFT='echo:new-booking:v2', PREPARED='echo:prepared-booking:v2',
    CHECKOUT='echo:checkout-id:v2', ATTEMPTED='echo:receipt-attempted:v2',
    DONE='echo:receipt-completed:v2';
  const $=id=>document.getElementById(id);
  const money=n=>'$'+(n/100).toFixed(2);
  const set=(id,v)=>{if($(id))$(id).textContent=String(v??'');};
  const show=(id,on)=>{if($(id))$(id).style.display=on?'':'none';};
  let draft,payload,prepared,stripe,elements,cardElement,busy=false,paid=false,guard=false,uncertain=false;
  const apiURL=wrap.getAttribute('data-echo-booking-api');
  const api=(()=>{
    try {
      const u=new URL(apiURL);
      return u.protocol==='https:' && u.pathname.replace(/\/$/,'')==='/api/v2' &&
        !u.search && !u.hash && !u.username && !u.password ? u.origin+'/api/v2' : null;
    }catch{return null;}
  })();

  function status(text) {
    set('payment-status',text);
    show('payment-status-wrapper',Boolean(text));
  }
  function block(on) {
    busy=on;
    for(const id of ['bac-pay','bac-submit']){
      const el=$(id);
      if(el){el.style.pointerEvents=on?'none':'';el.setAttribute('aria-disabled',String(on));}
    }
  }
  function leave(event) {event.preventDefault();event.returnValue=true;}
  function protect(on) {
    if(guard===on)return;
    guard=on;
    if(on)window.addEventListener('beforeunload',leave);
    else window.removeEventListener('beforeunload',leave);
  }
  function guidance(text) {
    let node=$('echo-booking-payment-guidance');
    if(!node){
      const anchor=$('card-element')?.closest('[id="payment-wrapper"]');
      if(!anchor)return;
      node=document.createElement('p');
      node.id='echo-booking-payment-guidance';
      node.className='body2';
      node.style.marginTop='1rem';
      anchor.insertAdjacentElement('afterend',node);
    }
    node.setAttribute('role','status');
    node.setAttribute('aria-live','polite');
    node.hidden=draft?.collectionType==='Commercial';
    if(text)node.textContent=text;
  }
  const defaultGuidance='Please keep this page open until your payment and booking confirmation are complete. Closing or refreshing early may delay confirmation.';
  const loadingGuidance='Payment is in progress. Please do not close or refresh this page.';
  const doneGuidance='Payment received. We are sending your booking to Echo. Please keep this page open.';

  async function call(path,body) {
    if(!api)throw Error('The staging booking API URL is missing or invalid.');
    const r=await fetch(api+path,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body),mode:'cors',credentials:'omit',cache:'no-store'
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok)throw Error(data.error||'Could not contact booking service.');
    return data;
  }
  function field(id){return String(draft.fields[id]??'').trim();}
  function contact(prefix){return {
    firstName:field(prefix+'first-name'),
    surname:field(prefix+'surname'),
    email:field(prefix+'email-address'),
    phone:field(prefix+'phone')
  };}
  function commercial(){return draft.collectionType==='Commercial';}
  function requestBody() {
    const dates=['day1','day2','day3'].map(id=>{
      const m=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(field(id));
      if(!m)throw Error('Please select three valid dates.');
      return m[3]+'-'+m[2]+'-'+m[1];
    });
    const result={
      type:draft.collectionType,placeId:draft.addressSelection?.placeId,
      postcode:field('post-code'),preferredDates:dates,items:draft.items,
      instructions:field('collection-instruction'),
      termsAccepted:draft.fields['bac-terms-and-conditions-checkbox']===true
    };
    if(!commercial())result.residentialContact=contact('bac-');
    else{
      const same=draft.fields['contact-billing-same-checkbox']===true;
      result.business={
        name:field('bac-company-name'),size:field('bac-company-size'),
        sector:field('bac-business-sector'),onsiteName:field('on-site-full-name'),
        onsitePhone:field('on-site-phone'),
        dataErasure:draft.fields['data-erasure-service-checkbox']===true,
        sameAsBilling:same,billing:contact('bac-billing-'),
        ...(!same?{contact:contact('bac-contact-')}:{})
      };
    }
    return result;
  }
  function render() {
    const c=commercial()?payload.business.sameAsBilling?
      payload.business.billing:payload.business.contact:payload.residentialContact;
    set('review-contact-details',[
      ...(commercial()?[payload.business.name]:[]),
      c.firstName+' '+c.surname,c.email,c.phone
    ].join('\n'));
    if($('review-contact-details'))$('review-contact-details').style.whiteSpace='pre-line';
    set('review-address',prepared.address);
    set('review-post-code',prepared.postcode);
    prepared.preferredDates.forEach((v,i)=>set('review-date'+(i+1),
      new Intl.DateTimeFormat('en-NZ',{timeZone:'UTC',year:'numeric',month:'short',day:'numeric'})
        .format(new Date(v+'T12:00:00Z'))));
    const list=$('item-summary-wrapper'),template=list?.querySelector('.item-summary-wrapper-proxy');
    if(!template)throw Error('The review item template could not be found.');
    template.style.display='none';
    list.querySelectorAll('[data-echo-booking-line]').forEach(n=>n.remove());
    const anchor=$('item-summary-wrapper-des');
    for(const item of prepared.items){
      const node=template.cloneNode(true);
      node.style.display='';
      node.dataset.echoBookingLine='true';
      node.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
      const cells=node.querySelectorAll('.body2');
      const vals=commercial()?
        [item.name,'TBC',item.quantity+'x','TBC']:
        [item.name,money(item.unitPriceCents),item.quantity+'x',money(item.lineTotalCents)];
      vals.forEach((v,i)=>{if(cells[i])cells[i].textContent=v;});
      if(anchor)list.insertBefore(node,anchor);else list.append(node);
    }
    set('review-subtotal',prepared.quote?money(prepared.quote.subtotalCents):'TBC');
    set('review-shipping',prepared.quote?money(prepared.quote.collectionCents):'TBC');
    set('review-grand-total',prepared.quote?money(prepared.quote.totalCents):'TBC');
    show('item-summary-wrapper-des',commercial()&&payload.business.dataErasure);
    show('tandc-text',commercial());
    show('bac-pay',!commercial());
    show('bac-submit',commercial());
    const card=$('card-element')?.closest('[id="payment-wrapper"]');
    if(card)card.style.display=commercial()?'none':'';
    if(!commercial())guidance($('echo-booking-payment-guidance')?.textContent.trim()||defaultGuidance);
  }
  function receiptFields(){
    const common={
      'Collection-Address':prepared.address.includes(prepared.postcode)?
        prepared.address:prepared.address+', '+prepared.postcode,
      'Collection-Instruction':payload.instructions,
      'Collection-Dates':prepared.preferredDates.join(', '),
      'Total-Items':String(prepared.items.reduce((s,v)=>s+v.quantity,0))
    };
    if(!commercial())return {
      formId:'res-payment-receipt',
      fields:{
        ...common,'First-Name':payload.residentialContact.firstName,
        'Surname':payload.residentialContact.surname,
        'Email':payload.residentialContact.email,
        'Phone':payload.residentialContact.phone,
        'Items':prepared.items.map(v=>
          [v.name,money(v.unitPriceCents),v.quantity+'x',money(v.lineTotalCents)].join(', ')
        ).join('\n')+'\nPayment reference: '+prepared.reference,
        'Subtotal':money(prepared.quote.subtotalCents),
        'Shipping':money(prepared.quote.collectionCents),
        'Grand-Total':money(prepared.quote.totalCents)
      }
    };
    const b=payload.business,c=b.sameAsBilling?b.billing:b.contact;
    return{
      formId:b.dataErasure?'com-booking-receipt':'com-payment-receipt',
      fields:{
        ...common,'On-site-Name':b.onsiteName,'On-site-Phone':b.onsitePhone,
        'Company-Name':b.name,'Company-Size':b.size,'Business-Sector':b.sector,
        'Contact-First-Name':c.firstName,'Contact-Surname':c.surname,
        'Contact-Email':c.email,'Contact-Phone':c.phone,
        'Billing-First-Name':b.billing.firstName,'Billing-Surname':b.billing.surname,
        'Billing-Email':b.billing.email,'Billing-Phone':b.billing.phone,
        'Items':prepared.items.map(v=>v.name+', '+v.quantity+'x').join('\n')+
          '\nBooking reference: '+prepared.reference,
        'Subtotal':'TBC','Shipping':'TBC','Grand-Total':'TBC'
      }
    };
  }
  function nativeFormReady(){
    const {formId,fields}=receiptFields(),receipt=$(formId);
    if(!receipt||!receipt.closest('.w-form')||receipt.getAttribute('action')||
       Boolean(receipt.getAttribute('redirect'))||Boolean(receipt.getAttribute('data-redirect')))
      throw Error('The existing Webflow receipt form redirect/action must be cleared on staging.');
    for(const key of Object.keys(fields)){
      if(!receipt.elements.namedItem(key))throw Error('Missing native Webflow receipt field: '+key);
    }
    if(!window.EchoBookingNativeReceipt?.submitReceipt)
      throw Error('Native Webflow receipt helper is not loaded.');
  }
  async function stripeStatus(){
    return call('/bookings/status',{reference:prepared.reference,clientSecret:prepared.clientSecret});
  }
  function finish(){
    protect(false);
    window.location.assign('/booking-confirmation?booking='+encodeURIComponent(prepared.reference));
  }
  async function submitNative(){
    if(busy)return;
    if(sessionStorage.getItem(DONE)===prepared.reference){finish();return;}
    if(sessionStorage.getItem(ATTEMPTED)===prepared.reference){
      protect(true);
      status('This booking may already be submitted. Please contact Echo rather than submitting again.');
      return;
    }
    block(true);
    try{
      nativeFormReady();
      protect(true);
      if(!commercial())guidance(doneGuidance);
      sessionStorage.setItem(ATTEMPTED,prepared.reference);
      await window.EchoBookingNativeReceipt.submitReceipt(receiptFields());
      sessionStorage.setItem(DONE,prepared.reference);
      finish();
    }catch(e){
      if(!/timed out/i.test(e.message)){
        sessionStorage.removeItem(ATTEMPTED);
        protect(false);
      }
      status(e.message||'Could not submit your booking to Webflow.');
    }finally{block(false);}
  }
  async function paidStatus(){
    for(let i=0;i<18;i++){
      const statusResult=await stripeStatus();
      if(statusResult.status==='paid')return true;
      if(statusResult.stage==='payment_required')return false;
      await new Promise(resolve=>setTimeout(resolve,1000));
    }
    uncertain=true;protect(true);
    status('Your payment is still being verified. Do not try to pay again. Please keep this page open.');
    return null;
  }
  async function loadPayment(){
    if(typeof Stripe!=='function')throw Error('Stripe.js is not loaded.');
    stripe=Stripe(prepared.publishableKey);
    elements=stripe.elements();
    cardElement=elements.create('card',{
      hidePostalCode:true,
      style:{
        base:{fontFamily:'inherit',fontSize:'16px',color:'#222'},
        invalid:{color:'#b91c1c'}
      }
    });
    cardElement.mount('#card-element');
    show('bac-pay',true);
  }
  async function load(){
    block(true);
    try{
      draft=JSON.parse(sessionStorage.getItem(DRAFT)||'null');
      if(draft?.version!==2)throw Error('Your booking draft is missing. Return to the booking page.');
      payload=requestBody();
      const fingerprint=JSON.stringify(payload);
      const earlier=JSON.parse(sessionStorage.getItem(CHECKOUT)||'null');
      const checkoutId=earlier?.fingerprint===fingerprint&&earlier.checkoutId?
        earlier.checkoutId:crypto.randomUUID();
      sessionStorage.setItem(CHECKOUT,JSON.stringify({fingerprint,checkoutId}));
      payload.checkoutId=checkoutId;
      const existing=JSON.parse(sessionStorage.getItem(PREPARED)||'null');
      if(existing?.fingerprint===fingerprint && existing.prepared?.reference &&
         (commercial()||existing.prepared.clientSecret) &&
         Date.now()-existing.timestamp<20*60*60*1000){
        prepared=existing.prepared;
      }else{
        prepared=await call('/bookings/prepare',payload);
        sessionStorage.setItem(PREPARED,JSON.stringify({prepared,fingerprint,timestamp:Date.now()}));
        sessionStorage.removeItem(DONE);
        sessionStorage.removeItem(ATTEMPTED);
      }
      render();
      nativeFormReady(); // Must succeed BEFORE collecting residential payment.
      if(commercial()){status('');return;}
      const s=await stripeStatus();
      if(s.status==='paid'){
        paid=true;show('bac-pay',false);show('bac-submit',true);
        if($('bac-submit'))$('bac-submit').textContent='Complete booking confirmation';
        if(sessionStorage.getItem(DONE)===prepared.reference){finish();return;}
        if(sessionStorage.getItem(ATTEMPTED)===prepared.reference){
          protect(true);
          status('Payment received. Your Webflow booking receipt is being checked; do not pay again.');
        } else {block(false);await submitNative();}
        return;
      }
      if(new URLSearchParams(location.search).has('payment_return')){
        protect(true);
        const verified=await paidStatus();
        if(verified===true){
          paid=true;show('bac-pay',false);show('bac-submit',true);
          block(false);await submitNative();
        }else if(verified===false){
          protect(false);
          await loadPayment();
        }
        return;
      }
      await loadPayment();
    }catch(e){
      status(e.message||'Unable to load booking.');
    }finally{if(!uncertain)block(false);}
  }
  form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
  $('bac-pay')?.addEventListener('click',async e=>{
    e.preventDefault();
    if(busy||paid||uncertain||!stripe||!cardElement)return;
    block(true);status('');
    try{
      nativeFormReady();
      protect(true);guidance(loadingGuidance);
      // Keep the original Card Element layout while Stripe.js handles
      // 3-D Secure/authentication for this server-created PaymentIntent.
      const contact=payload.residentialContact;
      const result=await stripe.confirmCardPayment(prepared.clientSecret,{
        payment_method:{
          card:cardElement,
          billing_details:{
            name:contact.firstName+' '+contact.surname,
            email:contact.email,
            phone:contact.phone
          }
        }
      });
      if(result.error){
        // A network or authentication error is not proof no payment occurred.
        // Check the server's Stripe record before enabling another attempt.
        const checked=await stripeStatus().catch(()=>null);
        if(checked?.status==='paid'){
          paid=true;show('bac-pay',false);show('bac-submit',true);
          block(false);await submitNative();return;
        }
        if(!checked || checked.stage==='payment_processing'){
          uncertain=true;
          status('Payment status is unclear. Do not pay again. Please keep this page open and contact Echo if needed.');
          return;
        }
        protect(false);guidance(defaultGuidance);
        throw Error(result.error.message||'Payment failed.');
      }
      const verified=await paidStatus();
      if(verified===true){
        paid=true;show('bac-pay',false);show('bac-submit',true);
        block(false);await submitNative();
      }else if(verified===false){
        protect(false);guidance(defaultGuidance);
        status('Payment was not completed. Please check your card and retry.');
      }
    }catch(err){
      if(guard){uncertain=true;status('Payment state uncertain. Do not pay again or close this page.');}
      else status(err.message||'Payment failed.');
    }finally{if(!uncertain)block(false);}
  });
  $('bac-submit')?.addEventListener('click',async e=>{
    e.preventDefault();
    if(!busy && (commercial()||paid))await submitNative();
  });
  $('back-to-booking')?.addEventListener('click',e=>{
    if(guard){e.preventDefault();status('Please keep this page open while your booking is being confirmed.');}
  });
  // Webflow initialises form handlers late in the document. Run Review
  // only after Webflow is ready so native receipts are intercepted correctly.
  function start() {
    show('bac-pay',false);show('bac-submit',false);
    status('');
    load();
  }
  if (window.Webflow && typeof window.Webflow.push === 'function') {
    window.Webflow.push(start);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',start,{once:true});
  } else {
    start();
  }
})();
