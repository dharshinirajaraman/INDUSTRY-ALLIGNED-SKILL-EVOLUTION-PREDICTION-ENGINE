import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  BookOpen,
  Clock,
  Play,
  CheckCircle,
  X,
  ChevronDown,
  Award,
  Layers,
  Tag,
  Download,
  FileText,
  Film,
  ExternalLink,
} from "lucide-react";
import {
  Course,
  Enrollment,
  Certificate,
  getCourses,
  getDomains,
  getEnrollments,
  enrollCourse,
  updateCourseProgress,
  unenrollCourse,
  getUserCertificates,
  addCertificate,
  hasCertificate,
  getCurrentUser,
  toYouTubeEmbed,
  getVideoFromIDB,
} from "../utils/storage";

interface Props {
  userEmail: string;
  userDomain: string;
  onCertificateEarned?: () => void;
}

type Tab = "all" | "enrolled";

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: "rgba(74,222,128,0.12)", text: "#4ade80", border: "rgba(74,222,128,0.3)" },
  Intermediate: { bg: "rgba(251,146,60,0.12)", text: "#fb923c", border: "rgba(251,146,60,0.3)" },
  Advanced: { bg: "rgba(248,113,113,0.12)", text: "#f87171", border: "rgba(248,113,113,0.3)" },
};

function getDocIcon(type: string) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("excel") || type.includes("spreadsheet") || type.includes("sheet")) return "📊";
  if (type.includes("text")) return "📃";
  return "📎";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadDocument(doc: { name: string; type: string; data: string }) {
  const byteStr = atob(doc.data);
  const ab = new ArrayBuffer(byteStr.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
  const blob = new Blob([ab], { type: doc.type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = doc.name;
  a.click();
  URL.revokeObjectURL(url);
}

export function CoursesSection({ userEmail, userDomain, onCertificateEarned }: Props) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filterDomain, setFilterDomain] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [videoModal, setVideoModal] = useState<{ course: Course; localUrl?: string } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [certToast, setCertToast] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  const loadData = () => {
    setCourses(getCourses());
    setEnrollments(getEnrollments(userEmail));
    setDomains(getDomains());
    setCertificates(getUserCertificates(userEmail));
  };

  useEffect(() => { loadData(); }, [userEmail]);

  const getEnrollment = (id: number) => enrollments.find((e) => e.courseId === id);

  const handleEnroll = (courseId: number) => {
    const updated = enrollCourse(userEmail, courseId);
    setEnrollments(updated);
  };

  const handleUnenroll = (courseId: number) => {
    const updated = unenrollCourse(userEmail, courseId);
    setEnrollments(updated);
  };

  const handleProgress = (courseId: number, delta: number) => {
    const enr = getEnrollment(courseId);
    if (!enr) return;
    const newProg = Math.min(100, Math.max(0, enr.progress + delta));
    const updated = updateCourseProgress(userEmail, courseId, newProg);
    setEnrollments(updated);
    // Check if just completed
    if (newProg >= 100) {
      triggerCertificate(courseId);
    }
  };

  const handleMarkComplete = (courseId: number) => {
    const updated = updateCourseProgress(userEmail, courseId, 100);
    setEnrollments(updated);
    triggerCertificate(courseId);
  };

  const triggerCertificate = (courseId: number) => {
    if (hasCertificate(userEmail, courseId)) return;
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    const currentUser = getCurrentUser();
    const cert: Certificate = {
      id: Date.now(),
      userEmail,
      userName: currentUser?.name || "Student",
      courseId,
      courseTitle: course.title,
      courseDomain: course.domain,
      courseDifficulty: course.difficulty,
      completedDate: new Date().toLocaleDateString(),
      issuedDate: new Date().toLocaleDateString(),
    };
    addCertificate(cert);
    setCertificates((prev) => [...prev, cert]);
    setCertToast(`🎉 Certificate earned for: ${course.title}!`);
    setTimeout(() => setCertToast(null), 5000);
    onCertificateEarned?.();
  };

  const handleWatchVideo = async (course: Course) => {
    // Check if local video stored in IndexedDB
    if (course.videoType === "local" && course.videoUrl.startsWith("idb:")) {
      setLoadingVideo(true);
      try {
        const key = course.videoUrl.replace("idb:", "");
        const stored = await getVideoFromIDB(key);
        if (stored) {
          const blob = new Blob([stored.file], { type: stored.type });
          const localUrl = URL.createObjectURL(blob);
          setVideoModal({ course, localUrl });
        } else {
          setVideoModal({ course });
        }
      } catch {
        setVideoModal({ course });
      } finally {
        setLoadingVideo(false);
      }
    } else {
      setVideoModal({ course });
    }
  };

  const handleCloseModal = () => {
    if (videoModal?.localUrl) {
      URL.revokeObjectURL(videoModal.localUrl);
    }
    setVideoModal(null);
  };

  const filtered = courses.filter((c) => {
    const domainMatch = filterDomain === "all" || c.domain === filterDomain;
    const diffMatch = filterDifficulty === "all" || c.difficulty === filterDifficulty;
    const searchMatch =
      searchText === "" ||
      c.title.toLowerCase().includes(searchText.toLowerCase()) ||
      c.description.toLowerCase().includes(searchText.toLowerCase()) ||
      c.skillTags.some((t) => t.toLowerCase().includes(searchText.toLowerCase()));
    return domainMatch && diffMatch && searchMatch;
  });

  const enrolledCourses = courses.filter((c) => getEnrollment(c.id)?.enrolled);

  const inputStyle = {
    padding: "8px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px",
    color: "white",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <div className="space-y-5">
      {/* Certificate Toast */}
      {certToast && (
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(6,182,212,0.1))",
            border: "1px solid rgba(74,222,128,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Award size={20} className="text-green-400" />
          <span style={{ color: "white", fontWeight: 600, fontSize: "0.9rem" }}>{certToast}</span>
          <button onClick={() => setCertToast(null)} style={{ color: "rgba(255,255,255,0.5)" }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "enrolled"] as Tab[]).map((t_) => (
          <button
            key={t_}
            onClick={() => setTab(t_)}
            className="px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: tab === t_ ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.05)",
              border: tab === t_ ? "none" : "1px solid rgba(255,255,255,0.1)",
              color: tab === t_ ? "white" : "rgba(255,255,255,0.6)",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            {t_ === "all" ? `${t("courses_all")} (${courses.length})` : `${t("courses_enrolled")} (${enrolledCourses.length})`}
          </button>
        ))}
        {certificates.length > 0 && (
          <div
            className="px-4 py-2 rounded-xl flex items-center gap-2"
            style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)" }}
          >
            <Award size={14} className="text-green-400" />
            <span style={{ color: "#4ade80", fontSize: "0.82rem", fontWeight: 600 }}>
              {certificates.length} {t("cert_earned")}
            </span>
          </div>
        )}
      </div>

      {tab === "all" && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ ...inputStyle, flex: "1", minWidth: "160px" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
            <div className="relative">
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                style={{ ...inputStyle, paddingRight: "32px", cursor: "pointer" }}
              >
                <option value="all" style={{ background: "#0f0a2e" }}>All Domains</option>
                {domains.map((d) => (
                  <option key={d} value={d} style={{ background: "#0f0a2e" }}>{d}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                style={{ ...inputStyle, paddingRight: "32px", cursor: "pointer" }}
              >
                <option value="all" style={{ background: "#0f0a2e" }}>{t("courses_all_difficulties")}</option>
                <option value="Beginner" style={{ background: "#0f0a2e" }}>Beginner</option>
                <option value="Intermediate" style={{ background: "#0f0a2e" }}>Intermediate</option>
                <option value="Advanced" style={{ background: "#0f0a2e" }}>Advanced</option>
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>{t("courses_no_courses")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((course) => {
                const enr = getEnrollment(course.id);
                const dc = DIFFICULTY_COLORS[course.difficulty];
                const hasCert = certificates.some((c) => c.courseId === course.id);
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={enr}
                    dc={dc}
                    hasCertificate={hasCert}
                    loading={loadingVideo}
                    onEnroll={() => handleEnroll(course.id)}
                    onUnenroll={() => handleUnenroll(course.id)}
                    onProgress={(d) => handleProgress(course.id, d)}
                    onMarkComplete={() => handleMarkComplete(course.id)}
                    onWatch={() => handleWatchVideo(course)}
                    t={t}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "enrolled" && (
        <>
          {enrolledCourses.length === 0 ? (
            <div className="p-10 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Award size={40} className="mx-auto mb-3 opacity-30" />
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem" }}>{t("courses_no_enrolled")}</p>
              <button
                onClick={() => setTab("all")}
                className="mt-3 px-4 py-2 rounded-xl"
                style={{ background: "rgba(139,92,246,0.15)", color: "#a78bfa", fontSize: "0.82rem", fontWeight: 600 }}
              >
                Browse Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map((course) => {
                const enr = getEnrollment(course.id);
                const dc = DIFFICULTY_COLORS[course.difficulty];
                const hasCert = certificates.some((c) => c.courseId === course.id);
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={enr}
                    dc={dc}
                    hasCertificate={hasCert}
                    loading={loadingVideo}
                    onEnroll={() => handleEnroll(course.id)}
                    onUnenroll={() => handleUnenroll(course.id)}
                    onProgress={(d) => handleProgress(course.id, d)}
                    onMarkComplete={() => handleMarkComplete(course.id)}
                    onWatch={() => handleWatchVideo(course)}
                    t={t}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-4xl rounded-2xl overflow-hidden"
            style={{ background: "#0a0a1a", border: "1px solid rgba(139,92,246,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {videoModal.localUrl ? (
                  <Film size={16} className="text-purple-400 flex-shrink-0" />
                ) : (
                  <ExternalLink size={16} className="text-red-400 flex-shrink-0" />
                )}
                <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {videoModal.course.title}
                </h3>
              </div>
              <button onClick={handleCloseModal} style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }}>
                <X size={18} />
              </button>
            </div>

            {/* Video Player */}
            <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
              {videoModal.localUrl ? (
                // Local MP4/MOV
                <video
                  src={videoModal.localUrl}
                  controls
                  autoPlay
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#000" }}
                />
              ) : videoModal.course.videoUrl && (
                videoModal.course.videoUrl.startsWith("http") && !videoModal.course.videoUrl.includes("youtube") ? (
                  // Direct video URL
                  <video
                    src={videoModal.course.videoUrl}
                    controls
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#000" }}
                  />
                ) : (
                  // YouTube embed
                  <iframe
                    src={`${toYouTubeEmbed(videoModal.course.videoUrl)}?autoplay=1&modestbranding=1&rel=0`}
                    title={videoModal.course.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                  />
                )
              )}
            </div>

            {/* Course Info + Documents */}
            <div className="p-4 space-y-3">
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{videoModal.course.description}</p>

              {/* Downloadable Documents */}
              {videoModal.course.documents && videoModal.course.documents.length > 0 && (
                <div>
                  <h4
                    className="flex items-center gap-2 mb-2"
                    style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", fontWeight: 600 }}
                  >
                    <FileText size={13} className="text-cyan-400" />
                    Course Materials ({videoModal.course.documents.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {videoModal.course.documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => downloadDocument(doc)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all hover:scale-105"
                        style={{
                          background: "rgba(6,182,212,0.1)",
                          border: "1px solid rgba(6,182,212,0.25)",
                          color: "#22d3ee",
                          fontSize: "0.75rem",
                        }}
                      >
                        <span>{getDocIcon(doc.type)}</span>
                        <span style={{ maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {doc.name}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem" }}>
                          ({formatFileSize(doc.size)})
                        </span>
                        <Download size={11} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  course: Course;
  enrollment?: Enrollment;
  dc: { bg: string; text: string; border: string };
  hasCertificate: boolean;
  loading: boolean;
  onEnroll: () => void;
  onUnenroll: () => void;
  onProgress: (delta: number) => void;
  onMarkComplete: () => void;
  onWatch: () => void;
  t: (key: string) => string;
}

function CourseCard({ course, enrollment, dc, hasCertificate, loading, onEnroll, onUnenroll, onProgress, onMarkComplete, onWatch, t }: CardProps) {
  const isEnrolled = enrollment?.enrolled;
  const isCompleted = enrollment?.completed;
  const progress = enrollment?.progress ?? 0;
  const hasLocalVideo = course.videoType === "local";
  const hasDocuments = course.documents && course.documents.length > 0;

  return (
    <div
      className="p-5 rounded-2xl flex flex-col gap-3 transition-all relative"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${isCompleted ? "rgba(74,222,128,0.25)" : isEnrolled ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.08)"}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `1px solid ${isCompleted ? "rgba(74,222,128,0.4)" : "rgba(139,92,246,0.4)"}`;
        e.currentTarget.style.background = "rgba(139,92,246,0.07)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `1px solid ${isCompleted ? "rgba(74,222,128,0.25)" : isEnrolled ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.08)"}`;
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      {/* Certificate badge */}
      {hasCertificate && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg"
          style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.3)" }}
        >
          <Award size={11} className="text-green-400" />
          <span style={{ color: "#4ade80", fontSize: "0.62rem", fontWeight: 700 }}>CERTIFIED</span>
        </div>
      )}

      {/* Top Row */}
      <div className="flex items-start justify-between gap-2 pr-20">
        <div className="flex-1">
          <h4 style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", marginBottom: "4px", lineHeight: 1.4 }}>
            {course.title}
          </h4>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{course.domain}</p>
        </div>
        <span
          className="px-2 py-0.5 rounded-lg flex-shrink-0"
          style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}`, fontSize: "0.68rem", fontWeight: 700 }}
        >
          {course.difficulty}
        </span>
      </div>

      {/* Description */}
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", lineHeight: 1.5 }}>
        {course.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-cyan-400" />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{course.duration}</span>
        </div>
        {hasLocalVideo && (
          <div className="flex items-center gap-1">
            <Film size={11} className="text-purple-400" />
            <span style={{ color: "rgba(167,139,250,0.7)", fontSize: "0.68rem" }}>Local Video</span>
          </div>
        )}
        {hasDocuments && (
          <div className="flex items-center gap-1">
            <FileText size={11} className="text-cyan-400" />
            <span style={{ color: "rgba(34,211,238,0.7)", fontSize: "0.68rem" }}>
              {course.documents!.length} file{course.documents!.length > 1 ? "s" : ""}
            </span>
          </div>
        )}
        {enrollment?.enrolledDate && (
          <div className="flex items-center gap-1.5">
            <Layers size={13} className="text-purple-400" />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{t("courses_enrolled_on")} {enrollment.enrolledDate}</span>
          </div>
        )}
      </div>

      {/* Skill Tags */}
      <div className="flex flex-wrap gap-1.5">
        {course.skillTags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}
          >
            <Tag size={9} />
            {tag}
          </span>
        ))}
      </div>

      {/* Progress bar (if enrolled) */}
      {isEnrolled && (
        <div>
          <div className="flex justify-between mb-1">
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>{t("courses_progress")}</span>
            <span style={{ color: isCompleted ? "#4ade80" : "#a78bfa", fontWeight: 700, fontSize: "0.72rem" }}>{progress}%</span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: "7px", background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: isCompleted
                  ? "linear-gradient(90deg, #4ade80, #22d3ee)"
                  : "linear-gradient(90deg, #7c3aed, #06b6d4)",
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap mt-1">
        <button
          onClick={onWatch}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:scale-105 flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.78rem",
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Play size={13} />
          {loading ? "Loading..." : t("courses_watch")}
        </button>

        {!isEnrolled ? (
          <button
            onClick={onEnroll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all hover:scale-105 flex-1"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white", fontSize: "0.78rem", fontWeight: 600, justifyContent: "center" }}
          >
            <BookOpen size={13} />
            {t("courses_enroll")}
          </button>
        ) : isCompleted ? (
          <div className="flex gap-2 flex-1">
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-1"
              style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", fontSize: "0.78rem", fontWeight: 700, justifyContent: "center" }}
            >
              <CheckCircle size={13} />
              {t("courses_completed_btn")}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => onProgress(25)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl transition-all hover:scale-105"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)", color: "#a78bfa", fontSize: "0.72rem", fontWeight: 600 }}
            >
              +25%
            </button>
            <button
              onClick={onMarkComplete}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:scale-105 flex-1"
              style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80", fontSize: "0.72rem", fontWeight: 600, justifyContent: "center" }}
            >
              <CheckCircle size={12} />
              {t("courses_mark_complete")}
            </button>
          </>
        )}

        {isEnrolled && !isCompleted && (
          <button
            onClick={onUnenroll}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:bg-red-500/20"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
