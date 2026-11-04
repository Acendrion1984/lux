"use strict";
/* =====================================================================
   Vertonte Erklärvideos (Originalton aus „ET2_Erklaervideos“)
   Die Tonspur bleibt erhalten, die Animation ist neu gebaut und
   satzgenau auf den Sprechertext abgestimmt (virtuelle Bühne 960 × 540).
   ===================================================================== */
const pol=(a,r)=>[r*Math.cos(a),r*Math.sin(a)];
const rotv=(v,f)=>[v[0]*Math.cos(f)-v[1]*Math.sin(f),v[0]*Math.sin(f)+v[1]*Math.cos(f)];
const addv=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const sstep=(a,b,x)=>{const u=clamp((x-a)/(b-a),0,1);return u*u*(3-2*u)};
/* Rissschleife: u∈[0,1] = Überfahren des Risses */
const crackV=(u,th,R=1,op=.16)=>{u=clamp(u,0,1);const a=Math.sin(Math.PI*u),q=op*Math.sin(2*Math.PI*u);return addv(pol(th,a*R),pol(th+Math.PI/2,q*R))};
const liftV=(s,th,R=1)=>pol(th+.07*s,s*R);
/* Impedanzebene als Leuchtschirm; Ursprung = Arbeitspunkt (abgeglichen) */
function tvPlane(c,x,y,w,h,o={}){const S=G.screen(c,x,y,w,h,{label:o.label||'Impedanzebene',bezel:8,axes:false});
 const ox=S.x+S.w*(o.ox??.5),oy=S.y+S.h*(o.oy??.58),sc=(o.sc??.38)*Math.min(S.w,S.h);
 c.save();G.rr(c,S.x,S.y,S.w,S.h,8);c.clip();c.strokeStyle=PH.grid2;c.lineWidth=1.2;c.beginPath();c.moveTo(S.x,oy);c.lineTo(S.x+S.w,oy);c.moveTo(ox,S.y);c.lineTo(ox,S.y+S.h);for(let k=-20;k<=20;k++){const d=k*sc/5;c.moveTo(ox+d,oy-3);c.lineTo(ox+d,oy+3);c.moveTo(ox-3,oy+d);c.lineTo(ox+3,oy+d)}c.stroke();c.restore();
 G.stext(c,'X',S.x+S.w-20,oy-7);G.stext(c,'Y',ox+7,S.y+40);
 const P=v=>[ox+v[0]*sc,oy-v[1]*sc];return{S,P,ox,oy,sc,end:()=>G.glass(c,S)}}
function tvArc(c,x,y,r,a0,a1,col,lw=2.2){c.save();c.strokeStyle=col;c.lineWidth=lw;c.shadowColor=col;c.shadowBlur=6;c.beginPath();c.arc(x,y,r,-Math.max(a0,a1),-Math.min(a0,a1));c.stroke();c.restore()}
function tvVec(c,pl,v,col,lbl,o={}){const[x,y]=pl.P(v);G.arrow(c,pl.ox,pl.oy,x,y,col,{lw:o.lw||3,glow:8});if(lbl)G.stext(c,lbl,x+(o.dx??8),y+(o.dy??-8),{col,size:o.size||12,align:o.align})}
function tvCard(c,x,y,w,h,title,lines,col,a=1,o={}){if(a<=0)return;c.save();c.globalAlpha*=Math.min(1,a);c.translate(0,(1-Math.min(1,a))*18);vcard(c,x,y,w,h,{accent:col,bg:o.bg});
 if(o.num!=null){G.dot(c,x+34,y+32,14,col,{ring:false});G.text(c,String(o.num),x+34,y+37.5,{align:'center',size:14,weight:800,col:'#06121c'})}
 G.text(c,title,x+(o.num!=null?58:22),y+38,{size:o.ts||18,weight:800,col});(lines||[]).forEach((l,i)=>G.text(c,l,x+22,y+70+i*(o.lh||25),{size:o.ls||15,weight:600,col:'#dbe7f3'}));c.restore()}
function tvStrip(c,R,series,o={}){vcard(c,R.x-14,R.y-14,R.w+28,R.h+28,{bg:'rgba(6,16,26,.92)'});const z=R.y+R.h*(o.zero??.5);
 c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;c.beginPath();c.moveTo(R.x,z);c.lineTo(R.x+R.w,z);c.stroke();
 if(o.thr!=null)(o.both===false?[1]:[1,-1]).forEach(s=>G.line(c,[[R.x,z-s*o.thr*R.h/2],[R.x+R.w,z-s*o.thr*R.h/2]],'rgba(255,93,108,.65)',1.2,{dash:[6,5]}));
 series.forEach(([pts,col,dash])=>{const Q=pts.map(([u,v])=>[R.x+u*R.w,z-v*R.h/2]);if(Q.length<2)return;if(dash)G.line(c,Q,col,2,{dash});else G.trace(c,Q,col,2.4);if(!dash&&o.head!==false)G.spot(c,...Q[Q.length-1],col,3.5)});
 if(o.title)G.text(c,o.title,R.x+6,R.y+12,{size:12.5,weight:700,col:o.tc||'#9fb3c8'});if(o.legend)G.legend(c,R.x+(o.lx??R.w-260),R.y+12,o.legend,{col:'#e6eef7'})}
function tvCheck(c,x,y,ok,a=1,s=26){if(a<=0)return;c.save();c.globalAlpha*=a;G.dot(c,x,y,s/2,ok?'#12915a':'#c0313f',{ring:false});c.strokeStyle='#fff';c.lineWidth=3;c.lineCap='round';c.beginPath();
 if(ok){c.moveTo(x-s*.22,y);c.lineTo(x-s*.05,y+s*.18);c.lineTo(x+s*.25,y-s*.18)}else{c.moveTo(x-s*.18,y-s*.18);c.lineTo(x+s*.18,y+s*.18);c.moveTo(x+s*.18,y-s*.18);c.lineTo(x-s*.18,y+s*.18)}c.stroke();c.restore()}
/* Draufsicht: Platte, Riss, Sonde von oben, Wirbelstrombahnen weichen dem Riss aus */
function tvTop(c,tt,o){const{x,y,w,h,px,py,cr}=o;c.save();G.metal(c,x,y,w,h,'alu',{r:14});c.restore();
 c.save();c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;G.rr(c,x,y,w,h,14);c.stroke();c.restore();
 if(cr){c.save();c.strokeStyle='#05080b';c.lineWidth=4;c.lineJoin='round';c.beginPath();srand(4);for(let k=0;k<=12;k++){const yy=lerp(cr.y0,cr.y1,k/12);c.lineTo(cr.x+(k%2?2.2:-2.2)+(rnd()-.5)*2,yy)}c.stroke();c.restore()}
 const I=o.I??1;c.save();G.rr(c,x,y,w,h,14);c.clip();
 for(let k=0;k<5;k++){const r=30+k*19,pts=[];for(let i=0;i<=160;i++){const th=i/160*TAU;let X=px+r*Math.cos(th),Y=py+r*.86*Math.sin(th);
   if(cr){const s=Math.sign(cr.x-px)||1,gap=7;const dy=Y<cr.y0?cr.y0-Y:Y>cr.y1?Y-cr.y1:0;const wg=Math.exp(-Math.pow(dy/20,2));if((X-cr.x)*s>-gap)X=lerp(X,cr.x-s*gap,wg)}pts.push([X,Y])}
  const a=I*(1-k*.13);c.strokeStyle=G.rgba('#ff8d50',.25+.55*a);c.lineWidth=1.6+2.2*a;c.shadowColor='#ff7a2a';c.shadowBlur=8*a;G.path(c,pts);c.stroke();
  c.setLineDash([6,16]);c.lineDashOffset=-tt*(40+k*6)*(o.dir||1);c.strokeStyle=G.rgba('#ffe2b8',.7*a);c.lineWidth=2;G.path(c,pts);c.stroke();c.setLineDash([])}
 if(cr&&o.hot>0){[cr.y0,cr.y1].forEach(yy=>{const g=c.createRadialGradient(cr.x,yy,1,cr.x,yy,34);g.addColorStop(0,G.rgba('#ffd27a',.75*o.hot));g.addColorStop(1,'rgba(255,200,120,0)');c.fillStyle=g;c.fillRect(cr.x-40,yy-40,80,80)})}
 c.restore();
 // Sonde von oben (Gehäuse halbtransparent, Wicklung sichtbar)
 c.save();c.globalAlpha=.9;const g=c.createRadialGradient(px-14,py-16,4,px,py,62);g.addColorStop(0,'rgba(60,96,130,.55)');g.addColorStop(1,'rgba(14,30,46,.35)');c.fillStyle=g;c.beginPath();c.arc(px,py,58,0,TAU);c.fill();
 c.strokeStyle='rgba(180,210,235,.45)';c.lineWidth=1.5;c.stroke();for(let k=0;k<5;k++){c.strokeStyle=G.mix('#b87333','#ffcf8a',k/5);c.lineWidth=2.2;c.beginPath();c.arc(px,py,30+k*3.2,0,TAU);c.stroke()}
 c.fillStyle='#2b3b49';c.beginPath();c.arc(px,py,20,0,TAU);c.fill();c.restore()}
/* Seitenansicht-Sonde: einfach (abs) oder doppelt (diff) */
function tvSideProbe(c,x,y,o={}){const w=o.diff?92:62,h=96;c.save();c.shadowColor='rgba(0,0,0,.5)';c.shadowBlur=16;c.shadowOffsetY=6;const g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#1c3550');g.addColorStop(.35,'#3b6a92');g.addColorStop(1,'#152a40');c.fillStyle=g;G.rr(c,x-w/2,y-h,w,h,12);c.fill();c.restore();
 c.strokeStyle='#0b1218';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(x,y-h);c.bezierCurveTo(x,y-h-40,x+50,y-h-40,x+70,y-h-70);c.stroke();
 const coil=(cx,col,on)=>{c.save();if(on>0){c.shadowColor=col;c.shadowBlur=18*on}for(let k=0;k<5;k++){c.strokeStyle=G.mix('#b87333','#ffcf8a',k/5);c.lineWidth=2.4;c.beginPath();c.ellipse(cx,y-12-k*6,17,4.5,0,0,TAU);c.stroke()}c.restore();c.fillStyle=G.rgba(col,.9);c.fillRect(cx-3,y-46,6,40)};
 if(o.diff){coil(x-22,'#59b6ff',o.g1||0);coil(x+22,'#ff8d50',o.g2||0);G.badge(c,'+',x-22,y-h-14,'#1769a6',{align:'center',size:13});G.badge(c,'−',x+22,y-h-14,'#ea580c',{align:'center',size:13})}
 else{coil(x,'#5eead4',o.g1||0)}}
/* ------------------------------------------------------------------ */
vid('ton_riss',{title:'Risserkennung – Grundprinzip',dur:53.8,audio:'media/ton/ton_riss.m4a',
 scenes:[{t:0,n:'Einstieg'},{t:4.9,n:'Primärfeld'},{t:9.7,n:'Wirbelströme'},{t:15,n:'Gegenfeld & Impedanz'},{t:21,n:'Riss'},{t:31,n:'Fehlersignal'},{t:43.5,n:'Zusammenfassung'}],
 caps:[[0,'Willkommen! Wir schauen uns an, wie die Wirbelstromprüfung einen Riss erkennt.'],[4.85,'Eine Spule wird mit Wechselstrom gespeist und erzeugt ein magnetisches Wechselfeld.'],[9.7,'Dieses Primärfeld induziert im leitfähigen Prüfteil kreisförmige Wirbelströme.'],[15,'Die Wirbelströme erzeugen ihrerseits ein Gegenfeld.'],[18.25,'Dieses beeinflusst die Impedanz der Spule.'],[21.05,'Liegt unter der Spule ein Riss, werden die Wirbelströme gestört.'],[25.05,'Sie müssen einen Umweg nehmen.'],[26.5,'Dadurch ändert sich das Gegenfeld – und die Impedanz der Spule verschiebt sich.'],[31.1,'In der Impedanzebene wandert der Messpunkt.'],[33.8,'Diese Verschiebung ist das Fehlersignal.'],[36.2,'Über Amplitude und Phase können wir den Riss von Störeinflüssen wie dem Abstand der Spule – dem sogenannten Lift-off – trennen.'],[43.5,'Zusammengefasst: Das Primärfeld erzeugt Wirbelströme.'],[46.9,'Ein Riss stört diese Ströme.'],[48.85,'Die Spulenimpedanz ändert sich.'],[50.95,'Und genau diese Änderung macht den Fehler sichtbar.']],
 draw:vstage((c,t)=>{studio(c,t);const sgn=Math.sin(t*3)>=0?1:-1,amp=Math.abs(Math.sin(t*3));const thC=78*D2R,thL=12*D2R;
  vscenes(c,t,[
   [0,5.1,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo · Grundprinzip',title:'Risserkennung mit Wirbelstrom',sub:'Primärfeld → Wirbelströme → Störung → Impedanz',hue:'#0f2a3e',deco:(c2,l)=>{G.slab(c2,VW/2-190,VH*.84,380,30,40,22,'alu',{shadow:false});c2.strokeStyle='#05080b';c2.lineWidth=3;c2.beginPath();c2.moveTo(VW/2+60,VH*.84);c2.lineTo(VW/2+80,VH*.84-20);c2.stroke();G.eddies(c2,VW/2,VH*.84-11,92,10,{t:l,n:3,I:.9,glow:true,crack:VW/2+68,gap:10});G.probe(c2,VW/2,VH*.84-14,34,{len:60,cable:false,I:Math.sin(l*3)*.7})}})],
   [4.9,21.2,(lt,p,cc=c)=>{studio(cc,t);const e=easeIO((t-9.9)/2.6),sec=easeIO((t-15.1)/1.6),imp=easeOut((t-18.3)/1.1);
    vchip(cc,t<9.8?'1 · Primärfeld der Spule':t<15?'2 · Wirbelströme im Prüfteil':'3 · Gegenfeld und Impedanz',t<9.8?'#59b6ff':t<15?'#ff8d50':'#ffc04a');
    vSection(cc,t,{cx:270,py:392,kap:.7*e,dpx:40,lift:16,amp,sgn,eddy:e,secondary:sec,px:-100});
    G.label(cc,'Spule mit Wechselstrom',270,92,{align:'center',size:15,col:'#ffcf8a',bg:'rgba(8,20,32,.85)'});
    if(t<15.5)G.label(cc,'Primärfeld',120,200,{size:14,col:'#9fd2ff',bg:'rgba(8,20,32,.85)'});
    if(e>.3){cc.save();cc.globalAlpha*=clamp((e-.3)/.4,0,1);G.label(cc,'Wirbelströme',420,452,{size:14,col:'#ff9d5c',bg:'rgba(8,20,32,.85)'});cc.restore()}
    if(sec>.2){cc.save();cc.globalAlpha*=sec;G.label(cc,'Gegenfeld',430,150,{size:14,col:'#ff9d5c',bg:'rgba(8,20,32,.85)'});cc.restore()}
    // rechts: Spulenstrom, dann Impedanzebene
    if(imp<1){cc.save();cc.globalAlpha*=1-imp;const R={x:600,y:120,w:310,h:170};vcard(cc,R.x-20,R.y-40,R.w+40,R.h+70,{bg:'rgba(6,16,26,.9)',accent:'#59b6ff'});G.text(cc,'Wechselstrom in der Spule',R.x,R.y-12,{size:15,weight:800,col:'#9fd2ff'});
     const pts=[];for(let k=0;k<=160;k++){const u=k/160;pts.push([R.x+u*R.w,R.y+R.h/2-Math.sin(t*3-u*TAU*1.6)*R.h*.38])}G.trace(cc,pts,'#59b6ff',2.4);G.spot(cc,...pts[0],'#59b6ff',4);
     G.text(cc,'i(t)  –  Richtung wechselt ständig',R.x,R.y+R.h+18,{size:13,col:'#9fb3c8'});cc.restore()}
    if(imp>0){cc.save();cc.globalAlpha*=imp;const k=easeIO((t-18.6)/2);const tr=[];for(let s=0;s<=k;s+=.02){const n=normImp(12,.62*s);tr.push([n.R,n.X])}const n=normImp(12,.62*k);
     vScreen(cc,590,92,340,tr,[n.R,n.X],{extra:(m)=>{G.stext(cc,'Leerlauf',m.x(0)+8,m.y(1)-8,{size:11});if(k>.9)G.stext(cc,'mit Prüfteil',m.x(n.R)+10,m.y(n.X)+16,{col:PH.g,size:11})}});
     G.label(cc,'Impedanz der Spule ändert sich',760,460,{align:'center',size:14,col:'#5eead4',bg:'rgba(8,20,32,.85)'});cc.restore()}}],
   [21,31.3,(lt,p,cc=c)=>{studio(cc,t,'#132a40');vchip(cc,t<25?'4 · Ein Riss unter der Spule':'4 · Umweg der Wirbelströme','#ff5d6c');const cr={x:340,y0:220,y1:350};const px=lerp(150,292,easeIO((t-21.3)/3));const hot=sstep(24.5,26,t);
    tvTop(cc,t,{x:50,y:90,w:470,h:400,px,py:285,cr,hot,I:1});G.label(cc,'Riss',cr.x+14,cr.y1+22,{size:13,col:'#ff8a96',bg:'rgba(8,20,32,.85)'});G.label(cc,'Draufsicht',62,112,{size:12,col:'#c8d6e2',bg:'rgba(8,20,32,.75)'});
    if(t>25.1){cc.save();cc.globalAlpha*=sstep(25.1,25.8,t);G.label(cc,'Umweg um die Rissspitzen',285,120,{align:'center',size:15,col:'#ffcf8a',bg:'rgba(8,20,32,.88)'});cc.restore()}
    const d=Math.exp(-Math.pow((px-300)/70,2))*sstep(26.4,28.6,t);const tr=[];for(let s=21;s<=t;s+=.05){const pxs=lerp(150,292,easeIO((s-21.3)/3));tr.push(crackV(.5*Math.exp(-Math.pow((pxs-300)/70,2))*sstep(26.4,28.6,s),thC,1))}
    const pl=tvPlane(cc,570,96,360,330,{ox:.32,oy:.78,sc:.62});G.persist(cc,tr.map(pl.P),PH.r,2.4);G.spot(cc,...pl.P(tr[tr.length-1]||[0,0]),PH.r,5);G.stext(cc,'Arbeitspunkt',pl.ox+8,pl.oy+16,{size:11});
    if(d>.6)G.stext(cc,'Messpunkt verschiebt sich',pl.P(tr[tr.length-1])[0]+10,pl.P(tr[tr.length-1])[1]-6,{col:PH.r,size:11});pl.end();
    if(t>26.5){cc.save();cc.globalAlpha*=sstep(26.5,27.2,t);G.label(cc,'Gegenfeld schwächer → Impedanz verschiebt sich',750,460,{align:'center',size:13.5,col:'#ffc04a',bg:'rgba(8,20,32,.88)'});cc.restore()}}],
   [31,43.7,(lt,p,cc=c)=>{studio(cc,t,'#10283f');vchip(cc,'5 · Das Fehlersignal in der Impedanzebene','#3dff95');
    const pl=tvPlane(cc,40,72,470,440,{ox:.3,oy:.78,sc:.66});const u=clamp((t-31.3)/2.2,0,1);const tr=[];for(let s=0;s<=u;s+=.01)tr.push(crackV(s,thC,1));
    if(t<33.8){G.persist(cc,tr.map(pl.P),PH.r,2.6);G.spot(cc,...pl.P(crackV(u,thC)),PH.r,6)}else{G.trace(cc,tr.map(pl.P),PH.r,2.2);const a=sstep(33.8,34.6,t);const tip=pl.P(pol(thC,1));cc.save();cc.globalAlpha*=a;tvVec(cc,pl,pol(thC,1),'#ff6b7a','Fehlersignal',{size:13,dx:10,dy:-4});cc.restore()}
    G.stext(cc,'Arbeitspunkt',pl.ox+8,pl.oy+16,{size:11});
    if(t>36.2){const a1=sstep(36.2,37,t);cc.save();cc.globalAlpha*=a1;const[tx,ty]=pl.P(pol(thC,1));cc.setLineDash([4,4]);G.line(cc,[[pl.ox-14*Math.sin(thC),pl.oy-14*Math.cos(thC)],[tx-14*Math.sin(thC),ty-14*Math.cos(thC)]],'#ffd166',1.6);cc.setLineDash([]);G.stext(cc,'Amplitude',pl.ox-60,pl.oy-pl.sc*.55,{col:'#ffd166',size:12});cc.restore()}
    if(t>37.6){const a2=sstep(37.6,38.4,t);cc.save();cc.globalAlpha*=a2;tvArc(cc,pl.ox,pl.oy,70,0,thC,'#5eead4');G.stext(cc,'Phase',pl.ox+62,pl.oy-62,{col:'#5eead4',size:12});cc.restore()}
    if(t>39.3){const k=clamp((t-39.3)/1.6,0,1);const lt2=[];for(let s=0;s<=k;s+=.02)lt2.push(liftV(.95*Math.sin(Math.PI*s*.5),thL));G.persist(cc,lt2.map(pl.P),PH.a,2.4);if(lt2.length)G.stext(cc,'Lift-off',pl.P(lt2[lt2.length-1])[0]-10,pl.P(lt2[lt2.length-1])[1]+20,{col:PH.a,size:12});
     if(t>41)tvArc(cc,pl.ox,pl.oy,120,thL,thC,'#c39bff',1.8);if(t>41.2)G.stext(cc,'Δφ',pl.ox+pl.sc*.5*Math.cos((thL+thC)/2)+50,pl.oy-130*Math.sin((thL+thC)/2)+10,{col:'#c39bff',size:14})}
    pl.end();
    tvCard(cc,560,92,370,108,'Amplitude',['Wie groß ist die Änderung?'],'#ffd166',sstep(36.2,37,t));
    tvCard(cc,560,214,370,108,'Phase',['In welche Richtung zeigt sie?'],'#5eead4',sstep(37.6,38.4,t));
    tvCard(cc,560,336,370,132,'Riss ≠ Lift-off',['Unterschiedliche Richtungen –','die Signale lassen sich trennen.'],'#c39bff',sstep(40.8,41.6,t))}],
   [43.5,54,(lt,p,cc=c)=>{studio(cc,t,'#0f2a40');vchip(cc,'Zusammenfassung');G.text(cc,'Vom Feld zum Fehlersignal',VW/2,96,{align:'center',size:28,weight:800,col:'#fff'});
    const T0=[43.6,46.95,48.9,51];const cols=['#59b6ff','#ff8d50','#3dff95','#ff5d6c'];const ttl=['Primärfeld','Wirbelströme','Impedanz','Fehler sichtbar'];const sub=[['Spule erzeugt','Wechselfeld'],['Riss lenkt die','Ströme um'],['Messpunkt','wandert'],['Änderung =','Fehlersignal']];
    T0.forEach((t0,i)=>{const a=easeOut((t-t0)/.7);if(a<=0)return;const x=40+i*228,y=140,w=200,h=300;cc.save();cc.globalAlpha*=a;cc.translate(0,(1-a)*20);const act=t>=t0&&(i===3||t<T0[i+1]);
     vcard(cc,x,y,w,h,{bg:act?'rgba(16,36,56,.96)':'rgba(10,24,38,.9)',line:act?G.rgba(cols[i],.8):'rgba(255,255,255,.1)'});G.badge(cc,'0'+(i+1),x+16,y+22,cols[i],{size:12});
     const ix=x+w/2,iy=y+110;
     if(i===0){G.coil(cc,ix,iy,90,26,8,{I:Math.sin(t*3)*.8,phase:t,leads:false});for(let k=1;k<=3;k++){cc.strokeStyle=G.rgba('#74bcff',.5-k*.1);cc.lineWidth=1.6;cc.beginPath();cc.ellipse(ix,iy,52+k*12,26+k*16,0,0,TAU);cc.stroke()}}
     if(i===1){G.slab(cc,ix-70,iy+20,130,22,20,14,'alu',{shadow:false});G.eddies(cc,ix-4,iy+12,54,7,{t,n:3,I:.95,glow:true,crack:ix+20,gap:9});cc.strokeStyle='#05080b';cc.lineWidth=3;cc.beginPath();cc.moveTo(ix+20,iy+20);cc.lineTo(ix+30,iy+6);cc.stroke()}
     if(i===2){const S=G.screen(cc,ix-62,iy-58,124,116,{bezel:4});const o=[S.x+30,S.y+S.h-26];const u=(t*.4)%1;const tr=[];for(let s=0;s<=u;s+=.02){const v=crackV(s,thC,1);tr.push([o[0]+v[0]*70,o[1]-v[1]*70])}G.persist(cc,tr,PH.r,2);if(tr.length)G.spot(cc,...tr[tr.length-1],PH.r,3);G.glass(cc,S)}
     if(i===3){const on=Math.sin(t*6)>0;G.led(cc,ix,iy-10,on,'#ff3b4a',18);G.label(cc,'Anzeige!',ix,iy+40,{align:'center',size:14,col:'#ff8a96',bg:'rgba(8,20,32,.85)'})}
     G.text(cc,ttl[i],x+w/2,y+212,{align:'center',size:18,weight:800,col:cols[i]});sub[i].forEach((s,k)=>G.text(cc,s,x+w/2,y+240+k*21,{align:'center',size:14,weight:600,col:'#dbe7f3'}));cc.restore();
     if(i<3&&t>T0[i+1]-.2){G.arrow(cc,x+w+4,y+h/2,x+w+24,y+h/2,'#5eead4',{lw:2.5,head:9})}})}]
  ])})});
/* ------------------------------------------------------------------ */
function tvMiniSide(c,x,y,w,h,o){/* kleine Seitenansicht: Platte, Sonde (abheben / Riss überfahren) */
 vcard(c,x,y,w,h,{bg:o.act?'rgba(16,36,56,.96)':'rgba(10,24,38,.88)',line:o.act?G.rgba(o.col,.8):'rgba(255,255,255,.1)'});
 G.text(c,o.title,x+18,y+28,{size:16,weight:800,col:o.col});const sy=y+h-40;G.slab(c,x+24,sy,w-70,26,22,14,'alu',{shadow:false});
 if(o.crack!=null){c.strokeStyle='#05080b';c.lineWidth=3;c.beginPath();c.moveTo(o.crack,sy);c.lineTo(o.crack+6,sy-8);c.lineTo(o.crack+16,sy-14);c.stroke()}
 G.probe(c,o.px,sy-6-o.lift,26,{len:50,cable:false,I:o.act?Math.sin(o.t*3)*.7:.2});if(o.lift>4)G.dim(c,o.px+30,sy-4,o.px+30,sy-6-o.lift,'',{col:'#ffc04a'})}
vid('ton_lift',{title:'Lift-off und Riss trennen',dur:60.25,audio:'media/ton/ton_lift.m4a',
 scenes:[{t:0,n:'Problem'},{t:9.1,n:'Frage'},{t:11.6,n:'Zwei Richtungen'},{t:30.2,n:'Vorgehen'},{t:44,n:'Selektiv auswerten'},{t:51.5,n:'Prüffrequenz'}],
 caps:[[0,'Ein häufiges Problem in der Wirbelstromprüfung: Der Abstand der Spule zum Prüfteil – der sogenannte Lift-off – erzeugt ebenfalls ein Signal.'],[9.05,'Wie unterscheidet man es vom eigentlichen Riss?'],[11.55,'In der Impedanzebene bewegen sich beide Effekte in unterschiedliche Richtungen.'],[16,'Der Lift-off verschiebt den Messpunkt typischerweise entlang einer bestimmten Bahn – oft annähernd horizontal oder in einem flachen Winkel.'],[23.75,'Ein Riss dagegen erzeugt eine Verschiebung mit klarer Phasenlage – meist steiler und in eine andere Richtung.'],[30.25,'Praktisch geht man so vor:'],[31.95,'Zuerst den Lift-off-Effekt beobachten, indem man die Spule leicht anhebt und absenkt.'],[37.2,'Dann die Phase so drehen, dass die Lift-off-Richtung waagerecht liegt.'],[41.3,'Der Riss steht danach annähernd senkrecht dazu.'],[44.05,'Mit der Y-Komponente oder einer Sektorauswertung kann man den Riss nun selektiv auswerten.'],[49.65,'Der Lift-off bleibt unterdrückt.'],[51.55,'Wichtig: Die Trennung funktioniert nur, wenn der Phasenwinkel zwischen beiden Effekten groß genug ist.'],[57.1,'Deshalb muss die Prüffrequenz passend gewählt werden.']],
 draw:vstage((c,t)=>{studio(c,t,'#0f2840');const sgn=Math.sin(t*3)>=0?1:-1,amp=Math.abs(Math.sin(t*3));const thL=18*D2R,thC=96*D2R;
  const liftAt=s=>.9*Math.abs(Math.sin(s*1.35));
  vscenes(c,t,[
   [0,3.5,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo · Signaltrennung',title:'Lift-off und Riss trennen',sub:'Ein Störsignal und ein Fehlersignal – zwei Richtungen',hue:'#0f2840'})],
   [3.3,9.4,(lt,p,cc=c)=>{studio(cc,t,'#0f2840');vchip(cc,'Das Problem: Abstandsänderung','#ffc04a');const s=.5-.5*Math.cos((t-3.3)*1.5),lift=16+46*s;
    vSection(cc,t,{cx:270,py:400,kap:.7*Math.exp(-(lift-16)/45),dpx:40,lift,amp,sgn,eddy:Math.exp(-(lift-16)/45),secondary:.5*Math.exp(-(lift-16)/45),px:-100});
    G.dim(cc,370,400,370,400-lift-26,'Lift-off',{col:'#ffc04a',size:12});
    const pl=tvPlane(cc,560,90,370,360,{ox:.3,oy:.72,sc:.62});const tr=[];for(let q=Math.max(3.3,t-3);q<=t;q+=.04)tr.push(liftV(.5-.5*Math.cos((q-3.3)*1.5),thL,1));G.persist(cc,tr.map(pl.P),PH.a,2.6);G.spot(cc,...pl.P(liftV(s,thL)),PH.a,6);G.stext(cc,'Arbeitspunkt',pl.ox+8,pl.oy+16,{size:11});G.stext(cc,'Lift-off-Signal',pl.P(liftV(1,thL))[0]-40,pl.P(liftV(1,thL))[1]-14,{col:PH.a,size:12});pl.end();
    G.label(cc,'Auch ohne Fehler: der Messpunkt wandert',745,488,{align:'center',size:14,col:'#ffc04a',bg:'rgba(8,20,32,.88)'})}],
   [9.1,11.8,(lt,p,cc=c)=>{studio(cc,t,'#13243f');G.text(cc,'Wie unterscheidet man es vom eigentlichen Riss?',VW/2,110,{align:'center',size:26,weight:800,col:'#fff'});
    tvMiniSide(cc,120,170,300,250,{title:'Lift-off',col:'#ffc04a',act:true,px:270,lift:22*Math.abs(Math.sin(t*2)),t});tvMiniSide(cc,540,170,300,250,{title:'Riss',col:'#ff5d6c',act:true,px:lerp(600,780,(t*.35)%1),lift:0,crack:690,t});
    G.text(cc,'?',VW/2,315,{align:'center',size:64,weight:900,col:'#5eead4'})}],
   [11.6,30.4,(lt,p,cc=c)=>{studio(cc,t,'#0f2840');vchip(cc,'Zwei Effekte – zwei Richtungen','#5eead4');const aL=t>=16&&t<23.6,aC=t>=23.6;
    tvMiniSide(cc,40,84,360,196,{title:'Lift-off: Spule anheben',col:'#ffc04a',act:aL,px:220,lift:aL?28*liftAt(t-16):0,t});
    const u=clamp((t-24.2)/3.4,0,1);tvMiniSide(cc,40,300,360,196,{title:'Riss: Spule überfährt Fehler',col:'#ff5d6c',act:aC,px:lerp(110,330,aC?u:0),lift:0,crack:220,t});
    const pl=tvPlane(cc,440,74,490,440,{ox:.26,oy:.76,sc:.64});
    const lt2=[];for(let q=16;q<=Math.min(t,23.6);q+=.04)lt2.push(liftV(liftAt(q-16),thL));if(lt2.length>1){G.persist(cc,lt2.map(pl.P),PH.a,2.4);if(t<23.6)G.spot(cc,...pl.P(lt2[lt2.length-1]),PH.a,6)}
    if(t>=23.6){G.line(cc,[pl.P([0,0]),pl.P(liftV(.9,thL))],G.rgba(PH.a,.85),2.4)}
    if(t>18.5){cc.save();cc.globalAlpha*=sstep(18.5,19.2,t);G.stext(cc,'Lift-off: flach',pl.P(liftV(.9,thL))[0]-30,pl.P(liftV(.9,thL))[1]+22,{col:PH.a,size:13});cc.restore()}
    if(t>=24.2){const tr=[];for(let s=0;s<=u;s+=.01)tr.push(crackV(s,thC,.95));G.persist(cc,tr.map(pl.P),PH.r,2.6);if(u<1)G.spot(cc,...pl.P(crackV(u,thC,.95)),PH.r,6);if(u>.4)G.stext(cc,'Riss: steil',pl.P(pol(thC,.95))[0]+14,pl.P(pol(thC,.95))[1]+4,{col:PH.r,size:13})}
    if(t>27.8){tvArc(cc,pl.ox,pl.oy,96,thL,thC,'#c39bff');G.stext(cc,'Δφ',pl.ox+110*Math.cos((thL+thC)/2),pl.oy-110*Math.sin((thL+thC)/2),{col:'#c39bff',size:14})}
    G.stext(cc,'Arbeitspunkt',pl.ox+8,pl.oy+16,{size:11});pl.end()}],
   [30.2,44.2,(lt,p,cc=c)=>{studio(cc,t,'#112a44');vchip(cc,'Praktisches Vorgehen','#5eead4');const steps=[[31.95,'1 · Lift-off beobachten'],[37.2,'2 · Phase drehen'],[41.3,'3 · Riss prüfen']];
    steps.forEach(([t0,l],i)=>{const on=t>=t0,act=on&&(i===2||t<steps[i+1][0]);const x=40+i*150;cc.save();cc.globalAlpha*=on?1:.35;G.label(cc,l,x,92,{size:13,col:act?'#06121c':'#cfe3f0',bg:act?'#5eead4':'rgba(12,28,44,.9)'});cc.restore()});
    const phi=-thL*easeIO((t-37.6)/3);const s1=t>=32&&t<37.4?liftAt(t-32):0;
    tvMiniSide(cc,40,130,380,200,{title:t<37.2?'Spule anheben und absenken':'Signalbild mit dem Phasensteller drehen',col:t<37.2?'#ffc04a':'#5eead4',act:true,px:200,lift:28*s1,t});
    vcard(cc,40,350,380,150,{bg:'rgba(10,24,38,.92)',accent:'#5eead4'});G.knob(cc,110,425,38,.5+phi/(Math.PI*.75));G.text(cc,'Phase',110,486,{align:'center',size:12,weight:700,col:'#9fb3c8'});
    G.text(cc,'Drehung',180,405,{size:14,weight:700,col:'#9fb3c8'});G.text(cc,fmt(phi/D2R,0)+'°',180,445,{size:34,weight:800,col:'#5eead4'});if(t>40.9)tvCheck(cc,380,420,true,sstep(40.9,41.4,t),30);
    const pl=tvPlane(cc,450,110,480,400,{ox:.36,oy:.72,sc:.62});
    if(t>40.6){cc.save();cc.globalAlpha*=sstep(40.6,41.2,t);G.line(cc,[[pl.S.x+12,pl.oy],[pl.S.x+pl.S.w-12,pl.oy]],'rgba(255,192,74,.55)',3);G.stext(cc,'waagerecht',pl.S.x+pl.S.w-90,pl.oy+18,{col:PH.a,size:12});cc.restore()}
    const lt2=[];for(let q=32;q<=Math.min(t,37.4);q+=.04)lt2.push(rotv(liftV(liftAt(q-32),thL),phi));if(lt2.length>1)G.persist(cc,lt2.map(pl.P),PH.a,2.4);if(t>=37.4){G.line(cc,[pl.P([0,0]),pl.P(rotv(liftV(.9,thL),phi))],PH.a,2.6);G.stext(cc,'Lift-off',pl.P(rotv(liftV(.9,thL),phi))[0]-30,pl.P(rotv(liftV(.9,thL),phi))[1]+20,{col:PH.a,size:12})}
    if(t>=32&&t<37.4)G.spot(cc,...pl.P(lt2[lt2.length-1]||[0,0]),PH.a,6);
    const ca=t<41.3?.35:1;cc.save();cc.globalAlpha*=ca;const tr=[];for(let s=0;s<=1;s+=.01)tr.push(rotv(crackV(s,thC,.95),phi));G.trace(cc,tr.map(pl.P),PH.r,2.2);G.stext(cc,'Riss',pl.P(rotv(pol(thC,.95),phi))[0]+12,pl.P(rotv(pol(thC,.95),phi))[1],{col:PH.r,size:12});cc.restore();
    if(t>41.6){const a=sstep(41.6,42.3,t),ang=thC+phi;cc.save();cc.globalAlpha*=a;tvArc(cc,pl.ox,pl.oy,46,0,ang,'#5eead4');G.stext(cc,fmt(ang/D2R,0)+'° ≈ senkrecht',pl.ox+50,pl.oy-50,{col:'#5eead4',size:12});cc.restore()}
    G.stext(cc,'Arbeitspunkt',pl.ox+8,pl.oy+16,{size:11});pl.end()}],
   [44,51.7,(lt,p,cc=c)=>{studio(cc,t,'#112a44');vchip(cc,'Den Riss selektiv auswerten','#3dff95');const phi=-thL,thc=thC+phi;
    const pl=tvPlane(cc,40,80,440,420,{ox:.42,oy:.76,sc:.62});
    cc.save();cc.globalAlpha*=sstep(44.2,45,t);cc.fillStyle='rgba(195,155,255,.14)';cc.beginPath();cc.moveTo(pl.ox,pl.oy);cc.arc(pl.ox,pl.oy,pl.sc*1.15,-(thc+28*D2R),-(thc-16*D2R));cc.closePath();cc.fill();cc.strokeStyle='rgba(195,155,255,.7)';cc.lineWidth=1.5;cc.stroke();G.stext(cc,'Sektor',pl.P(pol(thc+22*D2R,1.08))[0]-40,pl.P(pol(thc+22*D2R,1.08))[1],{col:'#c39bff',size:12});
    G.line(cc,[[pl.S.x+10,pl.oy-.4*pl.sc],[pl.S.x+pl.S.w-10,pl.oy-.4*pl.sc]],'rgba(255,93,108,.6)',1.4,{dash:[6,5]});G.stext(cc,'Y-Schwelle',pl.S.x+pl.S.w-84,pl.oy-.4*pl.sc-6,{col:'#ff8a96',size:11});cc.restore();
    const evL=clamp((t-44.6)/2,0,1),evC=clamp((t-47)/2,0,1);const lv=liftV(.9*Math.sin(Math.PI*evL),0),cv=rotv(crackV(evC,thC,.95),phi);
    const lt2=[];for(let s=0;s<=evL;s+=.02)lt2.push(liftV(.9*Math.sin(Math.PI*s),0));G.persist(cc,lt2.map(pl.P),PH.a,2.4);const ct=[];for(let s=0;s<=evC;s+=.01)ct.push(rotv(crackV(s,thC,.95),phi));G.persist(cc,ct.map(pl.P),PH.r,2.4);
    if(evL>0&&evL<1)G.spot(cc,...pl.P(lv),PH.a,6);if(evC>0&&evC<1)G.spot(cc,...pl.P(cv),PH.r,6);pl.end();
    const R={x:530,y:110,w:390,h:200};const ser=[],ser2=[];for(let q=44;q<=t;q+=.04){const a=clamp((q-44.6)/2,0,1),b2=clamp((q-47)/2,0,1);ser.push([(q-44)/7.6,liftV(.9*Math.sin(Math.PI*a),0)[1]*1.6]);ser2.push([(q-44)/7.6,rotv(crackV(b2,thC,.95),phi)[1]*1.6])}
    tvStrip(cc,R,[[ser,PH.a],[ser2,'#3dff95']],{thr:.64,both:false,zero:.82,title:'Y-Komponente über der Zeit',head:false});
    G.text(cc,'Lift-off',R.x+R.w*.18,R.y+R.h*.82+24,{size:12,col:PH.a,align:'center'});G.text(cc,'Riss',R.x+R.w*.5,R.y+R.h*.82+24,{size:12,col:PH.r,align:'center'});
    const alarm=evC>.25&&evC<.85;vcard(cc,530,350,390,140,{bg:'rgba(10,24,38,.92)',accent:alarm?'#ff3b4a':'#3dff95'});G.led(cc,580,420,alarm,'#ff3b4a',16);G.text(cc,alarm?'Alarm: Riss erkannt':'kein Alarm',612,414,{size:19,weight:800,col:alarm?'#ff8a96':'#9fb3c8'});
    G.text(cc,t<47?'Lift-off erzeugt kein Y-Signal':alarm?'Riss liegt im Sektor und über der Schwelle':'Nur der Riss löst aus',612,442,{size:13.5,col:'#cfe3f0'});
    if(t>49.6){cc.save();cc.globalAlpha*=sstep(49.6,50.2,t);G.label(cc,'✓ Lift-off bleibt unterdrückt',725,330,{align:'center',size:14,col:'#3dff95',bg:'rgba(8,20,32,.92)'});cc.restore()}}],
   [51.5,60.3,(lt,p,cc=c)=>{studio(cc,t,'#13243f');vchip(cc,'Voraussetzung: genug Phasenwinkel','#ffc04a');const k=easeIO((t-52)/4.6),dphi=lerp(9,74,k)*D2R,lf=lerp(3.7,5.3,k),f=Math.pow(10,lf),ok=dphi>40*D2R;
    const pl=tvPlane(cc,40,80,440,420,{ox:.3,oy:.74,sc:.66});const th1=8*D2R,th2=th1+dphi;
    const lt2=[];for(let s=0;s<=1;s+=.02)lt2.push(liftV(.85*Math.sin(Math.PI*s*.5),th1));G.trace(cc,lt2.map(pl.P),PH.a,2.2);const ct=[];for(let s=0;s<=1;s+=.01)ct.push(crackV(s,th2,.8,.12));G.trace(cc,ct.map(pl.P),PH.r,2.2);
    tvArc(cc,pl.ox,pl.oy,80,th1,th2,ok?'#3dff95':'#ff5d6c');G.stext(cc,'Δφ = '+fmt(dphi/D2R,0)+'°',pl.ox+92,pl.oy-60,{col:ok?'#3dff95':'#ff8a96',size:14});G.stext(cc,'Lift-off',pl.P(liftV(.85,th1))[0]-50,pl.P(liftV(.85,th1))[1]+20,{col:PH.a,size:12});G.stext(cc,'Riss',pl.P(pol(th2,.8))[0]+10,pl.P(pol(th2,.8))[1],{col:PH.r,size:12});pl.end();
    vcard(cc,520,90,410,190,{bg:'rgba(10,24,38,.94)',accent:'#ffc04a'});G.text(cc,'Prüffrequenz',545,124,{size:15,weight:700,col:'#9fb3c8'});G.text(cc,f>=1e6?fmt(f/1e6,2)+' MHz':fmt(f/1e3,0)+' kHz',545,170,{size:34,weight:800,col:'#ffc04a'});
    cc.fillStyle='rgba(255,255,255,.1)';G.rr(cc,545,200,360,10,5);cc.fill();cc.fillStyle='#ffc04a';G.rr(cc,545,200,Math.max(10,360*k),10,5);cc.fill();G.dot(cc,545+360*k,205,9,'#ffd166',{ring:false,glow:10});
    tvCheck(cc,880,150,ok,1,34);G.text(cc,ok?'Trennung möglich':'Signale überlagern sich',545,248,{size:15,weight:700,col:ok?'#3dff95':'#ff8a96'});
    tvCard(cc,520,310,410,170,'Prüffrequenz passend wählen',['Sie bestimmt den Winkel zwischen','Riss und Lift-off – und damit, ob','sich beide sauber trennen lassen.'],'#5eead4',sstep(57.1,57.9,t))}]
  ])})});
/* ------------------------------------------------------------------ */
vid('ton_phase',{title:'Phasensteller und Auswertearten',dur:62.45,audio:'media/ton/ton_phase.m4a',
 scenes:[{t:0,n:'Einstieg'},{t:6.5,n:'Phasensteller'},{t:16.9,n:'Drei Verfahren'},{t:19.7,n:'Amplitude'},{t:31.1,n:'Y-Komponente'},{t:41.6,n:'Sektor'},{t:51.4,n:'Praxis'}],
 caps:[[0,'Nachdem Lift-off und Riss unterschiedliche Richtungen in der Impedanzebene haben, kommt der Phasensteller ins Spiel.'],[6.6,'Mit dem Phasensteller dreht man das gesamte Signalbild.'],[9.7,'Ziel ist es, die Störgröße – meist den Lift-off – waagerecht zu legen.'],[14.4,'Der Riss steht dann möglichst senkrecht dazu.'],[16.95,'Für die Auswertung gibt es drei gängige Verfahren.'],[19.75,'Erstens die Amplitudenauswertung: Es wird nur der Betrag des Signals betrachtet.'],[24.6,'Sie ist einfach und phasenunabhängig, trennt aber nicht zwischen Fehler und Störungen, wenn beide ähnlich groß sind.'],[31.2,'Zweitens die Y-Komponenten-Auswertung.'],[33.9,'Nur die vertikale Komponente wird ausgewertet.'],[36.7,'Liegt der Lift-off horizontal, erzeugt er kein Y-Signal.'],[40.7,'Der Riss schon.'],[41.7,'Drittens die Sektorauswertung.'],[43.6,'Ein Winkelfenster wird um die Rissrichtung gelegt.'],[46.3,'Nur Signale innerhalb dieses Sektors und oberhalb einer Amplitudenschwelle lösen Alarm aus.'],[51.55,'In der Praxis kombiniert man oft Phasensteller, Y-Komponente oder Sektor und eine geeignete Schwelle.'],[57.65,'So wird das Fehlersignal zuverlässig erkannt, und Störsignale werden unterdrückt.']],
 draw:vstage((c,t)=>{studio(c,t,'#10263e');const thL=22*D2R,thC=100*D2R,thc=thC-thL;
  /* Ereignisse nach dem Abgleich: Lift-off waagerecht, Riss bei 78° */
  const evSig=(ev,tt)=>{const u=clamp((tt-ev[0])/ev[1],0,1);if(ev[2]==='L')return liftV(ev[3]*Math.sin(Math.PI*u),0);if(ev[2]==='N')return crackV(u,ev[4]??thc,ev[3],.1);return crackV(u,thc,ev[3],.14)};
  const drawEv=(cc,pl,evs,tt)=>evs.forEach(ev=>{if(tt<ev[0])return;const u=clamp((tt-ev[0])/ev[1],0,1);const col=ev[2]==='L'?PH.a:ev[2]==='N'?'#9fb3c8':PH.r;const tr=[];for(let s=0;s<=u;s+=.01)tr.push(evSig(ev,ev[0]+s*ev[1]));G.persist(cc,tr.map(pl.P),col,2.4);if(u<1)G.spot(cc,...pl.P(evSig(ev,tt)),col,6)});
  const live=(evs,tt)=>{for(const ev of evs){if(tt>=ev[0]&&tt<=ev[0]+ev[1])return[ev,evSig(ev,tt)]}return[null,[0,0]]};
  vscenes(c,t,[
   [0,3.4,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo · Signalauswertung',title:'Phasensteller und Auswertearten',sub:'Signalbild drehen, Störgrößen unterdrücken, Riss gezielt auswerten',hue:'#10263e'})],
   [3.2,17.1,(lt,p,cc=c)=>{studio(cc,t,'#10263e');vchip(cc,t<6.6?'Ausgangslage':'Der Phasensteller','#5eead4');const phi=-thL*easeIO((t-7.2)/5);
    vcard(cc,40,90,360,410,{bg:'rgba(10,24,38,.92)',accent:'#5eead4'});G.text(cc,'Phasensteller',64,128,{size:18,weight:800,col:'#5eead4'});
    const pulse=t<6.6?.5+.5*Math.sin(t*5):0;if(pulse>0){cc.save();cc.shadowColor='#5eead4';cc.shadowBlur=30*pulse;G.dot(cc,220,250,64,'rgba(94,234,212,.08)',{ring:false});cc.restore()}
    G.knob(cc,220,250,58,.5+phi/(Math.PI*.75));G.text(cc,fmt(phi/D2R,0)+'°',220,360,{align:'center',size:40,weight:800,col:'#e6f6f4'});G.text(cc,'Drehwinkel des Signalbilds',220,388,{align:'center',size:13,col:'#9fb3c8'});
    if(t>9.7){tvCheck(cc,70,440,t>12.2,1,26);G.text(cc,'Lift-off waagerecht',96,446,{size:15,weight:700,col:t>12.2?'#3dff95':'#cfe3f0'})}
    if(t>14.4){tvCheck(cc,70,476,true,sstep(14.4,15,t),26);G.text(cc,'Riss ≈ senkrecht',96,482,{size:15,weight:700,col:'#3dff95'})}
    const pl=tvPlane(cc,430,80,500,430,{ox:.38,oy:.7,sc:.6});
    if(t>6.6&&t<13){cc.save();cc.globalAlpha*=.3;G.line(cc,[pl.P([0,0]),pl.P(liftV(.9,thL))],PH.a,1.4,{dash:[4,4]});G.line(cc,[pl.P([0,0]),pl.P(pol(thC,.95))],PH.r,1.4,{dash:[4,4]});cc.restore();tvArc(cc,pl.ox,pl.oy,150,thL+phi,thL,'rgba(94,234,212,.8)',2);}
    if(t>9.7){cc.save();cc.globalAlpha*=sstep(9.7,10.3,t);G.line(cc,[[pl.S.x+12,pl.oy],[pl.S.x+pl.S.w-12,pl.oy]],'rgba(255,192,74,.5)',3);cc.restore()}
    const a0=sstep(3.4,4.2,t);cc.save();cc.globalAlpha*=a0;const L=rotv(liftV(.9,thL),phi);G.line(cc,[pl.P([0,0]),pl.P(L)],PH.a,3);G.stext(cc,'Lift-off',pl.P(L)[0]-46,pl.P(L)[1]+(phi<-.3?20:-10),{col:PH.a,size:13});
    const tr=[];for(let s=0;s<=1;s+=.01)tr.push(rotv(crackV(s,thC,.95),phi));G.trace(cc,tr.map(pl.P),PH.r,2.4);const cp=rotv(pol(thC,.95),phi);G.stext(cc,'Riss',pl.P(cp)[0]+12,pl.P(cp)[1],{col:PH.r,size:13});cc.restore();
    if(t>14.4){const a=sstep(14.4,15,t);cc.save();cc.globalAlpha*=a;tvArc(cc,pl.ox,pl.oy,44,0,thC+phi,'#5eead4');G.stext(cc,fmt((thC+phi)/D2R,0)+'°',pl.ox+46,pl.oy-40,{col:'#5eead4',size:13});cc.restore()}
    G.stext(cc,'Arbeitspunkt',pl.ox+8,pl.oy+16,{size:11});pl.end()}],
   [16.9,19.9,(lt,p,cc=c)=>{studio(cc,t,'#13243f');G.text(cc,'Drei gängige Auswerteverfahren',VW/2,110,{align:'center',size:28,weight:800,col:'#fff'});
    const D=[['Amplitude','nur der Betrag','#59b6ff'],['Y-Komponente','nur die Senkrechte','#3dff95'],['Sektor','Winkelfenster + Schwelle','#c39bff']];
    D.forEach(([n,s,col],i)=>{const a=easeOut((t-17.1-i*.45)/.6);if(a<=0)return;const x=60+i*290,y=160;cc.save();cc.globalAlpha*=a;cc.translate(0,(1-a)*20);vcard(cc,x,y,260,300,{accent:col});G.badge(cc,'0'+(i+1),x+20,y+26,col,{size:12});
     const S=G.screen(cc,x+50,y+56,160,140,{bezel:4});const ox=S.x+S.w*.4,oy=S.y+S.h*.72;cc.strokeStyle='rgba(120,255,190,.3)';cc.lineWidth=1;cc.beginPath();cc.moveTo(S.x+6,oy);cc.lineTo(S.x+S.w-6,oy);cc.moveTo(ox,S.y+6);cc.lineTo(ox,S.y+S.h-6);cc.stroke();
     if(i===0){cc.strokeStyle='rgba(89,182,255,.8)';cc.setLineDash([4,4]);cc.beginPath();cc.arc(ox,oy,46,0,TAU);cc.stroke();cc.setLineDash([])}
     if(i===1){G.line(cc,[[S.x+6,oy-40],[S.x+S.w-6,oy-40]],'rgba(61,255,149,.8)',1.5,{dash:[4,4]})}
     if(i===2){cc.fillStyle='rgba(195,155,255,.25)';cc.beginPath();cc.moveTo(ox,oy);cc.arc(ox,oy,90,-(thc+.4),-(thc-.4));cc.closePath();cc.fill()}
     const v=crackV((t*.5+i*.3)%1,thc,1,.14);G.spot(cc,ox+v[0]*70,oy-v[1]*70,PH.r,3.5);G.glass(cc,S);
     G.text(cc,n,x+130,y+240,{align:'center',size:20,weight:800,col});G.text(cc,s,x+130,y+268,{align:'center',size:14,weight:600,col:'#dbe7f3'});cc.restore()})}],
   [19.7,31.3,(lt,p,cc=c)=>{studio(cc,t,'#0f2741');vchip(cc,'1 · Amplitudenauswertung','#59b6ff');const evs=[[20.4,2.1,'C',.82],[22.8,2.1,'L',.78]];const thr=.55;
    const pl=tvPlane(cc,40,80,460,420,{ox:.42,oy:.66,sc:.5});cc.save();cc.strokeStyle='rgba(89,182,255,.85)';cc.lineWidth=1.8;cc.setLineDash([6,5]);cc.beginPath();cc.arc(pl.ox,pl.oy,thr*pl.sc,0,TAU);cc.stroke();cc.restore();G.stext(cc,'Schwelle |Z|',pl.ox+thr*pl.sc*.72+6,pl.oy+thr*pl.sc*.72+14,{col:'#59b6ff',size:11});
    drawEv(cc,pl,evs,t);const[ev,v]=live(evs,t);const m=Math.hypot(v[0],v[1]);if(ev){G.line(cc,[pl.P([0,0]),pl.P(v)],'#59b6ff',2,{dash:[3,3]})}pl.end();
    vcard(cc,530,90,400,150,{bg:'rgba(10,24,38,.94)',accent:'#59b6ff'});G.text(cc,'Betrag des Signals',555,124,{size:15,weight:700,col:'#9fb3c8'});G.meterBar(cc,555,150,300,16,Math.min(1,m/1),m>thr?'#ff5d6c':'#59b6ff');
    const sx=555+300*thr;G.line(cc,[[sx,142],[sx,176]],'#ff8a96',2);G.led(cc,885,158,m>thr,'#ff3b4a',12);G.text(cc,ev?(ev[2]==='C'?'Riss → Alarm':'Lift-off → auch Alarm!'):'—',555,214,{size:17,weight:800,col:ev&&m>thr?'#ff8a96':'#cfe3f0'});
    const pro=[['einfach',true,24.7],['phasenunabhängig',true,25.6],['keine Trennung von Fehler und Störung, wenn beide ähnlich groß sind',false,27.2]];
    pro.forEach(([s,ok,t0],i)=>{const a=sstep(t0,t0+.6,t);if(a<=0)return;cc.save();cc.globalAlpha*=a;vcard(cc,530,262+i*76,400,64,{bg:'rgba(10,24,38,.92)',accent:ok?'#3dff95':'#ff5d6c'});tvCheck(cc,566,294+i*76,ok,1,26);
     const words=s.split(' ');if(words.length>5){G.text(cc,words.slice(0,5).join(' '),592,288+i*76,{size:14.5,weight:700,col:'#eef6ff'});G.text(cc,words.slice(5).join(' '),592,308+i*76,{size:14.5,weight:700,col:'#eef6ff'})}else G.text(cc,s,592,300+i*76,{size:17,weight:700,col:'#eef6ff'});cc.restore()})}],
   [31.1,41.8,(lt,p,cc=c)=>{studio(cc,t,'#0f2741');vchip(cc,'2 · Y-Komponente','#3dff95');const evs=[[36.9,2,'L',.85],[39.6,2,'C',.9]];const thr=.4;
    const pl=tvPlane(cc,40,80,460,420,{ox:.42,oy:.72,sc:.55});G.line(cc,[[pl.S.x+10,pl.oy-thr*pl.sc],[pl.S.x+pl.S.w-10,pl.oy-thr*pl.sc]],'rgba(255,93,108,.65)',1.4,{dash:[6,5]});G.stext(cc,'Y-Schwelle',pl.S.x+pl.S.w-86,pl.oy-thr*pl.sc-6,{col:'#ff8a96',size:11});
    let v=[0,0],ev=null;if(t<36.6){const a=(t-33.4)*1.2;v=t>33.9?pol(.62+.12*Math.sin(a*1.7),Math.PI/2+1.15*Math.sin(a)):[0,0];if(t>33.9)G.spot(cc,...pl.P(v),'#9fd2ff',6)}else{drawEv(cc,pl,evs,t);[ev,v]=live(evs,t)}
    if(t>33.9){const[x,y]=pl.P(v);G.line(cc,[[x,y],[pl.ox,y]],'rgba(61,255,149,.8)',1.6,{dash:[4,3]});cc.save();cc.shadowColor='#3dff95';cc.shadowBlur=10;cc.fillStyle='#3dff95';cc.fillRect(pl.ox-4,Math.min(y,pl.oy),8,Math.abs(pl.oy-y));cc.restore();G.stext(cc,'Y',pl.ox-22,y+4,{col:'#3dff95',size:12})}pl.end();
    const R={x:540,y:110,w:380,h:200};const ser=[];for(let q=36.7;q<=t;q+=.04){const[e2,w]=live(evs,q);ser.push([(q-36.7)/5.1,w[1]*1.4])}
    tvStrip(cc,R,[[ser,'#3dff95']],{thr:thr*1.4,both:false,zero:.82,title:'Y-Signal über der Zeit',head:t>36.7});
    if(t>38.9)G.text(cc,'Lift-off: Y ≈ 0',R.x+R.w*.2,R.y+R.h+8,{size:12.5,col:PH.a,align:'center'});if(t>40.6)G.text(cc,'Riss: Y groß',R.x+R.w*.72,R.y+R.h+8,{size:12.5,col:PH.r,align:'center'});
    const alarm=ev&&ev[2]==='C'&&v[1]>thr;vcard(cc,540,350,380,130,{bg:'rgba(10,24,38,.92)',accent:alarm?'#ff3b4a':'#3dff95'});G.led(cc,590,415,alarm,'#ff3b4a',16);
    G.text(cc,alarm?'Alarm: Riss':t<36.6?'Nur die Senkrechte zählt':'kein Alarm',622,410,{size:19,weight:800,col:alarm?'#ff8a96':'#cfe3f0'});G.text(cc,t<36.6?'Waagerechte Anteile werden ignoriert':ev&&ev[2]==='L'?'Lift-off liegt waagerecht → kein Y':'Waagerechter Lift-off bleibt stumm',622,438,{size:13.5,col:'#9fb3c8'})}],
   [41.6,51.6,(lt,p,cc=c)=>{studio(cc,t,'#0f2741');vchip(cc,'3 · Sektorauswertung','#c39bff');const evs=[[46.6,1.6,'L',.85],[48.3,1.4,'N',.36,thc+5*D2R],[49.8,1.6,'C',.9]];const thr=.5,w0=thc-20*D2R,w1=thc+26*D2R;
    const pl=tvPlane(cc,40,80,460,420,{ox:.42,oy:.72,sc:.55});const a=sstep(43.6,44.6,t);
    cc.save();cc.globalAlpha*=a;cc.fillStyle='rgba(195,155,255,.16)';cc.beginPath();cc.moveTo(pl.ox,pl.oy);cc.arc(pl.ox,pl.oy,pl.sc*1.25,-w1,-w0);cc.closePath();cc.fill();cc.strokeStyle='rgba(195,155,255,.8)';cc.lineWidth=1.5;cc.stroke();
    cc.fillStyle='rgba(8,14,22,.55)';cc.beginPath();cc.moveTo(pl.ox,pl.oy);cc.arc(pl.ox,pl.oy,thr*pl.sc,-w1,-w0);cc.closePath();cc.fill();cc.strokeStyle='rgba(255,93,108,.8)';cc.setLineDash([5,4]);cc.beginPath();cc.arc(pl.ox,pl.oy,thr*pl.sc,-w1,-w0);cc.stroke();cc.setLineDash([]);
    G.stext(cc,'Sektor',pl.P(pol(w1,1.2))[0]-30,pl.P(pol(w1,1.2))[1],{col:'#c39bff',size:12});G.stext(cc,'Schwelle',pl.P(pol(w0,thr))[0]+8,pl.P(pol(w0,thr))[1]+4,{col:'#ff8a96',size:11});cc.restore();
    drawEv(cc,pl,evs,t);const[ev,v]=live(evs,t);pl.end();const ang=Math.atan2(v[1],v[0]),mag=Math.hypot(v[0],v[1]);const inS=ang>=w0&&ang<=w1,alarm=!!ev&&inS&&mag>thr;
    const rows=[['Lift-off','außerhalb des Sektors','kein Alarm',46.6,false],['kleine Störung','im Sektor, aber unter der Schwelle','kein Alarm',48.3,false],['Riss','im Sektor und über der Schwelle','Alarm',49.8,true]];
    rows.forEach(([n,w,r,t0,al],i)=>{const a2=sstep(t0,t0+.5,t);if(a2<=0)return;cc.save();cc.globalAlpha*=a2;const y=96+i*104;vcard(cc,530,y,400,90,{bg:'rgba(10,24,38,.94)',accent:al?'#ff3b4a':'#3dff95'});G.led(cc,568,y+45,al&&alarm,'#ff3b4a',14);
     G.text(cc,n,596,y+36,{size:17,weight:800,col:i===0?PH.a:i===1?'#cfe3f0':'#ff8a96'});G.text(cc,w+' → '+r,596,y+62,{size:13.5,col:'#cfe3f0'});cc.restore()});
    if(t<46.3){cc.save();cc.globalAlpha*=sstep(43.6,44.4,t);tvCard(cc,530,330,400,150,'Winkelfenster um die Rissrichtung',['Nur Signale in dieser Richtung','und über der Schwelle zählen.'],'#c39bff',1);cc.restore()}}],
   [51.4,62.5,(lt,p,cc=c)=>{studio(cc,t,'#13243f');vchip(cc,'In der Praxis kombiniert','#5eead4');G.text(cc,'Die Auswertekette in der Praxis',VW/2,118,{align:'center',size:26,weight:800,col:'#fff'});
    const B=[['Phasensteller','Lift-off waagerecht','#5eead4',52.6],['Y-Komponente / Sektor','Richtung prüfen','#c39bff',54.3],['Schwelle','Größe prüfen','#ff8a96',56.2],['Alarm','nur beim Riss','#ff3b4a',56.9]];const bx=i=>40+i*230,by=170,bw=190,bh=120;
    B.forEach(([n,s,col,t0],i)=>{const a=easeOut((t-t0+.6)/.6);if(a<=0)return;cc.save();cc.globalAlpha*=a;vcard(cc,bx(i),by,bw,bh,{accent:col});G.text(cc,n,bx(i)+bw/2+4,by+50,{align:'center',size:i===1?15:17,weight:800,col});G.text(cc,s,bx(i)+bw/2+4,by+78,{align:'center',size:13,col:'#cfe3f0'});
     if(i===3)G.led(cc,bx(i)+bw/2,by+100,false,'#ff3b4a',8);if(i<3)G.arrow(cc,bx(i)+bw+6,by+bh/2,bx(i+1)-6,by+bh/2,'#5eead4',{lw:2.5,head:9});cc.restore()});
    // Signale laufen durch die Kette: Riss (rot) kommt durch, Lift-off bleibt am Richtungsfilter, kleine Störung an der Schwelle hängen
    if(t>57){const K=[['R',0],['L',.33],['N',.66]];K.forEach(([k,o])=>{const u=((t-57)*.42+o)%1;const stop=k==='L'?1.55:k==='N'?2.55:3.4;const pos=Math.min(u*4,stop);const x=bx(0)+bw/2+pos*230,y=by+bh+46;const col=k==='R'?'#ff5d6c':k==='L'?'#ffc04a':'#9fb3c8';
      const blocked=u*4>stop&&k!=='R';cc.save();cc.globalAlpha*=blocked?Math.max(0,1-(u*4-stop)*1.5):1;G.dot(cc,x,y,9,col,{ring:false,glow:12});G.text(cc,k==='R'?'Riss':k==='L'?'Lift-off':'Störung',x,y+26,{align:'center',size:12,weight:700,col});if(blocked)tvCheck(cc,x+18,y-14,false,1,18);cc.restore();
      if(k==='R'&&u*4>3.2)G.led(cc,bx(3)+bw/2,by+100,true,'#ff3b4a',8)})}
    tvCard(cc,140,380,330,104,'Fehlersignal',['wird zuverlässig erkannt'],'#3dff95',sstep(57.7,58.4,t));tvCheck(cc,440,412,true,sstep(57.9,58.5,t),30);
    tvCard(cc,500,380,330,104,'Störsignale',['werden unterdrückt'],'#3dff95',sstep(59.4,60,t));tvCheck(cc,800,412,true,sstep(59.6,60.2,t),30)}]
  ])})});
/* ------------------------------------------------------------------ */
function tvIcon(c,k,x,y,tt){/* kleine Anwendungs-Symbole 90×64, Mitte x,y */c.save();
 if(k==='sigma'){c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=6;c.beginPath();c.arc(x,y+18,34,Math.PI*1.1,Math.PI*1.9);c.stroke();const a=Math.PI*1.5+Math.sin(tt*1.5)*.45;c.strokeStyle='#59b6ff';c.lineWidth=6;c.beginPath();c.arc(x,y+18,34,Math.PI*1.1,a);c.stroke();G.arrow(c,x,y+18,x+Math.cos(a)*28,y+18+Math.sin(a)*28,'#e6eef7',{lw:2.4,head:7});G.text(c,'σ',x,y+14,{align:'center',size:14,weight:800,col:'#9fd2ff'})}
 if(k==='layer'){[['#7f8c99',14],['#e7c35a',8],['#3fd6cb',6]].reduce((yy,[col,h])=>{c.fillStyle=col;G.rr(c,x-40,yy-h,80,h,2);c.fill();return yy-h},y+26);G.probe(c,x,y-2+(Math.sin(tt*2)*2),16,{len:26,cable:false,shadow:false})}
 if(k==='crack'){G.slab(c,x-42,y+12,74,16,12,8,'alu',{shadow:false});c.strokeStyle='#05080b';c.lineWidth=3;c.beginPath();c.moveTo(x-6,y+12);c.lineTo(x,y+4);c.lineTo(x+8,y);c.stroke();G.probe(c,x-30+((tt*.4)%1)*56,y+6,14,{len:24,cable:false,shadow:false})}
 if(k==='weld'){G.slab(c,x-44,y+14,40,14,10,7,'steel',{shadow:false});G.slab(c,x+2,y+14,40,14,10,7,'steel',{shadow:false});c.fillStyle='#a77b4a';c.beginPath();c.ellipse(x+3,y+12,10,6,0,Math.PI,0);c.fill();G.probe(c,x-30+((tt*.4)%1)*60,y+4,14,{len:24,cable:false,shadow:false})}
 if(k==='bore'){const g=c.createRadialGradient(x,y+6,4,x,y+6,32);g.addColorStop(0,'#05080b');g.addColorStop(.62,'#121a22');g.addColorStop(.64,'#8a97a4');g.addColorStop(1,'#5a6672');c.fillStyle=g;c.beginPath();c.arc(x,y+6,32,0,TAU);c.fill();const a=tt*3;G.dot(c,x+Math.cos(a)*14,y+6+Math.sin(a)*14,6,'#59b6ff',{ring:false,glow:10})}
 c.restore()}
vid('ton_sonde',{title:'Absolut- und Differenzsonde',dur:67.25,audio:'media/ton/ton_sonde.m4a',
 scenes:[{t:0,n:'Zwei Sondentypen'},{t:7.3,n:'Absolutsonde'},{t:25.2,n:'Differenzsonde'},{t:37,n:'Schmetterling'},{t:45,n:'Wann welche?'},{t:60.7,n:'Praxis'}],
 caps:[[0,'In der Wirbelstromprüfung unterscheidet man zwei grundlegende Sondentypen: die Absolutsonde und die Differenzsonde.'],[7.35,'Die Absolutsonde vergleicht das Signal mit einem festen Bezug.'],[11.3,'Sie sieht sowohl örtliche Fehler als auch langsame Änderungen wie Lift-off, Temperaturgang oder Werkstoffschwankungen.'],[18.45,'Die Anzeige ist oft leichter zu deuten, erfordert aber eine gute Unterdrückung der Störgrößen über Phase und Filter.'],[25.25,'Die Differenzsonde besteht aus zwei gegeneinander geschalteten Spulen.'],[29.5,'Gleichmäßige Einflüsse, die beide Spulen gleich treffen, heben sich auf.'],[34,'Nur örtliche Unterschiede erzeugen ein Signal.'],[37,'Typisch ist die charakteristische Schmetterlingsfigur beim Überfahren eines Risses.'],[41.55,'Lift-off und langsame Drift werden weitgehend unterdrückt.'],[45.05,'Wann welche Sonde?'],[46.4,'Für flächige Eigenschaften – Leitfähigkeit oder Schichtdicke – eignet sich die Absolutsonde.'],[51.7,'Für Rissprüfung an Oberflächen, Schweißnähten oder in Bohrungen ist die Differenzsonde meist die bessere Wahl, weil sie Störgrößen von vornherein unterdrückt.'],[60.75,'In der Praxis kombiniert man oft beide Prinzipien oder nutzt Mehrspulensysteme – je nach Prüfaufgabe.']],
 draw:vstage((c,t)=>{studio(c,t,'#0e2a3a');
  /* Absolut-Scan: Signalanteile entlang des Wegs u∈[0,1] */
  const crk=u=>.95*Math.exp(-Math.pow((u-.3)/.025,2)),lif=u=>.18*Math.sin(Math.PI*u*1.2),tmp=u=>.3*u,mat=u=>.32*sstep(.55,.6,u)*(1-sstep(.7,.75,u));
  const absS=u=>crk(u)+lif(u)+tmp(u)+mat(u),hp=u=>crk(u)+.2*(Math.exp(-Math.pow((u-.575)/.02,2))-Math.exp(-Math.pow((u-.725)/.02,2)));
  const cx0=430;const cv=xc=>{const a=Math.exp(-Math.pow((xc-cx0)/26,2)),ph=1.15+(xc-cx0)/34;return[a*Math.cos(ph),a*Math.sin(ph)]};const dif=x=>{const a=cv(x-22),b2=cv(x+22);return[a[0]-b2[0],a[1]-b2[1]]};
  vscenes(c,t,[
   [0,3.5,(lt,p,cc=c)=>vtitle(cc,lt,{kicker:'Erklärvideo · Sondentechnik',title:'Absolut- und Differenzsonde',sub:'Zwei Prinzipien – unterschiedliche Stärken',hue:'#0e2a3a'})],
   [3.3,7.5,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');G.text(cc,'Zwei grundlegende Sondentypen',VW/2,110,{align:'center',size:28,weight:800,col:'#fff'});G.slab(cc,110,400,740,40,60,30,'alu');
    const a1=sstep(4.6,5.3,t),a2=sstep(5.6,6.3,t);cc.save();cc.globalAlpha*=a1;tvSideProbe(cc,300,392,{g1:.6+.4*Math.sin(t*3)});G.label(cc,'Absolutsonde',300,190,{align:'center',size:17,col:'#5eead4',bg:'rgba(8,20,32,.88)'});G.text(cc,'eine Messspule · fester Bezug',300,220,{align:'center',size:13.5,col:'#9fb3c8'});cc.restore();
    cc.save();cc.globalAlpha*=a2;tvSideProbe(cc,640,392,{diff:true,g1:.5,g2:.5});G.label(cc,'Differenzsonde',640,190,{align:'center',size:17,col:'#ff8d50',bg:'rgba(8,20,32,.88)'});G.text(cc,'zwei Spulen gegeneinander',640,220,{align:'center',size:13.5,col:'#9fb3c8'});cc.restore()}],
   [7.3,25.4,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'Absolutsonde','#5eead4');const u=clamp((t-7.6)/10,0,1);
    const sx=70,sw=560,sy=232;G.slab(cc,40,sy,640,40,50,24,'alu',{shadow:false});cc.save();cc.fillStyle='rgba(231,195,90,.28)';cc.fillRect(sx+.58*sw,sy,.15*sw,40);cc.beginPath();cc.moveTo(sx+.58*sw,sy);cc.lineTo(sx+.73*sw,sy);cc.lineTo(sx+.73*sw+50,sy-24);cc.lineTo(sx+.58*sw+50,sy-24);cc.closePath();cc.fill();cc.restore();
    cc.strokeStyle='#05080b';cc.lineWidth=3;cc.beginPath();cc.moveTo(sx+.3*sw,sy);cc.lineTo(sx+.3*sw+10,sy-10);cc.lineTo(sx+.3*sw+22,sy-18);cc.stroke();
    const px=sx+u*sw,lift=12+60*lif(u);tvSideProbe(cc,px,sy-6-lift,{g1:.4+crk(u)});
    // Thermometer am Kabel: Temperaturgang
    cc.save();const tx=px+44,ty=sy-140-lift;cc.fillStyle='rgba(255,255,255,.18)';G.rr(cc,tx,ty,10,44,5);cc.fill();cc.fillStyle='#ff5d6c';const hh=10+30*u;G.rr(cc,tx+2,ty+44-hh,6,hh,3);cc.fill();cc.restore();
    if(t>13.4)G.label(cc,'Werkstoff anders',sx+.655*sw+20,sy+56,{align:'center',size:12,col:'#e7c35a',bg:'rgba(8,20,32,.85)'});G.label(cc,'Riss',sx+.3*sw,sy+56,{align:'center',size:12,col:'#ff8a96',bg:'rgba(8,20,32,.85)'});
    const R={x:60,y:340,w:580,h:150};const ser=[],flt=[];for(let s=0;s<=u;s+=.004)ser.push([s,absS(s)]);const fu=clamp((t-20)/4.5,0,1);for(let s=0;s<=fu;s+=.004)flt.push([s,hp(s)]);
    tvStrip(cc,R,[[ser,'#5eead4',fu>0?[5,4]:null],[flt,'#3dff95']],{zero:.78,title:'Absolutsignal beim Abfahren'});
    const tag=(t0,s,txt,col,dy=-14,dx=0)=>{if(t<t0)return;cc.save();cc.globalAlpha*=sstep(t0,t0+.5,t);G.label(cc,txt,R.x+s*R.w+dx,R.y+R.h*.78-absS(s)*R.h/2+dy,{align:'center',size:12,col,bg:'rgba(8,20,32,.9)'});cc.restore()};
    tag(11.4,.3,'örtlicher Fehler','#ff8a96',6,74);tag(12.9,.43,'Lift-off','#ffc04a',-22);tag(14.6,.93,'Temperaturgang','#ff9d5c',-20);tag(16.2,.655,'Werkstoff','#e7c35a',-18);
    vcard(cc,690,84,240,150,{bg:'rgba(10,24,38,.94)',accent:'#5eead4'});G.text(cc,'Fester Bezug',712,116,{size:16,weight:800,col:'#5eead4'});
    G.coil(cc,745,180,64,18,6,{I:Math.sin(t*3)*.6,phase:t,leads:false});G.text(cc,'Messspule',745,222,{align:'center',size:12,col:'#9fb3c8'});G.text(cc,'↔',800,186,{align:'center',size:22,weight:800,col:'#cfe3f0'});cc.fillStyle='#1d2c3a';G.rr(cc,836,150,64,50,8);cc.fill();cc.strokeStyle='rgba(255,255,255,.2)';cc.stroke();G.text(cc,'Ref',868,181,{align:'center',size:14,weight:800,col:'#9fb3c8'});
    tvCard(cc,690,262,240,96,'✓ leicht zu deuten',['ein Ausschlag je Ereignis'],'#3dff95',sstep(18.5,19.1,t),{ts:16,ls:13.5,lh:22});
    tvCard(cc,690,372,240,118,'! Störgrößen',['über Phase und Filter','unterdrücken'],'#ffc04a',sstep(20.6,21.2,t),{ts:16,ls:13.5,lh:22});
    if(fu>0)G.legend(cc,R.x+R.w-250,R.y+12,[['#5eead4','roh',[5,4]],['#3dff95','gefiltert']],{col:'#e6eef7'})}],
   [25.2,45.2,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'Differenzsonde','#ff8d50');const sy=210;
    let px=200,wob=0;if(t>=29.5&&t<34.1)wob=Math.sin((t-29.5)*4)*10;if(t>=34.1&&t<37)px=lerp(200,cx0-22,easeIO((t-34.1)/2.4));if(t>=37&&t<41.6)px=lerp(cx0-22,cx0+150,easeIO((t-37)/3.8));if(t>=41.6){px=cx0+150;wob=Math.sin((t-41.6)*5)*8}
    const warm=t>=29.5&&t<34.1?.5+.5*Math.sin((t-29.5)*1.3):t>=41.6?.5+.5*Math.sin((t-41.6)*1.1):0;
    G.slab(cc,40,sy,860,40,50,24,'alu',{shadow:false});if(warm>0){cc.fillStyle='rgba(255,110,60,'+(.18*warm)+')';cc.fillRect(40,sy-30,910,74)}
    cc.strokeStyle='#05080b';cc.lineWidth=3;cc.beginPath();cc.moveTo(cx0,sy);cc.lineTo(cx0+10,sy-10);cc.lineTo(cx0+22,sy-18);cc.stroke();G.label(cc,'Riss',cx0+8,sy+56,{align:'center',size:12,col:'#ff8a96',bg:'rgba(8,20,32,.85)'});
    const a1=Math.exp(-Math.pow((px-22-cx0)/26,2)),a2=Math.exp(-Math.pow((px+22-cx0)/26,2));tvSideProbe(cc,px,sy-18-wob,{diff:true,g1:a1,g2:a2});
    if(warm>0)G.label(cc,t<41.6?'Wackeln + Temperatur: beide Spulen gleich':'Lift-off und Drift',VW/2,84,{align:'center',size:14,col:'#ffc04a',bg:'rgba(8,20,32,.88)'});
    // unten links: Messwerte bzw. Schrieb
    if(t<37){vcard(cc,40,300,500,200,{bg:'rgba(8,18,28,.92)'});const base=.45+.25*Math.abs(wob)/10+.15*warm;const v1=Math.min(1,base+.5*a1),v2=Math.min(1,base+.5*a2),d=v1-v2;
     G.text(cc,'Spule 1 (+)',64,338,{size:15,weight:700,col:'#59b6ff'});G.meterBar(cc,190,326,300,16,v1,'#59b6ff');G.text(cc,'Spule 2 (−)',64,378,{size:15,weight:700,col:'#ff8d50'});G.meterBar(cc,190,366,300,16,v2,'#ff8d50');
     G.text(cc,'Differenz',64,436,{size:17,weight:800,col:'#fff'});const zx=340;cc.fillStyle='rgba(255,255,255,.1)';G.rr(cc,190,422,300,18,6);cc.fill();cc.fillStyle=Math.abs(d)>.05?'#ff5d6c':'#3dff95';const dw=d*300;G.rr(cc,Math.min(zx,zx+dw),422,Math.max(4,Math.abs(dw)),18,4);cc.fill();G.line(cc,[[zx,414],[zx,448]],'#fff',1.5);
     G.text(cc,Math.abs(d)>.05?'≠ 0 → Signal':'= 0 → kein Signal',340,478,{align:'center',size:16,weight:800,col:Math.abs(d)>.05?'#ff8a96':'#3dff95'})}
    else{const R={x:60,y:320,w:460,h:160};const ab=[],df=[];const t1=Math.min(t,41.6);const xq=q=>q<37?lerp(200,cx0-22,easeIO((q-34.1)/2.4)):lerp(cx0-22,cx0+150,easeIO((q-37)/3.8));for(let q=34.1;q<=t1;q+=.03){const x=xq(q);const d=dif(x);df.push([(q-34.1)/10.9,d[1]*1.1]);ab.push([(q-34.1)/10.9,cv(x-22)[1]*1.1])}
     if(t>41.6)for(let q=41.6;q<=t;q+=.03){const w=Math.sin((q-41.6)*5)*8,wm=.5+.5*Math.sin((q-41.6)*1.1);ab.push([(q-34.1)/10.9,.25*w/8+.35*wm]);df.push([(q-34.1)/10.9,.02*Math.sin(q*9)])}
     tvStrip(cc,R,[[ab,'#ffc04a',[6,5]],[df,'#3dff95']],{zero:.55,title:'Signal beim Überfahren',legend:[['#ffc04a','absolut',[6,5]],['#3dff95','differenz']],lx:R.w-210})}
    // unten rechts: Impedanzebene mit Schmetterling (Acht)
    const S=G.screen(cc,590,290,340,230,{label:'Impedanzebene',bezel:6});const mp=v=>[S.cx+v[0]*S.w*.36,S.cy-v[1]*S.h*.4];const tr=[];if(t>=34.1){const t1=Math.min(t,41.6);for(let q=34.1;q<=t1;q+=.03){let x=q<37?lerp(200,cx0-22,easeIO((q-34.1)/2.4)):lerp(cx0-22,cx0+150,easeIO((q-37)/3.8));tr.push(dif(x))}}
    if(tr.length>1){G.persist(cc,tr.map(mp),'#3dff95',2.4);G.spot(cc,...mp(tr[tr.length-1]),'#3dff95',5)}else G.spot(cc,S.cx,S.cy,'#3dff95',5);
    if(t>39.4){cc.save();cc.globalAlpha*=sstep(39.4,40,t);G.stext(cc,'Schmetterling / Acht',S.x+S.w-150,S.y+S.h-14,{col:'#3dff95',size:12});cc.restore()}G.glass(cc,S);
    if(t<29.5){vcard(cc,600,58,330,112,{bg:'rgba(10,24,38,.96)',accent:'#ff8d50'});G.text(cc,'Gegeneinander geschaltet',622,86,{size:16,weight:800,col:'#ff8d50'});G.text(cc,'Signal = Spule 1 − Spule 2',622,112,{size:14.5,weight:700,col:'#e6eef7',mono:true});
     G.coil(cc,700,142,60,13,6,{I:Math.sin(t*3)*.7,phase:t,leads:false});G.coil(cc,840,142,60,13,6,{I:-Math.sin(t*3)*.7,phase:-t,leads:false});G.text(cc,'+',652,147,{align:'center',size:16,weight:800,col:'#59b6ff'});G.text(cc,'−',888,147,{align:'center',size:16,weight:800,col:'#ff8d50'})}}],
   [45,60.9,(lt,p,cc=c)=>{studio(cc,t,'#13243f');G.text(cc,'Wann welche Sonde?',VW/2,96,{align:'center',size:30,weight:800,col:'#fff'});
    const col=(x,title,sub,colr,items,a)=>{if(a<=0)return;cc.save();cc.globalAlpha*=a;vcard(cc,x,124,420,330,{accent:colr});G.text(cc,title,x+28,162,{size:22,weight:800,col:colr});G.text(cc,sub,x+28,188,{size:14,col:'#9fb3c8'});
     items.forEach(([k,txt,t0],i)=>{const b=easeOut((t-t0)/.6);if(b<=0)return;cc.save();cc.globalAlpha*=b;const y=212+i*78;cc.fillStyle='rgba(255,255,255,.04)';G.rr(cc,x+20,y,380,66,12);cc.fill();tvIcon(cc,k,x+76,y+24,t);G.text(cc,txt,x+140,y+40,{size:17,weight:700,col:'#eef6ff'});cc.restore()});cc.restore()};
    col(40,'Absolutsonde','flächige Eigenschaften messen','#5eead4',[['sigma','Leitfähigkeit',47.6],['layer','Schichtdicke',48.8]],sstep(46.4,47,t));
    col(500,'Differenzsonde','Risse finden','#ff8d50',[['crack','Oberflächenrisse',53.2],['weld','Schweißnähte',54.4],['bore','Bohrungen',55.5]],sstep(51.7,52.3,t));
    if(t>57.4){const a=sstep(57.4,58,t);cc.save();cc.globalAlpha*=a;G.label(cc,'✓ unterdrückt Störgrößen von vornherein',710,480,{align:'center',size:15,col:'#3dff95',bg:'rgba(8,20,32,.92)'});cc.restore()}}],
   [60.7,67.3,(lt,p,cc=c)=>{studio(cc,t,'#0e2a3a');vchip(cc,'Praxis: kombinieren','#5eead4');const x0=80,y0=120,w=500,h=330;cc.save();G.metal(cc,x0,y0,w,h,'steel',{r:14});cc.restore();
    cc.strokeStyle='#05080b';cc.lineWidth=3;cc.beginPath();srand(3);for(let k=0;k<=8;k++)cc.lineTo(x0+260+(rnd()-.5)*6,y0+120+k*12);cc.stroke();
    const ax=x0+60+((t-60.7)/6.6)*360,N=6,mode=Math.floor((t-60.7)/1.1)%2;cc.save();cc.shadowColor='rgba(0,0,0,.5)';cc.shadowBlur=14;cc.fillStyle='rgba(28,53,80,.9)';G.rr(cc,ax-34,y0+40,68,250,14);cc.fill();cc.restore();
    for(let i=0;i<N;i++){const yy=y0+62+i*40;const pair=Math.floor(i/2);const act=mode===0?true:((Math.floor(t*2)%3)===pair);const col=mode===0?'#5eead4':'#ff8d50';cc.save();if(act){cc.shadowColor=col;cc.shadowBlur=14}cc.strokeStyle=act?col:'rgba(255,255,255,.3)';cc.lineWidth=3;cc.beginPath();cc.arc(ax,yy,14,0,TAU);cc.stroke();cc.restore()}
    G.label(cc,mode===0?'Absolut-Kanäle':'Differenz-Paare',ax,y0+20,{align:'center',size:13,col:mode===0?'#5eead4':'#ff8d50',bg:'rgba(8,20,32,.9)'});
    tvCard(cc,620,120,310,96,'Beide Prinzipien',['absolut + differenz kombiniert'],'#5eead4',sstep(60.9,61.5,t),{ts:17,ls:14});
    tvCard(cc,620,232,310,96,'Mehrspulensysteme',['viele Kanäle, eine Überfahrt'],'#ff8d50',sstep(62.8,63.4,t),{ts:17,ls:14});
    tvCard(cc,620,344,310,96,'Je nach Prüfaufgabe',['Sonde passend auswählen'],'#c39bff',sstep(64.9,65.5,t),{ts:17,ls:14})}]
  ])})});
