import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Award, Search, Download, User, BookOpen, Calendar, Shield, X } from "lucide-react";
import { getCertificates, getUsers, Certificate, User as UserType } from "../utils/storage";
import { jsPDF } from "jspdf";

interface Props {
  showToast: (msg: string) => void;
}

export function AdminCertificatesSection({ showToast }: Props) {
  const { t } = useLanguage();
  const [certificates] = useState<Certificate[]>(getCertificates());
  const [users] = useState<UserType[]>(getUsers());
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  const uniqueEmails = [...new Set(certificates.map((c) => c.userEmail))];

  const filtered = certificates.filter((cert) => {
    const matchEmail = selectedUser === "all" || cert.userEmail === selectedUser;
    const matchSearch =
      search === "" ||
      cert.userName.toLowerCase().includes(search.toLowerCase()) ||
      cert.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      cert.courseTitle.toLowerCase().includes(search.toLowerCase());
    return matchEmail && matchSearch;
  });

  const getUserInfo = (email: string) => users.find((u) => u.email === email);

  const DIFF_COLORS: Record<string, string> = {
    Beginner: "#4ade80",
    Intermediate: "#fb923c",
    Advanced: "#f87171",
  };

  const downloadCertificatePDF = async (cert: Certificate) => {
    setDownloading(cert.id);
    try {
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = doc.internal.pageSize.getWidth();
      const H = doc.internal.pageSize.getHeight();

      // White background
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      // Outer border — thin gold
      doc.setDrawColor(180, 148, 60);
      doc.setLineWidth(1.2);
      doc.rect(10, 10, W - 20, H - 20, "S");

      // Inner border — thin gray
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.4);
      doc.rect(14, 14, W - 28, H - 28, "S");

      // Corner circles
      const corners = [[18, 18], [W - 18, 18], [18, H - 18], [W - 18, H - 18]] as [number, number][];
      doc.setFillColor(180, 148, 60);
      corners.forEach(([cx, cy]) => doc.circle(cx, cy, 2, "F"));

      // Platform name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 60, 180);
      doc.text("SKILLSYNC AI", W / 2, 32, { align: "center" });

      doc.setDrawColor(100, 60, 180);
      doc.setLineWidth(0.6);
      doc.line(W / 2 - 30, 35, W / 2 + 30, 35);

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(30, 30, 30);
      doc.text("Certificate of Completion", W / 2, 52, { align: "center" });

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(40, 57, W - 40, 57);

      // "This is to certify that"
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("This is to certify that", W / 2, 70, { align: "center" });

      // Recipient Name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      doc.setTextColor(15, 15, 15);
      doc.text(cert.userName, W / 2, 90, { align: "center" });

      const nameW = doc.getTextWidth(cert.userName);
      doc.setDrawColor(100, 60, 180);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - nameW / 2, 93, W / 2 + nameW / 2, 93);

      // Completed course text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("has successfully completed the course", W / 2, 106, { align: "center" });

      // Course title box
      const boxW = Math.min(190, W - 60);
      doc.setFillColor(248, 245, 255);
      doc.setDrawColor(150, 100, 230);
      doc.setLineWidth(0.6);
      doc.roundedRect(W / 2 - boxW / 2, 112, boxW, 20, 4, 4, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(80, 40, 160);
      doc.text(cert.courseTitle, W / 2, 124, { align: "center" });

      // Domain and level
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Domain: ${cert.courseDomain}   •   Level: ${cert.courseDifficulty}`,
        W / 2,
        140,
        { align: "center" }
      );

      // Dates
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      doc.text(
        `Completed: ${cert.completedDate}   |   Issued: ${cert.issuedDate}`,
        W / 2,
        150,
        { align: "center" }
      );

      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.4);
      doc.line(40, 156, W - 40, 156);

      // Footer cert ID
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      doc.text(
        `Certificate ID: SKILL-${cert.id}-${cert.courseId}-${cert.userEmail.split("@")[0].toUpperCase()}`,
        W / 2,
        H - 16,
        { align: "center" }
      );

      doc.save(
        `SkillSync_Certificate_${cert.userName.replace(/\s+/g, "_")}_${cert.courseTitle.replace(/\s+/g, "_")}.pdf`
      );
      showToast("Certificate PDF downloaded!");
    } catch {
      showToast("Failed to generate PDF.");
    } finally {
      setDownloading(null);
    }
  };

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
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Certificates", value: certificates.length, color: "#a78bfa", icon: Award },
          { label: "Unique Learners", value: uniqueEmails.length, color: "#22d3ee", icon: User },
          { label: "Courses Completed", value: new Set(certificates.map((c) => c.courseId)).size, color: "#4ade80", icon: BookOpen },
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" />
          <input
            type="text"
            placeholder="Search by name, email or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "100%", paddingLeft: "32px" }}
          />
        </div>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="all" style={{ background: "#0f0a2e" }}>All Users</option>
          {uniqueEmails.map((email) => (
            <option key={email} value={email} style={{ background: "#0f0a2e" }}>{email}</option>
          ))}
        </select>
      </div>

      {/* Certificates Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="p-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Award size={16} className="text-purple-400" />
          <h3 style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 600 }}>
            All Certificates ({filtered.length})
          </h3>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <Award size={40} className="mx-auto mb-3 opacity-20" />
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>
              No certificates found.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Student", "Email", "Course", "Domain", "Level", "Completed", "Issued", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 14px",
                        textAlign: "left",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...filtered].reverse().map((cert) => {
                  const userInfo = getUserInfo(cert.userEmail);
                  const dc = DIFF_COLORS[cert.courseDifficulty] || "#a78bfa";
                  return (
                    <tr
                      key={cert.id}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedCert(cert)}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "white",
                            }}
                          >
                            {cert.userName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ color: "white", fontWeight: 600 }}>{cert.userName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.55)" }}>
                        {cert.userEmail}
                      </td>
                      <td style={{ padding: "12px 14px", color: "#a78bfa", maxWidth: "180px" }}>
                        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cert.courseTitle}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "#22d3ee" }}>{cert.courseDomain}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span
                          className="px-2 py-0.5 rounded"
                          style={{ background: `${dc}20`, color: dc, fontWeight: 700, fontSize: "0.7rem" }}
                        >
                          {cert.courseDifficulty}
                        </span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.45)" }}>{cert.completedDate}</td>
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.45)" }}>{cert.issuedDate}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadCertificatePDF(cert);
                          }}
                          disabled={downloading === cert.id}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{
                            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                            color: "white",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            opacity: downloading === cert.id ? 0.6 : 1,
                          }}
                        >
                          <Download size={11} />
                          {downloading === cert.id ? "..." : "PDF"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: "#0a0a1a", border: "1px solid rgba(124,58,237,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                >
                  <Shield size={20} className="text-white" />
                </div>
                <h3 style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>Certificate Details</h3>
              </div>
              <button onClick={() => setSelectedCert(null)} style={{ color: "rgba(255,255,255,0.4)" }}>
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Student info */}
              {(() => {
                const u = getUserInfo(selectedCert.userEmail);
                return (
                  <div
                    className="p-4 rounded-xl"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
                  >
                    <h4 style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginBottom: "8px" }}>STUDENT INFORMATION</h4>
                    <div className="space-y-1.5">
                      {[
                        ["Name", selectedCert.userName],
                        ["Email", selectedCert.userEmail],
                        ["Domain", u?.domain || "—"],
                        ["Year", u?.year || "—"],
                        ["Skills", u ? `${u.skills.length} skills` : "—"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{label}:</span>
                          <span style={{ color: "white", fontSize: "0.78rem", fontWeight: 600 }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Certificate info */}
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}
              >
                <h4 style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", marginBottom: "8px" }}>CERTIFICATE DETAILS</h4>
                <div className="space-y-1.5">
                  {[
                    ["Course", selectedCert.courseTitle],
                    ["Domain", selectedCert.courseDomain],
                    ["Level", selectedCert.courseDifficulty],
                    ["Completed", selectedCert.completedDate],
                    ["Issued", selectedCert.issuedDate],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem" }}>{label}:</span>
                      <span style={{ color: "#22d3ee", fontSize: "0.78rem", fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => downloadCertificatePDF(selectedCert)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)", color: "white", fontWeight: 600 }}
              >
                <Download size={16} />
                Download Certificate PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}