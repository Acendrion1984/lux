"use strict";
/* =====================================================================
   Sprecher-Ton für die animierten Erklärvideos.
   Jede Untertitel-Zeile wird von einer neuronalen deutschen Stimme
   vorgelesen (media/narr/<id>.m4a). Wo das Vorlesen länger dauert als
   die ursprüngliche Szene, wird die Animation zeitlich gedehnt
   (stückweise lineare Zeitachse), damit Bild und Ton synchron bleiben.
   ===================================================================== */
const NARR={"induktion":{"dur":104.76,"map":[[0,0],[5,5],[14.567,9],[23.036,12.5],[31.448,15.5],[41.863,21],[52.309,27],[62.963,33],[72.963,43],[82.504,50],[93.675,57],[104.764,64]],"caps":[0,5,14.567,23.036,31.448,41.863,52.309,62.963,72.963,82.504,93.675]},"wirbel":{"dur":99.04,"map":[[0,0],[5,5],[13.799,10],[22.354,16],[30.593,22],[42.151,30],[50.642,35],[60.855,42],[69.259,49],[79.485,58],[89.916,65],[99.044,72]],"caps":[0,5,13.799,22.354,30.593,42.151,50.642,60.855,69.259,79.485,89.916]},"skin":{"dur":84.97,"map":[[0,0],[4,4],[14.125,10],[25.008,18],[36.56,24],[48.802,31],[58.458,38],[67.144,45],[75.433,51],[84.971,58]],"caps":[0,4,14.125,25.008,36.56,48.802,58.458,67.144,75.433]},"diff":{"dur":68.49,"map":[[0,0],[4,4],[13.953,13],[22.838,19],[29.931,23],[40.931,34],[49.382,40],[57.384,47],[68.488,58]],"caps":[0,4,13.953,22.838,29.931,40.931,49.382,57.384]},"pruefkette":{"dur":56.59,"map":[[0,0],[4,4],[11.349,11],[21.431,18],[31.997,26],[40.639,34],[48.587,40],[56.587,48]],"caps":[0,4,11.349,21.431,31.997,40.639,48.587]},"lift":{"dur":40,"map":[[0,0],[10,10],[20,20],[30,30],[40,40]],"caps":[0,10,20,30]},"tiefe":{"dur":40,"map":[[0,0],[10,10],[20,20],[30,30],[40,40]],"caps":[0,10,20,30]},"hyst":{"dur":46.17,"map":[[0,0],[11,11],[20,20],[28,28],[38,38],[46.171,44]],"caps":[0,11,20,28,38]},"strecke":{"dur":44,"map":[[0,0],[12,12],[22,22],[32,32],[44,44]],"caps":[0,12,22,32]},"rotier":{"dur":41.95,"map":[[0,0],[9.951,8],[19.951,18],[31.951,30],[41.951,40]],"caps":[0,9.951,19.951,31.951]},"sortier":{"dur":42,"map":[[0,0],[10,10],[20,20],[30,30],[42,42]],"caps":[0,10,20,30]},"schicht":{"dur":42.07,"map":[[0,0],[8,8],[26,26],[34,34],[42.073,42]],"caps":[0,8,26,34]},"naht":{"dur":40,"map":[[0,0],[12,12],[22,22],[30,30],[40,40]],"caps":[0,12,22,30]},"verif":{"dur":37.39,"map":[[0,0],[9,9],[18.136,18],[27.387,26],[37.387,36]],"caps":[0,9,18.136,27.387]}};
Object.entries(NARR).forEach(([id,N])=>{const V=VIDS[id];if(!V||V._narr)return;const M=N.map;
 const warp=t=>{for(let i=1;i<M.length;i++)if(t<=M[i][0]||i===M.length-1){const[a,oa]=M[i-1],[b,ob]=M[i];return b>a?oa+(ob-oa)*Math.min(1,Math.max(0,(t-a)/(b-a))):ob}return t};
 const fwd=o=>{for(let i=1;i<M.length;i++)if(o<=M[i][1]||i===M.length-1){const[a,oa]=M[i-1],[b,ob]=M[i];return ob>oa?a+(b-a)*Math.min(1,Math.max(0,(o-oa)/(ob-oa))):a}return o};
 const d0=V.draw;V.draw=(c,t,w,hh)=>d0(c,warp(t),w,hh);
 if(V.scenes)V.scenes=V.scenes.map(s=>Object.assign({},s,{t:Math.round(fwd(s.t)*100)/100}));
 V.caps=V.caps.map((c,i)=>[N.caps[i]!=null?N.caps[i]:fwd(c[0])].concat(c.slice(1)));
 V.dur=N.dur;V.audio='media/narr/'+id+'.m4a';V._narr=true});
