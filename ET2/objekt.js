"use strict";
/* =====================================================================
   V5 Objektkunde – realistische Bauteil- und Fehlerdarstellungen
   Fotoähnliche Renderings (Werkstoffoberflächen, Licht, Bearbeitungs-
   spuren) mit naturgetreuen Fehlermorphologien. Beschriftung als SVG.
   ===================================================================== */
const OB=(()=>{
 let sd=1;const S=s=>{sd=Math.abs(Math.floor(s))%2147483646+1},R=()=>{sd=(sd*16807)%2147483647;return(sd-1)/2147483646},RR=(a,b)=>a+(b-a)*R();
 /* ---------- Rauschkacheln ---------- */
 const tiles={};
 const tile=(kind)=>{if(tiles[kind])return tiles[kind];const n=256,cv=document.createElement('canvas');cv.width=cv.height=n;const x=cv.getContext('2d');S(kind.length*7919+31);
  if(kind==='grain'||kind==='sand'||kind==='film'){const id=x.createImageData(n,n);for(let i=0;i<n*n;i++){let v=128+(R()-.5)*(kind==='sand'?70:kind==='film'?70:60);if(kind==='sand'&&R()<.025)v-=RR(20,45);id.data[i*4]=id.data[i*4+1]=id.data[i*4+2]=v;id.data[i*4+3]=255}x.putImageData(id,0,0);if(kind==='sand'){x.globalAlpha=.5;x.filter='blur(.6px)';x.drawImage(cv,0,0);x.filter='none'}}
  else{x.fillStyle='#808080';x.fillRect(0,0,n,n);const L=kind==='turnH'||kind==='grindH'||kind==='rollH';for(let i=0;i<(kind.startsWith('grind')?900:kind.startsWith('roll')?260:420);i++){const p=R()*n,l=kind.startsWith('grind')?RR(30,n):n,o=R()*n;x.strokeStyle=(R()<.5?'rgba(255,255,255,':'rgba(0,0,0,')+RR(.04,kind.startsWith('roll')?.18:.12)+')';x.lineWidth=RR(.4,kind.startsWith('roll')?2.4:1.1);x.beginPath();if(L){x.moveTo(o,p);x.lineTo(o+l,p+RR(-.6,.6))}else{x.moveTo(p,o);x.lineTo(p+RR(-.6,.6),o+l)}x.stroke();if(L){x.beginPath();x.moveTo(o-n,p);x.lineTo(o-n+l,p);x.stroke()}else{x.beginPath();x.moveTo(p,o-n);x.lineTo(p,o-n+l);x.stroke()}}}
  return tiles[kind]=cv};
 const texture=(c,kind,a=.35,op='overlay')=>{c.save();c.globalAlpha=a;c.globalCompositeOperation=op;c.fillStyle=c.createPattern(tile(kind),'repeat');c.fillRect(-4000,-4000,8000,8000);c.restore()};
 /* ---------- Werkstofffarben ---------- */
 const PAL={machined:['#4b535b','#9aa5af','#eef2f5','#a7b1ba','#3c434a'],ground:['#5c656d','#bcc6cd','#fbfdfe','#c2cbd2','#4d555d'],forged:['#3a434b','#626d77','#8e99a3','#58636d','#2c343b'],
  cast:['#3d3e3f','#6c6d6c','#8f8f8c','#626261','#323334'],rolled:['#3a4148','#6f7881','#a9b2ba','#68717a','#2f353b'],scale:['#2a2f35','#454c54','#5f6871','#3b4249','#22272c'],bright:['#6e7881','#cfd7dd','#ffffff','#d2d9df','#5d666f'],
  oxide:['#4a3426','#7a5a40','#9a7a5a','#6a4c34','#3a281c'],weld:['#5a5246','#a39a86','#e0d8c2','#9a917c','#4a4339']};
 const cylGrad=(c,y0,y1,pal,ang)=>{const g=ang==='v'?c.createLinearGradient(y0,0,y1,0):c.createLinearGradient(0,y0,0,y1);const P=PAL[pal]||pal;[0,.24,.42,.7,1].forEach((o,i)=>g.addColorStop(o,P[i]));return g};
 const flatGrad=(c,x0,y0,x1,y1,pal,k=0)=>{const g=c.createLinearGradient(x0,y0,x1,y1);const P=PAL[pal]||pal;g.addColorStop(0,P[2-k>0?2-k:1]);g.addColorStop(.6,P[1]);g.addColorStop(1,P[3]);return g};
 /* Schatten auf dem Untergrund */
 const shadow=(c,cx,cy,rx,ry,a=.45)=>{c.save();const g=c.createRadialGradient(cx,cy,0,cx,cy,rx);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(1,'rgba(0,0,0,0)');c.translate(cx,cy);c.scale(1,ry/rx);c.translate(-cx,-cy);c.fillStyle=g;c.beginPath();c.arc(cx,cy,rx,0,TAU);c.fill();c.restore()};
 /* Fotostudio-Hintergrund */
 const studio=(c,w,h,o={})=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,o.top||'#dfe3e7');g.addColorStop(.62,o.mid||'#c9cfd5');g.addColorStop(1,o.bot||'#aeb6be');c.fillStyle=g;c.fillRect(0,0,w,h);const v=c.createRadialGradient(w*.5,h*.4,h*.2,w*.5,h*.5,w*.75);v.addColorStop(0,'rgba(255,255,255,.18)');v.addColorStop(1,'rgba(0,0,0,.22)');c.fillStyle=v;c.fillRect(0,0,w,h);texture(c,'grain',.06,'overlay')};
 /* ---------- Fehlermorphologien ---------- */
 const cpath=(x0,y0,x1,y1,rough=.18,lev=6)=>{let P=[[x0,y0],[x1,y1]];for(let k=0;k<lev;k++){const N=[P[0]];for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],L=Math.hypot(b[0]-a[0],b[1]-a[1]),d=(R()-.5)*L*rough*2;const nx=-(b[1]-a[1])/(L||1),ny=(b[0]-a[0])/(L||1);N.push([(a[0]+b[0])/2+nx*d,(a[1]+b[1])/2+ny*d],b)}P=N}return P};
 const strokeTaper=(c,P,w,col,o={})=>{const n=P.length;c.lineCap='round';c.lineJoin='round';for(let i=1;i<n;i++){const t=i/n,tap=o.oneEnd?Math.pow(1-t,.6):Math.sin(Math.PI*Math.min(1,Math.max(0,t*1.02)))**.55;c.strokeStyle=col;c.lineWidth=Math.max(.35,w*(.25+.75*tap));c.beginPath();c.moveTo(P[i-1][0],P[i-1][1]);c.lineTo(P[i][0],P[i][1]);c.stroke()}};
 /* Riss: dunkler Spalt, helle Kante (Licht), optional Verästelung, Oxidhof */
 const crack=(c,x0,y0,x1,y1,o={})=>{S(o.seed||((x0*13+y0*7+x1*3)|0));const P=cpath(x0,y0,x1,y1,o.rough??.16,o.lev??6),w=o.w??1.8;c.save();
  if(o.oxide){c.globalAlpha=.35;strokeTaper(c,P,w*5,'rgba(120,70,30,.6)',o);c.globalAlpha=1}
  if(o.uv){c.shadowColor='#c8ff00';c.shadowBlur=w*6;strokeTaper(c,P,w*2.6,'rgba(214,255,60,.9)',o);c.shadowBlur=0;strokeTaper(c,P,w*1.1,'#f6ffd0',o);c.restore();return P}
  c.translate(.7,.8);strokeTaper(c,P,w*.9,'rgba(255,255,255,.55)',o);c.translate(-.7,-.8);strokeTaper(c,P,w,o.col||'#0a0c0e',o);
  if(o.branch){const nb=o.branch===true?3:o.branch;for(let k=0;k<nb;k++){const i=Math.floor(RR(.2,.8)*P.length),p=P[i],q=P[Math.min(P.length-1,i+2)],a=Math.atan2(q[1]-p[1],q[0]-p[0])+(R()<.5?-1:1)*RR(.5,1.1),L=Math.hypot(x1-x0,y1-y0)*RR(.12,.3);const B=cpath(p[0],p[1],p[0]+Math.cos(a)*L,p[1]+Math.sin(a)*L,.2,4);strokeTaper(c,B,w*.55,o.col||'#0a0c0e',{oneEnd:true})}}
  c.restore();return P};
 /* Riss als Magnetpulveranzeige unter UV */
 const uvLine=(c,P,w=2)=>{c.save();c.shadowColor='#b8ff00';c.shadowBlur=w*7;strokeTaper(c,P,w*2.4,'rgba(200,255,40,.85)',{});c.shadowBlur=0;strokeTaper(c,P,w*.9,'#f4ffc8',{});S(P.length*17);for(let i=0;i<P.length;i+=2){c.fillStyle='rgba(220,255,90,'+RR(.3,.8)+')';c.fillRect(P[i][0]+RR(-w*2,w*2),P[i][1]+RR(-w*2,w*2),1.2,1.2)}c.restore()};
 /* Zahnkranzprofil (Kopf, Flanken, Fuß) */
 const teeth=(c,cx,cy,rf,rk,n,a0=0,a1=TAU)=>{const p=TAU/n;let first=true;for(let a=a0;a<=a1+1e-6;a+=p){const pts=[[a-p*.5,rf],[a-p*.3,rf],[a-p*.2,rk-(rk-rf)*.12],[a-p*.13,rk],[a+p*.13,rk],[a+p*.2,rk-(rk-rf)*.12],[a+p*.3,rf]];pts.forEach(([b,r])=>{const x=cx+Math.cos(b)*r,y=cy+Math.sin(b)*r;if(first){c.moveTo(x,y);first=false}else c.lineTo(x,y)})}};
 /* Lunker im Schnitt: zerklüfteter Hohlraum mit Dendritenrand */
 const cavity=(c,cx,cy,r,seed=3)=>{S(seed);c.save();c.beginPath();const n=34;for(let i=0;i<=n;i++){const a=i/n*TAU,rr=r*(.55+.45*R())*(i%2?.8:1);i?c.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.8):c.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr*.8)}c.closePath();const g=c.createRadialGradient(cx-r*.2,cy-r*.25,1,cx,cy,r);g.addColorStop(0,'#050607');g.addColorStop(.75,'#16191c');g.addColorStop(1,'#2a2e33');c.fillStyle=g;c.fill();c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1;c.stroke();c.restore();shrink(c,cx,cy,r*1.15,{seed:seed+1,n:22,s:.45,blur:.4,col:'rgba(18,18,18,'})};
 /* Pore: kugeliger Hohlraum */
 const pore=(c,x,y,r)=>{const g=c.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#0b0c0d');g.addColorStop(.7,'#1d2024');g.addColorStop(1,'rgba(40,44,48,.6)');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=Math.max(.6,r*.18);c.beginPath();c.arc(x,y,r*.92,.3*Math.PI,.95*Math.PI);c.stroke()};
 const pores=(c,cx,cy,rx,ry,n,rmax,seed=5)=>{S(seed);for(let i=0;i<n;i++){const a=R()*TAU,d=Math.sqrt(R());pore(c,cx+Math.cos(a)*rx*d,cy+Math.sin(a)*ry*d,RR(rmax*.3,rmax))}};
 /* Lunker: dendritischer Schwindungshohlraum */
 const shrink=(c,cx,cy,r,o={})=>{S(o.seed||77);c.save();c.filter='blur('+(o.blur??.5)+'px)';const col=o.col||'rgba(12,12,12,';for(let b=0;b<(o.n||26);b++){let x=cx+RR(-r*.4,r*.4),y=cy+RR(-r*.4,r*.4),a=R()*TAU;c.beginPath();c.moveTo(x,y);const L=RR(.5,1)*r;let w=RR(1.5,4)*(o.s||1);for(let k=0;k<14;k++){a+=RR(-.7,.7);x+=Math.cos(a)*L/14;y+=Math.sin(a)*L/14*(o.flat||1);c.lineTo(x,y)}c.strokeStyle=col+RR(.45,.9)+')';c.lineWidth=w;c.lineCap='round';c.stroke()}
  const g=c.createRadialGradient(cx,cy,0,cx,cy,r*.55);g.addColorStop(0,col+'.85)');g.addColorStop(1,col+'0)');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,r*.6,r*.6*(o.flat||1),0,0,TAU);c.fill();c.restore()};
 /* Schlacken-/Seigerungszeile: perlschnurartige dunkle Stränge */
 const stringer=(c,x0,y0,x1,y1,o={})=>{S(o.seed||(x0*3+y1)|0);const n=o.n||18;for(let i=0;i<n;i++){const t=R(),x=x0+(x1-x0)*t,y=y0+(y1-y0)*t+RR(-1.5,1.5),L=RR(4,14)*(o.s||1);c.strokeStyle=o.col||'rgba(40,30,20,'+RR(.45,.85)+')';c.lineWidth=RR(.8,2.2)*(o.s||1);c.lineCap='round';const a=Math.atan2(y1-y0,x1-x0);c.beginPath();c.moveTo(x-Math.cos(a)*L/2,y-Math.sin(a)*L/2);c.lineTo(x+Math.cos(a)*L/2,y+Math.sin(a)*L/2);c.stroke()}};
 /* Falte / Überwalzung: überlappende Werkstoffzunge */
 const lap=(c,P,o={})=>{c.save();c.lineCap='round';c.lineJoin='round';const path=()=>{c.beginPath();P.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]))};c.translate(0,2.2);path();c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=(o.w||2)*1.4;c.stroke();c.translate(0,-2.2);path();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=(o.w||2)*3.2;c.filter='blur(1.2px)';c.stroke();c.filter='none';path();c.strokeStyle='#0d0f11';c.lineWidth=o.w||2;c.stroke();c.restore()};
 const curve=(x0,y0,x1,y1,bend,n=24)=>{const P=[];for(let i=0;i<=n;i++){const t=i/n;P.push([x0+(x1-x0)*t-(y1-y0)*bend*Math.sin(Math.PI*t),y0+(y1-y0)*t+(x1-x0)*bend*Math.sin(Math.PI*t)])}return P};
 /* Schleifrisse: Netz kurzer Risse quer zur Schleifrichtung */
 const grindNet=(c,cx,cy,rx,ry,o={})=>{S(o.seed||91);const n=o.n||26,ang=o.ang??Math.PI/2;for(let i=0;i<n;i++){const x=cx+RR(-rx,rx),y=cy+RR(-ry,ry),L=RR(5,13)*(o.s||1),a=ang+RR(-.35,.35);crack(c,x-Math.cos(a)*L/2,y-Math.sin(a)*L/2,x+Math.cos(a)*L/2,y+Math.sin(a)*L/2,{w:RR(.6,1.1)*(o.s||1),seed:i*31+7,rough:.25,lev:4,branch:R()<.35?1:0,uv:o.uv});if(R()<.4){const b=a+Math.PI/2+RR(-.4,.4),l2=L*.6;crack(c,x,y,x+Math.cos(b)*l2,y+Math.sin(b)*l2,{w:.6*(o.s||1),seed:i*17+3,rough:.25,lev:3,uv:o.uv})}}};
 /* Thermoschock: polygonales Rissnetz */
 const thermoNet=(c,cx,cy,rx,ry,o={})=>{S(o.seed||55);const cell=o.cell||14,pts=[];for(let y=-ry;y<=ry;y+=cell)for(let x=-rx;x<=rx;x+=cell){if((x*x)/(rx*rx)+(y*y)/(ry*ry)>1)continue;pts.push([cx+x+RR(-cell*.35,cell*.35),cy+y+RR(-cell*.35,cell*.35)])}
  pts.forEach((p,i)=>{pts.forEach((q,j)=>{if(j<=i)return;const d=Math.hypot(p[0]-q[0],p[1]-q[1]);if(d<cell*1.35&&R()<(o.p??.62)){const dir=Math.abs(Math.atan2(q[1]-p[1],q[0]-p[0]));const pref=o.pref==='h'?Math.abs(Math.cos(dir)):o.pref==='v'?Math.abs(Math.sin(dir)):1;if(R()<.35+.65*pref)crack(c,p[0],p[1],q[0],q[1],{w:(o.w||.9)*RR(.6,1.2),seed:i*97+j,rough:.22,lev:4,oxide:o.oxide,uv:o.uv})}})})};
 /* Rastlinien (Dauerbruch) auf Bruchfläche */
 const beach=(c,ox,oy,r0,r1,a0,a1,n=7)=>{for(let k=1;k<=n;k++){const r=r0+(r1-r0)*k/n;c.strokeStyle='rgba(30,30,30,'+(.35-k*.02)+')';c.lineWidth=1.1;c.beginPath();c.arc(ox,oy,r,a0,a1);c.stroke();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=.6;c.beginPath();c.arc(ox,oy,r+1.2,a0,a1);c.stroke()}};
 /* ---------- Bauteil-Grundkörper ---------- */
 const cylH=(c,x0,x1,cy,r,pal,o={})=>{c.save();c.beginPath();c.rect(x0,cy-r,x1-x0,2*r);c.clip();c.fillStyle=cylGrad(c,cy-r,cy+r,pal);c.fillRect(x0,cy-r,x1-x0,2*r);texture(c,o.tex||'turnV',o.ta??.45);if(o.tex2)texture(c,o.tex2,.25);c.restore();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.strokeRect(x0+.5,cy-r+.5,x1-x0-1,2*r-1)};
 const endFace=(c,x,cy,r,pal,o={})=>{c.save();c.beginPath();c.ellipse(x,cy,r*.32,r,0,0,TAU);c.clip();const g=c.createRadialGradient(x-r*.1,cy-r*.3,r*.1,x,cy,r);const P=PAL[pal];g.addColorStop(0,P[2]);g.addColorStop(1,P[3]);c.fillStyle=g;c.fillRect(x-r,cy-r,2*r,2*r);texture(c,'grain',.4);c.restore();c.strokeStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(x,cy,r*.32,r,0,0,TAU);c.stroke()};
 const fillShape=(c,pathFn,box,pal,o={})=>{c.save();pathFn(c);c.clip();c.fillStyle=o.grad||flatGrad(c,box.x,box.y,box.x+box.w*.3,box.y+box.h,pal);c.fillRect(box.x-2,box.y-2,box.w+4,box.h+4);texture(c,o.tex||'grain',o.ta??.4);if(o.tex2)texture(c,o.tex2,o.ta2??.3);if(o.after)o.after(c);c.restore();if(o.edge!==false){pathFn(c);c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=1.1;c.stroke()}};
 /* Schnittfläche (geätzt, Makroschliff) */
 const section=(c,pathFn,box,o={})=>fillShape(c,pathFn,box,o.pal||['#8d9296','#b9bec1','#d8dcde','#a5aaae','#7f8488'],{tex:'grain',ta:.55,after:o.after,grad:o.grad});
 return{teeth,cavity,S,R,RR,tile,texture,PAL,cylGrad,flatGrad,shadow,studio,cpath,strokeTaper,crack,uvLine,pore,pores,shrink,stringer,lap,curve,grindNet,thermoNet,beach,cylH,endFace,fillShape,section}})();

/* ---------- Rasterbild + SVG-Beschriftung ---------- */
const _obCache={};
function obImg(key,w,h,draw){if(_obCache[key])return _obCache[key];const cv=document.createElement('canvas'),k=2;cv.width=w*k;cv.height=h*k;const c=cv.getContext('2d');c.scale(k,k);draw(c,w,h);return _obCache[key]=cv.toDataURL('image/jpeg',.9)}
function obCanvas(w,h,draw,k=2){const cv=document.createElement('canvas');cv.width=w*k;cv.height=h*k;const c=cv.getContext('2d');c.scale(k,k);draw(c,w,h);return cv}
/* Beschriftung: Buchstabe mit Führungslinie zum Fehlerort */
const OL=(x,y,tx,ty,l,col='#d62839')=>`<line x1="${tx}" y1="${ty}" x2="${x}" y2="${y}" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/><line x1="${tx}" y1="${ty}" x2="${x}" y2="${y}" stroke="${col}" stroke-width="1.6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3" fill="${col}" stroke="#fff" stroke-width="1.2"/><circle cx="${tx}" cy="${ty}" r="11" fill="#fff" stroke="${col}" stroke-width="2" filter="url(#fsh)"/><text x="${tx}" y="${ty+4.5}" text-anchor="middle" font-size="13" font-weight="800" fill="${col}" style="stroke:none">${l}</text>`;
const OT=(x,y,t,o={})=>{const w=t.length*(o.s||12)*.56+18;const ax=o.a==='start'?x:o.a==='end'?x-w:x-w/2;return `<rect x="${ax.toFixed(1)}" y="${y-(o.s||12)-5}" width="${w.toFixed(1)}" height="${(o.s||12)+11}" rx="${((o.s||12)+11)/2}" fill="${o.bg||'rgba(10,22,40,.82)'}"/><text x="${(ax+w/2).toFixed(1)}" y="${y+.5}" text-anchor="middle" font-size="${o.s||12}" font-weight="${o.b??700}" fill="${o.c||'#fff'}" style="stroke:none">${t}</text>`};
const OBF=(key,w,h,draw,over='')=>SV(w,h,`<image href="${obImg(key,w,h,draw)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none"/>`+over);

/* =================== Abbildungen V5 =================== */
const O=OB;
FIGS.v5_cast=()=>OBF('cast',780,360,(c,w,h)=>{O.studio(c,w,h);
 // Röntgenfilm
 c.save();const fx=24,fy=26,fw=330,fh=300;c.shadowColor='rgba(0,0,0,.4)';c.shadowBlur=14;c.fillStyle='#1b1d1f';c.fillRect(fx,fy,fw,fh);c.restore();
 c.save();c.beginPath();c.rect(fx+8,fy+8,fw-16,fh-16);c.clip();const g=c.createLinearGradient(fx,0,fx+fw,0);g.addColorStop(0,'#2a2c2e');g.addColorStop(1,'#3a3c3e');c.fillStyle=g;c.fillRect(fx,fy,fw,fh);
 // Gussstück-Silhouette (dicker = heller)
 c.beginPath();c.moveTo(fx+40,fy+250);c.lineTo(fx+40,fy+150);c.quadraticCurveTo(fx+60,fy+120,fx+110,fy+118);c.lineTo(fx+220,fy+118);c.quadraticCurveTo(fx+270,fy+118,fx+290,fy+80);c.lineTo(fx+300,fy+60);c.lineTo(fx+300,fy+250);c.closePath();const g2=c.createLinearGradient(0,fy+60,0,fy+250);g2.addColorStop(0,'#c7cacb');g2.addColorStop(1,'#a9adae');c.fillStyle=g2;c.fill();
 c.fillStyle='rgba(140,145,148,.55)';c.fillRect(fx+40,fy+150,260,100);O.shrink(c,fx+240,fy+170,46,{seed:12,n:34,blur:.9,col:'rgba(35,38,40,'});O.shrink(c,fx+205,fy+190,20,{seed:4,n:12,blur:.8,col:'rgba(45,48,50,'});
 O.texture(c,'film',.25,'overlay');c.restore();c.fillStyle='rgba(255,255,255,.75)';c.font='600 10px ui-monospace,monospace';c.fillText('RT · 160 kV · D4',fx+14,fy+fh-14);
 // Schnitt durch Querschnittsübergang
 const sx=400;const path=k=>{k.beginPath();k.moveTo(sx,300);k.lineTo(sx,90);k.lineTo(sx+150,90);k.quadraticCurveTo(sx+170,90,sx+180,140);k.lineTo(sx+190,200);k.lineTo(sx+350,200);k.lineTo(sx+350,300);k.closePath()};
 O.shadow(c,sx+180,310,200,14,.35);O.section(c,path,{x:sx,y:90,w:350,h:210},{after:k=>{O.cavity(k,sx+150,170,28,9);k.strokeStyle='rgba(0,0,0,.08)';for(let i=0;i<40;i++){O.S(i);const a=O.RR(0,TAU);k.beginPath();k.moveTo(sx+150,170);k.lineTo(sx+150+Math.cos(a)*O.RR(40,120),170+Math.sin(a)*O.RR(40,120));k.stroke()}}});
},OT(190,350,'Durchstrahlungsaufnahme: Lunker = dunkler Fleck',{s:11.5})+OL(264,196,330,60,'1')+OT(575,350,'Querschnittsübergang → Lunker im letzten Erstarrungsbereich',{s:11.5})+OL(552,170,640,62,'2'));

FIGS.v5_warmriss=()=>OBF('warm',780,360,(c,w,h)=>{O.studio(c,w,h,{top:'#cfd5da',mid:'#bfc6cc',bot:'#a6aeb6'});
 // Magnetpulveranzeige unter UV auf Gussoberfläche
 c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=16;c.fillStyle='#000';c.fillRect(24,30,340,290);c.restore();c.save();c.beginPath();c.rect(24,30,340,290);c.clip();c.fillStyle='#14161c';c.fillRect(24,30,340,290);O.texture(c,'sand',.55,'overlay');
 const rg=c.createRadialGradient(194,175,10,194,175,220);rg.addColorStop(0,'rgba(80,60,160,.35)');rg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=rg;c.fillRect(24,30,340,290);
 const P=O.cpath(70,140,320,215,.22,6);c.save();c.filter='blur(3px)';O.strokeTaper(c,P,9,'rgba(190,255,40,.45)',{});c.filter='blur(1.2px)';O.strokeTaper(c,P,4,'rgba(220,255,90,.75)',{});c.restore();O.S(3);for(let i=0;i<260;i++){const p=P[Math.floor(O.R()*P.length)];c.fillStyle='rgba(225,255,110,'+O.RR(.2,.7)+')';c.fillRect(p[0]+O.RR(-7,7),p[1]+O.RR(-7,7),1.3,1.3)}c.restore();
 c.fillStyle='rgba(200,210,255,.7)';c.font='600 10px ui-monospace,monospace';c.fillText('MT · fluoreszierend · UV-A',36,312);
 // Warmrisse im Querschnittsübergang (Schnitt)
 const sx=400,path=k=>{k.beginPath();k.moveTo(sx,320);k.lineTo(sx,60);k.lineTo(sx+110,60);k.lineTo(sx+110,200);k.quadraticCurveTo(sx+112,232,sx+150,236);k.lineTo(sx+360,236);k.lineTo(sx+360,320);k.closePath()};
 O.shadow(c,sx+180,328,200,12,.35);O.section(c,path,{x:sx,y:60,w:360,h:260},{pal:['#7d7f80','#a9adb0','#cfd3d5','#999da0','#6e7174'],after:k=>{[[sx+112,214,sx+150,262,1],[sx+120,222,sx+175,250,4],[sx+108,200,sx+85,250,6],[sx+130,232,sx+168,300,8]].forEach(([a,b,cc,d,s])=>O.crack(k,a,b,cc,d,{w:2.4,rough:.35,lev:6,branch:2,oxide:true,seed:s,col:'#1a120c'}))}});
},OT(194,352,'Anzeige eines Warmrisses unter der Oberfläche (unscharf, breit)',{s:11})+OT(590,352,'Warmrisse im Querschnittsübergang (zerklüftet, oxidiert)',{s:11})+OL(518,234,640,120,'!'));

FIGS.v5_gear=()=>OBF('gear',780,400,(c,w,h)=>{O.studio(c,w,h);const cx=300,cy=200,R1=170,R0=140,rh=46;O.shadow(c,cx+10,cy+30,200,180,.35);
 // Zähne + Kranz
 c.save();c.beginPath();O.teeth(c,cx,cy,R1-16,R1,40);c.closePath();c.arc(cx,cy,R0-18,0,TAU,true);c.clip('evenodd');const g=c.createRadialGradient(cx-60,cy-80,20,cx,cy,R1);g.addColorStop(0,'#a6a7a5');g.addColorStop(1,'#545555');c.fillStyle=g;c.fillRect(cx-R1,cy-R1,2*R1,2*R1);O.texture(c,'sand',.35);c.restore();
 // Speichen + Nabe
 c.save();for(let k=0;k<6;k++){c.save();c.translate(cx,cy);c.rotate(k*TAU/6);c.beginPath();c.moveTo(rh-6,-14);c.lineTo(R0-14,-20);c.lineTo(R0-14,20);c.lineTo(rh-6,14);c.closePath();const sg=c.createLinearGradient(0,-20,0,20);sg.addColorStop(0,'#8b8c8a');sg.addColorStop(.4,'#a8a9a7');sg.addColorStop(1,'#4f504f');c.fillStyle=sg;c.fill();c.restore()}O.texture(c,'sand',.35);c.restore();
 c.beginPath();c.arc(cx,cy,rh,0,TAU);const hg=c.createRadialGradient(cx-15,cy-15,5,cx,cy,rh);hg.addColorStop(0,'#b3b4b2');hg.addColorStop(1,'#5a5b5a');c.fillStyle=hg;c.fill();c.beginPath();c.arc(cx,cy,18,0,TAU);c.fillStyle='#1c1d1e';c.fill();
 // Fehler: Risse an Speichenansätzen, Poren in der Nabe, Riss im Zahnfuß
 O.crack(c,cx+R0-22,cy-26,cx+R0-6,cy-46,{w:1.6,branch:1,seed:2,oxide:true});O.crack(c,cx-58,cy+22,cx-44,cy+34,{w:1.4,seed:5});O.pores(c,cx+20,cy-26,14,10,7,3.2,9);O.crack(c,cx-R1+10,cy+40,cx-R1+28,cy+44,{w:1.4,seed:8});
 // Laufrad (rechts)
 const lx=630,ly=200;O.shadow(c,lx+6,ly+40,110,100,.35);c.beginPath();c.arc(lx,ly,110,0,TAU);const lg=c.createRadialGradient(lx-30,ly-40,10,lx,ly,110);lg.addColorStop(0,'#a3a4a2');lg.addColorStop(1,'#4c4d4c');c.fillStyle=lg;c.fill();c.save();c.clip();O.texture(c,'sand',.45);c.restore();
 c.beginPath();c.arc(lx,ly,78,0,TAU);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=6;c.stroke();c.beginPath();c.arc(lx,ly,24,0,TAU);c.fillStyle='#1c1d1e';c.fill();O.crack(c,lx+66,ly-40,lx+92,ly-58,{w:1.6,branch:1,seed:13,oxide:true});O.pores(c,lx-40,ly+30,16,12,9,2.8,4);
},OL(436,154,520,60,'1')+OL(330,174,400,330,'2')+OL(256,222,180,340,'3')+OL(147,244,80,330,'4')+OL(702,154,740,60,'5')+OL(592,230,560,340,'6')+OT(300,24,'Zahnrad aus Stahlguss',{s:12})+OT(630,24,'Laufrad',{s:12}));

FIGS.v5_kern=()=>OBF('kern',760,340,(c,w,h)=>{O.studio(c,w,h);const x0=60,y0=70,ww=640,hh=200;O.shadow(c,380,y0+hh+14,330,14,.35);
 O.section(c,k=>{k.beginPath();k.rect(x0,y0,ww,hh)},{x:x0,y:y0,w:ww,h:hh},{pal:['#7c7e80','#a7abae','#cdd1d3','#979b9e','#6d7073'],after:k=>{
  // Hohlraum (Kern entfernt)
  k.save();k.beginPath();k.ellipse(380,y0+hh/2,210,46,0,0,TAU);k.fillStyle='#22272c';k.fill();k.clip();const g=k.createLinearGradient(0,y0+hh/2-46,0,y0+hh/2+46);g.addColorStop(0,'#0e1114');g.addColorStop(1,'#3a4048');k.fillStyle=g;k.fillRect(150,y0,460,hh);k.restore();
  // Kernstütze (Chaplet) oben, links verschweißt, rechts Spalt
  const sx=380;k.fillStyle='#c9cdd1';k.fillRect(sx-8,y0,16,hh/2-46);k.fillRect(sx-30,y0+hh/2-50,60,6);k.fillRect(sx-8,y0+hh/2+46,16,hh/2-46);k.fillRect(sx-30,y0+hh/2+44,60,6);
  k.strokeStyle='rgba(0,0,0,.25)';k.lineWidth=1;k.strokeRect(sx-8,y0,16,hh/2-46);
  const P=O.cpath(sx+8,y0+4,sx+8,y0+hh/2-48,.08,5);O.strokeTaper(k,P,2.2,'#0b0c0d',{});const P2=O.cpath(sx+8,y0+hh/2+48,sx+8,y0+hh-4,.08,5);O.strokeTaper(k,P2,2.2,'#0b0c0d',{});O.crack(k,sx-8,y0+20,sx-8,y0+40,{w:1,seed:4})}});
},OT(380,30,'Gussteil im Schnitt mit Kernstütze',{s:12})+OL(390,96,520,34,'!')+OT(560,312,'Kernstütze teilweise unverschweißt → Anzeige am Rand der Stütze',{s:11.5}));

FIGS.v5_welle=()=>OBF('welle',820,400,(c,w,h)=>{O.studio(c,w,h);const cy=190;O.shadow(c,420,cy+92,380,16,.4);
 const seg=[[40,170,52],[170,330,70],[330,560,82],[560,700,62],[700,780,46]];seg.forEach(([a,b,r])=>O.cylH(c,a,b,cy,r,'machined',{tex:'turnV',ta:.5}));
 // Hohlkehlen
 [[170,52,70],[330,70,82],[560,82,62],[700,62,46]].forEach(([x,r1,r2])=>{const g=c.createLinearGradient(x-6,0,x+6,0);g.addColorStop(0,'rgba(0,0,0,.25)');g.addColorStop(1,'rgba(255,255,255,.15)');c.fillStyle=g;c.fillRect(x-6,cy-Math.max(r1,r2),12,2*Math.max(r1,r2))});
 // Passfedernut
 c.fillStyle='#2b3035';c.fillRect(380,cy-82,120,10);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(380,cy-72,120,2);
 O.endFace(c,40,cy,52,'machined');
 // a Längsriss
 O.crack(c,210,cy-30,312,cy-24,{w:1.6,seed:3,rough:.08});
 // b Dauerbruchanriss Umlaufbiegung an Hohlkehle (umlaufend)
 const P=[];for(let i=0;i<=30;i++){const t=i/30;P.push([562+Math.sin(t*Math.PI)*2,cy-60+t*120])}c.save();O.strokeTaper(c,P,1.6,'#0b0c0e',{});c.restore();
 // c Torsion 45°
 O.crack(c,600,cy-40,650,cy+30,{w:1.5,seed:9,rough:.12,branch:1});
 // d Schlackenzeile / e Seigerung im Ausbruch (Schnittfenster)
 c.save();c.beginPath();c.rect(400,cy+10,140,62);c.clip();const sg=c.createLinearGradient(0,cy+10,0,cy+72);sg.addColorStop(0,'#a9adb0');sg.addColorStop(1,'#8b9093');c.fillStyle=sg;c.fillRect(400,cy+10,140,62);O.texture(c,'grain',.5);O.stringer(c,405,cy+30,535,cy+30,{n:22,seed:5});O.stringer(c,405,cy+52,535,cy+54,{n:30,seed:11,col:'rgba(70,70,75,.5)',s:.7});c.restore();c.strokeStyle='rgba(0,0,0,.5)';c.strokeRect(400.5,cy+10.5,140,62);
 // f Schmiedefalte
 O.lap(c,O.curve(210,cy+34,300,cy+44,.12),{w:1.6});
 // g Kernzerschmiedung in Stirnfläche
 O.crack(c,40,cy-14,40,cy+14,{w:1.3,seed:21,rough:.2,lev:4});O.crack(c,34,cy-6,46,cy+6,{w:1.1,seed:22,rough:.2,lev:4});O.crack(c,46,cy-6,34,cy+6,{w:1.1,seed:23,rough:.2,lev:4});
},OL(260,162,260,60,'a')+OL(562,190-40,580,40,'b')+OL(625,190-5,690,60,'c')+OL(470,220,440,330,'d')+OL(480,243,520,350,'e')+OL(255,229,220,340,'f')+OL(40,190,50,320,'g'));

FIGS.v5_kurbel=()=>OBF('kurbel',820,400,(c,w,h)=>{O.studio(c,w,h);const cy=200;O.shadow(c,410,cy+120,380,16,.4);
 const journal=(a,b,y,r)=>O.cylH(c,a,b,y,r,'ground',{tex:'grindV',ta:.5});
 const web=(x,dir)=>{O.fillShape(c,k=>{k.beginPath();k.moveTo(x,cy-70);k.lineTo(x+40,cy-70);k.lineTo(x+40,cy+dir*110);k.quadraticCurveTo(x+20,cy+dir*150,x,cy+dir*110);k.closePath()},{x,y:cy-150,w:40,h:300},'forged',{tex:'grain',ta:.5,grad:O.cylGrad(c,x,x+40,'forged','v')})};
 journal(30,110,cy,40);web(110,1);journal(150,240,cy+80,34);web(240,1);journal(280,380,cy,40);web(380,-1);journal(420,510,cy-80,34);web(510,-1);journal(550,650,cy,40);web(650,1);journal(690,790,cy,36);
 // Ölbohrung
 c.beginPath();c.ellipse(195,cy+80,7,9,0,0,TAU);c.fillStyle='#14171a';c.fill();
 // a Schlackenzeile auf Lagerzapfen (feine Längsanzeige)
 O.stringer(c,300,cy-12,365,cy-12,{n:16,seed:2,col:'rgba(30,30,30,.55)',s:.6});
 // b Härterisse an der Hohlkehle
 O.crack(c,282,cy+34,286,cy+12,{w:1.5,seed:5,branch:1});
 // c Dauerbruchanriss am Hubzapfen-Übergang
 const P=[];for(let i=0;i<=20;i++)P.push([422+Math.sin(i/20*Math.PI)*2,cy-112+i*3]);O.strokeTaper(c,P,1.6,'#0b0c0e',{});
 // d Riss an der Ölbohrung
 O.crack(c,201,cy+76,222,cy+64,{w:1.3,seed:8,branch:1});
 // e Schleifrisse auf dem Hauptlager
 O.grindNet(c,600,cy,30,24,{seed:4,n:18,ang:0,s:.8});
 // f Schmiedefalte auf der Wange
 O.lap(c,O.curve(386,cy-20,404,cy+50,.15),{w:1.5});
},OL(330,188,330,70,'a')+OL(284,226,250,330,'b')+OL(423,100,470,40,'c')+OL(212,270,170,350,'d')+OL(600,200,660,320,'e')+OL(395,215,400,330,'f'));

FIGS.v5_pleuel=()=>OBF('pleuel',820,380,(c,w,h)=>{O.studio(c,w,h);const cy=190,bx=210,sx=640;O.shadow(c,430,cy+100,360,16,.4);
 const shape=k=>{k.beginPath();k.arc(bx,cy,120,0,TAU);k.moveTo(sx+60,cy);k.arc(sx,cy,60,0,TAU);k.moveTo(bx+100,cy-34);k.lineTo(sx-50,cy-24);k.lineTo(sx-50,cy+24);k.lineTo(bx+100,cy+34);k.closePath()};
 O.fillShape(c,shape,{x:90,y:60,w:620,h:260},'forged',{tex:'grain',ta:.45,grad:(()=>{const g=c.createLinearGradient(0,60,0,320);g.addColorStop(0,'#6e7781');g.addColorStop(.35,'#9ba5ae');g.addColorStop(.6,'#5a636c');g.addColorStop(1,'#2a3036');return g})(),edge:true});
 c.beginPath();c.arc(bx,cy,72,0,TAU);c.fillStyle='#d4d9de';c.fill();c.save();c.clip();const ig=c.createLinearGradient(0,cy-72,0,cy+72);ig.addColorStop(0,'#2c3238');ig.addColorStop(.5,'#9aa4ad');ig.addColorStop(1,'#3a4148');c.fillStyle=ig;c.fillRect(bx-72,cy-72,144,144);O.texture(c,'turnH',.4);c.restore();
 c.beginPath();c.arc(sx,cy,32,0,TAU);c.save();c.clip();c.fillStyle=ig;c.fillRect(sx-32,cy-32,64,64);c.restore();
 // Steg-Vertiefung (I-Profil)
 c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.moveTo(bx+120,cy-16);c.lineTo(sx-70,cy-11);c.lineTo(sx-70,cy+11);c.lineTo(bx+120,cy+16);c.closePath();c.fill();
 // Gratnaht
 c.strokeStyle='rgba(220,226,232,.55)';c.lineWidth=2;c.beginPath();c.moveTo(bx-120,cy);c.lineTo(bx-72,cy);c.moveTo(bx+72,cy);c.lineTo(sx-32,cy);c.moveTo(sx+32,cy);c.lineTo(sx+60,cy);c.stroke();
 O.crack(c,bx-118,cy+1,bx-86,cy-1,{w:1.6,seed:2,rough:.1});O.crack(c,bx+73,cy-1,bx+92,cy+1,{w:1.4,seed:3,rough:.1});O.crack(c,430,cy-29,434,cy-8,{w:1.4,seed:5});O.crack(c,470,cy+8,468,cy+27,{w:1.3,seed:6});O.crack(c,sx+40,cy-46,sx+50,cy-30,{w:1.3,seed:7});O.lap(c,O.curve(bx+40,cy-110,bx+90,cy-88,.15),{w:1.5});
},OL(105,190,60,90,'a')+OL(283,190,300,330,'b')+OL(432,170,430,60,'c')+OL(469,210,470,330,'c')+OL(685,152,740,60,'d')+OL(275,96,310,40,'e'));

FIGS.v5_zahnkranz=()=>OBF('zkranz',820,400,(c,w,h)=>{O.studio(c,w,h);const cx=410,cy=560,R1=470,R0=420,ri=370;O.shadow(c,410,390,380,14,.35);
 c.save();c.beginPath();O.teeth(c,cx,cy,R1-30,R1,96,Math.PI*1.08,Math.PI*1.92);c.arc(cx,cy,ri,Math.PI*1.92,Math.PI*1.08,true);c.closePath();c.clip();
 const g=c.createRadialGradient(cx,cy,ri,cx,cy,R1);g.addColorStop(0,'#7c868f');g.addColorStop(.6,'#cfd6dc');g.addColorStop(1,'#6a737c');c.fillStyle=g;c.fillRect(0,0,w,h);O.texture(c,'grindV',.4);
 // a Schleifrisse auf Zahnflanke
 O.grindNet(c,300,105,26,14,{seed:3,n:14,ang:.3,s:.75});
 // c Dauerbruchanriss am Zahnfuß
 O.crack(c,486,101,500,124,{w:1.5,seed:6});
 // d Härterisse
 O.crack(c,560,170,600,150,{w:1.4,seed:8,branch:1});O.crack(c,200,175,230,190,{w:1.3,seed:9});
 // b Schmiedefalte im Kranz
 O.lap(c,O.curve(380,160,450,158,.18),{w:1.5});
 // e Risse
 O.crack(c,650,200,690,220,{w:1.3,seed:12,branch:1});c.restore();
},OL(300,105,250,40,'a')+OL(415,164,400,330,'b')+OL(493,112,540,40,'c')+OL(580,160,620,320,'d')+OL(670,210,720,330,'e'));

FIGS.v5_blech=()=>OBF('blech',820,380,(c,w,h)=>{O.studio(c,w,h);const x0=60,y0=190,W=620,T=60,dx=110,dy=110;O.shadow(c,430,y0+T+16,380,16,.4);
 // Oberseite
 O.fillShape(c,k=>{k.beginPath();k.moveTo(x0,y0);k.lineTo(x0+W,y0);k.lineTo(x0+W+dx,y0-dy);k.lineTo(x0+dx,y0-dy);k.closePath()},{x:x0,y:y0-dy,w:W+dx,h:dy},'rolled',{tex:'rollH',ta:.55,after:k=>{
  O.lap(k,O.curve(260,120,360,112,.06),{w:1.5});k.strokeStyle='rgba(0,0,0,.35)';k.lineWidth=.8;for(let i=0;i<4;i++){k.beginPath();k.moveTo(430,150+i*5);k.lineTo(640,146+i*5);k.stroke()}O.crack(k,520,108,560,96,{w:1.3,seed:5,branch:1})}});
 // Stirnseite (Schnittkante)
 O.fillShape(c,k=>{k.beginPath();k.rect(x0,y0,W,T)},{x:x0,y:y0,w:W,h:T},'machined',{tex:'grain',ta:.5,grad:(()=>{const g=c.createLinearGradient(0,y0,0,y0+T);g.addColorStop(0,'#c2c9cf');g.addColorStop(1,'#8d959c');return g})(),after:k=>{
  O.strokeTaper(k,O.cpath(x0+60,y0+T/2,x0+300,y0+T/2+2,.04,6),2.2,'#0c0d0f',{});O.stringer(k,x0+340,y0+T/2-8,x0+560,y0+T/2-8,{n:24,seed:4,s:.8});O.stringer(k,x0+340,y0+T/2+8,x0+560,y0+T/2+9,{n:20,seed:7,col:'rgba(80,80,90,.5)',s:.6});
  O.crack(k,x0+W-30,y0,x0+W-36,y0+22,{w:1.4,seed:9,branch:1})}});
 O.fillShape(c,k=>{k.beginPath();k.moveTo(x0+W,y0);k.lineTo(x0+W+dx,y0-dy);k.lineTo(x0+W+dx,y0-dy+T);k.lineTo(x0+W,y0+T);k.closePath()},{x:x0+W,y:y0-dy,w:dx,h:dy+T},'rolled',{tex:'grain',ta:.4,grad:(()=>{const g=c.createLinearGradient(x0+W,0,x0+W+dx,0);g.addColorStop(0,'#4d555c');g.addColorStop(1,'#2e343a');return g})()});
},OL(180,220,120,320,'a')+OL(480,212,470,330,'b')+OL(540,104,560,40,'c')+OL(310,116,280,40,'d')+OL(540,150,640,60,'e')+OL(645,200,710,320,'f'));

FIGS.v5_rohr=()=>OBF('rohr',820,360,(c,w,h)=>{O.studio(c,w,h);const cy=170,r=86;O.shadow(c,430,cy+r+14,370,14,.4);
 O.cylH(c,60,780,cy,r,'rolled',{tex:'rollH',ta:.5});
 c.save();c.beginPath();c.ellipse(60,cy,r*.32,r,0,0,TAU);c.fillStyle='#5d666f';c.fill();c.beginPath();c.ellipse(60,cy,r*.24,r*.8,0,0,TAU);c.fillStyle='#14171a';c.fill();c.restore();
 O.crack(c,150,cy-40,300,cy-38,{w:1.6,seed:2,rough:.06});O.lap(c,O.curve(330,cy+10,470,cy+16,.04),{w:1.4});O.stringer(c,500,cy-56,580,cy-55,{n:12,seed:3,s:.8});
 c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=.8;for(let i=0;i<3;i++){c.beginPath();c.moveTo(150,cy+40+i*5);c.lineTo(420,cy+39+i*5);c.stroke()}
 for(let k=0;k<5;k++){const x=500+k*55;c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(x,cy+34,12,6,0,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.ellipse(x+1,cy+31,10,3,0,Math.PI,TAU);c.fill()}
},OL(225,131,225,40,'a')+OL(400,186,380,320,'b')+OL(540,115,560,40,'c')+OL(290,215,250,320,'d')+OL(555,204,620,320,'e'));

FIGS.v5_zeit=()=>OBF('zeit',820,340,(c,w,h)=>{O.studio(c,w,h);const cy=160,r=90;O.shadow(c,430,cy+r+14,370,14,.4);
 O.cylH(c,60,780,cy,r,'oxide',{tex:'grain',ta:.6,tex2:'rollH'});c.fillStyle='rgba(20,10,5,.18)';c.fillRect(60,cy-r,720,2*r);
 O.S(4);for(let i=0;i<70;i++){const x=O.RR(320,560),y=cy+O.RR(-60,60),L=O.RR(10,28);O.crack(c,x,y,x+L,y+O.RR(-1,1),{w:O.RR(.8,1.4),seed:i*13+1,rough:.15,lev:4,oxide:true,col:'#120a06'})}
},OT(440,300,'Zeitstandrisse: viele kurze, längsgerichtete, oxidierte Risse im überhitzten Bereich',{s:11.5})+OL(440,150,440,40,'!'));

FIGS.v5_h2riss=()=>OBF('h2',820,360,(c,w,h)=>{O.studio(c,w,h);const y0=110,T=170;O.shadow(c,410,y0+T+12,370,12,.4);
 // Makroschliff einer Stumpfnaht
 O.section(c,k=>{k.beginPath();k.moveTo(60,y0);k.lineTo(330,y0);k.quadraticCurveTo(410,y0-36,490,y0);k.lineTo(760,y0);k.lineTo(760,y0+T);k.lineTo(490,y0+T);k.quadraticCurveTo(410,y0+T+20,330,y0+T);k.lineTo(60,y0+T);k.closePath()},{x:60,y:y0-36,w:700,h:T+56},{pal:['#8a8f93','#b4b9bc','#d4d8da','#a3a8ab','#7a7f83'],after:k=>{
  // WEZ
  [[-1],[1]].forEach(([s])=>{const g=k.createLinearGradient(410+s*80,0,410+s*150,0);g.addColorStop(0,'rgba(70,60,50,.45)');g.addColorStop(1,'rgba(70,60,50,0)');k.fillStyle=g;k.fillRect(Math.min(410+s*80,410+s*150),y0-40,70,T+60)});
  // Schweißgut mit Stängelkristallen
  k.save();k.beginPath();k.moveTo(330,y0-2);k.quadraticCurveTo(410,y0-36,490,y0-2);k.lineTo(470,y0+T);k.quadraticCurveTo(410,y0+T+18,350,y0+T);k.closePath();k.clip();k.fillStyle='rgba(60,55,45,.35)';k.fillRect(320,y0-40,180,T+60);O.S(6);for(let i=0;i<120;i++){const x=O.RR(335,485),y=O.RR(y0-30,y0+T+10),a=Math.atan2(y-(y0+T/2),x-410)+Math.PI;k.strokeStyle='rgba(30,25,20,'+O.RR(.15,.35)+')';k.lineWidth=O.RR(.6,1.4);k.beginPath();k.moveTo(x,y);k.lineTo(x+Math.cos(a)*O.RR(8,20),y+Math.sin(a)*O.RR(8,20));k.stroke()}k.restore();
  // wasserstoffinduzierte Risse: Unternahtrisse in der WEZ + Querrisse im Schweißgut
  O.crack(k,320,y0+60,300,y0+120,{w:1.6,seed:2,branch:1});O.crack(k,505,y0+70,526,y0+130,{w:1.5,seed:3,branch:1});O.crack(k,398,y0+20,410,y0+100,{w:1.3,seed:5});O.crack(k,430,y0+60,424,y0+140,{w:1.2,seed:6})}});
},OL(312,205,250,330,'1')+OL(515,215,560,330,'1')+OL(404,170,404,40,'2')+OT(160,40,'1 Risse in der WEZ (Unternahtrisse)',{s:11,a:'start'})+OT(160,62,'2 Querrisse im Schweißgut',{s:11,a:'start'})+OT(620,40,'Abstand der Querrisse oft ≈ 10 mm',{s:11}));

FIGS.v5_naht=()=>OBF('naht',820,360,(c,w,h)=>{O.studio(c,w,h);const cy=170;O.shadow(c,420,300,380,14,.35);
 // Bleche
 O.fillShape(c,k=>{k.beginPath();k.moveTo(40,cy-110);k.lineTo(780,cy-110);k.lineTo(780,cy+110);k.lineTo(40,cy+110);k.closePath()},{x:40,y:cy-110,w:740,h:220},'rolled',{tex:'rollH',ta:.45});
 // Wärmeeinflusszone (Anlauffarben)
 const hz=c.createLinearGradient(0,cy-70,0,cy+70);[[0,'rgba(40,60,140,0)'],[.15,'rgba(60,70,170,.35)'],[.27,'rgba(150,90,160,.35)'],[.37,'rgba(200,150,70,.4)'],[.5,'rgba(200,170,90,.0)'],[.63,'rgba(200,150,70,.4)'],[.73,'rgba(150,90,160,.35)'],[.85,'rgba(60,70,170,.35)'],[1,'rgba(40,60,140,0)']].forEach(([o,col])=>hz.addColorStop(o,col));c.fillStyle=hz;c.fillRect(40,cy-70,740,140);
 // Raupe mit Schuppung
 c.save();c.beginPath();c.moveTo(40,cy-26);c.bezierCurveTo(300,cy-30,500,cy-24,700,cy-28);c.lineTo(740,cy-6);c.lineTo(740,cy+6);c.lineTo(700,cy+28);c.bezierCurveTo(500,cy+24,300,cy+30,40,cy+26);c.closePath();c.clip();
 const wg=c.createLinearGradient(0,cy-28,0,cy+28);wg.addColorStop(0,'#5b5448');wg.addColorStop(.35,'#d6ccb4');wg.addColorStop(.55,'#a1977f');wg.addColorStop(1,'#4b4438');c.fillStyle=wg;c.fillRect(40,cy-30,720,60);
 for(let x=30;x<730;x+=7){c.strokeStyle='rgba(50,40,25,.35)';c.lineWidth=1.2;c.beginPath();c.moveTo(x,cy-28);c.quadraticCurveTo(x+16,cy,x,cy+28);c.stroke();c.strokeStyle='rgba(255,250,235,.25)';c.lineWidth=.7;c.beginPath();c.moveTo(x+2,cy-26);c.quadraticCurveTo(x+18,cy,x+2,cy+26);c.stroke()}O.texture(c,'grain',.35);
 // a Längsriss Nahtmitte, c Querrisse, e Poren
 O.crack(c,90,cy+1,250,cy-1,{w:1.6,seed:2,rough:.07});[330,360,395].forEach((x,i)=>O.crack(c,x,cy-24,x+4,cy+22,{w:1.3,seed:5+i}));O.pores(c,560,cy,40,12,8,3,7);
 // d Endkraterriss (Stern)
 c.beginPath();c.ellipse(718,cy,22,16,0,0,TAU);c.fillStyle='rgba(30,25,20,.35)';c.fill();for(let k=0;k<6;k++){const a=k/6*TAU+.3;O.crack(c,718,cy,718+Math.cos(a)*18,cy+Math.sin(a)*13,{w:1.2,seed:30+k,lev:4})}c.restore();
 // b Flankenbindefehler am Nahtrand
 O.strokeTaper(c,O.cpath(430,cy-27,520,cy-26,.03,5),1.8,'#0c0d0f',{});
},OL(170,170,170,330,'a')+OL(475,144,475,40,'b')+OL(360,170,330,40,'c')+OL(718,170,740,320,'d')+OL(560,170,600,320,'e'));

FIGS.v5_lamell=()=>OBF('lamell',760,380,(c,w,h)=>{O.studio(c,w,h);const fy=230,FT=60;O.shadow(c,380,fy+FT+12,330,12,.4);
 // Gurtblech (Schnitt, geätzt) + Steg
 O.section(c,k=>{k.beginPath();k.rect(60,fy,640,FT)},{x:60,y:fy,w:640,h:FT},{after:k=>{O.stringer(k,62,fy+FT*.45,698,fy+FT*.45,{n:60,seed:3,s:.6,col:'rgba(60,60,65,.45)'});
  // Lamellarriss: terrassenförmig
  const P=[[300,fy+6],[330,fy+6],[332,fy+18],[380,fy+18],[383,fy+30],[440,fy+30],[442,fy+40],[470,fy+40]];k.save();k.lineCap='round';k.lineJoin='round';k.strokeStyle='rgba(255,255,255,.5)';k.lineWidth=1.6;k.beginPath();P.forEach((p,i)=>i?k.lineTo(p[0]+.7,p[1]+.8):k.moveTo(p[0]+.7,p[1]+.8));k.stroke();k.strokeStyle='#0b0c0e';k.lineWidth=2;k.beginPath();P.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.stroke();k.restore()}});
 O.section(c,k=>{k.beginPath();k.rect(350,40,60,fy-40)},{x:350,y:40,w:60,h:fy-40},{});
 // Kehlnähte beidseitig
 [[350,-1],[410,1]].forEach(([x,s])=>{c.save();c.beginPath();c.moveTo(x,fy-50);c.quadraticCurveTo(x+s*16,fy-14,x+s*50,fy);c.lineTo(x,fy);c.closePath();const g=c.createLinearGradient(x,fy-50,x+s*50,fy);g.addColorStop(0,'#9b927c');g.addColorStop(1,'#5a5244');c.fillStyle=g;c.fill();c.clip();O.texture(c,'grain',.5);c.restore()});
},OT(380,30,'Doppelseitiger T-Stoß',{s:12})+OL(400,258,520,320,'!')+OT(380,356,'Lamellarriss: terrassenförmig entlang der Einschlusszeilen',{s:11.5}));

FIGS.v5_thermo1=()=>OBF('thermo1',820,330,(c,w,h)=>{O.studio(c,w,h);const cy=160,r=90;O.shadow(c,430,cy+r+14,370,14,.4);
 O.cylH(c,60,780,cy,r,'scale',{tex:'rollH',ta:.45});O.thermoNet(c,420,cy,230,70,{cell:13,pref:'v',w:1,seed:8});
},OT(440,300,'Thermoschockrisse: netzartig, bevorzugt quer zur Rohrachse',{s:11.5})+OL(420,150,420,40,'!'));

FIGS.v5_schaufel=()=>OBF('schaufel',760,400,(c,w,h)=>{O.studio(c,w,h);O.shadow(c,380,360,200,14,.4);
 // Fuß (Tannenbaum)
 O.fillShape(c,k=>{k.beginPath();k.moveTo(300,330);for(let i=0;i<4;i++){k.lineTo(296-i*0,330-i*14);k.lineTo(282,323-i*14);}k.lineTo(300,272);k.lineTo(460,272);for(let i=3;i>=0;i--){k.lineTo(478,323-i*14);k.lineTo(464,330-i*14)}k.lineTo(460,330);k.closePath()},{x:280,y:270,w:200,h:62},'machined',{tex:'turnH',ta:.4});
 // Plattform
 O.fillShape(c,k=>{k.beginPath();k.rect(250,256,260,18)},{x:250,y:256,w:260,h:18},'bright',{tex:'grain',ta:.3});
 // Schaufelblatt (Profil)
 O.fillShape(c,k=>{k.beginPath();k.moveTo(312,258);k.bezierCurveTo(296,196,312,112,350,40);k.lineTo(408,32);k.bezierCurveTo(420,104,438,184,452,258);k.closePath()},{x:290,y:40,w:180,h:220},'bright',{tex:'grindV',ta:.35,grad:(()=>{const g=c.createLinearGradient(300,0,470,0);g.addColorStop(0,'#6f7983');g.addColorStop(.3,'#eef3f6');g.addColorStop(.55,'#b9c3cb');g.addColorStop(1,'#59636c');return g})(),after:k=>{
  O.crack(k,304,200,330,192,{w:1.5,seed:2,branch:1});[[436,150],[441,172],[446,196],[431,128]].forEach(([x,y],i)=>O.crack(k,x+8,y,x-8,y+3,{w:1,seed:10+i,lev:4}));k.fillStyle='rgba(120,70,20,.18)';k.beginPath();k.ellipse(438,165,14,58,-.08,0,TAU);k.fill()}});
},OL(318,196,220,140,'a')+OL(438,165,560,120,'b')+OT(380,388,'Turbinenschaufel, gesenkgeschmiedet (Triebwerk)',{s:11.5}));

FIGS.v5_luftzug=()=>OBF('luftzug',820,340,(c,w,h)=>{O.studio(c,w,h);
 // Naht mit Querrissen (links)
 const cy=150;O.fillShape(c,k=>{k.beginPath();k.rect(30,70,360,160)},{x:30,y:70,w:360,h:160},'rolled',{tex:'rollH',ta:.4});c.save();c.beginPath();c.rect(30,cy-24,360,48);c.clip();const wg=c.createLinearGradient(0,cy-24,0,cy+24);wg.addColorStop(0,'#5b5448');wg.addColorStop(.35,'#d6ccb4');wg.addColorStop(1,'#4b4438');c.fillStyle=wg;c.fillRect(30,cy-24,360,48);for(let x=24;x<390;x+=7){c.strokeStyle='rgba(50,40,25,.35)';c.beginPath();c.moveTo(x,cy-24);c.quadraticCurveTo(x+14,cy,x,cy+24);c.stroke()}
 [90,140,195,250,300,345].forEach((x,i)=>O.crack(c,x,cy-30,x+5,cy+30,{w:1.4,seed:i+3,branch:i%2}));c.restore();
 // Walzerzeugnis Thermoschock (rechts)
 O.fillShape(c,k=>{k.beginPath();k.rect(430,70,360,160)},{x:430,y:70,w:360,h:160},'scale',{tex:'rollH',ta:.45,after:k=>O.thermoNet(k,610,150,160,64,{cell:12,w:.9,seed:3})});
},OT(210,270,'Schweißnaht: Querrisse durch Luftzug (schockartiges Abkühlen)',{s:11})+OT(610,270,'Walzerzeugnis: Thermoschock-Rissnetz',{s:11}));

/* ============ realistische Fehlerkacheln für Katalog und Spiel ============ */
const DEF_TILE={
 'Lunker':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>O.cavity(k,w*.5,h*.5,Math.min(w,h)*.3,3)})},
 'Poren / Porositäten':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>O.pores(k,w/2,h/2,w*.42,h*.38,26,Math.min(w,h)*.06,4)})},
 'Einschlüsse / Oxide':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>{O.S(5);for(let i=0;i<12;i++){k.fillStyle='rgba(60,45,30,'+O.RR(.5,.9)+')';k.beginPath();k.ellipse(O.RR(10,w-10),O.RR(10,h-10),O.RR(2,6),O.RR(1.5,4),O.RR(0,3),0,TAU);k.fill()}}})},
 'Seigerungen':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>{const g=k.createRadialGradient(w/2,h/2,2,w/2,h/2,w*.45);g.addColorStop(0,'rgba(60,60,70,.55)');g.addColorStop(1,'rgba(60,60,70,0)');k.fillStyle=g;k.fillRect(0,0,w,h);O.stringer(k,8,h*.5,w-8,h*.5,{n:30,seed:3,s:.6,col:'rgba(60,60,70,.45)'})}})},
 'Warmriss':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'cast',{tex:'sand',ta:.5,after:k=>O.crack(k,w*.12,h*.3,w*.88,h*.75,{w:2.4,rough:.35,branch:3,oxide:true,seed:4,col:'#1a120c'})})},
 'Schrumpfriss':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'cast',{tex:'sand',ta:.5,after:k=>O.crack(k,w*.15,h*.6,w*.85,h*.42,{w:1.8,rough:.12,seed:6})})},
 'Kaltschweißstelle':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'cast',{tex:'sand',ta:.5,after:k=>O.lap(k,O.curve(w*.08,h*.35,w*.92,h*.62,.12),{w:1.8})})},
 'Schlackenzeile / Seigerungszeile':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>{O.stringer(k,6,h*.4,w-6,h*.4,{n:26,seed:2});O.stringer(k,6,h*.65,w-6,h*.66,{n:20,seed:8,s:.7})}})},
 'Flocken':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>{O.S(4);for(let i=0;i<9;i++){const x=O.RR(12,w-12),y=O.RR(12,h-12),a=O.RR(0,TAU),L=O.RR(6,14);O.crack(k,x,y,x+Math.cos(a)*L,y+Math.sin(a)*L,{w:1.1,seed:i+2,lev:4,rough:.3})}}})},
 'Schmiedefalte / Überlappung':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'forged',{tex:'grain',ta:.5,after:k=>O.lap(k,O.curve(w*.1,h*.3,w*.9,h*.6,.16),{w:1.8})})},
 'Dopplung':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'machined',{tex:'grain',ta:.5,grad:(()=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#c2c9cf');g.addColorStop(1,'#8d959c');return g})(),after:k=>O.strokeTaper(k,O.cpath(w*.06,h*.5,w*.94,h*.52,.03,6),2.4,'#0b0c0e',{})})},
 'Säume, Riefen, Pilgerfehler':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'rolled',{tex:'rollH',ta:.55,after:k=>{k.strokeStyle='rgba(0,0,0,.4)';k.lineWidth=.9;for(let i=0;i<4;i++){k.beginPath();k.moveTo(4,h*.3+i*5);k.lineTo(w-4,h*.3+i*5-1);k.stroke()}for(let i=0;i<4;i++){k.fillStyle='rgba(0,0,0,.25)';k.beginPath();k.ellipse(w*.15+i*w*.24,h*.75,8,4,0,0,TAU);k.fill()}}})},
 'Härterisse':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'ground',{tex:'grindH',ta:.45,after:k=>O.crack(k,w*.2,h*.15,w*.62,h*.88,{w:1.8,rough:.1,branch:1,seed:4})})},
 'Schleifrisse':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'ground',{tex:'grindH',ta:.5,after:k=>O.grindNet(k,w/2,h/2,w*.4,h*.36,{seed:6,n:20,ang:Math.PI/2,s:.9})})},
 'Spannungsrisskorrosion':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'machined',{tex:'grain',ta:.5,after:k=>{O.crack(k,w*.1,h*.5,w*.9,h*.45,{w:1.5,rough:.3,branch:5,seed:7});k.fillStyle='rgba(120,80,40,.18)';k.fillRect(0,h*.35,w,h*.3)}})},
 'Interkristalline Korrosion':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'machined',{tex:'grain',ta:.5,after:k=>O.thermoNet(k,w/2,h/2,w*.45,h*.42,{cell:10,w:.7,p:.85,seed:9})})},
 'Poren, Schlacke, Bindefehler':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'weld',{tex:'grain',ta:.5,after:k=>{for(let x=-4;x<w;x+=7){k.strokeStyle='rgba(50,40,25,.3)';k.beginPath();k.moveTo(x,0);k.quadraticCurveTo(x+12,h/2,x,h);k.stroke()}O.pores(k,w*.35,h*.45,w*.2,h*.25,7,4,3);O.strokeTaper(k,O.cpath(w*.55,h*.15,w*.95,h*.17,.03,5),1.8,'#0b0c0e',{})}})},
 'Endkraterriss':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'weld',{tex:'grain',ta:.5,after:k=>{k.fillStyle='rgba(30,25,20,.35)';k.beginPath();k.ellipse(w/2,h/2,w*.32,h*.3,0,0,TAU);k.fill();for(let i=0;i<7;i++){const a=i/7*TAU;O.crack(k,w/2,h/2,w/2+Math.cos(a)*w*.3,h/2+Math.sin(a)*h*.28,{w:1.3,seed:i+11,lev:4})}}})},
 'Wasserstoffinduzierte Risse, Lamellarrisse':(c,w,h)=>{O.section(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},{after:k=>{O.stringer(k,4,h*.5,w-4,h*.5,{n:30,seed:3,s:.6,col:'rgba(60,60,65,.4)'});const P=[[w*.1,h*.3],[w*.35,h*.3],[w*.37,h*.45],[w*.6,h*.45],[w*.62,h*.62],[w*.9,h*.62]];k.strokeStyle='#0b0c0e';k.lineWidth=1.8;k.beginPath();P.forEach((p,i)=>i?k.lineTo(p[0],p[1]):k.moveTo(p[0],p[1]));k.stroke()}})},
 'Ermüdungsriss':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'machined',{tex:'grain',ta:.5,grad:(()=>{const g=c.createLinearGradient(0,0,w,h);g.addColorStop(0,'#9aa1a6');g.addColorStop(1,'#6a7176');return g})(),after:k=>{O.beach(k,0,h,6,w*.75,-Math.PI/2,0,8);k.fillStyle='rgba(40,40,40,.25)';k.beginPath();k.moveTo(w*.8,0);k.lineTo(w,0);k.lineTo(w,h);k.lineTo(w*.75,h);k.closePath();k.fill();O.texture(k,'sand',.25)}})},
 'Thermoschockriss':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},'scale',{tex:'grain',ta:.5,after:k=>O.thermoNet(k,w/2,h/2,w*.46,h*.44,{cell:11,w:.9,seed:5})})},
 'Korrosion zwischen Blechen':(c,w,h)=>{O.fillShape(c,k=>{k.beginPath();k.rect(0,0,w,h)},{x:0,y:0,w,h},['#7a8288','#b5bcc1','#d7dce0','#a8afb4','#6b7277'],{tex:'grain',ta:.5,after:k=>{O.S(3);for(let i=0;i<40;i++){const x=O.RR(w*.15,w*.85),y=O.RR(h*.2,h*.8);const g=k.createRadialGradient(x,y,0,x,y,O.RR(3,9));g.addColorStop(0,'rgba(240,240,230,.8)');g.addColorStop(1,'rgba(200,200,190,0)');k.fillStyle=g;k.fillRect(x-10,y-10,20,20)}O.pores(k,w/2,h/2,w*.3,h*.25,10,2.2,7)}})}};
/* Ersatz der bisherigen Strichsymbole im Katalog/Spiel */
defectIcon=function(name,size=96){const f=DEF_TILE[name];const cv=obCanvas(size,Math.round(size*.72),(c,w,h)=>{if(f)f(c,w,h);else{O.studio(c,w,h)}c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.strokeRect(.5,.5,w-1,h-1)});cv.className='dic';cv.style.width=size+'px';cv.style.height=Math.round(size*.72)+'px';cv.style.borderRadius='10px';return cv};

/* ============ Fehler-Explorer: Bauteil wählen, Fehler antippen, Lupe ============ */
const EXPL=[
 {id:'welle',n:'Welle / Achse (Schmiedeteil)',fig:'v5_welle',w:820,h:400,spots:[[260,162,'Längsriss','Schmieden/Härten','Längs an der Oberfläche','ET: sehr gut (Tastsonde quer zum Riss führen)','Härterisse'],[562,150,'Dauerbruchanriss (Umlaufbiegung)','Betrieb','Umlaufend in der Hohlkehle (Kerbe)','ET: gut mit Tastsonde, Kante beachten','Ermüdungsriss'],[625,185,'Dauerbruchanriss (Torsion)','Betrieb','Unter 45° zur Achse','ET: gut','Ermüdungsriss'],[470,220,'Schlackenzeile','Herstellung','Im Inneren, in Faserrichtung','ET: nur oberflächennah; sonst UT','Schlackenzeile / Seigerungszeile'],[480,243,'Seigerungszeile','Herstellung','Im Inneren, in Faserrichtung','ET: kaum; UT/Makroätzung','Seigerungen'],[255,229,'Schmiedefalte','Herstellung','Oberfläche, schräg einlaufend','ET: gut (Differenzsonde)','Schmiedefalte / Überlappung'],[40,190,'Kernzerschmiedung (Schmiedekreuz)','Herstellung','Im Kern (Stirnfläche)','ET: nein; UT','Flocken']]},
 {id:'kurbel',n:'Kurbelwelle (gesenkgeschmiedet)',fig:'v5_kurbel',w:820,h:400,spots:[[330,188,'Schlackenzeilen, Seigerungen','Herstellung','Auf dem Lagerzapfen angeschnitten','ET: ja, wenn an der Oberfläche','Schlackenzeile / Seigerungszeile'],[284,226,'Härterisse','Bearbeitung','Übergang Zapfen/Wange (Querschnittsänderung)','ET: sehr gut','Härterisse'],[423,100,'Dauerbruchanriss','Betrieb','Hohlkehle am Hubzapfen','ET: gut, Kante kompensieren','Ermüdungsriss'],[212,270,'Riss an der Ölbohrung','Bearbeitung/Betrieb','Rand der Ölbohrung','ET: Rotiersonde oder Tastsonde','Härterisse'],[600,200,'Schleifrisse','Bearbeitung','Netzartig auf dem geschliffenen Lager','ET: sehr gut, hohe Frequenz','Schleifrisse'],[395,215,'Schmiedefalte','Herstellung','Auf der Wange','ET: gut','Schmiedefalte / Überlappung']]},
 {id:'pleuel',n:'Pleuel (gesenkgeschmiedet)',fig:'v5_pleuel',w:820,h:380,spots:[[105,190,'Riss in der Gratnaht außen','Herstellung','Gratnaht, Außenkontur','ET: gut','Härterisse'],[283,190,'Riss in der Gratnaht innen','Herstellung','Gratnaht, Bohrungsrand','ET: Rotiersonde','Härterisse'],[432,170,'Querriss im Steg','Herstellung/Betrieb','Quer zum Steg','ET: gut','Ermüdungsriss'],[685,152,'Querriss im kleinen Auge','Betrieb','Auge, quer','ET: gut','Ermüdungsriss'],[275,96,'Schmiedefalte','Herstellung','Am großen Auge','ET: gut','Schmiedefalte / Überlappung']]},
 {id:'naht',n:'Schweißnaht',fig:'v5_naht',w:820,h:360,spots:[[170,170,'Längsriss','Bearbeitung (Schweißen)','Nahtmitte, in Nahtrichtung','ET (ISO 17643): ja, Sonde quer führen','Härterisse'],[475,144,'Flankenbindefehler','Bearbeitung (Schweißen)','Nahtrand, oft unter der Oberfläche','ET: nur wenn oberflächennah','Poren, Schlacke, Bindefehler'],[360,170,'Querrisse','Bearbeitung (Schweißen)','Quer zur Naht','ET: ja, Sonde längs führen','Wasserstoffinduzierte Risse, Lamellarrisse'],[718,170,'Endkraterriss','Bearbeitung (Schweißen)','Sternförmig am Nahtende','ET: ja','Endkraterriss'],[560,170,'Poren','Bearbeitung (Schweißen)','In der Raupe','ET: nur offene Poren; sonst RT','Poren / Porositäten']]},
 {id:'rohr',n:'Rohr (Walzerzeugnis)',fig:'v5_rohr',w:820,h:360,spots:[[225,131,'Längsriss','Herstellung','Längs, außen','ET: Durchlauf-/Rotiersensor','Härterisse'],[400,186,'Schmiedefalte / Überwalzung','Herstellung','Schräg einlaufend','ET: gut','Schmiedefalte / Überlappung'],[540,115,'Einschluss','Herstellung','Oberflächennah, längs','ET: wenn angeschnitten','Einschlüsse / Oxide'],[290,215,'Riefen','Herstellung','Längs, flach','ET: ja (oft Pseudoanzeige)','Säume, Riefen, Pilgerfehler'],[555,204,'Pilgerfehler','Herstellung','Periodisch wiederkehrend','ET: ja, periodische Anzeigen','Säume, Riefen, Pilgerfehler']]}];
/* Spalten je Fehlerstelle: [x, y, Bezeichnung, Entstehung, Lage/Orientierung, Wirbelstrom, Fehlerbild] */
sim('fexplore','Fehler-Explorer: Wo entstehen welche Fehler?','Wähle ein Bauteil und tippe auf die markierten Fehlerstellen. Die Lupe zeigt den Fehler vergrößert, die Karte erklärt Entstehung, Lage und Prüfbarkeit mit Wirbelstrom. Schalte auf <b>Magnetpulver (UV)</b>: So erscheinen die Oberflächenfehler bei einer Rissprüfung als leuchtende Anzeigen.',b=>{
 let cur=EXPL[0],sel=0,uv=false;
 seg(b,EXPL.map(e=>[e.id,e.n]),cur.id,v=>{cur=EXPL.find(e=>e.id===v);sel=0;draw()});
 const wrap=h('div',{cls:'fxw'}),stage=h('div',{cls:'fxs'}),side=h('div',{cls:'fxi'});wrap.append(stage,side);b.append(wrap);
 seg(b,[[0,'Bauteilansicht'],[1,'Magnetpulver (UV)']],0,v=>{uv=!!v;draw()});
 const NS='http://www.w3.org/2000/svg',el=(t,a,html)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(html)e.innerHTML=html;return e};
 function draw(){stage.innerHTML='';const box=h('div',{cls:'fxsvg',html:figHTML(cur.fig)});stage.append(box);const S=box.querySelector('svg');
  [...S.children].forEach(e=>{if(!['defs','image'].includes(e.tagName)&&!e.classList.contains('fbg'))e.remove()});
  if(uv){S.append(el('rect',{width:cur.w,height:cur.h,fill:'rgba(12,6,44,.8)'}));cur.spots.forEach(s=>{S.append(el('path',{d:`M${s[0]-20} ${s[1]} q10 -5 20 0 t20 0`,stroke:'#d8ff3c','stroke-width':3,fill:'none',style:'filter:drop-shadow(0 0 5px #b8ff00)'}))})}
  cur.spots.forEach((s,i)=>{const on=i===sel,g=el('g',{class:'fxh'},`<circle cx="${s[0]}" cy="${s[1]}" r="20" fill="rgba(255,255,255,.02)" stroke="${on?'#2dd4bf':'#ffffff'}" stroke-width="${on?3.2:2}" ${on?'':'stroke-dasharray="5 4"'}/><circle cx="${s[0]}" cy="${s[1]}" r="4.5" fill="${on?'#2dd4bf':'#ff5d6c'}" stroke="#fff" stroke-width="1.5"/>`);
   g.addEventListener('click',e=>{e.stopPropagation();sel=i;draw()});S.append(g)});
  const s=cur.spots[sel];side.innerHTML='';const lupe=defectIcon(s[6],300);lupe.style.width='100%';lupe.style.height='auto';
  side.append(h('div',{cls:'fxl'},lupe,h('span',{},'🔍 Nahaufnahme')),h('b',{},(sel+1)+' / '+cur.spots.length+' · '+s[2]),h('div',{cls:'fxk',html:'<span>Entstehung</span><em>'+s[3]+'</em><span>Lage / Orientierung</span><em>'+s[4]+'</em><span>Wirbelstrom</span><em>'+s[5]+'</em>'}));
  const nav=h('div',{cls:'seg'});btn(nav,'← vorheriger',()=>{sel=(sel-1+cur.spots.length)%cur.spots.length;draw()});btn(nav,'nächster →',()=>{sel=(sel+1)%cur.spots.length;draw()});side.append(nav)}
 draw()});
/* Explorer am Kapitelanfang einfügen */
(()=>{const ch=CHAPTERS.find(c=>c.id==='v5');if(!ch)return;const a='<h2>5.1 Gussteile</h2>';if(ch.html.includes(a)&&!ch.html.includes('data-sim="fexplore"'))ch.html=ch.html.replace(a,'<div data-sim="fexplore"></div>\n'+a)})();
