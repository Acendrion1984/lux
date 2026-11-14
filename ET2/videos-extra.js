"use strict";
/* =====================================================================
   Weitere Erklärvideos aus der ET2-Vorlage (Abhebeeffekt, Fehlertiefe,
   Hysterese, Prüfstrecke, Rotiersensor, Toleranzfeld, Schichtdicke,
   Schweißnaht, Verifizierung) – dargestellt auf der gemeinsamen Bühne.
   ===================================================================== */
const VT=(c,t,x,y,col='#fff',sz=20,al='center',wt='bold')=>text(c,t,x,y,col,sz,al,wt);
const rn=i=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const rect=(c,x,y,w,h,f,s,lw=2)=>{if(f){c.fillStyle=f;c.fillRect(x,y,w,h)}if(s){c.strokeStyle=s;c.lineWidth=lw;c.strokeRect(x,y,w,h)}};
const vaxes=(c,x,y,w,h,lx,ly)=>{arrow(c,x,y,x+w,y,'#6f8798',1.6,7);arrow(c,x,y,x,y-h,'#6f8798',1.6,7);VT(c,lx,x+w,y+16,'#9fb4c3',12,'right');VT(c,ly,x+6,y-h-6,'#9fb4c3',12,'left')};
const coilBox=(c,x,y,w,h,col='#d98a3d')=>{c.strokeStyle=col;c.lineWidth=3;for(let i=0;i<6;i++){c.beginPath();c.ellipse(x-w/2+i*w/5,y,w*.06,h/2,0,0,TAU);c.stroke()}};
/* 1 Abhebeeffekt */
vid('lift',{title:'Der Abhebeeffekt in der Impedanzebene',dur:40,caps:[[0,'Eine Spule schwebt über einer Metallplatte. Der Abstand ist groß – die Spule „sieht“ fast nur Luft.'],[10,'Beim Annähern wird das Feld stärker vom Wirbelstromfeld geschwächt: Der Impedanzpunkt wandert auf einer Kurve.'],[20,'Auf der Platte angekommen, ist der Abstand null. Beim Abheben läuft der Punkt dieselbe Kurve zurück.'],[30,'Der Abhebeeffekt ist ein Störsignal – aber auch die Messgröße der Schichtdickenmessung.']],
 draw(c,t,w,hh){const s=t<10?seg01(t,0,10):t<20?1:t<30?1-seg01(t,20,30):seg01(t,30,36)*.0+0;const d=1-s;
  const px=w*.06,pw=w*.4,gy=hh*.78;rect(c,px,gy,pw,hh*.1,'#3a4a58','#9fb4c3');VT(c,'Metallplatte',px+pw/2,gy+hh*.07,'#cfe3f0',13);
  const cy=gy-hh*.06-d*hh*.5;coilBox(c,px+pw/2,cy,pw*.4,hh*.1);arrow(c,px+pw/2,cy+hh*.07,px+pw/2,gy-2,'#6fd2ff',1.5,6);VT(c,'Abstand',px+pw/2+50,(cy+gy)/2,'#6fd2ff',13,'left');
  const ox=w*.58,oy=hh*.8,W=w*.36,H=hh*.62;vaxes(c,ox,oy,W,H,'R','X_L');const P=q=>[ox+W*(.15+.65*Math.pow(q,1.3)),oy-H*(.92-.6*Math.pow(q,.9))];
  const pts=[];for(let q=0;q<=1.001;q+=.02)pts.push(P(q));line(c,pts,'#4a6a84',2);const p=P(s);c.fillStyle='#ff5a4a';c.beginPath();c.arc(p[0],p[1],7,0,TAU);c.fill();
  VT(c,'Luft',P(0)[0]+4,P(0)[1]-10,'#cfe3f0',12,'left');VT(c,'auf Metall',P(1)[0]-6,P(1)[1]+20,'#cfe3f0',12,'right');VT(c,'Impedanzebene',ox+W/2,hh*.14,'#ffb938',15)}});
/* 2 Fehlertiefe -> Phase */
vid('tiefe',{title:'Fehlertiefe und Phasenlage des Signals',dur:40,caps:[[0,'Ein Riss unterbricht die Wirbelströme. Ein flacher Riss an der Oberfläche liefert ein Signal mit kleiner Phasendrehung.'],[10,'Wird der Riss tiefer, müssen die Wirbelströme länger umfließen: Die Signalamplitude wächst.'],[20,'Gleichzeitig dreht sich die Phase des Signals mit zunehmender Tiefe – bezogen auf das Abhebesignal.'],[30,'So lässt sich aus Amplitude und Phase die Fehlertiefe abschätzen. Voraussetzung ist eine Kalibrierung an Testfehlern.']],
 draw(c,t,w,hh){const dep=t<30?clamp(t/28,0,1):1;const px=w*.05,py=hh*.3,pw=w*.42,ph=hh*.45;rect(c,px,py,pw,ph,'#26343f','#9fb4c3');
  for(let k=1;k<6;k++){const y=py+k*ph/7;c.strokeStyle='rgba(255,140,50,'+(.7-k*.1)+')';c.lineWidth=2;c.beginPath();c.moveTo(px,y);const cx=px+pw/2,cd=dep*ph*.8;if(y-py<cd){c.lineTo(cx-8,y);c.lineTo(cx-8,py+cd+(y-py)*0+6);c.lineTo(cx+8,py+cd+6);c.lineTo(cx+8,y)}c.lineTo(px+pw,y);c.stroke()}
  rect(c,px+pw/2-6,py,12,dep*ph*.8,'#0a1620','#ff5a4a');coilBox(c,px+pw/2,py-hh*.06,pw*.3,hh*.08);VT(c,'Tiefe '+fmt(dep*100,0)+' %',px+pw/2,py+ph+22,'#ffb938',15);
  const ox=w*.62,oy=hh*.72,r=w*.3;vaxes(c,ox,oy,r,r*.8,'','');const ang=(15+dep*70)*D2R,len=r*(.25+.6*dep);arrow(c,ox,oy,ox+len*Math.cos(ang),oy-len*Math.sin(ang),'#ff5a4a',3,9);
  line(c,[[ox,oy],[ox+r*.9,oy]],'#3d8a3d',1.5,[5,4]);c.strokeStyle='#ffb938';c.lineWidth=1.5;c.beginPath();c.arc(ox,oy,r*.2,0,-ang,true);c.stroke();VT(c,'Phase '+fmt(15+dep*70,0)+'°',ox+r*.25,oy-8,'#ffb938',13,'left');VT(c,'Amplitude '+fmt(100*(.25+.6*dep),0)+' %',w*.78,hh*.14,'#cfe3f0',13)}});
/* 3 Hysterese */
vid('hyst',{title:'Magnetisierung, Sättigung und Hysterese',dur:44,caps:[[0,'Ein unmagnetischer Stahl wird durch ein Feld H aufmagnetisiert: Die Weiß’schen Bezirke richten sich aus – die Neukurve.'],[11,'Ab der Sättigung wächst die Induktion B kaum noch. Die Permeabilität μ = B/H sinkt.'],[20,'Wird das Feld zurückgenommen, bleibt Magnetismus zurück: die Remanenz B_r.'],[28,'Erst das Gegenfeld H_c, die Koerzitivfeldstärke, bringt B auf null. Mit Wechselfeld entsteht die ganze Hystereseschleife.'],[38,'Genau deshalb ist Permeabilität ein „unruhiger“ Störer – und Entmagnetisieren oder Sättigen so wichtig.']],
 draw(c,t,w,hh){const ox=w*.5,oy=hh*.52,W=w*.34,H=hh*.38,k=3,hc=.25;const up=h=>Math.tanh((h-hc)*k),dn=h=>Math.tanh((h+hc)*k);
  arrow(c,ox-W*1.1,oy,ox+W*1.15,oy,'#6f8798',1.5,7);arrow(c,ox,oy+H*1.1,ox,oy-H*1.15,'#6f8798',1.5,7);VT(c,'H',ox+W*1.15,oy+18,'#9fb4c3',14);VT(c,'B',ox+10,oy-H*1.15,'#9fb4c3',14,'left');
  const P=(h,b)=>[ox+h*W,oy-b*H];let pts=[];const p1=seg01(t,0,11);for(let h=0;h<=1.2*p1+.001;h+=.02)pts.push(P(h,Math.tanh(h*k*.8)));line(c,pts,'#6fd2ff',3);
  if(t>11){const p=seg01(t,11,20);pts=[];for(let h=1.2;h>=1.2-(1.2)*p;h-=.02)pts.push(P(h,dn(h)));line(c,pts,'#ffb938',3)}
  if(t>20){const p=seg01(t,20,28);c.fillStyle='#ff5a4a';c.beginPath();c.arc(...P(0,dn(0)),7,0,TAU);c.fill();VT(c,'B_r (Remanenz)',...P(.05,dn(0)+.1),'#ff5a4a',14,'left')}
  if(t>28){const p=seg01(t,28,38);pts=[];for(let h=0;h>=-1.2*p;h-=.02)pts.push(P(h,dn(h)));line(c,pts,'#ffb938',3);pts=[];for(let h=-1.2;h<=-1.2+2.4*p;h+=.02)pts.push(P(h,up(h)));line(c,pts,'#b58cff',3);c.fillStyle='#3dff95';c.beginPath();c.arc(...P(hc,0),7,0,TAU);c.fill();VT(c,'H_c',...P(hc,0).map((v,i)=>i?v+20:v),'#3dff95',14)}
  if(t>11&&t<20)VT(c,'Sättigung',...P(1.1,.98).map((v,i)=>i?v-14:v-30),'#6fd2ff',14);
  const n=9,d0=t<11?seg01(t,0,11):1;for(let i=0;i<n;i++){const a=lerp(rn(i+3)*TAU,0,d0);arrow(c,w*.06+i%3*30,hh*.62+Math.floor(i/3)*28,w*.06+i%3*30+18*Math.cos(a),hh*.62+Math.floor(i/3)*28-18*Math.sin(a),'#9fb4c3',2,5)}VT(c,'Weiß’sche Bezirke',w*.06+40,hh*.58,'#9fb4c3',12)}});
/* 4 Prüfstrecke */
vid('strecke',{title:'Rohrprüfstrecke: Magnetisieren – Prüfen – Entmagnetisieren',dur:44,caps:[[0,'Ein ferromagnetisches Rohr läuft in die Prüfstrecke. Die Weiß’schen Bezirke sind noch ungeordnet – das erzeugt Rauschen.'],[12,'Die Gleichfeld-Magnetisierung bringt das Rohr in die Sättigung: alle Bezirke zeigen in eine Richtung.'],[22,'Jetzt prüft die Spule: Der Fehler liefert ein klares Signal, das Grundrauschen ist deutlich gesunken.'],[32,'Zum Schluss entmagnetisiert ein abklingendes Wechselfeld das Rohr – es verlässt die Strecke ohne Restmagnetismus.']],
 draw(c,t,w,hh){const y0=hh*.42,ph=hh*.2,xs=[w*.22,w*.46,w*.72],names=['Aufmagnetisierung','Prüfspulen','Entmagnetisierung'],cols=['#6fd2ff','#3dff95','#ffb938'];
  const shift=t*w*.014-w*.1;rect(c,0,y0,w,ph,'#26343f','#9fb4c3');
  for(let i=0;i<30;i++){const x=i*w/28+(shift%(w/28));let a;const x0=x;if(x0<xs[0])a=rn(i+(Math.floor(shift/(w/28)))*0)*TAU;else if(x0<xs[2])a=0;else a=(rn(i+50))*TAU*.5-.5;const yy=y0+ph/2;arrow(c,x,yy,x+16*Math.cos(a),yy-16*Math.sin(a)*0.8,'#cfe3f0',2,5)}
  const fx=w*.1+ (t>28?0:0);for(let i=0;i<3;i++){rect(c,xs[i]-w*.05,y0-ph*.35,w*.1,ph*1.7,'rgba(255,255,255,.06)',cols[i],2.5);VT(c,names[i],xs[i],y0+ph*1.65+16,cols[i],14)}
  if(t>20){const sx=(w*.3+t*w*.01),amp=Math.exp(-Math.pow((t-27)/2.2,2));VT(c,'Fehler',w*.6,y0-ph*.7,'#ff5a4a',13);const ox=w*.1,oy=hh*.9,W=w*.8;line(c,[[ox,oy],[ox+W,oy]],'#4a6a84',1);const p=[];for(let x=0;x<=W;x+=3){const tt=x/W*44;p.push([ox+x,oy-(t>tt&&tt>20?(Math.exp(-Math.pow((tt-27)/1.5,2))*hh*.12+rn(x)*(tt<12?3:1)):0)])}line(c,p,'#ff5a4a',2)}VT(c,'Signal',w*.06,hh*.88,'#9fb4c3',12,'left')}});
/* 5 Rotierende Abtastung */
vid('rotier',{title:'Rotierende Tastsensoren: Vorschub und Überdeckung',dur:40,caps:[[0,'Das Rohr wird abgewickelt dargestellt: waagerecht die Länge, senkrecht der Umfang. Der Tastsensor rotiert und das Rohr läuft vor.'],[8,'Die Spur des Sensors ist eine Schraubenlinie. Ist die Ganghöhe kleiner als die Spurbreite, überlappen sich die Bahnen.'],[18,'Wird der Vorschub zu groß, bleiben ungeprüfte Streifen: Ein Längsfehler kann unentdeckt durchlaufen.'],[30,'Deshalb gilt: Ganghöhe kleiner als Abtastbreite – oder man vereinbart eine Mindestfehlerlänge.']],
 draw(c,t,w,hh){const x0=w*.08,y0=hh*.14,W=w*.84,H=hh*.62,ph2=t>=18,pitch=ph2?W*.17:W*.08,sw=W*.12,tt=ph2?clamp((t-18)/16,0,1):clamp(t/16,0,1);rect(c,x0,y0,W,H,'#1d2a34','#9fb4c3');
  c.save();c.beginPath();c.rect(x0,y0,W,H);c.clip();const n=Math.ceil(W/pitch)+1;for(let i=0;i<n;i++){const p=clamp(tt*n-i,0,1);if(p<=0)continue;c.strokeStyle='rgba(61,255,149,.35)';c.lineWidth=sw;c.beginPath();c.moveTo(x0+i*pitch,y0+H);c.lineTo(x0+i*pitch+pitch*p,y0+H-H*p);c.stroke()}
  if(ph2&&tt>.95)for(let i=0;i<n;i++){const xx=x0+i*pitch+pitch*.5+sw/2;c.fillStyle='rgba(255,80,60,.5)'}c.restore();
  const fi=Math.min(n-1,Math.floor(tt*n)),pp=clamp(tt*n-fi,0,1),sx=x0+fi*pitch+pitch*pp,sy=y0+H-H*pp;if(tt<1){c.fillStyle='#ffb938';c.beginPath();c.arc(sx,sy,9,0,TAU);c.fill()}
  if(ph2&&tt>.8){VT(c,'ungeprüfte Lücken',x0+W/2,y0+H+24,'#ff5a4a',16)}else VT(c,ph2?'':'Ganghöhe < Spurbreite → lückenlos',x0+W/2,y0+H+24,'#3dff95',15);VT(c,'Länge →',x0+W,y0-8,'#9fb4c3',12,'right');VT(c,'Umfang ↑',x0,y0-8,'#9fb4c3',12,'left')}});
/* 6 Toleranzfeld */
vid('sortier',{title:'Toleranzfeld in der Impedanzebene richtig anpassen',dur:42,caps:[[0,'Gutteile und Schlechtteile bilden zwei Gruppen. Ein elliptisches Toleranzfeld trennt sie eindeutig.'],[10,'Die Laboruntersuchung findet weitere Gutteile außerhalb der Ellipse – das Feld muss angepasst werden.'],[20,'Falsch: Das Feld einfach vergrößern. Dann werden auch Schlechtteile als Gutteile sortiert.'],[30,'Richtig: das Toleranzfeld drehen. Gut- und Schlechtteile sind wieder getrennt – am sichersten bei chargenreiner Prüfung.']],
 draw(c,t,w,hh){const ox=w*.5,oy=hh*.5,S=hh*.8;const X=(x,y)=>[ox+x*S,oy-y*S];vaxes(c,w*.08,hh*.9,w*.84,hh*.8,'Real','Imag');const dir=30*D2R,dx=Math.cos(dir),dy=Math.sin(dir),px=-dy,py=dx;
  const pt=(a,p)=>X(a*dx+p*px,a*dy+p*py);const good=[],extra=[],bad=[];for(let i=0;i<14;i++)good.push(pt(-.12+rn(i)*.34,(rn(i+20)-.5)*.1));for(let i=0;i<4;i++)extra.push(pt(.34+i*.07,(rn(i+9)-.5)*.06));for(let i=0;i<6;i++)bad.push(pt(.05+rn(i+40)*.3,.2+rn(i+60)*.1));
  let el={cx:0,cy:0,rx:.22,ry:.14,ang:0};if(t>=20&&t<30){const p=seg01(t,20,24);el={cx:.12*p,cy:.06*p,rx:lerp(.22,.55,p),ry:lerp(.14,.4,p),ang:0}}if(t>=30){const p=seg01(t,30,36);el={cx:lerp(.12,.2*dx,p),cy:lerp(.06,.2*dy,p),rx:lerp(.55,.45,p),ry:lerp(.4,.1,p),ang:lerp(0,dir,p)}}
  const E=X(el.cx,el.cy);c.strokeStyle=t>=20&&t<30?'#ff5a4a':'#6fd2ff';c.lineWidth=3;c.beginPath();c.ellipse(E[0],E[1],el.rx*S,el.ry*S,-el.ang,0,TAU);c.stroke();
  const dot=(p,col,i0)=>{if(t<i0)return;c.fillStyle=col;c.beginPath();c.arc(p[0],p[1],5,0,TAU);c.fill()};good.forEach((p,i)=>dot(p,'#3dff95',i*.3));bad.forEach((p,i)=>dot(p,'#ff5a4a',4+i*.3));extra.forEach((p,i)=>dot(p,'#ffb938',10+i*.5));
  VT(c,'Gutteile',w*.12,hh*.14,'#3dff95',14,'left');VT(c,'Schlechtteile',w*.12,hh*.2,'#ff5a4a',14,'left');VT(c,'zusätzliche Gutteile (Labor)',w*.12,hh*.26,'#ffb938',14,'left');
  if(t>=20&&t<30)VT(c,'✘ Schlechtteile im Toleranzfeld',w*.5,hh*.94,'#ff5a4a',16);if(t>=36)VT(c,'✔ getrennt',w*.5,hh*.94,'#3dff95',16)}});
/* 7 Schichtdicke */
vid('schicht',{title:'Schichtdickenmessung mit dem Abhebeeffekt',dur:42,caps:[[0,'Die Sonde steht auf dem unbeschichteten Grundwerkstoff: Nullpunkt der Justierung.'],[8,'Kalibrierfolien bekannter Dicke simulieren die Schicht. Je dicker die Folie, desto größer der Abstand zum Metall.'],[26,'Jede Dicke liefert eine Bildschirmhöhe – daraus entsteht die Kalibrierkurve.'],[34,'Mit der Kurve wird eine unbekannte Schicht gemessen. Für eine Mindestdicke genügt eine Alarmschwelle.']],
 draw(c,t,w,hh){const th=[0,18,32,48,62,74],hs=[10,30,45,62,77,88];const step=clamp(Math.floor(t/4.5),0,5),cur=t<34?step:3;const px=w*.06,pw=w*.36,gy=hh*.8;rect(c,px,gy,pw,hh*.1,'#3a4a58','#9fb4c3');
  const d=th[cur]/74*hh*.3;if(d>0)rect(c,px,gy-d,pw,d,'rgba(255,184,56,.55)','#ffb938',1);coilBox(c,px+pw/2,gy-d-hh*.07,pw*.35,hh*.1);VT(c,th[cur]+' µm',px+pw/2,gy-hh*.4,'#ffb938',18);VT(c,t<8?'Nullpunkt':t<34?'Folie':'unbekannte Schicht',px+pw/2,gy+hh*.07,'#cfe3f0',13);
  const ox=w*.58,oy=hh*.78,W=w*.36,H=hh*.55;vaxes(c,ox,oy,W,H,'Schichtdicke','Bild­höhe');const P=(a,b)=>[ox+a/80*W,oy-b/100*H];line(c,th.map((a,i)=>P(a,hs[i])).slice(0,cur+1),'#4a6a84',2.4);th.slice(0,cur+1).forEach((a,i)=>{c.fillStyle='#ff5a4a';c.beginPath();c.arc(...P(a,hs[i]),5,0,TAU);c.fill()});
  if(t>=34){line(c,[P(0,53),P(80,53)],'#ffb938',2,[6,4]);VT(c,'Alarmschwelle',ox+W,oy-H*.53-8,'#ffb938',12,'right')}}});
/* 8 Schweißnaht */
vid('naht',{title:'Schweißnahtprüfung: konventioneller und optimierter Sensor',dur:40,caps:[[0,'Der Sensor fährt quer über die Naht: Grundmaterial, Wärmeeinflusszone, Raupe – jedes mit eigener Permeabilität und Leitfähigkeit.'],[12,'Ein konventioneller Tastsensor reagiert auf diese Übergänge und Geometrieänderungen mit starken Störsignalen.'],[22,'Der optimierte Sensor mit entkoppelten, gekreuzten Wicklungen bleibt dort ruhig.'],[30,'Trifft er einen Riss, zeigt nur dieses Gerät ein klares Fehlersignal.']],
 draw(c,t,w,hh){const x0=w*.06,W=w*.88,y0=hh*.1,hs=hh*.14;const zones=[[0,.28,'#3a4a58','Grundmaterial'],[.28,.4,'#5a4a38','WEZ'],[.4,.6,'#8a7a3a','Raupe'],[.6,.72,'#5a4a38','WEZ'],[.72,1,'#3a4a58','Grundmaterial']];zones.forEach(([a,b,col,n])=>{rect(c,x0+a*W,y0,(b-a)*W,hs,col,'#9fb4c3',1);VT(c,n,x0+(a+b)/2*W,y0+hs/2+4,'#e8eef2',11)});
  rect(c,x0+.8*W,y0,3,hs*.6,'#ff5a4a');const p=clamp(t/36,0,1),sx=x0+p*W;rect(c,sx-10,y0-hh*.07,20,hh*.06,'#d98a3d');
  const trace=(oy,col,f,label)=>{line(c,[[x0,oy],[x0+W,oy]],'#34495a',1);const pts=[];for(let x=0;x<=p*W;x+=2){const u=x/W;pts.push([x0+x,oy-f(u,x)])}line(c,pts,col,2);VT(c,label,x0,oy-hh*.15,col,13,'left')};
  const fault=u=>Math.exp(-Math.pow((u-.8)/.012,2));const big=hh*.1;
  trace(hh*.5,'#ffb938',(u,x)=>(t>12?1:.2)*(big*.6*(Math.exp(-Math.pow((u-.28)/.03,2))*.9+Math.exp(-Math.pow((u-.4)/.02,2))-Math.exp(-Math.pow((u-.6)/.02,2))+Math.exp(-Math.pow((u-.72)/.03,2))*.6)+rn(x)*(u>.4&&u<.6?big*.25:big*.05))+fault(u)*big*.7,'konventioneller Tastsensor');
  trace(hh*.82,'#3dff95',(u,x)=>(t>22?1:.2)*rn(x+7)*big*.04+fault(u)*big*1.2,'optimierter Schweißnahtsensor')}});
/* 9 Verifizierung */
vid('verif',{title:'Verifizierung des Prüfsystems in drei Stufen',dur:36,caps:[[0,'Stufe 1: die häufige Funktionsprüfung durch den Anwender, stündlich oder täglich, mit Bezugskörpern.'],[9,'Stufe 2: mindestens einmal jährlich eine ausführliche Funktionsprüfung und Kalibrierung durch den Anwender.'],[18,'Stufe 3: Bestimmung sämtlicher Kennwerte von Gerät, Sensoren und Zubehör, durch Hersteller oder Anwender.'],[26,'Schlägt eine Verifizierung fehl, gelten alle seit der letzten erfolgreichen Prüfung untersuchten Produkte als nicht geprüft.']],
 draw(c,t,w,hh){const bx=w*.08,bw=w*.84,by=[hh*.14,hh*.3,hh*.46],cols=['#6fd2ff','#3dff95','#ffb938'],tx=['Stufe 1 · täglich / stündlich · Anwender · Bezugskörper','Stufe 2 · mindestens jährlich · Anwender · kalibrierte Messgeräte','Stufe 3 · alle Kennwerte · Hersteller / Anwender'],st=[0,9,18];
  for(let i=0;i<3;i++){if(t<st[i])continue;const a=seg01(t,st[i],st[i]+2);c.globalAlpha=a;rect(c,bx,by[i],bw*(.6+.4*(i+1)/3),hh*.11,'rgba(255,255,255,.05)',cols[i],2.5);VT(c,tx[i],bx+14,by[i]+hh*.07,cols[i],14,'left');c.globalAlpha=1}
  if(t>=26){const y=hh*.78,n=14,bad=t>=30;line(c,[[bx,y+hh*.09],[bx+bw,y+hh*.09]],'#4a6a84',1.5);for(let i=0;i<n;i++){const x=bx+i*bw/n,isBad=bad&&i>=5&&i<10;rect(c,x+3,y-hh*.05,bw/n-6,hh*.1,isBad?'rgba(255,80,60,.6)':'rgba(61,255,149,.35)',isBad?'#ff5a4a':'#3dff95',1.5)}VT(c,'✔ Verifizierung',bx+5*bw/n,y-hh*.1,'#3dff95',13,'center');if(bad){VT(c,'✘ fehlgeschlagen',bx+10*bw/n,y-hh*.1,'#ff5a4a',13);VT(c,'gelten als nicht geprüft → Wiederholungsprüfung',bx+7.5*bw/n,y+hh*.17,'#ff5a4a',13)}}}});

/* gemeinsame Bühne: Studio-Hintergrund, Kapitelchips aus den Untertiteln */
['lift','tiefe','hyst','strecke','rotier','sortier','schicht','naht','verif'].forEach(id=>{const V=VIDS[id];if(!V||V._wrapped)return;const d=V.draw;V._wrapped=1;
 V.scenes=V.caps.map(([t0,tx],i)=>({t:t0,n:'Teil '+(i+1)}));
 V.draw=(c,t,w,hh)=>{const sv=T;T=PAL.dark;try{c.save();c.scale(w/VW,hh/VH);studio(c,t);c.restore();c.save();d.call(V,c,t,w,hh);c.restore()}finally{T=sv}}});
