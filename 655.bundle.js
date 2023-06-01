/*! For license information please see 655.bundle.js.LICENSE.txt */
"use strict";(globalThis.webpackChunk_3dprint=globalThis.webpackChunk_3dprint||[]).push([[655],{2599:(e,t,r)=>{function n(){return n=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},n.apply(this,arguments)}var a;r.d(t,{Ep:()=>h,J0:()=>l,RQ:()=>B,WK:()=>T,X3:()=>_,Zn:()=>O,Zq:()=>j,aU:()=>a,cP:()=>p,fp:()=>f,pC:()=>k,q_:()=>i}),function(e){e.Pop="POP",e.Push="PUSH",e.Replace="REPLACE"}(a||(a={}));const o="popstate";function i(e){return void 0===e&&(e={}),function(e,t,r,i){void 0===i&&(i={});let{window:s=document.defaultView,v5Compat:p=!1}=i,d=s.history,f=a.Pop,m=null,v=g();function g(){return(d.state||{idx:null}).idx}function y(){f=a.Pop;let e=g(),t=null==e?null:e-v;v=e,m&&m({action:f,location:b.location,delta:t})}function w(e){let t="null"!==s.location.origin?s.location.origin:s.location.href,r="string"==typeof e?e:h(e);return l(t,"No window.location.(origin|href) available to create URL for href: "+r),new URL(r,t)}null==v&&(v=0,d.replaceState(n({},d.state,{idx:v}),""));let b={get action(){return f},get location(){return e(s,d)},listen(e){if(m)throw new Error("A history only accepts one active listener");return s.addEventListener(o,y),m=e,()=>{s.removeEventListener(o,y),m=null}},createHref:e=>t(s,e),createURL:w,encodeLocation(e){let t=w(e);return{pathname:t.pathname,search:t.search,hash:t.hash}},push:function(e,t){f=a.Push;let n=u(b.location,e,t);r&&r(n,e),v=g()+1;let o=c(n,v),i=b.createHref(n);try{d.pushState(o,"",i)}catch(e){s.location.assign(i)}p&&m&&m({action:f,location:b.location,delta:1})},replace:function(e,t){f=a.Replace;let n=u(b.location,e,t);r&&r(n,e),v=g();let o=c(n,v),i=b.createHref(n);d.replaceState(o,"",i),p&&m&&m({action:f,location:b.location,delta:0})},go:e=>d.go(e)};return b}((function(e,t){let{pathname:r="/",search:n="",hash:a=""}=p(e.location.hash.substr(1));return u("",{pathname:r,search:n,hash:a},t.state&&t.state.usr||null,t.state&&t.state.key||"default")}),(function(e,t){let r=e.document.querySelector("base"),n="";if(r&&r.getAttribute("href")){let t=e.location.href,r=t.indexOf("#");n=-1===r?t:t.slice(0,r)}return n+"#"+("string"==typeof t?t:h(t))}),(function(e,t){s("/"===e.pathname.charAt(0),"relative pathnames are not supported in hash history.push("+JSON.stringify(t)+")")}),e)}function l(e,t){if(!1===e||null==e)throw new Error(t)}function s(e,t){if(!e){"undefined"!=typeof console&&console.warn(t);try{throw new Error(t)}catch(e){}}}function c(e,t){return{usr:e.state,key:e.key,idx:t}}function u(e,t,r,a){return void 0===r&&(r=null),n({pathname:"string"==typeof e?e:e.pathname,search:"",hash:""},"string"==typeof t?p(t):t,{state:r,key:t&&t.key||a||Math.random().toString(36).substr(2,8)})}function h(e){let{pathname:t="/",search:r="",hash:n=""}=e;return r&&"?"!==r&&(t+="?"===r.charAt(0)?r:"?"+r),n&&"#"!==n&&(t+="#"===n.charAt(0)?n:"#"+n),t}function p(e){let t={};if(e){let r=e.indexOf("#");r>=0&&(t.hash=e.substr(r),e=e.substr(0,r));let n=e.indexOf("?");n>=0&&(t.search=e.substr(n),e=e.substr(0,n)),e&&(t.pathname=e)}return t}var d;function f(e,t,r){void 0===r&&(r="/");let n=O(("string"==typeof t?p(t):t).pathname||"/",r);if(null==n)return null;let a=m(e);!function(e){e.sort(((e,t)=>e.score!==t.score?t.score-e.score:function(e,t){return e.length===t.length&&e.slice(0,-1).every(((e,r)=>e===t[r]))?e[e.length-1]-t[t.length-1]:0}(e.routesMeta.map((e=>e.childrenIndex)),t.routesMeta.map((e=>e.childrenIndex)))))}(a);let o=null;for(let e=0;null==o&&e<a.length;++e)o=P(a[e],U(n));return o}function m(e,t,r,n){void 0===t&&(t=[]),void 0===r&&(r=[]),void 0===n&&(n="");let a=(e,a,o)=>{let i={relativePath:void 0===o?e.path||"":o,caseSensitive:!0===e.caseSensitive,childrenIndex:a,route:e};i.relativePath.startsWith("/")&&(l(i.relativePath.startsWith(n),'Absolute route path "'+i.relativePath+'" nested under path "'+n+'" is not valid. An absolute child route path must start with the combined path of all its parent routes.'),i.relativePath=i.relativePath.slice(n.length));let s=B([n,i.relativePath]),c=r.concat(i);e.children&&e.children.length>0&&(l(!0!==e.index,'Index routes must not have child routes. Please remove all child routes from route path "'+s+'".'),m(e.children,t,c,s)),(null!=e.path||e.index)&&t.push({path:s,score:R(s,e.index),routesMeta:c})};return e.forEach(((e,t)=>{var r;if(""!==e.path&&null!=(r=e.path)&&r.includes("?"))for(let r of v(e.path))a(e,t,r);else a(e,t)})),t}function v(e){let t=e.split("/");if(0===t.length)return[];let[r,...n]=t,a=r.endsWith("?"),o=r.replace(/\?$/,"");if(0===n.length)return a?[o,""]:[o];let i=v(n.join("/")),l=[];return l.push(...i.map((e=>""===e?o:[o,e].join("/")))),a&&l.push(...i),l.map((t=>e.startsWith("/")&&""===t?"/":t))}!function(e){e.data="data",e.deferred="deferred",e.redirect="redirect",e.error="error"}(d||(d={})),new Set(["lazy","caseSensitive","path","id","index","children"]);const g=/^:\w+$/,y=3,w=2,b=1,E=10,C=-2,x=e=>"*"===e;function R(e,t){let r=e.split("/"),n=r.length;return r.some(x)&&(n+=C),t&&(n+=w),r.filter((e=>!x(e))).reduce(((e,t)=>e+(g.test(t)?y:""===t?b:E)),n)}function P(e,t){let{routesMeta:r}=e,n={},a="/",o=[];for(let e=0;e<r.length;++e){let i=r[e],l=e===r.length-1,s="/"===a?t:t.slice(a.length)||"/",c=S({path:i.relativePath,caseSensitive:i.caseSensitive,end:l},s);if(!c)return null;Object.assign(n,c.params);let u=i.route;o.push({params:n,pathname:B([a,c.pathname]),pathnameBase:W(B([a,c.pathnameBase])),route:u}),"/"!==c.pathnameBase&&(a=B([a,c.pathnameBase]))}return o}function S(e,t){"string"==typeof e&&(e={path:e,caseSensitive:!1,end:!0});let[r,n]=function(e,t,r){void 0===t&&(t=!1),void 0===r&&(r=!0),s("*"===e||!e.endsWith("*")||e.endsWith("/*"),'Route path "'+e+'" will be treated as if it were "'+e.replace(/\*$/,"/*")+'" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, please change the route path to "'+e.replace(/\*$/,"/*")+'".');let n=[],a="^"+e.replace(/\/*\*?$/,"").replace(/^\/*/,"/").replace(/[\\.*+^$?{}|()[\]]/g,"\\$&").replace(/\/:(\w+)/g,((e,t)=>(n.push(t),"/([^\\/]+)")));return e.endsWith("*")?(n.push("*"),a+="*"===e||"/*"===e?"(.*)$":"(?:\\/(.+)|\\/*)$"):r?a+="\\/*$":""!==e&&"/"!==e&&(a+="(?:(?=\\/|$))"),[new RegExp(a,t?void 0:"i"),n]}(e.path,e.caseSensitive,e.end),a=t.match(r);if(!a)return null;let o=a[0],i=o.replace(/(.)\/+$/,"$1"),l=a.slice(1);return{params:n.reduce(((e,t,r)=>{if("*"===t){let e=l[r]||"";i=o.slice(0,o.length-e.length).replace(/(.)\/+$/,"$1")}return e[t]=function(e,t){try{return decodeURIComponent(e)}catch(r){return s(!1,'The value for the URL param "'+t+'" will not be decoded because the string "'+e+'" is a malformed URL segment. This is probably due to a bad percent encoding ('+r+")."),e}}(l[r]||"",t),e}),{}),pathname:o,pathnameBase:i,pattern:e}}function U(e){try{return decodeURI(e)}catch(t){return s(!1,'The URL path "'+e+'" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent encoding ('+t+")."),e}}function O(e,t){if("/"===t)return e;if(!e.toLowerCase().startsWith(t.toLowerCase()))return null;let r=t.endsWith("/")?t.length-1:t.length,n=e.charAt(r);return n&&"/"!==n?null:e.slice(r)||"/"}function L(e,t,r,n){return"Cannot include a '"+e+"' character in a manually specified `to."+t+"` field ["+JSON.stringify(n)+"].  Please separate it out to the `to."+r+'` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.'}function j(e){return e.filter(((e,t)=>0===t||e.route.path&&e.route.path.length>0))}function k(e,t,r,a){let o;void 0===a&&(a=!1),"string"==typeof e?o=p(e):(o=n({},e),l(!o.pathname||!o.pathname.includes("?"),L("?","pathname","search",o)),l(!o.pathname||!o.pathname.includes("#"),L("#","pathname","hash",o)),l(!o.search||!o.search.includes("#"),L("#","search","hash",o)));let i,s=""===e||""===o.pathname,c=s?"/":o.pathname;if(a||null==c)i=r;else{let e=t.length-1;if(c.startsWith("..")){let t=c.split("/");for(;".."===t[0];)t.shift(),e-=1;o.pathname=t.join("/")}i=e>=0?t[e]:"/"}let u=function(e,t){void 0===t&&(t="/");let{pathname:r,search:n="",hash:a=""}="string"==typeof e?p(e):e,o=r?r.startsWith("/")?r:function(e,t){let r=t.replace(/\/+$/,"").split("/");return e.split("/").forEach((e=>{".."===e?r.length>1&&r.pop():"."!==e&&r.push(e)})),r.length>1?r.join("/"):"/"}(r,t):t;return{pathname:o,search:A(n),hash:J(a)}}(o,i),h=c&&"/"!==c&&c.endsWith("/"),d=(s||"."===c)&&r.endsWith("/");return u.pathname.endsWith("/")||!h&&!d||(u.pathname+="/"),u}const B=e=>e.join("/").replace(/\/\/+/g,"/"),W=e=>e.replace(/\/+$/,"").replace(/^\/*/,"/"),A=e=>e&&"?"!==e?e.startsWith("?")?e:"?"+e:"",J=e=>e&&"#"!==e?e.startsWith("#")?e:"#"+e:"";class _ extends Error{}function T(e){return null!=e&&"number"==typeof e.status&&"string"==typeof e.statusText&&"boolean"==typeof e.internal&&"data"in e}const $=["post","put","patch","delete"],D=(new Set($),["get",...$]);new Set(D),new Set([301,302,303,307,308]),new Set([307,308]),"undefined"!=typeof window&&void 0!==window.document&&window.document.createElement,Symbol("deferred")},9655:(e,t,r)=>{r.d(t,{OL:()=>f,UT:()=>u,rU:()=>d});var n=r(7294),a=r(9250),o=r(2599);function i(){return i=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i.apply(this,arguments)}function l(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}const s=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset"],c=["aria-current","caseSensitive","className","end","style","to","children"];function u(e){let{basename:t,children:r,window:i}=e,l=n.useRef();null==l.current&&(l.current=(0,o.q_)({window:i,v5Compat:!0}));let s=l.current,[c,u]=n.useState({action:s.action,location:s.location});return n.useLayoutEffect((()=>s.listen(u)),[s]),n.createElement(a.F0,{basename:t,children:r,location:c.location,navigationType:c.action,navigator:s})}const h="undefined"!=typeof window&&void 0!==window.document&&void 0!==window.document.createElement,p=/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,d=n.forwardRef((function(e,t){let r,{onClick:c,relative:u,reloadDocument:d,replace:f,state:m,target:v,to:g,preventScrollReset:y}=e,w=l(e,s),{basename:b}=n.useContext(a.Us),E=!1;if("string"==typeof g&&p.test(g)&&(r=g,h)){let e=new URL(window.location.href),t=g.startsWith("//")?new URL(e.protocol+g):new URL(g),r=(0,o.Zn)(t.pathname,b);t.origin===e.origin&&null!=r?g=r+t.search+t.hash:E=!0}let C=(0,a.oQ)(g,{relative:u}),x=function(e,t){let{target:r,replace:i,state:l,preventScrollReset:s,relative:c}=void 0===t?{}:t,u=(0,a.s0)(),h=(0,a.TH)(),p=(0,a.WU)(e,{relative:c});return n.useCallback((t=>{if(function(e,t){return!(0!==e.button||t&&"_self"!==t||function(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}(e))}(t,r)){t.preventDefault();let r=void 0!==i?i:(0,o.Ep)(h)===(0,o.Ep)(p);u(e,{replace:r,state:l,preventScrollReset:s,relative:c})}}),[h,u,p,i,l,r,e,s,c])}(g,{replace:f,state:m,target:v,preventScrollReset:y,relative:u});return n.createElement("a",i({},w,{href:r||C,onClick:E||d?c:function(e){c&&c(e),e.defaultPrevented||x(e)},ref:t,target:v}))})),f=n.forwardRef((function(e,t){let{"aria-current":r="page",caseSensitive:o=!1,className:s="",end:u=!1,style:h,to:p,children:f}=e,m=l(e,c),v=(0,a.WU)(p,{relative:m.relative}),g=(0,a.TH)(),y=n.useContext(a.FR),{navigator:w}=n.useContext(a.Us),b=w.encodeLocation?w.encodeLocation(v).pathname:v.pathname,E=g.pathname,C=y&&y.navigation&&y.navigation.location?y.navigation.location.pathname:null;o||(E=E.toLowerCase(),C=C?C.toLowerCase():null,b=b.toLowerCase());let x,R=E===b||!u&&E.startsWith(b)&&"/"===E.charAt(b.length),P=null!=C&&(C===b||!u&&C.startsWith(b)&&"/"===C.charAt(b.length)),S=R?r:void 0;x="function"==typeof s?s({isActive:R,isPending:P}):[s,R?"active":null,P?"pending":null].filter(Boolean).join(" ");let U="function"==typeof h?h({isActive:R,isPending:P}):h;return n.createElement(d,i({},m,{"aria-current":S,className:x,ref:t,style:U,to:p}),"function"==typeof f?f({isActive:R,isPending:P}):f)}));var m,v;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmitImpl="useSubmitImpl",e.UseFetcher="useFetcher"})(m||(m={})),function(e){e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"}(v||(v={}))},9250:(e,t,r)=>{var n;r.d(t,{AW:()=>L,F0:()=>j,FR:()=>h,TH:()=>w,UO:()=>E,Us:()=>p,WU:()=>C,Z5:()=>k,oQ:()=>g,s0:()=>b});var a=r(2599),o=r(7294);"function"==typeof Object.is&&Object.is;const{useState:i,useEffect:l,useLayoutEffect:s,useDebugValue:c}=n||(n=r.t(o,2));"undefined"==typeof window||void 0===window.document||window.document.createElement,(n||(n=r.t(o,2))).useSyncExternalStore;const u=o.createContext(null),h=o.createContext(null),p=o.createContext(null),d=o.createContext(null),f=o.createContext({outlet:null,matches:[]}),m=o.createContext(null);function v(){return v=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},v.apply(this,arguments)}function g(e,t){let{relative:r}=void 0===t?{}:t;y()||(0,a.J0)(!1);let{basename:n,navigator:i}=o.useContext(p),{hash:l,pathname:s,search:c}=C(e,{relative:r}),u=s;return"/"!==n&&(u="/"===s?n:(0,a.RQ)([n,s])),i.createHref({pathname:u,search:c,hash:l})}function y(){return null!=o.useContext(d)}function w(){return y()||(0,a.J0)(!1),o.useContext(d).location}function b(){y()||(0,a.J0)(!1);let{basename:e,navigator:t}=o.useContext(p),{matches:r}=o.useContext(f),{pathname:n}=w(),i=JSON.stringify((0,a.Zq)(r).map((e=>e.pathnameBase))),l=o.useRef(!1);return o.useEffect((()=>{l.current=!0})),o.useCallback((function(r,o){if(void 0===o&&(o={}),!l.current)return;if("number"==typeof r)return void t.go(r);let s=(0,a.pC)(r,JSON.parse(i),n,"path"===o.relative);"/"!==e&&(s.pathname="/"===s.pathname?e:(0,a.RQ)([e,s.pathname])),(o.replace?t.replace:t.push)(s,o.state,o)}),[e,t,i,n])}function E(){let{matches:e}=o.useContext(f),t=e[e.length-1];return t?t.params:{}}function C(e,t){let{relative:r}=void 0===t?{}:t,{matches:n}=o.useContext(f),{pathname:i}=w(),l=JSON.stringify((0,a.Zq)(n).map((e=>e.pathnameBase)));return o.useMemo((()=>(0,a.pC)(e,JSON.parse(l),i,"path"===r)),[e,l,i,r])}function x(){let e=function(){var e;let t=o.useContext(m),r=function(e){let t=o.useContext(h);return t||(0,a.J0)(!1),t}(U.UseRouteError),n=function(e){let t=function(e){let t=o.useContext(f);return t||(0,a.J0)(!1),t}(),r=t.matches[t.matches.length-1];return r.route.id||(0,a.J0)(!1),r.route.id}(U.UseRouteError);return t||(null==(e=r.errors)?void 0:e[n])}(),t=(0,a.WK)(e)?e.status+" "+e.statusText:e instanceof Error?e.message:JSON.stringify(e),r=e instanceof Error?e.stack:null,n={padding:"0.5rem",backgroundColor:"rgba(200,200,200, 0.5)"};return o.createElement(o.Fragment,null,o.createElement("h2",null,"Unexpected Application Error!"),o.createElement("h3",{style:{fontStyle:"italic"}},t),r?o.createElement("pre",{style:n},r):null,null)}class R extends o.Component{constructor(e){super(e),this.state={location:e.location,error:e.error}}static getDerivedStateFromError(e){return{error:e}}static getDerivedStateFromProps(e,t){return t.location!==e.location?{error:e.error,location:e.location}:{error:e.error||t.error,location:t.location}}componentDidCatch(e,t){console.error("React Router caught the following error during render",e,t)}render(){return this.state.error?o.createElement(f.Provider,{value:this.props.routeContext},o.createElement(m.Provider,{value:this.state.error,children:this.props.component})):this.props.children}}function P(e){let{routeContext:t,match:r,children:n}=e,a=o.useContext(u);return a&&a.static&&a.staticContext&&(r.route.errorElement||r.route.ErrorBoundary)&&(a.staticContext._deepestRenderedBoundaryId=r.route.id),o.createElement(f.Provider,{value:t},n)}var S,U,O;function L(e){(0,a.J0)(!1)}function j(e){let{basename:t="/",children:r=null,location:n,navigationType:i=a.aU.Pop,navigator:l,static:s=!1}=e;y()&&(0,a.J0)(!1);let c=t.replace(/^\/*/,"/"),u=o.useMemo((()=>({basename:c,navigator:l,static:s})),[c,l,s]);"string"==typeof n&&(n=(0,a.cP)(n));let{pathname:h="/",search:f="",hash:m="",state:v=null,key:g="default"}=n,w=o.useMemo((()=>{let e=(0,a.Zn)(h,c);return null==e?null:{location:{pathname:e,search:f,hash:m,state:v,key:g},navigationType:i}}),[c,h,f,m,v,g,i]);return null==w?null:o.createElement(p.Provider,{value:u},o.createElement(d.Provider,{children:r,value:w}))}function k(e){let{children:t,location:r}=e,n=o.useContext(u);return function(e,t){y()||(0,a.J0)(!1);let{navigator:r}=o.useContext(p),n=o.useContext(h),{matches:i}=o.useContext(f),l=i[i.length-1],s=l?l.params:{},c=(l&&l.pathname,l?l.pathnameBase:"/");l&&l.route;let u,m=w();if(t){var g;let e="string"==typeof t?(0,a.cP)(t):t;"/"===c||(null==(g=e.pathname)?void 0:g.startsWith(c))||(0,a.J0)(!1),u=e}else u=m;let b=u.pathname||"/",E="/"===c?b:b.slice(c.length)||"/",C=(0,a.fp)(e,{pathname:E}),S=function(e,t,r){if(void 0===t&&(t=[]),null==e){if(null==r||!r.errors)return null;e=r.matches}let n=e,i=null==r?void 0:r.errors;if(null!=i){let e=n.findIndex((e=>e.route.id&&(null==i?void 0:i[e.route.id])));e>=0||(0,a.J0)(!1),n=n.slice(0,Math.min(n.length,e+1))}return n.reduceRight(((e,a,l)=>{let s=a.route.id?null==i?void 0:i[a.route.id]:null,c=null;r&&(c=a.route.ErrorBoundary?o.createElement(a.route.ErrorBoundary,null):a.route.errorElement?a.route.errorElement:o.createElement(x,null));let u=t.concat(n.slice(0,l+1)),h=()=>{let t=e;return s?t=c:a.route.Component?t=o.createElement(a.route.Component,null):a.route.element&&(t=a.route.element),o.createElement(P,{match:a,routeContext:{outlet:e,matches:u},children:t})};return r&&(a.route.ErrorBoundary||a.route.errorElement||0===l)?o.createElement(R,{location:r.location,component:c,error:s,children:h(),routeContext:{outlet:null,matches:u}}):h()}),null)}(C&&C.map((e=>Object.assign({},e,{params:Object.assign({},s,e.params),pathname:(0,a.RQ)([c,r.encodeLocation?r.encodeLocation(e.pathname).pathname:e.pathname]),pathnameBase:"/"===e.pathnameBase?c:(0,a.RQ)([c,r.encodeLocation?r.encodeLocation(e.pathnameBase).pathname:e.pathnameBase])}))),i,n||void 0);return t&&S?o.createElement(d.Provider,{value:{location:v({pathname:"/",search:"",hash:"",state:null,key:"default"},u),navigationType:a.aU.Pop}},S):S}(n&&!t?n.router.routes:W(t),r)}!function(e){e.UseBlocker="useBlocker",e.UseRevalidator="useRevalidator"}(S||(S={})),function(e){e.UseBlocker="useBlocker",e.UseLoaderData="useLoaderData",e.UseActionData="useActionData",e.UseRouteError="useRouteError",e.UseNavigation="useNavigation",e.UseRouteLoaderData="useRouteLoaderData",e.UseMatches="useMatches",e.UseRevalidator="useRevalidator"}(U||(U={})),function(e){e[e.pending=0]="pending",e[e.success=1]="success",e[e.error=2]="error"}(O||(O={})),new Promise((()=>{}));class B extends o.Component{constructor(e){super(e),this.state={error:null}}static getDerivedStateFromError(e){return{error:e}}componentDidCatch(e,t){console.error("<Await> caught the following error during render",e,t)}render(){let{children:e,errorElement:t,resolve:r}=this.props,n=null,i=O.pending;if(r instanceof Promise)if(this.state.error){O.error;let e=this.state.error;Promise.reject().catch((()=>{})),Object.defineProperty(n,"_tracked",{get:()=>!0}),Object.defineProperty(n,"_error",{get:()=>e})}else r._tracked?void 0!==n._error?O.error:void 0!==n._data?O.success:O.pending:(O.pending,Object.defineProperty(r,"_tracked",{get:()=>!0}),r.then((e=>Object.defineProperty(r,"_data",{get:()=>e})),(e=>Object.defineProperty(r,"_error",{get:()=>e}))));else O.success,Promise.resolve(),Object.defineProperty(n,"_tracked",{get:()=>!0}),Object.defineProperty(n,"_data",{get:()=>r});if(i===O.error&&n._error instanceof a.X3)throw neverSettledPromise;if(i===O.error&&!t)throw n._error;if(i===O.error)return o.createElement(AwaitContext.Provider,{value:n,children:t});if(i===O.success)return o.createElement(AwaitContext.Provider,{value:n,children:e});throw n}}function W(e,t){void 0===t&&(t=[]);let r=[];return o.Children.forEach(e,((e,n)=>{if(!o.isValidElement(e))return;if(e.type===o.Fragment)return void r.push.apply(r,W(e.props.children,t));e.type!==L&&(0,a.J0)(!1),e.props.index&&e.props.children&&(0,a.J0)(!1);let i=[...t,n],l={id:e.props.id||i.join("-"),caseSensitive:e.props.caseSensitive,element:e.props.element,Component:e.props.Component,index:e.props.index,path:e.props.path,loader:e.props.loader,action:e.props.action,errorElement:e.props.errorElement,ErrorBoundary:e.props.ErrorBoundary,hasErrorBoundary:null!=e.props.ErrorBoundary||null!=e.props.errorElement,shouldRevalidate:e.props.shouldRevalidate,handle:e.props.handle,lazy:e.props.lazy};e.props.children&&(l.children=W(e.props.children,i)),r.push(l)})),r}}}]);