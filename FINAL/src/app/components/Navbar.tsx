import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Language } from "../translations";
import { Globe, ChevronDown, Zap } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <nav
      style={{
        background: "rgba(10, 10, 30, 0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(139, 92, 246, 0.2)",
      }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <div
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              padding: "6px",
              borderRadius: "8px",
            }}
          >
            <Zap size={18} className="text-white" />
          </div>
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              background: "linear-gradient(135deg, #a78bfa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "1.1rem",
              fontWeight: 700,
            }}
          >
            SkillSync AI
          </span>
        </button>

        {/* Nav links + Language */}
        <div className="flex items-center gap-6">
          {location.pathname === "/" && (
            <button
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white transition-colors text-sm"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("nav_home")}
            </button>
          )}

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
              style={{
                background: "rgba(139, 92, 246, 0.15)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                color: "white",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.875rem",
              }}
            >
              <Globe size={14} className="text-purple-400" />
              <span>{currentLang?.native}</span>
              <ChevronDown
                size={12}
                className={`text-purple-400 transition-transform ${langOpen ? "rotate-180" : ""}`}
              />
            </button>

            {langOpen && (
              <div
                className="absolute right-0 mt-2 rounded-xl overflow-hidden z-50 min-w-[160px]"
                style={{
                  background: "rgba(15, 10, 40, 0.98)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                    style={{
                      background:
                        language === lang.code
                          ? "rgba(139, 92, 246, 0.2)"
                          : "transparent",
                      color:
                        language === lang.code ? "#a78bfa" : "rgba(255,255,255,0.8)",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                    onMouseEnter={(e) => {
                      if (language !== lang.code) {
                        e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (language !== lang.code) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span className="text-base">{lang.native}</span>
                    <span className="text-xs opacity-60">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
