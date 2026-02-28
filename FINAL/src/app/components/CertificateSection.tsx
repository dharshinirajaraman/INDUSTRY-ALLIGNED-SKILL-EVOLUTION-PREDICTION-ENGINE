import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Award, Download, BookOpen, Calendar, Star, Shield } from "lucide-react";
import {
  Certificate,
  getUserCertificates,
  getCourses,
  Course,
} from "../utils/storage";
import { jsPDF } from "jspdf";

interface Props {
  userEmail: string;
  userName: string;
}

export function CertificateSection({ userEmail, userName }: Props) {
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    setCertificates(getUserCertificates(userEmail));
    setCourses(getCourses());
  }, [userEmail]);

  const getCourse = (id: number) => courses.find((c) => c.id === id);

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

      // Decorative corner diamonds (small filled squares rotated visually)
      const corners = [[18, 18], [W - 18, 18], [18, H - 18], [W - 18, H - 18]] as [number, number][];
      doc.setFillColor(180, 148, 60);
      corners.forEach(([cx, cy]) => doc.circle(cx, cy, 2, "F"));

      // ── Header Section ──────────────────────────────────

      // Platform name
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(100, 60, 180);
      doc.text("SKILLSYNC AI", W / 2, 32, { align: "center" });

      // Thin purple top accent line
      doc.setDrawColor(100, 60, 180);
      doc.setLineWidth(0.6);
      doc.line(W / 2 - 30, 35, W / 2 + 30, 35);

      // "Certificate of Completion" title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(30, 30, 30);
      doc.text("Certificate of Completion", W / 2, 52, { align: "center" });

      // Thin separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(40, 57, W - 40, 57);

      // ── Body ────────────────────────────────────────────

      // "This is to certify that"
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("This is to certify that", W / 2, 70, { align: "center" });

      // Recipient Name — large & prominent
      doc.setFont("helvetica", "bold");
      doc.setFontSize(30);
      doc.setTextColor(15, 15, 15);
      doc.text(cert.userName, W / 2, 90, { align: "center" });

      // Underline under name
      const nameW = doc.getTextWidth(cert.userName);
      doc.setDrawColor(100, 60, 180);
      doc.setLineWidth(0.8);
      doc.line(W / 2 - nameW / 2, 93, W / 2 + nameW / 2, 93);

      // "has successfully completed the course"
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

      // Domain and difficulty
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(
        `Domain: ${cert.courseDomain}   •   Level: ${cert.courseDifficulty}`,
        W / 2,
        140,
        { align: "center" }
      );

      // Completion date
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      doc.text(`Completed: ${cert.completedDate}   |   Issued: ${cert.issuedDate}`, W / 2, 150, {
        align: "center",
      });

      // Bottom separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.4);
      doc.line(40, 156, W - 40, 156);

      // Certificate ID footer
      doc.setFontSize(7);
      doc.setTextColor(180, 180, 180);
      doc.text(
        `Certificate ID: SKILL-${cert.id}-${cert.courseId}-${cert.userEmail.split("@")[0].toUpperCase()}`,
        W / 2,
        H - 16,
        { align: "center" }
      );

      doc.save(`SkillSync_Certificate_${cert.courseTitle.replace(/\s+/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="p-6 rounded-2xl flex items-center gap-4"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
          border: "1px solid rgba(124,58,237,0.3)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
        >
          <Award size={32} className="text-white" />
        </div>
        <div>
          <h3
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "white",
              marginBottom: "4px",
            }}
          >
            {t("cert_title")}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            {t("cert_subtitle")}
          </p>
        </div>
        <div
          className="ml-auto px-4 py-2 rounded-xl flex-shrink-0"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#a78bfa",
            }}
          >
            {certificates.length}
          </span>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem" }}>Earned</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div
          className="p-12 rounded-2xl text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Award size={52} className="mx-auto mb-4 opacity-20" />
          <h4 style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", fontWeight: 600, marginBottom: "8px" }}>
            {t("cert_none_title")}
          </h4>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
            {t("cert_none_desc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => {
            const course = getCourse(cert.courseId);
            const diffColor = DIFF_COLORS[cert.courseDifficulty] || "#a78bfa";
            const isDownloading = downloading === cert.id;

            return (
              <div
                key={cert.id}
                className="relative overflow-hidden rounded-2xl p-6"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))",
                  border: "1px solid rgba(124,58,237,0.3)",
                }}
              >
                {/* Decorative corner badge */}
                <div
                  className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl flex items-center gap-1"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                >
                  <Star size={10} className="text-yellow-300" style={{ fill: "#fde047" }} />
                  <span style={{ color: "white", fontSize: "0.65rem", fontWeight: 700 }}>
                    CERTIFIED
                  </span>
                </div>

                {/* Certificate Icon */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
                  >
                    <Shield size={22} className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0 pr-12">
                    <h4
                      style={{
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                        marginBottom: "4px",
                        lineHeight: 1.3,
                      }}
                    >
                      {cert.courseTitle}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-lg text-xs font-bold"
                        style={{ background: `${diffColor}20`, color: diffColor }}
                      >
                        {cert.courseDifficulty}
                      </span>
                      <span style={{ color: "#22d3ee", fontSize: "0.75rem" }}>{cert.courseDomain}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} className="text-purple-400" />
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                      Completed: <span style={{ color: "#a78bfa" }}>{cert.completedDate}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-cyan-400" />
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem" }}>
                      Issued: <span style={{ color: "#22d3ee" }}>{cert.issuedDate}</span>
                    </span>
                  </div>
                </div>

                {/* Cert ID */}
                <p
                  className="mb-4"
                  style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", fontFamily: "monospace" }}
                >
                  ID: SKILL-{cert.id}-{cert.courseId}-{cert.userEmail.split("@")[0].toUpperCase()}
                </p>

                {/* Download Button */}
                <button
                  onClick={() => downloadCertificatePDF(cert)}
                  disabled={isDownloading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: isDownloading
                      ? "rgba(255,255,255,0.06)"
                      : "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    opacity: isDownloading ? 0.7 : 1,
                    cursor: isDownloading ? "not-allowed" : "pointer",
                  }}
                >
                  <Download size={15} />
                  {isDownloading ? "Generating PDF..." : t("cert_download_pdf")}
                </button>

                {/* Skills preview if course exists */}
                {course && course.skillTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {course.skillTags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)", fontSize: "0.65rem" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
