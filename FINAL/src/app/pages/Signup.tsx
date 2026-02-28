import { useState } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Navbar } from "../components/Navbar";
import { addUser, getUsers, getDomains } from "../utils/storage";
import { User, Eye, EyeOff, Zap, CheckCircle, ArrowLeft } from "lucide-react";

const YEAR_KEYS = ["year_1", "year_2", "year_3", "year_4", "year_pg"];

export function Signup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const domains = getDomains();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    domain: "",
    year: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirm || !form.domain || !form.year) {
      setError(t("err_fill_all"));
      return;
    }
    if (form.password.length < 6) {
      setError(t("err_min_password"));
      return;
    }
    if (form.password !== form.confirm) {
      setError(t("err_password_match"));
      return;
    }
    const users = getUsers();
    if (users.find((u) => u.email === form.email)) {
      setError(t("err_email_exists"));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      addUser({
        id: Date.now(),
        name: form.name,
        email: form.email,
        password: form.password,
        domain: form.domain,
        year: form.year,
        skills: [],
        alignmentScore: 0,
      });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }, 800);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.7)",
    fontSize: "0.85rem",
    marginBottom: "6px",
    fontFamily: "'Space Grotesk', sans-serif",
  };

  return (
    <div
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        background: "linear-gradient(135deg, #0a0a1a 0%, #0f0a2e 50%, #0a1a2e 100%)",
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
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-6" style={{ zIndex: 1, position: "relative" }}>
        <div
          className="w-full max-w-lg p-8 rounded-3xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(139,92,246,0.25)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 60px rgba(124,58,237,0.1)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
            >
              <User size={30} className="text-white" />
            </div>
            <h1
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "0.4rem",
              }}
            >
              {t("signup_title")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("signup_subtitle")}
            </p>
          </div>

          {success ? (
            <div
              className="flex flex-col items-center gap-4 py-8"
              style={{ textAlign: "center" }}
            >
              <CheckCircle size={60} className="text-green-400" />
              <p style={{ color: "#4ade80", fontWeight: 600, fontSize: "1rem" }}>
                {t("signup_success")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label style={labelStyle}>{t("signup_name")}</label>
                <input
                  type="text"
                  placeholder={t("signup_name_ph")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>{t("signup_email")}</label>
                <input
                  type="email"
                  placeholder={t("signup_email_ph")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>{t("signup_password")}</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={t("signup_password_ph")}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
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

              {/* Confirm Password */}
              <div>
                <label style={labelStyle}>{t("signup_confirm_password")}</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder={t("signup_confirm_ph")}
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Domain */}
              <div>
                <label style={labelStyle}>{t("signup_domain")}</label>
                <select
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  <option value="" style={{ background: "#0f0a2e" }}>
                    {t("signup_domain")}
                  </option>
                  {domains.map((d) => (
                    <option key={d} value={d} style={{ background: "#0f0a2e" }}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label style={labelStyle}>{t("signup_year")}</label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.6)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
                >
                  <option value="" style={{ background: "#0f0a2e" }}>
                    {t("signup_year")}
                  </option>
                  {YEAR_KEYS.map((yk) => (
                    <option key={yk} value={t(yk)} style={{ background: "#0f0a2e" }}>
                      {t(yk)}
                    </option>
                  ))}
                </select>
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
                className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 mt-2"
                style={{
                  background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 0 25px rgba(124,58,237,0.35)",
                }}
              >
                {loading ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <Zap size={18} />
                    {t("signup_btn")}
                  </>
                )}
              </button>

              <p className="text-center" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                {t("signup_have_account")}{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{ color: "#a78bfa", fontWeight: 600 }}
                  className="hover:underline"
                >
                  {t("signup_login")}
                </button>
              </p>
            </form>
          )}

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
