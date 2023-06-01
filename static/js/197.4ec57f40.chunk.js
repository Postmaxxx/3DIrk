"use strict";(globalThis.webpackChunk_3dprint=globalThis.webpackChunk_3dprint||[]).push([[197],{8677:()=>{},2653:(e,s,i)=>{i.d(s,{Z:()=>n});var r=i(390),t=i(2024),a=i(2559);const n=e=>{let{src:s,alt:i,id:n}=e;const[o,l]=(0,r.useState)(!1),d=(0,r.useRef)(null);return(0,a.jsxs)(a.Fragment,{children:[o||(0,a.jsx)(t.Z,{}),(0,a.jsx)("img",{ref:d,src:s,alt:i,onLoad:()=>{l(!0)},style:{display:o?"block":"none"},id:n})]})}},2197:(e,s,i)=>{i.r(s),i.d(s,{default:()=>g});var r=i(5902),t=i(5040),a=i(390),n=(i(8677),i(2024)),o=i(7767),l=i(2722),d=i(5545),c=i(5400),h=i(2653),f=i(2559);const p=e=>{let{fiber:s,lang:i,colors:r}=e;return(0,f.jsxs)("div",{className:"fiber-preview__item card",children:[(0,f.jsx)("div",{className:"img__container",children:(0,f.jsx)(h.Z,{src:s.imgs[0].url,alt:s.imgs[0].name[i]})}),(0,f.jsxs)("div",{className:"fiber__descr",children:[(0,f.jsx)("span",{children:s.short.name[i]}),(0,f.jsx)("span",{children:s.short.descr[i]})]})]})},u={loadFibers:o.il},b={loadColors:l.Uf},g=(0,t.$j)((e=>({lang:e.base.lang,fibers:e.fibers,colors:e.colors})),(e=>({setState:{fibers:(0,r.DE)(u,e),colors:(0,r.DE)(b,e)}})))((e=>{var s,i;let{lang:r,fibers:t,colors:o,setState:l}=e;const h=(0,d.UO)().fiberId||"",[u,b]=(0,a.useState)(!1);return(0,a.useEffect)((()=>{"idle"===t.dataLoading.status&&(l.fibers.loadFibers(),b(!1)),"idle"===o.dataLoading.status&&(l.colors.loadColors(),b(!1)),"success"===o.dataLoading.status&&"success"===t.dataLoading.status&&b(!0)}),[null===(s=o.dataLoading)||void 0===s?void 0:s.status,null===(i=t.dataLoading)||void 0===i?void 0:i.status]),(0,a.useEffect)((()=>{if(!u||!h)return;const e=Array.from(document.querySelectorAll("[data-fiberid]")).find((e=>e.dataset.fiberid===h));if(!e)return;const s=e.getBoundingClientRect().top+window.pageYOffset-100;window.scrollTo({top:s,behavior:"smooth"})}),[u]),(0,f.jsx)("div",{className:"page page_fibers",children:(0,f.jsx)("div",{className:"container_page",children:(0,f.jsxs)("div",{className:"container",children:[(0,f.jsx)("h1",{children:"en"===r?"Materials using for 3D printing":"\u041c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b, \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0435 \u0432 \u043f\u0435\u0447\u0430\u0442\u0438"}),"en"===r?(0,f.jsxs)("div",{className:"block_text",children:[(0,f.jsx)("p",{children:"In modern 3D printing, a variety of different materials are used to obtain products with different properties for various operating conditions. The physical characteristics of the printed object as well as its cost will differ, which is why it is crucial to choose the right material for printing."}),(0,f.jsx)("p",{children:"Our company offers you a wide selection of printing materials for various types of products. Below are the materials we currently offer for manufacturing your desired products. We also invite you to familiarize yourself with the list of terms used to describe the materials for a more comfortable and comprehensive understanding of their features."}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"Strength:"})," the specific load that a part can withstand without breaking."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"Printability:"})," a relative indicator that characterizes the bonding strength between layers of the part."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"Stiffness:"})," the ability of a part to resist deformation, the opposite of flexibility (strength and stiffness are not the same, a part can be flexible and withstand high loads before breaking)."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"Shrinkage:"})," the amount by which the linear dimensions of a part decrease during cooling. The higher the shrinkage, the more time is required for printing the part due to reduced speed."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"Adhesion:"})," the bonding strength between lines and layers of the material. The higher this value, the closer the strength of the printed part is to that of a molded product."]})]}):(0,f.jsxs)("div",{className:"block_text",children:[(0,f.jsx)("p",{children:"\u0412 \u0441\u043e\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0439 3D \u043f\u0435\u0447\u0430\u0442\u0438 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u043c\u043d\u043e\u0436\u0435\u0441\u0442\u0432\u043e \u0440\u0430\u0437\u043b\u0438\u0447\u043d\u044b\u0445 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u0432, \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u044e\u0449\u0438\u0445 \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043f\u0440\u043e\u0434\u0443\u043a\u0442 \u0441 \u0440\u0430\u0437\u043b\u0438\u0447\u043d\u044b\u043c\u0438 \u0441\u0432\u043e\u0439\u0441\u0442\u0432\u0430\u043c\u0438 \u0434\u043b\u044f \u0440\u0430\u0437\u043d\u044b\u0445 \u0443\u0441\u043b\u043e\u0432\u0438\u0439 \u044d\u043a\u0441\u043f\u043b\u0443\u0430\u0442\u0430\u0446\u0438\u0438. \u041e\u0442\u043b\u0438\u0447\u0430\u0442\u044c\u0441\u044f \u0431\u0443\u0434\u0443\u0442 \u043a\u0430\u043a \u0444\u0438\u0437\u0438\u0447\u0435\u0441\u043a\u0442\u0435 \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0441\u0442\u0438\u043a\u0438 \u043f\u0435\u0447\u0430\u0442\u0430\u0435\u043c\u043e\u0433\u043e \u043e\u0431\u0440\u0430\u0437\u0446\u0430, \u0442\u0430\u043a \u0438 \u0435\u0433\u043e \u0441\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c, \u0432\u043e\u0442 \u043f\u043e\u0447\u0435\u043c\u0443 \u0442\u0430\u043a \u0432\u0430\u0436\u043d\u043e \u043f\u0440\u0430\u0432\u0438\u043b\u044c\u043d\u043e \u0432\u044b\u0431\u0440\u0430\u0442\u044c \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b \u0434\u043b\u044f \u043f\u0435\u0447\u0430\u0442\u0438. "}),(0,f.jsx)("p",{children:"\u041d\u0430\u0448\u0430 \u043a\u0430\u043c\u043f\u0430\u043d\u0438\u044f \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435 \u0412\u0430\u043c \u0448\u0438\u0440\u043e\u043a\u0438\u0439 \u0432\u044b\u0431\u043e\u0440 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u0432 \u0434\u043b\u044f \u043f\u0435\u0447\u0430\u0442\u0438 \u0434\u043b\u044f \u0441\u0430\u043c\u044b\u0445 \u0440\u0430\u0437\u043b\u0438\u0447\u043d\u044b\u0445 \u0432\u0438\u0434\u043e\u0432 \u043f\u0440\u043e\u0434\u0443\u043a\u0446\u0438\u0438. \u041d\u0438\u0436\u0435 \u043f\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043b\u0435\u043d\u044b \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u044b, \u0438\u0437 \u043a\u043e\u0442\u043e\u0440\u044b\u0445 \u043d\u0430 \u0434\u0430\u043d\u043d\u044b\u0439 \u043c\u043e\u043c\u0435\u043d\u0442 \u043c\u044b \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u043c \u0432\u0430\u043c \u0438\u0437\u0433\u043e\u0442\u043e\u0432\u0438\u0442\u044c \u0436\u0435\u043b\u0430\u0435\u043c\u0443\u044e \u043f\u0440\u043e\u0434\u0443\u043a\u0446\u0438\u044e. \u0422\u0430\u043a\u0436\u0435 \u043c\u044b \u043f\u0440\u0435\u0434\u043b\u0430\u0433\u0430\u0435\u043c \u0412\u0430\u043c \u043e\u0437\u043d\u0430\u043a\u043e\u043c\u0438\u0442\u044c\u0441\u044f \u0441\u043e \u0441\u043f\u0438\u0441\u043a\u043e\u043c \u0442\u0435\u0440\u043c\u0438\u043d\u043e\u0432, \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0445 \u0432 \u043e\u043f\u0438\u0441\u0430\u043d\u0438\u0438 \u043a \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430\u043c, \u0434\u043b\u044f \u0431\u044c\u043e\u043b\u0435\u0435 \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u043d\u043e\u0433\u043e \u0438 \u043f\u043e\u043b\u043d\u043e\u0433\u043e \u043f\u043e\u043d\u0438\u043c\u0430\u043d\u0438\u044f \u043e\u0441\u043e\u0431\u0435\u043d\u043d\u043e\u0441\u0442\u0435\u0439 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u043e\u0432."}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"\u041f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u044c:"})," \u0443\u0434\u0435\u043b\u044c\u043d\u0430\u044f \u043d\u0430\u0433\u0440\u0443\u0437\u043a\u0430, \u043a\u043e\u0442\u043e\u0440\u0443\u044e \u043c\u043e\u0436\u0435\u0442 \u0432\u043e\u0441\u043f\u0440\u0438\u043d\u044f\u0442\u044c \u0434\u0435\u0442\u0430\u043b\u044c \u0431\u0435\u0437 \u0440\u0430\u0437\u0440\u0443\u0448\u0435\u043d\u0438\u044f."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"\u0421\u043f\u0435\u043a\u0430\u0435\u043c\u043e\u0441\u0442\u044c:"})," \u043e\u0442\u043d\u043e\u0441\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0439 \u043f\u043e\u043a\u0430\u0437\u0430\u0442\u0435\u043b\u044c, \u0445\u0430\u0440\u0430\u043a\u0442\u0435\u0440\u0438\u0437\u0443\u044e\u0449\u0438\u0439 \u0441\u0438\u043b\u0443 \u0441\u043a\u043b\u0435\u0438\u0432\u0430\u043d\u0438\u044f \u0441\u043b\u043e\u0451\u0432 \u0434\u0435\u0442\u0430\u043b\u0438 \u043c\u0435\u0436\u0434\u0443 \u0441\u043e\u0431\u043e\u0439."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"\u0416\u0451\u0441\u0442\u043a\u043e\u0441\u0442\u044c:"}),"  \u0441\u043f\u043e\u0441\u043e\u0431\u043d\u043e\u0441\u0442\u044c \u0434\u0435\u0442\u0430\u043b\u0438 \u043f\u0440\u043e\u0442\u0438\u0432\u043e\u0441\u0442\u043e\u044f\u0442\u044c \u0434\u0435\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u0438, \u043f\u0440\u043e\u0442\u0438\u0432\u043e\u043f\u043e\u043b\u043e\u0436\u043d\u043e\u0441\u0442\u044c \u0433\u0438\u0431\u043a\u043e\u0441\u0442\u0438 (\u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u0438 \u0436\u0451\u0441\u0442\u043a\u043e\u0441\u0442\u044c \u043d\u0435 \u043e\u0434\u043d\u043e \u0438 \u0442\u043e \u0436\u0435, \u0434\u0435\u0442\u0430\u043b\u044c \u043c\u043e\u0436\u0435\u0442 \u0431\u044b\u0442\u044c \u0433\u0438\u0431\u043a\u043e\u0439 \u0438 \u0432\u044b\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044c \u0431\u043e\u043b\u044c\u0448\u0438\u0435 \u043d\u0430\u0433\u0440\u0443\u0437\u043a\u0438 \u0434\u043e \u0440\u0430\u0437\u0440\u0443\u0448\u0435\u043d\u0438\u044f)."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"\u0423\u0441\u0430\u0434\u043a\u0430:"})," \u0432\u0435\u043b\u0438\u0447\u0438\u043d\u0430, \u043d\u0430 \u043a\u043e\u0442\u043e\u0440\u0443\u044e \u0443\u043c\u0435\u043d\u044c\u0448\u0430\u044e\u0442\u0441\u044f \u043b\u0438\u043d\u0435\u0439\u043d\u044b\u0435 \u0440\u0430\u0437\u043c\u0435\u0440\u044b \u0434\u0435\u0442\u0430\u043b\u0438 \u043f\u0440\u0438 \u043e\u0441\u0442\u044b\u0432\u0430\u043d\u0438\u0438, \u0447\u0435\u043c \u0432\u044b\u0448\u0435 \u0443\u0441\u0430\u0434\u043a\u0430, \u0442\u0435\u043c \u0431\u043e\u043b\u044c\u0448\u0435 \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044f \u043d\u0430 \u043f\u0435\u0447\u0430\u0442\u044c \u0434\u0435\u0442\u0430\u043b\u0438, \u0432 \u0441\u043b\u0435\u0434\u0441\u0442\u0432\u0438\u0435 \u0441\u043d\u0438\u0436\u0435\u043d\u0438\u044f \u0441\u043a\u043e\u0440\u043e\u0441\u0442\u0438."]}),(0,f.jsxs)("p",{children:[(0,f.jsx)("b",{children:"C\u043f\u0435\u043a\u0430\u043d\u0438\u0435:"})," \u0441\u0438\u043b\u0430 \u0441\u043a\u043b\u0435\u0438\u0432\u0430\u043d\u0438\u044f \u043b\u0438\u043d\u0438\u0439 \u0438 \u0441\u043b\u043e\u0451\u0432 \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0430 \u043c\u0435\u0436\u0434\u0443 \u0441\u043e\u0431\u043e\u0439, \u0447\u0435\u043c \u0432\u044b\u0448\u0435 \u044d\u0442\u0430 \u0432\u0435\u043b\u0438\u0447\u0438\u043d\u0430, \u0442\u0435\u043c \u0431\u043b\u0438\u0436\u0435 \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u044c \u043f\u0435\u0447\u0430\u0442\u043d\u043e\u0439 \u0434\u0435\u0442\u0430\u043b\u0438 \u043a \u043f\u0440\u043e\u0447\u043d\u043e\u0441\u0442\u0438 \u043b\u0438\u0442\u043e\u0433\u043e \u0438\u0437\u0434\u0435\u043b\u0438\u044f."]})]}),u?(0,f.jsx)("div",{className:"fibers__container",children:t.fibersList.map(((e,s)=>(0,f.jsx)(c.OL,{to:`../../fibers/${e.id}`,"aria-label":"en"===r?"(About fiber)":" (\u041e \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b\u0435)",children:(0,a.createElement)(p,{fiber:e,lang:r,colors:o.colors,key:s})},e.id)))}):(0,f.jsx)(n.Z,{})]})})})}))}}]);
//# sourceMappingURL=197.4ec57f40.chunk.js.map