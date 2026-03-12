"use client";
import { useState, useEffect, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
async function apiFetch(path, opts = {}) {
  try { const r = await fetch(`${API}${path}`, opts); return r.json(); }
  catch { return { data: [] }; }
}

/* ── TOKENS ── */
const T = {
  white: "#ffffff", snow: "#f7f9ff", ink: "#0d1117", ink2: "#1e2736",
  ink3: "#4b5563", ink4: "#9ca3af", hero: "#0b0f1a", heroMid: "#111827",
  saf: "#f97316", safL: "#fff7ed", safD: "#ea580c",
  em: "#10b981", emL: "#ecfdf5", emD: "#059669",
  sky: "#0ea5e9", skyL: "#f0f9ff", skyD: "#0284c7",
  vio: "#8b5cf6", vioL: "#f5f3ff", vioD: "#7c3aed",
  rose: "#f43f5e", roseL: "#fff1f2", roseD: "#e11d48",
  teal: "#14b8a6", tealL: "#f0fdfa", tealD: "#0d9488",
  ind: "#6366f1", indL: "#eef2ff", indD: "#4f46e5",
  pink: "#ec4899", pinkL: "#fdf2f8", pinkD: "#db2777",
  amb: "#f59e0b", ambL: "#fffbeb", ambD: "#d97706",
  border: "rgba(13,17,23,0.08)", borderM: "rgba(13,17,23,0.14)",
  sh: "0 2px 8px rgba(0,0,0,0.05),0 8px 32px rgba(0,0,0,0.07)",
  shH: "0 8px 32px rgba(0,0,0,0.10),0 32px 64px rgba(0,0,0,0.10)",
  shXL: "0 24px 64px rgba(0,0,0,0.14),0 64px 120px rgba(0,0,0,0.10)",
};

const DA = [
  { c:T.saf,  l:T.safL,  g:"linear-gradient(135deg,#f97316,#ea580c)" },
  { c:T.em,   l:T.emL,   g:"linear-gradient(135deg,#10b981,#059669)" },
  { c:T.sky,  l:T.skyL,  g:"linear-gradient(135deg,#0ea5e9,#0284c7)" },
  { c:T.vio,  l:T.vioL,  g:"linear-gradient(135deg,#8b5cf6,#7c3aed)" },
  { c:T.rose, l:T.roseL, g:"linear-gradient(135deg,#f43f5e,#e11d48)" },
  { c:T.teal, l:T.tealL, g:"linear-gradient(135deg,#14b8a6,#0d9488)" },
  { c:T.ind,  l:T.indL,  g:"linear-gradient(135deg,#6366f1,#4f46e5)" },
  { c:T.pink, l:T.pinkL, g:"linear-gradient(135deg,#ec4899,#db2777)" },
  { c:T.amb,  l:T.ambL,  g:"linear-gradient(135deg,#f59e0b,#d97706)" },
  { c:T.em,   l:T.emL,   g:"linear-gradient(135deg,#10b981,#059669)" },
  { c:T.sky,  l:T.skyL,  g:"linear-gradient(135deg,#0ea5e9,#0284c7)" },
  { c:T.vio,  l:T.vioL,  g:"linear-gradient(135deg,#8b5cf6,#7c3aed)" },
  { c:T.rose, l:T.roseL, g:"linear-gradient(135deg,#f43f5e,#e11d48)" },
  { c:T.teal, l:T.tealL, g:"linear-gradient(135deg,#14b8a6,#0d9488)" },
  { c:T.ind,  l:T.indL,  g:"linear-gradient(135deg,#6366f1,#4f46e5)" },
];

/* ── DATA ── */
const STATS = { total:372, completed:89, in_progress:143, not_started:140, govt_score:43 };
const DEPTS = [
  {id:1, name:"6 Guarantees",        te:"6 హామీలు",         icon:"⭐",count:13},
  {id:2, name:"Agriculture",          te:"వ్యవసాయం",         icon:"🌾",count:39},
  {id:3, name:"Education",            te:"విద్య",            icon:"📚",count:35},
  {id:4, name:"Health",               te:"ఆరోగ్యం",          icon:"🏥",count:13},
  {id:5, name:"Housing & Land",       te:"గృహనిర్మాణం",      icon:"🏠",count:15},
  {id:6, name:"Youth & Employment",   te:"యువత & ఉపాధి",    icon:"💼",count:20},
  {id:7, name:"Industry & Economy",   te:"పరిశ్రమ",          icon:"🏭",count:9 },
  {id:8, name:"Transport",            te:"రవాణా",            icon:"🚌",count:13},
  {id:9, name:"Women & Child Welfare",te:"మహిళా సంక్షేమం",  icon:"👩‍👧",count:8 },
  {id:10,name:"SC, ST & BC Welfare",  te:"SC, ST & BC",      icon:"🤝",count:36},
  {id:11,name:"Minorities & Labour",  te:"మైనారిటీలు",       icon:"☪️",count:32},
  {id:12,name:"Urban Development",    te:"పట్టణాభివృద్ధి",   icon:"🏙️",count:19},
  {id:13,name:"Social Welfare",       te:"సామాజిక సంక్షేమం",icon:"👴",count:11},
  {id:14,name:"Governance & Law",     te:"పాలన",             icon:"🏛️",count:10},
  {id:15,name:"Environment & Sports", te:"పర్యావరణం",        icon:"🌿",count:25},
];
const PROG = {1:72,2:45,3:38,4:29,5:55,6:35,7:22,8:40,9:68,10:30,11:25,12:18,13:42,14:50,15:15};
const PROMISES = [
  {id:1, title:"Mahalakshmi — Rs. 2,500 monthly cash to every woman",             te:"మహాలక్ష్మి — ప్రతి మహిళకు నెలకు రూ. 2,500",         prog:100,status:"completed",  district:"All Districts",updated:"2024-06-01",flagship:true, did:1},
  {id:2, title:"Gruha Jyothi — 200 units free electricity every month",           te:"గృహ జ్యోతి — నెలకు 200 యూనిట్ల ఉచిత విద్యుత్",     prog:100,status:"completed",  district:"All Districts",updated:"2024-03-15",flagship:true, did:1},
  {id:3, title:"Rythu Bharosa — Rs. 15,000 per acre every year to farmers",       te:"రైతు భరోసా — ఎకరాకు సంవత్సరానికి రూ. 15,000",      prog:75, status:"in_progress",district:"All Districts",updated:"2024-08-20",flagship:true, did:1},
  {id:4, title:"Cheyutha — Rs. 4,000 monthly pension to senior citizens",         te:"చేయూత — వృద్ధులకు నెలకు రూ. 4,000 పెన్షన్",         prog:60, status:"in_progress",district:"All Districts",updated:"2024-07-10",flagship:true, did:1},
  {id:5, title:"Indiramma Indlu — House site + Rs. 5 lakh to homeless families",  te:"ఇందిరమ్మ ఇళ్లు — నిరుపేదలకు ఇల్లు + రూ. 5 లక్షలు", prog:30, status:"in_progress",district:"All Districts",updated:"2024-09-01",flagship:true, did:1},
  {id:6, title:"Yuva Vikasam — Rs. 5 lakh Vidya Bharosa Card for students",       te:"యువ వికాసం — విద్యార్థులకు రూ. 5 లక్షల కార్డు",      prog:45, status:"in_progress",district:"All Districts",updated:"2024-08-15",flagship:true, did:1},
  {id:7, title:"Waive off all crop loans up to Rs. 2 lakhs",                      te:"రూ. 2 లక్షల పంట రుణాల మాఫీ",                         prog:100,status:"completed",  district:"All Districts",updated:"2024-01-15",flagship:false,did:2},
  {id:8, title:"Fill 2 lakh government job vacancies in the first year",           te:"మొదటి సంవత్సరంలో 2 లక్షల ఉద్యోగాల భర్తీ",            prog:35, status:"in_progress",district:"All Districts",updated:"2024-09-10",flagship:false,did:6},
  {id:9, title:"One super specialty hospital in every district",                   te:"ప్రతి జిల్లాలో సూపర్ స్పెషాలిటీ హాస్పిటల్",          prog:20, status:"in_progress",district:"All Districts",updated:"2024-08-01",flagship:false,did:4},
  {id:10,title:"Reopen 6,000 closed government schools",                           te:"మూసివేసిన 6,000 పాఠశాలలను తెరవడం",                   prog:0,  status:"not_started", district:"All Districts",updated:"2024-01-01",flagship:false,did:3},
  {id:11,title:"Replace Dharani with transparent new BHUMATHA portal",             te:"ధరణి స్థానంలో పారదర్శక భూమాత పోర్టల్",              prog:85, status:"in_progress",district:"All Districts",updated:"2024-09-15",flagship:false,did:5},
  {id:12,title:"Metro rail extension: LB Nagar to BHEL via Mehdipatnam",           te:"ఎల్బీ నగర్ నుండి BHEL వరకు మెట్రో రైలు",             prog:15, status:"in_progress",district:"Hyderabad",    updated:"2024-07-20",flagship:false,did:12},
];

/* ── HELPERS ── */
function si(s){return({completed:{en:"Completed",te:"పూర్తయింది",c:T.em,bg:T.emL,icon:"✅"},in_progress:{en:"In Progress",te:"పురోగతిలో",c:T.sky,bg:T.skyL,icon:"🔄"},not_started:{en:"Not Started",te:"మొదలవలేదు",c:T.rose,bg:T.roseL,icon:"⏳"},partially_done:{en:"Partial",te:"కొంత పూర్తి",c:T.amb,bg:T.ambL,icon:"⚡"}}[s]||{en:"—",te:"—",c:T.ink4,bg:"#f3f4f6",icon:"•"});}
function pc(p){if(p===100)return T.em;if(p>=60)return T.sky;if(p>0)return T.amb;return T.rose;}
function ago(d){if(!d)return"—";const days=Math.floor((Date.now()-new Date(d))/86400000);if(days===0)return"Today";if(days===1)return"Yesterday";if(days<30)return`${days} days ago`;return`${Math.floor(days/30)}mo ago`;}

/* ── INTERSECTION REVEAL HOOK ── */
function useReveal(){
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);obs.disconnect();}},{threshold:0.1});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  return [ref,vis];
}

/* ── REVEAL WRAPPER ── */
function Reveal({children,delay=0,dir="up"}){
  const [ref,vis]=useReveal();
  const t={up:"translateY(40px)",left:"translateX(-40px)",right:"translateX(40px)",scale:"scale(0.88)"};
  return(
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?"none":t[dir]||t.up,transition:`opacity 0.7s ease ${delay}ms,transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`}}>
      {children}
    </div>
  );
}

/* ── ANIMATED COUNTER ── */
function Counter({to,color,suffix=""}){
  const [n,setN]=useState(0);
  const done=useRef(false);
  const [ref,vis]=useReveal();
  useEffect(()=>{
    if(!vis||done.current||!to)return;done.current=true;
    let c=0;const s=Math.max(1,Math.floor(to/55));
    const t=setInterval(()=>{c=Math.min(c+s,to);setN(c);if(c>=to)clearInterval(t);},14);
    return()=>clearInterval(t);
  },[vis,to]);
  return <span ref={ref} style={{color}}>{n}{suffix}</span>;
}

/* ── PROGRESS BAR ── */
function Bar({pct,h=12,color,delay=0}){
  const [w,setW]=useState(0);
  const col=color||pc(pct);
  const [ref,vis]=useReveal();
  useEffect(()=>{if(!vis)return;const t=setTimeout(()=>setW(pct),delay);return()=>clearTimeout(t);},[vis,pct,delay]);
  return(
    <div ref={ref} style={{height:h,background:"rgba(0,0,0,0.06)",borderRadius:999,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${w}%`,borderRadius:999,background:`linear-gradient(90deg,${col},${col}cc)`,transition:"width 1.6s cubic-bezier(0.16,1,0.3,1)",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)",animation:"shimmer 2.4s ease-in-out infinite"}}/>
      </div>
    </div>
  );
}

/* ── STATUS BADGE ── */
function Badge({status,lang}){
  const info=si(status);
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",fontSize:"0.9rem",fontWeight:800,padding:"0.38rem 0.95rem",borderRadius:999,background:info.bg,color:info.c,border:`1.5px solid ${info.c}33`,whiteSpace:"nowrap",flexShrink:0}}>
      {info.icon} {lang==="te"?info.te:info.en}
    </span>
  );
}

/* ── SCORE RING ── */
function Ring({score}){
  const r=72,circ=2*Math.PI*r;
  const [off,setOff]=useState(circ);
  const [ref,vis]=useReveal();
  useEffect(()=>{if(!vis)return;const t=setTimeout(()=>setOff(circ-(score/100)*circ),600);return()=>clearTimeout(t);},[vis,score]);
  const col=score>=70?T.em:score>=40?T.saf:T.rose;
  return(
    <div ref={ref} style={{position:"relative",width:192,height:192,flexShrink:0}}>
      <svg width="192" height="192" style={{transform:"rotate(-90deg)"}}>
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={col}/><stop offset="100%" stopColor={col+"88"}/></linearGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx="96" cy="96" r={r} fill="none" stroke="#f3f4f6" strokeWidth="18"/>
        <circle cx="96" cy="96" r={r} fill="none" stroke="url(#rg)" strokeWidth="18" strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" filter="url(#glow)" style={{transition:"stroke-dashoffset 2.4s cubic-bezier(0.16,1,0.3,1) 0.6s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:"3rem",fontWeight:900,color:col,lineHeight:1}}>{score}</span>
        <span style={{fontSize:"1rem",color:T.ink3,fontWeight:700}}>/100</span>
      </div>
    </div>
  );
}

/* ── PAGE HERO BAR (shared) ── */
function PageHero({title,sub,orb}){
  return(
    <div style={{background:T.hero,padding:"4rem 2rem 3.5rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",backgroundSize:"48px 48px"}}/>
      <div style={{position:"absolute",top:"-40%",right:"5%",width:"45vw",height:"45vw",background:`radial-gradient(circle,${orb||"rgba(249,115,22,0.14)"} 0%,transparent 70%)`,borderRadius:"50%"}}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:2}}>
        <h1 style={{fontSize:"clamp(2.2rem,4vw,3rem)",fontWeight:900,color:T.white,letterSpacing:"-0.02em",marginBottom:"0.4rem",animation:"fadeUp 0.7s ease both"}}>{title}</h1>
        <p style={{fontSize:"1.1rem",color:"#6b7280",fontWeight:600,animation:"fadeUp 0.7s ease 0.1s both"}}>{sub}</p>
      </div>
      <svg viewBox="0 0 1440 44" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",bottom:0,left:0,right:0,display:"block"}}>
        <path d="M0,22 C480,44 960,0 1440,22 L1440,44 L0,44 Z" fill="#f7f9ff"/>
      </svg>
    </div>
  );
}

/* ── NAVBAR ── */
function Nav({page,setPage,lang,setLang}){
  const [sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>30);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const links=[
    {id:"home",       en:"Dashboard",  te:"మొదటి పేజీ"},
    {id:"departments",en:"Departments",te:"విభాగాలు"},
    {id:"promises",   en:"Promises",   te:"హామీలు"},
    {id:"news",       en:"Updates",    te:"నవీకరణలు"},
    {id:"feedback",   en:"Feedback",   te:"అభిప్రాయం"},
  ];
  return(
    <header style={{position:"sticky",top:0,zIndex:500,background:sc?"rgba(255,255,255,0.96)":"rgba(255,255,255,0.82)",backdropFilter:"blur(28px) saturate(180%)",borderBottom:`1px solid ${sc?"rgba(0,0,0,0.08)":"transparent"}`,boxShadow:sc?"0 4px 40px rgba(0,0,0,0.08)":"none",transition:"all 0.45s cubic-bezier(0.16,1,0.3,1)",animation:"navSlide 0.7s cubic-bezier(0.16,1,0.3,1) both"}}>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"0 2rem",height:72,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1.5rem"}}>
        <button onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:"0.85rem",background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
          <div style={{width:46,height:46,borderRadius:14,background:"linear-gradient(135deg,#f97316,#ea580c)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",boxShadow:"0 6px 20px rgba(249,115,22,0.45)",transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.15) rotate(-8deg)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>🏛️</div>
          <div>
            <div style={{fontSize:"1.15rem",fontWeight:900,color:T.ink,lineHeight:1.15,letterSpacing:"-0.02em"}}>Commitment <span style={{color:T.saf}}>Tracker</span></div>
            <div style={{fontSize:"0.72rem",color:T.ink3,fontWeight:600,marginTop:1}}>Telangana · 2023–2028</div>
          </div>
        </button>
        <nav style={{display:"flex",gap:"0.15rem"}}>
          {links.map((l,i)=>(
            <button key={l.id} onClick={()=>setPage(l.id)} style={{padding:"0.5rem 1.1rem",borderRadius:10,border:"none",cursor:"pointer",fontSize:"0.95rem",fontWeight:700,color:page===l.id?T.safD:T.ink3,background:page===l.id?T.safL:"transparent",transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",animation:`fadeDown 0.55s ease ${0.1+i*0.07}s both`}} onMouseEnter={e=>{if(page!==l.id){e.currentTarget.style.background=T.snow;e.currentTarget.style.color=T.ink;}}} onMouseLeave={e=>{if(page!==l.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.ink3;}}}>
              {lang==="te"?l.te:l.en}
            </button>
          ))}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:"0.6rem",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.45rem",fontSize:"0.85rem",color:T.emD,fontWeight:800,background:T.emL,padding:"0.38rem 0.95rem",borderRadius:999,border:`1.5px solid ${T.em}33`}}>
            <span style={{width:8,height:8,background:T.em,borderRadius:"50%",display:"inline-block",animation:"livePulse 2s infinite"}}/>Live
          </div>
          <button onClick={()=>setLang(lang==="en"?"te":"en")} style={{fontSize:"0.9rem",fontWeight:800,padding:"0.45rem 1.1rem",border:`2px solid ${T.borderM}`,borderRadius:10,background:T.white,color:T.safD,cursor:"pointer",transition:"all 0.22s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.safL;e.currentTarget.style.borderColor=T.saf;}} onMouseLeave={e=>{e.currentTarget.style.background=T.white;e.currentTarget.style.borderColor=T.borderM;}}>
            {lang==="en"?"తెలుగు":"English"}
          </button>
          <button onClick={()=>setPage("admin")} style={{fontSize:"0.9rem",fontWeight:700,padding:"0.45rem 1.1rem",border:`2px solid ${T.borderM}`,borderRadius:10,background:"transparent",color:T.ink3,cursor:"pointer",transition:"all 0.22s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.snow;e.currentTarget.style.color=T.ink;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.ink3;}}>
            🔐 Admin
          </button>
        </div>
      </div>
    </header>
  );
}

/* ── HOME PAGE ── */
function Home({lang,setPage,setDept}){
  const [stats,setStats]=useState(STATS);
  useEffect(()=>{apiFetch("/api/promises/stats/overview").then(r=>r.data&&setStats(r.data));},[]);
  const flagship=PROMISES.filter(p=>p.flagship);
  const ficons=["💰","⚡","🌾","👴","🏠","🎓"];

  return(
    <>
      {/* ── DARK HERO ── */}
      <section style={{position:"relative",overflow:"hidden",background:T.hero,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
          <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60vw",height:"60vw",background:"radial-gradient(circle,rgba(249,115,22,0.18) 0%,transparent 70%)",animation:"orbFloat1 18s ease-in-out infinite",borderRadius:"50%"}}/>
          <div style={{position:"absolute",top:"30%",right:"-15%",width:"50vw",height:"50vw",background:"radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)",animation:"orbFloat2 22s ease-in-out infinite",borderRadius:"50%"}}/>
          <div style={{position:"absolute",bottom:"-10%",left:"30%",width:"40vw",height:"40vw",background:"radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 70%)",animation:"orbFloat3 16s ease-in-out infinite",borderRadius:"50%"}}/>
          <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",backgroundSize:"56px 56px"}}/>
        </div>
        <div style={{maxWidth:1280,margin:"0 auto",padding:"0 2rem",flex:1,display:"flex",alignItems:"center",paddingTop:"7rem",paddingBottom:"5rem",position:"relative",zIndex:2,gap:"4rem",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:320}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.55rem",fontSize:"0.92rem",fontWeight:800,color:T.saf,background:"rgba(249,115,22,0.12)",border:"1.5px solid rgba(249,115,22,0.25)",padding:"0.5rem 1.25rem",borderRadius:999,marginBottom:"2.25rem",animation:"fadeUp 0.8s ease both"}}>
              <span style={{width:8,height:8,background:T.saf,borderRadius:"50%",animation:"livePulse 2s infinite"}}/>
              🏛️ {lang==="te"?"తెలంగాణ · INC ప్రభుత్వం · 2023–2028":"Telangana · INC Government · 2023–2028"}
            </div>
            <h1 style={{fontSize:"clamp(3.2rem,6vw,5.6rem)",fontWeight:900,lineHeight:1.06,letterSpacing:"-0.03em",color:T.white,marginBottom:"1.6rem",animation:"fadeUp 0.8s ease 0.1s both"}}>
              {lang==="te"
                ?<><span style={{background:"linear-gradient(135deg,#f97316,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>ప్రతి హామీ</span><br/><span style={{color:"#e5e7eb"}}>ట్రాక్ చేయబడింది</span></>
                :<><span style={{background:"linear-gradient(135deg,#f97316,#f59e0b)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Every promise</span><br/><span style={{color:"#e5e7eb"}}>tracked openly.</span></>
              }
            </h1>
            <p style={{fontSize:"1.2rem",color:"#9ca3af",lineHeight:1.9,maxWidth:540,marginBottom:"3rem",fontWeight:600,animation:"fadeUp 0.8s ease 0.2s both"}}>
              {lang==="te"?"తెలంగాణ ప్రభుత్వం చేసిన 372 హామీలను విభాగాల వారీగా, జిల్లాల వారీగా స్పష్టంగా ట్రాక్ చేయండి.":"We track all 372 promises made by the Telangana government — clearly, honestly, and in real time for every citizen."}
            </p>
            <div style={{display:"flex",gap:"1rem",flexWrap:"wrap",animation:"fadeUp 0.8s ease 0.3s both"}}>
              <button onClick={()=>setPage("promises")} style={{padding:"1.1rem 2.4rem",borderRadius:16,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontWeight:900,fontSize:"1.1rem",boxShadow:"0 8px 32px rgba(249,115,22,0.5)",transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px) scale(1.04)";e.currentTarget.style.boxShadow="0 20px 48px rgba(249,115,22,0.6)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(249,115,22,0.5)";}}>
                {lang==="te"?"అన్ని 372 హామీలు →":"View All 372 Promises →"}
              </button>
              <button onClick={()=>setPage("departments")} style={{padding:"1.1rem 2.4rem",borderRadius:16,cursor:"pointer",border:"1.5px solid rgba(255,255,255,0.18)",background:"rgba(255,255,255,0.08)",color:"#e5e7eb",fontSize:"1.1rem",fontWeight:700,backdropFilter:"blur(8px)",transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.15)";e.currentTarget.style.borderColor="rgba(255,255,255,0.35)";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.08)";e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";e.currentTarget.style.transform="";}}>
                {lang==="te"?"విభాగాలు చూడండి":"Browse Departments"}
              </button>
            </div>
            <div style={{display:"flex",gap:"2.5rem",marginTop:"3.5rem",flexWrap:"wrap",animation:"fadeUp 0.8s ease 0.45s both"}}>
              {[{v:stats.total,l:lang==="te"?"మొత్తం హామీలు":"Total Promises",c:T.saf},{v:stats.completed,l:lang==="te"?"పూర్తయినవి":"Completed",c:T.em},{v:stats.in_progress,l:lang==="te"?"పురోగతిలో":"In Progress",c:T.sky}].map((s,i)=>(
                <div key={i}>
                  <div style={{fontSize:"2.6rem",fontWeight:900,lineHeight:1}}><Counter to={s.v} color={s.c}/></div>
                  <div style={{fontSize:"0.88rem",color:"#6b7280",fontWeight:600,marginTop:4}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Score glass card */}
          <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(32px) saturate(160%)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:32,padding:"2.75rem 3rem 2.5rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem",boxShadow:"0 24px 80px rgba(0,0,0,0.4)",animation:"scaleIn 0.85s cubic-bezier(0.34,1.56,0.64,1) 0.3s both",flexShrink:0}}>
            <Ring score={stats.govt_score||43}/>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:"1.25rem",fontWeight:900,color:T.white}}>{lang==="te"?"ప్రభుత్వ స్కోర్":"Government Score"}</div>
              <div style={{fontSize:"0.9rem",color:"#6b7280",fontWeight:600,marginTop:4}}>{lang==="te"?"372 హామీల ఆధారంగా":"Based on 372 promises"}</div>
            </div>
            <div style={{width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.85rem"}}>
              {[{l:lang==="te"?"పూర్తయినవి":"Completed",v:stats.completed,c:T.em,bg:"rgba(16,185,129,0.12)"},{l:lang==="te"?"పురోగతిలో":"In Progress",v:stats.in_progress,c:T.sky,bg:"rgba(14,165,233,0.12)"}].map((s,i)=>(
                <div key={i} style={{textAlign:"center",background:s.bg,borderRadius:16,padding:"1rem 0.75rem",border:`1px solid ${s.c}33`}}>
                  <div style={{fontSize:"2rem",fontWeight:900,lineHeight:1}}><Counter to={s.v} color={s.c}/></div>
                  <div style={{fontSize:"0.85rem",color:"#9ca3af",marginTop:4,fontWeight:700}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" style={{position:"relative",zIndex:2,display:"block",width:"100%",marginTop:"auto"}}>
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" fill="#f7f9ff"/>
        </svg>
      </section>

      <div style={{background:T.snow}}>
        {/* ── STAT CARDS ── */}
        <section style={{maxWidth:1280,margin:"0 auto",padding:"4rem 2rem 2rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"1.25rem"}}>
            {[
              {label:lang==="te"?"మొత్తం హామీలు":"Total Promises", v:stats.total,       c:T.saf,  g:"linear-gradient(135deg,#f97316,#ea580c)",icon:"📋"},
              {label:lang==="te"?"పూర్తయినవి":"Completed",          v:stats.completed,   c:T.em,   g:"linear-gradient(135deg,#10b981,#059669)",icon:"✅"},
              {label:lang==="te"?"పురోగతిలో":"In Progress",          v:stats.in_progress, c:T.sky,  g:"linear-gradient(135deg,#0ea5e9,#0284c7)",icon:"🔄"},
              {label:lang==="te"?"మొదలవలేదు":"Not Started",          v:stats.not_started, c:T.rose, g:"linear-gradient(135deg,#f43f5e,#e11d48)",icon:"⏳"},
            ].map((s,i)=>(
              <Reveal key={i} delay={i*80}>
                <div style={{background:T.white,borderRadius:24,padding:"2rem",border:`2px solid ${s.c}20`,boxShadow:`0 4px 24px ${s.c}14`,position:"relative",overflow:"hidden",transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow=`0 20px 56px ${s.c}28`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 24px ${s.c}14`;}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:s.g,borderRadius:"24px 24px 0 0"}}/>
                  <div style={{position:"absolute",bottom:-24,right:-24,width:100,height:100,background:s.g,borderRadius:"50%",opacity:0.07}}/>
                  <div style={{width:52,height:52,background:s.g,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.6rem",marginBottom:"1.1rem",boxShadow:`0 6px 18px ${s.c}40`}}>{s.icon}</div>
                  <div style={{fontSize:"3.4rem",fontWeight:900,lineHeight:1}}><Counter to={s.v||0} color={s.c}/></div>
                  <div style={{fontSize:"1.05rem",color:T.ink2,marginTop:"0.4rem",fontWeight:700}}>{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── 6 GUARANTEES ── */}
        <section style={{maxWidth:1280,margin:"0 auto",padding:"5rem 2rem 2rem"}}>
          <Reveal>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
              <div>
                <div style={{fontSize:"0.8rem",fontWeight:800,color:T.saf,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.4rem"}}>FLAGSHIP PROMISES</div>
                <h2 style={{fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:900,color:T.ink,letterSpacing:"-0.02em",marginBottom:"0.35rem"}}>⭐ {lang==="te"?"6 అభయ హస్తం హామీలు":"6 Abhaya Hastam Guarantees"}</h2>
                <p style={{fontSize:"1.05rem",color:T.ink3,fontWeight:600}}>{lang==="te"?"ప్రభుత్వం యొక్క అత్యంత ముఖ్యమైన వాగ్దానాలు":"The government's most important promises to every citizen"}</p>
              </div>
              <button onClick={()=>{setDept(1);setPage("promises");}} style={{fontSize:"1rem",fontWeight:800,color:T.safD,background:T.safL,border:`2px solid ${T.saf}44`,padding:"0.65rem 1.5rem",borderRadius:12,cursor:"pointer",transition:"all 0.25s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 20px ${T.saf}30`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="none";}}>
                {lang==="te"?"అన్నీ చూడండి →":"View all →"}
              </button>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(340px,1fr))",gap:"1.2rem"}}>
            {flagship.map((p,i)=>{
              const ac=DA[i]||DA[0];
              return(
                <Reveal key={p.id} delay={i*70}>
                  <div onClick={()=>setPage("promises")} style={{background:T.white,borderRadius:24,padding:"1.85rem",border:`2px solid ${ac.c}22`,boxShadow:`0 4px 20px ${ac.c}12`,cursor:"pointer",position:"relative",overflow:"hidden",transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-7px) scale(1.01)";e.currentTarget.style.boxShadow=`0 24px 60px ${ac.c}28`;e.currentTarget.style.borderColor=ac.c+"66";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 20px ${ac.c}12`;e.currentTarget.style.borderColor=ac.c+"22";}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:ac.g,borderRadius:"24px 24px 0 0"}}/>
                    <div style={{position:"absolute",bottom:-32,right:-32,width:120,height:120,background:ac.g,borderRadius:"50%",opacity:0.06}}/>
                    <div style={{width:46,height:46,background:ac.g,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",marginBottom:"1.1rem",boxShadow:`0 6px 18px ${ac.c}44`}}>{ficons[i]||"⭐"}</div>
                    <p style={{fontSize:"1.05rem",fontWeight:700,color:T.ink,lineHeight:1.65,marginBottom:"1.1rem"}}>{lang==="te"&&p.te?p.te:p.title}</p>
                    <div style={{marginBottom:"1rem"}}><Badge status={p.status} lang={lang}/></div>
                    <Bar pct={p.prog} h={12} color={ac.c} delay={i*80}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.8rem",alignItems:"center"}}>
                      <span style={{fontSize:"0.9rem",color:T.ink3,fontWeight:600}}>{ago(p.updated)}</span>
                      <span style={{fontSize:"1.6rem",fontWeight:900,color:ac.c}}>{p.prog}%</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── DEPARTMENTS PREVIEW ── */}
        <section style={{maxWidth:1280,margin:"0 auto",padding:"5rem 2rem 2rem"}}>
          <Reveal>
            <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"2rem",flexWrap:"wrap",gap:"1rem"}}>
              <div>
                <div style={{fontSize:"0.8rem",fontWeight:800,color:T.sky,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.4rem"}}>DEPARTMENTS</div>
                <h2 style={{fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:900,color:T.ink,letterSpacing:"-0.02em",marginBottom:"0.35rem"}}>{lang==="te"?"విభాగాల వారీగా చూడండి":"Browse by Department"}</h2>
                <p style={{fontSize:"1.05rem",color:T.ink3,fontWeight:600}}>15 {lang==="te"?"విభాగాలు · 372 హామీలు":"departments · 372 promises"}</p>
              </div>
              <button onClick={()=>setPage("departments")} style={{fontSize:"1rem",fontWeight:800,color:T.skyD,background:T.skyL,border:`2px solid ${T.sky}44`,padding:"0.65rem 1.5rem",borderRadius:12,cursor:"pointer",transition:"all 0.25s",whiteSpace:"nowrap"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";}}>
                {lang==="te"?"అన్ని విభాగాలు →":"All departments →"}
              </button>
            </div>
          </Reveal>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:"1.1rem"}}>
            {DEPTS.map((d,i)=>{
              const dc=DA[i];const pct=PROG[d.id]||30;
              return(
                <Reveal key={d.id} delay={i*40}>
                  <button onClick={()=>{setDept(d.id);setPage("promises");}} style={{background:T.white,border:`2px solid ${dc.c}22`,borderRadius:22,padding:"1.65rem",cursor:"pointer",textAlign:"left",width:"100%",boxShadow:`0 4px 18px ${dc.c}10`,transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow=`0 28px 64px ${dc.c}35`;e.currentTarget.style.borderColor=dc.c+"88";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 18px ${dc.c}10`;e.currentTarget.style.borderColor=dc.c+"22";}}>
                    <div style={{position:"absolute",bottom:-28,right:-28,width:110,height:110,background:dc.g,borderRadius:"50%",opacity:0.06}}/>
                    <div style={{width:54,height:54,background:dc.g,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.65rem",marginBottom:"1rem",boxShadow:`0 6px 18px ${dc.c}45`}}>{d.icon}</div>
                    <div style={{fontSize:"1.05rem",fontWeight:800,color:T.ink,marginBottom:"0.2rem",lineHeight:1.3}}>{lang==="te"?d.te:d.name}</div>
                    <div style={{fontSize:"0.92rem",color:T.ink3,marginBottom:"1.2rem",fontWeight:600}}>{d.count} {lang==="te"?"హామీలు":"promises"}</div>
                    <Bar pct={pct} h={10} color={dc.c} delay={i*55}/>
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.5rem"}}>
                      <span style={{fontSize:"1.1rem",fontWeight:900,color:dc.c}}>{pct}%</span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ── RECENT UPDATES ── */}
        <section style={{maxWidth:1280,margin:"0 auto",padding:"5rem 2rem 6rem"}}>
          <Reveal>
            <div style={{fontSize:"0.8rem",fontWeight:800,color:T.vio,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:"0.4rem"}}>RECENT</div>
            <h2 style={{fontSize:"clamp(1.8rem,3vw,2.4rem)",fontWeight:900,color:T.ink,letterSpacing:"-0.02em",marginBottom:"0.35rem"}}>🕐 {lang==="te"?"తాజా నవీకరణలు":"Recent Updates"}</h2>
            <p style={{fontSize:"1.05rem",color:T.ink3,fontWeight:600,marginBottom:"2rem"}}>{lang==="te"?"చివరిగా అప్‌డేట్ చేయబడిన హామీలు":"Most recently updated promises"}</p>
          </Reveal>
          <div style={{display:"flex",flexDirection:"column",gap:"0.9rem"}}>
            {PROMISES.slice(0,5).map((p,i)=>{
              const dc=DA[i];
              return(
                <Reveal key={p.id} delay={i*65} dir="left">
                  <div onClick={()=>setPage("promises")} style={{background:T.white,border:`2px solid ${dc.c}22`,borderRadius:22,padding:"1.5rem 1.85rem",display:"grid",gridTemplateColumns:"4rem 1fr 9rem",gap:"1.5rem",alignItems:"center",cursor:"pointer",boxShadow:`0 3px 16px ${dc.c}10`,transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 16px 48px ${dc.c}28`;e.currentTarget.style.borderColor=dc.c+"66";e.currentTarget.style.transform="translateX(8px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 3px 16px ${dc.c}10`;e.currentTarget.style.borderColor=dc.c+"22";e.currentTarget.style.transform="";}}>
                    <div style={{width:50,height:50,background:dc.g,borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.25rem",fontWeight:900,color:"#fff",boxShadow:`0 6px 18px ${dc.c}44`,flexShrink:0}}>{i+1}</div>
                    <div>
                      <div style={{fontSize:"1.05rem",fontWeight:700,color:T.ink,marginBottom:"0.6rem",lineHeight:1.55}}>{lang==="te"&&p.te?p.te:p.title}</div>
                      <div style={{display:"flex",gap:"0.6rem",flexWrap:"wrap",alignItems:"center"}}>
                        <Badge status={p.status} lang={lang}/>
                        <span style={{fontSize:"0.9rem",color:T.ink3,fontWeight:600}}>📍 {p.district}</span>
                        <span style={{fontSize:"0.9rem",color:T.ink3,fontWeight:600}}>🕐 {ago(p.updated)}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{fontSize:"1.85rem",fontWeight:900,color:dc.c,textAlign:"right",marginBottom:"0.5rem"}}>{p.prog}%</div>
                      <Bar pct={p.prog} h={10} color={dc.c} delay={i*65}/>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

/* ── PROMISES PAGE ── */
function Promises({lang,dept,setDept}){
  const [all,setAll]=useState([]);
  const [status,setStatus]=useState("");
  const [search,setSearch]=useState("");
  const [district,setDistrict]=useState("");
  const [voted,setVoted]=useState({});
  const DISTRICTS=["","Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Nalgonda","Adilabad","Rangareddy","Medak","Mahabubabad"];
  const SS={padding:"0.85rem 1.15rem",border:`2px solid ${T.border}`,borderRadius:14,background:T.white,color:T.ink,fontSize:"1rem",fontWeight:600,outline:"none",cursor:"pointer",fontFamily:"inherit",transition:"all 0.22s"};
  useEffect(()=>{
    let f=[...PROMISES];
    if(dept)f=f.filter(x=>x.did===dept);
    if(status)f=f.filter(x=>x.status===status);
    if(search)f=f.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()));
    setAll(f);
    const qp={};if(dept)qp.department_id=dept;if(status)qp.status=status;if(search)qp.search=search;
    apiFetch(`/api/promises/?${new URLSearchParams(qp)}`).then(r=>{if(r.data?.length)setAll(r.data);});
  },[dept,status,search,district]);
  const dd=DEPTS.find(d=>d.id===dept);
  return(
    <div style={{background:T.snow,minHeight:"100vh"}}>
      <PageHero title={dept?(dd?.icon+" "+(lang==="te"?dd?.te:dd?.name)||""):(lang==="te"?"అన్ని హామీలు":"All Promises")} sub={lang==="te"?"వెతకండి, ఫిల్టర్ చేయండి":"Search and filter all 372 government promises"} orb="rgba(249,115,22,0.14)"/>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"2.5rem 2rem 6rem"}}>
        <div style={{display:"flex",gap:"0.85rem",marginBottom:"1.75rem",flexWrap:"wrap",background:T.white,border:`2px solid ${T.border}`,borderRadius:20,padding:"1.1rem",boxShadow:T.sh}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="te"?"హామీలను వెతకండి...":"Search any promise..."} style={{...SS,minWidth:240,flexGrow:1}} onFocus={e=>{e.target.style.borderColor=T.saf;e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.12)";}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
          <select value={dept||""} onChange={e=>setDept(e.target.value?Number(e.target.value):null)} style={SS} onFocus={e=>e.target.style.borderColor=T.saf} onBlur={e=>e.target.style.borderColor=T.border}>
            <option value="">{lang==="te"?"అన్ని విభాగాలు":"All Departments"}</option>
            {DEPTS.map(d=><option key={d.id} value={d.id}>{d.icon} {lang==="te"?d.te:d.name}</option>)}
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)} style={SS} onFocus={e=>e.target.style.borderColor=T.saf} onBlur={e=>e.target.style.borderColor=T.border}>
            <option value="">{lang==="te"?"అన్ని స్థితులు":"All Status"}</option>
            <option value="completed">{lang==="te"?"పూర్తయినవి":"Completed"}</option>
            <option value="in_progress">{lang==="te"?"పురోగతిలో":"In Progress"}</option>
            <option value="not_started">{lang==="te"?"మొదలవలేదు":"Not Started"}</option>
          </select>
          <select value={district} onChange={e=>setDistrict(e.target.value)} style={SS} onFocus={e=>e.target.style.borderColor=T.saf} onBlur={e=>e.target.style.borderColor=T.border}>
            <option value="">{lang==="te"?"అన్ని జిల్లాలు":"All Districts"}</option>
            {DISTRICTS.filter(Boolean).map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div style={{fontSize:"1rem",color:T.ink3,marginBottom:"1.25rem",fontWeight:700}}>{all.length} {lang==="te"?"హామీలు కనుగొనబడ్డాయి":"promises found"}</div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.9rem"}}>
          {all.map((p,i)=>{
            const dc=DA[i%DA.length];
            return(
              <Reveal key={p.id} delay={Math.min(i,6)*50}>
                <div style={{background:T.white,border:`2px solid ${dc.c}20`,borderRadius:22,padding:"1.65rem 1.9rem",boxShadow:`0 3px 16px ${dc.c}08`,transition:"all 0.35s cubic-bezier(0.16,1,0.3,1)"}} onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 16px 48px ${dc.c}24`;e.currentTarget.style.borderColor=dc.c+"55";e.currentTarget.style.transform="translateX(6px)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow=`0 3px 16px ${dc.c}08`;e.currentTarget.style.borderColor=dc.c+"20";e.currentTarget.style.transform="";}}>
                  <div style={{display:"grid",gridTemplateColumns:"3.5rem 1fr auto",gap:"1.4rem",alignItems:"start"}}>
                    <div style={{width:46,height:46,background:dc.g,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1rem",fontWeight:900,color:"#fff",boxShadow:`0 4px 14px ${dc.c}44`,flexShrink:0}}>{String(p.id).padStart(2,"0")}</div>
                    <div>
                      <div style={{fontSize:"1.1rem",fontWeight:700,color:T.ink,marginBottom:"0.85rem",lineHeight:1.6}}>{lang==="te"&&p.te?p.te:p.title}</div>
                      <div style={{display:"flex",gap:"0.65rem",flexWrap:"wrap",marginBottom:"0.9rem",alignItems:"center"}}>
                        <Badge status={p.status} lang={lang}/>
                        <span style={{fontSize:"0.92rem",color:T.ink3,fontWeight:600}}>📍 {p.district||"All Districts"}</span>
                        <span style={{fontSize:"0.92rem",color:T.ink3,fontWeight:600}}>🕐 {ago(p.updated||p.last_updated)}</span>
                      </div>
                      <Bar pct={p.prog||p.progress||0} h={12} color={dc.c} delay={i*40}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"0.7rem"}}>
                      <div style={{fontSize:"2rem",fontWeight:900,color:dc.c}}>{p.prog||p.progress||0}%</div>
                      <button onClick={()=>{if(!voted[p.id]){setVoted(v=>({...v,[p.id]:true}));apiFetch(`/api/promises/${p.id}/vote`,{method:"POST"});}}} style={{fontSize:"0.9rem",padding:"0.45rem 1.05rem",border:`2px solid ${T.border}`,borderRadius:999,background:voted[p.id]?T.safL:"transparent",color:voted[p.id]?T.safD:T.ink3,cursor:"pointer",transition:"all 0.22s",fontWeight:800,whiteSpace:"nowrap"}}>
                        {voted[p.id]?"👍 Voted!":"👍 Important"}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── DEPARTMENTS PAGE ── */
function Departments({lang,setDept,setPage}){
  return(
    <div style={{background:T.snow,minHeight:"100vh"}}>
      <PageHero title={lang==="te"?"అన్ని విభాగాలు":"All Departments"} sub={lang==="te"?"15 విభాగాల వారీగా 372 హామీలు":"Browse all 372 promises across 15 departments"} orb="rgba(14,165,233,0.14)"/>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"3rem 2rem 6rem"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(285px,1fr))",gap:"1.2rem"}}>
          {DEPTS.map((d,i)=>{
            const dc=DA[i];const pct=PROG[d.id]||30;
            return(
              <Reveal key={d.id} delay={i*45}>
                <button onClick={()=>{setDept(d.id);setPage("promises");}} style={{background:T.white,border:`2px solid ${dc.c}22`,borderRadius:24,padding:"2.1rem",cursor:"pointer",textAlign:"left",width:"100%",boxShadow:`0 4px 20px ${dc.c}10`,transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-8px) scale(1.02)";e.currentTarget.style.boxShadow=`0 28px 64px ${dc.c}35`;e.currentTarget.style.borderColor=dc.c+"99";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 20px ${dc.c}10`;e.currentTarget.style.borderColor=dc.c+"22";}}>
                  <div style={{position:"absolute",bottom:-32,right:-32,width:130,height:130,background:dc.g,borderRadius:"50%",opacity:0.06}}/>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:dc.g,borderRadius:"24px 24px 0 0"}}/>
                  <div style={{width:60,height:60,background:dc.g,borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",marginBottom:"1.1rem",boxShadow:`0 8px 24px ${dc.c}50`}}>{d.icon}</div>
                  <div style={{fontSize:"1.15rem",fontWeight:900,color:T.ink,marginBottom:"0.3rem",lineHeight:1.3}}>{lang==="te"?d.te:d.name}</div>
                  <div style={{fontSize:"1rem",color:T.ink3,marginBottom:"1.5rem",fontWeight:600}}>{d.count} {lang==="te"?"హామీలు":"promises"}</div>
                  <Bar pct={pct} h={11} color={dc.c} delay={i*60}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.65rem"}}>
                    <span style={{fontSize:"0.95rem",color:T.ink3,fontWeight:600}}>{lang==="te"?"పురోగతి":"Progress"}</span>
                    <span style={{fontSize:"1.2rem",fontWeight:900,color:dc.c}}>{pct}%</span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── NEWS PAGE ── */
function News({lang}){
  const articles=[
    {id:1,title:"Rythu Bharosa payments released for Kharif 2024",              te:"ఖరీఫ్ 2024 కు రైతు భరోసా చెల్లింపులు విడుదల",                  body:"The Telangana government released Rs. 7,200 crores for the 2024 Kharif season, directly benefiting 52 lakh farmers across the state.",date:"2024-09-10",tag:"Agriculture",ac:DA[1]},
    {id:2,title:"Gruha Jyothi: 200 units free electricity now active statewide",  te:"గృహ జ్యోతి: 200 యూనిట్ల ఉచిత విద్యుత్ అమలు",                  body:"Over 1.2 crore households are now receiving 200 units of free electricity each month under the Gruha Jyothi scheme.",               date:"2024-08-22",tag:"Energy",     ac:DA[0]},
    {id:3,title:"Crop loan waiver: 22 lakh farmers benefited in Phase 1",         te:"పంట రుణాల మాఫీ: మొదటి దశలో 22 లక్షల రైతులకు లాభం",            body:"Loans up to Rs. 2 lakhs waived for 22 lakh farmers in Phase 1. Phase 2 for remaining farmers is currently underway.",                date:"2024-07-15",tag:"Agriculture",ac:DA[5]},
    {id:4,title:"6,000 school reopening promise — seriously behind schedule",     te:"6,000 పాఠశాలల పునఃప్రారంభం హామీ — తీవ్ర జాప్యం",              body:"Only 847 of the promised 6,000 closed government schools have been reopened so far, with budget constraints cited as the main reason.", date:"2024-09-01",tag:"Education",   ac:DA[2]},
  ];
  return(
    <div style={{background:T.snow,minHeight:"100vh"}}>
      <PageHero title={lang==="te"?"తాజా నవీకరణలు":"Latest Updates"} sub={lang==="te"?"ప్రభుత్వ పనితీరుపై నవీనమైన వార్తలు":"Latest news on government promise delivery"} orb="rgba(139,92,246,0.14)"/>
      <div style={{maxWidth:920,margin:"0 auto",padding:"3rem 2rem 6rem"}}>
        <div style={{display:"flex",flexDirection:"column",gap:"1.3rem"}}>
          {articles.map((n,i)=>(
            <Reveal key={n.id} delay={i*80}>
              <div style={{background:T.white,border:`2px solid ${n.ac.c}22`,borderRadius:24,padding:"2.2rem",boxShadow:`0 4px 20px ${n.ac.c}10`,transition:"all 0.4s cubic-bezier(0.34,1.56,0.64,1)",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=`0 20px 56px ${n.ac.c}28`;e.currentTarget.style.borderColor=n.ac.c+"66";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=`0 4px 20px ${n.ac.c}10`;e.currentTarget.style.borderColor=n.ac.c+"22";}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:n.ac.g,borderRadius:"24px 24px 0 0"}}/>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.1rem",flexWrap:"wrap",gap:"0.6rem"}}>
                  <span style={{fontSize:"0.9rem",fontWeight:800,padding:"0.4rem 1.05rem",borderRadius:999,background:n.ac.l,color:n.ac.c,border:`1.5px solid ${n.ac.c}44`}}>{n.tag}</span>
                  <span style={{fontSize:"0.95rem",color:T.ink3,fontWeight:600}}>📅 {new Date(n.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
                </div>
                <h3 style={{fontSize:"1.3rem",fontWeight:800,color:T.ink,marginBottom:"0.9rem",lineHeight:1.5,letterSpacing:"-0.01em"}}>{lang==="te"&&n.te?n.te:n.title}</h3>
                <p style={{fontSize:"1.05rem",color:T.ink2,lineHeight:1.9,fontWeight:600}}>{n.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── FEEDBACK PAGE ── */
function Feedback({lang}){
  const [form,setForm]=useState({citizen_name:"",district:"",message:""});
  const [busy,setBusy]=useState(false);
  const [done,setDone]=useState(false);
  const [err,setErr]=useState("");
  const DISTRICTS=["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Nalgonda","Adilabad","Rangareddy","Medak","Mahabubabad","Other"];
  const IS={width:"100%",padding:"1.05rem 1.2rem",border:`2px solid ${T.border}`,borderRadius:14,background:T.white,color:T.ink,fontSize:"1.05rem",fontWeight:600,outline:"none",fontFamily:"inherit",transition:"all 0.22s"};
  const submit=async()=>{
    if(!form.message.trim()){setErr(lang==="te"?"దయచేసి సందేశం నమోదు చేయండి":"Please enter your message.");return;}
    setBusy(true);setErr("");
    await apiFetch("/api/feedback/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    setDone(true);setBusy(false);
  };
  if(done)return(
    <div style={{background:T.snow,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{background:T.white,border:`2px solid ${T.em}33`,borderRadius:32,padding:"4rem",boxShadow:T.shH,textAlign:"center",maxWidth:560,animation:"scaleIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both"}}>
        <div style={{fontSize:"5rem",marginBottom:"1.25rem",animation:"bounceIn 0.8s cubic-bezier(0.34,1.56,0.64,1) both"}}>✅</div>
        <h2 style={{fontSize:"2.2rem",fontWeight:900,color:T.emD,marginBottom:"0.75rem",letterSpacing:"-0.02em"}}>{lang==="te"?"అభిప్రాయం నమోదు అయింది!":"Feedback Submitted!"}</h2>
        <p style={{color:T.ink2,lineHeight:1.9,fontSize:"1.1rem",fontWeight:600}}>{lang==="te"?"మీ అభిప్రాయానికి ధన్యవాదాలు.":"Thank you! Your feedback has been submitted and the admin will review it shortly."}</p>
        <button onClick={()=>{setDone(false);setForm({citizen_name:"",district:"",message:""}); }} style={{marginTop:"2rem",padding:"1.05rem 2.5rem",background:"linear-gradient(135deg,#10b981,#059669)",border:"none",borderRadius:16,color:"#fff",cursor:"pointer",fontWeight:900,fontSize:"1.1rem",boxShadow:"0 8px 28px rgba(16,185,129,0.4)",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"} onMouseLeave={e=>e.currentTarget.style.transform=""}>
          {lang==="te"?"మళ్ళీ సమర్పించండి":"Submit Another"}
        </button>
      </div>
    </div>
  );
  return(
    <div style={{background:T.snow,minHeight:"100vh"}}>
      <PageHero title={lang==="te"?"మీ అభిప్రాయం తెలపండి":"Share Your Feedback"} sub={lang==="te"?"మీ గొంతు ముఖ్యమైనది":"Your voice helps hold the government accountable"} orb="rgba(16,185,129,0.14)"/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"3rem 2rem 6rem"}}>
        <Reveal>
          <p style={{color:T.ink2,marginBottom:"2.5rem",lineHeight:1.9,fontSize:"1.1rem",fontWeight:600}}>{lang==="te"?"మీ ప్రాంతంలో హామీ అమలును మీరు చూశారా? మాకు తెలియజేయండి.":"Have you seen any promise being delivered in your area? Tell us — your feedback matters."}</p>
        </Reveal>
        <Reveal delay={100}>
          <div style={{background:T.white,border:`2px solid ${T.border}`,borderRadius:28,padding:"2.75rem",boxShadow:T.shH,display:"flex",flexDirection:"column",gap:"1.6rem"}}>
            <div>
              <label style={{display:"block",fontSize:"1.05rem",fontWeight:800,color:T.ink2,marginBottom:"0.65rem"}}>{lang==="te"?"మీ పేరు (ఐచ్ఛికం)":"Your Name (Optional)"}</label>
              <input style={IS} placeholder={lang==="te"?"మీ పేరు నమోదు చేయండి...":"Enter your name..."} value={form.citizen_name} onChange={e=>setForm(p=>({...p,citizen_name:e.target.value}))} onFocus={e=>{e.target.style.borderColor=T.saf;e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.12)";}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
            </div>
            <div>
              <label style={{display:"block",fontSize:"1.05rem",fontWeight:800,color:T.ink2,marginBottom:"0.65rem"}}>{lang==="te"?"మీ జిల్లా":"Your District"}</label>
              <select style={{...IS,cursor:"pointer"}} value={form.district} onChange={e=>setForm(p=>({...p,district:e.target.value}))} onFocus={e=>{e.target.style.borderColor=T.saf;e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.12)";}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}>
                <option value="">{lang==="te"?"మీ జిల్లాను ఎంచుకోండి...":"Select your district..."}</option>
                {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block",fontSize:"1.05rem",fontWeight:800,color:T.ink2,marginBottom:"0.65rem"}}>{lang==="te"?"మీ సందేశం *":"Your Message *"}</label>
              <textarea style={{...IS,height:170,resize:"vertical"}} placeholder={lang==="te"?"మీ ప్రాంతంలో ఏం జరుగుతుందో స్పష్టంగా వివరించండి...":"Describe clearly what you observed in your area..."} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} onFocus={e=>{e.target.style.borderColor=T.saf;e.target.style.boxShadow="0 0 0 4px rgba(249,115,22,0.12)";}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
            </div>
            {err&&<div style={{fontSize:"1rem",color:T.roseD,background:T.roseL,padding:"0.9rem 1.2rem",borderRadius:12,fontWeight:700,border:`1.5px solid ${T.rose}33`}}>{err}</div>}
            <button onClick={submit} disabled={busy} style={{padding:"1.15rem",borderRadius:16,border:"none",cursor:busy?"not-allowed":"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontWeight:900,fontSize:"1.15rem",boxShadow:"0 8px 32px rgba(249,115,22,0.4)",opacity:busy?0.7:1,transition:"all 0.3s"}} onMouseEnter={e=>{if(!busy){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 48px rgba(249,115,22,0.55)";;}}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 8px 32px rgba(249,115,22,0.4)";}}>
              {busy?"⏳ "+(lang==="te"?"సమర్పిస్తోంది...":"Submitting..."):(lang==="te"?"📤 సమర్పించండి":"📤 Submit Feedback")}
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

/* ── ADMIN PAGE — no email prefill, no password hint ── */
function Admin(){
  const [token,setToken]=useState(null);
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const [promises,setPromises]=useState(PROMISES);
  const [updating,setUpdating]=useState(null);
  const [uf,setUf]=useState({progress:0,status:"not_started",note:"",source_link:""});
  const [feedback,setFeedback]=useState([]);
  const [tab,setTab]=useState("promises");
  const IS={width:"100%",padding:"0.95rem 1.1rem",border:`2px solid ${T.border}`,borderRadius:13,background:T.snow,color:T.ink,fontSize:"1rem",fontWeight:600,outline:"none",fontFamily:"inherit"};
  const login=async()=>{
    if(!email||!pass){setErr("Please enter your email and password.");return;}
    setBusy(true);setErr("");
    const r=await apiFetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})});
    if(r.token){
      setToken(r.token);
      apiFetch("/api/promises/").then(x=>x.data?.length&&setPromises(x.data));
      apiFetch("/api/feedback/",{headers:{Authorization:`Bearer ${r.token}`}}).then(x=>x.data&&setFeedback(x.data));
    }else setErr(r.detail||"Invalid credentials. Please try again.");
    setBusy(false);
  };
  if(!token)return(
    <div style={{background:T.snow,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
      <div style={{animation:"scaleIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both",width:"100%",maxWidth:460}}>
        <div style={{background:T.white,border:`2px solid ${T.border}`,borderRadius:32,padding:"3.5rem",boxShadow:T.shXL,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-50,right:-50,width:200,height:200,background:"linear-gradient(135deg,rgba(249,115,22,0.08),rgba(139,92,246,0.08))",borderRadius:"50%"}}/>
          <div style={{textAlign:"center",marginBottom:"2.5rem",position:"relative"}}>
            <div style={{width:72,height:72,background:"linear-gradient(135deg,#f97316,#ea580c)",borderRadius:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2rem",margin:"0 auto 1.25rem",boxShadow:"0 12px 32px rgba(249,115,22,0.4)"}}>🔐</div>
            <h1 style={{fontSize:"2rem",fontWeight:900,color:T.ink,letterSpacing:"-0.02em"}}>Admin Login</h1>
            <p style={{fontSize:"1rem",color:T.ink3,marginTop:"0.4rem",fontWeight:600}}>Commitment Tracker — Secure Access</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"1.15rem",position:"relative"}}>
            <div>
              <label style={{display:"block",fontSize:"0.95rem",fontWeight:800,color:T.ink2,marginBottom:"0.5rem"}}>Email Address</label>
              <input type="email" style={IS} placeholder="Enter your admin email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={e=>e.target.style.borderColor=T.saf} onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            <div>
              <label style={{display:"block",fontSize:"0.95rem",fontWeight:800,color:T.ink2,marginBottom:"0.5rem"}}>Password</label>
              <input type="password" style={IS} placeholder="Enter your password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} onFocus={e=>e.target.style.borderColor=T.saf} onBlur={e=>e.target.style.borderColor=T.border}/>
            </div>
            {err&&<div style={{fontSize:"0.98rem",color:T.roseD,background:T.roseL,padding:"0.8rem 1.1rem",borderRadius:11,fontWeight:700,border:`1.5px solid ${T.rose}33`}}>{err}</div>}
            <button onClick={login} disabled={busy} style={{padding:"1.05rem",borderRadius:16,border:"none",cursor:busy?"not-allowed":"pointer",background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",fontWeight:900,fontSize:"1.1rem",boxShadow:"0 8px 28px rgba(249,115,22,0.4)",opacity:busy?0.7:1,marginTop:"0.25rem",transition:"all 0.3s"}}>
              {busy?"Logging in...":"Login →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return(
    <div style={{background:T.snow,minHeight:"100vh"}}>
      <PageHero title="🔐 Admin Dashboard" sub="Manage and update all promises" orb="rgba(249,115,22,0.12)"/>
      <div style={{maxWidth:1280,margin:"0 auto",padding:"2.5rem 2rem 6rem"}}>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"1.75rem"}}>
          <button onClick={()=>setToken(null)} style={{padding:"0.65rem 1.4rem",border:`2px solid ${T.border}`,borderRadius:12,background:"transparent",color:T.ink3,cursor:"pointer",fontSize:"1rem",fontWeight:700,transition:"all 0.22s"}} onMouseEnter={e=>{e.currentTarget.style.background=T.snow;e.currentTarget.style.color=T.ink;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.ink3;}}>Logout</button>
        </div>
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"2rem",background:"#f3f4f6",borderRadius:16,padding:"0.4rem",width:"fit-content",border:`2px solid ${T.border}`}}>
          {["promises","feedback"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"0.65rem 1.75rem",borderRadius:12,border:"none",cursor:"pointer",fontSize:"1rem",fontWeight:800,background:tab===t?T.white:"transparent",color:tab===t?T.safD:T.ink3,boxShadow:tab===t?T.sh:"none",transition:"all 0.25s"}}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
        {tab==="promises"&&(
          <div style={{display:"flex",flexDirection:"column",gap:"0.9rem"}}>
            {promises.map((p,pi)=>{
              const isU=updating===p.id;const dc=DA[pi%DA.length];
              return(
                <div key={p.id} style={{background:T.white,border:`2px solid ${T.border}`,borderRadius:22,padding:"1.55rem 1.9rem",boxShadow:T.sh}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1.25rem"}}>
                    <div style={{flex:1}}>
                      <div style={{fontSize:"1.05rem",fontWeight:700,color:T.ink,marginBottom:"0.65rem",lineHeight:1.55}}>{p.title}</div>
                      <div style={{display:"flex",gap:"0.65rem",alignItems:"center"}}>
                        <Badge status={p.status} lang="en"/>
                        <span style={{fontSize:"1.1rem",fontWeight:900,color:dc.c}}>{p.prog||p.progress||0}%</span>
                      </div>
                    </div>
                    <button onClick={()=>{setUpdating(isU?null:p.id);setUf({progress:p.prog||p.progress||0,status:p.status,note:"",source_link:""}); }} style={{padding:"0.55rem 1.3rem",border:`2px solid ${T.saf}`,borderRadius:12,background:isU?T.safL:"transparent",color:T.safD,cursor:"pointer",fontSize:"0.95rem",fontWeight:800,whiteSpace:"nowrap",transition:"all 0.22s"}}>
                      {isU?"✕ Cancel":"✏️ Update"}
                    </button>
                  </div>
                  {isU&&(
                    <div style={{borderTop:`2px solid ${T.border}`,paddingTop:"1.35rem",marginTop:"1.35rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.1rem",animation:"fadeUp 0.3s ease both"}}>
                      <div>
                        <label style={{display:"block",fontSize:"0.95rem",fontWeight:800,color:T.ink2,marginBottom:"0.4rem"}}>Progress: {uf.progress}%</label>
                        <input type="range" min={0} max={100} value={uf.progress} onChange={e=>setUf(f=>({...f,progress:Number(e.target.value)}))} style={{width:"100%",accentColor:T.saf}}/>
                      </div>
                      <div>
                        <label style={{display:"block",fontSize:"0.95rem",fontWeight:800,color:T.ink2,marginBottom:"0.4rem"}}>Status</label>
                        <select value={uf.status} onChange={e=>setUf(f=>({...f,status:e.target.value}))} style={{width:"100%",padding:"0.65rem 0.9rem",border:`2px solid ${T.border}`,borderRadius:11,background:T.snow,color:T.ink,fontSize:"0.95rem",fontWeight:600,outline:"none",fontFamily:"inherit",cursor:"pointer"}}>
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="partially_done">Partially Done</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div style={{gridColumn:"span 2"}}>
                        <label style={{display:"block",fontSize:"0.95rem",fontWeight:800,color:T.ink2,marginBottom:"0.4rem"}}>What changed? (Note) *</label>
                        <input style={{width:"100%",padding:"0.85rem 1rem",border:`2px solid ${T.border}`,borderRadius:11,background:T.snow,color:T.ink,fontSize:"0.95rem",fontWeight:600,outline:"none",fontFamily:"inherit"}} placeholder="Describe what changed clearly..." value={uf.note} onChange={e=>setUf(f=>({...f,note:e.target.value}))}/>
                      </div>
                      <div style={{gridColumn:"span 2"}}>
                        <label style={{display:"block",fontSize:"0.95rem",fontWeight:800,color:T.ink2,marginBottom:"0.4rem"}}>Source Link</label>
                        <input style={{width:"100%",padding:"0.85rem 1rem",border:`2px solid ${T.border}`,borderRadius:11,background:T.snow,color:T.ink,fontSize:"0.95rem",fontWeight:600,outline:"none",fontFamily:"inherit"}} placeholder="https://..." value={uf.source_link} onChange={e=>setUf(f=>({...f,source_link:e.target.value}))}/>
                      </div>
                      <div style={{gridColumn:"span 2",display:"flex",justifyContent:"flex-end"}}>
                        <button onClick={async()=>{await apiFetch(`/api/admin/promises/${p.id}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(uf)});setUpdating(null);setPromises(ps=>ps.map(x=>x.id===p.id?{...x,progress:uf.progress,status:uf.status}:x));}} style={{padding:"0.9rem 2.25rem",border:"none",borderRadius:14,background:"linear-gradient(135deg,#f97316,#ea580c)",color:"#fff",cursor:"pointer",fontWeight:900,fontSize:"1.05rem",boxShadow:"0 6px 24px rgba(249,115,22,0.4)"}}>
                          💾 Save Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {tab==="feedback"&&(
          <div style={{display:"flex",flexDirection:"column",gap:"0.9rem"}}>
            {feedback.length===0&&<div style={{textAlign:"center",color:T.ink3,padding:"4rem",background:T.white,borderRadius:22,fontSize:"1.15rem",fontWeight:600}}>No feedback submitted yet.</div>}
            {feedback.map((f,fi)=>{const fc=DA[fi%DA.length];return(
              <div key={f.id} style={{background:T.white,border:`2px solid ${fc.c}22`,borderRadius:20,padding:"1.5rem 1.9rem",boxShadow:`0 3px 14px ${fc.c}10`}}>
                <div style={{fontSize:"1.05rem",color:T.ink,marginBottom:"0.85rem",lineHeight:1.75,fontWeight:600}}>{f.message}</div>
                <div style={{display:"flex",gap:"1.1rem",fontSize:"0.95rem",color:T.ink3,fontWeight:700}}>
                  <span>👤 {f.citizen_name||"Anonymous"}</span>
                  <span>📍 {f.district||"—"}</span>
                  <span>📅 {f.submitted_at?new Date(f.submitted_at).toLocaleDateString("en-IN"):"—"}</span>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ROOT APP ── */
export default function App(){
  const [page,setPage]=useState("home");
  const [lang,setLang]=useState("en");
  const [dept,setDept]=useState(null);
  const pages={
    home:        <Home lang={lang} setPage={setPage} setDept={setDept}/>,
    departments: <Departments lang={lang} setDept={setDept} setPage={setPage}/>,
    promises:    <Promises lang={lang} dept={dept} setDept={setDept}/>,
    news:        <News lang={lang}/>,
    feedback:    <Feedback lang={lang}/>,
    admin:       <Admin/>,
  };
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth; font-size: 80%;}
        body{background:#f7f9ff;color:#0d1117;font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:7px;}
        ::-webkit-scrollbar-track{background:#f7f9ff;}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:5px;}
        ::-webkit-scrollbar-thumb:hover{background:#f97316;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes navSlide{from{opacity:0;transform:translateY(-100%);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{transform:translateX(-200%);}100%{transform:translateX(200%);}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.3;transform:scale(0.55);}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.84);}to{opacity:1;transform:scale(1);}}
        @keyframes bounceIn{0%{opacity:0;transform:scale(0.5);}60%{transform:scale(1.1);}80%{transform:scale(0.96);}100%{opacity:1;transform:scale(1);}}
        @keyframes orbFloat1{0%,100%{transform:translate(0,0);}33%{transform:translate(40px,-60px);}66%{transform:translate(-30px,40px);}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0);}33%{transform:translate(-50px,40px);}66%{transform:translate(30px,-50px);}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0);}33%{transform:translate(30px,50px);}66%{transform:translate(-40px,-30px);}}
        select,input,textarea,button{font-family:'Plus Jakarta Sans',sans-serif;}
        @media(max-width:768px){nav{display:none !important;}}
      `}</style>
      <Nav page={page} setPage={setPage} lang={lang} setLang={setLang}/>
      <div key={page} style={{animation:"fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both",minHeight:"80vh"}}>
        {pages[page]||pages.home}
      </div>
      <footer style={{borderTop:`1px solid rgba(13,17,23,0.07)`,background:T.white,padding:"2.75rem 2rem",textAlign:"center"}}>
        <div style={{fontSize:"1.4rem",fontWeight:900,color:T.ink,marginBottom:"0.55rem",letterSpacing:"-0.02em"}}>
          Commitment <span style={{background:"linear-gradient(135deg,#f97316,#8b5cf6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Tracker</span>
        </div>
        <p style={{fontSize:"1rem",color:T.ink3,fontWeight:600}}>Built for every citizen of Telangana · Politically neutral · Transparency is our mission</p>
        <p style={{fontSize:"0.9rem",color:T.ink4,marginTop:"0.4rem",fontWeight:600}}>Data updated by verified admin only · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}