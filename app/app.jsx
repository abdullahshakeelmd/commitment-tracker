"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ============================================================
// API LAYER
// ============================================================
const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function api(path, opts = {}) {
  try {
    const res = await fetch(`${API}${path}`, opts);
    return res.json();
  } catch { return { data: [] }; }
}

// ============================================================
// DESIGN TOKENS
// ============================================================
const C = {
  bg: "#f5f3ee",
  surface: "#ffffff",
  surface2: "#f9f7f3",
  border: "rgba(0,0,0,0.08)",
  accent: "#b8860b",
  accentLight: "#f5e6b3",
  accentBright: "#d4a017",
  green: "#16a34a",
  greenLight: "#dcfce7",
  blue: "#1d6fa4",
  blueLight: "#dbeafe",
  red: "#dc2626",
  redLight: "#fee2e2",
  yellow: "#d97706",
  yellowLight: "#fef3c7",
  text: "#1a1a1a",
  muted: "#6b6b6b",
  muted2: "#9a9a9a",
  shadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
  shadowHover: "0 4px 12px rgba(0,0,0,0.12), 0 20px 40px rgba(0,0,0,0.1)",
};

// ============================================================
// SAMPLE DATA (used when backend not connected)
// ============================================================
const SAMPLE_STATS = { total: 372, completed: 89, in_progress: 143, not_started: 140, partially_done: 0, govt_score: 43 };
const SAMPLE_DEPTS = [
  { id: 1, name: "6 Guarantees", name_telugu: "6 హామీలు", icon: "⭐", display_order: 1 },
  { id: 2, name: "Agriculture & Irrigation", name_telugu: "వ్యవసాయం", icon: "🌾", display_order: 2 },
  { id: 3, name: "Education", name_telugu: "విద్య", icon: "📚", display_order: 3 },
  { id: 4, name: "Health", name_telugu: "ఆరోగ్యం", icon: "🏥", display_order: 4 },
  { id: 5, name: "Housing & Land", name_telugu: "గృహనిర్మాణం", icon: "🏠", display_order: 5 },
  { id: 6, name: "Youth & Employment", name_telugu: "యువత & ఉపాధి", icon: "💼", display_order: 6 },
  { id: 7, name: "Industry & Economy", name_telugu: "పరిశ్రమ", icon: "🏭", display_order: 7 },
  { id: 8, name: "Transport & Infrastructure", name_telugu: "రవాణా", icon: "🚌", display_order: 8 },
  { id: 9, name: "Women & Child Welfare", name_telugu: "మహిళా సంక్షేమం", icon: "👩‍👧", display_order: 9 },
  { id: 10, name: "SC, ST & BC Welfare", name_telugu: "SC, ST & BC", icon: "🤝", display_order: 10 },
  { id: 11, name: "Minorities & Labour", name_telugu: "మైనారిటీలు", icon: "☪️", display_order: 11 },
  { id: 12, name: "Urban Development", name_telugu: "పట్టణాభివృద్ధి", icon: "🏙️", display_order: 12 },
  { id: 13, name: "Social Welfare", name_telugu: "సామాజిక సంక్షేమం", icon: "👴", display_order: 13 },
  { id: 14, name: "Governance & Law", name_telugu: "పాలన & న్యాయం", icon: "🏛️", display_order: 14 },
  { id: 15, name: "Environment, Sports & Culture", name_telugu: "పర్యావరణం", icon: "🌿", display_order: 15 },
];
const SAMPLE_PROMISES = [
  { id: 1, title: "Mahalakshmi: Rs. 2,500 monthly financial assistance to all women", title_telugu: "మహాలక్ష్మి: మహిళలకు నెలకు రూ. 2,500", progress: 100, status: "completed", district: "All Districts", last_updated: "2024-06-01", is_flagship: true, department_id: 1 },
  { id: 2, title: "Gruha Jyothi: 200 units free electricity for all households", title_telugu: "గృహ జ్యోతి: 200 యూనిట్ల ఉచిత విద్యుత్", progress: 100, status: "completed", district: "All Districts", last_updated: "2024-03-15", is_flagship: true, department_id: 1 },
  { id: 3, title: "Rythu Bharosa: Rs. 15,000 per acre per year to farmers", title_telugu: "రైతు భరోసా: ఎకరాకు రూ. 15,000", progress: 75, status: "in_progress", district: "All Districts", last_updated: "2024-08-20", is_flagship: true, department_id: 1 },
  { id: 4, title: "Cheyutha: Monthly pension of Rs. 4,000 to senior citizens and disabled", title_telugu: "చేయూత: నెలకు రూ. 4,000 పెన్షన్", progress: 60, status: "in_progress", district: "All Districts", last_updated: "2024-07-10", is_flagship: true, department_id: 1 },
  { id: 5, title: "Indiramma Indlu: House site + Rs. 5 lakh to homeless families", title_telugu: "ఇందిరమ్మ ఇళ్లు: ఇంటిస్థలం + రూ. 5 లక్షలు", progress: 30, status: "in_progress", district: "All Districts", last_updated: "2024-09-01", is_flagship: true, department_id: 1 },
  { id: 6, title: "Yuva Vikasam: Vidya Bharosa Card worth Rs. 5 lakh for college students", title_telugu: "యువ వికాసం: విద్యా భరోసా కార్డు రూ. 5 లక్షలు", progress: 45, status: "in_progress", district: "All Districts", last_updated: "2024-08-15", is_flagship: true, department_id: 1 },
  { id: 7, title: "Waive off crop loans up to Rs. 2 lakhs immediately", title_telugu: "రూ. 2 లక్షల వరకు పంట రుణాల మాఫీ", progress: 100, status: "completed", district: "All Districts", last_updated: "2024-01-15", department_id: 2 },
  { id: 8, title: "Fill 2 lakh government jobs in the first year", title_telugu: "మొదటి సంవత్సరంలో 2 లక్షల ప్రభుత్వ ఉద్యోగాల భర్తీ", progress: 35, status: "in_progress", district: "All Districts", last_updated: "2024-09-10", department_id: 6 },
  { id: 9, title: "One super specialty hospital in each district", title_telugu: "ప్రతి జిల్లాలో సూపర్ స్పెషాలిటీ హాస్పిటల్", progress: 20, status: "in_progress", district: "All Districts", last_updated: "2024-08-01", department_id: 4 },
  { id: 10, title: "Reopen 6,000 closed government schools with modern facilities", title_telugu: "6,000 మూసివేసిన పాఠశాలలను తెరవడం", progress: 0, status: "not_started", district: "All Districts", last_updated: "2024-01-01", department_id: 3 },
  { id: 11, title: "Replace Dharani portal with transparent BHUMATHA PORTAL", title_telugu: "ధరణి పోర్టల్ స్థానంలో భూమాత పోర్టల్", progress: 85, status: "in_progress", district: "All Districts", last_updated: "2024-09-15", department_id: 5 },
  { id: 12, title: "New metro lines from LB Nagar to BHEL via Mehdipatnam", title_telugu: "ఎల్బీ నగర్ నుండి BHEL వరకు మెట్రో విస్తరణ", progress: 15, status: "in_progress", district: "Hyderabad", last_updated: "2024-07-20", department_id: 12 },
];

// ============================================================
// UTILITY
// ============================================================
function statusInfo(status) {
  const map = {
    completed: { label: "Completed", labelTe: "పూర్తయింది", color: C.green, bg: C.greenLight },
    in_progress: { label: "In Progress", labelTe: "పురోగతిలో", color: C.blue, bg: C.blueLight },
    not_started: { label: "Not Started", labelTe: "ప్రారంభం కాలేదు", color: C.red, bg: C.redLight },
    partially_done: { label: "Partially Done", labelTe: "పాక్షికంగా పూర్తి", color: C.yellow, bg: C.yellowLight },
  };
  return map[status] || map.not_started;
}

function progressColor(pct) {
  if (pct === 100) return C.green;
  if (pct >= 60) return C.blue;
  if (pct > 0) return C.yellow;
  return C.red;
}

function timeAgo(dateStr) {
  if (!dateStr) return "Unknown";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days/30)} months ago`;
  return `${Math.floor(days/365)} years ago`;
}

// ============================================================
// ANIMATED NUMBER
// ============================================================
function AnimatedNumber({ value }) {
  const [cur, setCur] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current || !value) return;
    ref.current = true;
    let n = 0;
    const step = Math.max(1, Math.floor(value / 60));
    const t = setInterval(() => {
      n = Math.min(n + step, value);
      setCur(n);
      if (n >= value) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <>{cur}</>;
}

// ============================================================
// PROGRESS BAR
// ============================================================
function ProgressBar({ pct, height = 8, delay = 0 }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  const color = progressColor(pct);
  return (
    <div style={{ height, background: "rgba(0,0,0,0.07)", borderRadius: 100, overflow: "hidden", position: "relative" }}>
      <div style={{
        height: "100%", borderRadius: 100, background: color,
        width: `${w}%`, transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: `0 0 10px ${color}55`,
      }} />
    </div>
  );
}

// ============================================================
// SCORE RING
// ============================================================
function ScoreRing({ score }) {
  const r = 54, circ = 2 * Math.PI * r;
  const [off, setOff] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setOff(circ - (score / 100) * circ), 500);
    return () => clearTimeout(t);
  }, [score]);
  return (
    <div style={{ position: "relative", width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={C.accentBright} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1) 0.5s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-syne)", fontSize: "2rem", fontWeight: 800, color: C.text, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: "0.65rem", color: C.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>/ 100</div>
      </div>
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, setPage, lang, setLang }) {
  const [scroll, setScroll] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const h = () => setScroll(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { id: "home", en: "Dashboard", te: "డాష్‌బోర్డ్" },
    { id: "departments", en: "Departments", te: "విభాగాలు" },
    { id: "promises", en: "All Promises", te: "అన్ని హామీలు" },
    { id: "news", en: "Updates", te: "నవీకరణలు" },
    { id: "feedback", en: "Feedback", te: "అభిప్రాయం" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scroll ? "rgba(245,243,238,0.92)" : C.surface,
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${C.border}`,
      boxShadow: scroll ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
      transition: "all 0.3s ease",
      animation: "slideDown 0.6s ease both",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setPage("home")} style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 38, height: 38, background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: 14, color: "#fff", boxShadow: `0 4px 12px ${C.accent}44` }}>CT</div>
          <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem", color: C.text }}>
            Commitment <span style={{ color: C.accent }}>Tracker</span>
          </div>
        </button>
        <nav style={{ display: "flex", gap: "0.25rem" }} className="desktop-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              padding: "0.4rem 0.85rem", borderRadius: 100, border: "none", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: 500,
              background: page === l.id ? C.accentLight : "transparent",
              color: page === l.id ? C.accent : C.muted,
              transition: "all 0.2s ease",
            }}
              onMouseEnter={e => { if (page !== l.id) { e.target.style.background = "rgba(0,0,0,0.04)"; e.target.style.color = C.text; } }}
              onMouseLeave={e => { if (page !== l.id) { e.target.style.background = "transparent"; e.target.style.color = C.muted; } }}
            >{lang === "te" ? l.te : l.en}</button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: C.green, fontWeight: 600 }}>
            <div style={{ width: 7, height: 7, background: C.green, borderRadius: "50%", animation: "pulse 2s infinite" }} />
            Live
          </div>
          <button onClick={() => setLang(lang === "en" ? "te" : "en")} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, borderRadius: 100, background: C.surface, color: C.accent, cursor: "pointer" }}>
            {lang === "en" ? "తెలుగు" : "English"}
          </button>
          <button onClick={() => setPage("admin")} style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.3rem 0.75rem", border: `1px solid ${C.border}`, borderRadius: 100, background: "transparent", color: C.muted, cursor: "pointer" }}>Admin</button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ lang, setPage, setSelectedDept }) {
  const [stats, setStats] = useState(SAMPLE_STATS);
  const [depts, setDepts] = useState(SAMPLE_DEPTS);
  const [recent, setRecent] = useState(SAMPLE_PROMISES.slice(0, 5));
  const [flagship, setFlagship] = useState(SAMPLE_PROMISES.filter(p => p.is_flagship));
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/api/promises/stats/overview").then(r => r.data && setStats(r.data));
    api("/api/departments/").then(r => r.data?.length && setDepts(r.data));
    api("/api/promises/recent-updates").then(r => r.data?.length && setRecent(r.data.slice(0, 5)));
    api("/api/promises/?is_flagship=true").then(r => r.data?.length && setFlagship(r.data));
  }, []);

  const deptProgress = { 1: 72, 2: 45, 3: 38, 4: 29, 5: 55, 6: 35, 7: 22, 8: 40, 9: 68, 10: 30, 11: 25, 12: 18, 13: 42, 14: 50, 15: 15 };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 4rem" }}>

      {/* HERO */}
      <section style={{ padding: "4rem 0 3rem", animation: "fadeUp 0.7s ease both" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", fontWeight: 600, color: C.accent, letterSpacing: "0.12em", textTransform: "uppercase", border: `1px solid ${C.accentLight}`, background: C.accentLight, padding: "0.3rem 0.85rem", borderRadius: 100, marginBottom: "1.5rem" }}>
          🏛️ {lang === "te" ? "తెలంగాణ · INC ప్రభుత్వం · 2023–2028" : "Telangana · INC Government · 2023–2028"}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(2.2rem,5vw,3.8rem)", fontWeight: 800, lineHeight: 1.06, letterSpacing: "-0.02em", color: C.text, marginBottom: "1rem" }}>
              {lang === "te" ? <>ప్రతి హామీ <span style={{ color: C.accent }}>ట్రాక్</span> చేయబడింది.</> : <>Every promise <span style={{ color: C.accent }}>tracked.</span> Every rupee accounted for.</>}
            </h1>
            <p style={{ fontSize: "1rem", color: C.muted, lineHeight: 1.7, maxWidth: 520, marginBottom: "2rem" }}>
              {lang === "te" ? "తెలంగాణ ప్రభుత్వం చేసిన 372 హామీలను విభాగాల వారీగా, జిల్లాల వారీగా ట్రాక్ చేయండి." : "Tracking all 372 manifesto commitments made by the Telangana government — department by department, district by district, in real time."}
            </p>
            {/* Search */}
            <div style={{ position: "relative", maxWidth: 460 }}>
              <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: C.muted2, fontSize: "1rem" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && search) setPage("promises"); }}
                placeholder={lang === "te" ? "హామీలను వెతకండి..." : "Search any promise..."} style={{
                  width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem",
                  border: `1.5px solid ${C.border}`, borderRadius: 14,
                  background: C.surface, color: C.text, fontSize: "0.9rem",
                  outline: "none", boxShadow: C.shadow,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = C.shadow; }}
              />
            </div>
          </div>
          {/* Score ring */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "1.5rem 2rem", boxShadow: C.shadow }}>
            <ScoreRing score={stats.govt_score || 43} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.9rem", color: C.text }}>{lang === "te" ? "ప్రభుత్వ స్కోర్" : "Govt. Score"}</div>
              <div style={{ fontSize: "0.72rem", color: C.muted2 }}>{lang === "te" ? "అన్ని హామీల ఆధారంగా" : "Based on all promises"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* SCORECARD */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem", animation: "fadeUp 0.7s ease 0.15s both" }}>
        {[
          { label: lang === "te" ? "మొత్తం హామీలు" : "Total Promises", value: stats.total, color: C.accent, bg: C.accentLight, icon: "📋" },
          { label: lang === "te" ? "పూర్తయినవి" : "Completed", value: stats.completed, color: C.green, bg: C.greenLight, icon: "✅" },
          { label: lang === "te" ? "పురోగతిలో" : "In Progress", value: stats.in_progress, color: C.blue, bg: C.blueLight, icon: "🔄" },
          { label: lang === "te" ? "ప్రారంభం కాలేదు" : "Not Started", value: stats.not_started, color: C.red, bg: C.redLight, icon: "⏳" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "1.5rem", boxShadow: C.shadow, position: "relative", overflow: "hidden", transition: "transform 0.25s, box-shadow 0.25s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = C.shadowHover; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = C.shadow; }}
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: "18px 18px 0 0" }} />
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
            <div style={{ fontFamily: "var(--font-syne)", fontSize: "2.4rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>
              <AnimatedNumber value={s.value || 0} />
            </div>
            <div style={{ fontSize: "0.78rem", color: C.muted, marginTop: "0.3rem", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* 6 GUARANTEES FLAGSHIP */}
      <section style={{ marginBottom: "3rem", animation: "fadeUp 0.7s ease 0.25s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.3rem", fontWeight: 700, color: C.text }}>
            ⭐ {lang === "te" ? "6 అభయ హస్తం హామీలు" : "6 Abhaya Hastam Guarantees"}
          </h2>
          <button onClick={() => { setSelectedDept(1); setPage("promises"); }} style={{ fontSize: "0.78rem", color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {lang === "te" ? "అన్నీ చూడండి →" : "View all →"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "0.85rem" }}>
          {flagship.slice(0, 6).map((p, i) => {
            const si = statusInfo(p.status);
            return (
              <div key={p.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.25rem", boxShadow: C.shadow, transition: "all 0.25s ease", cursor: "pointer", animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.borderColor = C.accentBright + "66"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.borderColor = C.border; }}
                onClick={() => setPage("promises")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 500, color: C.text, lineHeight: 1.45, flex: 1 }}>
                    {lang === "te" && p.title_telugu ? p.title_telugu : p.title}
                  </p>
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: 100, background: si.bg, color: si.color, whiteSpace: "nowrap", flexShrink: 0 }}>
                    {lang === "te" ? si.labelTe : si.label}
                  </span>
                </div>
                <ProgressBar pct={p.progress} height={6} delay={i * 80} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.7rem", color: C.muted2 }}>{timeAgo(p.last_updated)}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: progressColor(p.progress) }}>{p.progress}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section style={{ marginBottom: "3rem", animation: "fadeUp 0.7s ease 0.35s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.3rem", fontWeight: 700, color: C.text }}>
            {lang === "te" ? "విభాగాల వారీగా" : "By Department"}
          </h2>
          <button onClick={() => setPage("departments")} style={{ fontSize: "0.78rem", color: C.accent, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {lang === "te" ? "అన్నీ చూడండి →" : "View all →"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.85rem" }}>
          {depts.map((d, i) => (
            <button key={d.id} onClick={() => { setSelectedDept(d.id); setPage("promises"); }} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
              padding: "1.25rem", cursor: "pointer", textAlign: "left",
              boxShadow: C.shadow, transition: "all 0.25s ease",
              animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.borderColor = C.accent + "55"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.borderColor = C.border; }}
            >
              <div style={{ fontSize: "1.75rem", marginBottom: "0.6rem" }}>{d.icon}</div>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.88rem", color: C.text, marginBottom: "0.2rem" }}>
                {lang === "te" ? d.name_telugu || d.name : d.name}
              </div>
              <ProgressBar pct={deptProgress[d.id] || 30} height={5} delay={i * 60} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.4rem" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: progressColor(deptProgress[d.id] || 30) }}>{deptProgress[d.id] || 30}%</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* RECENT UPDATES */}
      <section style={{ animation: "fadeUp 0.7s ease 0.45s both" }}>
        <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.3rem", fontWeight: 700, color: C.text, marginBottom: "1.25rem" }}>
          🕐 {lang === "te" ? "తాజా నవీకరణలు" : "Recent Updates"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {recent.map((p, i) => {
            const si = statusInfo(p.status);
            return (
              <div key={p.id} onClick={() => setPage("promises")} style={{
                background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
                padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "2.5rem 1fr auto",
                gap: "1rem", alignItems: "center", cursor: "pointer", transition: "all 0.2s",
                animation: `fadeUp 0.5s ease ${i * 0.06}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.borderColor = C.accent + "44"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
              >
                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "0.85rem", color: C.muted2, textAlign: "center" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem", lineHeight: 1.4 }}>
                    {lang === "te" && p.title_telugu ? p.title_telugu : p.title}
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.18rem 0.55rem", borderRadius: 100, background: si.bg, color: si.color }}>{lang === "te" ? si.labelTe : si.label}</span>
                    <span style={{ fontSize: "0.7rem", color: C.muted2 }}>📍 {p.district || "All Districts"}</span>
                    <span style={{ fontSize: "0.7rem", color: C.muted2 }}>🕐 {timeAgo(p.last_updated)}</span>
                  </div>
                </div>
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: "1.1rem", fontWeight: 800, color: progressColor(p.progress), textAlign: "right", marginBottom: "0.35rem" }}>{p.progress}%</div>
                  <ProgressBar pct={p.progress} height={5} delay={i * 60} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ============================================================
// PROMISES PAGE
// ============================================================
function PromisesPage({ lang, selectedDept, setSelectedDept }) {
  const [promises, setPromises] = useState(SAMPLE_PROMISES);
  const [depts, setDepts] = useState(SAMPLE_DEPTS);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [voted, setVoted] = useState({});

  useEffect(() => {
    api("/api/departments/").then(r => r.data?.length && setDepts(r.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (selectedDept) params.department_id = selectedDept;
    if (status) params.status = status;
    if (search) params.search = search;
    if (district) params.district = district;
    const qs = new URLSearchParams(params).toString();
    api(`/api/promises/?${qs}`).then(r => {
      if (r.data?.length) setPromises(r.data);
      else {
        let filtered = SAMPLE_PROMISES;
        if (selectedDept) filtered = filtered.filter(p => p.department_id === selectedDept);
        if (status) filtered = filtered.filter(p => p.status === status);
        if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        setPromises(filtered);
      }
    });
  }, [selectedDept, status, search, district]);

  const handleVote = async (id) => {
    if (voted[id]) return;
    setVoted(v => ({ ...v, [id]: true }));
    await api(`/api/promises/${id}/vote`, { method: "POST" });
  };

  const DISTRICTS = ["All Districts", "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda", "Adilabad", "Rangareddy", "Medak", "Mahabubabad"];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 4rem", animation: "fadeUp 0.6s ease both" }}>
      <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.8rem", fontWeight: 800, color: C.text, marginBottom: "1.5rem" }}>
        {selectedDept ? (depts.find(d => d.id === selectedDept)?.icon + " " + (lang === "te" ? depts.find(d => d.id === selectedDept)?.name_telugu : depts.find(d => d.id === selectedDept)?.name) || "Promises") : (lang === "te" ? "అన్ని హామీలు" : "All Promises")}
      </h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={lang === "te" ? "వెతకండి..." : "Search promises..."} style={{ padding: "0.6rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.surface, color: C.text, fontSize: "0.85rem", outline: "none", minWidth: 220, boxShadow: C.shadow }}
          onFocus={e => { e.target.style.borderColor = C.accent; }}
          onBlur={e => { e.target.style.borderColor = C.border; }} />

        <select value={selectedDept || ""} onChange={e => setSelectedDept(e.target.value ? Number(e.target.value) : null)} style={{ padding: "0.6rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.surface, color: C.text, fontSize: "0.85rem", outline: "none", cursor: "pointer" }}>
          <option value="">{lang === "te" ? "అన్ని విభాగాలు" : "All Departments"}</option>
          {depts.map(d => <option key={d.id} value={d.id}>{d.icon} {lang === "te" ? d.name_telugu || d.name : d.name}</option>)}
        </select>

        <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: "0.6rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.surface, color: C.text, fontSize: "0.85rem", outline: "none", cursor: "pointer" }}>
          <option value="">{lang === "te" ? "అన్ని స్థితులు" : "All Status"}</option>
          <option value="completed">{lang === "te" ? "పూర్తయింది" : "Completed"}</option>
          <option value="in_progress">{lang === "te" ? "పురోగతిలో" : "In Progress"}</option>
          <option value="not_started">{lang === "te" ? "ప్రారంభం కాలేదు" : "Not Started"}</option>
          <option value="partially_done">{lang === "te" ? "పాక్షికంగా పూర్తి" : "Partially Done"}</option>
        </select>

        <select value={district} onChange={e => setDistrict(e.target.value === "All Districts" ? "" : e.target.value)} style={{ padding: "0.6rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.surface, color: C.text, fontSize: "0.85rem", outline: "none", cursor: "pointer" }}>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div style={{ fontSize: "0.8rem", color: C.muted2, marginBottom: "1rem" }}>
        {promises.length} {lang === "te" ? "హామీలు కనుగొనబడ్డాయి" : "promises found"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        {promises.map((p, i) => {
          const si = statusInfo(p.status);
          return (
            <div key={p.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.25rem 1.5rem", boxShadow: C.shadow, transition: "all 0.22s ease", animation: `fadeUp 0.4s ease ${Math.min(i, 10) * 0.04}s both` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.borderColor = C.accent + "44"; e.currentTarget.style.transform = "translateX(3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = ""; }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "2rem 1fr auto", gap: "1rem", alignItems: "start" }}>
                <div style={{ fontFamily: "var(--font-syne)", fontWeight: 800, fontSize: "0.8rem", color: C.muted2, paddingTop: 2 }}>
                  {String(p.id).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 500, color: C.text, marginBottom: "0.75rem", lineHeight: 1.5 }}>
                    {lang === "te" && p.title_telugu ? p.title_telugu : p.title}
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: 100, background: si.bg, color: si.color }}>{lang === "te" ? si.labelTe : si.label}</span>
                    <span style={{ fontSize: "0.7rem", color: C.muted2 }}>📍 {p.district || "All Districts"}</span>
                    <span style={{ fontSize: "0.7rem", color: C.muted2 }}>🕐 {timeAgo(p.last_updated)}</span>
                  </div>
                  <ProgressBar pct={p.progress} height={7} delay={i * 40} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <div style={{ fontFamily: "var(--font-syne)", fontSize: "1.4rem", fontWeight: 800, color: progressColor(p.progress) }}>{p.progress}%</div>
                  <button onClick={() => handleVote(p.id)} style={{ fontSize: "0.7rem", padding: "0.25rem 0.6rem", border: `1px solid ${C.border}`, borderRadius: 100, background: voted[p.id] ? C.accentLight : "transparent", color: voted[p.id] ? C.accent : C.muted, cursor: "pointer", transition: "all 0.2s" }}>
                    {voted[p.id] ? "👍 Voted" : "👍 Important"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// DEPARTMENTS PAGE
// ============================================================
function DepartmentsPage({ lang, setSelectedDept, setPage }) {
  const [depts, setDepts] = useState(SAMPLE_DEPTS);
  const deptProgress = { 1: 72, 2: 45, 3: 38, 4: 29, 5: 55, 6: 35, 7: 22, 8: 40, 9: 68, 10: 30, 11: 25, 12: 18, 13: 42, 14: 50, 15: 15 };
  const deptCounts = { 1: 13, 2: 39, 3: 35, 4: 13, 5: 15, 6: 20, 7: 9, 8: 13, 9: 8, 10: 36, 11: 32, 12: 19, 13: 11, 14: 10, 15: 25 };

  useEffect(() => { api("/api/departments/").then(r => r.data?.length && setDepts(r.data)); }, []);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 4rem", animation: "fadeUp 0.6s ease both" }}>
      <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.8rem", fontWeight: 800, color: C.text, marginBottom: "0.5rem" }}>
        {lang === "te" ? "విభాగాలు" : "All Departments"}
      </h1>
      <p style={{ color: C.muted, marginBottom: "2rem", fontSize: "0.9rem" }}>
        {lang === "te" ? "15 విభాగాల వారీగా హామీలను చూడండి" : "Browse all 372 promises across 15 departments"}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.1rem" }}>
        {depts.map((d, i) => {
          const pct = deptProgress[d.id] || 30;
          return (
            <button key={d.id} onClick={() => { setSelectedDept(d.id); setPage("promises"); }} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20,
              padding: "1.75rem", cursor: "pointer", textAlign: "left",
              boxShadow: C.shadow, transition: "all 0.3s ease",
              animation: `fadeUp 0.5s ease ${i * 0.05}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.borderColor = C.accent + "66"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.borderColor = C.border; }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{d.icon}</div>
              <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "1rem", color: C.text, marginBottom: "0.25rem" }}>
                {lang === "te" ? d.name_telugu || d.name : d.name}
              </div>
              <div style={{ fontSize: "0.78rem", color: C.muted2, marginBottom: "1.25rem" }}>
                {deptCounts[d.id] || "—"} {lang === "te" ? "హామీలు" : "promises"}
              </div>
              <ProgressBar pct={pct} height={7} delay={i * 60} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", color: C.muted2 }}>{lang === "te" ? "పురోగతి" : "Progress"}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: progressColor(pct) }}>{pct}%</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// FEEDBACK PAGE
// ============================================================
function FeedbackPage({ lang }) {
  const [form, setForm] = useState({ citizen_name: "", district: "", message: "", promise_id: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const DISTRICTS = ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Nalgonda", "Adilabad", "Rangareddy", "Medak", "Mahabubabad", "Other"];

  const handleSubmit = async () => {
    if (!form.message.trim()) { setError(lang === "te" ? "దయచేసి మీ సందేశం నమోదు చేయండి" : "Please enter your message"); return; }
    setSubmitting(true); setError("");
    try {
      const body = { message: form.message, citizen_name: form.citizen_name || null, district: form.district || null, promise_id: form.promise_id ? Number(form.promise_id) : null };
      await api("/api/feedback/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setSubmitted(true);
    } catch { setError("Submission failed. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inputStyle = { width: "100%", padding: "0.85rem 1rem", border: `1.5px solid ${C.border}`, borderRadius: 12, background: C.surface, color: C.text, fontSize: "0.9rem", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", fontFamily: "inherit" };

  if (submitted) return (
    <div style={{ maxWidth: 600, margin: "4rem auto", padding: "3rem", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, boxShadow: C.shadow, textAlign: "center", animation: "fadeUp 0.6s ease both" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
      <h2 style={{ fontFamily: "var(--font-syne)", fontSize: "1.5rem", fontWeight: 700, color: C.green, marginBottom: "0.75rem" }}>
        {lang === "te" ? "అభిప్రాయం నమోదు అయింది!" : "Feedback Submitted!"}
      </h2>
      <p style={{ color: C.muted, lineHeight: 1.6 }}>
        {lang === "te" ? "మీ అభిప్రాయానికి ధన్యవాదాలు. అడ్మిన్ దీన్ని సమీక్షిస్తారు." : "Thank you for your feedback. The admin will review it shortly."}
      </p>
      <button onClick={() => setSubmitted(false)} style={{ marginTop: "1.5rem", padding: "0.75rem 1.5rem", background: C.accentLight, border: "none", borderRadius: 10, color: C.accent, cursor: "pointer", fontWeight: 600 }}>
        {lang === "te" ? "మళ్ళీ సమర్పించండి" : "Submit Another"}
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 1.5rem 4rem", animation: "fadeUp 0.6s ease both" }}>
      <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.8rem", fontWeight: 800, color: C.text, marginBottom: "0.5rem" }}>
        {lang === "te" ? "అభిప్రాయం తెలపండి" : "Share Your Feedback"}
      </h1>
      <p style={{ color: C.muted, marginBottom: "2rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
        {lang === "te" ? "మీరు మీ ప్రాంతంలో హామీ అమలును గమనించారా? మాకు తెలియజేయండి." : "Have you observed progress (or lack thereof) on any promise in your area? Let us know."}
      </p>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2rem", boxShadow: C.shadow, display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: C.muted, marginBottom: "0.4rem", letterSpacing: "0.04em" }}>
            {lang === "te" ? "మీ పేరు (ఐచ్ఛికం)" : "Your Name (Optional)"}
          </label>
          <input style={inputStyle} placeholder={lang === "te" ? "మీ పేరు..." : "Your name..."} value={form.citizen_name} onChange={e => setForm(f => ({ ...f, citizen_name: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: C.muted, marginBottom: "0.4rem" }}>
            {lang === "te" ? "మీ జిల్లా" : "Your District"}
          </label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={form.district} onChange={e => setForm(f => ({ ...f, district: e.target.value }))}>
            <option value="">{lang === "te" ? "జిల్లా ఎంచుకోండి" : "Select District"}</option>
            {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: C.muted, marginBottom: "0.4rem" }}>
            {lang === "te" ? "మీ సందేశం *" : "Your Message *"}
          </label>
          <textarea style={{ ...inputStyle, height: 130, resize: "vertical" }} placeholder={lang === "te" ? "మీ ప్రాంతంలో ఏం జరుగుతుందో వివరించండి..." : "Describe what you've observed in your area..."} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px ${C.accentLight}`; }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }} />
        </div>
        {error && <div style={{ fontSize: "0.82rem", color: C.red, background: C.redLight, padding: "0.6rem 1rem", borderRadius: 8 }}>{error}</div>}
        <button onClick={handleSubmit} disabled={submitting} style={{
          padding: "0.9rem", borderRadius: 12, border: "none", cursor: submitting ? "not-allowed" : "pointer",
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`,
          color: "#fff", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem",
          boxShadow: `0 4px 15px ${C.accent}44`, transition: "all 0.2s", opacity: submitting ? 0.7 : 1,
        }}
          onMouseEnter={e => { if (!submitting) e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.transform = ""; }}
        >
          {submitting ? "⏳ Submitting..." : (lang === "te" ? "📤 సమర్పించండి" : "📤 Submit Feedback")}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// NEWS PAGE
// ============================================================
function NewsPage({ lang }) {
  const [news, setNews] = useState([
    { id: 1, title: "Rythu Bharosa payments released for Kharif season", title_telugu: "ఖరీఫ్ సీజన్‌కు రైతు భరోసా చెల్లింపులు విడుదల", content: "The Telangana government has released Rs. 7,200 crores towards Rythu Bharosa payments for the 2024 Kharif season, benefiting 52 lakh farmers across the state.", published_at: "2024-09-10" },
    { id: 2, title: "Gruha Jyothi scheme: 200 units free power implemented statewide", title_telugu: "గృహ జ్యోతి పథకం: రాష్ట్రవ్యాప్తంగా 200 యూనిట్ల ఉచిత విద్యుత్ అమలు", content: "Over 1.2 crore households are now receiving 200 units of free electricity every month under the Gruha Jyothi scheme.", published_at: "2024-08-22" },
    { id: 3, title: "Crop loan waiver: 22 lakh farmers benefit", title_telugu: "పంట రుణాల మాఫీ: 22 లక్షల మంది రైతులు లాభపడ్డారు", content: "The government has waived crop loans up to Rs. 2 lakhs for 22 lakh farmers in the first phase. The second phase covering remaining farmers is underway.", published_at: "2024-07-15" },
    { id: 4, title: "6,000 school reopening drive — delayed", title_telugu: "6,000 పాఠశాలల పునఃప్రారంభం — ఆలస్యం", content: "The promise to reopen 6,000 closed government schools has faced significant delays. Only 847 schools have been reopened so far, with budget constraints cited as the reason.", published_at: "2024-09-01" },
  ]);
  useEffect(() => { api("/api/news/").then(r => r.data?.length && setNews(r.data)); }, []);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem 4rem", animation: "fadeUp 0.6s ease both" }}>
      <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.8rem", fontWeight: 800, color: C.text, marginBottom: "0.5rem" }}>
        {lang === "te" ? "తాజా నవీకరణలు" : "Latest Updates"}
      </h1>
      <p style={{ color: C.muted, marginBottom: "2rem", fontSize: "0.9rem" }}>
        {lang === "te" ? "ప్రభుత్వ పనితీరుపై నవీనమైన కథనాలు" : "Latest news and analysis on government promise delivery"}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {news.map((n, i) => (
          <div key={n.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: "1.75rem", boxShadow: C.shadow, transition: "all 0.25s", animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = C.shadowHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = C.shadow; e.currentTarget.style.transform = ""; }}
          >
            <div style={{ fontSize: "0.7rem", color: C.muted2, marginBottom: "0.5rem", fontWeight: 500 }}>
              📅 {new Date(n.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            <h3 style={{ fontFamily: "var(--font-syne)", fontSize: "1.05rem", fontWeight: 700, color: C.text, marginBottom: "0.75rem", lineHeight: 1.4 }}>
              {lang === "te" && n.title_telugu ? n.title_telugu : n.title}
            </h3>
            <p style={{ fontSize: "0.875rem", color: C.muted, lineHeight: 1.7 }}>
              {lang === "te" && n.content_telugu ? n.content_telugu : n.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PAGE
// ============================================================
function AdminPage({ lang }) {
  const [token, setToken] = useState(typeof window !== "undefined" ? localStorage.getItem("ct_admin_token") : null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logging, setLogging] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [promises, setPromises] = useState(SAMPLE_PROMISES);
  const [updating, setUpdating] = useState(null);
  const [updateForm, setUpdateForm] = useState({ progress: 0, status: "not_started", note: "", source_link: "" });
  const [tab, setTab] = useState("promises");
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    if (!token) return;
    api("/api/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data && setDashboard(r.data));
    api("/api/promises/").then(r => r.data?.length && setPromises(r.data));
    api("/api/feedback/", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data && setFeedback(r.data));
  }, [token]);

  const handleLogin = async () => {
    setLogging(true); setError("");
    const res = await api("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.token) { localStorage.setItem("ct_admin_token", res.token); setToken(res.token); }
    else setError(res.detail || "Invalid credentials");
    setLogging(false);
  };

  const handleUpdate = async (id) => {
    const res = await api(`/api/admin/promises/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(updateForm) });
    if (res.success) { setUpdating(null); api("/api/promises/").then(r => r.data?.length && setPromises(r.data)); }
  };

  const inputStyle = { width: "100%", padding: "0.65rem 0.9rem", border: `1.5px solid ${C.border}`, borderRadius: 10, background: C.bg, color: C.text, fontSize: "0.85rem", outline: "none", fontFamily: "inherit" };

  if (!token) return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: "0 1.5rem", animation: "fadeUp 0.6s ease both" }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: "2.5rem", boxShadow: C.shadow }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🔐</div>
          <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.4rem", fontWeight: 800, color: C.text }}>Admin Login</h1>
          <p style={{ fontSize: "0.82rem", color: C.muted2, marginTop: "0.3rem" }}>Commitment Tracker — Secure Access</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input type="email" style={inputStyle} placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
          <input type="password" style={inputStyle} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
          {error && <div style={{ fontSize: "0.8rem", color: C.red, background: C.redLight, padding: "0.5rem 0.8rem", borderRadius: 8 }}>{error}</div>}
          <button onClick={handleLogin} disabled={logging} style={{ padding: "0.85rem", borderRadius: 12, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`, color: "#fff", fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem", boxShadow: `0 4px 15px ${C.accent}44` }}>
            {logging ? "Logging in..." : "Login →"}
          </button>
        </div>
        <p style={{ fontSize: "0.72rem", color: C.muted2, textAlign: "center", marginTop: "1.5rem" }}>Default: abdullahshakeelmd@gmail.com / admin123</p>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem 4rem", animation: "fadeUp 0.6s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "1.6rem", fontWeight: 800, color: C.text }}>🔐 Admin Dashboard</h1>
        <button onClick={() => { localStorage.removeItem("ct_admin_token"); setToken(null); }} style={{ padding: "0.5rem 1rem", border: `1px solid ${C.border}`, borderRadius: 10, background: "transparent", color: C.muted, cursor: "pointer", fontSize: "0.82rem" }}>Logout</button>
      </div>

      {/* Stats */}
      {dashboard && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: "0.85rem", marginBottom: "2rem" }}>
          {[
            { label: "Total", value: dashboard.total_promises, color: C.accent },
            { label: "Completed", value: dashboard.completed, color: C.green },
            { label: "In Progress", value: dashboard.in_progress, color: C.blue },
            { label: "Pending Feedback", value: dashboard.pending_feedback, color: C.yellow },
            { label: "Pending Photos", value: dashboard.pending_photos, color: C.red },
          ].map((s, i) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "1.25rem", boxShadow: C.shadow }}>
              <div style={{ fontFamily: "var(--font-syne)", fontSize: "2rem", fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: C.muted }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: C.surface2, borderRadius: 12, padding: "0.3rem", width: "fit-content", border: `1px solid ${C.border}` }}>
        {["promises", "feedback"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "0.5rem 1.25rem", borderRadius: 9, border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, background: tab === t ? C.surface : "transparent", color: tab === t ? C.accent : C.muted, boxShadow: tab === t ? C.shadow : "none", transition: "all 0.2s" }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Promises tab */}
      {tab === "promises" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {promises.map(p => {
            const si = statusInfo(p.status);
            const isUpdating = updating === p.id;
            return (
              <div key={p.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.25rem 1.5rem", boxShadow: C.shadow }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: isUpdating ? "1rem" : 0 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, color: C.text, marginBottom: "0.5rem" }}>{p.title}</div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, padding: "0.18rem 0.55rem", borderRadius: 100, background: si.bg, color: si.color }}>{si.label}</span>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: progressColor(p.progress) }}>{p.progress}%</span>
                    </div>
                  </div>
                  <button onClick={() => { setUpdating(isUpdating ? null : p.id); setUpdateForm({ progress: p.progress, status: p.status, note: "", source_link: p.source_link || "" }); }}
                    style={{ padding: "0.4rem 0.9rem", border: `1px solid ${C.accent}`, borderRadius: 8, background: isUpdating ? C.accentLight : "transparent", color: C.accent, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                    {isUpdating ? "Cancel" : "✏️ Update"}
                  </button>
                </div>
                {isUpdating && (
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", animation: "fadeUp 0.3s ease both" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.3rem" }}>Progress: {updateForm.progress}%</label>
                      <input type="range" min={0} max={100} value={updateForm.progress} onChange={e => setUpdateForm(f => ({ ...f, progress: Number(e.target.value) }))} style={{ width: "100%", accentColor: C.accent }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.3rem" }}>Status</label>
                      <select value={updateForm.status} onChange={e => setUpdateForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, padding: "0.5rem 0.75rem" }}>
                        <option value="not_started">Not Started</option>
                        <option value="in_progress">In Progress</option>
                        <option value="partially_done">Partially Done</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.3rem" }}>Note / Reason for update *</label>
                      <input style={inputStyle} placeholder="What changed? Add context..." value={updateForm.note} onChange={e => setUpdateForm(f => ({ ...f, note: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: C.muted, marginBottom: "0.3rem" }}>Source Link (news article, govt order)</label>
                      <input style={inputStyle} placeholder="https://..." value={updateForm.source_link} onChange={e => setUpdateForm(f => ({ ...f, source_link: e.target.value }))} />
                    </div>
                    <div style={{ gridColumn: "span 2", display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={() => handleUpdate(p.id)} style={{ padding: "0.65rem 1.5rem", border: "none", borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.accentBright})`, color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem" }}>
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

      {/* Feedback tab */}
      {tab === "feedback" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
          {feedback.length === 0 && <div style={{ textAlign: "center", color: C.muted2, padding: "3rem" }}>No feedback yet</div>}
          {feedback.map(f => (
            <div key={f.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: "1.25rem 1.5rem", boxShadow: C.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", color: C.text, marginBottom: "0.5rem", lineHeight: 1.5 }}>{f.message}</div>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.72rem", color: C.muted2 }}>
                    <span>👤 {f.citizen_name || "Anonymous"}</span>
                    <span>📍 {f.district || "—"}</span>
                    <span>📅 {new Date(f.submitted_at).toLocaleDateString("en-IN")}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  {["reviewed", "escalated"].map(s => (
                    <button key={s} onClick={() => api(`/api/feedback/${f.id}/status?status=${s}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } })} style={{ padding: "0.3rem 0.7rem", border: `1px solid ${C.border}`, borderRadius: 8, background: "transparent", color: s === "escalated" ? C.red : C.green, cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ lang }) {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, background: C.surface, padding: "2rem 1.5rem", textAlign: "center" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontFamily: "var(--font-syne)", fontWeight: 700, fontSize: "0.95rem", color: C.text, marginBottom: "0.5rem" }}>
          Commitment <span style={{ color: C.accent }}>Tracker</span>
        </div>
        <p style={{ fontSize: "0.78rem", color: C.muted2, lineHeight: 1.6 }}>
          {lang === "te" ? "తెలంగాణ పౌరుల కోసం నిర్మించబడింది · రాజకీయ పక్షపాతం లేదు · పారదర్శకత మన లక్ష్యం" : "Built for the citizens of Telangana · Politically neutral · Transparency is our mission"}
        </p>
        <p style={{ fontSize: "0.72rem", color: C.muted2, marginTop: "0.5rem" }}>
          Data updated by verified admin · Last updated: {new Date().toLocaleDateString("en-IN")}
        </p>
      </div>
    </footer>
  );
}

// ============================================================
// ROOT APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("en");
  const [selectedDept, setSelectedDept] = useState(null);

  const pages = {
    home: <HomePage lang={lang} setPage={setPage} setSelectedDept={setSelectedDept} />,
    departments: <DepartmentsPage lang={lang} setSelectedDept={setSelectedDept} setPage={setPage} />,
    promises: <PromisesPage lang={lang} selectedDept={selectedDept} setSelectedDept={setSelectedDept} />,
    news: <NewsPage lang={lang} />,
    feedback: <FeedbackPage lang={lang} />,
    admin: <AdminPage lang={lang} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        :root { --font-syne: 'Syne', sans-serif; --font-dm: 'DM Sans', sans-serif; }
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: #f5f3ee; color: #1a1a1a; font-family: var(--font-dm), sans-serif; overflow-x: hidden; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f5f3ee; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #b8860b; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-60px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        select, input, textarea, button { font-family: var(--font-dm), sans-serif; }
        .desktop-nav { display: flex; }
        @media (max-width: 768px) { .desktop-nav { display: none; } }
      `}</style>
      <Navbar page={page} setPage={setPage} lang={lang} setLang={setLang} />
      <main key={page} style={{ animation: "fadeUp 0.4s ease both" }}>
        {pages[page] || pages.home}
      </main>
      <Footer lang={lang} />
    </>
  );
}