"use strict";
/* ===== Helfer ===== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, TAU=Math.PI*2, D2R=Math.PI/180;
function h(tag,at,...kids){const e=document.createElement(tag);if(at)for(const k in at){if(at[k]===false||at[k]==null)continue;if(at[k]===true){e.setAttribute(k,'');continue}if(k==='cls')e.className=at[k];else if(k==='html')e.innerHTML=at[k];else if(k.startsWith('on'))e.addEventListener(k.slice(2),at[k]);else e.setAttribute(k,at[k]);}
 for(const c of kids.flat())if(c!=null)e.append(c.nodeType?c:document.createTextNode(c));return e;}
const fmt=(x,d=2)=>Number.isFinite(x)?x.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}).replace(/^-(0[,.]?0*)$/,'$1'):'–';
function fmtg(x){const a=Math.abs(x);if(a<1e-9)return'0';return fmt(x,a>=100?0:a>=10?1:a>=1?2:a>=.1?3:4)}
let _seed=7;function srand(s){_seed=s}function rnd(){_seed=(_seed*1664525+1013904223)%4294967296;return _seed/4294967296}
function gauss(){let u=0,v=0;while(!u)u=rnd();v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(TAU*v)}
const ease=x=>x<0?0:x>1?1:x*x*(3-2*x),seg01=(t,a,b)=>ease((t-a)/(b-a)),easeOut=x=>1-Math.pow(1-clamp(x,0,1),3),easeIO=x=>{x=clamp(x,0,1);return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2};
/* Komplexe Zahlen [re,im] */
const Cx={add:(a,b)=>[a[0]+b[0],a[1]+b[1]],sub:(a,b)=>[a[0]-b[0],a[1]-b[1]],mul:(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]],
 div:(a,b)=>{const d=b[0]*b[0]+b[1]*b[1];return[(a[0]*b[0]+a[1]*b[1])/d,(a[1]*b[0]-a[0]*b[1])/d]},abs:a=>Math.hypot(a[0],a[1]),arg:a=>Math.atan2(a[1],a[0]),
 pol:(r,p)=>[r*Math.cos(p),r*Math.sin(p)],sc:(a,s)=>[a[0]*s,a[1]*s]};
/* Wirbelstrom-Vollzylinder in langer Spule: mu_eff = 2 J1(z)/(z J0(z)), z = x*e^{j3pi/4}, x^2 = f/fg */
function muEffRod(k){if(k<1e-6)return[1,0];const x=Math.sqrt(k),z=Cx.pol(x,.75*Math.PI);const N=Math.ceil(x)+40;let r=[0,0];
 for(let n=N;n>=1;n--){r=Cx.div([1,0],Cx.sub(Cx.sc(Cx.div([1,0],z),2*n),r));}return Cx.div(Cx.sc(r,2),z);}
function normImp(k,eta,mur=1){const m=muEffRod(k);return{X:1-eta+eta*mur*m[0],R:-eta*mur*m[1]}}
/* ===== Fortschritt ===== */
const Store={d:{quiz:{}},load(){try{const s=localStorage.getItem('et2_el');if(s)this.d=JSON.parse(s);if(!this.d.quiz)this.d.quiz={}}catch(e){}},save(){try{localStorage.setItem('et2_el',JSON.stringify(this.d))}catch(e){}}};Store.load();
/* ===== Registry ===== */
const SIMS={},VIDS={},PAGES={},CHAPTERS=[];
function sim(id,title,task,init){SIMS[id]={title,task,init}}
function vid(id,o){VIDS[id]=o}
const TOUCH=matchMedia('(pointer:coarse)').matches;
/* ===== Controls ===== */
function slider(p,o){const out=h('output'),inp=h('input',{type:'range',min:o.log?Math.log10(o.min):o.min,max:o.log?Math.log10(o.max):o.max,step:o.log?'any':(o.step||'any')});
 const val=()=>o.log?Math.pow(10,+inp.value):+inp.value;const show=()=>{out.textContent=(o.fmt?o.fmt(val()):fmtg(val()))+(o.unit?' '+o.unit:'')};
 inp.value=o.log?Math.log10(o.value):o.value;show();inp.addEventListener('input',()=>{show();o.on&&o.on(val())});
 const el=h('label',{cls:'ctl'},h('span',{cls:'lb'},h('span',{},o.label),out),inp);p.append(el);
 return{el,get:val,set(v){inp.value=o.log?Math.log10(v):v;show()},inp};}
function seg(p,opts,cur,on){const wrap=h('div',{cls:'seg'});const bs=opts.map(([v,l])=>h('button',{type:'button',onclick:()=>{pick(v);on(v)}},l));bs.forEach(b=>wrap.append(b));
 function pick(v){bs.forEach((b,i)=>b.classList.toggle('on',opts[i][0]===v));wrap.val=v}pick(cur);p.append(wrap);wrap.pick=pick;return wrap;}
function btn(p,t,on,cls=''){const b=h('button',{type:'button',cls:'btn '+cls,onclick:on},t);p.append(b);return b}
function readouts(p,defs){const wrap=h('div',{cls:'ro'});const els={};defs.forEach(([k,l])=>{const b=h('b',{},'–');els[k]=b;wrap.append(h('div',{},l,b))});p.append(wrap);
 return(k,v,cls)=>{if(!els[k])return;if(els[k].textContent!==String(v))els[k].textContent=v;const d=els[k].parentNode;const c=cls||'';if(d.className!==c)d.className=c}}
/* ===== Canvas ===== */
function cvs(p,o={}){const c=h('canvas',{cls:o.dark?'dark':''});p.append(c);const ctx=c.getContext('2d');const O={c,ctx,w:300,h:200,draw:o.draw||(()=>{}),ar:o.ar||.6};
 function rs(){const w=c.clientWidth||p.clientWidth||300;let ar=typeof O.ar==='function'?O.ar(w):O.ar;if(o.arNarrow&&w<520)ar=o.arNarrow;const hh=Math.round(w*ar);const d=Math.min(2.5,window.devicePixelRatio||1);
  c.width=Math.round(w*d);c.height=Math.round(hh*d);c.style.height=hh+'px';O.w=w;O.h=hh;ctx.setTransform(d,0,0,d,0,0);O.redraw()}
 O.redraw=()=>{if(!c.isConnected){CANVASES.delete(O);return}ctx.clearRect(0,0,O.w,O.h);ctx.save();O.draw(ctx,O.w,O.h);ctx.restore()};
 CANVASES.add(O);new ResizeObserver(()=>rs()).observe(c);setTimeout(rs,0);
 O.drag=cb=>{let on=false;const pos=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*(O.w/r.width),(e.clientY-r.top)*(O.h/r.height)]};
  c.addEventListener('pointerdown',e=>{on=true;try{c.setPointerCapture(e.pointerId)}catch(_){}const[x,y]=pos(e);cb(x,y,'down');e.preventDefault()});
  c.addEventListener('pointermove',e=>{if(on){const[x,y]=pos(e);cb(x,y,'move');e.preventDefault()}else if(o.hover){const[x,y]=pos(e);cb(x,y,'hover')}});
  const up=()=>{if(on){on=false;cb(0,0,'up')}};c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);c.classList.add('drag')};
 return O;}
/* Animationsschleife, laeuft nur wenn sichtbar */
function animate(O,step){let vis=true,last=0,run=true;new IntersectionObserver(es=>{vis=es[0].isIntersecting}).observe(O.c);
 function f(t){if(!O.c.isConnected)return;if(vis&&run&&!document.hidden){const dt=Math.min(.05,(t-last)/1000||0);step&&step(dt,t/1000);O.redraw()}last=t;requestAnimationFrame(f)}requestAnimationFrame(f);return{pause(v){run=!v}}}
/* Zeichen-Utilities (Kompatibilität) */
function mapper(r,xr,yr){return{x:v=>r.x+(v-xr[0])/(xr[1]-xr[0])*r.w,y:v=>r.y+r.h-(v-yr[0])/(yr[1]-yr[0])*r.h}}
function axes(ctx,r,xr,yr,o={}){return G.plot(ctx,r,xr,yr,{xl:o.xl,yl:o.yl,xf:o.xf,yf:o.yf,nx:o.nx||5,ny:o.ny||4,yo:o.yo,noxl:o.nolab,noyl:o.nolab,zero:o.zero})}
function line(ctx,pts,col,lw=2,dash){G.line(ctx,pts,col,lw,{dash})}
function dot(ctx,x,y,r,col){G.dot(ctx,x,y,r,col,{ring:r>3?undefined:false})}
function arrow(ctx,x1,y1,x2,y2,col,lw=2.5,hs){G.arrow(ctx,x1,y1,x2,y2,col,{lw,head:hs||undefined})}
function text(ctx,t,x,y,col,sz=13,al='left',wt=''){G.text(ctx,t,x,y,{col:col||T.ink,size:sz,align:al,weight:wt==='bold'?700:500})}
function rrect(ctx,x,y,w,hh,r){G.rr(ctx,x,y,w,hh,r)}
function screenGrid(ctx,x,y,w,hh,lbl){return G.screen(ctx,x,y,w,hh,{label:lbl,bezel:0})}
/* ===== Simulation mounten ===== */
function mountSim(el){const id=el.dataset.sim,S=SIMS[id];if(!S){el.textContent='Simulation fehlt: '+id;return}
 el.className='sim';el.innerHTML='';el.append(h('header',{},h('span',{cls:'tag'},'SIMULATION'),h('b',{},S.title)));const b=h('div',{cls:'body'});el.append(b);
 if(S.task)b.append(h('div',{cls:'task',html:S.task}));try{S.init(b)}catch(e){console.error(id,e);b.append(h('pre',{},'Fehler: '+e.message))}}
/* ===== Video-Player (Szenen, Kapitelmarken, Untertitel, Vollbild) ===== */
function mountVid(el){const id=el.dataset.vid,V=VIDS[id];if(!V)return;el.className='vid';el.innerHTML='';
 const caps=V.caps,scenes=V.scenes||caps.map((c,i)=>({t:c[0],n:c[2]||''}));
 el.append(h('header',{},h('span',{cls:'tag'},'ERKLÄRVIDEO'),h('span',{cls:'vt'},V.title),h('span',{cls:'vd'},Math.floor(V.dur/60)+':'+String(Math.round(V.dur%60)).padStart(2,'0')+' min')));
 const stage=h('div',{cls:'stage'});el.append(stage);let t=0,playing=false,speed=1,last=0,ccOn=true;
 const O=cvs(stage,{ar:.5625,draw:(ctx,w,hh)=>{V.draw(ctx,t,w,hh);vignette(ctx,w,hh)}});O.c.style.background='#0b1724';CANVASES.delete(O);CANVASES.add(O);
 const vignette=(c,w,hh)=>{const g=c.createRadialGradient(w/2,hh/2,Math.min(w,hh)*.4,w/2,hh/2,Math.max(w,hh)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.35)');c.fillStyle=g;c.fillRect(0,0,w,hh)};
 const cc=h('div',{cls:'cc'}),big=h('button',{type:'button',cls:'bigplay','aria-label':'Abspielen'},h('span',{},'▶'));stage.append(cc,big);
 const pb=h('button',{type:'button',cls:'pp','aria-label':'Abspielen'},'▶'),bar=h('div',{cls:'tl'}),fill=h('i',{}),knob=h('b',{}),tm=h('span',{cls:'tm'},'0:00'),sp=h('button',{type:'button'},'1×'),ccb=h('button',{type:'button',cls:'on',title:'Untertitel'},'CC'),fs=h('button',{type:'button',title:'Vollbild','aria-label':'Vollbild'},'⛶');const SS=window.speechSynthesis;let tts=false,spoken='';const tb=h('button',{type:'button',title:'Sprechtext vorlesen','aria-label':'Ton'},'🔇');
 const vo=()=>{const v=SS?SS.getVoices():[];return v.find(x=>/^de/i.test(x.lang)&&/natural|online|google|premium|enhanced/i.test(x.name))||v.find(x=>/^de/i.test(x.lang))};
 const stopS=()=>{if(SS)SS.cancel();spoken=''};const say=txt=>{if(!tts||!SS||!playing||!txt||txt===spoken)return;spoken=txt;SS.cancel();const u=new SpeechSynthesisUtterance(txt.replace(/_\{?([^}\s]+)\}?/g,'$1'));const x=vo();if(x)u.voice=x;u.lang='de-DE';u.rate=Math.min(1.25,Math.max(.9,speed));SS.speak(u)};
 tb.onclick=()=>{tts=!tts;tb.textContent=tts?'🔊':'🔇';tb.classList.toggle('on',tts);if(!tts)stopS();else{spoken='';caption()}};
 bar.append(fill,knob);scenes.forEach(s=>{if(s.t>0)bar.append(h('u',{style:'left:'+(100*s.t/V.dur)+'%'}))});
 const chips=h('div',{cls:'chap'});scenes.forEach((s,i)=>{if(s.n)chips.append(h('button',{type:'button',onclick:()=>{t=s.t+.01;upd();if(!playing)toggle()}},(i+1)+' · '+s.n))});
 el.append(h('div',{cls:'vc'},pb,bar,tm,ccb,sp,fs));if(chips.children.length)el.append(chips);
 const caption=()=>{let c='';for(const[t0,tx]of caps)if(t>=t0)c=tx;if(cc.dataset.t!==c){cc.dataset.t=c;cc.innerHTML=c?'<span>'+c+'</span>':'';cc.classList.remove('in');void cc.offsetWidth;cc.classList.add('in')}cc.style.display=ccOn?'':'none';cc.style.visibility=c?'':'hidden'};
 const upd=()=>{const p=100*t/V.dur;fill.style.width=p+'%';knob.style.left=p+'%';const s=Math.floor(t);tm.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')+' / '+Math.floor(V.dur/60)+':'+String(Math.round(V.dur%60)).padStart(2,'0');caption();
  $$('button',chips).forEach((b,i)=>{const sc=scenes.filter(s=>s.n);const a=sc[i].t,e=sc[i+1]?sc[i+1].t:V.dur;b.classList.toggle('on',t>=a&&t<e)});O.redraw()};
 const toggle=()=>{if(t>=V.dur-.05)t=0;playing=!playing;if(!playing)stopS();else{spoken='';setTimeout(caption,0)}pb.textContent=playing?'❚❚':'▶';big.style.display=playing?'none':'';el.classList.toggle('playing',playing)};
 pb.onclick=toggle;big.onclick=toggle;O.c.addEventListener('click',toggle);
 const seek=e=>{const r=bar.getBoundingClientRect();t=clamp((e.clientX-r.left)/r.width,0,1)*V.dur;stopS();upd()};let sk=false;
 bar.addEventListener('pointerdown',e=>{sk=true;try{bar.setPointerCapture(e.pointerId)}catch(_){}seek(e)});bar.addEventListener('pointermove',e=>{if(sk)seek(e)});bar.addEventListener('pointerup',()=>sk=false);bar.addEventListener('pointercancel',()=>sk=false);
 sp.onclick=()=>{speed=speed===1?1.5:speed===1.5?.5:1;sp.textContent=String(speed).replace('.',',')+'×'};ccb.onclick=()=>{ccOn=!ccOn;ccb.classList.toggle('on',ccOn);caption()};
 fs.onclick=()=>{const f=el.requestFullscreen||el.webkitRequestFullscreen;if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document)}else if(f){f.call(el)}else el.classList.toggle('pseudo-fs')};
 el.tabIndex=0;el.addEventListener('keydown',e=>{if(e.key===' '||e.key==='k'){e.preventDefault();toggle()}else if(e.key==='ArrowRight'){t=Math.min(V.dur,t+5);upd()}else if(e.key==='ArrowLeft'){t=Math.max(0,t-5);upd()}});
 let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(!vis&&playing)toggle();if(!vis)stopS()}).observe(el);
 (function f(ts){if(!el.isConnected){stopS();return}if(playing&&vis){t+=Math.min(.05,(ts-last)/1000||0)*speed;if(t>=V.dur){t=V.dur;playing=false;setTimeout(()=>{if(!playing&&SS&&!SS.speaking)spoken=''},0);pb.textContent='↻';big.style.display='';el.classList.remove('playing')}upd()}last=ts;requestAnimationFrame(f)})(0);
 setTimeout(upd,50);}
/* ===== Quiz ===== */
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function mountQuiz(el,qs,id,title,opts={}){el.className='quiz';el.innerHTML='';let Q,i,res,sc;
 const hd=h('header',{},h('span',{},'✎ '+(title||'Wissens-Check')),h('span',{}));const bd=h('div',{cls:'qb'});el.append(hd,bd);
 function start(set){Q=shuffle(set||qs).map(q=>{const o=Object.assign({},q);if(q.o){const idx=shuffle(q.o.map((_,k)=>k));o.o=idx.map(k=>q.o[k]);o.a=q.t==='multi'?q.a.map(a=>idx.indexOf(a)):idx.indexOf(q.a)}return o});if(opts.max)Q=Q.slice(0,opts.max);i=0;res=[];sc=0;show()}
 function dots(){return h('div',{cls:'dots'},Q.map((_,k)=>h('i',{cls:res[k]===true?'ok':res[k]===false?'no':k===i?'cur':''})))}
 function show(){bd.innerHTML='';if(i>=Q.length)return done();const q=Q[i];hd.lastChild.textContent=(i+1)+' / '+Q.length;bd.append(dots(),h('div',{cls:'q',style:'margin-top:10px',html:q.q}));
  const ex=h('div',{});let locked=false;const corr=()=>q.t==='num'?fmtg(q.a)+' '+(q.u||''):q.t==='tf'?(q.a?'Wahr':'Falsch'):q.t==='multi'?q.a.map(k=>q.o[k]).join(' · '):q.o[q.a];
  const fin=(ok,given)=>{locked=true;res[i]=ok;if(ok)sc++;ex.innerHTML='';ex.append(h('div',{cls:'ex '+(ok?'good':'bad')},h('div',{cls:'exh'},h('b',{},ok?'✓ Richtig':'✕ Leider falsch'),h('span',{},'Begründung')),h('div',{cls:'exa'},h('span',{},'Richtige Antwort'),h('em',{html:corr()})),!ok&&given!=null?h('div',{cls:'exa you'},h('span',{},'Deine Antwort'),h('em',{html:given})):null,h('div',{cls:'exr',html:q.e||''})));
   nx.style.display='';dots_upd();setTimeout(()=>ex.scrollIntoView({block:'nearest',behavior:'smooth'}),60)};const dots_upd=()=>{bd.firstChild.replaceWith(dots())};
  const nx=btn(h('div',{}),i+1<Q.length?'Weiter →':'Auswertung',()=>{i++;show();hd.scrollIntoView({block:'nearest',behavior:'smooth'})},'pri');nx.style.display='none';
  if(q.t==='num'){const inp=h('input',{cls:'num',type:'text',inputmode:'decimal',placeholder:'Zahl'});const b=btn(h('div',{}),'Prüfen',()=>{if(locked)return;const v=parseFloat(inp.value.replace(',','.'));if(isNaN(v))return;const tol=q.tol??.03;const ok=Math.abs(v-q.a)<=Math.abs(q.a)*tol+(q.abs||0);inp.disabled=true;fin(ok,inp.value.trim()+' '+(q.u||''))},'ok');
   bd.append(h('div',{cls:'numrow'},inp,' '+(q.u||''),' ',b));}
  else if(q.t==='multi'){const sel=new Set();const bs=q.o.map((t,k)=>h('button',{type:'button',cls:'opt',onclick:()=>{if(locked)return;sel.has(k)?sel.delete(k):sel.add(k);bs[k].classList.toggle('sel')}},t));bd.append(...bs);
   const b=btn(h('div',{}),'Prüfen',()=>{if(locked)return;const ok=q.a.length===sel.size&&q.a.every(a=>sel.has(a));bs.forEach((x,k)=>{x.classList.remove('sel');if(q.a.includes(k))x.classList.add('ok');else if(sel.has(k))x.classList.add('no')});fin(ok,[...sel].sort().map(k=>q.o[k]).join(' · ')||'(keine Auswahl)')},'ok');bd.append(b);bd.append(h('div',{cls:'cap'},'Mehrere Antworten möglich.'))}
  else{const o=q.t==='tf'?['Wahr','Falsch']:q.o;const a=q.t==='tf'?(q.a?0:1):q.a;const bs=o.map((t,k)=>h('button',{type:'button',cls:'opt',onclick:()=>{if(locked)return;bs.forEach((x,m)=>{if(m===a)x.classList.add('ok');else if(m===k)x.classList.add('no')});fin(k===a,o[k])}},t));bd.append(...bs)}
  bd.append(ex,h('div',{cls:'nav'},nx))}
 function done(){const pct=Math.round(100*sc/Q.length);hd.lastChild.textContent='Ergebnis';bd.innerHTML='';const best=Math.max(pct,Store.d.quiz[id]||0);Store.d.quiz[id]=best;Store.save();updNav();
  bd.append(h('div',{style:'text-align:center;padding:10px'},h('div',{cls:'score',style:'color:'+(pct>=70?'var(--ok)':pct>=50?'var(--warn)':'var(--bad)')},pct+' %'),h('div',{},sc+' von '+Q.length+' richtig · Bestwert '+best+' %'),
   h('p',{},pct>=70?'Sehr gut – Kapitel gemeistert! 🎯':pct>=50?'Bestanden, aber es lohnt sich, die Lücken zu schließen.':'Noch nicht sicher – lies das Kapitel nochmal und teste die Simulationen.')),
  h('div',{style:'display:flex;gap:8px;flex-wrap:wrap;justify-content:center'},h('button',{type:'button',cls:'btn pri',onclick:()=>start()},'Nochmal'),(res.some(r=>r===false)?h('button',{type:'button',cls:'btn',onclick:()=>start(Q.filter((_,k)=>res[k]===false).map(q=>qs.find(o=>o.q===q.q)))},'Nur Fehler wiederholen'):null)))}
 start();}
/* Karteikarten */
function mountFC(el){const items=JSON.parse(el.dataset.fc);el.className='';el.innerHTML='<h3>Lernkarten</h3><div class="cap">Antippen zum Umdrehen</div>';const g=h('div',{cls:'grid'});items.forEach(([a,b])=>{const c=h('div',{cls:'fc',onclick:()=>c.classList.toggle('f')},h('div',{},h('i',{},a),h('u',{},b)));g.append(c)});el.append(g)}
/* ===== Theme (gemeinsam mit dem Portal: zfp-theme) ===== */
const Theme={get(){try{return localStorage.getItem('zfp-theme')}catch(e){return null}},
 apply(){const s=this.get(),d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light');G.setDark(d);const m=$('meta[name=theme-color]');if(m)m.content=d?'#0b1520':'#0a1628'},
 toggle(){const d=document.documentElement.getAttribute('data-theme')==='dark';try{localStorage.setItem('zfp-theme',d?'light':'dark')}catch(e){}this.apply()}};
Theme.apply();matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(!Theme.get())Theme.apply()});
addEventListener('storage',e=>{if(e.key==='zfp-theme')Theme.apply()});
/* ===== Navigation / Router ===== */
const CHC=['#0d9488','#2563eb','#7c3aed','#ea580c','#b45309','#db2777','#16a34a','#0891b2','#6d28d9','#e11d48','#ca8a04','#0284c7','#9333ea','#4f46e5'];function chColor(id){const i=CHAPTERS.findIndex(c=>c.id===id);return CHC[(i<0?0:i)%CHC.length]}
const LOGO='<span class="lg">ET<sup>2</sup></span>';
const RING=(r,sw)=>{const C=2*Math.PI*r;return '<svg viewBox="0 0 '+(2*r+sw)+' '+(2*r+sw)+'" aria-hidden="true"><circle cx="'+(r+sw/2)+'" cy="'+(r+sw/2)+'" r="'+r+'" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="'+sw+'"/><circle class="rv" cx="'+(r+sw/2)+'" cy="'+(r+sw/2)+'" r="'+r+'" fill="none" stroke="url(#rg)" stroke-width="'+sw+'" stroke-linecap="round" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+C.toFixed(1)+'" transform="rotate(-90 '+(r+sw/2)+' '+(r+sw/2)+')"/><defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs></svg>'};
function updNav(){const n=CHAPTERS.length;let done=0,sum=0;$$('nav.side a[data-id]').forEach(a=>{const s=Store.d.quiz[a.dataset.id];const st=$('.st',a);const isCh=CHAPTERS.find(c=>c.id===a.dataset.id);if(st){st.className='st'+(s>=60?' ok':s!=null?' part':'');st.textContent=s>=60?'✓':s!=null?s+'%':''}if(isCh){if(s>=60)done++;sum+=Math.min(100,s||0)}});
 const pct=Math.round(sum/n),rv=$('nav.side .ring .rv');if(rv){const C=+rv.getAttribute('stroke-dasharray');rv.style.strokeDashoffset=C*(1-pct/100)}const pp=$('#ppct');if(pp)pp.textContent=pct+' %';const pt=$('#ptxt');if(pt)pt.textContent=done+' von '+n+' Kapiteln bestanden'}
function buildNav(){const nv=$('nav.side');nv.innerHTML='';
 nv.append(h('div',{cls:'brand'},h('div',{cls:'logo',html:LOGO}),h('div',{},h('h1',{},'Wirbelstromprüfung'),h('small',{},h('span',{cls:'lvl'},'Stufe 2'),'E-Learning · DGZfP ET 2'))));
 nv.append(h('div',{cls:'ring'},h('div',{cls:'rg',html:RING(22,6)}),h('div',{},h('b',{id:'ppct'},'0 %'),h('span',{id:'ptxt'},''))));
 const inp=h('input',{type:'search',placeholder:'Kapitel suchen …','aria-label':'Kapitel suchen'});nv.append(h('label',{cls:'nsearch'},h('span',{'aria-hidden':'true'},'⌕'),inp));
 const A=(id,num,t,col,href)=>{const a=h('a',{href:href||'#/'+id,'data-id':id,style:'--c:'+(col||'#2dd4bf')},h('b',{},num),h('span',{cls:'nt'},t),h('span',{cls:'st'}));return a};
 nv.append(A('home','⌂','Startseite','#2dd4bf'));nv.append(h('div',{cls:'grp'},h('span',{},'Vorträge'),h('i',{})));CHAPTERS.forEach(c=>nv.append(A(c.id,c.num,c.title,chColor(c.id))));
 nv.append(h('div',{cls:'grp'},h('span',{},'Werkzeuge'),h('i',{})));nv.append(A('lab','🔬','Simulator-Labor','#38bdf8'));nv.append(A('tools','🧮','Rechner & Glossar','#a78bfa'));nv.append(A('exam','🎓','Abschlusstest','#f59e0b'));
 inp.addEventListener('input',()=>{const q=inp.value.trim().toLowerCase();$$('nav.side a[data-id]').forEach(a=>{a.style.display=!q||a.textContent.toLowerCase().includes(q)?'':'none'})});
 const foot=h('div',{cls:'navfoot'});foot.append(h('a',{cls:'simcard',href:'../ET_simulation/index.html'},h('span',{cls:'si'},'🔬'),h('span',{},h('b',{},'ET-Simulator'),h('small',{},'Prüfgerät · Sonde · C-Bild')),h('span',{cls:'go'},'→')));
 const ts=h('div',{cls:'tseg',role:'group','aria-label':'Darstellung'});[['light','☀ Hell'],['dark','☾ Dunkel']].forEach(([m,l])=>ts.append(h('button',{type:'button','data-m':m,onclick:()=>{if(document.documentElement.getAttribute('data-theme')!==m)Theme.toggle();syncTs()}},l)));foot.append(ts);nv.append(foot);
 const syncTs=()=>$$('.tseg button').forEach(b=>b.classList.toggle('on',b.dataset.m===document.documentElement.getAttribute('data-theme')));syncTs();new MutationObserver(syncTs).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});updNav()}
const HDECO='<svg viewBox="0 0 420 260" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.3">'+[0,1,2,3,4,5,6].map(i=>'<ellipse class="fl" cx="300" cy="150" rx="'+(40+i*26)+'" ry="'+(22+i*17)+'"/>').join('')+'</g><g stroke="#ffc58f" stroke-width="5" stroke-linecap="round" opacity=".85">'+[0,1,2,3,4,5].map(i=>'<path d="M'+(262+i*15)+' 128 q8 22 0 44"/>').join('')+'</g><g fill="none" stroke="rgba(255,138,76,.9)" stroke-width="2.2">'+[0,1,2].map(i=>'<ellipse class="ed" cx="300" cy="208" rx="'+(70-i*18)+'" ry="'+(12-i*3)+'"/>').join('')+'</g></svg>';
const SCROLL_OBS=[];
function route(){const id=(location.hash.replace('#/','')||'home');const root=$('#view');root.innerHTML='';window.scrollTo(0,0);$$('nav.side a').forEach(a=>a.classList.toggle('on',a.dataset.id===id));
 SCROLL_OBS.splice(0).forEach(o=>o.disconnect());
 $('nav.side').classList.remove('open');$('.scrim').classList.remove('on');const ch=CHAPTERS.find(c=>c.id===id);const wrap=h('div',{cls:'wrap'});root.append(wrap);
 if(ch){document.title=ch.num+' '+ch.title+' – ET2';$('.top .t').textContent=ch.num+' · '+ch.title;const col=chColor(ch.id);wrap.style.setProperty('--ac',col);document.documentElement.style.setProperty('--chc',col);
  const cnt=re=>(ch.html.match(re)||[]).length,ns=cnt(/data-sim=/g)+cnt(/data-lab=/g),nv=cnt(/data-vid=/g)+cnt(/data-mp4=/g),nf=cnt(/data-fig=/g),qs=Store.d.quiz[ch.id];
  const chip=(ic,t,cls)=>h('span',{cls:'mchip'+(cls?' '+cls:'')},h('i',{},ic),t);
  wrap.append(h('div',{cls:'hero ch'},h('div',{cls:'hdeco',html:HDECO}),h('div',{cls:'crumb'},h('a',{href:'#/home'},'Start'),h('span',{},'›'),'Vortrag '+ch.num,h('span',{},'›'),'≈ '+ch.min+' Min.'),
   h('div',{cls:'hrow'},h('div',{cls:'hnum'},ch.num),h('div',{},h('h2',{},ch.title),h('p',{},ch.sub))),
   h('div',{cls:'meta'},ns?chip('🧪',ns+' Simulation'+(ns>1?'en':'')):null,nv?chip('🎬',nv+' Video'+(nv>1?'s':'')):null,nf?chip('🖼',nf+' Abbildung'+(nf>1?'en':'')):null,ch.quiz?chip(qs>=60?'✓':'✎',qs!=null?'Quiz '+qs+' %':'Quiz offen',qs>=60?'ok':''):null)));
  const body=h('div',{html:ch.html,cls:'chbody'});const toc=h('nav',{cls:'toc','aria-label':'Abschnitte'});wrap.append(toc,body);const hs=$$('h2',body);
  hs.forEach((x,i)=>{x.id='s'+i;const txt=x.textContent.replace(/^Vertiefung: /,'');const a=h('a',{href:'javascript:void 0',onclick:()=>{const y=x.getBoundingClientRect().top+scrollY-(innerWidth<=900?120:76);scrollTo({top:y,behavior:'smooth'})}},txt);toc.append(a);
   const m=x.textContent.match(/^(\d+(?:\.\d+)*(?:\/\d+(?:\.\d+)*)?)\s+(.*)$/);if(m){x.innerHTML='';x.append(h('span',{cls:'hn'},m[1]),h('span',{},m[2]))}else if(/^Vertiefung/.test(x.textContent)){x.innerHTML='';x.append(h('span',{cls:'hn'},'★'),h('span',{},x.textContent.replace(/^Vertiefung: /,'')))}});
  if(!toc.children.length)toc.remove();else{const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){const k=hs.indexOf(e.target);$$('a',toc).forEach((a,j)=>a.classList.toggle('on',j===k));const a=toc.children[k];if(a)toc.scrollTo({left:a.offsetLeft-toc.clientWidth/2+a.clientWidth/2,behavior:'smooth'})}})},{rootMargin:'-20% 0px -70% 0px'});hs.forEach(x=>io.observe(x));SCROLL_OBS.push(io)}
  $$('table',body).forEach(t=>{if(!t.closest('.tw')){const w=h('div',{cls:'tw'});t.replaceWith(w);w.append(t)}});
  if(typeof mountFig==='function')$$('[data-fig]',body).forEach(mountFig);$$('[data-sim]',body).forEach(mountSim);if(typeof mountMp4==='function')$$('[data-mp4]',body).forEach(mountMp4);$$('[data-vid]',body).forEach(mountVid);$$('[data-fc]',body).forEach(mountFC);$$('[data-lab]',body).forEach(mountLab);
  if(ch.quiz){const q=h('div');wrap.append(q);mountQuiz(q,ch.quiz,ch.id,'Wissens-Check · '+ch.num+' '+ch.title)}
  const i=CHAPTERS.indexOf(ch),pv=CHAPTERS[i-1],nx=CHAPTERS[i+1];const pn=(href,dir,num,t,c)=>h('a',{href,style:'--c:'+c},h('small',{},dir),h('span',{cls:'pnr'},num?h('b',{},num):null,h('span',{},t)));
  wrap.append(h('div',{cls:'pn'},pv?pn('#/'+pv.id,'← zurück',pv.num,pv.title,chColor(pv.id)):pn('#/home','← zurück','⌂','Startseite','#2dd4bf'),nx?pn('#/'+nx.id,'weiter →',nx.num,nx.title,chColor(nx.id)):pn('#/tools','weiter →','🧮','Rechner & Glossar','#a78bfa')))}
 else if(PAGES[id]){document.title='ET2 E-Learning · Wirbelstromprüfung';$('.top .t').textContent='Wirbelstromprüfung ET 2';document.documentElement.style.setProperty('--chc','#0d9488');PAGES[id](wrap)}
 else location.hash='#/home'}
window.addEventListener('DOMContentLoaded',()=>{buildNav();route();window.addEventListener('hashchange',route);
 $('.top .menu').onclick=()=>{$('nav.side').classList.add('open');$('.scrim').classList.add('on')};$('.top .theme').onclick=()=>Theme.toggle();$('.scrim').onclick=()=>{$('nav.side').classList.remove('open');$('.scrim').classList.remove('on')};
 addEventListener('scroll',()=>{const d=document.documentElement;$('.prog').style.width=(100*d.scrollTop/(d.scrollHeight-d.clientHeight||1))+'%'},{passive:true})});
