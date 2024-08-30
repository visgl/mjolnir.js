"use strict";(self.webpackChunkproject_website=self.webpackChunkproject_website||[]).push([[389],{2154:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>o,toc:()=>a});var i=r(4848),t=r(8453);const s={},c="Pan",o={id:"api-reference/pan",title:"Pan",description:"Recognized when the pointer is down and moved in the allowed direction.",source:"@site/../docs/api-reference/pan.md",sourceDirName:"api-reference",slug:"/api-reference/pan",permalink:"/mjolnir.js/docs/api-reference/pan",draft:!1,unlisted:!1,editUrl:"https://github.com/visgl/mjolnir.js/tree/master/docs/../docs/api-reference/pan.md",tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"EventManager",permalink:"/mjolnir.js/docs/api-reference/event-manager"},next:{title:"Pinch",permalink:"/mjolnir.js/docs/api-reference/pinch"}},l={},a=[{value:"Constructor",id:"constructor",level:2},{value:"Events",id:"events",level:2},{value:"Source",id:"source",level:2}];function d(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"pan",children:"Pan"})}),"\n",(0,i.jsx)(n.p,{children:"Recognized when the pointer is down and moved in the allowed direction."}),"\n",(0,i.jsx)(n.h2,{id:"constructor",children:"Constructor"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-ts",children:"import {EventManager, Pan, InputDirection} from 'mjolnir.js';\n\nconst eventManager = new EventManager({\n  // ...\n  recognizers: [new Pan({direction: InputDirection.Horizontal})]\n});\n"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"options"})," (object, optional) - Options","\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"event"})," (string) - Name of the event. Default ",(0,i.jsx)(n.code,{children:"'pan'"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"pointers"})," (number) - Required pointers. Default ",(0,i.jsx)(n.code,{children:"1"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"threshold"})," (number) - Minimal pan distance required before recognizing. Default ",(0,i.jsx)(n.code,{children:"10"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"direction"})," (InputDirection) - Direction of the panning. Default ",(0,i.jsx)(n.code,{children:"InputDirection.All"}),"."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"events",children:"Events"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"pan, together with all of below"}),"\n",(0,i.jsx)(n.li,{children:"panstart"}),"\n",(0,i.jsx)(n.li,{children:"panmove"}),"\n",(0,i.jsx)(n.li,{children:"panend"}),"\n",(0,i.jsx)(n.li,{children:"pancancel"}),"\n",(0,i.jsx)(n.li,{children:"panleft"}),"\n",(0,i.jsx)(n.li,{children:"panright"}),"\n",(0,i.jsx)(n.li,{children:"panup"}),"\n",(0,i.jsx)(n.li,{children:"pandown"}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"source",children:"Source"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/pan.ts",children:"https://github.com/visgl/mjolnir.js/blob/master/src/hammerjs/recognizers/pan.ts"})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>c,x:()=>o});var i=r(6540);const t={},s=i.createContext(t);function c(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);