import { useState, useRef, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart,
  PolarGrid, PolarAngleAxis, Radar,
} from "recharts";
import {
  Upload, FileText, CheckCircle, AlertTriangle, Zap, Target, Star, TrendingUp,
  BookOpen, Award, RotateCcw, ChevronRight, Sparkles, Brain, Code, Briefcase,
  GraduationCap, Layers, X,
} from "lucide-react";

// ─────────────────────────────────────────────
// SKILL DATABASE
// ─────────────────────────────────────────────
const ALL_SKILLS: string[] = [
  "python","javascript","typescript","java","c++","c#","go","rust","ruby","php","swift",
  "kotlin","r","scala","matlab","perl","dart","lua","haskell","elixir",
  "react","vue","angular","next.js","nuxt","html","css","sass","tailwind","bootstrap",
  "redux","graphql","jquery","svelte","astro","vite","webpack","babel",
  "node.js","nodejs","express","django","flask","fastapi","spring","spring boot",
  "laravel","rails","asp.net","nest.js","nestjs","gin","fiber","actix",
  "machine learning","deep learning","tensorflow","pytorch","keras","pandas","numpy",
  "scikit-learn","sklearn","data analysis","data science","nlp","computer vision",
  "llm","openai","hugging face","langchain","rag","transformers","mlops","statistics",
  "aws","azure","gcp","docker","kubernetes","ci/cd","jenkins","github actions",
  "terraform","ansible","linux","devops","nginx","serverless","helm","istio",
  "postgresql","mysql","mongodb","redis","sqlite","oracle","elasticsearch",
  "firebase","dynamodb","cassandra","neo4j","supabase","prisma","sql",
  "git","github","gitlab","jira","agile","scrum","figma","postman","rest api",
  "microservices","system design","algorithms","data structures","oop","solid",
  "react native","flutter","android","ios","xamarin","expo","swift ui",
  "cybersecurity","penetration testing","blockchain","solidity","web3","cloud",
  "tableau","power bi","looker","excel","spark","hadoop","kafka","airflow",
  "leadership","communication","problem solving","teamwork","project management",
];

const SKILL_DEMAND: Record<string, number> = {
  "python": 96, "javascript": 93, "typescript": 90, "react": 92, "node.js": 86,
  "nodejs": 86, "aws": 89, "docker": 87, "kubernetes": 82, "machine learning": 94,
  "deep learning": 90, "data science": 91, "sql": 88, "postgresql": 83,
  "mongodb": 79, "redis": 77, "git": 95, "github": 90, "agile": 86, "linux": 81,
  "tensorflow": 85, "pytorch": 89, "llm": 95, "openai": 88, "langchain": 86,
  "next.js": 87, "vue": 76, "angular": 73, "tailwind": 82, "graphql": 78,
  "django": 79, "flask": 73, "fastapi": 83, "spring boot": 79, "java": 83,
  "c++": 76, "go": 80, "rust": 72, "typescript": 90, "rest api": 88,
  "microservices": 84, "ci/cd": 83, "terraform": 79, "azure": 83, "gcp": 79,
  "system design": 88, "algorithms": 84, "data structures": 84, "oop": 80,
  "react native": 78, "flutter": 75, "spark": 77, "kafka": 76, "airflow": 74,
  "figma": 79, "tableau": 74, "power bi": 73, "cybersecurity": 86, "blockchain": 65,
  "nestjs": 76, "nest.js": 76, "devops": 88, "mlops": 84, "hugging face": 85,
  "rag": 88, "transformers": 84, "firebase": 72, "supabase": 70, "leadership": 85,
  "communication": 83, "problem solving": 88, "teamwork": 80, "project management": 82,
  "elasticsearch": 75, "fastapi": 83, "serverless": 78, "cloud": 85, "excel": 70,
  "data analysis": 87, "nlp": 85, "computer vision": 83, "statistics": 82,
  "pandas": 84, "numpy": 81, "scikit-learn": 82, "sklearn": 82, "keras": 79,
  "c#": 76, "swift": 72, "kotlin": 74, "android": 70, "ios": 68,
};

// ─────────────────────────────────────────────
// ROLE TEMPLATES
// ─────────────────────────────────────────────
interface RoleTemplate {
  title: string;
  skills: string[];
  salary: string;
  demand: string;
  demandColor: string;
  icon: string;
}

const ROLES: RoleTemplate[] = [
  { title: "AI / ML Engineer", skills: ["python","machine learning","deep learning","tensorflow","pytorch","numpy","pandas","scikit-learn","mlops","docker","llm","openai","hugging face","rag"], salary: "$120K–$180K", demand: "Extremely High", demandColor: "#4ade80", icon: "🤖" },
  { title: "Full Stack Developer", skills: ["javascript","typescript","react","node.js","nodejs","sql","postgresql","mongodb","git","docker","rest api","tailwind","next.js"], salary: "$95K–$155K", demand: "Very High", demandColor: "#4ade80", icon: "⚡" },
  { title: "Data Scientist", skills: ["python","data science","machine learning","pandas","numpy","sql","statistics","tableau","data analysis","scikit-learn","tensorflow","power bi"], salary: "$100K–$160K", demand: "Very High", demandColor: "#4ade80", icon: "📊" },
  { title: "Frontend Developer", skills: ["javascript","typescript","react","vue","angular","next.js","html","css","tailwind","redux","graphql","figma","webpack"], salary: "$85K–$135K", demand: "High", demandColor: "#22d3ee", icon: "🎨" },
  { title: "Backend Developer", skills: ["python","java","node.js","nodejs","django","flask","fastapi","spring boot","sql","postgresql","mongodb","redis","rest api","microservices"], salary: "$90K–$145K", demand: "Very High", demandColor: "#4ade80", icon: "🔧" },
  { title: "DevOps / Cloud Engineer", skills: ["docker","kubernetes","aws","azure","gcp","ci/cd","terraform","ansible","linux","jenkins","github actions","devops","nginx","serverless"], salary: "$100K–$160K", demand: "High", demandColor: "#22d3ee", icon: "☁️" },
  { title: "Mobile Developer", skills: ["react native","flutter","android","ios","javascript","typescript","swift","kotlin","dart","firebase","expo"], salary: "$90K–$145K", demand: "High", demandColor: "#22d3ee", icon: "📱" },
  { title: "Cybersecurity Engineer", skills: ["cybersecurity","penetration testing","linux","python","networking","cloud","aws","azure","git","algorithms"], salary: "$105K–$165K", demand: "High", demandColor: "#22d3ee", icon: "🛡️" },
  { title: "Data Engineer", skills: ["python","sql","spark","kafka","airflow","aws","gcp","postgresql","mongodb","docker","data analysis","pandas","hadoop","etl"], salary: "$100K–$160K", demand: "High", demandColor: "#22d3ee", icon: "🗄️" },
  { title: "LLM / GenAI Engineer", skills: ["python","llm","openai","langchain","hugging face","rag","transformers","machine learning","pytorch","fastapi","docker","mlops"], salary: "$130K–$200K", demand: "Extremely High", demandColor: "#4ade80", icon: "🧠" },
];

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  hasEducation: boolean;
  hasExperience: boolean;
  hasProjects: boolean;
  hasSummary: boolean;
  detectedSkills: string[];
  experienceLines: string[];
  projectLines: string[];
  educationLines: string[];
  rawText: string;
}

interface AnalysisResult {
  parsed: ParsedResume;
  scores: { overall: number; skills: number; experience: number; projects: number; ats: number };
  topRoles: { title: string; match: number; salary: string; demand: string; demandColor: string; icon: string; missingSkills: string[] }[];
  missingHighDemand: { skill: string; demand: number }[];
  strengths: string[];
  improvements: string[];
  badges: { label: string; color: string; icon: string }[];
  skillChartData: { skill: string; yours: number; industry: number }[];
  radarData: { subject: string; score: number; fullMark: number }[];
  roadmap: { step: number; title: string; color: string; items: string[] }[];
  keywords: { word: string; found: boolean }[];
}

// ─────────────────────────────────────────────
// PARSER
// ─────────────────────────────────────────────
function parseResume(text: string): ParsedResume {
  const lower = text.toLowerCase();
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Name: first line that looks like a real name (2+ capitalized words, no special chars)
  let name = "Candidate";
  for (const line of lines.slice(0, 6)) {
    if (/^[A-Z][a-z]+ ([A-Z][a-z]+ ?)+$/.test(line) && line.split(" ").length <= 4) {
      name = line;
      break;
    }
  }

  const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+\(]?[\d][\d\s\-().]{7,}/);

  const hasEducation = /\b(education|university|college|bachelor|master|b\.?s\.?|m\.?s\.?|b\.?e\.?|phd|degree|gpa|cgpa|school|engineering|computer science)\b/i.test(lower);
  const hasExperience = /\b(experience|work|employment|internship|company|organization|worked|position|role|job)\b/i.test(lower);
  const hasProjects = /\b(project|built|developed|created|implemented|portfolio|github\.com|app|system|platform|website)\b/i.test(lower);
  const hasSummary = /\b(summary|objective|about|profile|overview)\b/i.test(lower);

  // Detect skills
  const detectedSkills = ALL_SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
  });

  // Extract section content
  const extractSection = (keywords: string[]): string[] => {
    const pattern = new RegExp(`(${keywords.join("|")})`, "i");
    let inSection = false;
    const result: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i]) && lines[i].length < 60) { inSection = true; continue; }
      if (inSection) {
        if (/^[A-Z\s]{3,}$/.test(lines[i]) && lines[i].length < 40 && i > 0) break;
        result.push(lines[i]);
        if (result.length > 12) break;
      }
    }
    return result;
  };

  return {
    name,
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0]?.trim() ?? "",
    hasEducation, hasExperience, hasProjects, hasSummary,
    detectedSkills,
    experienceLines: extractSection(["experience", "employment", "work history"]),
    projectLines: extractSection(["project", "portfolio", "github"]),
    educationLines: extractSection(["education", "academic", "qualification"]),
    rawText: text,
  };
}

// ─────────────────────────────────────────────
// ANALYZER
// ─────────────────────────────────────────────
function analyzeResume(parsed: ParsedResume): AnalysisResult {
  const { detectedSkills, rawText, hasEducation, hasExperience, hasProjects, hasSummary } = parsed;
  const lower = rawText.toLowerCase();

  // ── Skills Score ──
  const demandWeights = detectedSkills.map((s) => SKILL_DEMAND[s] ?? 60);
  const avgDemand = demandWeights.length ? demandWeights.reduce((a, b) => a + b, 0) / demandWeights.length : 0;
  const skillDiversity = Math.min(detectedSkills.length / 15, 1);
  const skillsScore = Math.round(avgDemand * 0.6 + skillDiversity * 100 * 0.4);

  // ── Experience Score ──
  const hasQuantified = /\d+%|\d+\+|\$\d+|increased|improved|reduced|led|managed|designed|architected/i.test(rawText);
  const numRoles = (rawText.match(/\b(20\d{2}|intern|engineer|developer|analyst|scientist|manager|lead)\b/gi) ?? []).length;
  const expBase = hasExperience ? 55 : 20;
  const experienceScore = Math.min(100, expBase + (hasQuantified ? 20 : 0) + Math.min(numRoles * 3, 20) + (hasSummary ? 5 : 0));

  // ── Projects Score ──
  const numProjects = (rawText.match(/\b(project\s*\d+|built|developed|created|implemented|designed)\b/gi) ?? []).length;
  const hasTechStack = detectedSkills.length > 3;
  const projBase = hasProjects ? 50 : 15;
  const projectsScore = Math.min(100, projBase + Math.min(numProjects * 4, 25) + (hasTechStack ? 20 : 0) + (hasEducation ? 5 : 0));

  // ── ATS Score ──
  const ATS_KEYWORDS = ["experience","skills","education","projects","summary","objective","responsibilities","achievements","accomplishments","led","managed","developed","implemented","designed","optimized","team","collaboration","agile","scrum"];
  const atsFound = ATS_KEYWORDS.filter((k) => lower.includes(k)).length;
  const atsScore = Math.round((atsFound / ATS_KEYWORDS.length) * 55 + skillsScore * 0.25 + (hasQuantified ? 15 : 5) + (hasSummary ? 5 : 0));

  const overall = Math.round(skillsScore * 0.35 + experienceScore * 0.25 + projectsScore * 0.2 + Math.min(atsScore, 100) * 0.2);

  // ── Role Matching ──
  const topRoles = ROLES.map((role) => {
    const matched = role.skills.filter((s) => detectedSkills.some((d) => d === s || d.includes(s) || s.includes(d)));
    const match = Math.round((matched.length / role.skills.length) * 100);
    const missing = role.skills.filter((s) => !detectedSkills.some((d) => d === s || d.includes(s) || s.includes(d))).slice(0, 4);
    return { ...role, match, missingSkills: missing };
  }).sort((a, b) => b.match - a.match).slice(0, 5);

  // ── Missing High-Demand Skills ──
  const missingHighDemand = Object.entries(SKILL_DEMAND)
    .filter(([skill, demand]) => demand >= 80 && !detectedSkills.some((d) => d === skill || d.includes(skill)))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([skill, demand]) => ({ skill, demand }));

  // ── Skill Chart Data (top detected vs demand) ──
  const skillChartData = detectedSkills
    .filter((s) => SKILL_DEMAND[s] !== undefined)
    .sort((a, b) => (SKILL_DEMAND[b] ?? 0) - (SKILL_DEMAND[a] ?? 0))
    .slice(0, 8)
    .map((skill) => ({
      skill: skill.length > 10 ? skill.slice(0, 9) + "…" : skill,
      yours: Math.min(100, (SKILL_DEMAND[skill] ?? 60) - 5 + Math.floor(Math.random() * 10)),
      industry: SKILL_DEMAND[skill] ?? 70,
    }));

  // ── Radar Chart ──
  const radarData = [
    { subject: "Skills", score: skillsScore, fullMark: 100 },
    { subject: "Experience", score: experienceScore, fullMark: 100 },
    { subject: "Projects", score: projectsScore, fullMark: 100 },
    { subject: "ATS", score: Math.min(atsScore, 100), fullMark: 100 },
    { subject: "Keywords", score: Math.round((atsFound / ATS_KEYWORDS.length) * 100), fullMark: 100 },
    { subject: "Diversity", score: Math.round(skillDiversity * 100), fullMark: 100 },
  ];

  // ── Strengths ──
  const strengths: string[] = [];
  if (detectedSkills.length >= 10) strengths.push(`Strong tech stack with ${detectedSkills.length} detected skills`);
  if (hasQuantified) strengths.push("Uses quantified achievements (numbers, percentages, impact)");
  if (hasProjects) strengths.push("Portfolio of projects demonstrates practical experience");
  if (hasSummary) strengths.push("Professional summary/objective clearly defined");
  if (hasEducation) strengths.push("Academic qualifications clearly presented");
  if (detectedSkills.includes("git") || detectedSkills.includes("github")) strengths.push("Version control proficiency (Git/GitHub) noted");
  if (topRoles[0]?.match >= 70) strengths.push(`Excellent alignment with ${topRoles[0].title} role (${topRoles[0].match}% match)`);
  if (strengths.length < 3) strengths.push("Resume structure is readable by parsers");

  // ── Improvements ──
  const improvements: string[] = [];
  if (!hasQuantified) improvements.push("Add numbers & impact: 'Improved API response time by 40%' beats 'improved performance'");
  if (!hasSummary) improvements.push("Add a 2–3 line professional summary at the top tailored to your target role");
  if (detectedSkills.length < 8) improvements.push("Expand skills section — include frameworks, tools, and cloud platforms you've used");
  if (missingHighDemand.length > 3) improvements.push(`Add trending keywords: ${missingHighDemand.slice(0, 3).map((m) => m.skill).join(", ")}`);
  if (!hasProjects) improvements.push("Add a Projects section with tech stack and links (GitHub / live demo)");
  if (atsScore < 60) improvements.push("Use standard ATS-friendly section headers: 'Work Experience', 'Technical Skills', 'Education'");
  improvements.push("Tailor each resume to the specific job description — mirror their language");
  improvements.push("Keep resume to 1 page (2 max for 5+ years experience), use clean formatting");

  // ── Badges ──
  const badges: { label: string; color: string; icon: string }[] = [];
  if (skillsScore >= 80) badges.push({ label: "Skill Powerhouse", color: "#a78bfa", icon: "⚡" });
  if (detectedSkills.some((s) => ["llm","openai","langchain","rag","pytorch","tensorflow"].includes(s)))
    badges.push({ label: "AI Practitioner", color: "#22d3ee", icon: "🤖" });
  if (detectedSkills.some((s) => ["docker","kubernetes","aws","ci/cd","devops"].includes(s)))
    badges.push({ label: "Cloud Native", color: "#4ade80", icon: "☁️" });
  if (detectedSkills.some((s) => ["react","vue","angular","next.js"].includes(s)))
    badges.push({ label: "Frontend Ready", color: "#fb923c", icon: "🎨" });
  if (hasQuantified) badges.push({ label: "Results-Driven", color: "#f59e0b", icon: "📈" });
  if (topRoles[0]?.match >= 80) badges.push({ label: "Role Ready", color: "#4ade80", icon: "✅" });
  if (overall >= 80) badges.push({ label: "Top Candidate", color: "#f59e0b", icon: "🏆" });
  if (badges.length === 0) badges.push({ label: "Rising Star", color: "#a78bfa", icon: "🌟" });

  // ── Learning Roadmap ──
  const primaryRole = topRoles[0];
  const roadmap = [
    {
      step: 1, title: "Fill Skill Gaps (0–4 weeks)", color: "#f87171",
      items: primaryRole?.missingSkills.slice(0, 3).map((s) => `Learn ${s} — check official docs & freeCodeCamp`) ?? ["Strengthen your core programming fundamentals"],
    },
    {
      step: 2, title: "Build Portfolio Projects (1–2 months)", color: "#fb923c",
      items: [
        `Build a ${primaryRole?.title ?? "full-stack"} project using your top skills`,
        "Publish on GitHub with a detailed README & live demo",
        "Contribute to 1 open-source project to show collaboration",
      ],
    },
    {
      step: 3, title: "Apply & Interview Prep (ongoing)", color: "#4ade80",
      items: [
        "Tailor resume for each application using the job description keywords",
        "Practice 50 LeetCode problems (Easy + Medium) for DS&A rounds",
        `Target: ${topRoles.slice(0, 2).map((r) => r.title).join(" or ")} roles`,
      ],
    },
  ];

  // ── ATS Keywords ──
  const keywords = ATS_KEYWORDS.slice(0, 12).map((word) => ({ word, found: lower.includes(word) }));

  return {
    parsed,
    scores: { overall, skills: skillsScore, experience: experienceScore, projects: projectsScore, ats: Math.min(atsScore, 100) },
    topRoles, missingHighDemand, strengths, improvements, badges,
    skillChartData, radarData, roadmap, keywords,
  };
}

// ─────────────────────────────────────────────
// FILE READER
// ─────────────────────────────────────────────
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) ?? "";
      // If it's a PDF and the raw text is mostly binary, warn
      resolve(text);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsText(file, "utf-8");
  });
}

function isUsableText(text: string): boolean {
  const letters = (text.match(/[a-zA-Z]/g) ?? []).length;
  return letters > 100 && text.length > 200;
}

// ─────────────────────────────────────────────
// SCORE RING
// ─────────────────────────────────────────────
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        <text x="40" y="44" textAnchor="middle" fill="white" style={{ fontSize: "14px", fontWeight: 700, fontFamily: "'Orbitron', monospace" }}>
          {score}
        </text>
      </svg>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
type Phase = "upload" | "analyzing" | "results";

const ANALYZE_STEPS = [
  "Extracting resume content…",
  "Detecting skills & technologies…",
  "Scoring sections & ATS compatibility…",
  "Generating AI recommendations…",
];

export function ResumeAnalyzerSection() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = useCallback(async (f: File) => {
    setError("");
    setPhase("analyzing");
    setAnalyzeStep(0);

    try {
      // Simulate step delays
      const stepDelay = (i: number) => new Promise<void>((res) => setTimeout(res, 650 + i * 350));

      let text = "";
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";

      if (ext === "txt" || ext === "md") {
        text = await readFileAsText(f);
      } else if (ext === "pdf") {
        text = await readFileAsText(f);
        if (!isUsableText(text)) {
          // PDF is binary-encoded — extract what we can via pattern
          const raw = await new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = (e) => res(e.target?.result as string ?? "");
            r.readAsBinaryString(f);
          });
          const matches = raw.match(/\(([^)]{2,80})\)/g) ?? [];
          text = matches.map((m) => m.slice(1, -1)).join(" ");
        }
      } else {
        text = await readFileAsText(f);
      }

      if (!isUsableText(text)) {
        setError("Could not extract readable text from this file. Please paste your resume as a .txt file for best results.");
        setPhase("upload");
        return;
      }

      for (let i = 0; i < ANALYZE_STEPS.length; i++) {
        setAnalyzeStep(i);
        await stepDelay(i);
      }

      const parsed = parseResume(text);
      const result = analyzeResume(parsed);
      setAnalysis(result);
      setPhase("results");
    } catch {
      setError("Failed to read the file. Please try a .txt version of your resume.");
      setPhase("upload");
    }
  }, []);

  const handleFile = (f: File) => {
    setFile(f);
    runAnalysis(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const scoreColor = (s: number) => s >= 75 ? "#4ade80" : s >= 50 ? "#fb923c" : "#f87171";

  // ══════════════════════════════
  // UPLOAD PHASE
  // ══════════════════════════════
  if (phase === "upload") {
    return (
      <div className="space-y-6">
        {/* Hero */}
        <div className="p-8 rounded-2xl text-center"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))", border: "1px solid rgba(139,92,246,0.3)" }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
            <FileText size={36} className="text-white" />
          </div>
          <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.3rem", marginBottom: "8px" }}>
            AI Resume Analyzer
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", maxWidth: "480px", margin: "0 auto" }}>
            Upload your resume and get an instant AI-powered report — skill scores, ATS compatibility,
            role matches, and a personalized learning roadmap.
          </p>
        </div>

        {/* Feature pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Target,    label: "Section Scoring",    color: "#a78bfa" },
            { icon: Zap,       label: "ATS Analysis",       color: "#22d3ee" },
            { icon: Briefcase, label: "Role Matching",      color: "#4ade80" },
            { icon: BookOpen,  label: "Learning Roadmap",   color: "#fb923c" },
          ].map((f) => (
            <div key={f.label} className="p-3 rounded-xl text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <f.icon size={18} style={{ color: f.color, margin: "0 auto 5px" }} />
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{f.label}</p>
            </div>
          ))}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="rounded-2xl flex flex-col items-center justify-center gap-4 cursor-pointer transition-all"
          style={{
            border: `2px dashed ${dragOver ? "#a78bfa" : "rgba(139,92,246,0.35)"}`,
            background: dragOver ? "rgba(139,92,246,0.1)" : "rgba(255,255,255,0.02)",
            padding: "52px 24px",
            transform: dragOver ? "scale(1.01)" : "scale(1)",
          }}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: dragOver ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)" }}>
            <Upload size={28} style={{ color: dragOver ? "#a78bfa" : "rgba(255,255,255,0.35)" }} />
          </div>
          <div className="text-center">
            <p style={{ color: "white", fontWeight: 600, fontSize: "1rem", marginBottom: "4px" }}>
              {dragOver ? "Drop your resume here" : "Drag & drop your resume"}
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
              or click to browse — supports <strong style={{ color: "#a78bfa" }}>.txt</strong>,{" "}
              <strong style={{ color: "#a78bfa" }}>.pdf</strong>,{" "}
              <strong style={{ color: "#a78bfa" }}>.docx</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 20px rgba(124,58,237,0.35)" }}>
            <Upload size={15} className="text-white" />
            <span style={{ color: "white", fontWeight: 600, fontSize: "0.85rem" }}>Choose File</span>
          </div>
          <input ref={inputRef} type="file" accept=".txt,.pdf,.doc,.docx,.md"
            style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </div>

        {/* Tip */}
        <div className="p-4 rounded-xl flex items-start gap-3"
          style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
          <Sparkles size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", lineHeight: 1.6 }}>
            <strong style={{ color: "#fb923c" }}>Best results with .txt:</strong> Copy your resume text, paste into a .txt file and upload.
            PDF extraction works for text-based PDFs — scanned/image PDFs may not parse correctly.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl flex items-start gap-3"
            style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)" }}>
            <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p style={{ color: "#f87171", fontSize: "0.82rem" }}>{error}</p>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════
  // ANALYZING PHASE
  // ══════════════════════════════
  if (phase === "analyzing") {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-16">
        {/* Animated brain */}
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", boxShadow: "0 0 40px rgba(124,58,237,0.5)", animation: "pulse 2s ease-in-out infinite" }}>
            <Brain size={40} className="text-white" />
          </div>
          <div className="absolute -inset-3 rounded-3xl" style={{ border: "2px solid rgba(139,92,246,0.3)", animation: "pulse 2s ease-in-out infinite", animationDelay: "0.3s" }} />
        </div>

        <div className="text-center">
          <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "6px" }}>
            Analyzing Resume
          </h3>
          {file && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{file.name}</p>}
        </div>

        {/* Steps */}
        <div className="w-full max-w-sm space-y-3">
          {ANALYZE_STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-3 p-3 rounded-xl transition-all"
              style={{
                background: i <= analyzeStep ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${i <= analyzeStep ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}`,
              }}>
              {i < analyzeStep ? (
                <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
              ) : i === analyzeStep ? (
                <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin flex-shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }} />
              )}
              <span style={{ color: i <= analyzeStep ? "white" : "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ══════════════════════════════
  // RESULTS PHASE
  // ══════════════════════════════
  if (phase === "results" && analysis) {
    const { parsed, scores, topRoles, missingHighDemand, strengths, improvements, badges, skillChartData, radarData, roadmap, keywords } = analysis;
    const overallColor = scoreColor(scores.overall);

    return (
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="p-6 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(6,182,212,0.1))", border: `1px solid ${overallColor}40` }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", fontSize: "1.6rem", fontWeight: 800 }}>
              {parsed.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.15rem", marginBottom: "3px" }}>{parsed.name}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {parsed.email && <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>✉ {parsed.email}</span>}
                {parsed.phone && <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>📞 {parsed.phone}</span>}
              </div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {badges.map((b) => (
                  <span key={b.label} className="px-2.5 py-1 rounded-lg"
                    style={{ background: `${b.color}18`, border: `1px solid ${b.color}40`, color: b.color, fontSize: "0.72rem", fontWeight: 600 }}>
                    {b.icon} {b.label}
                  </span>
                ))}
              </div>
            </div>
            {/* Overall Score */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "3rem", fontWeight: 900, color: overallColor, lineHeight: 1, filter: `drop-shadow(0 0 12px ${overallColor}60)` }}>
                {scores.overall}
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem" }}>Overall Score</span>
              <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-full rounded-full" style={{ width: `${scores.overall}%`, background: overallColor }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Score Rings ── */}
        <div className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            📊 Section Scores
          </h4>
          <div className="flex flex-wrap justify-around gap-6">
            <ScoreRing score={scores.skills}     label="Skills"      color={scoreColor(scores.skills)} />
            <ScoreRing score={scores.experience} label="Experience"  color={scoreColor(scores.experience)} />
            <ScoreRing score={scores.projects}   label="Projects"    color={scoreColor(scores.projects)} />
            <ScoreRing score={scores.ats}        label="ATS Score"   color={scoreColor(scores.ats)} />
          </div>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Skill Bar Chart */}
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>
              📈 Your Skills vs Industry Demand
            </h4>
            {skillChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={skillChartData} barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="skill" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: "#1a1035", border: "1px solid rgba(139,92,246,0.3)", borderRadius: "10px", fontSize: "0.78rem" }}
                    labelStyle={{ color: "white" }}
                  />
                  <Bar dataKey="yours" name="Your Level" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="industry" name="Industry Demand" fill="#06b6d4" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48">
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>No recognized skills detected — try uploading a .txt resume</p>
              </div>
            )}
            <div className="flex gap-4 mt-2 justify-center">
              {[{ color: "#7c3aed", label: "Your Level" }, { color: "#06b6d4", label: "Industry Demand" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", marginBottom: "1rem" }}>
              🎯 Resume Strength Radar
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                <Radar name="Score" dataKey="score" stroke="#a78bfa" fill="#7c3aed" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Best-fit Roles ── */}
        <div className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", marginBottom: "1.25rem" }}>
            💼 Best-Fit Roles
          </h4>
          <div className="space-y-3">
            {topRoles.map((role, i) => {
              const mc = role.match >= 70 ? "#4ade80" : role.match >= 45 ? "#fb923c" : "#f87171";
              return (
                <div key={role.title} className="p-4 rounded-xl"
                  style={{ background: i === 0 ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.02)", border: `1px solid ${i === 0 ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}` }}>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: "1.1rem" }}>{role.icon}</span>
                      <span style={{ color: "white", fontWeight: 600, fontSize: "0.88rem" }}>{role.title}</span>
                      {i === 0 && <span className="px-2 py-0.5 rounded-lg" style={{ background: "rgba(124,58,237,0.25)", color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700 }}>BEST MATCH</span>}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>{role.salary}</span>
                      <span className="px-2 py-0.5 rounded-lg" style={{ background: `${role.demandColor}15`, color: role.demandColor, fontSize: "0.65rem", fontWeight: 700 }}>{role.demand}</span>
                      <span style={{ color: mc, fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Orbitron', monospace" }}>{role.match}%</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: "5px", background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${role.match}%`, background: `linear-gradient(90deg, ${mc}, ${mc}88)` }} />
                  </div>
                  {role.missingSkills.length > 0 && (
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>
                      Missing: {role.missingSkills.join(", ")}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Skills Detected + Gaps ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Skills Detected */}
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={16} className="text-green-400" />
              <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>
                Detected Skills ({parsed.detectedSkills.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsed.detectedSkills.slice(0, 20).map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-lg"
                  style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80", fontSize: "0.72rem", fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
              {parsed.detectedSkills.length > 20 && (
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", alignSelf: "center" }}>+{parsed.detectedSkills.length - 20} more</span>
              )}
              {parsed.detectedSkills.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>No recognized skills detected. Ensure your resume lists technologies by name.</p>
              )}
            </div>
          </div>

          {/* Skill Gaps */}
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-red-400" />
              <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>High-Demand Skills Missing</h4>
            </div>
            <div className="space-y-2">
              {missingHighDemand.map(({ skill, demand }) => (
                <div key={skill} className="flex items-center justify-between">
                  <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem" }}>{skill}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div className="h-full rounded-full" style={{ width: `${demand}%`, background: "#f87171" }} />
                    </div>
                    <span style={{ color: "#f87171", fontSize: "0.7rem", fontWeight: 600, width: "30px", textAlign: "right" }}>{demand}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── ATS Keywords ── */}
        <div className="p-5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} style={{ color: "#22d3ee" }} />
            <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>ATS Keyword Checklist</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map(({ word, found }) => (
              <span key={word} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{
                  background: found ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${found ? "rgba(74,222,128,0.25)" : "rgba(255,255,255,0.08)"}`,
                  color: found ? "#4ade80" : "rgba(255,255,255,0.35)",
                  fontSize: "0.75rem",
                }}>
                {found ? <CheckCircle size={11} /> : <X size={11} />}
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* ── Strengths & Improvements ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Strengths */}
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-green-400" />
              <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Strengths</h4>
            </div>
            <div className="space-y-2.5">
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="p-5 rounded-2xl"
            style={{ background: "rgba(251,146,60,0.05)", border: "1px solid rgba(251,146,60,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-orange-400" />
              <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Improvements</h4>
            </div>
            <div className="space-y-2.5">
              {improvements.slice(0, 6).map((imp, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <ChevronRight size={14} className="text-orange-400 flex-shrink-0 mt-0.5" />
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", lineHeight: 1.5 }}>{imp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Learning Roadmap ── */}
        <div className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(167,139,250,0.2)" }}>
              <Layers size={16} style={{ color: "#a78bfa" }} />
            </div>
            <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>Personalized Learning Roadmap</h4>
          </div>
          <div className="space-y-4">
            {roadmap.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${step.color}25`, border: `2px solid ${step.color}`, color: step.color, fontWeight: 700, fontSize: "0.8rem" }}>
                    {step.step}
                  </div>
                  {step.step < 3 && <div className="w-px flex-1 mt-2" style={{ background: "rgba(255,255,255,0.08)" }} />}
                </div>
                <div className="pb-4 flex-1">
                  <p style={{ color: step.color, fontWeight: 600, fontSize: "0.85rem", marginBottom: "8px" }}>{step.title}</p>
                  <div className="space-y-2">
                    {step.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: step.color }} />
                        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem", lineHeight: 1.5 }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Awarded Badges ── */}
        <div className="p-6 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.06))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} style={{ color: "#f59e0b" }} />
            <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Earned Badges</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-2 p-4 rounded-xl"
                style={{ background: `${b.color}10`, border: `1px solid ${b.color}30`, minWidth: "90px" }}>
                <span style={{ fontSize: "1.6rem" }}>{b.icon}</span>
                <span style={{ color: b.color, fontSize: "0.68rem", fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <button
            onClick={() => { setPhase("upload"); setAnalysis(null); setFile(null); setError(""); }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "white", fontWeight: 600, fontSize: "0.9rem" }}
          >
            <RotateCcw size={16} /> Analyze Another Resume
          </button>
          <button
            onClick={() => {
              const summary = `SkillSync AI — Resume Analysis Report\n${"=".repeat(45)}\nCandidate: ${parsed.name}\nOverall Score: ${scores.overall}/100\n\nSECTION SCORES\nSkills: ${scores.skills}/100  |  Experience: ${scores.experience}/100\nProjects: ${scores.projects}/100  |  ATS: ${scores.ats}/100\n\nDETECTED SKILLS (${parsed.detectedSkills.length})\n${parsed.detectedSkills.join(", ")}\n\nBEST-FIT ROLES\n${topRoles.map((r) => `• ${r.icon} ${r.title}: ${r.match}% match | ${r.salary}`).join("\n")}\n\nMISSING HIGH-DEMAND SKILLS\n${missingHighDemand.map((m) => `• ${m.skill} (demand: ${m.demand}%)`).join("\n")}\n\nSTRENGTHS\n${strengths.map((s) => `✓ ${s}`).join("\n")}\n\nIMPROVEMENTS\n${improvements.map((imp) => `→ ${imp}`).join("\n")}\n\nLEARNING ROADMAP\n${roadmap.map((r) => `Step ${r.step}: ${r.title}\n${r.items.map((i) => `  • ${i}`).join("\n")}`).join("\n\n")}\n\nGenerated by SkillSync AI`;
              const blob = new Blob([summary], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `resume-analysis-${parsed.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
              a.click(); URL.revokeObjectURL(url);
            }}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white", fontWeight: 600, fontSize: "0.9rem", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
          >
            <GraduationCap size={16} /> Download Report
          </button>
        </div>
      </div>
    );
  }

  return null;
}
