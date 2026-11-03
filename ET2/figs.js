"use strict";
/* =====================================================================
   Abbildungen aus dem Skript (SVG) – aufgewertete Grundbausteine:
   Werkstoff- und Kupferverläufe, Schatten, Texthalo, Kurvenaufbau,
   Dunkelmodus (über CSS), Vergrößern per Antippen
   ===================================================================== */
const FIGS={};
const FC={pri:'#0f3d63',ac:'#0aa89e',bl:'#1769a6',red:'#d62839',or:'#e8590c',gr:'#6b7b8a',ln:'#cbd6e0',ink:'#12202f',gn:'#1f9d55',vi:'#7048e8',bg:'#eef4f9',am:'#f0a30a'};
function sm(t){return String(t).replace(/_\{([^}]*)\}|_(\w)/g,(m,a,b)=>`<tspan baseline-shift="sub" font-size="72%">${a||b}</tspan>`).replace(/\^\{([^}]*)\}|\^(\w)/g,(m,a,b)=>`<tspan baseline-shift="super" font-size="72%">${a||b}</tspan>`)}
function SV(w,h,body){return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,-apple-system,Segoe UI,sans-serif" font-size="13" role="img"><defs><marker id="ah" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7.5" markerHeight="7.5" orient="auto-start-reverse"><path d="M1 1.2L11.2 6L1 10.8Q3.6 6 1 1.2z" fill="context-stroke"/></marker><marker id="dt" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5"><circle cx="5" cy="5" r="4" fill="context-stroke"/></marker>
<linearGradient id="mSt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="m0"/><stop offset=".2" class="m1"/><stop offset="1" class="m2"/></linearGradient>
<linearGradient id="mSt2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="n0"/><stop offset=".2" class="n1"/><stop offset="1" class="n2"/></linearGradient>
<radialGradient id="cuD" cx=".35" cy=".32" r=".75"><stop offset="0" stop-color="#ffe1c2"/><stop offset=".5" stop-color="#df915a"/><stop offset="1" stop-color="#7d3f16"/></radialGradient>
<linearGradient id="cuS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a65a2a"/><stop offset=".4" stop-color="#ffc996"/><stop offset=".7" stop-color="#d98a4e"/><stop offset="1" stop-color="#7d3f16"/></linearGradient>
<linearGradient id="scrG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2a1c"/><stop offset="1" stop-color="#02100a"/></linearGradient>
<filter id="fsh" x="-15%" y="-15%" width="130%" height="150%"><feDropShadow dx="0" dy="2.2" stdDeviation="2.6" flood-color="#0b2238" flood-opacity=".2"/></filter>
<filter id="fgl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<pattern id="pdot" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="1" class="pd"/></pattern></defs><rect class="fbg" width="${w}" height="${h}" fill="url(#pdot)"/>${body}</svg>`}
const LN=(x1,y1,x2,y2,c=FC.ink,w=1.6,x='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" ${x}/>`;
const AR=(x1,y1,x2,y2,c=FC.ink,w=1.8,x='')=>LN(x1,y1,x2,y2,c,w,'marker-end="url(#ah)" '+x);
const AR2=(x1,y1,x2,y2,c=FC.ink,w=1.6)=>LN(x1,y1,x2,y2,c,w,'marker-end="url(#ah)" marker-start="url(#ah)"');
const TX=(x,y,t,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" fill="${o.c||FC.ink}" font-size="${o.s||13}" ${o.b?'font-weight="700"':''} ${o.i?'font-style="italic"':''} ${o.r?`transform="rotate(${o.r} ${x} ${y})"`:''}>${sm(t)}</text>`;
const PA=(d,c=FC.ink,w=1.8,f='none',x='')=>`<path d="${d}" stroke="${c}" stroke-width="${w}" fill="${f}" ${x}/>`;
const RC=(x,y,w,h,c=FC.ink,f='none',s=1.6,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" stroke="${c}" stroke-width="${s}" fill="${f}"${r>0&&f!=='none'&&!/^rgba/.test(f)?' filter="url(#fsh)"':''}/>`;
const CI=(x,y,r,c=FC.ink,f='none',s=1.6)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${c}" stroke-width="${s}" fill="${f}"/>`;
// Bauteile
const RES=(x,y,w=46,h=16)=>RC(x,y-h/2,w,h,FC.ink,'#fff',1.8);
const IND=(x,y,n=4,w=14)=>{let d=`M${x} ${y}`;for(let i=0;i<n;i++)d+=` a${w/2} ${w/2} 0 0 1 ${w} 0`;return PA(d,'#5a2c10',4.6,'none','stroke-linecap="round"')+PA(d,'url(#cuS)',3,'none','stroke-linecap="round" class="cu"')};
const VM=(x,y,t)=>CI(x,y,13,FC.ink,'#fff',1.6)+TX(x,y+4.5,t,{s:12,b:1});
const GRID=(w,h,dx=40,c='#eef2f6')=>'';
const MATFILL={'#dde6ee':'mSt','#d9e3ec':'mSt','#e9eff5':'mSt','#d4dde6':'mSt','#e3ebf2':'mSt','#c9d6e2':'mSt2'};
function figHTML(id){let s=FIGS[id]();s=s.replace(/fill="(#dde6ee|#d9e3ec|#e9eff5|#d4dde6|#e3ebf2|#c9d6e2)"/g,(m,c)=>'fill="url(#'+MATFILL[c]+')"');
 s=s.replace(/<circle([^>]*?)r="([\d.]+)"([^>]*?)fill="#0aa89e"/g,(m,a,r,b)=>+r<=8?`<circle${a}r="${r}"${b}fill="url(#cuD)" stroke="#6b3412" stroke-width="1"`:m);return s}
let _figIO=null;
function mountFig(el){const id=el.dataset.fig,f=FIGS[id];el.className='fg';if(!f){el.textContent='Abbildung fehlt: '+id;return}const cap=el.dataset.cap||'';
 el.innerHTML='<div class="svgw">'+figHTML(id)+'</div>'+(cap?'<figcaption>'+cap.replace(/^(Abb\.\s*[\d.]+|Tab\.\s*[\d.]+):?/,'<b>$1</b>')+'</figcaption>':'')+'<button type="button" class="fgz" aria-label="Abbildung vergrößern" title="Vergrößern">⤢</button>';
 if(!_figIO)_figIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');_figIO.unobserve(e.target)}}),{threshold:.25});_figIO.observe(el);
 el.addEventListener('click',e=>{if(e.target.closest('a'))return;figZoom(id,cap)})}
function figZoom(id,cap){let z=1;const svg=h('div',{cls:'fzs',html:figHTML(id)});const sc=h('div',{cls:'fzw'},svg);const set=v=>{z=clamp(v,1,4);svg.style.width=(z*100)+'%';lbl.textContent=Math.round(z*100)+' %'};const lbl=h('span',{},'100 %');
 const close=()=>{ov.remove();document.body.style.overflow='';removeEventListener('keydown',kd)};const kd=e=>{if(e.key==='Escape')close()};addEventListener('keydown',kd);
 const ov=h('div',{cls:'fzo in'},h('div',{cls:'fzb'},h('b',{html:cap?cap.replace(/^(Abb\.\s*[\d.]+|Tab\.\s*[\d.]+):?\s*/,'<span>$1</span> '):'Abbildung'}),h('span',{style:'flex:1'}),h('button',{type:'button',onclick:()=>set(z/1.4)},'−'),lbl,h('button',{type:'button',onclick:()=>set(z*1.4)},'+'),h('button',{type:'button',onclick:close},'✕')),sc);
 sc.addEventListener('click',e=>{if(e.target===sc)close()});let d0=0,z0=1;sc.addEventListener('touchstart',e=>{if(e.touches.length===2){d0=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);z0=z}},{passive:true});
 sc.addEventListener('touchmove',e=>{if(e.touches.length===2&&d0){e.preventDefault();const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);set(z0*d/d0)}},{passive:false});sc.addEventListener('touchend',()=>d0=0);
 svg.addEventListener('dblclick',()=>set(z>1?1:2));document.body.append(ov);document.body.style.overflow='hidden'}

"use strict";
const PTH=(pts,c=FC.bl,w=2.4,x='')=>PA('M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L'),c,w,'none',x+(/dash/.test(x)?'':' class="cv" pathLength="1"')+' stroke-linejoin="round" stroke-linecap="round"');
const SIN=(x0,y0,amp,per,ph,len,n=120)=>{const p=[];for(let i=0;i<=n;i++){const x=i/n*len;p.push([x0+x,y0-amp*Math.sin(2*Math.PI*(x-ph)/per)])}return p};
const TAXES=(x0,y0,w,h,xl='t',yl='')=>AR(x0,y0,x0+w,y0,FC.gr,1.4)+AR(x0,y0+h/2,x0,y0-h/2,FC.gr,1.4)+TX(x0+w-4,y0+16,xl,{a:'end',c:FC.gr,i:1})+(yl?TX(x0+6,y0-h/2+4,yl,{a:'start',c:FC.gr,i:1}):'');

FIGS.v1_sine=()=>{const x0=50,y0=135,A=80,T=260;let s=GRID(640,270,40)+TAXES(x0,y0,570,230,'t','U, I');
 s+=PTH(SIN(x0,y0,A,T,0,540),FC.bl,2.6)+PTH(SIN(x0,y0,A*.55,T,0,540),FC.red,2.2,'stroke-dasharray="7 4"');
 s+=LN(x0-5,y0-A,x0+T*1.0,y0-A,FC.ln,1,'stroke-dasharray="3 3"')+LN(x0-5,y0+A,x0+T*.75,y0+A,FC.ln,1,'stroke-dasharray="3 3"');
 s+=TX(x0-8,y0-A+4,'+U_{max}',{a:'end',c:FC.bl,s:12})+TX(x0-8,y0+A+4,'−U_{max}',{a:'end',c:FC.bl,s:12});
 s+=AR2(x0,y0+112,x0+T,y0+112,FC.gr)+TX(x0+T/2,y0+106,'Periodendauer T',{c:FC.gr,s:12});
 s+=LN(x0+T,y0+95,x0+T,y0+120,FC.gr,1)+LN(x0,y0+95,x0,y0+120,FC.gr,1);
 s+=TX(500,38,'— Spannung U(t)',{a:'start',c:FC.bl,b:1})+TX(500,58,'- - Strom I(t)',{a:'start',c:FC.red,b:1})+TX(x0+T/4,y0-A-8,'Maximum',{c:FC.gr,s:11});
 return SV(640,270,s)};

FIGS.v1_dcckt=()=>{let s=GRID(560,260,40);
 s+=LN(80,60,150,60)+LN(150,60,175,38,FC.ink,2.4)+CI(150,60,3.5,FC.ink,FC.ink)+CI(190,60,3.5,FC.ink,FC.ink)+LN(190,60,260,60)+TX(170,28,'S',{b:1});
 s+=IND(260,60,4,22)+LN(348,60,430,60)+LN(430,60,430,106)+RES(0,0).replace(/.*/,'')+RC(412,106,36,60,FC.ink,'#fff',1.8)+LN(430,166,430,210)+LN(430,210,80,210)+LN(80,210,80,150);
 s+=LN(80,60,80,100)+LN(66,100,94,100,FC.ink,3)+LN(72,112,88,112,FC.ink,3)+LN(80,112,80,150)+TX(52,108,'Q',{b:1})+TX(100,100,'U_0',{a:'start',c:FC.bl});
 s+=TX(304,92,'L',{b:1})+TX(466,140,'R',{b:1,a:'start'})+TX(300,236,'Gleichstromkreis mit Widerstand und Induktivität',{c:FC.gr,s:12});
 return SV(560,260,s)};

FIGS.v1_dccurve=()=>{const x0=60,y0=210,W=470,H=150;let s=GRID(560,250,40)+AR(x0,y0,x0+W+20,y0,FC.gr,1.4)+AR(x0,y0,x0,y0-H-30,FC.gr,1.4);
 s+=TX(x0+W+16,y0+18,'t',{a:'end',i:1,c:FC.gr})+TX(x0+8,y0-H-28,'U, I',{a:'start',i:1,c:FC.gr});
 s+=LN(x0+60,y0,x0+60,y0-H,FC.bl,2.4)+LN(x0+60,y0-H,x0+W,y0-H,FC.bl,2.4)+LN(x0,y0,x0+60,y0,FC.bl,2.4);
 const p=[];for(let i=0;i<=100;i++){const t=i/100*(W-60);p.push([x0+60+t,y0-H*(1-Math.exp(-t/90))])}
 s+=PTH(p,FC.red,2.6)+LN(x0+60,y0+4,x0+60,y0+12)+TX(x0+60,y0+26,'t_0',{c:FC.gr});
 s+=TX(x0+W-8,y0-H-8,'U_0',{a:'end',c:FC.bl,b:1})+TX(x0+W-6,y0-H+34,'I = U_0/R',{a:'end',c:FC.red,b:1})+TX(x0+250,y0-40,'Strom wächst allmählich',{c:FC.red,s:12})+TX(x0+30,y0-H-8,'Spannung springt',{c:FC.bl,s:12,a:'start'});
 return SV(560,250,s)};

FIGS.v1_acckt=()=>{let s=GRID(560,280,40);
 s+=CI(80,150,24,FC.ink,'#fff',2)+PA('M68 150q6-12 12 0t12 0',FC.ink,2)+TX(80,196,'Q ~',{b:1})+LN(80,126,80,60)+LN(80,60,150,60)+RES(150,60,60,18)+TX(180,90,'R',{b:1})+LN(210,60,430,60)+LN(430,60,430,100)+IND(0,0,0,0).replace(/.*/,'');
 s+=PA('M430 100q14 8 0 16t0 16t0 16t0 16',FC.ink,2.2)+TX(406,136,'L',{b:1,a:'end'})+LN(430,164,430,230)+LN(430,230,80,230)+LN(80,230,80,174);
 s+=LN(150,60,150,32)+LN(210,60,210,32)+LN(150,32,170,32)+LN(190,32,210,32)+VM(180,32,'V')+TX(228,36,'U_R',{c:FC.bl,b:1,a:'start'});
 s+=LN(430,100,470,100)+LN(430,164,470,164)+LN(470,100,470,120)+LN(470,144,470,164)+VM(470,132,'V')+TX(494,136,'U_L',{c:FC.bl,b:1,a:'start'});
 s+=TX(260,254,'Wechselstromkreis mit R und L in Reihe',{c:FC.gr,s:12});
 return SV(560,270,s)};

FIGS.v1_accurve=()=>{const x0=50,y0=140,A=78,T=300,d=44;let s=GRID(640,270,40)+TAXES(x0,y0,580,230,'t','U, I');
 s+=PTH(SIN(x0,y0,A,T,0,540),FC.bl,2.6)+PTH(SIN(x0,y0,A*.8,T,d,540),FC.red,2.6);
 s+=AR2(x0+T/2,y0+16,x0+T/2+d,y0+16,FC.ink,1.6)+TX(x0+T/2+d/2,y0+34,'Δt',{b:1});
 s+=LN(x0+T/2,y0-6,x0+T/2,y0+22,FC.gr,1)+LN(x0+T/2+d,y0-6,x0+T/2+d,y0+22,FC.gr,1);
 s+=LN(x0+T/4,y0-A-6,x0+T/4,y0+4,FC.ln,1,'stroke-dasharray="3 3"')+LN(x0+T/4+d,y0-A*.8-6,x0+T/4+d,y0+4,FC.ln,1,'stroke-dasharray="3 3"');
 s+=TX(x0+T/4,y0-A-12,'U_{max}',{c:FC.bl,b:1,s:12})+TX(x0+T/4+d+16,y0-A*.8-12,'I_{max}',{c:FC.red,b:1,s:12});
 s+=TX(460,38,'— Spannung U(t)',{a:'start',c:FC.bl,b:1})+TX(460,58,'— Strom I(t)  (verspätet)',{a:'start',c:FC.red,b:1});
 return SV(640,270,s)};

FIGS.v1_zrect=()=>{const x=90,y=190,R=210,X=130;let s=GRID(520,250,40);
 s+=RC(x,y-X,R,X,FC.gr,'#f3f8fc',1.2)+AR(x,y,x+R,y,FC.bl,3)+AR(x+R,y,x+R,y-X,FC.red,3)+AR(x,y,x+R,y-X,FC.pri,3.2);
 s+=TX(x+R/2,y+24,'R (Wirkwiderstand)',{c:FC.bl,b:1})+TX(x+R+14,y-X/2,'X_L (Blindwiderstand)',{a:'start',c:FC.red,b:1})+TX(x+R/2-18,y-X/2-14,'Z',{c:FC.pri,b:1,s:17});
 s+=PA(`M${x+46} ${y} A46 46 0 0 0 ${x+46*Math.cos(Math.atan2(X,R))} ${y-46*Math.sin(Math.atan2(X,R))}`,FC.or,2)+TX(x+66,y-8,'Δφ',{c:FC.or,b:1,a:'start'});
 s+=TX(x+R/2,y-X-12,'Z² = R² + X_L²',{c:FC.gr,s:12});
 return SV(560,250,s)};

FIGS.v1_setup=()=>{let s=GRID(640,320,40);
 // Platte
 s+=RC(150,215,340,34,FC.gr,'#d9e3ec',1.8)+TX(200,238,'Prüfgegenstand',{c:FC.pri,s:12,a:'middle'})+TX(440,238,'(nicht ferromagnetisch)',{c:FC.pri,s:12});
 // Spule
 s+=RC(270,112,100,50,FC.pri,'#fff',2)+[0,1,2,3,4,5].map(i=>`<circle cx="${283+i*15}" cy="137" r="5" fill="${FC.ac}" />`).join('');
 s+=TX(320,104,'Spule L',{b:1});
 // Feldlinien
 s+=[44,70].map(r=>PA(`M${320-r} 165 C${320-r-20} 190 ${320-r-10} 205 ${320-r+10} 214`,FC.bl,1.6,'none','stroke-dasharray="4 3"')).join('')+[44,70].map(r=>PA(`M${320+r} 165 C${320+r+20} 190 ${320+r+10} 205 ${320+r-10} 214`,FC.bl,1.6,'none','stroke-dasharray="4 3"')).join('');
 s+=TX(214,194,'H',{c:FC.bl,b:1})+TX(430,194,'H',{c:FC.bl,b:1});
 // Wirbelströme
 s+=`<ellipse cx="320" cy="232" rx="52" ry="8" fill="none" stroke="${FC.red}" stroke-width="2.2"/><ellipse cx="320" cy="232" rx="28" ry="4" fill="none" stroke="${FC.red}" stroke-width="2"/>`+TX(320,276,'Wirbelströme I_W  →  Gegenfeld H_W',{c:FC.red,b:1,s:12});
 // Boxen
 s+=RC(20,20,190,76,FC.pri,'#e8f0f8',1.6,10)+TX(115,42,'Erreger (Parameter)',{b:1,c:FC.pri})+TX(115,62,'Frequenz f · Strom I',{s:12})+TX(115,80,'Spule L (Windungen, Form)',{s:12});
 s+=RC(430,20,200,76,FC.red,'#fdecee',1.6,10)+TX(530,42,'Prüfgegenstand (Sekundärspule)',{b:1,c:FC.red,s:11.5})+TX(530,62,'Leitfähigkeit σ',{s:12})+TX(530,80,'Permeabilität μ',{s:12});
 s+=RC(215,20,210,56,FC.gn,'#e7f6ee',1.6,10)+TX(320,42,'Messgrößen',{b:1,c:FC.gn})+TX(320,62,'Spannung U · Phase Δφ',{s:12});
 return SV(640,300,s)};

FIGS.v1_implane=()=>{const x0=90,y0=220,px=250,py=110;let s=GRID(560,260,40)+AR(x0,y0,x0+400,y0,FC.gr,1.8)+AR(x0,y0,x0,y0-200,FC.gr,1.8);
 s+=TX(x0+398,y0+20,'Wirkanteil R  (bzw. U_R)',{a:'end',c:FC.bl,b:1,s:12})+TX(x0+8,y0-196,'Blindanteil X_L  (bzw. U_L)',{a:'start',c:FC.red,b:1,s:12});
 s+=LN(x0+px-x0,y0,x0+px-x0,y0-(y0-py),FC.ln,1.2,'stroke-dasharray="4 3"').replace(/.*/,LN(px,y0,px,py,FC.ln,1.4,'stroke-dasharray="4 3"')+LN(x0,py,px,py,FC.ln,1.4,'stroke-dasharray="4 3"'));
 s+=AR(x0,y0,px-3,py+3,FC.pri,3)+CI(px,py,6,FC.or,FC.or)+TX(px+12,py-8,'Zeigerende (Messpunkt)',{a:'start',c:FC.or,b:1,s:12});
 s+=PA(`M${x0+50} ${y0} A50 50 0 0 0 ${x0+50*Math.cos(Math.atan2(y0-py,px-x0))} ${y0-50*Math.sin(Math.atan2(y0-py,px-x0))}`,FC.or,2)+TX(x0+70,y0-12,'Δφ',{a:'start',c:FC.or,b:1});
 s+=TX(160,150,'U',{c:FC.pri,b:1,s:17});
 return SV(560,250,s)};

FIGS.v1_rodcoil=()=>{let s=GRID(620,280,40);
 // Querschnitt links
 s+=CI(150,130,92,FC.pri,'#eef4fa',2.4)+CI(150,130,56,FC.red,'#fbe6e9',2.4)+TX(150,150,'Stange',{c:FC.red,b:1})
 +AR2(94,130,206,130,FC.red,1.4).replace(/.*/,'')+LN(94,130,206,130,FC.red,1.2,'stroke-dasharray="3 3"')+TX(150,118,'D_P',{c:FC.red,b:1,s:12})
 +TX(150,22,'Spule',{c:FC.pri,b:1})+AR2(58,230,242,230,FC.pri,1.5)+TX(150,250,'D_S',{c:FC.pri,b:1});
 s+=TX(150,274,'Schnitt quer zur Achse',{c:FC.gr,s:12});
 // Längsschnitt rechts
 s+=RC(340,70,230,120,FC.pri,'#eef4fa',2.2,4)+RC(290,100,310,60,FC.red,'#fbe6e9',2,2);
 for(let i=0;i<9;i++)s+=CI(360+i*24,70,5,FC.ac,FC.ac)+CI(360+i*24,190,5,'#fff',FC.ac,1.8);
 s+=TX(470,134,'Stange (Durchmesser D_P)',{c:FC.red,b:1,s:12})+TX(470,60,'Außenspule (Durchmesser D_S)',{c:FC.pri,b:1,s:12});
 s+=TX(470,230,'η = (D_P / D_S)²  <  1',{c:FC.gr,b:1})+TX(470,274,'Längsschnitt',{c:FC.gr,s:12});
 return SV(620,290,s)};

FIGS.v1_norm=()=>{const x0=70,y0=300,sx=1050,sy=260;let s=GRID(640,330,40);
 s+=AR(x0,y0,x0+540,y0,FC.gr,1.6)+AR(x0,y0,x0,y0-290,FC.gr,1.6)+TX(x0+536,y0+32,'normierter Wirkwiderstand (R − R_0)/ωL_0',{a:'end',c:FC.gr,s:12})+TX(x0+8,y0-290,'normierter Blindwiderstand ωL/ωL_0',{a:'start',c:FC.gr,s:12});
 for(let v=0;v<=1;v+=.2)s+=TX(x0-8,y0-v*sy+4,v.toFixed(1).replace('.',','),{a:'end',s:11,c:FC.gr})+LN(x0-3,y0-v*sy,x0+3,y0-v*sy,FC.gr,1);
 for(let v=0;v<=.5;v+=.1)s+=TX(x0+v*sx,y0+14,v.toFixed(1).replace('.',','),{s:11,c:FC.gr})+LN(x0+v*sx,y0-3,x0+v*sx,y0+3,FC.gr,1);
 const cols=[FC.pri,FC.bl,FC.ac,FC.or,FC.red];[1,.8,.6,.4,.2].forEach((eta,j)=>{const p=[];for(let i=0;i<=160;i++){const k=Math.pow(10,-1.3+i/160*3.6);const r=normImp(k,eta);p.push([x0+r.R*sx,y0-r.X*sy])}s+=PTH(p,cols[j],2.2);const e=normImp(1e-3,eta);s+=TX(x0+14,y0-(1-eta)*sy+(j?-4:-4),'',{});
  let mx=p[0];p.forEach(q=>{if(q[0]>mx[0])mx=q});s+=TX(mx[0]+8,mx[1]+4,'η='+String(eta).replace('.',','),{c:cols[j],s:11,b:1,a:'start'})});
 [1,2,5,10,20,50].forEach(k=>{const r=normImp(k,1);const X=x0+r.R*sx,Y=y0-r.X*sy;s+=CI(X,Y,4,FC.pri,'#fff',1.8)+TX(X+9,Y+4,'k='+String(k).replace('.',','),{a:'start',s:10,c:FC.pri})});
 s+=TX(x0+10,y0-sy-10,'Start (0 | 1) = leere Spule, k → 0',{a:'start',s:11,c:FC.gr});
 return SV(640,348,s)};

FIGS.v1_tast=()=>{let s=GRID(620,280,40)+RC(60,190,500,36,FC.gr,'#d9e3ec',1.8)+TX(310,213,'Prüfgegenstand',{c:FC.pri,s:12});
 s+=RC(262,96,96,60,FC.pri,'#fff',2,6)+[0,1,2,3,4].map(i=>CI(280+i*15,126,5,FC.ac,FC.ac)).join('')+TX(310,86,'Tastsensor (Spule)',{b:1,c:FC.pri});
 [30,55,85,120,160].forEach((r,i)=>{s+=PA(`M${310-r*.55} 156 C${310-r*1.5} ${156+r*.3} ${310-r*1.2} 186 ${310-r*.8} 190`,FC.bl,1.6,'none','stroke-dasharray="4 3"')+PA(`M${310+r*.55} 156 C${310+r*1.5} ${156+r*.3} ${310+r*1.2} 186 ${310+r*.8} 190`,FC.bl,1.6,'none','stroke-dasharray="4 3"')});
 s+=TX(310,262,'Das Feld konzentriert sich auf ein kleines, oberflächennahes Volumen',{c:FC.gr,s:12});
 return SV(620,280,s)};

FIGS.v1_durch=()=>{let s=GRID(620,280,40);
 s+=RC(60,102,500,76,FC.red,'#fbe6e9',2,2)+TX(110,144,'Prüfgegenstand',{c:FC.red,b:1,s:12})+TX(510,144,'(Stange/Rohr)',{c:FC.red,b:1,s:12});
 s+=RC(230,62,160,156,FC.pri,'none',2,6);for(let i=0;i<7;i++)s+=CI(246+i*21.5,62,5,FC.ac,FC.ac)+CI(246+i*21.5,218,5,'#fff',FC.ac,1.8);
 s+=TX(310,52,'Außendurchlaufsensor',{b:1,c:FC.pri});
 [0,1].forEach(i=>{const r=38+i*34;s+=PA(`M${310-r*.4} 102 C${310-r*1.6} 60 ${310-r*1.6} 220 ${310-r*.4} 178`,FC.bl,1.4,'none','stroke-dasharray="4 3"')});
 s+=PA('M310 108 L310 172',FC.bl,1.8,'none','stroke-dasharray="4 3"')+TX(318,98,'',{});
 s+=`<ellipse cx="310" cy="112" rx="18" ry="4" fill="none" stroke="${FC.red}" stroke-width="1.8"/><ellipse cx="310" cy="168" rx="18" ry="4" fill="none" stroke="${FC.red}" stroke-width="1.8"/>`;
 s+=TX(310,254,'Feld im Spuleninneren axial, Wirbelströme kreisen um die Achse',{c:FC.gr,s:12});
 return SV(620,270,s)};

"use strict";
const BX=(x,y,w,h,t,n,c=FC.pri,f='#fff')=>RC(x,y,w,h,c,f,1.7,6)+t.split('|').map((l,i,a)=>TX(x+w/2,y+h/2+4+(i-(a.length-1)/2)*14,l,{s:11.5})).join('')+(n?TX(x+9,y+13,n,{s:10.5,c:FC.gr,b:1,a:'middle'}):'');
const SCR=(x,y,w,h)=>RC(x-3,y-3,w+6,h+6,'#2b343d','#1a2128',1,10)+RC(x,y,w,h,'#0b2a1c','url(#scrG)',1.4,7);
const GL=(x,y,t,w=50)=>LN(x,y,x+w,y,FC.gn,1.5);
FIGS.v2_phase=()=>{let s=GRID(640,300,40);
 s+=TX(160,22,'a) Schreiberdarstellung',{b:1,c:FC.pri})+TX(480,22,'b) Bildschirmdarstellung',{b:1,c:FC.pri});
 s+=RC(20,36,280,236,FC.ln,'#fff',1.2,8)+LN(30,110,290,110,FC.ln,1)+LN(30,200,290,200,FC.ln,1);
 s+=TX(34,52,'Y-Komponente',{a:'start',c:FC.gr,s:11});
 const f=(x0,y0,a,w,col)=>{const p=[];for(let i=0;i<=80;i++){const x=i/80*70;p.push([x0+x,y0-a*Math.exp(-Math.pow((x-35)/w,2))*Math.cos((x-35)/w*1.4)])}return PTH(p,col,2.4)};
 s+=f(60,110,56,12,FC.red)+TX(95,166,'Außenfehler',{c:FC.red,b:1,s:12})+f(190,200,-44,12,FC.bl)+TX(130,242,'Innenfehler',{c:FC.bl,b:1,s:12});
 s+=SCR(340,36,280,236);
 s+=LN(480,46,480,262,'#1c4a35',1)+LN(350,154,610,154,'#1c4a35',1);
 s+=AR(480,154,556,98,FC.red,3)+AR(480,154,556,208,FC.bl,3)+TX(580,92,'Außen',{c:'#ff8a96',b:1,s:12})+TX(584,226,'Innen',{c:'#7fb8ff',b:1,s:12});
 s+=PA('M 400 154 L 560 40',FC.am,1.6,'none','stroke-dasharray="5 4"')+TX(388,200,'Auswertemaske',{c:FC.am,s:11,a:'start'})+TX(388,214,'drehbar (Phasensteller)',{c:FC.am,s:11,a:'start'});
 s+=TX(320,292,'Je nach Prüffrequenz liegen die Signale unterschiedlicher Fehlerarten in verschiedenen Richtungen.',{c:FC.gr,s:11.5});
 return SV(640,300,s)};
FIGS.v2_filter=()=>{let s=GRID(640,320,40);
 const n=240;const drift=i=>46*Math.sin(i/n*2*Math.PI*.8);const fl=i=>(i>110&&i<130)?70*Math.sin((i-110)/20*2*Math.PI)*Math.exp(-Math.pow((i-120)/8,2)):0;
 const a=[],b=[];for(let i=0;i<=n;i++){a.push([40+i*2.3,120-(drift(i)+fl(i))*.9]);b.push([40+i*2.3,260-fl(i)*.9])}
 s+=TX(40,22,'ohne Filter: Drift (Leitfähigkeit, Vibration) überlagert den Fehler',{a:'start',b:1,c:FC.red,s:12})+LN(40,120,600,120,FC.ln,1)+PTH(a,FC.red,2.2);
 s+=TX(40,190,'mit Hochpass-Filter: Drift unterdrückt, Fehlersignal bleibt',{a:'start',b:1,c:FC.gn,s:12})+LN(40,260,600,260,FC.ln,1)+PTH(b,FC.gn,2.4);
 s+=TX(320,306,'Fehlersignale sind höherfrequent als Drift und Vibration.',{c:FC.gr,s:12});
 return SV(640,320,s)};
FIGS.v2_sat=()=>{let s=GRID(640,300,40);
 s+=TX(160,22,'ohne Sättigung',{b:1,c:FC.red})+TX(480,22,'mit magnetischer Sättigung',{b:1,c:FC.gn});
 const mk=(x0,noise,col)=>{const p=[];let seed=7;const r=()=>{seed=(seed*16807)%2147483647;return seed/2147483647-.5};for(let i=0;i<=200;i++){const x=i/200*270;let y=r()*noise+Math.sin(i/9)*noise*.5;[[50,60],[110,45],[170,32]].forEach(([c,a],j)=>{y+=a*Math.exp(-Math.pow((i-c)/3,2))*(j%2?-1:1)});p.push([x0+x,150-y])}return PTH(p,col,1.8)};
 s+=RC(20,36,290,230,FC.ln,'#fff',1.2,8)+LN(30,150,300,150,FC.ln,1)+mk(30,34,FC.red);
 s+=RC(330,36,290,230,FC.ln,'#fff',1.2,8)+LN(340,150,610,150,FC.ln,1)+mk(340,3,FC.gn);
 s+=TX(165,284,'Störpegel (μ-Schwankung) verdeckt die künstlichen Fehler',{c:FC.red,s:11.5})+TX(475,284,'Fehlersignale klar erkennbar',{c:FC.gn,s:11.5});
 return SV(640,300,s)};
FIGS.v2_segment=()=>{let s=GRID(640,300,40);
 const pan=(x0,t,col1,rot)=>{let q=TX(x0+100,24,t,{b:1,c:FC.pri,s:12});q+=RC(x0,170,200,34,FC.gr,'#d9e3ec',1.4);return q};
 // a) Standard
 s+=pan(20,'a) Standardanordnung')+RC(70,100,100,50,FC.pri,'#fff',2,4)+RC(95,120,50,70,FC.red,'#fff',2,4).replace(/.*/,'');
 s+=`<rect x="60" y="92" width="120" height="30" rx="5" fill="#fff" stroke="${FC.pri}" stroke-width="2"/><rect x="104" y="118" width="32" height="42" rx="5" fill="#fff" stroke="${FC.red}" stroke-width="2"/>`+TX(120,112,'Feldspule 1',{c:FC.pri,s:11,b:1})+TX(190,142,'Messspule 2',{c:FC.red,s:11,b:1,a:'start'});
 s+=PA('M85 122 C80 150 80 168 96 172',FC.bl,1.4,'none','stroke-dasharray="4 3"')+PA('M155 122 C160 150 160 168 144 172',FC.bl,1.4,'none','stroke-dasharray="4 3"')+TX(52,150,'3',{c:FC.bl,b:1})+TX(176,162,'3',{c:FC.bl,b:1});
 // b) liegende Feldspule
 s+=pan(230,'b) liegende Feldspule');
 s+=`<rect x="262" y="120" width="130" height="30" rx="5" fill="#fff" stroke="${FC.pri}" stroke-width="2"/><rect x="302" y="96" width="30" height="62" rx="5" fill="#fff" stroke="${FC.red}" stroke-width="2"/>`;
 s+=[0,1].map(i=>PA(`M${268+i*12} 150 C${262+i*10} 168 ${270+i*10} 172 ${280+i*10} 172`,FC.bl,1.4,'none','stroke-dasharray="4 3"')+PA(`M${386-i*12} 150 C${392-i*10} 168 ${384-i*10} 172 ${374-i*10} 172`,FC.bl,1.4,'none','stroke-dasharray="4 3"')).join('');
 s+=TX(330,236,'Felder entkoppelt:',{s:11.5,c:FC.gr})+TX(330,252,'keine Sekundärspannung',{s:11.5,c:FC.gr});
 // c) senkrecht
 s+=pan(440,'c) senkrecht stehende Feldspule');
 s+=`<rect x="520" y="90" width="30" height="62" rx="5" fill="#fff" stroke="${FC.pri}" stroke-width="2"/><rect x="480" y="116" width="110" height="30" rx="5" fill="#fff" stroke="${FC.red}" stroke-width="2"/>`;
 s+=PA('M512 120 C500 150 500 170 520 172',FC.bl,1.4,'none','stroke-dasharray="4 3"')+PA('M558 120 C570 150 570 170 550 172',FC.bl,1.4,'none','stroke-dasharray="4 3"');
 s+=TX(540,236,'bei Inhomogenität:',{s:11.5,c:FC.gr})+TX(540,252,'verzerrtes Feld → Signal',{s:11.5,c:FC.gr});
 return SV(660,280,s)};
FIGS.v2_segsig=()=>{let s=GRID(640,260,40);
 s+=TX(160,22,'a) Einlauf eines Längsrisses',{b:1,c:FC.pri,s:12})+TX(480,22,'b) Fehlerspannung',{b:1,c:FC.pri,s:12});
 s+=RC(20,120,280,60,FC.gr,'#d9e3ec',1.6)+LN(60,150,260,150,FC.red,3.5)+TX(160,172,'Längsriss',{c:FC.red,s:11,b:1});
 s+=RC(150,50,34,40,FC.pri,'#fff',2,4)+AR(167,100,167,138,FC.gr,1.5).replace(/.*/,'')+AR(240,64,205,64,FC.gr,1.8)+TX(235,52,'Bewegung',{c:FC.gr,s:11});
 s+=PA('M 160 90 L 160 120',FC.gr,1.4);
 s+=AR(340,200,600,200,FC.gr,1.4)+AR(350,222,350,40,FC.gr,1.4);
 const p=[];for(let i=0;i<=120;i++){const x=i/120*240;const y=i<30?0:i<50?(i-30)/20*70:i<80?70-(i-50)/30*0:i<100?70-(i-80)/20*70:0;p.push([360+x,200-y])}
 s+=PTH(p,FC.red,2.6)+TX(480,112,'Rissverlauf',{c:FC.red,s:11})+TX(600,216,'t',{i:1,c:FC.gr});
 return SV(640,250,s)};
const COILP=(x,y,n,vert)=>{let d='';for(let i=0;i<n;i++)d+=vert?`M${x} ${y+i*14} a7 7 0 0 1 0 14`:`M${x+i*14} ${y} a7 7 0 0 1 14 0`;return PA(d,'#5a2c10',4.4,'none','stroke-linecap="round"')+PA(d,'url(#cuS)',2.8,'none','stroke-linecap="round" class="cu"')};
FIGS.v2_trafo=()=>{let s=GRID(600,280,40);
 s+=CI(60,140,26,FC.ink,'#fff',2)+PA('M48 140q6-12 12 0t12 0',FC.ink,2)+LN(60,114,60,70)+LN(60,70,120,70)+LN(60,166,60,210)+LN(60,210,120,210)+PA('M120 70 q14 0 14 12 t0 12 t0 12 t0 12 t0 12',FC.ink,2.2).replace(/.*/,'')+COILP(130,70,0,true);
 s+=PA('M120 70 L120 90 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14 q-14 7 0 14 L120 210',FC.ink,2.2)+TX(150,228,'Primär (Erreger)',{s:11,c:FC.pri,b:1});
 s+=PA('M200 90 q14 7 0 14 q14 7 0 14 q14 7 0 14 q14 7 0 14 L200 80',FC.ink,2.2).replace(/.*/,'')+PA('M215 70 L215 90 q14 7 0 14 q14 7 0 14 q14 7 0 14 q14 7 0 14 L215 130',FC.ink,2.2)+PA('M215 130 L215 150 q14 7 0 14 q14 7 0 14 q14 7 0 14 q14 7 0 14 L215 210',FC.ink,2.2);
 s+=LN(215,70,380,70)+LN(215,210,380,210)+LN(215,130,380,130)+RC(380,60,70,160,FC.pri,'#eef4fa',1.6,8)+TX(415,138,'Aus-',{s:12,c:FC.pri})+TX(415,154,'werte-',{s:12,c:FC.pri})+TX(415,170,'schaltung',{s:12,c:FC.pri});
 s+=TX(262,110,'Sekundär 1',{s:11,c:FC.red,b:1,a:'start'})+TX(262,190,'Sekundär 2',{s:11,c:FC.red,b:1,a:'start'})+TX(262,240,'Differenzanordnung, galvanisch getrennt von der Primärseite',{s:11.5,c:FC.gr,a:'middle'});
 s+=TX(172,50,'Kopplung (Feld)',{c:FC.bl,s:11})+PA('M140 60 C160 40 190 40 210 60',FC.bl,1.4,'none','marker-end="url(#ah)"');
 return SV(600,270,s)};
FIGS.v2_bridge=()=>{let s=GRID(600,280,40);
 const z=(x,y,t,hatch)=>RC(x-26,y-12,52,24,hatch?FC.gr:FC.ink,hatch?'#e3ebf2':'#fff',1.8)+TX(x,y+4,t,{s:12,b:1});
 s+=LN(120,140,200,60)+LN(120,140,200,220)+LN(400,140,320,60)+LN(400,140,320,220);
 s+=RC(200,48,120,24,FC.ink,'#fff',1.8).replace(/.*/,'')+z(220,60,'L_1',0)+LN(246,60,294,60)+z(320,60,'L_2',1).replace(/.*/,'')+z(320,60,'Z_1',1);
 s+=z(220,220,'L_2',0)+LN(246,220,294,220)+z(320,220,'Z_2',1);
 s+=CI(120,140,4,FC.ink,FC.ink)+CI(400,140,4,FC.ink,FC.ink)+CI(270,60,3,FC.ink,FC.ink);
 s+=PA('M270 60 L270 20 L120 20 L120 40',FC.ink,0).replace(/.*/,'')+CI(260,140,22,FC.ink,'#fff',1.8)+PA('M248 140q6-12 12 0t12 0',FC.ink,2)+LN(120,140,238,140).replace(/.*/,'')+LN(120,140,238,140)+LN(282,140,400,140);
 s+=TX(90,144,'1',{b:1,c:FC.gr})+TX(430,144,'3',{b:1,c:FC.gr})+TX(270,48,'2',{b:1,c:FC.gr,s:11});
 s+=TX(300,106,'Messspulen (Differenz)',{s:11,c:FC.pri,b:1})+TX(300,262,'schraffiert: zweite Brückenhälfte, meist im Gerät',{s:11.5,c:FC.gr});
 return SV(600,275,s)};
FIGS.v2_param=()=>{let s=GRID(480,230,40);
 s+=CI(80,115,26,FC.ink,'#fff',2)+PA('M68 115q6-12 12 0t12 0',FC.ink,2)+LN(80,89,80,60)+LN(80,60,200,60)+LN(80,141,80,170)+LN(80,170,200,170)+PA('M200 60 L200 80 q16 8 0 16 q16 8 0 16 q16 8 0 16 q16 8 0 16 L200 170',FC.ink,2.4)+TX(236,118,'L',{b:1,s:15})+TX(300,118,'Erreger = Empfänger',{c:FC.pri,s:12,a:'start',b:1})+TX(300,138,'nur 2 Anschlüsse',{c:FC.gr,s:12,a:'start'})+TX(240,210,'Absolutsystem, einfachste Anordnung',{c:FC.gr,s:12});
 return SV(480,225,s)};
FIGS.v2_tree=()=>{let s=GRID(640,320,40);
 s+=BX(250,10,140,34,'Wirbelstromgeräte')+LN(320,44,320,62)+LN(160,62,480,62)+LN(160,62,160,76)+LN(480,62,480,76);
 s+=BX(100,76,120,32,'Prüfgeräte')+BX(420,76,120,32,'Messgeräte');
 s+=LN(160,108,160,126)+LN(80,126,240,126)+LN(80,126,80,140)+LN(240,126,240,140)+BX(30,140,100,32,'Oberflächen-|prüfung')+BX(190,140,100,32,'QS-Prüfung');
 s+=LN(480,108,480,126)+LN(420,126,540,126)+LN(420,126,420,140)+LN(540,126,540,140)+BX(360,140,120,32,'Differenz-|verfahren')+BX(490,140,120,32,'Absolut-|verfahren');
 s+=LN(80,172,80,190)+LN(240,172,240,190)+BX(10,190,80,28,'automatisch')+BX(100,190,70,28,'Hand')+BX(190,190,80,28,'automatisch')+BX(280,190,60,28,'Hand');
 s+=LN(420,172,420,190)+BX(360,190,120,34,'keine|Anwendung',0,FC.gr)+LN(550,172,550,186)+LN(501,186,597,186)+LN(501,186,501,200)+LN(597,186,597,200)+BX(456,200,90,34,'physikalische|Eigenschaft')+BX(552,200,90,34,'geometrische|Eigenschaft');
 s+=TX(160,252,'Verfahren der Prüfgeräte:',{s:12,b:1,c:FC.pri})+BX(20,262,120,34,'Differenzverfahren')+BX(150,262,150,34,'Differenz-Absolut-V.')+BX(310,262,100,34,'Absolut-V.')+BX(420,262,200,34,'Quasidifferenz (Fremdvergleich)');
 return SV(650,310,s)};
FIGS.v2_blk_cond=()=>{let s=GRID(640,240,40);
 s+=BX(10,90,80,52,'Oszillator','1')+BX(140,30,130,56,'Messkreis|mit Messtaster','2')+BX(140,146,130,56,'Kompensations-|kreis (Skala)','3')+BX(330,86,110,56,'Differenz-|verstärker','4')+BX(490,86,120,56,'Null-Instrument','5');
 s+=AR(90,116,140,66)+AR(90,116,140,170)+AR(270,60,330,102)+AR(270,174,330,126)+AR(440,114,490,114);
 s+=PA('M205 202 Q205 224 160 224',FC.red,1.4,'none','marker-end="url(#ah)"').replace(/.*/,'')+TX(210,224,'Kompensationsspannung einstellen, bis Anzeige = 0 → Leitfähigkeit an Skala ablesen',{s:11.5,c:FC.red,a:'start'}).replace(/.*/,'')+TX(320,228,'Kompensation verstellen, bis die Anzeige 0 zeigt – Leitfähigkeit an der Skala ablesen',{s:12,c:FC.red});
 return SV(640,240,s)};
FIGS.v2_blk_sort=()=>{let s=GRID(700,300,40);
 s+=BX(10,110,70,48,'Oszillator','1')+BX(110,40,60,44,'Spule','2')+BX(110,184,60,44,'Spule','3')+BX(200,110,80,48,'Differenz-|verstärker','5')+BX(110,110,70,48,'Phasen-|steller','4').replace(/.*/,'');
 s+=BX(300,110,70,48,'Band-|sperre','6')+BX(390,110,70,48,'Band-|pass','7')+BX(480,40,90,44,'Oszillograph','8')+BX(480,110,90,48,'Demodulator','9')+BX(600,40,80,40,'Digital-|anzeige','10')+BX(600,92,80,40,'Analog-|anzeiger','11')+BX(480,184,90,44,'Sortier-|elektronik','13')+BX(600,184,80,44,'Melde-|lampe','12');
 s+=BX(110,110,70,48,'Phasen-|steller','4');
 s+=AR(80,134,110,134)+AR(60,110,60,62).replace(/.*/,'')+LN(45,110,45,62)+AR(45,62,110,62)+LN(45,158,45,206)+AR(45,206,110,206)+AR(170,62,230,110)+AR(170,206,230,158)+AR(180,134,200,134)+AR(280,134,300,134)+AR(370,134,390,134)+AR(460,134,480,134)+AR(460,120,480,64)+AR(525,158,525,184)+AR(570,206,600,206)+AR(570,134,600,112)+AR(570,126,600,66);
 s+=PA('M145 158 L145 250 L525 250 L525 158',FC.am,1.4,'none','stroke-dasharray="4 3"')+TX(335,268,'Referenzspannung vom Phasensteller zum Demodulator',{s:11.5,c:FC.am});
 return SV(700,280,s)};
FIGS.v2_blk_basic=()=>{let s=GRID(700,200,40);
 const L=[['Wechselstrom-|generator','1'],['Prüfspule','2'],['Verstärker','3'],['Amplituden-|Phasen-|demodulation','4'],['Signal-|aufbereitung|(NF-Filter,|Verstärkung,|Phasensteller)','5'],['Signal-|darstellung|(Oszillograph,|Schreiber)','6']];
 L.forEach((b,i)=>{s+=BX(10+i*113,60,96,92,b[0],b[1])});for(let i=0;i<5;i++)s+=AR(106+i*113,106,123+i*113,106);
 s+=TX(350,186,'Grundausrüstung: Handauswertung im Labor oder bei visueller Fehlersignalbewertung',{s:12,c:FC.gr});
 return SV(700,200,s)};
FIGS.v2_blk_auto=()=>{let s=GRID(740,300,40);
 s+=BX(10,100,86,70,'Wechsel-|strom-|generator','1')+BX(130,100,86,70,'Prüfkopf|Prüfspule','2')+BX(250,100,80,70,'Verstär-|kung','3')+BX(360,100,92,70,'Amplituden-|und Phasen-|demodulation','4')+BX(490,100,100,70,'Signal-|aufbereitung','5')+BX(630,60,100,56,'Signal-|darstellung','6')+BX(630,136,100,50,'Signal-|bewertung','7')+BX(630,210,100,50,'Markier- und|Sortier-|elektronik','8')+BX(130,200,86,60,'Magnetische|Sättigung','9')+BX(130,20,86,50,'Gleichstrom-|speisung','10');
 s+=AR(96,135,130,135)+AR(216,135,250,135)+AR(330,135,360,135)+AR(452,135,490,135)+AR(590,120,630,100)+AR(590,150,630,160)+AR(680,186,680,210)+AR(173,200,173,170)+AR(173,70,173,100);
 s+=TX(670,284,'Sortieren / Markieren',{s:11.5,c:FC.gr});
 return SV(740,300,s)};
FIGS.v2_blk_self=()=>{let s=GRID(760,330,40);
 s+=BX(10,130,86,70,'Wechsel-|strom-|generator','1')+BX(130,130,86,70,'Prüfkopf|Prüfspule','2')+BX(250,130,80,70,'Verstär-|kung','3')+BX(360,130,92,70,'Amplituden-|und Phasen-|demodulation','4')+BX(490,130,100,70,'Signal-|aufbereitung','5')+BX(630,90,100,56,'Signal-|darstellung','6')+BX(630,166,100,50,'Signal-|bewertung','7')+BX(630,240,100,56,'Markier- und|Sortier-|elektronik','8')+BX(130,230,86,56,'Magnetische|Sättigung','9')+BX(120,56,106,40,'Fehlersignal-|simulator','11')+BX(250,10,160,40,'Selbstüberwachung','12');
 s+=AR(96,165,130,165)+AR(216,165,250,165)+AR(330,165,360,165)+AR(452,165,490,165)+AR(590,150,630,118)+AR(590,180,630,190)+AR(680,216,680,240)+AR(173,230,173,200)+AR(173,94,173,130)+AR(520,130,520,30).replace(/.*/,'')+PA('M680 240 L680 226',FC.ink,0).replace(/.*/,'')+PA('M410 30 L760 30',FC.ink,0).replace(/.*/,'');
 s+=PA('M740 150 L748 150 L748 30 L410 30',FC.red,1.8,'none','marker-end="url(#ah)"')+PA('M250 30 L173 30 L173 50',FC.red,1.8,'none','marker-end="url(#ah)"').replace(/.*/,'')+LN(250,30,173,30,FC.red,1.8)+LN(173,30,173,50,FC.red,1.8);
 s+=TX(400,320,'Der Simulator speist ein künstliches Fehlersignal ein; die Selbstüberwachung prüft die Reaktion der Kette.',{s:12,c:FC.gr});
 return SV(760,330,s)};
FIGS.v2_eval=()=>{let s=GRID(660,280,40);
 const pan=(x0,t)=>TX(x0+100,22,t,{b:1,c:FC.pri,s:12})+SCR(x0,34,200,200)+LN(x0+100,40,x0+100,228,'#1c4a35',1)+LN(x0+6,134,x0+194,134,'#1c4a35',1);
 s+=pan(10,'a) Amplitude (Kreis)')+pan(230,'b) Y-Komponente')+pan(450,'c) Sektor');
 s+=CI(110,134,48,FC.am,'none',1.8)+AR(110,134,140,170,FC.gr,2.4)+AR(110,134,126,120,FC.gn,2.4).replace(/.*/,'');
 s+=AR(110,134,160,66,'#7fd1ff',2.2)+TX(180,60,'Fehler',{s:10,c:'#7fd1ff'}).replace(/.*/,'')+TX(132,150,'unter Schwelle',{s:10,c:'#bbb',a:'start'}).replace(/.*/,'');
 s+=LN(240,100,420,100,FC.am,1.8,'stroke-dasharray="5 3"')+TX(330,92,'Schwelle Y',{s:10.5,c:FC.am})+AR(330,134,380,60,'#7fd1ff',2.2)+AR(330,134,396,84,'#7fd1ff',2.2)+AR(330,134,396,144,FC.gr,2.2)+TX(386,56,'1',{s:11,c:'#7fd1ff'})+TX(406,82,'2',{s:11,c:'#7fd1ff'})+TX(406,160,'3',{s:11,c:'#aaa'});
 s+=PA('M550 134 L618 68 A95 95 0 0 1 636 100 Z',FC.am,1.6,'rgba(255,185,56,.18)')+AR(550,134,600,92,'#7fd1ff',2.4)+TX(606,86,'1',{s:11,c:'#7fd1ff'})+AR(550,134,600,180,FC.gr,2.2)+TX(608,190,'2',{s:11,c:'#aaa'})+AR(550,134,520,70,FC.gr,2.2)+TX(514,64,'3',{s:11,c:'#aaa'});
 s+=AR(110,134,170,96,'#7fd1ff',2.4)+TX(180,90,'1',{s:11,c:'#7fd1ff'})+AR(110,134,92,114,FC.gr,2.4)+TX(84,110,'2',{s:11,c:'#aaa'});
 s+=TX(110,254,'Signal über dem Kreis zählt –',{s:11,c:FC.gr})+TX(110,268,'phasenunabhängig',{s:11,c:FC.gr})+TX(330,254,'Y-Komponente muss die',{s:11,c:FC.gr})+TX(330,268,'Schwelle erreichen',{s:11,c:FC.gr})+TX(550,254,'nur Signale im Sektor',{s:11,c:FC.gr})+TX(550,268,'(Betrag + Phase) zählen',{s:11,c:FC.gr});
 return SV(660,280,s)};
FIGS.v2_korr=()=>{let s=GRID(680,300,40);
 s+=RC(20,40,230,34,FC.gr,'#d9e3ec',1.6)+TX(135,62,'Prüfgut  →  v',{s:12,c:FC.pri});
 s+=RC(60,90,60,40,FC.pri,'#fff',1.8,4)+TX(90,114,'Geber 1',{s:11.5,b:1})+RC(150,90,60,40,FC.pri,'#fff',1.8,4)+TX(180,114,'Geber 2',{s:11.5,b:1})+AR2(90,140,180,140,FC.gr,1.4)+TX(135,158,'Abstand a',{s:11.5,c:FC.gr});
 s+=BX(280,50,100,44,'Verzögerung|t = a / v')+BX(280,130,100,44,'Geber 2|Signal')+BX(420,90,100,56,'Koinzidenz|(UND)')+BX(560,90,100,56,'Auswertung|Markierung');
 s+=AR(210,100,280,72).replace(/.*/,'')+LN(120,110,120,72).replace(/.*/,'')+AR(250,60,280,70,FC.ink,1.4).replace(/.*/,'')+AR(380,72,420,108)+AR(380,152,420,128)+AR(520,118,560,118)+AR(120,92,280,70).replace(/.*/,'')+LN(90,90,90,70).replace(/.*/,'');
 s+=PA('M90 90 L90 76 L270 76 L270 72 L280 72',FC.ink,1.4,'none','marker-end="url(#ah)"').replace(/.*/,'')+LN(250,100,270,100).replace(/.*/,'');
 s+=PA('M90 90 Q90 70 280 70',FC.bl,1.4,'none','marker-end="url(#ah)"')+PA('M180 130 Q200 152 280 152',FC.bl,1.4,'none','marker-end="url(#ah)"');
 s+=TX(340,240,'Nur wenn beide Signale zum erwarteten Zeitpunkt zugleich eintreffen, gilt der Fehler als echt.',{s:12,c:FC.gr});
 const p=(x0,y0,t0)=>{const q=[];for(let i=0;i<=60;i++){const x=i*3;q.push([x0+x,y0-(x>t0&&x<t0+30?30*Math.sin((x-t0)/30*Math.PI):0)])}return PTH(q,FC.red,2)};
 
 return SV(680,300,s)};

"use strict";
const HY=(ox,oy,sx,sy,Bs=1,Hc=.28,w=.45,n=60)=>{const up=[],dn=[];for(let i=0;i<=n;i++){const H=-2.4+4.8*i/n;up.push([ox+H*sx,oy-sy*Bs*Math.tanh((H-Hc)/w)]);dn.push([ox+(2.4-4.8*i/n)*sx,oy-sy*Bs*Math.tanh(((2.4-4.8*i/n)+Hc)/w)])}return [up,dn]};
const BHAX=(ox,oy,W,H,xl='H',yl='B')=>AR(ox-W/2,oy,ox+W/2,oy,FC.gr,1.5)+AR(ox,oy+H/2,ox,oy-H/2,FC.gr,1.5)+TX(ox+W/2-6,oy+18,xl,{a:'end',i:1,c:FC.gr,b:1})+TX(ox+10,oy-H/2+8,yl,{a:'start',i:1,c:FC.gr,b:1});
const NEU=(ox,oy,sx,sy,Bs=1,w=.9,Hm=2.3,n=40)=>{const p=[];for(let i=0;i<=n;i++){const H=Hm*i/n;p.push([ox+H*sx,oy-sy*Bs*Math.tanh(H/w)])}return p};
FIGS.v3_hyst=()=>{const ox=300,oy=160,sx=90,sy=105;let s=GRID(620,320,40)+BHAX(ox,oy,520,300);
 const [u,d]=HY(ox,oy,sx,sy);s+=PTH(NEU(ox,oy,sx,sy,1,.62),FC.gr,2,'stroke-dasharray="6 4"')+PTH(u,FC.bl,2.8)+PTH(d,FC.bl,2.8);
 s+=LN(ox-260,oy-sy,ox+260,oy-sy,FC.ln,1,'stroke-dasharray="3 3"')+TX(ox+262,oy-sy-6,'Sättigung B_s',{a:'end',c:FC.gr,s:12})+CI(ox+.28*0*sx,oy-sy*Math.tanh(.28/.45),5,FC.red,FC.red)+TX(ox+10,oy-sy*Math.tanh(.28/.45)-8,'Remanenz B_r',{a:'start',c:FC.red,s:12,b:1})+CI(ox+.28*sx,oy,5,FC.or,FC.or)+TX(ox+.28*sx+6,oy+18,'Koerzitivfeldstärke H_c',{a:'start',c:FC.or,s:12,b:1});
 s+=TX(ox+150,oy+60,'Neukurve (gestrichelt)',{c:FC.gr,s:12})+TX(ox-130,oy-sy-8,'Sättigung bei etwa 1 T (Größenordnung)',{c:FC.gr,s:11});
 s+=TX(ox+200,oy+34,'H ≈ 20–60 A/cm',{c:FC.gr,s:11});
 return SV(620,320,s)};
FIGS.v3_abs=()=>{const ox=90,oy=250,sx=130,sy=170;let s=GRID(560,280,40)+AR(ox,oy,ox+420,oy,FC.gr,1.5)+AR(ox,oy,ox,oy-240,FC.gr,1.5)+TX(ox+414,oy+18,'H',{a:'end',i:1,b:1,c:FC.gr})+TX(ox+10,oy-232,'B',{a:'start',i:1,b:1,c:FC.gr});
 s+=PTH(NEU(ox,oy,sx,sy,1,.9,2.8),FC.bl,2.8);const H=1.2,B=Math.tanh(H/.9);s+=LN(ox,oy,ox+H*sx*1.5,oy-B*sy*1.5,FC.red,2)+CI(ox+H*sx,oy-B*sy,5,FC.red,FC.red);
 s+=LN(ox+H*sx,oy,ox+H*sx,oy-B*sy,FC.ln,1.2,'stroke-dasharray="4 3"')+LN(ox,oy-B*sy,ox+H*sx,oy-B*sy,FC.ln,1.2,'stroke-dasharray="4 3"')+TX(ox+H*sx,oy+18,'H',{c:FC.gr})+TX(ox-8,oy-B*sy+4,'B',{a:'end',c:FC.gr})+TX(ox+260,oy-110,'μ = B / H  (Steigung der Geraden',{a:'start',c:FC.red,b:1,s:12})+TX(ox+260,oy-92,'vom Nullpunkt zum Arbeitspunkt)',{a:'start',c:FC.red,b:1,s:12});
 return SV(560,280,s)};
FIGS.v3_amp=()=>{const ox=300,oy=160,sx=90,sy=105;let s=GRID(620,320,40)+BHAX(ox,oy,520,300);
 const [u,d]=HY(ox,oy,sx,sy);s+=PTH(u,FC.ln,2)+PTH(d,FC.ln,2);
 const a=[],b=[];for(let i=0;i<=30;i++){const H=-.28+.56*i/30;a.push([ox+H*sx,oy-sy*(.42*H/.28*.28*.9+(-.0))]);}
 const sl=1.4;s+=PA(`M${ox-.45*sx} ${oy+.45*sl*sy*.68} L${ox+.45*sx} ${oy-.45*sl*sy*.68}`,FC.red,3)+`<ellipse cx="${ox}" cy="${oy}" rx="26" ry="9" transform="rotate(-24 ${ox} ${oy})" fill="rgba(214,40,57,.12)" stroke="${FC.red}" stroke-width="2"/>`;
 s+=TX(ox+60,oy+50,'kleine Wechselfeldschleife um H = 0',{a:'start',c:FC.red,s:12,b:1})+TX(ox+60,oy+68,'Steigung = μ_{amp}',{a:'start',c:FC.red,s:12,b:1});
 return SV(620,320,s)};
FIGS.v3_ueber=()=>{const ox=250,oy=200,sx=90,sy=105;let s=GRID(620,320,40)+BHAX(ox,oy,480,320);
 const [u,d]=HY(ox,oy,sx,sy);s+=PTH(u,FC.ln,2)+PTH(d,FC.ln,2);
 const H0=.9;const X=ox+H0*sx,Y=oy-sy*Math.tanh((H0-.28)/.45)*.98;
 s+=LN(X,oy,X,Y,FC.gr,1.2,'stroke-dasharray="4 3"')+TX(X,oy+18,'H_0 (Gleichfeld)',{c:FC.gr,s:12});
 s+=`<ellipse cx="${X}" cy="${Y}" rx="22" ry="5" transform="rotate(-8 ${X} ${Y})" fill="rgba(214,40,57,.12)" stroke="${FC.red}" stroke-width="2"/>`+PA(`M${X-30} ${Y+8} L${X+30} ${Y-8}`,FC.red,3);
 s+=AR2(X-22,Y+30,X+22,Y+30,FC.red,1.4)+TX(X,Y+48,'ΔH',{c:FC.red,b:1})+TX(X+50,Y-24,'Steigung = μ_{Δ}',{a:'start',c:FC.red,b:1,s:12});
 return SV(620,320,s)};
FIGS.v3_dh=()=>{const ox=250,oy=200,sx=90,sy=105;let s=GRID(620,320,40)+BHAX(ox,oy,480,320);
 const [u,d]=HY(ox,oy,sx,sy);s+=PTH(u,FC.ln,2)+PTH(d,FC.ln,2);
 const H0=.4,X=ox+H0*sx,Y=oy-sy*Math.tanh((H0-.28)/.45)*.98;
 [[10,3,FC.gn,'ΔH klein: μ_{Δ} nahe μ_{rev}'],[24,8,FC.or,'ΔH mittel'],[46,18,FC.red,'ΔH groß: Schleife öffnet sich, μ_{Δ} wächst']].forEach(([rx,ry,c,t],i)=>{s+=`<ellipse cx="${X}" cy="${Y}" rx="${rx}" ry="${ry}" transform="rotate(-18 ${X} ${Y})" fill="none" stroke="${c}" stroke-width="2.2"/>`+TX(ox-230,Y-120+i*18,t,{a:'start',c,s:12,b:1})});
 return SV(620,320,s)};
FIGS.v3_mueff=()=>{const x0=70,y0=290,W=500,H=250;let s=GRID(640,330,40)+AR(x0,y0,x0+W+20,y0,FC.gr,1.5)+AR(x0,y0,x0,y0-H-30,FC.gr,1.5)+TX(x0+W+14,y0+22,'Frequenz f (logarithmisch) →',{a:'end',c:FC.gr,s:12})+TX(x0+8,y0-H-30,'effektive Permeabilität μ_{eff} (log)',{a:'start',c:FC.gr,s:12});
 const ly=v=>y0-(Math.log10(v)+1.5)/3.7*H;[0.1,1,10,100].forEach(v=>{s+=LN(x0-3,ly(v),x0+W,ly(v),FC.ln,1,'stroke-dasharray="3 3"')+TX(x0-8,ly(v)+4,String(v).replace('.',','),{a:'end',s:11,c:FC.gr})});
 [[1,FC.pri],[12,FC.or],[40,FC.red]].forEach(([mu,c],j)=>{const p=[];for(let i=0;i<=120;i++){const lk1=-3+i/120*5.5;const k=Math.pow(10,lk1)*mu;const m=muEffRod(k);const v=Math.max(.04,Math.abs(mu*m[0]));p.push([x0+(i/120)*W,ly(v)])}s+=PTH(p,c,2.6)+TX(x0+W-6,p[p.length-1][1]-8,'μ_{Δ} = '+mu,{a:'end',c,b:1,s:12})});
 s+=TX(x0+W/2,y0+40,'Geometrie (Vollzylinder, η = 1): Wirkung von μ_{Δ} endet, sobald der Skineffekt das Feld aus dem Material verdrängt',{c:FC.gr,s:11});
 return SV(640,345,s)};
FIGS.v3_sigmu=()=>{let s=GRID(660,300,40);
 const pan=(x0,t,aS,aM,note)=>{let q=TX(x0+140,22,t,{b:1,c:FC.pri})+SCR(x0,34,280,220)+LN(x0+140,40,x0+140,248,'#1c4a35',1)+LN(x0+8,190,x0+272,190,'#1c4a35',1);
  const ang=(a,L,c,lab)=>{const r=a*Math.PI/180;const ex=x0+60+Math.cos(r)*L,ey=190-Math.sin(r)*L;return AR(x0+60,190,ex,ey,c,3)+TX(ex+(Math.cos(r)>0?12:-12),ey,lab,{c,b:1,s:13,a:Math.cos(r)>0?'start':'end'})};
  q+=ang(aS,120,'#7fd1ff','Δσ')+ang(aM,120,'#ff8a96','Δμ');q+=TX(x0+140,274,note,{s:11.5,c:FC.gr});return q};
 s+=pan(10,'niedrige Prüffrequenz',-35,60,'Richtungen deutlich verschieden');s+=pan(350,'hohe Prüffrequenz',-35,-8,'Richtungen nähern sich an');
 return SV(660,290,s)};
FIGS.v3_probe=()=>{let s=GRID(560,300,40);
 s+=RC(160,200,240,34,FC.gr,'#d9e3ec',1.6)+TX(280,222,'austenitischer Stahl (σ ≈ 1…2 MS/m)',{s:12,c:FC.pri})+`<ellipse cx="280" cy="236" rx="40" ry="10" fill="rgba(214,40,57,.25)" stroke="${FC.red}"/>`+TX(280,258,'δ-Ferrit-Einschluss',{c:FC.red,s:11.5,b:1});
 s+=RC(240,40,80,120,FC.pri,'#eef4fa',2,6);
 [[250,50],[250,66]].forEach(([x,y])=>s+=CI(x+12,y,5,FC.ac,FC.ac));[0,1,2].forEach(i=>s+=CI(255+i*17,124,5,FC.ac,FC.ac));
 s+=RC(228,48,104,22,FC.ac,'none',1.6,4)+TX(150,64,'Erregerspulen',{s:12,c:FC.ac,b:1,a:'middle'})+TX(150,80,'(gleichsinnig in Reihe)',{s:11.5,c:FC.gr,a:'middle'});
 s+=RC(246,84,68,26,FC.red,'none',1.6,4)+RC(246,118,68,26,FC.red,'none',1.6,4)+TX(420,98,'obere Messspule',{s:12,c:FC.red,a:'start',b:1})+TX(420,134,'untere Messspule',{s:12,c:FC.red,a:'start',b:1})+TX(420,154,'(gegensinnig geschaltet)',{s:11.5,c:FC.gr,a:'start'});
 s+=LN(332,97,410,97,FC.red,1,'stroke-dasharray="3 3"')+LN(332,131,410,131,FC.red,1,'stroke-dasharray="3 3"');
 return SV(560,280,s)};
FIGS.v3_fn=()=>{const x0=80,y0=250,W=420,H=190;let s=GRID(560,290,40)+AR(x0,y0,x0+W+20,y0,FC.gr,1.5)+AR(x0,y0,x0,y0-H-30,FC.gr,1.5);
 const p=[];for(let i=0;i<=60;i++){const t=i/60;p.push([x0+t*W,y0-H*Math.exp(-t*2.8)])}s+=PTH(p,FC.pri,2.8);
 s+=TX(x0+W+14,y0+22,'Cu-Schichtdicke →',{a:'end',c:FC.gr,s:12})+TX(x0+8,y0-H-34,'Ferritzahl FN',{a:'start',c:FC.gr,s:12})+TX(x0+W*.62,y0-H*.62,'je dünner der Cu-Überzug auf dem Weicheisen,',{c:FC.pri,s:12})+TX(x0+W*.62,y0-H*.62+16,'desto größer die zugeordnete Ferritzahl',{c:FC.pri,s:12});
 return SV(560,290,s)};
FIGS.v3_joch=()=>{let s=GRID(640,300,40);
 s+=RC(100,110,440,70,FC.gr,'#dde6ee',1.8,14)+RC(100,120,440,50,FC.gr,'#fff',1.4,10).replace(/.*/,'');
 s+=RC(60,90,60,110,FC.pri,'#eef4fa',2,6)+RC(520,90,60,110,FC.pri,'#eef4fa',2,6)+TX(90,80,'Joch (Magnet)',{c:FC.pri,s:11.5,b:1})+TX(550,80,'Joch',{c:FC.pri,s:11.5,b:1});
 [0,1,2].forEach(i=>{s+=AR(150,128+i*18,490,128+i*18,FC.bl,1.4,'stroke-dasharray="6 4"')});
 s+=CI(250,145,12,FC.red,'#fff',2.2)+TX(250,196,'Bohrung durch die Wand',{c:FC.red,s:12,b:1})+LN(370,114,450,114,FC.or,5)+TX(410,104,'Längsriss (außen)',{c:FC.or,s:12,b:1})+TX(320,238,'Längsmagnetisierung des Rohres durch ein Elektromagnetjoch',{c:FC.gr,s:12});
 return SV(640,260,s)};
FIGS.v3_vor=()=>{const ox=70,oy=270,sx=410,sy=200;let s=GRID(620,310,40)+AR(ox,oy,ox+sx+30,oy,FC.gr,1.5)+AR(ox,oy,ox,oy-sy-40,FC.gr,1.5)+TX(ox+sx+26,oy+20,'H →',{a:'end',c:FC.gr,s:12})+TX(ox+8,oy-sy-36,'B',{a:'start',c:FC.gr,i:1,b:1});
 [[.5,FC.bl,'1'],[1.0,FC.gn,'2'],[2.0,FC.red,'3']].forEach(([w,c,n])=>{const p=[];for(let i=0;i<=60;i++){const t=i/60;p.push([ox+t*sx,oy-sy*Math.tanh(t*3.2/(w*1.6)*.9)*.98])}s+=PTH(p,c,2.6)+TX(ox+sx+4,p[p.length-1][1]+4,'Ort '+n,{a:'start',c,b:1,s:12})});
 s+=LN(ox+90,oy+4,ox+90,oy-sy,FC.or,1.6,'stroke-dasharray="5 4"')+TX(ox+90,oy+20,'zu klein:',{c:FC.or,s:11.5,b:1})+TX(ox+90,oy+34,'μ_{Δ} verschieden',{c:FC.or,s:11})+LN(ox+330,oy+4,ox+330,oy-sy,FC.gn,1.6,'stroke-dasharray="5 4"')+TX(ox+330,oy+20,'ausreichend:',{c:FC.gn,s:11.5,b:1})+TX(ox+330,oy+34,'μ_{Δ} gleich',{c:FC.gn,s:11});
 return SV(620,310,s)};
FIGS.v3_zwickel=()=>{let s=GRID(640,300,40);
 s+=RC(60,70,520,170,FC.gr,'#e9eff5',1.6,6);
 [0,1,2,3,4].forEach(i=>{const y=88+i*28;s+=y>130&&y<160?'':AR(80,y,560,y,FC.bl,1.3,'stroke-dasharray="6 4"')});
 s+=RC(290,128,60,34,FC.red,'#fff',2.2,4)+TX(320,150,'Fehler',{c:FC.red,s:12,b:1});
 s+=PA('M70 118 L286 138 L286 150 L70 170',FC.or,1.2,'rgba(240,163,10,.25)').replace(/.*/,'')+PA('M236 126 Q276 122 288 138 L288 152 Q276 168 236 164 Z',FC.or,1.6,'rgba(240,163,10,.30)')+PA('M404 126 Q364 122 352 138 L352 152 Q364 168 404 164 Z',FC.or,1.6,'rgba(240,163,10,.30)');
 s+=TX(230,196,'Zwickel (nicht gesättigt)',{c:FC.or,s:11.5,b:1})+TX(420,196,'Zwickel',{c:FC.or,s:11.5,b:1})+TX(320,252,'Vor und hinter dem Fehler weichen die Feldlinien aus – dort ist das Material nicht voll gesättigt.',{c:FC.gr,s:12});
 return SV(640,270,s)};
FIGS.v3_sig=()=>{const x0=70,y0=270,W=470,H=210;let s=GRID(620,320,40)+AR(x0,y0,x0+W+20,y0,FC.gr,1.5)+AR(x0,y0,x0,y0-H-30,FC.gr,1.5)+TX(x0+W+14,y0+20,'Vormagnetisierungs-Feldstärke H →',{a:'end',c:FC.gr,s:12})+TX(x0+8,y0-H-32,'Signalhöhe',{a:'start',c:FC.gr,s:12});
 const bo=[],r1=[],r2=[];for(let i=0;i<=100;i++){const t=i/100;bo.push([x0+t*W,y0-H*(.62+.3*(1-Math.exp(-t*5))+.16*Math.exp(-t*3.5)*Math.sin(t*22))]);r1.push([x0+t*W,y0-H*(.18+.55*(1-Math.exp(-t*3)))]);r2.push([x0+t*W,y0-H*(.1+.3*(1-Math.exp(-t*2.2)))])}
 s+=PTH(bo,FC.red,2.6)+PTH(r1,FC.or,2.6)+PTH(r2,FC.bl,2.6)+TX(x0+W-4,bo[100][1]-8,'Bohrung',{a:'end',c:FC.red,b:1,s:12})+TX(x0+W-4,r1[100][1]-8,'breiter Längsriss',{a:'end',c:FC.or,b:1,s:12})+TX(x0+W-4,r2[100][1]-8,'schmaler Längsriss',{a:'end',c:FC.bl,b:1,s:12});
 s+=TX(x0+100,y0-H-6,'Bereich instabiler Arbeitspunkte',{c:FC.gr,s:11.5});
 return SV(620,320,s)};
FIGS.v3_vol=()=>{let s=GRID(640,300,40);
 s+=TX(160,22,'a) Durchlaufsensor',{b:1,c:FC.pri})+TX(480,22,'b) Tastsensor',{b:1,c:FC.pri});
 s+=RC(20,90,280,100,FC.gr,'#e9eff5',1.6,6)+RC(70,60,180,160,FC.pri,'none',2,8)+TX(160,250,'großes erfasstes Volumen',{c:FC.gr,s:12})+RC(150,110,20,16,FC.red,FC.red,1,2)+TX(210,122,'Fehler',{a:'start',c:FC.red,b:1,s:12});
 s+=RC(340,130,280,80,FC.gr,'#e9eff5',1.6,6)+RC(450,90,60,40,FC.pri,'#fff',2,6)+`<ellipse cx="480" cy="140" rx="34" ry="14" fill="rgba(10,168,158,.2)" stroke="${FC.ac}" stroke-width="1.8" stroke-dasharray="4 3"/>`+RC(470,142,16,10,FC.red,FC.red,1,2)+TX(480,250,'kleines, oberflächennahes Volumen',{c:FC.gr,s:12})+TX(530,150,'Fehler',{a:'start',c:FC.red,b:1,s:12});
 return SV(640,270,s)};

"use strict";
const CAX=(x0,y0,W,H,xl,yl)=>AR(x0,y0,x0+W+14,y0,FC.gr,1.5)+AR(x0,y0,x0,y0-H-16,FC.gr,1.5)+TX(x0+W+10,y0+18,xl,{a:'end',c:FC.gr,s:12,i:1})+TX(x0+8,y0-H-14,yl,{a:'start',c:FC.gr,s:12,i:1});
FIGS.v4_ortsk=()=>{const x0=70,y0=300,sx=900,sy=250;let s=GRID(640,340,40)+CAX(x0,y0,520,260,'normierter Wirkanteil','normierter Blindanteil');
 const p=[];for(let i=0;i<=200;i++){const k=Math.pow(10,-2+i/200*4.3);const r=normImp(k,1);p.push([x0+r.R*sx,y0-r.X*sy])}s+=PTH(p,FC.ln,5)+PTH(p,FC.gr,1.6,'stroke-dasharray="5 4"');
 const sg=[.5,1,2,5,10,20,40];
 sg.forEach(v=>{let r=normImp(.8*v,1);s+=CI(x0+r.R*sx,y0-r.X*sy,5,FC.bl,FC.bl);r=normImp(8*v,1);s+=RC(x0+r.R*sx-4.5,y0-r.X*sy-4.5,9,9,FC.red,'#fff',2)});
 s+=CI(330,40,5,FC.bl,FC.bl)+TX(342,44,'niedrige Prüffrequenz',{a:'start',s:12,c:FC.bl,b:1})+RC(325.5,55.5,9,9,FC.red,'#fff',2)+TX(342,64,'hohe Prüffrequenz',{a:'start',s:12,c:FC.red,b:1})+TX(330,84,'Punkte: σ = 0,5 … 40 MS/m',{a:'start',s:11,c:FC.gr});
 s+=TX(x0+300,y0+40,'Bei niedriger Frequenz liegen große Leitfähigkeiten weit auseinander, bei hoher Frequenz die kleinen.',{s:11.5,c:FC.gr});
 return SV(640,345,s)};
FIGS.v4_meter=()=>{let s=GRID(560,280,40);
 s+=RC(150,30,260,190,FC.pri,'#e8f0f8',2.4,18)+RC(176,52,208,70,FC.ink,'#06130e',2,8)+TX(280,98,'18,4 MS/m',{s:26,c:'#3dff95',b:1})+TX(280,140,'31,7 % IACS',{s:14,c:FC.pri,b:1}).replace(/.*/,'');
 s+=[0,1,2].map(i=>RC(180+i*70,150,56,26,FC.pri,'#fff',1.6,6)).join('')+TX(208,168,'Freq.',{s:11})+TX(278,168,'Einheit',{s:11})+TX(348,168,'Justage',{s:11});
 s+=PA('M280 220 C280 245 400 240 440 255',FC.ink,2.5)+RC(436,245,70,24,FC.ac,'#d9f2ef',2,10)+TX(471,262,'Tastsensor',{s:11,b:1,c:FC.pri});
 s+=TX(100,120,'digitale',{s:12,c:FC.gr})+TX(100,136,'Anzeige',{s:12,c:FC.gr})+LN(130,112,176,92,FC.gr,1);
 return SV(560,280,s)};
FIGS.v4_dicke=()=>{const x0=70,y0=300,sx=900,sy=250;let s=GRID(620,340,40)+CAX(x0,y0,500,260,'normierter Wirkanteil','normierter Blindanteil');
 const p=[],q=[],q2=[];for(let i=0;i<=200;i++){const k=Math.pow(10,-2+i/200*4);const r=normImp(k,1);p.push([x0+r.R*sx,y0-r.X*sy]);q.push([x0+r.R*sx*.55,y0-(r.X+(1-r.X)*.38)*sy]);q2.push([x0+r.R*sx*.3,y0-(r.X+(1-r.X)*.62)*sy])}
 s+=PTH(p,FC.pri,2.6)+PTH(q,FC.or,2.2,'stroke-dasharray="6 3"')+PTH(q2,FC.red,2.2,'stroke-dasharray="6 3"');
 s+=TX(x0+330,y0-60,'dicke Probe (≥ 3 δ)',{a:'start',c:FC.pri,b:1,s:12})+TX(x0+250,y0-120,'dünner als δ',{a:'start',c:FC.or,b:1,s:12})+TX(x0+120,y0-205,'noch dünner',{a:'start',c:FC.red,b:1,s:12});
 s+=TX(x0+280,y0+40,'Gleiche Leitfähigkeit – anderer Messpunkt: Das Gerät zeigt einen falschen Wert.',{c:FC.gr,s:11.5});
 return SV(620,345,s)};
FIGS.v4_kruemm=()=>{let s=GRID(660,260,40);
 const coil=(x,y)=>RC(x-24,y-40,48,32,FC.pri,'#fff',2,5)+[0,1,2].map(i=>CI(x-14+i*14,y-24,4,FC.ac,FC.ac)).join('');
 const eddy=(x,y,rx)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="6" fill="none" stroke="${FC.red}" stroke-width="2"/><ellipse cx="${x}" cy="${y+10}" rx="${rx*.6}" ry="4" fill="none" stroke="${FC.red}" stroke-width="2"/>`;
 s+=TX(110,22,'a) eben',{b:1,c:FC.pri})+RC(20,120,180,60,FC.gr,'#d9e3ec',1.6,4)+coil(110,118)+eddy(110,128,46)+TX(110,210,'Referenz',{c:FC.gr,s:12});
 s+=TX(330,22,'b) konvex',{b:1,c:FC.pri})+PA('M250 190 Q330 100 410 190 L410 220 L250 220 Z',FC.gr,1.6,'#d9e3ec')+coil(330,108)+eddy(330,122,30)+TX(330,244,'weniger Wirbelstrom',{c:FC.red,s:12,b:1});
 s+=TX(550,22,'c) konkav',{b:1,c:FC.pri})+PA('M460 120 Q550 220 640 120 L640 220 L460 220 Z',FC.gr,1.6,'#d9e3ec')+coil(550,150)+eddy(550,172,62)+TX(550,244,'mehr Wirbelstrom',{c:FC.red,s:12,b:1});
 return SV(660,260,s)};
FIGS.v4_abstand=()=>{let s=GRID(620,300,40);
 s+=RC(40,200,300,50,FC.gr,'#d9e3ec',1.6,3)+TX(190,230,'Leiter (Grundwerkstoff)',{s:12,c:FC.pri})+RC(40,176,300,24,FC.am,'#fff3d6',1.4,3)+TX(190,193,'Lack / Beschichtung (nicht leitend)',{s:11.5,c:'#8a6200'})+RC(130,110,120,46,FC.pri,'#fff',2,6)+[0,1,2,3].map(i=>CI(150+i*26,134,5,FC.ac,FC.ac)).join('')+TX(190,100,'Tastspule',{b:1,c:FC.pri});
 s+=AR2(330,156,330,200,FC.red,1.6)+TX(344,182,'Abstand',{a:'start',c:FC.red,s:12,b:1});
 // Graph
 const x0=410,y0=250,W=190,H=170;s+=AR(x0,y0,x0+W,y0,FC.gr,1.4)+AR(x0,y0,x0,y0-H,FC.gr,1.4)+TX(x0+W,y0+18,'Abstand',{a:'end',c:FC.gr,s:12,i:1})+TX(x0+6,y0-H+8,'Wirbelstromdichte',{a:'start',c:FC.gr,s:12,i:1});
 const p=[];for(let i=0;i<=40;i++){const t=i/40;p.push([x0+t*(W-14),y0-(H-30)*Math.exp(-t*3)])}s+=PTH(p,FC.red,2.6);
 return SV(620,280,s)};
FIGS.v4_korr_al=()=>{const x0=70,y0=290,W=480,H=220;let s=GRID(620,330,40)+CAX(x0,y0,W,H,'Warmbehandlungstemperatur →','');
 const k=[],h=[];for(let i=0;i<=100;i++){const t=i/100;k.push([x0+t*W,y0-H*(.28+.52*Math.exp(-Math.pow((t-.5)/.26,2)))]);h.push([x0+t*W,y0-H*(.18+.62*Math.exp(-Math.pow((t-.32)/.17,2)))])}
 s+=PTH(k,FC.bl,2.8)+PTH(h,FC.red,2.8);
 const yy=y0-H*.62;s+=LN(x0,yy,x0+W,yy,FC.gr,1.4,'stroke-dasharray="5 4"');
 const xs=[.34,.66].map(t=>x0+t*W);xs.forEach(x=>s+=LN(x,y0,x,yy-30,FC.ln,1.2,'stroke-dasharray="3 3"')+CI(x,yy,5,FC.bl,'#fff',2));
 s+=TX(x0+W*.34,y0+36,'T₁',{c:FC.gr,b:1})+TX(x0+W*.66,y0+36,'T₂',{c:FC.gr,b:1})+TX(x0+W*.5,yy-10,'gleiche Leitfähigkeit',{c:FC.gr,s:11.5})+TX(x0+W-4,k[100][1]-12,'Leitfähigkeit κ',{a:'end',c:FC.bl,b:1,s:12})+TX(x0+W*.26,y0-H*.95,'Härte / Zugfestigkeit',{a:'end',c:FC.red,b:1,s:12});
 s+=TX(x0+W*.5,y0+58,'Zwei Temperaturen, ein κ-Wert → die Leitfähigkeit allein ist doppeldeutig',{c:FC.gr,s:11.5});
 return SV(620,360,s)};
FIGS.v4_ti1=()=>{const x0=70,y0=270,W=470,H=210;let s=GRID(620,320,40)+CAX(x0,y0,W,H,'Leitfähigkeit κ →','');
 const a=[],b=[];for(let i=0;i<=40;i++){const t=i/40;a.push([x0+t*W,y0-H*(.82-.55*t)]);b.push([x0+t*W,y0-H*(.18+.46*t)])}
 s+=PTH(a,FC.red,2.8)+PTH(b,FC.bl,2.8)+TX(x0+W-4,a[40][1]+22,'Zugfestigkeit σ_B',{a:'end',c:FC.red,b:1,s:12})+TX(x0+W-4,b[40][1]-10,'Dehnung δ [%]',{a:'end',c:FC.bl,b:1,s:12});
 s+=TX(x0+W/2,y0+40,'eindeutiger Zusammenhang → Leitfähigkeitsprüfung genügt',{c:FC.gn,b:1,s:12});
 return SV(620,320,s)};
FIGS.v4_ti2=()=>{const x0=70,y0=270,W=470,H=210;let s=GRID(620,320,40)+CAX(x0,y0,W,H,'Leitfähigkeit κ →','');
 let seed=11;const r=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 [[FC.red,.7],[FC.bl,.4],[FC.or,.55]].forEach(([c,m])=>{for(let i=0;i<9;i++){const x=x0+30+r()*(W-60),y=y0-H*(m+(r()-.5)*.5);s+=CI(x,y,5,c,c)}});
 s+=TX(x0+W-4,y0-H-6,'● σ_B',{a:'end',c:FC.red,s:12,b:1}).replace(/.*/,'')+TX(x0+W-150,y0-H-6,'● σ_B',{a:'start',c:FC.red,s:12,b:1})+TX(x0+W-100,y0-H-6,'● σ_{0,2}',{a:'start',c:FC.or,s:12,b:1})+TX(x0+W-40,y0-H-6,'● δ',{a:'start',c:FC.bl,s:12,b:1})+TX(x0+W/2,y0+40,'Punkte streuen ohne erkennbaren Zusammenhang → keine Korrelation',{c:FC.red,b:1,s:12});
 return SV(620,320,s)};
FIGS.v4_hard1=()=>{let s=GRID(560,260,40);
 s+=RC(180,40,200,150,FC.pri,'#e8f0f8',2.4,16)+RC(200,58,160,50,FC.ink,'#06130e',2,6)+TX(280,92,'B 68',{s:24,c:'#3dff95',b:1})+[0,1,2,3].map(i=>CI(214+i*44,140,10,FC.pri,'#fff',1.8)).join('');
 s+=PA('M380 120 C430 120 440 190 480 190',FC.ink,2.6)+RC(470,176,60,28,FC.ac,'#d9f2ef',2,8)+TX(500,194,'Sonde',{s:11.5,b:1,c:FC.pri})+TX(280,226,'Handgerät mit Digitalanzeige',{c:FC.gr,s:12});
 return SV(560,250,s)};
FIGS.v4_hard2=()=>{let s=GRID(560,260,40);
 s+=PA('M60 190 L500 190 L500 230 L60 230 Z',FC.gr,1.6,'#d9e3ec')+TX(280,216,'Bauteil (z. B. Blech vor Ort)',{s:12,c:FC.pri});
 s+=RC(230,60,70,100,FC.ac,'#d9f2ef',2.2,10)+LN(265,160,265,190,FC.ink,3)+TX(265,50,'Prüfsonde',{b:1,c:FC.pri,s:12})+TX(265,110,'Eindruck-',{s:11})+TX(265,124,'körper',{s:11});
 s+=RC(360,70,110,70,FC.pri,'#e8f0f8',2,10)+TX(415,110,'B 68',{s:20,c:FC.pri,b:1})+PA('M300 100 C330 100 340 105 360 105',FC.ink,2.2);
 return SV(560,250,s)};

"use strict";
const MK=(x,y,l,c=FC.red)=>CI(x,y,10,c,'#fff',1.8)+TX(x,y+4,l,{s:11,b:1,c});
const OBJ=(x,y,w,h,r=8)=>RC(x,y,w,h,FC.gr,'#dde6ee',1.8,r);
const LEGD=(x,y,items,c=FC.ink)=>items.map((t,i)=>TX(x,y+i*20,t,{a:'start',s:12,c})).join('');
FIGS.v5_cast=()=>{let s=GRID(640,260,40)+PA('M40 60 L260 60 L260 100 L200 100 L200 200 L40 200 Z',FC.gr,1.8,'#dde6ee');
 s+=`<ellipse cx="120" cy="130" rx="26" ry="16" fill="#fff" stroke="${FC.red}" stroke-width="2" stroke-dasharray="4 3"/>`+TX(120,134,'Lunker',{s:11,c:FC.red,b:1})+`<ellipse cx="205" cy="82" rx="22" ry="8" fill="#fff" stroke="${FC.red}" stroke-width="2" stroke-dasharray="4 3"/>`+TX(205,86,'Lunker',{s:10.5,c:FC.red,b:1});
 s+=TX(150,230,'Querschnittsübergang → Lunkerbildung',{s:12,c:FC.gr});
 s+=RC(340,40,260,170,FC.ink,'#e8e8e8',2,6)+`<ellipse cx="470" cy="125" rx="46" ry="30" fill="#4a4a4a" opacity=".55"/>`+TX(470,130,'Lunker',{s:11,c:'#fff',b:1})+TX(470,232,'Durchstrahlungsaufnahme: dunkler Fleck',{s:12,c:FC.gr});
 return SV(640,250,s)};
FIGS.v5_warmriss=()=>{let s=GRID(640,240,40)+PA('M40 60 L300 60 L300 100 L240 100 L240 190 L40 190 Z',FC.gr,1.8,'#dde6ee');
 s+=PA('M250 100 L262 130 L254 150 L268 176',FC.red,3)+PA('M120 60 L130 95 L124 120',FC.red,3).replace(/.*/,'')+TX(300,150,'Warmriss im Querschnittsübergang',{a:'start',s:12,c:FC.red,b:1});
 s+=OBJ(380,60,240,100,6).replace(/.*/,'')+RC(340,50,280,130,FC.gr,'#dde6ee',1.8,8)+PA('M440 70 L452 105 L444 140',FC.red,2.5,'none','stroke-dasharray="6 4"')+TX(480,190,'unter der Oberfläche liegender Warmriss (Anzeige)',{s:12,c:FC.gr});
 return SV(640,230,s)};
FIGS.v5_gear=()=>{let s=GRID(640,260,40);
 s+=CI(180,125,90,FC.gr,'#dde6ee',1.8)+CI(180,125,28,FC.gr,'#fff',1.6);
 for(let i=0;i<16;i++){const a=i/16*2*Math.PI;s+=LN(180+Math.cos(a)*90,125+Math.sin(a)*90,180+Math.cos(a)*102,125+Math.sin(a)*102,FC.gr,6)}
 s+=MK(262,90,'1')+MK(110,170,'2')+MK(180,58,'3',FC.or);
 s+=LEGD(330,70,['1 Ermüdungsriss im Zahnfuß','2 Lunker / Porosität im Radkörper','3 Warmriss an Speiche/Nabe'])+TX(330,160,'Zahnräder und Laufräder aus Stahlguss',{a:'start',s:12,c:FC.gr});
 return SV(640,250,s)};
FIGS.v5_kern=()=>{let s=GRID(640,240,40)+RC(60,50,300,140,FC.gr,'#dde6ee',1.8,8)+RC(180,100,60,40,FC.pri,'#fff',2,3)+TX(210,125,'Kernstütze',{s:11,c:FC.pri,b:1})+LN(180,100,180,140,FC.red,4,'stroke-dasharray="6 3"')+TX(400,120,'teilweise unverschweißt',{a:'start',s:12,c:FC.red,b:1})+TX(400,140,'→ Anzeige am Rand der Stütze',{a:'start',s:12,c:FC.gr});
 return SV(640,230,s)};
FIGS.v5_welle=()=>{let s=GRID(640,260,40)+RC(40,90,400,70,FC.gr,'#dde6ee',1.8,10);
 s+=MK(90,125,'a')+MK(150,100,'b')+MK(210,150,'c')+MK(270,125,'d')+MK(330,125,'e')+MK(390,100,'f')+MK(240,170,'g').replace(/.*/,'')+MK(240,60,'g',FC.or);
 s+=LEGD(470,60,['a Längsriss','b Dauerbruchanriss (Umlaufbiegung)','c Dauerbruchanriss (Torsion)','d Schlackenzeile','e Seigerungszeile','f Schmiedefalte','g Kernzerschmiedung','   (Schmiedekreuz)']);
 s+=LN(240,70,240,92,FC.or,1.5,'stroke-dasharray="3 3"');
 return SV(660,250,s)};
FIGS.v5_kurbel=()=>{let s=GRID(640,260,40)+RC(40,110,360,30,FC.gr,'#dde6ee',1.8,6)+[80,180,280].map(x=>RC(x,60,40,130,FC.gr,'#dde6ee',1.8,10)).join('');
 s+=MK(100,80,'a')+MK(60,125,'b')+MK(200,80,'c')+MK(300,170,'d')+MK(240,125,'e')+MK(340,125,'f');
 s+=LEGD(440,70,['a Schlackenzeilen, Seigerungen','b Härterisse','c Dauerbruchanriss','d Risse','e Schleifrisse','f Schmiedefalte']);
 return SV(660,250,s)};
FIGS.v5_pleuel=()=>{let s=GRID(640,260,40)+CI(100,130,60,FC.gr,'#dde6ee',1.8)+CI(100,130,34,FC.gr,'#fff',1.6)+CI(330,130,34,FC.gr,'#dde6ee',1.8)+CI(330,130,16,FC.gr,'#fff',1.6)+PA('M150 100 L300 112 L300 148 L150 160 Z',FC.gr,1.8,'#dde6ee');
 s+=MK(60,80,'a')+MK(140,170,'b')+MK(220,130,'c')+MK(330,86,'d')+MK(80,190,'e',FC.or);
 s+=LEGD(420,70,['a Risse in der Gratnaht außen','b Riss in der Gratnaht innen','c Querrisse im Steg','d Querrisse im kleinen Auge','e Schmiedefalte, Riss']);
 return SV(660,250,s)};
FIGS.v5_zahnkranz=()=>{let s=GRID(640,260,40)+CI(150,125,100,FC.gr,'#dde6ee',1.8)+CI(150,125,70,FC.gr,'#fff',1.6);for(let i=0;i<20;i++){const a=i/20*2*Math.PI;s+=LN(150+Math.cos(a)*100,125+Math.sin(a)*100,150+Math.cos(a)*112,125+Math.sin(a)*112,FC.gr,6)}
 s+=MK(236,88,'a')+MK(150,40,'b')+MK(65,150,'c')+MK(220,180,'d')+MK(100,60,'e',FC.or);
 s+=LEGD(330,70,['a Schleifrisse','b Schmiedefalte','c Dauerbruchanriss','d Härterisse','e Risse']);
 return SV(640,250,s)};
FIGS.v5_blech=()=>{let s=GRID(640,260,40)+PA('M40 120 L240 80 L440 80 L440 130 L240 170 L40 170 Z',FC.gr,1.8,'#dde6ee');
 s+=MK(120,128,'a')+MK(200,110,'b')+MK(290,106,'c')+MK(360,112,'d')+MK(240,150,'e')+MK(410,106,'f');
 s+=LEGD(470,60,['a Dopplungen','b Einschlüsse, Seigerungen','c Risse','d Überwalzungen','e Riefen','f Aufplatzungen, Risse']);
 return SV(660,230,s)};
FIGS.v5_rohr=()=>{let s=GRID(640,260,40)+RC(40,90,400,70,FC.gr,'#dde6ee',1.8,35)+CI(440,125,35,FC.gr,'#fff',1.8);
 s+=MK(90,125,'a')+MK(150,100,'b')+MK(210,150,'c')+MK(270,115,'d')+[320,350,380].map((x,i)=>i==0?MK(x,125,'e'):CI(x,125,3,FC.red,FC.red)).join('');
 s+=LEGD(470,60,['a Längsrisse','b Schmiedefalten, Überwalzung','c Einschluss','d Riefen','e Pilgerfehler (meist periodisch)']);
 return SV(690,230,s)};
FIGS.v5_zeit=()=>{let s=GRID(640,240,40)+RC(60,80,360,70,FC.gr,'#dde6ee',1.8,35);for(let i=0;i<7;i++)s+=LN(100+i*46,100,108+i*46,130,FC.red,2.4);
 s+=TX(440,120,'Zeitstandrisse: viele kurze, ',{a:'start',s:12,c:FC.red,b:1})+TX(440,138,'feine Risse (Kriechschädigung)',{a:'start',s:12,c:FC.red,b:1});
 return SV(640,200,s)};
FIGS.v5_h2riss=()=>{let s=GRID(640,260,40)+PA('M60 150 L260 150 L300 120 L420 120 L460 150 L600 150 L600 210 L60 210 Z',FC.gr,1.8,'#dde6ee')+PA('M260 150 Q340 90 460 150',FC.or,2,'#ffe2b8');
 s+=PA('M270 152 L270 174',FC.red,3)+PA('M300 150 L300 178',FC.red,3)+PA('M440 152 L440 176',FC.red,3)+TX(350,66,'Schweißgut',{c:FC.or,b:1,s:12})+TX(220,190,'WEZ (Wärmeeinflusszone)',{c:FC.red,b:1,s:12})+TX(440,200,'wasserstoffinduzierte Risse',{c:FC.red,b:1,s:12}).replace(/.*/,'')+TX(520,176,'Risse in der WEZ',{c:FC.red,b:1,s:12});
 s+=TX(360,240,'je 10 mm: Rissabstand in der Wärmeeinflusszone',{c:FC.gr,s:11.5});
 return SV(640,250,s)};
FIGS.v5_naht=()=>{let s=GRID(640,260,40)+RC(40,100,300,40,FC.gr,'#dde6ee',1.8)+RC(40,150,300,40,FC.gr,'#dde6ee',1.8)+PA('M40 140 Q190 125 340 140 L340 150 Q190 165 40 150 Z',FC.or,1.8,'#ffe2b8');
 s+=MK(80,145,'a')+MK(150,128,'b')+MK(210,148,'c')+MK(290,145,'d')+MK(250,168,'e');
 s+=LEGD(390,80,['a Längsriss','b Flankenbindefehler','c Querrisse','d Endkraterriss','e Poren']);
 return SV(660,240,s)};
FIGS.v5_lamell=()=>{let s=GRID(640,260,40)+RC(60,150,420,40,FC.gr,'#dde6ee',1.8)+RC(240,60,40,90,FC.gr,'#dde6ee',1.8)+PA('M232 150 L240 140 M280 140 L288 150',FC.or,6);
 s+=LN(60,160,200,160,FC.red,3,'stroke-dasharray="14 5"')+LN(320,160,480,160,FC.red,3,'stroke-dasharray="14 5"')+TX(130,215,'Lamellarrisse (parallel zur Blechoberfläche)',{s:12,c:FC.red,b:1}).replace(/.*/,'')+TX(260,225,'Lamellarrisse im Grundblech unter dem T-Stoß (parallel zur Oberfläche)',{s:12,c:FC.red,b:1});
 return SV(640,240,s)};
FIGS.v5_thermo1=()=>{let s=GRID(640,220,40)+RC(60,60,380,70,FC.gr,'#dde6ee',1.8,35);for(let i=0;i<6;i++)s+=PA(`M${110+i*50} 70 l4 20 l-4 14`,FC.red,2.4);
 s+=TX(460,95,'Thermoschockrisse',{a:'start',s:12,c:FC.red,b:1})+TX(460,113,'quer zur Rohrachse, netzartig',{a:'start',s:11.5,c:FC.gr});
 return SV(640,190,s)};
FIGS.v5_schaufel=()=>{let s=GRID(640,260,40)+PA('M120 220 L120 150 Q140 60 190 40 Q240 70 250 150 L250 220 Z',FC.gr,1.8,'#dde6ee')+RC(90,220,190,24,FC.gr,'#c9d6e2',1.6,3);
 s+=MK(120,200,'a')+MK(190,48,'b',FC.or).replace(/.*/,'')+MK(222,60,'b',FC.or);
 s+=LEGD(330,80,['a Ermüdungsriss (am Schaufelfuß)','b Thermoschockriss (Schaufelkante,','   Flugzeugtriebwerk)'])+TX(330,150,'Turbinenschaufel, gesenkgeschmiedet',{a:'start',s:12,c:FC.gr});
 return SV(640,250,s)};
FIGS.v5_luftzug=()=>{let s=GRID(640,240,40)+RC(40,100,260,34,FC.gr,'#dde6ee',1.8)+RC(40,140,260,34,FC.gr,'#dde6ee',1.8)+PA('M40 134 Q170 124 300 134 L300 140 Q170 150 40 140 Z',FC.or,1.8,'#ffe2b8');
 [90,150,210,260].forEach(x=>s+=LN(x,118,x+4,134,FC.red,2.4));
 s+=TX(170,70,'Risse durch schockartiges Abkühlen (Luftzug!)',{s:12,c:FC.red,b:1})+RC(340,90,260,100,FC.gr,'#dde6ee',1.8,8);[380,430,480,530,570].forEach(x=>s+=PA(`M${x} 100 l5 20 l-5 16`,FC.red,2.2));
 s+=TX(470,215,'Thermoschockrisse im Walzerzeugnis',{s:12,c:FC.red,b:1});
 return SV(640,230,s)};

"use strict";
const SCRN=(x,y,w,h)=>SCR(x,y,w,h)+LN(x+w/2,y+6,x+w/2,y+h-6,'#1c4a35',1)+LN(x+6,y+h/2,x+w-6,y+h/2,'#1c4a35',1);
FIGS.v6_impl=()=>{let s=GRID(640,320,40)+SCRN(40,24,560,270);const cx=320,cy=160;
 s+=AR(cx,cy,cx-170,cy,'#7fd1ff',3)+TX(cx-170,cy-10,'Lift-off',{c:'#7fd1ff',b:1,s:12,a:'middle'});
 s+=AR(cx,cy,cx-50,cy-100,'#ff8a96',3)+TX(cx-50,cy-110,'Riss (nichtferromagnetisch)',{c:'#ff8a96',b:1,s:12,a:'middle'});
 s+=AR(cx,cy,cx+130,cy-70,FC.am,3)+TX(cx+140,cy-80,'Ferromagnetischer Anteil',{c:FC.am,b:1,s:12,a:'start'});
 s+=AR(cx,cy,cx+60,cy-120,'#ffb4bd',2.4,'stroke-dasharray="5 4"')+TX(cx+70,cy-126,'Riss im ferromagnetischen Material',{c:'#ffb4bd',s:11.5,a:'start'});
 s+=AR(cx,cy,cx+120,cy+80,'#9ee6a8',3)+TX(cx+128,cy+96,'Sulfidation / Permeabilität ↑',{c:'#9ee6a8',b:1,s:12,a:'start'}).replace(/.*/,'')+TX(cx+130,cy+96,'Phasendrehung (Sulfidation)',{c:'#9ee6a8',b:1,s:12,a:'start'});
 return SV(640,310,s)};
FIGS.v6_korr=()=>{let s=GRID(640,300,40)+SCRN(40,24,560,250);const cx=170,cy=150;
 s+=AR(cx,cy,cx-110,cy,'#7fd1ff',2.8)+TX(cx-110,cy-8,'Lift-off',{c:'#7fd1ff',b:1,s:12});
 [[.34,'10 %'],[.62,'20 %'],[.9,'30 %']].forEach(([f,t],i)=>{s+=AR(cx,cy,cx+10+i*8,cy-f*120,'#ff8a96',2.6)+TX(cx+20+i*8,cy-f*120-4,t,{c:'#ff8a96',s:12,b:1,a:'start'})});
 s+=AR(cx,cy,cx+130,cy+4,FC.am,2.8)+TX(cx+130,cy+22,'Aufbeulung',{c:FC.am,b:1,s:12});
 s+=TX(420,90,'Korrosionsabtrag',{c:'#ff8a96',b:1,s:12,a:'start'})+TX(420,108,'(zunehmend in Y-Richtung)',{c:'#ff8a96',s:11.5,a:'start'})+TX(420,160,'Lift-off links,',{c:'#7fd1ff',s:11.5,a:'start'})+TX(420,176,'Aufbeulung spiegelbildlich rechts',{c:FC.am,s:11.5,a:'start'});
 return SV(640,290,s)};
FIGS.v6_freq=()=>{let s=GRID(660,300,40);
 const pan=(x0,t,a1,a2,note,ok)=>{let q=TX(x0+100,20,t,{b:1,c:ok?FC.gn:FC.pri,s:12})+SCRN(x0,30,200,200);const cx=x0+100,cy=130;
  const v=(a,L,c,lab)=>{const r=a*Math.PI/180;return AR(cx,cy,cx+Math.cos(r)*L,cy-Math.sin(r)*L,c,2.6)+TX(cx+Math.cos(r)*L+(Math.cos(r)<0?-4:4),cy-Math.sin(r)*L-6,lab,{c,s:10.5,b:1,a:Math.cos(r)<0?'end':'start'})};
  q+=v(a1,80,'#7fd1ff','Lift-off')+v(a2,80,'#ff8a96','Korrosion')+v(a1+180-(a1-a2)*0,0,'#fff','');q+=TX(x0+100,250,note,{s:11.5,c:ok?FC.gn:FC.gr,b:ok});return q};
 s+=pan(10,'f zu niedrig',185,170,'Signale fallen zusammen',0)+pan(230,'f passend',180,90,'Lift-off links, Korrosion in Y',1)+pan(450,'f zu hoch',200,60,'Winkel verändert sich',0);
 return SV(660,275,s)};
FIGS.v6_kal=()=>{const x0=80,y0=250,W=440,H=200;let s=GRID(620,300,40)+CAX(x0,y0,W,H,'Korrosionsabtrag in % →','Signalhöhe');
 const pts=[[.1,.12],[.35,.4],[.62,.7],[.9,.95]];s+=PTH(pts.map(([a,b])=>[x0+a*W,y0-b*H]),FC.pri,2.4)+pts.map(([a,b],i)=>CI(x0+a*W,y0-b*H,6,FC.red,'#fff',2.4)+TX(x0+a*W,y0+18,['5','15','30','45'][i]+' %',{s:11,c:FC.gr})).join('');
 s+=TX(x0+W/2,y0+44,'vier gut abgestufte Messpunkte, verbunden durch eine Interpolationslinie',{s:11.5,c:FC.gr});
 return SV(620,300,s)};
FIGS.v6_ref=()=>{const x0=80,y0=250,W=440,H=200;let s=GRID(620,300,40)+CAX(x0,y0,W,H,'Korrosionsabtrag in % →','Signalhöhe');
 const a=[],b=[];for(let i=0;i<=40;i++){const t=i/40;a.push([x0+t*W,y0-H*(.1+.85*t)]);b.push([x0+t*W,y0-H*(.05+.62*Math.pow(t,.9))])}
 s+=PTH(a,FC.pri,2.6)+PTH(b,FC.or,2.6)+TX(x0+W-4,a[40][1]-10,'Kalibrierkurve (Justierkörper allein)',{a:'end',c:FC.pri,b:1,s:12})+TX(x0+W-4,b[40][1]+22,'Referenzkurve (Justierkörper auf Strukturaufbau)',{a:'end',c:FC.or,b:1,s:12});
 s+=TX(x0+W/2,y0+44,'Die Metallstruktur hinter dem Blech verschiebt die Kurve – deshalb zusätzlich eine Referenzkurve.',{s:11.5,c:FC.gr});
 return SV(620,300,s)};
FIGS.v6_typ1=()=>{let s=GRID(640,260,40)+RC(40,60,500,130,FC.gr,'#dde6ee',1.8,6);[[100,16],[190,22],[300,30],[430,40]].forEach(([x,r])=>{s+=CI(x,125,r,FC.gr,'#fff',1.8)+LN(x-r-2,125,x-r+6,125,FC.red,3).replace(/.*/,'')+RC(x-1.5,125-r-1,3,5,FC.red,FC.red,1)});
 s+=TX(290,215,'Bohrungen mit je einer funkenerosiv eingebrachten axialen Nut',{s:12,c:FC.gr})+TX(290,232,'Nut: Breite 0,15 mm · Tiefe 0,5 mm · Länge = Plattendicke',{s:12,c:FC.red,b:1});
 return SV(640,245,s)};
FIGS.v6_typ2=()=>{let s=GRID(640,260,40)+RC(40,60,500,130,FC.gr,'#dde6ee',1.8,6);[[100,16],[190,22],[300,30],[430,40]].forEach(([x,r])=>{s+=CI(x,125,r,FC.gr,'#fff',1.8)});
 s+=LN(40,125,540,125,FC.red,2.4,'stroke-dasharray="8 3"')+TX(290,215,'Nut von der Stirnseite über die gesamte Plattenlänge',{s:12,c:FC.gr})+TX(290,232,'Nut: Breite 0,2 mm · Tiefe 1,0 mm',{s:12,c:FC.red,b:1});
 return SV(640,245,s)};
FIGS.v6_niet=()=>{let s=GRID(640,280,40)+RC(40,100,520,30,FC.gr,'#dde6ee',1.8)+RC(40,134,520,30,FC.gr,'#c9d6e2',1.8);
 [140,260,380,500].forEach(x=>{s+=RC(x-8,96,16,72,FC.pri,'#eef4fa',1.8,2)+PA(`M${x-16} 100 L${x+16} 100 L${x+8} 92 L${x-8} 92 Z`,FC.pri,1.6,'#eef4fa')});
 s+=LN(172,134,172,164,FC.red,3)+TX(172,188,'Riss in der',{s:11.5,c:FC.red,b:1})+TX(172,202,'zweiten Lage',{s:11.5,c:FC.red,b:1});
 s+=RC(300,40,60,40,FC.ac,'#d9f2ef',2,6)+TX(330,66,'Sensor',{s:12,b:1,c:FC.pri})+AR(330,80,330,98,FC.ac,2)+TX(330,24,'von der Oberfläche',{s:11.5,c:FC.gr})+TX(300,250,'Nietnaht: obere und untere Blechlage, Risse gehen von den Nietlöchern aus',{s:12,c:FC.gr});
 return SV(640,270,s)};
FIGS.v6_ftypen=()=>{let s=GRID(660,230,40);
 const t=(x,n)=>RC(x,50,100,70,FC.gr,'#dde6ee',1.6,3)+RC(x+38,50,24,70,FC.gr,'#fff',1.4)+TX(x+50,150,'Typ '+n,{b:1,c:FC.pri,s:13});
 s+=t(20,'I')+PA('M58 50 Q62 62 70 66',FC.red,2.6)+LN(58,54,76,54,FC.red,4);
 s+=t(140,'II')+LN(178,60,178,110,FC.red,3,'stroke-dasharray="6 3"')+LN(202,60,202,110,FC.red,3,'stroke-dasharray="6 3"');
 s+=t(260,'III')+[0,1,2].map(i=>LN(298,56+i*18,298,68+i*18,FC.red,2.4)).join('')+[0,1,2].map(i=>LN(322,56+i*18,322,68+i*18,FC.red,2.4)).join('');
 s+=t(380,'IV')+PA('M418 120 Q430 100 440 118',FC.red,3,'none');
 s+=t(500,'V')+[0,1,2,3].map(i=>PA(`M538 ${56+i*14} h24`,FC.red,2)).join('');
 s+=TX(330,196,'Nietloch mit Fehlerbild (Querschnitt) – Ausprägung im Skript beschrieben',{s:11.5,c:FC.gr});
 return SV(660,215,s)};

FIGS.v7_tp1=()=>{let s=GRID(640,300,40);
 const L=[['Ti','#e8e4f4'],['Fe','#d4dde6'],['Aust','#e4ece4'],['Al','#f4ece0']];
 L.forEach(([n,c],i)=>{s+=RC(60,50+i*44,420,42,FC.gr,c,1.8)+TX(40,76+i*44,n,{a:'end',b:1,c:FC.pri,s:12})});
 s+=RC(250,50,60,176,FC.gr,'#fff',1.6);
 [0,1,2,3].forEach(i=>{s+=RC(246,66+i*44,5,10,FC.red,FC.red,1)+RC(309,66+i*44,5,10,FC.red,FC.red,1)});
 s+=RC(110,50,14,6,FC.red,FC.red,1)+RC(150,50,14,12,FC.red,FC.red,1)+RC(390,50,14,6,FC.red,FC.red,1)+RC(430,50,14,12,FC.red,FC.red,1);
 s+=TX(117,40,'0,2',{s:11,c:FC.red,b:1})+TX(157,40,'0,5',{s:11,c:FC.red,b:1})+TX(280,40,'Durchgangsbohrung',{s:11,c:FC.gr});
 s+=TX(280,250,'Vier verbundene Werkstofflagen · Oberflächennuten 0,2 / 0,5 mm Tiefe',{s:12,c:FC.gr})+TX(280,268,'Nuten in der Bohrung je Lage: Tiefe 0,5 mm',{s:12,c:FC.red,b:1});
 return SV(640,285,s)};
FIGS.v7_typ4=()=>{let s=GRID(640,260,40)+PA('M60 70 L520 70 L520 190 L60 190 Z',FC.gr,1.8,'#dde6ee');
 s+=PA('M60 112 L520 128 L520 134 L60 148 Z',FC.gr,1.6,'#fff')+LN(60,130,520,131,FC.red,2.6,'stroke-dasharray="8 3"');
 s+=TX(70,106,'schmal',{s:11,c:FC.gr,a:'start'})+TX(510,122,'weit',{s:11,c:FC.gr,a:'end'});
 s+=TX(290,225,'Konische Bohrung mit durchgehender Nut · Breite 0,15 mm · Tiefe 0,3 mm (2 : 1)',{s:12,c:FC.red,b:1});
 return SV(640,245,s)};
FIGS.v7_typ5=()=>{let s=GRID(640,270,40)+RC(50,70,480,40,FC.gr,'#dde6ee',1.8)+RC(50,114,480,60,FC.gr,'#c9d6e2',1.8);
 [[120,.2],[200,.4],[280,.6],[360,.8],[440,1]].forEach(([x,t])=>{s+=RC(x-3,114,6,8+t*44,FC.red,FC.red,1)+TX(x,194,String(t).replace('.',',')+' mm',{s:10.5,c:FC.red})});
 s+=RC(250,28,60,28,FC.ac,'#d9f2ef',2,6)+TX(280,47,'Sensor',{s:11.5,b:1,c:FC.pri})+AR(280,56,280,68,FC.ac,2);
 s+=TX(290,225,'Nuten in der zweiten Lage · Breite 0,15 mm · Tiefe 0,2–1,0 mm (1:1 bis 3:1)',{s:12,c:FC.gr});
 return SV(640,250,s)};
FIGS.v7_typ6=()=>{let s=GRID(640,260,40)+PA('M60 60 L290 60 L290 190 L60 190 Z',FC.gr,1.8,'#dde6ee')+PA('M300 60 L530 60 L530 190 L300 190 Z',FC.gr,1.8,'#c9d6e2');
 s+=PA('M290 112 L290 138 L300 134 L300 116 Z',FC.red,1.2,'#fff')+TX(295,48,'Trennfläche',{s:11,c:FC.red,b:1});
 s+=TX(175,130,'Hälfte 1',{b:1,c:FC.pri,s:12})+TX(415,130,'Hälfte 2',{b:1,c:FC.pri,s:12});
 s+=TX(295,225,'Zwei Hälften, konische Bohrung · Breite : Tiefe besser als 1 : 10',{s:12,c:FC.red,b:1});
 return SV(640,245,s)};
FIGS.v8_muh=()=>{const x0=70,y0=230,W=480,H=180;let s=GRID(620,280,40)+CAX(x0,y0,W,H,'Feldstärke H →','μ_{r}');
 const c=(a,b,w)=>{const p=[];for(let i=0;i<=40;i++){const t=i/40;p.push([x0+t*W,y0-H*(a*Math.exp(-Math.pow((t-b)/w,2))+.08)])}return p};
 s+=PTH(c(.8,.35,.3),FC.pri,2.6)+PTH(c(.55,.55,.25),FC.or,2.6)+LN(x0+.45*W,y0,x0+.45*W,y0-H,FC.gr,1.4,'stroke-dasharray="5 4"');
 s+=TX(x0+.18*W,y0-H*.92,'Zustand A',{c:FC.pri,b:1,s:12})+TX(x0+.8*W,y0-H*.5,'Zustand B',{c:FC.or,b:1,s:12})+TX(x0+.45*W,y0+36,'günstiger Arbeitspunkt: großer Abstand',{s:11.5,c:FC.gr});
 return SV(620,280,s)};
FIGS.v8_muf=()=>{const x0=70,y0=230,W=480,H=180;let s=GRID(620,280,40)+CAX(x0,y0,W,H,'Frequenz (0,1 … 100 kHz, log.) →','μ_{r}');
 const p=[];for(let i=0;i<=40;i++){const t=i/40;p.push([x0+t*W,y0-H*(.9/(1+Math.pow(t/.62,4))+.05)])}
 s+=PTH(p,FC.pri,2.6)+['0,1','1','10','100'].map((l,i)=>TX(x0+i*W/3,y0+18,l,{s:11,c:FC.gr})).join('')+TX(x0+W*.15,y0-H*.98,'niedrige f: μ_{r} fast konstant',{s:11.5,c:FC.gr,a:'start'})+TX(x0+W*.95,y0-H*.4,'hohe f: μ_{r} fällt',{s:11.5,c:FC.red,a:'end'});
 return SV(620,280,s)};
FIGS.v8_prinz=()=>{let s=GRID(640,250,40)+RC(40,80,110,60,FC.gr,'#dde6ee',1.8)+RC(40,170,110,40,FC.gr,'#dde6ee',1.8)+TX(95,115,'Prüfteil',{b:1,c:FC.pri,s:12})+TX(95,195,'Vergleichsprobe',{b:1,c:FC.pri,s:12});
 s+=RC(220,95,120,70,FC.ac,'#d9f2ef',2,8)+TX(280,125,'Verstärker /',{b:1,c:FC.pri,s:12})+TX(280,142,'Differenzbildung',{b:1,c:FC.pri,s:12})+AR(150,110,218,115,FC.pri,2)+AR(150,190,218,150,FC.pri,2);
 s+=RC(410,70,170,120,FC.pri,'#fff',2,6);const p=[];for(let i=0;i<=60;i++){const a=i/60*6.283;p.push([495+30*Math.cos(a),130+34*Math.sin(a)*(1+.5*Math.cos(a))])}
 s+=PTH(p,FC.red,2.4)+AR(342,130,408,130,FC.pri,2)+TX(495,210,'Bildschirm: nur die Unterschiede',{s:11.5,c:FC.gr});
 return SV(640,235,s)};
FIGS.v8_stahl=()=>{const x0=70,y0=230,W=480,H=180;let s=GRID(620,280,40)+CAX(x0,y0,W,H,'Feldstärke H (A/m) →','μ_{r}');
 const f=(a,b,w,o)=>{const p=[];for(let i=0;i<=40;i++){const t=i/40;p.push([x0+t*W,y0-H*(a*Math.exp(-Math.pow((t-b)/w,2))+o)])}return p};
 s+=PTH(f(.85,.3,.22,.05),FC.pri,2.6)+PTH(f(.55,.55,.3,.05),FC.or,2.6)+PTH(f(.4,.4,.2,.05),FC.gn||'#3dff95',2.6)
 +LN(x0+.43*W,y0,x0+.43*W,y0-H,FC.red,1.6,'stroke-dasharray="5 4"')+TX(x0+.43*W,y0+34,'≈ 1000 A/m: 100Cr6 und C45 nicht trennbar',{c:FC.red,b:1,s:11.5})
 +TX(x0+.12*W,y0-H*.9,'100Cr6',{c:FC.pri,b:1,s:12,a:'start'})+TX(x0+.8*W,y0-H*.45,'C45',{c:FC.or,b:1,s:12})+TX(x0+.15*W,y0-H*.35,'weitere Stähle',{c:FC.gr,s:11,a:'start'});
 return SV(620,280,s)};
FIGS.v8_mono=()=>{let s=GRID(640,230,40)+RC(60,70,170,70,FC.gr,'#dde6ee',1.8)+TX(145,110,'Prüfteil in Spule',{b:1,c:FC.pri,s:12})+AR(232,105,300,105,FC.pri,2)+RC(302,70,120,70,FC.ac,'#d9f2ef',2,8)+TX(362,100,'Amplitude',{b:1,c:FC.pri,s:12})+TX(362,118,'bei 1 Frequenz',{c:FC.gr,s:11});
 s+=AR(424,105,470,105,FC.pri,2)+CI(500,90,14,'#2d9d5f','#fff',2)+CI(500,125,14,FC.red,'#fff',2)+TX(530,95,'Gut',{s:12,a:'start'})+TX(530,130,'Schlecht',{s:12,a:'start'})+TX(320,190,'eindimensionale Sortierung: ein Messwert, Sortiergrenzen auf einer Achse',{c:FC.gr,s:11.5});
 return SV(640,215,s)};
FIGS.v8_achs=()=>{let s=GRID(640,260,40)+RC(60,110,420,40,FC.gr,'#dde6ee',1.8)+RC(130,80,40,100,FC.gr,'#c9d6e2',1.8)+RC(190,95,40,70,FC.gr,'#c9d6e2',1.8);
 s+=RC(122,70,56,20,FC.ac,'#d9f2ef',2,3)+RC(122,170,56,20,FC.ac,'#d9f2ef',2,3)+RC(330,95,56,70,FC.pri,'rgba(0,0,0,0)',2,3)+TX(150,58,'Spule 1: Einhärtetiefe',{s:11.5,c:FC.pri,b:1})+TX(358,88,'Spule 2:',{s:11.5,c:FC.pri,b:1})+TX(358,190,'Material / Wärmebeh.',{s:11,c:FC.pri,b:1});
 s+=RC(240,205,160,28,FC.ac,'#d9f2ef',2,6)+TX(320,224,'Multiplexer + Auswertung',{s:11.5,b:1,c:FC.pri})+TX(300,248,'Achszapfen: beide Spulen werden abwechselnd angesteuert',{s:11.5,c:FC.gr});
 return SV(640,255,s)};
FIGS.v8_drei=()=>{const x0=70,y0=220,W=480,H=170;let s=GRID(620,270,40)+CAX(x0,y0,W,H,'Frequenz f →','Signal');
 const g=[['Gruppe A',FC.pri,.8],['Gruppe B',FC.or,.55],['Gruppe C',FC.red,.3]];
 g.forEach(([n,c,a])=>{const p=[];for(let i=0;i<=40;i++){const t=i/40;p.push([x0+t*W,y0-H*(a*(1-.5*t)+.1*Math.sin(t*6))])}s+=PTH(p,c,2.6)+TX(x0+W+4,p[40][1],n,{c,b:1,s:12,a:'start'})});
 s+=[.12,.3,.5,.7,.9].map(t=>LN(x0+t*W,y0,x0+t*W,y0-H,FC.gr,1,'stroke-dasharray="3 4"')).join('')+TX(x0+W/2,y0+34,'serielle Prüfung bei mehreren Frequenzen → drei Gruppen trennbar',{s:11.5,c:FC.gr});
 return SV(660,270,s)};
FIGS.v8_los=()=>{let s=GRID(640,270,40)+CAX(70,230,440,190,'Real →','Imag →');
 const e=[];for(let i=0;i<=60;i++){const a=i/60*6.283;e.push([310+130*Math.cos(a)*.95-35*Math.sin(a)*.5,130+55*Math.sin(a)+40*Math.cos(a)*.35])}
 s+=PTH(e,FC.pri,2.4);for(let i=0;i<45;i++){const a=i*2.4,r=Math.sqrt((i+1)/45)*.85;s+=CI(310+120*r*Math.cos(a),130+50*r*Math.sin(a),3,FC.gr,FC.gr,1)}
 [['#ff9a3c',-120,-8],['#ff6bb5',90,-45],['#4aa3ff',-60,48],['#3dff95',115,35]].forEach(([c,dx,dy])=>{s+=CI(310+dx,130+dy,7,c,'#fff',2)});
 s+=TX(310,252,'Extremteile (farbig) werden zerstörend geprüft → i.O. = ganzes Los innerhalb der Ellipse i.O.',{s:11.5,c:FC.gr});
 return SV(640,280,s)};
FIGS.v8_fremd=()=>{let s=GRID(640,260,40)+RC(60,60,140,70,FC.ac,'#d9f2ef',2,8)+RC(60,150,140,70,FC.ac,'#d9f2ef',2,8)+RC(100,78,60,34,FC.gr,'#c9d6e2',1.6)+RC(100,168,60,34,FC.gr,'#c9d6e2',1.6)+TX(130,98,'Prüfteil',{s:11,b:1,c:FC.pri})+TX(130,188,'Kompens.',{s:11,b:1,c:FC.pri})
 +TX(130,50,'Prüfspule',{s:11.5,c:FC.gr})+TX(130,242,'Kompensationsspule',{s:11.5,c:FC.gr})+AR(202,95,300,125,FC.pri,2)+AR(202,185,300,155,FC.pri,2)+RC(302,110,130,60,FC.pri,'#fff',2,6)+TX(367,137,'Differenz-',{b:1,c:FC.pri,s:12})+TX(367,154,'auswertung',{b:1,c:FC.pri,s:12})+AR(434,140,490,140,FC.pri,2)+TX(540,144,'Gut / Schlecht',{s:12,b:1,c:FC.red});
 return SV(640,255,s)};
FIGS.v8_wege=()=>{let s=GRID(660,240,40)+CAX(40,200,260,160,'','');
 s+=RC(60,60,100,90,FC.gn||'#3dff95','rgba(61,255,149,.15)',2,8)+RC(190,90,90,80,FC.red,'rgba(255,80,80,.15)',2,8)+TX(110,110,'Gut',{b:1,c:FC.pri,s:13})+TX(235,135,'Schlecht',{b:1,c:FC.red,s:13})+TX(170,222,'Zwei-Wege-Sortierung',{s:11.5,c:FC.gr});
 s+=RC(350,60,80,80,'#2d9d5f','rgba(61,255,149,.15)',2,8)+RC(440,100,80,70,FC.or,'rgba(255,154,60,.15)',2,8)+RC(530,60,80,80,FC.red,'rgba(255,80,80,.15)',2,8)+TX(390,105,'Gut',{b:1,s:12})+TX(480,140,'Rest',{b:1,s:12})+TX(570,105,'Schlecht',{b:1,s:12})+TX(480,222,'Drei-Wege-Sortierung (Härterei)',{s:11.5,c:FC.gr});
 return SV(660,235,s)};
FIGS.v8_tol=()=>{const cell=(x,y,t,mode)=>{let s=RC(x,y,150,140,FC.gr,'#fff',1.4,4)+TX(x+75,y+14,t,{s:11,b:1,c:FC.pri});
 const el=(cx,cy,rx,ry,rot,c,w,d)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="none" stroke="${c}" stroke-width="${w}" ${d||''}/>`;
 const dots=(pts,c)=>pts.map(([a,b])=>CI(x+a,y+b,4,c,c,1)).join('');
 s+=dots([[55,70],[70,80],[62,92],[78,66],[85,86]],'#2d9d5f')+dots([[115,50],[125,100],[110,112]],FC.red);
 if(mode>=1)s+=dots([[100,64],[105,88]],FC.or);
 if(mode===0||mode===1)s+=el(x+70,y+80,38,30,0,FC.pri,2);
 if(mode===2)s+=el(x+85,y+80,60,45,0,FC.red,2,'stroke-dasharray="5 3"');
 if(mode===3)s+=el(x+85,y+78,50,22,-25,'#2d9d5f',2.2);
 return s};
 let s=GRID(660,330,40)+cell(10,10,'8.10 Ausgangslage',0)+cell(170,10,'8.11 zus. Gutteile',1)+cell(330,10,'8.12 falsch: größer',2)+cell(490,10,'8.13 richtig: gedreht',3);
 s+=TX(330,190,'grün = Gutteile · orange = zusätzliche Gutteile (Labor) · rot = Schlechtteile',{s:11.5,c:FC.gr})+TX(330,212,'Vergrößern nimmt Schlechtteile mit auf – Drehen des Feldes trennt wieder.',{s:11.5,c:FC.pri,b:1});
 return SV(660,230,s)};
FIGS.v9_iso17635=()=>{const B=(x,y,w,h,t,b)=>RC(x,y,w,h,FC.pri,'#fff',1.8,3)+TX(x+w/2,y+h/2+4,t,{s:11,b:b,c:FC.pri});let s=GRID(660,320,40);
 s+=B(190,12,200,26,'Normen zur Schweißqualität',1)+B(130,56,100,24,'ISO 5817',1)+B(320,56,100,24,'ISO 10042',1)+B(220,100,130,44,'ISO 17635 – Verfahrens-Übertragungsfunktion',1)+LN(280,38,280,100,FC.pri,1.4)+LN(180,80,180,92,FC.pri,1.4)+LN(370,80,370,92,FC.pri,1.4)+LN(180,92,370,92,FC.pri,1.4);
 const v=['Durchstrahlung','Wirbelstrom','Magnetpulver','Eindringung','Ultraschall','Sichtprüfung'],a=['Bild B.2','ISO 17643','ISO 17638','ISO 3452-1','Bild B.3','ISO 17637'],c=['Bild B.2','','Stahl: ISO 23278','Stahl: ISO 23277','Bild B.3','ISO 5817 / 10042'];
 s+=LN(285,144,285,160,FC.pri,1.4)+LN(52,160,618,160,FC.pri,1.4);
 v.forEach((n,i)=>{const x=10+i*108;s+=LN(x+50,160,x+50,172,FC.pri,1.4)+B(x,172,100,24,n,1)+LN(x+50,196,x+50,212,FC.pri,1.4)+B(x,212,100,24,a[i],0);if(c[i])s+=LN(x+50,236,x+50,252,FC.pri,1.4)+B(x,252,100,30,c[i],0)});
 return SV(660,300,s)};
FIGS.v9_fluss=()=>{const B=(x,y,w,h,t,t2)=>RC(x,y,w,h,FC.pri,'#eef4fa',1.8,6)+TX(x+w/2,y+h/2+(t2?-2:4),t,{s:11.5,b:1,c:FC.pri})+(t2?TX(x+w/2,y+h/2+14,t2,{s:11,c:FC.gr}):'');
 let s=GRID(640,300,40)+B(140,10,360,44,'Vorgabe der Bewertungsgruppe B, C oder D','ISO 5817 (Stahl) / ISO 10042 (Aluminium)')+AR(320,54,320,76,FC.pri,2)+B(110,76,420,44,'Übertragen in ZfP-Prüfanforderungen','nach DIN EN ISO 17635')+AR(240,120,180,152,FC.pri,2)+AR(400,120,460,152,FC.pri,2)+B(40,152,260,40,'Norm zur Prüfdurchführung','Prüfklassen')+B(340,152,260,40,'Norm zur Befundbewertung','Zulässigkeitsgrenzen')+AR(170,192,300,226,FC.pri,2)+AR(470,192,340,226,FC.pri,2)+B(220,226,200,36,'Durchführung der Prüfung');
 return SV(640,275,s)};
FIGS.v10_ablauf=()=>{const B=(x,y,w,h,t,t2)=>RC(x,y,w,h,FC.pri,'#eef4fa',1.8,6)+TX(x+w/2,y+h/2+(t2?-3:4),t,{s:11.5,b:1,c:FC.pri})+(t2?TX(x+w/2,y+h/2+13,t2,{s:10.5,c:FC.gr}):'');
 let s=GRID(660,360,40)+B(10,10,200,50,'Normen, Regelwerke','und Spezifikationen')+B(450,10,200,50,'Kundenanforderung','z. B. Werksnorm, Richtlinie')+AR(110,60,200,92,FC.pri,2)+AR(550,60,460,92,FC.pri,2)
 +B(160,92,340,56,'Verfahrensbeschreibung','alle wesentlichen Parameter · Erstellung durch Stufe 3')+AR(330,148,330,176,FC.pri,2)
 +B(160,176,340,56,'Prüfanweisung','exakte Schritte · Erstellung durch Stufe 2 oder 3 · Genehmigung durch Stufe 3')+AR(330,232,330,260,FC.pri,2)
 +B(160,260,340,56,'Prüfen','Durchführung, Protokollierung, Bewertung · Stufe 1, 2 oder 3')+TX(560,288,'Überwachung durch',{s:11,c:FC.gr})+TX(560,302,'Stufe 2 (Prüfaufsicht)',{s:11,c:FC.gr});
 return SV(660,335,s)};
const _B=(x,y,w,h,t,o)=>RC(x,y,w,h,FC.pri,(o&&o.f)||'#eef4fa',1.6,5)+TX(x+w/2,y+h/2+4,t,{s:(o&&o.s)||11,b:1,c:FC.pri});
const _PULS=(x,y,w,h,col,amp,wd)=>{const p=[[x,y]];for(let i=0;i<=60;i++){const t=i/60;p.push([x+t*w,y-h*amp*Math.exp(-Math.pow((t-.5)/wd,2))])}return PTH(p,col,2.2)};
FIGS.v11_blk=()=>{let s=GRID(680,300,40);
 s+=_B(10,20,80,40,'1 Gleichfeld')+_B(10,80,80,40,'2 Sättigung')+_B(110,50,80,40,'3 Generator')+_B(210,50,90,40,'4 Prüfspulen')+_B(320,50,80,40,'5 Vorverst.')+_B(420,50,100,40,'6 Gleichrichter')+_B(540,50,80,40,'7 Verstärker');
 s+=_B(540,130,80,40,'8 Filter')+_B(420,130,100,40,'9 Phasensteller')+_B(300,130,100,40,'10 Bildschirm')+_B(420,210,100,40,'11 Diskriminator')+_B(300,210,100,40,'13 Schieberegister')+_B(180,210,100,40,'14 Markierung')+_B(60,210,100,40,'15 Sortierung')+_B(130,130,120,40,'12 Taktgeber');
 s+=AR(90,40,110,66,FC.pri,1.6)+AR(190,70,208,70,FC.pri,1.6)+AR(300,70,318,70,FC.pri,1.6)+AR(400,70,418,70,FC.pri,1.6)+AR(520,70,538,70,FC.pri,1.6)+AR(580,90,580,128,FC.pri,1.6)+AR(538,150,522,150,FC.pri,1.6)+AR(420,150,402,150,FC.pri,1.6)+AR(470,170,470,208,FC.pri,1.6)+AR(418,230,402,230,FC.pri,1.6)+AR(300,230,282,230,FC.pri,1.6)+AR(180,230,162,230,FC.pri,1.6)+AR(190,170,230,208,FC.pri,1.6);
 return SV(680,280,s)};
FIGS.v11_sens=()=>{let s=GRID(680,230,40);
 const rod=(x,y,w,h)=>RC(x,y,w,h,FC.gr,'#c9d6e2',1.6,3);
 s+=rod(20,70,150,30)+RC(70,50,34,70,FC.ac,'rgba(0,200,180,.15)',2,3)+TX(95,140,'Außendurchlauf',{s:11.5,b:1,c:FC.pri})+TX(95,156,'umfasst das Prüfgut',{s:10.5,c:FC.gr});
 s+=RC(200,50,150,70,FC.gr,'#c9d6e2',1.6,3)+RC(200,60,150,50,FC.gr,'#fff',1.4,3)+RC(245,68,34,34,FC.ac,'rgba(0,200,180,.2)',2,3)+TX(275,140,'Innendurchlauf',{s:11.5,b:1,c:FC.pri})+TX(275,156,'prüft von innen',{s:10.5,c:FC.gr});
 s+=rod(380,80,130,36)+RC(425,56,36,20,FC.ac,'rgba(0,200,180,.2)',2,3)+AR(443,58,443,80,FC.red,2)+TX(445,140,'Tastsensor',{s:11.5,b:1,c:FC.pri})+TX(445,156,'(rotierend, Längsfehler)',{s:10.5,c:FC.gr});
 s+=CI(600,95,40,FC.gr,'#c9d6e2',1.6)+PA('M572 70 Q600 52 628 70',FC.ac,5)+TX(600,160,'Segmentsensor',{s:11.5,b:1,c:FC.pri})+TX(600,176,'(Sattelspule, Naht)',{s:10.5,c:FC.gr});
 return SV(680,200,s)};
FIGS.v11_durch=()=>{let s=GRID(680,230,40)+RC(30,80,300,40,FC.gr,'#c9d6e2',1.6,3)+RC(120,60,28,80,FC.ac,'rgba(0,200,180,.2)',2,3)+RC(170,60,28,80,FC.ac,'rgba(0,200,180,.2)',2,3)+RC(95,50,128,100,FC.pri,'rgba(0,0,0,0)',1.4,6)+TX(160,42,'Erreger- + Sekundärspulen (Differenz)',{s:11,c:FC.gr})+LN(260,80,260,100,FC.red,3)+TX(260,70,'Riss',{s:11,c:FC.red,b:1})+AR(60,175,300,175,FC.gr,1.4)+TX(180,195,'Bewegung des Prüfguts →',{s:11,c:FC.gr});
 s+=LN(380,100,640,100,FC.gr,1)+PTH([[380,100],[430,100],[470,60],[500,140],[540,100],[640,100]],FC.red,2.4)+TX(510,172,'Differenzsignal: erst +, dann −',{s:11.5,c:FC.red,b:1});
 return SV(680,205,s)};
FIGS.v11_rot=()=>{let s=GRID(680,230,40)+RC(40,70,300,50,FC.gr,'#c9d6e2',1.6,3)+AR(60,150,320,150,FC.gr,1.6)+TX(190,170,'Längsvorschub',{s:11,c:FC.gr})+[0,1,2,3,4].map(i=>PA(`M${70+i*50} 70 q 25 -26 50 0`,FC.ac,1.6,'none')).join('')+RC(160,40,26,24,FC.ac,'rgba(0,200,180,.25)',2,3)+LN(220,70,220,120,FC.red,3)+TX(220,138,'Längsfehler',{s:11,c:FC.red,b:1})
 +LN(400,110,650,110,FC.gr,1)+_PULS(430,110,60,50,FC.red,1,.18)+_PULS(530,110,60,50,FC.red,1,.18)+TX(530,165,'Signalspitze bei jeder Umdrehung, die den Fehler überstreicht',{s:11,c:FC.gr});
 return SV(680,200,s)};
FIGS.v11_strecke=()=>{let s=GRID(680,200,40)+RC(20,80,640,30,FC.gr,'#c9d6e2',1.6,3);
 const sp=(x,w,t,c,l)=>RC(x,52,w,86,c,'rgba(0,0,0,0)',2,4)+TX(x+w/2,40,t,{s:13,b:1,c:c})+TX(x+w/2,160,l,{s:10.5,c:FC.gr});
 s+=sp(50,80,'A',FC.pri,'Aufmagnetisierung')+sp(170,80,'B / C',FC.ac,'Prüf- + Erregerspulen')+sp(300,80,'D',FC.or,'Gleich-Gegenfeld')+sp(430,80,'E',FC.red,'Wechselfeld-Entmag.')+AR(540,95,640,95,FC.pri,2);
 return SV(680,185,s)};
FIGS.v11_abs=()=>{let s=GRID(680,250,40)+RC(30,80,200,28,FC.gr,'#c9d6e2',1.6,3)+RC(105,60,50,68,FC.ac,'rgba(0,200,180,.2)',2,3)+LN(160,80,160,108,FC.red,3)+TX(130,48,'Absolutspule',{s:11,c:FC.gr});
 s+=LN(260,95,650,95,FC.gr,1)+PTH([[260,95],[330,95],[345,55],[360,95],[650,95]],FC.red,2.4)+TX(455,40,'kurzer Fehler: kurzer Impuls',{s:11.5,c:FC.red,b:1});
 s+=RC(30,170,200,28,FC.gr,'#c9d6e2',1.6,3)+RC(105,150,50,68,FC.ac,'rgba(0,200,180,.2)',2,3)+RC(120,170,90,28,FC.red,'rgba(255,80,80,.3)',1.4,2);
 s+=LN(260,195,650,195,FC.gr,1)+PTH([[260,195],[330,195],[345,155],[500,155],[520,195],[650,195]],FC.red,2.4)+TX(455,140,'langer Fehler: Dauersignal',{s:11.5,c:FC.red,b:1});
 return SV(680,235,s)};
FIGS.v11_diffs=()=>{let s=GRID(680,250,40)+RC(30,80,200,28,FC.gr,'#c9d6e2',1.6,3)+RC(90,60,30,68,FC.ac,'rgba(0,200,180,.2)',2,3)+RC(130,60,30,68,FC.ac,'rgba(0,200,180,.2)',2,3)+LN(145,80,145,108,FC.red,3)+TX(125,48,'Differenzspulen',{s:11,c:FC.gr});
 s+=LN(260,95,650,95,FC.gr,1)+PTH([[260,95],[320,95],[340,55],[355,95],[370,135],[390,95],[650,95]],FC.red,2.4)+TX(455,40,'kurzer Fehler: Doppelimpuls (+/−)',{s:11.5,c:FC.red,b:1});
 s+=RC(30,170,200,28,FC.gr,'#c9d6e2',1.6,3)+RC(90,150,30,68,FC.ac,'rgba(0,200,180,.2)',2,3)+RC(130,150,30,68,FC.ac,'rgba(0,200,180,.2)',2,3)+RC(95,170,90,28,FC.red,'rgba(255,80,80,.3)',1.4,2);
 s+=LN(260,195,650,195,FC.gr,1)+PTH([[260,195],[320,195],[335,160],[350,195],[470,195],[485,230],[500,195],[650,195]],FC.red,2.4)+TX(455,140,'langer Fehler: nur Anfang und Ende',{s:11.5,c:FC.red,b:1});
 return SV(680,245,s)};
FIGS.v11_vgl=()=>{let s=GRID(680,230,40)+TX(170,24,'Differenzsystem',{b:1,c:FC.pri,s:13})+TX(510,24,'Absolutsystem',{b:1,c:FC.or,s:13})+LN(30,90,330,90,FC.gr,1)+LN(360,90,660,90,FC.gr,1);
 s+=PTH([[30,90],[70,90],[90,50],[110,90],[130,130],[150,90],[330,90]],FC.pri,2.4)+PTH([[360,90],[400,90],[420,50],[440,90],[660,90]],FC.or,2.4)+TX(170,150,'kurzer Fehler',{s:11,c:FC.gr})+TX(510,150,'kurzer Fehler',{s:11,c:FC.gr});
 s+=LN(30,200,330,200,FC.gr,1)+LN(360,200,660,200,FC.gr,1)+PTH([[30,200],[100,200],[115,170],[130,200],[230,200],[245,230],[260,200],[330,200]],FC.pri,2.4)+PTH([[360,200],[420,200],[435,170],[560,170],[575,200],[660,200]],FC.or,2.4)+TX(170,225,'langer Fehler',{s:11,c:FC.gr})+TX(510,225,'langer Fehler',{s:11,c:FC.gr});
 return SV(680,235,s)};
FIGS.v11_fuell=()=>{let s=GRID(680,230,40);
 s+=CI(170,100,70,FC.pri,'#eef4fa',2)+CI(170,100,48,FC.gr,'#c9d6e2',2)+TX(170,24,'Außendurchlauf',{b:1,c:FC.pri,s:12.5})+TX(170,104,'D_P',{s:12,c:FC.pri,i:1})+TX(170,196,'η = D_P² / D_S²',{s:13,b:1,c:FC.red})+LN(100,100,100,100,FC.pri,1)+TX(60,60,'D_S',{s:12,c:FC.pri,i:1});
 s+=CI(510,100,70,FC.pri,'#eef4fa',2)+CI(510,100,40,FC.gr,'#fff',2)+CI(510,100,30,FC.pri,'#dde6ee',2)+TX(510,24,'Innendurchlauf',{b:1,c:FC.pri,s:12.5})+TX(510,196,'η = D_S² / D_P²',{s:13,b:1,c:FC.red})+TX(510,104,'D_S',{s:11.5,c:FC.pri,i:1});
 return SV(680,215,s)};
FIGS.v11_tast=()=>{let s=GRID(680,230,40);
 s+=CI(170,150,70,FC.gr,'#c9d6e2',1.8)+RC(160,62,20,26,FC.ac,'rgba(0,200,180,.3)',2,3)+TX(170,40,'gut: Sensor Ø 8 mm auf Rohr Ø 50 mm',{s:11.5,b:1,c:'#2d9d5f'});
 s+=CI(510,150,36,FC.gr,'#c9d6e2',1.8)+RC(492,100,36,16,FC.ac,'rgba(0,200,180,.3)',2,3)+TX(510,40,'schlecht: Sensor Ø 35 mm auf Rohr Ø 33 mm',{s:11.5,b:1,c:FC.red})+TX(510,92,'Außenbereiche haben Abstand',{s:10.5,c:FC.red})+TX(510,214,'Empfindlichkeitsverlust',{s:10.5,c:FC.gr});
 return SV(680,225,s)};
FIGS.v12_mag=()=>{let s=GRID(640,240,40)+RC(60,150,400,30,FC.gr,'#c9d6e2',1.8,3)+TX(260,200,'Grundwerkstoff (ferromagnetisch)',{s:11.5,c:FC.gr})+RC(60,128,400,22,FC.or,'#fff3e0',1.4,2)+TX(500,142,'Schicht',{s:11.5,c:FC.or,b:1,a:'start'});
 s+=PA('M200 110 L200 60 L320 60 L320 110',FC.pri,3,'none')+RC(194,80,12,26,FC.ac,'rgba(0,200,180,.3)',1.6,2)+RC(314,80,12,26,FC.ac,'rgba(0,200,180,.3)',1.6,2)+TX(260,50,'Eisenkern mit Erreger- und Messspule',{s:11.5,b:1,c:FC.pri});
 s+=[0,1,2].map(i=>PA(`M200 110 q${-30-i*18} ${20+i*6} ${60+i*40} ${30}`,FC.red,1.4,'none')).join('')+PA('M200 128 Q260 175 320 128',FC.red,1.8,'none')+TX(260,112,'Wechselfeld, vom Untergrund verstärkt',{s:11,c:FC.red});
 return SV(640,215,s)};
FIGS.v12_wb=()=>{let s=GRID(640,240,40)+RC(60,150,400,30,FC.gr,'#c9d6e2',1.8,3)+TX(260,200,'Grundwerkstoff (nichtferromagnetisch, leitfähig)',{s:11.5,c:FC.gr})+RC(60,128,400,22,FC.or,'#fff3e0',1.4,2)+TX(500,142,'Schicht (nichtleitend)',{s:11.5,c:FC.or,b:1,a:'start'});
 s+=RC(215,70,90,36,FC.ac,'rgba(0,200,180,.25)',2,6)+TX(260,92,'Luftspule',{s:12,b:1,c:FC.pri})+AR(260,108,260,126,FC.pri,1.6)+[0,1,2].map(i=>PA(`M${140+i*30} 166 h${60-i*10}`,FC.red,1.6,'none')).join('')+TX(400,172,'Wirbelstrom → Gegenfeld',{s:11,c:FC.red,b:1})+TX(260,56,'Nutzgröße: Abhebeeffekt (Abstand = Schichtdicke)',{s:11.5,c:FC.gr});
 return SV(640,215,s)};
FIGS.v12_kal4=()=>{const x0=70,y0=230,W=500,H=190;let s=GRID(660,280,40)+CAX(x0,y0,W,H,'Schichtdicke →','Bildschirmhöhe');
 const pts=[[0,10],[18,30],[32,45],[48,62],[62,77],[74,88]];s+=PTH(pts.map(([d,h])=>[x0+d/80*W,y0-h/100*H]),FC.pri,2.4)+pts.map(([d,h])=>CI(x0+d/80*W,y0-h/100*H,5,FC.red,'#fff',2.2)+TX(x0+d/80*W,y0+16,d+' µm',{s:10.5,c:FC.gr})).join('');
 s+=LN(x0,y0-.53*H,x0+W,y0-.53*H,FC.or,2,'stroke-dasharray="6 4"')+TX(x0+W-4,y0-.53*H-8,'Alarmschwelle 53 % (40 µm)',{a:'end',s:11,c:FC.or,b:1});
 return SV(660,280,s)};
FIGS.v12_kal5=()=>{const x0=70,y0=230,W=500,H=190;let s=GRID(660,280,40)+CAX(x0,y0,W,H,'Schichtdicke in µm →','Bildschirmhöhe in %');
 for(let i=0;i<=8;i++){s+=LN(x0+i*W/8,y0,x0+i*W/8,y0-H,'#dde6ee',1)+TX(x0+i*W/8,y0+16,String(i*10),{s:10.5,c:FC.gr})}
 for(let i=1;i<=10;i++){s+=LN(x0,y0-i*H/10,x0+W,y0-i*H/10,'#dde6ee',1)+TX(x0-6,y0-i*H/10+4,String(i*10),{a:'end',s:10,c:FC.gr})}
 const pts=[[0,10],[18,30],[32,45],[48,62],[62,77],[74,88]];s+=PTH(pts.map(([d,h])=>[x0+d/80*W,y0-h/100*H]),FC.pri,2.4)+pts.map(([d,h])=>CI(x0+d/80*W,y0-h/100*H,4.5,FC.red,'#fff',2)).join('');
 return SV(660,280,s)};
FIGS.v12_geo=()=>{let s=GRID(660,240,40);
 s+=RC(30,130,130,26,FC.gr,'#c9d6e2',1.8,3)+RC(30,114,130,16,FC.or,'#fff3e0',1.4,2)+RC(75,70,40,28,FC.ac,'rgba(0,200,180,.25)',2,5)+TX(95,58,'Kante / kleine Fläche',{s:11,c:FC.red,b:1})+TX(95,190,'Luftanteil ↑ → zu dick gemessen (+)',{s:11,c:FC.red})
 s+=PA('M340 156 Q420 90 500 156 Z',FC.gr,1.8,'#c9d6e2')+TX(420,58,'konvex',{s:11,c:FC.red,b:1})+TX(420,190,'(positiver Fehler)',{s:11,c:FC.red})
 +PA('M540 100 Q580 170 620 100 L620 160 L540 160 Z',FC.gr,1.8,'#c9d6e2')+TX(580,58,'konkav',{s:11,c:FC.pri,b:1})+TX(580,190,'Luftanteil ↓ → zu dünn (−)',{s:11,c:FC.pri});
 return SV(660,215,s)};
FIGS.v12_rau=()=>{let s=GRID(660,240,40);const p=[];for(let i=0;i<=40;i++){p.push([60+i*12,150+(i%2?-14:8)+(i%5)*2])}
 s+=PA('M60 190 '+p.map(([x,y])=>`L${x} ${y}`).join(' ')+' L540 190 Z',FC.gr,1.8,'#c9d6e2')+RC(240,60,40,30,FC.ac,'rgba(0,200,180,.25)',2,5)+AR(260,92,260,128,FC.pri,1.6)+TX(260,50,'Sensor',{s:11.5,b:1,c:FC.pri})+LN(60,136,540,136,FC.or,2,'stroke-dasharray="6 3"')+TX(545,140,'Schichtoberfläche',{s:11,c:FC.or,a:'start'})+TX(300,215,'Täler füllen sich mit Schicht: gemessen wird zu dick – maßgeblich ist die Dicke über den Spitzen',{s:11,c:FC.gr});
 return SV(660,230,s)};
FIGS.v12_masse=()=>{let s=GRID(640,230,40)+RC(60,90,60,30,FC.gr,'#c9d6e2',1.8,3)+TX(90,80,'Kleinteil',{s:11,c:FC.red,b:1})+TX(90,150,'ohne Unterlage',{s:11,c:FC.gr})+RC(320,90,60,30,FC.gr,'#c9d6e2',1.8,3)+RC(260,120,180,50,FC.pri,'#dde6ee',1.8,3)+TX(350,80,'Kleinteil',{s:11,c:FC.red,b:1})+TX(350,190,'auf großem Eisenteil (magnetische Masse ↑)',{s:11,c:FC.pri,b:1});
 return SV(640,205,s)};
FIGS.v13_naht=()=>{let s=GRID(680,250,40);
 const z=(x,w,t,f,l)=>RC(x,110,w,40,FC.gr,f,1.6,0)+TX(x+w/2,170,t,{s:10.5,c:FC.pri,b:1})+TX(x+w/2,184,l,{s:10,c:FC.gr});
 s+=z(20,150,'Grundmaterial 1','#c9d6e2','μ_{rel}, σ')+z(170,90,'WEZ 1','#e8d9c4','μ_{rel}, σ')+z(260,60,'Grenzschicht','#dfe6c4','Geom., μ_{rel}, σ')+z(320,40,'Raupe','#f1e2a8','σ, μ_{rel}')+z(360,60,'Grenzschicht','#dfe6c4','Geom., μ_{rel}, σ')+z(420,90,'WEZ 2','#e8d9c4','μ_{rel}, σ')+z(510,150,'Grundmaterial 2','#b9c7d6','μ_{rel}, σ');
 s+=PA('M320 110 Q340 70 360 110',FC.or,2.4,'#f1e2a8')+TX(340,56,'Schweißgut / Raupe',{s:11.5,b:1,c:FC.pri})+AR(340,64,340,80,FC.pri,1.6)+LN(20,110,660,110,FC.red,2.4)+TX(340,28,'Prüffläche',{s:11.5,b:1,c:FC.red});
 return SV(680,215,s)};
FIGS.v13_sensor=()=>{let s=GRID(680,230,40);
 const sp=(cx,t,diff)=>RC(cx-80,40,160,110,FC.gr,'#fff',1.4,6)+`<ellipse cx="${cx}" cy="95" rx="55" ry="22" transform="rotate(35 ${cx} 95)" fill="none" stroke="${FC.pri}" stroke-width="2.4"/><ellipse cx="${cx}" cy="95" rx="55" ry="22" transform="rotate(-35 ${cx} 95)" fill="none" stroke="${FC.ac}" stroke-width="2.4"/>`+(diff?`<ellipse cx="${cx}" cy="95" rx="30" ry="12" transform="rotate(35 ${cx} 95)" fill="none" stroke="${FC.or}" stroke-width="2"/><ellipse cx="${cx}" cy="95" rx="30" ry="12" transform="rotate(-35 ${cx} 95)" fill="none" stroke="${FC.red}" stroke-width="2"/>`:'')+TX(cx,175,t,{b:1,c:FC.pri,s:12.5});
 s+=sp(170,'Absolutschaltung',0)+sp(500,'Differenzschaltung',1)+TX(340,215,'Gekreuzte Wicklungen: ohne rissartige Störung keine Kopplung (Entkopplung)',{s:11.5,c:FC.gr});
 return SV(680,225,s)};
FIGS.v13_vgl=()=>{let s=GRID(680,260,40)+TX(170,22,'konventioneller Tastsensor',{b:1,c:FC.or,s:12.5})+TX(510,22,'optimierter Schweißnahtsensor',{b:1,c:FC.pri,s:12.5});
 const nz=(x,y,amp,col,fault)=>{const p=[];for(let i=0;i<=60;i++){const t=i/60;p.push([x+t*300,y-amp*Math.sin(i*1.7)*Math.cos(i*.6)-(fault?30*Math.exp(-Math.pow((t-.5)/.05,2)):0)])}return PTH(p,col,2.2)};
 s+=LN(20,90,320,90,FC.gr,1)+LN(350,90,650,90,FC.gr,1)+nz(20,90,14,FC.or,0)+nz(350,90,2.5,FC.pri,0)+TX(170,120,'Raupe ohne Fehler',{s:11,c:FC.gr})+TX(510,120,'Raupe ohne Fehler',{s:11,c:FC.gr});
 s+=LN(20,200,320,200,FC.gr,1)+LN(350,200,650,200,FC.gr,1)+nz(20,200,14,FC.or,1)+nz(350,200,2.5,FC.pri,1)+TX(170,240,'Raupe mit Fehler (Fehlersignal im Rauschen)',{s:11,c:FC.gr})+TX(510,240,'Raupe mit Fehler (klar erkennbar)',{s:11,c:FC.gr});
 return SV(680,250,s)};
FIGS.v13_nuten=()=>{const x0=60;let s=GRID(680,230,40)+TX(170,22,'1 mm Nut, 0,5 mm Schicht',{b:1,c:FC.pri,s:12})+TX(510,22,'0,5 mm Nut, 0,5 mm Schicht',{b:1,c:FC.or,s:12})
 +RC(40,160,260,20,FC.gr,'#c9d6e2',1.4,2)+RC(40,150,260,10,FC.or,'#fff3e0',1,1)+RC(165,160,10,20,FC.red,'#fff',1.6,0)+RC(380,160,260,20,FC.gr,'#c9d6e2',1.4,2)+RC(380,150,260,10,FC.or,'#fff3e0',1,1)+RC(505,160,10,10,FC.red,'#fff',1.6,0)
 +LN(40,100,300,100,FC.gr,1)+LN(380,100,640,100,FC.gr,1)+PTH([[40,100],[110,100],[140,50],[170,100],[200,150],[230,100],[300,100]],FC.pri,2.6)+PTH([[380,100],[450,100],[480,75],[510,100],[540,125],[570,100],[640,100]],FC.or,2.6)+TX(170,135,'100 %',{s:11,c:FC.pri,b:1})+TX(510,135,'≈ 50 % (Δ ≤ 6 dB)',{s:11,c:FC.or,b:1});
 return SV(680,215,s)};
FIGS.v13_besch=()=>{let s=GRID(680,240,40)+TX(170,22,'ohne Beschichtung',{b:1,c:FC.pri,s:12.5})+TX(510,22,'mit Beschichtung, +6 dB',{b:1,c:FC.or,s:12.5});
 [[170,FC.pri,1],[510,FC.or,.94]].forEach(([cx,c,k])=>{s+=LN(cx-150,210,cx+150,210,FC.gr,1);[['0,5',.35],['1',.62],['2',.95]].forEach(([n,a],i)=>{const x=cx-100+i*100;s+=PTH([[x-30,210],[x-12,210],[x,210-160*a*k],[x+12,210],[x+30,210]],c,2.6)+TX(x,228,n+' mm',{s:10.5,c:FC.gr})})});
 return SV(680,235,s)};
FIGS.v13_bsp=()=>{let s=GRID(680,240,40)+TX(170,22,'ohne Fehler',{b:1,c:FC.pri,s:12.5})+TX(510,22,'mit Fehler',{b:1,c:FC.red,s:12.5})+LN(20,130,320,130,FC.gr,1)+LN(350,130,650,130,FC.gr,1);
 s+=PTH([[20,130],[90,130],[120,112],[150,130],[230,130],[260,148],[290,130],[320,130]],FC.pri,2.4)+PTH([[350,130],[420,130],[450,112],[480,130],[510,130],[530,50],[550,190],[570,130],[650,130]],FC.red,2.4);
 s+=TX(105,100,'Übergang',{s:10.5,c:FC.gr})+TX(530,40,'Fehlersignal',{s:10.5,c:FC.red,b:1})+TX(340,225,'Übergangszone Grundmaterial/Schweißnaht – nur Fehler erzeugt ein großes Signal',{s:11,c:FC.gr});
 return SV(680,235,s)};


