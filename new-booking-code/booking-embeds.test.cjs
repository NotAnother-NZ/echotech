'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
const here=__dirname;
for(const name of [
  'WEBFLOW-EMBED-01-BOOK.html',
  'WEBFLOW-EMBED-02-REVIEW.html',
  'WEBFLOW-EMBED-03-CONFIRMATION.html'
]){
 test(name+' compiles and fits one Webflow Embed',()=>{
   const html=readFileSync(join(here,name),'utf8');
   assert.ok(html.length<50000,'Webflow Embed must stay under 50,000 chars');
   const m=html.match(/<script>\s*([\s\S]*?)\s*<\/script>/);
   assert.ok(m,'Complete script wrapper required');
   assert.doesNotThrow(()=>new vm.Script(m[1],{filename:name}));
 });
}
test('booking code waits for jQuery instead of executing inline',()=>{
 const src=readFileSync(join(here,'WEBFLOW-EMBED-01-BOOK.html'),'utf8');
 assert.match(src,/window\.Webflow\.push\(initializeEchoBooking\)/);
 assert.match(src,/!window\.jQuery/);
 assert.match(src,/let activeShippingQuote = 0/);
 const initQuote=src.indexOf('let activeShippingQuote = 0');
 const firstQuote=src.indexOf('countersInitializing = false');
 assert.ok(initQuote>=0 && firstQuote>initQuote,
   'Shipping quote state must be declared before counter initialisation');
});
test('review and confirmation boot after their target DOM exists',()=>{
 const review=readFileSync(join(here,'WEBFLOW-EMBED-02-REVIEW.html'),'utf8');
 const confirmation=readFileSync(join(here,'WEBFLOW-EMBED-03-CONFIRMATION.html'),'utf8');
 assert.match(review,/window\.Webflow\.push\(initializeReview\)/);
 assert.match(confirmation,/window\.Webflow\.push\(initializeConfirmation\)/);
});
