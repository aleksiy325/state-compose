var stateCompose=function(P){"use strict";var I=function(t,r){return I=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,n){e.__proto__=n}||function(e,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])},I(t,r)};function j(t,r){if(typeof r!="function"&&r!==null)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");I(t,r);function e(){this.constructor=t}t.prototype=r===null?Object.create(r):(e.prototype=r.prototype,new e)}function R(t){var r=typeof Symbol=="function"&&Symbol.iterator,e=r&&t[r],n=0;if(e)return e.call(t);if(t&&typeof t.length=="number")return{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}};throw new TypeError(r?"Object is not iterable.":"Symbol.iterator is not defined.")}function q(t,r){var e=typeof Symbol=="function"&&t[Symbol.iterator];if(!e)return t;var n=e.call(t),o,s=[],i;try{for(;(r===void 0||r-- >0)&&!(o=n.next()).done;)s.push(o.value)}catch(c){i={error:c}}finally{try{o&&!o.done&&(e=n.return)&&e.call(n)}finally{if(i)throw i.error}}return s}function L(t,r,e){if(e||arguments.length===2)for(var n=0,o=r.length,s;n<o;n++)(s||!(n in r))&&(s||(s=Array.prototype.slice.call(r,0,n)),s[n]=r[n]);return t.concat(s||Array.prototype.slice.call(r))}typeof SuppressedError=="function"&&SuppressedError;function w(t){return typeof t=="function"}function J(t){var r=function(n){Error.call(n),n.stack=new Error().stack},e=t(r);return e.prototype=Object.create(Error.prototype),e.prototype.constructor=e,e}var V=J(function(t){return function(e){t(this),this.message=e?e.length+` errors occurred during unsubscription:
`+e.map(function(n,o){return o+1+") "+n.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=e}});function z(t,r){if(t){var e=t.indexOf(r);0<=e&&t.splice(e,1)}}var k=function(){function t(r){this.initialTeardown=r,this.closed=!1,this._parentage=null,this._finalizers=null}return t.prototype.unsubscribe=function(){var r,e,n,o,s;if(!this.closed){this.closed=!0;var i=this._parentage;if(i)if(this._parentage=null,Array.isArray(i))try{for(var c=R(i),l=c.next();!l.done;l=c.next()){var d=l.value;d.remove(this)}}catch(v){r={error:v}}finally{try{l&&!l.done&&(e=c.return)&&e.call(c)}finally{if(r)throw r.error}}else i.remove(this);var p=this.initialTeardown;if(w(p))try{p()}catch(v){s=v instanceof V?v.errors:[v]}var a=this._finalizers;if(a){this._finalizers=null;try{for(var h=R(a),m=h.next();!m.done;m=h.next()){var S=m.value;try{Z(S)}catch(v){s=s??[],v instanceof V?s=L(L([],q(s)),q(v.errors)):s.push(v)}}}catch(v){n={error:v}}finally{try{m&&!m.done&&(o=h.return)&&o.call(h)}finally{if(n)throw n.error}}}if(s)throw new V(s)}},t.prototype.add=function(r){var e;if(r&&r!==this)if(this.closed)Z(r);else{if(r instanceof t){if(r.closed||r._hasParent(this))return;r._addParent(this)}(this._finalizers=(e=this._finalizers)!==null&&e!==void 0?e:[]).push(r)}},t.prototype._hasParent=function(r){var e=this._parentage;return e===r||Array.isArray(e)&&e.includes(r)},t.prototype._addParent=function(r){var e=this._parentage;this._parentage=Array.isArray(e)?(e.push(r),e):e?[e,r]:r},t.prototype._removeParent=function(r){var e=this._parentage;e===r?this._parentage=null:Array.isArray(e)&&z(e,r)},t.prototype.remove=function(r){var e=this._finalizers;e&&z(e,r),r instanceof t&&r._removeParent(this)},t.EMPTY=function(){var r=new t;return r.closed=!0,r}(),t}(),Q=k.EMPTY;function X(t){return t instanceof k||t&&"closed"in t&&w(t.remove)&&w(t.add)&&w(t.unsubscribe)}function Z(t){w(t)?t():t.unsubscribe()}var ee={onUnhandledError:null,onStoppedNotification:null,Promise:void 0,useDeprecatedSynchronousErrorHandling:!1,useDeprecatedNextContext:!1},te={setTimeout:function(t,r){for(var e=[],n=2;n<arguments.length;n++)e[n-2]=arguments[n];return setTimeout.apply(void 0,L([t,r],q(e)))},clearTimeout:function(t){var r=te.delegate;return((r==null?void 0:r.clearTimeout)||clearTimeout)(t)},delegate:void 0};function fe(t){te.setTimeout(function(){throw t})}function re(){}function K(t){t()}var B=function(t){j(r,t);function r(e){var n=t.call(this)||this;return n.isStopped=!1,e?(n.destination=e,X(e)&&e.add(n)):n.destination=be,n}return r.create=function(e,n,o){return new F(e,n,o)},r.prototype.next=function(e){this.isStopped||this._next(e)},r.prototype.error=function(e){this.isStopped||(this.isStopped=!0,this._error(e))},r.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},r.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this),this.destination=null)},r.prototype._next=function(e){this.destination.next(e)},r.prototype._error=function(e){try{this.destination.error(e)}finally{this.unsubscribe()}},r.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},r}(k),pe=Function.prototype.bind;function Y(t,r){return pe.call(t,r)}var de=function(){function t(r){this.partialObserver=r}return t.prototype.next=function(r){var e=this.partialObserver;if(e.next)try{e.next(r)}catch(n){D(n)}},t.prototype.error=function(r){var e=this.partialObserver;if(e.error)try{e.error(r)}catch(n){D(n)}else D(r)},t.prototype.complete=function(){var r=this.partialObserver;if(r.complete)try{r.complete()}catch(e){D(e)}},t}(),F=function(t){j(r,t);function r(e,n,o){var s=t.call(this)||this,i;if(w(e)||!e)i={next:e??void 0,error:n??void 0,complete:o??void 0};else{var c;s&&ee.useDeprecatedNextContext?(c=Object.create(e),c.unsubscribe=function(){return s.unsubscribe()},i={next:e.next&&Y(e.next,c),error:e.error&&Y(e.error,c),complete:e.complete&&Y(e.complete,c)}):i=e}return s.destination=new de(i),s}return r}(B);function D(t){fe(t)}function he(t){throw t}var be={closed:!0,next:re,error:he,complete:re},ye=function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"}();function ve(t){return t}function ge(t){return t.length===0?ve:t.length===1?t[0]:function(e){return t.reduce(function(n,o){return o(n)},e)}}var ne=function(){function t(r){r&&(this._subscribe=r)}return t.prototype.lift=function(r){var e=new t;return e.source=this,e.operator=r,e},t.prototype.subscribe=function(r,e,n){var o=this,s=_e(r)?r:new F(r,e,n);return K(function(){var i=o,c=i.operator,l=i.source;s.add(c?c.call(s,l):l?o._subscribe(s):o._trySubscribe(s))}),s},t.prototype._trySubscribe=function(r){try{return this._subscribe(r)}catch(e){r.error(e)}},t.prototype.forEach=function(r,e){var n=this;return e=oe(e),new e(function(o,s){var i=new F({next:function(c){try{r(c)}catch(l){s(l),i.unsubscribe()}},error:s,complete:o});n.subscribe(i)})},t.prototype._subscribe=function(r){var e;return(e=this.source)===null||e===void 0?void 0:e.subscribe(r)},t.prototype[ye]=function(){return this},t.prototype.pipe=function(){for(var r=[],e=0;e<arguments.length;e++)r[e]=arguments[e];return ge(r)(this)},t.prototype.toPromise=function(r){var e=this;return r=oe(r),new r(function(n,o){var s;e.subscribe(function(i){return s=i},function(i){return o(i)},function(){return n(s)})})},t.create=function(r){return new t(r)},t}();function oe(t){var r;return(r=t??ee.Promise)!==null&&r!==void 0?r:Promise}function me(t){return t&&w(t.next)&&w(t.error)&&w(t.complete)}function _e(t){return t&&t instanceof B||me(t)&&X(t)}function Se(t){return w(t==null?void 0:t.lift)}function we(t){return function(r){if(Se(r))return r.lift(function(e){try{return t(e,this)}catch(n){this.error(n)}});throw new TypeError("Unable to lift unknown Observable type")}}function Ee(t,r,e,n,o){return new Ae(t,r,e,n,o)}var Ae=function(t){j(r,t);function r(e,n,o,s,i,c){var l=t.call(this,e)||this;return l.onFinalize=i,l.shouldUnsubscribe=c,l._next=n?function(d){try{n(d)}catch(p){e.error(p)}}:t.prototype._next,l._error=s?function(d){try{s(d)}catch(p){e.error(p)}finally{this.unsubscribe()}}:t.prototype._error,l._complete=o?function(){try{o()}catch(d){e.error(d)}finally{this.unsubscribe()}}:t.prototype._complete,l}return r.prototype.unsubscribe=function(){var e;if(!this.shouldUnsubscribe||this.shouldUnsubscribe()){var n=this.closed;t.prototype.unsubscribe.call(this),!n&&((e=this.onFinalize)===null||e===void 0||e.call(this))}},r}(B),Oe=J(function(t){return function(){t(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),se=function(t){j(r,t);function r(){var e=t.call(this)||this;return e.closed=!1,e.currentObservers=null,e.observers=[],e.isStopped=!1,e.hasError=!1,e.thrownError=null,e}return r.prototype.lift=function(e){var n=new ie(this,this);return n.operator=e,n},r.prototype._throwIfClosed=function(){if(this.closed)throw new Oe},r.prototype.next=function(e){var n=this;K(function(){var o,s;if(n._throwIfClosed(),!n.isStopped){n.currentObservers||(n.currentObservers=Array.from(n.observers));try{for(var i=R(n.currentObservers),c=i.next();!c.done;c=i.next()){var l=c.value;l.next(e)}}catch(d){o={error:d}}finally{try{c&&!c.done&&(s=i.return)&&s.call(i)}finally{if(o)throw o.error}}}})},r.prototype.error=function(e){var n=this;K(function(){if(n._throwIfClosed(),!n.isStopped){n.hasError=n.isStopped=!0,n.thrownError=e;for(var o=n.observers;o.length;)o.shift().error(e)}})},r.prototype.complete=function(){var e=this;K(function(){if(e._throwIfClosed(),!e.isStopped){e.isStopped=!0;for(var n=e.observers;n.length;)n.shift().complete()}})},r.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(r.prototype,"observed",{get:function(){var e;return((e=this.observers)===null||e===void 0?void 0:e.length)>0},enumerable:!1,configurable:!0}),r.prototype._trySubscribe=function(e){return this._throwIfClosed(),t.prototype._trySubscribe.call(this,e)},r.prototype._subscribe=function(e){return this._throwIfClosed(),this._checkFinalizedStatuses(e),this._innerSubscribe(e)},r.prototype._innerSubscribe=function(e){var n=this,o=this,s=o.hasError,i=o.isStopped,c=o.observers;return s||i?Q:(this.currentObservers=null,c.push(e),new k(function(){n.currentObservers=null,z(c,e)}))},r.prototype._checkFinalizedStatuses=function(e){var n=this,o=n.hasError,s=n.thrownError,i=n.isStopped;o?e.error(s):i&&e.complete()},r.prototype.asObservable=function(){var e=new ne;return e.source=this,e},r.create=function(e,n){return new ie(e,n)},r}(ne),ie=function(t){j(r,t);function r(e,n){var o=t.call(this)||this;return o.destination=e,o.source=n,o}return r.prototype.next=function(e){var n,o;(o=(n=this.destination)===null||n===void 0?void 0:n.next)===null||o===void 0||o.call(n,e)},r.prototype.error=function(e){var n,o;(o=(n=this.destination)===null||n===void 0?void 0:n.error)===null||o===void 0||o.call(n,e)},r.prototype.complete=function(){var e,n;(n=(e=this.destination)===null||e===void 0?void 0:e.complete)===null||n===void 0||n.call(e)},r.prototype._subscribe=function(e){var n,o;return(o=(n=this.source)===null||n===void 0?void 0:n.subscribe(e))!==null&&o!==void 0?o:Q},r}(se),N=function(t){j(r,t);function r(e){var n=t.call(this)||this;return n._value=e,n}return Object.defineProperty(r.prototype,"value",{get:function(){return this.getValue()},enumerable:!1,configurable:!0}),r.prototype._subscribe=function(e){var n=t.prototype._subscribe.call(this,e);return!n.closed&&e.next(this._value),n},r.prototype.getValue=function(){var e=this,n=e.hasError,o=e.thrownError,s=e._value;if(n)throw o;return this._throwIfClosed(),s},r.prototype.next=function(e){t.prototype.next.call(this,this._value=e)},r}(se);function je(t,r){return we(function(e,n){var o=0;e.subscribe(Ee(n,function(s){return t.call(r,s,o++)&&n.next(s)}))})}function $(t){return je(function(r,e){return t<=e})}const H=(t,r)=>t===r;function xe(t,r){if(t.length!==r.length)return!1;for(let e=0;e<t.length;e++)if(t[e]!==r[e])return!1;return!0}function Pe(t){return typeof t=="object"&&t!==null&&"value"in t&&"isEqual"in t&&typeof t.isEqual=="function"&&"type"in t&&t.type==="shallow"}function Te(t){return t===null||typeof t=="string"||typeof t=="number"||typeof t=="boolean"||typeof t=="bigint"||typeof t=="symbol"||typeof t>"u"}function ce(t){return Array.isArray(t)}function Ue(t){return typeof t=="object"&&t!==null&&!ce(t)}function ke(t){return t instanceof Map}function ue(t,r=H){return{value:t,isEqual:r,type:"shallow"}}function x(t,r=H){if(r==H&&!Te(t))throw Error("Node requires a primitive value or a custom isEqual to be supplied. Use makeShallow to provide a custom equals func for deep objects. Got: "+t);let e=t,n=!1,o=t;const s=new N(t),i=s.asObservable(),c=y=>{s.next(y)},l=()=>{let y=!1;return n&&!r(o,e)&&(o=e,n=!1,y=!0,c(o)),[o,y]},d=y=>(e=y,n=!0,l),p=y=>{let[_,U]=d(y)();return U},a=(y,_=!1)=>(l(),_?i.pipe($(1)).subscribe(y):i.subscribe(y));return{get:l,set:p,setDefer:d,subscribe:a,edge:(y,_)=>T(l,a,y,_),action:(y,_)=>C(y,p,_),dependentAction:(y,_,U)=>O(y,p,_.get,U),selfAction:(y,_)=>O(y,p,l,_)}}const Ke=x(void 0);function ae(t){let r=!1;const e=t,n=()=>{const a={};let h=!1;for(const m in e){let[S,v]=e[m].get();a[m]=S,h=h||v}return[a,h]},o=new N(n()[0]),s=o.asObservable(),i=a=>{o.next(a)},c=()=>{r=!0;const[a,h]=n();return h&&i(a),r=!1,[a,h]};for(const a in e)e[a].subscribe(h=>{if(!r){let[m,S]=c();S||i(m)}});const l=(a,h=!1)=>(c(),h?s.pipe($(1)).subscribe(a):s.subscribe(a));return{decompose:()=>e,get:c,subscribe:l,edge:(a,h)=>T(c,l,a,h)}}function G(t){const r=ae(t),e=t,n=p=>{for(const a in p)e[a]===void 0&&(e[a]=E(p[a])),e[a].setDefer(p[a]);for(const a in e)(p===void 0||p[a]===void 0)&&delete e[a];return r.get},o=p=>{let[a,h]=n(p)();return h},s=()=>e,i=(p,a)=>T(r.get,r.subscribe,p,a),c=(p,a)=>C(p,o,a),l=(p,a,h)=>O(p,o,a.get,h),d=(p,a)=>O(p,o,r.get,a);return{decompose:s,get:r.get,subscribe:r.subscribe,setDefer:n,set:o,edge:i,action:c,dependentAction:l,selfAction:d}}function De(t){const r={};for(const e in t)r[e]=E(t[e]);return G(r)}function M(t,r){const e=new Map;let n=!1;const o=()=>{const u=new Map;let f=!1;for(const[b,g]of e){let[A,W]=g.get();A!==void 0&&u.set(b,A),f=f||W}return[u,f]},s=new N(o()[0]),i=s.asObservable(),c=u=>{s.next(u)};let l=[()=>{if(!n){let[u,f]=d();f||c(u)}}];const d=()=>{n=!0;const[u,f]=o();return f&&c(u),n=!1,[u,f]},p=u=>{var f;return e.has(u)||a(u,t(u))(),(f=e.get(u))==null?void 0:f.get()},a=(u,f)=>{var b;if(!e.has(u)){console.log(t);const g=E(t(u));l.forEach(A=>{g.subscribe(W=>A(u,W),!0)}),e.set(u,g)}return(b=e.get(u))==null?void 0:b.setDefer(f)},h=u=>{var f;for(const[b,g]of e)u.has(b)||(f=e.get(b))==null||f.setDefer(t(b)),e.delete(b);for(const[b,g]of u.entries())a(b,g);return d},m=(u,f)=>{let[b,g]=a(u,f)();return g},S=u=>{let[f,b]=h(u)();return b},v=(u,f=!1)=>(d(),f&&i.pipe($(1)).subscribe(u),i.subscribe(u)),y=u=>{const f=e.get(u);if(f!==void 0)return f;{const b=E(t(u));return e.set(u,b),l.forEach(g=>{b.subscribe(A=>g(u,A),!0)}),b}},_=(u,f,b=!1)=>{var g;(g=y(u))==null||g.subscribe(f,b)},U=(u,f=!1)=>{l.push(u);for(const[b,g]of e)g.subscribe(A=>u(b,A),f)};return r==null||r.forEach((u,f)=>{m(f,u)}),{get:d,setKeyDefer:a,setKey:m,getKey:p,setDefer:h,set:S,getKeyNode:y,subscribeKey:_,subscribeKeys:U,subscribe:v,decompose:()=>e,edge:(u,f)=>T(d,v,u,f),action:(u,f)=>C(u,S,f),dependentAction:(u,f,b)=>O(u,S,f.get,b),selfAction:(u,f)=>O(u,S,d,f),defaultFactory:t}}function E(t){if(Pe(t))return x(t.value,t.isEqual);if(ke(t))return M(()=>{},t);if(ce(t))return x(t,(r,e)=>xe(r,e));if(Ue(t)){let r={};const e=t;for(const n in e)r[n]=E(e[n]);return G(r)}return x(t)}function T(t,r,e,n){const[o,s]=t(),i=e(o),c=n==null?i:ue(i,n),l=E(c);return r(d=>l.set(e(d)),!0),l}function Me(t,r,e){return T(t.get,t.subscribe,r,e)}function Ce(t,r){return(...e)=>r(t.get()[0],...e)}function Ie(t,r,e){const n=E(t);return r.subscribe(o=>{let s=!0;do{const[i,c]=n.get(),l=e({self:i,read:o});s=n.set(l)}while(s)}),n}function Re(t,r,e){const o=M(s=>{const[i,c]=r.get();return e(s,t.defaultFactory(s),i)[1]});return t.subscribeKeys((s,i)=>{const[c,l]=r.get(),[d,p]=e(s,i,c);o.setKey(d,p)}),r.subscribe(s=>{const i=t.get()[0];for(const[c,l]of i){const[d,p]=e(c,l,s);o.setKeyDefer(d,p)}o.get()}),o}function qe(t,r,e){const n=M(e);return t.subscribe(o=>{const s=r(o);for(const[i,c]of s)n.setKeyDefer(i,c);n.get()}),n}function Le(t,r){const e=x(void 0);return t.subscribeKey(r,n=>e.set(n)),e}function C(t,r,e){return(...n)=>{let o=e(...n);return r(o)}}function Ve(t,r,e){return C(t,r.set,e)}function O(t,r,e,n){return(...o)=>{const[s,i]=e();let c=n(s,...o);return r(c)}}function le(t,r,e,n){return O(t,r.set,e.get,n)}function ze(t,r,e){return le(t,r,r,e)}const Be=Object.freeze(Object.defineProperty({__proto__:null,action:Ve,compose:G,composeRead:ae,compositeNode:De,dependentAction:le,edge:Me,makeDeepNode:E,makeSelector:Ce,makeShallow:ue,mapEdge:qe,mapKeyEdge:Le,mapNode:M,mapToMapEdge:Re,node:x,selfAction:ze,selfEdge:Ie,undefnode:Ke},Symbol.toStringTag,{value:"Module"})),Ye=Object.freeze(Object.defineProperty({__proto__:null,classMap:(t,r)=>{for(const e in r)r[e].subscribe(n=>{n?t.classList.add(e):t.classList.remove(e)})},show:(t,r)=>{r.subscribe(e=>{console.log(t,t.classList),e!==void 0&&(t.style.display=e?"":"none",t.classList.contains("hidden")&&e&&t.classList.remove("hidden"))})},style:(t,r)=>{for(const e in r)r[e].subscribe(n=>{n!==void 0&&(n?t.style.setProperty(e,n):t.style.removeProperty(e))})},text:(t,r)=>{r.subscribe(e=>{e!==void 0&&(t.textContent=e)})}},Symbol.toStringTag,{value:"Module"})),Fe=Object.freeze(Object.defineProperty({__proto__:null,arrayRange:(t,r,e=1)=>Array.from({length:(r-t)/e+1},(n,o)=>t+o*e)},Symbol.toStringTag,{value:"Module"}));return P.graphRender=Ye,P.graphState=Be,P.graphUtil=Fe,Object.defineProperty(P,Symbol.toStringTag,{value:"Module"}),P}({});
