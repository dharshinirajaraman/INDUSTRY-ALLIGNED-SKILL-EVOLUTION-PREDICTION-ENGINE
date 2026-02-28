import { useState, useCallback, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Plus, X, BookOpen, Play, Clock, Users, Trophy, Upload, FileText, Film,
  Download, Trash2, ChevronDown,
} from "lucide-react";
import {
  Course,
  CourseDocument,
  getCourses,
  addCourse,
  removeCourse,
  getDomains,
  getInterviewResults,
  InterviewResult,
  updateCourseDocuments,
  storeVideoInIDB,
  toYouTubeEmbed,
} from "../utils/storage";

interface Props {
  showToast: (msg: string) => void;
}

const DIFF_COLORS: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "rgba(74,222,128,0.12)", text: "#4ade80" },
  Intermediate: { bg: "rgba(251,146,60,0.12)", text: "#fb923c" },
  Advanced: { bg: "rgba(248,113,113,0.12)", text: "#f87171" },
};

const ACCEPTED_DOCS = ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx";
const ACCEPTED_VIDEO = "video/mp4,video/quicktime,.mp4,.mov";
const MAX_DOC_SIZE = 10 * 1024 * 1024; // 10 MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocIcon(type: string) {
  if (type.includes("pdf")) return "📄";
  if (type.includes("word") || type.includes("document")) return "📝";
  if (type.includes("excel") || type.includes("spreadsheet") || type.includes("sheet")) return "📊";
  if (type.includes("powerpoint") || type.includes("presentation")) return "📋";
  if (type.includes("text")) return "📃";
  return "📎";
}

export function AdminCoursesSection({ showToast }: Props) {
  const { t } = useLanguage();
  const [courses, setCourses] = useState<Course[]>(getCourses());
  const [domains] = useState<string[]>(getDomains());
  const [interviewResults] = useState<InterviewResult[]>(getInterviewResults());
  const [filterDomain, setFilterDomain] = useState("all");
  const [showInterviews, setShowInterviews] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<number | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const docInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [videoMode, setVideoMode] = useState<"url" | "local">("url");

  const [form, setForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    skillTagsText: "",
    difficulty: "Beginner" as Course["difficulty"],
    duration: "",
    domain: "",
  });

  const [localVideoFile, setLocalVideoFile] = useState<File | null>(null);

  const reload = useCallback(() => setCourses(getCourses()), []);

  const handleAdd = async () => {
    if (!form.title.trim() || !form.description.trim() || !form.domain || !form.duration.trim()) {
      showToast("Please fill all required fields.");
      return;
    }

    const skillTags = form.skillTagsText.split(",").map((s) => s.trim()).filter(Boolean);
    const newId = Date.now();

    let videoUrl = "";
    let videoType: Course["videoType"] = "youtube";

    if (videoMode === "local" && localVideoFile) {
      setUploadingVideo(true);
      try {
        const key = await storeVideoInIDB(newId, localVideoFile);
        videoUrl = `idb:${key}`;
        videoType = "local";
        showToast("Video stored locally!");
      } catch {
        showToast("Failed to store video file.");
        setUploadingVideo(false);
        return;
      }
      setUploadingVideo(false);
    } else {
      videoUrl = toYouTubeEmbed(form.videoUrl.trim()) || "https://www.youtube.com/embed/dQw4w9WgXcQ";
      videoType = "youtube";
    }

    const newCourse: Course = {
      id: newId,
      title: form.title.trim(),
      description: form.description.trim(),
      videoUrl,
      videoType,
      skillTags,
      difficulty: form.difficulty,
      duration: form.duration.trim(),
      domain: form.domain,
      documents: [],
    };

    addCourse(newCourse);
    reload();
    setForm({ title: "", description: "", videoUrl: "", skillTagsText: "", difficulty: "Beginner", duration: "", domain: "" });
    setLocalVideoFile(null);
    setVideoMode("url");
    showToast("Course added successfully!");
  };

  const handleRemove = (id: number) => {
    removeCourse(id);
    reload();
    showToast("Course removed.");
  };

  const handleDocUpload = async (courseId: number, files: FileList) => {
    setUploadingDoc(courseId);
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;

    const currentDocs = course.documents || [];
    const newDocs: CourseDocument[] = [...currentDocs];

    for (const file of Array.from(files)) {
      if (file.size > MAX_DOC_SIZE) {
        showToast(`File "${file.name}" exceeds 10MB limit.`);
        continue;
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Strip the data URL prefix (e.g., "data:application/pdf;base64,")
            const base64Data = result.split(",")[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newDocs.push({
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          data: base64,
          size: file.size,
        });
      } catch {
        showToast(`Failed to upload "${file.name}".`);
      }
    }

    updateCourseDocuments(courseId, newDocs);
    reload();
    setUploadingDoc(null);
    showToast("Documents uploaded successfully!");
  };

  const handleRemoveDoc = (courseId: number, docId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return;
    const updated = (course.documents || []).filter((d) => d.id !== docId);
    updateCourseDocuments(courseId, updated);
    reload();
    showToast("Document removed.");
  };

  const filtered = filterDomain === "all" ? courses : courses.filter((c) => c.domain === filterDomain);

  const avgInterviewScore =
    interviewResults.length > 0
      ? Math.round(interviewResults.reduce((s, r) => s + r.overallScore, 0) / interviewResults.length)
      : 0;

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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Courses", value: courses.length, color: "#a78bfa", icon: BookOpen },
          { label: "Domains", value: new Set(courses.map((c) => c.domain)).size, color: "#22d3ee", icon: BookOpen },
          { label: "Mock Interviews", value: interviewResults.length, color: "#4ade80", icon: Users },
          { label: "Avg. Interview Score", value: `${avgInterviewScore}%`, color: "#fb923c", icon: Trophy },
        ].map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div style={{ color: s.color, fontSize: "1.8rem", fontWeight: 800, fontFamily: "'Orbitron', sans-serif" }}>
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Course Form */}
      <div
        className="p-6 rounded-2xl space-y-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(6,182,212,0.2)" }}
      >
        <h3 style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>
          ➕ {t("admin_add_course")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_course_title_label")} *
            </label>
            <input
              type="text"
              placeholder={t("admin_course_title_ph")}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_course_domain")} *
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

        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
            {t("admin_course_desc")} *
          </label>
          <textarea
            placeholder={t("admin_course_desc_ph")}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.5)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
          />
        </div>

        {/* Video Section */}
        <div>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "8px" }}>
            Course Video
          </label>
          {/* Mode toggle */}
          <div className="flex gap-2 mb-3">
            {(["url", "local"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => { setVideoMode(mode); setLocalVideoFile(null); }}
                className="px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                style={{
                  background: videoMode === mode ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.05)",
                  border: videoMode === mode ? "none" : "1px solid rgba(255,255,255,0.1)",
                  color: videoMode === mode ? "white" : "rgba(255,255,255,0.5)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                {mode === "url" ? <><Play size={12} /> YouTube / URL</> : <><Film size={12} /> Upload MP4 / MOV</>}
              </button>
            ))}
          </div>

          {videoMode === "url" ? (
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=... or embed URL"
              value={form.videoUrl}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          ) : (
            <div>
              <div
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer border-dashed transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "2px dashed rgba(139,92,246,0.3)",
                }}
                onClick={() => videoInputRef.current?.click()}
              >
                <Film size={20} className="text-purple-400 flex-shrink-0" />
                <div>
                  <p style={{ color: "white", fontSize: "0.85rem", fontWeight: 600 }}>
                    {localVideoFile ? localVideoFile.name : "Click to upload MP4 or MOV video"}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>
                    {localVideoFile ? formatFileSize(localVideoFile.size) : "Stored in browser IndexedDB for offline use"}
                  </p>
                </div>
                {localVideoFile && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setLocalVideoFile(null); }}
                    className="ml-auto"
                    style={{ color: "rgba(248,113,113,0.7)" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept={ACCEPTED_VIDEO}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setLocalVideoFile(file);
                  e.target.value = "";
                }}
              />
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", marginTop: "4px" }}>
                ℹ️ Video is stored in browser's IndexedDB. It persists across page reloads on the same device.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_course_difficulty")} *
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value as Course["difficulty"] })}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              <option value="Beginner" style={{ background: "#0f0a2e" }}>Beginner</option>
              <option value="Intermediate" style={{ background: "#0f0a2e" }}>Intermediate</option>
              <option value="Advanced" style={{ background: "#0f0a2e" }}>Advanced</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_course_duration")} *
            </label>
            <input
              type="text"
              placeholder={t("admin_course_duration_ph")}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", marginBottom: "6px" }}>
              {t("admin_course_skills")}
            </label>
            <input
              type="text"
              placeholder={t("admin_course_skills_ph")}
              value={form.skillTagsText}
              onChange={(e) => setForm({ ...form, skillTagsText: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "rgba(6,182,212,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={uploadingVideo}
          className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
          style={{
            background: uploadingVideo ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #0891b2, #6366f1)",
            color: "white",
            fontWeight: 600,
            fontSize: "0.875rem",
            opacity: uploadingVideo ? 0.7 : 1,
          }}
        >
          <Plus size={16} />
          {uploadingVideo ? "Storing video..." : t("admin_add_course")}
        </button>
      </div>

      {/* Course List */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 600 }}>
            {t("admin_course_list")} ({filtered.length})
          </h3>
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            style={{
              padding: "6px 12px",
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

        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen size={36} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{t("admin_no_courses")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((course) => {
              const dc = DIFF_COLORS[course.difficulty];
              const isExpanded = expandedCourse === course.id;
              const docs = course.documents || [];

              return (
                <div
                  key={course.id}
                  className="rounded-xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {/* Course Header Row */}
                  <div className="flex items-start gap-3 p-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(6,182,212,0.15)" }}
                    >
                      <BookOpen size={18} className="text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span style={{ color: "white", fontWeight: 600, fontSize: "0.875rem" }}>{course.title}</span>
                        <span className="px-2 py-0.5 rounded" style={{ background: dc.bg, color: dc.text, fontSize: "0.65rem", fontWeight: 700 }}>
                          {course.difficulty}
                        </span>
                        {course.videoType === "local" && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa", fontSize: "0.62rem" }}>
                            <Film size={10} /> Local Video
                          </span>
                        )}
                        {docs.length > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee", fontSize: "0.62rem" }}>
                            <FileText size={10} /> {docs.length} files
                          </span>
                        )}
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {course.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-cyan-400" />
                          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{course.duration}</span>
                        </div>
                        <span style={{ color: "#22d3ee", fontSize: "0.72rem" }}>{course.domain}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                        style={{ color: "rgba(34,211,238,0.7)" }}
                        title="Manage documents"
                      >
                        <ChevronDown size={14} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </button>
                      <button
                        onClick={() => handleRemove(course.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all hover:bg-red-500/20"
                        style={{ color: "rgba(248,113,113,0.7)" }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Document Manager */}
                  {isExpanded && (
                    <div
                      className="px-4 pb-4 space-y-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <div className="flex items-center justify-between pt-3">
                        <h4 className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", fontWeight: 600 }}>
                          <FileText size={13} className="text-cyan-400" />
                          Course Documents ({docs.length})
                        </h4>
                        <button
                          onClick={() => docInputRef.current?.click()}
                          disabled={uploadingDoc === course.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{
                            background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(124,58,237,0.2))",
                            border: "1px solid rgba(6,182,212,0.3)",
                            color: "#22d3ee",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            opacity: uploadingDoc === course.id ? 0.6 : 1,
                          }}
                        >
                          <Upload size={12} />
                          {uploadingDoc === course.id ? "Uploading..." : "Upload File"}
                        </button>
                        <input
                          ref={docInputRef}
                          type="file"
                          multiple
                          accept={ACCEPTED_DOCS}
                          style={{ display: "none" }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleDocUpload(course.id, e.target.files);
                            }
                            e.target.value = "";
                          }}
                        />
                      </div>

                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem" }}>
                        Supported: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX (max 10MB each)
                      </p>

                      {docs.length === 0 ? (
                        <div
                          className="p-4 rounded-xl text-center border-dashed"
                          style={{ border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}
                        >
                          No documents uploaded yet. Click "Upload File" to add materials.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {docs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-3 p-3 rounded-xl"
                              style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.12)" }}
                            >
                              <span style={{ fontSize: "1.1rem" }}>{getDocIcon(doc.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p style={{ color: "white", fontSize: "0.8rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {doc.name}
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.68rem" }}>
                                  {formatFileSize(doc.size)} • {doc.type.split("/").pop()?.toUpperCase()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveDoc(course.id, doc.id)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20 flex-shrink-0"
                                style={{ color: "rgba(248,113,113,0.7)" }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interview Results */}
      {interviewResults.length > 0 && (
        <div
          className="p-6 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            className="flex items-center gap-2 mb-4"
            onClick={() => setShowInterviews(!showInterviews)}
            style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.9rem" }}
          >
            <Users size={16} className="text-cyan-400" />
            {t("admin_interview_results")} ({interviewResults.length})
          </button>
          {showInterviews && (
            <div className="overflow-x-auto">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["Email", "Job Role", "Overall", "Communication", "Confidence", "Technical", "Date"].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...interviewResults].reverse().slice(0, 20).map((r) => {
                    const col = r.overallScore >= 70 ? "#4ade80" : r.overallScore >= 50 ? "#fb923c" : "#f87171";
                    return (
                      <tr key={r.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "10px 12px", color: "rgba(255,255,255,0.7)" }}>{r.userEmail}</td>
                        <td style={{ padding: "10px 12px", color: "#a78bfa" }}>{r.jobRole}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span className="px-2 py-0.5 rounded" style={{ background: `${col}15`, color: col, fontWeight: 700 }}>{r.overallScore}%</span>
                        </td>
                        <td style={{ padding: "10px 12px", color: "#a78bfa" }}>{r.communicationScore}%</td>
                        <td style={{ padding: "10px 12px", color: "#22d3ee" }}>{r.confidenceScore}%</td>
                        <td style={{ padding: "10px 12px", color: "#4ade80" }}>{r.technicalScore}%</td>
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
