"use strict";
/* =====================================================================
   Gesprochene Erklärvideos (Originalton aus „ET2_Erklaervideos“).
   Die Animationen sind neu gebaut (videos-ton.js) und laufen im
   gleichen Player wie alle anderen Erklärvideos – mit Originalton.
   ===================================================================== */
const TONVIDS=[
 {id:'ton_riss',ch:'v1',after:'<div data-vid="wirbel"></div>'},
 {id:'ton_weg',ch:'v1',after:'<div data-vid="ton_riss"></div>'},
 {id:'ton_phase',ch:'v2',before:'<div data-sim="phase"></div>'},
 {id:'ton_sonde',ch:'v2',after:'<div data-sim="spulen"></div>'},
 {id:'ton_lift',ch:'v6',before:'<div data-sim="scan"></div>'},
 {id:'ton_filter',ch:'v2',after:'<div data-vid="lift"></div>'},
 {id:'ton_mehrf',ch:'v8',after:'<h3>8.3.3 Mehrfrequenz-Technik</h3>'},
 {id:'ton_hyst',ch:'v3',after:'<h2>3.1 Arten der Permeabilität</h2>'},
 {id:'ton_abheb',ch:'v12',after:'<h3>12.2.2 Wirbelstromverfahren</h3>'},
 {id:'ton_aehnl',ch:'v1',after:'<h3>1.5.2 Das Ähnlichkeitsgesetz der Wirbelstromprüfung</h3>'},
 {id:'ton_rohr',ch:'v2',after:'<h3>2.4.1 Der Durchlaufsensor (Koaxialsensor)</h3>'}];
TONVIDS.forEach(m=>{const ch=CHAPTERS.find(c=>c.id===m.ch);if(!ch||!VIDS[m.id])return;const tag='<div data-vid="'+m.id+'"></div>';
 if(m.after&&ch.html.includes(m.after))ch.html=ch.html.replace(m.after,m.after+'\n'+tag);
 else if(m.before&&ch.html.includes(m.before))ch.html=ch.html.replace(m.before,tag+'\n'+m.before);
 else ch.html+='\n'+tag});
/* Vertonte Originale ersetzen die gleichnamigen (vorgelesenen) Animationsvideos */
const TONREPLACE={lift:'ton_abheb',hyst:'ton_hyst',tiefe:'ton_tiefe'};
CHAPTERS.forEach(ch=>{Object.entries(TONREPLACE).forEach(([o,n])=>{if(!VIDS[n])return;const old='<div data-vid="'+o+'"></div>',neu='<div data-vid="'+n+'"></div>';if(!ch.html.includes(old))return;ch.html=ch.html.includes(neu)?ch.html.replace(old,''):ch.html.replace(old,neu)})});
