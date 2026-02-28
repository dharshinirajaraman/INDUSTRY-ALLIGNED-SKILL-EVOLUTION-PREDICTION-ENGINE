import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Lightbulb,
  History,
} from "lucide-react";
import {
  Question,
  AssessmentResult,
  getQuestionsByDomain,
  saveAssessmentResult,
  getUserAssessmentResults,
} from "../utils/storage";

interface Props {
  userEmail: string;
  userDomain: string;
}

type Phase = "start" | "test" | "result";

const TOTAL_TIME = 30 * 60; // 30 minutes

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AssessmentSection({ userEmail, userDomain }: Props) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setHistory(getUserAssessmentResults(userEmail));
  }, [userEmail]);

  useEffect(() => {
    if (phase === "test") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startAssessment = () => {
    const pool = getQuestionsByDomain(userDomain);
    if (pool.length === 0) {
      setPhase("start");
      return;
    }
    const selected = shuffle(pool).slice(0, Math.min(10, pool.length));
    setQuestions(selected);
    setAnswers({});
    setCurrentIdx(0);
    setTimeLeft(TOTAL_TIME);
    setStartTime(Date.now());
    setShowExplanation(false);
    setPhase("test");
  };

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const percentage = Math.round((score / questions.length) * 100);
    const newResult: AssessmentResult = {
      id: Date.now(),
      userEmail,
      domain: userDomain,
      score,
      total: questions.length,
      percentage,
      date: new Date().toLocaleDateString(),
      timeTaken,
    };
    saveAssessmentResult(newResult);
    setResult(newResult);
    setHistory(getUserAssessmentResults(userEmail));
    setPhase("result");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, answers, userEmail, userDomain, startTime]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const difficultyColor: Record<string, string> = {
    easy: "#4ade80",
    medium: "#fb923c",
    hard: "#f87171",
  };

  const allQsInDomain = getQuestionsByDomain(userDomain);

  if (phase === "start") {
    return (
      <div className="space-y-6">
        {/* Info Card */}
        <div
          className="p-8 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            <Brain size={36} className="text-white" />
          </div>
          <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
            {t("assess_title")}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            {t("assess_subtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-6">
            {[
              { icon: Brain, label: t("assess_domain"), value: userDomain, color: "#a78bfa" },
              { icon: Clock, label: t("assess_time_limit"), value: `30 ${t("assess_minutes")}`, color: "#22d3ee" },
              { icon: AlertCircle, label: t("assess_difficulty"), value: t("assess_mixed"), color: "#fb923c" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <item.icon size={18} style={{ color: item.color, margin: "0 auto 6px" }} />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>{item.label}</p>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem" }}>{item.value}</p>
              </div>
            ))}
          </div>

          {allQsInDomain.length === 0 ? (
            <div
              className="p-4 rounded-xl mb-4"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              <p style={{ color: "#f87171", fontSize: "0.85rem" }}>{t("assess_no_questions")}</p>
            </div>
          ) : (
            <button
              onClick={startAssessment}
              className="flex items-center gap-2 px-8 py-4 rounded-xl mx-auto transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                color: "white",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 0 25px rgba(124,58,237,0.35)",
              }}
            >
              <Brain size={18} />
              {t("assess_start")} ({Math.min(10, allQsInDomain.length)} {t("assess_questions")})
            </button>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div
            className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <button
              className="flex items-center gap-2 mb-4"
              onClick={() => setShowHistory(!showHistory)}
              style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.9rem" }}
            >
              <History size={16} className="text-purple-400" />
              {t("assess_history")} ({history.length})
              <ChevronRight size={14} className={`transition-transform ${showHistory ? "rotate-90" : ""}`} />
            </button>
            {showHistory && (
              <div className="space-y-2">
                {[...history].reverse().slice(0, 5).map((r) => {
                  const pct = r.percentage;
                  const col = pct >= 70 ? "#4ade80" : pct >= 50 ? "#fb923c" : "#f87171";
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div>
                        <span style={{ color: "white", fontSize: "0.82rem", fontWeight: 600 }}>{r.domain}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginLeft: "8px" }}>{r.date}</span>
                      </div>
                      <span
                        className="px-3 py-1 rounded-lg"
                        style={{ background: `${col}15`, color: col, fontWeight: 700, fontSize: "0.82rem" }}
                      >
                        {r.score}/{r.total} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (phase === "test") {
    const q = questions[currentIdx];
    const selected = answers[q.id];
    const timeWarning = timeLeft < 300;

    return (
      <div className="space-y-5">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4">
          <div
            className="px-4 py-2 rounded-xl"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}
          >
            <span style={{ color: "#a78bfa", fontSize: "0.85rem", fontWeight: 600 }}>
              {t("assess_question")} {currentIdx + 1} {t("assess_of")} {questions.length}
            </span>
          </div>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{
              background: timeWarning ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.12)",
              border: `1px solid ${timeWarning ? "rgba(248,113,113,0.35)" : "rgba(34,211,238,0.25)"}`,
            }}
          >
            <Clock size={15} style={{ color: timeWarning ? "#f87171" : "#22d3ee" }} />
            <span
              style={{
                color: timeWarning ? "#f87171" : "#22d3ee",
                fontWeight: 700,
                fontSize: "0.9rem",
                fontFamily: "'Orbitron', monospace",
              }}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full overflow-hidden" style={{ height: "6px", background: "rgba(255,255,255,0.08)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${((currentIdx + 1) / questions.length) * 100}%`,
              background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
            }}
          />
        </div>

        {/* Question Card */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="flex items-start gap-3 mb-5">
            <span
              className="px-2 py-0.5 rounded-lg flex-shrink-0"
              style={{
                background: `${difficultyColor[q.difficulty]}20`,
                color: difficultyColor[q.difficulty],
                fontSize: "0.7rem",
                fontWeight: 700,
                marginTop: "2px",
              }}
            >
              {q.difficulty.toUpperCase()}
            </span>
            <p style={{ color: "white", fontWeight: 600, fontSize: "1rem", lineHeight: 1.6 }}>
              {q.text}
            </p>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, oi) => {
              const isSelected = selected === opt;
              return (
                <button
                  key={oi}
                  onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                  className="w-full text-left p-4 rounded-xl transition-all"
                  style={{
                    background: isSelected
                      ? "rgba(139,92,246,0.2)"
                      : "rgba(255,255,255,0.03)",
                    border: isSelected
                      ? "1px solid rgba(139,92,246,0.5)"
                      : "1px solid rgba(255,255,255,0.07)",
                    color: isSelected ? "#a78bfa" : "rgba(255,255,255,0.8)",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: isSelected ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)",
                        border: `2px solid ${isSelected ? "#a78bfa" : "rgba(255,255,255,0.15)"}`,
                      }}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#a78bfa" }} />}
                    </div>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setShowExplanation(false); }}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: currentIdx === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
              cursor: currentIdx === 0 ? "not-allowed" : "pointer",
            }}
          >
            <ChevronLeft size={16} />
            {t("assess_prev")}
          </button>

          <div className="flex gap-1">
            {questions.map((_, qi) => (
              <button
                key={qi}
                onClick={() => { setCurrentIdx(qi); setShowExplanation(false); }}
                className="w-7 h-7 rounded-lg transition-all"
                style={{
                  background:
                    qi === currentIdx
                      ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                      : answers[questions[qi].id]
                      ? "rgba(74,222,128,0.2)"
                      : "rgba(255,255,255,0.06)",
                  border: `1px solid ${qi === currentIdx ? "rgba(139,92,246,0.5)" : answers[questions[qi].id] ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.08)"}`,
                  color: "white",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {qi + 1}
              </button>
            ))}
          </div>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => { setCurrentIdx(currentIdx + 1); setShowExplanation(false); }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                color: "white",
                fontWeight: 600,
              }}
            >
              {t("assess_next")}
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-3 rounded-xl transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #16a34a, #06b6d4)",
                color: "white",
                fontWeight: 600,
              }}
            >
              <CheckCircle size={16} />
              {t("assess_submit")}
            </button>
          )}
        </div>

        {/* Answered count */}
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
          {Object.keys(answers).length} / {questions.length} answered
        </p>
      </div>
    );
  }

  // Result phase
  if (phase === "result" && result) {
    const pct = result.percentage;
    const scoreColor = pct >= 80 ? "#4ade80" : pct >= 60 ? "#fb923c" : pct >= 40 ? "#fbbf24" : "#f87171";
    const feedbackKey =
      pct >= 80 ? "assess_feedback_excellent"
      : pct >= 60 ? "assess_feedback_good"
      : pct >= 40 ? "assess_feedback_fair"
      : "assess_feedback_poor";
    const timeMins = Math.floor(result.timeTaken / 60);
    const timeSecs = result.timeTaken % 60;

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <div
          className="p-8 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${scoreColor}40` }}
        >
          <Trophy size={48} className="mx-auto mb-4" style={{ color: scoreColor }} />
          <h3
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "white",
              marginBottom: "0.5rem",
            }}
          >
            {t("assess_result_title")}
          </h3>

          <div
            style={{
              fontSize: "5rem",
              fontWeight: 900,
              fontFamily: "'Orbitron', sans-serif",
              color: scoreColor,
              lineHeight: 1,
              margin: "1rem 0",
            }}
          >
            {pct}%
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs mx-auto rounded-full overflow-hidden mb-4" style={{ height: "12px", background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}80)`,
                boxShadow: `0 0 12px ${scoreColor}60`,
              }}
            />
          </div>

          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", maxWidth: "400px", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>
            {t(feedbackKey)}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {[
              { label: t("assess_correct"), value: `${result.score}`, color: "#4ade80" },
              { label: t("assess_total"), value: `${result.total}`, color: "#22d3ee" },
              { label: t("assess_time_taken"), value: `${timeMins}m ${timeSecs}s`, color: "#a78bfa" },
            ].map((item) => (
              <div
                key={item.label}
                className="px-5 py-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div style={{ color: item.color, fontSize: "1.5rem", fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>
                  {item.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", marginTop: "2px" }}>{item.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setPhase("start"); setResult(null); }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl mx-auto transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              color: "white",
              fontWeight: 600,
            }}
          >
            <RotateCcw size={16} />
            {t("assess_retake")}
          </button>
        </div>

        {/* Detailed Review */}
        <div
          className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", marginBottom: "1rem" }}>
            Detailed Review
          </h4>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl"
                  style={{
                    background: isCorrect ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)",
                    border: `1px solid ${isCorrect ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle size={16} className="text-red-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p style={{ color: "white", fontWeight: 500, fontSize: "0.875rem", marginBottom: "6px" }}>
                        Q{qi + 1}. {q.text}
                      </p>
                      {!isCorrect && userAns && (
                        <p style={{ color: "#f87171", fontSize: "0.78rem" }}>
                          Your answer: <span style={{ fontWeight: 600 }}>{userAns}</span>
                        </p>
                      )}
                      <p style={{ color: "#4ade80", fontSize: "0.78rem" }}>
                        Correct: <span style={{ fontWeight: 600 }}>{q.correctAnswer}</span>
                      </p>
                      <div
                        className="flex items-start gap-2 mt-2 p-2 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                      >
                        <Lightbulb size={12} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", lineHeight: 1.5 }}>
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
