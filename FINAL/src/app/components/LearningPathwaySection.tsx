import { useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { BookOpen, Clock, Star, Rocket, Target, CheckCircle2 } from "lucide-react";
import { Course } from "../utils/storage";

interface Props {
  domain: string;
  roadmap: string[];
  courses: Course[];
  userSkills: string[];
}

const PHASE_CONFIG = [
  {
    key: "pathway_phase_beginner",
    label: "Beginner",
    emoji: "🌱",
    weeks: "4 – 6",
    gradient: "linear-gradient(135deg, #16a34a, #059669)",
    border: "rgba(74,222,128,0.3)",
    bg: "rgba(74,222,128,0.06)",
    iconBg: "rgba(74,222,128,0.15)",
    textColor: "#4ade80",
    Icon: BookOpen,
  },
  {
    key: "pathway_phase_intermediate",
    label: "Intermediate",
    emoji: "⚡",
    weeks: "8 – 12",
    gradient: "linear-gradient(135deg, #7c3aed, #06b6d4)",
    border: "rgba(139,92,246,0.3)",
    bg: "rgba(139,92,246,0.06)",
    iconBg: "rgba(139,92,246,0.15)",
    textColor: "#a78bfa",
    Icon: Target,
  },
  {
    key: "pathway_phase_advanced",
    label: "Advanced",
    emoji: "🚀",
    weeks: "12 – 20",
    gradient: "linear-gradient(135deg, #0891b2, #7c3aed)",
    border: "rgba(6,182,212,0.3)",
    bg: "rgba(6,182,212,0.06)",
    iconBg: "rgba(6,182,212,0.15)",
    textColor: "#22d3ee",
    Icon: Rocket,
  },
];

const DIFFICULTY_ORDER: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export function LearningPathwaySection({ domain, roadmap, courses, userSkills }: Props) {
  const { t } = useLanguage();

  const phases = useMemo(() => {
    if (roadmap.length === 0) return [];
    const third = Math.ceil(roadmap.length / 3);
    return [
      roadmap.slice(0, third),
      roadmap.slice(third, third * 2),
      roadmap.slice(third * 2),
    ];
  }, [roadmap]);

  const domainCourses = useMemo(
    () =>
      courses
        .filter((c) => c.domain === domain)
        .sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]),
    [courses, domain]
  );

  const getCoursesByDifficulty = (difficulty: string) =>
    domainCourses.filter((c) => c.difficulty === difficulty);

  if (roadmap.length === 0) {
    return (
      <div
        className="p-10 rounded-2xl text-center"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <BookOpen size={44} className="mx-auto mb-3 opacity-30" />
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>{t("pathway_no_roadmap")}</p>
      </div>
    );
  }

  const skillSet = new Set(userSkills.map((s) => s.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
          border: "1px solid rgba(139,92,246,0.25)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem", marginBottom: "4px" }}>
              {t("pathway_subtitle")}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem" }}>
              Domain: <span style={{ color: "#a78bfa", fontWeight: 600 }}>{domain}</span> •{" "}
              {roadmap.length} steps total
            </p>
          </div>
          <div className="flex gap-4">
            {PHASE_CONFIG.map((p) => (
              <div key={p.key} className="text-center">
                <div style={{ fontSize: "1.4rem" }}>{p.emoji}</div>
                <div style={{ color: p.textColor, fontSize: "0.7rem", fontWeight: 600, marginTop: "2px" }}>
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-0.5 hidden md:block"
          style={{ background: "linear-gradient(180deg, #4ade80, #a78bfa, #22d3ee)" }}
        />

        <div className="space-y-6">
          {PHASE_CONFIG.map((phase, phaseIdx) => {
            const phaseSteps = phases[phaseIdx] || [];
            const phaseCourseDiff = ["Beginner", "Intermediate", "Advanced"][phaseIdx];
            const phaseCourses = getCoursesByDifficulty(phaseCourseDiff);

            return (
              <div key={phase.key} className="md:pl-16 relative">
                {/* Circle on timeline */}
                <div
                  className="absolute left-3 top-6 w-6 h-6 rounded-full items-center justify-center hidden md:flex"
                  style={{ background: phase.gradient, zIndex: 1, border: "3px solid #0a0a1a" }}
                >
                  <phase.Icon size={12} className="text-white" />
                </div>

                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: phase.bg, border: `1px solid ${phase.border}` }}
                >
                  {/* Phase Header */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{ background: `${phase.bg}`, borderBottom: `1px solid ${phase.border}` }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: phase.gradient }}
                      >
                        {phase.emoji}
                      </div>
                      <div>
                        <h3 style={{ color: phase.textColor, fontWeight: 700, fontSize: "1rem" }}>
                          {t(phase.key)}
                        </h3>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                          Phase {phaseIdx + 1}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: phase.iconBg }}>
                      <Clock size={13} style={{ color: phase.textColor }} />
                      <span style={{ color: phase.textColor, fontSize: "0.78rem", fontWeight: 600 }}>
                        {phase.weeks} {t("pathway_weeks")}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Steps */}
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {t("pathway_milestone")}s
                      </p>
                      <div className="space-y-2">
                        {phaseSteps.map((step, si) => {
                          const words = step.toLowerCase().split(/[\s,&/]+/);
                          const isCompleted = words.some((w) => skillSet.has(w) && w.length > 2);
                          return (
                            <div
                              key={si}
                              className="flex items-start gap-3 p-3 rounded-xl"
                              style={{
                                background: isCompleted
                                  ? `${phase.textColor}12`
                                  : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isCompleted ? phase.textColor + "30" : "rgba(255,255,255,0.05)"}`,
                              }}
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{
                                  background: isCompleted ? phase.gradient : "rgba(255,255,255,0.08)",
                                }}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 size={13} className="text-white" />
                                ) : (
                                  <span style={{ color: phase.textColor, fontSize: "0.65rem", fontWeight: 700 }}>
                                    {si + 1}
                                  </span>
                                )}
                              </div>
                              <span
                                style={{
                                  color: isCompleted ? phase.textColor : "rgba(255,255,255,0.75)",
                                  fontSize: "0.875rem",
                                  textDecoration: isCompleted ? "line-through" : "none",
                                  opacity: isCompleted ? 0.8 : 1,
                                }}
                              >
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recommended Courses */}
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {t("pathway_courses")}
                      </p>
                      {phaseCourses.length === 0 ? (
                        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem" }}>
                          No courses available for this phase yet.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {phaseCourses.slice(0, 3).map((course) => (
                            <div
                              key={course.id}
                              className="p-3 rounded-xl"
                              style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                              }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p style={{ color: "white", fontWeight: 600, fontSize: "0.82rem" }}>
                                    {course.title}
                                  </p>
                                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", marginTop: "2px" }}>
                                    ⏱ {course.duration}
                                  </p>
                                </div>
                                <span
                                  className="px-2 py-0.5 rounded-lg flex-shrink-0"
                                  style={{
                                    background: phase.iconBg,
                                    color: phase.textColor,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {course.difficulty}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {course.skillTags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded"
                                    style={{
                                      background: "rgba(255,255,255,0.06)",
                                      color: "rgba(255,255,255,0.5)",
                                      fontSize: "0.65rem",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Overall progress */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Star size={16} className="text-yellow-400" />
          <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>Overall Pathway Progress</span>
        </div>
        {(() => {
          const completed = roadmap.filter((step) => {
            const words = step.toLowerCase().split(/[\s,&/]+/);
            return words.some((w) => skillSet.has(w) && w.length > 2);
          }).length;
          const pct = Math.round((completed / roadmap.length) * 100);
          return (
            <div>
              <div className="flex justify-between mb-2">
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem" }}>
                  {completed} / {roadmap.length} milestones completed
                </span>
                <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: "0.82rem" }}>{pct}%</span>
              </div>
              <div className="w-full rounded-full overflow-hidden" style={{ height: "10px", background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    background: "linear-gradient(90deg, #4ade80, #a78bfa, #22d3ee)",
                    boxShadow: "0 0 12px rgba(167,139,250,0.5)",
                  }}
                />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
