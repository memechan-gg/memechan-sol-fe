(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{"1yQO":function(e,i,t){"use strict";t.d(i,"a",(function(){return n}));var o=t("hY0g"),r=t.n(o);function n(e,i,t,o){void 0===o&&(o=null);var n={id:i,title:t,definitions:new r.a(e)};return null!==o&&(n.icon=o),n}},"25b6":function(e,i,t){"use strict";t.d(i,"b",(function(){return n})),t.d(i,"d",(function(){return l})),t.d(i,"c",(function(){return s})),t.d(i,"a",(function(){return c}));var o=/[<"'&>]/g,r=function(e){return"&#"+e.charCodeAt(0)+";"};function n(e){return e.replace(o,r)}function l(e){return void 0===e&&(e=""),e.replace(/(<([^>]+)>)/gi,"")}function s(e){return void 0===e&&(e=""),e.replace(/\s+/g,"")}function c(e){return void 0===e&&(e=""),e.replace(/\b\w/g,(function(e){return e.toUpperCase()}))}},Equz:function(e,i,t){"use strict";t.d(i,"a",(function(){return F}));var o=t("mrSG"),r=t("Eyy1"),n=t("HSjo"),l=t("n5al"),s=t("hY0g"),c=t.n(s),a=t("Kxc7"),d=t("Z5lT"),u=t("25b6"),h=window.t("Color Bars Based on Previous Close"),b=window.t("HLC Bars"),p=window.t("Up Color"),C=window.t("Down Color"),w=window.t("Thin Bars"),y=window.t("Body"),f=window.t("Borders"),j=window.t("Wick"),O=window.t("Price Source"),S=window.t("Type"),v=window.t("Line"),g=window.t("Top Line"),_=window.t("Bottom Line"),m=window.t("Fill"),P=window.t("Fill Top Area"),B=window.t("Fill Bottom Area"),L=window.t("Up bars"),M=window.t("Down bars"),k=window.t("Projection up bars"),D=window.t("Projection down bars"),T=window.t("Show real prices on price scale (instead of Heikin-Ashi price)"),E=window.t("Base Level"),A=window.t("Body"),I=window.t("Borders"),W=window.t("Labels");function U(e,i,t,o){var r=Object(u.c)(t);return[Object(n.r)({checked:Object(n.b)(e,i.drawBody,"Change "+t+" Body Visibility"),color1:Object(n.u)(e,i.upColor,null,"Change "+t+" Up Color"),color2:Object(n.u)(e,i.downColor,null,"Change "+t+" Down Color")},{id:o+"Symbol"+r+"CandlesColor",title:y}),Object(n.r)({checked:Object(n.b)(e,i.drawBorder,"Change "+t+" Border Visibility"),color1:Object(n.u)(e,i.borderUpColor,null,"Change "+t+" Up Border Color"),color2:Object(n.u)(e,i.borderDownColor,null,"Change "+t+" Down Border Color")},{id:o+"Symbol"+r+"BordersColor",title:f}),Object(n.r)({checked:Object(n.b)(e,i.drawWick,"Change "+t+" Wick Visibility"),color1:Object(n.u)(e,i.wickUpColor,null,"Change "+t+" Wick Up Color"),color2:Object(n.u)(e,i.wickDownColor,null,"Change "+t+" Wick Down Color")},{id:o+"Symbol"+r+"WickColors",title:j})]}function H(e,i,t,o){var r=[],l=Object(u.c)(t),s=Object(n.e)({color:Object(n.u)(e,i.upColor,null,"Change "+t+" Up Color")},{id:o+"Symbol"+l+"UpBars",title:L}),c=Object(n.e)({color:Object(n.u)(e,i.downColor,null,"Change "+t+" Down Color")},{id:o+"Symbol"+l+"DownBars",title:M}),a=Object(n.e)({color:Object(n.u)(e,i.upColorProjection,null,"Change "+t+" Projection Bar Up Color")},{id:o+"Symbol"+l+"ProjectionUpBars",title:k}),d=Object(n.e)({color:Object(n.u)(e,i.downColorProjection,null,"Change "+t+" Projection Bar Down Color")},{id:o+"Symbol"+l+"ProjectionDownBars",title:D});return r.push(s,c,a,d),r}
function x(e,i,t,o){var r=[],l=Object(u.c)(t),s=Object(n.r)({color1:Object(n.u)(e,i.upColor,null,"Change "+t+" Up Color"),color2:Object(n.u)(e,i.borderUpColor,null,"Change "+t+" Border Bar Up Color")},{id:o+"Symbol"+l+"UpBars",title:L}),c=Object(n.r)({color1:Object(n.u)(e,i.downColor,null,"Change "+t+" Down Color"),color2:Object(n.u)(e,i.borderDownColor,null,"Change "+t+" Border Bar Down Color")},{id:o+"Symbol"+l+"DownBars",title:M}),a=Object(n.r)({color1:Object(n.u)(e,i.upColorProjection,null,"Change "+t+" Projection Bar Up Color"),color2:Object(n.u)(e,i.borderUpColorProjection,null,"Change "+t+" Projection Border Bar Up Color")},{id:o+"Symbol"+l+"ProjectionUpBars",title:k}),d=Object(n.r)({color1:Object(n.u)(e,i.downColorProjection,null,"Change "+t+" Projection Bar Down Color"),color2:Object(n.u)(e,i.borderDownColorProjection,null,"Change "+t+" Projection Border Bar Up Color")},{id:o+"Symbol"+l+"ProjectionDownBars",title:D});return r.push(s,c,a,d),r}function F(e,i,t,s,u){switch(t){case 0:return function(e,i,t){return[Object(n.c)({checked:Object(n.b)(e,i.barColorsOnPrevClose,"Change Color Bars Based on Previous Close")},{id:t+"SymbolBarStyleBarColorsOnPrevClose",title:h}),Object(n.c)({checked:Object(n.b)(e,i.dontDrawOpen,"Change HLC Bars")},{id:t+"SymbolDontDrawOpen",title:b}),Object(n.e)({color:Object(n.u)(e,i.upColor,null,"Change Bar Up Color")},{id:t+"SymbolUpColor",title:p}),Object(n.e)({color:Object(n.u)(e,i.downColor,null,"Change Bar Down Color")},{id:t+"SymbolDownColor",title:C}),Object(n.c)({checked:Object(n.b)(e,i.thinBars,"Change Thin Bars")},{id:t+"SymbolBarThinBars",title:w})]}(e,i.barStyle.childs(),u);case 1:return function(e,i,t){var r=Object(n.c)({checked:Object(n.b)(e,i.barColorsOnPrevClose,"Change Color Bars Based on Previous Close")},{id:t+"SymbolCandleStyleBarColorsOnPrevClose",title:h});return Object(o.__spreadArrays)([r],U(e,i,"Candle",t))}(e,i.candleStyle.childs(),u);case 2:return function(e,i,t,o,r){return[Object(n.j)({option:Object(n.b)(e,i.priceSource,"Change Price Source")},{id:r+"SymbolLinePriceSource",title:O,options:new c.a(t)}),Object(n.j)({option:Object(n.b)(e,i.styleType,"Change Line Type")},{id:r+"SymbolStyleType",title:S,options:new c.a(o)}),Object(n.h)({color:Object(n.u)(e,i.color,null,"Change Line Color"),width:Object(n.b)(e,i.linewidth,"Change Line Width")},{id:r+"SymbolLineStyle",title:v})]}(e,i.lineStyle.childs(),s.seriesPriceSources,s.lineStyleTypes,u);case 3:return function(e,i,t,o){return[Object(n.j)({option:Object(n.b)(e,i.priceSource,"Change Area Price Source")},{id:o+"SymbolAreaPriceSource",title:O,options:new c.a(t)}),Object(n.h)({color:Object(n.u)(e,i.linecolor,null,"Change Area Line Color"),width:Object(n.b)(e,i.linewidth,"Change Area Line Width")},{id:o+"SymbolAreaLineStyle",title:v}),Object(n.r)({color1:Object(n.u)(e,i.color1,i.transparency,"Change Area Fill Color"),color2:Object(n.u)(e,i.color2,i.transparency,"Change Area Fill Color")},{id:o+"SymbolAreaFills",title:m})]}(e,i.areaStyle.childs(),s.seriesPriceSources,u);case 9:
return U(e,i.hollowCandleStyle.childs(),"Hollow Candles",u);case 10:return function(e,i,t,o){return[Object(n.j)({option:Object(n.b)(e,i.priceSource,"Change Baseline Price Source")},{id:o+"SymbolBaseLinePriceSource",title:O,options:new c.a(t)}),Object(n.h)({color:Object(n.u)(e,i.topLineColor,null,"Change Baseline Top Line Color"),width:Object(n.b)(e,i.topLineWidth,"Change Baseline Top Line Width")},{id:o+"SymbolBaseLineTopLine",title:g}),Object(n.h)({color:Object(n.u)(e,i.bottomLineColor,null,"Change Baseline Bottom Line Color"),width:Object(n.b)(e,i.bottomLineWidth,"Change Baseline Bottom Line Width")},{id:o+"SymbolBaseLineBottomLine",title:_}),Object(n.r)({color1:Object(n.u)(e,i.topFillColor1,null,"Change Baseline Fill Top Area Color"),color2:Object(n.u)(e,i.topFillColor2,null,"Change Baseline Fill Top Area Color")},{id:o+"SymbolBaseLineTopFills",title:P}),Object(n.r)({color1:Object(n.u)(e,i.bottomFillColor1,null,"Change Baseline Fill Bottom Area Color"),color2:Object(n.u)(e,i.bottomFillColor2,null,"Change Baseline Fill Bottom Area Color")},{id:o+"SymbolBaseLineBottomFills",title:B}),Object(n.i)({value:Object(n.b)(e,i.baseLevelPercentage,"Change Base Level",[d.b])},{id:o+"SymbolBaseLevelPercentage",title:E,type:0,min:new c.a(0),max:new c.a(100),step:new c.a(1),unit:new c.a("%")})]}(e,i.baselineStyle.childs(),s.seriesPriceSources,u)}if(!i.hasOwnProperty("haStyle"))return[];if(s.isJapaneseChartsAvailable&&8===t)return function(e,i,t){var r=Object(n.c)({checked:Object(n.b)(e,i.showRealLastPrice,"Change Show real prices on price scale (instead of Heiken-Ashi price)")},{id:t+"SymbolRealLastPrice",title:T}),l=Object(n.c)({checked:Object(n.b)(e,i.barColorsOnPrevClose,"Change Color Bars Based on Previous Close")},{id:t+"SymbolHAStyleBarColorsOnPrevClose",title:h});return Object(o.__spreadArrays)([r,l],U(e,i,"Heikin Ashi",t))}(e,i.haStyle.childs(),u);if(s.isJapaneseChartsAvailable&&a.enabled("japanese_chart_styles")&&(4===t||5===t||6===t||7===t||8===t))switch(t){case 4:return function(e,i,t){return Object(o.__spreadArrays)(x(e,i,"Renko",t))}(e,i.renkoStyle.childs(),u);case 5:return H(e,i.kagiStyle.childs(),"Kagi",u);case 6:return H(e,i.pnfStyle.childs(),"Point & Figure",u);case 7:return x(e,i.pbStyle.childs(),"Line Break",u)}if(a.enabled("chart_style_hilo")&&12===t){var y=i.hiloStyle.childs(),f=Object(l.chartStyleStudyId)(12);return function(e,i,t,o){var r=Object(n.e)({checked:Object(n.b)(e,i.drawBody,"Change High-Low Body Visibility"),color:Object(n.u)(e,i.color,null,"Change High-Low Body Color")},{id:o+"SymbolBodiesColor",title:A}),l=Object(n.e)({checked:Object(n.b)(e,i.showBorders,"Change Show High-Low Borders"),color:Object(n.u)(e,i.borderColor,null,"Change High-Low Border Color")},{id:o+"SymbolBorderColor",title:I}),s=t.map((function(e){return{title:String(e),value:e}}));return[r,l,Object(n.p)({checked:Object(n.b)(e,i.showLabels,"Change Show High-Low Labels"),color:Object(n.u)(e,i.labelColor,null,"Change High-Low Labels Color"),size:Object(n.b)(e,i.fontSize,"Change High-Low Labels Font Size")},{id:o+"SymbolLabels",
title:W,isEditable:!1,isMultiLine:!1,sizeItems:s})]}(e,y,Object(r.ensure)(s.defaultSeriesFontSizes)[f],u)}return[]}},Z5lT:function(e,i,t){"use strict";t.d(i,"b",(function(){return r})),t.d(i,"a",(function(){return n})),t.d(i,"c",(function(){return l}));var o=t("T6Of");function r(e){return Math.floor(e)}function n(e){return parseInt(String(e))}function l(e){var i=new o.LimitedPrecisionNumericFormatter(e);return function(e){if(null===e)return e;var t=i.parse(i.format(e));return t.res?t.value:null}}},zqjM:function(e,i,t){"use strict";var o=t("mrSG"),r=t("Eyy1"),n=t("HSjo"),l=t("hY0g"),s=t.n(l),c=t("n5al"),a=t("dfhE"),d=t("Equz"),u=t("Z5lT");function h(e){return e.map((function(e){return{value:e,title:window.t(e)}}))}function b(e,i,t,o,l,a,d){var b=[];return t.forEach((function(t){if(function(e,i){return!e.isHidden&&(void 0===e.visible||function(e,i){if(!e)return!0;var t=e.split("==");return!(t.length<2)&&i[t[0]].value()===t[1]}(e.visible,i))}(t,o)){var p=t.id;if(o.hasOwnProperty(p)){var C=o[p],w=function(e,i){return"style"===e.id?window.t("Box size assignment method"):"boxSize"===e.id?window.t("Box Size"):window.t(i.childs().name.value())}(t,l[p]);if("options"in t){var y=Object(r.ensure)(t.options);b.push(Object(n.j)({option:Object(n.b)(e,C,"Change "+w)},{id:""+d+t.name,title:w,options:new s.a(h(y))}))}else if("integer"!==t.type){if("float"===t.type){var f=void 0;return f=function(e,i){return!((i===Object(c.chartStyleStudyId)(4)||i===Object(c.chartStyleStudyId)(6))&&"boxSize"===e||i===Object(c.chartStyleStudyId)(5)&&"reversalAmount"===e)}(p,i)||null===a.value()?new s.a(t.min):a,void b.push(Object(n.i)({value:Object(n.b)(e,C,"Change "+w)},{id:""+d+t.name,title:w,type:1,min:f,max:new s.a(t.max),defval:t.defval}))}"text"!==t.type?"bool"!==t.type||b.push(Object(n.c)({checked:Object(n.b)(e,C,"Change "+w)},{id:""+d+t.name,title:w})):b.push(Object(n.p)({text:Object(n.b)(e,C,"Change "+w)},{id:""+d+t.name,title:w,isEditable:!0,isMultiLine:!1}))}else b.push(Object(n.i)({value:Object(n.b)(e,C,"Change "+w,[u.b])},{id:""+d+t.name,title:w,type:0,min:new s.a(t.min),max:new s.a(t.max),defval:t.defval}))}}})),b}var p,C=t("txPx"),w=t("Cf1E");t.d(i,"b",(function(){return U})),t.d(i,"c",(function(){return H})),t.d(i,"d",(function(){return x})),t.d(i,"a",(function(){return F}));var y=Object(C.getLogger)("Chart.Definitions.Series"),f=(window.t("Adjust Data for Dividends"),window.t("Extended Hours (Intraday Only)")),j=window.t("Last Price Line"),O=window.t("Previous Day Close Price Line"),S=window.t("Bid and Ask lines"),v=(window.t("Pre/Post Market Price Line"),window.t("Precision")),g=window.t("Time Zone"),_=window.t("Open"),m=window.t("High"),P=window.t("Low"),B=window.t("Close"),L=window.t("(H + L)/2"),M=window.t("(H + L + C)/3"),k=window.t("(O + H + L + C)/4"),D=window.t("Simple"),T=window.t("With Markers"),E=window.t("Step"),A=window.t("Default"),I=((p={})[Object(c.chartStyleStudyId)(12)]=[7,8,9,10,11,12,14,16,20,24,28,32,40],p),W=[{priceScale:1,minMove:1,frac:!1},{priceScale:10,minMove:1,frac:!1},{priceScale:100,minMove:1,frac:!1},{
priceScale:1e3,minMove:1,frac:!1},{priceScale:1e4,minMove:1,frac:!1},{priceScale:1e5,minMove:1,frac:!1},{priceScale:1e6,minMove:1,frac:!1},{priceScale:1e7,minMove:1,frac:!1},{priceScale:1e8,minMove:1,frac:!1},{priceScale:2,minMove:1,frac:!0},{priceScale:4,minMove:1,frac:!0},{priceScale:8,minMove:1,frac:!0},{priceScale:16,minMove:1,frac:!0},{priceScale:32,minMove:1,frac:!0},{priceScale:64,minMove:1,frac:!0},{priceScale:128,minMove:1,frac:!0},{priceScale:320,minMove:1,frac:!0}],U=[{title:_,value:"open"},{title:m,value:"high"},{title:P,value:"low"},{title:B,value:"close"},{title:L,value:"hl2"},{title:M,value:"hlc3"},{title:k,value:"ohlc4"}],H=[{title:D,value:a.STYLE_LINE_TYPE_SIMPLE},{title:T,value:a.STYLE_LINE_TYPE_MARKERS},{title:E,value:a.STYLE_LINE_TYPE_STEP}];function x(){for(var e=[{title:A,value:"default"}],i=0;i<W.length;i++)e.push({title:W[i].minMove+"/"+W[i].priceScale,value:W[i].priceScale+","+W[i].minMove+","+W[i].frac});return e}var F=function(){function e(e,i,t,o,r,n){this._definitions=null,this._inputsSubscriptions=null,this._isDestroyed=!1,this._propertyPages=null,this._seriesMinTickWV=null,this._series=e,this._undoModel=i,this._model=this._undoModel.model(),this._propertyPageId=t,this._propertyPageName=o,this._propertyPageIcon=r,this._timezonePropertyObj=n,this._series.onStyleChanged().subscribe(this,this._updateDefinitions),this._series.dataEvents().symbolResolved().subscribe(this,this._updateSeriesMinTickWV),this._updateSeriesMinTickWV()}return e.prototype.destroy=function(){null!==this._propertyPages&&this._propertyPages.forEach((function(e){Object(n.t)(e.definitions.value())})),this._series.onStyleChanged().unsubscribe(this,this._updateDefinitions),this._series.dataEvents().symbolResolved().unsubscribeAll(this),this._unsubscribeInputsUpdate(),this._isDestroyed=!0},e.prototype.propertyPages=function(){var e=this;return null===this._propertyPages?this._getDefinitions().then((function(i){if(e._isDestroyed)throw new Error("SeriesPropertyDefinitionsViewModel already destroyed");return null===e._propertyPages&&(e._propertyPages=[{id:e._propertyPageId,title:e._propertyPageName,icon:e._propertyPageIcon,definitions:new s.a(i)}]),e._propertyPages})):Promise.resolve(this._propertyPages)},e.prototype._seriesMinTick=function(){var e=this._series.symbolInfo();return null!==e?e.minmov/e.pricescale:null},e.prototype._updateSeriesMinTickWV=function(){null===this._seriesMinTickWV?this._seriesMinTickWV=new s.a(this._seriesMinTick()):this._seriesMinTickWV.setValue(this._seriesMinTick())},e.prototype._updateDefinitions=function(){var e=this;null!==this._definitions&&Object(n.t)(this._definitions),this._definitions=null,this._unsubscribeInputsUpdate(),this._createSeriesDefinitions().then((function(i){if(e._isDestroyed)throw new Error("SeriesPropertyDefinitionsViewModel already destroyed");Object(r.ensureNotNull)(e._propertyPages)[0].definitions.setValue(i)}))},e.prototype._getDefinitions=function(){return null===this._definitions?this._createSeriesDefinitions():Promise.resolve(this._definitions)},
e.prototype._unsubscribeInputsUpdate=function(){var e=this;null!==this._inputsSubscriptions&&(this._inputsSubscriptions.forEach((function(i){i.unsubscribeAll(e)})),this._inputsSubscriptions=null)},e.prototype._subscribeInputsUpdate=function(e,i){var t=this,o=[];e.forEach((function(e){if(void 0!==e.visible){var r=e.visible.split("==");if(2===r.length){var n=i[r[0]];-1===o.indexOf(n)&&(n.subscribe(t,t._updateDefinitions),o.push(n))}}})),o.length>0?this._inputsSubscriptions=o:this._inputsSubscriptions=null},e.prototype._createSeriesDefinitions=function(){var e=this,i=this._series.properties().childs(),t=this._series.getInputsProperties(),l=this._series.getInputsInfoProperties(),a=i.style.value(),u=this._series.getStyleShortName();return new Promise((function(i){var o=Object(c.chartStyleStudyId)(a);null!==o?e._model.studyMetaInfoRepository().findById({type:"java",studyId:o}).then((function(o){if(e._isDestroyed)throw new Error("SeriesPropertyDefinitionsViewModel already destroyed");if(null===e._definitions){var n=Object(r.ensureNotNull)(e._seriesMinTickWV),s=b(e._undoModel,o.id,o.inputs,t,l,n,u);e._subscribeInputsUpdate(o.inputs,t),i(s)}else i(null)})).catch((function(e){y.logWarn("Find meta info for create series definitions with error - "+Object(w.a)(e)),i(null)})):i(null)})).then((function(t){if(e._isDestroyed)throw new Error("SeriesPropertyDefinitionsViewModel already destroyed");if(null!==e._definitions)return e._definitions;var r=Object(d.a)(e._undoModel,i,a,{seriesPriceSources:U,lineStyleTypes:H,isJapaneseChartsAvailable:!0,defaultSeriesFontSizes:I},"mainSeries");null!==t&&r.push.apply(r,t);var l=Object(n.j)({option:Object(n.b)(e._undoModel,i.minTick,"Change Decimal Places")},{id:u+"SymbolMinTick",title:v,options:new s.a(x())}),c=Object(n.j)({option:Object(n.b)(e._undoModel,e._timezonePropertyObj.property,"Change Timezone")},{id:u+"SymbolTimezone",title:g,options:new s.a(e._timezonePropertyObj.values)});return e._definitions=Object(o.__spreadArrays)([Object(n.k)(r,"generalSymbolStylesGroup")],e._seriesPriceLinesDefinitions(u),e._seriesDataDefinitions(u),[l,c]),e._definitions}))},e.prototype._seriesDataDefinitions=function(e){this._series.dividendsAdjustmentProperty();return[]},e.prototype._createOutOfSessionDefinition=function(e){var i=this._series.properties().childs().extendedHours,t=this._model.sessions().properties().childs().graphics.childs().backgrounds.childs().outOfSession.childs();return Object(n.e)({disabled:Object(n.b)(this._undoModel,this._series.isDWMProperty(),"Change Disabled Extended hours visibility"),checked:Object(n.b)(this._undoModel,i,"Change Extended hours visibility"),color:Object(n.u)(this._undoModel,t.color,t.transparency,"Change Extended hours color")},{id:e+"SymbolExtendedHours",title:f})},e.prototype._createPrePostMarketDefinition=function(e){var i=this._series.properties().childs().extendedHours,t=this._model.sessions(),o=t.properties().childs().graphics.childs().backgrounds.childs().preMarket.childs(),r=t.properties().childs().graphics.childs().backgrounds.childs().postMarket.childs()
;return Object(n.r)({disabled:Object(n.b)(this._undoModel,this._series.isDWMProperty(),"Change Disabled Extended hours visibility"),checked:Object(n.b)(this._undoModel,i,"Change Extended hours visibility"),color1:Object(n.u)(this._undoModel,o.color,o.transparency,"Change Pre Market Color"),color2:Object(n.u)(this._undoModel,r.color,r.transparency,"Change Post Market Down Color")},{id:e+"SymbolExtendedHours",title:f})},e.prototype._seriesPriceLinesDefinitions=function(e){var i=[],t=this._series.properties().childs();if(this._series.hasClosePrice()){var o=Object(n.h)({checked:Object(n.b)(this._undoModel,t.showPriceLine,"Change Price Price Line"),color:Object(n.u)(this._undoModel,t.priceLineColor,null,"Change Price Line Color"),width:Object(n.b)(this._undoModel,t.priceLineWidth,"Change Price Line Width")},{id:e+"SymbolLastValuePriceLine",title:j});i.push(o)}if(this._series.hasClosePrice()){var r=Object(n.h)({disabled:Object(n.b)(this._undoModel,this._series.isDWMProperty(),"Change Price Previous Close Price Line"),checked:Object(n.b)(this._undoModel,t.showPrevClosePriceLine,"Change Price Previous Close Price Line"),color:Object(n.u)(this._undoModel,t.prevClosePriceLineColor,null,"Change Previous Close Price Line Color"),width:Object(n.b)(this._undoModel,t.prevClosePriceLineWidth,"Change Previous Close Price Line Width")},{id:e+"SymbolPrevClosePriceLine",title:O});i.push(r)}if(this._model.hasCustomSource("bidask")){var l=t.bidAsk,s=Object(n.r)({checked:Object(n.b)(this._undoModel,l.childs().visible,"Change Bid and Ask lines Visibility"),color1:Object(n.u)(this._undoModel,l.childs().bidLineColor,null,"Change Bid line Color"),color2:Object(n.u)(this._undoModel,l.childs().askLineColor,null,"Change Ask line Color")},{id:e+"SymbolBidAskLines",title:S});i.push(s)}return i},e}()}}]);