(window.webpackJsonp=window.webpackJsonp||[]).push([[56],{"25b6":function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"d",(function(){return u})),n.d(t,"c",(function(){return c})),n.d(t,"a",(function(){return a}));var r=/[<"'&>]/g,i=function(e){return"&#"+e.charCodeAt(0)+";"};function o(e){return e.replace(r,i)}function u(e){return void 0===e&&(e=""),e.replace(/(<([^>]+)>)/gi,"")}function c(e){return void 0===e&&(e=""),e.replace(/\s+/g,"")}function a(e){return void 0===e&&(e=""),e.replace(/\b\w/g,(function(e){return e.toUpperCase()}))}},"4AmR":function(e,t,n){e.exports=n.p+"683e7a8e04465dc3fac39ed37f0789b8.png"},"4qhP":function(e,t,n){"use strict";n.r(t);var r=n("mrSG"),i=(n("YFKU"),n("ivNn")),o=n("7KDR"),u=n("OekH"),c=n("9XXR"),a=n("ogJP"),s=n("25b6");var d=n("Eyy1"),f=n("oNDq"),l=n("4AmR"),p=n("txPx");n.d(t,"bottomTradingTabClassName",(function(){return x})),n.d(t,"isPositionActive",(function(){return y})),n.d(t,"afterFeaturedBrokerIds",(function(){return k})),n.d(t,"createQueryParams",(function(){return w})),n.d(t,"convertActionDescriptionsToActions",(function(){return T})),n.d(t,"convertActionDescriptionsToPopupMenuDescriptions",(function(){return j})),n.d(t,"wrapDeferredWithPromise",(function(){return P})),n.d(t,"sideToText",(function(){return C})),n.d(t,"executionText",(function(){return A})),n.d(t,"orderTypeToText",(function(){return D})),n.d(t,"orderStatusToText",(function(){return E})),n.d(t,"orderStatusId",(function(){return F})),n.d(t,"isOrderActive",(function(){return S})),n.d(t,"pipSizeForForex",(function(){return M})),n.d(t,"findArraysDifferences",(function(){return L})),n.d(t,"isObjectDifferent",(function(){return I})),n.d(t,"objectsArrayToMap",(function(){return N})),n.d(t,"formatNumber",(function(){return U})),n.d(t,"isFinalOrderStatus",(function(){return B})),n.d(t,"retryWithChangingIntervals",(function(){return W})),n.d(t,"isOrderOrPositionMessageType",(function(){return R})),n.d(t,"roundToStepByPriceTypeAndSide",(function(){return q})),n.d(t,"getErrorMessage",(function(){return J})),n.d(t,"showDisconnectWarningIfNeeded",(function(){return Q})),n.d(t,"filteredBrokerIds",(function(){return X})),n.d(t,"getFeaturedBrokerIdx",(function(){return K})),n.d(t,"brokerMetaInfoById",(function(){return Y})),n.d(t,"brokersListFromPlans",(function(){return z})),n.d(t,"getSuitableDuration",(function(){return G})),n.d(t,"isOAuthAuthType",(function(){return H})),n.d(t,"TasksWithTermination",(function(){return V}));var h={},m={},b={},g=!1,v=Object(p.getLogger)("Trading.Utils"),x="js-bottom-trading-tab",y=function(e){return 0!==e.qty||0!==e.longQty&&void 0!==e.longQty||0!==e.shortQty&&void 0!==e.shortQty},k=["Paper"];function O(e){var t={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"};return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g,(function(e){return t[e]}))}function w(e){var t=[];return e&&Object.keys(e).forEach((function(n){t.push(O(n)+"="+O(e[n]))})),t.join("&")}function _(){g||(g=!0,h[2]=$.t("Market"),h[1]=$.t("Limit"),h[3]=$.t("Stop",{context:"order"}),
h[4]=$.t("StopLimit"),m[1]=$.t("Buy",{context:"trading"}),m[-1]=$.t("Sell",{context:"trading"}),b[2]=$.t("filled"),b[1]=$.t("cancelled"),b[6]=$.t("working"),b[3]=$.t("inactive"),b[4]=$.t("placing"),b[5]=$.t("rejected"))}function T(e){return e?e.map((function(e){return"-"===e.text||e.separator?new o.Separator:new o.Action({name:e.name,checkable:e.checkable,checked:e.checked,disabled:void 0!==e.enabled&&!e.enabled,shortcut:e.shortcut,label:e.text,statName:e.statName,icon:e.icon,onExecute:function(t){e.action({checkable:t.isCheckable(),checked:t.isChecked(),enabled:!t.isDisabled(),text:t.getLabel().toString()})}})})):[]}function j(e){return e?e.map((function(e){if("-"===e.text||e.separator)return{separator:!0};var t={};return e.checkable&&(t.icon={image:"url('"+l+"')",offset:e.checked?"0 -16px":""}),t.title=e.text,t.action=e.action,e.url&&(t.url=e.url),e.target&&(t.target=e.target),e.externalLink&&(t.externalLink=e.externalLink),t})):[]}function P(e){if(!e||!e.done)return e;var t=e;return new Promise((function(e,n){t.done((function(t){e(t)})).fail((function(e){n(e)}))}))}function C(e,t){_();var n=m[e];return t?n.toUpperCase():n}function A(e,t){var n=C(e.side)+" "+e.qty+" @ "+t.format(e.price);return n.substr(0,1).toUpperCase()+n.substr(1).toLowerCase()}function D(e,t){return _(),t?h[e].toUpperCase():h[e]}function E(e){return _(),b[e]}function F(e){switch(e){case 2:return"orderstatus-filled";case 1:return"orderstatus-cancelled";case 6:return"orderstatus-working";case 3:return"orderstatus-inactive";case 4:return"orderstatus-placing";case 5:return"orderstatus-rejected";default:return"orderstatus-unknown"}}function S(e){return 6===e||3===e}function M(e){return e.indexOf("JPY")===e.length-3?.01:1e-4}function L(e,t,n,r,i){var o={added:[],modified:[],removed:[]},u=e.slice(0);return t.forEach((function(t){var c=e.findIndex((function(e){return e[n]===t[n]}));if(-1!==c){u[c]=null;for(var s=e[c],d=0,f=r;d<f.length;d++){var l=f[d],p=!0;if(null===s[l]||"object"!=typeof s[l]?p=s[l]===t[l]:i&&(p=Object(a.deepEquals)(s[l],t[l])[0]),!p)return void o.modified.push(t)}}else o.added.push(t)})),u.forEach((function(e){e&&o.removed.push(e)})),o}function I(e,t,n){for(var r=0,i=n;r<i.length;r++){var o=i[r];if((null===e[o]||"object"!=typeof e[o])&&e[o]!==t[o])return!0}return!1}function N(e,t){return e.reduce((function(e,n){return e[n[t]]=n,e}),{})}function U(e){return Math.abs(e||0)<.001?"0.00":Object(c.splitThousands)((e||0).toFixed(2))}function B(e){return-1!==[2,1,5].indexOf(e)}function W(e,t){return void 0===t&&(t=[1,100,1e3,5e3]),function n(r){return e().catch((function(e){return r<t.length?(i=t[r],new Promise((function(e){setTimeout(e,i)}))).then((function(){return n(r+1)})):Promise.reject(e);var i}))}(0)}function R(e){return-1!==Object.keys(u.OrderOrPositionMessageType).map((function(e){return u.OrderOrPositionMessageType[e]})).indexOf(e)}function q(e,t,n,r){var o=0,u=Object(i.fixComputationError)(e/t);return(1===n&&1===r||2===n&&-1===r)&&(o=Math.floor(u)*t),(1===n&&-1===r||2===n&&1===r)&&(o=Math.ceil(u)*t),
Object(i.fixComputationError)(o)}function J(e){return void 0===e?window.t("Unknown error"):(t=e instanceof Error?e.message:"object"==typeof e?JSON.stringify(e):e.toString(),Object(s.d)(t));var t}function Q(e){var t=e.disconnectWarningMessage&&e.disconnectWarningMessage();return t?new Promise((function(e){Object(f.createConfirmDialog)({title:window.t("Disconnect Confirmation"),content:t,type:"modal",actions:[{name:"yes",type:"danger",text:window.t("Disconnect"),key:13},{name:"cancel",type:"default",text:window.t("Cancel"),method:"close"}]}).then((function(t){t.on("action:yes",(function(t){t.close(),e(!0)})),t.on("action:cancel",(function(t){t.close(),e(!1)})),t.open()}))})):Promise.resolve(!0)}function X(e){return e.map((function(e){return e.metainfo.id}))}function K(e){return e.findIndex((function(e){return e.brokerPlan&&!e.brokerPlan.hidden&&e.brokerPlan.flags&&e.brokerPlan.flags.includes("featured")}))}function Y(e,t){return Object(d.ensureDefined)(e.find((function(e){return e.id.toLowerCase()===t.toLowerCase()})))}function z(e,t){var n=e.map((function(e){return e.id})),i=t.map((function(e){return e.slug_name})),o=t.filter((function(e){return n.includes(e.slug_name)})).map((function(t){return{metainfo:Y(e,t.slug_name),brokerPlan:t}})),u=e.filter((function(e){return!i.includes(e.id)&&!k.includes(e.id)})).map((function(e){return{metainfo:e}})),c=K(o),a=k.map((function(t){return{metainfo:Y(e,t)}}));return a.length>0&&o.splice.apply(o,Object(r.__spreadArrays)([c+1,0],a)),Object(r.__spreadArrays)(o,u)}function G(e,t){if(void 0!==t&&t.length>0){var n=t.find((function(t){return"default"in t&&(void 0===t.supportedOrderTypes||t.supportedOrderTypes.includes(e))}))||t.find((function(t){return t.supportedOrderTypes&&t.supportedOrderTypes.includes(e)}));return n?{type:n.value}:void 0}}function H(e){return"oauth2-implicit-flow"===e||"oauth2-code-flow"===e}var V=function(){function e(e){this._isFinished=!1,this._isTerminated=!1,this._tasks=e}return e.prototype.execute=function(){var e=this;return this._isTerminated=!1,this._isExecuted()&&!this._isFinished?this.terminate().then((function(){return e._execution=e._execute()})):this._execution=this._execute()},e.prototype.terminate=function(){return Object(r.__awaiter)(this,void 0,void 0,(function(){var e;return Object(r.__generator)(this,(function(t){switch(t.label){case 0:if(!this._isExecuted()||this._isFinished)return[3,4];this._isTerminated=!0,t.label=1;case 1:return t.trys.push([1,3,,4]),[4,this._execution];case 2:return t.sent(),[3,4];case 3:return e=t.sent(),v.logWarn(e),[2,Promise.resolve()];case 4:return[2,Promise.resolve()]}}))}))},e.prototype._isExecuted=function(){return!!this._execution},e.prototype._execute=function(){return Object(r.__awaiter)(this,void 0,void 0,(function(){var e,t,n,i;return Object(r.__generator)(this,(function(r){switch(r.label){case 0:e=0,t=this._tasks,r.label=1;case 1:if(!(e<t.length))return[3,6];if(n=t[e],this._isTerminated)return[2,Promise.reject("Login tasks are terminated")];r.label=2;case 2:return r.trys.push([2,4,,5]),[4,n()];case 3:
return r.sent(),[3,5];case 4:return i=r.sent(),this._isFinished=!0,[2,Promise.reject("Failed to login: "+J(i))];case 5:return e++,[3,1];case 6:return this._isFinished=!0,[2]}}))}))},e}()},"9XXR":function(e,t,n){"use strict";n.r(t),n.d(t,"splitThousands",(function(){return i}));var r=n("ivNn");function i(e,t){void 0===t&&(t="&nbsp;");var n=e+"";-1!==n.indexOf("e")&&(n=function(e){return Object(r.fixComputationError)(e).toFixed(10).replace(/\.?0+$/,"")}(Number(e)));var i=n.split(".");return i[0].replace(/\B(?=(\d{3})+(?!\d))/g,t)+(i[1]?"."+i[1]:"")}}}]);