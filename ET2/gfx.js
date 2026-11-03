"use strict";
/* =====================================================================
   ET2 Grafik-Engine
   Themenfähige Palette, Werkstoffe mit Struktur, 3D-Spulen, Sonden,
   Oszilloskop-Bildschirme mit Nachleuchten, physikalisch berechnete
   Feldlinien (Ringstrom-Flussfunktion mit elliptischen Integralen),
   Diagramme mit Haar- und Nebengitter.
   ===================================================================== */
const PAL={
 light:{bg:'#f6f9fc',bg2:'#e9f0f6',panel:'#ffffff',ink:'#0f1b2a',ink2:'#304457',mute:'#5b6e82',faint:'#94a5b6',grid:'#e1e8ef',grid2:'#eef3f7',axis:'#8a9db0',
  blue:'#1769a6',orange:'#e8590c',green:'#12915a',red:'#d62839',violet:'#6d44e0',teal:'#0b9488',amber:'#d48a00',pink:'#d6336c',sky:'#0e8fd1',
  field:'#2479c2',eddy:'#ef5a1c',shadow:'rgba(20,40,70,.20)',lblBg:'rgba(255,255,255,.90)',lblLine:'rgba(15,27,42,.10)',air:'#f2f6fa',hi:'rgba(255,255,255,.9)'},
 dark:{bg:'#0e1520',bg2:'#142130',panel:'#141f2c',ink:'#e6eef7',ink2:'#c3d1df',mute:'#9cafc2',faint:'#5f7489',grid:'#22313f',grid2:'#1a2735',axis:'#5d7489',
  blue:'#5cb0f2',orange:'#ff8d50',green:'#4fd68b',red:'#ff6574',violet:'#ab93ff',teal:'#3fd6cb',amber:'#ffc24d',pink:'#ff6fa5',sky:'#4fc3ff',
  field:'#74bcff',eddy:'#ff8d50',shadow:'rgba(0,0,0,.55)',lblBg:'rgba(16,26,38,.92)',lblLine:'rgba(255,255,255,.10)',air:'#111b26',hi:'rgba(255,255,255,.55)'}};
let T=PAL.light,DARK=false;
const CANVASES=new Set();
const PH={g:'#3dff95',a:'#ffc04a',r:'#ff5d6c',b:'#59b6ff',c:'#5ff0e0',v:'#c39bff',grid:'rgba(61,255,149,.10)',grid2:'rgba(61,255,149,.22)',lbl:'#8fe3b6'};
const FONT='"Inter",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif',MONO='ui-monospace,"SF Mono",Menlo,Consolas,monospace';

const G={};
G.setDark=d=>{DARK=!!d;T=DARK?PAL.dark:PAL.light;G._pat={};CANVASES.forEach(o=>{try{o.redraw()}catch(e){}})};
G.font=(sz=12,wt=500,mono)=>(wt+' '+sz+'px '+(mono?MONO:FONT));
G.rgba=(hex,a)=>{if(hex.startsWith('rgba')||hex.startsWith('rgb'))return hex;let h=hex.slice(1);if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16);return'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')'};
G.mix=(a,b,t)=>{const p=x=>{const n=parseInt(x.slice(1),16);return[n>>16&255,n>>8&255,n&255]};const A=p(a),B=p(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
/* Farbskala (Stromdichte, Wärmebild) */
const CMAP=['#05030f','#2a0b56','#64107a','#a3216c','#d9454d','#f4772d','#fbb33a','#fcf6a8'];
G.cmap=v=>{v=Math.max(0,Math.min(1,v))*(CMAP.length-1);const i=Math.min(CMAP.length-2,Math.floor(v));return G.mix(CMAP[i],CMAP[i+1],v-i)};
const CMAP2=['#0b2a6f','#1f5fbf','#57a6e8','#e8eef4','#f4a36b','#d9532c','#7a1414'];
G.cdiv=v=>{v=(Math.max(-1,Math.min(1,v))+1)/2*(CMAP2.length-1);const i=Math.min(CMAP2.length-2,Math.floor(v));return G.mix(CMAP2[i],CMAP2[i+1],v-i)};

G.rr=(c,x,y,w,h,r)=>{r=Math.max(0,Math.min(r,Math.abs(w)/2,Math.abs(h)/2));c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()};
G.clip=(c,x,y,w,h,fn,r=0)=>{c.save();G.rr(c,x,y,w,h,r);c.clip();fn();c.restore()};

/* ---------- Hintergrund ---------- */
G.bench=(c,w,h,o={})=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,DARK?'#132030':'#f9fbfd');g.addColorStop(1,DARK?'#0f1824':'#edf2f7');c.fillStyle=g;c.fillRect(0,0,w,h);
 if(o.dots!==false){c.fillStyle=DARK?'rgba(255,255,255,.035)':'rgba(15,40,70,.05)';const s=o.step||18;for(let y=s/2;y<h;y+=s)for(let x=s/2;x<w;x+=s)c.fillRect(x,y,1.2,1.2)}};

/* ---------- Text ---------- */
G.text=(c,t,x,y,o={})=>{c.save();c.font=G.font(o.size||12,o.weight||500,o.mono);c.fillStyle=o.col||T.ink;c.textAlign=o.align||'left';c.textBaseline=o.base||'alphabetic';
 if(o.halo){c.lineJoin='round';c.strokeStyle=o.halo===true?(DARK?'rgba(14,21,32,.85)':'rgba(255,255,255,.9)'):o.halo;c.lineWidth=3.5;c.strokeText(t,x,y)}c.fillText(t,x,y);c.restore()};
G.tw=(c,t,sz=12,wt=500,mono)=>{c.save();c.font=G.font(sz,wt,mono);const w=c.measureText(t).width;c.restore();return w};
/* Etikett mit Hintergrund (Pille) */
G.label=(c,t,x,y,o={})=>{const sz=o.size||12,pad=o.pad??6,w=G.tw(c,t,sz,o.weight||600,o.mono)+pad*2,h=sz+pad*1.2;let x0=x;if(o.align==='center')x0=x-w/2;else if(o.align==='right')x0=x-w;const y0=y-h/2;
 c.save();if(o.shadow!==false){c.shadowColor=T.shadow;c.shadowBlur=6;c.shadowOffsetY=1}c.fillStyle=o.bg||T.lblBg;G.rr(c,x0,y0,w,h,o.r??h/2);c.fill();c.shadowColor='transparent';
 if(o.border!==false){c.strokeStyle=o.line||(o.col?G.rgba(o.col,.35):T.lblLine);c.lineWidth=1;c.stroke()}
 if(o.dot){c.fillStyle=o.dot;c.beginPath();c.arc(x0+pad+3,y,3.5,0,Math.PI*2);c.fill()}
 c.font=G.font(sz,o.weight||600,o.mono);c.fillStyle=o.col||T.ink;c.textAlign='left';c.textBaseline='middle';c.fillText(t,x0+pad+(o.dot?10:0)-(o.dot?0:0),y+.5);c.restore();return{x:x0,y:y0,w,h}};
/* Formel-/Subscript-Text: "X_L" -> X mit tiefgestelltem L, "^2" hochgestellt */
G.rich=(c,t,x,y,o={})=>{const sz=o.size||13,wt=o.weight||600;const parts=[];let i=0;const re=/([_^])(\{[^}]*\}|[A-Za-z0-9αβγδεηθκλμνπρσφωΔΦΩ∞]+)/g;let m;while((m=re.exec(t))){if(m.index>i)parts.push([t.slice(i,m.index),0]);parts.push([m[2].replace(/[{}]/g,''),m[1]==='_'?1:-1]);i=re.lastIndex}if(i<t.length)parts.push([t.slice(i),0]);
 c.save();c.fillStyle=o.col||T.ink;c.textBaseline='alphabetic';let tot=0;parts.forEach(([s,k])=>{c.font=G.font(k?sz*.72:sz,wt);tot+=c.measureText(s).width});let cx=o.align==='center'?x-tot/2:o.align==='right'?x-tot:x;
 parts.forEach(([s,k])=>{c.font=G.font(k?sz*.72:sz,wt);if(o.halo){c.strokeStyle=DARK?'rgba(14,21,32,.85)':'rgba(255,255,255,.9)';c.lineWidth=3;c.lineJoin='round';c.strokeText(s,cx,y+(k===1?sz*.28:k===-1?-sz*.38:0))}c.fillText(s,cx,y+(k===1?sz*.28:k===-1?-sz*.38:0));cx+=c.measureText(s).width});c.restore();return tot};

/* ---------- Linien, Pfeile, Punkte ---------- */
G.path=(c,pts)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))};
G.line=(c,pts,col,lw=2,o={})=>{if(pts.length<2)return;c.save();c.lineJoin='round';c.lineCap='round';c.strokeStyle=col;c.lineWidth=lw;if(o.dash)c.setLineDash(o.dash);if(o.alpha!=null)c.globalAlpha=o.alpha;
 if(o.glow){c.shadowColor=col;c.shadowBlur=o.glow}G.path(c,pts);c.stroke();c.restore()};
G.curve=(c,pts,col,o={})=>{if(pts.length<2)return;if(o.fill!=null){c.save();const g=c.createLinearGradient(0,Math.min(...pts.map(p=>p[1])),0,o.fill);g.addColorStop(0,G.rgba(col,o.fa??.22));g.addColorStop(1,G.rgba(col,0));c.fillStyle=g;G.path(c,pts);c.lineTo(pts[pts.length-1][0],o.fill);c.lineTo(pts[0][0],o.fill);c.closePath();c.fill();c.restore()}
 if(o.under!==false&&!o.dash){G.line(c,pts,DARK?'rgba(0,0,0,.35)':'rgba(255,255,255,.9)',(o.lw||2.2)+2.5)}G.line(c,pts,col,o.lw||2.2,o)};
G.dot=(c,x,y,r,col,o={})=>{c.save();if(o.glow){c.shadowColor=col;c.shadowBlur=o.glow}c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.shadowBlur=0;
 if(o.ring!==false){c.lineWidth=o.rw||2;c.strokeStyle=o.ring||(DARK?'#0e1520':'#fff');c.stroke()}if(o.halo){c.strokeStyle=G.rgba(col,.35);c.lineWidth=o.halo;c.beginPath();c.arc(x,y,r+o.halo/2+1.5,0,Math.PI*2);c.stroke()}c.restore()};
G.arrow=(c,x1,y1,x2,y2,col,o={})=>{const lw=o.lw||2.5,hs=o.head||Math.max(8,lw*3.2),a=Math.atan2(y2-y1,x2-x1),L=Math.hypot(x2-x1,y2-y1);if(L<1)return;c.save();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=lw;c.lineCap='round';
 if(o.glow){c.shadowColor=col;c.shadowBlur=o.glow}if(o.dash)c.setLineDash(o.dash);const k=Math.min(hs*.75,L*.6);c.beginPath();c.moveTo(x1,y1);c.lineTo(x2-Math.cos(a)*k,y2-Math.sin(a)*k);c.stroke();c.setLineDash([]);
 const w=o.hw||.42,hl=Math.min(hs,L*.8);c.beginPath();c.moveTo(x2,y2);c.lineTo(x2-hl*Math.cos(a-w),y2-hl*Math.sin(a-w));c.quadraticCurveTo(x2-hl*.62*Math.cos(a),y2-hl*.62*Math.sin(a),x2-hl*Math.cos(a+w),y2-hl*Math.sin(a+w));c.closePath();c.fill();
 if(o.both){c.beginPath();c.moveTo(x1,y1);c.lineTo(x1+hl*Math.cos(a-w),y1+hl*Math.sin(a-w));c.lineTo(x1+hl*Math.cos(a+w),y1+hl*Math.sin(a+w));c.closePath();c.fill()}c.restore()};
/* Bemaßung */
G.dim=(c,x1,y1,x2,y2,t,o={})=>{const col=o.col||T.mute;G.arrow(c,(x1+x2)/2,(y1+y2)/2,x1,y1,col,{lw:1.2,head:7});G.arrow(c,(x1+x2)/2,(y1+y2)/2,x2,y2,col,{lw:1.2,head:7});
 const a=Math.atan2(y2-y1,x2-x1),nx=-Math.sin(a)*4,ny=Math.cos(a)*4;c.save();c.strokeStyle=col;c.lineWidth=1;c.beginPath();c.moveTo(x1-nx*1.5,y1-ny*1.5);c.lineTo(x1+nx*1.5,y1+ny*1.5);c.moveTo(x2-nx*1.5,y2-ny*1.5);c.lineTo(x2+nx*1.5,y2+ny*1.5);c.stroke();c.restore();
 if(t)G.label(c,t,(x1+x2)/2+(o.dx||0),(y1+y2)/2+(o.dy||0),{align:'center',size:o.size||11,col,shadow:false})};
G.hatch=(c,x,y,w,h,col,gap=6,ang=1)=>{c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.strokeStyle=col;c.lineWidth=1;c.beginPath();for(let k=-h;k<w+h;k+=gap){c.moveTo(x+k,y+h);c.lineTo(x+k+h*ang,y)}c.stroke();c.restore()};
G.legend=(c,x,y,items,o={})=>{let cx=x;const sz=o.size||11.5;items.forEach(([col,t,dash])=>{const tw=G.tw(c,t,sz,600)+30;if(o.max&&cx+tw>o.max&&cx>x){cx=x;y+=sz+9}
 c.save();c.strokeStyle=col;c.lineWidth=3;c.lineCap='round';if(dash)c.setLineDash(dash);c.beginPath();c.moveTo(cx,y);c.lineTo(cx+16,y);c.stroke();c.restore();G.text(c,t,cx+21,y+4,{size:sz,weight:600,col:o.col||T.ink2});cx+=tw+6});return y};

/* ---------- Werkstoffe ---------- */
const MAT={steel:['#cdd5dd','#9ea9b4','#6c7884'],alu:['#eef2f5','#c4ccd4','#949fa9'],copper:['#ffc796','#d98a4e','#9a5222'],brass:['#f6e09a','#d3ad55','#97752a'],ti:['#d5d6e0','#a3a3b1','#6f6f80'],
 inox:['#e7ebee','#b8bfc7','#858e98'],ferrite:['#6b717a','#3d4148','#1f2227'],plastic:['#5f93c6','#2f5f8a','#183552'],dark:['#5a6672','#36414b','#1d252c'],paint:['#ffe08a','#f2bf3a','#b88613'],
 weld:['#e6cf9a','#b89a5e','#7a6234'],rust:['#d99a6c','#a5582e','#5c2c12'],red:['#ff8a8a','#d62839','#86101c'],blue:['#8ab4ff','#2f6fd0','#173c80'],green:['#7fe0a8','#20a35e','#0c5a32']};
G._pat={};
G.pattern=(c,mat)=>{if(G._pat[mat])return G._pat[mat];const o=document.createElement('canvas');o.width=160;o.height=96;const x=o.getContext('2d');let s=mat.length*97+13;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
 for(let i=0;i<260;i++){const y=r()*96,l=20+r()*120,x0=r()*160,a=.03+r()*.07;x.strokeStyle=(r()<.5?'rgba(255,255,255,':'rgba(0,0,0,')+a+')';x.lineWidth=.6+r()*.9;x.beginPath();x.moveTo(x0,y);x.lineTo(x0+l,y+(r()-.5)*1.2);x.stroke()}
 for(let i=0;i<500;i++){x.fillStyle='rgba('+(r()<.5?'255,255,255':'0,0,0')+','+(r()*.05)+')';x.fillRect(r()*160,r()*96,1,1)}
 return G._pat[mat]=c.createPattern(o,'repeat')};
/* Werkstoffblock (Schnitt oder Ansicht) */
G.metal=(c,x,y,w,h,mat='steel',o={})=>{const M=MAT[mat]||MAT.steel;c.save();G.rr(c,x,y,w,h,o.r||0);const g=o.vert?c.createLinearGradient(x,0,x+w,0):c.createLinearGradient(0,y,0,y+h);
 g.addColorStop(0,M[0]);g.addColorStop(.18,M[1]);g.addColorStop(1,M[2]);c.fillStyle=g;if(o.shadow){c.shadowColor=T.shadow;c.shadowBlur=o.shadow;c.shadowOffsetY=o.shadow/3}c.fill();c.shadowColor='transparent';
 c.clip();c.globalAlpha=o.tex??.9;c.fillStyle=G.pattern(c,mat);c.translate(x,y);c.fillRect(0,0,w,h);c.translate(-x,-y);c.globalAlpha=1;
 if(o.hatch)G.hatch(c,x,y,w,h,'rgba(0,0,0,'+(o.hatch===true?.13:o.hatch)+')',7);
 c.fillStyle='rgba(255,255,255,.55)';c.fillRect(x,y,w,1.2);c.restore();c.save();G.rr(c,x+.5,y+.5,w-1,h-1,o.r||0);c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=1;c.stroke();c.restore()};
/* Platte in Kavaliersperspektive: Vorderseite (Schnitt) + Oberseite + rechte Seite */
G.slab=(c,x,y,w,h,dx,dy,mat='steel',o={})=>{const M=MAT[mat]||MAT.steel;c.save();
 if(o.shadow!==false){c.save();c.fillStyle=T.shadow;c.filter='blur(10px)';c.beginPath();c.ellipse(x+w/2+dx/2,y+h+8,w*.55,10,0,0,Math.PI*2);c.fill();c.restore()}
 // Oberseite
 c.beginPath();c.moveTo(x,y);c.lineTo(x+w,y);c.lineTo(x+w+dx,y-dy);c.lineTo(x+dx,y-dy);c.closePath();const gt=c.createLinearGradient(0,y-dy,0,y);gt.addColorStop(0,G.mix(M[0],'#ffffff',.25));gt.addColorStop(1,M[0]);c.fillStyle=gt;c.fill();
 c.save();c.clip();c.globalAlpha=.7;c.fillStyle=G.pattern(c,mat);c.fillRect(x,y-dy,w+dx,dy);c.restore();c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=1;c.stroke();
 // rechte Seite
 c.beginPath();c.moveTo(x+w,y);c.lineTo(x+w+dx,y-dy);c.lineTo(x+w+dx,y-dy+h);c.lineTo(x+w,y+h);c.closePath();const gs=c.createLinearGradient(x+w,0,x+w+dx,0);gs.addColorStop(0,M[2]);gs.addColorStop(1,G.mix(M[2],'#000000',.25));c.fillStyle=gs;c.fill();c.stroke();
 c.restore();G.metal(c,x,y,w,h,mat,{hatch:o.hatch});return{top:[[x,y],[x+w,y],[x+w+dx,y-dy],[x+dx,y-dy]]}};

/* ---------- Spulen ---------- */
/* Zylinderspule (Seitenansicht). axis 'h' (Achse waagerecht) oder 'v'. o.I: Strom −1…1 (Leuchten), o.phase: Strompunkte */
G.coil=(c,cx,cy,len,rad,n,o={})=>{c.save();c.translate(cx,cy);if(o.axis==='v')c.rotate(-Math.PI/2);const p=len/n,rx=o.rx??Math.max(3,rad*.3),lw=o.lw||Math.max(2.2,Math.min(p*.62,rad*.16));const x0=-len/2;
 const back=i=>{const x=x0+i*p+p/2;c.beginPath();c.moveTo(x,rad);c.bezierCurveTo(x-rx*1.33,rad*.55,x+p/2-rx*1.33,-rad*.55,x+p/2,-rad)};
 const front=i=>{const x=x0+i*p;c.beginPath();c.moveTo(x,-rad);c.bezierCurveTo(x+rx*1.33,-rad*.55,x+p/2+rx*1.33,rad*.55,x+p/2,rad)};
 c.lineCap='round';
 for(let i=0;i<n;i++){back(i);c.strokeStyle='#5a2c10';c.lineWidth=lw+1.2;c.stroke();back(i);c.strokeStyle='#9c5a2c';c.lineWidth=lw;c.stroke()}
 if(o.core){c.restore();c.save();c.translate(cx,cy);if(o.axis==='v')c.rotate(-Math.PI/2);const cr=rad*.62,M=MAT[o.core]||MAT.ferrite;const cl=len+(o.coreExt??rad*.6);const g=c.createLinearGradient(0,-cr,0,cr);g.addColorStop(0,M[2]);g.addColorStop(.3,M[0]);g.addColorStop(.55,M[1]);g.addColorStop(1,M[2]);c.fillStyle=g;G.rr(c,-cl/2,-cr,cl,cr*2,3);c.fill();c.globalAlpha=.6;c.fillStyle=G.pattern(c,o.core);c.fill();c.globalAlpha=1}
 if(o.inner)o.inner(c);
 const I=o.I||0;for(let i=0;i<n;i++){front(i);c.strokeStyle='#4a2008';c.lineWidth=lw+1.6;c.stroke();front(i);const g=c.createLinearGradient(0,-rad,0,rad);g.addColorStop(0,'#b36a35');g.addColorStop(.35,'#ffc58f');g.addColorStop(.6,'#e0904f');g.addColorStop(1,'#8d4a1f');c.strokeStyle=g;c.lineWidth=lw;c.stroke();
  const x=x0+i*p;c.beginPath();c.moveTo(x+rx*.25,-rad*.9);c.bezierCurveTo(x+rx*1.1,-rad*.5,x+p/2+rx*.9,rad*.2,x+p/2+rx*.65,rad*.45);c.strokeStyle='rgba(255,240,220,.65)';c.lineWidth=Math.max(.8,lw*.28);c.stroke()}
 if(Math.abs(I)>.02){c.globalCompositeOperation=DARK?'lighter':'source-over';for(let i=0;i<n;i++){front(i);c.strokeStyle=G.rgba(I>0?'#ffd166':'#7cc4ff',Math.min(.75,Math.abs(I)*.75));c.lineWidth=lw*.55;c.shadowColor=I>0?'#ffb000':'#3aa0ff';c.shadowBlur=8*Math.abs(I);c.stroke()}c.shadowBlur=0;c.globalCompositeOperation='source-over'}
 if(o.phase!=null&&Math.abs(I)>.02){const ph=((o.phase%1)+1)%1;c.fillStyle='#fff7d1';for(let i=0;i<n;i++){const x=x0+i*p,s=ph;const bx=(1-s)**3*x+3*(1-s)**2*s*(x+rx*1.33)+3*(1-s)*s*s*(x+p/2+rx*1.33)+s**3*(x+p/2),by=(1-s)**3*-rad+3*(1-s)**2*s*(-rad*.55)+3*(1-s)*s*s*(rad*.55)+s**3*rad;c.beginPath();c.arc(bx,by,lw*.42,0,Math.PI*2);c.fill()}}
 if(o.leads!==false){c.strokeStyle='#8d4a1f';c.lineWidth=lw*.8;c.beginPath();const ll=Math.min(rad*.35,16);c.moveTo(x0,-rad);c.quadraticCurveTo(x0-p*.6,-rad-ll*.4,x0-p*.9,-rad-ll);c.moveTo(x0+len-p/2,rad);c.quadraticCurveTo(x0+len+p*.2,rad+ll*.4,x0+len+p*.5,rad+ll);c.stroke()}
 c.restore()};
/* Wicklungsquerschnitt: Leiter mit Punkt/Kreuz (Stromrichtung) */
G.winding=(c,x,y,r,dir,o={})=>{c.save();const g=c.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#ffd2a8');g.addColorStop(.5,'#d98a4e');g.addColorStop(1,'#8d4a1f');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.strokeStyle='#5a2c10';c.lineWidth=1;c.stroke();
 if(dir&&r>4){c.strokeStyle=c.fillStyle='#2a1406';c.lineWidth=Math.max(1,r*.16);if(dir>0){c.beginPath();c.arc(x,y,r*.22,0,Math.PI*2);c.fill()}else{const k=r*.42;c.beginPath();c.moveTo(x-k,y-k);c.lineTo(x+k,y+k);c.moveTo(x+k,y-k);c.lineTo(x-k,y+k);c.stroke()}}c.restore()};
/* Ringspule (Durchlaufspule) in Perspektive um eine waagerechte Achse: hinterer/vorderer Teil getrennt zeichnen */
G.ringCoil=(c,x,y,rx,ry,wdt,part,o={})=>{c.save();const a0=part==='back'?Math.PI:0,a1=part==='back'?2*Math.PI:Math.PI;const n=o.n||5;
 for(let k=0;k<n;k++){const xx=x-wdt/2+wdt*(k+.5)/n;c.beginPath();c.ellipse(xx,y,rx,ry,0,Math.PI/2+a0,Math.PI/2+a1);c.lineWidth=Math.max(2.4,wdt/n*.8);
  if(part==='back'){c.strokeStyle='#7a4019'}else{const g=c.createLinearGradient(0,y-ry,0,y+ry);g.addColorStop(0,'#a8602d');g.addColorStop(.5,'#ffc590');g.addColorStop(1,'#8d4a1f');c.strokeStyle=g}c.stroke()}
 if(o.glow&&part!=='back'){c.beginPath();c.ellipse(x,y,rx+3,ry+3,0,Math.PI/2,Math.PI*1.5,true);c.strokeStyle=G.rgba(o.glow,.5);c.lineWidth=3;c.shadowColor=o.glow;c.shadowBlur=12;c.stroke()}
 c.restore()};

/* Tastsonde (Stiftsonde). Spitze unten bei (x,y). s = Breite der Spitze in px */
G.probe=(c,x,y,s,o={})=>{c.save();const w=s,hb=o.len||s*3.4;const ang=o.angle||0;c.translate(x,y);c.rotate(ang);
 if(o.shadow!==false){c.save();c.fillStyle=T.shadow;c.filter='blur(6px)';c.beginPath();c.ellipse(o.sx||0,o.sy||6,w*.7,4,0,0,Math.PI*2);c.fill();c.restore()}
 // Kabel
 if(o.cable!==false){c.strokeStyle=DARK?'#0b0f14':'#22303d';c.lineWidth=Math.max(3,w*.18);c.lineCap='round';c.beginPath();c.moveTo(0,-hb-w*.5);c.bezierCurveTo(0,-hb-w*1.5,w*1.2,-hb-w*1.6,w*1.6,-hb-w*2.6);c.stroke()}
 // Gehäuse
 const g=c.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#1c3550');g.addColorStop(.3,'#4f86b8');g.addColorStop(.55,'#2f5f8a');g.addColorStop(1,'#132a40');c.fillStyle=g;G.rr(c,-w/2,-hb,w,hb-w*.55,w*.18);c.fill();
 c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=1;for(let i=0;i<6;i++){const yy=-hb*.82+i*w*.12;c.beginPath();c.moveTo(-w/2+2,yy);c.lineTo(w/2-2,yy);c.stroke()}
 c.fillStyle=o.band||'#0b9488';c.fillRect(-w/2,-hb*.45,w,w*.16);
 // Spitze (Kunststoff), darin Spule
 const gt=c.createLinearGradient(-w/2,0,w/2,0);gt.addColorStop(0,'#3c434b');gt.addColorStop(.35,'#8a939d');gt.addColorStop(1,'#2a3036');c.fillStyle=gt;c.beginPath();c.moveTo(-w/2,-w*.62);c.lineTo(w/2,-w*.62);c.lineTo(w*.36,0);c.lineTo(-w*.36,0);c.closePath();c.fill();
 if(o.cut!==false){c.save();c.beginPath();c.moveTo(-w*.32,-w*.5);c.lineTo(w*.32,-w*.5);c.lineTo(w*.26,-w*.05);c.lineTo(-w*.26,-w*.05);c.closePath();c.clip();c.fillStyle='#14181d';c.fill();G.coil(c,0,-w*.27,w*.4,w*.2,5,{axis:'v',rx:w*.05,lw:Math.max(1.2,w*.045),leads:false,core:'ferrite',coreExt:w*.08,I:o.I||0});c.restore()}
 if(o.diff){c.fillStyle='#fff';c.font=G.font(Math.max(8,w*.22),800);c.textAlign='center';c.fillText('D',0,-hb*.62)}
 if(o.glow){c.strokeStyle=G.rgba(o.glow,.8);c.lineWidth=2;c.shadowColor=o.glow;c.shadowBlur=14;G.rr(c,-w/2-2,-hb-2,w+4,hb+2,w*.2);c.stroke()}
 c.restore()};

/* Stabmagnet */
G.magnet=(c,x,y,w,h,pol=1,o={})=>{c.save();if(o.shadow!==false){c.shadowColor=T.shadow;c.shadowBlur=12;c.shadowOffsetY=5}
 const half=(x0,col)=>{const M=MAT[col];const g=c.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,M[0]);g.addColorStop(.25,M[1]);g.addColorStop(1,M[2]);c.fillStyle=g;c.fillRect(x0,y-h/2,w/2,h)};
 G.rr(c,x-w/2,y-h/2,w,h,h*.12);c.fillStyle='#000';c.fill();c.shadowColor='transparent';c.save();G.rr(c,x-w/2,y-h/2,w,h,h*.12);c.clip();half(x-w/2,pol>0?'red':'blue');half(x,pol>0?'blue':'red');
 c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x-w/2,y-h/2+2,w,h*.12);c.globalAlpha=.25;c.fillStyle=G.pattern(c,'steel');c.fillRect(x-w/2,y-h/2,w,h);c.restore();
 c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;G.rr(c,x-w/2,y-h/2,w,h,h*.12);c.stroke();
 c.font=G.font(h*.46,800);c.textAlign='center';c.textBaseline='middle';c.fillStyle='rgba(255,255,255,.95)';c.fillText(pol>0?'N':'S',x-w/4,y+1);c.fillText(pol>0?'S':'N',x+w/4,y+1);c.restore()};

/* Zeigerinstrument */
G.meter=(c,x,y,r,v,o={})=>{c.save();c.shadowColor=T.shadow;c.shadowBlur=10;c.shadowOffsetY=3;const g=c.createLinearGradient(0,y-r,0,y+r*.3);g.addColorStop(0,DARK?'#2a3846':'#ffffff');g.addColorStop(1,DARK?'#18222d':'#e6edf3');c.fillStyle=g;G.rr(c,x-r*1.12,y-r*1.08,r*2.24,r*1.42,r*.18);c.fill();c.shadowColor='transparent';c.strokeStyle=DARK?'#3c4d5e':'#b7c5d2';c.lineWidth=1.2;c.stroke();
 c.fillStyle=DARK?'#f3efe2':'#fffdf5';c.beginPath();c.arc(x,y,r*.96,Math.PI*1.08,Math.PI*1.92);c.lineTo(x,y);c.closePath();c.fill();
 for(let i=-10;i<=10;i++){const a=-Math.PI/2+i/10*Math.PI*.38,big=i%5===0;c.strokeStyle=i===0?'#222':'#555';c.lineWidth=big?1.6:.8;c.beginPath();c.moveTo(x+Math.cos(a)*r*(big?.7:.78),y+Math.sin(a)*r*(big?.7:.78));c.lineTo(x+Math.cos(a)*r*.88,y+Math.sin(a)*r*.88);c.stroke()}
 c.strokeStyle='#d62839';c.lineWidth=2.2;c.beginPath();c.arc(x,y,r*.88,-Math.PI/2+Math.PI*.3,-Math.PI/2+Math.PI*.38);c.stroke();c.strokeStyle='#1769a6';c.beginPath();c.arc(x,y,r*.88,-Math.PI/2-Math.PI*.38,-Math.PI/2-Math.PI*.3);c.stroke();
 const a=-Math.PI/2+Math.max(-1.05,Math.min(1.05,v))*Math.PI*.38;c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=3;c.shadowOffsetY=1.5;c.strokeStyle='#c1121f';c.lineWidth=2;c.beginPath();c.moveTo(x-Math.cos(a)*r*.12,y-Math.sin(a)*r*.12);c.lineTo(x+Math.cos(a)*r*.9,y+Math.sin(a)*r*.9);c.stroke();c.shadowColor='transparent';
 c.fillStyle='#333';c.beginPath();c.arc(x,y,r*.08,0,Math.PI*2);c.fill();c.font=G.font(r*.2,700);c.textAlign='center';c.fillStyle='#333';c.fillText(o.unit||'mV',x,y-r*.36);
 c.font=G.font(r*.15,600);c.fillStyle='#777';c.fillText('−',x-r*.62,y-r*.12);c.fillText('+',x+r*.62,y-r*.12);c.restore()};

/* ---------- Oszilloskop / Prüfgerätebildschirm ---------- */
G.screen=(c,x,y,w,h,o={})=>{c.save();const b=o.bezel??6;
 if(b){c.shadowColor='rgba(0,0,0,.35)';c.shadowBlur=12;c.shadowOffsetY=4;const gb=c.createLinearGradient(0,y,0,y+h);gb.addColorStop(0,'#3b4651');gb.addColorStop(.5,'#1f272f');gb.addColorStop(1,'#141a20');c.fillStyle=gb;G.rr(c,x,y,w,h,12);c.fill();c.shadowColor='transparent';c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;G.rr(c,x+.5,y+.5,w-1,h-1,12);c.stroke()}
 const X=x+b,Y=y+b,W=w-2*b,H=h-2*b;const g=c.createRadialGradient(X+W*.45,Y+H*.4,Math.min(W,H)*.1,X+W/2,Y+H/2,Math.max(W,H)*.75);g.addColorStop(0,'#0b2a1c');g.addColorStop(.7,'#05160e');g.addColorStop(1,'#020a06');c.fillStyle=g;G.rr(c,X,Y,W,H,8);c.fill();
 c.save();G.rr(c,X,Y,W,H,8);c.clip();const nx=o.nx||10,ny=o.ny||(Math.round(nx*H/W)||8);c.strokeStyle=PH.grid;c.lineWidth=1;c.beginPath();for(let i=1;i<nx;i++){c.moveTo(X+W*i/nx,Y);c.lineTo(X+W*i/nx,Y+H)}for(let i=1;i<ny;i++){c.moveTo(X,Y+H*i/ny);c.lineTo(X+W,Y+H*i/ny)}c.stroke();
 if(o.axes!==false){c.strokeStyle=PH.grid2;c.beginPath();c.moveTo(X+W/2,Y);c.lineTo(X+W/2,Y+H);c.moveTo(X,Y+H/2);c.lineTo(X+W,Y+H/2);c.stroke();c.beginPath();for(let i=0;i<=nx*5;i++){const xx=X+W*i/(nx*5);c.moveTo(xx,Y+H/2-3);c.lineTo(xx,Y+H/2+3)}for(let i=0;i<=ny*5;i++){const yy=Y+H*i/(ny*5);c.moveTo(X+W/2-3,yy);c.lineTo(X+W/2+3,yy)}c.stroke()}
 const vg=c.createRadialGradient(X+W/2,Y+H/2,Math.min(W,H)*.35,X+W/2,Y+H/2,Math.max(W,H)*.72);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.45)');c.fillStyle=vg;c.fillRect(X,Y,W,H);c.restore();
 if(o.label){c.font=G.font(11,700,true);c.fillStyle=PH.lbl;c.textAlign='left';c.fillText(o.label,X+8,Y+15)}if(o.right){c.font=G.font(10.5,600,true);c.fillStyle=G.rgba(PH.g,.7);c.textAlign='right';c.fillText(o.right,X+W-8,Y+15)}
 c.restore();return{x:X,y:Y,w:W,h:H,cx:X+W/2,cy:Y+H/2}};
G.glass=(c,S)=>{c.save();G.rr(c,S.x,S.y,S.w,S.h,8);c.clip();const g=c.createLinearGradient(S.x,S.y,S.x+S.w*.6,S.y+S.h);g.addColorStop(0,'rgba(255,255,255,.07)');g.addColorStop(.45,'rgba(255,255,255,.015)');g.addColorStop(.46,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(S.x,S.y,S.w,S.h);
 c.globalAlpha=.05;c.fillStyle='#000';for(let yy=S.y;yy<S.y+S.h;yy+=3)c.fillRect(S.x,yy,S.w,1);c.restore()};
/* Leuchtspur (Phosphor) */
G.trace=(c,pts,col=PH.g,lw=2,o={})=>{if(pts.length<2)return;c.save();c.lineJoin='round';c.lineCap='round';c.globalCompositeOperation='lighter';c.strokeStyle=G.rgba(col,.18);c.lineWidth=lw*4;G.path(c,pts);c.stroke();c.strokeStyle=G.rgba(col,.45);c.lineWidth=lw*2;G.path(c,pts);c.stroke();c.strokeStyle=col;c.lineWidth=lw;c.shadowColor=col;c.shadowBlur=o.blur??6;G.path(c,pts);c.stroke();c.restore()};
/* Nachleuchten: ältere Punkte schwächer */
G.persist=(c,pts,col=PH.g,lw=2)=>{const n=pts.length;if(n<2)return;c.save();c.lineCap='round';c.globalCompositeOperation='lighter';for(let i=1;i<n;i++){const a=Math.pow(i/n,1.6);c.strokeStyle=G.rgba(col,.08+.85*a);c.lineWidth=lw*(.6+.8*a);c.beginPath();c.moveTo(pts[i-1][0],pts[i-1][1]);c.lineTo(pts[i][0],pts[i][1]);c.stroke()}c.restore()};
G.spot=(c,x,y,col=PH.g,r=4)=>{c.save();c.globalCompositeOperation='lighter';const g=c.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,G.rgba(col,.9));g.addColorStop(.25,G.rgba(col,.45));g.addColorStop(1,G.rgba(col,0));c.fillStyle=g;c.beginPath();c.arc(x,y,r*4,0,Math.PI*2);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x,y,r*.55,0,Math.PI*2);c.fill();c.restore()};
G.stext=(c,t,x,y,o={})=>{c.save();c.font=G.font(o.size||11,o.weight||600,o.mono!==false);c.fillStyle=o.col||PH.lbl;c.textAlign=o.align||'left';c.shadowColor=o.col||PH.lbl;c.shadowBlur=4;c.fillText(t,x,y);c.restore()};
G.led=(c,x,y,on,col='#ff3b4a',r=6,lbl)=>{c.save();if(on){c.shadowColor=col;c.shadowBlur=16}const g=c.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);g.addColorStop(0,on?'#fff':'#777');g.addColorStop(.35,on?col:'#3a3a3a');g.addColorStop(1,on?G.mix(col,'#000000',.4):'#1d1d1d');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='rgba(0,0,0,.5)';c.lineWidth=1;c.stroke();
 if(lbl){c.font=G.font(10,700);c.fillStyle=T.mute;c.textAlign='center';c.fillText(lbl,x,y+r+12)}c.restore()};

/* ---------- Diagramm ---------- */
G.nice=(span,n)=>{const r=span/n,p=Math.pow(10,Math.floor(Math.log10(r))),m=r/p;return(m<1.5?1:m<3?2:m<7?5:10)*p};
G.plot=(c,R,xr,yr,o={})=>{const lx=!!o.xlog,ly=!!o.ylog;const fx=v=>lx?Math.log10(v):v,fy=v=>ly?Math.log10(v):v;const X0=fx(xr[0]),X1=fx(xr[1]),Y0=fy(yr[0]),Y1=fy(yr[1]);
 const m={x:v=>R.x+(fx(v)-X0)/(X1-X0)*R.w,y:v=>R.y+R.h-(fy(v)-Y0)/(Y1-Y0)*R.h,ix:px=>{const u=X0+(px-R.x)/R.w*(X1-X0);return lx?Math.pow(10,u):u},iy:py=>{const u=Y0+(R.y+R.h-py)/R.h*(Y1-Y0);return ly?Math.pow(10,u):u},R};
 c.save();if(o.bg!==false){c.fillStyle=o.bgc||T.panel;G.rr(c,R.x,R.y,R.w,R.h,6);c.fill()}
 const ticks=(a,b,log,n)=>{const t=[];if(log){for(let e=Math.floor(Math.log10(a));e<=Math.ceil(Math.log10(b));e++){[1,2,5].forEach(k=>{const v=k*Math.pow(10,e);if(v>=a*0.999&&v<=b*1.001)t.push([v,k===1])})}return t}const s=G.nice(b-a,n);for(let v=Math.ceil(a/s-1e-9)*s;v<=b+s*1e-6;v+=s)t.push([Math.abs(v)<s*1e-9?0:v,true]);return t};
 const tx=o.xt||ticks(xr[0],xr[1],lx,o.nx||6),ty=o.yt||ticks(yr[0],yr[1],ly,o.ny||5);
 if(o.minor!==false){c.strokeStyle=T.grid2;c.lineWidth=1;c.beginPath();if(!lx&&tx.length>1){const s=(tx[1][0]-tx[0][0])/2;for(let v=tx[0][0]-s;v<=xr[1];v+=s){if(v<xr[0])continue;const X=m.x(v);c.moveTo(X,R.y);c.lineTo(X,R.y+R.h)}}if(!ly&&ty.length>1){const s=(ty[1][0]-ty[0][0])/2;for(let v=ty[0][0]-s;v<=yr[1];v+=s){if(v<yr[0])continue;const Y=m.y(v);c.moveTo(R.x,Y);c.lineTo(R.x+R.w,Y)}}c.stroke()}
 c.strokeStyle=T.grid;c.lineWidth=1;c.beginPath();tx.forEach(([v])=>{const X=Math.round(m.x(v))+.5;c.moveTo(X,R.y);c.lineTo(X,R.y+R.h)});ty.forEach(([v])=>{const Y=Math.round(m.y(v))+.5;c.moveTo(R.x,Y);c.lineTo(R.x+R.w,Y)});c.stroke();
 if(o.zero&&yr[0]<0&&yr[1]>0){c.strokeStyle=T.axis;c.lineWidth=1.2;c.beginPath();c.moveTo(R.x,m.y(0));c.lineTo(R.x+R.w,m.y(0));c.stroke()}
 c.strokeStyle=T.axis;c.lineWidth=1.2;c.beginPath();c.moveTo(R.x,R.y);c.lineTo(R.x,R.y+R.h);c.lineTo(R.x+R.w,R.y+R.h);c.stroke();
 c.font=G.font(10.5,500);c.fillStyle=T.mute;if(!o.noxl){c.textAlign='center';tx.forEach(([v,maj])=>{if(maj||!lx)c.fillText(o.xf?o.xf(v):G.fmtAx(v),m.x(v),R.y+R.h+14)})}
 if(!o.noyl){c.textAlign='right';ty.forEach(([v,maj])=>{if(maj||!ly)c.fillText(o.yf?o.yf(v):G.fmtAx(v),R.x-6,m.y(v)+3.5)})}
 c.font=G.font(11.5,650);c.fillStyle=T.ink2;if(o.xl){c.textAlign='center';c.fillText(o.xl,R.x+R.w/2,R.y+R.h+(o.noxl?16:31))}if(o.yl){c.save();c.translate(R.x-(o.yo||38),R.y+R.h/2);c.rotate(-Math.PI/2);c.textAlign='center';c.fillText(o.yl,0,0);c.restore()}
 if(o.title)G.text(c,o.title,R.x+8,R.y+16,{size:11.5,weight:700,col:T.ink2,halo:true});c.restore();return m};
G.fmtAx=v=>{const a=Math.abs(v);if(a>=1e6)return(v/1e6).toLocaleString('de-DE',{maximumFractionDigits:1})+' M';if(a>=1e4)return(v/1e3).toLocaleString('de-DE',{maximumFractionDigits:1})+' k';return v.toLocaleString('de-DE',{maximumFractionDigits:a<1?2:a<10?1:0})};
G.vline=(c,m,x,col,o={})=>{G.line(c,[[m.x(x),m.R.y],[m.x(x),m.R.y+m.R.h]],col,o.lw||1.2,{dash:o.dash||[4,4]})};
G.hline=(c,m,y,col,o={})=>{G.line(c,[[m.R.x,m.y(y)],[m.R.x+m.R.w,m.y(y)]],col,o.lw||1.2,{dash:o.dash||[4,4]})};
G.bar=(c,x,y,w,h,col,o={})=>{c.save();const g=c.createLinearGradient(x,0,x+w,0);g.addColorStop(0,G.mix(col.length===7?col:'#888888','#ffffff',.18));g.addColorStop(1,col);c.fillStyle=g;if(o.shadow!==false){c.shadowColor=G.rgba(col.length===7?col:'#000000',.35);c.shadowBlur=8;c.shadowOffsetY=2}G.rr(c,x,y,w,h,o.r??5);c.fill();c.restore()};
G.meterBar=(c,x,y,w,h,v,col,lbl,val)=>{c.save();c.fillStyle=DARK?'#1d2a38':'#e6edf3';G.rr(c,x,y,w,h,h/2);c.fill();const vw=Math.max(h,w*Math.max(0,Math.min(1,v)));G.bar(c,x,y,vw,h,col,{r:h/2});
 if(lbl)G.text(c,lbl,x,y-6,{size:11.5,weight:650,col:T.ink2});if(val)G.text(c,val,x+w,y-6,{size:11.5,weight:750,col,align:'right'});c.restore()};

/* ---------- Feldlinien: Flussfunktion koaxialer Ringströme ---------- */
G.ellipKE=m=>{if(m>=1)m=1-1e-12;let a=1,b=Math.sqrt(1-m),cc=Math.sqrt(m),sum=m/2,p=1;for(let i=0;i<24&&cc>1e-13;i++){const an=(a+b)/2,bn=Math.sqrt(a*b);cc=(a-b)/2;a=an;b=bn;p*=2;sum+=p*cc*cc/2}const K=Math.PI/(2*a);return[K,K*(1-sum)]};
/* ψ(r,z) eines Ringstroms Radius a bei z0: r·A_φ */
G.psiLoop=(r,z,a,z0)=>{r=Math.abs(r);if(r<1e-9)return 0;const dz=z-z0,d=(a+r)*(a+r)+dz*dz,m=4*a*r/d;const[K,E]=G.ellipKE(m);const k=Math.sqrt(m);return r*Math.sqrt(a/r)/k*((1-m/2)*K-E)/Math.PI};
/* loops: [[a, z0, I], ...]; Gitter über r∈[-Rm,Rm], z∈[z0,z1]; liefert Konturlinien als Polylinien in Weltkoordinaten */
G._fcache=new Map();
G.fieldLines=(loops,box,o={})=>{const key=o.key?o.key+'|'+box.join(','):null;if(key&&G._fcache.has(key))return G._fcache.get(key);
 const nx=o.nx||96,ny=o.ny||72,[x0,x1,y0,y1]=box,dx=(x1-x0)/(nx-1),dy=(y1-y0)/(ny-1);const F=new Float64Array(nx*ny);let mx=0;
 for(let j=0;j<ny;j++){const z=y0+j*dy;for(let i=0;i<nx;i++){const r=x0+i*dx;let s=0;for(const L of loops)s+=L[2]*G.psiLoop(r,z,L[0],L[1]);if(o.mod)s=o.mod(r,z,s);F[j*nx+i]=s;if(Math.abs(s)>mx&&Math.abs(r)<=(o.rmax??Infinity))mx=Math.abs(s)}}
 const ref=o.ref??mx,levels=o.levels||Array.from({length:o.n||9},(_,k)=>ref*(k+.5)/(o.n||9)*(o.span||1));
 const lines=[];levels.forEach(L=>{lines.push(...G.contour(F,nx,ny,L).map(pl=>pl.map(([i,j])=>[x0+i*dx,y0+j*dy])));if(o.both)lines.push(...G.contour(F,nx,ny,-L).map(pl=>pl.map(([i,j])=>[x0+i*dx,y0+j*dy])))});
 const res={lines,max:mx,F,nx,ny,box};if(key){if(G._fcache.size>60)G._fcache.clear();G._fcache.set(key,res)}return res};
/* Marching Squares mit Verkettung zu Polylinien */
G.contour=(F,nx,ny,L)=>{const segs=[];const ep=new Map();const eid=(i,j,v)=>((j*nx+i)<<1)|v;
 const pt=(i,j,v)=>{if(!v){const a=F[j*nx+i],b=F[j*nx+i+1];const t=(L-a)/(b-a);return[i+t,j]}const a=F[j*nx+i],b=F[(j+1)*nx+i];const t=(L-a)/(b-a);return[i,j+t]};
 for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const a=F[j*nx+i]>L,b=F[j*nx+i+1]>L,c=F[(j+1)*nx+i+1]>L,d=F[(j+1)*nx+i]>L;const idx=(a?1:0)|(b?2:0)|(c?4:0)|(d?8:0);if(idx===0||idx===15)continue;
  const E=[eid(i,j,0),eid(i+1,j,1),eid(i,j+1,0),eid(i,j,1)];const P=[()=>pt(i,j,0),()=>pt(i+1,j,1),()=>pt(i,j+1,0),()=>pt(i,j,1)];
  const add=(p,q)=>{const s=segs.length;segs.push([E[p],E[q],P[p](),P[q]()]);[E[p],E[q]].forEach(e=>{if(!ep.has(e))ep.set(e,[]);ep.get(e).push(s)})};
  switch(idx){case 1:case 14:add(3,0);break;case 2:case 13:add(0,1);break;case 3:case 12:add(3,1);break;case 4:case 11:add(1,2);break;case 6:case 9:add(0,2);break;case 7:case 8:add(3,2);break;case 5:add(3,0);add(1,2);break;case 10:add(0,1);add(2,3);break}}
 const used=new Uint8Array(segs.length),out=[];
 for(let s=0;s<segs.length;s++){if(used[s])continue;used[s]=1;const pl=[segs[s][2],segs[s][3]];
  for(const dir of[1,0]){let e=dir?segs[s][1]:segs[s][0];for(;;){const cand=(ep.get(e)||[]).find(k=>!used[k]);if(cand==null)break;used[cand]=1;const S=segs[cand];const fwd=S[0]===e;const np=fwd?S[3]:S[2];e=fwd?S[1]:S[0];if(dir)pl.push(np);else pl.unshift(np)}}
  out.push(pl)}return out};
/* Feldlinien zeichnen; map: Welt->Pixel; o.flow: Phase für wandernde Striche */
G.drawField=(c,res,map,col,o={})=>{c.save();c.lineJoin='round';c.lineCap='round';res.lines.forEach((pl,k)=>{if(pl.length<3)return;const P=pl.map(p=>map(p[0],p[1]));
 c.strokeStyle=G.rgba(col,o.alpha??.55);c.lineWidth=o.lw||1.4;if(o.clip&&!o.clip(pl))return;G.path(c,P);c.stroke();
 if(o.flow!=null){c.setLineDash([3,14]);c.lineDashOffset=-o.flow*17;c.strokeStyle=G.rgba(o.flowCol||'#ffffff',o.flowA??.85);c.lineWidth=(o.lw||1.4)+.9;G.path(c,P);c.stroke();c.setLineDash([])}
 if(o.arrows){const i=Math.floor(P.length*(o.arrowAt??.5));if(i>0&&i<P.length-1){const a=P[i-1],b=P[i+1];const dir=o.arrowDir?o.arrowDir(pl,i):1;const ang=Math.atan2((b[1]-a[1])*dir,(b[0]-a[0])*dir);const x=P[i][0],y=P[i][1],hs=6;c.fillStyle=G.rgba(col,Math.min(1,(o.alpha??.55)+.3));c.beginPath();c.moveTo(x+Math.cos(ang)*hs,y+Math.sin(ang)*hs);c.lineTo(x+Math.cos(ang+2.5)*hs,y+Math.sin(ang+2.5)*hs);c.lineTo(x+Math.cos(ang-2.5)*hs,y+Math.sin(ang-2.5)*hs);c.closePath();c.fill()}}});c.restore()};

/* ---------- Wirbelströme auf einer Oberfläche (perspektivische Ringe) ---------- */
G.eddies=(c,cx,cy,rx,ry,o={})=>{const n=o.n||4,I=o.I??1,t=o.t||0,col=o.col||T.eddy;c.save();c.lineCap='round';
 for(let k=0;k<n;k++){const s=1-k*.2,a=Math.max(0,I)*(1-k*.17)*(o.att?o.att(k):1);if(a<.02)continue;const r1=rx*(.45+.55*s)*(o.scale||1),r2=ry*(.45+.55*s)*(o.scale||1),yy=cy+(o.depth||0)*k;
  c.strokeStyle=G.rgba(col,.15+.6*a);c.lineWidth=1.5+2.5*a;if(o.glow){c.shadowColor=col;c.shadowBlur=8*a}
  if(o.crack!=null){const cxk=o.crack,gap=o.gap||8;const ang=Math.acos(Math.max(-1,Math.min(1,(cxk-cx)/r1)));if(Math.abs(cxk-cx)<r1){
    c.beginPath();c.ellipse(cx,yy,r1,r2,0,ang+gap/r1,2*Math.PI-ang-gap/r1);c.stroke();
    // Umleitung um Rissspitze: kleine Bögen
    const xL=cxk-gap*.6,yT=yy-r2*Math.sin(ang),yB=yy+r2*Math.sin(ang);c.beginPath();c.moveTo(cx+r1*Math.cos(ang+gap/r1),yy-r2*Math.sin(ang+gap/r1));c.quadraticCurveTo(xL,yT,xL,(yT+yB)/2);c.quadraticCurveTo(xL,yB,cx+r1*Math.cos(ang+gap/r1),yy+r2*Math.sin(ang+gap/r1));c.stroke();continue}}
  c.beginPath();c.ellipse(cx,yy,r1,r2,0,0,Math.PI*2);c.stroke();c.shadowBlur=0;
  const m=Math.max(2,Math.round(3*s));for(let q=0;q<m;q++){const ph=(o.dir||1)*t*1.4+q/m*Math.PI*2+k*.6;const px=cx+Math.cos(ph)*r1,py=yy+Math.sin(ph)*r2,tx=-Math.sin(ph)*r1*(o.dir||1),ty=Math.cos(ph)*r2*(o.dir||1),L=Math.hypot(tx,ty)||1;
   const ux=tx/L,uy=ty/L,hs=4+3*a;c.fillStyle=G.rgba(col,.4+.6*a);c.beginPath();c.moveTo(px+ux*hs,py+uy*hs);c.lineTo(px-ux*hs*.6-uy*hs*.6,py-uy*hs*.6+ux*hs*.6);c.lineTo(px-ux*hs*.6+uy*hs*.6,py-uy*hs*.6-ux*hs*.6);c.closePath();c.fill()}}
 c.restore()};

/* ---------- Rohr (Zylinder) waagerecht ---------- */
G.tube=(c,x0,x1,cy,r,mat='steel',o={})=>{const M=MAT[mat]||MAT.steel;c.save();const g=c.createLinearGradient(0,cy-r,0,cy+r);g.addColorStop(0,M[2]);g.addColorStop(.18,M[0]);g.addColorStop(.32,G.mix(M[0],'#ffffff',.5));g.addColorStop(.5,M[1]);g.addColorStop(1,G.mix(M[2],'#000000',.3));
 c.fillStyle=g;c.fillRect(x0,cy-r,x1-x0,2*r);c.globalAlpha=.6;c.fillStyle=G.pattern(c,mat);c.fillRect(x0,cy-r,x1-x0,2*r);c.globalAlpha=1;
 if(o.endL!==false){c.fillStyle=M[2];c.beginPath();c.ellipse(x0,cy,r*.28,r,0,0,Math.PI*2);c.fill();if(o.hollow){c.fillStyle='#1b2229';c.beginPath();c.ellipse(x0,cy,r*.2,r*.72,0,0,Math.PI*2);c.fill()}}
 c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=1;c.beginPath();c.moveTo(x0,cy-r);c.lineTo(x1,cy-r);c.moveTo(x0,cy+r);c.lineTo(x1,cy+r);c.stroke();c.restore()};

/* ---------- Kleinigkeiten ---------- */
G.badge=(c,t,x,y,col,o={})=>G.label(c,t,x,y,{bg:col,col:'#fff',border:false,size:o.size||11,weight:750,align:o.align||'left',shadow:true});
G.knob=(c,x,y,r,v,lbl)=>{c.save();c.shadowColor='rgba(0,0,0,.4)';c.shadowBlur=6;c.shadowOffsetY=2;const g=c.createRadialGradient(x-r*.3,y-r*.4,1,x,y,r);g.addColorStop(0,'#5d6975');g.addColorStop(1,'#1c232a');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();c.shadowColor='transparent';
 const a=-Math.PI*1.25+v*Math.PI*1.5;c.strokeStyle='#e9f1f7';c.lineWidth=2;c.beginPath();c.moveTo(x+Math.cos(a)*r*.3,y+Math.sin(a)*r*.3);c.lineTo(x+Math.cos(a)*r*.85,y+Math.sin(a)*r*.85);c.stroke();if(lbl){c.font=G.font(9.5,700);c.fillStyle='#9fb2c4';c.textAlign='center';c.fillText(lbl,x,y+r+12)}c.restore()};
/* Dokument-Symbol */
G.doc=(c,x,y,w,h,col,o={})=>{c.save();for(let k=(o.stack||0);k>=0;k--){const ox=k*4,oy=-k*4;c.shadowColor='rgba(0,0,0,.3)';c.shadowBlur=8;c.shadowOffsetY=3;c.fillStyle=k?'#e9eef3':'#ffffff';c.beginPath();c.moveTo(x+ox,y+oy);c.lineTo(x+ox+w-w*.22,y+oy);c.lineTo(x+ox+w,y+oy+w*.22);c.lineTo(x+ox+w,y+oy+h);c.lineTo(x+ox,y+oy+h);c.closePath();c.fill()}
 c.shadowColor='transparent';c.fillStyle='#d4dde6';c.beginPath();c.moveTo(x+w-w*.22,y);c.lineTo(x+w-w*.22,y+w*.22);c.lineTo(x+w,y+w*.22);c.closePath();c.fill();c.fillStyle=col;c.fillRect(x,y,w*.1,h);
 const n=o.lines??6;for(let i=0;i<n;i++){c.fillStyle=i===0?col:'#c3ced8';c.fillRect(x+w*.2,y+h*.2+i*h*.11,(i===0?.5:.62-((i*37)%5)*.05)*w,Math.max(2,h*.035))}c.restore()};
G.stamp=(c,x,y,t,col,a=1,rot=-.18)=>{c.save();c.globalAlpha=a;c.translate(x,y);c.rotate(rot);c.font=G.font(14,850);const w=c.measureText(t).width+18;c.strokeStyle=col;c.lineWidth=2.5;G.rr(c,-w/2,-14,w,28,6);c.stroke();c.fillStyle=col;c.textAlign='center';c.textBaseline='middle';c.fillText(t,0,1);c.restore()};
G.person=(c,x,y,s,col,lvl)=>{c.save();c.fillStyle=col;c.beginPath();c.arc(x,y-s*.55,s*.28,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(x-s*.45,y+s*.35);c.quadraticCurveTo(x-s*.45,y-s*.18,x,y-s*.18);c.quadraticCurveTo(x+s*.45,y-s*.18,x+s*.45,y+s*.35);c.closePath();c.fill();
 if(lvl){c.fillStyle='#fff';c.beginPath();c.arc(x+s*.36,y-s*.62,s*.2,0,Math.PI*2);c.fill();c.fillStyle=col;c.font=G.font(s*.26,850);c.textAlign='center';c.textBaseline='middle';c.fillText(lvl,x+s*.36,y-s*.6)}c.restore()};
