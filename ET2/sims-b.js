"use strict";
/* =====================================================================
   Scan-Engine (V6, V13), V3 Permeabilität, V4 Leitfähigkeit, V5 Objektkunde
   ===================================================================== */
function mkScan(b,cfg){
 const weld=cfg.weld;const W=100,H=60;
 const cracks=weld?[{x1:20,y1:41,x2:36,y2:41,d:1.0,n:'Längsriss in der WEZ'},{x1:60,y1:25,x2:60,y2:35,d:1.0,n:'Querriss im Schweißgut'},{x1:82,y1:21,x2:88,y2:21,d:.5,n:'kurzer Riss (0,5 mm tief)'}]
  :[{x1:22,y1:18,x2:22,y2:30,d:1.0,n:'Radialriss (1,0 mm)'},{x1:52,y1:42,x2:60,y2:42,d:.5,n:'kurzer Riss (0,5 mm)'},{x1:76,y1:14,x2:81,y2:21,d:.3,n:'flacher Riss (0,3 mm)'},{x1:40,y1:20,x2:40,y2:23,d:.8,n:'Anriss an Bohrung'}];
 cracks.forEach((c,ci)=>{c.pts=[];const L=Math.hypot(c.x2-c.x1,c.y2-c.y1);c.L=L;const n=Math.max(6,Math.round(L*3));for(let i=0;i<=n;i++)c.pts.push([lerp(c.x1,c.x2,i/n),lerp(c.y1,c.y2,i/n)]);
  srand(31+ci);c.jag=c.pts.map((p,i)=>{const nx=-(c.y2-c.y1)/L,ny=(c.x2-c.x1)/L,j=(i&&i<n)?(rnd()-.5)*.6:0;return[p[0]+nx*j,p[1]+ny*j]})});
 const P={f:300,ph:0,gain:1,thr:.4,lift:0,type:'abs',axis:0,mode:'amp',sensor:'conv',coat:0,show:false};const sg=2.4,plate={x0:5,y0:5,x1:95,y1:55};let pos=[10,10],prev=[10,10],tt=0;
 let trail=[],strip=[],found=new Set(),falseA=0,alarm=false,cov=new Uint8Array(W*H),covN=0,lastFalse=-9;
 const dAng=()=>20+70*(1-Math.exp(-P.f/180));const gw=d2=>Math.exp(-d2/(2*sg*sg));
 const feat=(x,y)=>{let s=[0,0];const af=.5+.5*(1-Math.exp(-P.f/100)),ca=weld?Math.exp(-P.coat/.72):1;
  cracks.forEach(c=>{let w=0;c.pts.forEach(p=>w+=gw((p[0]-x)**2+(p[1]-y)**2));w*=(c.L/c.pts.length)/(sg*2.5066);const dep=1-Math.exp(-c.d/.6);const A=.9*w*dep*af*ca*(weld&&P.sensor==='opt'?.85:1);
   const phi=(180-dAng()*(.75+.25*Math.min(c.d,1.5)/1.5))*D2R;s=Cx.add(s,Cx.pol(A,phi))});
  const di=Math.min(x-plate.x0,plate.x1-x,y-plate.y0,plate.y1-y);const e=1/(1+Math.exp(di/(.55*sg)));s=Cx.add(s,Cx.pol(1.1*e,(180-12)*D2R));
  if(!weld){const dh=Math.hypot(x-40,y-30)-5;s=Cx.add(s,Cx.pol(.9/(1+Math.exp(dh/(.5*sg))),(180-8)*D2R))}
  if(weld&&P.sensor==='conv'){const dy=Math.abs(y-30);const bead=Math.exp(-Math.pow(dy/6,4));const haz=Math.exp(-Math.pow((dy-9)/4,2));const nz=Math.sin(x*.9+y*.3)*.5+Math.sin(x*2.3-y)*.35;s=Cx.add(s,Cx.pol(.55*bead+.25*haz+.25*bead*nz,(170+25*nz)*D2R))}
  else if(weld){const dy=Math.abs(y-30);s=Cx.add(s,Cx.pol(.05*Math.exp(-Math.pow(dy/6,4)),0))}
  return Cx.add(s,Cx.pol(.1*Math.sin(x/16+y/22),-70*D2R))};
 const sample=()=>{let s;if(P.type==='abs'){s=feat(pos[0],pos[1]);const lo=.9*(1-Math.exp(-P.lift/.4));const jit=P.lift>0?1+.5*gauss():1;s=Cx.add(s,Cx.pol(lo*jit,Math.PI))}
  else{const u=P.axis*D2R,dx=Math.cos(u)*2.2,dy=Math.sin(u)*2.2;s=Cx.sc(Cx.sub(feat(pos[0]+dx,pos[1]+dy),feat(pos[0]-dx,pos[1]-dy)),2.2);if(P.lift>0)s=Cx.add(s,Cx.pol(.04*P.lift*gauss(),1))}
  return Cx.add(s,[.012*gauss(),.012*gauss()])};
 const rot0=s=>Cx.mul(Cx.sc(s,P.gain),Cx.pol(1,P.ph*D2R));
 const cols=h('div',{cls:'cols c32'});b.append(cols);const off=document.createElement('canvas');off.width=W;off.height=H;const oc=off.getContext('2d');
 // statisches Prüfteil (gecacht)
 let bg=null,bgKey='';const plateImg=(w,hh)=>{const key=w+'x'+hh+DARK;if(bgKey===key)return bg;bgKey=key;const d=Math.min(2,devicePixelRatio||1);bg=document.createElement('canvas');bg.width=w*d;bg.height=hh*d;const c=bg.getContext('2d');c.scale(d,d);const k=w/W;
  c.fillStyle=DARK?'#0f1822':'#e3eaf1';c.fillRect(0,0,w,hh);c.fillStyle=DARK?'rgba(255,255,255,.03)':'rgba(15,40,70,.05)';for(let y=6;y<hh;y+=14)for(let x=6;x<w;x+=14)c.fillRect(x,y,1.2,1.2);
  G.metal(c,plate.x0*k,plate.y0*k,(plate.x1-plate.x0)*k,(plate.y1-plate.y0)*k,weld?'steel':'alu',{r:6,shadow:14});
  if(weld){const y0=18*k,y1=42*k;c.save();const g=c.createLinearGradient(0,y0,0,y1);[[0,'rgba(80,110,200,0)'],[.08,'rgba(80,110,200,.25)'],[.16,'rgba(170,110,200,.28)'],[.24,'rgba(220,170,80,.35)'],[.5,'rgba(220,170,80,.1)'],[.76,'rgba(220,170,80,.35)'],[.84,'rgba(170,110,200,.28)'],[.92,'rgba(80,110,200,.25)'],[1,'rgba(80,110,200,0)']].forEach(([o,cl])=>g.addColorStop(o,cl));c.fillStyle=g;c.fillRect(plate.x0*k,y0,(plate.x1-plate.x0)*k,y1-y0);c.restore();
   G.metal(c,plate.x0*k,24*k,90*k,12*k,'weld',{shadow:6});c.save();c.beginPath();c.rect(plate.x0*k,24*k,90*k,12*k);c.clip();c.strokeStyle='rgba(60,40,10,.35)';c.lineWidth=1.2;for(let x=plate.x0*k-10;x<plate.x1*k+10;x+=k*1.6){c.beginPath();c.moveTo(x,24*k);c.quadraticCurveTo(x+k*2.6,30*k,x,36*k);c.stroke()}
   const gl=c.createLinearGradient(0,24*k,0,36*k);gl.addColorStop(0,'rgba(0,0,0,.25)');gl.addColorStop(.35,'rgba(255,255,255,.35)');gl.addColorStop(1,'rgba(0,0,0,.3)');c.fillStyle=gl;c.fillRect(plate.x0*k,24*k,90*k,12*k);c.restore();
   G.label(c,'Schweißraupe',w*.5,30*k,{align:'center',size:11,col:'#5a3f10'});G.label(c,'WEZ',plate.x0*k+24,20.5*k,{align:'center',size:10,col:'#7a4fa0'})}
  else{const hx=40*k,hy=30*k,hr=5*k;const g=c.createRadialGradient(hx-hr*.3,hy-hr*.3,hr*.1,hx,hy,hr);g.addColorStop(0,DARK?'#05080b':'#2a333c');g.addColorStop(.8,DARK?'#111a22':'#4a5560');g.addColorStop(1,'#8a96a2');c.fillStyle=g;c.beginPath();c.arc(hx,hy,hr,0,TAU);c.fill();c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1.5;c.beginPath();c.arc(hx,hy,hr,.6*Math.PI,1.6*Math.PI);c.stroke();G.label(c,'Bohrung',hx,hy+hr+12,{align:'center',size:10,col:T.mute})}
  return bg};
 const cvP=cvs(cols,{ar:.62,draw:(c,w,hh)=>{const k=w/W;c.drawImage(plateImg(w,hh),0,0,w,hh);
  c.save();c.globalAlpha=DARK?.4:.32;c.imageSmoothingEnabled=true;c.drawImage(off,0,0,w,H*k);c.restore();
  cracks.forEach((q,i)=>{const f=found.has(i);c.save();c.lineCap='round';c.lineJoin='round';const P2=q.jag.map(p=>[p[0]*k,p[1]*k]);
   G.line(c,P2,'rgba(20,24,28,'+(P.show||f?.85:.12)+')',P.show||f?2:1.2);if(P.show||f){G.line(c,P2,f?G.rgba(T.green,.85):G.rgba(T.red,.7),5,{alpha:.45,glow:10});const mx=(q.x1+q.x2)/2*k,my=(q.y1+q.y2)/2*k;G.label(c,(f?'✔ ':'')+q.n,mx,my-12,{align:'center',size:10,col:f?T.green:T.red})}c.restore()});
  const px=pos[0]*k,py=pos[1]*k,rr=sg*k*1.35;c.save();c.shadowColor='rgba(0,0,0,.45)';c.shadowBlur=14;c.shadowOffsetX=6;c.shadowOffsetY=8;
  const body=(x,y,r)=>{const g=c.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);g.addColorStop(0,'#6fa4d6');g.addColorStop(.6,'#2f5f8a');g.addColorStop(1,'#163250');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()};
  if(P.type==='abs')body(px,py,rr);else{const u=P.axis*D2R,dx=Math.cos(u)*2.2*k,dy=Math.sin(u)*2.2*k;c.save();c.translate(px,py);c.rotate(u);const g=c.createLinearGradient(0,-rr,0,rr);g.addColorStop(0,'#6fa4d6');g.addColorStop(.5,'#2f5f8a');g.addColorStop(1,'#163250');c.fillStyle=g;G.rr(c,-Math.hypot(dx,dy)-rr*.8,-rr*.8,2*Math.hypot(dx,dy)+rr*1.6,rr*1.6,rr*.8);c.fill();c.restore()}
  c.restore();
  const coilC=(x,y,r)=>{c.strokeStyle=alarm?'#ff5d6c':'#ffc58f';c.lineWidth=2;c.shadowColor=alarm?'#ff3b4a':'#ffb000';c.shadowBlur=alarm?14:6;c.beginPath();c.arc(x,y,r,0,TAU);c.stroke();c.shadowBlur=0;c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(x,y,1.8,0,TAU);c.fill()};
  if(P.type==='abs')coilC(px,py,rr*.62);else{const u=P.axis*D2R,dx=Math.cos(u)*2.2*k,dy=Math.sin(u)*2.2*k;[-1,1].forEach(s=>coilC(px+s*dx,py+s*dy,sg*k*.55))}
  G.led(c,w-18,16,alarm,'#ff3b4a',6);G.label(c,TOUCH?'☝ Sonde mit dem Finger führen':'Sonde mit der Maus führen',8,hh-14,{size:10.5,col:T.mute})}});
 cvP.drag((x,y,t)=>{if(t==='down'||t==='move'){const k=cvP.w/W;pos=[clamp(x/k,2,98),clamp(y/k,2,58)]}});
 const cvS=cvs(cols,{ar:1.02,dark:true,draw:(c,w,hh)=>{c.fillStyle='#0b1218';c.fillRect(0,0,w,hh);const s=Math.min(w-8,hh*.7);const S=G.screen(c,(w-s)/2,2,s,s,{label:'Impedanzebene',right:P.ph+'°',bezel:6});const cx=S.cx,cy=S.cy,R=S.w/2*.92;const r=P.thr*R;
  c.save();G.rr(c,S.x,S.y,S.w,S.h,8);c.clip();if(P.mode==='amp'){c.fillStyle=G.rgba(PH.r,.07);c.fillRect(S.x,S.y,S.w,S.h);c.fillStyle='#03100a';c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();c.strokeStyle=PH.r;c.lineWidth=1.8;c.shadowColor=PH.r;c.shadowBlur=8;c.stroke()}else{c.fillStyle=G.rgba(PH.r,.08);c.fillRect(S.x,S.y,S.w,cy-r-S.y);c.strokeStyle=PH.r;c.lineWidth=1.8;c.shadowColor=PH.r;c.shadowBlur=8;c.beginPath();c.moveTo(S.x,cy-r);c.lineTo(S.x+S.w,cy-r);c.stroke()}c.shadowBlur=0;
  const tp=trail.map(v=>{const q=rot0(v);return[cx+clamp(q[0],-1.2,1.2)*R,cy-clamp(q[1],-1.2,1.2)*R]});G.persist(c,tp,alarm?PH.r:PH.g,2);if(tp.length)G.spot(c,tp[tp.length-1][0],tp[tp.length-1][1],alarm?PH.r:PH.g,4);c.restore();G.glass(c,S);
  const sy=S.y+S.h+8+6,sh=hh-sy-4;const S2=G.screen(c,(w-s)/2,sy-6,s,sh+6,{bezel:0,nx:10,ny:4,axes:false,label:P.mode==='amp'?'Amplitude (y-t)':'Y-Komponente (y-t)'});
  const ty=S2.y+S2.h-4-P.thr*(S2.h-18);G.line(c,[[S2.x,ty],[S2.x+S2.w,ty]],G.rgba(PH.r,.8),1.2,{dash:[5,4]});G.trace(c,strip.map((v,i)=>[S2.x+i/200*S2.w,S2.y+S2.h-4-clamp(v,0,1.1)*(S2.h-18)]),PH.g,1.5,{blur:4})}});
 animate(cvS,dt=>{tt+=dt;const s=sample();trail.push(s);if(trail.length>90)trail.shift();const v=rot0(s);const val=P.mode==='amp'?Cx.abs(v):Math.max(0,v[1]);strip.push(val);if(strip.length>200)strip.shift();alarm=val>=P.thr&&dt>0;
  const ix=Math.round(pos[0]),iy=Math.round(pos[1]);for(let a=-3;a<=3;a++)for(let bb=-3;bb<=3;bb++){const X=ix+a,Y=iy+bb;if(X>=plate.x0&&X<plate.x1&&Y>=plate.y0&&Y<plate.y1&&a*a+bb*bb<=9&&!cov[Y*W+X]){cov[Y*W+X]=1;covN++;oc.fillStyle='#14b8a6';oc.fillRect(X,Y,1,1)}}prev=pos.slice();
  if(alarm){let hit=false;cracks.forEach((q,i)=>{const d=Math.min(...q.pts.map(p=>Math.hypot(p[0]-pos[0],p[1]-pos[1])));if(d<4){hit=true;found.add(i)}});if(!hit&&performance.now()-lastFalse>800&&P.lift===0&&(Math.min(pos[0]-plate.x0,plate.x1-pos[0],pos[1]-plate.y0,plate.y1-pos[1])>4)&&(weld||Math.hypot(pos[0]-40,pos[1]-30)>8.5)){falseA++;lastFalse=performance.now()}}
  cvP.redraw();u('f',found.size+' von '+cracks.length,found.size===cracks.length?'g':'');u('fa',falseA,falseA?'r':'g');u('cov',fmt(100*covN/((plate.x1-plate.x0)*(plate.y1-plate.y0)),0)+' %');u('al',alarm?'ALARM':'–',alarm?'r':'');u('ang','Δ Fehler↔Lift-off ≈ '+fmt(dAng(),0)+'°')});
 const cr=h('div',{cls:'ctls'});b.append(cr);slider(cr,{label:'Prüffrequenz',min:10,max:2000,log:true,value:300,unit:'kHz',on:v=>{P.f=v}});slider(cr,{label:'Phasensteller',min:0,max:360,step:1,value:0,unit:'°',on:v=>P.ph=v});slider(cr,{label:'Verstärkung',min:.3,max:4,step:.05,value:1,fmt:v=>fmt(v,2)+' ×',on:v=>P.gain=v});slider(cr,{label:'Alarmschwelle',min:.1,max:.9,step:.01,value:.4,fmt:v=>fmt(v*100,0)+' %',on:v=>P.thr=v});
 slider(cr,{label:'Abhebung (Lift-off)',min:0,max:1.5,step:.05,value:0,unit:'mm',on:v=>P.lift=v});if(weld)slider(cr,{label:'Beschichtung (nichtleitend)',min:0,max:2,step:.1,value:0,unit:'mm',on:v=>P.coat=v});
 seg(b,[['abs','Absolutsonde'],['diff','Differenzsonde']],'abs',v=>P.type=v);if(!weld){seg(b,[[0,'Diff.-Achse horizontal'],[90,'Diff.-Achse vertikal']],0,v=>P.axis=v)}else seg(b,[['conv','konventioneller Tastsensor'],['opt','Schweißnaht-Sensor (entkoppelt)']],'conv',v=>P.sensor=v);
 seg(b,[['amp','Auswertung: Amplitude'],['y','Auswertung: Y-Komponente']],'amp',v=>P.mode=v);const rw=h('div',{cls:'seg'});b.append(rw);btn(rw,'Risse anzeigen / verbergen',()=>{P.show=!P.show});btn(rw,'↺ Neu starten',()=>{found.clear();falseA=0;cov.fill(0);covN=0;oc.clearRect(0,0,W,H);trail=[];strip=[]});
 const u=readouts(b,[['f','Risse gefunden'],['fa','Fehlalarme'],['cov','Fläche abgetastet'],['al','Alarm'],['ang','Phasenlage']])}
sim('scan','Sonde führen: Rissprüfung an einer Fläche','Führe die Sonde über das Prüfteil. 1) Hebe die Sonde (Abhebung) und drehe den Phasensteller, bis das <b>Lift-off-Signal horizontal</b> liegt und der Riss nach oben ausschlägt. 2) Wähle Y-Komponenten-Auswertung. 3) Finde <b>alle vier Risse</b> ohne Fehlalarm. Probiere die Differenzsonde: Lift-off und Kante verschwinden, aber der Riss erscheint als „Acht“.',b=>mkScan(b,{weld:false}));
sim('weld','Manuelle Schweißnahtprüfung nach DIN EN ISO 17643','Prüfe die Schweißnaht mit dem <b>konventionellen Tastsensor</b>: Geometrie und Permeabilität der Raupe erzeugen starke Störsignale. Wechsle auf den <b>entkoppelten Schweißnaht-Sensor</b>. Stelle dann eine Beschichtung ein und gleiche den Amplitudenverlust über die Verstärkung aus (Beschichtung ≤ 2 mm erlaubt, muss gleichmäßig sein).',b=>mkScan(b,{weld:true}));

/* ============ V3 ============ */
sim('hyst','Hysteresekurve und Permeabilitätsarten','Wähle einen Werkstoff. Verschiebe den Arbeitspunkt (Gleichfeld H<sub>=</sub>) und die überlagerte Wechselfeldamplitude ΔH. Beobachte, wie die <b>Überlagerungspermeabilität μ<sub>Δ</sub></b> bei Annäherung an die Sättigung auf Werte nahe 1 abfällt.',b=>{
 const M={weich:{n:'Weicheisen',Bs:1.6,a:350,Hc:60},stahl:{n:'Vergütungsstahl',Bs:1.8,a:1100,Hc:450},hart:{n:'Hartstahl',Bs:1.9,a:2400,Hc:1500}};const P={m:'stahl',H0:0,dH:150},mu0=4e-7*Math.PI;let t=0;
 const Bd=(H,m)=>m.Bs*Math.tanh((H-m.Hc)/m.a),Bu=(H,m)=>m.Bs*Math.tanh((H+m.Hc)/m.a),Bm=(H,m)=>m.Bs*Math.tanh(H/m.a);
 const mud=(H0=P.H0)=>{const m=M[P.m];return(Bm(H0+P.dH,m)-Bm(H0-P.dH,m))/(2*P.dH)/mu0};
 const O=cvs(b,{ar:w=>w<620?1.05:.6,draw:(c,w,hh)=>{const m=M[P.m];G.bench(c,w,hh,{dots:false});const narrow=w<620;
  const R=narrow?{x:50,y:14,w:w-64,h:hh*.56}:{x:52,y:14,w:w*.64-60,h:hh-56};const mp=G.plot(c,R,[-6000,6000],[-2.2,2.2],{nx:6,ny:4,xl:'Feldstärke H in A/m',yl:'Flussdichte B in T',xf:v=>fmt(v/1000,0)+'k',yf:v=>fmt(v,1),zero:true});
  c.strokeStyle=T.axis;c.lineWidth=1;c.beginPath();c.moveTo(mp.x(0),R.y);c.lineTo(mp.x(0),R.y+R.h);c.stroke();
  const up=[],dn=[];for(let H=-6000;H<=6000;H+=40){up.push([mp.x(H),mp.y(Bu(H,m))]);dn.push([mp.x(H),mp.y(Bd(H,m))])}
  c.save();c.beginPath();c.rect(R.x,R.y,R.w,R.h);c.clip();c.fillStyle=G.rgba(T.blue,.1);G.path(c,up.concat(dn.slice().reverse()));c.fill();G.curve(c,up,T.blue,{lw:2.4});G.curve(c,dn,T.blue,{lw:2.4});
  const nl=[];for(let H=-6000;H<=6000;H+=60)nl.push([mp.x(H),mp.y(Bm(H,m))]);G.line(c,nl,T.faint,1.3,{dash:[5,4]});
  G.hline(c,mp,m.Bs,G.rgba(T.red,.5));G.hline(c,mp,-m.Bs,G.rgba(T.red,.5));
  // kleine Überlagerungsschleife um den Arbeitspunkt
  const md=mud(),B0=Bm(P.H0,m),wid=.18*Math.min(1,md/400)*Math.min(1,P.dH/400)+.012;const lp=[];for(let k=0;k<=80;k++){const ph=k/80*TAU;const H=P.H0+P.dH*Math.cos(ph);lp.push([mp.x(H),mp.y(B0+md*mu0*P.dH*Math.cos(ph)+wid*Math.sin(ph))])}
  c.fillStyle=G.rgba(T.orange,.25);G.path(c,lp);c.fill();G.line(c,lp,T.orange,2.4);const ph=t*3,Hc=P.H0+P.dH*Math.cos(ph);G.dot(c,mp.x(Hc),mp.y(B0+md*mu0*P.dH*Math.cos(ph)+wid*Math.sin(ph)),4,T.orange);c.restore();
  G.dot(c,mp.x(P.H0),mp.y(B0),6,T.red);G.label(c,'Arbeitspunkt',mp.x(P.H0)+10,mp.y(B0)+18,{size:11,col:T.red});G.label(c,'Sättigung B_s',R.x+R.w-6,mp.y(m.Bs)-11,{align:'right',size:10.5,col:T.red});
  G.legend(c,R.x+10,R.y+R.h-12,[[T.blue,'Hystereseschleife'],[T.faint,'Neukurve',[5,4]],[T.orange,'Überlagerungsschleife']],{max:R.x+R.w});
  // μΔ über H0
  const R2=narrow?{x:50,y:R.y+R.h+50,w:w-64,h:hh-R.h-100}:{x:w*.64+40,y:14,w:w*.36-54,h:hh-56};const m2=G.plot(c,R2,[-6000,6000],[1,3000],{ylog:true,nx:3,xl:'H= in A/m',yl:'μ_Δ',xf:v=>fmt(v/1000,0)+'k',yo:34,title:'μ_Δ über H='});
  const pp=[];for(let H=-6000;H<=6000;H+=60)pp.push([m2.x(H),m2.y(clamp(mud(H),1,3000))]);c.save();c.beginPath();c.rect(R2.x,R2.y,R2.w,R2.h);c.clip();G.curve(c,pp,T.violet,{fill:R2.y+R2.h,lw:2.2});c.restore();G.dot(c,m2.x(P.H0),m2.y(clamp(md,1,3000)),5.5,T.red);
  u('mu',fmtg(md),md<20?'r':'');u('ini',fmtg(m.Bs/(m.a*mu0)));u('s',Math.abs(B0)>.95*m.Bs?'gesättigt':'ungesättigt',Math.abs(B0)>.95*m.Bs?'g':'')}});
 animate(O,dt=>{t+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>O.redraw();slider(cr,{label:'Gleichfeld H= (Vormagnetisierung)',min:-6000,max:6000,step:50,value:0,unit:'A/m',on:v=>{P.H0=v;rd()}});slider(cr,{label:'Wechselfeld-Amplitude ΔH',min:10,max:1500,log:true,value:150,unit:'A/m',on:v=>{P.dH=v;rd()}});
 seg(b,Object.entries(M).map(([k,v])=>[k,v.n]),'stahl',v=>{P.m=v;rd()});const u=readouts(b,[['mu','μ_Δ (Überlagerungspermeabilität)'],['ini','μ im Nullpunkt (Anfang)'],['s','Zustand']]);
 b.append(h('div',{cls:'cap'},'Für die Wirbelstromprüfung ist die Amplituden- bzw. Überlagerungspermeabilität maßgeblich – nicht die Gleichfeld-Permeabilität B/H. Die orange Schleife ist die kleine Wechselfeldschleife, die das Prüfsignal „sieht“.'))});

sim('premag','Vormagnetisierung: Permeabilitätsstörungen eliminieren','Drei Orte im Stahlrohr haben leicht unterschiedliche magnetische Eigenschaften. Erhöhe die Gleichfeldstärke: Die Streuung der Überlagerungspermeabilität (= Störsignale) verschwindet. Rechts: Das Signal der Bohrung schwankt bei zu geringer Magnetisierung (instabiler Arbeitspunkt).',b=>{
 const loc=[600,1000,1700],Bs=1.8,mu0=4e-7*Math.PI,P={H:0};const muD=(H,a)=>Bs/(a*mu0)/Math.pow(Math.cosh(H/a),2);let t=0;const cl=()=>[T.blue,T.orange,T.green];
 const O=cvs(b,{ar:w=>w<620?1.2:.7,draw:(c,w,hh)=>{G.bench(c,w,hh);const narrow=w<620,cols=cl();const top=hh*(narrow?.2:.28);
  // Anlage: Rohr in Magnetisierungsspule
  const ty=top*.5,tr=Math.min(top*.2,18),sat=clamp(P.H/8000,0,1);G.ringCoil(c,w*.5,ty,tr*.5,tr*1.9,w*.32,'back',{n:14});G.tube(c,w*.04,w*.96,ty,tr,'steel',{hollow:true});
  const xs=[w*.36,w*.5,w*.64];xs.forEach((x,i)=>{c.save();c.fillStyle=G.rgba(cols[i],.85);c.shadowColor=cols[i];c.shadowBlur=10;c.beginPath();c.ellipse(x,ty,6,tr*.75,0,0,TAU);c.fill();c.restore()});
  G.ringCoil(c,w*.5,ty,tr*.5,tr*1.9,w*.32,'front',{n:14,glow:sat>.05?'#ffb000':null});
  for(let k=0;k<5;k++){const x=w*.34+((t*60*sat+k*w*.065)%(w*.32));c.globalAlpha=sat;G.arrow(c,x,ty+tr*1.35,x+16,ty+tr*1.35,T.violet,{lw:2,head:7});c.globalAlpha=1}
  G.label(c,'Gleichfeld-Magnetisierungsspule · H= = '+fmt(P.H,0)+' A/m',w*.5,top-6,{align:'center',size:11,col:sat>.05?T.violet:T.mute});
  const g=(w-30)/2;const R1=narrow?{x:50,y:top+16,w:w-64,h:(hh-top)*.4}:{x:48,y:top+14,w:g-36,h:hh-top-58},R2=narrow?{x:50,y:R1.y+R1.h+54,w:w-64,h:(hh-top)*.4-30}:{x:48+g+14,y:top+14,w:g-36,h:hh-top-58};
  const m1=G.plot(c,R1,[0,8000],[0,3.2],{nx:4,ny:3,xl:'H= in A/m',yl:'lg μ_Δ',xf:v=>fmt(v/1000,0)+'k',yf:v=>fmt(v,0),yo:32,title:'μ_Δ an drei Orten'});
  loc.forEach((a,i)=>{const p=[];for(let H=0;H<=8000;H+=80)p.push([m1.x(H),m1.y(clamp(Math.log10(muD(H,a)),0,3.2))]);G.curve(c,p,cols[i],{lw:2.2});G.dot(c,m1.x(P.H),m1.y(clamp(Math.log10(muD(P.H,a)),0,3.2)),5,cols[i])});
  const vs=loc.map(a=>muD(P.H,a));const lo=Math.log10(Math.min(...vs)),hi=Math.log10(Math.max(...vs));c.fillStyle=G.rgba(T.red,.12);c.fillRect(m1.x(P.H)-7,m1.y(clamp(hi,0,3.2)),14,m1.y(clamp(lo,0,3.2))-m1.y(clamp(hi,0,3.2)));G.vline(c,m1,P.H,T.faint);
  const m2=G.plot(c,R2,[0,8000],[0,1.3],{nx:4,ny:3,xl:'H= in A/m',yl:'Signal Bohrung',xf:v=>fmt(v/1000,0)+'k',yf:v=>fmt(v,1),yo:32,title:'Signal der Bezugsbohrung (schem.)'});const f=H=>1-Math.exp(-H/1800)*(1+.7*Math.cos(H/650));const p2=[];for(let H=0;H<=8000;H+=50)p2.push([m2.x(H),m2.y(clamp(f(H),0,1.3))]);
  c.fillStyle=G.rgba(T.green,.1);c.fillRect(m2.x(3500),R2.y,R2.x+R2.w-m2.x(3500),R2.h);G.label(c,'stabil',m2.x(5800),R2.y+R2.h-14,{align:'center',size:10.5,col:T.green});
  G.curve(c,p2,T.violet,{lw:2.4});G.vline(c,m2,P.H,T.faint);G.dot(c,m2.x(P.H),m2.y(clamp(f(P.H),0,1.3)),5.5,T.violet);
  const spread=(Math.max(...vs)-Math.min(...vs))/(vs.reduce((x,y)=>x+y)/3);u('sp',fmt(spread*100,0)+' %',spread<.15?'g':'r');u('ok',spread<.15&&P.H>3500?'stabiler Arbeitspunkt':'instabil / Störsignale',spread<.15&&P.H>3500?'g':'r')}});
 animate(O,dt=>{t+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);slider(cr,{label:'Magnetisierungs-Feldstärke H=',min:0,max:8000,step:50,value:0,unit:'A/m',on:v=>{P.H=v;O.redraw()}});const u=readouts(b,[['sp','Streuung von μ_Δ der 3 Orte'],['ok','Bewertung']]);
 b.append(h('div',{cls:'cap'},'Faustregel aus dem Skript: Magnetisierung so hoch wählen, dass kleine Schwankungen der Feldstärke keine merklichen Fehlersignaländerungen bewirken.'))});

sim('ferrit','Ferritgehaltsmessung: Phasenselektion trennt σ- und μ-Änderung','Austenit hat σ ≈ 1–2 MS/m, die Leitfähigkeit schwankt, der δ-Ferritgehalt ändert μ. Wähle die Frequenz so, dass σ- und μ-Richtung <b>90°</b> auseinanderliegen, und drehe die Phase, bis die σ-Änderung <b>horizontal</b> liegt: Dann zeigt der Y-Wert nur noch den Ferritgehalt.',b=>{
 const P={f:5,ph:0,FN:12,ds:.5};const delta=()=>clamp(90*Math.pow(12/P.f,.4),8,90);const th=20;let t=0;
 const O=cvs(b,{ar:w=>w<620?1.15:.62,dark:true,draw:(c,w,hh)=>{c.fillStyle='#0b1218';c.fillRect(0,0,w,hh);const narrow=w<620;const s=narrow?w-8:Math.min(hh-8,w*.62);const S=G.screen(c,4,4,s,s,{label:'Bildschirm · Ferritprüfgerät',bezel:7});
  const cx=S.cx,cy=S.cy,R=S.w/2*.86;const Dl=delta();const rot=Cx.pol(1,P.ph*D2R);const wob=Math.sin(t*1.7)*.5+.5;const vs=Cx.pol(P.ds*.6*(wob*2-1),th*D2R),vm=Cx.pol(P.FN/30*.6,(th+Dl)*D2R);
  c.save();G.rr(c,S.x,S.y,S.w,S.h,8);c.clip();
  [[Cx.mul(Cx.pol(.6,th*D2R),rot),PH.a,'σ-Richtung'],[Cx.mul(Cx.pol(.6,(th+Dl)*D2R),rot),PH.b,'μ-Richtung (Ferrit)']].forEach(([v,col,l])=>{G.line(c,[[cx-v[0]*R*1.4,cy+v[1]*R*1.4],[cx+v[0]*R*1.4,cy-v[1]*R*1.4]],G.rgba(col,.55),1.2,{dash:[6,5]});G.stext(c,l,cx+v[0]*R*1.08+4,cy-v[1]*R*1.08-6,{col,size:10.5})});
  // σ-Schwankung als Spur
  const tr=[];for(let k=0;k<=40;k++){const a=Math.sin(k/40*TAU);tr.push(Cx.mul(Cx.add(Cx.pol(P.ds*.6*a,th*D2R),vm),rot))}G.trace(c,tr.map(v=>[cx+v[0]*R,cy-v[1]*R]),G.rgba(PH.a,.7),1.4);
  const tot=Cx.mul(Cx.add(vs,vm),rot);G.arrow(c,cx,cy,cx+tot[0]*R,cy-tot[1]*R,PH.g,{lw:2.5,glow:10});G.spot(c,cx+tot[0]*R,cy-tot[1]*R,PH.g,4);
  G.line(c,[[cx+tot[0]*R,cy-tot[1]*R],[S.x+S.w-6,cy-tot[1]*R]],G.rgba(PH.g,.4),1,{dash:[3,3]});c.restore();G.glass(c,S);
  // Anzeigeinstrument (Balken)
  const Y=Cx.mul(Cx.add(Cx.pol(0,0),vm),rot)[1]+Cx.mul(vs,rot)[1],est=Y/.6*30;const est0=Cx.mul(Cx.add(vm,Cx.pol(P.ds*.6,th*D2R)),rot)[1]/.6*30,est1=Cx.mul(Cx.add(vm,Cx.pol(-P.ds*.6,th*D2R)),rot)[1]/.6*30;
  const bx=narrow?14:s+26,by=narrow?s+18:20,bw=narrow?w-28:w-s-40,bh=narrow?hh-s-30:hh-40;c.fillStyle='#111c25';G.rr(c,bx,by,bw,bh,14);c.fill();c.strokeStyle='rgba(255,255,255,.08)';c.stroke();
  G.text(c,'Ferritanzeige',bx+14,by+22,{size:12,weight:700,col:'#cfe3f0'});c.fillStyle='#04140c';G.rr(c,bx+14,by+32,bw-28,48,8);c.fill();G.stext(c,fmt(est,1)+' FN',bx+bw-24,by+66,{align:'right',size:24,weight:700,col:PH.g});
  const gx=bx+14,gw=bw-28,gy=by+100,mx=v=>gx+clamp(v/30,0,1)*gw;c.fillStyle='#1a2833';G.rr(c,gx,gy,gw,14,7);c.fill();c.fillStyle=G.rgba(PH.a,.35);G.rr(c,mx(Math.min(est0,est1)),gy,Math.max(3,mx(Math.max(est0,est1))-mx(Math.min(est0,est1))),14,7);c.fill();
  c.fillStyle=PH.b;c.fillRect(mx(P.FN)-1.5,gy-5,3,24);G.spot(c,mx(est),gy+7,PH.g,3);G.text(c,'Schwankungsbreite durch Δσ',gx,gy+32,{size:10.5,col:'#8fa6b8'});G.text(c,'│ wahrer Wert '+fmt(P.FN,1)+' FN',gx,gy+48,{size:10.5,col:PH.b});
  const err=Math.max(Math.abs(est0-P.FN),Math.abs(est1-P.FN));u('est',fmt(est,1)+' FN',err<1.2?'g':'r');u('d',fmt(Dl,0)+' °',Dl>80?'g':'');u('err','± '+fmt(err,1)+' FN',err<1.2?'g':'r')}});
 animate(O,dt=>{t+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>O.redraw();slider(cr,{label:'Prüffrequenz',min:1,max:500,log:true,value:5,unit:'kHz',on:v=>{P.f=v;rd()}});slider(cr,{label:'Phasensteller',min:-90,max:90,step:1,value:0,unit:'°',on:v=>{P.ph=v;rd()}});
 slider(cr,{label:'wahrer Ferritgehalt',min:0,max:30,step:.5,value:12,unit:'FN',on:v=>{P.FN=v;rd()}});slider(cr,{label:'Leitfähigkeitsschwankung Δσ',min:0,max:1,step:.05,value:.5,fmt:v=>fmt(v*100,0)+' %',on:v=>{P.ds=v;rd()}});
 const u=readouts(b,[['d','Winkel σ ↔ μ'],['est','Anzeige'],['err','Messunsicherheit durch Δσ']]);b.append(h('div',{cls:'cap'},'Der Ferritgehalt wird als „Ferritzahl“ (FN) angegeben; die absolute Bestimmung ist zerstörungsfrei nicht möglich – Kalibrierung über Sekundärstandards, die per Haftkraftverfahren (AWS A4.2) an Primärstandards (Weicheisen mit Cu-Überzug) angeschlossen sind.'))});

/* ============ V4 ============ */
sim('skin','Standard-Eindringtiefe und Skineffekt','Wähle einen Werkstoff und verändere die Frequenz. Wann ist die Wandstärke ≥ 3 δ (Justierkörper, Leitfähigkeit, Schweißnaht „oberflächennah“)? Beachte: Ferromagnetisches μ<sub>r</sub> verkleinert δ drastisch. Links siehst du die Wirbelstromdichte im Schnitt – sie läuft als gedämpfte Welle in die Tiefe.',b=>{
 const mats=[['Kupfer',58,1],['Aluminium',35,1],['Al-Legierung 2024-T3',16.5,1],['Messing',15,1],['Austenit',1.36,1],['Titanlegierung',.63,1],['Baustahl (µr≈100)',6,100]];const P={f:1e4,s:35,mu:1,t:1};let t=0;
 const del=()=>503/Math.sqrt(P.f*P.s*P.mu);
 const O=cvs(b,{ar:w=>w<620?1.15:.56,draw:(c,w,hh)=>{const d=del();G.bench(c,w,hh);const narrow=w<620;const zmax=Math.max(3.2*d,P.t*1.05);
  // Schnittbild mit animierter Stromdichte
  const S=narrow?{x:12,y:44,w:w-24,h:hh*.36}:{x:14,y:50,w:w*.38,h:hh-90};const ys=z=>S.y+z/zmax*S.h;
  const cw=S.w*.5;G.coil(c,S.x+S.w/2,S.y-20,cw*.8,10,8,{I:Math.cos(t*4)*.8,leads:false,lw:2.6});
  c.save();G.rr(c,S.x,S.y,S.w,S.h,8);c.clip();const ty=ys(P.t);c.fillStyle=DARK?'#0b1218':'#dfe7ee';c.fillRect(S.x,S.y,S.w,S.h);
  const step=2;for(let y=S.y;y<Math.min(ty,S.y+S.h);y+=step){const z=(y-S.y)/S.h*zmax;const a=Math.exp(-z/d),v=a*Math.cos(t*4-z/d);for(let x=S.x;x<S.x+S.w;x+=step*3){const lat=Math.exp(-Math.pow((x-S.x-S.w/2)/(S.w*.36),2));c.fillStyle=G.cdiv(v*lat);c.fillRect(x,y,step*3,step)}}
  if(ty<S.y+S.h){c.fillStyle=DARK?'#0b1218':'#e9eff4';c.fillRect(S.x,ty,S.w,S.y+S.h-ty);G.hatch(c,S.x,ty,S.w,S.y+S.h-ty,G.rgba(T.axis,.4),8);G.label(c,'Luft / Rückseite',S.x+S.w/2,ty+16,{align:'center',size:10.5,col:T.mute})}
  [1,2,3].forEach(k=>{const y=ys(k*d);if(y<Math.min(ty,S.y+S.h)){G.line(c,[[S.x,y],[S.x+S.w,y]],'rgba(255,255,255,.85)',1.2,{dash:[5,4]});G.label(c,k+'δ',S.x+S.w-8,y,{align:'right',size:10.5})}});c.restore();
  c.strokeStyle=T.axis;c.lineWidth=1;G.rr(c,S.x,S.y,S.w,S.h,8);c.stroke();G.text(c,'Schnitt: Wirbelstromdichte J(z,t)',S.x,S.y-36,{size:11.5,weight:700,col:T.ink2});
  // Diagramm
  const R=narrow?{x:50,y:S.y+S.h+24,w:w-64,h:hh-S.y-S.h-70}:{x:w*.38+70,y:24,w:w*.62-86,h:hh-70};const m=G.plot(c,R,[0,zmax],[-1,1],{nx:4,ny:4,xl:'Tiefe z in mm',yl:'J(z)/J(0)',yf:v=>fmt(v,1),yo:38,zero:true});
  const env=[],nenv=[],wv=[];for(let i=0;i<=200;i++){const z=zmax*i/200;env.push([m.x(z),m.y(Math.exp(-z/d))]);nenv.push([m.x(z),m.y(-Math.exp(-z/d))]);wv.push([m.x(z),m.y(Math.exp(-z/d)*Math.cos(t*4-z/d))])}
  c.save();c.beginPath();c.rect(R.x,R.y,R.w,R.h);c.clip();c.fillStyle=G.rgba(T.orange,.1);G.path(c,env.concat(nenv.slice().reverse()));c.fill();G.curve(c,env,T.orange,{lw:2.6});G.line(c,nenv,G.rgba(T.orange,.6),1.4,{dash:[4,3]});G.curve(c,wv,T.violet,{lw:1.8});
  const tx=m.x(P.t);c.fillStyle=G.rgba(T.blue,.08);c.fillRect(tx,R.y,R.x+R.w-tx,R.h);G.line(c,[[tx,R.y],[tx,R.y+R.h]],T.blue,2);c.restore();G.label(c,'Wanddicke t',Math.min(tx,R.x+R.w)-6,R.y+14,{align:'right',size:10.5,col:T.blue});
  [1,2,3].forEach(k=>{if(k*d<zmax){const x=m.x(k*d),y=m.y(Math.exp(-k));G.line(c,[[x,m.y(0)],[x,y]],T.green,1.2,{dash:[3,3]});G.dot(c,x,y,4.5,T.green);G.label(c,k+'δ: '+fmt(100*Math.exp(-k),0)+' %',x+6,y-12,{size:10.5,col:T.green})}});
  G.legend(c,R.x+10,R.y+R.h-12,[[T.orange,'Einhüllende e^(−z/δ)'],[T.violet,'Momentanwert (Phase dreht mit der Tiefe)']],{max:R.x+R.w});
  u('d',fmtg(d)+' mm');u('d3',fmtg(3*d)+' mm');u('ok',P.t>=3*d?'t ≥ 3δ: Volumen erfasst':P.t>=d?'δ ≤ t < 3δ':'t < δ: dünnwandig',P.t>=3*d?'g':'');u('iacs',fmt(P.s*1.724,1)+' %IACS')}});
 animate(O,dt=>{t+=dt});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>O.redraw();slider(cr,{label:'Prüffrequenz',min:50,max:1e7,log:true,value:1e4,unit:'Hz',on:v=>{P.f=v;rd()}});const ss=slider(cr,{label:'Leitfähigkeit σ',min:.3,max:60,log:true,value:35,unit:'MS/m',on:v=>{P.s=v;rd()}});const sm=slider(cr,{label:'rel. Permeabilität μr',min:1,max:300,log:true,value:1,on:v=>{P.mu=v;rd()}});slider(cr,{label:'Wanddicke t',min:.1,max:20,log:true,value:1,unit:'mm',on:v=>{P.t=v;rd()}});
 seg(b,mats.map((m,i)=>[i,m[0]]),null,i=>{P.s=mats[i][1];P.mu=mats[i][2];ss.set(P.s);sm.set(P.mu);rd()});const u=readouts(b,[['d','Standard-Eindringtiefe δ'],['d3','3 δ (≈ 5 % Rest)'],['ok','Bewertung'],['iacs','σ in %IACS']]);b.append(h('div',{cls:'fm',html:'δ [mm] = 503 / √(f · σ · μ<sub>r</sub>)  <small>f in Hz, σ in MS/m</small><br>1 MS/m = 1,724 %IACS · 100 %IACS = 58 MS/m'}))});

sim('condlab','Leitfähigkeitsmessung: Justieren, Messen, Einflussgrößen','Wähle eine Probe und ein Gerät. Zuerst: Ist die Frequenz passend (niedrige Leitfähigkeit → höhere Frequenz) und die Dicke ≥ 3δ? Dann schalte die Störeinflüsse ein: <b>Lack, Temperatur, Plattierung, Kante</b>. Streitfälle beginnen schon bei 0,2 MS/m Abweichung!',b=>{
 const S=[['Al-99,5',35],['Al-2014-T6',22.5],['Al-2024-T3',16.5],['Al-2024-T6',22.5],['Al-7075-T6',18.5],['Al-7075-T73',23.5],['Al-Li-Legierung',10.72],['Austenit',1.36],['Titanlegierung',.63]];
 const P={i:2,f:60,t:5,lack:0,T:20,clad:false,tc:.1,edge:30};
 const calc=()=>{const s0=S[P.i][1];const d=503/Math.sqrt(P.f*1000*s0);let s=s0;const log=[];
  const fth=1-.8*Math.exp(-2.2*P.t/d);if(fth<.995){s*=fth;log.push(['Bauteildicke '+fmt(P.t,2)+' mm = '+fmt(P.t/d,1)+' δ',s0*fth-s0])}
  const dl=-s0*(P.lack/100)*.08;if(P.lack>0){s+=dl;log.push(['Lack '+P.lack+' µm (Lift-off)',dl])}
  const dT=-.0016*(P.T-20);if(Math.abs(dT)>1e-4){s+=dT;log.push(['Temperatur '+P.T+' °C',dT])}
  if(P.clad){const w=1-Math.exp(-P.tc/d);const dc=(35-s0)*w;s+=dc;log.push(['Plattierung '+fmt(P.tc,2)+' mm',dc])}
  const de=-s0*.5*Math.exp(-P.edge/6);if(de<-1e-3){s+=de;log.push(['Kantennähe '+fmt(P.edge,0)+' mm',de])}return{s0,s,d,log}};
 const O=cvs(b,{ar:w=>w<620?1.2:.52,draw:(c,w,hh)=>{const q=calc();G.bench(c,w,hh);const narrow=w<620;const err=q.s-q.s0,bad=Math.abs(err)>.2;
  // Messgerät
  const D=narrow?{x:14,y:14,w:w-28,h:hh*.44}:{x:16,y:16,w:w*.44,h:hh-32};c.save();c.shadowColor=T.shadow;c.shadowBlur=18;c.shadowOffsetY=6;const gd=c.createLinearGradient(0,D.y,0,D.y+D.h);gd.addColorStop(0,'#33414f');gd.addColorStop(1,'#18212a');c.fillStyle=gd;G.rr(c,D.x,D.y,D.w,D.h,18);c.fill();c.restore();
  c.fillStyle='rgba(255,255,255,.08)';G.rr(c,D.x+2,D.y+2,D.w-4,D.h*.12,16);c.fill();G.text(c,'σ-METER',D.x+18,D.y+24,{size:11,weight:800,col:'#9fb3c8'});G.text(c,P.f+' kHz',D.x+D.w-18,D.y+24,{size:11,weight:700,col:'#5eead4',align:'right'});
  const L={x:D.x+18,y:D.y+36,w:D.w-36,h:D.h*.38};const gl=c.createLinearGradient(0,L.y,0,L.y+L.h);gl.addColorStop(0,'#c9d9b0');gl.addColorStop(1,'#a9bd8c');c.fillStyle=gl;G.rr(c,L.x,L.y,L.w,L.h,8);c.fill();c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=2;c.stroke();
  c.font=G.font(Math.min(L.h*.52,46),700,true);c.fillStyle='rgba(20,30,10,.055)';c.textAlign='right';c.fillText('88,88',L.x+L.w-70,L.y+L.h*.68);c.fillStyle='#1e2a12';c.fillText(fmt(q.s,2),L.x+L.w-70,L.y+L.h*.68);
  G.text(c,'MS/m',L.x+L.w-12,L.y+L.h*.68,{size:13,weight:800,col:'#1e2a12',align:'right'});G.text(c,fmt(q.s*1.724,1)+' %IACS',L.x+L.w-12,L.y+L.h-8,{size:11,weight:700,col:'#3b4a22',align:'right'});
  G.led(c,D.x+28,L.y+L.h+22,!bad,'#3dff95',6,'OK');G.led(c,D.x+64,L.y+L.h+22,bad,'#ff3b4a',6,'Δ>0,2');[0,1,2].forEach(k=>G.knob(c,D.x+D.w-40-k*44,L.y+L.h+26,13,.3+k*.2));
  // Sonde auf Probe
  const py=D.y+D.h-18,pw=D.w-36;G.metal(c,D.x+18,py-14,pw,16,'alu',{r:3});if(P.lack>0){c.fillStyle='rgba(240,190,60,.85)';c.fillRect(D.x+18,py-14-Math.min(8,P.lack/12),pw,Math.min(8,P.lack/12))}
  if(P.clad){c.fillStyle='rgba(235,240,245,.95)';c.fillRect(D.x+18,py-14,pw,Math.max(2,P.tc*10))}const px=D.x+18+clamp(P.edge/40,.02,1)*pw*.9;G.probe(c,px,py-14-Math.min(8,P.lack/12),26,{len:D.h*.2,cable:false,I:.5});
  // Wahr vs. Anzeige + Fehlerbeiträge (Wasserfall)
  const R=narrow?{x:14,y:D.y+D.h+18,w:w-28,h:hh-D.h-46}:{x:w*.44+40,y:16,w:w*.56-56,h:hh-32};const mx=Math.max(q.s0,q.s)*1.2+.01;
  G.text(c,'Wahrer Wert und Anzeige',R.x,R.y+12,{size:12,weight:700,col:T.ink2});
  G.meterBar(c,R.x,R.y+34,R.w,16,q.s0/mx,T.blue,'wahr',fmt(q.s0,2)+' MS/m');G.meterBar(c,R.x,R.y+74,R.w,16,q.s/mx,bad?T.red:T.green,'Anzeige',fmt(q.s,2)+' MS/m');
  G.text(c,'Abweichung '+(err>=0?'+':'')+fmt(err,2)+' MS/m',R.x,R.y+118,{size:16,weight:800,col:bad?T.red:T.green});
  G.text(c,'Fehlerbeiträge',R.x,R.y+144,{size:11.5,weight:700,col:T.mute});const sc=R.w*.45/Math.max(.3,...q.log.map(l=>Math.abs(l[1])));const zx=R.x+R.w*.62;
  if(!q.log.length)G.text(c,'keine – Messung unter Idealbedingungen',R.x,R.y+166,{size:12,col:T.green,weight:600});
  q.log.forEach((l,i)=>{const y=R.y+156+i*24;if(y>R.y+R.h-8)return;G.text(c,l[0],R.x,y+12,{size:11,col:T.ink2});const bw=l[1]*sc;G.bar(c,bw<0?zx+bw:zx,y+2,Math.max(2,Math.abs(bw)),14,l[1]<0?T.red:T.amber,{shadow:false,r:4});G.text(c,(l[1]>=0?'+':'')+fmt(l[1],2),bw<0?zx+bw-4:zx+bw+4,y+13,{size:10.5,weight:700,col:T.ink2,align:bw<0?'right':'left'})});
  if(q.log.length){c.strokeStyle=T.axis;c.lineWidth=1;c.beginPath();c.moveTo(zx,R.y+150);c.lineTo(zx,R.y+156+q.log.length*24);c.stroke()}
  u('d',fmt(q.d,2)+' mm');u('d3',fmt(3*q.d,2)+' mm',P.t>=3*q.d?'g':'r');u('ok',Math.abs(err)<=.2?'innerhalb ±0,2 MS/m':'Streitfall-Risiko',Math.abs(err)<=.2?'g':'r')}});
 const cr=h('div',{cls:'ctls'});b.append(cr);const rd=()=>O.redraw();
 b.insertBefore(h('label',{cls:'ctl'},h('span',{cls:'lb'},'Probe'),h('select',{onchange:e=>{P.i=+e.target.value;rd()},style:'width:100%'},S.map((s,i)=>h('option',{value:i,selected:i===2},s[0]+' ('+s[1]+' MS/m)')))),cr);
 seg(b,[[60,'60 kHz'],[100,'100 kHz'],[500,'500 kHz']],60,v=>{P.f=v;rd()});slider(cr,{label:'Bauteildicke',min:.1,max:10,log:true,value:5,unit:'mm',on:v=>{P.t=v;rd()}});slider(cr,{label:'Lackschicht',min:0,max:100,step:5,value:0,unit:'µm',on:v=>{P.lack=v;rd()}});slider(cr,{label:'Temperatur Bauteil',min:0,max:120,step:1,value:20,unit:'°C',on:v=>{P.T=v;rd()}});slider(cr,{label:'Abstand zur Kante',min:1,max:40,step:1,value:30,unit:'mm',on:v=>{P.edge=v;rd()}});
 seg(b,[[0,'ohne Plattierung'],[1,'mit Reinaluminium-Plattierung']],0,v=>{P.clad=!!v;rd()});slider(cr,{label:'Plattierdicke',min:.02,max:.4,step:.01,value:.1,unit:'mm',on:v=>{P.tc=v;rd()}});const u=readouts(b,[['d','δ bei dieser Frequenz'],['d3','Mindestdicke 3δ'],['ok','Bewertung']]);
 b.append(h('div',{cls:'cap'},'Modell nach den Aussagen des Skripts (qualitativ): dünne Bauteile, Beschichtungen, Kanten verfälschen; Plattierung zeigt eine „Mischleitfähigkeit“ zu hoch an; Referenz 20 °C.'))});

sim('ambig','Doppeldeutigkeit der Leitfähigkeit (Warmbehandlung)','Beispielhafte Kurven einer aushärtbaren Al-Legierung: Die Leitfähigkeit steigt, fällt aber bei höherer Temperatur wieder. Zwei verschiedene Wärmebehandlungstemperaturen liefern denselben Messwert – nur eine <b>Härteprüfung</b> löst die Doppeldeutigkeit auf.',b=>{
 const P={s:20};const H=T0=>140-Math.abs(T0-110)*.6;const sig=T0=>12+11*Math.exp(-Math.pow((T0-170)/60,2));
 const O=cvs(b,{ar:w=>w<620?.85:.56,draw:(c,w,hh)=>{G.bench(c,w,hh,{dots:false});const R={x:52,y:16,w:w-108,h:hh-62};const m=G.plot(c,R,[50,300],[10,24],{nx:5,ny:4,xl:'Warmbehandlungstemperatur in °C (schematisch)',yl:'σ in MS/m',xf:v=>fmt(v,0),yf:v=>fmt(v,0),yo:36});
  const m2=mapper(R,[50,300],[40,160]);const p=[],q=[];for(let T0=50;T0<=300;T0+=2){p.push([m.x(T0),m.y(sig(T0))]);q.push([m2.x(T0),m2.y(H(T0))])}
  c.save();c.font=G.font(10.5,500);c.fillStyle=T.violet;c.textAlign='left';for(let i=0;i<=4;i++)c.fillText(String(40+i*30),R.x+R.w+6,R.y+R.h-i*R.h/4+4);c.save();c.translate(R.x+R.w+44,R.y+R.h/2);c.rotate(Math.PI/2);c.textAlign='center';c.font=G.font(11.5,650);c.fillText('Härte in HV',0,0);c.restore();c.restore();
  G.curve(c,p,T.orange,{fill:R.y+R.h,lw:2.8});G.line(c,q,T.violet,2.4,{dash:[6,4]});G.hline(c,m,P.s,T.ink2,{lw:1.4});G.label(c,'Messwert '+fmt(P.s,1)+' MS/m',R.x+8,m.y(P.s)-12,{size:11,col:T.ink2});
  const Ts=[];for(let T0=50;T0<300;T0++){if((sig(T0)-P.s)*(sig(T0+1)-P.s)<=0)Ts.push(T0)}
  Ts.forEach((T0,i)=>{const col=i?T.teal:T.blue;G.line(c,[[m.x(T0),m.y(P.s)],[m.x(T0),R.y+R.h]],col,1.4,{dash:[3,3]});G.line(c,[[m.x(T0),m.y(P.s)],[m2.x(T0),m2.y(H(T0))]],G.rgba(col,.6),1.2,{dash:[2,3]});G.dot(c,m.x(T0),m.y(P.s),6.5,T.orange,{halo:4});G.dot(c,m2.x(T0),m2.y(H(T0)),6,T.violet);
   G.badge(c,'T'+(i+1)+' ≈ '+T0+' °C',m.x(T0),R.y+R.h-14,col,{align:'center'});G.label(c,fmt(H(T0),0)+' HV',m2.x(T0)+10,m2.y(H(T0))-12,{size:11,col:T.violet})});
  G.legend(c,R.x+10,R.y+16,[[T.orange,'Leitfähigkeit'],[T.violet,'Härte (rechte Achse)',[6,4]]],{max:R.x+R.w});
  u('n',Ts.length>1?'zwei mögliche Zustände!':Ts.length?'eindeutig':'kein Zustand',Ts.length>1?'r':'g');u('h',Ts.map(T0=>fmt(H(T0),0)+' HV').join(' / ')||'–')}});
 const cr=h('div',{cls:'ctls'});b.append(cr);slider(cr,{label:'gemessene Leitfähigkeit',min:12.5,max:22.5,step:.1,value:20,unit:'MS/m',on:v=>{P.s=v;O.redraw()}});const u=readouts(b,[['n','Zuordnung'],['h','Härte der möglichen Zustände']])});

/* ============ V5 ============ */
sim('forming','Vom Gussfehler zum Walzfehler: Umformung','Ein kugelförmiger Lunker/Einschluss im Gussblock wird beim Schmieden und Walzen mit verformt. Erhöhe den Umformgrad und wähle Stab (Längsstreckung → Schlackenzeile) oder Blech (flächig → Dopplung). Wie ändert sich die Auffindbarkeit?',b=>{
 const P={lam:1,mode:'rod'};
 const O=cvs(b,{ar:w=>w<620?.85:.5,draw:(c,w,hh)=>{G.bench(c,w,hh);const L=P.lam,r=Math.min(18,hh*.06),cx=w*.47,cy=hh*.56;const rod=P.mode==='rod';
  const bw=Math.min(w*.8,150+L*36),bh=rod?Math.max(36,150/Math.sqrt(L)):Math.max(18,150/L),dep=rod?bh*.55:Math.min(hh*.22,40+L*5);
  const x=cx-bw/2,y=cy-bh/2;G.slab(c,x,y,bw,bh,dep*.8,dep*.5,'steel',{hatch:.08});
  // Faserverlauf
  c.save();c.beginPath();c.rect(x,y,bw,bh);c.clip();c.strokeStyle='rgba(40,50,60,.22)';c.lineWidth=1;for(let i=1;i<14;i++){const yy=y+bh*i/14;c.beginPath();for(let xx=x;xx<=x+bw;xx+=6){const bulge=Math.exp(-Math.pow((xx-cx)/(bw*.12+r*L*.4),2))*(i<7?-1:1)*Math.min(r/Math.sqrt(L),bh*.1)*(1-Math.abs(i-7)/7);xx===x?c.moveTo(xx,yy+bulge):c.lineTo(xx,yy+bulge)}c.stroke()}
  const ax=rod?r*L*.9:r*Math.sqrt(L)*1.2,ay=rod?r/Math.sqrt(L):Math.max(1.3,r/L);const g=c.createRadialGradient(cx-ax*.3,cy-ay*.4,1,cx,cy,Math.max(ax,ay));g.addColorStop(0,'#0b0d10');g.addColorStop(.7,'#2a2f35');g.addColorStop(1,'#5b636c');c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,Math.min(ax,bw/2-6),Math.max(1.2,ay),0,0,TAU);c.fill();
  c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=1;c.beginPath();c.ellipse(cx,cy,Math.min(ax,bw/2-6),Math.max(1.2,ay),0,.9*Math.PI,1.6*Math.PI);c.stroke();c.restore();
  if(!rod&&L>=6){c.save();c.fillStyle='rgba(20,24,30,.55)';c.beginPath();c.ellipse(cx+dep*.4,y-dep*.25,Math.min(ax,bw/2-6)*.9,dep*.12,0,0,TAU);c.fill();c.restore()}
  G.arrow(c,cx-bw/2,hh-18,cx+bw/2,hh-18,T.mute,{lw:1.4,head:8,both:true});G.label(c,'Faser- / Walzrichtung',cx,hh-18,{align:'center',size:11,col:T.mute});
  G.label(c,rod?'Stab / Schmiedeteil (Längsverformung)':'Blech (flächige Verformung)',cx,18,{align:'center',size:12,col:T.ink2});
  // Mini-Verlauf: Gussblock → aktuell
  const mx=w-70,my=34;G.metal(c,mx-22,my-14,44,28,'steel',{r:3});G.dot(c,mx,my,5,'#222',{ring:false});G.text(c,'Gussblock',mx,my+28,{align:'center',size:10,col:T.mute});
  const kind=L<1.6?'Lunker / Pore (volumenhaft)':rod?(L<6?'langgestreckter Einschluss':'Schlackenzeile / Seigerungszeile'):(L<6?'abgeflachter Hohlraum':'Dopplung (flächig, parallel zur Oberfläche)');
  G.badge(c,kind,cx,cy+bh/2+24,L<1.6?T.blue:rod?T.orange:T.red,{align:'center'});
  u('k',kind);u('a',fmt(ax*2/(r*2),1)+' : 1');u('n',L<1.6?'durch Durchstrahlung / UT':rod?'Längsfehler: gut mit MT/ET an Oberfläche':'nur an Blechkanten mit PT/MT; UT in Plattenebene')}});
 const cr=h('div',{cls:'ctls'});b.append(cr);slider(cr,{label:'Umformgrad (Längenverhältnis)',min:1,max:20,step:.5,value:1,fmt:v=>fmt(v,1)+' ×',on:v=>{P.lam=v;O.redraw()}});seg(b,[['rod','Stab / Schmiedeteil'],['sheet','Blech']],'rod',v=>{P.mode=v;O.redraw()});
 const u=readouts(b,[['k','Fehlerform'],['a','Länge : Dicke'],['n','Auffindbarkeit']])});

const DEFECTS=[['Lunker','Herstellung','Guss','Schwindungshohlraum durch Zusammenziehen beim Erstarren, v. a. an Querschnittsübergängen.'],['Poren / Porositäten','Herstellung','Guss','Gas (Lösungsvermögen der Schmelze) wird beim Erstarren frei; auch Mikrolunker.'],['Einschlüsse / Oxide','Herstellung','Guss','Schmelze verbindet sich mit Sauerstoff → Oxide.'],['Seigerungen','Herstellung','Guss','Entmischungen beim Erstarren.'],['Warmriss','Herstellung','Guss','Riss im teigigen Zustand des abkühlenden Materials (ungünstige Formgebung).'],['Schrumpfriss','Herstellung','Guss','Riss, wenn die Schmelze bereits fest ist.'],['Kaltschweißstelle','Herstellung','Guss','Gießströme treffen zu kalt/oxidiert zusammen → nur teilweise Verbindung.'],['Schlackenzeile / Seigerungszeile','Herstellung','Schmieden/Walzen','Volumenfehler des Gusses werden in Faserrichtung gestreckt.'],['Flocken','Herstellung','Schmieden','Wasserstoffausscheidungen.'],['Schmiedefalte / Überlappung','Herstellung','Schmieden','Überschmiedetes Material, Querfehler möglich.'],['Dopplung','Herstellung','Walzen (Blech)','Verformte Lunker/Gasblasen; nur an Blechkanten mit PT/MT auffindbar.'],['Säume, Riefen, Pilgerfehler','Herstellung','Walzen','Längsgerichtete Fehler; Pilgerfehler bei Rohren meist periodisch.'],['Härterisse','Bearbeitung','Härten','Spannung durch Abschrecken, gerade/leicht geschwungen an Querschnittsänderungen.'],['Schleifrisse','Bearbeitung','Schleifen','Thermische Belastung: viele, kurze Risse quer zur Schleifrichtung.'],['Spannungsrisskorrosion','Bearbeitung','Galvanisieren/Beizen','Angreifende Medien + Eigenspannungen → Risse.'],['Interkristalline Korrosion','Bearbeitung','Beizen','Korngrenzen werden herausgelöst: netzartiges, rissähnliches Bild.'],['Poren, Schlacke, Bindefehler','Bearbeitung','Schweißen','Wie Gussfehler; Bindefehler liegen üblicherweise unter der Oberfläche.'],['Endkraterriss','Bearbeitung','Schweißen','Sternförmig am Schweißnahtende (Schmelzbad erstarrt plötzlich).'],['Wasserstoffinduzierte Risse, Lamellarrisse','Bearbeitung','Schweißen','Abkühlung/Wärmebehandlung, T-Stoß (Lamellarrisse).'],['Ermüdungsriss','Betrieb','Dynamische Last','Rastlinien markieren den Rissfortschritt; endet im Gewaltbruch.'],['Thermoschockriss','Betrieb','Thermische Wechsellast','Z. B. Turbinenschaufelkanten; endet bei Schwächung im Gewaltbruch.'],['Korrosion zwischen Blechen','Betrieb','Flugzeugzelle','Abtrag + Aufbeulung durch Korrosionsprodukte.']];
/* Fehlerskizzen für Spiel und Katalog */
function defectIcon(name,size=96){const c=h('canvas',{cls:'dic',width:size*2,height:size*2,style:'width:'+size+'px;height:'+size+'px'});const x=c.getContext('2d');x.scale(2,2);const s=size;
 const draw=()=>{x.clearRect(0,0,s,s);G.metal(x,4,s*.22,s-8,s*.6,/Korrosion/.test(name)?'alu':'steel',{r:6,hatch:.07});x.save();x.beginPath();x.rect(4,s*.22,s-8,s*.6);x.clip();const cx=s/2,cy=s*.52;x.strokeStyle='#14181d';x.fillStyle='#14181d';x.lineCap='round';x.lineJoin='round';
  srand(name.length*13);const jag=(x0,y0,x1,y1,n,amp)=>{x.beginPath();x.moveTo(x0,y0);for(let i=1;i<=n;i++){const t=i/n;x.lineTo(lerp(x0,x1,t)+(i<n?(rnd()-.5)*amp:0),lerp(y0,y1,t)+(i<n?(rnd()-.5)*amp:0))}x.stroke()};
  if(/Lunker/.test(name)){x.beginPath();x.moveTo(cx-12,cy-6);x.quadraticCurveTo(cx,cy-16,cx+12,cy-4);x.quadraticCurveTo(cx+6,cy+10,cx-4,cy+8);x.closePath();x.fill()}
  else if(/Poren/.test(name)){for(let i=0;i<9;i++){x.beginPath();x.arc(cx+(rnd()-.5)*s*.6,cy+(rnd()-.5)*s*.3,1.5+rnd()*3,0,TAU);x.fill()}}
  else if(/Einschl|Schlacke|Seiger/.test(name)){x.fillStyle='#5b4a2a';for(let i=0;i<6;i++){x.beginPath();x.ellipse(cx-s*.3+i*s*.12,cy+(rnd()-.5)*8,/zeile/.test(name)?9:3+rnd()*3,2+rnd()*2,0,0,TAU);x.fill()}}
  else if(/Dopplung/.test(name)){x.lineWidth=2.5;jag(10,cy,s-10,cy+2,10,2)}
  else if(/Flocken/.test(name)){for(let i=0;i<6;i++){const a=rnd()*TAU,px=cx+(rnd()-.5)*s*.5,py=cy+(rnd()-.5)*s*.25;x.lineWidth=1.4;jag(px,py,px+Math.cos(a)*7,py+Math.sin(a)*7,3,2)}}
  else if(/Schleif/.test(name)){x.lineWidth=1.3;for(let i=0;i<9;i++){const px=s*.18+i*s*.08;jag(px,cy-8+(rnd()-.5)*6,px+2,cy+8+(rnd()-.5)*6,3,2)}}
  else if(/Endkrater/.test(name)){x.lineWidth=1.6;for(let i=0;i<6;i++){const a=i/6*TAU;jag(cx,cy,cx+Math.cos(a)*14,cy+Math.sin(a)*10,3,3)}}
  else if(/interkristall/i.test(name)){x.lineWidth=1;for(let i=0;i<14;i++){const px=s*.15+rnd()*s*.7,py=s*.3+rnd()*s*.44;jag(px,py,px+(rnd()-.5)*16,py+(rnd()-.5)*12,2,2)}}
  else if(/Korrosion zwischen/.test(name)){x.fillStyle='#a5582e';x.beginPath();x.ellipse(cx,cy,s*.3,6,0,0,TAU);x.fill();x.fillStyle='#d99a6c';for(let i=0;i<20;i++){x.fillRect(cx-s*.28+rnd()*s*.56,cy-4+rnd()*8,2,2)}}
  else if(/Ermüdung/.test(name)){x.strokeStyle='rgba(20,24,29,.7)';x.lineWidth=1;for(let i=1;i<5;i++){x.beginPath();x.arc(10,s*.82,i*s*.12,-Math.PI/2,0);x.stroke()}x.lineWidth=2.4;jag(10,s*.82,s*.55,s*.3,8,3)}
  else if(/Riefen|Säume/.test(name)){x.lineWidth=1.5;for(let i=0;i<4;i++)jag(10,cy-12+i*8,s-10,cy-12+i*8,6,1)}
  else if(/Falte|Überlappung|Kaltschweiß|Bindefehler/.test(name)){x.lineWidth=2.4;x.beginPath();x.moveTo(s*.2,s*.22);x.quadraticCurveTo(cx,cy+6,s*.8,cy-2);x.stroke()}
  else{x.lineWidth=2.4;jag(cx-14,s*.22,cx+8,cy+10,6,5)}
  x.restore()};draw();CANVASES.add({redraw:()=>{if(c.isConnected)draw()}});return c}
sim('defgame','Fehler zuordnen: Herstellung – Bearbeitung – Betrieb','Ordne die zufällig gezogenen Unregelmäßigkeiten der richtigen Entstehungsphase zu. Die Erklärung zeigt Ursache und Merkmal.',b=>{
 let q=null,ok=0,n=0;const card=h('div',{cls:'card defcard'});const fb=h('div',{cls:'cap',style:'min-height:48px;font-size:14px'});const sc=h('div',{cls:'ro'});
 const next=()=>{q=DEFECTS[Math.floor(Math.random()*DEFECTS.length)];card.innerHTML='';card.append(defectIcon(q[0],110),h('div',{},h('small',{},'Welche Entstehungsphase?'),h('b',{},q[0])));sc.innerHTML='<div class="g"><b>'+ok+' / '+n+'</b>Treffer</div>'};
 b.append(card);const s=h('div',{cls:'seg',style:'justify-content:center'});['Herstellung','Bearbeitung','Betrieb'].forEach(k=>btn(s,k,()=>{n++;const r=q[1]===k;if(r)ok++;fb.innerHTML=(r?'<b style="color:var(--ok)">✔ Richtig.</b> ':'<b style="color:var(--bad)">✘ Gehört zu: '+q[1]+'.</b> ')+q[0]+' – '+q[2]+': '+q[3];next()}));b.append(s,fb,sc);next()});
sim('atlas','Fehlerkatalog (Objektkunde)','Filtere nach Entstehungsphase und lies Ursache, Ort und Merkmal – wichtig für die Wahl des Prüfverfahrens.',b=>{
 let f='alle';const list=h('div',{cls:'atlas'});const draw=()=>{list.innerHTML='';DEFECTS.filter(d=>f==='alle'||d[1]===f).forEach(d=>list.append(h('div',{cls:'acard'},defectIcon(d[0],84),h('div',{},h('b',{},d[0]),h('div',{},h('span',{cls:'badge'},d[1]),h('span',{cls:'badge'},d[2])),h('p',{},d[3])))))};
 seg(b,[['alle','Alle'],['Herstellung','Herstellung'],['Bearbeitung','Bearbeitung'],['Betrieb','Betrieb']],'alle',v=>{f=v;draw()});b.append(list);draw()});
