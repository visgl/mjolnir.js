"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[509],{5680:(e,t,n)=>{n.d(t,{xA:()=>h,yg:()=>m});var i=n(6540);function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,i,s=function(e,t){if(null==e)return{};var n,i,s={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(s[n]=e[n]);return s}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var l=i.createContext({}),c=function(e){var t=i.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},h=function(e){var t=c(e.components);return i.createElement(l.Provider,{value:t},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var n=e.components,s=e.mdxType,r=e.originalType,l=e.parentName,h=a(e,["components","mdxType","originalType","parentName"]),u=c(n),d=s,m=u["".concat(l,".").concat(d)]||u[d]||p[d]||r;return n?i.createElement(m,o(o({ref:t},h),{},{components:n})):i.createElement(m,o({ref:t},h))}));function m(e,t){var n=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var r=n.length,o=new Array(r);o[0]=d;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a[u]="string"==typeof e?e:s,o[1]=a;for(var c=2;c<r;c++)o[c]=n[c];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8452:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>u,default:()=>f,frontMatter:()=>h,metadata:()=>p,toc:()=>m});var i=n(8168),s=n(6540),r=n(5680),o=n(8616);class a{width=0;height=0;scale=1;angle=0;centerX=0;centerY=0;clone(){const e=new a;return e.width=this.width,e.height=this.height,e.scale=this.scale,e.angle=this.angle,e.centerX=this.centerX,e.centerY=this.centerY,e}project(e){let{x:t,y:n}=e;t-=this.width/2,n-=this.height/2;const i=l({x:t,y:n},this.angle);return i.x=i.x*this.scale+this.centerX+this.width/2,i.y=i.y*this.scale+this.centerY+this.height/2,i}unproject(e){let{x:t,y:n}=e;t=(t-this.centerX-this.width/2)/this.scale,n=(n-this.centerY-this.height/2)/this.scale;const i=l({x:t,y:n},-this.angle);return i.x+=this.width/2,i.y+=this.height/2,i}toCSSTransform(){return`translate(${this.centerX}px, ${this.centerY}px) scale(${this.scale}) rotate(${this.angle}deg)`}}function l(e,t){const n=t*Math.PI/180;return{x:e.x*Math.cos(n)-e.y*Math.sin(n),y:e.x*Math.sin(n)+e.y*Math.cos(n)}}function c(){const e=s.useRef(null);return s.useEffect((()=>{e.current&&function(e){const t=document.createElement("div");t.className="image-viewer";const n=document.createElement("img");n.src="https://upload.wikimedia.org/wikipedia/commons/7/75/Planisph%C3%A6ri_c%C5%93leste.jpg",n.style.maxWidth="400px",t.appendChild(n);const i=new a;let s,r;function l(){n.style.transform=i.toCSSTransform()}n.onload=()=>{i.width=n.width,i.height=n.height,i.centerX=t.clientWidth/2-n.width/2,i.centerY=t.clientHeight/2-n.height/2,l()};const c=new o.EU(t,{recognizers:[new o.h1,new o.uq],events:{pinchstart:function(e){s=i.clone(),r=i.unproject(e.offsetCenter)},pinchmove:function(e){i.scale=s.scale*e.scale,i.angle=s.angle+e.rotation;const t=i.project(r);i.centerX+=e.offsetCenter.x-t.x,i.centerY+=e.offsetCenter.y-t.y,l()},panstart:function(e){s=i.clone(),s.centerX-=e.deltaX,s.centerY-=e.deltaY},panmove:function(e){i.centerX=s.centerX+e.deltaX,i.centerY=s.centerY+e.deltaY,l()},wheel:function(e){e.preventDefault(),r=i.unproject(e.offsetCenter),i.scale*=e.delta>0?1.1:1/1.1;const t=i.project(r);i.centerX+=e.offsetCenter.x-t.x,i.centerY+=e.offsetCenter.y-t.y,l()}}});e.appendChild(t)}(e.current)}),[]),s.createElement("div",{style:{height:"100%"},ref:e})}const h={},u="Image Viewer",p={unversionedId:"image-viewer",id:"image-viewer",title:"Image Viewer",description:"",source:"@site/src/examples/image-viewer.mdx",sourceDirName:".",slug:"/image-viewer",permalink:"/mjolnir.js/examples/image-viewer",draft:!1,tags:[],version:"current",frontMatter:{},sidebar:"examplesSidebar",previous:{title:"Event Manager",permalink:"/mjolnir.js/examples/event-manager"}},d={},m=[],v={toc:m},g="wrapper";function f(e){let{components:t,...n}=e;return(0,r.yg)(g,(0,i.A)({},v,n,{components:t,mdxType:"MDXLayout"}),(0,r.yg)("h1",{id:"image-viewer"},"Image Viewer"),(0,r.yg)(c,{mdxType:"App"}))}f.isMDXComponent=!0},8616:(e,t,n)=>{n.d(t,{EU:()=>ce,uq:()=>R,h1:()=>S,ac:()=>V,k2:()=>q,Hp:()=>N,Cx:()=>B});const i=25;let s=function(e){return e[e.Start=1]="Start",e[e.Move=2]="Move",e[e.End=4]="End",e[e.Cancel=8]="Cancel",e}({}),r=function(e){return e[e.None=0]="None",e[e.Left=1]="Left",e[e.Right=2]="Right",e[e.Up=4]="Up",e[e.Down=8]="Down",e[e.Horizontal=3]="Horizontal",e[e.Vertical=12]="Vertical",e[e.All=15]="All",e}({}),o=function(e){return e[e.Possible=1]="Possible",e[e.Began=2]="Began",e[e.Changed=4]="Changed",e[e.Ended=8]="Ended",e[e.Recognized=8]="Recognized",e[e.Cancelled=16]="Cancelled",e[e.Failed=32]="Failed",e}({});const a="auto",l="manipulation",c="none",h="pan-x",u="pan-y";class p{actions="";constructor(e,t){this.manager=e,this.set(t)}set(e){"compute"===e&&(e=this.compute()),this.manager.element&&(this.manager.element.style.touchAction=e,this.actions=e)}update(){this.set(this.manager.options.touchAction)}compute(){let e=[];for(const t of this.manager.recognizers)t.options.enable&&(e=e.concat(t.getTouchAction()));return function(e){if(e.includes(c))return c;const t=e.includes(h),n=e.includes(u);return t&&n?c:t||n?t?h:u:e.includes(l)?l:a}(e.join(" "))}}function d(e){return e.trim().split(/\s+/g)}function m(e,t,n){if(e)for(const i of d(t))e.addEventListener(i,n,!1)}function v(e,t,n){if(e)for(const i of d(t))e.removeEventListener(i,n,!1)}function g(e){return(e.ownerDocument||e).defaultView}function f(e){const t=e.length;if(1===t)return{x:Math.round(e[0].clientX),y:Math.round(e[0].clientY)};let n=0,i=0,s=0;for(;s<t;)n+=e[s].clientX,i+=e[s].clientY,s++;return{x:Math.round(n/t),y:Math.round(i/t)}}function y(e){const t=[];let n=0;for(;n<e.pointers.length;)t[n]={clientX:Math.round(e.pointers[n].clientX),clientY:Math.round(e.pointers[n].clientY)},n++;return{timeStamp:Date.now(),pointers:t,center:f(t),deltaX:e.deltaX,deltaY:e.deltaY}}function E(e,t){const n=t.x-e.x,i=t.y-e.y;return Math.sqrt(n*n+i*i)}function b(e,t){const n=t.clientX-e.clientX,i=t.clientY-e.clientY;return Math.sqrt(n*n+i*i)}function w(e,t){const n=t.clientX-e.clientX,i=t.clientY-e.clientY;return 180*Math.atan2(i,n)/Math.PI}function x(e,t){return e===t?r.None:Math.abs(e)>=Math.abs(t)?e<0?r.Left:r.Right:t<0?r.Up:r.Down}function T(e,t,n){return{x:t/e||0,y:n/e||0}}function C(e,t){const{session:n}=e,{pointers:r}=t,{length:o}=r;n.firstInput||(n.firstInput=y(t)),o>1&&!n.firstMultiple?n.firstMultiple=y(t):1===o&&(n.firstMultiple=!1);const{firstInput:a,firstMultiple:l}=n,c=l?l.center:a.center,h=t.center=f(r);t.timeStamp=Date.now(),t.deltaTime=t.timeStamp-a.timeStamp,t.angle=function(e,t){const n=t.x-e.x,i=t.y-e.y;return 180*Math.atan2(i,n)/Math.PI}(c,h),t.distance=E(c,h);const{deltaX:u,deltaY:p}=function(e,t){const n=t.center;let i=e.offsetDelta,r=e.prevDelta;const o=e.prevInput;return t.eventType!==s.Start&&o?.eventType!==s.End||(r=e.prevDelta={x:o?.deltaX||0,y:o?.deltaY||0},i=e.offsetDelta={x:n.x,y:n.y}),{deltaX:r.x+(n.x-i.x),deltaY:r.y+(n.y-i.y)}}(n,t);t.deltaX=u,t.deltaY=p,t.offsetDirection=x(t.deltaX,t.deltaY);const d=T(t.deltaTime,t.deltaX,t.deltaY);var m,v;t.overallVelocityX=d.x,t.overallVelocityY=d.y,t.overallVelocity=Math.abs(d.x)>Math.abs(d.y)?d.x:d.y,t.scale=l?(m=l.pointers,b((v=r)[0],v[1])/b(m[0],m[1])):1,t.rotation=l?function(e,t){return w(t[1],t[0])-w(e[1],e[0])}(l.pointers,r):0,t.maxPointers=n.prevInput?t.pointers.length>n.prevInput.maxPointers?t.pointers.length:n.prevInput.maxPointers:t.pointers.length;let g=e.element;return function(e,t){let n=e;for(;n;){if(n===t)return!0;n=e.parentNode}return!1}(t.srcEvent.target,g)&&(g=t.srcEvent.target),t.target=g,function(e,t){const n=e.lastInterval||t,r=t.timeStamp-n.timeStamp;let o,a,l,c;if(t.eventType!==s.Cancel&&(r>i||void 0===n.velocity)){const i=t.deltaX-n.deltaX,s=t.deltaY-n.deltaY,h=T(r,i,s);a=h.x,l=h.y,o=Math.abs(h.x)>Math.abs(h.y)?h.x:h.y,c=x(i,s),e.lastInterval=t}else o=n.velocity,a=n.velocityX,l=n.velocityY,c=n.direction;t.velocity=o,t.velocityX=a,t.velocityY=l,t.direction=c}(n,t),t}class z{evEl="";evWin="";evTarget="";constructor(e){this.manager=e,this.element=e.element,this.target=e.options.inputTarget||e.element}domHandler=e=>{this.manager.options.enable&&this.handler(e)};callback(e,t){!function(e,t,n){const i=n.pointers.length,r=n.changedPointers.length,o=t&s.Start&&i-r==0,a=t&(s.End|s.Cancel)&&i-r==0;n.isFirst=Boolean(o),n.isFinal=Boolean(a),o&&(e.session={}),n.eventType=t;const l=C(e,n);e.emit("hammer.input",l),e.recognize(l),e.session.prevInput=l}(this.manager,e,t)}init(){m(this.element,this.evEl,this.domHandler),m(this.target,this.evTarget,this.domHandler),m(g(this.element),this.evWin,this.domHandler)}destroy(){v(this.element,this.evEl,this.domHandler),v(this.target,this.evTarget,this.domHandler),v(g(this.element),this.evWin,this.domHandler)}}const M={pointerdown:s.Start,pointermove:s.Move,pointerup:s.End,pointercancel:s.Cancel,pointerout:s.Cancel};class _ extends z{constructor(e){super(e),this.evEl="pointerdown",this.evWin="pointermove pointerup pointercancel",this.store=this.manager.session.pointerEvents=[],this.init()}handler(e){const{store:t}=this;let n=!1;const i=M[e.type],r=e.pointerType,o="touch"===r;let a=t.findIndex((t=>t.pointerId===e.pointerId));i&s.Start&&(e.buttons||o)?a<0&&(t.push(e),a=t.length-1):i&(s.End|s.Cancel)&&(n=!0),a<0||(t[a]=e,this.callback(i,{pointers:t,changedPointers:[e],eventType:i,pointerType:r,srcEvent:e}),n&&t.splice(a,1))}}const O=["","webkit","Moz","MS","ms","o"];function A(e,t){const n=t[0].toUpperCase()+t.slice(1);for(const i of O){const s=i?i+n:t;if(s in e)return s}}const X={touchAction:"compute",enable:!0,inputTarget:null,inputClass:null,cssProps:{userSelect:"none",userDrag:"none",touchCallout:"none",tapHighlightColor:"rgba(0,0,0,0)"}};class P{constructor(e,t){this.options={...X,...t,cssProps:{...X.cssProps,...t.cssProps},inputTarget:t.inputTarget||e},this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=e,this.input=new _(this),this.touchAction=new p(this,this.options.touchAction),this.toggleCssProps(!0)}set(e){return Object.assign(this.options,e),e.touchAction&&this.touchAction.update(),e.inputTarget&&(this.input.destroy(),this.input.target=e.inputTarget,this.input.init()),this}stop(e){this.session.stopped=e?2:1}recognize(e){const{session:t}=this;if(t.stopped)return;let n;this.session.prevented&&e.srcEvent.preventDefault();const{recognizers:i}=this;let{curRecognizer:s}=t;(!s||s&&s.state&o.Recognized)&&(s=t.curRecognizer=null);let r=0;for(;r<i.length;)n=i[r],2===t.stopped||s&&n!==s&&!n.canRecognizeWith(s)?n.reset():n.recognize(e),!s&&n.state&(o.Began|o.Changed|o.Ended)&&(s=t.curRecognizer=n),r++}get(e){if("string"==typeof e){const{recognizers:t}=this;for(let n=0;n<t.length;n++)if(t[n].options.event===e)return t[n];return null}return e}add(e){if(Array.isArray(e)){for(const t of e)this.add(t);return this}const t=this.get(e.options.event);return t&&this.remove(t),this.recognizers.push(e),e.manager=this,this.touchAction.update(),e}remove(e){if(Array.isArray(e)){for(const t of e)this.remove(t);return this}const t=this.get(e);if(t){const{recognizers:e}=this,n=e.indexOf(t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this}on(e,t){if(!e||!t)return;const{handlers:n}=this;for(const i of d(e))n[i]=n[i]||[],n[i].push(t)}off(e,t){if(!e)return;const{handlers:n}=this;for(const i of d(e))t?n[i]&&n[i].splice(n[i].indexOf(t),1):delete n[i]}emit(e,t){const n=this.handlers[e]&&this.handlers[e].slice();if(!n||!n.length)return;const i=t;i.type=e,i.preventDefault=function(){t.srcEvent.preventDefault()};let s=0;for(;s<n.length;)n[s](i),s++}destroy(){this.toggleCssProps(!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}toggleCssProps(e){const{element:t}=this;if(t){for(const[n,i]of Object.entries(this.options.cssProps)){const s=A(t.style,n);e?(this.oldCssProps[s]=t.style[s],t.style[s]=i):t.style[s]=this.oldCssProps[s]||""}e||(this.oldCssProps={})}}}let I=1;function Y(e){return e&o.Cancelled?"cancel":e&o.Ended?"end":e&o.Changed?"move":e&o.Began?"start":""}class k{constructor(e){this.options=e,this.id=I++,this.state=o.Possible,this.simultaneous={},this.requireFail=[]}set(e){return Object.assign(this.options,e),this.manager.touchAction.update(),this}recognizeWith(e){if(Array.isArray(e)){for(const t of e)this.recognizeWith(t);return this}const{simultaneous:t}=this,n=this.manager.get(e);if(!n)throw new Error(`Cannot find recognizer ${e}`);return t[n.id]||(t[n.id]=n,n.recognizeWith(this)),this}dropRecognizeWith(e){if(Array.isArray(e)){for(const t of e)this.dropRecognizeWith(t);return this}const t=this.manager.get(e);return t&&delete this.simultaneous[t.id],this}requireFailure(e){if(Array.isArray(e)){for(const t of e)this.requireFailure(t);return this}const{requireFail:t}=this,n=this.manager.get(e);if(!n)throw new Error(`Cannot find recognizer ${e}`);return-1===t.indexOf(n)&&(t.push(n),n.requireFailure(this)),this}dropRequireFailure(e){if(Array.isArray(e)){for(const t of e)this.dropRequireFailure(t);return this}const t=this.manager.get(e);if(t){const e=this.requireFail.indexOf(t);e>-1&&this.requireFail.splice(e,1)}return this}hasRequireFailures(){return Boolean(this.requireFail.find((e=>e.options.enable)))}canRecognizeWith(e){return Boolean(this.simultaneous[e.id])}emit(e){if(!e)return;const{state:t}=this;t<o.Ended&&this.manager.emit(this.options.event+Y(t),e),this.manager.emit(this.options.event,e),e.additionalEvent&&this.manager.emit(e.additionalEvent,e),t>=o.Ended&&this.manager.emit(this.options.event+Y(t),e)}tryEmit(e){this.canEmit()?this.emit(e):this.state=o.Failed}canEmit(){let e=0;for(;e<this.requireFail.length;){if(!(this.requireFail[e].state&(o.Failed|o.Possible)))return!1;e++}return!0}recognize(e){const t={...e};if(!this.options.enable)return this.reset(),void(this.state=o.Failed);this.state&(o.Recognized|o.Cancelled|o.Failed)&&(this.state=o.Possible),this.state=this.process(t),this.state&(o.Began|o.Changed|o.Ended|o.Cancelled)&&this.tryEmit(t)}getEventNames(){return[this.options.event]}reset(){}}class D extends k{attrTest(e){const t=this.options.pointers;return 0===t||e.pointers.length===t}process(e){const{state:t}=this,{eventType:n}=e,i=t&(o.Began|o.Changed),r=this.attrTest(e);return i&&(n&s.Cancel||!r)?t|o.Cancelled:i||r?n&s.End?t|o.Ended:t&o.Began?t|o.Changed:o.Began:o.Failed}}class B extends k{pTime=null;pCenter=null;_timer=null;_input=null;count=0;constructor(e){void 0===e&&(e={}),super({enable:!0,event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10,...e})}getTouchAction(){return[l]}process(e){const{options:t}=this,n=e.pointers.length===t.pointers,i=e.distance<t.threshold,r=e.deltaTime<t.time;if(this.reset(),e.eventType&s.Start&&0===this.count)return this.failTimeout();if(i&&r&&n){if(e.eventType!==s.End)return this.failTimeout();const n=!this.pTime||e.timeStamp-this.pTime<t.interval,i=!this.pCenter||E(this.pCenter,e.center)<t.posThreshold;this.pTime=e.timeStamp,this.pCenter=e.center,i&&n?this.count+=1:this.count=1,this._input=e;if(0===this.count%t.taps)return this.hasRequireFailures()?(this._timer=setTimeout((()=>{this.state=o.Recognized,this.tryEmit(this._input)}),t.interval),o.Began):o.Recognized}return o.Failed}failTimeout(){return this._timer=setTimeout((()=>{this.state=o.Failed}),this.options.interval),o.Failed}reset(){clearTimeout(this._timer)}emit(e){this.state===o.Recognized&&(e.tapCount=this.count,this.manager.emit(this.options.event,e))}}const j=["","start","move","end","cancel","up","down","left","right"];class R extends D{constructor(e){void 0===e&&(e={}),super({enable:!0,pointers:1,event:"pan",threshold:10,direction:r.All,...e}),this.pX=null,this.pY=null}getTouchAction(){const{options:{direction:e}}=this,t=[];return e&r.Horizontal&&t.push(u),e&r.Vertical&&t.push(h),t}getEventNames(){return j.map((e=>this.options.event+e))}directionTest(e){const{options:t}=this;let n=!0,{distance:i}=e,{direction:s}=e;const o=e.deltaX,a=e.deltaY;return s&t.direction||(t.direction&r.Horizontal?(s=0===o?r.None:o<0?r.Left:r.Right,n=o!==this.pX,i=Math.abs(e.deltaX)):(s=0===a?r.None:a<0?r.Up:r.Down,n=a!==this.pY,i=Math.abs(e.deltaY))),e.direction=s,n&&i>t.threshold&&Boolean(s&t.direction)}attrTest(e){return super.attrTest(e)&&(Boolean(this.state&o.Began)||!(this.state&o.Began)&&this.directionTest(e))}emit(e){this.pX=e.deltaX,this.pY=e.deltaY;const t=r[e.direction].toLowerCase();t&&(e.additionalEvent=this.options.event+t),super.emit(e)}}const F=["","up","down","left","right"];class N extends D{constructor(e){void 0===e&&(e={}),super({enable:!0,event:"swipe",threshold:10,velocity:.3,direction:r.All,pointers:1,...e})}getTouchAction(){return R.prototype.getTouchAction.call(this)}getEventNames(){return F.map((e=>this.options.event+e))}attrTest(e){const{direction:t}=this.options;let n=0;return t&r.All?n=e.overallVelocity:t&r.Horizontal?n=e.overallVelocityX:t&r.Vertical&&(n=e.overallVelocityY),super.attrTest(e)&&Boolean(t&e.offsetDirection)&&e.distance>this.options.threshold&&e.maxPointers===this.options.pointers&&Math.abs(n)>this.options.velocity&&Boolean(e.eventType&s.End)}emit(e){const t=r[e.offsetDirection].toLowerCase();t&&this.manager.emit(this.options.event+t,e),this.manager.emit(this.options.event,e)}}const L=["","start","move","end","cancel","in","out"];class S extends D{constructor(e){void 0===e&&(e={}),super({enable:!0,event:"pinch",threshold:0,pointers:2,...e})}getTouchAction(){return[c]}getEventNames(){return L.map((e=>this.options.event+e))}attrTest(e){return super.attrTest(e)&&(Math.abs(e.scale-1)>this.options.threshold||Boolean(this.state&o.Began))}emit(e){if(1!==e.scale){const t=e.scale<1?"in":"out";e.additionalEvent=this.options.event+t}super.emit(e)}}const H=["","start","move","end","cancel"];class q extends D{constructor(e){void 0===e&&(e={}),super({enable:!0,event:"rotate",threshold:0,pointers:2,...e})}getTouchAction(){return[c]}getEventNames(){return H.map((e=>this.options.event+e))}attrTest(e){return super.attrTest(e)&&(Math.abs(e.rotation)>this.options.threshold||Boolean(this.state&o.Began))}}const W=["","up"];class V extends k{_timer=null;_input=null;constructor(e){void 0===e&&(e={}),super({enable:!0,event:"press",pointers:1,time:251,threshold:9,...e})}getTouchAction(){return[a]}getEventNames(){return W.map((e=>this.options.event+e))}process(e){const{options:t}=this,n=e.pointers.length===t.pointers,i=e.distance<t.threshold,r=e.deltaTime>t.time;if(this._input=e,!i||!n||e.eventType&(s.End|s.Cancel)&&!r)this.reset();else if(e.eventType&s.Start)this.reset(),this._timer=setTimeout((()=>{this.state=o.Recognized,this.tryEmit()}),t.time);else if(e.eventType&s.End)return o.Recognized;return o.Failed}reset(){clearTimeout(this._timer)}emit(e){this.state===o.Recognized&&(e&&e.eventType&s.End?this.manager.emit(`${this.options.event}up`,e):(this._input.timeStamp=Date.now(),this.manager.emit(this.options.event,this._input)))}}class U{constructor(e,t,n){this.element=e,this.callback=t,this.options=n}}const $="undefined"!=typeof navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"",K=("undefined"!=typeof window?window:n.g,void 0!==n.g?n.g:window,"undefined"!=typeof document&&document,-1!==$.indexOf("firefox")),G=4.000244140625;class J extends U{constructor(e,t,n){super(e,t,{enable:!0,...n}),e.addEventListener("wheel",this.handleEvent,{passive:!1})}destroy(){this.element.removeEventListener("wheel",this.handleEvent)}enableEventType(e,t){"wheel"===e&&(this.options.enable=t)}handleEvent=e=>{if(!this.options.enable)return;let t=e.deltaY;globalThis.WheelEvent&&(K&&e.deltaMode===globalThis.WheelEvent.DOM_DELTA_PIXEL&&(t/=globalThis.devicePixelRatio),e.deltaMode===globalThis.WheelEvent.DOM_DELTA_LINE&&(t*=40)),0!==t&&t%G==0&&(t=Math.floor(t/G)),e.shiftKey&&t&&(t*=.25),this.callback({type:"wheel",center:{x:e.clientX,y:e.clientY},delta:-t,srcEvent:e,pointerType:"mouse",target:e.target})}}const Q=["mousedown","mousemove","mouseup","mouseover","mouseout","mouseleave"];class Z extends U{constructor(e,t,n){super(e,t,{enable:!0,...n}),this.pressed=!1;const{enable:i}=this.options;this.enableMoveEvent=i,this.enableLeaveEvent=i,this.enableEnterEvent=i,this.enableOutEvent=i,this.enableOverEvent=i,Q.forEach((t=>e.addEventListener(t,this.handleEvent)))}destroy(){Q.forEach((e=>this.element.removeEventListener(e,this.handleEvent)))}enableEventType(e,t){switch(e){case"pointermove":this.enableMoveEvent=t;break;case"pointerover":this.enableOverEvent=t;break;case"pointerout":this.enableOutEvent=t;break;case"pointerenter":this.enableEnterEvent=t;break;case"pointerleave":this.enableLeaveEvent=t}}handleEvent=e=>{this.handleOverEvent(e),this.handleOutEvent(e),this.handleEnterEvent(e),this.handleLeaveEvent(e),this.handleMoveEvent(e)};handleOverEvent(e){this.enableOverEvent&&"mouseover"===e.type&&this._emit("pointerover",e)}handleOutEvent(e){this.enableOutEvent&&"mouseout"===e.type&&this._emit("pointerout",e)}handleEnterEvent(e){this.enableEnterEvent&&"mouseenter"===e.type&&this._emit("pointerenter",e)}handleLeaveEvent(e){this.enableLeaveEvent&&"mouseleave"===e.type&&this._emit("pointerleave",e)}handleMoveEvent(e){if(this.enableMoveEvent)switch(e.type){case"mousedown":e.button>=0&&(this.pressed=!0);break;case"mousemove":0===e.buttons&&(this.pressed=!1),this.pressed||this._emit("pointermove",e);break;case"mouseup":this.pressed=!1}}_emit(e,t){this.callback({type:e,center:{x:t.clientX,y:t.clientY},srcEvent:t,pointerType:"mouse",target:t.target})}}const ee=["keydown","keyup"];class te extends U{constructor(e,t,n){super(e,t,{enable:!0,tabIndex:0,...n}),this.enableDownEvent=this.options.enable,this.enableUpEvent=this.options.enable,e.tabIndex=this.options.tabIndex,e.style.outline="none",ee.forEach((t=>e.addEventListener(t,this.handleEvent)))}destroy(){ee.forEach((e=>this.element.removeEventListener(e,this.handleEvent)))}enableEventType(e,t){"keydown"===e&&(this.enableDownEvent=t),"keyup"===e&&(this.enableUpEvent=t)}handleEvent=e=>{const t=e.target||e.srcElement;"INPUT"===t.tagName&&"text"===t.type||"TEXTAREA"===t.tagName||(this.enableDownEvent&&"keydown"===e.type&&this.callback({type:"keydown",srcEvent:e,key:e.key,target:e.target}),this.enableUpEvent&&"keyup"===e.type&&this.callback({type:"keyup",srcEvent:e,key:e.key,target:e.target}))}}class ne extends U{constructor(e,t,n){super(e,t,n),e.addEventListener("contextmenu",this.handleEvent)}destroy(){this.element.removeEventListener("contextmenu",this.handleEvent)}enableEventType(e,t){"contextmenu"===e&&(this.options.enable=t)}handleEvent=e=>{this.options.enable&&this.callback({type:"contextmenu",center:{x:e.clientX,y:e.clientY},srcEvent:e,pointerType:"mouse",target:e.target})}}const ie={pointerdown:1,pointermove:2,pointerup:4,mousedown:1,mousemove:2,mouseup:4};function se(e){const t=ie[e.srcEvent.type];if(!t)return null;const{buttons:n,button:i}=e.srcEvent;let s=!1,r=!1,o=!1;return 2===t?(s=Boolean(1&n),r=Boolean(4&n),o=Boolean(2&n)):(s=0===i,r=1===i,o=2===i),{leftButton:s,middleButton:r,rightButton:o}}function re(e,t){const n=e.center;if(!n)return null;const i=t.getBoundingClientRect(),s=i.width/t.offsetWidth||1,r=i.height/t.offsetHeight||1;return{center:n,offsetCenter:{x:(n.x-i.left-t.clientLeft)/s,y:(n.y-i.top-t.clientTop)/r}}}const oe={srcElement:"root",priority:0};class ae{constructor(e,t){this.eventManager=e,this.recognizerName=t,this.handlers=[],this.handlersByElement=new Map,this._active=!1}isEmpty(){return!this._active}add(e,t,n,i,s){void 0===i&&(i=!1),void 0===s&&(s=!1);const{handlers:r,handlersByElement:o}=this,a={...oe,...n};let l=o.get(a.srcElement);l||(l=[],o.set(a.srcElement,l));const c={type:e,handler:t,srcElement:a.srcElement,priority:a.priority};i&&(c.once=!0),s&&(c.passive=!0),r.push(c),this._active=this._active||!c.passive;let h=l.length-1;for(;h>=0&&!(l[h].priority>=c.priority);)h--;l.splice(h+1,0,c)}remove(e,t){const{handlers:n,handlersByElement:i}=this;for(let s=n.length-1;s>=0;s--){const r=n[s];if(r.type===e&&r.handler===t){n.splice(s,1);const e=i.get(r.srcElement);e.splice(e.indexOf(r),1),0===e.length&&i.delete(r.srcElement)}}this._active=n.some((e=>!e.passive))}handleEvent=e=>{if(this.isEmpty())return;const t=this._normalizeEvent(e);let n=e.srcEvent.target;for(;n&&n!==t.rootElement;){if(this._emit(t,n),t.handled)return;n=n.parentNode}this._emit(t,"root")};_emit(e,t){const n=this.handlersByElement.get(t);if(n){let t=!1;const i=()=>{e.handled=!0},s=()=>{e.handled=!0,t=!0},r=[];for(let o=0;o<n.length;o++){const{type:a,handler:l,once:c}=n[o];if(l({...e,type:a,stopPropagation:i,stopImmediatePropagation:s}),c&&r.push(n[o]),t)break}for(let e=0;e<r.length;e++){const{type:t,handler:n}=r[e];this.remove(t,n)}}}_normalizeEvent(e){const t=this.eventManager.getElement();return{...e,...se(e),...re(e,t),preventDefault:()=>{e.srcEvent.preventDefault()},stopImmediatePropagation:null,stopPropagation:null,handled:!1,rootElement:t}}}function le(e){if("recognizer"in e)return e;let t;const n=Array.isArray(e)?[...e]:[e];if("function"==typeof n[0]){t=new(n.shift())(n.shift()||{})}else t=n.shift();return{recognizer:t,recognizeWith:n[0],requireFailure:n[1]}}class ce{constructor(e,t){if(void 0===e&&(e=null),void 0===t&&(t={}),this.options={recognizers:[],events:{},touchAction:"compute",tabIndex:0,cssProps:{},...t},this.events=new Map,this.element=e,e){this.manager=new P(e,this.options);for(const e of this.options.recognizers){const{recognizer:t,recognizeWith:n,requireFailure:i}=le(e);this.manager.add(t),n&&t.recognizeWith(n),i&&t.requireFailure(i)}this.manager.on("hammer.input",this._onBasicInput),this.wheelInput=new J(e,this._onOtherEvent,{enable:!1}),this.moveInput=new Z(e,this._onOtherEvent,{enable:!1}),this.keyInput=new te(e,this._onOtherEvent,{enable:!1,tabIndex:t.tabIndex}),this.contextmenuInput=new ne(e,this._onOtherEvent,{enable:!1}),this.on(this.options.events)}}getElement(){return this.element}destroy(){this.element&&(this.wheelInput.destroy(),this.moveInput.destroy(),this.keyInput.destroy(),this.contextmenuInput.destroy(),this.manager.destroy())}on(e,t,n){this._addEventHandler(e,t,n,!1)}once(e,t,n){this._addEventHandler(e,t,n,!0)}watch(e,t,n){this._addEventHandler(e,t,n,!1,!0)}off(e,t){this._removeEventHandler(e,t)}_toggleRecognizer(e,t){const{manager:n}=this;if(!n)return;const i=n.get(e);i&&(i.set({enable:t}),n.touchAction.update()),this.wheelInput?.enableEventType(e,t),this.moveInput?.enableEventType(e,t),this.keyInput?.enableEventType(e,t),this.contextmenuInput?.enableEventType(e,t)}_addEventHandler(e,t,n,i,s){if("string"!=typeof e){n=t;for(const[t,r]of Object.entries(e))this._addEventHandler(t,r,n,i,s);return}const{manager:r,events:o}=this;if(!r)return;let a=o.get(e);if(!a){const t=this._getRecognizerName(e)||e;a=new ae(this,t),o.set(e,a),r&&r.on(e,a.handleEvent)}a.add(e,t,n,i,s),a.isEmpty()||this._toggleRecognizer(a.recognizerName,!0)}_removeEventHandler(e,t){if("string"!=typeof e){for(const[t,n]of Object.entries(e))this._removeEventHandler(t,n);return}const{events:n}=this,i=n.get(e);if(i&&(i.remove(e,t),i.isEmpty())){const{recognizerName:e}=i;let t=!1;for(const i of n.values())if(i.recognizerName===e&&!i.isEmpty()){t=!0;break}t||this._toggleRecognizer(e,!1)}}_getRecognizerName(e){return this.manager.recognizers.find((t=>t.getEventNames().includes(e)))?.options.event}_onBasicInput=e=>{this.manager.emit(e.srcEvent.type,e)};_onOtherEvent=e=>{this.manager.emit(e.type,e)}}}}]);