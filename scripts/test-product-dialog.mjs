import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
const source=readFileSync(new URL('../src/components/products/use-product-dialog.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function mount() {
  const document={body:{style:{overflow:'auto'}},activeElement:null};
  const control=()=>({isConnected:true,focus(){document.activeElement=this},getClientRects(){return [1]}});
  const previous=control(),title=control(),first=control(),middle=control(),last=control();document.activeElement=previous;
  const listeners=new Map();const dialog={showModal(){this.open=true},close(){this.open=false},querySelector(){return title},querySelectorAll(){return [first,middle,last]},addEventListener:(n,f)=>listeners.set(n,f),removeEventListener:n=>listeners.delete(n)};
  let cleanup;const exports={};runInNewContext(compiled,{exports,document,require:()=>({useRef:()=>({current:dialog}),useEffect:f=>{cleanup=f()}})});
  exports.useProductDialog(true);
  const tab=(active,shiftKey=false)=>{document.activeElement=active;const event={key:'Tab',shiftKey,preventDefault(){this.prevented=true}};listeners.get('keydown')(event);return event};
  return {document,previous,title,first,middle,last,dialog,listeners,cleanup,tab};
}
test('modal focuses a heading instead of summoning the phone keyboard',()=>{const s=mount();assert.equal(s.document.activeElement,s.title);assert.equal(s.document.body.style.overflow,'hidden');assert.equal(s.dialog.open,true);s.cleanup()});
test('forward and reverse Tab remain within active controls',()=>{const s=mount();assert.ok(s.tab(s.first,true).prevented);assert.equal(s.document.activeElement,s.last);assert.ok(s.tab(s.last).prevented);assert.equal(s.document.activeElement,s.first);assert.ok(s.tab(s.title,true).prevented);assert.equal(s.document.activeElement,s.last);assert.equal(s.tab(s.middle).prevented,undefined);s.cleanup()});
test('dismissal restores the trigger, scrolling and removes the listener',()=>{const s=mount();s.cleanup();assert.equal(s.dialog.open,false);assert.equal(s.document.activeElement,s.previous);assert.equal(s.document.body.style.overflow,'auto');assert.equal(s.listeners.size,0)});
