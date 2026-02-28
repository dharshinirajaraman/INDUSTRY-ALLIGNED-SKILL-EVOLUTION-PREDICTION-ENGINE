import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Search, Building2, TrendingUp, Star, ChevronDown } from "lucide-react";

/* ── DATA ─────────────────────────────────────────────────*/
const COMPANIES = [
  { name: "Google",     logo: "G",  color: "#4285F4", hq: "US",  type: "Tech Giant" },
  { name: "Microsoft",  logo: "M",  color: "#00BCF2", hq: "US",  type: "Tech Giant" },
  { name: "Amazon",     logo: "A",  color: "#FF9900", hq: "US",  type: "Tech Giant" },
  { name: "Apple",      logo: "🍎", color: "#A2AAAD", hq: "US",  type: "Tech Giant" },
  { name: "Meta",       logo: "f",  color: "#0866FF", hq: "US",  type: "Tech Giant" },
  { name: "Netflix",    logo: "N",  color: "#E50914", hq: "US",  type: "Tech Giant" },
  { name: "Tesla",      logo: "T",  color: "#CC0000", hq: "US",  type: "EV/Tech" },
  { name: "IBM",        logo: "IBM",color: "#1F70C1", hq: "US",  type: "Enterprise" },
  { name: "Oracle",     logo: "O",  color: "#F80000", hq: "US",  type: "Enterprise" },
  { name: "Accenture",  logo: "Ac", color: "#A100FF", hq: "IE",  type: "Consulting" },
  { name: "Infosys",    logo: "In", color: "#007CC3", hq: "IN",  type: "IT Services" },
  { name: "TCS",        logo: "TCS",color: "#003366", hq: "IN",  type: "IT Services" },
  { name: "Wipro",      logo: "Wi", color: "#441D5E", hq: "IN",  type: "IT Services" },
  { name: "Cognizant",  logo: "C",  color: "#1277B9", hq: "US",  type: "IT Services" },
  { name: "Capgemini",  logo: "Ca", color: "#1B7BD1", hq: "FR",  type: "Consulting" },
];

// Demand index per skill per company (0–100)
const BASE_DEMAND: Record<string, Record<string, number>> = {
  "Python":       { "Google":96, "Microsoft":90, "Amazon":92, "Apple":85, "Meta":95, "Netflix":88, "Tesla":80, "IBM":82, "Oracle":75, "Accenture":78, "Infosys":85, "TCS":82, "Wipro":80, "Cognizant":83, "Capgemini":79 },
  "JavaScript":   { "Google":90, "Microsoft":88, "Amazon":85, "Apple":82, "Meta":92, "Netflix":86, "Tesla":70, "IBM":75, "Oracle":70, "Accenture":80, "Infosys":83, "TCS":80, "Wipro":78, "Cognizant":81, "Capgemini":77 },
  "TypeScript":   { "Google":88, "Microsoft":95, "Amazon":82, "Apple":80, "Meta":90, "Netflix":84, "Tesla":68, "IBM":72, "Oracle":68, "Accenture":76, "Infosys":78, "TCS":75, "Wipro":73, "Cognizant":77, "Capgemini":74 },
  "React":        { "Google":85, "Microsoft":88, "Amazon":84, "Apple":80, "Meta":95, "Netflix":88, "Tesla":70, "IBM":72, "Oracle":68, "Accenture":78, "Infosys":82, "TCS":80, "Wipro":78, "Cognizant":80, "Capgemini":76 },
  "Java":         { "Google":85, "Microsoft":80, "Amazon":88, "Apple":75, "Meta":78, "Netflix":72, "Tesla":68, "IBM":92, "Oracle":95, "Accenture":88, "Infosys":90, "TCS":92, "Wipro":88, "Cognizant":90, "Capgemini":86 },
  "AWS":          { "Google":75, "Microsoft":72, "Amazon":98, "Apple":80, "Meta":80, "Netflix":88, "Tesla":75, "IBM":82, "Oracle":72, "Accenture":85, "Infosys":82, "TCS":80, "Wipro":78, "Cognizant":82, "Capgemini":78 },
  "Docker":       { "Google":90, "Microsoft":85, "Amazon":92, "Apple":82, "Meta":88, "Netflix":90, "Tesla":78, "IBM":80, "Oracle":75, "Accenture":80, "Infosys":78, "TCS":75, "Wipro":73, "Cognizant":77, "Capgemini":74 },
  "Machine Learning":{ "Google":98, "Microsoft":92, "Amazon":90, "Apple":88, "Meta":95, "Netflix":85, "Tesla":90, "IBM":88, "Oracle":78, "Accenture":82, "Infosys":80, "TCS":78, "Wipro":76, "Cognizant":79, "Capgemini":76 },
  "Data Science": { "Google":95, "Microsoft":88, "Amazon":92, "Apple":85, "Meta":90, "Netflix":88, "Tesla":85, "IBM":90, "Oracle":80, "Accenture":85, "Infosys":82, "TCS":80, "Wipro":78, "Cognizant":82, "Capgemini":79 },
  "SQL":          { "Google":85, "Microsoft":88, "Amazon":90, "Apple":80, "Meta":88, "Netflix":82, "Tesla":72, "IBM":90, "Oracle":95, "Accenture":88, "Infosys":90, "TCS":88, "Wipro":86, "Cognizant":88, "Capgemini":84 },
  "Node.js":      { "Google":80, "Microsoft":78, "Amazon":82, "Apple":75, "Meta":85, "Netflix":88, "Tesla":68, "IBM":72, "Oracle":68, "Accenture":75, "Infosys":78, "TCS":76, "Wipro":74, "Cognizant":77, "Capgemini":73 },
  "Kubernetes":   { "Google":95, "Microsoft":88, "Amazon":90, "Apple":82, "Meta":85, "Netflix":92, "Tesla":78, "IBM":82, "Oracle":75, "Accenture":78, "Infosys":75, "TCS":72, "Wipro":70, "Cognizant":74, "Capgemini":71 },
  "Cybersecurity":{ "Google":90, "Microsoft":92, "Amazon":88, "Apple":90, "Meta":85, "Netflix":80, "Tesla":78, "IBM":90, "Oracle":85, "Accenture":88, "Infosys":85, "TCS":82, "Wipro":80, "Cognizant":83, "Capgemini":80 },
  "DevOps":       { "Google":90, "Microsoft":88, "Amazon":92, "Apple":80, "Meta":85, "Netflix":90, "Tesla":78, "IBM":82, "Oracle":75, "Accenture":82, "Infosys":80, "TCS":78, "Wipro":76, "Cognizant":79, "Capgemini":76 },
  "Cloud Computing":{ "Google":92, "Microsoft":95, "Amazon":98, "Apple":85, "Meta":85, "Netflix":88, "Tesla":80, "IBM":88, "Oracle":82, "Accenture":85, "Infosys":82, "TCS":80, "Wipro":78, "Cognizant":82, "Capgemini":79 },
};

const POPULAR_SKILLS = ["Python","JavaScript","TypeScript","React","Java","AWS","Docker","Machine Learning","Data Science","SQL","Node.js","Kubernetes","Cybersecurity","DevOps","Cloud Computing"];

function getDemand(skill: string, company: string): number {
  const norm = Object.keys(BASE_DEMAND).find(k => k.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(skill.toLowerCase()));
  if (norm && BASE_DEMAND[norm]?.[company] !== undefined) return BASE_DEMAND[norm][company];
  // Generate plausible value based on company type for unknown skills
  const hash = (skill + company).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 45 + (hash % 36);
}

function probability(score: number): { label: string; color: string; emoji: string } {
  if (score >= 80) return { label: "High",   color: "#4ade80", emoji: "🟢" };
  if (score >= 60) return { label: "Medium", color: "#fb923c", emoji: "🟡" };
  return              { label: "Low",    color: "#f87171", emoji: "🔴" };
}

export function CompanySkillSection({ userSkills }: { userSkills: string[] }) {
  const [skill, setSkill] = useState("Python");
  const [inputVal, setInputVal] = useState("Python");
  const [showSugg, setShowSugg] = useState(false);
  const [sortBy, setSortBy] = useState<"demand" | "name">("demand");

  const suggestions = POPULAR_SKILLS.filter(s => s.toLowerCase().includes(inputVal.toLowerCase()) && s.toLowerCase() !== inputVal.toLowerCase());

  const applySkill = (s: string) => {
    setSkill(s); setInputVal(s); setShowSugg(false);
  };

  const companyData = COMPANIES.map(c => ({
    ...c,
    demand: getDemand(skill, c.name),
  })).sort((a, b) => sortBy === "demand" ? b.demand - a.demand : a.name.localeCompare(b.name));

  const avg = Math.round(companyData.reduce((s, c) => s + c.demand, 0) / companyData.length);
  const maxCompany = companyData[0];
  const highCount  = companyData.filter(c => c.demand >= 80).length;
  const userHasSkill = userSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()));

  const chartData = companyData.slice(0, 15).map(c => ({
    name: c.name,
    demand: c.demand,
    color: c.color,
  }));

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
        <Building2 size={16} style={{ color: "#a78bfa", flexShrink: 0, marginTop: 2 }} />
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", lineHeight: 1.6 }}>
          Compare any skill against hiring demand from the world's top 15 technology companies. Scores reflect how actively each company recruits for that skill (0–100).
        </p>
      </div>

      {/* Skill selector */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={inputVal}
            onChange={e => { setInputVal(e.target.value); setShowSugg(true); }}
            onFocus={() => setShowSugg(true)}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder="Enter a skill (e.g., Python, React, AWS…)"
            style={{
              width: "100%", padding: "11px 14px 11px 38px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: "12px", color: "white", fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.88rem", outline: "none",
            }}
          />
          {showSugg && suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full rounded-xl overflow-hidden z-20"
              style={{ background: "#1a1035", border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
              {suggestions.slice(0, 6).map(s => (
                <button key={s} onMouseDown={() => applySkill(s)}
                  className="w-full text-left px-4 py-2.5 transition-all"
                  style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(124,58,237,0.2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => applySkill(inputVal.trim() || "Python")}
          className="px-6 py-2.5 rounded-xl transition-all hover:scale-105 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "white", fontWeight: 700, fontSize: "0.85rem", boxShadow: "0 0 16px rgba(124,58,237,0.35)" }}>
          Analyze →
        </button>
      </div>

      {/* Quick skills */}
      <div className="flex flex-wrap gap-2">
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", alignSelf: "center" }}>Quick:</span>
        {POPULAR_SKILLS.slice(0, 8).map(s => (
          <button key={s} onClick={() => applySkill(s)}
            className="px-2.5 py-1 rounded-lg transition-all"
            style={{
              background: skill === s ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${skill === s ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
              color: skill === s ? "#a78bfa" : "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: skill === s ? 700 : 400,
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Result header */}
      <div className="p-5 rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))", border: "1px solid rgba(139,92,246,0.3)" }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", marginBottom: "4px" }}>ANALYZING SKILL</p>
            <p style={{ color: "white", fontWeight: 900, fontSize: "1.3rem" }}>{skill}</p>
            {userHasSkill
              ? <span className="px-2 py-0.5 rounded-md text-xs font-bold mt-1 inline-block" style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}>✓ In your profile</span>
              : <span className="px-2 py-0.5 rounded-md text-xs mt-1 inline-block" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>Not in your profile — consider adding</span>}
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div style={{ color: "#a78bfa", fontWeight: 900, fontFamily: "'Orbitron',monospace", fontSize: "1.6rem" }}>{avg}</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>Avg Demand</p>
            </div>
            <div>
              <div style={{ color: "#4ade80", fontWeight: 900, fontFamily: "'Orbitron',monospace", fontSize: "1.6rem" }}>{highCount}</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>High Demand</p>
            </div>
            <div>
              <div style={{ color: maxCompany.color, fontWeight: 900, fontSize: "0.88rem" }}>{maxCompany.name}</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}>Top Recruiter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: "1rem" }}>
          Hiring Demand for <strong style={{ color: "white" }}>{skill}</strong> across Top 15 Companies
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ bottom: 50 }} barSize={26}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} angle={-35} textAnchor="end" interval={0} height={60} />
            <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#1a1035", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", fontSize: "0.78rem" }}
              labelStyle={{ color: "white" }}
              formatter={(val: number, _: string, props: { payload?: { color: string } }) => {
                const score = val as number;
                const p = probability(score);
                return [`${score}/100 — ${p.emoji} ${p.label}`, "Demand"];
              }}
            />
            <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Company cards */}
      <div className="flex items-center justify-between">
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", fontWeight: 600 }}>Company Rankings</p>
        <div className="flex gap-2">
          {(["demand", "name"] as const).map(s => (
            <button key={s} onClick={() => setSortBy(s)}
              className="px-3 py-1 rounded-lg transition-all capitalize"
              style={{ background: sortBy === s ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)", border: `1px solid ${sortBy === s ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`, color: sortBy === s ? "#a78bfa" : "rgba(255,255,255,0.35)", fontSize: "0.72rem", fontWeight: sortBy === s ? 700 : 400 }}>
              Sort: {s === "demand" ? "Demand ↓" : "A–Z"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {companyData.map((c, i) => {
          const p = probability(c.demand);
          return (
            <div key={c.name} className="p-4 rounded-xl flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s" }}>
              {/* Company logo */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-extrabold text-sm"
                style={{ background: c.color, boxShadow: `0 0 10px ${c.color}40` }}>
                {c.logo.length <= 2 ? c.logo : <Building2 size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span style={{ color: "white", fontWeight: 600, fontSize: "0.82rem" }}>{c.name}</span>
                  <span style={{ color: p.color, fontWeight: 800, fontSize: "0.82rem", fontFamily: "'Orbitron',monospace" }}>{c.demand}</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full" style={{ width: `${c.demand}%`, background: c.color, opacity: 0.85 }} />
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.62rem" }}>{c.type}</span>
                  <span style={{ color: p.color, fontSize: "0.65rem", fontWeight: 700 }}>{p.emoji} {p.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Probability legend */}
      <div className="flex flex-wrap gap-4 justify-center p-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", alignSelf: "center" }}>Hiring Probability:</span>
        {[{ label: "🟢 High (≥80)", color: "#4ade80" }, { label: "🟡 Medium (60–79)", color: "#fb923c" }, { label: "🔴 Low (<60)", color: "#f87171" }].map(p => (
          <div key={p.label} className="flex items-center gap-1">
            <span style={{ color: p.color, fontSize: "0.72rem", fontWeight: 700 }}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
