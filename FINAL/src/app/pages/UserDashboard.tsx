import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import {
  getCurrentUser,
  clearCurrentUser,
  getTrendingSkills,
  getRoadmaps,
  getAutomationRisk,
  updateUserSkills,
  getCourses,
  User,
  TrendingSkill,
  saveProfilePic,
  getProfilePic,
  removeProfilePic,
} from "../utils/storage";
import {
  User as UserIcon,
  Code,
  GitMerge,
  Target,
  Sparkles,
  Map,
  BarChart2,
  AlertTriangle,
  LogOut,
  Plus,
  X,
  ChevronRight,
  Menu,
  Zap,
  TrendingUp,
  CheckCircle,
  Shield,
  BookOpen,
  Brain,
  Mic,
  GraduationCap,
  FileText,
  Bot,
  Video,
  Building2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LearningPathwaySection } from "../components/LearningPathwaySection";
import { AssessmentSection } from "../components/AssessmentSection";
import { MockInterviewSection } from "../components/MockInterviewSection";
import { CoursesSection } from "../components/CoursesSection";
import { CertificateSection } from "../components/CertificateSection";
import { ResumeAnalyzerSection } from "../components/ResumeAnalyzerSection";
import { CareerTwinSection } from "../components/CareerTwinSection";
import { LiveClassesSection } from "../components/LiveClassesSection";
import { SkillTrendsSection } from "../components/SkillTrendsSection";
import { CompanySkillSection } from "../components/CompanySkillSection";

type Section =
  | "profile"
  | "skills"
  | "gap"
  | "alignment"
  | "prediction"
  | "roadmap"
  | "growth"
  | "risk"
  | "pathway"
  | "assessment"
  | "interview"
  | "courses"
  | "certificates"
  | "resume"
  | "career_twin"
  | "live_classes"
  | "skill_trends"
  | "company_skills";

export function UserDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [skillInput, setSkillInput] = useState("");
  const [trendingSkills, setTrendingSkills] = useState<TrendingSkill[]>([]);
  const [roadmaps, setRoadmaps] = useState<Record<string, string[]>>({});
  const [automationRisk, setAutomationRisk] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState(getCourses());
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = useCallback(() => {
    setTrendingSkills(getTrendingSkills());
    setRoadmaps(getRoadmaps());
    setAutomationRisk(getAutomationRisk());
    setCourses(getCourses());
  }, []);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    loadData();
    const pic = getProfilePic(currentUser.email);
    if (pic) setProfilePic(pic);
  }, [navigate, loadData]);

  const calcAlignmentScore = (skills: string[], trending: TrendingSkill[]) => {
    if (!trending.length) return 0;
    const matches = skills.filter((s) =>
      trending.some((ts) => ts.skill.toLowerCase() === s.toLowerCase())
    ).length;
    return Math.round((matches / trending.length) * 100);
  };

  const addSkill = () => {
    if (!skillInput.trim() || !user) return;
    const normalized = skillInput.trim();
    if (user.skills.includes(normalized)) {
      setSkillInput("");
      return;
    }
    const newSkills = [...user.skills, normalized];
    const updated = updateUserSkills(user.email, newSkills);
    if (updated) setUser(updated);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    if (!user) return;
    const newSkills = user.skills.filter((s) => s !== skill);
    const updated = updateUserSkills(user.email, newSkills);
    if (updated) setUser(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  if (!user) return null;

  const alignmentScore = calcAlignmentScore(user.skills, trendingSkills);
  const matchingSkills = user.skills.filter((s) =>
    trendingSkills.some((ts) => ts.skill.toLowerCase() === s.toLowerCase())
  );
  const missingSkills = trendingSkills
    .filter((ts) => !user.skills.some((s) => s.toLowerCase() === ts.skill.toLowerCase()))
    .map((ts) => ts.skill);
  const sortedTrending = [...trendingSkills].sort((a, b) => b.growth - a.growth);
  const userRoadmap = roadmaps[user.domain] || [];
  const userRisk = automationRisk[user.domain] || "Unknown";

  const navItems: { key: Section; icon: React.ElementType; labelKey: string }[] = [
    { key: "profile",       icon: UserIcon,      labelKey: "dash_profile" },
    { key: "skills",        icon: Code,          labelKey: "dash_skills" },
    { key: "career_twin",   icon: Bot,           labelKey: "dash_career_twin" },
    { key: "gap",           icon: GitMerge,      labelKey: "dash_gap" },
    { key: "alignment",     icon: Target,        labelKey: "dash_alignment" },
    { key: "prediction",    icon: Sparkles,      labelKey: "dash_prediction" },
    { key: "roadmap",       icon: Map,           labelKey: "dash_roadmap" },
    { key: "growth",        icon: BarChart2,     labelKey: "dash_growth" },
    { key: "risk",          icon: AlertTriangle, labelKey: "dash_risk" },
    { key: "skill_trends",  icon: TrendingUp,    labelKey: "dash_skill_trends" },
    { key: "company_skills",icon: Building2,     labelKey: "dash_company_skills" },
    { key: "pathway",       icon: BookOpen,      labelKey: "dash_pathway" },
    { key: "assessment",    icon: Brain,         labelKey: "dash_assessment" },
    { key: "interview",     icon: Mic,           labelKey: "dash_interview" },
    { key: "courses",       icon: GraduationCap, labelKey: "dash_courses" },
    { key: "live_classes",  icon: Video,         labelKey: "dash_live_classes" },
    { key: "certificates",  icon: Shield,        labelKey: "dash_certificates" },
    { key: "resume",        icon: FileText,      labelKey: "dash_resume" },
  ];

  const riskColor = userRisk === "Low" ? "#4ade80" : userRisk === "Medium" ? "#fb923c" : "#f87171";
  const riskBg =
    userRisk === "Low"
      ? "rgba(74,222,128,0.1)"
      : userRisk === "Medium"
      ? "rgba(251,146,60,0.1)"
      : "rgba(248,113,113,0.1)";
  const riskBorder =
    userRisk === "Low"
      ? "rgba(74,222,128,0.3)"
      : userRisk === "Medium"
      ? "rgba(251,146,60,0.3)"
      : "rgba(248,113,113,0.3)";
  const riskKey =
    userRisk === "Low" ? "risk_low" : userRisk === "Medium" ? "risk_medium" : "risk_high";
  const riskDescKey =
    userRisk === "Low"
      ? "risk_low_desc"
      : userRisk === "Medium"
      ? "risk_medium_desc"
      : "risk_high_desc";

  const scoreColor =
    alignmentScore >= 70 ? "#4ade80" : alignmentScore >= 40 ? "#fb923c" : "#f87171";
  const scoreFeedback =
    alignmentScore >= 70
      ? "alignment_excellent"
      : alignmentScore >= 40
      ? "alignment_good"
      : alignmentScore >= 20
      ? "alignment_fair"
      : "alignment_poor";

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: "linear-gradient(135deg, #0a0a1a 0%, #0f0a2e 40%, #0a1a2e 100%)",
        minHeight: "100vh",
        color: "white",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "260px" : "70px",
          minHeight: "100vh",
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(139,92,246,0.15)",
          transition: "width 0.3s ease",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Logo + toggle */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "70px" }}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  padding: "5px",
                  borderRadius: "7px",
                }}
              >
                <Zap size={14} className="text-white" />
              </div>
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                SkillSync AI
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ color: "rgba(255,255,255,0.5)", padding: "4px" }}
          >
            <Menu size={18} />
          </button>
        </div>

        {/* User Avatar */}
        {sidebarOpen && (
          <div className="p-4">
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", fontSize: "0.9rem", fontWeight: 700 }}
              >
                {profilePic ? (
                  <img src={profilePic} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div style={{ overflow: "hidden" }}>
                <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 600, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                  {user.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>
                  {user.domain}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navItems.map(({ key, icon: Icon, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
              style={{
                background:
                  activeSection === key
                    ? "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.15))"
                    : "transparent",
                border:
                  activeSection === key
                    ? "1px solid rgba(139,92,246,0.3)"
                    : "1px solid transparent",
                color: activeSection === key ? "white" : "rgba(255,255,255,0.55)",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
              title={!sidebarOpen ? t(labelKey) : undefined}
            >
              <Icon size={17} style={{ flexShrink: 0, color: activeSection === key ? "#a78bfa" : undefined }} />
              {sidebarOpen && (
                <span style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>{t(labelKey)}</span>
              )}
              {sidebarOpen && activeSection === key && (
                <ChevronRight size={13} className="ml-auto text-purple-400" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => {
              clearCurrentUser();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-red-500/10"
            style={{
              color: "rgba(248,113,113,0.8)",
              border: "1px solid transparent",
              justifyContent: sidebarOpen ? "flex-start" : "center",
            }}
            title={!sidebarOpen ? t("dash_logout") : undefined}
          >
            <LogOut size={17} style={{ flexShrink: 0 }} />
            {sidebarOpen && <span style={{ fontSize: "0.85rem" }}>{t("dash_logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto" style={{ maxWidth: "100%" }}>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("dash_welcome")}, {user.name.split(" ")[0]}! 👋
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", marginTop: "2px" }}>
              {user.domain} • {user.year}
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-xl"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "1px solid rgba(139,92,246,0.25)",
            }}
          >
            <span style={{ color: "#a78bfa", fontSize: "0.8rem", fontWeight: 600 }}>
              {alignmentScore}% {t("dash_alignment")}
            </span>
          </div>
        </div>

        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <SectionHeader icon={UserIcon} title={t("dash_profile")} color="#7c3aed" />

            {/* Profile Picture Upload */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              <div className="flex items-center gap-6">
                {/* Avatar with upload */}
                <div className="relative flex-shrink-0">
                  <div
                    className="w-24 h-24 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:opacity-80"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      border: "2px solid rgba(139,92,246,0.4)",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    title="Click to upload profile picture"
                  >
                    {profilePic ? (
                      <img src={profilePic} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  {/* Camera icon overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", border: "2px solid rgba(15,10,46,1)" }}
                    title="Upload photo"
                  >
                    <span style={{ fontSize: "0.75rem" }}>📷</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const base64 = ev.target?.result as string;
                        // Compress by drawing to canvas
                        const img = new Image();
                        img.onload = () => {
                          const canvas = document.createElement("canvas");
                          const MAX = 200;
                          const ratio = Math.min(MAX / img.width, MAX / img.height);
                          canvas.width = img.width * ratio;
                          canvas.height = img.height * ratio;
                          const ctx = canvas.getContext("2d");
                          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                          const compressed = canvas.toDataURL("image/jpeg", 0.8);
                          saveProfilePic(user!.email, compressed);
                          setProfilePic(compressed);
                        };
                        img.src = base64;
                      };
                      reader.readAsDataURL(file);
                      // Reset input
                      e.target.value = "";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", marginBottom: "4px" }}>{user.name}</h3>
                  <p style={{ color: "#a78bfa", fontSize: "0.85rem", marginBottom: "2px" }}>{user.domain}</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{user.year} • {user.email}</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 px-4 py-1.5 rounded-xl text-sm transition-all hover:scale-105"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.3)",
                      color: "#a78bfa",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    📷 {profilePic ? "Change Photo" : "Upload Photo"}
                  </button>
                  {profilePic && (
                    <button
                      onClick={() => {
                        removeProfilePic(user!.email);
                        setProfilePic(null);
                      }}
                      className="mt-3 ml-2 px-4 py-1.5 rounded-xl text-sm transition-all hover:scale-105"
                      style={{
                        background: "rgba(248,113,113,0.1)",
                        border: "1px solid rgba(248,113,113,0.25)",
                        color: "#f87171",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: t("profile_name"), value: user.name },
                { label: t("profile_email"), value: user.email },
                { label: t("profile_domain"), value: user.domain },
                { label: t("profile_year"), value: user.year },
                { label: t("profile_skills_count"), value: String(user.skills.length) },
                { label: t("profile_alignment"), value: `${alignmentScore}%` },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginBottom: "6px" }}>
                    {item.label}
                  </p>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "1rem" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY SKILLS SECTION */}
        {activeSection === "skills" && (
          <div className="space-y-6">
            <SectionHeader icon={Code} title={t("dash_skills")} color="#06b6d4" />

            {/* Add skill input */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t("skills_add_ph")}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  style={{
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "10px",
                    color: "white",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105 flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  <Plus size={16} />
                  {t("skills_add_btn")}
                </button>
              </div>
            </div>

            {/* Skills Display */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginBottom: "16px" }}>
                {t("skills_your")} ({user.skills.length})
              </h3>
              {user.skills.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.9rem", textAlign: "center", padding: "2rem 0" }}>
                  {t("skills_none")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {user.skills.map((skill) => {
                    const isTrending = trendingSkills.some(
                      (ts) => ts.skill.toLowerCase() === skill.toLowerCase()
                    );
                    return (
                      <div
                        key={skill}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl"
                        style={{
                          background: isTrending
                            ? "rgba(74,222,128,0.1)"
                            : "rgba(255,255,255,0.08)",
                          border: isTrending
                            ? "1px solid rgba(74,222,128,0.3)"
                            : "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {isTrending && <CheckCircle size={13} className="text-green-400" />}
                        <span style={{ color: "white", fontSize: "0.85rem", fontWeight: 500 }}>
                          {skill}
                        </span>
                        <button
                          onClick={() => removeSkill(skill)}
                          style={{ color: "rgba(255,255,255,0.4)" }}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SKILL GAP ANALYZER */}
        {activeSection === "gap" && (
          <div className="space-y-6">
            <SectionHeader icon={GitMerge} title={t("gap_title")} color="#8b5cf6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Matching Skills */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(74,222,128,0.06)",
                  border: "1px solid rgba(74,222,128,0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle size={18} className="text-green-400" />
                  <h3 style={{ color: "#4ade80", fontWeight: 600, fontSize: "0.95rem" }}>
                    {t("gap_matching")} ({matchingSkills.length})
                  </h3>
                </div>
                {matchingSkills.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
                    {t("skills_none")}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {matchingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-lg"
                        style={{
                          background: "rgba(74,222,128,0.15)",
                          border: "1px solid rgba(74,222,128,0.3)",
                          color: "#4ade80",
                          fontSize: "0.82rem",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Skills */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: "rgba(248,113,113,0.06)",
                  border: "1px solid rgba(248,113,113,0.2)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={18} className="text-red-400" />
                  <h3 style={{ color: "#f87171", fontWeight: 600, fontSize: "0.95rem" }}>
                    {t("gap_missing")} ({missingSkills.length})
                  </h3>
                </div>
                {missingSkills.length === 0 ? (
                  <p style={{ color: "#4ade80", fontSize: "0.85rem" }}>{t("gap_none_missing")}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1 rounded-lg"
                        style={{
                          background: "rgba(248,113,113,0.12)",
                          border: "1px solid rgba(248,113,113,0.25)",
                          color: "#f87171",
                          fontSize: "0.82rem",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>
                <span style={{ color: "#a78bfa", fontWeight: 700 }}>{matchingSkills.length}</span>{" "}
                {t("gap_matched")} {t("gap_of")}{" "}
                <span style={{ color: "#a78bfa", fontWeight: 700 }}>{trendingSkills.length}</span>{" "}
                {t("gap_skills")}
              </p>
            </div>
          </div>
        )}

        {/* ALIGNMENT SCORE */}
        {activeSection === "alignment" && (
          <div className="space-y-6">
            <SectionHeader icon={Target} title={t("alignment_title")} color="#06b6d4" />

            <div
              className="p-8 rounded-2xl text-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(6,182,212,0.2)",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                {t("alignment_score")}
              </p>
              <div
                style={{
                  fontSize: "5rem",
                  fontWeight: 900,
                  fontFamily: "'Orbitron', sans-serif",
                  color: scoreColor,
                  lineHeight: 1,
                  marginBottom: "1rem",
                }}
              >
                {alignmentScore}%
              </div>

              {/* Progress Bar */}
              <div
                className="w-full rounded-full overflow-hidden mb-4"
                style={{ height: "14px", background: "rgba(255,255,255,0.08)", maxWidth: "400px", margin: "0 auto 1.5rem" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${alignmentScore}%`,
                    background:
                      alignmentScore >= 70
                        ? "linear-gradient(90deg, #4ade80, #22d3ee)"
                        : alignmentScore >= 40
                        ? "linear-gradient(90deg, #fb923c, #fbbf24)"
                        : "linear-gradient(90deg, #f87171, #fb923c)",
                    boxShadow: `0 0 15px ${scoreColor}60`,
                  }}
                />
              </div>

              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
                {t(scoreFeedback)}
              </p>
            </div>

            {/* Score breakdown */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Skills Added", value: user.skills.length, color: "#a78bfa" },
                { label: "Trending Matches", value: matchingSkills.length, color: "#4ade80" },
                { label: "Total Trending", value: trendingSkills.length, color: "#22d3ee" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-5 rounded-2xl text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{ fontSize: "2rem", fontWeight: 800, color: item.color, fontFamily: "'Orbitron', sans-serif" }}
                  >
                    {item.value}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", marginTop: "4px" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FUTURE PREDICTIONS */}
        {activeSection === "prediction" && (
          <div className="space-y-5">
            <SectionHeader icon={Sparkles} title={t("prediction_title")} color="#8b5cf6" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("prediction_subtitle")}
            </p>
            <div className="space-y-3">
              {sortedTrending.map((skill, i) => (
                <div
                  key={skill.skill}
                  className="flex items-center gap-4 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        i < 3 ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.08)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>
                      {skill.skill}
                    </p>
                    <div
                      className="mt-1.5 rounded-full overflow-hidden"
                      style={{ height: "6px", background: "rgba(255,255,255,0.08)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(skill.growth, 100)}%`,
                          background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 px-3 py-1 rounded-lg flex-shrink-0"
                    style={{
                      background: "rgba(74,222,128,0.1)",
                      border: "1px solid rgba(74,222,128,0.25)",
                    }}
                  >
                    <TrendingUp size={12} className="text-green-400" />
                    <span style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: 600 }}>
                      +{skill.growth}% {t("prediction_growth")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAREER ROADMAP */}
        {activeSection === "roadmap" && (
          <div className="space-y-6">
            <SectionHeader icon={Map} title={t("roadmap_title")} color="#06b6d4" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("roadmap_subtitle")} — <span style={{ color: "#a78bfa" }}>{user.domain}</span>
            </p>
            {userRoadmap.length === 0 ? (
              <div
                className="p-8 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Map size={40} className="mx-auto mb-3 opacity-30" />
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>{t("roadmap_none")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userRoadmap.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          i < 3
                            ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                            : "rgba(139,92,246,0.2)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginBottom: "2px" }}>
                        {t("roadmap_step")} {i + 1}
                      </p>
                      <p style={{ color: "white", fontWeight: 500, fontSize: "0.9rem" }}>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SKILL GROWTH INDEX */}
        {activeSection === "growth" && (
          <div className="space-y-6">
            <SectionHeader icon={BarChart2} title={t("growth_title")} color="#7c3aed" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("growth_subtitle")}
            </p>
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={trendingSkills} margin={{ top: 10, right: 10, left: -10, bottom: 60 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="skill"
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
                    angle={-40}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.3)"
                    tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 11 }}
                    unit="%"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15,10,40,0.95)",
                      border: "1px solid rgba(139,92,246,0.3)",
                      borderRadius: "10px",
                      color: "white",
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                    formatter={(value: number) => [`${value}%`, t("prediction_growth")]}
                  />
                  <Bar dataKey="growth" fill="url(#barGrad)" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* AUTOMATION RISK */}
        {activeSection === "risk" && (
          <div className="space-y-6">
            <SectionHeader icon={AlertTriangle} title={t("risk_title")} color={riskColor} />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("risk_subtitle")}
            </p>

            {/* Risk Level Card */}
            <div
              className="p-8 rounded-2xl text-center"
              style={{ background: riskBg, border: `1px solid ${riskBorder}` }}
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-5"
                style={{
                  background: `${riskColor}20`,
                  border: `2px solid ${riskColor}`,
                }}
              >
                <AlertTriangle size={40} style={{ color: riskColor }} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "8px" }}>
                {t("risk_level")} — {user.domain}
              </p>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  fontFamily: "'Orbitron', sans-serif",
                  color: riskColor,
                  marginBottom: "1rem",
                }}
              >
                {t(riskKey)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.65)", maxWidth: "500px", margin: "0 auto", fontSize: "0.9rem", lineHeight: 1.6 }}>
                {t(riskDescKey)}
              </p>
            </div>

            {/* Tips */}
            <div
              className="p-6 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h3 style={{ color: "white", fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>
                💡 {t("risk_tips")}
              </h3>
              <ul className="space-y-3">
                {["risk_tip1", "risk_tip2", "risk_tip3"].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <Shield size={15} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem" }}>
                      {t(tip)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* LEARNING PATHWAY */}
        {activeSection === "pathway" && (
          <div className="space-y-6">
            <SectionHeader icon={BookOpen} title={t("pathway_title")} color="#4ade80" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("pathway_subtitle")}
            </p>
            <LearningPathwaySection
              domain={user.domain}
              roadmap={userRoadmap}
              courses={courses}
              userSkills={user.skills}
            />
          </div>
        )}

        {/* ASSESSMENT */}
        {activeSection === "assessment" && (
          <div className="space-y-6">
            <SectionHeader icon={Brain} title={t("assess_title")} color="#a78bfa" />
            <AssessmentSection
              userEmail={user.email}
              userDomain={user.domain}
            />
          </div>
        )}

        {/* MOCK INTERVIEW */}
        {activeSection === "interview" && (
          <div className="space-y-6">
            <SectionHeader icon={Mic} title={t("interview_title")} color="#22d3ee" />
            <MockInterviewSection
              userEmail={user.email}
            />
          </div>
        )}

        {/* COURSES */}
        {activeSection === "courses" && (
          <div className="space-y-6">
            <SectionHeader icon={GraduationCap} title={t("courses_title")} color="#fb923c" />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("courses_subtitle")}
            </p>
            <CoursesSection
              userEmail={user.email}
              userDomain={user.domain}
            />
          </div>
        )}

        {/* CERTIFICATES */}
        {activeSection === "certificates" && (
          <div className="space-y-6">
            <SectionHeader icon={Shield} title={t("dash_certificates")} color="#a78bfa" />
            <CertificateSection
              userEmail={user.email}
              userName={user.name}
            />
          </div>
        )}

        {/* RESUME ANALYZER */}
        {activeSection === "resume" && (
          <div className="space-y-6">
            <SectionHeader icon={FileText} title={t("dash_resume")} color="#a78bfa" />
            <ResumeAnalyzerSection />
          </div>
        )}

        {/* CAREER TWIN */}
        {activeSection === "career_twin" && (
          <div className="space-y-6">
            <SectionHeader icon={Bot} title="AI Career Twin" color="#a78bfa" />
            <CareerTwinSection
              user={user}
              trendingSkills={trendingSkills}
              automationRisk={userRisk}
            />
          </div>
        )}

        {/* LIVE CLASSES */}
        {activeSection === "live_classes" && (
          <div className="space-y-6">
            <SectionHeader icon={Video} title="Live Interactive Classes" color="#4ade80" />
            <LiveClassesSection />
          </div>
        )}

        {/* SKILL TRENDS */}
        {activeSection === "skill_trends" && (
          <div className="space-y-6">
            <SectionHeader icon={TrendingUp} title="Real-Time AI Skill Trends" color="#22d3ee" />
            <SkillTrendsSection userSkills={user.skills} trendingSkills={trendingSkills} />
          </div>
        )}

        {/* COMPANY SKILL TARGETING */}
        {activeSection === "company_skills" && (
          <div className="space-y-6">
            <SectionHeader icon={Building2} title="Company-Based Skill Targeting" color="#fb923c" />
            <CompanySkillSection userSkills={user.skills} />
          </div>
        )}
      </main>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  color,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}25`, border: `1px solid ${color}50` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <h2
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "1.1rem",
          fontWeight: 700,
          color: "white",
        }}
      >
        {title}
      </h2>
    </div>
  );
}