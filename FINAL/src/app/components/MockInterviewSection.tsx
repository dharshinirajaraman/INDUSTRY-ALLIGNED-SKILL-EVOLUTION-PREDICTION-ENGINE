import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Mic,
  ChevronRight,
  RotateCcw,
  Trophy,
  MessageSquare,
  Brain,
  Zap,
  Volume2,
  VolumeX,
  Clock,
  SkipForward,
  Square,
  History,
  Timer,
} from "lucide-react";
import {
  InterviewResult,
  getInterviewQuestions,
  getJobRoles,
  saveInterviewResult,
  getUserInterviewResults,
} from "../utils/storage";

interface Props {
  userEmail: string;
}

type Phase = "setup" | "interview" | "result";

const SUGGESTIONS_POOL = [
  "Reduce filler words like 'um', 'uh', and 'like'.",
  "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
  "Speak at a measured pace — not too fast, not too slow.",
  "Elaborate more on technical concepts with real-world examples.",
  "Start your answers with a clear, concise point, then expand.",
  "Show enthusiasm and passion for the role.",
  "Quantify your achievements when possible (e.g., 'improved performance by 30%').",
  "Ask thoughtful questions at the end of the interview.",
  "Improve your answer structure with a clear beginning, middle, and end.",
  "Practice active listening and address each part of the question.",
];

function generateScores(answeredCount: number, total: number) {
  const completionRatio = answeredCount / total;
  const base = 55 + Math.round(completionRatio * 25);
  const variance = () => Math.floor(Math.random() * 16) - 7;
  const clamp = (v: number) => Math.min(98, Math.max(40, v));
  const comm = clamp(base + variance());
  const conf = clamp(base + variance());
  const tech = clamp(base + variance());
  const overall = Math.round((comm + conf + tech) / 3);
  const shuffled = [...SUGGESTIONS_POOL].sort(() => Math.random() - 0.5);
  const numSuggestions = overall >= 80 ? 2 : overall >= 65 ? 3 : 4;
  return { comm, conf, tech, overall, suggestions: shuffled.slice(0, numSuggestions) };
}

export function MockInterviewSection({ userEmail }: Props) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("setup");
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [qTimer, setQTimer] = useState(90);
  const [isReading, setIsReading] = useState(false);
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [history, setHistory] = useState<InterviewResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roles = getJobRoles();

  useEffect(() => {
    setTtsSupported("speechSynthesis" in window);
    setHistory(getUserInterviewResults(userEmail));
    return () => {
      stopTimer();
      window.speechSynthesis?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  const startQuestionTimer = useCallback(() => {
    stopTimer();
    setQTimer(90);
    timerRef.current = setInterval(() => {
      setQTimer((prev) => {
        if (prev <= 1) { stopTimer(); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const readQuestion = useCallback((text: string) => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9; utter.pitch = 1; utter.lang = "en-US";
    utter.onstart = () => { setIsReading(true); setTtsActive(true); };
    utter.onend   = () => { setIsReading(false); setTtsActive(false); };
    utter.onerror = () => { setIsReading(false); setTtsActive(false); };
    window.speechSynthesis.speak(utter);
  }, [ttsSupported]);

  const startInterview = () => {
    if (!jobRole) return;
    const qs = getInterviewQuestions(jobRole);
    setQuestions(qs);
    setCurrentIdx(0);
    setAnsweredCount(0);
    setIsRecording(false);
    setPhase("interview");
    setTimeout(() => {
      readQuestion(`Question 1: ${qs[0]}`);
      startQuestionTimer();
    }, 300);
  };

  const goNextQuestion = () => {
    if (isRecording) setIsRecording(false);
    window.speechSynthesis?.cancel();
    stopTimer();
    if (currentIdx < questions.length - 1) {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      setAnsweredCount((c) => Math.max(c, next));
      setTimeout(() => {
        readQuestion(`Question ${next + 1}: ${questions[next]}`);
        startQuestionTimer();
      }, 300);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    stopTimer();
    window.speechSynthesis?.cancel();
    setIsRecording(false);
    const ans = Math.max(answeredCount, isRecording ? currentIdx + 1 : currentIdx);
    const scores = generateScores(ans + 1, questions.length);
    const newResult: InterviewResult = {
      id: Date.now(),
      userEmail,
      jobRole,
      communicationScore: scores.comm,
      confidenceScore: scores.conf,
      technicalScore: scores.tech,
      overallScore: scores.overall,
      date: new Date().toLocaleDateString(),
      suggestions: scores.suggestions,
    };
    saveInterviewResult(newResult);
    setResult(newResult);
    setHistory(getUserInterviewResults(userEmail));
    setPhase("result");
  };

  const resetToSetup = () => {
    stopTimer();
    window.speechSynthesis?.cancel();
    setPhase("setup");
    setResult(null);
    setIsRecording(false);
  };

  const scoreBar = (value: number, color: string) => (
    <div className="w-full rounded-full overflow-hidden" style={{ height: "10px", background: "rgba(255,255,255,0.08)" }}>
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}bb)`, boxShadow: `0 0 8px ${color}60` }}
      />
    </div>
  );

  // ══════════════════════════════
  // SETUP PHASE
  // ══════════════════════════════
  if (phase === "setup") {
    return (
      <div className="space-y-6">
        <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.2)" }}>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
              <Mic size={36} className="text-white" />
            </div>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              {t("interview_title")}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
              {t("interview_subtitle")}
            </p>
          </div>

          {/* Feature chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Brain,   label: "15 AI Questions", color: "#a78bfa" },
              { icon: Volume2, label: "Text-to-Speech",  color: "#22d3ee" },
              { icon: Timer,   label: "90s Per Question", color: "#4ade80" },
              { icon: Zap,     label: "AI Scoring",       color: "#fb923c" },
            ].map((f) => (
              <div key={f.label} className="p-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <f.icon size={18} style={{ color: f.color, margin: "0 auto 5px" }} />
                <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.72rem" }}>{f.label}</p>
              </div>
            ))}
          </div>

          {/* Role selection */}
          <div className="mb-5">
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", marginBottom: "8px" }}>
              {t("interview_select_role")}
            </label>
            <select
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                color: jobRole ? "white" : "rgba(255,255,255,0.4)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.9rem", outline: "none",
              }}
            >
              <option value="" style={{ background: "#0f0a2e" }}>— {t("interview_select_role")} —</option>
              {roles.map((r) => (
                <option key={r} value={r} style={{ background: "#0f0a2e" }}>{r}</option>
              ))}
            </select>
          </div>

          {!ttsSupported && (
            <div className="p-3 rounded-xl mb-4"
              style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <p style={{ color: "#fb923c", fontSize: "0.82rem" }}>{t("interview_tts_unsupported")}</p>
            </div>
          )}

          {/* Start button */}
          <button
            onClick={startInterview}
            disabled={!jobRole}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl transition-all hover:scale-[1.01]"
            style={{
              background: jobRole ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.06)",
              color: jobRole ? "white" : "rgba(255,255,255,0.3)",
              fontWeight: 600, fontSize: "1rem",
              cursor: jobRole ? "pointer" : "not-allowed",
              boxShadow: jobRole ? "0 0 28px rgba(124,58,237,0.38)" : "none",
            }}
          >
            <Mic size={18} />
            {t("interview_start")}
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button className="flex items-center gap-2 mb-4" onClick={() => setShowHistory(!showHistory)}
              style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.9rem" }}>
              <History size={16} className="text-purple-400" />
              {t("interview_history")} ({history.length})
              <ChevronRight size={14} className={`transition-transform ${showHistory ? "rotate-90" : ""}`} />
            </button>
            {showHistory && (
              <div className="space-y-2">
                {[...history].reverse().slice(0, 5).map((r) => {
                  const col = r.overallScore >= 70 ? "#4ade80" : r.overallScore >= 50 ? "#fb923c" : "#f87171";
                  return (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div>
                        <span style={{ color: "white", fontSize: "0.82rem", fontWeight: 600 }}>{r.jobRole}</span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginLeft: "8px" }}>{r.date}</span>
                      </div>
                      <span className="px-3 py-1 rounded-lg"
                        style={{ background: `${col}15`, color: col, fontWeight: 700, fontSize: "0.82rem" }}>
                        {r.overallScore}%
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

  // ══════════════════════════════
  // INTERVIEW PHASE
  // ══════════════════════════════
  if (phase === "interview") {
    const q = questions[currentIdx];
    const isLast = currentIdx === questions.length - 1;
    const timeWarning = qTimer <= 20;

    return (
      <div className="space-y-4">

        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <div className="px-4 py-2 rounded-xl"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
            <span style={{ color: "#a78bfa", fontSize: "0.85rem", fontWeight: 600 }}>
              {t("interview_q_label")} {currentIdx + 1} / {questions.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
              background: timeWarning ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.12)",
              border: `1px solid ${timeWarning ? "rgba(248,113,113,0.35)" : "rgba(34,211,238,0.25)"}`,
            }}>
              <Clock size={14} style={{ color: timeWarning ? "#f87171" : "#22d3ee" }} />
              <span style={{
                color: timeWarning ? "#f87171" : "#22d3ee",
                fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Orbitron', monospace",
              }}>
                {qTimer}s
              </span>
            </div>
            {/* End interview */}
            <button onClick={finishInterview} className="px-3 py-2 rounded-xl transition-all"
              style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171", fontSize: "0.78rem", fontWeight: 600 }}>
              {t("interview_end")}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full rounded-full overflow-hidden" style={{ height: "5px", background: "rgba(255,255,255,0.08)" }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, background: "linear-gradient(90deg, #7c3aed, #06b6d4)" }} />
        </div>

        {/* Question card — full width */}
        <div className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(139,92,246,0.25)" }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={16} className="text-purple-400" />
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
              {t("interview_q_label")} {currentIdx + 1}
            </span>
            {/* Read aloud button */}
            <button
              onClick={() => readQuestion(`Question ${currentIdx + 1}: ${q}`)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: ttsActive ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              title="Read aloud"
            >
              {ttsActive
                ? <VolumeX size={13} className="text-purple-400" />
                : <Volume2 size={13} className="text-purple-400" />}
              <span style={{ color: ttsActive ? "#a78bfa" : "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>
                {ttsActive ? "Stop" : "Read Aloud"}
              </span>
            </button>
          </div>

          {/* Reading aloud indicator */}
          {isReading && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}>
              <Volume2 size={13} style={{ color: "#a78bfa" }} className="animate-pulse" />
              <span style={{ color: "#a78bfa", fontSize: "0.75rem" }}>{t("interview_read_aloud")}</span>
            </div>
          )}

          <p style={{ color: "white", fontWeight: 600, fontSize: "1rem", lineHeight: 1.7 }}>{q}</p>
        </div>

        {/* Recording status + waveform */}
        <div className="p-4 rounded-2xl" style={{
          background: isRecording ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${isRecording ? "rgba(248,113,113,0.25)" : "rgba(255,255,255,0.08)"}`,
        }}>
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? "bg-red-400 animate-pulse" : ""}`}
              style={{ background: isRecording ? undefined : "rgba(255,255,255,0.25)" }} />
            <span style={{
              color: isRecording ? "#f87171" : "rgba(255,255,255,0.5)",
              fontSize: "0.82rem", fontWeight: isRecording ? 600 : 400,
            }}>
              {isRecording ? t("interview_recording") : t("interview_your_turn")}
            </span>
          </div>

          {/* Waveform bars while recording */}
          {isRecording && (
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="rounded-full flex-shrink-0"
                  style={{
                    width: "3px", background: "#f87171",
                    height: `${6 + Math.random() * 22}px`,
                    opacity: 0.6 + Math.random() * 0.4,
                    animation: `pulse ${0.35 + Math.random() * 0.45}s ease-in-out infinite alternate`,
                  }} />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: isRecording ? "rgba(248,113,113,0.18)" : "linear-gradient(135deg, #7c3aed, #06b6d4)",
              border: isRecording ? "1px solid rgba(248,113,113,0.4)" : "none",
              color: "white", fontWeight: 600, fontSize: "0.9rem",
              boxShadow: !isRecording ? "0 0 20px rgba(124,58,237,0.3)" : "none",
            }}
          >
            {isRecording
              ? <><Square size={15} /> {t("interview_stop_rec")}</>
              : <><Mic size={15} /> {t("interview_start_rec")}</>}
          </button>
          <button
            onClick={goNextQuestion}
            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl transition-all hover:scale-[1.02]"
            style={{
              background: isLast ? "linear-gradient(135deg, #16a34a, #06b6d4)" : "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white", fontWeight: 600, fontSize: "0.9rem",
            }}
          >
            {isLast
              ? <><Trophy size={15} /> Finish</>
              : <><SkipForward size={15} /> {t("interview_next_q")}</>}
          </button>
        </div>

        {/* Question progress dots */}
        <div className="flex flex-wrap gap-2 justify-center pt-1">
          {questions.map((_, qi) => (
            <div key={qi} className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background:
                  qi < currentIdx   ? "linear-gradient(135deg, #4ade80, #22d3ee)" :
                  qi === currentIdx ? "linear-gradient(135deg, #7c3aed, #06b6d4)" :
                  "rgba(255,255,255,0.06)",
                fontSize: "0.6rem", color: "white", fontWeight: 700,
              }}>
              {qi + 1}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ══════════════════════════════
  // RESULT PHASE
  // ══════════════════════════════
  if (phase === "result" && result) {
    const overall = result.overallScore;
    const scoreColor = overall >= 80 ? "#4ade80" : overall >= 65 ? "#fb923c" : "#f87171";

    return (
      <div className="space-y-6">
        {/* Overall score */}
        <div className="p-8 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${scoreColor}40` }}>
          <Trophy size={48} className="mx-auto mb-4" style={{ color: scoreColor }} />
          <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "white", marginBottom: "0.5rem" }}>
            {t("interview_result_title")}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", marginBottom: "1rem" }}>{result.jobRole}</p>
          <div style={{ fontSize: "5rem", fontWeight: 900, fontFamily: "'Orbitron', sans-serif", color: scoreColor, lineHeight: 1, marginBottom: "0.5rem" }}>
            {overall}%
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>{t("interview_overall")}</p>
        </div>

        {/* Score breakdown */}
        <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", marginBottom: "1.25rem" }}>Score Breakdown</h4>
          <div className="space-y-4">
            {[
              { label: t("interview_communication"), value: result.communicationScore, color: "#a78bfa", icon: MessageSquare },
              { label: t("interview_confidence"),    value: result.confidenceScore,    color: "#22d3ee", icon: Zap },
              { label: t("interview_technical"),     value: result.technicalScore,     color: "#4ade80", icon: Brain },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <s.icon size={14} style={{ color: s.color }} />
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>{s.label}</span>
                  </div>
                  <span style={{ color: s.color, fontWeight: 700, fontSize: "0.9rem" }}>{s.value}%</span>
                </div>
                {scoreBar(s.value, s.color)}
              </div>
            ))}
          </div>
        </div>

        {/* AI suggestions */}
        <div className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(251,146,60,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(251,146,60,0.2)" }}>
              <Zap size={16} className="text-orange-400" />
            </div>
            <h4 style={{ color: "white", fontWeight: 600, fontSize: "0.95rem" }}>{t("interview_suggestions")}</h4>
          </div>
          <div className="space-y-3">
            {result.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.12)" }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(251,146,60,0.2)", fontSize: "0.7rem", color: "#fb923c", fontWeight: 700 }}>
                  {i + 1}
                </div>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", lineHeight: 1.5 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retake */}
        <button
          onClick={resetToSetup}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl transition-all hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white", fontWeight: 600, fontSize: "1rem" }}
        >
          <RotateCcw size={18} />
          {t("interview_retake")}
        </button>
      </div>
    );
  }

  return null;
}
