"use client";
import { useState, useEffect, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
async function api(path, opts = {}) {
  try { const res = await fetch(`${API}${path}`, opts); return res.json(); }
  catch { return { data: [] }; }
}

const T = {
  ivory:"#faf8f3", cream:"#f2ede3", paper:"#ffffff",
  ink:"#1c1917", ink2:"#44403c", ink3:"#78716c", ink4:"#a8a29e",
  saffron:"#e07b28", saffronL:"#fdebd0", saffronD:"#c4631a",
  indigo:"#2d3a8c", indigoL:"#e8ebfa",
  green:"#16803c", greenL:"#dcfce7",
  red:"#be123c", redL:"#ffe4e6",
  blue:"#1e60b3", blueL:"#dbeafe",
  amber:"#b45309", amberL:"#fef3c7",
  border:"rgba(28,25,23,0.09)",
  shadow:"0 1px 2px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.06)",
  shadowMd:"0 4px 8px rgba(0,0,0,0.06),0 16px 40px rgba(0,0,0,0.1)",
  shadowLg:"0 8px 16px rgba(0,0,0,0.08),0 32px 64px rgba(0,0,0,0.14)",
};

const STATS={total:372,completed:89,in_progress:143,not_started:140,govt_score:43};
const DEPTS=[
  {id:1, name:"6 Guarantees",         te:"6 హామీలు",          icon:"⭐",count:13},
  {id:2, name:"Agriculture",           te:"వ్యవసాయం",          icon:"🌾",count:39},
  {id:3, name:"Education",             te:"విద్య",             icon:"📚",count:35},
  {id:4, name:"Health",                te:"ఆరోగ్యం",           icon:"🏥",count:13},
  {id:5, name:"Housing & Land",        te:"గృహనిర్మాణం",       icon:"🏠",count:15},
  {id:6, name:"Youth & Employment",    te:"యువత & ఉపాధి",     icon:"💼",count:20},
  {id:7, name:"Industry & Economy",    te:"పరిశ్రమ",           icon:"🏭",count:9},
  {id:8, name:"Transport",             te:"రవాణా",             icon:"🚌",count:13},
  {id:9, name:"Women & Child Welfare", te:"మహిళా సంక్షేమం",   icon:"👩‍👧",count:8},
  {id:10,name:"SC, ST & BC Welfare",  te:"SC, ST & BC",        icon:"🤝",count:36},
  {id:11,name:"Minorities & Labour",   te:"మైనారిటీలు",        icon:"☪️",count:32},
  {id:12,name:"Urban Development",     te:"పట్టణాభివృద్ధి",    icon:"🏙️",count:19},
  {id:13,name:"Social Welfare",        te:"సామాజిక సంక్షేమం", icon:"👴",count:11},
  {id:14,name:"Governance & Law",      te:"పాలన",              icon:"🏛️",count:10},
  {id:15,name:"Environment & Sports",  te:"పర్యావరణం",         icon:"🌿",count:25},
];
const PROG={1:72,2:45,3:38,4:29,5:55,6:35,7:22,8:40,9:68,10:30,11:25,12:18,13:42,14:50,15:15};
const PROMISES=[
  {id:1, title:"Mahalakshmi: Rs. 2,500 monthly to all women",             te:"మహాలక్ష్మి: మహిళలకు నెలకు రూ. 2,500",         progress:100,status:"completed",  district:"All Districts",updated:"2024-06-01",flagship:true, dept_id:1},
  {id:2, title:"Gruha Jyothi: 200 units free electricity",                te:"గృహ జ్యోతి: 200 యూనిట్ల ఉచిత విద్యుత్",      progress:100,status:"completed",  district:"All Districts",updated:"2024-03-15",flagship:true, dept_id:1},
  {id:3, title:"Rythu Bharosa: Rs. 15,000 per acre to farmers",           te:"రైతు భరోసా: ఎకరాకు రూ. 15,000",              progress:75, status:"in_progress",district:"All Districts",updated:"2024-08-20",flagship:true, dept_id:1},
  {id:4, title:"Cheyutha: Rs. 4,000 monthly pension to senior citizens",  te:"చేయూత: నెలకు రూ. 4,000 పెన్షన్",             progress:60, status:"in_progress",district:"All Districts",updated:"2024-07-10",flagship:true, dept_id:1},
  {id:5, title:"Indiramma Indlu: House + Rs. 5 lakh to homeless families",te:"ఇందిరమ్మ ఇళ్లు: ఇంటిస్థలం + రూ. 5 లక్షలు",  progress:30, status:"in_progress",district:"All Districts",updated:"2024-09-01",flagship:true, dept_id:1},
  {id:6, title:"Yuva Vikasam: Rs. 5 lakh Vidya Bharosa Card",             te:"యువ వికాసం: విద్యా భరోసా కార్డు రూ. 5 లక్షలు",progress:45,status:"in_progress",district:"All Districts",updated:"2024-08-15",flagship:true, dept_id:1},
  {id:7, title:"Waive crop loans up to Rs. 2 lakhs",                      te:"రూ. 2 లక్షల పంట రుణాల మాఫీ",                 progress:100,status:"completed",  district:"All Districts",updated:"2024-01-15",flagship:false,dept_id:2},
  {id:8, title:"Fill 2 lakh government jobs in first year",               te:"2 లక్షల ప్రభుత్వ ఉద్యోగాల భర్తీ",            progress:35, status:"in_progress",district:"All Districts",updated:"2024-09-10",flagship:false,dept_id:6},
  {id:9, title:"Super specialty hospital in each district",               te:"ప్రతి జిల్లాలో సూపర్ స్పెషాలిటీ హాస్పిటల్",  progress:20, status:"in_progress",district:"All Districts",updated:"2024-08-01",flagship:false,dept_id:4},
  {id:10,title:"Reopen 6,000 closed government schools",                  te:"6,000 పాఠశాలలను తెరవడం",                      progress:0,  status:"not_started",district:"All Districts",updated:"2024-01-01",flagship:false,dept_id:3},
  {id:11,title:"Replace Dharani with transparent BHUMATHA PORTAL",        te:"ధరణి స్థానంలో భూమాత పోర్టల్",                progress:85, status:"in_progress",district:"All Districts",updated:"2024-09-15",flagship:false,dept_id:5},
  {id:12,title:"Metro extension: LB Nagar to BHEL via Mehdipatnam",       te:"ఎల్బీ నగర్ నుండి BHEL వరకు మెట్రో విస్తరణ", progress:15, status:"in_progress",district:"Hyderabad",    updated:"2024-07-20",flagship:false,dept_id:12},
];

function sInfo(s){
  return({
    completed:    {en:"Completed",   te:"పూర్తయింది",       c:T.green, bg:T.greenL},
    in_progress:  {en:"In Progress", te:"పురోగతిలో",        c:T.blue,  bg:T.blueL},
    not_started:  {en:"Not Started", te:"ప్రారంభం కాలేదు",  c:T.red,   bg:T.redL},
    partially_done:{en:"Partial",    te:"పాక్షికంగా పూర్తి",c:T.amber, bg:T.amberL},
  }[s]||{en:"Unknown",te:"తెలియదు",c:T.ink3,bg:T.cream});
}
function pCol(p){if(p===100)return T.green;if(p>=60)return T.blue;if(p>0)return T.amber;return T.red;}
function ago(d){if(!d)return"—";const days=Math.floor((Date.now()-new Date(d))/86400000);if(days===0)return"Today";if(days===1)return"Yesterday";if(days<30)return`${days}d ago`;return`${Math.floor(days/30)}mo ago`;}

function AnimN({v}){
  const[n,setN]=useState(0);const r=useRef(false);
  useEffect(()=>{if(r.current||!v)return;r.current=true;let c=0;const s=Math.max(1,Math.floor(v/80));const t=setInterval(()=>{c=Math.min(c+s,v);setN(c);if(c>=v)clearInterval(t);},16);return()=>clearInterval(t);},[v]);
  return<>{n}</>;
}

function Bar({pct,h=6,delay=0}){
  const[w,setW]=useState(0);
  useEffect(()=>{const t=setTimeout(()=>setW(pct),400+delay);return()=>clearTimeout(t);},[pct,delay]);
  const col=pCol(pct);
  return(
    <div style={{height:h,background:"rgba(28,25,23,0.07)",borderRadius:999,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${w}%`,borderRadius:999,
        background:`linear-gradient(90deg,${col},${col}cc)`,
        transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)",
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)",
          animation:"shimmer 2.5s infinite"}}/>
      </div>
    </div>
  );
}

function Donut({score}){
  const r=52,circ=2*Math.PI*r;
  const[off,setOff]=useState(circ);
  useEffect(()=>{const t=setTimeout(()=>setOff(circ-(score/100)*circ),700);return()=>clearTimeout(t);},[score]);
  return(
    <div style={{position:"relative",width:136,height:136,flexShrink:0}}>
      <svg width="136" height="136" style={{transform:"rotate(-90deg)"}}>
        <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={T.saffron}/><stop offset="100%" stopColor={T.saffronD}/></linearGradient></defs>
        <circle cx="68" cy="68" r={r} fill="none" stroke={T.cream} strokeWidth="12"/>
        <circle cx="68" cy="68" r={r} fill="none" stroke="url(#sg)" strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{transition:"stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1) 0.6s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:T.ink,lineHeight:1}}>{score}</span>
        <span style={{fontSize:"0.6rem",color:T.ink3,fontWeight:600,letterSpacing:"0.1em",marginTop:2}}>/100</span>
      </div>
    </div>
  );
}

function Nav({page,setPage,lang,setLang}){
  const[sc,setSc]=useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>20);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const links=[{id:"home",en:"Dashboard",te:"డాష్‌బోర్డ్"},{id:"departments",en:"Departments",te:"విభాగాలు"},{id:"promises",en:"Promises",te:"హామీలు"},{id:"news",en:"Updates",te:"నవీకరణలు"},{id:"feedback",en:"Feedback",te:"అభిప్రాయం"}];
  return(
    <header style={{position:"sticky",top:0,zIndex:200,
      background:sc?"rgba(250,248,243,0.94)":T.paper,
      backdropFilter:"blur(24px)",
      borderBottom:`1px solid ${sc?T.border:"transparent"}`,
      boxShadow:sc?"0 1px 0 rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.06)":"none",
      transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)",
      animation:"navIn 0.7s cubic-bezier(0.16,1,0.3,1) both"}}>
      <div style={{maxWidth:1180,margin:"0 auto",padding:"0 1.5rem",height:60,display:"flex",alignItems:"center",justifyContent:"space-between",gap:"1rem"}}>
        <button onClick={()=>setPage("home")} style={{display:"flex",alignItems:"center",gap:"0.6rem",background:"none",border:"none",cursor:"pointer",padding:0}}>
          <div style={{width:34,height:34,background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 2px 8px ${T.saffron}44`,flexShrink:0}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:13,color:"#fff"}}>CT</span>
          </div>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem",color:T.ink}}>Commitment <span style={{color:T.saffron}}>Tracker</span></span>
        </button>
        <nav style={{display:"flex",gap:"0.1rem"}}>
          {links.map((l,i)=>(
            <button key={l.id} onClick={()=>setPage(l.id)} style={{padding:"0.4rem 0.8rem",borderRadius:8,border:"none",cursor:"pointer",fontSize:"0.8rem",fontWeight:500,background:page===l.id?T.saffronL:"transparent",color:page===l.id?T.saffronD:T.ink3,transition:"all 0.2s",animation:`fadeDown 0.5s ease ${0.1+i*0.06}s both`}}
              onMouseEnter={e=>{if(page!==l.id){e.currentTarget.style.background=T.cream;e.currentTarget.style.color=T.ink;}}}
              onMouseLeave={e=>{if(page!==l.id){e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.ink3;}}}
            >{lang==="te"?l.te:l.en}</button>
          ))}
        </nav>
        <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.35rem",fontSize:"0.7rem",color:T.green,fontWeight:600,background:T.greenL,padding:"0.25rem 0.65rem",borderRadius:999}}>
            <span style={{width:6,height:6,background:T.green,borderRadius:"50%",display:"inline-block",animation:"pulse 2s infinite"}}/>Live
          </div>
          <button onClick={()=>setLang(lang==="en"?"te":"en")} style={{fontSize:"0.72rem",fontWeight:600,padding:"0.3rem 0.75rem",border:`1.5px solid ${T.border}`,borderRadius:8,background:T.paper,color:T.saffronD,cursor:"pointer",transition:"all 0.2s"}}>
            {lang==="en"?"తెలుగు":"English"}
          </button>
          <button onClick={()=>setPage("admin")} style={{fontSize:"0.72rem",fontWeight:500,padding:"0.3rem 0.75rem",border:`1.5px solid ${T.border}`,borderRadius:8,background:"transparent",color:T.ink3,cursor:"pointer"}}>🔐 Admin</button>
        </div>
      </div>
    </header>
  );
}

function Home({lang,setPage,setDept}){
  const[stats,setStats]=useState(STATS);
  const flagship=PROMISES.filter(p=>p.flagship);
  useEffect(()=>{api("/api/promises/stats/overview").then(r=>r.data&&setStats(r.data));},[]);
  const cards=[
    {label:lang==="te"?"మొత్తం హామీలు":"Total Promises",v:stats.total,       c:T.saffron,bg:T.saffronL,icon:"📋"},
    {label:lang==="te"?"పూర్తయినవి":"Completed",          v:stats.completed,   c:T.green,  bg:T.greenL,  icon:"✅"},
    {label:lang==="te"?"పురోగతిలో":"In Progress",          v:stats.in_progress, c:T.blue,   bg:T.blueL,   icon:"🔄"},
    {label:lang==="te"?"ప్రారంభం కాలేదు":"Not Started",    v:stats.not_started, c:T.red,    bg:T.redL,    icon:"⏳"},
  ];
  return(
    <main style={{maxWidth:1180,margin:"0 auto",padding:"0 1.5rem 5rem"}}>
      {/* HERO */}
      <section style={{padding:"4rem 0 3rem"}}>
        <div style={{display:"flex",gap:"3rem",alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:300}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:"0.5rem",fontSize:"0.68rem",fontWeight:600,color:T.saffronD,letterSpacing:"0.14em",textTransform:"uppercase",background:T.saffronL,padding:"0.3rem 0.9rem",borderRadius:999,marginBottom:"1.75rem",border:`1px solid ${T.saffron}33`,animation:"fadeUp 0.6s ease both"}}>
              🏛️ {lang==="te"?"తెలంగాణ · INC ప్రభుత్వం · 2023–2028":"Telangana · INC Government · 2023–2028"}
            </div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.4rem,5vw,4.2rem)",fontWeight:700,lineHeight:1.08,letterSpacing:"-0.02em",color:T.ink,marginBottom:"1.25rem",animation:"fadeUp 0.6s ease 0.1s both"}}>
              {lang==="te"?<>ప్రతి హామీ <em style={{color:T.saffron,fontStyle:"italic"}}>ట్రాక్</em> చేయబడింది.</>:<>Every promise <em style={{color:T.saffron,fontStyle:"italic"}}>tracked.</em><br/>Every rupee accounted for.</>}
            </h1>
            <p style={{fontSize:"1.05rem",color:T.ink2,lineHeight:1.75,maxWidth:500,marginBottom:"2.25rem",animation:"fadeUp 0.6s ease 0.2s both"}}>
              {lang==="te"?"తెలంగాణ ప్రభుత్వం చేసిన 372 హామీలను విభాగాల వారీగా ట్రాక్ చేయండి.":"Tracking all 372 manifesto promises of the Telangana government — department by department, district by district."}
            </p>
            <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap",animation:"fadeUp 0.6s ease 0.3s both"}}>
              <button onClick={()=>setPage("promises")} style={{padding:"0.75rem 1.5rem",borderRadius:10,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,color:"#fff",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"0.92rem",boxShadow:`0 4px 16px ${T.saffron}44`,transition:"all 0.25s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                onMouseLeave={e=>e.currentTarget.style.transform=""}>
                {lang==="te"?"అన్ని హామీలు చూడండి →":"View All Promises →"}
              </button>
              <button onClick={()=>setPage("departments")} style={{padding:"0.75rem 1.5rem",borderRadius:10,cursor:"pointer",border:`1.5px solid ${T.border}`,background:T.paper,color:T.ink2,fontSize:"0.88rem",fontWeight:500,transition:"all 0.25s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.saffron;e.currentTarget.style.color=T.saffronD;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.ink2;}}>
                {lang==="te"?"విభాగాలు":"By Department"}
              </button>
            </div>
          </div>
          <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:20,padding:"1.75rem 2rem",boxShadow:T.shadowMd,display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",animation:"fadeUp 0.6s ease 0.2s both",flexShrink:0}}>
            <Donut score={stats.govt_score||43}/>
            <div style={{textAlign:"center"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"0.95rem",color:T.ink}}>{lang==="te"?"ప్రభుత్వ స్కోర్":"Government Score"}</div>
              <div style={{fontSize:"0.72rem",color:T.ink4,marginTop:2}}>{lang==="te"?"372 హామీల ఆధారంగా":"Based on all 372 promises"}</div>
            </div>
            <div style={{width:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
              {[{l:lang==="te"?"పూర్తి":"Done",v:stats.completed,c:T.green},{l:lang==="te"?"పురోగతి":"Active",v:stats.in_progress,c:T.blue}].map((s,i)=>(
                <div key={i} style={{textAlign:"center",background:T.ivory,borderRadius:10,padding:"0.6rem"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",fontWeight:700,color:s.c}}><AnimN v={s.v}/></div>
                  <div style={{fontSize:"0.68rem",color:T.ink4,marginTop:1}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SCORE CARDS */}
      <section style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:"0.85rem",marginBottom:"3.5rem"}}>
        {cards.map((s,i)=>(
          <div key={i} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,padding:"1.4rem",position:"relative",overflow:"hidden",boxShadow:T.shadow,transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",animation:`fadeUp 0.6s ease ${0.1+i*0.07}s both`}}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=T.shadowMd;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${s.c},${s.c}88)`,borderRadius:"16px 16px 0 0"}}/>
            <div style={{width:38,height:38,background:s.bg,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",marginBottom:"0.85rem"}}>{s.icon}</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"2.6rem",fontWeight:700,color:s.c,lineHeight:1}}><AnimN v={s.v||0}/></div>
            <div style={{fontSize:"0.78rem",color:T.ink3,marginTop:"0.3rem",fontWeight:500}}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* 6 GUARANTEES */}
      <section style={{marginBottom:"3.5rem"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:"1.25rem",animation:"fadeUp 0.6s ease 0.35s both"}}>
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.45rem",fontWeight:700,color:T.ink,marginBottom:2}}>⭐ {lang==="te"?"6 అభయ హస్తం హామీలు":"6 Abhaya Hastam Guarantees"}</h2>
            <p style={{fontSize:"0.8rem",color:T.ink4}}>{lang==="te"?"ప్రభుత్వం యొక్క ముఖ్యమైన వాగ్దానాలు":"The government's flagship promises to every citizen"}</p>
          </div>
          <button onClick={()=>{setDept(1);setPage("promises");}} style={{fontSize:"0.78rem",color:T.saffronD,background:"none",border:"none",cursor:"pointer",fontWeight:600,whiteSpace:"nowrap"}}>{lang==="te"?"అన్నీ చూడండి →":"View all →"}</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"0.85rem"}}>
          {flagship.map((p,i)=>{
            const si=sInfo(p.status);
            return(
              <div key={p.id} onClick={()=>setPage("promises")} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,padding:"1.25rem",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",boxShadow:T.shadow,animation:`fadeUp 0.5s ease ${0.4+i*0.07}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.borderColor=T.saffron+"55";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.borderColor=T.border;}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:"0.75rem",marginBottom:"1rem"}}>
                  <p style={{fontSize:"0.875rem",fontWeight:500,color:T.ink,lineHeight:1.5,flex:1}}>{lang==="te"&&p.te?p.te:p.title}</p>
                  <span style={{fontSize:"0.65rem",fontWeight:700,padding:"0.22rem 0.6rem",borderRadius:999,background:si.bg,color:si.c,whiteSpace:"nowrap",flexShrink:0,letterSpacing:"0.04em",textTransform:"uppercase"}}>{lang==="te"?si.te:si.en}</span>
                </div>
                <Bar pct={p.progress} h={7} delay={i*80}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.6rem",alignItems:"center"}}>
                  <span style={{fontSize:"0.7rem",color:T.ink4}}>{ago(p.updated)}</span>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:"0.9rem",fontWeight:700,color:pCol(p.progress)}}>{p.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section style={{marginBottom:"3.5rem"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:"1.25rem",animation:"fadeUp 0.6s ease 0.4s both"}}>
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.45rem",fontWeight:700,color:T.ink,marginBottom:2}}>{lang==="te"?"విభాగాల వారీగా":"By Department"}</h2>
            <p style={{fontSize:"0.8rem",color:T.ink4}}>15 {lang==="te"?"విభాగాలు · 372 హామీలు":"departments · 372 promises"}</p>
          </div>
          <button onClick={()=>setPage("departments")} style={{fontSize:"0.78rem",color:T.saffronD,background:"none",border:"none",cursor:"pointer",fontWeight:600}}>{lang==="te"?"అన్నీ చూడండి →":"View all →"}</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:"0.85rem"}}>
          {DEPTS.map((d,i)=>{
            const pct=PROG[d.id]||30;
            return(
              <button key={d.id} onClick={()=>{setDept(d.id);setPage("promises");}} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,padding:"1.25rem",cursor:"pointer",textAlign:"left",boxShadow:T.shadow,transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",animation:`fadeUp 0.5s ease ${0.45+i*0.04}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.borderColor=T.saffron+"66";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.borderColor=T.border;}}>
                <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>{d.icon}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"0.88rem",color:T.ink,marginBottom:"0.2rem",lineHeight:1.3}}>{lang==="te"?d.te:d.name}</div>
                <div style={{fontSize:"0.72rem",color:T.ink4,marginBottom:"1rem"}}>{d.count} {lang==="te"?"హామీలు":"promises"}</div>
                <Bar pct={pct} h={5} delay={i*50}/>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.4rem"}}><span style={{fontSize:"0.72rem",fontWeight:700,color:pCol(pct)}}>{pct}%</span></div>
              </button>
            );
          })}
        </div>
      </section>

      {/* RECENT */}
      <section>
        <div style={{animation:"fadeUp 0.6s ease 0.5s both"}}>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.45rem",fontWeight:700,color:T.ink,marginBottom:2}}>🕐 {lang==="te"?"తాజా నవీకరణలు":"Recent Updates"}</h2>
          <p style={{fontSize:"0.8rem",color:T.ink4,marginBottom:"1.25rem"}}>{lang==="te"?"చివరిగా అప్‌డేట్ చేయబడిన హామీలు":"Most recently updated promises"}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
          {PROMISES.slice(0,5).map((p,i)=>{
            const si=sInfo(p.status);
            return(
              <div key={p.id} onClick={()=>setPage("promises")} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:"1rem 1.25rem",display:"grid",gridTemplateColumns:"2.5rem 1fr 8rem",gap:"1rem",alignItems:"center",cursor:"pointer",transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",animation:`fadeUp 0.5s ease ${0.55+i*0.06}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.borderColor=T.saffron+"44";e.currentTarget.style.transform="translateX(4px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="";}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem",color:T.ink4,textAlign:"center"}}>{String(i+1).padStart(2,"0")}</div>
                <div>
                  <div style={{fontSize:"0.875rem",fontWeight:500,color:T.ink,marginBottom:"0.5rem",lineHeight:1.45}}>{lang==="te"&&p.te?p.te:p.title}</div>
                  <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",alignItems:"center"}}>
                    <span style={{fontSize:"0.65rem",fontWeight:700,padding:"0.18rem 0.55rem",borderRadius:999,background:si.bg,color:si.c,letterSpacing:"0.04em",textTransform:"uppercase"}}>{lang==="te"?si.te:si.en}</span>
                    <span style={{fontSize:"0.7rem",color:T.ink4}}>📍 {p.district}</span>
                    <span style={{fontSize:"0.7rem",color:T.ink4}}>🕐 {ago(p.updated)}</span>
                  </div>
                </div>
                <div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",fontWeight:700,color:pCol(p.progress),textAlign:"right",marginBottom:"0.4rem"}}>{p.progress}%</div>
                  <Bar pct={p.progress} h={5} delay={i*60}/>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function Promises({lang,dept,setDept}){
  const[all,setAll]=useState([]);
  const[status,setStatus]=useState("");
  const[search,setSearch]=useState("");
  const[district,setDistrict]=useState("");
  const[voted,setVoted]=useState({});
  const DISTRICTS=["","Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Nalgonda","Adilabad","Rangareddy","Medak","Mahabubabad"];
  const SS={padding:"0.6rem 1rem",border:`1.5px solid ${T.border}`,borderRadius:10,background:T.paper,color:T.ink,fontSize:"0.84rem",outline:"none",cursor:"pointer",fontFamily:"inherit"};

  useEffect(()=>{
    let f=[...PROMISES];
    if(dept)f=f.filter(x=>x.dept_id===dept);
    if(status)f=f.filter(x=>x.status===status);
    if(search)f=f.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()));
    setAll(f);
    const p={};if(dept)p.department_id=dept;if(status)p.status=status;if(search)p.search=search;
    const qs=new URLSearchParams(p).toString();
    api(`/api/promises/?${qs}`).then(r=>{if(r.data?.length)setAll(r.data);});
  },[dept,status,search,district]);

  const dName=dept?(DEPTS.find(d=>d.id===dept)?.icon+" "+(DEPTS.find(d=>d.id===dept)?.name||"")):"";

  return(
    <main style={{maxWidth:1180,margin:"0 auto",padding:"2rem 1.5rem 5rem",animation:"fadeUp 0.6s ease both"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:T.ink,marginBottom:"0.4rem"}}>{dept?dName:(lang==="te"?"అన్ని హామీలు":"All Promises")}</h1>
      <p style={{fontSize:"0.85rem",color:T.ink4,marginBottom:"1.75rem"}}>{lang==="te"?"హామీలను వెతకండి, ఫిల్టర్ చేయండి":"Search and filter all 372 government promises"}</p>
      <div style={{display:"flex",gap:"0.65rem",marginBottom:"1.5rem",flexWrap:"wrap",background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:"0.85rem",boxShadow:T.shadow}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={lang==="te"?"హామీలను వెతకండి...":"Search promises..."} style={{...SS,minWidth:220}}
          onFocus={e=>{e.target.style.borderColor=T.saffron;e.target.style.boxShadow=`0 0 0 3px ${T.saffronL}`;}}
          onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
        <select value={dept||""} onChange={e=>setDept(e.target.value?Number(e.target.value):null)} style={SS}>
          <option value="">{lang==="te"?"అన్ని విభాగాలు":"All Departments"}</option>
          {DEPTS.map(d=><option key={d.id} value={d.id}>{d.icon} {lang==="te"?d.te:d.name}</option>)}
        </select>
        <select value={status} onChange={e=>setStatus(e.target.value)} style={SS}>
          <option value="">{lang==="te"?"అన్ని స్థితులు":"All Status"}</option>
          <option value="completed">{lang==="te"?"పూర్తయింది":"Completed"}</option>
          <option value="in_progress">{lang==="te"?"పురోగతిలో":"In Progress"}</option>
          <option value="not_started">{lang==="te"?"ప్రారంభం కాలేదు":"Not Started"}</option>
        </select>
        <select value={district} onChange={e=>setDistrict(e.target.value)} style={SS}>
          <option value="">{lang==="te"?"అన్ని జిల్లాలు":"All Districts"}</option>
          {DISTRICTS.filter(Boolean).map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{fontSize:"0.78rem",color:T.ink4,marginBottom:"1rem",fontWeight:500}}>{all.length} {lang==="te"?"హామీలు కనుగొనబడ్డాయి":"promises found"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>
        {all.map((p,i)=>{
          const si=sInfo(p.status);
          return(
            <div key={p.id} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,padding:"1.25rem 1.5rem",boxShadow:T.shadow,transition:"all 0.25s cubic-bezier(0.16,1,0.3,1)",animation:`fadeUp 0.4s ease ${Math.min(i,10)*0.04}s both`}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.borderColor=T.saffron+"44";e.currentTarget.style.transform="translateX(4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.borderColor=T.border;e.currentTarget.style.transform="";}}>
              <div style={{display:"grid",gridTemplateColumns:"2.5rem 1fr auto",gap:"1rem",alignItems:"start"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem",color:T.ink4,paddingTop:2}}>{String(p.id).padStart(2,"0")}</div>
                <div>
                  <div style={{fontSize:"0.9rem",fontWeight:500,color:T.ink,marginBottom:"0.7rem",lineHeight:1.5}}>{lang==="te"&&p.te?p.te:p.title}</div>
                  <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap",marginBottom:"0.75rem",alignItems:"center"}}>
                    <span style={{fontSize:"0.65rem",fontWeight:700,padding:"0.2rem 0.6rem",borderRadius:999,background:si.bg,color:si.c,letterSpacing:"0.04em",textTransform:"uppercase"}}>{lang==="te"?si.te:si.en}</span>
                    <span style={{fontSize:"0.7rem",color:T.ink4}}>📍 {p.district||"All Districts"}</span>
                    <span style={{fontSize:"0.7rem",color:T.ink4}}>🕐 {ago(p.updated||p.last_updated)}</span>
                  </div>
                  <Bar pct={p.progress} h={7} delay={i*40}/>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"0.5rem"}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:pCol(p.progress)}}>{p.progress}%</div>
                  <button onClick={()=>{if(!voted[p.id]){setVoted(v=>({...v,[p.id]:true}));api(`/api/promises/${p.id}/vote`,{method:"POST"});}}} style={{fontSize:"0.7rem",padding:"0.28rem 0.7rem",border:`1.5px solid ${T.border}`,borderRadius:999,background:voted[p.id]?T.saffronL:"transparent",color:voted[p.id]?T.saffronD:T.ink3,cursor:"pointer",transition:"all 0.2s",fontWeight:500}}>
                    {voted[p.id]?"👍 Voted":"👍 Important"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Departments({lang,setDept,setPage}){
  return(
    <main style={{maxWidth:1180,margin:"0 auto",padding:"2rem 1.5rem 5rem",animation:"fadeUp 0.6s ease both"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:T.ink,marginBottom:"0.4rem"}}>{lang==="te"?"విభాగాలు":"All Departments"}</h1>
      <p style={{fontSize:"0.85rem",color:T.ink4,marginBottom:"2rem"}}>{lang==="te"?"15 విభాగాల వారీగా 372 హామీలు":"Browse all 372 promises across 15 departments"}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:"1rem"}}>
        {DEPTS.map((d,i)=>{
          const pct=PROG[d.id]||30;
          return(
            <button key={d.id} onClick={()=>{setDept(d.id);setPage("promises");}} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:20,padding:"1.75rem",cursor:"pointer",textAlign:"left",boxShadow:T.shadow,transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",animation:`fadeUp 0.5s ease ${i*0.04}s both`}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow=T.shadowLg;e.currentTarget.style.borderColor=T.saffron+"77";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.borderColor=T.border;}}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>{d.icon}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem",color:T.ink,marginBottom:"0.25rem"}}>{lang==="te"?d.te:d.name}</div>
              <div style={{fontSize:"0.78rem",color:T.ink4,marginBottom:"1.25rem"}}>{d.count} {lang==="te"?"హామీలు":"promises"}</div>
              <Bar pct={pct} h={7} delay={i*60}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:"0.5rem"}}>
                <span style={{fontSize:"0.72rem",color:T.ink4}}>{lang==="te"?"పురోగతి":"Progress"}</span>
                <span style={{fontSize:"0.78rem",fontWeight:700,color:pCol(pct)}}>{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}

function Feedback({lang}){
  const[form,setForm]=useState({citizen_name:"",district:"",message:""});
  const[busy,setBusy]=useState(false);
  const[done,setDone]=useState(false);
  const[err,setErr]=useState("");
  const DISTRICTS=["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Nalgonda","Adilabad","Rangareddy","Medak","Mahabubabad","Other"];
  const IS={width:"100%",padding:"0.85rem 1rem",border:`1.5px solid ${T.border}`,borderRadius:12,background:T.paper,color:T.ink,fontSize:"0.9rem",outline:"none",fontFamily:"inherit",transition:"all 0.2s"};
  const submit=async()=>{
    if(!form.message.trim()){setErr(lang==="te"?"దయచేసి సందేశం నమోదు చేయండి":"Please enter your message");return;}
    setBusy(true);setErr("");
    await api("/api/feedback/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    setDone(true);setBusy(false);
  };
  if(done)return(
    <main style={{maxWidth:600,margin:"4rem auto",padding:"0 1.5rem",animation:"fadeUp 0.6s ease both"}}>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:24,padding:"3rem",boxShadow:T.shadowMd,textAlign:"center"}}>
        <div style={{fontSize:"3.5rem",marginBottom:"1rem"}}>✅</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.6rem",fontWeight:700,color:T.green,marginBottom:"0.75rem"}}>{lang==="te"?"అభిప్రాయం నమోదు అయింది!":"Feedback Submitted!"}</h2>
        <p style={{color:T.ink2,lineHeight:1.7}}>{lang==="te"?"మీ అభిప్రాయానికి ధన్యవాదాలు.":"Thank you! The admin will review your feedback shortly."}</p>
        <button onClick={()=>{setDone(false);setForm({citizen_name:"",district:"",message:""}); }} style={{marginTop:"1.75rem",padding:"0.75rem 1.75rem",background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"0.95rem"}}>{lang==="te"?"మళ్ళీ సమర్పించండి":"Submit Another"}</button>
      </div>
    </main>
  );
  return(
    <main style={{maxWidth:640,margin:"0 auto",padding:"2rem 1.5rem 5rem",animation:"fadeUp 0.6s ease both"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:T.ink,marginBottom:"0.4rem"}}>{lang==="te"?"అభిప్రాయం తెలపండి":"Share Your Feedback"}</h1>
      <p style={{color:T.ink2,marginBottom:"2rem",lineHeight:1.7,fontSize:"0.9rem"}}>{lang==="te"?"మీ ప్రాంతంలో హామీ అమలును గమనించారా?":"Have you observed progress on any promise in your area? Your voice matters."}</p>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:20,padding:"2rem",boxShadow:T.shadowMd,display:"flex",flexDirection:"column",gap:"1.1rem"}}>
        <div>
          <label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:T.ink3,marginBottom:"0.4rem",letterSpacing:"0.04em",textTransform:"uppercase"}}>{lang==="te"?"మీ పేరు (ఐచ్ఛికం)":"Your Name (Optional)"}</label>
          <input style={IS} placeholder={lang==="te"?"మీ పేరు...":"Your name..."} value={form.citizen_name} onChange={e=>setForm(p=>({...p,citizen_name:e.target.value}))} onFocus={e=>{e.target.style.borderColor=T.saffron;e.target.style.boxShadow=`0 0 0 3px ${T.saffronL}`;}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
        </div>
        <div>
          <label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:T.ink3,marginBottom:"0.4rem",letterSpacing:"0.04em",textTransform:"uppercase"}}>{lang==="te"?"మీ జిల్లా":"Your District"}</label>
          <select style={{...IS,cursor:"pointer"}} value={form.district} onChange={e=>setForm(p=>({...p,district:e.target.value}))}>
            <option value="">{lang==="te"?"జిల్లా ఎంచుకోండి":"Select District"}</option>
            {DISTRICTS.map(d=><option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{display:"block",fontSize:"0.78rem",fontWeight:600,color:T.ink3,marginBottom:"0.4rem",letterSpacing:"0.04em",textTransform:"uppercase"}}>{lang==="te"?"మీ సందేశం *":"Your Message *"}</label>
          <textarea style={{...IS,height:140,resize:"vertical"}} placeholder={lang==="te"?"మీ ప్రాంతంలో ఏం జరుగుతుందో వివరించండి...":"Describe what you've observed in your area..."} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} onFocus={e=>{e.target.style.borderColor=T.saffron;e.target.style.boxShadow=`0 0 0 3px ${T.saffronL}`;}} onBlur={e=>{e.target.style.borderColor=T.border;e.target.style.boxShadow="none";}}/>
        </div>
        {err&&<div style={{fontSize:"0.82rem",color:T.red,background:T.redL,padding:"0.6rem 1rem",borderRadius:8}}>{err}</div>}
        <button onClick={submit} disabled={busy} style={{padding:"0.95rem",borderRadius:12,border:"none",cursor:busy?"not-allowed":"pointer",background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,color:"#fff",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem",boxShadow:`0 4px 16px ${T.saffron}44`,opacity:busy?0.7:1,transition:"all 0.25s"}}
          onMouseEnter={e=>{if(!busy)e.currentTarget.style.transform="translateY(-1px)";}}
          onMouseLeave={e=>e.currentTarget.style.transform=""}>
          {busy?"⏳ Submitting...":(lang==="te"?"📤 సమర్పించండి":"📤 Submit Feedback")}
        </button>
      </div>
    </main>
  );
}

function News({lang}){
  const news=[
    {id:1,title:"Rythu Bharosa payments released for Kharif 2024",te:"ఖరీఫ్ 2024 కు రైతు భరోసా చెల్లింపులు విడుదల",body:"The Telangana government released Rs. 7,200 crores for the 2024 Kharif season, benefiting 52 lakh farmers across the state.",date:"2024-09-10",tag:"Agriculture"},
    {id:2,title:"Gruha Jyothi: 200 units free power now active statewide",te:"గృహ జ్యోతి: 200 యూనిట్ల ఉచిత విద్యుత్ అమలు",body:"Over 1.2 crore households are now receiving 200 units of free electricity every month.",date:"2024-08-22",tag:"Energy"},
    {id:3,title:"Crop loan waiver: 22 lakh farmers benefit in Phase 1",te:"పంట రుణాల మాఫీ: 22 లక్షల రైతులకు లాభం",body:"Loans up to Rs. 2 lakhs waived for 22 lakh farmers. Phase 2 covering remaining farmers is underway.",date:"2024-07-15",tag:"Agriculture"},
    {id:4,title:"6,000 school reopening promise — significantly delayed",te:"6,000 పాఠశాలల పునఃప్రారంభం ఆలస్యం",body:"Only 847 of the promised 6,000 schools have been reopened so far, with budget constraints cited as the primary reason.",date:"2024-09-01",tag:"Education"},
  ];
  const tagC={"Agriculture":T.green,"Energy":T.saffron,"Education":T.blue};
  return(
    <main style={{maxWidth:800,margin:"0 auto",padding:"2rem 1.5rem 5rem",animation:"fadeUp 0.6s ease both"}}>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"2rem",fontWeight:700,color:T.ink,marginBottom:"0.4rem"}}>{lang==="te"?"తాజా నవీకరణలు":"Latest Updates"}</h1>
      <p style={{fontSize:"0.85rem",color:T.ink4,marginBottom:"2rem"}}>{lang==="te"?"ప్రభుత్వ పనితీరుపై నవీనమైన కథనాలు":"Latest news and analysis on promise delivery"}</p>
      <div style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>
        {news.map((n,i)=>(
          <div key={n.id} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:18,padding:"1.75rem",boxShadow:T.shadow,transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",animation:`fadeUp 0.5s ease ${i*0.08}s both`}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowMd;e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;e.currentTarget.style.transform="";}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.75rem"}}>
              <span style={{fontSize:"0.68rem",fontWeight:700,padding:"0.22rem 0.65rem",borderRadius:999,background:(tagC[n.tag]||T.ink3)+"18",color:tagC[n.tag]||T.ink3,letterSpacing:"0.06em",textTransform:"uppercase"}}>{n.tag}</span>
              <span style={{fontSize:"0.72rem",color:T.ink4}}>📅 {new Date(n.date).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span>
            </div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.1rem",fontWeight:700,color:T.ink,marginBottom:"0.75rem",lineHeight:1.4}}>{lang==="te"&&n.te?n.te:n.title}</h3>
            <p style={{fontSize:"0.88rem",color:T.ink2,lineHeight:1.75}}>{n.body}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

function Admin(){
  const[token,setToken]=useState(null);
  const[email,setEmail]=useState("abdullahshakeelmd@gmail.com");
  const[pass,setPass]=useState("");
  const[err,setErr]=useState("");
  const[busy,setBusy]=useState(false);
  const[promises,setPromises]=useState(PROMISES);
  const[updating,setUpdating]=useState(null);
  const[uf,setUf]=useState({progress:0,status:"not_started",note:"",source_link:""});
  const[feedback,setFeedback]=useState([]);
  const[tab,setTab]=useState("promises");
  const IS={width:"100%",padding:"0.7rem 1rem",border:`1.5px solid ${T.border}`,borderRadius:10,background:T.ivory,color:T.ink,fontSize:"0.88rem",outline:"none",fontFamily:"inherit"};
  const login=async()=>{setBusy(true);setErr("");const r=await api("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})});if(r.token){setToken(r.token);api("/api/promises/").then(x=>x.data?.length&&setPromises(x.data));api("/api/feedback/",{headers:{Authorization:`Bearer ${r.token}`}}).then(x=>x.data&&setFeedback(x.data));}else setErr(r.detail||"Invalid credentials — try admin123");setBusy(false);};
  if(!token)return(
    <main style={{maxWidth:420,margin:"4rem auto",padding:"0 1.5rem",animation:"fadeUp 0.6s ease both"}}>
      <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:24,padding:"2.75rem",boxShadow:T.shadowMd}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}><div style={{fontSize:"2.5rem",marginBottom:"0.75rem"}}>🔐</div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.5rem",fontWeight:700,color:T.ink}}>Admin Login</h1><p style={{fontSize:"0.82rem",color:T.ink4,marginTop:"0.3rem"}}>Commitment Tracker — Secure Access</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <input type="email" style={IS} placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} onFocus={e=>e.target.style.borderColor=T.saffron} onBlur={e=>e.target.style.borderColor=T.border}/>
          <input type="password" style={IS} placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} onFocus={e=>e.target.style.borderColor=T.saffron} onBlur={e=>e.target.style.borderColor=T.border}/>
          {err&&<div style={{fontSize:"0.8rem",color:T.red,background:T.redL,padding:"0.55rem 0.85rem",borderRadius:8}}>{err}</div>}
          <button onClick={login} disabled={busy} style={{padding:"0.9rem",borderRadius:12,border:"none",cursor:"pointer",background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,color:"#fff",fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem"}}>{busy?"Logging in...":"Login →"}</button>
        </div>
        <p style={{fontSize:"0.72rem",color:T.ink4,textAlign:"center",marginTop:"1.5rem"}}>Default password: admin123</p>
      </div>
    </main>
  );
  return(
    <main style={{maxWidth:1180,margin:"0 auto",padding:"2rem 1.5rem 5rem",animation:"fadeUp 0.6s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"2rem"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"1.8rem",fontWeight:700,color:T.ink}}>🔐 Admin Dashboard</h1>
        <button onClick={()=>setToken(null)} style={{padding:"0.5rem 1rem",border:`1.5px solid ${T.border}`,borderRadius:8,background:"transparent",color:T.ink3,cursor:"pointer",fontSize:"0.82rem"}}>Logout</button>
      </div>
      <div style={{display:"flex",gap:"0.4rem",marginBottom:"1.5rem",background:T.cream,borderRadius:12,padding:"0.3rem",width:"fit-content",border:`1px solid ${T.border}`}}>
        {["promises","feedback"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"0.5rem 1.25rem",borderRadius:9,border:"none",cursor:"pointer",fontSize:"0.82rem",fontWeight:600,background:tab===t?T.paper:"transparent",color:tab===t?T.saffronD:T.ink3,boxShadow:tab===t?T.shadow:"none",transition:"all 0.2s"}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>
      {tab==="promises"&&<div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>{promises.map(p=>{const si=sInfo(p.status);const isU=updating===p.id;return(<div key={p.id} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:16,padding:"1.25rem 1.5rem",boxShadow:T.shadow}}><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"1rem"}}><div style={{flex:1}}><div style={{fontSize:"0.875rem",fontWeight:500,color:T.ink,marginBottom:"0.5rem"}}>{p.title}</div><div style={{display:"flex",gap:"0.5rem",alignItems:"center"}}><span style={{fontSize:"0.65rem",fontWeight:700,padding:"0.2rem 0.55rem",borderRadius:999,background:si.bg,color:si.c,letterSpacing:"0.04em",textTransform:"uppercase"}}>{si.en}</span><span style={{fontSize:"0.75rem",fontWeight:700,color:pCol(p.progress)}}>{p.progress}%</span></div></div><button onClick={()=>{setUpdating(isU?null:p.id);setUf({progress:p.progress,status:p.status,note:"",source_link:""}); }} style={{padding:"0.4rem 0.9rem",border:`1.5px solid ${T.saffron}`,borderRadius:8,background:isU?T.saffronL:"transparent",color:T.saffronD,cursor:"pointer",fontSize:"0.78rem",fontWeight:600,whiteSpace:"nowrap"}}>{isU?"✕ Cancel":"✏️ Update"}</button></div>{isU&&<div style={{borderTop:`1px solid ${T.border}`,paddingTop:"1rem",marginTop:"1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",animation:"fadeUp 0.3s ease both"}}><div><label style={{display:"block",fontSize:"0.75rem",fontWeight:600,color:T.ink3,marginBottom:"0.3rem"}}>Progress: {uf.progress}%</label><input type="range" min={0} max={100} value={uf.progress} onChange={e=>setUf(f=>({...f,progress:Number(e.target.value)}))} style={{width:"100%",accentColor:T.saffron}}/></div><div><label style={{display:"block",fontSize:"0.75rem",fontWeight:600,color:T.ink3,marginBottom:"0.3rem"}}>Status</label><select value={uf.status} onChange={e=>setUf(f=>({...f,status:e.target.value}))} style={{...IS,padding:"0.5rem 0.75rem",cursor:"pointer"}}><option value="not_started">Not Started</option><option value="in_progress">In Progress</option><option value="partially_done">Partially Done</option><option value="completed">Completed</option></select></div><div style={{gridColumn:"span 2"}}><label style={{display:"block",fontSize:"0.75rem",fontWeight:600,color:T.ink3,marginBottom:"0.3rem"}}>Note *</label><input style={IS} placeholder="What changed?" value={uf.note} onChange={e=>setUf(f=>({...f,note:e.target.value}))}/></div><div style={{gridColumn:"span 2"}}><label style={{display:"block",fontSize:"0.75rem",fontWeight:600,color:T.ink3,marginBottom:"0.3rem"}}>Source Link</label><input style={IS} placeholder="https://..." value={uf.source_link} onChange={e=>setUf(f=>({...f,source_link:e.target.value}))}/></div><div style={{gridColumn:"span 2",display:"flex",justifyContent:"flex-end"}}><button onClick={async()=>{await api(`/api/admin/promises/${p.id}`,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify(uf)});setUpdating(null);setPromises(ps=>ps.map(x=>x.id===p.id?{...x,...uf}:x));}} style={{padding:"0.65rem 1.5rem",border:"none",borderRadius:10,background:`linear-gradient(135deg,${T.saffron},${T.saffronD})`,color:"#fff",cursor:"pointer",fontWeight:700}}>💾 Save Update</button></div></div>}</div>);})}</div>}
      {tab==="feedback"&&<div style={{display:"flex",flexDirection:"column",gap:"0.7rem"}}>{feedback.length===0&&<div style={{textAlign:"center",color:T.ink4,padding:"3rem",background:T.paper,borderRadius:16}}>No feedback yet</div>}{feedback.map(f=><div key={f.id} style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:14,padding:"1.25rem 1.5rem",boxShadow:T.shadow}}><div style={{fontSize:"0.875rem",color:T.ink,marginBottom:"0.5rem",lineHeight:1.5}}>{f.message}</div><div style={{display:"flex",gap:"0.75rem",fontSize:"0.72rem",color:T.ink4}}><span>👤 {f.citizen_name||"Anonymous"}</span><span>📍 {f.district||"—"}</span></div></div>)}</div>}
    </main>
  );
}

export default function App(){
  const[page,setPage]=useState("home");
  const[lang,setLang]=useState("en");
  const[dept,setDept]=useState(null);
  const P={home:<Home lang={lang} setPage={setPage} setDept={setDept}/>,departments:<Departments lang={lang} setDept={setDept} setPage={setPage}/>,promises:<Promises lang={lang} dept={dept} setDept={setDept}/>,news:<News lang={lang}/>,feedback:<Feedback lang={lang}/>,admin:<Admin/>};
  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#faf8f3;color:#1c1917;font-family:'Plus Jakarta Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#faf8f3;}::-webkit-scrollbar-thumb{background:#d6cfc4;border-radius:3px;}::-webkit-scrollbar-thumb:hover{background:#e07b28;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}
        @keyframes navIn{from{opacity:0;transform:translateY(-60px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%{transform:translateX(-200%);}100%{transform:translateX(200%);}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.7);}}
        select,input,textarea,button{font-family:'Plus Jakarta Sans',sans-serif;}
        @media(max-width:768px){nav{display:none!important;}}
      `}</style>
      <Nav page={page} setPage={setPage} lang={lang} setLang={setLang}/>
      <div key={page} style={{animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both",minHeight:"80vh",background:"#faf8f3"}}>
        {P[page]||P.home}
      </div>
      <footer style={{borderTop:`1px solid ${T.border}`,background:T.paper,padding:"2rem 1.5rem",textAlign:"center"}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1rem",color:T.ink,marginBottom:"0.4rem"}}>Commitment <span style={{color:T.saffron}}>Tracker</span></div>
        <p style={{fontSize:"0.78rem",color:T.ink4}}>Built for the citizens of Telangana · Politically neutral · Transparency is our mission</p>
      </footer>
    </>
  );
}