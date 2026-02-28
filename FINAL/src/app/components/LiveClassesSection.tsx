import { useState, useEffect } from "react";
import { getLiveClasses, getClassStatus, LiveClass } from "../utils/storage";
import { Video, Calendar, Clock, User, ExternalLink, RefreshCw, BookOpen } from "lucide-react";

function StatusBadge({ status }: { status: "upcoming" | "live" | "completed" }) {
  const cfg = {
    live:      { bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.4)", color: "#4ade80", dot: true,  label: "🔴 LIVE NOW" },
    upcoming:  { bg: "rgba(34,211,238,0.12)", border: "rgba(34,211,238,0.3)", color: "#22d3ee", dot: false, label: "Upcoming" },
    completed: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", dot: false, label: "Completed" },
  }[status];
  return (
    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: "0.72rem", fontWeight: 700 }}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
      {cfg.label}
    </span>
  );
}

function formatDateTime(date: string, time: string) {
  try {
    const dt = new Date(`${date}T${time}`);
    return dt.toLocaleString("en-IN", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch { return `${date} ${time}`; }
}

function timeUntil(date: string, time: string) {
  const now = new Date();
  const target = new Date(`${date}T${time}`);
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const hrs  = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs > 24) {
    const days = Math.floor(hrs / 24);
    return `${days}d ${hrs % 24}h`;
  }
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

export function LiveClassesSection() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [filter, setFilter] = useState<"all" | "upcoming" | "live" | "completed">("all");
  const [now, setNow] = useState(new Date());

  // Refresh every minute to update status
  useEffect(() => {
    setClasses(getLiveClasses());
    const interval = setInterval(() => { setNow(new Date()); setClasses(getLiveClasses()); }, 60000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...classes].sort((a, b) =>
    new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()
  );

  const filtered = filter === "all" ? sorted : sorted.filter(c => getClassStatus(c) === filter);

  const liveCount     = sorted.filter(c => getClassStatus(c) === "live").length;
  const upcomingCount = sorted.filter(c => getClassStatus(c) === "upcoming").length;

  return (
    <div className="space-y-5">
      {/* Live alert banner */}
      {liveCount > 0 && (
        <div className="p-4 rounded-2xl flex items-center gap-3"
          style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.4)", animation: "pulse 2s ease-in-out infinite" }}>
          <span className="w-3 h-3 rounded-full bg-green-400 animate-ping flex-shrink-0" />
          <p style={{ color: "#4ade80", fontWeight: 700, fontSize: "0.9rem" }}>
            {liveCount} class{liveCount > 1 ? "es are" : " is"} LIVE RIGHT NOW! Join immediately →
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Classes", val: sorted.length,   color: "#a78bfa" },
          { label: "Live Now",      val: liveCount,        color: "#4ade80" },
          { label: "Upcoming",      val: upcomingCount,    color: "#22d3ee" },
        ].map(s => (
          <div key={s.label} className="p-3.5 rounded-xl text-center"
            style={{ background: `${s.color}10`, border: `1px solid ${s.color}25` }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: "1.6rem", fontWeight: 900, color: s.color }}>{s.val}</div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", marginTop: "2px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "live", "upcoming", "completed"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-xl transition-all capitalize"
            style={{
              background: filter === f ? "linear-gradient(135deg,rgba(124,58,237,0.35),rgba(6,182,212,0.25))" : "rgba(255,255,255,0.04)",
              border: `1px solid ${filter === f ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: filter === f ? "white" : "rgba(255,255,255,0.45)",
              fontSize: "0.78rem", fontWeight: filter === f ? 700 : 400,
            }}>
            {f === "live" && liveCount > 0 ? `🔴 Live (${liveCount})` : f === "upcoming" ? `Upcoming (${upcomingCount})` : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button onClick={() => setClasses(getLiveClasses())} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:scale-105"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {/* Classes list */}
      {filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.1)" }}>
            <Video size={28} style={{ color: "rgba(139,92,246,0.5)" }} />
          </div>
          <div className="text-center">
            <p style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              {sorted.length === 0 ? "No Live Classes Scheduled" : `No ${filter} classes`}
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", marginTop: "4px" }}>
              {sorted.length === 0 ? "Admin will schedule classes soon. Check back later." : "Try a different filter."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(cls => {
            const status = getClassStatus(cls);
            const eta = status === "upcoming" ? timeUntil(cls.date, cls.time) : null;
            const isLive = status === "live";
            return (
              <div key={cls.id} className="p-5 rounded-2xl transition-all"
                style={{
                  background: isLive ? "rgba(74,222,128,0.07)" : "rgba(255,255,255,0.03)",
                  border: isLive ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: isLive ? "0 0 20px rgba(74,222,128,0.1)" : "none",
                }}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isLive ? "rgba(74,222,128,0.2)" : "rgba(139,92,246,0.15)" }}>
                      <Video size={20} style={{ color: isLive ? "#4ade80" : "#a78bfa" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem" }}>{cls.courseName}</p>
                        <StatusBadge status={status} />
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                          <User size={12} /> {cls.facultyName}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                          <Calendar size={12} /> {formatDateTime(cls.date, cls.time)}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                          <Clock size={12} /> {cls.duration} min
                        </span>
                      </div>
                      {eta && (
                        <p className="mt-1.5" style={{ color: "#22d3ee", fontSize: "0.72rem", fontWeight: 600 }}>
                          ⏱ Starts in {eta}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {status !== "completed" ? (
                      <a href={cls.meetLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all hover:scale-105"
                        style={{
                          background: isLive ? "linear-gradient(135deg,#16a34a,#15803d)" : "linear-gradient(135deg,rgba(124,58,237,0.5),rgba(6,182,212,0.4))",
                          border: isLive ? "1px solid #4ade80" : "1px solid rgba(139,92,246,0.4)",
                          color: "white", fontWeight: 700, fontSize: "0.82rem",
                          boxShadow: isLive ? "0 0 16px rgba(74,222,128,0.35)" : "none",
                          textDecoration: "none",
                        }}>
                        <Video size={14} />
                        {isLive ? "Join Now" : "Join Class"}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
                        Completed ✓
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
