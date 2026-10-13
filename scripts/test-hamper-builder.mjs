import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const modules = new Map();
function load(file) {
  const path = resolve(root,file);
  if (modules.has(path)) return modules.get(path).exports;
  const output = ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2022}}).outputText;
  const mod={exports:{}};modules.set(path,mod);
  const localRequire = name => {
    if (name==='next/link') return function Link({prefetch,children,...props}) { return React.createElement('a',props,children); };
    if (name.endsWith('.module.css')) return new Proxy({},{get:(_,key)=>String(key)});
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base=name.startsWith('@/') ? resolve(root,'src',name.slice(2)) : resolve(dirname(path),name);
      const target=[base+'.ts',base+'.tsx'].find(existsSync);
      if (!target) throw Error('Unknown module: '+name);
      return load(target);
    }
    return require(name);
  };
  new Function('require','module','exports',output)(localRequire,mod,mod.exports);
  return mod.exports;
}
const model=load('src/lib/hamper-builder.ts');
const {createHamperDraftStore,getServerHamperDraft}=load('src/lib/hamper-draft-store.ts');
const fresh=()=>({...model.emptyHamperDraft,pieces:{}});

test('quantities are bounded, removals work and removing a note clears its message',()=>{
  let draft=model.changeHamperPiece(fresh(),'pendant',1);
  draft=model.changeHamperPiece(draft,'pendant',1);
  assert.equal(draft.pieces.pendant,2);
  assert.equal(model.changeHamperPiece(draft,'pendant',100).pieces.pendant,20);
  assert.equal(model.changeHamperPiece(draft,'pendant',-100).pieces.pendant,undefined);
  assert.equal(model.changeHamperPiece({...draft,pieces:{note:1},giftNote:'For you'},'note',-1).giftNote,'');
  assert.deepEqual(fresh().pieces,{});
});
test('other-item-only requests are valid; an empty basket cannot generate a request',()=>{
  assert.equal(model.hasHamperSelection(fresh()),false);
  assert.throws(()=>model.createHamperWhatsAppLink(fresh()),/Choose a piece/);
  const draft={...fresh(),extra:'Could you include a photo keepsake?'};
  assert.equal(model.hasHamperSelection(draft),true);
  assert.match(model.generateHamperMessage(draft),/photo keepsake/);
  assert.match(model.generateHamperMessage(draft),/please confirm availability/);
});
test('the WhatsApp request preserves per-hamper counts, custom requests, names and Unicode',()=>{
  const original=process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;
  process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER='8266064457';
  try {
    const draft={...fresh(),pieces:{pendant:2,earrings:1,note:1},hampers:'3',extra:'A blue & gold accessory, if available',recipient:'Riya',occasion:'Birthday',giftNote:'प्यार के साथ 💛 & happy birthday!',pincode:'262501',date:'2027-11-21'};
    const url=new URL(model.createHamperWhatsAppLink(draft));
    assert.equal(url.hostname,'wa.me');assert.equal(url.pathname,'/918266064457');
    const message=url.searchParams.get('text');
    for (const text of ['Number of hampers: 3','Pieces in EACH hamper:','2 × Pendant','1 × Pair of earrings',draft.extra,draft.giftNote,'Delivery PIN code: 262501',draft.date,'final price']) assert.ok(message.includes(text),text);
    assert.doesNotMatch(message,/₹|\bsubtotal\b/i);
    assert.match(message,/https:\/\/www.kumaonrang.com\/build-your-hamper/);
  } finally { if(original===undefined)delete process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER;else process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_NUMBER=original; }
});
test('draft restoration discards unknown items, impossible quantities, invalid dates and oversized counts',()=>{
  const draft=model.restoreHamperDraft({pieces:{pendant:2,earrings:-1,clutcher:21,scrunchie:'2',unknown:5},hampers:'100',occasion:'Unknown',date:'2026-02-30',extra:'x'.repeat(500),pincode:'262501'});
  assert.deepEqual(draft.pieces,{pendant:2});assert.equal(draft.hampers,'1');assert.equal(draft.date,'');assert.equal(draft.occasion,'');assert.equal(draft.extra.length,400);
  assert.deepEqual(model.restoreHamperDraft(null),fresh());
});
test('incomplete delivery fields and impossible dates are explained before review',()=>{
  assert.deepEqual(model.hamperDetailsErrors(fresh(),'2026-10-14'),{});
  assert.deepEqual(Object.keys(model.hamperDetailsErrors({...fresh(),hampers:'0',pincode:'123',date:'2026-02-30'},'2026-10-14')),['hampers','pincode','date']);
  assert.ok(model.hamperDetailsErrors({...fresh(),date:'2026-10-13'},'2026-10-14').date);
});
test('storage restores selections, keeps snapshots stable and isolates separate builder instances',()=>{
  const memory=new Map([[model.hamperDraftKey,JSON.stringify({...fresh(),pieces:{scrunchie:2}})]]);
  const store=createHamperDraftStore({getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)});
  const isolated=createHamperDraftStore();let updates=0;
  const unsubscribe=store.subscribe(()=>updates++);
  assert.equal(store.getSnapshot(),store.getSnapshot());
  assert.equal(store.getSnapshot().pieces.scrunchie,2);
  store.update(draft=>model.changeHamperPiece(draft,'pendant',1));
  assert.equal(updates,1);assert.equal(JSON.parse(memory.get(model.hamperDraftKey)).pieces.pendant,1);
  assert.deepEqual(isolated.getSnapshot().pieces,{});assert.deepEqual(getServerHamperDraft().pieces,{});
  unsubscribe();store.update(draft=>model.changeHamperPiece(draft,'pendant',1));assert.equal(updates,1);
});
test('blocked or malformed storage never prevents using the builder',()=>{
  const blocked=createHamperDraftStore({getItem:()=>{throw Error('blocked');},setItem:()=>{throw Error('blocked');}});
  blocked.update(draft=>model.changeHamperPiece(draft,'pendant',1));assert.equal(blocked.getSnapshot().pieces.pendant,1);
  assert.deepEqual(createHamperDraftStore({getItem:()=>'{bad json',setItem:()=>{}}).getSnapshot().pieces,{});
});
test('server HTML offers the Happiness Box pieces without item prices, and the CTA links to the builder',()=>{
  const {HamperBuilder}=load('src/components/hamper/hamper-builder.tsx');
  const html=renderToStaticMarkup(React.createElement(HamperBuilder));
  for(const label of ['Pendant','Pair of earrings','Hair clutcher','Scrunchie','Soft toy keychain'])assert.ok(html.includes(label));
  assert.doesNotMatch(html,/₹|\bINR\b/);assert.ok(html.includes('Something else in mind?'));
  const {CustomHamperCta}=load('src/components/products/custom-hamper-cta.tsx');
  assert.match(renderToStaticMarkup(React.createElement(CustomHamperCta)),/href="\/build-your-hamper"/);
  assert.match(readFileSync(resolve(root,'app/build-your-hamper/page.tsx'),'utf8'),/default, metadata/);
});
