"use strict";
const Q=(q,o,a,e)=>({t:'mc',q,o,a,e}),TF=(q,a,e)=>({t:'tf',q,a,e}),NUM=(q,a,u,e,tol)=>({t:'num',q,a,u,e,tol}),MU=(q,o,a,e)=>({t:'multi',q,o,a,e});

CHAPTERS.push({id:'v1',num:'V1',title:'Physikalische Grundlagen',sub:'Wechselstromkreis, Induktion, Impedanzebene und das Ähnlichkeitsgesetz der Wirbelstromprüfung.',min:75,html:`
<h2>1.1 Wiederholung: Wechselstrom und Induktion</h2>
<p>Im Grundkurs ET1 wurden Spannungsarten, das Induktionsgesetz sowie Erzeugen und Messen von Wirbelströmen behandelt. Hier wird das Wissen für die Stufe 2 vertieft. Zeitverhalten von Spannung und Strom folgen der Sinusfunktion:</p>
<div class="fm">U(t) = U<sub>max</sub> · sin(2π/T · t) &nbsp; · &nbsp; f = 1/T &nbsp; · &nbsp; ω = 2π/T = 2π·f</div>
<p>Für jeden Zeitpunkt gilt das Ohm’sche Gesetz I(t) = U(t)/R. Zum Rechnen nutzt man zeitunabhängige Größen wie die Maximalwerte U<sub>max</sub> und I<sub>max</sub>.</p>
<div data-sim="magnet"></div>
<div data-vid="induktion"></div>
<h2>1.2 Der Stromkreis mit Spule</h2>
<h3>Gleichstrom: Einschaltvorgang</h3>
<p>Die Selbstinduktion wirkt jeder Stromänderung entgegen. Beim Einschalten steigt der Strom daher nicht sprunghaft, sondern allmählich bis I = U<sub>0</sub>/R an. Die Zeitkonstante ist τ = L/R.</p>
<div data-sim="rl_dc"></div>
<h3>Wechselstrom: Phasenverschiebung und Impedanz</h3>
<p>Wegen der „Trägheit“ der Selbstinduktion wächst der Strom langsamer als die Spannung und erreicht sein Maximum später: Strom und Spannung sind um Δt <b>phasenverschoben</b>. Am induktiven Widerstand beträgt die Phasenverschiebung <b>90°</b>, am ohmschen <b>0°</b>. Deshalb dürfen U<sub>R,max</sub> und U<sub>L,max</sub> nicht einfach addiert werden:</p>
<div class="fm">X<sub>L</sub> = 2π·f·L<br>U²<sub>max</sub> = U²<sub>R max</sub> + U²<sub>L max</sub><br>Z² = R² + X<sub>L</sub>² &nbsp;·&nbsp; tan Δφ = X<sub>L</sub>/R &nbsp;·&nbsp; Δφ = 2π/T · Δt</div>
<div data-sim="rl_ac"></div>
<div class="merke">Der Wechselstromwiderstand einer Spule <b>steigt mit der Frequenz</b>. Die grafische Ermittlung von Z (Rechteck-Diagonale aus R und X<sub>L</sub>) ist die Grundlage der Impedanzebene.</div>
<h2>1.3 Induktion und Spulen</h2>
<h3>Selbstinduktion ohne und mit Eisenkern</h3>
<p>Der Strom erzeugt in den eigenen Windungen einen Kraftfluss; dessen Änderung induziert eine Gegenspannung, die der Ursache entgegenwirkt (Lenz). Bei Gleichstrom macht sie sich nur beim Ein-/Ausschalten bemerkbar, bei Wechselstrom ist sie ständig vorhanden und wirkt wie ein <b>scheinbarer Widerstand</b>.</p>
<div class="fm">L = μ<sub>0</sub> · n²/l · A &nbsp;(Luftspule)<br>L = μ<sub>0</sub> · μ<sub>r</sub> · n²/l · A &nbsp;(mit Kern)</div>
<p>L wächst quadratisch mit der Windungszahl n, proportional mit der Fläche A, und steigt, wenn man die Windungen auf kürzerer Länge l zusammendrängt. Ein Eisenkern verstärkt das Feld um den Faktor μ<sub>r</sub>.</p>
<h3>Effektive Permeabilität</h3>
<p>Ein nichtferromagnetischer Leiter (z. B. Aluminiumkern) schwächt das Spulenfeld durch Wirbelströme nach Lenz. Das lässt sich formal der Permeabilität zuordnen: der <b>effektiven Permeabilität μ<sub>eff</sub></b>. Sie ist im Wesentlichen eine Funktion von <b>Frequenz, Leitfähigkeit, relativer Permeabilität und Geometrie</b>.</p>
<div data-sim="coil_l"></div>
<h2>1.4 Impedanzebene: Wirk- und Blindwiderstand</h2>
<p>Ein ohmscher Widerstand wandelt Energie in Wärme um (Verlustleistung) – er ist ein <b>Wirkwiderstand R</b>. Der induktive Widerstand einer verlustarmen Spule bringt keine Leistungsverluste – er ist ein <b>Blindwiderstand</b>.</p>
<div class="merke">Tritt in einem Stromkreis Erwärmung auf, muss dort ein Wirkwiderstand vorhanden sein. <b>Wirbelströme beeinflussen Blind- und Wirkwiderstand</b>: Die Spule mit Aluminiumkern erwärmt sich bei Wechselstrom auch im Kern.</div>
<p>Trägt man Blind- und Wirkwiderstand senkrecht zueinander auf, erhält man die <b>Impedanzebene</b> – in abgewandelter Form die gängige Anzeige für Wirbelstromsignale. Auch Spannung, Strom oder μ<sub>eff</sub> können so dargestellt werden.</p>
<h2>1.5 Grundlagen der Wirbelstromprüfung</h2>
<h3>Messgrößen und Parameter</h3>
<p>Eine Spule über einer Platte aus nichtferromagnetischem Werkstoff erzeugt ein Wechselfeld H. Es induziert im Prüfgegenstand Wirbelströme I<sub>W</sub>, deren Feld H<sub>W</sub> dem Spulenfeld entgegengerichtet ist. Das <b>resultierende Feld</b> beeinflusst Phasenverschiebung Δφ, Stromstärke I und Spannung U an der Spule – abhängig von Stromstärke und Verteilung der Wirbelströme, also von Leitfähigkeit, Ungänzen, Oberfläche und Geometrie.</p>
<table><tr><th>Messgrößen</th><td>Spannung U, Phasenverschiebung Δφ</td></tr><tr><th>Einflussgrößen</th><td>Frequenz f, Strom I, Windungszahl und Spulenform, Abstand Spule–Prüfgegenstand, Leitfähigkeit σ, Permeabilität μ, Geometrie des Werkstücks</td></tr><tr><th>Gesucht</th><td>Ungänzen, Formänderungen, Leitfähigkeits- und Permeabilitätsänderungen</td></tr></table>
<div data-vid="wirbel"></div>
<div data-sim="eddy"></div>
<h3>Das Ähnlichkeitsgesetz</h3>
<p>Für eine Stange (Durchmesser D<sub>P</sub>) in einer Außenspule (D<sub>S</sub>) definiert man den <b>Füllungsgrad η = (D<sub>P</sub>/D<sub>S</sub>)²</b> (bei Außensensoren kleiner als 1). Um von den Spuleneigenschaften unabhängig zu werden, <b>normiert</b> man die Impedanz auf den Blindwiderstand ωL<sub>0</sub> der leeren Spule:</p>
<div class="fm">X̄<sub>L</sub> = ωL / ωL<sub>0</sub> &nbsp;·&nbsp; R̄ = (R − R<sub>0</sub>) / ωL<sub>0</sub><br>k<sub>a</sub> = f / f<sub>g</sub> &nbsp;·&nbsp; f<sub>g</sub> = 5066 / (σ · μ<sub>r</sub> · D<sub>P</sub>²) [Hz]<br><small>σ in MS/m, D<sub>P</sub> in cm; nur bei Vollmaterial (Stange)</small></div>
<p>Beispiel: Kupferdraht (σ = 50,5 MS/m, μ<sub>r</sub> = 1) mit D = 1 cm hat f<sub>g</sub> = 100 Hz; mit D = 2 cm 25 Hz.</p>
<div class="def"><b>Ähnlichkeitsgesetz:</b> Die Feldstärke- und Wirbelstromverteilung in unterschiedlichen Werkstücken ist die gleiche, wenn mit der <b>gleichen Arbeitskonstante</b> geprüft wird. Betragsgleiche Leitfähigkeitsänderungen oder prozentual gleich tiefe Formänderungen liefern dann die gleiche Anzeige.</div>
<div data-sim="norm"></div>
<h3>Verhalten der normierten Darstellung</h3>
<p>Mit zunehmender Frequenz durchläuft die Spannung vom Punkt (0 | 1) ausgehend eine Kurve: Im unteren Bereich wächst der <b>Wirkwiderstand</b> (wachsende Wirbelstromverluste), bei hohen Frequenzen sinkt er wieder, weil die Eindringtiefe abnimmt. Der <b>induktive Widerstand</b> sinkt kontinuierlich, da das Spulenfeld durch die Wirbelströme verdrängt wird (Skineffekt) – beim Zylinder abhängig vom Füllungsgrad.</p>
<h3>Feldverteilung</h3>
<p>Das Feld einer Luftspule macht man mit Eisenfeilspänen sichtbar; bei der Wirbelstromprüfung nicht – Feldverteilungen realer Spulen (Tastsensor, Außendurchlaufsensor) werden berechnet. Der Tastsensor hat ein kleines, oberflächennahes Wechselwirkungsvolumen.</p>
<div data-fc='[["Ähnlichkeitsgesetz","Gleiche Arbeitskonstante k = f/fg ⇒ gleiche Feld- und Wirbelstromverteilung in unterschiedlichen Werkstücken."],["Blindwiderstand","X_L = 2π·f·L – keine Verlustleistung, keine Erwärmung."],["Füllungsgrad (außen)","η = (D_P/D_S)² < 1"],["μ_eff","Zusammenfassung aller Körpereigenschaften, die B beeinflussen: f, σ, μr, Geometrie."]]'></div>`,
quiz:[
Q('Wie ändert sich der Wechselstromwiderstand einer Spule bei steigender Frequenz?',['Er sinkt','Er steigt','Er bleibt gleich','Er schwankt zufällig'],1,'X_L = 2π·f·L steigt proportional mit f.'),
NUM('Eine Spule mit L = 10 mH wird mit f = 1 kHz betrieben. Wie groß ist X_L in Ω?',62.83,'Ω','X_L = 2π · 1000 Hz · 0,01 H ≈ 62,8 Ω.'),
NUM('R = 30 Ω und X_L = 40 Ω. Wie groß ist die Impedanz Z in Ω?',50,'Ω','Z = √(30² + 40²) = 50 Ω.'),
Q('Welche Phasenverschiebung zwischen Strom und Spannung herrscht an einer idealen Induktivität?',['0°','45°','90°','180°'],2,'Am induktiven Widerstand 90°, am ohmschen 0°.'),
Q('Ein Aluminiumkern in einer wechselstromgespeisten Spule …',['erhöht L stark wie Eisen','schwächt durch Wirbelströme das Feld und erwärmt sich','hat keinerlei Einfluss','macht den Strom zu Gleichstrom'],1,'Wirbelströme (Lenz) schwächen das Feld (μ_eff < 1) und verursachen Verluste = zusätzlicher Wirkwiderstand.'),
Q('Wovon hängt die effektive Permeabilität im Wesentlichen ab?',['Nur von der Frequenz','Frequenz, Leitfähigkeit, relative Permeabilität und Geometrie','Nur von der Temperatur','Nur vom Spulenstrom'],1,'So steht es im Skript (1.3.3).'),
NUM('Kupferstange (σ = 50,5 MS/m, μr = 1) mit D = 2 cm: Wie groß ist die Grenzfrequenz f_g in Hz?',25,'Hz','f_g = 5066 / (50,5 · 1 · 4) ≈ 25 Hz.',.03),
Q('Was besagt das Ähnlichkeitsgesetz der Wirbelstromprüfung?',['Gleiche Frequenz → gleiche Anzeige','Gleiche Arbeitskonstante f/f_g → gleiche Feld- und Wirbelstromverteilung','Gleiche Spule → gleiche Eindringtiefe','Gleiche Leitfähigkeit → gleiche Phasenlage'],1,'Nicht die Frequenz, sondern k = f/f_g muss gleich sein.'),
TF('Ein Wirkwiderstand verursacht Erwärmung, ein Blindwiderstand nicht.',true,'Wirkwiderstand = Verlustleistung; Blindwiderstand = keine Verluste.'),
MU('Welche Größen sind Messgrößen der Wirbelstromprüfung (praktisch)?',['Spannung U','Phasenverschiebung Δφ','Frequenz f','Windungszahl'],[0,1],'Frequenz und Windungszahl sind Parameter/Einflussgrößen.'),
Q('Im niedrigen Frequenzbereich der normierten Impedanzkurve wächst …',['der Blindwiderstand','der Wirkwiderstand wegen wachsender Wirbelstromverluste','nichts','die Eindringtiefe'],1,'Der Wirkanteil steigt zunächst, geht bei hohen Frequenzen wieder zurück.')]});

CHAPTERS.push({id:'v2',num:'V2',title:'Gerätetechnik, Anwendungsübersicht',sub:'Nutz-zu-Störsignal, Phasenselektion, Filter, Sensortypen, Schaltungen, Blockschaltbild und Auswertearten.',min:80,html:`
<h2>2.1 Einleitung</h2>
<p>Spulensysteme und Gerätetechnik müssen immer zusammen betrachtet werden: Zuverlässige, reproduzierbare Ergebnisse gibt es nur, wenn Prüfgerät, Spulensystem und Prüfproblem optimal aufeinander abgestimmt sind.</p>
<h2>2.2 Nutz-zu-Störsignalverhältnis</h2>
<p>Je nach Prüfaufgabe sind Einflussgrößen hilfreich (+) oder störend (–):</p>
<div class="tw"><table><tr><th>Prüfaufgabe</th><th>Abstand</th><th>Geometrie</th><th>Permeabilität</th><th>Leitf. partiell</th><th>Leitf. integral</th></tr><tr><td>Sortierprüfung</td><td>–</td><td>–</td><td>+</td><td>+</td><td>–</td></tr><tr><td>Formtreue</td><td>+</td><td>+</td><td>–</td><td>–</td><td>–</td></tr><tr><td>Materialtrennungen</td><td>–</td><td>–</td><td>–</td><td>–</td><td>+</td></tr></table></div>
<div class="merke">Das <b>Nutz-zu-Störsignalverhältnis</b> verbessert man durch fünf Maßnahmen: (1) Sensorgeometrie/Kombination mehrerer Sensoren, (2) Prüffrequenz bzw. Mehrfrequenz, (3) <b>Phasenselektion</b>, (4) <b>Vormagnetisierung</b>, (5) <b>Filtereinstellungen</b>.</div>
<h2>2.3 Unterdrückung von Störgrößen</h2>
<h3>Phasenselektion</h3>
<p>Verschiedene Fehlerarten (auch Nutz- und Störsignal) haben je nach Prüffrequenz unterschiedliche Amplituden und Phasenlagen. Mit Bewertungsmaske und <b>Phasensteller</b> (reproduzierbar in 1°-Schritten von 0–360°) dreht man die Auswertemaske so, dass das Nutzsignal im auswertenden Bereich liegt und das Störsignal unterdrückt wird – z. B. Trennung von Außen- und Innenfehlern bei der Rohrprüfung.</p>
<div data-sim="phase"></div>
<h3>NF-Filter</h3>
<p>Echte Fehler (Materialtrennungen) liefern meist <b>höherfrequente</b> Signale als langsame Leitfähigkeitsänderungen oder Vibrationen. Daher lässt man das demodulierte Signal ein NF-Filter durchlaufen (umschaltbar <b>Hochpass</b> oder <b>Bandpass</b>; Bandbreite an Prüfgeschwindigkeit anpassbar). Welcher Typ optimal ist, muss durch Versuch ermittelt werden.</p>
<div data-sim="filter"></div>
<h3>Magnetische Sättigung</h3>
<p>Bei ferromagnetischen Materialien (Stahlrohre) schwankt μ so stark, dass die Oberflächenfehlerprüfung unmöglich werden kann. Ein <b>Magnetisierungsjoch</b> erzeugt ein starkes Gleichfeld in Rohrlängsachse; die Permeabilität wird auf einen Wert nahe 1 reduziert (→ V3).</p>
<h2>2.4 Spulensysteme</h2>
<p>Drei Haupttypen: <b>Durchlaufspule</b> (Koaxialsensor), <b>Segmentspule</b>, <b>Tastspule</b>. Wähle unten eine Prüfaufgabe (Tab. 2.2) und sieh die passenden Systeme.</p>
<div data-sim="spulen"></div>
<h2>2.7 Aufbau von Wirbelstromprüfgeräten</h2>
<p>Geräte reichen vom vollautomatischen Prüfgerät bis zum batteriebetriebenen Handgerät; man unterscheidet <b>Prüfgeräte</b> (Oberflächen-/QS-Prüfung) und <b>Messgeräte</b> (physikalische/geometrische Eigenschaften). Beispiele: Das <b>Leitfähigkeitsmessgerät</b> arbeitet mit Kompensationsschaltung (Nullinstrument), das <b>Sortiergerät</b> mit Differenzverstärker, Phasensteller, Bandsperre (gegen Netzstörungen), umschaltbarem Bandpass, Demodulator, Toleranzlampe.</p>
<div data-sim="blocks"></div>
<h3>Auswertearten</h3>
<ul><li><b>Amplitudenauswertung</b> (Kreisschwelle/polar): phasenunabhängig, einfachste und sicherste Bewertung, wenn keine Störsignale gleicher Größe und eindeutiger Phase vorliegen.</li><li><b>Phasen-Amplituden-Auswertung</b> (z. B. Sektormarke): bevorzugt Signale mit bestimmter Phasenlage, unterdrückt Störsignale – vorher umfassende Untersuchung von Fehler- und Störsignalen nötig.</li><li><b>Y-Komponenten-Auswertung</b>: Fehler gilt, wenn die Y-Komponente die Schwelle erreicht – bevorzugt, wenn sich Stör- und Fehlersignal klar in der Phase unterscheiden.</li><li><b>Korrelationsauswertung</b>: zwei identische Differenzsysteme im Abstand a; echter Fehler erzeugt zwei Signale im Abstand t = a/v. Funktioniert selbst bei 10 m/s mit starker Vibration.</li></ul>
<div data-sim="korr"></div>`,
quiz:[
MU('Welche Maßnahmen verbessern das Nutz-zu-Störsignalverhältnis?',['Phasenselektion','Vormagnetisierung','Filtereinstellung','Prüfen mit möglichst großem Lift-off'],[0,1,2],'Außerdem Sensorgeometrie und Frequenzwahl.'),
Q('Mit welcher Schrittweite stellt ein modernes Gerät die Phase reproduzierbar ein?',['10°','5°','1°','0,1°'],2,'Phasensteller: 1°-Schritte von 0° bis 360°.'),
Q('Warum eignen sich Hoch-/Bandpassfilter zur Fehlerdetektion?',['Fehlersignale sind niederfrequenter als Störungen','Fehlersignale sind meist höherfrequent als Drift und Vibration','Filter verstärken das Signal','Filter erhöhen die Eindringtiefe'],1,'Langsame Leitfähigkeitsänderungen und Vibrationen sind niederfrequent.'),
Q('Welche Auswerteart ist phasenunabhängig?',['Sektorbewertung','Y-Komponenten-Auswertung','Amplitudenauswertung','Korrelationsauswertung mit Phasenfenster'],2,'Die Amplitudenauswertung (Kreisschwelle) ignoriert die Phasenlage.'),
NUM('Zwei Differenzsysteme haben a = 100 mm Abstand, die Prüfgeschwindigkeit ist 5 m/s. Welche Verzögerung (ms) muss der Korrelator haben?',20,'ms','t = a/v = 0,1 m / 5 m/s = 20 ms.'),
Q('Welcher Sensor hat den Vorteil höherer Prüfempfindlichkeit durch kleineres Wechselwirkungsvolumen und wird für die Naht geschweißter Rohre genutzt?',['Durchlaufsensor','Segmentsensor','Parametrischer Sensor','Gabelspule'],1,'Segmentsensor, senkrecht stehende Feld-/Messspule.'),
Q('Welche Schaltungsart hat die höchste Stabilität der Sekundärspannung (galvanische Trennung)?',['Transformatorisch','Brücke','Parametrisch','Alle gleich'],0,'Nachteil: Raumbedarf und viele Anschlüsse.'),
Q('Welche Wirkung hat die magnetische Sättigung bei Stahlrohren?',['Sie erhöht μ auf Werte über 1000','Sie reduziert μ auf Werte nahe 1','Sie macht das Rohr leitfähiger','Sie ersetzt das Filter'],1,'Permeabilitätsschwankungen als Störquelle werden ausgeschaltet.'),
TF('Die Y-Komponenten-Auswertung wird bevorzugt, wenn sich Stör- und Fehlersignale klar in ihrer Phasenlage unterscheiden.',true,'Ja – das Störsignal liegt dann unterhalb der Y-Schwelle.'),
Q('Wofür wird der Tastsensor im Absolutverfahren typischerweise genutzt?',['Fehlerprüfung','Leitfähigkeit, Ferritgehalt, Schichtdicke','Rohr-Dichtheitsprüfung','Prüfen von Drähten'],1,'Differenzverfahren dagegen für die Fehlerprüfung.'),
Q('Fehlertiefe, die der Durchlaufsensor bei Rohren (Wand 1–5 mm) auffinden kann:',['Außenfehler 10 %, Innenfehler 20 % der Wanddicke','Außen 20 %, Innen 10 %','je 50 %','je 1 µm'],0,'Nahezu unabhängig vom Rohraußendurchmesser.')]});

CHAPTERS.push({id:'v3',num:'V3',title:'Permeabilität',sub:'Hysteresekurve, Permeabilitätsarten, Ferritgehalt, Vormagnetisierung und Unterdrückung von Permeabilitätsstörungen.',min:60,html:`
<h2>3.1 Arten der Permeabilität</h2>
<p>Bei ferromagnetischen Werkstoffen verknüpft die <b>Hysteresekurve</b> die Feldstärke H mit der Flussdichte B. Sättigung tritt bei etwa 20–60 A/cm ein (ca. 1 Tesla und mehr).</p>
<div data-sim="hyst"></div>
<table><tr><th>Art</th><th>Bedeutung</th></tr><tr><td><b>Absolute Permeabilität</b> μ = B/H (Vs/Am)</td><td>nur für magnetische <b>Gleichfelder</b> definiert – für ET ohne Belang</td></tr><tr><td><b>Relative Permeabilität</b> μ<sub>r</sub> = μ/μ<sub>0</sub></td><td>dimensionslos; μ<sub>0</sub> = 4π·10⁻⁷ Vs/Am; „wievielmal größer B als im Vakuum“</td></tr><tr><td><b>Relative Amplitudenpermeabilität</b> μ<sub>amp</sub></td><td>Steigung der Schleife bei <b>kleiner Wechselfelderregung</b>; maßgeblich ohne Gleichfeld-Vormagnetisierung</td></tr><tr><td><b>Überlagerungspermeabilität</b> μ<sub>Δ</sub></td><td>wie μ<sub>amp</sub>, aber mit Gleichfeld-Vormagnetisierung; abhängig vom überlagerten Wechselfeld ΔH – die <b>entscheidende Kenngröße</b> bei der Wirbelstromprüfung</td></tr></table>
<h2>3.2 Permeabilität bei der Wirbelstromprüfung</h2>
<h3>Einfluss auf die Wirbelstromverteilung</h3>
<p>μ<sub>amp</sub> und μ<sub>Δ</sub> bestimmen die Wirbelstromverteilung und damit die effektive Permeabilität – <b>geometrieabhängig</b>: Der volle Einfluss zeigt sich erst beim Vollzylinder; mit abnehmender Wanddicke wird er geringer. In der Praxis (kurze Spulen, Füllfaktor ≪ 1) ist der Einfluss noch kleiner.</p>
<h3>Permeabilität als Messgröße</h3>
<ul><li>Legierungs- und Gefügeunterschiede, Kern-/Randhärte, Einhärtetiefe, Aufkohlung, Randentkohlung, innere Spannungen.</li><li>Absolute Permeabilität meist nicht bestimmbar → nur <b>Relativmessungen</b> bei konstanter Geometrie.</li></ul>
<h3>Ferritgehaltsmessung</h3>
<p>Der starke Einfluss von μ<sub>Δ</sub> ermöglicht die Messung des δ-Ferritgehalts in austenitischen Auftragsschweißungen (Behälter- und Kesselbau). Austenit hat σ ≈ 1–2 MS/m; mit <b>phasenselektiver Auswertung</b> und einer Frequenz, bei der σ- und μ-Änderung <b>90°</b> auseinanderliegen, wird der σ-Einfluss unterdrückt. Der Tastsensor hat gleichsinnig in Reihe geschaltete Erreger- und gegensinnig geschaltete Messspulen; Messbereich &lt; 3 mm.</p>
<div data-sim="ferrit"></div>
<div class="warn">Es gibt kein zerstörendes <i>oder</i> zerstörungsfreies Verfahren zur <b>absoluten</b> Bestimmung des Ferritgehalts. Das System arbeitet mit „<b>Ferritzahlen</b>“: Sekundärstandards (Kalibrierstücke aus Auftragsschweißungen) werden über das Haftkraftverfahren (AWS A4.2-74) an Primärstandards (Weicheisen mit Cu-Überzug) angeschlossen. Wirbelstrom liefert sehr genaue <b>Relativmessungen</b>.</div>
<h3>Permeabilität als Störgröße</h3>
<p>Bei der Fehlerprüfung ferromagnetischer Werkstoffe stört nicht μ selbst, sondern seine <b>Schwankung</b> (Erstarrung, Herstellprozess wie Walzen/Schweißen, Lagerung/Transport z. B. Magnethebekran). Die Störsignale haben keine Vorzugsphase – Signale aus verschiedenen Tiefen haben wegen des Skineffekts unterschiedliche Phasenwinkel – und können gleiche Breite wie echte Fehler haben. Daher <b>keine Trennung per Phasenselektion</b>.</p>
<div class="merke">Jeder Einfluss der Permeabilität ist bei der Wirbelstromfehlerprüfung zu vermeiden. Drei Wege: (1) Prüfung <b>über dem Curiepunkt</b>, (2) <b>magnetische Sättigung</b> mit Gleichfeld, (3) <b>kleinerer Sensor bei höherer Prüffrequenz</b> (z. B. Tastsensor: kleines erfasstes Volumen im Verhältnis zum Fehlervolumen).</div>
<h3>Vormagnetisierung richtig dimensionieren</h3>
<p>Die Gleichfeldstärke muss so hoch sein, dass <b>alle</b> Orte im Zustand der Sättigung sind, damit die Überlagerungspermeabilitäten ausreichend gleich sind. Im Fehlerbereich können vor und hinter Inhomogenitäten nicht voll gesättigte Zonen („<b>magnetische Zwickel</b>“) entstehen. Das Bohrungssignal durchläuft bei niedrigen Feldstärken Minima und Maxima und strebt erst bei hohen Feldstärken einem Grenzwert zu – Längsrisse zeigen den Effekt schwächer, aber mit breitenabhängigem Anstieg.</p>
<div data-sim="premag"></div>
<div class="tip">Wird bei zu niedriger Vormagnetisierung gearbeitet, drohen instabile Arbeitspunkte mit starken Amplituden- und Phasenschwankungen – die Prüfung ist dann nicht reproduzierbar. Der <b>Tastsensor</b> ist durch sein kleines Wechselwirkungsvolumen empfindlicher als der Durchlaufsensor und arbeitet meist ohne Vormagnetisierung.</div>`,
quiz:[
Q('Welche Permeabilität ist bei der ET mit Gleichfeld-Vormagnetisierung die entscheidende Kenngröße?',['Absolute Permeabilität','Anfangspermeabilität','Überlagerungspermeabilität','Vakuumpermeabilität'],2,'Sie gilt für überlagertes Wechselfeld bei Vormagnetisierung.'),
TF('Die absolute Permeabilität B/H ist für die Wirbelstromprüfung nur für Gleichfelder definiert und daher ohne Belang.',true,'Siehe 3.1.1.'),
Q('Wie wird der Einfluss von σ-Änderungen bei der Ferritgehaltsmessung in Austenit unterdrückt?',['Durch Kühlung','Durch phasenselektive Auswertung bei ≈ 90° Winkel zwischen σ- und μ-Änderung','Durch Messen bei Gleichstrom','Durch größere Spulen'],1,'Frequenz so wählen, dass die Richtungen 90° auseinanderliegen.'),
Q('Warum ist die absolute Ferritgehaltsbestimmung nicht möglich?',['Es fehlen Sensoren','Es gibt weder ein zerstörendes noch zerstörungsfreies Absolutverfahren – nur Ferritzahlen über Sekundärstandards','Der Ferrit ist unmagnetisch','Die Frequenz ist zu hoch'],1,'Haftkraftverfahren nach AWS A4.2-74 mit Primärstandards.'),
MU('Welche Maßnahmen unterdrücken den Störeinfluss von Permeabilitätsschwankungen?',['Prüfung über dem Curiepunkt','Magnetische Sättigung','Kleinerer Sensor bei höherer Frequenz','Möglichst niedrige Frequenz'],[0,1,2],'Niedrigere Frequenz verschärft das Problem.'),
Q('Was sind „magnetische Zwickel“?',['Bereiche mit höherer Leitfähigkeit','Nicht voll gesättigte Zonen vor/hinter Materialinhomogenitäten','Spulenwicklungsfehler','Messspulen-Anschlüsse'],1,'Sie beeinflussen das Fehlersignal bei niedriger Magnetisierung entscheidend.'),
Q('Warum lassen sich Permeabilitätsstörsignale kaum per Phasenselektion entfernen?',['Sie sind zu klein','Sie haben keine Vorzugsphase und gleiche Phasenlage wie Fehler möglich','Sie sind immer 90°','Der Filter blockiert sie'],1,'Signale aus verschiedenen Tiefenlagen haben wegen des Skineffekts unterschiedliche Phasenwinkel.'),
Q('Wie hoch muss die Vormagnetisierung sein?',['So niedrig wie möglich','So hoch, dass kleine Schwankungen der Feldstärke keine merklichen Fehlersignaländerungen bewirken','Genau 1 A/cm','Variabel je Rohr'],1,'Sonst instabile Arbeitspunkte, Prüfung nicht reproduzierbar.'),
Q('Welcher Sensor ist wegen des kleineren Verhältnisses von erfasstem Materialvolumen zu Fehlervolumen empfindlicher?',['Durchlaufsensor','Tastsensor','Keiner','Segmentsensor ist stets schlechter'],1,'Der Tastsensor.')]});

CHAPTERS.push({id:'v4',num:'V4',title:'Leitfähigkeit',sub:'Leitfähigkeitsmessung nach dem Wirbelstromverfahren, Eindringtiefe, Justierkörper und Einflussgrößen.',min:70,html:`
<h2>4.1 Einleitung und Grundlagen</h2>
<p>Leitfähigkeitsmessung in der ZfP ist die Messung der elektrischen Leitfähigkeit σ in <b>MS/m</b> oder <b>%IACS</b>. Mit Wirbelstrom ist sie nur an <b>nicht-ferromagnetischen</b> Werkstoffen möglich. Besonders bei aushärtbaren <b>Aluminiumlegierungen</b> hängt σ vom Warmbehandlungszustand ab – und damit von Härte und Festigkeit.</p>
<div class="def"><b>Leitfähigkeit</b> σ = 1/ρ = L/(R·A) in MS/m. <b>%IACS</b>: 0 % = Luft, 100 % = geglühtes Reinkupfer (58 MS/m). Umrechnung: <b>1 MS/m = 1,724 %IACS</b>; 1 %IACS = 0,58 MS/m.</div>
<h3>Standard-Eindringtiefe</h3>
<p>Die Tiefe, bei der die Wirbelstromdichte auf <b>1/e ≈ 37 %</b> des Oberflächenwerts abgesunken ist:</p>
<div class="fm">δ [mm] = 503 / √(f · σ · μ<sub>r</sub>) &nbsp;(f in Hz, σ in MS/m)<br>δ = 660 / √(f · σ · μ<sub>r</sub>) &nbsp;(σ in %IACS)</div>
<div data-vid="skin"></div>
<div data-sim="skin"></div>
<h3>Spulensysteme, Frequenz, Justierkörper</h3>
<ul><li><b>Tastsensor in Absolutschaltung</b> ist üblich; Differenzschaltung nur im <b>Fremdvergleich</b> (nicht im Selbstvergleich). Spulen sind größer als für die Fehlersuche – das gleicht örtliche Schwankungen aus.</li><li><b>Prüffrequenz:</b> Je niedriger die zu untersuchende Leitfähigkeit, desto höher die Frequenz. Einfache Geräte: Festfrequenz 60 oder 100 kHz für σ ≥ 5 MS/m und 500 kHz für σ ≤ 5 MS/m (analoge Anzeige).</li><li><b>Justierkörper:</b> Ohne Justierung kein genauer Wert. Zertifiziert, rückführbar (PTB). Ebene Platten, Ø ≈ 25 mm größer als der Spulendurchmesser, Dicke ≥ <b>3 δ</b>, unbeschichtet, hohe Oberflächengüte.</li></ul>
<div class="warn">Schon Abweichungen von <b>0,2 MS/m</b> können zu Streitfällen zwischen Lieferant und Kunde führen, wenn sie im Grenzbereich der Abnahmevorschrift liegen.</div>
<h2>4.3 Zweck, Messprinzip, Anwendung</h2>
<p>Informationen über den <b>Warmbehandlungszustand</b> (Luft-/Raumfahrt), Homogenitätsüberprüfung, <b>Verwechslungsprüfung</b>, Reinheitsgrad (z. B. Phosphorgehalt in Kupfer), Wiederverwendbarkeit nach Brandschaden. Beim Aufsetzen des Tastsensors ändert sich die Impedanz; verschiedene σ liefern eine <b>Ortskurve der Leitfähigkeiten</b>. In der Praxis nutzt man Leitfähigkeits-Messgeräte, die die Impedanzebene auswerten und σ direkt anzeigen (MS/m oder %IACS).</p>
<div class="tw"><table><tr><th>Werkstoff / Zustand</th><th>σ in MS/m</th><th>%IACS</th></tr><tr><td>Al-99,5</td><td>35</td><td>60</td></tr><tr><td>Al-2014 T3/T4 · T6</td><td>18–20 · 21–24</td><td>31–35 · 37–42</td></tr><tr><td>Al-2024 T3/T4 · T6</td><td>14–19 · 21–24</td><td>28–33 · 36–41</td></tr><tr><td>Al-7075 T6/T651 · T73</td><td>17–20 · 22–25</td><td>30–35 · 38–43</td></tr><tr><td>Al-Li-Legierung</td><td>10,72</td><td>18,5</td></tr><tr><td>Austenit</td><td>1,36</td><td>2,3</td></tr><tr><td>Ti-Legierung</td><td>0,63</td><td>1,1</td></tr></table></div>
<h2>4.6 Einflussgrößen</h2>
<ul><li><b>Bauteildicke &lt; δ:</b> neue Ortskurve → verfälschter Wert; Abhilfe: andere Frequenz oder mehrere Lagen.</li><li><b>Kanten und Krümmungen:</b> konvex/Kante: eingeschränkte Wirbelströme; konkav: mehr. Ohne Korrektur messbar bei konkav r &gt; 500 mm, konvex r &gt; 100 mm (grobe Richtlinie, Niederfrequenz).</li><li><b>Beschichtungen (Lack):</b> Lift-off-Ortskurve; Abhilfe: Justierung mit gleicher Zwischenschicht.</li><li><b>Plattierung</b> (Reinaluminium ≈ 35 MS/m auf Grundwerkstoff 10–28 MS/m): „Mischleitfähigkeit“ → zu hoher Wert; vertrauenswürdig erst nach Entfernen der Schicht.</li><li><b>Temperatur:</b> Tabellen für 20 °C; mittlerer Korrekturwert für Al-Legierungen 0,0016 MS/m je °C (Skript). Gerät, Justierkörper, Sensor, Bauteil auf Umgebungstemperatur.</li></ul>
<div data-sim="condlab"></div>
<h3>Korrelation mit mechanischen Eigenschaften</h3>
<p>Ein Zusammenhang σ ↔ Festigkeit/Härte ist möglich, aber nicht immer eindeutig – ein <b>Versuchsprogramm</b> ist nötig. Bei Al-Legierungen kann es eine <b>Doppeldeutigkeit</b> geben (gleiche σ bei zwei Temperaturen) – eine Härteprüfung (ggf. mobil) oder Anlassfarben lösen sie; zerstörende Prüfung an mitbehandelten Probestäben ist die schlechteste/aufwendigste Option. Bei der Ti-Legierung Ti 8 Mn ergibt sich ein eindeutiger Zusammenhang (σ als alleiniges Verfahren zulässig), bei einer anderen Ti-Legierung nicht.</p>
<div data-sim="ambig"></div>`,
quiz:[
Q('Wie ist die Standard-Eindringtiefe definiert?',['Tiefe, bei der die Wirbelstromdichte auf 50 % gefallen ist','Tiefe, bei der sie auf 1/e ≈ 37 % gefallen ist','Tiefe, bei der sie Null ist','Doppelte Spulenhöhe'],1,'δ ist die Tiefe mit 1/e der Oberflächen-Stromdichte.'),
NUM('Berechne δ in mm für Aluminium (σ = 35 MS/m, μr = 1) bei f = 100 kHz.',0.269,'mm','δ = 503/√(10⁵·35) = 503/1871 ≈ 0,269 mm.',.03),
NUM('Wie viele %IACS entsprechen 35 MS/m?',60.3,'%IACS','35 · 1,724 ≈ 60,3 %IACS.',.02),
Q('Wie ändert sich δ, wenn die Frequenz vervierfacht wird?',['Sie vervierfacht sich','Sie halbiert sich','Sie viertelt sich','Sie bleibt'],1,'δ ∝ 1/√f.'),
Q('Welche Dicke müssen Justierkörper für die Leitfähigkeitsmessung mindestens haben?',['1 δ','2 δ','3 δ','10 δ'],2,'Mindestens die dreifache Standard-Eindringtiefe.'),
Q('Welche Frequenz-Regel gilt für Leitfähigkeitsmessung?',['Je niedriger σ, desto niedriger f','Je niedriger σ, desto höher f','Unabhängig','Immer 50 Hz'],1,'Bei geringen Leitfähigkeiten höhere Frequenz (z. B. 500 kHz bei σ ≤ 5 MS/m).'),
Q('Welchen Effekt hat eine Reinaluminium-Plattierung auf die gemessene Leitfähigkeit?',['Der Wert wird zu niedrig angezeigt','Es wird eine Mischleitfähigkeit – also ein zu hoher Wert – angezeigt','Kein Effekt','Messung unmöglich'],1,'Plattierung ≈ 35 MS/m, Grundwerkstoff 10–28 MS/m.'),
TF('Die Differenzschaltung ist bei der Leitfähigkeitsmessung im Selbstvergleich möglich.',false,'Nur im Fremdvergleich.'),
MU('Welche Größen verfälschen die Leitfähigkeitsmessung?',['Bauteildicke < δ','Lackschicht','Temperatur','Farbe des Lackes'],[0,1,2],'Die Farbe ist ohne Bedeutung, die nichtleitende Schichtdicke wirkt als Abstand.'),
Q('Wie löst man eine Doppeldeutigkeit der Leitfähigkeit bei Al-Legierungen am besten?',['Mit einer ergänzenden Härteprüfung','Durch Frequenzerhöhung','Durch Wiederholen','Gar nicht'],0,'Die Härte unterscheidet sich bei den zwei Temperaturen deutlich.')]});

"use strict";
CHAPTERS.push({id:'v5',num:'V5',title:'Objektkunde – Unregelmäßigkeiten',sub:'Welche Fehler entstehen bei Herstellung, Bearbeitung und Betrieb – und wie sehen sie aus?',min:45,html:`
<p>Bei jeder zerstörungsfreien Prüfung muss klar sein, <b>was gefunden werden soll</b>. Der Fehlerkatalog eines Bauteils bestimmt das geeignete Verfahren. Fehler entstehen in drei Phasen: <b>Herstellung · Bearbeitung · Betrieb</b>.</p>
<h2>5.1 Gussteile</h2>
<p>Aus der erstarrenden Schmelze entstehen: <b>Oxide/Einschlüsse</b> (Sauerstoff), <b>Poren/Porositäten/Mikrolunker</b> (freiwerdendes Gas), <b>Seigerungen</b> (Entmischung), <b>Lunker</b> (Schwindungshohlräume, z. B. an Querschnittsübergängen), <b>Risse</b> – <b>Warmriss</b> im teigigen Zustand, <b>Schrumpfriss</b> im festen Zustand – sowie die <b>Kaltschweißstelle</b>, wenn Gießströme zu kalt oder oxidiert aufeinandertreffen.</p>
<h2>5.2/5.3 Schmieden und Walzen</h2>
<p>Ausgangsmaterial ist der gegossene Block – alle Gussfehler sind noch vorhanden und machen den Verformungsprozess mit: Aus dem ungerichteten Gefüge entsteht eine <b>Faser</b>. Volumenhafte Fehler werden zu <b>flächigen, in Faserrichtung orientierten</b> Fehlern (Schlackenzeilen, Seigerungszeilen, Flocken durch Wasserstoff). Dazu kommen Schmiederisse, Überlappungen/Falten. Bei Walzerzeugnissen nur längsgerichtete Verformung: <b>Schlackenzeilen und Säume</b>, selten Querfehler (Falten, Überwalzungen). <b>Bleche</b> zeigen <b>Dopplungen</b> aus verformten Hohlräumen – nur an Blechkanten mit PT/MT findbar.</p>
<div data-sim="forming"></div>
<h2>5.4 Fehler bei der Bearbeitung</h2>
<p>Meist <b>Spannungen</b>, die an der schwächsten Stelle zum Riss führen:</p>
<ul><li><b>Härten:</b> Abschrecken → <b>Härterisse</b>, gerade oder leicht geschwungen, an Querschnittsänderungen.</li><li><b>Schleifen:</b> thermische Belastung → <b>Schleifrisse</b>: meist viele, nicht lang, quer zur Schleifrichtung. Risse in anderen Richtungen deuten auf zusätzliche Spannungen (Wärmebehandlung).</li><li><b>Galvanisieren/Beizen:</b> Spannungsrisskorrosion; interkristalline Korrosion (netzartiges Bild).</li></ul>
<h2>5.5 Schweißen</h2>
<p>Wie beim Guss: Poren, Einschlüsse, Schlacken; Risse beim Abkühlen/nach Wärmebehandlung (u. a. wasserstoffinduziert, <b>Lamellarrisse</b> am T-Stoß). <b>Endkraterriss</b>: sternförmig am Ende der Schweißung. Mangelhaftes Aufschmelzen → <b>Bindefehler</b> (meist unter der Oberfläche), <b>Wurzelfehler</b>. Risse durch schockartiges Abkühlen (Luftzug!).</p>
<h2>5.6 Fehler im Betrieb</h2>
<p>Immer <b>Risse</b> an Stellen hoher Beanspruchung/Kerbwirkung; Auslöser oft übersehene Fehler aus Herstellung/Bearbeitung. <b>Ermüdungsrisse:</b> dynamische Last, Rastlinien, am Ende Gewaltbruch. <b>Thermoschockrisse:</b> intermittierende thermische Belastung. Bei Revisionen sucht man Risse – mit ganz wenigen Ausnahmen gehen sie von der <b>Oberfläche</b> aus.</p>
<div data-sim="defgame"></div>
<div data-sim="atlas"></div>`,
quiz:[
Q('Was ist ein Warmriss?',['Riss im bereits festen Zustand','Riss im teigigen Zustand des abkühlenden Materials','Riss durch Ermüdung','Riss durch Schleifen'],1,'Im festen Zustand spricht man vom Schrumpfriss.'),
Q('Was wird aus einem kugeligen Gaseinschluss beim Walzen eines Blechs?',['Eine Pore bleibt','Eine Dopplung (flächig)','Ein Querriss','Ein Härteriss'],1,'Durch die starke Verformung in einer Richtung werden Hohlräume flächig.'),
Q('Schleifrisse sind typischerweise …',['wenige, sehr lange, längs','viele, nicht allzu lange, quer zur Schleifrichtung','sternförmig','netzartig'],1,'Entstehen durch hohe thermische Belastung an der Berührlinie.'),
Q('Wo entstehen Endkraterrisse?',['In der Wurzel','Am Ende der Schweißung, oft sternförmig','In der Wärmeeinflusszone seitlich','Nur bei Guss'],1,'Schmelzbad erstarrt plötzlich.'),
Q('Welche Fehlergruppe ist beim Betrieb immer vorhanden?',['Poren','Risse','Lunker','Seigerungen'],1,'Ermüdungs- und Thermoschockrisse – ausgehend von der Oberfläche.'),
TF('Interkristalline Korrosion zeigt ein netzartiges, rissähnliches Bild.',true,'Korngrenzen werden herausgelöst.'),
Q('Woran erkennt man Ermüdungsbrüche auf der Bruchfläche?',['An Rastlinien','An Poren','An Schlackenzeilen','An Farben'],0,'Die Rastlinien markieren den Rissfortschritt.'),
MU('Welche Fehler entstehen bei der Bearbeitung?',['Härterisse','Schleifrisse','Spannungsrisskorrosion','Lunker'],[0,1,2],'Lunker sind Gussfehler.'),
Q('Eine Pilgerfehler bei Rohren ist …',['meist periodisch','immer ein Längsriss','ein Einschluss','Betriebsfehler'],0,'Walzfehler, meist periodisch.')]});

CHAPTERS.push({id:'v6',num:'V6',title:'Prüfung von Oberflächen',sub:'Rissprüfung an Flächen, Bohrungen, Schaufelkanten, Korrosion und Nietnähten – Sonde führen und Signale deuten.',min:90,html:`
<h2>6.1 Einleitung und Schadensarten</h2>
<p>Eine wesentliche Aufgabe der Wirbelstromprüfung ist die Sicherstellung der weiteren Funktionsfähigkeit von Bauteilen bei der <b>Wiederholungsprüfung</b> (Luft-/Raumfahrt). Neuteil-Beispiele: dünnwandige austenitische Rohre, Verdichter-/Turbinenscheiben, Verwechslungsprüfungen.</p>
<table><tr><th>Schaden</th><th>Ort / Eigenschaft</th></tr><tr><td>Risse</td><td>Stellen erhöhter Spannung: Nabenzone (Scheiben), Bolzenbohrungen, Schaufelaufnahme (Kerbwirkung)</td></tr><tr><td>Thermoschockrisse</td><td>Turbinenschaufelkanten – Prüfung beschränkt sich auf die Kanten</td></tr><tr><td>Korrosion</td><td>zwischen Blechüberlappungen (Flugzeugzelle); Abtrag + Aufbeulung; Risse parallel zur Oberfläche nur mit Spezialsensoren</td></tr><tr><td>Schweißnahtrisse</td><td>Naht meist zu uneben für das geforderte Nachweisvermögen → maschinell geschweißt oder nachbearbeitet</td></tr><tr><td>Nietnahtrisse</td><td>von Nietlöchern ausgehend, später verbindend</td></tr></table>
<h2>6.3 Durchführung der Prüfung</h2>
<h3>Flächen</h3>
<p>Naben-Flächen lassen sich mit <b>Einfachdifferenzsensoren</b> prüfen (Risse radial-axial, senkrecht zur Tangentialspannung). Hohes Nachweisvermögen: Frequenzen <b>≥ 1 MHz</b>.</p>
<div class="tip">Typische Handprüfung: Erst <b>Phase</b> so einstellen, dass das Lift-off-Signal horizontal liegt – dann wird der Riss als vertikale Auslenkung erkannt. Höhere Frequenz trennt Riss- und Lift-off-Richtung besser.</div>
<div data-sim="scan"></div>
<h3>Bohrungen</h3>
<p>Risse radial-axial; <b>Rotiersensoren in Differenzschaltung</b>, meist 3000 U/min, oft 0,5 MHz; bei Bohrungen ≤ 3 mm besser <b>2 MHz</b>. Die Prüffrequenz muss <b>deutlich über der Rotierfrequenz</b> liegen.</p>
<div data-sim="bore"></div>
<h3>Schaufelkanten</h3>
<p>Thermoschockrisse etwa senkrecht zur Kante → Differenzsensoren; spezielle <b>Mehrfachdifferenzsensoren</b> oder <b>Ringkernsensoren</b> (klein, nahe am Übergangsradius); 0,5–2,0 MHz. <b>Sulfidation</b> (Nickelsulfid, ferromagnetisch) erzeugt eine erhebliche Phasendrehung und ist daher leicht erkennbar.</p>
<h3>Korrosionsprüfung</h3>
<p>Wanddickenverminderung, evtl. Rissbildung, Schichtkorrosion, <b>Aufbeulung</b> durch Korrosionsprodukte. Dünne Bleche → Eindringtiefe geringfügig größer als die Blechdicke → hohe Empfindlichkeit. <b>Absolutspulen</b> (Differenzspulen ungeeignet), <b>Bildschirmgeräte</b> mit frei wählbarer Frequenz; Bildschirmanordnung: <b>Lift-off links, Korrosion nach oben, Aufbeulung nach rechts</b>. Tiefpass so einstellen, dass das Nutzsignal bei Handführung nicht beeinträchtigt wird.</p>
<ul><li><b>Justierkörper</b> mit gefrästem Rückseiten-Abtrag, pro Blechdicke eigener Körper; Abtrag ab 5 % in 5- oder 10-%-Stufen.</li><li><b>Farbschichten &gt; 50 µm:</b> nichtleitende Folien zur Simulation; &lt; 50 µm vernachlässigbar.</li><li><b>Kalibrierkurve</b> aus 4 gut abgestuften Punkten (Interpolation), dazu eine <b>Referenzkurve</b> mit simulierter Struktur dahinter (ggf. Klebschicht-Folien).</li><li>Aufbeulung: Justierkörper bei aufgesetztem Sensor leicht abheben.</li></ul>
<div data-sim="korr6"></div>
<h3>Nietnähte</h3>
<ul><li><b>Direkt</b> (Nieten entfernt): dynamische Bohrungsprüfung mit Rotiersensoren – größeres Nachweisvermögen, gute Vorschubgeschwindigkeit, Triggerung ordnet Signal dem Rissort zu; <b>Hochpass</b> lässt nur kurze Impulse durch, <b>Bandpass</b> symmetriert, neigt aber zum Nachschwingen.</li><li><b>Justierkörper:</b> Typ 1 (Platte mit Nut in Bohrungen: B 0,15 mm × T 0,5 mm × Länge = Plattendicke), Typ 2 (Oberflächennuten: 0,2 × 1,0 mm).</li><li><b>Indirekt</b> (Nieten bleiben): geringeres Nachweisvermögen, zweite Lage über die Frequenz erreichen; Mehrfachdifferenzsensoren bei gesenkten Köpfen, <b>Linearschwinger</b> ermöglichen Hochpassfilterung, bei überstehenden Köpfen <b>Nietkopfsensoren</b> (Ringferritkern), Niederfrequenz; Stahlnieten in Al leiten das Feld in die Tiefe.</li></ul>
<table><tr><th>Fehlertyp (Nietloch)</th><th>Ursache</th></tr><tr><td>I</td><td>Fertigung: Rest der kleineren Vorbohrung, nur obere Lage (Ansenkung)</td></tr><tr><td>II</td><td>Fertigung: Reste der Vorbohrung über die ganze Blechdicke</td></tr><tr><td>III</td><td>Beim Entfernen der Niete: Ziehriefen axial</td></tr><tr><td>IV</td><td>Unsymmetrisches Schlagen der Niete</td></tr><tr><td>V</td><td>Gemeinsames Aufbohren nicht passender Löcher → Bohrriefen</td></tr></table>`,
quiz:[
Q('Welche Frequenz ist für hohes Fehlernachweisvermögen an Flächen (Nabenzone) nötig?',['50 Hz','1 kHz','≥ 1 MHz','100 Hz'],2,'Frequenzen im Bereich von 1 MHz und höher.'),
Q('Mit welchem System prüft man Bohrungen auf radial-axiale Risse?',['Außendurchlaufsensor','Rotiersensor in Differenzschaltung','Absolutsensor flach','Gabelspule'],1,'Motorischer Rotor, meist 3000 U/min.'),
Q('Bei Bohrungen ≤ 3 mm empfiehlt das Skript eine Prüffrequenz von …',['10 kHz','100 kHz','500 kHz','2 MHz'],3,'Signale sind dann bedeutend störungsfreier darzustellen.'),
Q('Wie ist bei der Korrosionsprüfung die Bildschirmanordnung?',['Lift-off nach rechts, Korrosion unten','Lift-off links, Korrosion nach oben (Y), Aufbeulung nach rechts','Alles horizontal','Beliebig'],1,'Frequenz so wählen, dass diese Darstellung entsteht.'),
Q('Welche Spulenart ist für die Korrosionsprüfung (gleichmäßiger Abtrag) erforderlich?',['Differenzspule','Absolutspule','Gabelspule','Ringkernsensor'],1,'Differenzspulen sind ungeeignet.'),
Q('Ab welcher Farbschichtdicke müssen Folien zur Simulation berücksichtigt werden?',['> 5 µm','> 20 µm','> 50 µm','> 500 µm'],2,'Schichten < 50 µm können unberücksichtigt bleiben.'),
NUM('Wie viele Messpunkte sollte die Kalibrierkurve für die Korrosionsprüfung mindestens haben?',4,'Punkte','4 gut abgestufte Messpunkte mit Interpolationslinie.',0),
Q('Warum ist die Sulfidation an Turbinenschaufeln leicht erkennbar?',['Nickelsulfid ist ferromagnetisch → erhebliche Phasendrehung','Sie ist sichtbar','Sie leitet nicht','Sie ist magnetisch neutral'],0,'Ferromagnetischer Anteil dreht die Phase.'),
TF('Bei Rotorprüfgeräten soll die Prüffrequenz deutlich oberhalb der Rotierfrequenz liegen.',true,'Sonst verschmierte Signale.'),
Q('Welche Wirkung haben Hochpassfilter bei der dynamischen Nietlochprüfung?',['Sie lassen nur kurze Impulse durch','Sie lassen nur Gleichanteile durch','Sie glätten alle Signale','Keine'],0,'Bandpassfilter dagegen neigen zum Nachschwingen.')]});

CHAPTERS.push({id:'v7',num:'V7',title:'Justier- und Vergleichskörper',sub:'Justieren, Testfehler herstellen und passende Körper für Leitfähigkeit, Riss- und Bohrungsprüfung wählen.',min:45,html:`
<h2>7.1 Justierung</h2>
<p>Vor jeder Prüfung, bei Parameteränderungen und in zeitlichen Abständen (z. B. alle 4 h oder bei Schichtwechsel) ist das Prüfsystem zu justieren bzw. die Justierung zu kontrollieren: <b>Sensoreinstellung/Abgleich</b> und <b>Empfindlichkeit</b>.</p>
<div class="def"><b>Justieren</b> heißt, ein Messgerät so einzustellen oder abzugleichen, dass Messabweichungen möglichst klein werden oder Fehlergrenzen nicht überschritten werden. Es erfordert einen <b>Eingriff</b>, der das Gerät (meist bleibend) verändert.</div>
<p>Je nach Norm gibt es verschiedene Namen: Vergleichskörper (Empfindlichkeit), Kalibrierkörper (Gerätebewertung), Kontroll-, Bezugs-, Referenzkörper. Ein <b>Justierkörper</b> hat bestimmte Abmessungen und bekannte physikalische Eigenschaften.</p>
<h2>7.2 Herstellung der Testfehler</h2>
<p>Eingeführt sind <b>Nuten</b> (bevorzugt – Signalform ähnelt Rissen) und <b>Bohrungen</b>; an der Oberfläche oder darunter (2. Lage). Geometrie und Fehlerlage müssen zur Prüfung passen (Tastsensor ↔ Durchlaufsensor); Abmessungen nach der kritischen Fehlergröße.</p>
<table><tr><th>Verfahren</th><th>Möglichkeiten und Grenzen</th></tr><tr><td>Mechanisch (Sägen/Fräsen)</td><td>Kreissäge min. 0,2 mm, Diamantscheibe min. 0,1 mm; Nutgrund hängt vom Scheibendurchmesser ab; keine Nuten in engen Hohlräumen; schwer zerspanbare Werkstoffe (Ni-Basis) schwierig. Bohrungen &lt; 1 mm: Spezialmaschinen, Tiefe bis 7–10 × Ø.</td></tr><tr><td>Elektrochemisch</td><td>Bohrungen bis ca. 0,25 mm, auch tiefer als 7–10 × Ø; <b>keine</b> Nuten/Schlitze (hohle Elektroden).</td></tr><tr><td>Funkenerosiv</td><td>Nutbreiten 20–50 µm, an der BAM 15 µm; Metallfolien (Ta, Stahl, Cu &gt; 10 µm) als Elektrode; beliebige Stelle (Zugänglichkeit). <b>Drahterodieren:</b> Breiten &lt; 100 µm über längere Strecken.</td></tr></table>
<div data-sim="slot"></div>
<h2>7.3 Anwendungsbereiche</h2>
<ul><li><b>Werkstoff:</b> Leitfähigkeit muss dem Bauteil entsprechen; sonst Material <b>niedrigerer</b> Leitfähigkeit, Abweichung höchstens ca. <b>−10 %IACS</b>. Bei ferromagnetischen Werkstoffen muss μr entsprechen; Warmbehandlungszustand beachten.</li><li><b>Leitfähigkeitsmessung:</b> ebene Platten, Ø ≈ 25 mm größer als Spule, Dicke ≥ 3 δ, unbeschichtet, hohe Oberflächengüte, zertifiziert und rückführbar (PTB).</li><li><b>Sortier-/Verwechslungsprüfung:</b> Eigenschaften werden durch zerstörende Prüfung ermittelt und vom Justierkörper „angenommen“ (→ V8).</li><li><b>Rissprüfung:</b> z. B. <b>TP 1 (Rohmann)</b>: Mehrlagenblock aus Austenit, Eisen, Titan, Aluminium; Fehlertiefen 0,2 und 0,5 mm, Durchgangsbohrung mit Nuten 0,5 mm je Lage.</li></ul>
<h3>Justierkörper für Bohrungen</h3>
<table><tr><th>Typ</th><th>Aufbau</th><th>Nut</th></tr><tr><td>1</td><td>Platte mit Bohrungen, axiale Nut</td><td>B 0,15 · T 0,5 mm · Länge = Plattendicke</td></tr><tr><td>2</td><td>Platte mit Oberflächennuten (von der Stirnseite)</td><td>B 0,2 · T 1,0 mm · ganze Länge</td></tr><tr><td>4</td><td>konische Bohrung (viele Rotier-Ø)</td><td>B 0,15 · T 0,3 mm – Verhältnis 2:1 → deutliche Phasendrehung</td></tr><tr><td>5</td><td>Mehrschichtplatte (Risse in 2. Lage)</td><td>B 0,15 · T 0,2–1,0 mm – 1:1 bis 3:1 → unrealistische Phasendrehung</td></tr><tr><td>6</td><td>konisch, zweigeteilt (Brite-Euram)</td><td>Breite:Tiefe besser als 1:10</td></tr></table>
<p>Justierkörper für Halbzeuge (Stangen, Drähte, Rohre) und Schweißnähte → V11 und V13.</p>`,
quiz:[
Q('Wie ist „Justieren“ definiert?',['Nur Kontrollieren eines Geräts','Einstellen/Abgleichen, sodass Messabweichungen möglichst klein werden – ein Eingriff','Reinigen des Sensors','Dokumentieren der Messwerte'],1,'Das Gerät wird meist bleibend verändert.'),
Q('Welches Verfahren eignet sich für Nutbreiten von nur 20–50 µm?',['Sägen','Fräsen','Funkenerosion','Elektrochemisches Bohren'],2,'BAM: sogar 15 µm.'),
Q('Welche Mindestbreite haben Kreissägeblätter für Nuten?',['0,02 mm','0,05 mm','0,2 mm','1 mm'],2,'Diamantscheiben 0,1 mm.'),
TF('Elektrochemisches Bearbeiten eignet sich zur Herstellung von Nuten in Bohrungen.',false,'Die Elektroden sind hohl (Elektrolyt) – nur Bohrungen, keine Nuten.'),
Q('Wenn die Leitfähigkeit des Justierkörpers nicht der des Bauteils entsprechen kann, soll er …',['Beliebig höher sein','Eine niedrigere Leitfähigkeit haben (max. ca. −10 %IACS)','Unmagnetisch sein','Dicker sein'],1,'Abweichung nach unten, höchstens ca. −10 %IACS.'),
NUM('Wie hoch muss die Mindestdicke des Standard-Justierkörpers für die Leitfähigkeitsmessung sein (in δ)?',3,'δ','Mindestens die dreifache Standard-Eindringtiefe.',0),
Q('Warum zeigen Typ-4/Typ-5-Justierkörper eine unrealistische Phasendrehung?',['Zu große Bohrung','Ungünstiges Tiefe-zu-Breite-Verhältnis (2:1 bzw. 1:1–3:1)','Falsches Material','Zu hohe Frequenz'],1,'Der Brite-Euram-Körper erreicht besser als 1:10.'),
Q('Wie oft ist die Justierung zu kontrollieren?',['Nur einmal pro Jahr','Vor jeder Prüfung, bei Parameteränderungen und z. B. alle 4 h bzw. bei Schichtwechsel','Nie','Nur bei Fehlalarm'],1,'Siehe 7.1.')]});

CHAPTERS.push({id:'v8',num:'V8',title:'Gefügeprüfung',sub:'Verwechslungs- und Sortierprüfung nach Werkstoff und Gefüge, Ein- und Mehrfrequenztechnik, Toleranzfelder.',min:60,html:`
<h2>8.1 Einleitung</h2>
<p>Gefügeprüfung ist die Unterscheidung von Teilen aus unterschiedlichen Werkstoffen/Legierungen (<b>Verwechslungsprüfung</b>) und/oder die Trennung nach <b>Gefügezuständen</b> (z. B. Oberflächenhärte). Unterscheidungskriterium: bei ferromagnetischen Werkstoffen die <b>Permeabilität μr</b> (bedingt σ), bei Nichteisenwerkstoffen die <b>Leitfähigkeit σ</b>. Verwechslungen oder falsche Wärmebehandlungen können schwerwiegende Folgen haben (Ausfall, Gefährdung, Rückrufaktionen).</p>
<div class="tw"><table><tr><th>Werkstoffeigenschaft</th><th>σ</th><th>μr</th></tr><tr><td>Chemische Analyse</td><td>++</td><td>++</td></tr><tr><td>Gefüge-/Wärmebehandlungszustände</td><td>–</td><td>++</td></tr><tr><td>Ausscheidungen</td><td>–</td><td>++</td></tr><tr><td>Innere Spannungen</td><td>+</td><td>++</td></tr><tr><td>Deltaferrit in Austenit / Restaustenit</td><td>+</td><td>++</td></tr></table></div>
<h2>8.2 Vorgehen und Grenzen</h2>
<ol><li>Wirbelstromsignale auswerten (Amplitude, Phase als Toleranzbereiche).</li><li>Teilegruppen sortieren (bekannt, geringe Stückzahl).</li><li>Analysewerte ermitteln (chemisch, Spektrometer).</li><li>Sortiergrenzen für die Großzahl festlegen.</li></ol>
<div class="warn">Unterscheidung von Werkstoffen ist nur bei <b>gleichem Prozesszustand</b> sicher. Jedes Gefüge hat eine eigene <b>Magnetisierungskurve</b>. Der <b>Nachweis des Werkstoffgefüges</b> gelingt nur über Schliffbild, Mikrohärte und chemische Analyse – die zerstörende Prüfung ist immer die <b>Referenzprüfung</b> und kann nie ganz entfallen. Deshalb ist <b>chargenreine Prüfung</b> nötig. Störeinflüsse: Schmelzchargen, Geometrie, Wärmebehandlungs-/Kaltverformungsschwankungen, Lageabweichung in der Spule, Temperatur, Restmagnetismus, äußere Felder.</div>
<h2>8.3 Prüfungsdurchführung</h2>
<p>Ferromagnetische Teile lassen sich trennen, wenn ihre <b>Wechselstrompermeabilität</b> unterschiedlich ist. Diese hängt von <b>Feldstärke</b> (Erregerstrom) und <b>Frequenz</b> ab – bei höherer Frequenz wird μ erheblich geringer; niedrige Frequenzen liefern große Eindringtiefe. Man wählt eine Feldstärke, bei der die Kurven weit genug auseinanderliegen.</p>
<div data-sim="muH"></div>
<ul><li><b>Einfrequenztechnik:</b> eine Frequenz, eindimensionale Sortierung (Amplitude); nur sinnvoll bei 2 Zuständen.</li><li><b>Mehrfrequenztechnik:</b> nacheinander mehrere Frequenzen (z. B. 25 Hz … 25 kHz) bei geringen Feldstärken (thermische Stabilität); findet auch <i>unbekannte</i> Zustände; Stand der Technik bei Wärmebehandlungsprüfung. Extremteile werden zerstörend analysiert; innerhalb der Ellipse liegende Teile dürfen freigegeben werden.</li><li><b>Fremdvergleich</b> (zwei Absolutspulen) oder <b>Selbstvergleich</b> (eine Absolutspule, oft Durchlaufsensor): Null mit Gutteil, dann Schlechtteil; je mehr Teile, desto genauer die statistisch berechneten Blenden (Streubereiche).</li><li><b>Frequenzbereich</b> 5 Hz – 250 kHz; Sensor-Ø optimal abstimmen; Führungen aus nichtleitendem Werkstoff.</li></ul>
<h3>Toleranzfelder</h3>
<p>Je Frequenz ein elliptisches Toleranzfeld. Werden durch Laboruntersuchung weitere Gutteile außerhalb gefunden: Das Feld <b>nicht einfach vergrößern</b> (Schlechtteile würden freigegeben), sondern <b>drehen</b> – das gelingt oft, aber nicht immer.</p>
<div data-sim="sort"></div>
<div class="merke">Es gibt <b>keine europäischen Normen</b> zur Wirbelstromprüfung von Materialeigenschaften; Prüftechnik ist zwischen Lieferant und Kunde zu vereinbaren. In den USA: ASTM E 566 (ferromagnetisch) und E 703 (nichtferromagnetisch). Die ET macht nur <b>vergleichende</b> Aussagen (gleich/ungleich) – „es müssen immer Teile geschnitten werden“.</div>`,
quiz:[
Q('Welche Größe ist das Unterscheidungskriterium bei Nichteisenwerkstoffen?',['Permeabilität','Leitfähigkeit','Härte','Dichte'],1,'Bei Ferromagnetika: Permeabilität.'),
TF('Die zerstörende Prüfung kann bei der Wirbelstromgefügeprüfung irgendwann komplett entfallen.',false,'Sie bleibt immer die Referenzprüfung.'),
Q('Warum nutzt man bei der Mehrfrequenztechnik geringe Feldstärken?',['Wegen der besseren thermischen Stabilität','Weil höhere Ströme verboten sind','Weil sonst der Rohling schmilzt','Wegen höherer Leitfähigkeit'],0,'Im Gegensatz zur Hysteresetechnik.'),
Q('Zusätzliche Gutteile liegen außerhalb des Toleranzfeldes. Was ist richtig?',['Feld stark vergrößern','Feld drehen','Gutteile aussondern','Frequenz halbieren'],1,'Vergrößern würde Schlechtteile einschließen.'),
Q('Warum ist eine chargenreine Prüfung nötig?',['Weil Wirbelstrom ähnliche Werkstoffe mit unterschiedlichen Gefügen nicht sicher trennt','Weil Chargen verschiedene Farben haben','Weil sonst Kosten steigen','Weil Chargen unmagnetisch sind'],0,'Siehe 8.2.2.'),
Q('Welche Frequenzen werden typisch bei der Gefügeprüfung verwendet?',['100 Hz – 500 Hz','5 Hz bis 250 kHz','1 MHz – 10 MHz','nur 50 Hz'],1,'Je nach Gerät eine oder mehrere.'),
Q('Welche Normen gibt es zur Sortierung?',['DIN EN ISO 15549 enthält alles','Keine europäischen; in den USA ASTM E 566 / E 703','Nur ISO 17643','DIN 50 Hz'],1,'Vereinbarung zwischen Lieferant und Kunde.'),
Q('Fremdvergleichsverfahren bedeutet …',['Eine Absolutspule und Selbstvergleich','Zwei Absolutspulen, Prüfling gegen Kompensationsteil','Ein Sensor, drei Frequenzen','Zwei Differenzspulen am gleichen Teil'],1,'Zweispulenverfahren.')]});

CHAPTERS.push({id:'v9',num:'V9',title:'Technische Vorschriften in der ZfP',sub:'Regelwerke, Normen, Spezifikationen; ET-Normen (12718, 15549, 15548, 10893, 17643, 17635, 5817, 6520).',min:50,html:`
<h2>9.1 Begriffe</h2>
<table><tr><th>Begriff</th><th>Bedeutung</th></tr><tr><td><b>Regelwerk</b></td><td>Herstellung/Prüfung von Anlagen, meist gesetzlich verbindlich; bindet Normen ein (ASME-Code, KTA, AD-Regelwerk)</td></tr><tr><td><b>Norm</b></td><td>verfahrens-/produktbezogene Vorschrift zum Stand der Technik (DIN, ISO)</td></tr><tr><td><b>Spezifikation</b></td><td>technisches Dokument für kaufmännische/juristische Belange (Abnahme, Zahlung); z. B. Stahl-Eisen-Prüfblätter (SEP)</td></tr><tr><td><b>Richtlinie</b></td><td>nicht bindende Empfehlung – aber verbindlich wie eine Norm, wenn in einer Spezifikation genannt</td></tr><tr><td><b>Verfahrensbeschreibung / Prüfanweisung</b></td><td>abgeleitet aus technischen Vorschriften; betriebsinterne Arbeitsprozesse (→ V10)</td></tr></table>
<h2>9.2 Verfahrensbezogene Normen</h2>
<p>Drei Gruppen: <b>Begriffe</b> (DIN EN ISO 12718, 211 Begriffe in 6 Gruppen), <b>Allgemeine Grundlagen</b> (DIN EN ISO 15549: Einflussgrößen, Prüftechniken, Ausrüstung, Funktionskontrolle, Dokumentation = Prüfanweisung + Prüfbericht – eher Checkliste, keine konkreten Parameter), <b>Ausrüstung</b> (DIN EN ISO 15548-1 Geräte, -2 Sensoren, -3 System).</p>
<h3>Verifizierung (3 Stufen)</h3>
<div data-sim="verif"></div>
<h2>9.3 Produktbezogene Normen</h2>
<p>Vollständig genormt sind nur <b>Rohrprüfung</b> (DIN EN ISO 10893-1 Dichtheit, -2 Unvollkommenheiten) und <b>Schweißnahtprüfung</b>. Unterschiede liegen bei Bezugsbohrung/-nut und Zulässigkeitsgrenze; einheitlich: Kontrolle der Einstellung <b>einmal in 4 Stunden</b>, bei Bedienerwechsel sowie am Anfang und Ende eines Prüfloses.</p>
<h3>Schweißnähte</h3>
<ul><li><b>DIN EN ISO 5817</b> (Al: ISO 10042): Bewertungsgruppen <b>D</b> (niedrige), <b>C</b> (mittlere), <b>B</b> (hohe Beanspruchung) – Grenzwerte sind tatsächliche Fehlergrößen, ZfP ermittelt sie nur bedingt.</li><li><b>DIN EN ISO 17635:</b> Auswahl der ZfP-Verfahren und Bewertung; „Übertragungsfunktion“ von Bewertungsgruppe zu Prüfklasse/Zulässigkeitsgrenze – für ET: Prüfklasse nicht festgelegt, Grenzen zu vereinbaren.</li><li><b>DIN EN ISO 17643</b> (Wirbelstrom): auch durch nichtleitende Beschichtungen bis 2 mm; zweigeteilt (1. Schichtdicke messen, 2. Naht prüfen – zwei Sensortypen); 100 kHz–1 MHz; 1-mm-Nut auf 80 %; 0,5-mm-Nut mind. 50 %; Nachweisgrenze (nicht beschliffen): lineare Oberflächenanzeige 1 mm tief, 5 mm lang; Winkeleinstellung des Sensors zur Naht extrem wichtig.</li><li><b>DIN EN ISO 6520-1:</b> Klassifizierung der Unregelmäßigkeiten in 6 Gruppen mit 3–4-stelliger Nummer (1 Risse, 2 Hohlräume, 3 feste Einschlüsse, 4 Bindefehler, 5 Form-/Maßabweichungen, 6 Sonstige); für ET: <b>1 und 4</b>.</li></ul>
<div data-sim="normen"></div>`,
quiz:[
Q('Welche Norm enthält 211 Begriffe zur Wirbelstromprüfung?',['DIN EN ISO 15549','DIN EN ISO 12718','DIN EN ISO 17643','DIN EN ISO 5817'],1,'In 6 Gruppen, dreisprachig.'),
Q('Was ist Stufe 1 der Verifizierung nach ISO 15548?',['Jährliche Kalibrierung','Häufige allgemeine Funktionsprüfung durch den Anwender (z. B. stündlich/täglich)','Bestimmung aller Kennwerte beim Hersteller','Prüfung des Zertifikats'],1,'Mit Bezugskörpern.'),
Q('Wie oft ist Stufe 2 der Verifizierung durchzuführen?',['Täglich','Mindestens einmal jährlich','Alle 10 Jahre','Nie'],1,'Ausführliche Funktionsprüfung und Kalibrierung durch den Anwender.'),
Q('Was gilt für Produkte, die nach der letzten erfolgreichen Verifizierung geprüft wurden, wenn eine Verifizierung scheitert?',['Sie gelten als geprüft','Sie gelten als nicht geprüft','Sie werden verschrottet','Sie werden doppelt bewertet'],1,'Wiederholungsprüfung oder anderes ZfP-Verfahren.'),
Q('Welche Bewertungsgruppe nach ISO 5817 gilt für hohe Beanspruchung?',['B','C','D','A'],0,'B hoch, C mittel, D niedrig.'),
Q('Nachweisgrenze nach ISO 17643 für „wie geschweißte“ Nähte:',['0,1 mm tief, 1 mm lang','1 mm tief, 5 mm lang','5 mm tief, 1 mm lang','2 mm tief, 2 mm lang'],1,'Weniger als klassische Verfahren.'),
Q('Welche Gruppen der ISO 6520-1 sind für die Wirbelstromprüfung von Belang?',['1 und 4 (Risse; Bindefehler)','2 und 3','5 und 6','Alle'],0,'Risse und Bindefehler.'),
TF('Eine Richtlinie ist rechtlich immer unverbindlich, auch wenn sie in einer Spezifikation genannt wird.',false,'Wenn in der Spezifikation genannt, wie eine Norm zu berücksichtigen.'),
Q('Wie oft ist laut ISO 10893 die Einstellung zu kontrollieren?',['Einmal in 4 Stunden, bei Bedienerwechsel, Los-Anfang/-Ende','Nur am Anfang','Einmal täglich','Alle 100 Rohre'],0,'Einheitlich in 10893-1/-2.')]});

"use strict";
CHAPTERS.push({id:'v10',num:'V10',title:'Erstellen von Prüfanweisungen',sub:'Zertifizierung, Prüfstufen, Verfahrensbeschreibung vs. Prüfanweisung, 13-Punkte-Leitfaden, Formblätter.',min:55,html:`
<h2>10.1 Einführung</h2>
<p>Die <b>Zertifizierung nach DIN EN ISO 9712</b> bestätigt die allgemeine Kompetenz des Prüfers – sie ist <b>keine betriebliche Autorisierung</b>. Diese liegt beim <b>Arbeitgeber</b> (arbeitsplatzbezogene Ausbildung, Sehfähigkeit, Nachweisführung). Wo es auf hohe Auffindwahrscheinlichkeit und Reproduzierbarkeit ankommt oder nach Regelwerken/Normen/Spezifikationen geprüft wird, ist die Prüfung <b>schriftlich</b> festzulegen:</p>
<table><tr><th>ZfP-Verfahrensbeschreibung</th><th>ZfP-Prüfanweisung</th></tr><tr><td>Schriftliche Beschreibung aller wesentlichen Parameter und Vorsichtsmaßnahmen bei der zerstörungsfreien Prüfung von Produkten nach Norm(en), Regelwerk(en), Spezifikation(en).</td><td>Schriftliche Beschreibung der exakten Schritte, die befolgt werden müssen, wenn nach einer Norm, einem Regelwerk, einer Spezifikation oder einer Verfahrensbeschreibung geprüft wird.</td></tr></table>
<h3>Aufgaben der Stufen</h3>
<ul><li><b>Stufe 1:</b> prüft nach <b>Prüfanweisung</b> unter Aufsicht von Stufe 2/3: Geräte einstellen, Prüfungen durchführen, Ergebnisse aufzeichnen und nach schriftlichen Kriterien einordnen, berichten.</li><li><b>Stufe 2:</b> Prüftechnik auswählen, Anwendungsgrenzen festlegen, <b>Regelwerke/Normen/Verfahrensbeschreibungen in Prüfanweisungen umwandeln</b>, Geräte einstellen und verifizieren, Prüfungen durchführen/überwachen, Ergebnisse auslegen und bewerten, Personal anleiten, dokumentieren.</li><li><b>Stufe 3:</b> Kompetenz zur Bewertung und Interpretation auf Basis von Normen; praktische Kenntnisse zur Auswahl von Verfahren, Etablieren von Techniken, Erstellen von Zulassungskriterien; allgemeine Kenntnisse anderer Verfahren.</li></ul>
<div data-vid="pruefkette"></div>
<div class="warn">Ein Stufe-1-Prüfer kann <b>ohne Prüfanweisung nicht tätig werden</b>. Für Stufe 2 ist eine Verfahrensbeschreibung nicht zwingend, aber sinnvoll – sonst wiederholen sich Informationen zu Personal, Geräte-/Sensorkontrollen, Dokumentation, Sicherheit in jeder Prüfanweisung.</div>
<div data-sim="roles"></div>
<h2>10.2 Inhalt einer Prüfanweisung – Leitfaden</h2>
<p>13 Punkte: Titel · Geltungsbereich · mitgeltende Regelwerke (<b>mit Ausgabedatum!</b>) · Zeitpunkt/Ziel · Prüfumfang · Prüfmerkmale/Bewertungskriterien · Prüftechnik und Prüfbedingungen · Durchführung · Maßnahmen bei Abweichungen · Protokollierung · Personal · Weiteres · Formalien. Mit Verfahrensbeschreibung genügt die <b>Kurzform</b> (Formblatt), wie in der Qualifizierungsprüfung.</p>
<ul><li>Normen können <b>zusätzliche Angaben</b> verlangen (z. B. ISO 15549 Abschn. 13.2/13.3). Beispiel ISO 17635: für ET „Prüfklasse nicht festgelegt“ und Zulässigkeitsgrenzen „in einer Vereinbarung festzulegen“ → mit dem Auftraggeber vorab abstimmen und verbindlich eintragen.</li><li><b>Maßnahmen bei Abweichungen</b> sorgfältig beschreiben: Als Prüfaufsicht kann man meist keine weiteren Schritte festlegen. <b>Ausschleifen</b> nur nach Absprache mit dem Auftraggeber (oder bei innerbetrieblichen Anweisungen im Einklang mit technologischen Abläufen). Meist: <b>Unzulässigkeit dokumentieren, Prüfkörper sperren und sichern, übergeordnete Stelle verständigen</b>.</li><li>Prüfbericht in der Prüfanweisung beschreiben, besser ein <b>Muster als Anlage</b>.</li></ul>
<div data-sim="pabuilder"></div>
<h3>Beispiel-Kurzform (Übung 6.1)</h3>
<table><tr><th>Rohr S235JRH</th><td>Prüfung nach ISO 10893-2 / Tabelle 1 E3H · mind. ET1 · 100 % innen & außen, ungeprüfte Enden → 150 mm</td></tr><tr><th>System</th><td>Universalgerät · Differenzschaltung · Außendurchlaufsensor · 3 Bohrungen Ø 1,3 mm · 10 kHz · X/Y-Darstellung · 30 % polar · TP 50 Hz</td></tr><tr><th>Justierung</th><td>Frequenz einstellen · Abgleich auf fehlerfreiem Material · Schwelle: kleinstes Signal löst Alarm aus · Signal senkrecht stellen · Vormagnetisierung mit maximalem Spulenstrom</td></tr><tr><th>Prüfung / Zulässigkeit</th><td>gleichmäßige Geschwindigkeit (max. 150 mm/s) · Signale über der Ansprechschwelle unzulässig · Kontrolle der Justierung am Ende (max. Abweichung 2 dB, 5°)</td></tr></table>`,
quiz:[
Q('Wer autorisiert den Prüfer für eine betriebliche Tätigkeit?',['Die Zertifizierungsstelle','Der Arbeitgeber','Der Kunde','DIN'],1,'Das Zertifikat ist keine betriebliche Autorisierung.'),
Q('Wer darf ohne Prüfanweisung nicht tätig werden?',['Stufe 1','Stufe 2','Stufe 3','Alle'],0,'Stufe 1 arbeitet nach Prüfanweisung.'),
Q('Wer wandelt Normen in Prüfanweisungen um?',['Stufe 1','Stufe 2 (oder 3)','Der Kunde','Der Gerätehersteller'],1,'Stufe 2 c).'),
Q('Warum sollen Normen in der Prüfanweisung mit Ausgabedatum zitiert werden?',['Ohne Datum gilt automatisch die neueste Ausgabe (undatiert)','Datum ist unwichtig','Aus ästhetischen Gründen','Damit die Norm kostenlos ist'],0,'Sonst Änderungen unbemerkt übernommen.'),
Q('Was ist bei „Maßnahmen bei Abweichungen“ meist ausreichend?',['Selbst ausschleifen','Dokumentieren, sperren/sichern, übergeordnete Stelle verständigen','Verschrotten','Ignorieren'],1,'Mechanische Arbeiten nur nach Absprache.'),
NUM('Wie viele Punkte hat der Leitfaden zur Prüfanweisung?',13,'Punkte','13 Unterpunkte.',0),
Q('Wer erstellt die Verfahrensbeschreibung laut Ablaufschema?',['Stufe 1','Stufe 2','Stufe 3','Kunde allein'],2,'Stufe 3 erstellt und genehmigt.'),
TF('Das Zertifikat nach ISO 9712 bestätigt allgemeine Kompetenz, ersetzt aber nicht die betriebliche Autorisierung.',true,'Richtig.')]});

CHAPTERS.push({id:'v11',num:'V11',title:'Rohrprüfung in der Fertigung',sub:'Prüfsysteme, Sensoren, Schaltungen und Signalentstehung, Füllungsgrad, Einstellungen, Frequenz, Störeffekte.',min:100,html:`
<h2>11.1 Einleitung</h2>
<p>Erzeugnisformen (Rohre, Profile, Stangen, Drähte) werden im Produktionsfluss zum <b>Nachweis der Dichtheit</b>, von <b>Fehlern</b>, <b>Materialverwechslungen</b> und zur <b>Dimensionskontrolle</b> geprüft. Die Kopplung erfolgt <b>berührungslos über einen Luftspalt</b>: trocken, gut automatisierbar, hohe Prüfgeschwindigkeit, heißes Prüfgut mit wassergekühlten Spulen möglich. Wegen des Skineffekts ist ET ein <b>Oberflächenverfahren</b>; bei dünnen Wänden im Bereich der Standardeindringtiefe auch Volumenprüfung.</p>
<h2>11.2 Prüfsysteme und Sensoren</h2>
<p>System = Prüfgerät (Generator-, Mess-, Anzeige-, Auswerteeinheit) + Spulensystem + Kabel + mechanische Führung (+ Aufmagnetisierung bei μ-Schwankungen). Messeinheit: Verstärkung, Demodulation, Gleichrichtung → x-y-Anzeige oder y-t. Auswerteeinheit steuert Markierung/Sortierung.</p>
<ul><li><b>Außendurchlaufsensor:</b> Prüfgeschwindigkeit bis 100 m/s; ab ca. 100 mm Außen-Ø wegen großen Wechselwirkungsvolumens eingeschränkt (ISO 10893-2 bis 250 mm); sicher für punktförmige Fehler, Querfehler, kurze Längsfehler; Dichtheitsprüfung; wassergekühlt für Heißprüfung. <b>Nachteile:</b> flach einlaufende Längsfehler ab einer Länge (Wirkbreite) kaum nachweisbar; Endeneffekt.</li><li><b>Innendurchlaufsensor:</b> manuelle Prüfung eingebauter Rohre (Wärmetauscher); langsam; Führungspuffer zentrieren und vermeiden Wackeln; mit Magnetisierung für Duplexstahl.</li><li><b>Tastsensor:</b> empfindlich auf <b>Längsfehler</b>, höhere Fehlerauflösung; rotierend (Umfangsabtastung, Vorschub und Rotation abstimmen); hohe Frequenz, ohne Sättigung; auch als „Schweißnahttaster“.</li><li><b>Segmentsensor (Sattelspule):</b> Schweißnahtprüfung (nicht UP), Dichtheit (rotierend/schraubenförmig), Mehrspulen-Anordnung (z. B. 4 × 100° bei Ø 508 mm); selbstabgleichend; bessere Auflösung als Durchlaufsensor bei großen Ø.</li></ul>
<p>Eine <b>Prüfstrecke</b> für ferromagnetische Werkstoffe enthält Aufmagnetisierung, Prüfspulen (Erreger + Absolut + Mehrfachdifferenz, z. B. „LMD“-Korrelationsspulen) und <b>Entmagnetisierung</b> (Gleich-Gegenfeld oder Wechselfeld).</p>
<h2>11.4 Schaltungen und Signalentstehung</h2>
<p><b>Absolutspulen</b> eignen sich nicht für die Fehlerprüfung (Stör-Nutzabstand 1:3 bzw. 10 dB nicht erreichbar), wohl aber für <b>Materialverwechslung, Dimensionskontrolle, offene Schweißnähte</b>, als Signalgeber/Schlitzwächter. <b>Differenzsysteme</b> (auch Doppel-/Mehrfachdifferenz) werden für Fehler- und Dichtheitsprüfung eingesetzt: kein Wackeleffekt, keine Temperaturdrift, kein Abhebeeffekt.</p>
<div data-vid="diff"></div>
<div data-sim="tube"></div>
<div class="merke">Differenzspulen reagieren auf <b>kurze</b> Fehler, Absolutspulen liefern bei <b>langen</b> Fehlern ein Dauersignal. Absolutspulen brauchen im Gerät einen automatischen Abgleich gegen Temperaturdrift.</div>
<h2>11.5 Mechanische Führung und Füllungsgrad</h2>
<p>Schon geringe Abstandsänderungen verursachen große Empfindlichkeitsschwankungen – eine <b>einwandfreie Führung</b> ist zwingend. Außensensor: η = D<sub>P</sub>²/D<sub>S</sub>²; Innensensor: η = D<sub>S</sub>²/D<sub>P</sub>². Innensensor: η ≥ <b>0,9</b> erwünscht, <b>nicht unter 0,8</b>. Außensensor je nach Prüfgut 0,5–0,95 (bei Verwechslungsprüfung auch deutlich kleiner). <b>Großer η → geringe Wackeleffekte, gleichmäßige und hohe Empfindlichkeit, großer Stör-Nutzabstand.</b></p>
<div data-sim="fill"></div>
<p><b>Segment-/Tastsensor an der Naht:</b> Luftspalt (0,5 mm Taster bei Edelstahl bis 3 mm Segmentsensor bei ferromagnetischen Rohren) und Winkelausrichtung; justierbare Stützrollen, V-Rollen zentrieren. Bei Nahtwanderung Segmentsensoren (±25° vom Zentrum). Tastsensor-Frontfläche an Naht/WEZ/Rohr-Ø anpassen (8 mm für Ø 50 gut, 35 mm für Ø 33 schlecht).</p>
<h2>11.6 Einstellungen</h2>
<ul><li>Parameter: <b>Frequenz, Filter, Phase, Verstärkung</b> – nach Prüfanweisung bzw. Norm.</li><li><b>Filter:</b> in Skala der Produktionsgeschwindigkeit; Faustregel <b>Bandpass Faktor 4: 0,5 × bis 2 × Liniengeschwindigkeit</b>.</li><li><b>Schwelle:</b> Bezugsbohrung/-nut muss die Schwelle sicher überschreiten. Schwelle <b>nicht auf 100 %</b>; empfohlen <b>25–50 %</b> der Skala, Anpassung über die Verstärkung. Ohne Bezugsreflektor: Grundrauschen auf 10 %, Schwelle 30 % → Signal-Rausch ≥ 3:1.</li><li><b>Amplitudenauswertung</b> genügt meist (Schwelle = Kreis).</li><li><b>Frequenz</b> (entscheidend): Skineffekt; hohe Frequenzen (250 kHz–1 MHz) für Oberflächenprüfung; Naht 5–10 kHz für volle Durchdringung; einseitige Anwendung bis ca. 6 mm Wand; Austenit dringt tiefer als Al/Cu; ferromagnetisch ohne Magnetisierung immer nur Oberfläche. <b>Faustregel: mindestens 1 kHz je 1 m/s Vorschub.</b></li></ul>
<div data-sim="setup"></div>
<h2>11.7 Störeffekte</h2>
<table><tr><th>Störung</th><th>Gegenmaßnahme</th></tr><tr><td>Permeabilität</td><td>Gleichstromvormagnetisierung bis Sättigung (μ ≈ 2–4), Rauschen sinkt, Eindringtiefe steigt – nur so Volumenprüfung bis 6 mm</td></tr><tr><td>Leitfähigkeit (z. B. Härte nach Ziehen)</td><td>Glühen vor der Prüfung</td></tr><tr><td>Wackeln</td><td>Führungsmechanik; Differenz-/Mehrfachdifferenzschaltung; großer η</td></tr><tr><td>Rohrendensignal</td><td>Externer Sensor schaltet Auswertung erst nach Einlauf ein → ungeprüftes Ende ≈ Rohr-Ø (ferromagnetisch mehr)</td></tr><tr><td>Geschwindigkeit</td><td>Bandbreite; automatische Filternachführung (Umspulanlagen), gespeicherte Parametersätze bei Produktwechsel</td></tr></table>
<p><b>Spiralvorschub:</b> Ganghöhe muss kleiner als die Abtastbreite sein – sonst keine überlappende Prüfung (→ Einigung auf Mindestfehlerlänge).</p>
<div data-sim="spiral"></div>`,
quiz:[
Q('Warum eignen sich Absolutspulen nicht für die Fehlerprüfung von Erzeugnisformen?',['Sie sind zu teuer','Der Stör-Nutzabstand von 1:3 (10 dB) ist nicht erreichbar','Sie funktionieren nur mit Gleichstrom','Sie brauchen Kühlwasser'],1,'Wackeln, Drift und Abheben stören.'),
Q('Welche Vorteile hat das Differenzsystem?',['Kein Wackeleffekt, keine Temperaturdrift, kein Abhebeeffekt','Es misst lange Fehler besser','Es braucht keine Führung','Es kostet nichts'],0,'Siehe 11.4.5.'),
NUM('Innendurchlaufsensor: D_S = 18 mm, D_P (Innen-Ø Rohr) = 20 mm. η = (D_S/D_P)² = ?',0.81,'','(18/20)² = 0,81 – gerade noch über der Mindestgrenze 0,8.',.01),
Q('Welchen Füllungsgrad erwünscht man bei Innendurchlaufsensoren?',['≥ 0,9, nicht unter 0,8','≥ 0,3','≥ 0,5','Egal'],0,'Großer Füllungsgrad = geringe Wackeleffekte.'),
Q('Wie wählt man die Alarmschwelle?',['100 % der Skala','25 bis 50 % der Skala','0 %','Immer 10 %'],1,'Bei 100 % wäre keine Aussage zur Signalhöhe mehr möglich.'),
NUM('Mindest-Prüffrequenz bei 4 m/s Vorschub (Faustregel 1 kHz je m/s) in kHz?',4,'kHz','Mindestens 1 kHz pro 1 m/s.',0),
Q('Was bewirkt die Gleichstromvormagnetisierung bis zur Sättigung?',['μ wird sehr groß','Rauschen sinkt, μ ≈ 2–4, Eindringtiefe steigt','Leitfähigkeit steigt','Alle Fehler verschwinden'],1,'Nur so ist Volumenprüfung bis ca. 6 mm Wanddicke möglich.'),
Q('Wie groß ist das ungeprüfte Rohrende etwa?',['0,1 mm','Rohrdurchmesser (bei ferromagnetischen oft mehr)','1 m','Wanddicke'],1,'Faustregel aus 11.7.4.'),
Q('Welcher Sensor ist besonders empfindlich auf Längsfehler an Rohren?',['Außendurchlaufsensor','Rotierender Tastsensor','Innendurchlaufsensor','Absolutspule'],1,'Größere Fehlerauflösung als Durchlaufsensoren.'),
TF('Bei Spiralvorschub muss die Ganghöhe kleiner als die Abtastbreite der Spule sein.',true,'Sonst entstehen ungeprüfte Streifen.'),
MU('Was gehört zu einer Prüfstrecke für ferromagnetische Rohre?',['Aufmagnetisierung','Prüfspulen','Entmagnetisierung','Wärmebehandlungsofen'],[0,1,2],'Bei NE-Werkstoffen entfallen Magnetisierung und Entmagnetisierung.')]});

CHAPTERS.push({id:'v12',num:'V12',title:'Schichtdickenmessung',sub:'Magnet- und Wirbelstromverfahren, Justieren, Einflüsse auf die Messung, Sonderfälle und Normen.',min:60,html:`
<h2>12.1 Einleitung und Verfahren</h2>
<p>Beschichtungen (Lack, Email, Galvanik) schützen vor Korrosion, Verschleiß oder dienen der Optik und haben eine <b>Mindestschichtdicke</b>. Typisch 3 µm bis 1500 µm (1 mil = 25,4 µm).</p>
<table><tr><th>Verfahren</th><th>Anwendung</th><th>Technik</th></tr><tr><td><b>Magnetverfahren</b></td><td>nichtferromagnetische Schicht auf <b>ferromagnetischem</b> Grundwerkstoff (Lack, Zn, Cr, Cu …); Schicht darf kein Fe, Fe-Oxid, Ni, Co enthalten</td><td>Spule auf Eisenkern, 100 Hz – 1 kHz; Feld wird vom Stahl verstärkt – Abstand ändert die Messspannung</td></tr><tr><td><b>Wirbelstromverfahren</b></td><td><b>nichtleitende</b> Schicht auf nichtferromagnetischem, aber leitfähigem Grund</td><td>Luftspule, 100 kHz bis MHz; Abstand → Induktivität (<b>Abhebeeffekt als Nutzgröße!</b>)</td></tr></table>
<h2>12.3 Gerätejustierung</h2>
<ul><li><b>Genauigkeit</b> nach Normen: ±10 % bzw. ±1,5 µm bzw. 3 µm (größerer Wert); moderne Geräte teils ±1 %.</li><li><b>Referenzproben:</b> Kalibrierfolien (Kunststoff) – guter Kontakt, nicht zu großer Anpressdruck, regelmäßig erneuern; oder beschichtete Referenzproben.</li><li><b>Spezialgeräte:</b> Werkskalibrierung (≈ 3 % bzw. besser 5 µm); Grenzen beachten (Messfläche, Krümmung, Grundwerkstoffdicke). Sonst <b>Einpunkt</b>-Justierung (Nullpunkt am unbeschichteten Teil, ≈ 2 %) oder <b>Zweipunkt</b> (Null + Folie im erwarteten Bereich, ≈ 1 %). Immer Kontrolle mit mehreren Folien.</li><li><b>Universal-Wirbelstromgeräte:</b> Lift-off in die senkrechte Achse; <b>Mehrpunkt-Kalibrierkurve</b> (z. B. 5 Dicken + Nullmessung), Genauigkeit ≈ 5 % Bildschirmhöhe ≈ 5 µm; Alarmschwelle für die Mindestdicke (Beispiel: 40 µm bei 53 %).</li></ul>
<div data-sim="mcal"></div>
<h2>12.4 Einflüsse auf die Messung</h2>
<ul><li><b>Geometrie:</b> kleine Fläche, Kanten, konvex, zu dünner Grund (muss &gt; 3 δ sein) → mehr „Luftanteil“ → <b>positiver Fehler</b> (zu große Schichtdicke). Konkav, Vertiefungen, Nähe zu senkrechten Blechen → <b>negativer Fehler</b>.</li><li><b>Leitfähigkeit</b> (Wirbelstrom): höhere σ → scheinbar kleinerer Abstand → zu kleine Dicke; Spezialgeräte kompensieren teils; sonst Justierung auf Material gleicher σ.</li><li><b>Permeabilität</b> (Magnetverfahren): Werkseinstellung für unlegierten Stahl; bei höher legiertem Stahl zu große Dicke; Nullmessung am Grundwerkstoff; Restmagnetismus durch Entmagnetisieren beheben.</li><li><b>Rauheit:</b> Schichten werden zu dick gemessen. Mittelwert aus ca. <b>10</b> Messungen unbeschichtet (gleich rau!) und beschichtet; Differenz = mittlere Dicke über den Spitzen.</li><li><b>Temperatur:</b> Drift; Kontrolle mit Folien; hohe Oberflächentemperatur kann den Sensor zerstören.</li><li><b>Äußere Störfelder:</b> Magnetverfahren – niederfrequente (Trafos, Bildschirme); Wirbelstrom – hochfrequente (Sender, Mobiltelefone).</li></ul>
<div data-sim="layer"></div>
<h2>12.5 Sonderfälle und Normen</h2>
<ul><li><b>Kleine Teile (Magnet):</b> „magnetische Masse“ vergrößern (Eisenteil unterlegen).</li><li><b>Dünne Schichten:</b> Mittelwertbildung. <b>Weiche Schichten:</b> harte Schutzfolie bekannter Dicke, abziehen.</li><li><b>Mehrfachschichten:</b> nur Gesamtdicke; Zero-Offset um die gleichmäßige untere Schicht.</li><li>Normen: ISO 2064, 3882, <b>2178</b> (Magnet), <b>2360</b> (Wirbelstrom), 2361 (Nickel).</li></ul>`,
quiz:[
Q('Welches Verfahren eignet sich für Lack auf Stahl?',['Wirbelstromverfahren','Magnetverfahren','Beide gleich','Keines'],1,'Ferromagnetischer Grund, nichtferromagnetische Schicht.'),
Q('Welche Messgröße nutzt das Wirbelstromverfahren?',['Permeabilität','Abhebeeffekt (Lift-off)','Ferritgehalt','Härte'],1,'Schichtdicke = Abstand zwischen Sensor und leitfähigem Grund.'),
Q('Wie wirkt sich eine raue Oberfläche aus?',['Schicht wird zu dünn gemessen','Schicht wird immer zu dick gemessen','Kein Effekt','Gerät schaltet ab'],1,'Mittelwertbildung (ca. 10 Messungen) auch am unbeschichteten, gleichrauen Stück.'),
Q('Welche Messfehler treten an konkaven Flächen auf?',['Positive','Negative (zu geringe Dicke)','Keine','Zufällige'],1,'Der „Luftanteil“ wird verringert.'),
Q('Welche Justierung hat die höchste Genauigkeit?',['Werkseinstellung','Einpunkt','Zweipunkt (≈ 1 %)','Keine'],2,'Einpunkt ca. 2 %, Zweipunkt ca. 1 % vom Messwert.'),
Q('Welche Störfelder beeinflussen das Wirbelstromverfahren besonders?',['Niederfrequente (Trafos)','Hochfrequente (Sender, Mobiltelefone)','Keine','Gleichfelder nur'],1,'Beim Magnetverfahren eher niederfrequente.'),
Q('Wie geht man bei sehr weichen Schichten vor?',['Stark andrücken','Harte Folie bekannter Dicke als Schutz, Foliendicke abziehen','Nicht messen','Frequenz erhöhen'],1,'Sonst zu kleine Dicke bzw. Zerstörung.'),
Q('Welche Norm betrifft die Schichtdickenmessung nach dem Wirbelstromverfahren?',['ISO 2178','ISO 2360','ISO 2361','ISO 12718'],1,'ISO 2178 ist das Magnetverfahren.'),
NUM('Eine 40-µm-Mindestschicht liegt laut Beispiel bei wie viel % Bildschirmhöhe (Alarmschwelle)?',53,'%','Beispiel Abb. 12.4.',.02)]});

CHAPTERS.push({id:'v13',num:'V13',title:'Schweißnahtprüfung',sub:'Manuelle Wirbelstromprüfung von Schweißnähten nach DIN EN ISO 17643: Sensortechnik, Justierung, Beschichtung.',min:55,html:`
<h2>13.1 Grundlagen</h2>
<p>ZfP an Schweißverbindungen erfolgt „normgerecht“: Prüfumfang, Güte (Bewertungsgruppe ISO 5817), Personal, Zeitpunkt, Durchführung/Bewertung nach <b>DIN EN ISO 17635</b>, Umgang mit Befunden und Reparaturen, Protokollierung. Vier wichtige Normen verweisen darauf: DIN EN 13445-5 (Druckbehälter), 13480-5 (Rohrleitungen), 1090-2 (Stahlbau), 15085-5 (Schienenfahrzeuge).</p>
<p>Manuelle Schweißnahtprüfung mit Wirbelstrom ist <b>begrenzt anwendbar</b>. Vorteil: <b>Oberflächenfehler und oberflächennahe rissartige Unregelmäßigkeiten unter Beschichtungen</b> (bis 2 mm). Kleinste nachweisbare Unregelmäßigkeit in ferritischer Naht (geschweißter Zustand): <b>1 mm tief, 5 mm lang</b>.</p>
<h3>Ziele und Einflussgrößen</h3>
<ul><li>schnelle, reproduzierbare Prüfung auf zur Oberfläche offene Werkstofftrennungen,</li><li>oberflächennah ≈ ≤ 3 Standardeindringtiefen,</li><li>Fehler unter bis zu 2 mm nichtmetallischen Schichten (darüber: Empfindlichkeit nachweisen),</li><li>Schweißungen unterschiedlicher Werkstoffe.</li></ul>
<table><tr><th>Bereich</th><th>Dominierende Einflussgrößen</th></tr><tr><td>Grundmaterial 1/2</td><td>μ<sub>rel</sub>, σ (unterschiedliche Werkstoffe)</td></tr><tr><td>Wärmeeinflusszone</td><td>μ<sub>rel</sub>, σ (Gefügeänderung)</td></tr><tr><td>Grenzschicht Grund/Schmelze</td><td>Geometrie, μ<sub>rel</sub>, σ (Mischung)</td></tr><tr><td>Schweißgut, Raupe</td><td>Geometrie, μ<sub>rel</sub>, σ (unebene Oberfläche)</td></tr></table>
<p>Störfaktoren, die zu unterdrücken sind: örtliche μ-/σ-Schwankungen, Nahtgeometrie am Übergang und auf der Raupe, Abhebe- und Wackeleffekte → <b>spezielle Sensortechnik</b>.</p>
<h3>Sensortechnik</h3>
<p>Sensoren mit <b>entkoppelten Wicklungen</b> (gekreuzt): das Feld einer Wicklung induziert in der anderen keine Spannung, solange keine flächige, rissartige Störung vorliegt – wie bei Segmentsensoren. Ausführung als Absolut- oder Differenzschaltung. Angezeigt werden Risse im Schweißgut (längs/quer), in der WEZ und im Grundmaterial, scharfe Einbrandkerben, offene Flankenbindefehler.</p>
<div data-sim="weld"></div>
<h2>13.2 Prüfungsdurchführung nach DIN EN ISO 17643 (auszugsweise)</h2>
<ul><li>Eignungsnachweis am Vergleichskörper mit verschieden tiefen Nuten: Differenz der Anzeigen von <b>1-mm-Nut</b> und <b>0,5-mm-Nut</b> bei gleicher Beschichtungsdicke max. <b>6 dB</b> (100 % → 50 %). Erreicht über die Frequenz; Arbeitsbereich 100 kHz–1 MHz.</li><li>Justierung für ferritische Werkstoffe an einem Körper mit funkenerodierten Nuten <b>0,5 / 1 / 2 mm</b> und simulierter nichtleitender Beschichtung der maximal erwarteten Dicke.</li><li>Eine Beschichtung (max. 2 mm) wird durch <b>Erhöhen der Verstärkung</b> ausgeglichen (Beispiel 0,5 mm: +6 dB) – gleichmäßige Dicke vorausgesetzt, zuerst mit Wirbelstrom kontrollieren.</li><li>Sicht-/Eindringprüfung: Beschichtung muss entfernt werden; MT nur ≤ 50 µm.</li><li>Nicht eindeutig zuzuordnende Anzeigen → anderes ZfP-Verfahren.</li><li>Die <b>Winkeleinstellung des Sensors zur Naht</b> ist extrem wichtig.</li></ul>
<div data-sim="justage"></div>`,
quiz:[
Q('Was ist der Hauptvorteil der Wirbelstrom-Schweißnahtprüfung gegenüber PT/VT?',['Höchste Empfindlichkeit','Prüfung unter nichtleitenden Beschichtungen (bis 2 mm) ohne Entfernen','Keine Geräte nötig','Volumenprüfung'],1,'Bei PT/VT muss die Beschichtung entfernt werden.'),
Q('Welche Frequenz ist nach ISO 17643 zulässig?',['10 kHz – 50 kHz','100 kHz – 1 MHz','5 MHz – 10 MHz','50 Hz'],1,'Arbeitsbereich der Norm.'),
Q('Auf wie viel Bildschirmhöhe stellt man die 1-mm-Nut ein?',['20 %','50 %','80 %','100 %'],2,'Die 0,5-mm-Nut muss mindestens 50 % der 1-mm-Nut erreichen.'),
NUM('Wie viel dB Differenz zwischen 1-mm- und 0,5-mm-Nut sind maximal zulässig?',6,'dB','100 % → 50 % = 6 dB.',0),
Q('Wie gleicht man eine gleichmäßige 0,5-mm-Beschichtung aus?',['Durch Entfernen','Durch Erhöhen der Verstärkung (≈ +6 dB)','Durch Frequenz 0 Hz','Gar nicht'],1,'Voraussetzung: gleichmäßige Beschichtung.'),
Q('Wie ist ein konventioneller Tastsensor an der Schweißnaht problematisch?',['Er ist zu klein','Geometrie und μ/σ-Schwankungen der Raupe erzeugen starke Störsignale','Er funktioniert nur bei Gleichstrom','Er ist zu teuer'],1,'Deshalb entkoppelte Schweißnahtsensoren.'),
Q('Welche Nachweisgrenze gilt „wie geschweißt“?',['1 mm tief, 5 mm lang','0,1 mm, 1 mm','3 mm, 20 mm','keine'],0,'Weniger als bei klassischen Verfahren.'),
MU('Welche Normen verweisen für ZfP an Schweißnähten auf DIN EN ISO 17635?',['DIN EN 13445-5','DIN EN 13480-5','DIN EN 1090-2','DIN EN 10893-1'],[0,1,2],'Auch 15085-5; 10893-1 betrifft Stahlrohre.')]});

