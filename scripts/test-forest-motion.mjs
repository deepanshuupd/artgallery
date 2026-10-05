import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
const source = readFileSync(new URL('../src/components/products/forest-motion.ts',import.meta.url),'utf8');
const compiled = ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function mount({reduced=false,saveData=false,mobile=true,loaded=true}={}) {
  const eventTarget=()=>({listeners:new Map(),addEventListener(n,f){this.listeners.set(n,f)},removeEventListener(n){this.listeners.delete(n)},emit(n){this.listeners.get(n)?.()}});
  const preference=Object.assign(eventTarget(),{matches:reduced});
  const connection=Object.assign(eventTarget(),{saveData});
  const document=Object.assign(eventTarget(),{readyState:loaded?'complete':'loading',hidden:false});
  const window=Object.assign(eventTarget(),{matchMedia:q=>q.includes('prefers')?preference:{matches:mobile}});
  const scene=eventTarget(); const video=Object.assign(eventTarget(),{src:'',plays:0,pauses:0,getAttribute(){return this.src},play(){this.plays++;return Promise.resolve()},pause(){this.pauses++}});
  let observer,available,paused=false,timer;
  class Observer { constructor(callback){this.callback=callback;observer=this} observe(){} disconnect(){this.disconnected=true} emit(ratio){this.callback([{isIntersecting:ratio>0,intersectionRatio:ratio}])} }
  const exports={}; runInNewContext(compiled,{exports,window,document,navigator:{connection},IntersectionObserver:Observer,setTimeout:f=>{timer=f;return 1},clearTimeout:()=>{timer=undefined}});
  const cleanup=exports.attachForestMotion(scene,video,{isPaused:()=>paused,onAvailability:a=>available=a});
  return {video,scene,document,window,preference,connection,observer,cleanup,availability:()=>available,pause:()=>{paused=true;scene.emit('forest-motion-change')},ready:()=>{window.emit('load');timer?.()}};
}
test('sources are detached until both visible and critical page loading finishes',()=>{const s=mount({loaded:false});assert.equal(s.video.src,'');s.observer.emit(1);assert.equal(s.video.src,'');s.ready();assert.match(s.video.src,/mobile/);assert.equal(s.video.plays,1);s.cleanup()});
test('desktop requests only its desktop source',()=>{const s=mount({mobile:false});s.observer.emit(1);assert.match(s.video.src,/desktop/);assert.doesNotMatch(s.video.src,/mobile/);s.cleanup()});
for(const preference of [{reduced:true},{saveData:true}]) test(`static experience for ${Object.keys(preference)[0]}`,()=>{const s=mount(preference);s.observer.emit(1);assert.equal(s.video.src,'');assert.equal(s.video.plays,0);assert.equal(s.availability(),false);s.cleanup()});
test('off-screen, covered and hidden footage stops; returning resumes',()=>{const s=mount();s.observer.emit(1);const p=s.video.pauses;s.observer.emit(.1);assert.ok(s.video.pauses>p);const plays=s.video.plays;s.document.hidden=true;s.observer.emit(1);assert.equal(s.video.plays,plays);s.document.hidden=false;s.document.emit('visibilitychange');assert.equal(s.video.plays,plays+1);s.pause();s.observer.emit(1);assert.equal(s.video.plays,plays+1);s.cleanup()});
test('live preference changes stop motion and network failures keep the poster',()=>{const s=mount();s.observer.emit(1);s.preference.matches=true;s.preference.emit('change');assert.equal(s.availability(),false);s.preference.matches=false;s.preference.emit('change');s.video.emit('error');assert.equal(s.availability(),false);const plays=s.video.plays;s.observer.emit(1);assert.equal(s.video.plays,plays);s.cleanup()});
test('cleanup releases observers, load timer and event listeners',()=>{const s=mount({loaded:false});s.window.emit('load');s.cleanup();assert.equal(s.observer.disconnected,true);for(const target of [s.scene,s.document,s.window,s.preference,s.connection,s.video])assert.equal(target.listeners.size,0);s.observer.emit(1);assert.equal(s.video.src,'')});
