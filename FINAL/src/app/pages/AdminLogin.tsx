import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Navbar } from "../components/Navbar";
import { setAdminLoggedIn } from "../utils/storage";
import { Shield, Eye, EyeOff, ArrowLeft, Lock } from "lucide-react";

const ADMIN_EMAIL = "admin@skillsync.com";
const ADMIN_PASSWORD = "admin123";

export function AdminLogin() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(t("err_fill_all"));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setAdminLoggedIn();
        navigate("/admin");
      } else {
        setError(t("err_invalid_admin"));
      }
      setLoading(false);
    }, 700);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: "linear-gradient(135deg, #0a0a1a 0%, #081a2e 50%, #0a1020 100%)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar />
      <div
        style={{
          position: "fixed",
          top: "20%",
          right: "15%",
          width: "350px",
          height: "350px",
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-6" style={{ zIndex: 1, position: "relative" }}>
        <div
          className="w-full max-w-md p-8 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(6,182,212,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(6,182,212,0.1)",
          }}
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #0891b2, #6366f1)" }}
            >
              <Shield size={30} className="text-white" />
            </div>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.4rem",
              }}
            >
              {t("admin_login_title")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("admin_login_subtitle")}
            </p>

            {/* Credentials hint */}
            <div
              className="mt-4 px-4 py-3 rounded-xl"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
            >
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>
                <Lock size={11} className="inline mr-1" />
                Demo: admin@skillsync.com / admin123
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                }}
              >
                {t("admin_login_email")}
              </label>
              <input
                type="email"
                placeholder={t("admin_login_email_ph")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.6)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "0.85rem",
                  marginBottom: "6px",
                }}
              >
                {t("admin_login_password")}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={t("admin_login_password_ph")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"
              style={{
                background: loading ? "rgba(8,145,178,0.5)" : "linear-gradient(135deg, #0891b2, #6366f1)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 0 25px rgba(6,182,212,0.3)",
              }}
            >
              {loading ? "Logging in..." : (
                <>
                  <Shield size={18} />
                  {t("admin_login_btn")}
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mt-6 mx-auto"
            style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem" }}
          >
            <ArrowLeft size={14} />
            {t("back_to_home")}
          </button>
        </div>
      </div>
    </div>
  );
}
