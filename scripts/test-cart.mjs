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
let catalog = [];
function load(file) {
  const path = resolve(root, file);
  if (modules.has(path)) return modules.get(path).exports;
  const source = readFileSync(path, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  });
  const loadedModule = { exports: {} };
  modules.set(path, loadedModule);
  const localRequire = name => {
    if (name === '@/lib/products') return { getProducts: async () => catalog };
    if (name === 'next/navigation') return { useRouter: () => ({refresh(){}}), notFound: () => { throw new Error('NOT_FOUND'); } };
    if (name === 'next/link') return function MockLink({ children, prefetch, ...props }) { return React.createElement('a', props, children); };
    if (name === 'next/image') return function MockImage({ fill, priority, ...props }) { return React.createElement('img', props); };
    if (name.endsWith('.module.css')) return new Proxy({}, { get: (_, key) => String(key) });
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? resolve(root, 'src', name.slice(2)) : resolve(dirname(path), name);
      const target = [base + '.ts', base + '.tsx'].find(existsSync);
      if (!target) throw new Error(`Unknown local import: ${name}`);
      return load(target);
    }
    return require(name);
  };
  new Function('require', 'module', 'exports', outputText)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const state=load('src/lib/cart-state.ts');
const model=load('src/lib/cart-quote.ts');
const whatsapp=load('src/lib/whatsapp.ts');
const product=(overrides={})=>({id:'frame',slug:'test-frame',name:'Aipan Frame',category:'Frames',price:1200,image:'/images/frame.webp',images:[],details:[],published:true,...overrides});
const request=(items,overrides={})=>model.parseCartRequest({items,...overrides});

test('adding merges quantities, preserves item requests and never mutates the previous cart',()=>{
  const previous=[{productId:'frame',quantity:2,request:'For Riya'}];
  const next=state.addCartLine(previous,'frame',3);
  assert.equal(next[0].quantity,5);assert.equal(next[0].request,'For Riya');assert.equal(previous[0].quantity,2);
  assert.equal(state.addCartLine(next,'ittar',1).length,2);
  assert.throws(()=>state.addCartLine(next,'frame',999));assert.throws(()=>state.addCartLine(next,'frame',0));
});
test('restoration rejects malformed lines, duplicate IDs and client price metadata',()=>{
  assert.deepEqual(state.restoreCart([{productId:'frame',quantity:2,price:1,path:'https://bad.example',request:'x'.repeat(400)},{productId:'frame',quantity:3},{productId:'bad/id',quantity:1},{productId:'negative',quantity:-1}]),[{productId:'frame',quantity:2,request:'x'.repeat(250)}]);
  assert.deepEqual(state.restoreCart(null),[]);
});
test('device storage, removal, sync, stable snapshots and blocked storage work',()=>{
  const memory=new Map();const storage={getItem:key=>memory.get(key),setItem:(key,value)=>memory.set(key,value)};
  const store=state.createCartStore(storage);let changes=0;const stop=store.subscribe(()=>changes++);
  store.add('frame',2);store.request('frame','Name: Riya');store.quantity('frame',3);
  assert.equal(store.getSnapshot(),store.getSnapshot());assert.equal(changes,3);
  const restored=state.createCartStore(storage);assert.equal(restored.getSnapshot()[0].quantity,3);
  store.sync(JSON.stringify([{productId:'ittar',quantity:2,request:''}]));assert.equal(store.getSnapshot()[0].productId,'ittar');
  store.remove('ittar');assert.deepEqual(store.getSnapshot(),[]);stop();
  assert.deepEqual(state.getServerCart(),[]);
  const blocked=state.createCartStore({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});blocked.add('frame',1);assert.equal(blocked.getSnapshot().length,1);
});
test('quotes use current catalogue prices and canonical URLs, with exact totals and no generated emojis',()=>{
  const input=request([{productId:'frame',quantity:2,request:'Names: Riya & Aman',price:1},{productId:'ittar',quantity:3,request:'Shanaya'}],{deliveryPincode:'262501',occasionDate:'2099-11-22',request:'Gift wrap, please.'});
  const quote=model.prepareCartQuote(input,[product(),product({id:'ittar',slug:'ittar',name:'Ittar',category:'Personalized Gifts',price:100})]);
  assert.equal(quote.subtotal,2700);
  for(const expected of ['1. Aipan Frame','2. Ittar','Quantity: 2 | Unit: ₹1,200 | Amount: ₹2,400','Product subtotal: ₹2,700','Names: Riya & Aman','Shanaya','262501','2099-11-22','https://www.kumaonrang.com/aipan-frames/test-frame'])assert.ok(quote.message.includes(expected),expected);
  assert.doesNotMatch(quote.message,/\p{Extended_Pictographic}/u);assert.equal(new URL(quote.url).searchParams.get('text'),quote.message);
  assert.equal(model.prepareCartQuote(request([{productId:'frame',quantity:3}]),[product({price:19.99})]).subtotal,59.97);
});
test('checkout blocks bad quantities, missing/unpublished products and unmet minimum orders',()=>{
  for(const raw of [[],[{productId:'frame',quantity:0}],[{productId:'frame',quantity:1},{productId:'frame',quantity:1}]])assert.throws(()=>request(raw),model.CartValidationError);
  const input=request([{productId:'frame',quantity:1}]);
  assert.throws(()=>model.prepareCartQuote(input,[]),/no longer available/);
  assert.throws(()=>model.prepareCartQuote(input,[product({published:false})]),/no longer available/);
  assert.throws(()=>model.prepareCartQuote(input,[product({details:['Minimum order quantity: 10pc']})]),/minimum order is 10/);
  assert.match(model.prepareCartQuote(input,[product({inStock:false})]).message,/please confirm restock/);
  assert.throws(()=>request(input.items,{deliveryPincode:'123'}),/6-digit/);
  assert.throws(()=>request(input.items,{occasionDate:'2099-02-30'}),/future occasion/);
});
test('single-product messages include one quantity, exact subtotal and product reference without discount chatter',()=>{
  const message=whatsapp.generateProductOrderMessage(product(),'Name: Riya',3,'262501','2099-11-22');
  for(const expected of ['Order enquiry','Quantity: 3','Product subtotal: ₹3,600','Name: Riya','262501','2099-11-22','/aipan-frames/test-frame'])assert.ok(message.includes(expected));
  assert.doesNotMatch(message,/\p{Extended_Pictographic}|was ₹|% off/u);
  assert.match(whatsapp.generateProductOrderMessage(product({inStock:false})),/Availability enquiry/);
});
test('quote API returns a no-store enquiry and rejects invalid requests; it performs no writes',async()=>{
  catalog=[product()];const {POST}=load('src/app/api/cart/quote/route.ts');
  const call=body=>POST(new Request('http://localhost/api/cart/quote',{method:'POST',body}));
  const valid=await call(JSON.stringify({items:[{productId:'frame',quantity:2,price:1}]}));
  assert.equal(valid.status,200);assert.equal(valid.headers.get('cache-control'),'no-store');assert.equal((await valid.json()).subtotal,2400);
  assert.equal((await call('{bad')).status,400);assert.equal((await call(JSON.stringify({items:[{productId:'unknown',quantity:1}]}))).status,400);
  assert.equal((await call('x'.repeat(40001))).status,413);
});
test('the cart page is private to the browser, and its server HTML has an accessible empty state',async()=>{
  const {CartProvider}=load('src/components/cart/cart-provider.tsx');
  const {default:CartRoute,metadata}=load('src/app/cart/page.tsx');
  assert.equal(metadata.robots.index,false);
  const html=renderToStaticMarkup(React.createElement(CartProvider,null,await CartRoute()));
  assert.match(html,/Loading your cart/);assert.match(html,/A few things to bring home/);
});
