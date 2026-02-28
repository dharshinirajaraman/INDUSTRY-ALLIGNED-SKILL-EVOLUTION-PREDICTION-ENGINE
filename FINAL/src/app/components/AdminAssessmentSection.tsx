import { useState, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Brain,
  Plus,
  X,
  Lightbulb,
  Filter,
  Users,
  Trophy,
} from "lucide-react";
import {
  Question,
  getQuestions,
  addQuestion,
  removeQuestion,
  getDomains,
  getAssessmentResults,
  AssessmentResult,
} from "../utils/storage";

interface Props {
  showToast: (msg: string) => void;
}

const TYPE_LABELS: Record<string, string> = {
  mcq: "MCQ",
  coding: "Coding",
  case: "Case Study",
};

const DIFF_COLORS: Record<string, string> = {
  easy: "#4ade80",
  medium: "#fb923c",
  hard: "#f87171",
};

export function AdminAssessmentSection({ showToast }: Props) {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>(getQuestions());
  const [domains] = useState<string[]>([...getDomains(), "General"]);
  const [results] = useState<AssessmentResult[]>(getAssessmentResults());
  const [filterDomain, setFilterDomain] = useState("all");
  const [showResults, setShowResults] = useState(false);

  // Form state
  const [form, setForm] = useState({
    text: "",
    type: "mcq" as Question["type"],
    difficulty: "easy" as Question["difficulty"],
    domain: "",
    optionsText: "*Option A (correct)\nOption B\nOption C\nOption D",
    explanation: "",
  });

  const reload = useCallback(() => setQuestions(getQuestions()), []);

  const handleAdd = () => {
    if (!form.text.trim() || !form.domain || !form.optionsText.trim()) {
      showToast("Please fill in all required fields.");
      return;
    }
    const lines = form.optionsText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) { showToast("Add at least 2 options."); return; }

    const correctLine = lines.find((l) => l.startsWith("*"));
    if (!correctLine) { showToast("Mark the correct answer with * prefix."); return; }

    const correctAnswer = correctLine.replace(/^\*\s*/, "");
    const options = lines.map((l) => l.replace(/^\*\s*/, ""));

    const newQ: Question = {
      id: Date.now(),
      text: form.text.trim(),
      type: form.type,
      options,
      correctAnswer,
      difficulty: form.difficulty,
      domain: form.domain,
      explanation: form.explanation.trim() || "No explanation provided.",
    };

    addQuestion(newQ);
    reload();
    setForm({ text: "", type: "mcq", difficulty: "easy", domain: "", optionsText: "*Option A (correct)\nOption B\nOption C\nOption D", explanation: "" });
    showToast("Question added successfully!");
  };

  const handleRemove = (id: number) => {
    removeQuestion(id);
    reload();
    showToast("Question removed.");
  };

  const filtered = filterDomain === "all"
    ? questions
    : questions.filter((q) => q.domain === filterDomain);

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.875rem",
    outline: "none",
  };

  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Questions", value: questions.length, color: "#a78bfa", icon: Brain },
          { label: "Assessments Taken", value: results.length, color: "#22d3ee", icon: Trophy },
          { label: "Avg. Score", value: `${avgScore}%`, color: "#4ade80", icon: Trophy },
          { label: "Domains Covered", value: new Set(questions.map((q) => q.domain)).size, color: "#fb923c", icon: Filter },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div style={{ color: stat.color, fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>
              {stat.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", marginTop: "2px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Add Question Form */}
      <div
        className="p-6 rounded-2xl space-y-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
      >
        <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", marginBottom: "0" }}>
          ➕ {t("admin_add_question")}
        </h3>

        {/* Question Text */}
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
            {t("admin_q_text")} *
          </label>
          <textarea
            placeholder={t("admin_q_text_ph")}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_q_type")} *
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Question["type"] })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="mcq" style={{ background: "#0f0a2e" }}>{t("admin_q_type_mcq")}</option>
              <option value="coding" style={{ background: "#0f0a2e" }}>{t("admin_q_type_coding")}</option>
              <option value="case" style={{ background: "#0f0a2e" }}>{t("admin_q_type_case")}</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_q_difficulty")} *
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as Question["difficulty"] })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="easy" style={{ background: "#0f0a2e" }}>{t("admin_q_easy")}</option>
              <option value="medium" style={{ background: "#0f0a2e" }}>{t("admin_q_medium")}</option>
              <option value="hard" style={{ background: "#0f0a2e" }}>{t("admin_q_hard")}</option>
            </select>
          </div>

          {/* Domain */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_q_domain")} *
            </label>
            <select
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="" style={{ background: "#0f0a2e" }}>— Select Domain —</option>
              {domains.map((d) => (
                <option key={d} value={d} style={{ background: "#0f0a2e" }}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Options */}
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
            {t("admin_q_options")} *
          </label>
          <textarea
            placeholder={t("admin_q_options_ph")}
            value={form.optionsText}
            onChange={(e) => setForm({ ...form, optionsText: e.target.value })}
            rows={5}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, fontFamily: "monospace", fontSize: "0.82rem" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", marginTop: "4px" }}>
            Prefix the correct answer line with * (asterisk)
          </p>
        </div>

        {/* Explanation */}
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
            {t("admin_q_explanation")}
          </label>
          <textarea
            placeholder={t("admin_q_explanation_ph")}
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
            rows={2}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white", fontWeight: 600, fontSize: "0.875rem" }}
        >
          <Plus size={16} />
          {t("admin_add_question")}
        </button>
      </div>

      {/* Question Bank */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 600 }}>
            {t("admin_question_list")} ({filtered.length})
          </h3>
          <div className="relative">
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              style={{
                padding: "6px 30px 6px 10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                color: "white",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.78rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="all" style={{ background: "#0f0a2e" }}>All Domains</option>
              {domains.map((d) => (
                <option key={d} value={d} style={{ background: "#0f0a2e" }}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <Brain size={36} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{t("admin_no_questions")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", fontSize: "0.65rem", fontWeight: 700 }}
                      >
                        {TYPE_LABELS[q.type]}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{ background: `${DIFF_COLORS[q.difficulty]}15`, color: DIFF_COLORS[q.difficulty], fontSize: "0.65rem", fontWeight: 700 }}
                      >
                        {q.difficulty.toUpperCase()}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee", fontSize: "0.65rem", fontWeight: 600 }}
                      >
                        {q.domain}
                      </span>
                    </div>
                    <p style={{ color: "white", fontSize: "0.875rem", fontWeight: 500, marginBottom: "6px" }}>{q.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => (
                        <span
                          key={opt}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            background: opt === q.correctAnswer ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
                            color: opt === q.correctAnswer ? "#4ade80" : "rgba(255,255,255,0.5)",
                            border: `1px solid ${opt === q.correctAnswer ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
                          }}
                        >
                          {opt === q.correctAnswer && "✓ "}
                          {opt}
                        </span>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="flex items-start gap-1.5 mt-2">
                        <Lightbulb size={11} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(q.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-red-500/20"
                    style={{ color: "rgba(248,113,113,0.7)" }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assessment Results */}
      {results.length > 0 && (
        <div
          className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            className="flex items-center gap-2 mb-4"
            onClick={() => setShowResults(!showResults)}
            style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.9rem" }}
          >
            <Users size={16} className="text-cyan-400" />
            {t("admin_assessment_results")} ({results.length})
          </button>
          {showResults && (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["Email", "Domain", "Score", "Percentage", "Time", "Date"].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...results].reverse().slice(0, 20).map((r) => {
                    const col = r.percentage >= 70 ? "#4ade80" : r.percentage >= 50 ? "#fb923c" : "#f87171";
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.7)" }}>{r.userEmail}</td>
                        <td style={{ padding: "10px 12px", color: "#a78bfa" }}>{r.domain}</td>
                        <td style={{ padding: "10px 12px", color: "white", fontWeight: 600 }}>{r.score}/{r.total}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span className="px-2 py-0.5 rounded" style={{ background: `${col}15`, color: col, fontWeight: 700 }}>
                            {r.percentage}%
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)" }}>{Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s</td>
                        <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.45)" }}>{r.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
