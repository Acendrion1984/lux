"use strict";
/* =====================================================================
   Gesprochene Erklärvideos (MP4 mit Originalton) aus „ET2_Erklaervideos“
   werden an passender Stelle in die Kapitel eingefügt.
   ===================================================================== */
const MP4S=[
 {id:'01_risserkennung_grundprinzip',ch:'v1',after:'<div data-vid="wirbel"></div>',title:'Risserkennung – Grundprinzip',dur:'0:54',sub:'Primärfeld, Wirbelströme, Störung durch den Riss, wandernder Impedanzpunkt'},
 {id:'03_phasensteller_auswertearten',ch:'v2',before:'<div data-sim="phase"></div>',title:'Phasensteller und Auswertearten',dur:'1:02',sub:'Signalbild drehen, Störgrößen unterdrücken, Amplitude oder Y-Komponente auswerten'},
 {id:'04_absolut_vs_differenzsonde',ch:'v2',after:'<div data-sim="spulen"></div>',title:'Absolut- und Differenzsonde',dur:'1:07',sub:'Zwei Prinzipien – unterschiedliche Stärken bei Rissprüfung und Eigenschaftsmessung'},
 {id:'02_lift-off_vs_riss',ch:'v6',before:'<div data-sim="scan"></div>',title:'Lift-off und Riss trennen',dur:'1:00',sub:'Warum der Abstand ein Störsignal erzeugt und wie man es vom Fehlersignal unterscheidet'}];
MP4S.forEach(m=>{const ch=CHAPTERS.find(c=>c.id===m.ch);if(!ch)return;const tag='<div data-mp4="'+m.id+'"></div>';
 if(m.after&&ch.html.includes(m.after))ch.html=ch.html.replace(m.after,m.after+'\n'+tag);
 else if(m.before&&ch.html.includes(m.before))ch.html=ch.html.replace(m.before,tag+'\n'+m.before);
 else ch.html+='\n'+tag});
function mountMp4(el){const m=MP4S.find(x=>x.id===el.dataset.mp4);if(!m)return;el.className='vid mp4';el.innerHTML='';
 el.append(h('header',{},h('span',{cls:'tag'},'ERKLÄRVIDEO · MIT TON'),h('span',{cls:'vt'},m.title),h('span',{cls:'vd'},m.dur+' min')));
 const v=h('video',{controls:true,playsinline:true,'webkit-playsinline':true,preload:'metadata',poster:'media/'+m.id+'.jpg'},h('source',{src:'media/'+m.id+'.mp4',type:'video/mp4'}),'Dein Browser kann dieses Video nicht abspielen.');
 el.append(h('div',{cls:'stage'},v),h('div',{cls:'cc mp4sub'},h('span',{},m.sub)));
 new IntersectionObserver(e=>{if(!e[0].isIntersecting&&!v.paused)v.pause()}).observe(el)}
