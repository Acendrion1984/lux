"use strict";
/* =====================================================================
   Handgezeichnete Neufassungen zentraler Bauteil-Abbildungen:
   3D-Werkstücke, Stiftsonden, Rohre mit Durchlaufspulen, berechnete
   Feldlinien (Ringstrom-Flussfunktion) und Wirbelstrombahnen.
   Inhalt und Beschriftung entsprechen den Skript-Abbildungen.
   ===================================================================== */
const PDEFS=`<linearGradient id="pTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="m0"/><stop offset="1" class="m1"/></linearGradient>
<linearGradient id="pSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="m2"/><stop offset="1" stop-color="#6f7c89"/></linearGradient>
<linearGradient id="tubeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f7c89"/><stop offset=".18" stop-color="#d9e2ea"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".52" stop-color="#aeb9c4"/><stop offset="1" stop-color="#55616d"/></linearGradient>
<linearGradient id="plast" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#173350"/><stop offset=".32" stop-color="#5a92c6"/><stop offset=".6" stop-color="#2f5f8a"/><stop offset="1" stop-color="#112a42"/></linearGradient>
<linearGradient id="tipG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b3138"/><stop offset=".35" stop-color="#8f99a3"/><stop offset="1" stop-color="#23292f"/></linearGradient>
<linearGradient id="ferr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22262b"/><stop offset=".4" stop-color="#5c636b"/><stop offset="1" stop-color="#1b1e22"/></linearGradient>
<linearGradient id="weldG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e2b0"/><stop offset=".5" stop-color="#c9a660"/><stop offset="1" stop-color="#8a6a2e"/></linearGradient>
<linearGradient id="hazG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d8fd6" stop-opacity=".0"/><stop offset=".3" stop-color="#9c7fd0" stop-opacity=".55"/><stop offset=".7" stop-color="#d8a75a" stop-opacity=".65"/><stop offset="1" stop-color="#e6c27a" stop-opacity=".75"/></linearGradient>
<radialGradient id="eddyG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff5a14" stop-opacity=".75"/><stop offset=".6" stop-color="#ff8a3a" stop-opacity=".28"/><stop offset="1" stop-color="#ff8a3a" stop-opacity="0"/></radialGradient>
<radialGradient id="holeG" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#05080b"/><stop offset=".75" stop-color="#2b3540"/><stop offset="1" stop-color="#9aa7b4"/></radialGradient>
<linearGradient id="paintG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe08a"/><stop offset="1" stop-color="#e2ac2c"/></linearGradient>`;
const SVP=(w,h,body)=>SV(w,h,body).replace('</defs>',PDEFS+'</defs>');
const pf=v=>(+v).toFixed(1);
/* Platte in Kavaliersperspektive */
const PSLAB=(x,y,w,h,dx=26,dy=16,fill='url(#mSt)')=>`<polygon points="${x},${y} ${x+w},${y} ${x+w+dx},${y-dy} ${x+dx},${y-dy}" fill="url(#pTop)" stroke="${FC.gr}" stroke-width="1"/><polygon points="${x+w},${y} ${x+w+dx},${y-dy} ${x+w+dx},${y-dy+h} ${x+w},${y+h}" fill="url(#pSide)" stroke="${FC.gr}" stroke-width="1"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${FC.gr}" stroke-width="1.2" filter="url(#fsh)"/>`;
/* Stiftsonde, Spitze bei (x,y) */
const PPROBE=(x,y,s=34,o={})=>{const L=o.len||s*2.6;let q='';
 if(o.cable!==false)q+=`<path d="M${x} ${y-L-s*.3} C${x} ${y-L-s*1.1} ${x+s*.9} ${y-L-s*1.1} ${x+s*1.2} ${y-L-s*1.9}" fill="none" stroke="#22303d" stroke-width="${pf(s*.16)}" stroke-linecap="round"/>`;
 q+=`<rect x="${pf(x-s/2)}" y="${pf(y-L)}" width="${s}" height="${pf(L-s*.55)}" rx="${pf(s*.16)}" fill="url(#plast)" filter="url(#fsh)"/>`;
 for(let i=0;i<5;i++)q+=`<line x1="${pf(x-s/2+3)}" x2="${pf(x+s/2-3)}" y1="${pf(y-L+s*.25+i*s*.12)}" y2="${pf(y-L+s*.25+i*s*.12)}" stroke="rgba(255,255,255,.2)" stroke-width="1"/>`;
 q+=`<rect x="${pf(x-s/2)}" y="${pf(y-L*.48)}" width="${s}" height="${pf(s*.14)}" fill="#0b9488"/>`;
 q+=`<path d="M${pf(x-s/2)} ${pf(y-s*.6)} L${pf(x+s/2)} ${pf(y-s*.6)} L${pf(x+s*.36)} ${y} L${pf(x-s*.36)} ${y} Z" fill="url(#tipG)"/>`;
 for(let i=0;i<4;i++)q+=`<ellipse cx="${x}" cy="${pf(y-s*.5+i*s*.11)}" rx="${pf(s*.26)}" ry="${pf(s*.05)}" fill="none" stroke="url(#cuS)" stroke-width="${pf(Math.max(1.4,s*.05))}"/>`;
 return q};
/* Spulenschnitt mit Windungen (⊙ links, ⊗ rechts) */
const PCOILSEC=(cx,cy,rc,hc)=>{let q=`<rect x="${pf(cx-rc-16)}" y="${pf(cy-hc/2-8)}" width="${pf(2*rc+32)}" height="${pf(hc+16)}" rx="9" fill="rgba(210,225,238,.55)" stroke="${FC.gr}" stroke-width="1.2" filter="url(#fsh)"/><rect x="${pf(cx-rc*.42)}" y="${pf(cy-hc/2-4)}" width="${pf(rc*.84)}" height="${pf(hc+8)}" rx="3" fill="url(#ferr)"/>`;
 [-1,1].forEach(sg=>{for(let a=0;a<2;a++)for(let b=0;b<3;b++){const x=cx+sg*(rc-5+a*10)-(sg<0?0:10)+5,y=cy-hc*.3+b*hc*.3;q+=`<circle cx="${pf(x)}" cy="${pf(y)}" r="5.4" fill="url(#cuD)" stroke="#5a2c10" stroke-width=".8"/>`+(sg<0?`<circle cx="${pf(x)}" cy="${pf(y)}" r="1.4" fill="#2a1406"/>`:`<path d="M${pf(x-2.3)} ${pf(y-2.3)}L${pf(x+2.3)} ${pf(y+2.3)}M${pf(x+2.3)} ${pf(y-2.3)}L${pf(x-2.3)} ${pf(y+2.3)}" stroke="#2a1406" stroke-width="1.2"/>`)}});return q};
/* Berechnete Feldlinien als SVG-Pfade. loops: [[a,z0,I]], map(r,z)->[x,y] */
const PFIELD=(loops,box,map,o={})=>{const res=G.fieldLines(loops,box,{key:o.key,nx:o.nx||80,ny:o.ny||70,n:o.n||7,rmax:o.rmax,span:o.span||.92,mod:o.mod});
 return res.lines.filter(pl=>pl.length>4).map(pl=>{const P=pl.map(p=>map(p[0],p[1]));if(o.clip)for(const p of P)if(!o.clip(p))p.skip=1;let d='',pen=false;P.forEach(p=>{if(p.skip){pen=false;return}d+=(pen?'L':'M')+pf(p[0])+' '+pf(p[1]);pen=true});
  return d?`<path d="${d}" fill="none" stroke="${o.col||FC.bl}" stroke-width="${o.w||1.5}" stroke-opacity="${o.op||.75}" ${o.dash?'stroke-dasharray="'+o.dash+'"':''} class="fl"/>`:''}).join('')};
/* Feld einer Spule über leitfähiger Platte (Spiegelströme, im Werkstück gedämpft) */
const PFIELDPLATE=(rc,z0,kap,dpx,box,map,o={})=>{const key='pp'+[rc,z0,kap,dpx,box].join('_');let res=G._fcache.get(key);
 if(!res){const[x0,x1,y0,y1]=box,nx=o.nx||96,ny=o.ny||72,F=new Float64Array(nx*ny);const L=[[rc,z0-6],[rc,z0],[rc,z0+6]];
  for(let j=0;j<ny;j++){const z=y0+(y1-y0)*j/(ny-1);for(let i=0;i<nx;i++){const r=x0+(x1-x0)*i/(nx-1);let s=0;if(z>=0){for(const q of L)s+=G.psiLoop(r,z,q[0],q[1])-kap*G.psiLoop(r,z,q[0],-q[1])}else{for(const q of L)s+=(1-kap)*G.psiLoop(r,z,q[0],q[1]);s*=Math.exp(z/dpx)}F[j*nx+i]=s}}
  let ref=0;for(const q of L)ref+=G.psiLoop(rc*.85,z0,q[0],q[1]);const lines=[];for(let k=0;k<(o.n||8);k++)lines.push(...G.contour(F,nx,ny,ref*(k+.5)/(o.n||8)*.9).map(pl=>pl.map(([i,j])=>[x0+(x1-x0)*i/(nx-1),y0+(y1-y0)*j/(ny-1)])));res={lines};G._fcache.set(key,res)}
 return res.lines.filter(pl=>pl.length>4).map(pl=>{const P=pl.map(p=>map(p[0],p[1]));const inPl=pl.map(p=>p[1]<0);if(o.clip){const keep=P.map(o.clip);for(let i=P.length-1;i>=0;i--)if(!keep[i]){P.splice(i,1);inPl.splice(i,1)}if(P.length<3)return''}let out='';let d='',dIn='';P.forEach((p,i)=>{const s=pf(p[0])+' '+pf(p[1]);if(inPl[i]){dIn+=(dIn&&inPl[i-1]?'L':'M')+s}else{d+=(d&&!inPl[i-1]?'L':'M')+s}});
  return `<path d="${d}" fill="none" stroke="${FC.bl}" stroke-width="1.5" stroke-opacity=".8" class="fl"/>`+(dIn?`<path d="${dIn}" fill="none" stroke="${FC.bl}" stroke-width="1.3" stroke-opacity=".45" stroke-dasharray="3 3"/>`:'')}).join('')};
/* Wirbelstrombahnen (perspektivische Ellipsen mit Pfeilen) */
const PEDDY=(cx,cy,rx,ry,n=3,o={})=>{let q='';for(let k=0;k<n;k++){const s=1-k*.28,a=.95-k*.22;q+=`<ellipse cx="${cx}" cy="${pf(cy+k*(o.dz||0))}" rx="${pf(rx*s)}" ry="${pf(ry*s)}" fill="none" stroke="${FC.red}" stroke-width="${pf(2.4-k*.4)}" stroke-opacity="${a}"/>`;
  const ang=.5+k*.9,px=cx+Math.cos(ang)*rx*s,py=cy+k*(o.dz||0)+Math.sin(ang)*ry*s,tx=-Math.sin(ang)*rx*s,ty=Math.cos(ang)*ry*s,L=Math.hypot(tx,ty)||1,ux=tx/L,uy=ty/L,h=6;q+=`<path d="M${pf(px+ux*h)} ${pf(py+uy*h)} L${pf(px-ux*h*.7-uy*h*.6)} ${pf(py-uy*h*.7+ux*h*.6)} L${pf(px-ux*h*.7+uy*h*.6)} ${pf(py-uy*h*.7-ux*h*.6)} Z" fill="${FC.red}" fill-opacity="${a}"/>`}return q};
/* Rohr / Stange (Seitenansicht, Zylinder) */
const PTUBE=(x0,x1,cy,r,o={})=>`<rect x="${x0}" y="${pf(cy-r)}" width="${x1-x0}" height="${pf(2*r)}" fill="url(#tubeG)" stroke="#55616d" stroke-width="1"/>`+(o.end!==false?`<ellipse cx="${x0}" cy="${cy}" rx="${pf(r*.28)}" ry="${r}" fill="#9aa7b4" stroke="#55616d" stroke-width="1"/>`+(o.hollow?`<ellipse cx="${x0}" cy="${cy}" rx="${pf(r*.19)}" ry="${pf(r*.68)}" fill="#1b2229"/>`:''):'');
/* Ringspule um das Rohr: hinterer bzw. vorderer Teil */
const PRING=(x,cy,rx,ry,w,part,n=4)=>{let q='';for(let k=0;k<n;k++){const xx=x-w/2+w*(k+.5)/n;q+=part==='back'?`<path d="M${pf(xx)} ${pf(cy+ry)} A${pf(rx)} ${pf(ry)} 0 0 1 ${pf(xx)} ${pf(cy-ry)}" fill="none" stroke="#7a4019" stroke-width="${pf(Math.max(2.6,w/n*.8))}"/>`:`<path d="M${pf(xx)} ${pf(cy-ry)} A${pf(rx)} ${pf(ry)} 0 0 1 ${pf(xx)} ${pf(cy+ry)}" fill="none" stroke="#4a2008" stroke-width="${pf(Math.max(2.6,w/n*.8)+1.4)}"/><path d="M${pf(xx)} ${pf(cy-ry)} A${pf(rx)} ${pf(ry)} 0 0 1 ${pf(xx)} ${pf(cy+ry)}" fill="none" stroke="url(#cuS)" stroke-width="${pf(Math.max(2.6,w/n*.8))}"/>`}return q};
const PCRACK=(x,y,len,ang=90,seed=3)=>{srand(seed);let d=`M${x} ${y}`;const a=ang*D2R;for(let i=1;i<=7;i++){const t=i/7;d+=` L${pf(x+Math.cos(a)*len*t+(i<7?(rnd()-.5)*3:0))} ${pf(y+Math.sin(a)*len*t+(i<7?(rnd()-.5)*2:0))}`}return `<path d="${d}" fill="none" stroke="#14181d" stroke-width="2.2" stroke-linejoin="round"/>`};
const PLBL=(x,y,t,c=FC.ink,o={})=>{const w=(t.replace(/[_^]\{?|\}/g,'').length*(o.s||12)*.56)+16;const ax=o.a==='start'?x:o.a==='end'?x-w:x-w/2;return `<rect x="${pf(ax)}" y="${y-(o.s||12)-4}" width="${pf(w)}" height="${(o.s||12)+10}" rx="${((o.s||12)+10)/2}" fill="#fff" fill-opacity=".9" stroke="${c}" stroke-opacity=".35" stroke-width="1"/>`+TX(ax+w/2,y,t,{c,s:o.s||12,b:o.b??1})};

/* ---------------- Neufassungen ---------------- */
FIGS.v1_setup=()=>{let s='';const cx=330,py=232,rc=46,z0=52;
 s+=PSLAB(120,py,400,42,30,20);
 s+=`<ellipse cx="${cx+15}" cy="${py-10}" rx="${rc*1.9}" ry="13" fill="url(#eddyG)"/>`+PEDDY(cx+15,py-10,rc*1.6,10,3);
 s+=PFIELDPLATE(rc,z0,.6,26,[-300,300,-42,200],(r,z)=>[cx+r,py-z],{n:8,clip:p=>p[1]>104&&(p[1]<py||(p[0]>122&&p[0]<518))});
 s+=PCOILSEC(cx,py-z0,rc,34)+`<path d="M${cx} ${py-z0-25} C${cx} ${py-z0-40} ${cx+30} ${py-z0-44} ${cx+48} ${py-z0-50}" fill="none" stroke="#22303d" stroke-width="5" stroke-linecap="round"/>`;
 s+=PLBL(cx-80,py-z0-28,'Spule L',FC.ink,{s:12});s+=TX(cx-128,py-52,'H',{c:FC.bl,b:1,s:15})+TX(cx+130,py-52,'H',{c:FC.bl,b:1,s:15});
 s+=TX(215,py+26,'Prüfgegenstand',{c:FC.pri,s:12,b:1})+TX(420,py+26,'(nicht ferromagnetisch)',{c:FC.pri,s:11.5});
 s+=PLBL(cx+15,py+66,'Wirbelströme I_W  →  Gegenfeld H_W',FC.red,{s:12});
 s+=RC(14,16,196,76,FC.pri,'#e8f0f8',1.6,12)+TX(112,40,'Erreger (Parameter)',{b:1,c:FC.pri})+TX(112,60,'Frequenz f · Strom I',{s:12})+TX(112,78,'Spule L (Windungen, Form)',{s:12});
 s+=RC(220,16,200,60,FC.gn,'#e7f6ee',1.6,12)+TX(320,40,'Messgrößen',{b:1,c:FC.gn})+TX(320,60,'Spannung U · Phase Δφ',{s:12});
 s+=RC(430,16,206,76,FC.red,'#fdecee',1.6,12)+TX(533,40,'Prüfgegenstand',{b:1,c:FC.red,s:12})+TX(533,58,'(„Sekundärspule“)',{c:FC.red,s:11})+TX(533,78,'Leitfähigkeit σ · Permeabilität μ',{s:11.5});
 return SVP(650,320,s)};

FIGS.v1_tast=()=>{let s='';const cx=310,py=196;
 s+=PSLAB(50,py,500,40,34,22);
 s+=`<ellipse cx="${cx+17}" cy="${py-11}" rx="70" ry="12" fill="url(#eddyG)"/>`+PEDDY(cx+17,py-11,52,8,3);
 const loops=[[13,30,1],[13,36,1],[13,42,1]];s+=PFIELD(loops,[-300,300,0,190],(r,z)=>[cx+r,py-z],{key:'tastf',n:7,rmax:12,span:.9,col:FC.bl,w:1.4,op:.7,dash:'5 3'});
 s+=PPROBE(cx,py-2,32,{len:96});s+=PLBL(cx+30,py-108,'Tastsensor (Spule)',FC.pri,{a:'start'});
 s+=TX(cx-190,py+26,'Prüfgegenstand',{c:FC.pri,s:12,b:1});s+=TX(310,272,'Das Feld konzentriert sich auf ein kleines, oberflächennahes Volumen',{c:FC.gr,s:12});
 return SVP(620,285,s)};

FIGS.v1_durch=()=>{let s='';const cy=140,r=38,x=310,w=150;
 s+=PRING(x,cy,r*.45,r*1.95,w,'back',7);s+=PTUBE(50,570,cy,r,{hollow:false});
 s+=`<rect x="50" y="${cy-r}" width="520" height="${2*r}" fill="#d62839" fill-opacity=".07"/>`;
 // axiales Feld im Inneren
 for(let k=-2;k<=2;k++)s+=`<line x1="${x-110}" y1="${cy+k*12}" x2="${x+110}" y2="${cy+k*12}" stroke="${FC.bl}" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#ah)" stroke-opacity=".8"/>`;
 // Wirbelströme um die Achse
 [-40,0,40].forEach((dx,i)=>s+=`<ellipse cx="${x+dx}" cy="${cy}" rx="${pf(r*.3)}" ry="${pf(r*.92)}" fill="none" stroke="${FC.red}" stroke-width="2" stroke-opacity="${.9-i*.1}"/>`);
 s+=PRING(x,cy,r*.45,r*1.95,w,'front',7);
 s+=PLBL(x,40,'Außendurchlaufsensor',FC.pri)+TX(110,cy+r+22,'Prüfgegenstand',{c:FC.red,b:1,s:12})+TX(510,cy+r+22,'(Stange/Rohr)',{c:FC.red,b:1,s:12});
 s+=TX(310,262,'Feld im Spuleninneren axial, Wirbelströme kreisen um die Achse',{c:FC.gr,s:12});
 return SVP(620,275,s)};

FIGS.v2_segment=()=>{let s='';
 const base=(x0,t)=>TX(x0+100,24,t,{b:1,c:FC.pri,s:12})+PSLAB(x0,176,186,30,16,10);
 const box=(x,y,w,h,c,lab)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#plast)" stroke="${c}" stroke-width="2.2" filter="url(#fsh)"/>`+`<rect x="${x+4}" y="${y+4}" width="${w-8}" height="${h-8}" rx="4" fill="none" stroke="url(#cuS)" stroke-width="3"/>`+(lab?TX(x+w/2,y+h/2+4,lab,{c:'#fff',s:10,b:1}):'');
 const fl=(d)=>`<path d="${d}" fill="none" stroke="${FC.bl}" stroke-width="1.5" stroke-dasharray="5 3" stroke-opacity=".85"/>`;
 s+=base(20,'a) Standardanordnung')+fl('M78 126 C64 160 70 176 100 178')+fl('M162 126 C176 160 170 176 140 178')+fl('M90 126 C84 150 92 170 108 176')+fl('M150 126 C156 150 148 170 132 176');
 s+=box(58,94,124,32,FC.pri,'Feldspule 1')+box(104,120,32,46,FC.red,'');s+=PLBL(120,72,'Messspule 2',FC.red,{s:11})+`<line x1="120" y1="78" x2="120" y2="120" stroke="${FC.red}" stroke-width="1" stroke-dasharray="2 2"/>`;s+=TX(50,156,'3',{c:FC.bl,b:1})+TX(188,172,'3',{c:FC.bl,b:1});
 s+=base(234,'b) liegende Feldspule')+fl('M268 152 C258 170 268 176 284 176')+fl('M394 152 C404 170 394 176 378 176');s+=box(264,122,134,30,FC.pri,'')+box(314,96,32,66,FC.red,'');
 s+=TX(334,236,'Felder entkoppelt:',{s:11.5,c:FC.gr})+TX(334,252,'keine Sekundärspannung',{s:11.5,c:FC.gr});
 s+=base(448,'c) senkrecht stehende Feldspule')+fl('M524 124 C508 152 510 172 530 176')+fl('M568 124 C584 152 582 172 562 176');s+=box(530,88,32,66,FC.pri,'')+box(490,118,112,30,FC.red,'');
 s+=TX(548,236,'bei Inhomogenität:',{s:11.5,c:FC.gr})+TX(548,252,'verzerrtes Feld → Signal',{s:11.5,c:FC.gr});
 return SVP(670,270,s)};

FIGS.v3_joch=()=>{let s='';const cy=145,r=34;
 s+=PTUBE(110,530,cy,r,{hollow:true});
 // Joch (U-förmiger Elektromagnet) hinter dem Rohr
 s+=`<path d="M70 ${cy+r+30} L70 ${cy-r-36} L130 ${cy-r-36} L130 ${cy-r+4} L112 ${cy-r+4} L112 ${cy+r-4} L130 ${cy+r-4} L130 ${cy+r+30} Z" fill="url(#mSt2)" stroke="${FC.gr}" stroke-width="1.4" filter="url(#fsh)"/>`;
 s+=`<path d="M570 ${cy+r+30} L570 ${cy-r-36} L510 ${cy-r-36} L510 ${cy-r+4} L528 ${cy-r+4} L528 ${cy+r-4} L510 ${cy+r-4} L510 ${cy+r+30} Z" fill="url(#mSt2)" stroke="${FC.gr}" stroke-width="1.4" filter="url(#fsh)"/>`;
 s+=`<path d="M70 ${cy+r+30} L70 ${cy+r+52} L570 ${cy+r+52} L570 ${cy+r+30}" fill="none" stroke="${FC.gr}" stroke-width="10" stroke-opacity=".35"/>`;
 [70,570].forEach(x=>{for(let k=0;k<5;k++)s+=`<rect x="${x-14}" y="${cy-r-28+k*9}" width="28" height="7" rx="3.5" fill="url(#cuS)" stroke="#6b3412" stroke-width=".8"/>`});
 s+=TX(100,cy-r-48,'Joch (Magnet)',{c:FC.pri,s:11.5,b:1})+TX(540,cy-r-48,'Joch',{c:FC.pri,s:11.5,b:1});
 [-1,0,1].forEach(k=>s+=`<line x1="150" y1="${cy+k*16}" x2="490" y2="${cy+k*16}" stroke="${FC.bl}" stroke-width="1.6" stroke-dasharray="7 5" marker-end="url(#ah)" stroke-opacity=".85"/>`);
 s+=`<ellipse cx="250" cy="${cy}" rx="7" ry="13" fill="url(#holeG)" stroke="${FC.red}" stroke-width="1.8"/>`+PLBL(250,cy+r+26,'Bohrung durch die Wand',FC.red);
 s+=`<path d="M372 ${cy-r+2} L452 ${cy-r+3}" stroke="#14181d" stroke-width="2.6"/><path d="M372 ${cy-r+1} L452 ${cy-r+2}" stroke="${FC.or}" stroke-width="7" stroke-opacity=".35"/>`+PLBL(412,cy-r-12,'Längsriss (außen)',FC.or);
 s+=TX(320,262,'Längsmagnetisierung des Rohres durch ein Elektromagnetjoch',{c:FC.gr,s:12});
 return SVP(640,275,s)};

FIGS.v3_vol=()=>{let s='';
 s+=TX(160,22,'a) Durchlaufsensor',{b:1,c:FC.pri})+TX(480,22,'b) Tastsensor',{b:1,c:FC.pri});
 const cy=140,r=40;s+=PRING(160,cy,r*.42,r*1.9,120,'back',6)+PTUBE(24,296,cy,r);
 s+=`<rect x="100" y="${cy-r}" width="120" height="${2*r}" fill="${FC.ac}" fill-opacity=".18"/>`+`<rect x="150" y="${cy-14}" width="18" height="12" rx="2" fill="${FC.red}"/>`+PRING(160,cy,r*.42,r*1.9,120,'front',6);
 s+=PLBL(238,cy-8,'Fehler',FC.red,{a:'start'})+TX(160,250,'großes erfasstes Volumen',{c:FC.gr,s:12});
 s+=PSLAB(340,176,250,44,30,18);s+=`<ellipse cx="490" cy="168" rx="46" ry="12" fill="${FC.ac}" fill-opacity=".22" stroke="${FC.ac}" stroke-width="1.6" stroke-dasharray="4 3"/>`+`<rect x="478" y="164" width="16" height="7" rx="2" fill="${FC.red}"/>`+PPROBE(490,166,30,{len:84});
 s+=PLBL(548,156,'Fehler',FC.red,{a:'start'})+TX(480,250,'kleines, oberflächennahes Volumen',{c:FC.gr,s:12});
 return SVP(640,270,s)};

FIGS.v4_abstand=()=>{let s='';const py=206,cx=180;
 s+=PSLAB(30,py,290,48,26,16);s+=`<polygon points="30,${py} 320,${py} 346,${py-16} 56,${py-16}" fill="url(#paintG)" fill-opacity=".85" stroke="#b88613" stroke-width="1"/><rect x="30" y="${py-14}" width="290" height="14" fill="url(#paintG)" stroke="#b88613" stroke-width="1"/>`;
 s+=`<ellipse cx="${cx+13}" cy="${py-4}" rx="60" ry="9" fill="url(#eddyG)"/>`;
 s+=PPROBE(cx,py-46,34,{len:100});s+=PLBL(cx+30,py-148,'Tastspule',FC.pri,{a:'start'});
 s+=TX(175,py+30,'Leiter (Grundwerkstoff)',{s:12,c:FC.pri,b:1})+TX(175,py-20,'',{})+PLBL(110,py-26,'Lack / Beschichtung (nicht leitend)','#8a6200',{s:10.5});
 s+=AR2(cx+40,py-46,cx+40,py,FC.red,1.6)+PLBL(cx+52,py-18,'Abstand',FC.red,{a:'start',s:11.5});
 const x0=420,y0=250,W=180,H=170;s+=AR(x0,y0,x0+W,y0,FC.gr,1.4)+AR(x0,y0,x0,y0-H,FC.gr,1.4)+TX(x0+W,y0+18,'Abstand',{a:'end',c:FC.gr,s:12,i:1})+TX(x0+6,y0-H+8,'Wirbelstromdichte',{a:'start',c:FC.gr,s:12,i:1});
 const p=[];for(let i=0;i<=40;i++){const t=i/40;p.push([x0+t*(W-14),y0-(H-30)*Math.exp(-t*3)])}s+=`<path d="M${p.map(q=>pf(q[0])+' '+pf(q[1])).join(' L')} L${pf(x0+W-14)} ${y0} L${x0} ${y0} Z" fill="${FC.red}" fill-opacity=".1"/>`+PTH(p,FC.red,2.6);
 return SVP(620,280,s)};

FIGS.v4_kruemm=()=>{let s='';
 const shape=(d)=>`<path d="${d}" fill="url(#mSt)" stroke="${FC.gr}" stroke-width="1.4" filter="url(#fsh)"/>`;
 s+=TX(110,22,'a) eben',{b:1,c:FC.pri})+PSLAB(20,134,170,50,20,12)+`<ellipse cx="115" cy="128" rx="58" ry="9" fill="url(#eddyG)"/>`+PEDDY(115,128,44,7,3)+PPROBE(110,126,26,{len:72,cable:false});s+=TX(110,212,'Referenz',{c:FC.gr,s:12});
 s+=TX(330,22,'b) konvex',{b:1,c:FC.pri})+shape('M250 196 Q330 96 410 196 L410 222 L250 222 Z')+`<ellipse cx="330" cy="150" rx="30" ry="7" fill="url(#eddyG)"/>`+PEDDY(330,150,22,5,2)+PPROBE(330,144,26,{len:72,cable:false});s+=PLBL(330,244,'weniger Wirbelstrom',FC.red);
 s+=TX(550,22,'c) konkav',{b:1,c:FC.pri})+shape('M462 122 Q550 222 638 122 L638 222 L462 222 Z')+`<ellipse cx="550" cy="170" rx="70" ry="11" fill="url(#eddyG)"/>`+PEDDY(550,170,56,8,3)+PPROBE(550,166,26,{len:72,cable:false});s+=PLBL(550,244,'mehr Wirbelstrom',FC.red);
 return SVP(660,262,s)};

FIGS.v6_niet=()=>{let s='';
 s+=PSLAB(40,104,520,26,30,16)+`<rect x="40" y="134" width="520" height="26" fill="url(#mSt2)" stroke="${FC.gr}" stroke-width="1.2"/>`+`<polygon points="560,134 590,118 590,144 560,160" fill="url(#pSide)" stroke="${FC.gr}" stroke-width="1"/>`;
 [140,260,380,500].forEach(x=>{s+=`<rect x="${x-7}" y="100" width="14" height="66" rx="2" fill="url(#mSt)" stroke="${FC.gr}" stroke-width="1.2"/><ellipse cx="${x+6}" cy="93" rx="20" ry="7" fill="url(#mSt)" stroke="${FC.gr}" stroke-width="1.2" filter="url(#fsh)"/><ellipse cx="${x+3}" cy="166" rx="12" ry="4" fill="url(#mSt2)" stroke="${FC.gr}" stroke-width="1"/>`});
 s+=PCRACK(166,136,24,90,7)+`<line x1="166" y1="136" x2="166" y2="160" stroke="${FC.red}" stroke-width="6" stroke-opacity=".25"/>`+PLBL(172,196,'Riss in der zweiten Lage',FC.red,{s:11.5});
 s+=`<ellipse cx="333" cy="99" rx="40" ry="7" fill="url(#eddyG)"/>`+PPROBE(330,94,26,{len:56,cable:false});s+=TX(200,30,'von der Oberfläche',{s:11.5,c:FC.gr})+PLBL(372,46,'Sensor',FC.pri,{a:'start'});
 s+=TX(300,250,'Nietnaht: obere und untere Blechlage, Risse gehen von den Nietlöchern aus',{s:12,c:FC.gr});
 return SVP(640,265,s)};

FIGS.v11_durch=()=>{let s='';const cy=100,r=26;
 [134,184].forEach(x=>s+=PRING(x,cy,r*.42,r*1.9,30,'back',3));s+=PTUBE(24,340,cy,r);s+=PCRACK(262,cy-r,14,90,5);
 [134,184].forEach(x=>s+=PRING(x,cy,r*.42,r*1.9,30,'front',3));s+=TX(134,cy-r*2-8,'+',{c:FC.bl,b:1,s:16})+TX(184,cy-r*2-8,'−',{c:FC.or,b:1,s:16});
 s+=TX(160,24,'Erreger- + Sekundärspulen (Differenz)',{s:11,c:FC.gr})+PLBL(262,cy-r-14,'Riss',FC.red,{s:11});s+=AR(60,178,300,178,FC.gr,1.4)+TX(180,198,'Bewegung des Prüfguts →',{s:11,c:FC.gr});
 s+=`<rect x="372" y="34" width="290" height="140" rx="12" fill="url(#scrG)" stroke="#2b343d" stroke-width="3" filter="url(#fsh)"/>`;for(let k=1;k<6;k++)s+=`<line x1="${372+k*48}" y1="40" x2="${372+k*48}" y2="168" stroke="#1c4a35" stroke-width="1"/>`;
 s+=`<line x1="378" y1="104" x2="656" y2="104" stroke="#2c7a52" stroke-width="1"/>`+PTH([[380,104],[440,104],[476,58],[508,150],[544,104],[654,104]],'#3dff95',2.6,'filter="url(#fgl)"');
 s+=TX(517,196,'Differenzsignal: erst +, dann −',{s:11.5,c:FC.red,b:1});
 return SVP(680,210,s)};

FIGS.v11_sens=()=>{let s='';
 s+=PRING(95,90,10,34,34,'back',3)+PTUBE(20,170,90,17)+PRING(95,90,10,34,34,'front',3)+TX(95,150,'Außendurchlauf',{s:11.5,b:1,c:FC.pri})+TX(95,166,'umfasst das Prüfgut',{s:10.5,c:FC.gr});
 s+=PTUBE(200,350,90,30,{hollow:true})+`<rect x="200" y="74" width="150" height="32" fill="#1b2229" fill-opacity=".55"/>`+PRING(262,90,6,14,26,'front',3)+`<line x1="210" y1="90" x2="340" y2="90" stroke="${FC.gr}" stroke-dasharray="4 3"/>`+TX(275,150,'Innendurchlauf',{s:11.5,b:1,c:FC.pri})+TX(275,166,'prüft von innen',{s:10.5,c:FC.gr});
 s+=PTUBE(380,510,98,22)+PPROBE(445,76,18,{len:42,cable:false})+`<path d="M470 52 A26 10 0 1 1 420 52" fill="none" stroke="${FC.red}" stroke-width="1.6" marker-end="url(#ah)"/>`+TX(445,150,'Tastsensor',{s:11.5,b:1,c:FC.pri})+TX(445,166,'(rotierend, Längsfehler)',{s:10.5,c:FC.gr});
 s+=`<circle cx="600" cy="100" r="38" fill="url(#mSt)" stroke="${FC.gr}" stroke-width="1.4" filter="url(#fsh)"/><circle cx="600" cy="100" r="26" fill="url(#holeG)"/>`+`<path d="M570 66 Q600 48 630 66" fill="none" stroke="#4a2008" stroke-width="9" stroke-linecap="round"/><path d="M570 66 Q600 48 630 66" fill="none" stroke="url(#cuS)" stroke-width="6.5" stroke-linecap="round"/>`+TX(600,160,'Segmentsensor',{s:11.5,b:1,c:FC.pri})+TX(600,176,'(Sattelspule, Naht)',{s:10.5,c:FC.gr});
 return SVP(680,195,s)};

FIGS.v13_naht=()=>{let s='';const y=112,h=46;
 const z=(x,w,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${FC.gr}" stroke-width="1"/>`;
 s+=`<polygon points="20,${y} 660,${y} 684,${y-14} 44,${y-14}" fill="url(#pTop)" stroke="${FC.gr}" stroke-width="1"/>`;
 s+=z(20,150,'url(#mSt)')+z(170,90,'url(#mSt)')+z(260,60,'url(#mSt)')+z(320,40,'url(#weldG)')+z(360,60,'url(#mSt)')+z(420,90,'url(#mSt)')+z(510,150,'url(#mSt2)');
 s+=`<rect x="170" y="${y}" width="150" height="${h}" fill="url(#hazG)"/><rect x="360" y="${y}" width="150" height="${h}" fill="url(#hazG)" transform="translate(870 0) scale(-1 1)"/>`;
 s+=`<path d="M318 ${y} Q340 ${y-40} 362 ${y} Z" fill="url(#weldG)" stroke="#8a6a2e" stroke-width="1.2" filter="url(#fsh)"/>`;for(let k=0;k<5;k++)s+=`<path d="M${326+k*5} ${y-6-k*3} q4 -6 8 0" fill="none" stroke="#8a6a2e" stroke-width=".8" stroke-opacity=".7"/>`;
 s+=`<line x1="20" y1="${y-1}" x2="660" y2="${y-1}" stroke="${FC.red}" stroke-width="2.4"/>`;
 [[95,'Grundmaterial 1','μ_{rel}, σ'],[215,'WEZ 1','μ_{rel}, σ'],[290,'Grenzschicht','Geom., μ_{rel}, σ'],[340,'Raupe','σ, μ_{rel}'],[390,'Grenzschicht','Geom., μ_{rel}, σ'],[465,'WEZ 2','μ_{rel}, σ'],[585,'Grundmaterial 2','μ_{rel}, σ']].forEach(([x,t,l],i)=>{const yy=i%2?y+h+44:y+h+20;if(i%2)s+=`<line x1="${x}" y1="${y+h+2}" x2="${x}" y2="${yy-12}" stroke="${FC.gr}" stroke-width="1" stroke-dasharray="2 2"/>`;s+=TX(x,yy,t,{s:10.5,c:FC.pri,b:1})+TX(x,yy+14,l,{s:10,c:FC.gr})});
 s+=PLBL(340,52,'Schweißgut / Raupe',FC.pri,{s:11.5})+AR(340,60,340,76,FC.pri,1.6)+PLBL(560,82,'Prüffläche',FC.red,{s:11.5});
 return SVP(700,240,s)};
