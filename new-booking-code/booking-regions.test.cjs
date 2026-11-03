'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');

const script=readFileSync(join(__dirname,'booking-v2.js'),'utf8');
const start=script.indexOf('function selectNearestServiceCentre(elements) {');
const end=script.indexOf('    function calculateAndDisplayDistance(origin) {',start);
assert.ok(start>=0 && end>start,'Booking v2 must expose the restored catchment selector');
const sandbox={
  collectionCatchments:[{name:'Auckland'},{name:'Wellington'},{name:'Christchurch'}],
  Number,Array
};
vm.runInNewContext(script.slice(start,end)+'\nthis.pick=selectNearestServiceCentre;',sandbox);
const pick=sandbox.pick;
const ok=m=>({status:'OK',distance:{value:m}});
const missing={status:'ZERO_RESULTS'};

test('Christchurch remains available when the other two depots are too far',()=>{
  const item=pick([ok(250000),ok(400000),ok(8000)]);
  assert.equal(item.centre.name,'Christchurch');
  assert.equal(item.distanceMetres,8000);
});
test('50-km cutoff is applied to exact metres, not rounded kilometres',()=>{
  assert.equal(pick([ok(50001),missing,missing]),null);
  assert.equal(pick([ok(50000),missing,missing]).centre.name,'Auckland');
});
test('chooses the nearest valid driving distance',()=>{
  const item=pick([ok(12000),ok(8100),ok(9000)]);
  assert.equal(item.centre.name,'Wellington');
});
test('ignores route failures and missing distances',()=>{
  assert.equal(pick([missing,{status:'OK'},{status:'OK',distance:{value:-1}}]),null);
});
test('original code contains all three known Echo depots',()=>{
  assert.match(script,/-36\.9249524/);
  assert.match(script,/-41\.2370845/);
  assert.match(script,/-43\.5320544/);
});
