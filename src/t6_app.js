/* ============ DATA WIRING ============ */
STOPS_EXTRA.forEach(s=>STOPS.push(s));STOPS_SOUTH.forEach(s=>STOPS.push(s));TIER1.push(...TIER1_SOUTH);Object.assign(COUNTRIES,COUNTRIES_SOUTH);Object.assign(CLIM,CLIM_SOUTH);Object.assign(LEGS,LEGS_SOUTH);PRESETS.push(...PRESETS_SOUTH);Object.assign(COUNTRY,{CL:"Chile",AR:"Argentina",PY:"Paraguay"});Object.assign(GEO_CC,{"Chile":"CL","Argentina":"AR","Paraguay":"PY"});CC_ORDER.push("CL","AR","PY");
STOPS.forEach(s=>{s.tier=TIER1.includes(s.id)?1:(s.major?2:3);if(s.tier===1)s.major=true;s.clim=CLIM[s.id]||null;
  const fx=HOSTEL_FIX[s.id]||[];const norm=x=>x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");fx.forEach(f=>{const h=s.hostels.find(h=>h.n===f.match)||s.hostels.find(h=>norm(h.n)===norm(f.match))||s.hostels.find(h=>norm(h.n).includes(norm(f.match).slice(0,10)));if(h)Object.assign(h,f.set);});});
Object.entries(LEG_FIX).forEach(([k,v])=>{LEGS[k]=v;});
STOPS.forEach(s=>{const hwS=(typeof HW!=="undefined"&&HW[s.id])||{};s.hostels.forEach(h=>{const w=hwS[h.n];if(w){h.hw=w;if(!h.rating&&w.rating){h.rating=w.rating;h.rsrc="hostelworld";}if(!h.usd&&w.eur){h.usd=Math.round(w.eur*1.15);}h.verify=false;}else if(/^Selina\b/.test(h.n)&&!h.replaced){h.verify=true;h.t=(h.t||"")+" Selina went bankrupt in 2024; this branch may be closed or renamed (Socialtel). Check before relying on it.";}});});
Object.entries(EXTRA_HOSTELS).forEach(([id,hs])=>{const s=STOPS.find(x=>x.id===id);if(s)hs.forEach(h=>{if(!s.hostels.some(x=>x.n===h.n))s.hostels.push(h);});});
const BY=Object.fromEntries(STOPS.map(s=>[s.id,s]));
const WXN={9:"Sep",10:"Oct",11:"Nov",12:"Dec",1:"Jan"};
function wxAt(s,month){const i=WXM.indexOf(month);if(i<0||!s.clim)return null;const c=s.clim,rain=c.rain[i];const r=rain<60?"g":rain<150?"a":"r";return {i,month,hi:c.hi[i],lo:c.lo[i],rain,r,sea:c.sea?c.sea[i]:null,label:r==="g"?"Dry & sunny":r==="a"?"Some showers":"Rainy season",cold:c.hi[i]<16,note:c.n};}
function haversine(a,b){const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLon=(b.lon-a.lon)*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
function leg(aId,bId){
  if(aId===bId) return {m:"stay",h:0,u:0,d:0,n:"",est:false};
  const k1=aId+">"+bId,k2=bId+">"+aId;
  if(LEGS[k1]) return {...LEGS[k1],est:false};
  if(LEGS[k2]) return {...LEGS[k2],est:false,src:LEGS[k2].src?"verified-reverse":undefined};
  const a=BY[aId],b=BY[bId],km=haversine(a,b),cross=a.cc!==b.cc;
  if(km>750||(cross&&km>400)) return {m:"flight",h:Math.round(2+km/650+(cross?2:0)),u:Math.round(60+km*0.09),d:km>3000?1:0,n:"Estimate: no researched route; check Skyscanner / Kiwi.",est:true};
  return {m:"bus",h:Math.round(km/45),u:Math.round(km*0.05),d:km/45>=22?1:0,n:"Estimate from distance; check Busbud / Rome2rio.",est:true};
}
const MODE_ICON={
 bus:'<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="14" rx="3"/><path d="M4 10h16M8 18v2M16 18v2M8 14h.01M16 14h.01"/></svg>',
 flight:'<svg viewBox="0 0 24 24"><path d="M2.5 19l19-7-19-7 4 7-4 7z"/></svg>',
 boat:'<svg viewBox="0 0 24 24"><path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 14l1-5h14l1 5M12 4v5"/></svg>',
 ferry:'<svg viewBox="0 0 24 24"><path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 14l1-5h14l1 5M12 4v5"/></svg>',
 train:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 10h14M9 17l-2 4M15 17l2 4M9 13h.01M15 13h.01"/></svg>',
 "4x4":'<svg viewBox="0 0 24 24"><path d="M3 15l2-6h10l4 6v3H3z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>'
};
const MODE_NAME={bus:"Bus",flight:"Flight",boat:"Boat",ferry:"Ferry",train:"Train","4x4":"4x4"};
const FEAT={pool:"Pool",bar:"Bar",rooftop:"Rooftop",cowork:"Coworking",surf:"Surf",dinner:"Family dinner",breakfast:"Breakfast",kitchen:"Kitchen",hammocks:"Hammocks",beach:"On the beach",tours:"Tour desk",quiet:"Quiet",garden:"Garden",brewery:"Brewery",hottub:"Hot tub",view:"View"};
const FEAT_ICON={pool:'<path d="M3 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M8 13V5a2 2 0 0 1 4 0M14 13V5a2 2 0 0 1 4 0"/>',bar:'<path d="M5 3h14l-7 9v6M9 21h6"/>',rooftop:'<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',cowork:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8"/>',surf:'<path d="M4 20C8 4 16 4 20 4c0 4-4 12-16 16z"/>',dinner:'<path d="M4 3v8a3 3 0 0 0 3 3v7M10 3v8a3 3 0 0 1-3 3M17 3c-2 2-2 6 0 8v10"/>',breakfast:'<path d="M4 8h13v6a5 5 0 0 1-10 0V8zM17 9h2a2 2 0 0 1 0 4h-2"/>',kitchen:'<path d="M4 3v8a3 3 0 0 0 3 3v7M10 3v8"/>',hammocks:'<path d="M3 8c4 6 14 6 18 0M3 8v10M21 8v10"/>',beach:'<circle cx="12" cy="7" r="3"/><path d="M3 20c3-2 6-2 9 0s6 2 9 0"/>',tours:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>',quiet:'<path d="M12 3a9 9 0 1 0 9 9c-4 0-7-3-9-9z"/>',garden:'<path d="M12 21v-8M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 13c4 0 6-3 6-7-4 0-6 3-6 7z"/>',brewery:'<path d="M6 4h9v16H6zM15 8h3a2 2 0 0 1 0 4h-3"/>',hottub:'<path d="M4 12h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4"/>',view:'<path d="M2 20l6-10 4 6 3-4 7 8z"/><circle cx="18" cy="6" r="2"/>'};
const NYE=new Date(2026,11,31);
const fmt=d=>d.toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});
const fmtS=d=>d.toLocaleDateString("en-GB",{day:"numeric",month:"short"});
const addDays=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const pd=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d);};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const short=n=>n.replace(/ \(.*\)| &.*|\s*\(.*/,"");
const gq=q=>"https://www.google.com/search?q="+encodeURIComponent(q);
const mapq=q=>"https://www.google.com/maps/search/"+encodeURIComponent(q);
const isMobile=()=>matchMedia("(max-width:760px)").matches;
const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============ STATE ============ */
let state={start:"2026-09-11",daily:40,route:[],sel:"lima",filterCCs:[],filterTags:[],ddOpen:null,labels:false,insertAt:null,slots:{A:null,B:null},wx:false,wxMonth:10,anchors:[],done:[],lock:false,pcol:false,pw:460,cmpA:null,cmpB:null,picks:{},saved:[],cmpSaved:[]};
try{const s=JSON.parse(localStorage.getItem("andes2copa.v2"));if(s&&Array.isArray(s.route)){delete s.filterCC;delete s.filterTag;delete s.jtab;delete s.jcol;state={...state,...s,insertAt:null,ddOpen:null};for(const k of ["filterCCs","filterTags","anchors","done","saved","cmpSaved"])if(!Array.isArray(state[k]))state[k]=[];if(state.slots&&(state.slots.A||state.slots.B)){["A","B"].forEach(k=>{if(state.slots[k])state.saved.push({id:"s"+Date.now()+k,name:state.slots[k].name||"Route "+k,route:state.slots[k].route,anchors:[],picks:{},created:Date.now()});});state.slots={};}if(!state.picks||typeof state.picks!=="object")state.picks={};}}catch(e){}
(function(){try{const p=new URLSearchParams(location.search).get("r");if(!p)return;const dec=decodeRoute(p);if(dec){state.route=dec.route;if(dec.start)state.start=dec.start;if(dec.daily)state.daily=dec.daily;if(dec.anchors)state.anchors=dec.anchors;if(dec.picks)state.picks=dec.picks;if(dec.name)state.sharedName=dec.name;}}catch(e){}})();
function encodeRoute(o){o=o||{};const route=o.route||state.route,anchors=o.anchors||state.anchors,picks=o.picks||state.picks;return btoa(unescape(encodeURIComponent(JSON.stringify({s:state.start,b:state.daily,r:route.map(r=>[r.id,r.days]),a:anchors,p:picks,n:o.name||""})))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function decodeRoute(p){try{const o=JSON.parse(decodeURIComponent(escape(atob(p.replace(/-/g,"+").replace(/_/g,"/")))));return {route:o.r.filter(([id])=>BY[id]).map(([id,days])=>({id,days:+days||BY[id].days})),start:o.s,daily:o.b,anchors:Array.isArray(o.a)?o.a.filter(a=>BY[a.id]):[],picks:o.p&&typeof o.p==="object"?o.p:{},name:o.n||""};}catch(e){return null;}}
function save(){try{const {ddOpen,insertAt,...rest}=state;localStorage.setItem("andes2copa.v2",JSON.stringify(rest));}catch(e){}}
const startDate=()=>pd(state.start);
const availDays=()=>Math.round((NYE-startDate())/864e5)+1;
/* undo history */
const HIST=[];
function snap(){HIST.push(JSON.stringify({route:state.route,anchors:state.anchors}));if(HIST.length>40)HIST.shift();}
function undoLast(){const h=HIST.pop();if(!h)return;const o=JSON.parse(h);state.route=o.route;state.anchors=o.anchors;commit();}

/* ============ SCHEDULE ============ */
function schedule(route){
  route=route||state.route;
  const seq=[...route.map(r=>({...r})),{id:"rio",days:0,locked:true}];
  let cur=startDate(),cost=0,nights=0,legDays=0,hostel=0,flights=0,busH=0,km=0;
  const rows=[];
  seq.forEach((r,i)=>{
    let lg=null;
    if(i>0){lg=leg(seq[i-1].id,r.id);cur=addDays(cur,lg.d);cost+=lg.u;legDays+=lg.d;if(lg.m==="flight")flights++;else busH+=lg.h;km+=Math.round(haversine(BY[seq[i-1].id],BY[r.id]));}
    const from=cur;
    if(r.locked){r.days=Math.round((NYE-from)/864e5)+1;}
    const to=addDays(from,r.days-1);
    hostel+=r.days*BY[r.id].dorm;nights+=r.days;
    rows.push({...r,from,to,leg:lg,i});
    cur=addDays(to,1);
  });
  const rio=rows[rows.length-1];
  const total=cost+hostel+availDays()*state.daily;
  const ccs=[...new Set(seq.map(r=>BY[r.id].cc))];
  const anchors=state.anchors.map(a=>{const d=pd(a.date);const hits=rows.filter(r=>r.id===a.id);const ok=hits.some(r=>d>=r.from&&d<=r.to);return {...a,d,ok,onRoute:hits.length>0,when:hits.length?hits.map(r=>fmtS(r.from)+(r.days>1?"–"+fmtS(r.to):"")).join(", "):null};});
  return {rows,transport:cost,nights,legDays,hostel,rioDays:rio.days,over:rio.days<1?1-rio.days:0,flights,busH,km,total,ccs,anchors,missed:anchors.filter(a=>!a.ok)};
}
function eventsFor(s){return EVENTS.filter(e=>e.stop===s.id||e.stop==="*"+s.cc).map(e=>({...e,f:pd(e.from),t:pd(e.to)}));}
function eventsHit(s,row){if(!row)return [];return eventsFor(s).filter(e=>e.f<=row.to&&e.t>=row.from);}

/* ============ MAP ============ */
const W=GEO.W,H=GEO.H,[LON0,LON1,LAT0,LAT1]=GEO.bounds;
const px=lon=>(lon-LON0)/(LON1-LON0)*W, py=lat=>(LAT0-lat)/(LAT0-LAT1)*H;
const svg=document.getElementById("map");
const NS="http://www.w3.org/2000/svg",XL="http://www.w3.org/1999/xlink";
const el=(t,a={})=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e;};
let vb={x:0,y:0,w:W,h:H},K=1;
const gDefs=el("defs"),gGrat=el("g"),gGlow=el("g"),gCountries=el("g"),gLabels=el("g"),gRoute=el("g"),gPins=el("g"),gWalker=el("g");
svg.append(gDefs,gGrat,gGlow,gCountries,gLabels,gRoute,gPins,gWalker);
for(let lon=-90;lon<=-30;lon+=10){gGrat.append(el("path",{d:`M${px(lon)} 0 V${H}`,class:"grat"}));}
for(let lat=10;lat>=-30;lat-=10){gGrat.append(el("path",{d:`M0 ${py(lat)} H${W}`,class:"grat"}));}
for(const [n,d] of Object.entries(GEO.paths)){
  const cc=GEO_CC[n]||"";
  if(cc)gGlow.append(el("path",{d,class:"coast-glow"}));
  const p=el("path",{d,class:"country "+cc});p.dataset.name=n;p.dataset.cc=cc;gCountries.append(p);
  if(cc){p.addEventListener("click",()=>{toggleCC(cc);setTab("explore");});p.style.cursor="pointer";}
}
const CLAB={PE:[-75.2,-10.8],EC:[-78.8,-1.9],CO:[-73.2,3.2],BR:[-52,-11],BO:[-64.8,-17.5],GY:[-58.9,5.1],SR:[-55.9,4.3],GF:[-53.2,3.6],CL:[-71.2,-36.5],AR:[-65.5,-36],PY:[-58.5,-23.4]};
for(const [cc,[lo,la]] of Object.entries(CLAB)){const t=el("text",{x:px(lo),y:py(la),class:"clabel","text-anchor":"middle"});t.textContent=COUNTRY[cc];gLabels.append(t);}
const pinEls={};
[...STOPS.filter(s=>s.tier===3),...STOPS.filter(s=>s.tier===2),...STOPS.filter(s=>s.tier===1)].forEach(s=>{
  const g=el("g",{class:"pin t"+s.tier+(s.major?" major":"")});g.dataset.id=s.id;
  const R=s.tier===1?14:11;s.R=R;
  const cp=el("clipPath",{id:"cp-"+s.id});cp.append(el("circle",{r:R}));gDefs.append(cp);
  const wxr=el("circle",{class:"wxr",r:R+4.5});const nearr=el("circle",{class:"nearr",r:R+7});
  const pulse=el("circle",{class:"pulse",r:R+2});const dot=el("circle",{class:"dot",r:5});
  const pg=el("g",{class:"photo-g"});const ring=el("circle",{class:"ring",r:R+1.5});
  const img=el("image",{x:-R,y:-R,width:2*R,height:2*R,preserveAspectRatio:"xMidYMid slice","clip-path":"url(#cp-"+s.id+")"});img.setAttribute("href",IMGT[s.id]||IMG[s.id]);img.setAttributeNS(XL,"xlink:href",IMGT[s.id]||IMG[s.id]);
  const ring2=el("circle",{class:"ring2",r:R+1.5});pg.append(ring,img,ring2);
  const badge=el("circle",{class:"badge",cx:R-1,cy:-(R-1),r:7});const bt=el("text",{class:"badge-t",x:R-1,y:-(R-1)});
  const star=el("path",{class:"star",d:"M0 -5.5l1.6 3.4 3.7.4-2.8 2.6.8 3.7L0 2.8l-3.3 1.8.8-3.7-2.8-2.6 3.7-.4z",transform:`translate(${-(R-1)},${-(R-1)}) scale(1.1)`});
  const lbl=el("text",{class:"lbl",y:R+12});lbl.textContent=short(s.name);const dl=el("text",{class:"daylbl",y:-(R+9)});
  g.append(nearr,wxr,pulse,dot,pg,badge,bt,star,lbl,dl);
  g.addEventListener("click",e=>{e.stopPropagation();select(s.id);});
  g.addEventListener("dblclick",e=>{e.stopPropagation();addStop(s.id);});
  g.addEventListener("mouseenter",e=>showTip(e,s));g.addEventListener("mousemove",e=>moveTip(e));g.addEventListener("mouseleave",hideTip);
  gPins.append(g);pinEls[s.id]=g;
});
const tip=document.getElementById("tip"),mapwrap=document.getElementById("mapwrap");
function showTip(e,s){if(isMobile())return;const on=state.route.some(r=>r.id===s.id)||s.id==="rio";tip.className="tip";tip.innerHTML=`<img src="${IMGM[s.id]||IMG[s.id]}" alt=""><div class="tt"><b>${esc(s.name)}</b><small>${esc(s.tag)}</small><span class="m">${COUNTRY[s.cc]} · ${s.days} d suggested${on?" · on your route":""}${s.tier===1?" · ★ top":""}</span></div>`;moveTip(e);tip.classList.add("show");}
function showLegTip(e,a,b,lg){if(isMobile())return;tip.className="tip leg";tip.innerHTML=`<div class="tt"><span class="mode">${MODE_ICON[lg.m]||""}${MODE_NAME[lg.m]||lg.m}${lg.est?" · estimate":lg.src?" · researched":""}</span><b>${esc(short(a.name))} → ${esc(short(b.name))}</b><small>${lg.h>=24?Math.round(lg.h/24*10)/10+" days":lg.h+" h"} · ${lg.u?"~$"+lg.u:"included"}${lg.d?" · +"+lg.d+" travel day":""}</small>${lg.n?`<small>${esc(lg.n)}</small>`:""}</div>`;moveTip(e);tip.classList.add("show");}
function moveTip(e){const r=mapwrap.getBoundingClientRect();tip.style.left=(e.clientX-r.left)+"px";tip.style.top=(e.clientY-r.top)+"px";}
function hideTip(){tip.classList.remove("show");}
svg.addEventListener("pointerleave",hideTip);document.addEventListener("pointerdown",hideTip,true);document.getElementById("right").addEventListener("pointerenter",hideTip);

let lastK=-1,lastScale=-1,vbRaf=0;
function setVB(){const rr=svg.getBoundingClientRect();if(!rr.width||!rr.height)return;vb.h=vb.w*rr.height/rr.width;if(![vb.x,vb.y,vb.w,vb.h].every(Number.isFinite)){vb={x:0,y:0,w:W,h:W*rr.height/rr.width};}svg.setAttribute("viewBox",`${vb.x} ${vb.y} ${vb.w} ${vb.h}`);K=vb.w/W;
  const scale=isMobile()?1.35:Math.max(.7,Math.min(1.0,rr.width/1000));
  if(Math.abs(K-lastK)>0.004||scale!==lastScale){lastK=K;lastScale=scale;const k=K*scale*(K<1?Math.pow(K,-0.22):1);
    STOPS.forEach(s=>{pinEls[s.id].setAttribute("transform",`translate(${px(s.lon)},${py(s.lat)}) scale(${k})`);});
    gLabels.querySelectorAll("text").forEach(t=>t.setAttribute("font-size",13*k));
    const z=K>0.62?"z-far":K>0.32?"z-mid":"z-near";if(!svg.classList.contains(z)){svg.classList.remove("z-far","z-mid","z-near");svg.classList.add(z);}
    gWalker.querySelectorAll(".walker").forEach(w=>w.setAttribute("r",4.5*K));}
}
function setVBsoon(){if(vbRaf)return;vbRaf=requestAnimationFrame(()=>{vbRaf=0;setVB();});}
function monthFor(id,S){S=S||schedule();const row=S.rows.find(r=>r.id===id);return row?row.from.getMonth()+1:state.wxMonth;}
function nearbyOf(id){const s=BY[id];return STOPS.filter(o=>o.id!==id&&o.id!=="galapagos").map(o=>({o,lg:leg(id,o.id),km:haversine(s,o)})).filter(x=>x.km<450&&x.lg.h<=4&&x.lg.m!=="flight").sort((a,b)=>a.lg.h-b.lg.h).slice(0,6);}
let dayCursor=null; // {i,date}
function drawRoute(){
  gRoute.innerHTML="";const S=schedule();
  const seq=[...state.route.map(r=>r.id),"rio"];const inRoute=new Set(seq);let all="";const cur=dayCursor?dayCursor.i:null;
  for(let i=1;i<seq.length;i++){
    const a=BY[seq[i-1]],b=BY[seq[i]];if(a===b)continue;
    const lg=leg(a.id,b.id);const x1=px(a.lon),y1=py(a.lat),x2=px(b.lon),y2=py(b.lat);let d;
    if(lg.m==="flight"){const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1;const cx=mx-dy*0.18,cy=my+dx*0.18;d=`M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}`;}else d=`M${x1} ${y1} L${x2} ${y2}`;
    all+=d+" ";
    const hit=el("path",{d,class:"route-hit"});hit.addEventListener("mouseenter",e=>showLegTip(e,a,b,lg));hit.addEventListener("mousemove",moveTip);hit.addEventListener("mouseleave",hideTip);hit.addEventListener("click",()=>{select(b.id);});
    const fut=cur!==null&&i>cur;
    gRoute.append(hit,el("path",{d,class:"route-glow"+(fut?" future":"")}),el("path",{d,class:"route "+(lg.m==="flight"?"fly":(lg.m==="boat"||lg.m==="ferry")?"boat":"")+(fut?" future":"")}));
  }
  gWalker.innerHTML="";
  if(all&&!reduced()&&!matchMedia("(pointer:coarse)").matches){const p=el("path",{id:"routeAll",d:all,fill:"none",stroke:"none"});gWalker.append(p);const w=el("circle",{class:"walker",r:4.5*K});const am=el("animateMotion",{dur:Math.max(12,seq.length*2.2)+"s",repeatCount:"indefinite",rotate:"auto"});const mp=el("mpath");mp.setAttributeNS(XL,"xlink:href","#routeAll");mp.setAttribute("href","#routeAll");am.append(mp);w.append(am);gWalker.append(w);}
  const order={};seq.forEach((id,i)=>{if(order[id]===undefined)order[id]=i+1;});
  const lastIdx={};seq.forEach((id,i)=>{lastIdx[id]=i;});const firstIdx={};seq.forEach((id,i)=>{if(firstIdx[id]===undefined)firstIdx[id]=i;});
  const near=new Set(state.sel?nearbyOf(state.sel).map(x=>x.o.id):[]);
  const lockSet=state.lock&&state.filterCCs.length?new Set(state.filterCCs):null;
  STOPS.forEach(s=>{const g=pinEls[s.id];const on=inRoute.has(s.id);g.classList.toggle("on",on);g.classList.toggle("sel",state.sel===s.id);
    g.querySelector(".badge-t").textContent=on?(s.id==="rio"?"★":order[s.id]):"";
    const vis=visible(s)||on;g.classList.toggle("faded",!vis);g.classList.toggle("hidden",!!lockSet&&!lockSet.has(s.cc)&&!on);
    g.classList.toggle("near",near.has(s.id));
    g.classList.toggle("future",cur!==null&&on&&firstIdx[s.id]>cur);g.classList.toggle("past",cur!==null&&on&&lastIdx[s.id]<cur);
    g.classList.remove("wx-g","wx-a","wx-r");if(state.wx){const w=wxAt(s,monthFor(s.id,S));if(w)g.classList.add("wx-"+w.r);}});
  svg.classList.toggle("wx",!!state.wx);document.querySelector(".legend").classList.toggle("wx",!!state.wx);
  gCountries.querySelectorAll(".country").forEach(p=>{p.classList.toggle("dim",state.filterCCs.length>0&&!state.filterCCs.includes(p.dataset.cc));p.classList.toggle("hot",state.filterCCs.includes(p.dataset.cc));});
}
/* pan / zoom / pinch */
function zoomAt(f,cx,cy){const rr=svg.getBoundingClientRect();const nw=Math.min(Math.max(vb.w/f,W/12),W*1.4),nh=nw*rr.height/rr.width;vb.x=cx-(cx-vb.x)*nw/vb.w;vb.y=cy-(cy-vb.y)*nh/vb.h;vb.w=nw;vb.h=nh;setVB();}
function svgPoint(x,y){const pt=svg.createSVGPoint();pt.x=x;pt.y=y;return pt.matrixTransform(svg.getScreenCTM().inverse());}
svg.addEventListener("wheel",e=>{e.preventDefault();const p=svgPoint(e.clientX,e.clientY);zoomAt(e.deltaY<0?1.18:1/1.18,p.x,p.y);},{passive:false});
const ptrs=new Map();let drag=null,dragMoved=false,pinch=null;
svg.addEventListener("pointerdown",e=>{if(e.button!==0&&e.pointerType==="mouse")return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,vb:{...vb}};drag=null;return;}
  drag={x:e.clientX,y:e.clientY,vx:vb.x,vy:vb.y};dragMoved=false;});
window.addEventListener("pointermove",e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pinch&&ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);const f=d/pinch.d;const rr=svg.getBoundingClientRect();const sc=pinch.vb.w/rr.width;const cx=pinch.vb.x+(pinch.cx-rr.left)*sc,cy=pinch.vb.y+(pinch.cy-rr.top)*sc;const nw=Math.min(Math.max(pinch.vb.w/f,W/12),W*1.4);const nh=nw*rr.height/rr.width;const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;const sc2=nw/rr.width;vb={x:cx-(mx-rr.left)*sc2,y:cy-(my-rr.top)*sc2,w:nw,h:nh};setVBsoon();dragMoved=true;return;}
  if(!drag)return;const rr=svg.getBoundingClientRect();const sx=vb.w/rr.width;const dx=(e.clientX-drag.x)*sx,dy=(e.clientY-drag.y)*sx;if(!dragMoved&&Math.abs(e.clientX-drag.x)+Math.abs(e.clientY-drag.y)>4){dragMoved=true;svg.classList.add("dragging");}if(dragMoved){vb.x=drag.vx-dx;vb.y=drag.vy-dy;setVBsoon();}});
const endPtr=e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch=null;if(!ptrs.size){drag=null;svg.classList.remove("dragging");}};
window.addEventListener("pointerup",endPtr);window.addEventListener("pointercancel",endPtr);
svg.addEventListener("click",e=>{if(dragMoved){e.stopPropagation();dragMoved=false;}},true);
document.getElementById("zin").onclick=()=>zoomAt(1.4,vb.x+vb.w/2,vb.y+vb.h/2);
document.getElementById("zout").onclick=()=>zoomAt(1/1.4,vb.x+vb.w/2,vb.y+vb.h/2);
document.getElementById("zfit").onclick=()=>fitRoute(true);
function freeRect(){const r=svg.getBoundingClientRect();const p=document.getElementById("right").getBoundingClientRect();const f=document.querySelector(".filters").getBoundingClientRect();
  if(isMobile()){const top=Math.max(f.bottom-r.top+12,100);const bottom=state.pcol?r.height-70:p.top-r.top-12;return {left:16,top,width:Math.max(120,r.width-32),height:Math.max(120,bottom-top)};}
  const left=24,top=Math.max(f.bottom-r.top+16,110),right=state.pcol?r.width-24:p.left-r.left-24,bottom=r.height-24;return {left,top,width:Math.max(200,right-left),height:Math.max(200,bottom-top)};}
function animateTo(target,anim,ms){if(![target.x,target.y,target.w,target.h].every(Number.isFinite))return;if(!anim||reduced()){vb=target;setVB();return;}const from={...vb};let t0=null;const dur=ms||450;const step=ts=>{if(!t0)t0=ts;const t=Math.min(1,(ts-t0)/dur);const e=1-Math.pow(1-t,3);vb={x:from.x+(target.x-from.x)*e,y:from.y+(target.y-from.y)*e,w:from.w+(target.w-from.w)*e,h:from.h+(target.h-from.h)*e};setVB();if(t<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
function fitBox(x0,y0,x1,y1,anim,minW){const r=svg.getBoundingClientRect();if(!r.width)return;const fr=freeRect();const cw=x1-x0,ch=y1-y0;let scale=Math.max(cw/fr.width,ch/fr.height);if(minW)scale=Math.max(scale,minW/r.width);const w=r.width*scale,h=r.height*scale;const cx=(x0+x1)/2,cy=(y0+y1)/2;animateTo({x:cx-(fr.left+fr.width/2)*scale,y:cy-(fr.top+fr.height/2)*scale,w,h},anim);}
function fitRoute(anim){const ids=state.route.length?[...new Set([...state.route.map(r=>r.id),"rio","lima"])].filter(i=>i!=="galapagos"||state.route.some(r=>r.id==="galapagos")):STOPS.map(s=>s.id).filter(i=>!["galapagos","sanandres"].includes(i)&&BY[i].lat>-36);
  const xs=ids.map(i=>px(BY[i].lon)),ys=ids.map(i=>py(BY[i].lat));fitBox(Math.min(...xs)-50,Math.min(...ys)-50,Math.max(...xs)+50,Math.max(...ys)+50,anim);}
function fitCountry(cc){const ss=STOPS.filter(s=>s.cc===cc&&s.id!=="galapagos"&&s.id!=="sanandres"&&s.id!=="ushuaia"||(cc==="AR"&&s.id==="ushuaia"));const xs=ss.map(s=>px(s.lon)),ys=ss.map(s=>py(s.lat));fitBox(Math.min(...xs)-60,Math.min(...ys)-60,Math.max(...xs)+60,Math.max(...ys)+60,true,W*0.28);}
function focusStop(id,zoomW){const s=BY[id];const cx=px(s.lon),cy=py(s.lat);const r=svg.getBoundingClientRect();const fr=freeRect();const w=zoomW||vb.w;const sc=w/r.width;if(!zoomW){const sx=(cx-vb.x)/sc,sy=(cy-vb.y)/sc;if(sx>fr.left+30&&sx<fr.left+fr.width-30&&sy>fr.top+30&&sy<fr.top+fr.height-30)return;}animateTo({x:cx-(fr.left+fr.width/2)*sc,y:cy-(fr.top+fr.height/2)*sc,w,h:w*r.height/r.width},true,zoomW?900:350);}
new ResizeObserver(()=>{setVB();syncHH();}).observe(svg);
function syncHH(){const t=document.querySelector(".top"),app=document.getElementById("app");app.style.setProperty("--hh",(t.offsetHeight+(isMobile()?18:24))+"px");}

/* ---- play the route ---- */
let playing=null;
function playRoute(){
  if(playing){stopPlay();return;}
  const S=schedule();if(!state.route.length){toast("Add stops first");return;}
  const box=document.getElementById("play");box.classList.add("show");document.getElementById("playBtn").classList.add("on");
  let i=0;playing={};
  const step=()=>{if(!playing)return;const r=S.rows[i];const s=BY[r.id];focusStop(r.id,W*0.22);state.sel=r.id;drawRoute();
    const lg=r.leg;box.innerHTML=`<img src="${IMGM[s.id]||IMG[s.id]}" alt=""><div class="pb"><span class="n">${r.locked?"★ NYE":"Stop "+(i+1)+" of "+S.rows.length}${lg?` · ${MODE_NAME[lg.m]||lg.m} ${lg.h>=24?Math.round(lg.h/24*10)/10+" d":lg.h+" h"}`:""}</span><h3>${esc(s.name)}</h3><span class="d">${fmt(r.from)}${r.days>1?" → "+fmt(r.to):""} · ${r.days} d</span><span class="lg">${esc(s.tag)}</span><div class="ctl"><button id="pPrev">‹</button><button id="pPause">${playing.paused?"Play":"Pause"}</button><button id="pNext">›</button><button id="pStop">Stop</button></div></div>`;
    box.querySelector("#pStop").onclick=stopPlay;box.querySelector("#pNext").onclick=()=>{i=Math.min(S.rows.length-1,i+1);clearTimeout(playing.t);step();};box.querySelector("#pPrev").onclick=()=>{i=Math.max(0,i-1);clearTimeout(playing.t);step();};box.querySelector("#pPause").onclick=()=>{playing.paused=!playing.paused;box.querySelector("#pPause").textContent=playing.paused?"Play":"Pause";if(!playing.paused){i=Math.min(S.rows.length-1,i+1);step();}else clearTimeout(playing.t);};
    if(playing.paused)return;if(i<S.rows.length-1){playing.t=setTimeout(()=>{i++;step();},2600);}else{playing.t=setTimeout(stopPlay,3000);}};
  step();
}
function stopPlay(){if(playing)clearTimeout(playing.t);playing=null;document.getElementById("play").classList.remove("show");document.getElementById("playBtn").classList.remove("on");renderStop();fitRoute(true);}
document.getElementById("playBtn").onclick=playRoute;

/* ============ FILTERS ============ */
const TAGS=[["ALL","All"],["top","Top highlights"],["major","Highlights"],["beach","Beach"],["party","Party"],["mountain","Mountains"],["jungle","Jungle"],["city","Cities"],["ruins","Ruins"],["off-beat","Off-beat"]];
function tagMatch(s,t){if(t==="ALL")return true;if(t==="top")return s.tier===1;if(t==="major")return s.tier<=2;if(t==="mountain")return s.kind==="mountain"||s.tags.includes("trekking")||s.tags.includes("hiking");if(t==="jungle")return s.kind==="jungle"||s.tags.includes("jungle");if(t==="city")return s.kind==="city";if(t==="ruins")return s.kind==="ruins"||s.tags.includes("ruins");return s.tags.includes(t)||s.kind===t;}
function visible(s){return (!state.filterCCs.length||state.filterCCs.includes(s.cc))&&(!state.filterTags.length||state.filterTags.some(t=>tagMatch(s,t)));}
function toggleCC(cc){const i=state.filterCCs.indexOf(cc);if(i>=0)state.filterCCs.splice(i,1);else state.filterCCs.push(cc);if(!state.filterCCs.length)state.lock=false;render();if(state.filterCCs.length===1)fitCountry(state.filterCCs[0]);}
function toggleTag(t){const i=state.filterTags.indexOf(t);if(i>=0)state.filterTags.splice(i,1);else state.filterTags.push(t);render();}
function renderFilters(){
  const f=document.getElementById("filters");f.innerHTML="";
  const cnt=cc=>STOPS.filter(s=>s.cc===cc).length;
  const mkChip=(html,on,fn,cls)=>{const b=document.createElement("button");b.className="chip"+(on?" on":"")+(cls?" "+cls:"");b.innerHTML=html;b.onclick=fn;f.append(b);return b;};
  const dd=(key,label,items,sel,onToggle,onClear)=>{
    const w=document.createElement("div");w.className="dd"+(state.ddOpen===key?" open":"");w.dataset.key=key;
    const b=document.createElement("button");b.className="chip dd-btn"+(sel.length?" on":"");b.innerHTML=label+' <span class="car">▾</span>';b.onclick=()=>{state.ddOpen=state.ddOpen===key?null:key;document.querySelectorAll(".dd").forEach(x=>x.classList.toggle("open",x.dataset.key===state.ddOpen));};
    const m=document.createElement("div");m.className="menu";
    const all=document.createElement("button");all.className="mi"+(sel.length?"":" on");all.innerHTML=`<i class="none"></i><span>All</span><small>${STOPS.length}</small>`;all.onclick=onClear;m.append(all);
    items.forEach(([v,txt,sw,n])=>{const on=sel.includes(v);const it=document.createElement("button");it.className="mi chk"+(on?" on":"");it.innerHTML=`<i class="box${sw?"":" plain"}"${sw?` style="background:var(--${sw})"`:""}>${on?"✓":""}</i><span>${txt}</span><small>${n}</small>`;it.onclick=()=>onToggle(v);m.append(it);});
    w.append(b,m);f.append(w);
  };
  const ccLabel=!state.filterCCs.length?"All countries":state.filterCCs.length===1?COUNTRY[state.filterCCs[0]]:state.filterCCs.length<=2?state.filterCCs.map(c=>COUNTRY[c]).join(", "):state.filterCCs.length+" countries";
  dd("cc",ccLabel,CC_ORDER.map(cc=>[cc,COUNTRY[cc],cc.toLowerCase(),cnt(cc)]),state.filterCCs,toggleCC,()=>{state.filterCCs=[];state.lock=false;render();});
  const tagLabel=Object.fromEntries(TAGS);
  const tgLabel=!state.filterTags.length?"All types":state.filterTags.length<=2?state.filterTags.map(t=>tagLabel[t]).join(", "):state.filterTags.length+" types";
  dd("tag",tgLabel,TAGS.filter(([t])=>t!=="ALL").map(([t,l])=>[t,l,null,STOPS.filter(s=>tagMatch(s,t)).length]),state.filterTags,toggleTag,()=>{state.filterTags=[];render();});
  if(state.filterCCs.length)mkChip("Focus",state.lock,()=>{state.lock=!state.lock;save();render();if(state.lock){const ss=STOPS.filter(s=>state.filterCCs.includes(s.cc)&&!["galapagos","sanandres"].includes(s.id));const xs=ss.map(s=>px(s.lon)),ys=ss.map(s=>py(s.lat));fitBox(Math.min(...xs)-60,Math.min(...ys)-60,Math.max(...xs)+60,Math.max(...ys)+60,true);}},"lock");
  const sep=document.createElement("span");sep.className="sep";f.append(sep);
  mkChip("Labels",state.labels,()=>{state.labels=!state.labels;save();render();});
  mkChip("Weather",state.wx,()=>{state.wx=!state.wx;save();render();},"wx");
  if(state.wx){const seg=document.createElement("div");seg.className="seg";for(const m of WXM){const b=document.createElement("button");b.className=state.wxMonth===m?"on":"";b.textContent=WXN[m];b.onclick=()=>{state.wxMonth=m;save();render();};seg.append(b);}f.append(seg);}
}
document.addEventListener("click",e=>{if(!e.target.closest(".more"))document.querySelectorAll(".more.open").forEach(m=>m.classList.remove("open"));if(!e.target.closest(".dd")){state.ddOpen=null;document.querySelectorAll(".dd.open").forEach(x=>x.classList.remove("open"));}});

/* ============ EXPLORE ============ */
let openCC=null;
function stopCard(s,order,S){
  const w=state.wx?wxAt(s,monthFor(s.id,S)):null;
  const b=document.createElement("button");b.className="card"+(order[s.id]?" on":"")+(state.sel===s.id?" sel":"");
  b.innerHTML=`<img src="${IMGM[s.id]||IMG[s.id]}" alt="" loading="lazy" decoding="async">${order[s.id]?`<span class="n">${s.id==="rio"?"★":order[s.id]}</span>`:""}${s.tier===1?`<span class="tier t1">★ TOP</span>`:s.tier===2?`<span class="tier">HIGHLIGHT</span>`:""}${w?`<span class="wxd ${w.r}" title="${WXN[w.month]}: ${w.label}, ${w.hi}°"></span>`:""}${s.id==="rio"?"":`<span class="add" title="Add to route">+</span>`}<span class="cap"><b>${esc(short(s.name))}</b><small>${COUNTRY[s.cc]} · ${s.days} d${w?" · "+w.hi+"°":""}</small></span>`;
  b.onclick=e=>{if(e.target.classList.contains("add")){addStop(s.id);return;}select(s.id,true);focusStop(s.id);};
  b.ondblclick=()=>addStop(s.id);return b;
}
function renderExplore(){
  const pane=document.getElementById("tab-explore");pane.innerHTML="";
  const S=schedule();const order={};[...state.route.map(r=>r.id),"rio"].forEach((id,i)=>{if(order[id]===undefined)order[id]=i+1;});
  const wrap=document.createElement("div");wrap.className="explore";
  if(state.insertAt!==null){const ban=document.createElement("div");ban.className="insban";ban.innerHTML=`<span>Pick a stop to insert after <b>${esc(state.insertAt===-1?"the start":short(BY[state.route[state.insertAt].id].name))}</b></span><button class="chip" id="cancelIns">Cancel</button>`;ban.querySelector("#cancelIns").onclick=()=>{state.insertAt=null;render();};wrap.append(ban);}
  const intro=document.createElement("div");intro.className="intro";intro.innerHTML=`<p>${STOPS.filter(visible).length} stops match the filters above the map. <b>★ Top</b> are the trip-defining places, <b>Highlight</b> the strong ones. Tap a country header for money, visa and safety.</p>`;wrap.append(intro);
  const det=document.createElement("div");det.className="detours";det.innerHTML=`<h3 class="sec">Hostels worth a detour <span class="cnt">${DETOURS.length}</span></h3><div class="dstrip">${DETOURS.filter(d=>BY[d.stop]&&(!state.filterCCs.length||state.filterCCs.includes(BY[d.stop].cc))).map(d=>{const s=BY[d.stop];const h=s.hostels.find(x=>x.n===d.h);const img=(h&&(h.hood||s.hood)&&HOOD[h.hood||s.hood])?HOOD[h.hood||s.hood]:(IMGM[s.id]||IMG[s.id]);return `<button class="dcard" data-ds="${s.id}" data-dh="${esc(d.h)}"><img src="${img}" alt="" loading="lazy"><span class="cap"><b>${esc(short(d.h))}</b><small>${esc(short(s.name))} · ${COUNTRY[s.cc]}${h&&h.usd?" · ~$"+h.usd:""}</small><em>${esc(d.why)}</em></span></button>`;}).join("")}</div>`;
  det.querySelectorAll(".dcard").forEach(b=>b.onclick=()=>{openHostels.add(b.dataset.ds+"|"+b.dataset.dh);select(b.dataset.ds);focusStop(b.dataset.ds);setTimeout(()=>{const card=document.querySelector(`#tab-stop .hostel[data-h="${CSS.escape(b.dataset.dh)}"]`);if(card)card.scrollIntoView({behavior:"smooth",block:"center"});},80);});
  wrap.append(det);
  const ccs=state.filterCCs.length?CC_ORDER.filter(c=>state.filterCCs.includes(c)):CC_ORDER;
  const days={};S.rows.forEach(r=>{days[BY[r.id].cc]=(days[BY[r.id].cc]||0)+r.days;});
  ccs.forEach(cc=>{
    const ss=STOPS.filter(s=>s.cc===cc&&visible(s)).sort((x,y)=>x.tier-y.tier);if(!ss.length)return;
    const c=COUNTRIES[cc];const g=document.createElement("div");g.className="cgroup";
    g.innerHTML=`<div class="cty${openCC===cc?" open":""}" data-cc="${cc}"><div class="ch"><img src="${IMGM[c.img]||IMG[c.img]}" alt="" loading="lazy"><div class="v"></div><h3>${COUNTRY[cc]}</h3><span class="exp">${ss.length} stops${days[cc]?` · ${days[cc]} d planned`:""} · ${openCC===cc?"hide info":"info"}</span><span class="sw" style="background:var(--${cc.toLowerCase()})"></span></div>
     <div class="cb"><dl class="kv"><dt>Money</dt><dd>${esc(c.currency)}. ${esc(c.cash)}</dd><dt>Budget</dt><dd>${esc(c.budget)}</dd><dt>Visa</dt><dd class="${/required/i.test(c.visa)?"warn":""}">${esc(c.visa)}</dd><dt>Safety</dt><dd>${esc(c.safety)}</dd></dl>
     <ul class="must">${c.must.map(m=>`<li>${esc(m)}</li>`).join("")}</ul><div class="cn">${esc(c.note)}</div>
     <div class="row"><button class="btn ghost small" data-show="${cc}">Zoom map to ${COUNTRY[cc]}</button></div></div></div>`;
    g.querySelector(".ch").onclick=()=>{openCC=openCC===cc?null:cc;renderExplore();};
    g.querySelector("[data-show]").onclick=e=>{e.stopPropagation();fitCountry(cc);};
    const grid=document.createElement("div");grid.className="egrid";ss.forEach(s=>grid.append(stopCard(s,order,S)));g.append(grid);wrap.append(g);
  });
  const cr=document.createElement("p");cr.className="credits-link";cr.innerHTML=`Photos: Wikimedia Commons and Wikipedia, downscaled. <button id="creditsBtn">All credits and licences</button>`;wrap.append(cr);
  pane.append(wrap);document.getElementById("eCnt").textContent=STOPS.filter(visible).length;
}

/* ============ STOP ============ */
function wxBlock(s,month,onRoute){
  const w=wxAt(s,month);if(!w)return "";
  const strip=WXM.map(m=>{const x=wxAt(s,m);return `<div class="${m===month?"cur":""}"><span>${WXN[m]}</span><b>${x.hi}°</b><i class="${x.r}"></i><span>${x.rain} mm</span>${x.sea?`<span class="sea">sea ${x.sea}°</span>`:""}</div>`;}).join("");
  return `<h3 class="sec">Weather ${onRoute?"when you're there":"by month"}</h3>
  <div class="wxbox"><div class="big"><b>${w.hi}°</b><small>night ${w.lo}°${w.sea?" · sea "+w.sea+"°":""}</small><span class="pill ${w.r}">${w.label}</span></div>
  <div class="txt"><span class="m">${WXN[month]}${onRoute?" (your dates)":" (pick a month with the Weather layer)"} · ${w.rain} mm rain${w.cold?" · cold, bring layers":""}</span><span>${esc(w.note||"")}</span></div></div>
  <div class="wxstrip">${strip}</div>`;
}
function hostelCard(h,s,open){
  const hood=h.hood||s.hood;const img=hood&&HOOD[hood]?HOOD[hood]:IMG[s.id];
  const feats=(h.f||[]).map(f=>`<span><svg viewBox="0 0 24 24">${FEAT_ICON[f]||""}</svg>${FEAT[f]||f}</span>`).join("");
  const q=h.n.replace(/\(.*?\)/g,"").trim()+" "+short(s.name);
  const VIBEICON={party:'<path d="M5 3h14l-7 9v6M9 21h6"/>',social:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M14 20c0-3 2-4 4-4s3 1 3 4"/>',chill:'<path d="M3 8c4 6 14 6 18 0M3 8v10M21 8v10"/>',boutique:'<path d="M4 9l8-6 8 6v11H4zM10 20v-6h4v6"/>',surf:'<path d="M4 20C8 4 16 4 20 4c0 4-4 12-16 16z"/>',eco:'<path d="M12 21v-8M12 13c-4 0-6-3-6-7 4 0 6 3 6 7zM12 13c4 0 6-3 6-7-4 0-6 3-6 7z"/>'};
  const bigFeats=(h.f||[]).slice(0,6).map(f=>`<span title="${FEAT[f]||f}"><svg viewBox="0 0 24 24">${FEAT_ICON[f]||""}</svg><small>${FEAT[f]||f}</small></span>`).join("");
  const own=h.hood&&h.hood!==s.hood&&HOOD[h.hood];
  const stars=h.rating?(h.rsrc==="google"?"★".repeat(Math.round(h.rating)):"★".repeat(Math.round(h.rating/2))):"";
  const hwp=h.hw&&h.hw.imgs&&h.hw.imgs.length?h.hw.imgs:null;
  return `<div class="hostel${open?" open":""} v-${h.v}${hwp?" haspix":""}" data-h="${esc(h.n)}">${hwp?`<div class="hwpix">${hwp.slice(0,4).map((u,i)=>`<img src="${u}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.closest('.hostel').classList.remove('haspix')">`).join("")}<a class="hwlink" href="${esc(h.hw.url)}" target="_blank" rel="noopener">${hwp.length} photos on Hostelworld ↗</a></div>`:""}<div class="vibehead"><div class="vh-l"><svg viewBox="0 0 24 24">${VIBEICON[h.v]||VIBEICON.chill}</svg><b>${h.v}</b>${h.rating?`<span>${h.rating}${h.rsrc==="google"?"/5":"/10"} · ${h.rsrc||"rated"}</span>`:`<span>no public rating</span>`}${h.usd?`<span>~$${h.usd} / night</span>`:h.price?`<span>${h.price}</span>`:""}</div><div class="vh-f">${bigFeats||'<em>Few extras: it\'s about the location.</em>'}</div></div><div class="ph${own||hwp?"":" novis"}">${hwp?`<img src="${hwp[0]}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()">`:own?`<img src="${HOOD[h.hood]}" alt="" loading="lazy">`:`<svg viewBox="0 0 24 24" class="vi">${VIBEICON[h.v]||VIBEICON.chill}</svg>`}<span class="stripe ${h.v}"></span><span class="vb ${h.v}">${h.v}</span></div>
   <div class="bd"><div class="nm"><b>${esc(h.n)}</b><span class="price">${h.usd?"~$"+h.usd:(h.price||"")}</span>${h.rating?`<span class="rate">${h.rating}${h.rsrc==="google"?"/5":"/10"}${h.hw&&h.hw.reviews?" · "+h.hw.reviews.toLocaleString()+" reviews":h.rsrc?" "+h.rsrc:""}</span><span class="stars">${stars}</span>`:""}${h.gem?`<span class="gem">Gem</span>`:""}${h.verify?`<span class="verify">verify</span>`:""}${state.picks[s.id]===h.n?`<span class="pickb">Your bed</span>`:""}</div>
   <div class="area">${esc(h.area||"")}${h.replaced?" · replaces an unconfirmed listing":""}</div>
   <div class="more"><p>${esc(h.t)}</p>${feats?`<div class="feat">${feats}</div>`:""}
   <div class="bookrow"><a href="${h.hw?esc(h.hw.url):gq("site:hostelworld.com "+q)}" target="_blank" rel="noopener">${h.hw?"Book on Hostelworld":"Find on Hostelworld"} ↗</a><a class="g" href="${gq(q+" booking.com")}" target="_blank" rel="noopener">Booking ↗</a></div>
   <div class="links"><button class="pickbtn" data-pick="${esc(h.n)}">${state.picks[s.id]===h.n?"Unpick":"Pick as my bed"}</button><a href="${mapq(q)}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>Maps</a><a href="${gq(q+" reviews")}" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>Reviews</a></div></div>
   <span class="chev">▼</span></div></div>`;
}
const openHostels=new Set();
function renderStop(){
  const s=BY[state.sel],pane=document.getElementById("tab-stop");
  const idxs=state.route.map((r,i)=>r.id===s.id?i:-1).filter(i=>i>=0);const idx=idxs[0]??-1;const on=idx>=0||s.id==="rio";
  const S=schedule();const row=S.rows.find(r=>r.id===s.id);
  const gems=s.hostels.filter(h=>h.gem).length;
  const pics=[IMG[s.id],...(IMG2[s.id]||[])];
  const evs=eventsFor(s);const hits=eventsHit(s,row);
  const anc=state.anchors.filter(a=>a.id===s.id);const ancS=S.anchors.filter(a=>a.id===s.id);
  const near=nearbyOf(s.id);
  pane.innerHTML=`
   <div class="hero"><div class="gal" id="gal">${pics.map(p=>`<img src="${p}" alt="${esc(s.name)}">`).join("")}</div><div class="veil"></div>
    ${pics.length>1?`<div class="dots">${pics.map((_,i)=>`<i class="${i===0?"on":""}"></i>`).join("")}</div><button class="arr l" data-g="-1">‹</button><button class="arr r" data-g="1">›</button>`:""}
    <div class="ttl"><div class="eyebrow">${s.tier===1?`<svg class="star" viewBox="0 0 24 24"><path d="M12 2l3 7 7 .6-5.3 4.7L18.5 22 12 18l-6.5 4 1.8-7.7L2 9.6 9 9z"/></svg>`:""}${COUNTRY[s.cc]} · ${esc(s.kind)}${s.tier===1?" · top highlight":s.tier===2?" · highlight":""}</div><h2>${esc(s.name)}</h2><p>${esc(s.tag)}</p></div></div>
   <div class="detail">
    <div class="cta">
     ${s.id==="rio"?`<span class="note good" style="flex:1">Locked as the final stop. ${row?`You'd have <b>${row.days} day${row.days===1?"":"s"}</b> here from ${fmt(row.from)}.`:""}</span>`:(idx>=0?`<span class="stepper"><button data-d="-1" aria-label="fewer days">−</button><b>${state.route[idx].days} days</b><button data-d="1" aria-label="more days">+</button></span><button class="btn ghost small" id="addAgain" title="Add a second visit">Add again</button><button class="btn danger small" id="rm">Remove</button>`:`<button class="btn" id="add"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>${state.insertAt!==null?"Insert here":"Add to route"} <span class="mono">${s.days} d</span></button>`)}
     <button class="btn ghost small" id="cmpBtn" title="Compare with another stop">Compare</button>
    </div>
    <div class="facts">
     <div class="fact"><small>Stay</small><b>${s.days} d</b></div>
     <div class="fact"><small>Dorm bed</small><b>${s.dorm?"~$"+s.dorm:"day trip"}</b></div>
     <div class="fact ${on?"good":""}"><small>${on?"Arrive":"Route"}</small><b>${row?fmtS(row.from)+(idxs.length>1?" +"+(idxs.length-1):""):"not on it"}</b></div>
     <div class="fact"><small>Hostels</small><b>${s.hostels.length}${gems?` · ${gems} gem${gems>1?"s":""}`:""}</b></div>
    </div>
    <div class="row">${s.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div>
    <div class="blurb"><p>${esc(s.blurb)}</p></div>
    ${s.best?`<div class="best"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span><b>When:</b> ${esc(s.best)}</span></div>`:""}
    ${hits.length?`<div class="note ${hits.some(e=>e.kind==="closure")?"bad":hits.some(e=>e.kind==="warn")?"":"info"}"><b>While you're there:</b> ${hits.map(e=>esc(e.text)).join(" ")}</div>`:""}
    ${wxBlock(s,monthFor(s.id,S),!!row)}
    <h3 class="sec">Don't miss</h3>
    <ul class="hi">${(s.hi||[]).map(h=>`<li>${esc(h)}</li>`).join("")}</ul>
    ${evs.length?`<h3 class="sec">Dates to know</h3><div class="ev">${evs.map(e=>`<div class="${hits.includes(e)?"hit":""}"><span class="d">${fmtS(e.f)}${e.to!==e.from?"–"+fmtS(e.t):""}</span><span><i class="k ${e.kind}"></i>${esc(e.text)}</span></div>`).join("")}</div>`:""}
    <h3 class="sec">Fixed date here</h3>
    <div class="anchor">${anc.length?ancS.map(a=>`<span class="st ${a.ok?"ok":"miss"}"><b>${esc(a.label||"Fixed date")}</b> · ${fmt(a.d)} · ${a.ok?"you're there ("+a.when+")":a.onRoute?"missed: you're there "+a.when:"stop is not on the route"} <button class="chip" data-rma="${esc(a.label)}|${a.date}" style="padding:1px 8px;margin-left:6px">remove</button></span>`).join(""):""}
     <label class="field">Date <input type="date" id="ancDate" min="${state.start}" max="2026-12-31"></label><label class="field">What <input type="text" id="ancLabel" placeholder="e.g. Machu Picchu ticket"></label><button class="btn ghost small" id="ancAdd">Pin date</button>
     <span class="small-note" style="flex-basis:100%">A pinned date must fall inside your stay here, otherwise the route shows a warning.</span></div>
    ${near.length?`<h3 class="sec">Nearby, under 4 h</h3><div class="nearby">${near.map(x=>`<button data-go="${x.o.id}"><img src="${IMGM[x.o.id]||IMG[x.o.id]}" alt=""><span><b>${esc(short(x.o.name))}</b><small>${esc(x.o.tag)}</small></span><span class="h">${x.lg.h} h ${MODE_NAME[x.lg.m]||x.lg.m}</span></button>`).join("")}</div>`:""}
    <h3 class="sec">Where to sleep <span class="cnt">${s.hostels.length}</span><span style="flex:1"></span><button id="hAll">expand all</button></h3>
    <div class="hostels">${s.hostels.map(h=>hostelCard(h,s,openHostels.has(s.id+"|"+h.n))).join("")}</div>
    <p class="small-note">Photos, ratings and prices load live from Hostelworld where the hostel is listed there (they need an internet connection and don't show inside Claude). Others show the vibe header instead. Prices and ratings were checked against Hostelworld, Booking and Google in Sep 2026 where shown; “Gem” = less known, worth it.</p>
   </div>`;
  pane.querySelector("#add")?.addEventListener("click",()=>addStop(s.id));
  pane.querySelector("#addAgain")?.addEventListener("click",()=>addStop(s.id,true));
  pane.querySelector("#rm")?.addEventListener("click",()=>removeStop(idx));
  pane.querySelectorAll(".cta .stepper button").forEach(b=>b.onclick=()=>bump(idx,+b.dataset.d));
  pane.querySelector("#cmpBtn").onclick=()=>{state.cmpA=s.id;if(!state.cmpB||state.cmpB===s.id){openSearch("compare");}else openCompare();};
  pane.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{select(b.dataset.go);focusStop(b.dataset.go);});
  pane.querySelectorAll(".hostel").forEach(h=>{h.addEventListener("click",e=>{if(e.target.closest("a,button"))return;const k=s.id+"|"+h.dataset.h;if(openHostels.has(k))openHostels.delete(k);else openHostels.add(k);h.classList.toggle("open");});h.addEventListener("dblclick",e=>{if(e.target.closest("a,button"))return;pickHostel(s.id,h.dataset.h);});});
  pane.querySelectorAll("[data-pick]").forEach(b=>b.onclick=e=>{e.stopPropagation();pickHostel(s.id,b.dataset.pick);});
  pane.querySelector("#hAll").onclick=()=>{const all=pane.querySelectorAll(".hostel");const anyClosed=[...all].some(h=>!h.classList.contains("open"));all.forEach(h=>{h.classList.toggle("open",anyClosed);const k=s.id+"|"+h.dataset.h;if(anyClosed)openHostels.add(k);else openHostels.delete(k);});pane.querySelector("#hAll").textContent=anyClosed?"collapse all":"expand all";};
  pane.querySelector("#ancAdd").onclick=()=>{const d=pane.querySelector("#ancDate").value,l=pane.querySelector("#ancLabel").value.trim();if(!d){toast("Pick a date first");return;}snap();state.anchors.push({id:s.id,date:d,label:l||"Fixed date"});commit();toast("Date pinned",undoLast);};
  pane.querySelectorAll("[data-rma]").forEach(b=>b.onclick=()=>{const [l,d]=b.dataset.rma.split("|");snap();state.anchors=state.anchors.filter(a=>!(a.id===s.id&&a.date===d&&a.label===l));commit();toast("Pinned date removed",undoLast);});
  const gal=pane.querySelector("#gal");if(gal&&pics.length>1){const dots=pane.querySelectorAll(".dots i");gal.addEventListener("scroll",()=>{const i=Math.round(gal.scrollLeft/gal.clientWidth);dots.forEach((d,j)=>d.classList.toggle("on",j===i));});pane.querySelectorAll("[data-g]").forEach(b=>b.onclick=()=>{gal.scrollBy({left:+b.dataset.g*gal.clientWidth,behavior:"smooth"});});}
}

function pickHostel(sid,name){const was=state.picks[sid];if(was===name)delete state.picks[sid];else state.picks[sid]=name;openHostels.add(sid+"|"+name);save();renderStop();dirty.route=true;toast(was===name?"Bed unpicked":`${short(name)} picked for ${short(BY[sid].name)}`);}
function renderCursorChip(){let c=document.getElementById("curChip");if(!dayCursor){if(c)c.remove();return;}if(!c){c=document.createElement("button");c.id="curChip";c.className="chip curchip";c.onclick=()=>{dayCursor=null;renderCursorChip();drawRoute();};document.getElementById("mapwrap").append(c);}c.innerHTML=`Showing <b>${fmt(pd(dayCursor.date))}</b> · later stops greyed · <u>clear</u>`;}
/* ============ ROUTE ============ */
function settingsHTML(){return `<div class="settings2"><label class="f"><span>Land in Lima</span><input type="date" id="startDate" value="${state.start}"></label><span class="arr">→</span><span class="f lock"><span>New Year's Eve</span><b>Rio · 31 Dec</b></span><label class="f"><span>Budget / day</span><span class="in">$<input type="number" id="daily" min="10" max="300" step="5" value="${state.daily}"></span></label><span class="days">${availDays()} days</span><span class="help" title="Daily budget covers food, activities and local transport; beds and long-distance legs are added separately for the total.">?</span></div>`;}
function bindSettings(pane){const sd=pane.querySelector("#startDate");if(sd)sd.onchange=()=>{if(sd.value){state.start=sd.value;commit();}};const dl=pane.querySelector("#daily");if(dl)dl.onchange=()=>{state.daily=Math.max(10,Math.min(300,+dl.value||40));commit();};}
function sharedBanner(){if(!state.sharedName)return "";return `<div class="note info"><b>Shared route:</b> “${esc(state.sharedName)}”. It's now your working copy; save it under My routes to keep it. <button class="chip" id="dismissShared" style="padding:2px 8px;margin-left:6px">ok</button></div>`;}
function todayHTML(S){
  const now=new Date();now.setHours(0,0,0,0);const st=startDate();if(now<addDays(st,-3)||now>NYE)return "";
  const row=S.rows.find(r=>now>=r.from&&now<=r.to)||(now<st?S.rows[0]:null);if(!row)return "";
  const s=BY[row.id];const next=S.rows[row.i+1];const lg=next?leg(row.id,next.id):null;const w=wxAt(s,now.getMonth()+1);
  const hs=[...s.hostels].sort((x,y)=>(state.picks[s.id]===y.n)-(state.picks[s.id]===x.n)).slice(0,2);
  return `<div class="today"><img src="${IMGM[s.id]||IMG[s.id]}" alt=""><div class="tb"><span class="e">${now<st?"Trip starts "+fmtS(st):"Today · "+fmtS(now)}</span><h3>${esc(s.name)}</h3><span class="l">${fmt(row.from)}${row.days>1?" → "+fmt(row.to):""}${w?` · ${w.hi}° ${w.label.toLowerCase()}`:""}</span>${next?`<span class="l"><b>Next:</b> ${esc(short(BY[next.id].name))} on ${fmtS(next.from)} · ${MODE_NAME[lg.m]||lg.m} ${lg.h>=24?Math.round(lg.h/24*10)/10+" d":lg.h+" h"} ~$${lg.u}</span>`:""}<div class="links">${hs.map(h=>`<a href="${mapq(h.n.replace(/\(.*?\)/g,"")+" "+short(s.name))}" target="_blank" rel="noopener">${esc(short(h.n))} ↗</a>`).join("")}<button data-done="${row.id}">${state.done.includes(row.id)?"Done ✓":"Mark done"}</button></div></div></div>`;
}
function timelineHTML(S){
  const avail=availDays();const panelW=Math.max(320,(document.getElementById("pane").clientWidth||400)-56);
  const minPer=13;const pxd=Math.max(panelW/avail,minPer);const width=Math.round(avail*pxd);
  const months=[];let d=startDate();while(d<=NYE){if(d.getDate()===1){months.push(`<span style="left:${((d-startDate())/864e5)*pxd}px">${d.toLocaleDateString("en-GB",{month:"short"})}</span>`);}d=addDays(d,1);}
  const cur=dayCursor?dayCursor.i:null;
  const bars=S.rows.map(r=>{const s=BY[r.id];const wpx=Math.round(r.days*pxd);const tv=r.leg&&r.leg.d?`<div class="tb travel" style="width:${Math.round(r.leg.d*pxd)}px" title="${r.leg.d} travel day"></div>`:"";
    return tv+`<div class="tb${r.locked?" rio":""}${state.sel===r.id?" cur":""}${cur!==null&&r.i>cur?" fut":""}" data-i="${r.i}" style="width:${wpx}px;background-image:url(${IMGT[s.id]||IMGM[s.id]})" title="${esc(s.name)} · ${fmt(r.from)}${r.days>1?" → "+fmt(r.to):""} · ${r.days} d"><span class="n">${wpx>=54?esc(short(s.name)):wpx>=26?esc(short(s.name)).slice(0,3):""}</span><span class="d">${r.days}d</span>${r.locked?"":'<span class="hd"></span>'}</div>`;}).join("");
  const anc=S.anchors.map(a=>`<span class="anc ${a.ok?"ok":""}" style="left:${((a.d-startDate())/864e5)*pxd}px" title="${esc(a.label)} · ${fmtS(a.d)}"><i></i></span>`).join("");
  return `<div class="timeline" id="tl" data-pxd="${pxd}"><div class="tlscroll"><div class="months" style="width:${width}px">${months.join("")}</div><div class="bars" style="width:${width}px">${bars}${anc}</div></div><div class="foot"><span>${fmtS(startDate())}</span><span>drag a tile's right edge to change days</span><span>31 Dec</span></div></div>`;
}
function calendarHTML(S){
  const cols={PE:"var(--pe)",EC:"var(--ec)",CO:"var(--co)",BR:"var(--br)",BO:"var(--bo)",GY:"var(--gy)",SR:"var(--sr)",GF:"var(--gf)",CL:"var(--cl)",AR:"var(--ar)",PY:"var(--py)"};
  const byDay={};S.rows.forEach(r=>{for(let d=new Date(r.from);d<=r.to;d=addDays(d,1))byDay[iso(d)]={r,s:BY[r.id]};if(r.leg&&r.leg.d){for(let k=1;k<=r.leg.d;k++)byDay[iso(addDays(r.from,-k))]={travel:true,r};}});
  const anc={};S.anchors.forEach(a=>{(anc[a.date]=anc[a.date]||[]).push(a);});
  const evd={};S.rows.forEach(r=>{eventsHit(BY[r.id],r).forEach(e=>{for(let d=new Date(Math.max(e.f,r.from));d<=Math.min(e.t,r.to);d=addDays(d,1)){(evd[iso(d)]=evd[iso(d)]||[]).push(e);}});});
  const today=iso(new Date());const st=startDate();
  let html=`<div class="cal">`;
  for(let m=st.getMonth();m<=11;m++){
    const first=new Date(2026,m,1);const name=first.toLocaleDateString("en-GB",{month:"long"});const off=(first.getDay()+6)%7;const dim=new Date(2026,m+1,0).getDate();
    html+=`<div class="cm"><h4>${name}</h4><div class="cg">${["M","T","W","T","F","S","S"].map(d=>`<span class="dh">${d}</span>`).join("")}${"<span></span>".repeat(off)}`;
    for(let d=1;d<=dim;d++){const dt=new Date(2026,m,d);const k=iso(dt);const x=byDay[k];const we=dt.getDay()===0||dt.getDay()===6;const before=dt<st;
      let cls="cd"+(we?" we":"")+(before?" off":"")+(k===today?" today":"")+(x&&x.travel?" travel":"")+(x&&x.r&&state.sel===x.r.id?" cur":"");
      let style=x&&!x.travel?`background:${cols[x.s.cc]||"var(--other)"}`:"";const first_=x&&!x.travel&&iso(x.r.from)===k;
      const marks=(anc[k]?anc[k].map(a=>`<i class="am ${a.ok?"ok":"miss"}" title="${esc(a.label)}"></i>`).join(""):"")+(evd[k]?`<i class="em ${evd[k][0].kind}" title="${esc(evd[k][0].text)}"></i>`:"");
      html+=`<button class="${cls}" style="${style}" data-day="${k}" ${x&&x.r?`data-stop="${x.r.id}"`:""} title="${x?(x.travel?"Travel day":esc(x.s.name)):""}"><b>${d}</b>${x&&!x.travel?`<small>${first_?esc(short(x.s.name)):""}</small>`:x&&x.travel?`<small>→</small>`:""}${marks}</button>`;}
    html+=`</div></div>`;}
  html+=`</div>`;return html;
}
let dayT=0;
function showDay(id,dateStr){const g=pinEls[id];const t=g.querySelector(".daylbl");t.textContent=fmt(pd(dateStr));g.classList.add("dayon");clearTimeout(dayT);dayT=setTimeout(()=>g.classList.remove("dayon"),3500);}
function bindTimeline(pane){
  pane.querySelectorAll(".cal [data-stop]").forEach(b=>b.onclick=()=>{const id=b.dataset.stop;const S2=schedule();const row=S2.rows.find(r=>r.id===id&&pd(b.dataset.day)>=r.from&&pd(b.dataset.day)<=r.to)||S2.rows.find(r=>r.id===id);dayCursor={i:row?row.i:null,date:b.dataset.day,keep:true};select(id,true);focusStop(id,Math.min(vb.w,W*0.3));showDay(id,b.dataset.day);renderCursorChip();});
  const tl=pane.querySelector("#tl");if(!tl)return;const pxd=+tl.dataset.pxd;
  tl.querySelectorAll(".tb[data-i]").forEach(bar=>{const i=+bar.dataset.i;if(i>=state.route.length)return;
    bar.addEventListener("click",e=>{if(e.target.classList.contains("hd"))return;select(state.route[i].id,true);focusStop(state.route[i].id);});
    const hd=bar.querySelector(".hd");if(!hd)return;
    hd.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();const x0=e.clientX,d0=state.route[i].days;bar.classList.add("dragging");snap();let last=d0;
      const mv=ev=>{const nd=Math.max(1,Math.min(30,d0+Math.round((ev.clientX-x0)/pxd)));if(nd!==last){last=nd;state.route[i].days=nd;bar.style.width=Math.round(nd*pxd)+"px";bar.querySelector(".d").textContent=nd+"d";}};
      const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);bar.classList.remove("dragging");if(last===d0)HIST.pop();else{commit();toast(`${short(BY[state.route[i].id].name)}: ${last} days`,undoLast);}};
      window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);});
  });
}
function autoSort(){
  if(state.route.length<3){toast("Add more stops first");return;}
  const before=schedule();const items=state.route.map(r=>({...r}));const first=items[0];let rest=items.slice(1);
  const dist=(a,b)=>haversine(BY[a.id],BY[b.id]);
  // nearest neighbour from first, ending near Rio
  const order=[first];while(rest.length){const last=order[order.length-1];let bi=0,bd=Infinity;rest.forEach((r,i)=>{const d=dist(last,r)+dist(r,{id:"rio"})*0.15;if(d<bd){bd=d;bi=i;}});order.push(rest.splice(bi,1)[0]);}
  // 2-opt
  const cost=arr=>{let c=0;for(let i=1;i<arr.length;i++)c+=dist(arr[i-1],arr[i]);return c+dist(arr[arr.length-1],{id:"rio"});};
  let best=order.slice(),improved=true,guard=0;
  while(improved&&guard++<200){improved=false;for(let i=1;i<best.length-1;i++)for(let j=i+1;j<best.length;j++){const cand=best.slice(0,i).concat(best.slice(i,j+1).reverse(),best.slice(j+1));if(cost(cand)<cost(best)-1){best=cand;improved=true;}}}
  const after=schedule(best);
  if(after.km>=before.km-50){toast("Route is already in a sensible order");return;}
  snap();state.route=best;commit();fitRoute(true);
  toast(`Re-ordered: ${(before.km-after.km).toLocaleString()} km less, ${before.flights-after.flights>=0?before.flights-after.flights+" fewer flights":"same flights"}`,undoLast);
}
function overlandAlt(aId,bId){
  const ok=lg=>lg.m!=="flight"&&!/\b(fly|flight|flights|airport)\b/i.test((lg.n||"").split(" Alt:")[0])&&(!lg.est||lg.h<=10)&&lg.h<=30;
  const ids=STOPS.map(s=>s.id);const dist={},prev={};ids.forEach(i=>dist[i]=Infinity);dist[aId]=0;const done=new Set();
  const a=BY[aId],b=BY[bId],D=haversine(a,b);
  for(let n=0;n<ids.length;n++){let u=null,best=Infinity;for(const i of ids){if(!done.has(i)&&dist[i]<best){best=dist[i];u=i;}}if(u===null||u===bId)break;done.add(u);
    for(const v of ids){if(done.has(v)||v===u)continue;const s=BY[v];if(haversine(a,s)+haversine(s,b)>D*1.6)continue;const lg=leg(u,v);if(!ok(lg))continue;const c=dist[u]+lg.h+6;if(c<dist[v]){dist[v]=c;prev[v]=u;}}}
  if(!isFinite(dist[bId]))return null;const path=[];let c=bId;while(c!==aId){path.unshift(c);c=prev[c];if(!c)return null;}path.unshift(aId);
  const mids=path.slice(1,-1);if(!mids.length||mids.length>5)return null;let h=0,u=0,d=0;for(let i=1;i<path.length;i++){const lg=leg(path[i-1],path[i]);h+=lg.h;u+=lg.u;d+=lg.d;}
  return {mids,h:Math.round(h),u:Math.round(u),d};
}
function statsOf(route){const S=schedule(route);return {stops:route.length+1,ccs:S.ccs.length,transport:S.transport,hostel:S.hostel,total:S.total,rio:S.rioDays,flights:S.flights,busH:Math.round(S.busH),km:S.km};}
function renderRoute(){
  const pane=document.getElementById("tab-route");const S=schedule();const avail=availDays();
  document.getElementById("routeCnt").textContent=state.route.length;
  if(!state.route.length){pane.innerHTML=`<div class="route-pane">${settingsHTML()}<div class="empty"><h2>No stops yet</h2><p>Tap a stop on the map or in Explore, then “Add to route”. Or start from a preset:</p></div><div class="presets" id="presetsIn"></div></div>`;bindSettings(pane);renderPresetsInto(pane.querySelector("#presetsIn"));return;}
  const rioCls=S.rioDays<1?"bad":S.rioDays<3?"warn":S.rioDays>14?"warn":"good";
  let html=`<div class="route-pane">${sharedBanner()}${settingsHTML()}${todayHTML(S)}
   <div class="actions"><button class="act primary" id="share"><svg viewBox="0 0 24 24"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5"/></svg>Share / phone</button><button class="act" id="playR"><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>Play route</button><button class="act ${state.calOpen?"on":""}" id="calR"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>Calendar</button><div class="more" id="more"><button class="act" id="moreBtn"><svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>More</button><div class="menu"><button id="newR">New route (keep the current one saved)</button><button id="autosort">Auto-sort the route</button><button id="saveR">Save this route…</button><button id="export">Export trip file</button><button id="copy">Copy as text</button><button id="fit">Fit map to route</button><button id="clear" class="danger">Clear route</button></div></div></div>
   <div class="summary">
    <div class="fact ${rioCls}"><small>Days in Rio</small><b>${S.rioDays<1?"−"+S.over:S.rioDays}</b></div>
    <div class="fact"><small>Transport</small><b>~$${S.transport.toLocaleString()}</b></div>
    <div class="fact"><small>Beds</small><b>~$${S.hostel.toLocaleString()}</b></div>
    <div class="fact"><small>Total est.</small><b>~$${S.total.toLocaleString()}</b></div>
   </div>
   ${timelineHTML(S)}
   <details class="pre cal-d" ${state.calOpen?"open":""}><summary>Calendar view</summary>${calendarHTML(S)}</details>
   <div class="small-note">${state.route.length+1} stops · ${S.ccs.length} countries · ${S.flights} flights · ${Math.round(S.busH)} h of buses and boats · ${S.km.toLocaleString()} km.</div>
   ${S.missed.length?`<div class="note bad"><b>Pinned dates missed:</b> ${S.missed.map(a=>`${esc(a.label)} (${esc(short(BY[a.id].name))}, ${fmtS(a.d)}) — ${a.onRoute?"you're there "+a.when:"stop not on route"}`).join("; ")}.</div>`:""}
   ${S.rioDays<1?`<div class="note bad">You arrive in Rio <b>${S.over} day${S.over>1?"s":""} after New Year's Eve</b>. Cut days somewhere, or drop a stop.</div>`:S.rioDays>14?`<div class="note">${S.rioDays} days in Rio is a lot. Room for another stop or longer stays.</div>`:S.rioDays<3?`<div class="note">Only ${S.rioDays} day${S.rioDays>1?"s":""} in Rio before the fireworks. Aim for 4–6.</div>`:""}
   <div class="rlist" id="rlist">`;
  S.rows.forEach((r,i)=>{
    const s=BY[r.id];
    if(r.leg){const lg=r.leg;html+=`<div class="leg ${lg.est?"warn":""}"><div class="ln"><i></i></div><div class="txt"><span class="mode">${MODE_ICON[lg.m]||""}${MODE_NAME[lg.m]||lg.m}</span><span class="mono">${lg.h>=24?Math.round(lg.h/24*10)/10+" d":lg.h+" h"}</span><span class="mono">${lg.u?"~$"+lg.u:"incl."}</span>${lg.d?`<span class="mono">+${lg.d} travel day${lg.d>1?"s":""}</span>`:""}${lg.src?`<span class="src">researched</span>`:lg.est?`<span class="src" style="color:var(--warn);border-color:var(--warn)">estimate</span>`:""}${lg.n?`<span class="nt">${esc(lg.n)}</span>`:""}</div></div>`;}
    if(r.leg&&r.leg.m==="flight"&&!r.locked||(r.leg&&r.leg.m==="flight"&&r.locked)){const alt=overlandAlt(S.rows[i-1].id,r.id);if(alt){html+=`<div class="leg"><div class="ln"></div><div class="overland"><b>Overland instead of flying</b><span class="path">${esc(short(BY[S.rows[i-1].id].name))} → ${alt.mids.map(m=>`<i>${esc(short(BY[m].name))}</i>`).join(" → ")} → ${esc(short(s.name))} · ${alt.h} h of buses and boats · ~$${alt.u}${alt.d?" · +"+alt.d+" travel day"+(alt.d>1?"s":""):""}</span><button data-ovl="${i}" data-mids="${alt.mids.join(",")}">Take the bus via ${alt.mids.map(m=>short(BY[m].name)).join(", ")}</button></div></div>`;}}
    const ins=i===0?-1:i-1;
    html+=`<div class="rins"><button data-ins="${ins}" class="${state.insertAt===ins?"armed":""}" title="Insert a stop here">+</button><span>${state.insertAt===ins?"choose a stop in Explore":""}</span></div>`;
    const w=wxAt(s,r.from.getMonth()+1);const hits=eventsHit(s,r);const ancs=S.anchors.filter(a=>a.id===s.id);
    const flags=[...hits.map(e=>`<i class="${e.kind}" title="${esc(e.text)}"></i>`),...ancs.map(a=>`<i class="anc ${a.ok?"":"miss"}" title="${esc(a.label)} ${fmtS(a.d)}${a.ok?"":" — missed"}"></i>`)].join("");
    html+=`<div class="rstop ${r.locked?"locked":""}${state.sel===r.id?" cur":""}${state.done.includes(r.id)?" done":""}" draggable="${!r.locked}" data-i="${i}">
      <span class="num">${r.locked?"★":i+1}</span>
      <div class="who"><b data-sel="${r.id}">${esc(s.name)}</b><small>${fmt(r.from)}${r.days>1?" → "+fmt(r.to):""} · ${r.days} d${r.locked?" · NYE":""}${w?`<span class="wxm" title="${w.label}, ${w.rain} mm"><i class="${w.r}"></i>${w.hi}°</span>`:""}${flags?`<span class="flags">${flags}</span>`:""}${state.picks[r.id]?`<br><span class="bed">Bed: ${esc(state.picks[r.id])}</span>`:""}</small></div>
      <div class="ctl">${r.locked?"":`<span class="stepper"><button data-d="-1" aria-label="fewer days">−</button><b>${r.days} d</b><button data-d="1" aria-label="more days">+</button></span><button class="icon" data-mv="-1" title="Move up" ${i===0?"disabled":""}>↑</button><button class="icon" data-mv="1" title="Move down" ${i===state.route.length-1?"disabled":""}>↓</button><button class="icon x" data-rm title="Remove">×</button><span class="grip" title="Drag to reorder">⋮⋮</span>`}</div>
    </div>`;
  });
  const savedHTML=`<div class="saved"><h4>My routes <span class="row"><button class="btn ghost small" id="newR2">New route</button><button class="btn ghost small" id="saveR2">${state.saved.find(x=>x.id===state.activeId)?"Update saved":"Save current…"}</button></span></h4>${state.saved.length?state.saved.map(sv=>{const st=statsOf(sv.route);const inCmp=state.cmpSaved.includes(sv.id);return `<div class="srow${inCmp?" cmp":""}${sv.id===state.activeId?" active":""}"><div><b>${esc(sv.name)}${sv.id===state.activeId?' <span class="tagactive">editing</span>':""}</b><small>${st.stops} stops · ${st.ccs} countries · ${st.rio} d in Rio · ~$${st.total.toLocaleString()}</small></div><div class="b"><button data-ld="${sv.id}">Load</button><button data-sh="${sv.id}">Share link</button><button data-cp="${sv.id}" class="${inCmp?"on":""}">Compare</button><button data-rn="${sv.id}">Rename</button><button data-dl="${sv.id}">Delete</button></div></div>`;}).join(""):`<span class="small-note">Nothing saved yet. Save the current route to keep versions and share each one with its own link.</span>`}${state.cmpSaved.length===2?(()=>{const A=state.saved.find(x=>x.id===state.cmpSaved[0]),B=state.saved.find(x=>x.id===state.cmpSaved[1]);if(!A||!B)return "";const a=statsOf(A.route),b=statsOf(B.route);const rows=[["Stops",a.stops,b.stops],["Countries",a.ccs,b.ccs],["Days in Rio",a.rio,b.rio],["Flights",a.flights,b.flights],["Bus/boat hours",a.busH,b.busH],["Transport $",a.transport,b.transport],["Beds $",a.hostel,b.hostel],["Total est. $",a.total,b.total]];return `<div class="compare"><table><tr><th></th><th>${esc(A.name)}</th><th>${esc(B.name)}</th></tr>${rows.map(([l,x,y])=>`<tr><td>${l}</td><td>${x.toLocaleString()}</td><td>${y.toLocaleString()}</td></tr>`).join("")}</table></div>`;})():""}</div>`;
  html+=`</div>
   <details class="pre"><summary>Start from a preset route</summary><div class="presets" id="presetsIn"></div></details>
   ${savedHTML}
   <p class="small-note">Legs marked “researched” were checked in Sep 2026 against Rome2rio, Busbud and airline fares; “estimate” legs are distance-based guesses. “Send to phone” copies a link that opens this exact route on any device.</p>
  </div>`;
  pane.innerHTML=html;bindSettings(pane);bindTimeline(pane);pane.querySelector("#dismissShared")?.addEventListener("click",()=>{delete state.sharedName;save();renderRoute();});pane.querySelector(".cal-d")?.addEventListener("toggle",e=>{state.calOpen=e.target.open;save();});
  pane.querySelector("[data-done]")?.addEventListener("click",e=>{const id=e.target.dataset.done;const i=state.done.indexOf(id);if(i>=0)state.done.splice(i,1);else state.done.push(id);commit();});
  pane.querySelectorAll(".rstop").forEach(row=>{
    const i=+row.dataset.i;
    row.querySelectorAll(".stepper button").forEach(b=>b.onclick=()=>bump(i,+b.dataset.d));
    row.querySelectorAll("[data-mv]").forEach(b=>b.onclick=()=>move(i,+b.dataset.mv));
    row.querySelector("[data-rm]")?.addEventListener("click",()=>removeStop(i));
    row.querySelector("[data-sel]").onclick=()=>{const id=row.querySelector("[data-sel]").dataset.sel;select(id,true);focusStop(id);};
    if(row.draggable){
      row.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",i);row.classList.add("drag");});
      row.addEventListener("dragend",()=>row.classList.remove("drag"));
      row.addEventListener("dragover",e=>{e.preventDefault();row.classList.add("over");});
      row.addEventListener("dragleave",()=>row.classList.remove("over"));
      row.addEventListener("drop",e=>{e.preventDefault();row.classList.remove("over");const from=+e.dataTransfer.getData("text/plain");if(isNaN(from)||from===i||i>=state.route.length)return;snap();const [it]=state.route.splice(from,1);state.route.splice(i,0,it);commit();toast("Reordered",undoLast);});
    }
  });
  pane.querySelectorAll("[data-ovl]").forEach(b=>b.onclick=()=>{const at=+b.dataset.ovl;const mids=b.dataset.mids.split(",");snap();const add=mids.map(id=>({id,days:Math.min(2,BY[id].days)}));state.route.splice(Math.min(at,state.route.length),0,...add);commit();toast(`${mids.length} stop${mids.length>1?"s":""} inserted for the overland route`,undoLast);});
  pane.querySelectorAll("[data-ins]").forEach(b=>b.onclick=()=>{const v=+b.dataset.ins;state.insertAt=state.insertAt===v?null:v;render();if(state.insertAt!==null)setTab("explore");});
  renderPresetsInto(pane.querySelector("#presetsIn"));
  pane.querySelector("#clear").onclick=()=>{snap();state.route=[];commit();toast("Route cleared",undoLast);};
  pane.querySelector("#fit").onclick=()=>fitRoute(true);
  pane.querySelector("#copy").onclick=copyText;pane.querySelector("#share").onclick=shareLink;pane.querySelector("#export").onclick=exportTrip;pane.querySelector("#autosort").onclick=autoSort;pane.querySelector("#playR").onclick=playRoute;pane.querySelector("#moreBtn").onclick=e=>{e.stopPropagation();pane.querySelector("#more").classList.toggle("open");};pane.querySelector("#saveR").onclick=saveRoute;pane.querySelector("#newR").onclick=newRoute;pane.querySelector("#calR").onclick=()=>{const d=pane.querySelector(".cal-d");d.open=!d.open;state.calOpen=d.open;save();pane.querySelector("#calR").classList.toggle("on",d.open);if(d.open)d.scrollIntoView({behavior:"smooth",block:"start"});};
  pane.querySelector("#saveR2").onclick=saveRoute;pane.querySelector("#newR2").onclick=newRoute;
  pane.querySelectorAll("[data-ld]").forEach(b=>b.onclick=()=>{const sv=state.saved.find(x=>x.id===b.dataset.ld);if(!sv)return;snap();state.route=sv.route.map(r=>({...r}));state.anchors=(sv.anchors||[]).map(x=>({...x}));state.picks={...(sv.picks||{})};state.activeId=sv.id;commit();fitRoute(true);toast(`Loaded “${sv.name}”`,undoLast);});
  pane.querySelectorAll("[data-sh]").forEach(b=>b.onclick=()=>{const sv=state.saved.find(x=>x.id===b.dataset.sh);if(!sv)return;const url=location.origin+location.pathname+"?r="+encodeRoute({route:sv.route,anchors:sv.anchors||[],picks:sv.picks||{},name:sv.name});if(navigator.share&&isMobile()){navigator.share({title:sv.name,url}).catch(()=>copyToClip(url,"Link copied"));}else copyToClip(url,`Link for “${sv.name}” copied`);});
  pane.querySelectorAll("[data-cp]").forEach(b=>b.onclick=()=>{const id=b.dataset.cp;const i=state.cmpSaved.indexOf(id);if(i>=0)state.cmpSaved.splice(i,1);else{state.cmpSaved.push(id);if(state.cmpSaved.length>2)state.cmpSaved.shift();}save();renderRoute();});
  pane.querySelectorAll("[data-rn]").forEach(b=>b.onclick=()=>{const sv=state.saved.find(x=>x.id===b.dataset.rn);const n=prompt("New name",sv.name);if(n){sv.name=n;save();renderRoute();}});
  pane.querySelectorAll("[data-dl]").forEach(b=>b.onclick=()=>{const sv=state.saved.find(x=>x.id===b.dataset.dl);if(!sv||!confirm(`Delete “${sv.name}”?`))return;state.saved=state.saved.filter(x=>x.id!==sv.id);state.cmpSaved=state.cmpSaved.filter(x=>x!==sv.id);save();renderRoute();toast("Deleted");});
}
function renderPresetsInto(pane){
  if(!pane)return;
  let html=`<div class="intro"><p>Each preset ends in Rio on New Year's Eve with about a week there. Load one, then add, remove and reorder.</p></div>`;
  PRESETS.forEach((p,i)=>{
    const route=p.stops.map(([id,days])=>({id,days}));const S=schedule(route);
    const ccs=[...new Set(p.stops.map(([id])=>BY[id].cc))].map(c=>COUNTRY[c]).join(" · ");
    const path=p.stops.filter(([id],k)=>k===0||p.stops[k-1][0]!==id).map(([id])=>`<b>${esc(short(BY[id].name))}</b>`).join(" → ")+" → <b>Rio</b>";
    const pics=[...new Set(p.stops.map(([id])=>id).filter(id=>BY[id].major))].filter((id,k,arr)=>k%Math.max(1,Math.floor(arr.length/4))===0).slice(0,4);
    const names=[...new Set(p.stops.map(([id])=>short(BY[id].name)))];const shown=names.slice(0,6);
    html+=`<div class="preset"><div class="strip">${pics.map(id=>`<img src="${IMGM[id]||IMG[id]}" alt="" loading="lazy">`).join("")}</div><div class="pb"><div class="ph1"><div><h3>${esc(p.name)}</h3><p>${esc(p.tagline)}</p></div><button class="btn small" data-p="${i}">Load</button></div><div class="pstats"><span><b>${p.stops.length+1}</b> stops</span><span><b>${S.ccs.length}</b> countries</span><span><b>${S.rioDays}</b> d in Rio</span><span><b>$${S.transport.toLocaleString()}</b> transport</span></div><details class="ppath"><summary>${shown.map(esc).join(" · ")}${names.length>6?` · <b>+${names.length-6} more</b>`:""}</summary><div class="path">${path}</div></details></div></div>`;
  });
  pane.innerHTML=html;
  pane.querySelectorAll("[data-p]").forEach(b=>b.onclick=()=>{const p=PRESETS[+b.dataset.p];snap();state.route=p.stops.map(([id,days])=>({id,days}));commit();setTab("route");fitRoute(true);toast(`Loaded ${p.name}`,undoLast);});
}

function saveRoute(){if(!state.route.length){toast("Nothing to save yet");return;}const cur=state.saved.find(x=>x.id===state.activeId);const name=prompt("Name this route",cur?cur.name:(state.sharedName||("Route "+(state.saved.length+1))));if(!name)return;
  const rec={name,route:state.route.map(r=>({...r})),anchors:state.anchors.map(x=>({...x})),picks:{...state.picks}};
  if(cur&&name===cur.name){Object.assign(cur,rec);toast(`Updated “${name}”`);}else{const id="s"+Date.now();state.saved.push({id,created:Date.now(),...rec});state.activeId=id;toast(`Saved “${name}” — share it from My routes`);}
  save();renderRoute();renderMeter();}
function newRoute(){if(state.route.length){const cur=state.saved.find(x=>x.id===state.activeId);const same=cur&&JSON.stringify(cur.route)===JSON.stringify(state.route);if(!same){if(confirm("Save the current route first? (Cancel = discard it)")){const name=prompt("Name for the current route",cur?cur.name:"Route "+(state.saved.length+1));if(name){if(cur&&name===cur.name)Object.assign(cur,{route:state.route.map(r=>({...r})),anchors:state.anchors.map(x=>({...x})),picks:{...state.picks}});else state.saved.push({id:"s"+Date.now(),created:Date.now(),name,route:state.route.map(r=>({...r})),anchors:state.anchors.map(x=>({...x})),picks:{...state.picks}});}}}}
  snap();state.route=[];state.anchors=[];state.picks={};state.activeId=null;delete state.sharedName;commit();setTab("route");toast("New empty route — pick a preset or add stops",undoLast);}
/* ============ EXPORT / SHARE ============ */
function itineraryText(){
  const S=schedule();const lines=[`Andes to Copacabana — ${fmt(startDate())} to ${fmt(NYE)}`,""];
  S.rows.forEach((r,i)=>{if(r.leg){const l=r.leg;lines.push(`   ↓ ${MODE_NAME[l.m]||l.m} ${l.h>=24?Math.round(l.h/24*10)/10+"d":l.h+"h"} ~$${l.u}${l.d?` (+${l.d} travel day)`:""}${l.n?" — "+l.n:""}`);}
    const s=BY[r.id];lines.push(`${String(i+1).padStart(2," ")}. ${s.name} — ${fmt(r.from)}${r.days>1?" → "+fmt(r.to):""} (${r.days} d)`);lines.push(`    Sleep: ${s.hostels.slice(0,3).map(h=>h.n).join(" · ")}`);});
  lines.push("",`Transport ~$${S.transport}, beds ~$${S.hostel}, total est. ~$${S.total}. ${S.rioDays} days in Rio before NYE.`,"",location.origin+location.pathname+"?r="+encodeRoute());
  return lines.join("\n");
}
function copyToClip(txt,msg){(navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast(msg)).catch(()=>{const t=document.createElement("textarea");t.value=txt;document.body.append(t);t.select();try{document.execCommand("copy");toast(msg);}catch(e){prompt("Copy this:",txt);}t.remove();});}
function copyText(){copyToClip(itineraryText(),"Itinerary copied");}
function shareLink(){const url=location.origin+location.pathname+"?r="+encodeRoute();history.replaceState(null,"",location.pathname+"?r="+encodeRoute());if(navigator.share&&isMobile()){navigator.share({title:"My South America route",url}).catch(()=>copyToClip(url,"Link copied"));return;}copyToClip(url,"Link copied — open it on your phone");}
function tripHTML(){
  const S=schedule();const used=[...new Set(S.rows.map(r=>r.id))];const imgs=Object.fromEntries(used.map(id=>[id,IMG[id]]));const plannerUrl=location.origin+location.pathname+"?r="+encodeRoute();
  const cards=S.rows.map((r,i)=>{const s=BY[r.id];const lg=r.leg;const w=wxAt(s,r.from.getMonth()+1);const hits=eventsHit(s,r);return `${lg?`<div class="leg">${MODE_NAME[lg.m]||lg.m} · ${lg.h>=24?Math.round(lg.h/24*10)/10+" d":lg.h+" h"} · ${lg.u?"~$"+lg.u:"incl."}${lg.d?" · +"+lg.d+" travel day":""}${lg.n?`<br><span>${esc(lg.n)}</span>`:""}</div>`:""}
<section id="s${i}"><img src="${imgs[s.id]}" alt=""><div class="b"><div class="n">${r.locked?"★":i+1}</div><h2>${esc(s.name)}</h2><div class="d">${fmt(r.from)}${r.days>1?" → "+fmt(r.to):""} · ${r.days} d · ${COUNTRY[s.cc]}</div>${w?`<p class="w">Weather: ${w.hi}° / ${w.lo}°, ${w.rain} mm, ${w.label.toLowerCase()}.${w.sea?" Sea "+w.sea+"°.":""} ${esc(w.note||"")}</p>`:""}${hits.length?`<p class="w">${hits.map(e=>esc(e.text)).join(" ")}</p>`:""}<p>${esc(s.tag)}</p><ul>${(s.hi||[]).map(h=>`<li>${esc(h)}</li>`).join("")}</ul><h3>Sleep</h3>${s.hostels.map(h=>`<div class="h${state.picks[s.id]===h.n?" pick":""}"><b>${state.picks[s.id]===h.n?"★ ":""}${esc(h.n)}</b> <em>${h.v}${h.usd?" · ~$"+h.usd:h.price?" · "+h.price:""}${h.rating?" · "+h.rating:""}${h.gem?" · gem":""}</em><br>${esc(h.area||"")}${h.area?" — ":""}${esc(h.t)}<br><a href="${mapq(h.n.replace(/\(.*?\)/g,"")+" "+short(s.name))}">Maps</a> · <a href="${gq("site:hostelworld.com "+h.n+" "+short(s.name))}">Hostelworld</a></div>`).join("")}</div></section>`;}).join("");
  const toc=S.rows.map((r,i)=>`<a href="#s${i}">${i+1}. ${esc(short(BY[r.id].name))} <span>${fmtS(r.from)}</span></a>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Andes to Copacabana — my route</title><style>
body{margin:0;font-family:-apple-system,system-ui,Segoe UI,Roboto,sans-serif;background:#0F1D1C;color:#EDE7D6;line-height:1.45}header{padding:22px 18px 10px}h1{margin:0;font-size:26px;letter-spacing:-.02em}header p{margin:6px 0 0;color:#8C9C97;font-size:14px}
.sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 18px 14px}.sum div{background:#15272A;border-radius:10px;padding:8px 10px}.sum small{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#8C9C97}.sum b{font-size:15px}
nav{padding:0 18px 12px;display:grid;gap:4px}nav a{color:#EDE7D6;text-decoration:none;font-size:14px;display:flex;justify-content:space-between;border-bottom:1px solid #213539;padding:6px 0}nav a span{color:#8C9C97;font-variant-numeric:tabular-nums}
section{margin:0 0 4px;background:#15272A}section img{width:100%;height:190px;object-fit:cover;display:block}.b{padding:12px 18px 18px}.n{display:inline-grid;place-items:center;min-width:26px;height:26px;border-radius:13px;background:#FF9A3C;color:#1A0E05;font-weight:700;font-size:13px;padding:0 8px;margin-bottom:6px}h2{margin:0;font-size:22px}.d{color:#FF9A3C;font-size:13px;margin:4px 0 8px}p{margin:0 0 8px;color:#C9C3B2}.w{color:#5FC8C0;font-size:13px}ul{margin:0 0 10px;padding-left:18px;color:#C9C3B2;font-size:14px}h3{margin:12px 0 6px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#8C9C97}.h{background:#0F1D1C;border-radius:10px;padding:9px 11px;margin-bottom:6px;font-size:13.5px;color:#C9C3B2}.h b{color:#EDE7D6}.h em{color:#FF9A3C;font-style:normal;font-size:12px}.h a{color:#5FC8C0}
.leg{padding:10px 18px;font-size:13px;color:#8C9C97;border-left:3px dashed #2A4346;margin:6px 0 6px 18px}.leg span{color:#5C6F6A;font-size:12px}.mob{background:#15272A;border-radius:10px;padding:8px 12px;font-size:13px}.mob a{color:#5FC8C0}footer{padding:18px;color:#5C6F6A;font-size:12px}
</style></head><body><header><h1>Andes to Copacabana</h1><p>${fmt(startDate())} → ${fmt(NYE)} · ${S.rows.length} stops · ${S.ccs.length} countries</p><p class="mob">Offline copy. Edit the route in the planner: <a href="${plannerUrl}">open</a>.</p></header>
<div class="sum"><div><small>Transport</small><b>~$${S.transport.toLocaleString()}</b></div><div><small>Beds</small><b>~$${S.hostel.toLocaleString()}</b></div><div><small>Days in Rio</small><b>${S.rioDays}</b></div></div>
<nav>${toc}</nav>${cards}<footer>Exported ${new Date().toLocaleDateString("en-GB")} from Andes to Copacabana. Costs are estimates.</footer></body></html>`;
}
async function exportTrip(){
  const html=tripHTML();const filename="my-south-america-route.html";
  try{const dl=window.claude&&window.claude.use?await window.claude.use("downloads"):null;if(dl){await dl.save({filename,data:html});toast("Saved — open it on your phone");return;}}catch(e){if(e&&e.code==="declined")return;}
  try{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html"}));a.download=filename;document.body.append(a);a.click();a.remove();toast("Trip file downloaded");}
  catch(e){const w=window.open("about:blank","_blank");if(w){w.document.write(html);w.document.close();toast("Opened in a new tab — save it from there");}else toast("Download blocked here; use “Send to phone” instead");}
}

/* ============ ACTIONS ============ */
function select(id,noTab){if(!(dayCursor&&dayCursor.keep))dayCursor=null;else delete dayCursor.keep;renderCursorChip();state.sel=id;save();drawRoute();dirty.explore=true;dirty.route=true;if(noTab&&activeTab()==="explore")renderExplore();else if(noTab&&activeTab()==="route")renderRoute();renderStop();dirty.stop=false;if(!noTab){setTab("stop");document.getElementById("pane").scrollTop=0;}if(isMobile()&&state.pcol){state.pcol=false;applyPanel();}}
function addStop(id,again){const s=BY[id];if(id==="rio")return;snap();
  if(state.insertAt!==null){state.route.splice(state.insertAt+1,0,{id,days:s.days});state.insertAt=null;commit();setTab("route");toast(`${short(s.name)} inserted`,undoLast);return;}
  if(!again&&state.route.some(r=>r.id===id)){HIST.pop();toast(`${short(s.name)} is already on the route`);return;}
  state.route.push({id,days:s.days});commit();toast(`${short(s.name)} added · ${s.days} d`,undoLast);}
function removeStop(i){if(i<0||i>=state.route.length)return;snap();const it=state.route[i];state.route.splice(i,1);commit();toast(`${short(BY[it.id].name)} removed`,undoLast);}
function bump(i,d){if(i<0)return;snap();state.route[i].days=Math.max(1,Math.min(30,state.route[i].days+d));commit();toast(`${short(BY[state.route[i].id].name)}: ${state.route[i].days} days`,undoLast);}
function move(i,d){const j=i+d;if(j<0||j>=state.route.length)return;snap();[state.route[i],state.route[j]]=[state.route[j],state.route[i]];commit();toast("Reordered",undoLast);}
function commit(){save();render();}
function setTab(t){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("on",b.dataset.tab===t));document.querySelectorAll(".pane>section").forEach(s=>s.classList.remove("on"));const sec=document.getElementById("tab-"+t);if(dirty[t])renderTab(t);void sec.offsetWidth;sec.classList.add("on");document.getElementById("pane").scrollTop=0;if(isMobile()&&state.pcol){state.pcol=false;applyPanel();}}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>setTab(b.dataset.tab));
let toastT,toastUndo=null;
function toast(m,undo){const t=document.getElementById("toast"),b=document.getElementById("toastBtn");document.getElementById("toastMsg").textContent=m;toastUndo=undo||null;b.hidden=!undo;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),undo?5000:1800);}
document.getElementById("toastBtn").onclick=()=>{if(toastUndo){toastUndo();toastUndo=null;}document.getElementById("toast").classList.remove("show");};

/* ============ PANEL: collapse, resize, sheet ============ */
function applyPanel(){document.getElementById("app").classList.toggle("pcol",!!state.pcol);document.documentElement.style.setProperty("--pw",(isMobile()?"100vw":Math.max(360,Math.min(680,state.pw||460))+"px"));save();setTimeout(()=>{setVB();if(isMobile()&&!playing){const id=state.sel;if(id)focusStop(id);}},300);}
document.getElementById("pcolBtn").onclick=()=>{state.pcol=true;applyPanel();};
document.getElementById("popenBtn").onclick=()=>{state.pcol=false;applyPanel();};
(function(){const rz=document.getElementById("resizer");rz.addEventListener("pointerdown",e=>{e.preventDefault();const x0=e.clientX,w0=state.pw||460;const mv=ev=>{state.pw=Math.max(360,Math.min(680,w0+(x0-ev.clientX)));document.documentElement.style.setProperty("--pw",state.pw+"px");};const up=()=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);applyPanel();};window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);});})();
(function(){const h=document.getElementById("sheetHandle");const snaps=[0.32,0.55,0.9];let cur=1;const setH=f=>{document.documentElement.style.setProperty("--sheet",Math.round(f*100)+"vh");};
  h.addEventListener("pointerdown",e=>{e.preventDefault();const y0=e.clientY;const h0=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sheet"))||46;let moved=false;const mv=ev=>{const dy=y0-ev.clientY;moved=true;const f=Math.max(0.15,Math.min(0.92,(h0+dy/innerHeight*100)/100));setH(f);};const up=ev=>{window.removeEventListener("pointermove",mv);window.removeEventListener("pointerup",up);const f=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--sheet"))||46)/100;if(!moved){cur=(cur+1)%snaps.length;setH(snaps[cur]);}else{if(f<0.22){state.pcol=true;applyPanel();setH(snaps[1]);cur=1;return;}let bi=0,bd=9;snaps.forEach((s,i)=>{if(Math.abs(s-f)<bd){bd=Math.abs(s-f);bi=i;}});cur=bi;setH(snaps[bi]);}state.pcol=false;applyPanel();};window.addEventListener("pointermove",mv);window.addEventListener("pointerup",up);});
  h.addEventListener("click",()=>{if(state.pcol){state.pcol=false;applyPanel();}});
})();
document.querySelector(".tabs").addEventListener("click",()=>{if(isMobile()&&state.pcol){state.pcol=false;applyPanel();}});

/* ============ SEARCH / COMPARE / CREDITS ============ */
const ov=document.getElementById("ov"),sinput=document.getElementById("sinput"),sres=document.getElementById("sres"),smode=document.getElementById("smode");let sact=0,searchMode="select";
function openSearch(mode){searchMode=mode||"select";ov.classList.add("show");sinput.value="";smode.hidden=searchMode!=="compare";smode.textContent=searchMode==="compare"?`Compare ${short(BY[state.cmpA].name)} with…`:"";renderSearch("");sinput.focus();requestAnimationFrame(()=>sinput.focus());}
function closeSearch(){ov.classList.remove("show");}
function renderSearch(q){q=q.trim().toLowerCase();const hits=STOPS.filter(s=>!q||[s.name,COUNTRY[s.cc],s.kind,...s.tags,s.tag].join(" ").toLowerCase().includes(q)).slice(0,12);sact=Math.min(sact,Math.max(0,hits.length-1));
  sres.innerHTML=hits.map((s,i)=>`<button class="sres${i===sact?" act":""}" data-id="${s.id}"><img src="${IMGM[s.id]||IMG[s.id]}" alt=""><span><b>${esc(s.name)}</b><small>${COUNTRY[s.cc]} · ${esc(s.tag)}</small></span><span class="k">${state.route.some(r=>r.id===s.id)?"on route":s.days+" d"}</span></button>`).join("")||`<div class="empty"><p>No stop matches.</p></div>`;
  sres.querySelectorAll(".sres").forEach(b=>{b.onclick=()=>pickSearch(b.dataset.id,false);});}
function pickSearch(id,add){closeSearch();if(searchMode==="compare"){state.cmpB=id;save();openCompare();return;}if(add)addStop(id);else{select(id);focusStop(id);}}
sinput.addEventListener("input",()=>{sact=0;renderSearch(sinput.value);});
sinput.addEventListener("keydown",e=>{const items=[...sres.querySelectorAll(".sres")];if(e.key==="ArrowDown"){sact=Math.min(items.length-1,sact+1);renderSearch(sinput.value);e.preventDefault();}else if(e.key==="ArrowUp"){sact=Math.max(0,sact-1);renderSearch(sinput.value);e.preventDefault();}else if(e.key==="Enter"||e.keyCode===13){const it=items[sact];if(!it)return;pickSearch(it.dataset.id,e.shiftKey);}else if(e.key==="Escape")closeSearch();});
ov.addEventListener("click",e=>{if(e.target===ov)closeSearch();});
document.getElementById("searchBtn").onclick=()=>openSearch("select");
function cmpCol(id){if(!id)return `<div class="cmpcol"><div class="pick">Pick a second stop<button class="btn small" id="cmpPick2">Choose</button></div></div>`;const s=BY[id];const S=schedule();const m=monthFor(id,S);const w=wxAt(s,m);const row=S.rows.find(r=>r.id===id);
  return `<div class="cmpcol"><img src="${IMG[id]}" alt=""><h3>${esc(s.name)}</h3><dl class="kv"><dt>Country</dt><dd>${COUNTRY[s.cc]} · ${s.tier===1?"★ top highlight":s.tier===2?"highlight":"stop"}</dd><dt>Stay</dt><dd>${s.days} days suggested${row?` · on route ${fmtS(row.from)}`:""}</dd><dt>Dorm</dt><dd>${s.dorm?"~$"+s.dorm+" / night":"day trip"}</dd><dt>Weather</dt><dd>${w?`${WXN[m]}: ${w.hi}° / ${w.lo}°, ${w.rain} mm, ${w.label.toLowerCase()}${w.sea?", sea "+w.sea+"°":""}`:"—"}</dd><dt>Vibe</dt><dd>${s.tags.join(", ")}</dd><dt>Best time</dt><dd>${esc(s.best||"—")}</dd><dt>Don't miss</dt><dd>${(s.hi||[]).slice(0,3).map(esc).join(" · ")}</dd><dt>Sleep</dt><dd>${s.hostels.slice(0,2).map(h=>esc(h.n)+(h.rating?" ("+h.rating+")":"")).join(" · ")}</dd></dl><div class="row"><button class="btn small" data-cmpsel="${id}">Open</button>${state.route.some(r=>r.id===id)?"":`<button class="btn ghost small" data-cmpadd="${id}">Add to route</button>`}</div></div>`;}
function openCompare(){const c=document.getElementById("cmp");document.getElementById("cmpBody").innerHTML=cmpCol(state.cmpA)+cmpCol(state.cmpB);c.classList.add("show");
  c.querySelectorAll("[data-cmpsel]").forEach(b=>b.onclick=()=>{c.classList.remove("show");select(b.dataset.cmpsel);});c.querySelectorAll("[data-cmpadd]").forEach(b=>b.onclick=()=>{addStop(b.dataset.cmpadd);openCompare();});c.querySelector("#cmpPick2")?.addEventListener("click",()=>{c.classList.remove("show");openSearch("compare");});}
document.getElementById("cmpPick").onclick=()=>{document.getElementById("cmp").classList.remove("show");openSearch("compare");};
document.getElementById("cmp").addEventListener("click",e=>{if(e.target.id==="cmp"||e.target.id==="cmpClose")document.getElementById("cmp").classList.remove("show");});
document.addEventListener("click",e=>{if(!e.target.closest("#creditsBtn"))return;const list=Object.entries(CREDITS).map(([k,c])=>`<li><a href="${c.url}" target="_blank" rel="noopener">${esc(c.file.replace(/^File:/,""))}</a> — ${esc(c.artist||"unknown")}, ${esc(c.license||"see source")}</li>`).join("");document.getElementById("creditsBody").innerHTML=`<p>All photos come from Wikimedia Commons and Wikipedia, downscaled. Each links to its source page with the full licence text.</p><ul>${list}</ul>`;document.getElementById("credits").classList.add("show");});
document.getElementById("credits").addEventListener("click",e=>{if(e.target.id==="credits"||e.target.id==="creditsClose")document.getElementById("credits").classList.remove("show");});
document.addEventListener("keydown",e=>{if(e.target.matches("input,textarea"))return;
  if(e.key==="/"||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k")){e.preventDefault();openSearch("select");}
  else if(e.key==="Escape"){if(playing)stopPlay();if(state.insertAt!==null){state.insertAt=null;render();}document.querySelectorAll(".ov.show").forEach(o=>o.classList.remove("show"));}
  else if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"){e.preventDefault();undoLast();toast("Undone");}
  else if(e.key==="ArrowRight"||e.key==="ArrowLeft"){const seq=[...state.route.map(r=>r.id),"rio"];if(!seq.length)return;let i=seq.indexOf(state.sel);i=e.key==="ArrowRight"?(i+1)%seq.length:(i-1+seq.length)%seq.length;select(seq[i],true);focusStop(seq[i]);e.preventDefault();}});

/* ============ METER ============ */
function renderMeter(){
  const S=schedule(),avail=availDays();const bar=document.getElementById("meterBar");bar.innerHTML="";let used=0;const byCC={};
  S.rows.forEach(r=>{if(r.locked)return;byCC[BY[r.id].cc]=(byCC[BY[r.id].cc]||0)+r.days;used+=r.days;});used+=S.legDays;
  for(const cc of CC_ORDER){if(!byCC[cc])continue;const sp=document.createElement("span");sp.style.width=(byCC[cc]/avail*100)+"%";sp.style.background=`var(--${cc.toLowerCase()})`;sp.style.borderRight="1px solid var(--border)";sp.title=`${COUNTRY[cc]}: ${byCC[cc]} days`;bar.append(sp);}
  if(S.legDays){const sp=document.createElement("span");sp.style.width=(S.legDays/avail*100)+"%";sp.style.background="var(--line)";sp.title=`${S.legDays} travel days`;bar.append(sp);}
  if(S.rioDays>0){const sp=document.createElement("span");sp.style.width=(S.rioDays/avail*100)+"%";sp.style.background="var(--accent)";sp.title=`Rio: ${S.rioDays} days`;bar.append(sp);}
  else{const sp=document.createElement("span");sp.className="over";sp.style.width=Math.min(100,S.over/avail*100)+"%";sp.style.position="absolute";sp.style.right="0";bar.append(sp);}
  document.getElementById("meterTxt").innerHTML=`${used} / ${avail}<span class="xtra">`+(S.rioDays>0?` · ${S.rioDays} in Rio`:` · <span class="miss">${S.over} over</span>`)+(S.missed.length?` · <span class="miss">${S.missed.length} date${S.missed.length>1?"s":""} missed</span>`:"")+"</span>";
  document.getElementById("meterLegend").innerHTML=Object.entries(byCC).map(([cc,d])=>`<span><i style="background:var(--${cc.toLowerCase()})"></i>${COUNTRY[cc]} ${d}</span>`).join("")+(S.legDays?`<span><i style="background:var(--line)"></i>Travel ${S.legDays}</span>`:"")+`<span><i style="background:var(--accent)"></i>Rio ${Math.max(0,S.rioDays)}</span>`;
  document.querySelector(".brand .sub b").textContent=fmt(startDate());
  const act=state.saved.find(x=>x.id===state.activeId);document.getElementById("subline").textContent=state.route.length?`${act?"“"+act.name+"” · ":""}${state.route.length+1} stops · ${S.ccs.length} countries · ~$${S.total.toLocaleString()} total`:"click a stop to begin";
}

/* ============ RENDER / INIT ============ */
const dirty={stop:false,route:false,explore:false};
function activeTab(){const t=document.querySelector(".tab.on");return t?t.dataset.tab:"stop";}
function renderTab(t){if(t==="stop")renderStop();else if(t==="route")renderRoute();else if(t==="explore")renderExplore();dirty[t]=false;}
function render(){hideTip();document.querySelector(".mapwrap").classList.toggle("labels-on",state.labels);renderFilters();drawRoute();renderMeter();
  const cur=activeTab();for(const t of ["stop","route","explore"]){if(t===cur)renderTab(t);else dirty[t]=true;}
  document.getElementById("routeCnt").textContent=state.route.length;document.getElementById("eCnt").textContent=STOPS.filter(visible).length;}
render();applyPanel();
requestAnimationFrame(()=>{syncHH();setVB();fitRoute(false);});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{syncHH();});
matchMedia("(max-width:760px)").addEventListener("change",()=>{applyPanel();syncHH();setVB();fitRoute(false);});
if("serviceWorker" in navigator&&location.protocol==="https:"&&!/claude\.ai$/.test(location.hostname)){navigator.serviceWorker.register("sw.js").catch(()=>{});}
