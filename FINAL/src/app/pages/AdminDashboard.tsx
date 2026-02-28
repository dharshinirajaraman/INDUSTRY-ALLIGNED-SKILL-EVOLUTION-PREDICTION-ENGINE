import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import {
  isAdminLoggedIn,
  clearAdminSession,
  getUsers,
  getTrendingSkills,
  saveTrendingSkills,
  getDomains,
  saveDomains,
  getRoadmaps,
  saveRoadmaps,
  getAutomationRisk,
  saveAutomationRisk,
  TrendingSkill,
  User,
  getProfilePic,
} from "../utils/storage";
import {
  Shield,
  TrendingUp,
  Layers,
  Map,
  Users,
  AlertTriangle,
  LogOut,
  Plus,
  X,
  Save,
  Menu,
  Zap,
  ChevronRight,
  BarChart2,
  Brain,
  BookOpen,
  Award,
  Video,
} from "lucide-react";
import { AdminAssessmentSection } from "../components/AdminAssessmentSection";
import { AdminCoursesSection } from "../components/AdminCoursesSection";
import { AdminCertificatesSection } from "../components/AdminCertificatesSection";
import { AdminLiveClassesSection } from "../components/AdminLiveClassesSection";

type AdminSection = "overview" | "trending" | "domains" | "roadmaps" | "users" | "risk" | "assessments" | "courses_admin" | "certificates_admin" | "live_classes_admin";

export function AdminDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [trendingSkills, setTrendingSkillsState] = useState<TrendingSkill[]>([]);
  const [domains, setDomainsState] = useState<string[]>([]);
  const [roadmaps, setRoadmapsState] = useState<Record<string, string[]>>({});
  const [automationRisk, setAutomationRiskState] = useState<Record<string, string>>({});
  const [users, setUsersState] = useState<User[]>([]);

  // Form states
  const [newSkill, setNewSkill] = useState("");
  const [newGrowth, setNewGrowth] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [selectedRoadmapDomain, setSelectedRoadmapDomain] = useState("");
  const [roadmapText, setRoadmapText] = useState("");
  const [selectedRiskDomain, setSelectedRiskDomain] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("Low");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const loadAll = useCallback(() => {
    setTrendingSkillsState(getTrendingSkills());
    setDomainsState(getDomains());
    setRoadmapsState(getRoadmaps());
    setAutomationRiskState(getAutomationRisk());
    setUsersState(getUsers());
  }, []);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin-login");
      return;
    }
    loadAll();
  }, [navigate, loadAll]);

  // Trending Skills
  const addSkill = () => {
    if (!newSkill.trim() || !newGrowth) return;
    const g = Number(newGrowth);
    if (isNaN(g) || g < 0 || g > 100) return;
    const updated = [...trendingSkills, { skill: newSkill.trim(), growth: g }];
    saveTrendingSkills(updated);
    setTrendingSkillsState(updated);
    setNewSkill("");
    setNewGrowth("");
    showToast("Skill added!");
  };

  const removeSkill = (skill: string) => {
    const updated = trendingSkills.filter((s) => s.skill !== skill);
    saveTrendingSkills(updated);
    setTrendingSkillsState(updated);
    showToast("Skill removed!");
  };

  const updateGrowth = (skill: string, growth: number) => {
    const updated = trendingSkills.map((s) =>
      s.skill === skill ? { ...s, growth } : s
    );
    saveTrendingSkills(updated);
    setTrendingSkillsState(updated);
  };

  // Domains
  const addDomain = () => {
    if (!newDomain.trim()) return;
    if (domains.includes(newDomain.trim())) return;
    const updated = [...domains, newDomain.trim()];
    saveDomains(updated);
    setDomainsState(updated);
    setNewDomain("");
    showToast("Domain added!");
  };

  const removeDomain = (d: string) => {
    const updated = domains.filter((x) => x !== d);
    saveDomains(updated);
    setDomainsState(updated);
    showToast("Domain removed!");
  };

  // Roadmaps
  const saveRoadmap = () => {
    if (!selectedRoadmapDomain) return;
    const steps = roadmapText
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s);
    const updated = { ...roadmaps, [selectedRoadmapDomain]: steps };
    saveRoadmaps(updated);
    setRoadmapsState(updated);
    showToast("Roadmap saved!");
  };

  // Risk
  const saveRisk = () => {
    if (!selectedRiskDomain) return;
    const updated = { ...automationRisk, [selectedRiskDomain]: selectedRiskLevel };
    saveAutomationRisk(updated);
    setAutomationRiskState(updated);
    showToast("Risk data saved!");
  };

  // Stats
  const avgScore =
    users.length > 0
      ? Math.round(users.reduce((s, u) => s + u.alignmentScore, 0) / users.length)
      : 0;

  const navItems: { key: AdminSection; icon: React.ElementType; labelKey: string }[] = [
    { key: "overview",           icon: BarChart2,    labelKey: "admin_overview" },
    { key: "trending",           icon: TrendingUp,   labelKey: "admin_trending" },
    { key: "domains",            icon: Layers,       labelKey: "admin_domains" },
    { key: "roadmaps",           icon: Map,          labelKey: "admin_roadmaps" },
    { key: "users",              icon: Users,        labelKey: "admin_users" },
    { key: "risk",               icon: AlertTriangle,labelKey: "admin_risk_mgmt" },
    { key: "assessments",        icon: Brain,        labelKey: "admin_assessments" },
    { key: "courses_admin",      icon: BookOpen,     labelKey: "admin_courses_mgmt" },
    { key: "certificates_admin", icon: Award,        labelKey: "admin_certificates_mgmt" },
    { key: "live_classes_admin", icon: Video,        labelKey: "admin_live_classes" },
  ];

  const inputStyle = {
    padding: "10px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.875rem",
    outline: "none",
  };

  const getRiskColor = (risk: string) =>
    risk === "Low" ? "#4ade80" : risk === "Medium" ? "#fb923c" : "#f87171";

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: "linear-gradient(135deg, #0a0a1a 0%, #081a2e 40%, #0a0a1a 100%)",
        minHeight: "100vh",
        color: "white",
        display: "flex",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            boxShadow: "0 0 25px rgba(124,58,237,0.4)",
          }}
        >
          ✓ {toast}
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "250px" : "70px",
          minHeight: "100vh",
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(6,182,212,0.15)",
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
        {/* Logo */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: "70px" }}
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div
                style={{
                  background: "linear-gradient(135deg, #0891b2, #6366f1)",
                  padding: "5px",
                  borderRadius: "7px",
                }}
              >
                <Shield size={14} className="text-white" />
              </div>
              <span
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #22d3ee, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Admin Panel
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

        {sidebarOpen && (
          <div className="p-4">
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #0891b2, #6366f1)" }}
              >
                <Shield size={16} className="text-white" />
              </div>
              <div>
                <div style={{ color: "white", fontSize: "0.8rem", fontWeight: 600 }}>
                  Administrator
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>
                  admin@skillsync.com
                </div>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-4">
          {navItems.map(({ key, icon: Icon, labelKey }) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
              style={{
                background:
                  activeSection === key
                    ? "linear-gradient(135deg, rgba(8,145,178,0.25), rgba(99,102,241,0.15))"
                    : "transparent",
                border:
                  activeSection === key
                    ? "1px solid rgba(6,182,212,0.3)"
                    : "1px solid transparent",
                color: activeSection === key ? "white" : "rgba(255,255,255,0.55)",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
              title={!sidebarOpen ? t(labelKey) : undefined}
            >
              <Icon size={17} style={{ flexShrink: 0, color: activeSection === key ? "#22d3ee" : undefined }} />
              {sidebarOpen && (
                <span style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>{t(labelKey)}</span>
              )}
              {sidebarOpen && activeSection === key && (
                <ChevronRight size={13} className="ml-auto text-cyan-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button
            onClick={() => {
              clearAdminSession();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-red-500/10"
            style={{
              color: "rgba(248,113,113,0.8)",
              justifyContent: sidebarOpen ? "flex-start" : "center",
            }}
          >
            <LogOut size={17} />
            {sidebarOpen && <span style={{ fontSize: "0.85rem" }}>{t("admin_logout")}</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("admin_title")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "2px" }}>
              SkillSync AI Platform Control Panel
            </p>
          </div>
          <div
            className="px-4 py-2 rounded-xl"
            style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)" }}
          >
            <span style={{ color: "#22d3ee", fontSize: "0.8rem", fontWeight: 600 }}>
              🟢 Live
            </span>
          </div>
        </div>

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={BarChart2} title={t("admin_overview")} color="#22d3ee" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t("admin_total_users"), value: users.length, color: "#a78bfa", icon: Users },
                { label: t("admin_avg_alignment"), value: `${avgScore}%`, color: "#4ade80", icon: BarChart2 },
                { label: t("admin_total_skills"), value: trendingSkills.length, color: "#22d3ee", icon: TrendingUp },
                { label: t("admin_total_domains"), value: domains.length, color: "#fb923c", icon: Layers },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <item.icon size={20} style={{ color: item.color, opacity: 0.7 }} />
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: 800,
                      fontFamily: "'Orbitron', sans-serif",
                      color: item.color,
                    }}
                  >
                    {item.value}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", marginTop: "4px" }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick snapshot of trending skills */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" }}>
                Top Trending Skills
              </h3>
              <div className="space-y-3">
                {[...trendingSkills].sort((a, b) => b.growth - a.growth).slice(0, 5).map((s) => (
                  <div key={s.skill} className="flex items-center gap-3">
                    <span style={{ color: "white", fontSize: "0.875rem", minWidth: "130px" }}>{s.skill}</span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: "8px", background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(s.growth, 100)}%`,
                          background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                        }}
                      />
                    </div>
                    <span style={{ color: "#4ade80", fontSize: "0.8rem", fontWeight: 600, minWidth: "40px", textAlign: "right" }}>
                      +{s.growth}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRENDING SKILLS */}
        {activeSection === "trending" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={TrendingUp} title={t("admin_trending")} color="#4ade80" />

            {/* Add Form */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(74,222,128,0.2)" }}
            >
              <div className="flex gap-3 flex-wrap">
                <input
                  type="text"
                  placeholder={t("admin_skill_name_ph")}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  style={{ ...inputStyle, flex: "1", minWidth: "150px" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(74,222,128,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <input
                  type="number"
                  placeholder={t("admin_growth_ph")}
                  value={newGrowth}
                  onChange={(e) => setNewGrowth(e.target.value)}
                  style={{ ...inputStyle, width: "110px" }}
                  min="0"
                  max="100"
                  onFocus={(e) => (e.target.style.borderColor = "rgba(74,222,128,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #16a34a, #06b6d4)", color: "white", fontWeight: 600, fontSize: "0.875rem" }}
                >
                  <Plus size={16} />
                  {t("admin_add_skill")}
                </button>
              </div>
            </div>

            {/* Skills List */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                {t("admin_skill_list")} ({trendingSkills.length})
              </h3>
              <div className="space-y-3">
                {trendingSkills.map((skill) => (
                  <div
                    key={skill.skill}
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span style={{ color: "white", fontWeight: 600, flex: 1, fontSize: "0.875rem" }}>
                      {skill.skill}
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={skill.growth}
                        onChange={(e) => updateGrowth(skill.skill, Number(e.target.value))}
                        style={{ ...inputStyle, width: "80px", padding: "6px 10px", fontSize: "0.82rem" }}
                        min="0"
                        max="100"
                      />
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>%</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-lg" style={{ background: "rgba(74,222,128,0.1)" }}>
                      <TrendingUp size={12} className="text-green-400" />
                      <span style={{ color: "#4ade80", fontSize: "0.78rem", fontWeight: 600 }}>
                        {skill.growth}%
                      </span>
                    </div>
                    <button
                      onClick={() => removeSkill(skill.skill)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20"
                      style={{ color: "rgba(248,113,113,0.7)" }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOMAINS */}
        {activeSection === "domains" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={Layers} title={t("admin_domains")} color="#fb923c" />

            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,146,60,0.2)" }}
            >
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t("admin_domain_ph")}
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(251,146,60,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  onKeyDown={(e) => e.key === "Enter" && addDomain()}
                />
                <button
                  onClick={addDomain}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #ea580c, #7c3aed)", color: "white", fontWeight: 600, fontSize: "0.875rem" }}
                >
                  <Plus size={16} />
                  {t("admin_add_domain")}
                </button>
              </div>
            </div>

            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                {t("admin_domain_list")} ({domains.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {domains.map((d) => (
                  <div
                    key={d}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.25)" }}
                  >
                    <span style={{ color: "#fb923c", fontSize: "0.875rem", fontWeight: 500 }}>{d}</span>
                    <button
                      onClick={() => removeDomain(d)}
                      style={{ color: "rgba(255,255,255,0.4)" }}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ROADMAPS */}
        {activeSection === "roadmaps" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={Map} title={t("admin_roadmaps")} color="#a78bfa" />

            <div
              className="p-6 rounded-2xl space-y-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(167,139,250,0.2)" }}
            >
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "6px" }}>
                  {t("admin_select_domain")}
                </label>
                <select
                  value={selectedRoadmapDomain}
                  onChange={(e) => {
                    setSelectedRoadmapDomain(e.target.value);
                    const existing = roadmaps[e.target.value];
                    setRoadmapText(existing ? existing.join("\n") : "");
                  }}
                  style={{ ...inputStyle, width: "100%", cursor: "pointer" }}
                >
                  <option value="" style={{ background: "#0f0a2e" }}>— {t("admin_select_domain")} —</option>
                  {domains.map((d) => (
                    <option key={d} value={d} style={{ background: "#0f0a2e" }}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "6px" }}>
                  {t("admin_roadmap_steps")}
                </label>
                <textarea
                  placeholder={t("admin_roadmap_ph")}
                  value={roadmapText}
                  onChange={(e) => setRoadmapText(e.target.value)}
                  rows={8}
                  style={{
                    ...inputStyle,
                    width: "100%",
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(167,139,250,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>
              <button
                onClick={saveRoadmap}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white", fontWeight: 600, fontSize: "0.875rem" }}
              >
                <Save size={16} />
                {t("admin_save_roadmap")}
              </button>
            </div>

            {/* Current Roadmaps */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                {t("admin_current_roadmaps")}
              </h3>
              <div className="space-y-3">
                {Object.entries(roadmaps).map(([domain, steps]) => (
                  <div
                    key={domain}
                    className="p-4 rounded-xl cursor-pointer"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    onClick={() => {
                      setSelectedRoadmapDomain(domain);
                      setRoadmapText(steps.join("\n"));
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: "#a78bfa", fontWeight: 600, fontSize: "0.875rem" }}>{domain}</span>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
                        {steps.length} steps
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeSection === "users" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={Users} title={t("admin_users")} color="#22d3ee" />
            {users.length === 0 ? (
              <div
                className="p-10 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>{t("admin_no_users")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                      {[
                        t("admin_user_name"),
                        t("admin_user_email"),
                        t("admin_user_domain"),
                        t("admin_user_year"),
                        t("admin_user_skills"),
                        t("admin_user_score"),
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "12px 16px",
                            textAlign: "left",
                            color: "rgba(255,255,255,0.55)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const pic = getProfilePic(u.email);
                      return (
                      <tr
                        key={u.id}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ padding: "12px 16px", color: "white", fontSize: "0.875rem" }}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", fontSize: "0.75rem", fontWeight: 700 }}
                            >
                              {pic ? (
                                <img src={pic} alt={u.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                u.name.charAt(0).toUpperCase()
                              )}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>{u.email}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            className="px-2 py-1 rounded-lg"
                            style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", fontSize: "0.78rem" }}
                          >
                            {u.domain}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>{u.year}</td>
                        <td style={{ padding: "12px 16px", color: "#22d3ee", fontSize: "0.82rem", fontWeight: 600 }}>
                          {u.skills.length}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            className="px-3 py-1 rounded-lg"
                            style={{
                              background:
                                u.alignmentScore >= 70
                                  ? "rgba(74,222,128,0.15)"
                                  : u.alignmentScore >= 40
                                  ? "rgba(251,146,60,0.15)"
                                  : "rgba(248,113,113,0.15)",
                              color:
                                u.alignmentScore >= 70
                                  ? "#4ade80"
                                  : u.alignmentScore >= 40
                                  ? "#fb923c"
                                  : "#f87171",
                              fontSize: "0.82rem",
                              fontWeight: 700,
                            }}
                          >
                            {u.alignmentScore}%
                          </span>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* RISK MANAGEMENT */}
        {activeSection === "risk" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={AlertTriangle} title={t("admin_risk_mgmt")} color="#f87171" />

            <div
              className="p-6 rounded-2xl space-y-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "6px" }}>
                    {t("admin_risk_domain")}
                  </label>
                  <select
                    value={selectedRiskDomain}
                    onChange={(e) => setSelectedRiskDomain(e.target.value)}
                    style={{ ...inputStyle, width: "100%", cursor: "pointer" }}
                  >
                    <option value="" style={{ background: "#0f0a2e" }}>— Select Domain —</option>
                    {domains.map((d) => (
                      <option key={d} value={d} style={{ background: "#0f0a2e" }}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "6px" }}>
                    {t("admin_risk_level")}
                  </label>
                  <select
                    value={selectedRiskLevel}
                    onChange={(e) => setSelectedRiskLevel(e.target.value)}
                    style={{ ...inputStyle, width: "100%", cursor: "pointer" }}
                  >
                    <option value="Low" style={{ background: "#0f0a2e" }}>{t("admin_risk_low")}</option>
                    <option value="Medium" style={{ background: "#0f0a2e" }}>{t("admin_risk_medium")}</option>
                    <option value="High" style={{ background: "#0f0a2e" }}>{t("admin_risk_high")}</option>
                  </select>
                </div>
              </div>
              <button
                onClick={saveRisk}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #dc2626, #7c3aed)", color: "white", fontWeight: 600, fontSize: "0.875rem" }}
              >
                <Save size={16} />
                {t("admin_save_risk")}
              </button>
            </div>

            {/* Current Risk List */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h3 style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                {t("admin_risk_list")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(automationRisk).map(([domain, risk]) => (
                  <div
                    key={domain}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${getRiskColor(risk)}25`,
                    }}
                  >
                    <span style={{ color: "white", fontSize: "0.875rem" }}>{domain}</span>
                    <span
                      className="px-3 py-1 rounded-lg"
                      style={{
                        background: `${getRiskColor(risk)}15`,
                        color: getRiskColor(risk),
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      {risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ASSESSMENTS */}
        {activeSection === "assessments" && (
          <AdminAssessmentSection showToast={showToast} />
        )}

        {/* COURSES */}
        {activeSection === "courses_admin" && (
          <AdminCoursesSection showToast={showToast} />
        )}

        {/* CERTIFICATES */}
        {activeSection === "certificates_admin" && (
          <AdminCertificatesSection showToast={showToast} />
        )}

        {/* LIVE CLASSES */}
        {activeSection === "live_classes_admin" && (
          <div className="space-y-6">
            <AdminSectionHeader icon={Video} title="Live Interactive Classes" color="#4ade80" />
            <AdminLiveClassesSection showToast={showToast} />
          </div>
        )}
      </main>
    </div>
  );
}

function AdminSectionHeader({
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
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
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