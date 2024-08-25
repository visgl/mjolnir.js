"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[392],{5680:(e,n,r)=>{r.d(n,{xA:()=>s,yg:()=>y});var t=r(6540);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function l(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var c=t.createContext({}),p=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},s=function(e){var n=p(e.components);return t.createElement(c.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},g=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(r),g=i,y=u["".concat(c,".").concat(g)]||u[g]||m[g]||o;return r?t.createElement(y,a(a({ref:n},s),{},{components:r})):t.createElement(y,a({ref:n},s))}));function y(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,a=new Array(o);a[0]=g;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l[u]="string"==typeof e?e:i,a[1]=l;for(var p=2;p<o;p++)a[p]=r[p];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}g.displayName="MDXCreateElement"},6834:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var t=r(8168),i=(r(6540),r(5680));const o={},a="Pinch",l={unversionedId:"api-reference/pinch",id:"api-reference/pinch",title:"Pinch",description:"Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).",source:"@site/../docs/api-reference/pinch.md",sourceDirName:"api-reference",slug:"/api-reference/pinch",permalink:"/mjolnir.js/docs/api-reference/pinch",draft:!1,editUrl:"https://github.com/visgl/mjolnir.js/tree/master/website/../docs/api-reference/pinch.md",tags:[],version:"current",frontMatter:{},sidebar:"docsSidebar",previous:{title:"Pan",permalink:"/mjolnir.js/docs/api-reference/pan"},next:{title:"Press",permalink:"/mjolnir.js/docs/api-reference/press"}},c={},p=[{value:"Constructor",id:"constructor",level:2},{value:"Events",id:"events",level:2},{value:"Source",id:"source",level:2}],s={toc:p},u="wrapper";function m(e){let{components:n,...r}=e;return(0,i.yg)(u,(0,t.A)({},s,r,{components:n,mdxType:"MDXLayout"}),(0,i.yg)("h1",{id:"pinch"},"Pinch"),(0,i.yg)("p",null,"Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out)."),(0,i.yg)("h2",{id:"constructor"},"Constructor"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-ts"},"import {EventManager, Pinch} from 'mjolnir.js';\n\nconst eventManager = new EventManager({\n  // ...\n  recognizers: [\n    new Pinch({pointers: 2})\n  ]\n});\n")),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"options")," (object, optional) - Options",(0,i.yg)("ul",{parentName:"li"},(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"event")," (string) -\tName of the event. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"'pinch'"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"pointers")," (number) - Required pointers, with a minimal of 2. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"2"),"."),(0,i.yg)("li",{parentName:"ul"},(0,i.yg)("inlineCode",{parentName:"li"},"threshold")," (number) - Minimal scale before recognizing. Default ",(0,i.yg)("inlineCode",{parentName:"li"},"0"),".")))),(0,i.yg)("h2",{id:"events"},"Events"),(0,i.yg)("ul",null,(0,i.yg)("li",{parentName:"ul"},"pinch, together with all of below"),(0,i.yg)("li",{parentName:"ul"},"pinchstart"),(0,i.yg)("li",{parentName:"ul"},"pinchmove"),(0,i.yg)("li",{parentName:"ul"},"pinchend"),(0,i.yg)("li",{parentName:"ul"},"pinchcancel"),(0,i.yg)("li",{parentName:"ul"},"pinchin"),(0,i.yg)("li",{parentName:"ul"},"pinchout")),(0,i.yg)("h2",{id:"source"},"Source"),(0,i.yg)("p",null,(0,i.yg)("a",{parentName:"p",href:"https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/pinch.ts"},"https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/pinch.ts")))}m.isMDXComponent=!0}}]);