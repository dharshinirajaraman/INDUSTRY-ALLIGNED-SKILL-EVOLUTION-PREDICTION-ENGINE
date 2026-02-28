import { useState } from "react";
import { TrendingSkill } from "../utils/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown, Minus, Zap, Target, Info } from "lucide-react";

/* ── STATIC MARKET DATASET ────────────────────────────────*/
const MARKET_DATA = [
  { skill: "Generative AI / LLMs", demand: 97, growth: 88, trend: "Rising",   category: "AI/ML",       insight: "ChatGPT, Claude, Llama driving explosive demand in 2025–26" },
  { skill: "Python",               demand: 95, growth: 72, trend: "Rising",   category: "Language",    insight: "Dominant in AI, Data Science, automation, and backend APIs" },
  { skill: "Cloud Computing",      demand: 91, growth: 62, trend: "Rising",   category: "Cloud",       insight: "AWS, Azure, GCP — multi-cloud architects are in huge demand" },
  { skill: "Cybersecurity",        demand: 88, growth: 58, trend: "Rising",   category: "Security",    insight: "Rising threats making security engineers critical at every org" },
  { skill: "React / Next.js",      demand: 86, growth: 50, trend: "Rising",   category: "Frontend",    insight: "React dominates enterprise frontend; Next.js rising for SSR" },
  { skill: "Data Science",         demand: 85, growth: 52, trend: "Rising",   category: "Data",        insight: "AI boom making data skills foundational across all industries" },
  { skill: "Kubernetes / Docker",  demand: 83, growth: 46, trend: "Rising",   category: "DevOps",      insight: "Container orchestration is the norm for modern deployments" },
  { skill: "TypeScript",           demand: 80, growth: 44, trend: "Rising",   category: "Language",    insight: "Replacing JavaScript for large-scale, type-safe applications" },
  { skill: "Node.js / APIs",       demand: 76, growth: 32, trend: "Stable",   category: "Backend",     insight: "Mature but still widely adopted for backend service development" },
  { skill: "SQL / Databases",      demand: 74, growth: 20, trend: "Stable",   category: "Database",    insight: "Always relevant — PostgreSQL and analytics SQL still growing" },
];

const TREND_COLORS: Record<string, string> = { Rising: "#4ade80", Stable: "#22d3ee", Declining: "#f87171" };
const CAT_COLORS: Record<string, string> = {
  "AI/ML": "#a78bfa", "Language": "#22d3ee", "Cloud": "#38bdf8", "Security": "#f87171",
  "Frontend": "#fb923c", "Data": "#4ade80", "DevOps": "#facc15", "Backend": "#6366f1", "Database": "#e879f9",
};

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Rising")   return <TrendingUp  size={14} style={{ color: "#4ade80" }} />;
  if (trend === "Declining") return <TrendingDown size={14} style={{ color: "#f87171" }} />;
  return <Minus size={14} style={{ color: "#22d3ee" }} />;
}

interface SkillTrendsSectionProps {
  userSkills: string[];
  trendingSkills: TrendingSkill[];
}

export function SkillTrendsSection({ userSkills, trendingSkills }: SkillTrendsSectionProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Check if user has each skill
  const withMatch = MARKET_DATA.map(d => ({
    ...d,
    hasSkill: userSkills.some(s =>
      d.skill.toLowerCase().includes(s.toLowerCase()) ||
      s.toLowerCase().includes(d.skill.split(" ")[0].toLowerCase())
    ),
  }));

  const chartData = withMatch.map(d => ({
    name: d.skill.length > 18 ? d.skill.slice(0, 17) + "…" : d.skill,
    demand: d.demand,
    growth: d.growth,
    hasSkill: d.hasSkill,
  }));

  const userHasCount = withMatch.filter(d => d.hasSkill).length;
  const avgDemand = Math.round(MARKET_DATA.reduce((s, d) => s + d.demand, 0) / MARKET_DATA.length);

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tracked Skills",    val: MARKET_DATA.length,  color: "#a78bfa" },
          { label: "You Have",          val: `${userHasCount}/10`, color: "#4ade80" },
          { label: "Avg Demand Score",  val: avgDemand,            color: "#22d3ee" },
          { label: "All Rising",        val: `${MARKET_DATA.filter(d=>d.trend==="Rising").length} skills`, color: "#fb923c" },
        ].map(s => (
          <div key={s.label} className="p-3.5 rounded-xl text-center"
            style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.val}</div>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        {(["chart", "table"] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-xl transition-all capitalize"
            style={{
              background: view === v ? "linear-gradient(135deg,rgba(124,58,237,0.4),rgba(6,182,212,0.25))" : "rgba(255,255,255,0.04)",
              border: `1px solid ${view === v ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: view === v ? "white" : "rgba(255,255,255,0.4)", fontSize: "0.8rem", fontWeight: view === v ? 700 : 400,
            }}>
            {v === "chart" ? "📊 Bar Chart" : "📋 Ranking List"}
          </button>
        ))}
      </div>

      {/* Chart view */}
      {view === "chart" && (
        <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: "1rem" }}>
            Demand Score (0–100) · Green bars = skills you have
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ bottom: 60 }} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} angle={-40} textAnchor="end" interval={0} height={70} />
              <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: "#1a1035", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", fontSize: "0.78rem" }}
                labelStyle={{ color: "white" }}
                formatter={(val: number) => [`${val}/100`, "Demand Score"]}
              />
              <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.hasSkill ? "#4ade80" : "#7c3aed"} opacity={entry.hasSkill ? 1 : 0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-400" /><span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>You have this skill</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-purple-500" /><span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem" }}>Skill to acquire</span></div>
          </div>
        </div>
      )}

      {/* Table / Ranking view */}
      {view === "table" && (
        <div className="space-y-2">
          {withMatch.map((d, i) => (
            <div key={d.skill}
              className="p-4 rounded-xl cursor-pointer transition-all"
              onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
              style={{
                background: selectedIdx === i ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${d.hasSkill ? "rgba(74,222,128,0.25)" : selectedIdx === i ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.07)"}`,
              }}>
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: i < 3 ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)", border: i < 3 ? "1px solid rgba(245,158,11,0.3)" : "none" }}>
                  <span style={{ color: i < 3 ? "#f59e0b" : "rgba(255,255,255,0.4)", fontWeight: 800, fontSize: "0.82rem", fontFamily: "'Orbitron',monospace" }}>
                    {i + 1}
                  </span>
                </div>

                {/* Skill info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span style={{ color: "white", fontWeight: 600, fontSize: "0.88rem" }}>{d.skill}</span>
                    <span className="px-2 py-0.5 rounded-md"
                      style={{ background: `${CAT_COLORS[d.category] ?? "#a78bfa"}20`, color: CAT_COLORS[d.category] ?? "#a78bfa", fontSize: "0.62rem", fontWeight: 700 }}>
                      {d.category}
                    </span>
                    {d.hasSkill && (
                      <span className="px-2 py-0.5 rounded-md" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "0.62rem", fontWeight: 700 }}>✓ You have this</span>
                    )}
                  </div>

                  {/* Demand bar */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${d.demand}%`, background: d.hasSkill ? "#4ade80" : "#7c3aed" }} />
                    </div>
                    <span style={{ color: d.hasSkill ? "#4ade80" : "#a78bfa", fontWeight: 800, fontSize: "0.8rem", fontFamily: "'Orbitron',monospace", minWidth: "32px" }}>
                      {d.demand}
                    </span>
                  </div>
                </div>

                {/* Growth + Trend */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={d.trend} />
                    <span style={{ color: TREND_COLORS[d.trend], fontSize: "0.72rem", fontWeight: 700 }}>{d.trend}</span>
                  </div>
                  <span style={{ color: "#4ade80", fontSize: "0.7rem", fontWeight: 700 }}>+{d.growth}% YoY</span>
                </div>
              </div>

              {/* Expanded insight */}
              {selectedIdx === i && (
                <div className="mt-3 pt-3 flex items-start gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <Info size={13} style={{ color: "#22d3ee", flexShrink: 0, marginTop: "2px" }} />
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", lineHeight: 1.5 }}>{d.insight}</p>
                  {!d.hasSkill && (
                    <div className="ml-auto flex-shrink-0 px-2.5 py-1 rounded-lg"
                      style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                      + Add to Skills
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Career influence note */}
      <div className="p-4 rounded-xl flex items-start gap-3"
        style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
        <Zap size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", lineHeight: 1.6 }}>
          <strong style={{ color: "#fb923c" }}>Dynamic influence:</strong> These market trends directly affect your Career Health Score.
          Skills with high demand and Rising trends boost your Alignment and Future Prediction scores when added to your profile.
        </p>
      </div>
    </div>
  );
}
