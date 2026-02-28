import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Bot, User, ChevronDown, Sparkles, RotateCcw } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
}

// ── Knowledge Base ─────────────────────────────────────────────────────────────

const KB: { patterns: RegExp[]; answer: string }[] = [
  {
    patterns: [/what is skillsync/i, /about skillsync/i, /what does skillsync do/i, /tell me about/i],
    answer:
      "SkillSync AI is an AI-powered skill evolution platform designed for students and professionals. It aligns your current skills with future industry demands, identifies skill gaps, generates personalized career roadmaps, and provides AI-powered assessments, mock interviews, courses, and certificates — all in one place! 🚀",
  },
  {
    patterns: [/how to sign ?up/i, /create account/i, /register/i, /join/i],
    answer:
      "To sign up, click **Get Started** on the home page, then select **New user? Sign up here** from the User Login page. Fill in your name, email, password, domain (e.g., AI/ML, Web Development), and your year of study. Once registered, you can log in and access your personalized dashboard! 🎓",
  },
  {
    patterns: [/how to log ?in/i, /login/i, /sign in/i, /access dashboard/i],
    answer:
      "To log in: go to the Home page → click **User Login** → enter your registered email and password → click **Login**. For admins: click **Admin Login** and use the admin credentials (admin@skillsync.com / admin123).",
  },
  {
    patterns: [/admin/i, /admin login/i, /admin credentials/i, /admin password/i],
    answer:
      "Admin credentials: **Email:** admin@skillsync.com | **Password:** admin123. The admin can manage courses, questions, domains, trending skills, roadmaps, view all users & certificates, and more from the Admin Dashboard.",
  },
  {
    patterns: [/skill gap/i, /gap analysis/i, /missing skills/i],
    answer:
      "The **Skill Gap Analyzer** compares your added skills with trending industry skills. It shows:\n• ✅ Matching Skills — skills you already have\n• ❌ Missing Skills — trending skills you haven't added yet\n\nThis helps you know exactly what to learn next! Go to **My Dashboard → Skill Gap Analyzer**.",
  },
  {
    patterns: [/alignment score/i, /industry score/i, /score/i],
    answer:
      "Your **Industry Alignment Score** measures how well your skills match current industry demands. It's calculated as: (Matching Skills / Total Trending Skills) × 100. Score guide:\n• 70%+ = Excellent 🟢\n• 40-70% = Good 🟡\n• Below 40% = Needs improvement 🔴\nAdd more relevant skills to boost your score!",
  },
  {
    patterns: [/how to add skill/i, /add skills/i, /my skills/i],
    answer:
      "To add skills: Go to your **User Dashboard → My Skills** section. Type a skill name (e.g., Python, React, SQL) in the input box and click **Add Skill** or press Enter. You can add as many skills as you like, and they'll automatically update your alignment score!",
  },
  {
    patterns: [/roadmap/i, /career path/i, /learning path/i, /career roadmap/i],
    answer:
      "The **Career Roadmap** is a step-by-step personalized learning path tailored to your domain. It shows you exactly what to learn, from basics to advanced topics. Go to **Dashboard → Career Roadmap** to see your path. The admin configures roadmaps for each domain.",
  },
  {
    patterns: [/learning pathway/i, /pathway/i, /beginner.*intermediate/i, /phases/i],
    answer:
      "The **AI Learning Pathway** breaks your domain roadmap into 3 structured phases:\n• 🟢 Beginner Phase — Foundations & basics\n• 🟡 Intermediate Phase — Core skills & practice\n• 🔴 Advanced Phase — Expert-level mastery\n\nEach phase has milestones, estimated time, and recommended courses! Find it at **Dashboard → Learning Pathway**.",
  },
  {
    patterns: [/assessment/i, /quiz/i, /test/i, /exam/i],
    answer:
      "The **AI Assessment Module** tests your domain knowledge with MCQ questions. Features:\n• Domain-specific questions (Easy/Medium/Hard mix)\n• 20-minute timer\n• Instant scoring and feedback\n• Assessment history tracking\n\nGo to **Dashboard → AI Assessment** and click **Start Assessment** to begin!",
  },
  {
    patterns: [/mock interview/i, /interview/i, /practice interview/i],
    answer:
      "The **AI Mock Interview** simulates a real job interview! Features:\n• 15 AI-generated questions per role\n• Live camera & microphone preview\n• Text-to-speech question reading\n• 90-second timer per question\n• AI scoring: Communication, Confidence & Technical\n• Personalized improvement suggestions\n\nGo to **Dashboard → Mock Interview**, select your job role, and click **Start Interview**. Make sure to allow camera & mic access when prompted!",
  },
  {
    patterns: [/camera/i, /microphone/i, /mic/i, /video/i, /permission/i],
    answer:
      "For the Mock Interview, your browser will ask for **Camera and Microphone** permission. Simply:\n1. Click **Start Interview**\n2. A browser popup will ask for permissions — click **Allow**\n3. Your camera will appear in the live preview panel\n\nIf you denied permission previously, click the camera icon in your browser's address bar to re-enable it. Camera access is required for the interview experience!",
  },
  {
    patterns: [/courses?/i, /enroll/i, /learning/i, /watch video/i],
    answer:
      "The **Courses Module** offers 17+ courses across all domains! You can:\n• Browse and search courses by domain, difficulty, and keyword\n• Enroll in courses and track progress\n• Watch YouTube/local video lessons\n• Download course materials (PDF, DOC, etc.)\n• Earn certificates upon 100% completion\n\nFind it at **Dashboard → Courses**. Click **Enroll Now** to start any course!",
  },
  {
    patterns: [/certificate/i, /cert/i, /download pdf/i, /completion/i],
    answer:
      "**Certificates** are automatically awarded when you complete a course (100% progress)! Features:\n• Clean white PDF certificate with your name and course details\n• Downloadable instantly from **Dashboard → My Certificates**\n• Each certificate has a unique ID\n• Admins can view all certificates from their dashboard\n\nComplete any course to earn your first certificate! 🏆",
  },
  {
    patterns: [/profile/i, /profile picture/i, /photo/i, /avatar/i, /upload photo/i],
    answer:
      "You can upload a **Profile Picture** from your dashboard! Steps:\n1. Go to **Dashboard → Profile**\n2. Click on your avatar / the upload area\n3. Select an image file (JPG, PNG, etc.)\n4. Your photo will be saved and shown in the sidebar\n\nAdmins can also view profile pictures in the Users management section. 📸",
  },
  {
    patterns: [/automation risk/i, /risk/i, /automation/i, /future proof/i],
    answer:
      "The **Automation Risk Indicator** tells you how likely your domain is to be automated by AI/robots:\n• 🟢 Low Risk (AI/ML, Web Dev, Cloud, etc.) — AI complements these fields\n• 🟡 Medium Risk (UI/UX Design) — Focus on creativity\n• 🔴 High Risk (Data Entry) — Consider upskilling\n\nTips to reduce risk: learn programming, develop critical thinking, and focus on AI-complementary skills!",
  },
  {
    patterns: [/skill growth/i, /growth index/i, /trending skills/i, /bar chart/i],
    answer:
      "The **Skill Growth Index** shows a bar chart of the demand growth % for all trending skills (Python, AI/ML, React, Cloud, etc.). It helps you visually identify the fastest-growing skills to prioritize in your learning. Go to **Dashboard → Skill Growth Index** to see the chart!",
  },
  {
    patterns: [/future prediction/i, /future skills/i, /upcoming skills/i, /next skills/i],
    answer:
      "The **Future Skill Predictions** section shows the fastest-growing trending skills you should learn next. Each skill displays its growth percentage, helping you stay ahead of industry trends. Go to **Dashboard → Future Predictions** to see what to learn next! 📈",
  },
  {
    patterns: [/language/i, /translate/i, /tamil/i, /hindi/i, /telugu/i, /multilingual/i],
    answer:
      "SkillSync AI supports **4 languages**: 🇬🇧 English, 🇮🇳 தமிழ் (Tamil), 🇮🇳 हिन्दी (Hindi), and 🇮🇳 తెలుగు (Telugu). You can switch the language from the **Language selector** in the navigation bar at the top of the page. The entire interface translates dynamically!",
  },
  {
    patterns: [/features?/i, /what can/i, /capabilities/i, /modules?/i],
    answer:
      "SkillSync AI offers these powerful features:\n🔍 **Skill Gap Analyzer** — Find what you're missing\n📊 **Alignment Score** — Measure industry readiness\n🔮 **Future Predictions** — See what skills are rising\n🗺️ **Career Roadmap** — Step-by-step learning plan\n📈 **Skill Growth Index** — Visual demand trends\n⚠️ **Automation Risk** — Know your job's risk level\n📚 **Learning Pathway** — Phased learning journey\n🧠 **AI Assessment** — Test your knowledge\n🎤 **Mock Interview** — Practice with AI\n🎓 **Courses** — 17+ video courses\n🏆 **Certificates** — Earn PDFs on completion",
  },
  {
    patterns: [/admin dashboard/i, /admin panel/i, /manage/i, /admin features/i],
    answer:
      "The **Admin Dashboard** allows platform management:\n👥 **Users** — View all registered users & profiles\n📈 **Trending Skills** — Add/remove trending skills\n🌐 **Domains** — Manage learning domains\n🗺️ **Roadmaps** — Configure step-by-step roadmaps\n⚠️ **Risk Management** — Set automation risk levels\n🧠 **Assessment Manager** — Add/remove questions\n🎓 **Course Manager** — Add courses with videos & docs\n🏆 **Certificates** — View all earned certificates",
  },
  {
    patterns: [/progress/i, /track progress/i, /complete course/i, /mark complete/i],
    answer:
      "You can track your course progress from **Dashboard → Courses → My Enrolled Courses**. For each enrolled course:\n• Click **+25%** to update progress incrementally\n• Click **Mark Complete** to set 100% instantly\n• A certificate is automatically generated at 100%!\n\nYour progress is saved locally and persists between sessions.",
  },
  {
    patterns: [/logout/i, /log out/i, /sign out/i, /exit/i],
    answer:
      "To log out, scroll to the **bottom of the sidebar** in your dashboard and click the **Logout** button (red). This will securely end your session and return you to the home page.",
  },
  {
    patterns: [/forgot password/i, /reset password/i, /password/i],
    answer:
      "Currently, SkillSync AI stores passwords locally. If you forgot your password, you can create a new account with the same email is not possible (as email must be unique). Please use the password you set during signup. For admins, the password is always: **admin123**.",
  },
  {
    patterns: [/data.*stored/i, /storage/i, /privacy/i, /data.*safe/i, /local storage/i],
    answer:
      "All your data (skills, progress, certificates, etc.) is stored **locally in your browser** using localStorage and IndexedDB. This means your data stays on your device and is private. However, clearing your browser data will erase all platform data. No data is sent to external servers.",
  },
  {
    patterns: [/hello|hi|hey|howdy|greet/i, /good morning|good afternoon|good evening/i],
    answer:
      "Hello! 👋 I'm SkillSync AI's 24/7 assistant! I can help you with:\n• Platform features & navigation\n• Course & certificate questions\n• Assessment & interview guidance\n• Account & profile help\n\nWhat would you like to know?",
  },
  {
    patterns: [/thank/i, /thanks/i, /helpful/i, /great/i, /awesome/i],
    answer:
      "You're very welcome! 😊 I'm always here if you have more questions. Keep learning and growing with SkillSync AI! 🚀",
  },
  {
    patterns: [/bye|goodbye|see you|farewell/i],
    answer:
      "Goodbye! 👋 Keep learning and stay ahead of the curve with SkillSync AI. Come back anytime you need help! 🌟",
  },
  {
    patterns: [/how.*work/i, /guide/i, /tutorial/i, /how.*use/i, /get started/i],
    answer:
      "Getting started with SkillSync AI is easy!\n1. **Sign Up** — Create your account with your domain\n2. **Add Skills** — Go to My Skills and add your current skills\n3. **Explore Dashboard** — Check your Alignment Score & Skill Gaps\n4. **Enroll in Courses** — Browse and enroll in courses\n5. **Take Assessment** — Test your knowledge\n6. **Practice Interview** — Try AI Mock Interview\n7. **Earn Certificates** — Complete courses for PDF certificates!\n\nStart at the **Home page** and click **Get Started**! 🎯",
  },
];

function getBotResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const kb of KB) {
    if (kb.patterns.some((p) => p.test(lower))) {
      return kb.answer;
    }
  }
  // Default fallback
  return "I'm not sure about that specific question, but I'm here to help with anything related to SkillSync AI! 😊\n\nYou can ask me about:\n• Features & modules (Assessment, Courses, Certificates, etc.)\n• How to navigate the platform\n• Camera/mic permissions for Mock Interview\n• Profile picture upload\n• Admin dashboard\n\nWhat else can I help you with?";
}

// ── Quick Suggestions ─────────────────────────────────────

const QUICK_SUGGESTIONS = [
  "What is SkillSync AI?",
  "How do I earn a certificate?",
  "How does the Mock Interview work?",
  "How do I add skills?",
  "What is the Alignment Score?",
  "How do I upload a profile picture?",
];

// ── Component ─────────────────────────────────────────────

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "👋 Hi! I'm SkillSync AI's 24/7 assistant. I can answer all your questions about the platform. What would you like to know?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setHasNew(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages, scrollToBottom]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const userMsg: Message = { id: Date.now(), role: "user", text: text.trim(), time: now };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      setTimeout(() => {
        const response = getBotResponse(text);
        const botMsg: Message = {
          id: Date.now() + 1,
          role: "bot",
          text: response,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        if (!open) setHasNew(true);
      }, 700 + Math.random() * 500);
    },
    [open]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 0,
        role: "bot",
        text: "👋 Hi! I'm SkillSync AI's 24/7 assistant. I can answer all your questions about the platform. What would you like to know?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Format message text with basic markdown-like rendering
  const renderText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold **text**
      const boldReplaced = line.replace(/\*\*(.*?)\*\*/g, (_, content) => `<strong>${content}</strong>`);
      return (
        <span key={i} style={{ display: "block", lineHeight: 1.6 }}>
          <span dangerouslySetInnerHTML={{ __html: boldReplaced }} />
          {i < lines.length - 1 && lines[i + 1] !== "" && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Button */}
      <div
        className="fixed z-50"
        style={{ bottom: "24px", right: "24px" }}
      >
        {/* New message pulse indicator */}
        {hasNew && !open && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-10"
            style={{ background: "#f87171", fontSize: "0.6rem", fontWeight: 700, color: "white" }}
          >
            1
          </div>
        )}

        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-2xl relative"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 8px 32px rgba(0,0,0,0.3)",
            }}
            title="Chat with SkillSync AI"
          >
            <MessageSquare size={22} className="text-white" />
            {/* Pulse ring */}
            <span
              className="absolute inset-0 rounded-2xl animate-ping"
              style={{ background: "rgba(124,58,237,0.3)", animationDuration: "2s" }}
            />
          </button>
        )}
      </div>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            bottom: "24px",
            right: "24px",
            width: "360px",
            height: "520px",
            background: "linear-gradient(160deg, #0d0820 0%, #0a1220 100%)",
            border: "1px solid rgba(139,92,246,0.3)",
            boxShadow: "0 0 60px rgba(124,58,237,0.3), 0 24px 48px rgba(0,0,0,0.5)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.15))",
              borderBottom: "1px solid rgba(139,92,246,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center relative"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              >
                <Bot size={18} className="text-white" />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                  style={{ background: "#4ade80", borderColor: "#0d0820" }}
                />
              </div>
              <div>
                <div style={{ color: "white", fontSize: "0.88rem", fontWeight: 700 }}>
                  SkillSync AI Assistant
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span style={{ color: "#4ade80", fontSize: "0.65rem" }}>Always Online • 24/7</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                title="Clear chat"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(139,92,246,0.3) transparent" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background:
                      msg.role === "bot"
                        ? "linear-gradient(135deg, #7c3aed, #06b6d4)"
                        : "rgba(255,255,255,0.1)",
                    border: msg.role === "user" ? "1px solid rgba(255,255,255,0.15)" : "none",
                  }}
                >
                  {msg.role === "bot" ? (
                    <Sparkles size={12} className="text-white" />
                  ) : (
                    <User size={12} className="text-white" />
                  )}
                </div>

                <div className={`flex flex-col gap-0.5 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className="px-3 py-2 rounded-2xl"
                    style={{
                      background:
                        msg.role === "bot"
                          ? "rgba(255,255,255,0.06)"
                          : "linear-gradient(135deg, #7c3aed, #4f46e5)",
                      border:
                        msg.role === "bot"
                          ? "1px solid rgba(255,255,255,0.08)"
                          : "none",
                      borderRadius:
                        msg.role === "bot"
                          ? "4px 18px 18px 18px"
                          : "18px 4px 18px 18px",
                    }}
                  >
                    <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.8rem" }}>
                      {renderText(msg.text)}
                    </div>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.62rem", padding: "0 4px" }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                >
                  <Sparkles size={12} className="text-white" />
                </div>
                <div
                  className="px-3 py-2 rounded-2xl flex items-center gap-1"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "4px 18px 18px 18px",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-purple-400"
                      style={{
                        animation: "bounce 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", marginBottom: "6px" }}>
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-2 py-1 rounded-lg text-left transition-all hover:scale-105"
                    style={{
                      background: "rgba(124,58,237,0.12)",
                      border: "1px solid rgba(124,58,237,0.25)",
                      color: "#a78bfa",
                      fontSize: "0.68rem",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div
            className="px-3 py-3 flex-shrink-0 flex gap-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about SkillSync AI..."
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "white",
                fontSize: "0.82rem",
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(139,92,246,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
              style={{
                background: input.trim() ? "linear-gradient(135deg, #7c3aed, #06b6d4)" : "rgba(255,255,255,0.06)",
                border: "none",
                cursor: input.trim() ? "pointer" : "not-allowed",
                opacity: !input.trim() || isTyping ? 0.5 : 1,
              }}
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
