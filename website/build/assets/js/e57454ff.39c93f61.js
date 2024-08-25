"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[183],{5680:(e,t,n)=>{n.d(t,{xA:()=>c,yg:()=>d});var r=n(6540);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},g=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=s(n),g=i,d=u["".concat(p,".").concat(g)]||u[g]||m[g]||a;return n?r.createElement(d,o(o({ref:t},c),{},{components:n})):r.createElement(d,o({ref:t},c))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=g;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[u]="string"==typeof e?e:i,o[1]=l;for(var s=2;s<a;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}g.displayName="MDXCreateElement"},7139:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>m,frontMatter:()=>a,metadata:()=>l,toc:()=>s});var r=n(8168),i=(n(6540),n(5680));const a={},o="Tap",l={unversionedId:"api-reference/tap",id:"api-reference/tap",title:"Tap",description:"Recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur between the given interval and position. The eventData from the emitted event contains the property tapCount, which contains the amount of multi-taps being recognized.",source:"@site/../docs/api-reference/tap.md",sourceDirName:"api-reference",slug:"/api-reference/tap",permalink:"/mjolnir.js/docs/api-reference/tap",draft:!1,editUrl:"https://github.com/visgl/mjolnir.js/tree/master/website/../docs/api-reference/tap.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Swipe",permalink:"/mjolnir.js/docs/api-reference/swipe"},next:{title:"Types",permalink:"/mjolnir.js/docs/api-reference/types"}},p={},s=[{value:"Constructor",id:"constructor",level:2},{value:"Events",id:"events",level:2},{value:"Source",id:"source",level:2}],c={toc:s},u="wrapper";function m(e){let{components:t,...n}=e;return(0,i.yg)(u,(0,r.A)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"tap"},"Tap"),(0,i.yg)("p",null,"Recognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur between the given interval and position. The eventData from the emitted event contains the property ",(0,i.yg)("inlineCode",{parentName:"p"},"tapCount"),", which contains the amount of multi-taps being recognized."),(0,i.yg)("p",null,"If an Tap recognizer has a failing requirement, it waits the interval time before emitting the event. This is because if you want to only trigger a doubletap, the recognizer needs to see if any other taps are coming in. Use ",(0,i.yg)("a",{parentName:"p",href:"/mjolnir.js/docs/api-reference/event-manager#recognize-gesture"},"requireFailure")," to distinguish single tap events from double tap."),(0,i.yg)("h2",{id:"constructor"},"Constructor"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {EventManager, Tap} from 'mjolnir.js';\n\nconst eventManager = new EventManager({\n  // ...\n  recognizers: [\n    new Tap({event: 'doubletap', pointers: 2}),\n    [new Tap({event: 'singletap'}), null, 'doubletap']\n  ]\n});\n")),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"options")," (object, optional) - Options",(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"event")," (string) -\tName of the event. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"'tap'"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"pointers")," (number) - Required pointers. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"1"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"taps")," (number) - Amount of taps required. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"1"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"interval")," (number) - Maximum time in ms between multiple taps. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"300"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"time")," (number) - Maximum press time in ms. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"250"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"threshold")," (number) - While doing a tap some small movement is allowed. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"2"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"posThreshold")," (number) - The maximum position difference between multiple taps. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"10"),".")))),(0,i.yg)("h2",{id:"events"},"Events"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"tap")),(0,i.yg)("h2",{id:"source"},"Source"),(0,i.yg)("p",null,(0,i.yg)("a",{parentName:"p",href:"https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/tap.ts"},"https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/tap.ts")))}m.isMDXComponent=!0}}]);