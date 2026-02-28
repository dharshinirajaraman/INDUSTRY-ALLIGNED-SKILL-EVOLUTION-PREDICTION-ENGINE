import { useState, useEffect } from "react";
import {
  getLiveClasses, saveLiveClasses, addLiveClass, deleteLiveClass,
  getClassStatus, LiveClass,
} from "../utils/storage";
import { Plus, Trash2, Video, Calendar, Clock, User, ExternalLink, Save, RefreshCw } from "lucide-react";

function StatusBadge({ status }: { status: "upcoming" | "live" | "completed" }) {
  const cfg = {
    live:      { bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.4)", color: "#4ade80", label: "🔴 LIVE" },
    upcoming:  { bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.3)", color: "#22d3ee", label: "Upcoming" },
    completed: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)", label: "Completed" },
  }[status];
  return (
    <span className="px-2.5 py-1 rounded-lg"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: "0.7rem", fontWeight: 700 }}>
      {cfg.label}
    </span>
  );
}

function formatDT(date: string, time: string) {
  try {
    return new Date(`${date}T${time}`).toLocaleString("en-IN", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return `${date} ${time}`; }
}

export function AdminLiveClassesSection({ showToast }: { showToast: (m: string) => void }) {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [courseName,  setCourseName]  = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [date,        setDate]        = useState("");
  const [time,        setTime]        = useState("");
  const [meetLink,    setMeetLink]    = useState("");
  const [duration,    setDuration]    = useState("60");
  const [errors,      setErrors]      = useState<Record<string, string>>({});

  const load = () => setClasses(getLiveClasses());
  useEffect(() => { load(); }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!courseName.trim())  e.courseName  = "Course name required";
    if (!facultyName.trim()) e.facultyName = "Faculty name required";
    if (!date)               e.date        = "Date required";
    if (!time)               e.time        = "Time required";
    if (!meetLink.trim())    e.meetLink    = "Google Meet link required";
    else if (!meetLink.startsWith("http")) e.meetLink = "Must be a valid URL";
    const dur = parseInt(duration);
    if (isNaN(dur) || dur < 15 || dur > 480) e.duration = "Duration: 15–480 minutes";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const lc: LiveClass = {
      id: Date.now().toString(),
      courseName: courseName.trim(),
      facultyName: facultyName.trim(),
      date, time,
      meetLink: meetLink.trim(),
      duration: parseInt(duration),
      createdAt: new Date().toISOString(),
    };
    addLiveClass(lc);
    load();
    setCourseName(""); setFacultyName(""); setDate(""); setTime(""); setMeetLink(""); setDuration("60"); setErrors({});
    showToast("Live class scheduled! 🎉");
  };

  const handleDelete = (id: string) => {
    deleteLiveClass(id);
    load();
    showToast("Class removed.");
  };

  const sorted = [...classes].sort((a, b) =>
    new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  );

  const liveCount     = sorted.filter(c => getClassStatus(c) === "live").length;
  const upcomingCount = sorted.filter(c => getClassStatus(c) === "upcoming").length;
  const completedCount= sorted.filter(c => getClassStatus(c) === "completed").length;

  const inp = (err?: string): React.CSSProperties => ({
    padding: "10px 14px",
    background: err ? "rgba(248,113,113,0.08)" : "rgba(255,255,255,0.06)",
    border: `1px solid ${err ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)"}`,
    borderRadius: "10px", color: "white",
    fontFamily: "'Space Grotesk',sans-serif", fontSize: "0.875rem", outline: "none", width: "100%",
  });

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Classes", val: sorted.length,    color: "#a78bfa" },
          { label: "Live Now",      val: liveCount,         color: "#4ade80" },
          { label: "Upcoming",      val: upcomingCount,     color: "#22d3ee" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl text-center"
            style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.8rem", fontWeight: 900, color: s.color }}>{s.val}</div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Schedule form */}
      <div className="p-6 rounded-2xl space-y-5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)" }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
            <Plus size={16} style={{ color: "#a78bfa" }} />
          </div>
          <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>Schedule New Live Class</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Course Name */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <Video size={12} className="inline mr-1" />Course Name *
            </label>
            <input value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="e.g., Python for Data Science"
              style={inp(errors.courseName)} />
            {errors.courseName && <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "3px" }}>{errors.courseName}</p>}
          </div>
          {/* Faculty */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <User size={12} className="inline mr-1" />Faculty Name *
            </label>
            <input value={facultyName} onChange={e => setFacultyName(e.target.value)} placeholder="e.g., Dr. Priya Sharma"
              style={inp(errors.facultyName)} />
            {errors.facultyName && <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "3px" }}>{errors.facultyName}</p>}
          </div>
          {/* Date */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <Calendar size={12} className="inline mr-1" />Date *
            </label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ ...inp(errors.date), colorScheme: "dark" }} />
            {errors.date && <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "3px" }}>{errors.date}</p>}
          </div>
          {/* Time */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <Clock size={12} className="inline mr-1" />Time (24h) *
            </label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              style={{ ...inp(errors.time), colorScheme: "dark" }} />
            {errors.time && <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "3px" }}>{errors.time}</p>}
          </div>
          {/* Duration */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <Clock size={12} className="inline mr-1" />Duration (minutes) *
            </label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="15" max="480" placeholder="60"
              style={inp(errors.duration)} />
            {errors.duration && <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "3px" }}>{errors.duration}</p>}
          </div>
          {/* Meet Link */}
          <div>
            <label style={{ display: "block", color: "rgba(255,255,255,0.55)", fontSize: "0.8rem", marginBottom: "6px" }}>
              <ExternalLink size={12} className="inline mr-1" />Google Meet Link *
            </label>
            <input value={meetLink} onChange={e => setMeetLink(e.target.value)} placeholder="https://meet.google.com/xxx-xxxx-xxx"
              style={inp(errors.meetLink)} />
            {errors.meetLink && <p style={{ color: "#f87171", fontSize: "0.7rem", marginTop: "3px" }}>{errors.meetLink}</p>}
          </div>
        </div>

        <button onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "white", fontWeight: 700, fontSize: "0.875rem", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
          <Save size={16} /> Schedule Class
        </button>
      </div>

      {/* Classes list */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", fontWeight: 600 }}>
            All Scheduled Classes ({sorted.length})
          </p>
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {sorted.length === 0 ? (
          <div className="py-12 text-center rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>No classes scheduled yet. Create one above.</p>
          </div>
        ) : (
          sorted.map(cls => {
            const status = getClassStatus(cls);
            return (
              <div key={cls.id} className="p-4 rounded-xl flex items-center gap-4 flex-wrap"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: status === "live" ? "rgba(74,222,128,0.2)" : "rgba(139,92,246,0.15)" }}>
                  <Video size={16} style={{ color: status === "live" ? "#4ade80" : "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span style={{ color: "white", fontWeight: 600, fontSize: "0.88rem" }}>{cls.courseName}</span>
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>👨‍🏫 {cls.facultyName}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>📅 {formatDT(cls.date, cls.time)}</span>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>⏱ {cls.duration} min</span>
                    <a href={cls.meetLink} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1" style={{ color: "#22d3ee", fontSize: "0.72rem", textDecoration: "none" }}>
                      <ExternalLink size={11} /> Meet Link
                    </a>
                  </div>
                </div>
                <button onClick={() => handleDelete(cls.id)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
                  <Trash2 size={15} style={{ color: "#f87171" }} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
