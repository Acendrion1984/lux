"use strict";
/* =====================================================================
   Simulationen V1 (Grundlagen) und V2 (Gerätetechnik) – neue Grafik
   ===================================================================== */
/* Feldrichtung einer Ringstrom-Anordnung (für Pfeile auf Feldlinien). r vorzeichenbehaftet. */
function Bdir(loops,r,z){const e=1e-3*(Math.abs(r)+1),f=(rr,zz)=>{let s=0;for(const L of loops)s+=L[2]*G.psiLoop(rr,zz,L[0],L[1]);return s};
 const dr=(f(Math.abs(r)+e,z)-f(Math.max(1e-6,Math.abs(r)-e),z))/(2*e),dz=(f(Math.abs(r),z+e)-f(Math.abs(r),z-e))/(2*e);const rr=Math.max(Math.abs(r),1e-6);return[dr/rr,-dz/rr*Math.sign(r||1)]}
function fieldArrows(c,lines,map,dirAt,col,o={}){c.save();c.fillStyle=col;lines.forEach((pl,k)=>{if(pl.length<12)return;[o.at??.3,(o.at??.3)+.5].forEach(fr=>{const i=Math.floor(pl.length*(fr%1));const p=pl[i];if(o.skip&&o.skip(p))return;const d=dirAt(p[0],p[1]);if(!d)return;const P=map(p[0],p[1]);const ang=Math.atan2(d[1],d[0]);const hs=o.hs||6;
 c.beginPath();c.moveTo(P[0]+Math.cos(ang)*hs,P[1]+Math.sin(ang)*hs);c.lineTo(P[0]+Math.cos(ang+2.55)*hs,P[1]+Math.sin(ang+2.55)*hs);c.lineTo(P[0]+Math.cos(ang-2.55)*hs,P[1]+Math.sin(ang-2.55)*hs);c.closePath();c.fill()})});c.restore()}

/* ================= V1 ================= */
sim('magnet','Induktion: Magnet in die Spule schieben','Ziehe den Magneten mit Finger/Maus in die Spule hinein und wieder heraus. Beobachte Betrag und <b>Vorzeichen</b> der Spannung. Was passiert, wenn der Magnet stillsteht? Drehe die Polarität um!',b=>{
 let mx=.14,Phi0=null,U=0,hist=[],pol=1,auto=false,tt=0,sm=0,vel=0,ph=0;const sp={N:100,B:1,speed:2};
 const O=cvs(b,{ar:.66,arNarrow:.95,draw:(c,w,hh)=>{const sh=hh*.6,cx=w*.66,cy=sh*.6,mw=w*.24,mh=Math.min(sh*.17,w*.075),rc=sh*.27,clen=w*.2;
  G.bench(c,w,sh);const M=mx*w;
  // Feldlinien des Magneten (Ersatz-Ringströme)
  const loops=[];for(let k=0;k<10;k++)loops.push([mh*.42,-mw/2+mw*(k+.5)/10,1]);
  const res=G.fieldLines(loops,[-sh*.62,sh*.62,-w*.95,w*.95],{key:'mag'+Math.round(w)+'x'+Math.round(sh),nx:64,ny:120,n:9,rmax:mh*.42,span:.95});
  const map=(r,z)=>[M+z,cy+r];
  // Gitter ist (r→x-Index, z→y-Index) aufgebaut: Punkte [r,z]
  c.save();c.beginPath();c.rect(0,0,w,sh);c.clip();G.drawField(c,res,(r,z)=>map(r,z),T.field,{alpha:.42,lw:1.3});
  fieldArrows(c,res.lines,(r,z)=>map(r,z),(r,z)=>{const d=Bdir(loops,r,z);return[-pol*d[0],-pol*d[1]]},G.rgba(T.field,.8),{skip:p=>Math.abs(p[0])<mh*.5&&Math.abs(p[1])<mw/2});c.restore();
  // Spule mit Magnet im Inneren
  const I=clamp(U/80,-1,1);
  G.coil(c,cx,cy,clen,rc,10,{I,phase:ph,inner:cc=>{cc.save();cc.translate(-cx,-cy);if(Math.abs(M-cx)<clen/2+mw/2)G.magnet(cc,M,cy,mw,mh,pol,{shadow:false});cc.restore()}});
  if(Math.abs(M-cx)>=clen/2+mw/2)G.magnet(c,M,cy,mw,mh,pol);
  // Lenz: Polung der Spule
  if(Math.abs(U)>4){const facing=pol>0?'S':'N',appr=(cx-M)*vel>0;const near=M<cx?-1:1;const pn=appr?facing:(facing==='S'?'N':'S');const other=pn==='N'?'S':'N';
   const ex=cx+near*(clen/2+18),ox=cx-near*(clen/2+18);G.badge(c,pn,ex,cy-rc-14,pn==='N'?'#d62839':'#2f6fd0',{align:'center'});G.badge(c,other,ox,cy-rc-14,other==='N'?'#d62839':'#2f6fd0',{align:'center'});
   G.label(c,appr?'Abstoßung (Lenz)':'Anziehung (Lenz)',cx,cy+rc+26,{align:'center',size:11.5,col:I>0?T.orange:T.violet})}
  G.meter(c,w*.12,sh*.24,Math.min(w*.085,sh*.2),U/100,{unit:'mV'});
  G.label(c,'⇆ Magnet ziehen',w*.02+4,sh-14,{size:11,col:T.mute});
  // Verlauf
  const R={x:46,y:sh+14,w:w-58,h:hh-sh-38};const ymax=Math.max(100,...hist.map(Math.abs));const m=G.plot(c,R,[0,300],[-ymax,ymax],{noxl:true,zero:true,ny:2,yf:v=>fmt(v,0),title:'U_ind in mV über der Zeit',xl:'Zeit →'});
  const pts=hist.map((v,i)=>[m.x(i+300-hist.length),m.y(v)]);c.save();c.beginPath();c.rect(R.x,R.y,R.w,R.h);c.clip();G.curve(c,pts,T.orange,{fill:m.y(0),lw:2.2});c.restore();if(pts.length)G.dot(c,pts[pts.length-1][0],pts[pts.length-1][1],4.5,T.orange)}});
 O.drag((x,y,t)=>{if(t==='down'||t==='move'){mx=clamp(x/O.w,.1,.95);auto=false;ab.classList.remove('pri')}});
 animate(O,dt=>{tt+=dt;const om=mx;if(auto)mx=.5+.38*Math.sin(tt*sp.speed);const d=(mx-.66),Phi=pol*sp.B*Math.pow(1/(1+Math.pow(d/.11,2)),1.5);vel=lerp(vel,(mx-om)/Math.max(dt,.001),.3);
  if(Phi0===null)Phi0=Phi;const dP=(Phi-Phi0)/Math.max(dt,.001);Phi0=Phi;sm=lerp(sm,dP,.35);U=-sp.N*sm*.07;ph+=dt*clamp(U/40,-3,3);if(dt>0){hist.push(U);if(hist.length>300)hist.shift()}
  upd('u',fmt(U,0)+' mV',Math.abs(U)>3?'r':'');upd('phi',fmt(Phi,2)+' mWb');upd('v',Math.abs(U)<3?'keine Induktion':'Gegenfeld nach Lenz')});
 const c1=h('div',{cls:'ctls'});b.append(c1);
 slider(c1,{label:'Windungszahl N',min:10,max:500,step:10,value:100,on:v=>sp.N=v});slider(c1,{label:'Magnetstärke',min:.2,max:3,step:.1,value:1,on:v=>sp.B=v});
 const row=h('div',{cls:'seg'});b.append(row);const ab=btn(row,'↔ Automatisch schwingen',()=>{auto=!auto;ab.classList.toggle('pri',auto)});btn(row,'⇄ Pole vertauschen',()=>{pol*=-1;O.redraw()});
 const upd=readouts(b,[['u','Induzierte Spannung'],['phi','Fluss Φ in der Spule'],['v','Lenz’sche Regel']]);
 b.append(h('div',{cls:'cap'},'U = −N · dΦ/dt: Nicht der Fluss selbst, sondern seine Änderung erzeugt die Spannung. Schneller bewegen → größere Spannung. Feldlinien berechnet aus dem Ersatzmodell des Magneten (Ringströme auf der Mantelfläche).'))});

sim('rl_dc','Gleichstromkreis mit Spule: Einschalt- und Ausschaltvorgang','Schalte ein und aus. Vergrößere L: Wie ändert sich die Zeitkonstante τ = L/R? Wie groß ist der Strom nach 5 τ?',b=>{
 let i=0,on=false,hist=[],tm=0,flow=0,sw=0;const P={R:10,L:50,U:10};
 const O=cvs(b,{ar:w=>w<620?1.05:.5,draw:(c,w,hh)=>{const narrow=w<620;G.bench(c,w,hh);
  const S=narrow?{x:12,y:10,w:w-24,h:hh*.42}:{x:12,y:12,w:w*.38,h:hh-24};const I0=P.U/P.R,rel=i/I0;
  // Schaltbild
  const x0=S.x+S.w*.12,x1=S.x+S.w*.88,y0=S.y+S.h*.2,y1=S.y+S.h*.82;c.save();c.strokeStyle=T.ink2;c.lineWidth=2.4;c.lineJoin='round';
  c.beginPath();c.moveTo(x0,y1);c.lineTo(x0,y0);c.lineTo(S.x+S.w*.36,y0);c.moveTo(S.x+S.w*.5,y0);c.lineTo(x1,y0);c.lineTo(x1,y1);c.lineTo(x0,y1);c.stroke();
  // Stromfluss-Punkte
  if(Math.abs(i)>1e-3){const path=[[x0,y1],[x0,y0],[x1,y0],[x1,y1],[x0,y1]];const L=path.reduce((a,p,k)=>k?a+Math.hypot(p[0]-path[k-1][0],p[1]-path[k-1][1]):0,0);const n=Math.floor(L/22);c.fillStyle=T.amber;
   for(let k=0;k<n;k++){let s=((k*22+flow)%L+L)%L;for(let q=1;q<path.length;q++){const a=path[q-1],bb=path[q],l=Math.hypot(bb[0]-a[0],bb[1]-a[1]);if(s<=l){c.globalAlpha=.35+.65*rel;c.beginPath();c.arc(a[0]+(bb[0]-a[0])*s/l,a[1]+(bb[1]-a[1])*s/l,3,0,TAU);c.fill();break}s-=l}}c.globalAlpha=1}
  // Batterie
  c.fillStyle=T.panel;c.fillRect(x0-14,(y0+y1)/2-12,28,24);c.strokeStyle=T.ink2;c.beginPath();c.moveTo(x0-14,(y0+y1)/2-6);c.lineTo(x0+14,(y0+y1)/2-6);c.stroke();c.lineWidth=5;c.beginPath();c.moveTo(x0-7,(y0+y1)/2+5);c.lineTo(x0+7,(y0+y1)/2+5);c.stroke();
  G.text(c,'U = '+P.U+' V',x0+20,(y0+y1)/2+4,{align:'left',size:11.5,weight:650,col:T.ink2});
  // Schalter
  c.lineWidth=2.6;c.strokeStyle=on?T.green:T.red;const sa=-.55*(1-sw);c.beginPath();c.moveTo(S.x+S.w*.36,y0);c.lineTo(S.x+S.w*.36+Math.cos(sa)*S.w*.15,y0+Math.sin(sa)*S.w*.15);c.stroke();G.dot(c,S.x+S.w*.36,y0,3.5,T.ink2,{ring:false});G.dot(c,S.x+S.w*.5,y0,3.5,T.ink2,{ring:false});
  G.label(c,on?'EIN':'AUS',S.x+S.w*.43,y0-18,{align:'center',size:11,col:on?T.green:T.red});
  // Widerstand
  const rx=S.x+S.w*.62;c.fillStyle=T.panel;G.rr(c,rx,y0-8,S.w*.16,16,3);c.fill();c.strokeStyle=T.ink2;c.lineWidth=2;c.stroke();G.text(c,'R = '+fmtg(P.R)+' Ω',rx+S.w*.08,y0-14,{align:'center',size:11.5,weight:650,col:T.ink2});
  c.restore();G.coil(c,x1,(y0+y1)/2,(y1-y0)*.5,Math.min(16,S.w*.07),7,{axis:'v',I:rel*(on?1:-1)*.9,phase:flow/40,leads:false});G.text(c,'L = '+fmtg(P.L)+' mH',x1-24,(y0+y1)/2+4,{align:'right',size:11.5,weight:650,col:T.ink2});
  // Diagramm
  const R=narrow?{x:48,y:S.y+S.h+18,w:w-62,h:hh-S.h-62}:{x:S.x+S.w+56,y:18,w:w-S.w-82,h:hh-62};const tau=P.L/1000/P.R,win=6*tau;const m=G.plot(c,R,[0,win*1000],[0,I0*1.12],{xl:'Zeit t in ms',yl:'Strom I in A',yf:v=>fmt(v,2),yo:40});
  G.hline(c,m,I0,T.faint);G.label(c,'I∞ = U/R = '+fmt(I0,2)+' A',R.x+R.w-6,m.y(I0)-11,{align:'right',size:11,col:T.mute});
  [1,3,5].forEach(k=>{if(k*tau<win){G.vline(c,m,k*tau*1000,G.rgba(T.green,.6));G.label(c,k+'τ',m.x(k*tau*1000),R.y+11,{align:'center',size:10.5,col:T.green})}});
  c.save();c.beginPath();c.rect(R.x,R.y,R.w,R.h);c.clip();G.curve(c,hist.map(p=>[m.x(p[0]*1000),m.y(Math.abs(p[2])/P.R)]),T.orange,{lw:1.6,dash:[5,4]});G.curve(c,hist.map(p=>[m.x(p[0]*1000),m.y(p[1])]),T.blue,{fill:R.y+R.h,lw:2.6});c.restore();
  if(hist.length){const p=hist[hist.length-1];G.dot(c,m.x(p[0]*1000),m.y(p[1]),5,T.blue)}
  G.legend(c,R.x+10,R.y+R.h-10,[[T.blue,'Strom i(t)'],[T.orange,'u_L / R (Gegenspannung)',[5,4]]],{max:R.x+R.w})}});
 animate(O,dt=>{const tau=P.L/1000/P.R,win=6*tau,step=dt*win/4;const n=Math.max(1,Math.ceil(step/(tau/100)));for(let k=0;k<n;k++){const d=step/n;const uL=(on?P.U:0)-P.R*i;i+=uL/(P.L/1000)*d;tm+=d;hist.push([tm,i,on?P.U-P.R*i:-P.R*i])}
  sw=lerp(sw,on?1:0,.25);flow+=dt*60*(i/(P.U/P.R));
  if(tm>win){const cut=hist.findIndex(p=>p[0]>tm-win);hist.splice(0,cut);const t0=hist[0][0];hist.forEach(p=>p[0]-=t0);tm-=t0}
  upd('tau',fmt(tau*1000,1)+' ms');upd('i',fmt(i,2)+' A');upd('p',fmt(100*i/(P.U/P.R),0)+' %')});
 O.drag((x,y,t)=>{if(t==='down'){on=!on;rw.pick(on?1:0)}});
 const cr=h('div',{cls:'ctls'});b.append(cr);slider(cr,{label:'Widerstand R',min:1,max:100,value:10,unit:'Ω',on:v=>{P.R=v;hist=[];tm=0}});slider(cr,{label:'Induktivität L',min:5,max:500,value:50,unit:'mH',on:v=>{P.L=v;hist=[];tm=0}});
 const rw=seg(b,[[1,'⏻ Ein'],[0,'○ Aus']],0,v=>on=!!v);const upd=readouts(b,[['tau','Zeitkonstante τ = L/R'],['i','Strom jetzt'],['p','vom Endwert']]);
 b.append(h('div',{cls:'cap'},'Tipp: Antippen der Grafik schaltet ebenfalls. Nach 1τ sind 63 %, nach 3τ 95 %, nach 5τ > 99 % des Endwerts erreicht.'))});

sim('rl_ac','Wechselstrom: R und L – Phasenverschiebung und Impedanz','Stelle f und L hoch: Wie verändern sich X<sub>L</sub>, Z und Δφ? Schalte auf „nur R“ – was passiert mit der Phase? Prüfe die Formel Z² = R² + X<sub>L</sub>².',b=>{
 const P={f:1000,L:20,R:100,mode:'RL'};let ph=0;
 const calc=()=>{const XL=P.mode==='RL'?TAU*P.f*P.L/1000:0,Z=Math.hypot(P.R,XL),dphi=Math.atan2(XL,P.R);return{XL,Z,dphi}};
 const cols=h('div',{cls:'cols c32'});b.append(cols);
 const A=cvs(cols,{ar:.62,draw:(c,w,hh)=>{const{dphi}=calc();G.bench(c,w,hh,{dots:false});const r=Math.min(hh*.36,w*.16),cx=r+22,cy=hh/2;
  // Zeigerkreis
  c.fillStyle=T.panel;c.beginPath();c.arc(cx,cy,r+8,0,TAU);c.fill();c.strokeStyle=T.grid;c.lineWidth=1;c.beginPath();c.arc(cx,cy,r,0,TAU);c.moveTo(cx-r-6,cy);c.lineTo(cx+r+6,cy);c.moveTo(cx,cy-r-6);c.lineTo(cx,cy+r+6);c.stroke();
  const au=ph,ai=ph-dphi;c.strokeStyle=G.rgba(T.green,.8);c.lineWidth=2;c.beginPath();c.arc(cx,cy,r*.32,-au,-ai);c.stroke();
  G.arrow(c,cx,cy,cx+Math.cos(au)*r,cy-Math.sin(au)*r,T.orange,{lw:3});G.arrow(c,cx,cy,cx+Math.cos(ai)*r*.82,cy-Math.sin(ai)*r*.82,T.blue,{lw:3});
  // Wellen
  const R={x:cx+r+30,y:16,w:w-(cx+r+30)-12,h:hh-48};const m=G.plot(c,R,[0,2],[-1.15,1.15],{nx:4,ny:2,xl:'Zeit in Perioden T',yf:v=>fmt(v,0),zero:true});
  const uP=[],iP=[];for(let k=0;k<=240;k++){const t=k/120;uP.push([m.x(t),m.y(Math.sin(au+TAU*t))]);iP.push([m.x(t),m.y(.82*Math.sin(ai+TAU*t))])}
  // Projektionslinien vom Zeiger zur Welle bei t=0
  G.line(c,[[cx+Math.cos(au)*r,cy-Math.sin(au)*r],[m.x(0),m.y(Math.sin(au))]],G.rgba(T.orange,.5),1,{dash:[3,3]});G.line(c,[[cx+Math.cos(ai)*r*.82,cy-Math.sin(ai)*r*.82],[m.x(0),m.y(.82*Math.sin(ai))]],G.rgba(T.blue,.5),1,{dash:[3,3]});
  G.curve(c,uP,T.orange,{lw:2.4});G.curve(c,iP,T.blue,{lw:2.4});G.dot(c,m.x(0),m.y(Math.sin(au)),4.5,T.orange);G.dot(c,m.x(0),m.y(.82*Math.sin(ai)),4.5,T.blue);
  if(dphi>.03){const tz=((Math.PI-au)/TAU%1+1)%1,tz2=((Math.PI-ai)/TAU%1+1)%1;if(tz2>tz&&tz2<2){G.arrow(c,m.x(tz),m.y(0)+12,m.x(tz2),m.y(0)+12,T.green,{lw:2,head:7});G.label(c,'Δt',(m.x(tz)+m.x(tz2))/2,m.y(0)+26,{align:'center',size:10.5,col:T.green})}}
  G.legend(c,R.x+8,R.y+14,[[T.orange,'Spannung u(t)'],[T.blue,'Strom i(t)']],{max:R.x+R.w})}});
 const B=cvs(cols,{ar:.95,draw:(c,w,hh)=>{const{XL,Z,dphi}=calc();G.bench(c,w,hh);const mx=Math.max(P.R,XL,1),ox=48,oy=hh-46,s=Math.min((w-110)/Math.max(P.R,1e-9),(hh-90)/Math.max(XL,1e-9),(Math.min(w,hh)-80)/mx);
  const px=ox+P.R*s,py=oy-XL*s;c.fillStyle=G.rgba(T.violet,.08);c.beginPath();c.moveTo(ox,oy);c.lineTo(px,oy);c.lineTo(px,py);c.closePath();c.fill();
  G.arrow(c,ox,oy,px,oy,T.ink2,{lw:3});if(XL*s>2)G.arrow(c,px,oy,px,py,T.violet,{lw:3});G.arrow(c,ox,oy,px,py,T.red,{lw:3.6});
  c.strokeStyle=T.green;c.lineWidth=2;c.beginPath();c.arc(ox,oy,Math.min(46,P.R*s*.5),-dphi,0);c.stroke();G.text(c,'Δφ = '+fmt(dphi/D2R,1)+'°',ox+Math.min(46,P.R*s*.5)+8,oy-8,{col:T.green,size:12,weight:700,halo:true});
  G.rich(c,'R = '+fmtg(P.R)+' Ω',ox+P.R*s/2,oy+20,{align:'center',size:12.5,col:T.ink2});if(XL>0)G.rich(c,'X_L = '+fmtg(XL)+' Ω',Math.min(px+8,w-110),oy-XL*s/2,{size:12.5,col:T.violet,halo:true});
  G.rich(c,'Z = '+fmtg(Z)+' Ω',(ox+px)/2-12,(oy+py)/2-10,{align:'right',size:13.5,weight:750,col:T.red,halo:true});
  G.text(c,'Impedanzebene (Widerstandsdreieck)',12,20,{size:11.5,weight:700,col:T.mute});G.text(c,'Wirkwiderstand R →',w-12,hh-14,{size:10.5,align:'right',col:T.faint});G.text(c,'↑ Blindwiderstand X',12,38,{size:10.5,col:T.faint})}});
 animate(A,dt=>{ph+=dt*TAU*.18});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>{A.redraw();B.redraw();const q=calc();u('xl',fmtg(q.XL)+' Ω');u('z',fmtg(q.Z)+' Ω');u('p',fmt(q.dphi/D2R,1)+' °');u('dt',fmt(q.dphi/TAU/P.f*1e6,1)+' µs')};
 slider(cr,{label:'Frequenz f',min:10,max:1e5,value:1000,log:true,unit:'Hz',on:v=>{P.f=v;rd()}});slider(cr,{label:'Induktivität L',min:1,max:100,value:20,unit:'mH',on:v=>{P.L=v;rd()}});slider(cr,{label:'Wirkwiderstand R',min:1,max:1000,value:100,log:true,unit:'Ω',on:v=>{P.R=v;rd()}});
 seg(b,[['RL','R + L (Spule)'],['R','nur R']],'RL',v=>{P.mode=v;rd()});const u=readouts(b,[['xl','X_L = 2π·f·L'],['z','Z = √(R²+X_L²)'],['p','Δφ = arctan(X_L/R)'],['dt','Zeitverschiebung Δt']]);setTimeout(rd,60)});

sim('coil_l','Selbstinduktion: Spule mit Luft-, Eisen- oder Aluminiumkern','Wähle den Kern. Beim <b>Eisenkern</b> steigt L mit μ<sub>r</sub>. Beim <b>Aluminiumkern</b> wirken Wirbelströme dem Spulenfeld entgegen: μ<sub>eff</sub> sinkt mit der Frequenz und es entsteht ein zusätzlicher <b>Wirkwiderstand</b> (Erwärmung des Kerns).',b=>{
 const P={n:200,l:5,A:4,core:'air',mur:200,f:1000};let t=0;
 const calc=()=>{const mu0=4e-7*Math.PI;let L0=mu0*P.n*P.n*P.A*1e-4/(P.l/100),mu=1,dR=0;if(P.core==='fe')mu=P.mur;if(P.core==='al'){const D=.02,fg=1/(2*Math.PI*mu0*35e6*(D/2)**2);const m=muEffRod(P.f/fg),eta=.65;mu=(1-eta)+eta*m[0];dR=TAU*P.f*L0*eta*(-m[1])}
  const L=L0*mu;return{L,XL:TAU*P.f*L,mu,dR,L0}};
 const O=cvs(b,{ar:w=>w<620?.85:.46,draw:(c,w,hh)=>{const q=calc();const narrow=w<620;G.bench(c,w,hh);const sw=narrow?w:w*.66,cx=sw/2,cy=narrow?hh*.36:hh/2;
  const len=Math.min(sw*.62,90+P.l*16),rad=Math.min(hh*(narrow?.18:.24),24+P.A*5.2),nt=clamp(Math.round(P.n/18)+5,6,22);
  // Feldlinien
  const loops=[];for(let k=0;k<12;k++)loops.push([rad*.92,-len/2+len*(k+.5)/12,1]);if(P.core==='al'){const e=1-clamp(q.mu,0,1);for(let k=0;k<12;k++)loops.push([rad*.55,-len/2+len*(k+.5)/12,-e*1.6])}
  const nL=P.core==='fe'?Math.round(clamp(6+Math.log10(P.mur)*3.2,8,16)):P.core==='al'?Math.max(2,Math.round(7*q.mu)):7;
  const ref=G.fieldLines(loops.slice(0,12),[-hh*.7,hh*.7,-sw*.8,sw*.8],{key:'cl_ref'+Math.round(len)+'_'+Math.round(rad)+'_'+Math.round(w),nx:44,ny:70,n:1,rmax:rad}).max;
  const res=G.fieldLines(loops,[-hh*.75,hh*.75,-sw*.85,sw*.85],{key:'cl'+P.core+Math.round(len)+'_'+Math.round(rad)+'_'+nL+'_'+(P.core==='al'?q.mu.toFixed(2):'')+Math.round(w),nx:64,ny:110,ref,n:nL,span:P.core==='al'?q.mu*.95:.95});
  const map=(r,z)=>[cx+z,cy+r];c.save();c.beginPath();c.rect(0,0,sw,hh);c.clip();const pulse=.5+.5*Math.abs(Math.sin(t*2));G.drawField(c,res,map,P.core==='fe'?T.violet:T.field,{alpha:.25+.35*pulse,lw:P.core==='fe'?1.6:1.3,flow:t*Math.sign(Math.sin(t*2))*3,flowCol:DARK?'#cfe6ff':'#ffffff',flowA:.6});c.restore();
  const core=P.core==='fe'?'steel':P.core==='al'?'alu':null;
  G.coil(c,cx,cy,len,rad,nt,{core,coreExt:30,I:Math.sin(t*2)*.8,inner:P.core==='al'?(cc=>{const I=1-clamp(q.mu,0,1);for(let k=0;k<5;k++){const x=-len/2+len*(k+.5)/5;cc.strokeStyle=G.rgba('#ff7a2b',.25+.7*I*pulse);cc.lineWidth=2.2;cc.shadowColor='#ff7a2b';cc.shadowBlur=10*I;cc.beginPath();cc.ellipse(x,0,rad*.14,rad*.5,0,0,TAU);cc.stroke()}cc.shadowBlur=0}):null});
  G.dim(c,cx-len/2,cy+rad+22,cx+len/2,cy+rad+22,'l = '+fmt(P.l,1)+' cm');G.label(c,'n = '+P.n+' Windungen',cx,cy-rad-22,{align:'center',size:11.5});
  if(core)G.label(c,P.core==='fe'?'Eisenkern μr = '+P.mur:'Aluminiumkern: Wirbelströme',cx,cy+rad+48,{align:'center',size:11.5,col:P.core==='fe'?T.violet:T.orange});
  // Werte-Karten
  const cards=[['L',fmtg(q.L*1000)+' mH',T.blue],['X_L',fmtg(q.XL)+' Ω',T.violet]];if(P.core==='al'){cards.push(['μ_eff',fmt(q.mu,2),T.teal]);cards.push(['zus. R',fmtg(q.dR)+' Ω',T.orange])}
  const bx=narrow?14:sw+10,bw=narrow?(w-28-(cards.length-1)*8)/cards.length:w-sw-24,bh=narrow?52:Math.min(62,(hh-30)/4-8);
  cards.forEach(([k,v,col],i)=>{const x=narrow?bx+i*(bw+8):bx,y=narrow?hh*.78:16+i*(bh+10);c.save();c.shadowColor=T.shadow;c.shadowBlur=10;c.shadowOffsetY=3;c.fillStyle=T.panel;G.rr(c,x,y,bw,bh,12);c.fill();c.restore();c.fillStyle=col;G.rr(c,x,y,5,bh,3);c.fill();
   G.rich(c,k,x+14,y+19,{size:11.5,col:T.mute,weight:650});G.text(c,v,x+14,y+bh-12,{size:narrow?15:18,weight:800,col})})}});
 animate(O,dt=>{t+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>O.redraw();slider(cr,{label:'Windungszahl n',min:20,max:1000,step:10,value:200,on:v=>{P.n=v;rd()}});slider(cr,{label:'Spulenlänge l',min:1,max:20,step:.5,value:5,unit:'cm',on:v=>{P.l=v;rd()}});
 slider(cr,{label:'Querschnitt A',min:1,max:10,step:.5,value:4,unit:'cm²',on:v=>{P.A=v;rd()}});slider(cr,{label:'Frequenz f',min:10,max:1e5,log:true,value:1000,unit:'Hz',on:v=>{P.f=v;rd()}});slider(cr,{label:'Eisen: µr',min:10,max:2000,step:10,value:200,on:v=>{P.mur=v;rd()}});
 seg(b,[['air','Luft'],['fe','Eisenkern'],['al','Aluminiumkern']],'air',v=>{P.core=v;rd()});b.append(h('div',{cls:'fm',html:'L = μ₀ · μ<sub>r</sub> · n² · A / l'}));
 b.append(h('div',{cls:'cap'},'Feldlinien aus der Flussfunktion der Windungen berechnet; ihre Anzahl ist proportional zum Fluss. Beim Aluminiumkern verdrängen die Wirbelströme (orange) das Feld aus dem Kern.'))});

sim('eddy','Wirbelstromprinzip: Spule über Prüfteil mit Riss','Ziehe die Spule seitlich über den Riss. Verändere Abstand (Lift-off), Frequenz und Leitfähigkeit: Der Impedanzpunkt wandert im Diagramm rechts. Welche Richtung hat Lift-off, welche der Riss?',b=>{
 const P={f:100,s:35,lift:.2,cx:.3,crack:true,dep:1};let trail=[],t=0;
 const cols=h('div',{cls:'cols c32'});b.append(cols);
 const near=()=>P.crack?Math.exp(-Math.pow((P.cx-.5)/.07,2)):0;
 const imp=()=>{const r0=3;const eta=Math.exp(-P.lift/(r0*.55));const nr=near();const kk=clamp(P.f*P.s/300,.01,3000)*(1-.55*nr*P.dep/2);const kc=eta*(1-.35*nr*P.dep/2);const n=normImp(kk,kc);return{X:n.X,R:n.R,k:kk}};
 const A=cvs(cols,{ar:.72,arNarrow:.8,draw:(c,w,hh)=>{G.bench(c,w,hh);const py=hh*.56,ph=hh*.34,px=w*.04,pw=w*.86,dX=w*.06,dY=hh*.07;
  const kk=clamp(P.f*P.s/300,.01,3000),dpx=clamp(ph*.9/Math.sqrt(kk*1.2),5,ph*1.2),kap=1/(1+dpx/(ph*.55));
  const sx=px+pw*P.cx,rc=Math.min(w*.07,40),hc=rc*.7,z0=hc/2+6+P.lift*22;const rxC=px+pw*.5,nr=near();
  // Prüfteil
  G.slab(c,px,py,pw,ph,dX,dY,'alu');
  // Stromdichte im Schnitt (Wirbelströme unter den Windungen)
  c.save();c.beginPath();c.rect(px,py,pw,ph);c.clip();c.globalCompositeOperation=DARK?'lighter':'multiply';
  [-1,1].forEach(sg=>{const ex=sx+sg*rc;const I=Math.exp(-P.lift/1.6)*(1-.75*nr*Math.exp(-Math.pow((ex-rxC)/(rc*.9),2)));const g=c.createRadialGradient(ex,py,1,ex,py,dpx*1.6+rc*.6);g.addColorStop(0,G.rgba('#ff5a14',.75*I));g.addColorStop(.5,G.rgba('#ff8a3a',.35*I));g.addColorStop(1,'rgba(255,138,58,0)');c.fillStyle=g;c.fillRect(ex-dpx*2-rc,py,dpx*4+rc*2,ph)});
  c.restore();
  const sgn=Math.sin(t*3)>=0?1:-1,amp=Math.abs(Math.sin(t*3));
  [-1,1].forEach(sg=>{const ex=sx+sg*rc;if(Math.abs(ex-rxC)>6||!P.crack)G.winding(c,ex,py+Math.min(dpx*.6,ph*.4),5.5,-sg*sgn,{})});
  // Riss
  if(P.crack){const cd=ph*(.25+.32*P.dep/2);c.fillStyle=DARK?'#05090d':'#1b232b';c.beginPath();c.moveTo(rxC-3,py);c.lineTo(rxC+3,py);c.lineTo(rxC+.5,py+cd);c.lineTo(rxC-.5,py+cd);c.closePath();c.fill();
   c.strokeStyle=DARK?'#05090d':'#1b232b';c.lineWidth=2;c.beginPath();c.moveTo(rxC+dX*.15,py-dY*.15);c.lineTo(rxC+dX*.95,py-dY*.95);c.stroke();G.label(c,'Riss',rxC,py+cd+14,{align:'center',size:11,col:T.red})}
  // Feldlinien: Spule + Spiegelströme (Wirbelströme), im Werkstück gedämpft
  const box=[-w*.55,w*.55,-ph,hh*.62],nx=96,ny=64,F=new Float64Array(nx*ny);const [x0,x1,y0,y1]=box;let mxv=0;const coilL=[[rc,z0-hc*.3],[rc,z0],[rc,z0+hc*.3]];
  const key='ed'+Math.round(w)+'_'+P.lift+'_'+kap.toFixed(2)+'_'+Math.round(dpx);let res=G._fcache.get(key);
  if(!res){for(let j=0;j<ny;j++){const z=y0+(y1-y0)*j/(ny-1);for(let i=0;i<nx;i++){const r=x0+(x1-x0)*i/(nx-1);let s=0;if(z>=0){for(const L of coilL)s+=G.psiLoop(r,z,L[0],L[1])-kap*G.psiLoop(r,z,L[0],-L[1])}else{for(const L of coilL)s+=(1-kap)*G.psiLoop(r,z,L[0],L[1]);s*=Math.exp(z/dpx)}F[j*nx+i]=s;if(z>z0&&Math.abs(r)<rc*.9)mxv=Math.max(mxv,s)}}
   let ref=0;for(const L of coilL)ref+=G.psiLoop(rc*.85,z0,L[0],L[1]);const lines=[];for(let k=0;k<9;k++){const lv=ref*(k+.5)/9*.9;lines.push(...G.contour(F,nx,ny,lv).map(pl=>pl.map(([i,j])=>[x0+(x1-x0)*i/(nx-1),y0+(y1-y0)*j/(ny-1)])))}
   res={lines};if(G._fcache.size>60)G._fcache.clear();G._fcache.set(key,res)}
  const map=(r,z)=>[sx+r,py-z];c.save();c.beginPath();c.rect(0,0,w,hh);c.clip();G.drawField(c,res,map,T.field,{alpha:.2+.45*amp,lw:1.3,flow:t*sgn*4,flowCol:DARK?'#d6ecff':'#ffffff',flowA:.55*amp});c.restore();
  // Sondenspule (Schnitt)
  const cy=py-z0;c.save();c.shadowColor=T.shadow;c.shadowBlur=10;c.shadowOffsetY=4;c.fillStyle=DARK?'rgba(40,60,80,.55)':'rgba(220,232,242,.75)';G.rr(c,sx-rc-14,cy-hc/2-8,2*rc+28,hc+16,8);c.fill();c.restore();c.strokeStyle=T.axis;c.lineWidth=1;G.rr(c,sx-rc-14,cy-hc/2-8,2*rc+28,hc+16,8);c.stroke();
  G.metal(c,sx-rc*.45,cy-hc/2-4,rc*.9,hc+8,'ferrite',{r:3});
  [-1,1].forEach(sg=>{for(let a=0;a<2;a++)for(let bq=0;bq<3;bq++)G.winding(c,sx+sg*(rc-4+a*8)-(sg<0?0:8)+4,cy-hc*.3+bq*hc*.3,Math.min(5,rc*.12),sg*sgn)});
  c.strokeStyle=DARK?'#0b1218':'#22303d';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(sx,cy-hc/2-8);c.bezierCurveTo(sx,cy-hc-20,sx+30,cy-hc-24,sx+44,Math.max(8,cy-hc*2-30));c.stroke();
  if(P.lift>0)G.dim(c,sx+rc+26,py,sx+rc+26,cy+hc/2+8,'Lift-off',{size:10});
  G.label(c,'σ = '+fmtg(P.s)+' MS/m · δ ≈ '+fmtg(dpx/ph*3)+' (rel.)',px+8,py+ph-14,{size:10.5,col:T.ink2});
  G.label(c,'⇆ Spule ziehen',8,16,{size:11,col:T.mute});G.legend(c,8,hh-10,[[T.field,'Primärfeld'],['#ff7a2b','Wirbelströme']],{max:w})}});
 A.drag((x,y,t)=>{P.cx=clamp((x/A.w-.04)/.86,.05,.95);const q=imp();trail.push([q.R,q.X]);if(trail.length>240)trail.shift();rd()});
 const B=cvs(cols,{ar:1.05,arNarrow:.8,dark:true,draw:(c,w,hh)=>{const S=G.screen(c,0,0,w,hh,{label:'Impedanzebene (normiert)',bezel:8});const xr=[-.04,.46],yr=[.18,1.06];const m=mapper({x:S.x+18,y:S.y+24,w:S.w-30,h:S.h-40},xr,yr);
  const pts=[];for(let e=-2;e<=3.4;e+=.05){const n=normImp(Math.pow(10,e),Math.exp(-P.lift/1.65));pts.push([m.x(n.R),m.y(n.X)])}G.trace(c,pts,G.rgba(PH.g,.45),1.2,{blur:2});
  const lo=[];for(let l=0;l<=3;l+=.1){const n=normImp(clamp(P.f*P.s/300,.01,3000),Math.exp(-l/1.65));lo.push([m.x(n.R),m.y(n.X)])}G.line(c,lo,G.rgba(PH.a,.55),1.2,{dash:[4,4]});G.stext(c,'Lift-off',lo[lo.length-1][0]+4,lo[lo.length-1][1]+12,{col:PH.a,size:10});
  G.persist(c,trail.map(p=>[m.x(p[0]),m.y(p[1])]),PH.a,2);const q=imp();G.spot(c,m.x(q.R),m.y(q.X),PH.g,4);
  G.stext(c,'R →',S.x+S.w-34,S.y+S.h-8);G.stext(c,'↑ X',S.x+8,S.y+34);G.stext(c,'Leerlauf',m.x(0)+6,m.y(1)-6,{size:10});G.glass(c,S)}});
 animate(A,dt=>{t+=dt});
 const rd=()=>{A.redraw();B.redraw();const q=imp();u('k','f/f_g ≈ '+fmtg(q.k));u('x','X = '+fmt(q.X,3));u('r','R = '+fmt(q.R,3))};
 const cr=h('div',{cls:'ctls'});b.append(cr);slider(cr,{label:'Frequenz f',min:1,max:3000,log:true,value:100,unit:'kHz',on:v=>{P.f=v;rd()}});slider(cr,{label:'Leitfähigkeit σ',min:1,max:58,log:true,value:35,unit:'MS/m',on:v=>{P.s=v;rd()}});
 slider(cr,{label:'Abstand (Lift-off)',min:0,max:3,step:.05,value:.2,unit:'mm',on:v=>{P.lift=v;trail=[];rd()}});slider(cr,{label:'Risstiefe',min:.5,max:2,step:.1,value:1,fmt:v=>fmt(v,1)+' ×',on:v=>{P.dep=v;rd()}});
 seg(b,[[1,'mit Riss'],[0,'ohne Riss']],1,v=>{P.crack=!!v;rd()});const u=readouts(b,[['k','Arbeitspunkt'],['x','Blindanteil'],['r','Wirkanteil']]);setTimeout(rd,80);
 b.append(h('div',{cls:'cap'},'Feldlinien berechnet: Spulenwindungen plus Spiegelströme im Leiter (je höher f·σ, desto stärker das Gegenfeld); im Werkstück klingt das Feld mit der Eindringtiefe ab.'))});

sim('norm','Normierte Impedanzebene und Ähnlichkeitsgesetz','Zwei Stangen A und B (andere Werkstoffe, andere Durchmesser). Schalte „B auf gleiches f/f<sub>g</sub>“ ein: Die Arbeitspunkte fallen zusammen – das <b>Ähnlichkeitsgesetz</b>! Schiebe den Füllungsgrad η: Die Kurve schrumpft.',b=>{
 const mats={Cu:[58,'Kupfer'],Al:[35,'Aluminium'],Ms:[15,'Messing'],Ti:[.6,'Titan'],Au:[1.4,'Austenit']};const P={ma:'Cu',mb:'Al',Da:10,Db:20,fa:100,eta:.8,lock:false};
 const fg=(s,D)=>5066/(s*D*D/100);const sA=()=>mats[P.ma][0],sB=()=>mats[P.mb][0];const FA=()=>fg(sA(),P.Da),FB=()=>fg(sB(),P.Db);
 const O=cvs(b,{ar:.62,arNarrow:.85,dark:true,draw:(c,w,hh)=>{const S=G.screen(c,0,0,w,hh,{label:'Normierte Impedanzebene  ωL/ωL₀  über  (R−R₀)/ωL₀',bezel:8,nx:9,ny:6,axes:false});
  const R={x:S.x+46,y:S.y+26,w:S.w-62,h:S.h-56};const xr=[0,.45],yr=[0,1.02];const m=mapper(R,xr,yr);
  c.save();c.font=G.font(10,600,true);c.fillStyle=G.rgba(PH.g,.6);c.textAlign='center';for(let v=0;v<=.45;v+=.05)c.fillText(fmt(v,2),m.x(v),R.y+R.h+14);c.textAlign='right';for(let v=0;v<=1;v+=.2)c.fillText(fmt(v,1),R.x-6,m.y(v)+3);c.restore();
  c.strokeStyle=G.rgba(PH.g,.35);c.lineWidth=1;c.beginPath();c.moveTo(R.x,R.y);c.lineTo(R.x,R.y+R.h);c.lineTo(R.x+R.w,R.y+R.h);c.stroke();
  [1,.6,.4].forEach(e=>{if(Math.abs(e-P.eta)<.02)return;const p=[];for(let k=-2.2;k<=3;k+=.05){const n=normImp(Math.pow(10,k),e);p.push([m.x(n.R),m.y(n.X)])}G.line(c,p,G.rgba(PH.g,.18),1,{dash:[3,4]});const n=normImp(1000,e);G.stext(c,'η='+fmt(e,1),m.x(n.R)+4,m.y(n.X)+4,{size:9.5,col:G.rgba(PH.g,.45)})});
  const pts=[];for(let k=-2.2;k<=3;k+=.03){const n=normImp(Math.pow(10,k),P.eta);pts.push([m.x(n.R),m.y(n.X)])}G.trace(c,pts,PH.g,2);
  [.5,1,2,4,6,10,20,50,100,400].forEach(k=>{const n=normImp(k,P.eta);G.spot(c,m.x(n.R),m.y(n.X),PH.c,1.4);G.stext(c,String(k),m.x(n.R)+6,m.y(n.X)-5,{size:9.5,col:PH.c})});
  const ka=P.fa/FA(),kb=P.lock?ka:P.fa/FB();const a=normImp(ka,P.eta),bb=normImp(kb,P.eta);
  G.spot(c,m.x(bb.R),m.y(bb.X),PH.b,6);G.spot(c,m.x(a.R),m.y(a.X),PH.a,4.5);G.stext(c,'B',m.x(bb.R)-20,m.y(bb.X)+4,{col:PH.b,size:13,weight:800});G.stext(c,'A',m.x(a.R)+12,m.y(a.X)+4,{col:PH.a,size:13,weight:800});
  if(P.lock)G.stext(c,'A und B deckungsgleich: gleiches k = f/f_g',R.x+R.w-4,R.y+14,{align:'right',col:PH.c});
  G.stext(c,'Zahlen = Arbeitskonstante k = f/f_g',R.x+R.w-4,R.y+R.h-8,{align:'right',size:10});G.glass(c,S)}});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>{O.redraw();const ka=P.fa/FA();const fb=P.lock?ka*FB():P.fa;u('ga','f_g(A) = '+fmtg(FA())+' Hz');u('gb','f_g(B) = '+fmtg(FB())+' Hz');u('ka','k(A) = '+fmtg(ka));u('kb','k(B) = '+fmtg(fb/FB()));u('fb','f(B) = '+fmtg(fb)+' Hz')};
 const mk=(id,l)=>{const w=h('label',{cls:'ctl'},h('span',{cls:'lb'},l),h('select',{style:'width:100%',onchange:e=>{P[id]=e.target.value;rd()}},Object.entries(mats).map(([k,v])=>h('option',{value:k,selected:P[id]===k},v[1]+' ('+v[0]+' MS/m)'))));cr.append(w)};
 mk('ma','Stange A: Werkstoff');slider(cr,{label:'Stange A: Durchmesser',min:2,max:50,step:1,value:10,unit:'mm',on:v=>{P.Da=v;rd()}});mk('mb','Stange B: Werkstoff');slider(cr,{label:'Stange B: Durchmesser',min:2,max:50,step:1,value:20,unit:'mm',on:v=>{P.Db=v;rd()}});
 slider(cr,{label:'Prüffrequenz A',min:1,max:1e6,log:true,value:100,unit:'Hz',on:v=>{P.fa=v;rd()}});slider(cr,{label:'Füllungsgrad η = (D_P/D_S)²',min:.1,max:1,step:.05,value:.8,fmt:v=>fmt(v,2),on:v=>{P.eta=v;rd()}});
 seg(b,[[0,'B mit eigener Frequenz (= f von A)'],[1,'B auf gleiches f/f_g stellen']],0,v=>{P.lock=!!v;rd()});const u=readouts(b,[['ga','Grenzfrequenz A'],['gb','Grenzfrequenz B'],['ka','Arbeitskonstante A'],['kb','Arbeitskonstante B'],['fb','Frequenz B']]);
 b.append(h('div',{cls:'fm',html:'f<sub>g</sub> = 5066 / (σ · μ<sub>r</sub> · D²)  <small>[Hz; σ in MS/m, D in cm]</small>'}));setTimeout(rd,80)});

/* ================= V2 ================= */
sim('blocks','Blockschaltbild eines Wirbelstrom-Prüfgeräts','Tippe auf die Blöcke, um ihre Aufgabe zu sehen. Schalte Optionen zu (Sättigung für Eisenwerkstoffe, Markierung, Selbstüberwachung). Die Punkte zeigen den Signalfluss.',b=>{
 const B={gen:['Wechselstromgenerator','Liefert den Erregerstrom für die Prüfspule. Moderne Geräte arbeiten im Bereich 100 Hz – 10 MHz.'],spule:['Prüfspule / Sensor','Erzeugt das magnetische Wechselfeld und nimmt die Rückwirkung der Wirbelströme auf.'],ver:['Verstärker','Hebt die Fehlersignale auf einen für die Weiterverarbeitung geeigneten Pegel.'],dem:['Amplituden- und Phasendemodulation','Phasengesteuerter Gleichrichter: trennt das Signal nach Amplitude und Phasenlage (X/Y-Komponenten).'],fil:['Signalaufbereitung','NF-Filter (HP/BP/TP) abhängig von der Prüfgeschwindigkeit optimiert das Nutz-zu-Störsignal; Phasensteller dreht das Fehlersignal in die optimale Richtung (reproduzierbar in 1°-Schritten).'],anz:['Signaldarstellung','Oszilloskop / Bildschirm (Impedanzebene) oder Schreiber (y-t).'],bew:['Signalbewertung','Automatische Auswertung nach Amplitude, Phase/Amplitude, Y-Komponente oder Korrelation.'],mark:['Markier- und Sortierelektronik','Markiert Fehlerstellen und sortiert gut/schlecht.'],sat:['Magnetische Sättigung','Nötig für ferromagnetische Werkstoffe: Gleichfeld sättigt das Material, μ → nahe 1, Permeabilitätsrauschen sinkt.'],selbst:['Selbstüberwachung','Erzeugt periodisch ein künstliches Fehlersignal (z. B. Durchgangsbohrung) und kontrolliert die Reaktion der gesamten Prüfeinrichtung → hohe Prüfsicherheit.']};
 const opt={sat:false,mark:false,selbst:false};let sel='spule',t=0,boxes=[];
 const icon=(c,id,x,y,s,col)=>{c.save();c.strokeStyle=col;c.fillStyle=col;c.lineWidth=2;c.lineCap='round';c.lineJoin='round';
  if(id==='gen'){c.beginPath();c.arc(x,y,s*.5,0,TAU);c.stroke();c.beginPath();for(let i=0;i<=20;i++){const u=i/20;c.lineTo(x-s*.32+u*s*.64,y-Math.sin(u*TAU)*s*.22)}c.stroke()}
  else if(id==='spule'){G.coil(c,x,y,s*.9,s*.3,5,{leads:false,lw:2.2,I:Math.sin(t*4)*.6})}
  else if(id==='ver'){c.beginPath();c.moveTo(x-s*.35,y-s*.38);c.lineTo(x+s*.4,y);c.lineTo(x-s*.35,y+s*.38);c.closePath();c.stroke();G.text(c,'+',x-s*.2,y+4,{size:s*.3,col,weight:800})}
  else if(id==='dem'){c.beginPath();c.moveTo(x-s*.4,y);c.lineTo(x+s*.4,y);c.moveTo(x,y-s*.4);c.lineTo(x,y+s*.4);c.stroke();G.arrow(c,x,y,x+Math.cos(t)*s*.34,y-Math.sin(t)*s*.34,col,{lw:2,head:6})}
  else if(id==='fil'){c.beginPath();for(let i=0;i<=30;i++){const u=i/30;const g=Math.exp(-Math.pow((u-.5)/.17,4));c.lineTo(x-s*.42+u*s*.84,y+s*.3-g*s*.55)}c.stroke();c.globalAlpha=.25;c.lineTo(x+s*.42,y+s*.3);c.lineTo(x-s*.42,y+s*.3);c.fill()}
  else if(id==='anz'){c.fillStyle='#04140c';G.rr(c,x-s*.45,y-s*.34,s*.9,s*.68,4);c.fill();const p=[];for(let i=0;i<=40;i++){const u=i/40*TAU;p.push([x+Math.sin(u)*s*.3,y+Math.sin(2*u)*s*.18])}G.trace(c,p,PH.g,1.4,{blur:3})}
  else if(id==='bew'){c.beginPath();c.moveTo(x-s*.4,y+s*.25);c.lineTo(x-s*.1,y+s*.25);c.lineTo(x,y-s*.3);c.lineTo(x+s*.1,y+s*.25);c.lineTo(x+s*.4,y+s*.25);c.stroke();c.setLineDash([3,3]);c.beginPath();c.moveTo(x-s*.45,y-s*.1);c.lineTo(x+s*.45,y-s*.1);c.stroke();c.setLineDash([])}
  else if(id==='mark'){G.led(c,x,y,Math.sin(t*5)>0,'#ff3b4a',s*.22)}
  else if(id==='sat'){c.lineWidth=s*.16;c.beginPath();c.arc(x,y+s*.05,s*.3,Math.PI,0);c.lineTo(x+s*.3,y+s*.35);c.moveTo(x-s*.3,y+s*.05);c.lineTo(x-s*.3,y+s*.35);c.stroke()}
  else if(id==='selbst'){c.beginPath();c.arc(x,y,s*.32,.3,TAU-.3);c.stroke();G.arrow(c,x+s*.3,y-s*.12,x+s*.31,y+s*.06,col,{lw:2,head:7})}
  c.restore()};
 const O=cvs(b,{ar:w=>w<620?1.15:.52,draw:(c,w,hh)=>{G.bench(c,w,hh);const ids=['gen','spule','ver','dem','fil','anz'];if(opt.mark)ids.push('bew','mark');
  const ncol=w<620?2:4,rows=Math.ceil(ids.length/ncol),gx=w/ncol,bw=Math.min(gx*.78,190),bh=Math.min(92,hh/(rows+(opt.sat||opt.selbst?1.4:.6))*.62),top=(opt.sat?bh*1.25:20)+12,gy=(hh-top-(opt.selbst?bh*1.2:16))/rows;
  boxes=[];ids.forEach((id,i)=>{const r=Math.floor(i/ncol),k=r%2?ncol-1-i%ncol:i%ncol;boxes.push({id,x:gx*k+(gx-bw)/2,y:top+r*gy+(gy-bh)/2,w:bw,h:bh})});
  const bx=id=>boxes.find(q=>q.id===id);if(opt.sat){const s=bx('spule');boxes.push({id:'sat',x:s.x,y:12,w:bw,h:bh*.9,opt:1})}if(opt.selbst){const s=bx('spule');boxes.push({id:'selbst',x:s.x,y:hh-bh*1.05,w:bw,h:bh*.9,opt:1})}
  // Verbindungen
  const link=(a,bq,ph)=>{const A=bx(a),Bq=bx(bq);if(!A||!Bq)return;let p1,p2;if(Math.abs(A.y-Bq.y)<2){const dir=Bq.x>A.x?1:-1;p1=[A.x+(dir>0?A.w:0),A.y+A.h/2];p2=[Bq.x+(dir>0?0:Bq.w),Bq.y+Bq.h/2]}else if(Math.abs(A.x-Bq.x)<2){const dir=Bq.y>A.y?1:-1;p1=[A.x+A.w/2,A.y+(dir>0?A.h:0)];p2=[Bq.x+Bq.w/2,Bq.y+(dir>0?0:Bq.h)]}else{p1=[A.x+A.w/2,A.y+A.h];p2=[Bq.x+Bq.w/2,Bq.y]}
   G.arrow(c,p1[0],p1[1],p2[0],p2[1],T.axis,{lw:2.2,head:9});const L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]);for(let q=0;q<3;q++){const s=((t*.9+q/3+ph)%1);G.dot(c,p1[0]+(p2[0]-p1[0])*s,p1[1]+(p2[1]-p1[1])*s,3.2,T.teal,{ring:false,glow:8})}};
  for(let i=1;i<ids.length;i++)link(ids[i-1],ids[i],i*.13);if(opt.sat)link('sat','spule',0);if(opt.selbst)link('selbst','spule',.5);
  boxes.forEach(q=>{const on=q.id===sel,col=on?T.teal:q.opt||q.id==='bew'||q.id==='mark'?T.violet:T.blue;c.save();c.shadowColor=on?G.rgba(T.teal,.55):T.shadow;c.shadowBlur=on?18:10;c.shadowOffsetY=on?0:3;c.fillStyle=T.panel;G.rr(c,q.x,q.y,q.w,q.h,14);c.fill();c.restore();
   c.strokeStyle=on?T.teal:G.rgba(col,.35);c.lineWidth=on?2.5:1.2;G.rr(c,q.x,q.y,q.w,q.h,14);c.stroke();c.fillStyle=col;G.rr(c,q.x,q.y,q.w,5,3);c.fill();
   const s=Math.min(q.h*.46,40);icon(c,q.id,q.x+q.w/2,q.y+q.h*.42,s,col);const name=B[q.id][0];c.font=G.font(q.w<130?10.5:11.5,700);const words=name.split(' ');let ln=[''];words.forEach(wd=>{const tt=(ln[ln.length-1]+' '+wd).trim();if(c.measureText(tt).width>q.w-12)ln.push(wd);else ln[ln.length-1]=tt});ln=ln.slice(0,2);
   ln.forEach((l,k)=>G.text(c,l,q.x+q.w/2,q.y+q.h-8-(ln.length-1-k)*13,{align:'center',size:q.w<130?10.5:11.5,weight:700,col:T.ink2}))})}});
 O.drag((x,y,tp)=>{if(tp!=='down')return;const q=boxes.find(q=>x>=q.x&&x<=q.x+q.w&&y>=q.y&&y<=q.y+q.h);if(q){sel=q.id;info.innerHTML='<b>'+B[q.id][0]+'</b><p style="margin:.4em 0 0">'+B[q.id][1]+'</p>'}});
 animate(O,dt=>{t+=dt});const info=h('div',{cls:'card',style:'margin-top:12px;min-height:90px'},h('b',{},B.spule[0]),h('p',{style:'margin:.4em 0 0'},B.spule[1]));b.append(info);
 const sg=h('div',{cls:'seg'});[['sat','+ Magnetische Sättigung (Fe-Werkstoffe)'],['mark','+ Bewertung & Markierung'],['selbst','+ Selbstüberwachung']].forEach(([k,l])=>{const x=btn(sg,l,()=>{opt[k]=!opt[k];x.classList.toggle('pri',opt[k]);O.redraw()})});b.append(sg)});

sim('phase','Phasensteller und Auswertearten','Drehe den Phasensteller und wähle die Auswerteart. Ziel: Das <b>Fehlersignal</b> muss den Alarm auslösen, die <b>Störsignale</b> (Lift-off, Wackeln, Leitfähigkeit) dürfen es nicht. Welche Auswerteart funktioniert, wenn Fehler- und Störsignal gleich groß sind?',b=>{
 const S=[{n:'Fehler',a:.6,p:55,c:PH.g},{n:'Störung 1',a:.85,p:165,c:PH.r},{n:'Störung 2',a:.4,p:-60,c:PH.a}];const P={ph:0,thr:.45,mode:'amp',gain:1};let t=0;
 const trig=s=>{const ang=(s.p+P.ph)*D2R,x=s.a*P.gain*Math.cos(ang),y=s.a*P.gain*Math.sin(ang);if(P.mode==='amp')return Math.hypot(x,y)>=P.thr;if(P.mode==='y')return y>=P.thr;const d=Math.abs((((s.p+P.ph)-90)%360+540)%360-180);return Math.hypot(x,y)>=P.thr&&d<=25};
 const O=cvs(b,{ar:w=>w<620?1.1:.62,dark:true,draw:(c,w,hh)=>{const narrow=w<620;const sw=narrow?w:Math.min(w*.62,hh*1.12);const Sc=G.screen(c,0,0,sw,narrow?w*.92:hh,{label:'Bildschirm · Impedanzebene',bezel:8});
  const s=Math.min(Sc.w,Sc.h)-20,cx=Sc.cx,cy=Sc.cy,R=s/2;const r=P.thr*R;
  c.save();G.rr(c,Sc.x,Sc.y,Sc.w,Sc.h,8);c.clip();
  if(P.mode==='amp'){c.fillStyle=G.rgba(PH.r,.08);c.fillRect(Sc.x,Sc.y,Sc.w,Sc.h);c.fillStyle='rgba(2,10,6,1)';c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();c.strokeStyle=G.rgba(PH.r,.9);c.lineWidth=2;c.shadowColor=PH.r;c.shadowBlur=8;c.stroke()}
  else if(P.mode==='y'){c.fillStyle=G.rgba(PH.r,.1);c.fillRect(Sc.x,Sc.y,Sc.w,cy-r-Sc.y);c.strokeStyle=PH.r;c.lineWidth=2;c.shadowColor=PH.r;c.shadowBlur=8;c.beginPath();c.moveTo(Sc.x,cy-r);c.lineTo(Sc.x+Sc.w,cy-r);c.stroke()}
  else{c.fillStyle=G.rgba(PH.r,.1);c.beginPath();c.moveTo(cx,cy);c.arc(cx,cy,R*1.6,-(90+25)*D2R,-(90-25)*D2R);c.closePath();c.fill();c.fillStyle='rgba(2,10,6,1)';c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();c.strokeStyle=G.rgba(PH.r,.85);c.lineWidth=1.8;c.setLineDash([6,4]);c.beginPath();c.moveTo(cx+Math.cos(-(115)*D2R)*r,cy+Math.sin(-(115)*D2R)*r);c.lineTo(cx+Math.cos(-(115)*D2R)*R*1.6,cy+Math.sin(-(115)*D2R)*R*1.6);c.moveTo(cx+Math.cos(-(65)*D2R)*r,cy+Math.sin(-(65)*D2R)*r);c.lineTo(cx+Math.cos(-(65)*D2R)*R*1.6,cy+Math.sin(-(65)*D2R)*R*1.6);c.stroke();c.setLineDash([]);c.beginPath();c.arc(cx,cy,r,-(115)*D2R,-(65)*D2R);c.stroke()}
  c.shadowBlur=0;
  S.forEach((q,i)=>{const ang=(q.p+P.ph)*D2R;const L=q.a*P.gain*R;const pts=[];for(let k=0;k<=60;k++){const u=k/60*TAU;const a=Math.sin(u)*.5+.5;const wob=Math.sin(u*2)*.07;pts.push([cx+Math.cos(ang)*L*Math.sin(u/2)+Math.cos(ang+Math.PI/2)*L*wob*Math.sin(u/2),cy-Math.sin(ang)*L*Math.sin(u/2)-Math.sin(ang+Math.PI/2)*L*wob*Math.sin(u/2)])}
   G.trace(c,pts,q.c,1.8);const x=cx+Math.cos(ang)*L,y=cy-Math.sin(ang)*L;if(trig(q)){c.strokeStyle='#fff';c.lineWidth=2;c.shadowColor='#fff';c.shadowBlur=10;c.beginPath();c.arc(x,y,10+2*Math.sin(t*8),0,TAU);c.stroke();c.shadowBlur=0}G.spot(c,x,y,q.c,3)});
  c.restore();G.glass(c,Sc);
  // Legende / Alarmtafel
  const lx=narrow?14:sw+16,ly=narrow?w*.92+16:20,lw=narrow?(w-28):w-sw-28;const ts=S.map(trig);
  S.forEach((q,i)=>{const x=narrow?lx+i*(lw/3):lx,y=narrow?ly:ly+i*58,bw=narrow?lw/3-8:lw;c.fillStyle='#0f1a22';G.rr(c,x,y,bw,48,10);c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.stroke();
   G.led(c,x+18,y+24,ts[i],i===0?'#3dff95':'#ff3b4a',7);G.text(c,q.n,x+34,y+20,{size:11.5,weight:700,col:'#d9e6f2'});G.text(c,ts[i]?'ALARM':'unterdrückt',x+34,y+37,{size:11,weight:600,col:ts[i]?(i===0?'#3dff95':'#ff7b86'):'#7f93a6'})});
  const ok=ts[0]&&!ts[1]&&!ts[2];const vy=narrow?ly+60:ly+3*58+6;c.fillStyle=ok?'rgba(61,255,149,.12)':'rgba(255,93,108,.1)';G.rr(c,lx,vy,narrow?lw:lw,40,10);c.fill();G.text(c,ok?'✔ Trennung erreicht':ts[0]?'Störungen lösen mit aus':'Fehler wird nicht erkannt',lx+12,vy+25,{size:12.5,weight:750,col:ok?'#3dff95':'#ff7b86'})
  if(!narrow)G.knob(c,lx+lw/2,vy+100,26,P.ph/360,'PHASE '+Math.round(P.ph)+'°')}});
 animate(O,dt=>{t+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>{O.redraw();const ts=S.map(trig);const ok=ts[0]&&!ts[1]&&!ts[2];S.forEach((q,i)=>u('s'+i,ts[i]?'ALARM':'unterdrückt',(i===0)===ts[i]?'g':'r'));u('v',ok?'✔ Trennung erreicht':ts[0]?'Störungen lösen mit aus':'Fehler wird nicht erkannt',ok?'g':'r')};
 slider(cr,{label:'Phasensteller',min:0,max:360,step:1,value:0,unit:'°',on:v=>{P.ph=v;rd()}});slider(cr,{label:'Schwelle',min:.1,max:.9,step:.01,value:.45,fmt:v=>fmt(v*100,0)+' %',on:v=>{P.thr=v;rd()}});slider(cr,{label:'Verstärkung',min:.3,max:1.6,step:.05,value:1,fmt:v=>fmt(v,2)+' ×',on:v=>{P.gain=v;rd()}});
 seg(b,[['amp','Amplituden-Auswertung (Kreis)'],['y','Y-Komponente'],['sec','Sektor (Phase+Amplitude)']],'amp',v=>{P.mode=v;rd()});const u=readouts(b,[['s0','Fehler (grün)'],['s1','Lift-off/Wackeln (rot)'],['s2','Leitfähigkeit (gelb)'],['v','Ergebnis']]);setTimeout(rd,60);
 b.append(h('div',{cls:'cap'},'Amplitudenauswertung ist phasenunabhängig – einfach und sicher, wenn keine Störsignale gleicher Größe vorliegen. Y-Komponente und Sektor nutzen die Phasenlage zur Trennung (vorher Fehler- und Störsignale untersuchen!).'))});

sim('filter','NF-Filter: Nutz- zu Störsignalverhältnis verbessern','Das Fehlersignal (zwei Impulse) liegt auf langsamer Leitfähigkeitsdrift und Vibration. Wähle HP, TP oder BP und stelle die Grenzfrequenzen ein. Erhöhe die Prüfgeschwindigkeit: Der Impuls wird schneller und das Fenster ändert sich. Faustregel: Bandpass von 0,5× bis 2× der Liniengeschwindigkeit.',b=>{
 const N=1000,dt=.001,P={v:1,type:'bp',hp:5,tp:100};let raw=[],pulses=[];
 const gen=()=>{srand(11);raw=[];const fs=P.v/.05,sg=.35/fs;pulses=[[.4,1],[.7,.6]];for(let n=0;n<N;n++){const t=n*dt;let y=.8*Math.sin(TAU*.6*t+1)+.35*Math.sin(TAU*5*t)+.06*gauss();pulses.forEach(p=>y+=p[1]*Math.exp(-Math.pow((t-p[0])/sg,2)/2));raw.push(y)}};
 const filt=()=>{let y=raw.slice();if(P.type==='hp'||P.type==='bp'){const a=1/(1+TAU*P.hp*dt);for(let k=0;k<2;k++){const o=[];let prev=y[0],po=0;for(let n=0;n<N;n++){po=a*(po+y[n]-prev);prev=y[n];o.push(po)}y=o}}
  if(P.type==='tp'||P.type==='bp'){const al=1-Math.exp(-TAU*P.tp*dt);for(let k=0;k<2;k++){let s=y[0];y=y.map(v=>(s+=al*(v-s)))}}return y};
 const H=f=>{let g=1;if(P.type==='hp'||P.type==='bp')g*=Math.pow(f/P.hp,2)/(1+Math.pow(f/P.hp,2));if(P.type==='tp'||P.type==='bp')g*=1/(1+Math.pow(f/P.tp,2));return g};
 const O=cvs(b,{ar:w=>w<620?1.25:.78,draw:(c,w,hh)=>{const y=filt();G.bench(c,w,hh,{dots:false});const narrow=w<620;const L=48,gap=narrow?50:44;
  const R1={x:L,y:14,w:narrow?w-L-12:w*.6-L,h:narrow?hh*.24:hh*.4},R2={x:L,y:R1.y+R1.h+gap-14,w:R1.w,h:R1.h},R3=narrow?{x:L,y:R2.y+R2.h+gap+4,w:w-L-12,h:hh-(R2.y+R2.h+gap+4)-40}:{x:w*.6+46,y:14,w:w*.4-58,h:hh-58};
  const m1=G.plot(c,R1,[0,1],[-2,2],{nx:5,ny:2,yf:v=>fmt(v,0),noxl:true,zero:true,title:'Rohsignal: Fehler + Drift + Vibration'});c.save();c.beginPath();c.rect(R1.x,R1.y,R1.w,R1.h);c.clip();G.line(c,raw.map((v,n)=>[m1.x(n*dt),m1.y(v)]),T.faint,1.4);pulses.forEach(p=>G.dot(c,m1.x(p[0]),R1.y+10,3.5,T.orange,{ring:false}));c.restore();
  const m2=G.plot(c,R2,[0,1],[-2,2],{nx:5,ny:2,xl:'Zeit in s',yf:v=>fmt(v,0),zero:true,title:'nach Filter'});
  const nz=[];let pk=0;pulses.forEach(p=>{for(let n=Math.floor((p[0]-.05)*N);n<Math.floor((p[0]+.05)*N);n++)pk=Math.max(pk,Math.abs(y[n]))});for(let n=100;n<N-50;n++){if(!pulses.some(p=>Math.abs(n*dt-p[0])<.08))nz.push(Math.abs(y[n]))}const noise=Math.max(...nz),sn=pk/noise;
  c.save();c.beginPath();c.rect(R2.x,R2.y,R2.w,R2.h);c.clip();c.fillStyle=G.rgba(T.orange,.09);c.fillRect(R2.x,m2.y(noise),R2.w,m2.y(-noise)-m2.y(noise));G.hline(c,m2,noise,T.orange);G.hline(c,m2,-noise,T.orange);G.curve(c,y.map((v,n)=>[m2.x(n*dt),m2.y(v)]),T.blue,{lw:1.8});c.restore();
  G.label(c,'Störband',R2.x+R2.w-8,m2.y(noise)-10,{align:'right',size:10.5,col:T.orange});
  // Frequenzgang
  const fs=P.v/.05;const m3=G.plot(c,R3,[.1,1000],[0,1.1],{xlog:true,ny:2,xl:'Frequenz in Hz',yf:v=>fmt(v,1),title:'Filter-Durchlass |H(f)|'});const hp=[];for(let e=-1;e<=3;e+=.02){const f=Math.pow(10,e);hp.push([m3.x(f),m3.y(H(f))])}
  c.save();c.beginPath();c.rect(R3.x,R3.y,R3.w,R3.h);c.clip();G.curve(c,hp,T.teal,{fill:R3.y+R3.h,lw:2.4,fa:.3});c.restore();
  [[.6,'Drift',T.faint],[5,'Vibration',T.violet],[fs,'Fehler',T.orange]].forEach(([f,l,col],i)=>{if(f<.1||f>1000)return;const x=m3.x(f);G.line(c,[[x,R3.y+R3.h],[x,R3.y+22+i*16]],col,2);G.dot(c,x,R3.y+22+i*16,4,col);G.label(c,l,x+(f>200?-6:6),R3.y+22+i*16,{size:10.5,col,align:f>200?'right':'left'})});
  u('sn',fmt(sn,1)+' : 1',sn>=3?'g':'r');u('fs',fmt(fs,0)+' Hz');u('ok',sn>=3?'≥ 3:1 – ausreichend':'< 3:1 – zu viele Pseudoanzeigen',sn>=3?'g':'r')}});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>{gen();O.redraw()};slider(cr,{label:'Prüfgeschwindigkeit v',min:.3,max:5,step:.1,value:1,unit:'m/s',on:v=>{P.v=v;rd()}});slider(cr,{label:'Hochpass-Grenze',min:.5,max:80,log:true,value:5,unit:'Hz',on:v=>{P.hp=v;O.redraw()}});slider(cr,{label:'Tiefpass-Grenze',min:5,max:400,log:true,value:100,unit:'Hz',on:v=>{P.tp=v;O.redraw()}});
 seg(b,[['none','ohne Filter'],['hp','Hochpass'],['tp','Tiefpass'],['bp','Bandpass']],'bp',v=>{P.type=v;O.redraw()});const u=readouts(b,[['fs','Signalfrequenz ≈ v/Wirkbreite'],['sn','Nutz : Stör'],['ok','Bewertung']]);rd()});

sim('korr','Korrelationsauswertung: Pseudo-Fehler unterdrücken','Zwei identische Differenzspulensysteme im Abstand a erzeugen für einen echten Fehler zwei Signale im zeitlichen Abstand t = a/v. Stelle die elektronische Verzögerung auf diesen Wert: Nur zeitgleiche Signale gelten als Fehler.',b=>{
 const P={a:80,v:2,dl:40,noise:4};let spikes=[],tt=0;const gen=()=>{srand(5);spikes=[];for(let i=0;i<P.noise;i++)spikes.push([rnd()*.8+.05,(rnd()<.5?1:2),.5+.4*rnd()])};
 const O=cvs(b,{ar:w=>w<620?1.15:.78,dark:true,draw:(c,w,hh)=>{c.fillStyle='#0b1218';c.fillRect(0,0,w,hh);const td=P.a/P.v;const top=hh*.24;
  // Anlage: Rohr mit zwei Spulensystemen
  const ty=top*.52,tr=Math.min(top*.22,16),x1=w*.34,x2=x1+clamp(P.a/200,.1,1)*w*.4;const fx=w*.08+((tt*.15)%1)*w*.9;
  [x1,x2].forEach(x=>{[-7,7].forEach(o=>G.ringCoil(c,x+o,ty,tr*.42,tr*1.45,9,'back',{n:3}))});G.tube(c,0,w,ty,tr,'steel');c.fillStyle='#ff5d6c';c.fillRect(fx,ty-tr,5,tr*.6);
  [x1,x2].forEach((x,i)=>{[-7,7].forEach(o=>G.ringCoil(c,x+o,ty,tr*.42,tr*1.45,9,'front',{n:3}));G.stext(c,'System '+(i+1),x,ty-tr*1.6-6,{align:'center',col:'#cfe3f0',size:10.5})});
  G.arrow(c,x1,ty+tr*1.7+6,x2,ty+tr*1.7+6,'#9fb3c8',{lw:1.3,head:7,both:true});G.stext(c,'a = '+P.a+' mm',(x1+x2)/2,ty+tr*1.7+20,{align:'center',col:'#cfe3f0',size:10.5});G.stext(c,'v = '+fmt(P.v,1)+' m/s →',w-10,top-4,{align:'right',col:'#9fb3c8',size:10.5});
  const rows=[['System 1',0],['System 2',1],['System 1, elektronisch verzögert',2],['UND-Verknüpfung (Korrelation)',3]];const rh=(hh-top-10)/4;const T0=.5;const xs=t=>52+t/T0*(w-64);
  const sig=ch=>{return t=>{let y=.05*Math.sin(t*900);if(ch===1)y+=Math.exp(-Math.pow((t-0.15)/.006,2));if(ch===2)y+=Math.exp(-Math.pow((t-0.15-td/1000)/.006,2));spikes.forEach(s=>{if(s[1]===ch)y+=s[2]*Math.exp(-Math.pow((t-s[0]*T0)/.006,2))});return y}};
  const s1=sig(1),s2=sig(2);const th=.5;let hit=false;
  rows.forEach(([n,k])=>{const y0=top+k*rh,R={x:8,y:y0+3,w:w-16,h:rh-6};const S=G.screen(c,R.x,R.y,R.w,R.h,{bezel:0,nx:10,ny:2,axes:false});G.stext(c,n,S.x+8,S.y+14,{size:10.5});const pts=[];
   for(let i=0;i<=500;i++){const t=i/500*T0;let v;if(k===0)v=s1(t);else if(k===1)v=s2(t);else if(k===2)v=s1(t-P.dl/1000);else{const a=s1(t-P.dl/1000)>th&&s2(t)>th;v=a?1.2:0;if(a)hit=true}pts.push([xs(t),S.y+S.h-6-clamp(v,0,1.3)/1.3*(S.h-22)])}
   G.trace(c,pts,k===3?PH.r:k===2?PH.c:PH.g,1.6,{blur:4});if(k<3){const ty2=S.y+S.h-6-th/1.3*(S.h-22);G.line(c,[[S.x,ty2],[S.x+S.w,ty2]],G.rgba(PH.a,.7),1,{dash:[4,4]})}});
  G.stext(c,'t = a/v = '+fmt(td,1)+' ms',w-14,top+18,{align:'right',col:PH.a,size:11.5});u('t',fmt(td,1)+' ms');u('r',hit?'Fehler erkannt':'kein Fehler gemeldet',hit?'g':'r')}});
 animate(O,dt=>{tt+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>{gen();O.redraw()};slider(cr,{label:'Spulenabstand a',min:20,max:200,step:5,value:80,unit:'mm',on:v=>{P.a=v;rd()}});slider(cr,{label:'Prüfgeschwindigkeit v',min:.5,max:10,step:.1,value:2,unit:'m/s',on:v=>{P.v=v;rd()}});slider(cr,{label:'Elektronische Verzögerung',min:1,max:200,step:.5,value:40,unit:'ms',on:v=>{P.dl=v;O.redraw()}});slider(cr,{label:'Störimpulse (Vibration)',min:0,max:10,step:1,value:4,on:v=>{P.noise=v;rd()}});
 const u=readouts(b,[['t','erwartete Verzögerung a/v'],['r','Ergebnis']]);rd()});

sim('spulen','Spulensysteme und Anwendungsübersicht (Tab. 2.2)','Wähle eine Prüfaufgabe: Die empfohlenen Sensortypen (Durchlauf-, Segment-, Tastsensor; Differenz- oder Absolutschaltung) leuchten auf. Tippe einen Sensor in der Grafik an für seine Kenndaten.',b=>{
 const rows=[['Oberflächenprüfung von Stangen und Rohren bei mittlerer Prüfempfindlichkeit',[0]],['Überwachung der geschweißten Zone (offen/geschweißt) von Rohren',[1,3]],['Schweißnahtfehlerprüfung bei geschweißten Rohren',[0,2]],['Manuelle Schweißnahtprüfung',[2,3]],['Sortierung von Masseteilen, z. B. Schrauben (Fremdvergleich)',[1]],['Stückgutsortierung, z. B. Kurbelwellen',[1,5]],['Messung physikalischer Werkstoffeigenschaften (Leitfähigkeit, Ferritgehalt)',[5]],['Schichtdickenmessung',[5]],['Oberflächenrissprüfung mit hoher Fehlerauflösung an ebenen Flächen',[4]],['Rissprüfung mit hoher Auflösung in Bohrungen (rotierendes System)',[4]],['Rissprüfung mit hoher Auflösung an rotationssymmetrischen Körpern',[4]]];
 const cols=['Durchlauf Diff.','Durchlauf Abs.','Segment Diff.','Segment Abs.','Tast Diff.','Tast Abs.'];let cur=0,pickT=null,t=0,hits=[];
 const T2={d:['Durchlaufsensor (Koaxialsensor)','Meistverwendet für Oberflächenprüfung von Stangen, Rohren, Drähten (rund/profiliert) bei mittlerer Empfindlichkeit; auch Sortierung von Massenteilen. Abmessungsbereich 1–170 mm. Nachweis bei Rohren: Außenfehler 10 % und Innenfehler 20 % der Wanddicke (Wanddicke 1–5 mm); Vollmaterial: 1 % des Durchmessers, mind. 0,1 mm. Meist transformatorische Schaltung, oft Mehrfachdifferenz.'],s:['Segmentsensor','Höhere Empfindlichkeit durch kleineres Wechselwirkungsvolumen; Feld- und Messspule stehen senkrecht (entkoppelt, selbstabgleichend). Nahtzone geschweißter Rohre (v. a. große Durchmesser), Handprüfung von Schweißnähten. Wirkbreite bei Radien > 100 mm ca. ±30 mm.'],t:['Tastsensor','Reflexionsanordnung dominiert (Transmission = „Gabelspule“). Zwei Einsatzbereiche: physikalische/geometrische Größen (Absolutverfahren: Leitfähigkeit, Ferrit, Schichtdicke) und Fehlerprüfung (Differenzverfahren). Fehlertiefen bis ca. 50 µm auffindbar.']};
 const sel=h('select',{onchange:e=>{cur=+e.target.value;mark();O.redraw()},style:'width:100%;font-size:15px'},rows.map((r,i)=>h('option',{value:i},r[0])));b.append(sel);
 const O=cvs(b,{ar:w=>w<620?.95:.4,draw:(c,w,hh)=>{G.bench(c,w,hh);const narrow=w<620;const n=3,cw=narrow?w:w/3,ch=narrow?hh/3:hh;hits=[];const rec=rows[cur][1];
  ['d','s','t'].forEach((k,i)=>{const x=narrow?0:i*cw,y=narrow?i*ch:0,cx=x+cw/2,cy=y+ch*.47;const dIdx=i*2,aIdx=i*2+1;const on=rec.includes(dIdx)||rec.includes(aIdx);hits.push({k,x,y,w:cw,h:ch});
   c.save();if(on){c.shadowColor=G.rgba(T.teal,.55);c.shadowBlur=20}c.fillStyle=on?G.rgba(T.teal,.08):'transparent';G.rr(c,x+8,y+8,cw-16,ch-16,16);c.fill();c.restore();c.strokeStyle=on?T.teal:T.grid;c.lineWidth=on?2.2:1;G.rr(c,x+8,y+8,cw-16,ch-16,16);c.stroke();
   const s=Math.min(cw,ch*(narrow?2.6:1.2))*.32;
   if(k==='d'){G.ringCoil(c,cx-s*.25,cy,s*.16,s*.5,s*.25,'back');G.ringCoil(c,cx+s*.25,cy,s*.16,s*.5,s*.25,'back');G.tube(c,cx-s*1.1,cx+s*1.1,cy,s*.3,'steel',{hollow:true});const ph=(t*.25)%1;c.fillStyle='#ff5d6c';c.fillRect(cx-s*1.05+ph*s*2,cy-s*.3,s*.08,s*.18);G.ringCoil(c,cx-s*.25,cy,s*.16,s*.5,s*.25,'front',{glow:on?T.teal:null});G.ringCoil(c,cx+s*.25,cy,s*.16,s*.5,s*.25,'front',{glow:on?T.teal:null})}
   if(k==='s'){G.tube(c,cx-s*1.1,cx+s*1.1,cy+s*.2,s*.42,'steel',{hollow:true});c.save();c.strokeStyle=DARK?'#b7c4d0':'#5a6b7a';c.lineWidth=2;c.setLineDash([4,3]);c.beginPath();c.moveTo(cx-s*1.1,cy+s*.2);c.lineTo(cx+s*1.1,cy+s*.2);c.stroke();c.restore();
    c.save();c.shadowColor=T.shadow;c.shadowBlur=8;G.metal(c,cx-s*.42,cy-s*.58,s*.84,s*.32,'plastic',{r:6});c.restore();G.coil(c,cx-s*.15,cy-s*.42,s*.3,s*.1,4,{leads:false,lw:2});G.coil(c,cx+s*.18,cy-s*.42,s*.22,s*.1,3,{axis:'v',leads:false,lw:2});if(on)G.label(c,'⊥ entkoppelt',cx,cy-s*.75,{align:'center',size:10,col:T.teal})}
   if(k==='t'){G.slab(c,cx-s*1.05,cy+s*.35,s*2,s*.3,s*.3,s*.14,'alu',{shadow:false});G.eddies(c,cx+s*.15,cy+s*.28,s*.32,s*.07,{t,n:3,I:.8});G.probe(c,cx,cy+s*.26,s*.34,{len:s*1.05,I:on?.6:0,glow:on?T.teal:null})}
   G.text(c,T2[k][0].replace(' (Koaxialsensor)',''),cx,y+ch-18,{align:'center',size:12.5,weight:750,col:on?T.teal:T.ink2});
   const tg=[[dIdx,'Diff.'],[aIdx,'Abs.']];tg.forEach(([idx,l],q)=>{const a=rec.includes(idx);G.label(c,(a?'✔ ':'')+l,cx+(q?34:-34),y+26,{align:'center',size:10.5,col:a?'#fff':T.faint,bg:a?T.teal:T.lblBg,border:!a})})})}});
 O.drag((x,y,tp)=>{if(tp!=='down')return;const q=hits.find(q=>x>=q.x&&x<q.x+q.w&&y>=q.y&&y<q.y+q.h);if(q)info.innerHTML='<b>'+T2[q.k][0]+'</b><p style="margin:.4em 0 0">'+T2[q.k][1]+'</p>'});animate(O,dt=>{t+=dt});
 const tb=h('div',{cls:'tw'});b.append(tb);const mark=()=>{tb.innerHTML='';const tt=h('table',{},h('tr',{},cols.map(c=>h('th',{style:'text-align:center'},c))),h('tr',{},cols.map((c,k)=>h('td',{style:'text-align:center;font-size:22px;'+(rows[cur][1].includes(k)?'background:var(--okbg);color:var(--ok)':'color:var(--line2)')},rows[cur][1].includes(k)?'✔':'–'))));tb.append(tt)};mark();
 const info=h('div',{cls:'card'},'Sensor in der Grafik antippen …');b.append(info);
 b.append(h('div',{html:'<h3>Schaltungsarten</h3><div class="tw"><table><tr><th>Schaltung</th><th>Vorteile</th><th>Nachteile</th></tr><tr><td>Transformatorisch</td><td>sehr stabile Sekundärspannung (galvanisch getrennt), häufigste Art</td><td>großer Raumbedarf, viele Anschlüsse</td></tr><tr><td>Brücke</td><td>weniger Platz, nur 3-poliger Anschluss; nur Differenzsysteme</td><td>kleinere Messspannung, größere Temperaturabhängigkeit</td></tr><tr><td>Parametrisch</td><td>einfachste Anordnung, 1 Wicklung, 2 Anschlüsse (Absolutsystem)</td><td>große Temperaturabhängigkeit des Kupferwiderstands</td></tr></table></div>'}))});
