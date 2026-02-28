import { useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Navbar } from "../components/Navbar";
import {
  Brain,
  Target,
  TrendingUp,
  Map,
  BarChart2,
  AlertTriangle,
  Activity,
  Building2,
  CheckCircle,
  XCircle,
  User,
  Shield,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const featureIcons = [Brain, Target, TrendingUp, Map, BarChart2, AlertTriangle, Activity, Building2];

const featureKeys = [
  { title: "f1_title", desc: "f1_desc" },
  { title: "f2_title", desc: "f2_desc" },
  { title: "f3_title", desc: "f3_desc" },
  { title: "f4_title", desc: "f4_desc" },
  { title: "f5_title", desc: "f5_desc" },
  { title: "f6_title", desc: "f6_desc" },
  { title: "f7_title", desc: "f7_desc" },
  { title: "f8_title", desc: "f8_desc" },
];

const featureColors = [
  "from-purple-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-green-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-red-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-sky-500 to-cyan-500",
];

export function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const scrollToPanel = () => {
    document.getElementById("login-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: "linear-gradient(135deg, #0a0a1a 0%, #0f0a2e 30%, #0a1a2e 60%, #0a0a1a 100%)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar />

      {/* Animated BG blobs */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "15%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "40%",
          right: "10%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "20%",
          left: "5%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative pt-32 pb-20 px-6 text-center"
        style={{ zIndex: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(139, 92, 246, 0.15)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
            }}
          >
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-purple-300 text-sm">AI-Powered Career Evolution Platform</span>
          </div>

          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 40%, #22d3ee 80%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
              marginBottom: "0.5rem",
            }}
          >
            {t("hero_title")}
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.4rem)",
              background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1.5rem",
              fontWeight: 600,
            }}
          >
            {t("hero_subtitle")}
          </p>

          <p
            className="mx-auto mb-10"
            style={{
              maxWidth: "700px",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              fontSize: "1rem",
            }}
          >
            {t("hero_desc")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={scrollToPanel}
              className="flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 0 30px rgba(124,58,237,0.4)",
              }}
            >
              {t("hero_cta")}
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-8 py-4 rounded-xl transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {t("hero_learn_more")}
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { num: "8+", label: "AI Features" },
              { num: "4", label: "Languages" },
              { num: "100%", label: "Free to Use" },
              { num: "∞", label: "Skill Tracking" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    fontFamily: "'Orbitron', sans-serif",
                    background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.num}
                </div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.75rem",
              }}
            >
              {t("features_heading")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", maxWidth: "600px", margin: "0 auto" }}>
              {t("features_subheading")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureKeys.map((fk, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl transition-all hover:-translate-y-1 cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(139,92,246,0.4)";
                    e.currentTarget.style.background = "rgba(139,92,246,0.07)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${featureColors[i]}`}
                    style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3
                    className="mb-2"
                    style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}
                  >
                    {t(fk.title)}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", lineHeight: 1.6 }}>
                    {t(fk.desc)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section id="why-us" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.75rem",
              }}
            >
              {t("why_heading")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)" }}>{t("why_subheading")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Traditional */}
            <div
              className="p-8 rounded-2xl"
              style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.2)" }}
                >
                  <XCircle size={20} className="text-red-400" />
                </div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>
                  {t("traditional_title")}
                </h3>
              </div>
              <ul className="space-y-4">
                {["t1", "t2", "t3", "t4"].map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <XCircle size={16} className="text-red-400 mt-1 flex-shrink-0" />
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem" }}>
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Platform */}
            <div
              className="p-8 rounded-2xl"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.25)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                >
                  <Sparkles size={20} className="text-white" />
                </div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}>
                  {t("our_title")}
                </h3>
              </div>
              <ul className="space-y-4">
                {["o1", "o2", "o3", "o4"].map((key) => (
                  <li key={key} className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
                      {t(key)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN PANEL SECTION */}
      <section id="login-panel" className="py-20 px-6 relative" style={{ zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.75rem",
              }}
            >
              {t("panel_heading")}
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)" }}>{t("panel_subheading")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Panel */}
            <div
              className="p-8 rounded-3xl flex flex-col items-center text-center transition-all hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
                border: "1px solid rgba(139,92,246,0.3)",
                boxShadow: "0 0 40px rgba(124,58,237,0.1)",
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              >
                <User size={36} className="text-white" />
              </div>
              <h3
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "0.75rem",
                }}
              >
                {t("user_panel_title")}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2rem",
                  lineHeight: 1.7,
                  fontSize: "0.9rem",
                }}
              >
                {t("user_panel_desc")}
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 mb-3"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 0 25px rgba(124,58,237,0.35)",
                }}
              >
                {t("user_login_btn")}
                <ArrowRight size={18} />
              </button>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
                {t("new_user")}{" "}
                <button
                  onClick={() => navigate("/signup")}
                  style={{ color: "#a78bfa", fontWeight: 600 }}
                  className="hover:underline"
                >
                  {t("signup_here")}
                </button>
              </p>
            </div>

            {/* Admin Panel */}
            <div
              className="p-8 rounded-3xl flex flex-col items-center text-center transition-all hover:-translate-y-1"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(99,102,241,0.12))",
                border: "1px solid rgba(6,182,212,0.25)",
                boxShadow: "0 0 40px rgba(6,182,212,0.08)",
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: "linear-gradient(135deg, #0891b2, #6366f1)" }}
              >
                <Shield size={36} className="text-white" />
              </div>
              <h3
                style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "white",
                  marginBottom: "0.75rem",
                }}
              >
                {t("admin_panel_title")}
              </h3>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "2rem",
                  lineHeight: 1.7,
                  fontSize: "0.9rem",
                }}
              >
                {t("admin_panel_desc")}
              </p>
              <button
                onClick={() => navigate("/admin-login")}
                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #0891b2, #6366f1)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 0 25px rgba(6,182,212,0.25)",
                }}
              >
                {t("admin_login_btn")}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-10 px-6 text-center relative"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "0.5rem",
          }}
        >
          SkillSync AI
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>
          {t("footer_tagline")}
        </p>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
          © 2025 SkillSync AI. {t("footer_rights")}
        </p>
      </footer>
    </div>
  );
}
