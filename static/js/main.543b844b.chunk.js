(this["webpackJsonpreact-window-scroller-example"]=this["webpackJsonpreact-window-scroller-example"]||[]).push([[0],{1:function(e,t,r){var n,o=r(0),l=(n=r(12))&&"object"===typeof n&&"default"in n?n.default:n;t.ReactWindowScroller=function(e){var t=e.children,r=e.throttleTime,n=void 0===r?10:r,a=e.isGrid,c=void 0!==a&&a,i=o.useRef(),d=o.useRef();o.useEffect((function(){var e=l((function(){var e=d.current,t=e.offsetTop,r=e.offsetLeft,n=document.documentElement.scrollTop-t,o=document.documentElement.scrollLeft-r;c&&i.current&&i.current.scrollTo({scrollLeft:o,scrollTop:n}),c||i.current&&i.current.scrollTo(n)}),n);return window.addEventListener("scroll",e),function(){return window.removeEventListener("scroll",e)}}),[c]);var s=o.useCallback((function(e){var t=e.scrollLeft,r=e.scrollTop,n=e.scrollOffset;if(e.scrollUpdateWasRequested){var o=document.documentElement,l=o.scrollTop,a=o.scrollLeft;n+=Math.min(l,d.current.offsetTop),r+=Math.min(l,d.current.offsetTop),t+=Math.min(a,d.current.offsetLeft),c||n===l||window.scrollTo(0,n),!c||r===l&&t===a||window.scrollTo(t,r)}}),[c]);return t({ref:i,outerRef:d,style:{width:c?"auto":"100%",height:"100%",overflow:"hidden",display:"inline-block"},onScroll:s})}},14:function(e,t,r){"use strict";r.r(t);r(7);var n=r(0),o=r.n(n),l=r(4),a=r.n(l),c=r(5),i=r(2),d=r(1);const s=({index:e,style:t})=>o.a.createElement("div",{className:e%2?"odd":"even",style:t},"Row ",e);var u=()=>o.a.createElement(d.ReactWindowScroller,null,({ref:e,outerRef:t,style:r,onScroll:n})=>o.a.createElement(i.b,{ref:e,outerRef:t,style:r,height:window.innerHeight,itemCount:1e3,itemSize:100,onScroll:n},s));const m=[...new Array(1e3)].map(()=>25+Math.round(50*Math.random())),f=e=>m[e];var w=()=>o.a.createElement(d.ReactWindowScroller,null,({ref:e,outerRef:t,style:r,onScroll:n})=>o.a.createElement(i.d,{ref:e,outerRef:t,style:r,height:window.innerHeight,itemCount:1e3,itemSize:f,onScroll:n},s));const h=({columnIndex:e,rowIndex:t,style:r})=>o.a.createElement("div",{className:e%2?t%2===0?"odd":"even":t%2?"odd":"even",style:r},"r",t,", c",e);var v=()=>o.a.createElement(d.ReactWindowScroller,{isGrid:!0},({ref:e,outerRef:t,style:r,onScroll:n})=>o.a.createElement(i.a,{ref:e,outerRef:t,style:r,height:window.innerHeight,width:window.innerWidth,columnCount:1e3,columnWidth:100,rowCount:1e3,rowHeight:50,onScroll:n},h));const E=[...new Array(1e3)].map(()=>75+Math.round(50*Math.random())),p=[...new Array(1e3)].map(()=>25+Math.round(50*Math.random()));var y=()=>o.a.createElement(d.ReactWindowScroller,{isGrid:!0},({ref:e,outerRef:t,style:r,onScroll:n})=>o.a.createElement(i.c,{ref:e,outerRef:t,style:r,height:window.innerHeight,width:window.innerWidth,columnCount:1e3,columnWidth:e=>E[e],rowCount:1e3,rowHeight:e=>p[e],onScroll:n},h));const R=["Fixed List","Variable List","Fixed Grid","Variable Grid"];var S=()=>{const e=Object(n.useState)(R[0]),t=Object(c.a)(e,2),r=t[0],l=t[1];return o.a.createElement(o.a.Fragment,null,o.a.createElement("nav",null,R.map(e=>o.a.createElement("button",{key:e,onClick:()=>l(e)},e))),"Fixed List"===r&&o.a.createElement(u,null),"Variable List"===r&&o.a.createElement(w,null),"Fixed Grid"===r&&o.a.createElement(v,null),"Variable Grid"===r&&o.a.createElement(y,null))};a.a.render(o.a.createElement(S,null),document.getElementById("root"))},6:function(e,t,r){e.exports=r(14)},7:function(e,t,r){}},[[6,1,2]]]);
//# sourceMappingURL=main.543b844b.chunk.js.map