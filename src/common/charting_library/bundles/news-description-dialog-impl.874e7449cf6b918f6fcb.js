(window.webpackJsonp=window.webpackJsonp||[]).push([["news-description-dialog-impl"],{"/KDZ":function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var o=n("mrSG"),r=n("q1tI"),i=function(e){function t(t){var n=e.call(this,t)||this;return n._handleChange=function(){n.forceUpdate()},n.state={query:window.matchMedia(n.props.rule)},n}return Object(o.__extends)(t,e),t.prototype.componentDidMount=function(){this._subscribe(this.state.query)},t.prototype.componentDidUpdate=function(e,t){this.state.query!==t.query&&(this._unsubscribe(t.query),this._subscribe(this.state.query))},t.prototype.componentWillUnmount=function(){this._unsubscribe(this.state.query)},t.prototype.render=function(){return this.props.children(this.state.query.matches)},t.getDerivedStateFromProps=function(e,t){return e.rule!==t.query.media?{query:window.matchMedia(e.rule)}:null},t.prototype._subscribe=function(e){e.addListener(this._handleChange)},t.prototype._unsubscribe=function(e){e.removeListener(this._handleChange)},t}(r.PureComponent)},"1O6C":function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var o=n("mrSG"),r=n("q1tI"),i=n("TSYQ"),s=n("+EG+"),a=n("jAh7"),c=n("QpNh"),u=n("aYmi"),l=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._manager=new a.OverlapManager,t._handleSlot=function(e){t._manager.setContainer(e)},t}return Object(o.__extends)(t,e),t.prototype.render=function(){var e=this.props,t=e.rounded,n=void 0===t||t,a=e.shadowed,l=void 0===a||a,d=e.fullscreen,p=void 0!==d&&d,h=e.darker,m=void 0!==h&&h,f=e.className,v=e.backdrop,_=i(f,u.dialog,n&&u.rounded,l&&u.shadowed,p&&u.fullscreen,m&&u.darker),y=Object(c.a)(this.props),b=this.props.style?Object(o.__assign)(Object(o.__assign)({},this._createStyles()),this.props.style):this._createStyles();return r.createElement(r.Fragment,null,r.createElement(s.b.Provider,{value:this._manager},v&&r.createElement("div",{onClick:this.props.onClickBackdrop,className:u.backdrop}),r.createElement("div",Object(o.__assign)({},y,{className:_,style:b,ref:this.props.reference,onFocus:this.props.onFocus,onMouseDown:this.props.onMouseDown,onMouseUp:this.props.onMouseUp,onClick:this.props.onClick,onKeyDown:this.props.onKeyDown,tabIndex:-1}),this.props.children)),r.createElement(s.a,{reference:this._handleSlot}))},t.prototype._createStyles=function(){var e=this.props,t=e.bottom,n=e.left,o=e.width;return{bottom:t,left:n,right:e.right,top:e.top,zIndex:e.zIndex,maxWidth:o,height:e.height}},t}(r.PureComponent)},"2B6P":function(e,t){e.exports='<svg xmlns="http://www.w3.org/2000/svg"><line x2="100%" y2="100%"/><line x2="100%" y1="100%"/></svg>'},Iivm:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),n("mrSG").__exportStar(n("swCq"),t)},Ju5u:function(e,t,n){e.exports={dialog:"dialog-27wESomC",closeButton:"closeButton-1h7Bm0kS",actions:"actions-kinR44It"}},PwON:function(e){e.exports=JSON.parse('{"a":"screen and (max-width: 479px)"}')},RgaO:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var o=n("mrSG"),r=n("8Rai");function i(e){
var t=e.children,n=Object(o.__rest)(e,["children"]);return t(Object(r.a)(n))}},"SK/v":function(e,t,n){"use strict";n.d(t,"a",(function(){return d}));var o=n("mrSG"),r=n("q1tI"),i=n("TSYQ"),s=n("1O6C"),a=n("uqKQ"),c=n("RgaO"),u=n("UJLh"),l=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._containerRef=null,t._handleContainerRef=function(e){t._containerRef=e},t}return Object(o.__extends)(t,e),t.prototype.componentDidMount=function(){var e;this.props.autofocus&&(null===(e=this._containerRef)||void 0===e||e.focus())},t.prototype.render=function(){var e=this,t=this.props,n=t.zIndex,a=t.onClickOutside,l=t.children,d=t.className;return r.createElement("div",{ref:this._handleContainerRef,style:{zIndex:n},"data-dialog-name":this.props["data-dialog-name"],tabIndex:-1},r.createElement("div",{className:u.backdrop}),r.createElement("div",{className:u.wrap},r.createElement("div",{className:u.container},r.createElement(c.a,{mouseDown:!0,touchStart:!0,handler:a},(function(t){return r.createElement("div",{className:u.modal,ref:t},r.createElement(s.a,Object(o.__assign)({},e.props,{className:i(d,u.dialog)}),l))})))))},t.defaultProps={width:500},t}(r.PureComponent),d=Object(a.a)(l)},UJLh:function(e,t,n){e.exports={wrap:"wrap-3axdIL2R",container:"container-p3zks2PX",backdrop:"backdrop-1qZHPwi_",modal:"modal-GUK9cvUQ",dialog:"dialog-2Ei1ngXh"}},aYmi:function(e,t,n){e.exports={dialog:"dialog-2APwxL3O",rounded:"rounded-tXI9mwGE",shadowed:"shadowed-2M13-xZa",fullscreen:"fullscreen-2RqU2pqU",darker:"darker-2nhdv2oS",backdrop:"backdrop-1tKdKmN_"}},"b+lp":function(e,t,n){"use strict";n.r(t);var o=n("q1tI"),r=n.n(o),i=n("i8i4"),s=n.n(i),a=n("TSYQ"),c=n("YFKU"),u=n("SK/v"),l=n("Iivm"),d=n("2B6P"),p=n("vI4r"),h=o.forwardRef((function(e,t){var n=e.className,r=e.onClick,i=e["aria-label"],s=e.tabIndex;return o.createElement("button",{type:"button",className:a(p["close-button"],n),"aria-label":i,tabIndex:s,onClick:r,ref:t},o.createElement(l.Icon,{icon:d,className:p["close-icon"]}))})),m=n("ycI/"),f=n("/KDZ"),v=n("PwON"),_=n("Ju5u");function y(e){var t=e.className,n=e.children,o=e.isOpened,i=e.maxWidth,s=e.onCloseIntent,l=e.closeOnOutsideClick,d=void 0===l||l,p=e.closeOnEsc,y=void 0===p||p,b=e.actions,w=c.t("Close",{context:"input"});return r.a.createElement(f.a,{rule:v.a},(function(e){return r.a.createElement(u.a,{width:void 0===i?"100%":i,className:a(_.dialog,t),isOpened:o,onClickOutside:d?s:void 0,fullscreen:e,rounded:!e},r.a.createElement(h,{className:_.closeButton,"aria-label":w,onClick:s}),s&&y&&r.a.createElement(m.a,{keyCode:27,handler:s}),n,b&&r.a.createElement("div",{className:_.actions},b(e)))}))}var b=n("vS7h");function w(e){var t=e.title,n=e.description,o=e.onShowFullDescriptionClick;e.source,e.published;return r.a.createElement("article",null,!1,r.a.createElement("h2",{className:b.title},t),r.a.createElement("div",{className:b.body},n&&r.a.createElement("div",{className:a(b.description,o&&b.descriptionAnon),dangerouslySetInnerHTML:{__html:n}}),!1))}function g(e){var t=document.createElement("div")
;function n(){s.a.unmountComponentAtNode(t)}s.a.render(r.a.createElement(y,{isOpened:!0,onCloseIntent:n,maxWidth:800},r.a.createElement(w,{title:e.title,description:e.description,onShowFullDescriptionClick:e.onShowFullDescriptionClick&&function(){return void 0;n(),window.runOrSignIn((function(){return ensureDefined(e.onShowFullDescriptionClick)()}),{source:"Show news full description"})},source:e.source,published:e.published})),t)}n.d(t,"openNewsDescriptionDialogImpl",(function(){return g}))},swCq:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Icon=void 0;var o=n("mrSG"),r=n("q1tI");t.Icon=r.forwardRef((function(e,t){var n=e.icon,i=void 0===n?"":n,s=o.__rest(e,["icon"]);return r.createElement("span",o.__assign({},s,{ref:t,dangerouslySetInnerHTML:{__html:i}}))}))},uqKQ:function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var o=n("mrSG"),r=n("q1tI"),i=n("AiMB");function s(e){return function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return Object(o.__extends)(n,t),n.prototype.render=function(){var t=this.props,n=t.isOpened,s=t.root;if(!n)return null;var a=r.createElement(e,Object(o.__assign)({},this.props,{zIndex:150}));return"parent"===s?a:r.createElement(i.a,null,a)},n}(r.PureComponent)}},vI4r:function(e,t,n){e.exports={"close-button":"close-button-3pxNR2uR","close-icon":"close-icon-1vsEgvOg"}},vS7h:function(e,t,n){e.exports={title:"title-VIFZdeCK",body:"body-1p5TTX3Y",description:"description-FBAylUok",descriptionAnon:"descriptionAnon-3FYQdmqj"}},"ycI/":function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var o=n("mrSG"),r=n("q1tI"),i=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t._handleKeyDown=function(e){e.keyCode===t.props.keyCode&&t.props.handler(e)},t}return Object(o.__extends)(t,e),t.prototype.componentDidMount=function(){document.addEventListener(this.props.eventType||"keydown",this._handleKeyDown,!1)},t.prototype.componentWillUnmount=function(){document.removeEventListener(this.props.eventType||"keydown",this._handleKeyDown,!1)},t.prototype.render=function(){return null},t}(r.PureComponent)}}]);