/* Echo — Page 1 booking draft (staging only).
 * This standalone script does NOT accept payments or submit a Webflow receipt.
 * It is intentionally isolated from the existing sitewide code.
 */
(() => {
  'use strict';
  const form = document.getElementById('bac-main-form');
  if (!form || !document.getElementById('bac-form-wrapper-new')) return;
  if (form.dataset.echoNewBookingInitialized === 'true') return;
  form.dataset.echoNewBookingInitialized = 'true';

  const DRAFT_KEY = 'echo:new-booking:v2';
  const MAX_QUANTITY = 999;
  const input = id => document.getElementById(id);
  const text = (id, value) => { if (input(id)) input(id).textContent = value; };
  const show = (id, visible) => { if (input(id)) input(id).style.display = visible ? '' : 'none'; };
  let collectionType = 'Residential';
  let addressSelection = null;
  let distancePending = false;
  let commercialVisited = false;

  function getDateString(value) {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value || '');
    if (!match) return '';
    const year = +match[3], month = +match[2], day = +match[1];
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 &&
      date.getDate() === day ? `${year}-${match[2]}-${match[1]}` : '';
  }

  function dateAllowed(value) {
    const iso = getDateString(value);
    if (!iso) return false;
    const date = new Date(iso + 'T12:00:00');
    const day = date.getDay();
    if (day === 0 || day === 6) return false;
    const excluded = new Set([...document.querySelectorAll('.disabled-dates')].map(el => el.textContent.trim()));
    if (excluded.has(iso)) return false;
    const nzParts = new Intl.DateTimeFormat('en-GB', {timeZone:'Pacific/Auckland', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
    const parsed = Object.fromEntries(nzParts.map(p => [p.type, p.value]));
    const min = new Date(Date.UTC(+parsed.year,+parsed.month-1,+parsed.day,12));
    let counted = 0;
    while (counted < 2) {
      min.setDate(min.getDate() + 1);
      const ymd = min.toISOString().slice(0,10);
      if (min.getUTCDay() !== 0 && min.getUTCDay() !== 6 && !excluded.has(ymd)) counted++;
    }
    return new Date(iso + 'T12:00:00Z') > min;
  }

  function chosenItems() {
    return [...document.querySelectorAll('.form-product-option .quantity[data-item-id]')]
      .map(el => ({ id: el.dataset.itemId, quantity: Number(el.textContent.trim()) }))
      .filter(item => Number.isSafeInteger(item.quantity) && item.quantity > 0);
  }

  function setQuantity(el, quantity) {
    if (!el || !Number.isSafeInteger(quantity)) return;
    const next = Math.max(0, Math.min(MAX_QUANTITY, quantity));
    el.textContent = String(next);
    const counter = el.closest('.form-product-option-counter');
    const selected = next > 0;
    counter?.classList.toggle('selected', selected);
    counter?.querySelector('.counter-sub')?.classList.toggle('disable', !selected);
    counter?.querySelector('.counter-add')?.classList.toggle('disable', next >= MAX_QUANTITY);
    counter?.querySelectorAll('.counter-sub, .counter-add').forEach(button => button.classList.toggle('invert', selected));
    el.classList.toggle('white', selected);
    el.classList.toggle('forest-green', !selected);
    const dropdown = el.closest('.form-product-dropdown');
    dropdown?.querySelector('.dropdown-selected-circle')?.style.setProperty('opacity',
      dropdown.querySelector('.form-product-option-counter.selected') ? '1' : '0');
    input('total-unique-items').value = String(chosenItems().length);
  }

  function setType(type) {
    collectionType = type === 'Commercial' ? 'Commercial' : 'Residential';
    const commercial = collectionType === 'Commercial';
    input('collection-type').value = collectionType;
    for (const [id, active] of [['res-form-button', !commercial], ['com-form-button', commercial]]) {
      const button = input(id);
      button?.classList.toggle('selected', active);
      button?.querySelectorAll('.body2').forEach(el => {
        el.classList.toggle('white', active);
        el.classList.toggle('forest-green', !active);
      });
      button?.querySelector('.radio-tick-icon')?.classList.toggle('not-selected', !active);
    }
    ['on-site-contact', 'business-details', 'billing-details', 'contact-billing-same',
      'data-erasure-service', 'commercial-collection-type-note-text',
      'commercial-item-collection-note-text'].forEach(id => show(id, commercial));
    ['contact-details', 'residential-item-collection-note-text', 'shipping-note-wrapper']
      .forEach(id => show(id, !commercial));
    show('business-contact-details', commercial && !input('contact-billing-same-checkbox').checked);
    document.querySelectorAll('.form-product-bulk-option-details')
      .forEach(el => { el.style.display = commercial ? '' : 'none'; });
    document.querySelectorAll('.form-product-option')
      .forEach(el => el.classList.toggle('commercial', commercial));
    document.querySelectorAll('.pricing').forEach(el => { el.style.display = commercial ? 'none' : ''; });
    text('contact-details-title', commercial ? 'Business & Contact Details' : 'Contact Details');
    if (!commercial) input('data-erasure-service-checkbox').checked = false;
    input('data-erasure-needed').value = commercial && input('data-erasure-service-checkbox').checked ? 'Yes' : 'No';
    const residentialFields = ['bac-first-name','bac-surname','bac-email-address','bac-phone'];
    const commercialFields = ['on-site-full-name','on-site-phone','bac-company-name','bac-company-size',
      'bac-business-sector','bac-billing-first-name','bac-billing-surname','bac-billing-email-address','bac-billing-phone'];
    const contactFields = ['bac-contact-first-name','bac-contact-surname','bac-contact-email-address','bac-contact-phone'];
    residentialFields.forEach(id => { input(id).required = !commercial; });
    commercialFields.forEach(id => { input(id).required = commercial; });
    contactFields.forEach(id => { input(id).required = commercial && !input('contact-billing-same-checkbox').checked; });
    validate();
  }

  function contactValue(suffix) {
    return input('contact-billing-same-checkbox').checked ?
      input('bac-billing-' + suffix).value.trim() : input('bac-contact-' + suffix).value.trim();
  }

  function validate() {
    const errors = [];
    if (!addressSelection || addressSelection.address !== input('address').value.trim() ||
      distancePending || !Number.isInteger(addressSelection.distanceMeters) ||
      addressSelection.distanceMeters < 0 || addressSelection.distanceMeters > 50000) errors.push('a verified collection address within our service areas');
    if (!/^\d{4}$/.test(input('post-code').value.trim())) errors.push('a valid four-digit postcode');
    const dates = ['day1','day2','day3'].map(id => input(id).value.trim());
    if (dates.some(date => !dateAllowed(date)) || new Set(dates).size !== 3) errors.push('three different available weekdays');
    if (!chosenItems().length) errors.push('at least one item');
    const ids = collectionType === 'Residential' ?
      ['bac-first-name','bac-surname','bac-email-address','bac-phone'] :
      ['on-site-full-name','on-site-phone','bac-company-name','bac-company-size','bac-business-sector',
        'bac-billing-first-name','bac-billing-surname','bac-billing-email-address','bac-billing-phone'];
    ids.forEach(id => {
      const el = input(id);
      if (!el.value.trim() || (el.validity && !el.checkValidity())) errors.push(el.placeholder?.replace('*','') || id);
    });
    if (collectionType === 'Commercial' && !input('contact-billing-same-checkbox').checked) {
      ['first-name','surname','email-address','phone'].forEach(suffix => {
        if (!contactValue(suffix)) errors.push('contact ' + suffix.replaceAll('-',' '));
      });
    }
    if (!input('bac-terms-and-conditions-checkbox').checked) errors.push('acceptance of the Terms and Conditions');
    const button = input('review-booking');
    if (button) { button.classList.toggle('disable', !!errors.length); button.setAttribute('aria-disabled', String(!!errors.length)); }
    const note = input('form-validator-text');
    if (note) note.textContent = errors.length ?
      'Please complete: ' + [...new Set(errors)].join(', ') + '.' : '';
    show('form-validator-wrapper', !!errors.length);
    return errors;
  }

  function readDraft() {
    try {
      const value = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
      return value?.version === 2 ? value : null;
    } catch { return null; }
  }
  function saveDraft() {
    const fields = {};
    form.querySelectorAll('input[id], textarea[id], select[id]').forEach(el => {
      if (el.name === 'cf-turnstile-response') return;
      if (el.type !== 'submit' && el.type !== 'file') fields[el.id] = el.type === 'checkbox' ? el.checked : el.value;
    });
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({
      version: 2, updatedAt: Date.now(), collectionType, fields,
      items: chosenItems(), addressSelection, commercialVisited
    }));
  }
  function restoreDraft() {
    const draft = readDraft();
    if (!draft) return;
    commercialVisited = draft.commercialVisited === true || draft.collectionType === 'Commercial';
    Object.entries(draft.fields || {}).forEach(([id, value]) => {
      const el = input(id);
      if (!el || id === 'address' || id === 'distance') return;
      if (el.type === 'checkbox') el.checked = Boolean(value);
      else if (el.type !== 'submit' && el.type !== 'file') el.value = String(value ?? '');
    });
    if (draft.addressSelection && typeof draft.addressSelection.placeId === 'string' &&
        Number.isInteger(draft.addressSelection.distanceMeters) &&
        draft.addressSelection.distanceMeters <= 50000) {
      addressSelection = draft.addressSelection;
      input('address').value = draft.addressSelection.address;
      input('distance').value = String(draft.addressSelection.distanceMeters / 1000) + 'km';
    }
    (draft.items || []).forEach(({id,quantity}) => {
      const el = [...document.querySelectorAll('.quantity[data-item-id]')].find(node => node.dataset.itemId === id);
      setQuantity(el, quantity);
    });
    setType(draft.collectionType);
  }

  async function initAddress() {
    if (!window.google?.maps?.places?.Autocomplete || !window.google.maps.DistanceMatrixService) return;
    const field = input('address');
    const autocomplete = new google.maps.places.Autocomplete(field, {
      componentRestrictions: { country: 'nz' }, fields: ['place_id','geometry','address_components','formatted_address']
    });
    const points = [
      {name:'Auckland',coordinates:{lat:-36.9249524,lng:174.8192662}},
      {name:'Wellington',coordinates:{lat:-41.2370845,lng:174.9130315}},
      {name:'Christchurch',coordinates:{lat:-43.5320544,lng:172.6362254}}
    ];
    let sequence = 0;
    autocomplete.addListener('place_changed', () => {
      const current = ++sequence;
      const place = autocomplete.getPlace();
      addressSelection = null;
      if (!place?.place_id || !place.geometry?.location ||
          !place.address_components?.some(c => c.types?.includes('country') && c.short_name === 'NZ')) {
        validate(); return;
      }
      const postcode = place.address_components.find(c => c.types?.includes('postal_code'))?.long_name;
      if (postcode) input('post-code').value = postcode;
      distancePending = true;
      validate();
      new google.maps.DistanceMatrixService().getDistanceMatrix({
        origins: [place.geometry.location],
        destinations: points.map(point => point.coordinates),
        travelMode: google.maps.TravelMode.DRIVING
      }, (result, status) => {
        if (sequence !== current) return;
        distancePending = false;
        const valid = status === 'OK' ? (result?.rows?.[0]?.elements || [])
          .map((element, index) => ({
            index, meters: element.status === 'OK' ? element.distance?.value : null
          })).filter(row => Number.isInteger(row.meters) && row.meters <= 50000) : [];
        valid.sort((a,b) => a.meters - b.meters);
        if (valid.length) {
          const best = valid[0];
          addressSelection = {
            placeId: place.place_id, address: field.value.trim(),
            centre: points[best.index].name, distanceMeters: best.meters
          };
          input('distance').value = (best.meters/1000).toFixed(3) + 'km';
        } else {
          input('distance').value = '';
        }
        saveDraft(); validate();
      });
    });
    field.addEventListener('input', () => { sequence++; addressSelection = null; input('distance').value = ''; validate(); });
  }

  function initDates() {
    if (typeof window.flatpickr !== 'function') return;
    const instances = ['day1','day2','day3'].map(id => flatpickr('#' + id, {
      dateFormat:'d/m/Y', static:true, allowInput:false, minDate:'today',
      disable:[date => {
        const key = [date.getDate(),date.getMonth()+1,date.getFullYear()];
        const v = String(key[0]).padStart(2,'0')+'/'+String(key[1]).padStart(2,'0')+'/'+key[2];
        return !dateAllowed(v);
      }],
      onChange: () => { saveDraft(); validate(); }
    }));
    // Reserve the other selected dates without disabling each field's own value.
    instances.forEach((picker, index) => {
      picker.set('disable', [date => {
        const d = String(date.getDate()).padStart(2,'0')+'/'+String(date.getMonth()+1).padStart(2,'0')+'/'+date.getFullYear();
        return !dateAllowed(d) || ['day1','day2','day3'].some((id,i) => i !== index && input(id).value === d);
      }]);
    });
  }

  document.querySelectorAll('.quantity[data-item-id]').forEach(el => setQuantity(el, Number(el.textContent.trim()) || 0));
  input('res-form-button')?.addEventListener('click', () => { setType('Residential'); saveDraft(); });
  input('com-form-button')?.addEventListener('click', () => {
    if (!commercialVisited) input('contact-billing-same-checkbox').checked = true;
    commercialVisited = true;
    setType('Commercial'); saveDraft();
  });
  input('contact-billing-same-checkbox')?.addEventListener('change', () => { setType(collectionType); saveDraft(); });
  input('data-erasure-service-checkbox')?.addEventListener('change', () => {
    input('data-erasure-needed').value = input('data-erasure-service-checkbox').checked ? 'Yes' : 'No';
    saveDraft();
  });
  input('collection-instruction-toggle')?.addEventListener('click', event => {
    event.preventDefault(); show('collection-instruction',true); show('collection-instruction-toggle',false);
  });
  document.querySelectorAll('.form-product-dropdown-title').forEach(title => {
    title.addEventListener('click', () => {
      const box = title.closest('.form-product-dropdown');
      const expanded = box.dataset.expanded === 'true';
      box.dataset.expanded = String(!expanded);
      box.style.height = expanded ? title.getBoundingClientRect().height + 'px' : 'auto';
      title.querySelector('.form-field-icon.right')?.classList.toggle('rotate', !expanded);
    });
  });
  form.addEventListener('click', event => {
    const target = event.target.closest('.counter-add,.counter-sub,.bulk-counter-10,.bulk-counter-25,.bulk-counter-50');
    if (!target) return;
    event.preventDefault();
    const row = target.closest('.form-product-option');
    const quantity = row?.querySelector('.quantity[data-item-id]');
    if (!quantity) return;
    const inc = target.classList.contains('counter-sub') ? -1 :
      target.classList.contains('bulk-counter-50') ? 50 :
      target.classList.contains('bulk-counter-25') ? 25 :
      target.classList.contains('bulk-counter-10') ? 10 : 1;
    setQuantity(quantity, (Number(quantity.textContent)||0) + inc);
    saveDraft(); validate();
  });
  form.addEventListener('input', event => {
    if (event.target?.id === 'address') return;
    saveDraft(); validate();
  });
  form.addEventListener('change', () => { saveDraft(); validate(); });
  const reviewButton = input('review-booking');
  // Page 1 only saves a draft; it must never send a premature Webflow booking email.
  form.noValidate = true;
  if (reviewButton) reviewButton.type = 'button';
  function proceedToReview() { 
    const errors = validate();
    if (errors.length) {
      input('form-validator-wrapper')?.scrollIntoView({behavior:'smooth',block:'center'});
      return;
    }
    saveDraft();
    window.location.assign('/booking-review');
  }
  reviewButton?.addEventListener('click', proceedToReview);
  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    proceedToReview();
  }, true);

  restoreDraft();
  setType(readDraft()?.collectionType || 'Residential');
  initDates();
  initAddress();
  validate();
})();
