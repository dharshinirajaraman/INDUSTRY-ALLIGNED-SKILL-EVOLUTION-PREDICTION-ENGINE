import { useState, useEffect, useRef } from "react";
import { User, TrendingSkill } from "../utils/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles, TrendingUp, AlertTriangle, Brain, Target, RefreshCw } from "lucide-react";

/* ── SCORE FORMULA ────────────────────────────────────────*/
function computeCareerHealth(
  user: User,
  trendingSkills: TrendingSkill[],
  automationRisk: string
) {
  // 1. Alignment Score (0–100)
  const alignment = user.alignmentScore ?? 0;

  // 2. Skill Growth Index: avg growth of user's matched trending skills
  const matched = trendingSkills.filter(ts =>
    user.skills.some(s => s.toLowerCase() === ts.skill.toLowerCase())
  );
  const sgi = matched.length
    ? Math.min(100, Math.round(matched.reduce((a, b) => a + b.growth, 0) / matched.length * 2))
    : 20;

  // 3. Future Prediction: skill count × quality
  const futureTechs = ["AI/ML","Python","Cloud Computing","TypeScript","React","Kubernetes","Cybersecurity","Data Science","DevOps","Blockchain","Machine Learning"];
  const futureCount = user.skills.filter(s =>
    futureTechs.some(ft => ft.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(ft.toLowerCase()))
  ).length;
  const fp = Math.min(100, 30 + futureCount * 8 + Math.min(user.skills.length * 2, 20));

  // 4. Automation Risk score
  const riskScore = automationRisk === "Low" ? 10 : automationRisk === "Medium" ? 50 : 80;

  // Career Health Score (clamped 0–100)
  const raw = (alignment * 0.30) + (sgi * 0.25) + (fp * 0.25) - (riskScore * 0.20);
  return {
    score: Math.max(0, Math.min(100, Math.round(raw))),
    alignment,
    sgi,
    fp,
    riskScore,
  };
}

function scoreTier(s: number) {
  if (s >= 80) return "confident";
  if (s >= 60) return "neutral";
  if (s >= 40) return "worried";
  return "sad";
}

function tierColor(s: number) {
  if (s >= 80) return "#4ade80";
  if (s >= 60) return "#22d3ee";
  if (s >= 40) return "#fb923c";
  return "#f87171";
}

function tierLabel(s: number) {
  if (s >= 80) return "Career Champion";
  if (s >= 60) return "On Track";
  if (s >= 40) return "Needs Attention";
  return "Critical Zone";
}

/* ── 3D SVG AVATAR ───────────────────────────────────────*/
function Avatar3D({ gender, score }: { gender: "male" | "female"; score: number }) {
  const tier = scoreTier(score);
  const color = tierColor(score);
  const isFemale = gender === "female";

  // Expression params
  const smileY  = tier === "confident" ? 118 : tier === "neutral" ? 115 : tier === "worried" ? 111 : 108;
  const smileCtl = tier === "confident" ? 133 : tier === "neutral" ? 121 : tier === "worried" ? 106 : 100;
  const browL   = tier === "confident" ? 71 : tier === "neutral" ? 74 : tier === "worried" ? 80 : 82;
  const browR   = tier === "confident" ? 71 : tier === "neutral" ? 74 : tier === "worried" ? 76 : 78;
  const eyeH    = tier === "confident" ? 7 : tier === "neutral" ? 8 : tier === "worried" ? 8 : 6;
  const eyeOpenY = tier === "sad" ? 3 : 0;

  // Outfit
  const blazer     = score >= 80;
  const formalShirt= score >= 60 && score < 80;
  const shirtColor = blazer ? "#1e293b" : formalShirt ? "#1d4ed8" : "#f8fafc";
  const shirtStroke= blazer ? "#334155" : formalShirt ? "#2563eb" : "#e2e8f0";
  const skinD      = "#FDBCB4";
  const skinM      = "#F4A387";
  const skinDk     = "#D4896A";
  const hairColor  = isFemale ? "#7B3F00" : "#2D1B00";
  const hairHigh   = isFemale ? "#9B5F20" : "#4A2E00";

  return (
    <svg viewBox="0 0 200 310" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", filter: `drop-shadow(0 8px 24px ${color}40)` }}>
      <defs>
        {/* Skin radial gradient (3D sphere) */}
        <radialGradient id="headGrad" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFEBD9" />
          <stop offset="55%" stopColor={skinD} />
          <stop offset="100%" stopColor={skinDk} />
        </radialGradient>
        <radialGradient id="earGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={skinM} />
          <stop offset="100%" stopColor={skinDk} />
        </radialGradient>
        <linearGradient id="neckGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={skinDk} />
          <stop offset="40%" stopColor={skinD} />
          <stop offset="100%" stopColor={skinDk} />
        </linearGradient>
        {/* Body gradients */}
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={shirtColor} stopOpacity="1" />
          <stop offset="100%" stopColor={shirtColor} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="lapelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        {/* Glow */}
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        {/* Score ring */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hairHigh} />
          <stop offset="100%" stopColor={hairColor} />
        </linearGradient>
        <linearGradient id="femHairSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={hairColor} />
          <stop offset="50%" stopColor={hairHigh} />
          <stop offset="100%" stopColor={hairColor} />
        </linearGradient>
      </defs>

      {/* Background glow ring */}
      <ellipse cx="100" cy="285" rx="65" ry="12" fill="rgba(0,0,0,0.25)" />
      <circle cx="100" cy="130" r="95" fill="url(#glowGrad)" />

      {/* ── BODY / CLOTHES ─────────────────────────── */}
      {/* Shadow under torso */}
      <ellipse cx="100" cy="296" rx="52" ry="6" fill="rgba(0,0,0,0.15)" />

      {/* Arms */}
      <rect x="36" y="178" width="24" height="95" rx="12" fill={shirtColor} stroke={shirtStroke} strokeWidth="1" />
      <rect x="140" y="178" width="24" height="95" rx="12" fill={shirtColor} stroke={shirtStroke} strokeWidth="1" />
      {/* Hand skin */}
      <ellipse cx="48" cy="276" rx="11" ry="13" fill="url(#headGrad)" />
      <ellipse cx="152" cy="276" rx="11" ry="13" fill="url(#headGrad)" />

      {/* Main body */}
      <rect x="48" y="172" width="104" height="120" rx="14" fill="url(#bodyGrad)" stroke={shirtStroke} strokeWidth="1.5" />

      {/* Shirt button line */}
      {!blazer && (
        <>
          <line x1="100" y1="178" x2="100" y2="292" stroke={formalShirt ? "#93c5fd" : "#cbd5e1"} strokeWidth="1.5" strokeDasharray="3,4" />
          {[188,204,220,236].map(y => (
            <circle key={y} cx="100" cy={y} r="3" fill={formalShirt ? "#bfdbfe" : "#e2e8f0"} />
          ))}
        </>
      )}

      {/* Blazer lapels */}
      {blazer && (
        <>
          <path d="M100,178 L74,178 L60,210 L88,210 Z" fill="url(#lapelGrad)" />
          <path d="M100,178 L126,178 L140,210 L112,210 Z" fill="url(#lapelGrad)" />
          <path d="M85,210 L88,230 L100,225 L112,230 L115,210 Z" fill={shirtColor} />
          {/* White shirt underneath */}
          <path d="M88,185 L112,185 L110,210 L90,210 Z" fill="white" opacity="0.9" />
          <line x1="100" y1="185" x2="100" y2="210" stroke="#e2e8f0" strokeWidth="1" />
          {/* Pocket square */}
          <rect x="120" y="192" width="14" height="10" rx="2" fill="white" opacity="0.7" />
        </>
      )}

      {/* Collar */}
      <path d="M84,172 L100,185 L116,172 L112,162 L100,168 L88,162 Z" fill={shirtColor} stroke={shirtStroke} strokeWidth="1" />

      {/* ── NECK ──────────────────────────────────────── */}
      <rect x="88" y="148" width="24" height="30" rx="8" fill="url(#neckGrad)" />
      {/* Neck shadow */}
      <ellipse cx="100" cy="160" rx="11" ry="4" fill="rgba(0,0,0,0.08)" />

      {/* ── EARS ──────────────────────────────────────── */}
      <ellipse cx="49" cy="98" rx="10" ry="14" fill="url(#earGrad)" />
      <ellipse cx="151" cy="98" rx="10" ry="14" fill="url(#earGrad)" />
      {/* Inner ear */}
      <ellipse cx="51" cy="98" rx="5" ry="8" fill={skinDk} opacity="0.5" />
      <ellipse cx="149" cy="98" rx="5" ry="8" fill={skinDk} opacity="0.5" />

      {/* ── HEAD ──────────────────────────────────────── */}
      <ellipse cx="100" cy="92" rx="52" ry="58" fill="url(#headGrad)" />
      {/* Cheeks */}
      <ellipse cx="75" cy="108" rx="12" ry="8" fill="#FFB5A7" opacity="0.35" />
      <ellipse cx="125" cy="108" rx="12" ry="8" fill="#FFB5A7" opacity="0.35" />

      {/* ── HAIR ──────────────────────────────────────── */}
      {/* Female flowing hair sides (behind head, drawn first) */}
      {isFemale && (
        <>
          <path d="M52,75 Q36,110 38,180 Q40,215 50,230 L58,225 Q50,200 48,170 Q46,120 60,82 Z" fill="url(#femHairSide)" />
          <path d="M148,75 Q164,110 162,180 Q160,215 150,230 L142,225 Q150,200 152,170 Q154,120 140,82 Z" fill="url(#femHairSide)" />
        </>
      )}
      {/* Hair top */}
      <ellipse cx="100" cy="42" rx={isFemale ? 54 : 53} ry={isFemale ? 30 : 28} fill="url(#hairGrad)" />
      {/* Hair forehead edge */}
      <ellipse cx="100" cy="57" rx={isFemale ? 54 : 52} ry={isFemale ? 16 : 14} fill="url(#hairGrad)" />
      {/* Male side burns */}
      {!isFemale && (
        <>
          <rect x="49" y="72" width="12" height="25" rx="5" fill={hairColor} />
          <rect x="139" y="72" width="12" height="25" rx="5" fill={hairColor} />
        </>
      )}
      {/* Female extra front hair strands */}
      {isFemale && (
        <>
          <path d="M68,52 Q62,70 64,86 Q70,86 74,70 Z" fill={hairHigh} opacity="0.7" />
          <path d="M132,52 Q138,70 136,86 Q130,86 126,70 Z" fill={hairHigh} opacity="0.7" />
        </>
      )}
      {/* Hair shine */}
      <ellipse cx="85" cy="36" rx="18" ry="8" fill="white" opacity="0.12" />

      {/* ── EYEBROWS ──────────────────────────────────── */}
      <path
        d={`M70,${browL} Q82,${browL - 7} 94,${browL}`}
        stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round"
      />
      <path
        d={`M106,${browR} Q118,${browR - 7} 130,${browR}`}
        stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round"
      />

      {/* ── EYES ──────────────────────────────────────── */}
      {/* Eye whites */}
      <ellipse cx="82" cy={88 + eyeOpenY} rx="12" ry={eyeH} fill="white" />
      <ellipse cx="118" cy={88 + eyeOpenY} rx="12" ry={eyeH} fill="white" />
      {/* Iris */}
      <ellipse cx="82" cy={89 + eyeOpenY} rx="7" ry={Math.max(eyeH - 1, 4)} fill="#2D1B00" />
      <ellipse cx="118" cy={89 + eyeOpenY} rx="7" ry={Math.max(eyeH - 1, 4)} fill="#2D1B00" />
      {/* Iris color overlay */}
      <ellipse cx="82" cy={89 + eyeOpenY} rx="5" ry={Math.max(eyeH - 2, 3)} fill="#4A3728" opacity="0.8" />
      <ellipse cx="118" cy={89 + eyeOpenY} rx="5" ry={Math.max(eyeH - 2, 3)} fill="#4A3728" opacity="0.8" />
      {/* Pupil */}
      <ellipse cx="83" cy={89 + eyeOpenY} rx="3" ry={Math.max(eyeH - 4, 2)} fill="#0a0a0a" />
      <ellipse cx="119" cy={89 + eyeOpenY} rx="3" ry={Math.max(eyeH - 4, 2)} fill="#0a0a0a" />
      {/* Shine */}
      <circle cx="85" cy={86 + eyeOpenY} r="2.5" fill="white" opacity="0.9" />
      <circle cx="121" cy={86 + eyeOpenY} r="2.5" fill="white" opacity="0.9" />
      {/* Upper lid */}
      <path d={`M70,${85 + eyeOpenY} Q82,${80 + eyeOpenY} 94,${85 + eyeOpenY}`} stroke={hairColor} strokeWidth="1.5" fill="none" />
      <path d={`M106,${85 + eyeOpenY} Q118,${80 + eyeOpenY} 130,${85 + eyeOpenY}`} stroke={hairColor} strokeWidth="1.5" fill="none" />

      {/* ── NOSE ──────────────────────────────────────── */}
      <path d="M97,97 Q100,108 103,97" stroke={skinDk} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="93" cy="106" rx="5" ry="3" fill={skinDk} opacity="0.25" />
      <ellipse cx="107" cy="106" rx="5" ry="3" fill={skinDk} opacity="0.25" />

      {/* ── MOUTH ─────────────────────────────────────── */}
      {/* Upper lip */}
      <path
        d={`M82,${smileY - 3} Q91,${smileY - 6} 100,${smileY - 4} Q109,${smileY - 6} 118,${smileY - 3}`}
        stroke="#B5506B" strokeWidth="1.5" fill="#D4607A" opacity="0.7"
      />
      {/* Main mouth curve */}
      <path
        d={`M82,${smileY} Q100,${smileCtl} 118,${smileY}`}
        stroke="#C0706A" strokeWidth="2.5" fill="none" strokeLinecap="round"
      />
      {/* Teeth for confident smile */}
      {tier === "confident" && (
        <path d="M85,120 Q100,127 115,120 L113,126 Q100,131 87,126 Z" fill="white" opacity="0.9" />
      )}
      {/* Teeth for neutral */}
      {tier === "neutral" && (
        <path d="M88,118 Q100,122 112,118 L111,122 Q100,126 89,122 Z" fill="white" opacity="0.7" />
      )}

      {/* ── EXPRESSION DETAILS ────────────────────────── */}
      {/* Confident: sparkles */}
      {tier === "confident" && (
        <>
          <text x="145" y="55" fontSize="16" opacity="0.9">✨</text>
          <text x="30" y="70" fontSize="12" opacity="0.7">⭐</text>
        </>
      )}
      {/* Sad: single tear */}
      {tier === "sad" && (
        <path d="M82,97 Q81,105 83,110" stroke="#93c5fd" strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {/* Worried: sweat drop */}
      {tier === "worried" && (
        <ellipse cx="130" cy="70" rx="4" ry="5" fill="#93c5fd" opacity="0.5" />
      )}

      {/* ── SCORE BADGE (on chest) ─────────────────────── */}
      <rect x="75" y="240" width="50" height="24" rx="8" fill={color} opacity="0.9" />
      <text x="100" y="257" textAnchor="middle" fill="white" style={{ fontSize: "11px", fontWeight: 800, fontFamily: "'Orbitron',monospace" }}>
        {score < 10 ? `0${score}` : score}
      </text>
    </svg>
  );
}

/* ── ANIMATED SCORE RING ──────────────────────────────────*/
function ScoreRing({ score, color, size = 180 }: { score: number; color: string; size?: number }) {
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
        style={{ filter: `drop-shadow(0 0 10px ${color}90)`, transition: "stroke-dasharray 1.2s ease" }} />
      <text x={c} y={c - 8} textAnchor="middle" fill="white" style={{ fontSize: `${size * 0.2}px`, fontWeight: 900, fontFamily: "'Orbitron',monospace" }}>{score}</text>
      <text x={c} y={c + 14} textAnchor="middle" fill="rgba(255,255,255,0.5)" style={{ fontSize: `${size * 0.072}px` }}>Career Health</text>
    </svg>
  );
}

/* ── MAIN COMPONENT ───────────────────────────────────────*/
export function CareerTwinSection({
  user,
  trendingSkills,
  automationRisk,
}: {
  user: User;
  trendingSkills: TrendingSkill[];
  automationRisk: string;
}) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [animating, setAnimating] = useState(false);
  const [displayed, setDisplayed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { score, alignment, sgi, fp, riskScore } = computeCareerHealth(user, trendingSkills, automationRisk);
  const color = tierColor(score);
  const tier = scoreTier(score);
  const label = tierLabel(score);

  // Count-up animation
  useEffect(() => {
    setDisplayed(0);
    let current = 0;
    const step = Math.ceil(score / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplayed(current);
      if (current >= score) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  const handleGenderSwitch = (g: "male" | "female") => {
    setAnimating(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setGender(g); setAnimating(false); }, 300);
  };

  // Radar chart data
  const chartData = [
    { name: "Alignment",    score: alignment, fill: "#a78bfa" },
    { name: "Skill Growth", score: sgi,       fill: "#22d3ee" },
    { name: "Future Pred.", score: fp,         fill: "#4ade80" },
    { name: "Risk Factor",  score: 100 - riskScore, fill: "#fb923c" },
  ];

  const tierMessages: Record<string, { headline: string; tip: string; emoji: string }> = {
    confident: { headline: "You're Career Ready! 🚀", tip: "Keep adding emerging skills and building projects to maintain your edge.", emoji: "🌟" },
    neutral:   { headline: "Good Progress, Keep Going!", tip: "Focus on trending skills in your domain to boost your alignment score.", emoji: "💪" },
    worried:   { headline: "Action Needed", tip: "Explore your domain roadmap and add at least 3 in-demand skills this week.", emoji: "⚡" },
    sad:       { headline: "Time to Level Up!", tip: "Start with your domain roadmap. Small consistent steps lead to big results.", emoji: "🎯" },
  };
  const msg = tierMessages[tier];

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="p-5 rounded-2xl relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${color}18, rgba(255,255,255,0.03))`, border: `1px solid ${color}35` }}>
        <div className="absolute top-0 right-0 opacity-5 text-[120px] pointer-events-none select-none" style={{ lineHeight: 1 }}>
          {msg.emoji}
        </div>
        <p style={{ color, fontWeight: 800, fontSize: "1.15rem" }}>{msg.emoji} {msg.headline}</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginTop: "4px" }}>{msg.tip}</p>
      </div>

      {/* Main grid: Avatar + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── AVATAR PANEL ── */}
        <div className="flex flex-col items-center gap-4 p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Gender toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
            {(["male", "female"] as const).map(g => (
              <button key={g} onClick={() => handleGenderSwitch(g)}
                className="px-5 py-2 transition-all"
                style={{
                  background: gender === g ? `linear-gradient(135deg, ${color}50, ${color}30)` : "transparent",
                  color: gender === g ? "white" : "rgba(255,255,255,0.4)",
                  fontWeight: gender === g ? 700 : 400,
                  fontSize: "0.82rem",
                }}>
                {g === "male" ? "👨 Male" : "👩 Female"}
              </button>
            ))}
          </div>

          {/* Avatar + ring */}
          <div className="relative flex items-center justify-center" style={{ width: "220px", height: "220px" }}>
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`, animation: "pulse 3s ease-in-out infinite" }} />
            {/* Score ring */}
            <ScoreRing score={displayed} color={color} size={220} />
            {/* Avatar inside ring */}
            <div className="absolute" style={{ width: "130px", height: "175px", bottom: "12px", opacity: animating ? 0 : 1, transition: "opacity 0.3s ease" }}>
              <Avatar3D gender={gender} score={score} />
            </div>
          </div>

          {/* Tier label */}
          <div className="px-4 py-2 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
            <p style={{ color, fontWeight: 800, fontSize: "0.88rem", textAlign: "center" }}>
              {label} · Score {score}/100
            </p>
          </div>

          {/* Avatar outfit description */}
          <div className="text-center">
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>
              {score >= 80 ? "🤵 Confident expression · Blazer outfit" :
               score >= 60 ? "👔 Neutral expression · Formal shirt" :
               score >= 40 ? "😟 Slightly worried · Plain shirt" :
                             "😢 Sad expression · Plain shirt"}
            </p>
          </div>
        </div>

        {/* ── SCORE BREAKDOWN ── */}
        <div className="space-y-4">
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em" }}>CAREER HEALTH BREAKDOWN</p>

          {/* Formula */}
          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", marginBottom: "6px" }}>FORMULA</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", lineHeight: 1.7, fontFamily: "monospace" }}>
              = (Alignment × 0.30)<br/>
              + (Skill Growth × 0.25)<br/>
              + (Future Prediction × 0.25)<br/>
              − (Risk Factor × 0.20)
            </p>
          </div>

          {/* Score components */}
          {[
            { label: "Alignment Score",     icon: Target,      val: alignment,      weight: "×0.30", contrib: Math.round(alignment * 0.30), color: "#a78bfa" },
            { label: "Skill Growth Index",  icon: TrendingUp,  val: sgi,            weight: "×0.25", contrib: Math.round(sgi * 0.25),      color: "#22d3ee" },
            { label: "Future Prediction",   icon: Brain,       val: fp,             weight: "×0.25", contrib: Math.round(fp * 0.25),       color: "#4ade80" },
            { label: "Automation Risk",     icon: AlertTriangle, val: riskScore,    weight: "×0.20", contrib: -Math.round(riskScore * 0.20), color: "#f87171" },
          ].map(({ label, icon: Icon, val, weight, contrib, color: c }) => (
            <div key={label} className="p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={14} style={{ color: c }} />
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.78rem" }}>{label}</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem" }}>{weight}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: c, fontWeight: 800, fontSize: "0.85rem", fontFamily: "'Orbitron',monospace" }}>{val}</span>
                  <span style={{ color: contrib >= 0 ? "#4ade80" : "#f87171", fontSize: "0.72rem", fontWeight: 600 }}>
                    {contrib >= 0 ? "+" : ""}{contrib}
                  </span>
                </div>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, background: c }} />
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between p-3.5 rounded-xl"
            style={{ background: `${color}15`, border: `2px solid ${color}40` }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "0.88rem" }}>Career Health Score</span>
            <span style={{ color, fontWeight: 900, fontSize: "1.3rem", fontFamily: "'Orbitron',monospace", filter: `drop-shadow(0 0 6px ${color})` }}>{score}</span>
          </div>
        </div>
      </div>

      {/* ── BAR CHART ── */}
      <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "1rem" }}>📊 Score Component Analysis</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#1a1035", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", fontSize: "0.78rem" }}
              labelStyle={{ color: "white" }}
              formatter={(v: number, name: string) => [`${v}/100`, name]}
            />
            {chartData.map((d, i) => (
              <Bar key={d.name} dataKey="score" data={[d]} fill={d.fill} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── IMPROVEMENT TIPS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "🎯", title: "Boost Alignment", tip: "Add trending skills: Python, AI/ML, Cloud Computing", action: "Go to Skills" },
          { icon: "📈", title: "Grow Faster",     tip: "Complete courses in your domain pathway", action: "View Courses" },
          { icon: "🛡️", title: "Reduce Risk",     tip: "Learn automation-proof skills: Leadership, Design, AI", action: "View Roadmap" },
        ].map(c => (
          <div key={c.title} className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", marginBottom: "4px" }}>{c.title}</p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", lineHeight: 1.5 }}>{c.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
