"use strict";
/* =====================================================================
   Erklärvideos – mehrszenige Animationen (virtuelle Bühne 960 × 540)
   ===================================================================== */
const VW=960,VH=540;
/* dunkle Divergenz-Skala für Stromdichte: blau ← schwarz → orange/gelb */
const vdiv=v=>{const a=Math.min(1,Math.abs(v));return v>=0?(a<.6?G.mix('#0a1522','#ff5a14',a/.6):G.mix('#ff5a14','#ffe08a',(a-.6)/.4)):(a<.6?G.mix('#0a1522','#1f7fe0',a/.6):G.mix('#1f7fe0','#a8e1ff',(a-.6)/.4))};
function vstage(draw){return(c,t,w,h)=>{const sv=T;T=PAL.dark;c.save();c.scale(w/VW,h/VH);try{draw(c,t)}finally{c.restore();T=sv}}}
let _vbuf=null;
/* Szenen mit weicher Überblendung (über Puffer, damit Transparenzen sauber bleiben) */
function vscenes(c,t,list){for(const[a,b,fn]of list){if(t<a-.02||t>b+.02)continue;const al=Math.min(clamp((t-a)/.7,0,1),clamp((b-t)/.7,0,1));const lt=t-a,p=clamp((t-a)/(b-a),0,1);
 if(al>=.999){c.save();fn(lt,p);c.restore();continue}if(al<=.001)continue;
 const cv=c.canvas;if(!_vbuf)_vbuf=document.createElement('canvas');if(_vbuf.width!==cv.width||_vbuf.height!==cv.height){_vbuf.width=cv.width;_vbuf.height=cv.height}const b2=_vbuf.getContext('2d');b2.setTransform(1,0,0,1,0,0);b2.clearRect(0,0,cv.width,cv.height);b2.setTransform(c.getTransform());
 b2.save();fn.call(null,lt,p,b2);b2.restore();c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=al;c.drawImage(_vbuf,0,0);c.restore()}}
function studio(c,t,hue='#0f2c44'){const g=c.createRadialGradient(VW*.5,VH*.32,40,VW*.5,VH*.55,VW*.78);g.addColorStop(0,hue);g.addColorStop(1,'#04090f');c.fillStyle=g;c.fillRect(0,0,VW,VH);
 c.fillStyle='rgba(255,255,255,.035)';for(let y=15;y<VH;y+=30)for(let x=15+((y/30|0)%2)*15;x<VW;x+=30)c.fillRect(x,y,1.4,1.4);
 for(let i=0;i<14;i++){const x=(i*137.5+t*8*(1+i%3))%VW,y=(i*91.3+Math.sin(t*.3+i)*30+VH)%VH;c.fillStyle='rgba(94,234,212,'+(.04+.04*Math.sin(t+i))+')';c.beginPath();c.arc(x,y,1.5+i%3,0,TAU);c.fill()}}
function vchip(c,txt,col='#2dd4bf'){c.save();c.font=G.font(13,750);const w=c.measureText(txt).width+26;c.fillStyle='rgba(8,20,32,.75)';G.rr(c,24,22,w,30,15);c.fill();c.strokeStyle=G.rgba(col,.45);c.lineWidth=1;c.stroke();c.fillStyle=col;c.beginPath();c.arc(38,37,4,0,TAU);c.fill();c.fillStyle='#e6f6f4';c.textBaseline='middle';c.fillText(txt,48,37.5);c.restore()}
function vtitle(c,lt,o){studio(c,lt,o.hue);const a=easeOut(lt/1.2);c.save();c.globalAlpha*=a;c.textAlign='center';
 c.font=G.font(14,800);c.fillStyle='#5eead4';c.fillText(o.kicker.toUpperCase().split('').join(String.fromCharCode(8202)),VW/2,VH*.36);
 c.font='700 46px "Source Serif 4",Georgia,serif';c.fillStyle='#ffffff';c.fillText(o.title,VW/2,VH*.36+60);
 const lw=easeOut((lt-.3)/1)*220;c.fillStyle='#2dd4bf';G.rr(c,VW/2-lw/2,VH*.36+80,lw,3,2);c.fill();
 c.font=G.font(18,500);c.fillStyle='#b9cbdc';c.fillText(o.sub,VW/2,VH*.36+118);c.restore();if(o.deco)o.deco(c,lt)}
function vcard(c,x,y,w,h,o={}){c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=24;c.shadowOffsetY=8;c.fillStyle=o.bg||'rgba(12,28,44,.92)';G.rr(c,x,y,w,h,16);c.fill();c.shadowColor='transparent';c.strokeStyle=o.line||'rgba(255,255,255,.1)';c.lineWidth=1;c.stroke();if(o.accent){c.fillStyle=o.accent;G.rr(c,x,y,5,h,3);c.fill()}c.restore()}
function vtext(c,t,x,y,o={}){G.text(c,t,x,y,Object.assign({col:'#e6eef7',size:16,weight:600},o))}
function vformula(c,lines,x,y,a=1){const w=Math.max(...lines.map(l=>G.tw(c,l,20,600,true)))+48,h=lines.length*34+26;vcard(c,x-w/2,y,w,h,{accent:'#2dd4bf'});lines.forEach((l,i)=>{c.save();c.globalAlpha*=clamp(a*lines.length-i,0,1);G.text(c,l,x,y+40+i*34,{align:'center',size:20,weight:600,mono:true,col:'#e0f2fe'});c.restore()})}
function vbullets(c,items,x,y,lt,o={}){items.forEach((s,i)=>{const a=easeOut((lt-(o.d0||0)-i*(o.step||.7))/.6);if(a<=0)return;c.save();c.globalAlpha*=a;c.translate((1-a)*24,0);vcard(c,x,y+i*(o.gap||64),o.w||420,(o.gap||64)-12,{accent:o.cols?o.cols[i]:'#2dd4bf'});G.text(c,s,x+22,y+i*(o.gap||64)+(o.gap||64)/2-1,{size:o.size||17,weight:600,col:'#eef6ff'});c.restore()})}

/* ------------------------------------------------------------------ */
vid('induktion',{title:'Induktion und Selbstinduktion',dur:64,
 scenes:[{t:0,n:'Titel'},{t:5,n:'Magnet & Spule'},{t:21,n:'Induktionsgesetz'},{t:27,n:'Selbstinduktion'},{t:43,n:'Impedanz'},{t:57,n:'Zusammenfassung'}],
 caps:[[0,''],[5,'Ein Magnet bewegt sich auf eine Spule zu. Sein Magnetfeld – berechnet aus Ersatz-Ringströmen – durchsetzt immer mehr Windungen.'],[9,'Der magnetische Fluss in der Spule ändert sich: Es wird eine Spannung induziert. Der Zeiger schlägt aus.'],[12.5,'Steht der Magnet still, ändert sich der Fluss nicht mehr – die Spannung ist null, auch wenn das Feld stark ist.'],[15.5,'Beim Herausziehen nimmt der Fluss ab: Die Spannung kehrt ihr Vorzeichen um. Der Induktionsstrom wirkt der Bewegung entgegen (Lenz).'],[21,'Induktionsgesetz: Die induzierte Spannung ist proportional zur Windungszahl N und zur Änderungsgeschwindigkeit des Flusses.'],[27,'Fließt Wechselstrom durch die Spule, ändert sich ihr eigenes Feld ständig – sie induziert eine Gegenspannung in sich selbst: Selbstinduktion.'],[33,'Die Gegenspannung bremst jede Stromänderung. Folge: Der Strom hinkt der Spannung um den Phasenwinkel Δφ hinterher.'],[43,'Wirkwiderstand R und Blindwiderstand X_L stehen senkrecht aufeinander. Zusammen ergeben sie die Impedanz Z.'],[50,'Mit steigender Frequenz wächst X_L = 2π·f·L: Der Punkt wandert in der Impedanzebene nach oben, der Phasenwinkel wird größer.'],[57,'Das ist die Grundlage der Wirbelstromprüfung: Alles, was die Spule „sieht“, verändert R und X_L – und damit den Punkt in der Impedanzebene.']],
 draw:vstage((c,t)=>{studio(c,t);
  vscenes(c,t,[
   [0,5.2,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo 1 · Grundlagen',title:'Induktion und Selbstinduktion',sub:'Vom bewegten Magneten zur Impedanzebene',deco:(c2,l)=>G.coil(c2,VW/2,VH*.78,200,34,12,{I:Math.sin(l*3)*.8,phase:l*.7})})],
   [5,21.2,(lt,p,cc=c)=>{const c2=cc;studio(c2,t);vchip(c2,'1 · Magnet und Spule');const T0=t;const path=tt=>tt<6?lerp(150,520,easeIO((tt-1)/5)):tt<10.5?520:lerp(520,150,easeIO((tt-10.5)/5));
    const mx=path(T0-5),mx0=path(T0-5-.05),v=(mx-mx0)/.05;const cx=560,cy=230,mw=170,mh=46;
    const loops=[];for(let k=0;k<10;k++)loops.push([mh*.42,-mw/2+mw*(k+.5)/10,1]);const res=G.fieldLines(loops,[-260,260,-700,700],{key:'vmag',nx:60,ny:140,n:10,rmax:mh*.42,span:.95});
    c2.save();c2.beginPath();c2.rect(0,60,VW,330);c2.clip();G.drawField(c2,res,(r,z)=>[mx+z,cy+r],'#74bcff',{alpha:.42,lw:1.4});fieldArrows(c2,res.lines,(r,z)=>[mx+z,cy+r],(r,z)=>{const d=Bdir(loops,r,z);return[-d[0],-d[1]]},'rgba(116,188,255,.85)',{skip:p=>Math.abs(p[0])<mh*.5&&Math.abs(p[1])<mw/2});c2.restore();
    const dist=(mx-cx)/180,Phi=1/Math.pow(1+dist*dist,1.5),U=v*(-3*dist/180)*Math.pow(1+dist*dist,-2.5)*50;const I=clamp(U/2.2,-1,1);
    G.coil(c2,cx,cy,190,74,11,{I,phase:T0*Math.sign(I)*.8,inner:k=>{k.save();k.translate(-cx,-cy);if(Math.abs(mx-cx)<180)G.magnet(k,mx,cy,mw,mh,1,{shadow:false});k.restore()}});if(Math.abs(mx-cx)>=180)G.magnet(c2,mx,cy,mw,mh,1);
    G.meter(c2,820,140,70,U/3,{unit:'mV'});
    // Verlauf
    const R={x:70,y:395,w:820,h:110};vcard(c2,R.x-20,R.y-14,R.w+40,R.h+28,{bg:'rgba(8,18,28,.85)'});c2.strokeStyle='rgba(255,255,255,.12)';c2.beginPath();c2.moveTo(R.x,R.y+R.h/2);c2.lineTo(R.x+R.w,R.y+R.h/2);c2.stroke();
    const pts=[];for(let s=5;s<=Math.min(T0,21);s+=.04){const a=path(s-5),b2=path(s-5-.04),vv=(a-b2)/.04,d=(a-cx)/180,uu=vv*(-3*d/180)*Math.pow(1+d*d,-2.5)*50;pts.push([R.x+(s-5)/16*R.w,R.y+R.h/2-clamp(uu/3.2,-1,1)*R.h*.45])}G.trace(c2,pts,'#ffb34a',2.4);if(pts.length)G.spot(c2,pts[pts.length-1][0],pts[pts.length-1][1],'#ffb34a',3.5);
    G.text(c2,'U_ind',R.x+6,R.y+14,{col:'#ffcf8a',size:13,weight:700});
    const ph=T0<11?'hinein':T0<15.5?'Stillstand':'heraus';G.label(c2,ph==='hinein'?'Magnet fährt hinein → U > 0':ph==='Stillstand'?'Magnet steht still → U = 0':'Magnet fährt heraus → U < 0',VW/2,78,{align:'center',size:16,col:ph==='Stillstand'?'#5eead4':ph==='hinein'?'#ffb34a':'#b49bff',bg:'rgba(8,20,32,.8)'});
    if(Math.abs(U)>.4){const appr=v>0;G.badge(c2,appr?'S':'N',cx-118,cy-96,appr?'#2f6fd0':'#d62839',{align:'center',size:13});G.label(c2,appr?'Abstoßung':'Anziehung',cx-118,cy-126,{align:'center',size:12,col:'#ffcf8a',bg:'rgba(8,20,32,.8)'})}}],
   [21,27.2,(lt,p,cc=c)=>{studio(cc,t,'#132b44');vchip(cc,'2 · Induktionsgesetz');vformula(cc,['U = − N · dΦ / dt','Φ = B · A'],VW/2,140,easeOut(lt/2));vbullets(cc,['N  –  Windungszahl: mehr Windungen, mehr Spannung','dΦ/dt  –  nur die Änderung zählt, nicht das Feld','Minuszeichen  –  Lenz: Wirkung gegen die Ursache'],VW/2-300,290,lt,{w:600,d0:1.2,size:16})}],
   [27,43.2,(lt,p,cc=c)=>{const c2=cc;studio(c2,t,'#10283f');vchip(c2,'3 · Selbstinduktion');const ph=t*TAU*.35,lag=clamp((t-30)/7,0,1)*55*D2R,I=Math.sin(ph-lag);
    const cx=230,cy=230,len=200,rad=64;const loops=[];for(let k=0;k<12;k++)loops.push([rad*.92,-len/2+len*(k+.5)/12,1]);const res=G.fieldLines(loops,[-240,240,-330,330],{key:'vsol',nx:56,ny:90,n:8,rmax:rad,span:.95});
    c2.save();c2.beginPath();c2.rect(0,60,470,360);c2.clip();G.drawField(c2,res,(r,z)=>[cx+z,cy+r],'#74bcff',{alpha:.15+.5*Math.abs(I),lw:1.4,flow:t*3*Math.sign(I),flowCol:'#d6ecff',flowA:.5*Math.abs(I)});c2.restore();
    G.coil(c2,cx,cy,len,rad,12,{I:I*.9,phase:t*Math.sign(I)});
    // Wechselspannungsquelle
    c2.strokeStyle='#9fb3c8';c2.lineWidth=2;c2.beginPath();c2.moveTo(cx-len/2-6,cy-rad-14);c2.lineTo(cx-len/2-6,cy-rad-60);c2.lineTo(cx-30,cy-rad-60);c2.moveTo(cx+30,cy-rad-60);c2.lineTo(cx+len/2+14,cy-rad-60);c2.lineTo(cx+len/2+14,cy+rad+14);c2.stroke();
    c2.fillStyle='#0c1c2c';c2.beginPath();c2.arc(cx,cy-rad-60,24,0,TAU);c2.fill();c2.stroke();c2.beginPath();for(let k=0;k<=20;k++)c2.lineTo(cx-14+k*1.4,cy-rad-60-Math.sin(k/20*TAU)*8);c2.stroke();
    // Zeiger + Kurven
    const px=600,py=230,pr=80;vcard(c2,490,90,450,300,{bg:'rgba(6,16,26,.85)'});c2.strokeStyle='rgba(255,255,255,.12)';c2.beginPath();c2.arc(px-50,py,pr,0,TAU);c2.stroke();
    G.arrow(c2,px-50,py,px-50+Math.cos(ph)*pr,py-Math.sin(ph)*pr,'#ff9d5c',{lw:3,glow:8});G.arrow(c2,px-50,py,px-50+Math.cos(ph-lag)*pr*.8,py-Math.sin(ph-lag)*pr*.8,'#59b6ff',{lw:3,glow:8});
    if(lag>.05){c2.strokeStyle='#5eead4';c2.lineWidth=2;c2.beginPath();c2.arc(px-50,py,30,-ph,-ph+lag);c2.stroke();G.text(c2,'Δφ',px-50+Math.cos(ph-lag/2)*44-8,py-Math.sin(ph-lag/2)*44+5,{col:'#5eead4',size:14,weight:800})}
    const wx=px+50,ww=270;const u=[],i2=[];for(let k=0;k<=120;k++){const a=ph-k/120*TAU*1.4;u.push([wx+k/120*ww,py-Math.sin(a)*pr]);i2.push([wx+k/120*ww,py-Math.sin(a-lag)*pr*.8])}G.trace(c2,u,'#ff9d5c',2);G.trace(c2,i2,'#59b6ff',2);
    G.line(c2,[[px-50+Math.cos(ph)*pr,py-Math.sin(ph)*pr],[wx,py-Math.sin(ph)*pr]],'rgba(255,157,92,.4)',1,{dash:[3,3]});G.line(c2,[[px-50+Math.cos(ph-lag)*pr*.8,py-Math.sin(ph-lag)*pr*.8],[wx,py-Math.sin(ph-lag)*pr*.8]],'rgba(89,182,255,.4)',1,{dash:[3,3]});
    G.text(c2,'Spannung u',510,116,{col:'#ff9d5c',size:14,weight:700});G.text(c2,'Strom i',620,116,{col:'#59b6ff',size:14,weight:700});G.text(c2,'Δφ = '+fmt(lag/D2R,0)+'°',920,116,{col:'#5eead4',size:14,weight:800,align:'right'});
    if(t>33)G.label(c2,'Der Strom hinkt der Spannung nach',715,410,{align:'center',size:15,col:'#5eead4',bg:'rgba(8,20,32,.85)'})}],
   [43,57.2,(lt,p,cc=c)=>{const c2=cc;studio(c2,t,'#13283d');vchip(c2,'4 · Impedanz und Impedanzebene');const ox=150,oy=440,sR=300,f=lerp(.4,1.35,easeIO((lt-7)/6.5)),XL=lt<7?.9:f,s=260;
    c2.strokeStyle='rgba(255,255,255,.25)';c2.lineWidth=1.4;c2.beginPath();c2.moveTo(ox-20,oy);c2.lineTo(ox+sR+120,oy);c2.moveTo(ox,oy+20);c2.lineTo(ox,90);c2.stroke();G.text(c2,'Wirkwiderstand R →',ox+sR+110,oy+28,{align:'right',col:'#9fb3c8',size:13});G.text(c2,'↑ Blindwiderstand X',ox+8,96,{col:'#9fb3c8',size:13});
    const a1=easeOut(lt/1.2),a2=easeOut((lt-1.4)/1.2),a3=easeOut((lt-2.8)/1.2);const R=1;const px=ox+R*s,py=oy-XL*s;
    if(a1>0)G.arrow(c2,ox,oy,ox+R*s*a1,oy,'#e6eef7',{lw:4,glow:6});if(a2>0)G.arrow(c2,px,oy,px,oy-XL*s*a2,'#b49bff',{lw:4,glow:8});if(a3>0){c2.save();c2.globalAlpha*=a3;c2.fillStyle='rgba(180,155,255,.1)';c2.beginPath();c2.moveTo(ox,oy);c2.lineTo(px,oy);c2.lineTo(px,py);c2.closePath();c2.fill();G.arrow(c2,ox,oy,px,py,'#ff6b7a',{lw:4.5,glow:10});const ang=Math.atan2(XL,R);c2.strokeStyle='#5eead4';c2.lineWidth=2.5;c2.beginPath();c2.arc(ox,oy,70,-ang,0);c2.stroke();G.text(c2,'Δφ',ox+80,oy-18,{col:'#5eead4',size:16,weight:800});c2.restore()}
    if(a1>.5)G.rich(c2,'R',ox+R*s/2,oy+30,{align:'center',size:18,col:'#e6eef7'});if(a2>.5)G.rich(c2,'X_L = 2π·f·L',px+14,oy-XL*s/2,{size:18,col:'#c9b6ff'});if(a3>.5)G.rich(c2,'Z',ox+R*s/2-20,oy-XL*s/2-14,{align:'right',size:22,weight:800,col:'#ff8a96'});
    if(lt>7){G.spot(c2,px,py,'#ffd166',5);G.label(c2,'f ↑  → X_L ↑',px+16,py-6,{size:14,col:'#ffd166',bg:'rgba(8,20,32,.85)'})}
    vformula(c2,['Z² = R² + X_L²','tan Δφ = X_L / R'],760,150,easeOut((lt-3.5)/2))}],
   [57,65,(lt,p,cc=c)=>{studio(cc,t,'#0f2a40');vchip(cc,'Zusammenfassung');G.text(cc,'Das Wichtigste',VW/2,110,{align:'center',size:30,weight:800,col:'#fff'});vbullets(cc,['Nur eine Flussänderung induziert Spannung: U = −N·dΦ/dt','Selbstinduktion: Spule bremst Stromänderungen → Strom hinkt nach','X_L = 2π·f·L wächst mit der Frequenz','R und X_L bilden die Impedanzebene – das „Messfenster“ der ET'],VW/2-330,150,lt,{w:660,size:17,cols:['#ffb34a','#59b6ff','#b49bff','#2dd4bf']})}]
  ])})});

/* ------------------------------------------------------------------ */
function vSection(c,t,o){/* Schnittbild: Spule über Platte mit berechneten Feldlinien; o:{cx,py,kap,dpx,lift,amp,sgn,crack,eddy} */
 const pw=VW*.62,px=o.px??40,ph=150,py=o.py;const rc=56,hc=40,z0=hc/2+10+o.lift;
 G.slab(c,px,py,pw,ph,40,26,'alu',{shadow:false});
 if(o.eddy>0){c.save();c.beginPath();c.rect(px,py,pw,ph);c.clip();[-1,1].forEach(sg=>{const ex=o.cx+sg*rc;const I=o.eddy*(o.crackAt!=null?1-.8*Math.exp(-Math.pow((ex-o.crackAt)/50,2)):1);const g=c.createRadialGradient(ex,py,1,ex,py,o.dpx*1.5+40);g.addColorStop(0,G.rgba('#ff4a0a',.9*I));g.addColorStop(.45,G.rgba('#ff7a2a',.5*I));g.addColorStop(1,'rgba(255,138,58,0)');c.fillStyle=g;c.fillRect(ex-200,py,400,ph)});c.restore();
  [-1,1].forEach(sg=>G.winding(c,o.cx+sg*rc,py+Math.min(o.dpx*.6,40),7,-sg*o.sgn))}
 if(o.crackAt!=null){c.fillStyle='#06090c';c.beginPath();c.moveTo(o.crackAt-3,py);c.lineTo(o.crackAt+3,py);c.lineTo(o.crackAt+.6,py+70);c.lineTo(o.crackAt-.6,py+70);c.closePath();c.fill();G.label(c,'Riss',o.crackAt,py+86,{align:'center',size:13,col:'#ff8a96',bg:'rgba(8,20,32,.85)'})}
 const key='vs'+Math.round(o.kap*20)+'_'+Math.round(o.dpx)+'_'+Math.round(o.lift);let res=G._fcache.get(key);
 if(!res){const box=[-330,330,-ph,360],nx=110,ny=80,F=new Float64Array(nx*ny);const[x0,x1,y0,y1]=box;const L=[[rc,z0-hc*.3],[rc,z0],[rc,z0+hc*.3]];
  for(let j=0;j<ny;j++){const z=y0+(y1-y0)*j/(ny-1);for(let i=0;i<nx;i++){const r=x0+(x1-x0)*i/(nx-1);let s=0;if(z>=0){for(const q of L)s+=G.psiLoop(r,z,q[0],q[1])-o.kap*G.psiLoop(r,z,q[0],-q[1])}else{for(const q of L)s+=(1-o.kap)*G.psiLoop(r,z,q[0],q[1]);s*=Math.exp(z/o.dpx)}F[j*nx+i]=s}}
  let ref=0;for(const q of L)ref+=G.psiLoop(rc*.85,z0,q[0],q[1]);const lines=[];for(let k=0;k<10;k++)lines.push(...G.contour(F,nx,ny,ref*(k+.5)/10*.9).map(pl=>pl.map(([i,j])=>[x0+(x1-x0)*i/(nx-1),y0+(y1-y0)*j/(ny-1)])));res={lines};G._fcache.set(key,res)}
 c.save();c.beginPath();c.rect(0,56,VW,VH-56);c.clip();G.drawField(c,res,(r,z)=>[o.cx+r,py-z],'#74bcff',{alpha:.18+.5*o.amp,lw:1.5,flow:t*o.sgn*4,flowCol:'#d6ecff',flowA:.5*o.amp});c.restore();
 if(o.secondary>0){const sres=G.fieldLines([[rc,-z0,1]],[-300,300,0,330],{key:'vsec'+Math.round(z0),nx:70,ny:70,n:6,rmax:rc*.9,span:.9});c.save();c.beginPath();c.rect(px-40,56,pw+80,py-56);c.clip();c.setLineDash([7,6]);c.lineDashOffset=t*20*o.sgn;G.drawField(c,sres,(r,z)=>[o.cx+r,py-z+0],'#ff8d50',{alpha:.65*o.secondary*o.amp,lw:1.8});c.restore();c.setLineDash([])}
 const cy=py-z0;c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=14;c.fillStyle='rgba(40,62,84,.7)';G.rr(c,o.cx-rc-18,cy-hc/2-10,2*rc+36,hc+20,10);c.fill();c.restore();G.metal(c,o.cx-rc*.42,cy-hc/2-6,rc*.84,hc+12,'ferrite',{r:3});
 [-1,1].forEach(sg=>{for(let a=0;a<2;a++)for(let q=0;q<3;q++)G.winding(c,o.cx+sg*(rc-5+a*10)-(sg<0?0:10)+5,cy-hc*.3+q*hc*.3,6,sg*o.sgn)});
 c.strokeStyle='#0b1218';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(o.cx,cy-hc/2-10);c.bezierCurveTo(o.cx,cy-hc-40,o.cx+50,cy-hc-40,o.cx+70,60);c.stroke()}
function vScreen(c,x,y,s,trail,pt,o={}){const S=G.screen(c,x,y,s,s,{label:o.label||'Impedanzebene',bezel:8});const m=mapper({x:S.x+16,y:S.y+24,w:S.w-26,h:S.h-36},[-.04,.46],[.18,1.06]);
 const pts=[];for(let e=-2;e<=3.4;e+=.05){const n=normImp(Math.pow(10,e),o.eta??.85);pts.push([m.x(n.R),m.y(n.X)])}G.trace(c,pts,'rgba(61,255,149,.35)',1.2,{blur:2});
 if(trail)G.persist(c,trail.map(p=>[m.x(p[0]),m.y(p[1])]),o.tc||PH.a,2.2);if(pt)G.spot(c,m.x(pt[0]),m.y(pt[1]),PH.g,5);if(o.extra)o.extra(m,S);G.stext(c,'R →',S.x+S.w-34,S.y+S.h-8);G.stext(c,'↑ X',S.x+8,S.y+38);G.glass(c,S);return m}
vid('wirbel',{title:'Das Wirbelstromprinzip',dur:72,
 scenes:[{t:0,n:'Titel'},{t:5,n:'Primärfeld'},{t:16,n:'Wirbelströme'},{t:30,n:'Impedanz'},{t:42,n:'Riss'},{t:58,n:'Einflussgrößen'}],
 caps:[[0,''],[5,'Eine Spule mit Wechselstrom erzeugt ein magnetisches Wechselfeld – die Feldlinien schließen sich um die Windungen.'],[10,'Noch ist kein Prüfteil in der Nähe: Die Spule arbeitet „im Leerlauf“, das Feld breitet sich ungestört aus.'],[16,'Kommt ein elektrisch leitfähiges Prüfteil in das Feld, werden darin kreisförmige Wirbelströme induziert.'],[22,'Nach Lenz erzeugen die Wirbelströme ein Gegenfeld (orange gestrichelt). Das Feld wird aus dem Werkstoff verdrängt und an der Oberfläche zusammengedrückt.'],[30,'Das geschwächte resultierende Feld verändert Strom und Spannung der Spule: Ihre Impedanz ändert sich.'],[35,'Nähert sich die Spule dem Prüfteil, wandert der Punkt in der Impedanzebene vom Leerlaufpunkt zum Arbeitspunkt – das ist die Abhebekurve.'],[42,'Ein Riss unterbricht die Wirbelstrombahnen: Die Ströme müssen um ihn herumfließen, ihre Wirkung sinkt.'],[49,'Die Impedanz ändert sich in eine andere Richtung als beim Abheben – darum lassen sich Riss- und Lift-off-Signal über die Phase trennen.'],[58,'Viele Größen verschieben den Arbeitspunkt: Frequenz, Leitfähigkeit, Permeabilität, Abstand, Geometrie – und der gesuchte Fehler.'],[65,'Die Kunst der Wirbelstromprüfung: das Fehlersignal so einstellen, dass es sich deutlich von allen Störgrößen abhebt.']],
 draw:vstage((c,t)=>{studio(c,t);const sgn=Math.sin(t*3)>=0?1:-1,amp=Math.abs(Math.sin(t*3));
  vscenes(c,t,[
   [0,5.2,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo 2 · Prinzip',title:'Das Wirbelstromprinzip',sub:'Feld, Wirbelströme, Gegenfeld und Impedanz',hue:'#0f2a3e',deco:(c2,l)=>{G.slab(c2,VW/2-180,VH*.82,360,30,40,22,'alu',{shadow:false});G.eddies(c2,VW/2+20,VH*.82-11,90,10,{t:l,n:3,I:.9,glow:true});G.probe(c2,VW/2+20,VH*.82-14,34,{len:60,cable:false,I:Math.sin(l*3)*.7})}})],
   [5,16.2,(lt,p,cc=c)=>{studio(cc,t);vchip(cc,'1 · Primärfeld der Spule');vSection(cc,t,{cx:300,py:400,kap:0,dpx:200,lift:120,amp,sgn,eddy:0,secondary:0,px:-700});G.label(cc,'Spule mit Wechselstrom',300,90,{align:'center',size:15,col:'#ffcf8a',bg:'rgba(8,20,32,.85)'});vScreen(cc,610,100,320,null,[0,1],{label:'Impedanzebene (Leerlauf)'})}],
   [16,30.2,(lt,p,cc=c)=>{studio(cc,t);vchip(cc,'2 · Wirbelströme und Gegenfeld');const k=easeIO(lt/6);vSection(cc,t,{cx:330,py:340,kap:.7*k,dpx:40,lift:16,amp,sgn,eddy:k,secondary:clamp((lt-6)/2,0,1)});
    G.label(cc,'Wirbelströme',520,370,{size:14,col:'#ff9d5c',bg:'rgba(8,20,32,.85)'});if(lt>6)G.label(cc,'Gegenfeld H_W',440,120,{size:14,col:'#ff9d5c',bg:'rgba(8,20,32,.85)'});
    // 3D-Detail
    vcard(cc,660,80,270,200,{bg:'rgba(6,16,26,.85)'});G.slab(cc,690,220,190,32,36,22,'alu',{shadow:false});G.eddies(cc,800,209,70,9,{t:t,n:4,I:k,glow:true});G.probe(cc,800,205,30,{len:80,I:Math.sin(t*3)*.8});G.text(cc,'Draufsicht schräg',680,104,{size:12,weight:700,col:'#9fb3c8'})}],
   [30,42.2,(lt,p,cc=c)=>{studio(cc,t);vchip(cc,'3 · Impedanzänderung');const k=easeIO((lt-3)/7);const lift=lerp(120,16,k);const kap=lerp(.08,.7,k);vSection(cc,t,{cx:280,py:380,kap,dpx:40,lift,amp,sgn,eddy:lerp(.1,1,k),secondary:.6*k,px:-80});
    const eta=Math.exp(-lift/60);const tr=[];for(let s=0;s<=k;s+=.02){const l2=lerp(120,16,s);const n=normImp(12,Math.exp(-l2/60)*.85);tr.push([n.R,n.X])}const n=normImp(12,eta*.85);
    vScreen(cc,590,90,340,tr,[n.R,n.X],{extra:(m,S)=>{G.stext(cc,'Leerlauf',m.x(0)+8,m.y(1)-8,{size:11});if(k>.95)G.stext(cc,'Arbeitspunkt',m.x(n.R)+10,m.y(n.X)+16,{col:PH.g,size:11})}});
    G.dim(cc,420,380,420,380-lift-30,'Abstand',{col:'#9fb3c8',size:12})}],
   [42,58.2,(lt,p,cc=c)=>{studio(cc,t);vchip(cc,'4 · Ein Riss stört die Wirbelströme');const xs=lerp(150,520,easeIO((lt-1)/12)),crx=340;const nr=Math.exp(-Math.pow((xs-crx)/70,2));
    // 3D-Platte groß
    G.slab(cc,40,300,470,90,120,70,'alu',{shadow:false});cc.strokeStyle='#06090c';cc.lineWidth=3;cc.beginPath();cc.moveTo(crx,300);srand(9);for(let k2=1;k2<=10;k2++)cc.lineTo(crx+k2*12+(rnd()-.5)*5,300-k2*7);cc.stroke();
    const ex=xs+60,ey=265;G.eddies(cc,ex,ey,95,22,{t:t,n:4,I:1-.3*nr,glow:true,crack:Math.abs(ex-400)<95?400:null,gap:10});G.probe(cc,ex,ey-4,40,{len:120,I:Math.sin(t*3)*.8});
    // Signal
    const tr=[];for(let s=0;s<=lt;s+=.05){const x2=lerp(150,520,easeIO((s-1)/12));const n2=Math.exp(-Math.pow((x2-crx)/70,2));const b0=normImp(12,.85*Math.exp(-16/60));tr.push([b0.R-.06*n2*Math.cos(1.1)+.03*n2,b0.X+.08*n2])}
    const b0=normImp(12,.85*Math.exp(-16/60));vScreen(cc,660,110,280,tr,tr[tr.length-1],{tc:PH.r,extra:(m)=>{const lo=[];for(let l=0;l<=80;l+=4){const n3=normImp(12,.85*Math.exp(-l/60));lo.push([m.x(n3.R),m.y(n3.X)])}G.line(cc,lo,'rgba(255,192,74,.7)',1.5,{dash:[5,4]});G.stext(cc,'Lift-off',lo[lo.length-1][0]+6,lo[lo.length-1][1],{col:PH.a,size:11});G.stext(cc,'Riss',m.x(b0.R)+30,m.y(b0.X+.1),{col:PH.r,size:12})}});
    if(nr>.5)G.label(cc,'Wirbelströme werden umgelenkt',330,120,{align:'center',size:15,col:'#ff9d5c',bg:'rgba(8,20,32,.85)'})}],
   [58,73,(lt,p,cc=c)=>{studio(cc,t,'#122c45');vchip(cc,'5 · Einflussgrößen in der Impedanzebene');const S=vScreen(cc,60,80,400,null,null,{extra:(m)=>{const b0=normImp(6,.85);const P0=[m.x(b0.R),m.y(b0.X)];G.spot(cc,P0[0],P0[1],'#ffffff',4);
     const dirs=[['Lift-off',PH.a,[m.x(0),m.y(1)]],['σ ↑ / f ↑',PH.g,(()=>{const n=normImp(16,.85);return[m.x(n.R),m.y(n.X)]})()],['Riss',PH.r,[P0[0]+30,P0[1]-70]],['μ ↑',PH.b,[P0[0]+10,P0[1]-110]],['σ ↓ / f ↓',PH.c,(()=>{const n=normImp(2.2,.85);return[m.x(n.R),m.y(n.X)]})()]];
     dirs.forEach(([l,col,q],i)=>{const a=easeOut((lt-.5-i*.8)/.8);if(a<=0)return;const x=lerp(P0[0],q[0],a),y=lerp(P0[1],q[1],a);G.arrow(cc,P0[0],P0[1],x,y,col,{lw:2.6,glow:8});if(a>.9)G.stext(cc,l,x+6,y-6,{col,size:12})})}});
    vbullets(cc,['Frequenz f','Leitfähigkeit σ','Permeabilität μ','Abstand (Lift-off)','Geometrie, Kanten, Wanddicke','gesucht: Fehler'],520,90,lt,{w:380,gap:58,size:16,cols:['#5ff0e0','#3dff95','#59b6ff','#ffc04a','#c39bff','#ff5d6c']})}]
  ])})});

/* ------------------------------------------------------------------ */
vid('skin',{title:'Skineffekt und Eindringtiefe',dur:58,
 scenes:[{t:0,n:'Titel'},{t:4,n:'Stromdichte im Schnitt'},{t:18,n:'Eindringtiefe δ'},{t:31,n:'Frequenz'},{t:45,n:'Werkstoffe'}],
 caps:[[0,''],[4,'Im Schnitt durch das Prüfteil sieht man die Wirbelstromdichte: an der Oberfläche am stärksten, nach innen immer schwächer.'],[10,'Rot und Blau sind entgegengesetzte Stromrichtungen: Die Wirbelströme laufen als gedämpfte Welle in die Tiefe – mit zunehmender Phasenverschiebung.'],[18,'Die Einhüllende fällt exponentiell. Bei der Standard-Eindringtiefe δ ist die Stromdichte auf 1/e ≈ 37 % gesunken.'],[24,'Nach 2δ bleiben 14 %, nach 3δ nur noch rund 5 % – darum werden Justierkörper und „oberflächennah“ mit 3δ definiert.'],[31,'Erhöht man die Frequenz, schrumpft δ: Die Wirbelströme drängen sich an die Oberfläche – gut für feine Oberflächenrisse.'],[38,'Niedrige Frequenzen dringen tiefer ein – nötig für verdeckte Fehler, Wanddicke und Korrosion auf der Rückseite.'],[45,'Auch der Werkstoff zählt: Hohe Leitfähigkeit und vor allem hohe Permeabilität verkleinern δ drastisch.'],[51,'δ = 503 / √(f · σ · μr) – die wichtigste Formel für die Wahl der Prüffrequenz.']],
 draw:vstage((c,t)=>{studio(c,t);
  const section=(cc,x,y,w,h,dpx,phase,o={})=>{cc.save();G.rr(cc,x,y,w,h,10);cc.clip();const st=3;for(let yy=y;yy<y+h;yy+=st){const z=(yy-y);const a=Math.exp(-z/dpx),v=a*Math.cos(phase-z/dpx);for(let xx=x;xx<x+w;xx+=st*4){const lat=Math.exp(-Math.pow((xx-x-w/2)/(w*.4),2));cc.fillStyle=vdiv(v*lat);cc.fillRect(xx,yy,st*4,st)}}
   [1,2,3].forEach(k=>{const yy=y+k*dpx;if(yy<y+h){G.line(cc,[[x,yy],[x+w,yy]],'rgba(255,255,255,.85)',1.4,{dash:[6,5]});G.label(cc,k+'δ',x+w-10,yy,{align:'right',size:13,bg:'rgba(8,20,32,.85)',col:'#fff'})}});cc.restore();cc.strokeStyle='rgba(255,255,255,.25)';cc.lineWidth=1;G.rr(cc,x,y,w,h,10);cc.stroke();
   G.coil(cc,x+w/2,y-28,w*.45,14,10,{I:Math.cos(phase)*.8,leads:false,lw:3});if(o.lbl){G.text(cc,'Oberfläche',x-10,y+6,{align:'right',size:13,col:'#9fb3c8'});G.text(cc,'Tiefe ↓',x-10,y+h-6,{align:'right',size:13,col:'#9fb3c8'})}};
  vscenes(c,t,[
   [0,4.2,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo 3 · Leitfähigkeit',title:'Skineffekt und Eindringtiefe',sub:'Warum die Frequenz bestimmt, wie tief wir sehen',hue:'#2a1530',deco:(c2,l)=>section(c2,VW/2-160,VH*.72,320,110,40,l*4)})],
   [4,18.2,(lt,p,cc=c)=>{studio(cc,t,'#1a1a35');vchip(cc,'1 · Stromdichte im Schnitt');section(cc,190,120,580,340,95,t*3,{lbl:true});
    const lw=200;vcard(cc,760,430,170,60,{bg:'rgba(8,18,28,.88)'});for(let i=0;i<=40;i++){cc.fillStyle=vdiv(i/20-1);cc.fillRect(775+i*3.4,448,3.6,12)}G.text(cc,'−J',775,480,{size:11,col:'#9fb3c8'});G.text(cc,'+J',911,480,{size:11,col:'#9fb3c8',align:'right'})}],
   [18,31.2,(lt,p,cc=c)=>{studio(cc,t,'#1a1a35');vchip(cc,'2 · Standard-Eindringtiefe δ');const R={x:110,y:90,w:740,h:340};const m=G.plot(cc,R,[0,4],[0,1.05],{nx:4,ny:4,xl:'Tiefe in Vielfachen von δ',yl:'J / J₀',xf:v=>fmt(v,0)+'δ',yf:v=>fmt(v*100,0)+' %',bgc:'rgba(8,18,28,.8)'});
    const d=easeOut(lt/4);const pts=[];for(let z=0;z<=4*d;z+=.02)pts.push([m.x(z),m.y(Math.exp(-z))]);G.curve(cc,pts,'#ff8d50',{lw:3.4,fill:R.y+R.h,fa:.3,under:false});
    [[1,'37 %'],[2,'14 %'],[3,'5 %']].forEach(([k,l],i)=>{const a=easeOut((lt-3-i*2)/1);if(a<=0)return;cc.save();cc.globalAlpha*=a;G.line(cc,[[m.x(k),R.y+R.h],[m.x(k),m.y(Math.exp(-k))],[R.x,m.y(Math.exp(-k))]],'#5eead4',1.4,{dash:[5,4]});G.dot(cc,m.x(k),m.y(Math.exp(-k)),7,'#5eead4');G.label(cc,k+'δ → '+l,m.x(k)+12,m.y(Math.exp(-k))-16,{size:15,col:'#5eead4',bg:'rgba(8,20,32,.9)'});cc.restore()})}],
   [31,45.2,(lt,p,cc=c)=>{studio(cc,t,'#1a1a35');vchip(cc,'3 · Frequenz verändert δ');const lf=lerp(3,6,easeIO((lt-1)/11)),f=Math.pow(10,lf),d=503/Math.sqrt(f*35);const dpx=clamp(d*90,6,400);section(cc,80,130,380,320,dpx,t*4,{lbl:true});
    vcard(cc,520,130,400,200,{bg:'rgba(8,18,28,.9)',accent:'#ffc04a'});G.text(cc,'Aluminium, σ = 35 MS/m',545,165,{size:15,col:'#9fb3c8',weight:600});G.text(cc,'f = '+(f>=1e6?fmt(f/1e6,2)+' MHz':f>=1e3?fmt(f/1e3,f<1e4?1:0)+' kHz':fmt(f,0)+' Hz'),545,215,{size:34,col:'#ffc04a',weight:800});G.text(cc,'δ = '+fmt(d,d<.1?3:2)+' mm',545,272,{size:34,col:'#5eead4',weight:800});
    G.text(cc,lt<7?'tiefer Einblick':'nur die Oberfläche',545,310,{size:14,col:'#9fb3c8'});const bw=360*clamp((lf-3)/3,0,1);cc.fillStyle='rgba(255,255,255,.1)';G.rr(cc,540,350,360,10,5);cc.fill();cc.fillStyle='#ffc04a';G.rr(cc,540,350,Math.max(10,bw),10,5);cc.fill();G.text(cc,'1 kHz',540,378,{size:12,col:'#9fb3c8'});G.text(cc,'1 MHz',900,378,{size:12,col:'#9fb3c8',align:'right'})}],
   [45,59,(lt,p,cc=c)=>{studio(cc,t,'#1a1a35');vchip(cc,'4 · Werkstoffe bei 100 kHz');const M=[['Kupfer',58,1,'#ff8d50'],['Aluminium',35,1,'#c9d3dc'],['Messing',15,1,'#e7c35a'],['Austenit',1.36,1,'#9fb3c8'],['Baustahl μr≈100',6,100,'#59b6ff']];const f=1e5,mx=.45;
    M.forEach(([n,s,mu,col],i)=>{const d=503/Math.sqrt(f*s*mu),a=easeOut((lt-.5-i*.5)/1.2),y=110+i*62,w=Math.max(4,560*Math.min(d,mx)/mx*a);G.text(cc,n,250,y+22,{align:'right',size:17,weight:700,col:'#e6eef7'});G.bar(cc,270,y+4,w,28,col,{r:8});if(a>.6)G.text(cc,'δ = '+fmt(d,3)+' mm',280+w,y+24,{size:15,weight:800,col})});
    if(lt>5)vformula(cc,['δ [mm] = 503 / √(f · σ · μr)'],VW/2,420,easeOut((lt-5)/1.5))}]
  ])})});

/* ------------------------------------------------------------------ */
vid('diff',{title:'Wie entsteht das Signal der Differenzspule?',dur:58,
 scenes:[{t:0,n:'Titel'},{t:4,n:'Spulenpaar'},{t:13,n:'Fehlerdurchlauf'},{t:34,n:'Störgrößen'},{t:47,n:'Lange Fehler'}],
 caps:[[0,''],[4,'Ein Rohr läuft durch zwei gleiche Spulen, die gegeneinander geschaltet sind. Solange beide dasselbe „sehen“, ist die Differenz null.'],[13,'Der Fehler erreicht die erste Spule: Nur sie wird beeinflusst – die Differenz schlägt aus, erstes Maximum.'],[19,'Zwischen beiden Spulen sehen beide den Fehler gleich stark: Das Signal geht durch null.'],[23,'In der zweiten Spule schlägt die Differenz mit umgekehrtem Vorzeichen aus. In der Impedanzebene entsteht die typische „Acht“.'],[34,'Wackeln, Temperaturdrift und langsame Abstandsänderungen wirken auf beide Spulen gleich – sie heben sich auf.'],[40,'Ein Absolutsystem (gestrichelt) würde diese Störungen voll mitmessen; das Differenzsystem bleibt ruhig.'],[47,'Kehrseite: Bei einem langen, gleichförmigen Fehler zeigt die Differenzspule nur Anfang und Ende. Das Absolutsystem zeigt ein Dauersignal.']],
 draw:vstage((c,t)=>{studio(c,t,'#0e2a3a');const x1=360,x2=460,cy=190,tr=46;
  const rig=(cc,pos,wob,o={})=>{[x1,x2].forEach(x=>G.ringCoil(cc,x,cy,tr*.45,tr*1.6,46,'back',{n:5}));G.tube(cc,-20,VW+20,cy+wob,tr,'steel',{endL:false});
   if(o.long){cc.fillStyle='rgba(214,40,57,.75)';cc.fillRect(pos,cy+wob-tr,o.long,tr*.45)}else{const g=cc.createLinearGradient(0,cy-tr,0,cy-tr*.4);g.addColorStop(0,'#1a0d0d');g.addColorStop(1,'rgba(214,40,57,.5)');cc.fillStyle=g;G.rr(cc,pos,cy+wob-tr,16,tr*.55,3);cc.fill()}
   [x1,x2].forEach((x,i)=>{G.ringCoil(cc,x,cy,tr*.45,tr*1.6,46,'front',{n:5,glow:o.glow&&o.glow[i]>.05?(i?'#ff8d50':'#59b6ff'):null});G.badge(cc,i?'−':'+',x,cy-tr*1.6-18,i?'#ea580c':'#1769a6',{align:'center',size:14})})};
  const g=(p,x)=>Math.exp(-Math.pow((p-x)/34,2));const cvec=(p,x)=>{const a=g(p,x),ph=.9+(p-x)/90;return[a*Math.cos(ph),a*Math.sin(ph)]};const dif=p=>{const a=cvec(p,x1-8),b2=cvec(p,x2-8);return[a[0]-b2[0],a[1]-b2[1]]};
  vscenes(c,t,[
   [0,4.2,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo 4 · Rohrprüfung',title:'Das Differenzsignal',sub:'Zwei Spulen, eine Acht – und warum Störungen verschwinden',hue:'#0e2a3a'})],
   [4,13.2,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'1 · Spulenpaar in Differenzschaltung');rig(cc,-80+lt*10,0,{glow:[0,0]});
    vcard(cc,250,330,460,150,{bg:'rgba(8,18,28,.88)'});G.text(cc,'Spule 1',300,372,{size:16,weight:700,col:'#59b6ff'});G.text(cc,'−',480,372,{align:'center',size:22,weight:800,col:'#fff'});G.text(cc,'Spule 2',660,372,{align:'right',size:16,weight:700,col:'#ff8d50'});
    G.meterBar(cc,290,400,170,14,.62,'#59b6ff');G.meterBar(cc,500,400,170,14,.62,'#ff8d50');G.text(cc,'Differenz = 0',480,456,{align:'center',size:22,weight:800,col:'#3dff95'})}],
   [13,34.2,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'2 · Ein Fehler läuft durch');const pos=lerp(150,700,easeIO((lt-.5)/19));const d=dif(pos+8);rig(cc,pos,0,{glow:[g(pos+8,x1),g(pos+8,x2)]});
    const R={x:40,y:310,w:500,h:200};vcard(cc,R.x-10,R.y-10,R.w+20,R.h+20,{bg:'rgba(6,16,26,.9)'});cc.strokeStyle='rgba(255,255,255,.12)';cc.beginPath();cc.moveTo(R.x,R.y+R.h/2);cc.lineTo(R.x+R.w,R.y+R.h/2);cc.stroke();
    const pts=[],tr2=[];for(let s=0;s<=lt;s+=.05){const ps=lerp(150,700,easeIO((s-.5)/19));const dd=dif(ps+8);pts.push([R.x+(ps-150)/550*R.w,R.y+R.h/2-Math.hypot(dd[0],dd[1])*Math.sign(dd[0]+dd[1]*.3)*R.h*.42]);tr2.push(dd)}G.trace(cc,pts,'#3dff95',2.2);G.text(cc,'Differenzsignal (y-t)',R.x+10,R.y+20,{size:13,weight:700,col:'#8fe3b6'});
    const S=G.screen(cc,600,300,300,220,{label:'Impedanzebene',bezel:6});const mp=v=>[S.cx+v[0]*S.w*.42,S.cy-v[1]*S.h*.5];G.persist(cc,tr2.map(mp),'#3dff95',2.2);G.spot(cc,...mp(d),'#3dff95',4);G.glass(cc,S)}],
   [34,47.2,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'3 · Wackeln und Drift');const wob=Math.sin(t*5)*7,dr=Math.sin(t*.7)*.5+.5;rig(cc,860,wob,{glow:[.1,.1]});
    cc.fillStyle='rgba(255,120,60,'+(.12*dr)+')';cc.fillRect(0,cy-tr*2,VW,tr*4);G.label(cc,'Wackeln + Temperaturdrift',VW/2,90,{align:'center',size:15,col:'#ffc04a',bg:'rgba(8,20,32,.85)'});
    const R={x:120,y:320,w:720,h:180};vcard(cc,R.x-14,R.y-14,R.w+28,R.h+28,{bg:'rgba(6,16,26,.9)'});const a=[],dd=[];for(let s=0;s<=Math.min(lt,13);s+=.05){const tt=t-lt+s;a.push([R.x+s/13*R.w,R.y+R.h/2-(Math.sin(tt*5)*.35+(Math.sin(tt*.7)*.5+.5-.5)*.6)*R.h*.5]);dd.push([R.x+s/13*R.w,R.y+R.h/2-Math.sin(tt*5)*.02*R.h])}
    G.line(cc,a,'#ffc04a',2,{dash:[6,5]});G.trace(cc,dd,'#3dff95',2.4);G.legend(cc,R.x+10,R.y+16,[['#ffc04a','Absolutsystem',[6,5]],['#3dff95','Differenzsystem']],{col:'#e6eef7'})}],
   [47,59,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'4 · Langer Fehler');const L=220,pos=lerp(-200,820,easeIO((lt-.5)/10));const inF=x=>clamp(((x-pos)/20),0,1)*clamp(((pos+L-x)/20),0,1);rig(cc,pos,0,{long:L,glow:[inF(x1),inF(x2)]});
    const R={x:120,y:320,w:720,h:180};vcard(cc,R.x-14,R.y-14,R.w+28,R.h+28,{bg:'rgba(6,16,26,.9)'});const ab=[],df=[];for(let s=0;s<=lt;s+=.05){const ps=lerp(-200,820,easeIO((s-.5)/10));const f=x=>clamp(((x-ps)/20),0,1)*clamp(((ps+L-x)/20),0,1);ab.push([R.x+s/11*R.w,R.y+R.h*.55-f(x1)*R.h*.38]);df.push([R.x+s/11*R.w,R.y+R.h*.55-(f(x1)-f(x2))*R.h*.38])}
    G.line(cc,ab,'#ffc04a',2,{dash:[6,5]});G.trace(cc,df,'#3dff95',2.4);G.legend(cc,R.x+10,R.y+16,[['#ffc04a','Absolut: Dauersignal',[6,5]],['#3dff95','Differenz: nur Anfang und Ende']],{col:'#e6eef7'})}]
  ])})});

/* ------------------------------------------------------------------ */
vid('pruefkette',{title:'Von der Norm zum Prüfbericht',dur:48,
 scenes:[{t:0,n:'Titel'},{t:4,n:'Regelwerke'},{t:11,n:'Verfahrensbeschreibung'},{t:18,n:'Prüfanweisung'},{t:26,n:'Prüfung'},{t:34,n:'Prüfbericht'},{t:40,n:'Überblick'}],
 caps:[[0,''],[4,'Ausgangspunkt sind Normen, Regelwerke, Spezifikationen und die Anforderungen des Kunden.'],[11,'Stufe 3 erstellt daraus die Verfahrensbeschreibung: alle wesentlichen Parameter und Vorsichtsmaßnahmen für ein Verfahren.'],[18,'Stufe 2 (oder 3) setzt sie in eine Prüfanweisung um – die genauen Schritte für ein konkretes Bauteil. Stufe 3 genehmigt sie.'],[26,'Geprüft wird streng nach Prüfanweisung – von Stufe 1, 2 oder 3, unter Aufsicht einer Stufe 2.'],[34,'Ergebnis ist der Prüfbericht: Gerät, Sensor, Einstellungen, Befunde, Bewertung – mit Unterschrift.'],[40,'Die ganze Kette auf einen Blick. Wichtig: Ohne Prüfanweisung darf Stufe 1 nicht prüfen.']],
 draw:vstage((c,t)=>{studio(c,t,'#14233f');
  const ST=[['Normen & Regelwerke','Kunde · Spezifikation','#59b6ff'],['Verfahrensbeschreibung','erstellt: Stufe 3','#3fd6cb'],['Prüfanweisung','Stufe 2/3 · genehmigt: Stufe 3','#ab93ff'],['Prüfung','Stufe 1/2/3 · Aufsicht: Stufe 2','#ff8d50'],['Prüfbericht','Dokumentation','#4fd68b']];
  const t0=[4,11,18,26,34];const idx=t<40?Math.max(0,t0.findLastIndex?t0.findLastIndex(x=>t>=x):t0.filter(x=>t>=x).length-1):-1;
  const over=t>=40?easeIO((t-40)/2.5):0;const sp=420;const camT=idx<0?0:idx;let cam=0;for(let i=0;i<5;i++){cam+=easeIO((t-t0[i]+.8)/1.6)*(i?1:0)}cam=lerp(cam*sp,2*sp,over);const zoom=lerp(1,.42,over);
  const icon=(cc,i,x,y,s,lt)=>{if(i===0){G.doc(cc,x-s*.45,y-s*.5,s*.7,s*.9,'#59b6ff',{stack:3});G.badge(cc,'§',x+s*.32,y-s*.42,'#1769a6',{align:'center',size:16});G.badge(cc,'ISO',x-s*.4,y+s*.45,'#0b9488',{align:'center',size:12})}
   if(i===1){G.doc(cc,x-s*.42,y-s*.5,s*.68,s*.9,'#3fd6cb');G.person(cc,x+s*.4,y+s*.25,s*.5,'#3fd6cb','3')}
   if(i===2){G.doc(cc,x-s*.42,y-s*.5,s*.68,s*.9,'#ab93ff',{lines:0});for(let k=0;k<5;k++){const ok=lt>1+k*.5;cc.strokeStyle=ok?'#12915a':'#b8c4d0';cc.lineWidth=2.5;cc.strokeRect(x-s*.3,y-s*.3+k*s*.15,s*.09,s*.09);if(ok){cc.beginPath();cc.moveTo(x-s*.29,y-s*.26+k*s*.15);cc.lineTo(x-s*.26,y-s*.22+k*s*.15);cc.lineTo(x-s*.2,y-s*.3+k*s*.15);cc.stroke()}cc.fillStyle='#c3ced8';cc.fillRect(x-s*.16,y-s*.28+k*s*.15,s*.32,4)}
    if(lt>4)G.stamp(cc,x+s*.05,y+s*.3,'GENEHMIGT · 3','#d62839',easeOut((lt-4)/.4)*.9)}
   if(i===3){G.slab(cc,x-s*.6,y+s*.25,s*.95,s*.2,s*.2,s*.12,'steel',{shadow:false});const px=x-s*.35+((lt*.15)%1)*s*.7;G.eddies(cc,px,y+s*.18,s*.16,s*.04,{t:lt,n:2,I:.9});G.probe(cc,px,y+s*.18,s*.15,{len:s*.5,cable:false,I:.6});G.person(cc,x+s*.48,y+s*.1,s*.42,'#ff8d50','1');G.person(cc,x+s*.48,y-s*.42,s*.32,'#ffc04a','2')}
   if(i===4){G.doc(cc,x-s*.42,y-s*.5,s*.68,s*.9,'#4fd68b');cc.strokeStyle='#14202c';cc.lineWidth=2;cc.beginPath();for(let k=0;k<=30;k++){const u=k/30;cc.lineTo(x-s*.25+u*s*.4,y+s*.28+Math.sin(u*14)*s*.04*(1-u))}cc.stroke();G.dot(cc,x+s*.3,y+s*.35,s*.12,'#12915a');G.text(cc,'✓',x+s*.3,y+s*.35+s*.07,{align:'center',size:s*.18,weight:900,col:'#fff'})}};
  c.save();c.translate(VW/2,VH*.45);c.scale(zoom,zoom);c.translate(-cam-0,0);
  for(let i=0;i<4;i++){const xa=i*sp+120,xb=(i+1)*sp-120;const on=idx>i||over>0;G.line(c,[[xa,0],[xb,0]],on?'rgba(94,234,212,.6)':'rgba(255,255,255,.12)',3,{dash:[8,8]});if(on)for(let q=0;q<3;q++){const s=((t*.5+q/3)%1);G.dot(c,lerp(xa,xb,s),0,4,'#5eead4',{ring:false,glow:10})}G.arrow(c,xb-14,0,xb,0,on?'#5eead4':'rgba(255,255,255,.2)',{lw:3,head:12})}
  ST.forEach(([n,sub,col],i)=>{const x=i*sp,on=i<=idx||over>0,act=i===idx&&over<.5;const a=on?1:.3;c.save();c.globalAlpha*=a;vcard(c,x-130,-150,260,300,{bg:act?'rgba(16,36,56,.96)':'rgba(10,24,38,.9)',line:act?G.rgba(col,.8):'rgba(255,255,255,.1)'});
   if(act){c.save();c.shadowColor=col;c.shadowBlur=30;c.strokeStyle=G.rgba(col,.7);c.lineWidth=2;G.rr(c,x-130,-150,260,300,16);c.stroke();c.restore()}
   icon(c,i,x,-30,150,act?t-t0[i]:6);G.text(c,n,x,95,{align:'center',size:19,weight:800,col:'#fff'});G.text(c,sub,x,122,{align:'center',size:13.5,weight:600,col:col});G.badge(c,String(i+1),x-110,-128,col,{align:'center',size:14});c.restore()});
  c.restore();
  if(t<4){vtitle(c,t,{kicker:'Erklärvideo 5 · Regelwerk',title:'Von der Norm zum Prüfbericht',sub:'Wer erstellt, wer genehmigt, wer prüft?',hue:'#14233f'})}
  else{vchip(c,t>=40?'Die Prüfkette im Überblick':(idx+1)+' · '+ST[Math.max(0,idx)][0],ST[Math.max(0,idx)][2])}
  if(t>=42){const a=easeOut((t-42)/1);c.save();c.globalAlpha=a;vcard(c,VW/2-300,VH-130,600,58,{accent:'#ffc04a',bg:'rgba(40,28,6,.92)'});G.text(c,'⚠  Stufe 1 ohne Prüfanweisung: keine Tätigkeit!',VW/2,VH-94,{align:'center',size:19,weight:800,col:'#ffd166'});c.restore()}})});
