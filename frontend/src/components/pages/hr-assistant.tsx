import { useState, useRef, useEffect, type FormEvent } from "react";
import { chatApi } from "../../api/chatApi";
import type { ChatSource } from "../../types/chat";

// =====================================================
// ICONS
// =====================================================
interface IconProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}

function Send({ size = 16, strokeWidth = 2, color = "currentColor", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}


function Loader2({ size = 16, strokeWidth = 2, color = "currentColor", style }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animation: "spin 1s linear infinite", ...style }}
    >
      <circle cx="12" cy="12" r="10" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" />
    </svg>
  );
}

// Ensure the loader animation exists when using inline SVG
const loaderStyle = document.createElement("style");
loaderStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
if (!document.head?.contains(loaderStyle)) {
  document.head?.appendChild(loaderStyle);
}

// =====================================================
// TYPES
// =====================================================
interface Message {
  role: "user" | "bot";
  text: string;
  sources?: ChatSource[];
}

const QUICK_TOPICS = [
  { label: "Leave Policy", section: "§4" },
  { label: "Remote Work", section: "§10" },
  { label: "Resignation", section: "§7" },
  { label: "Compensation", section: "§11" },
  { label: "Confidentiality", section: "§9" },
];

export default function HRAssistChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hi, I'm HR Assist. Ask me anything about leave, remote work, compensation, or company policy — I'll answer straight from the HR handbook.",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await chatApi.sendMessage(question);
      const data = res.data;

      if (data.success) {
        setMessages((m) => [
          ...m,
          { role: "bot", text: data.reply || "", sources: data.sources || [] },
        ]);
      } else {
        setError(data.error || "Something went wrong.");
        setMessages((m) => [
          ...m,
          { role: "bot", text: "I couldn't reach the HR documents just now. Please try again.", sources: [] },
        ]);
      }
    } catch (err) {
      setError("Couldn't connect to the HR assistant backend.");
      setMessages((m) => [
        ...m,
        { role: "bot", text: "I couldn't connect to the server. Check that the backend is running.", sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .msg-in { animation: none !important; }
        }
        .msg-in { animation: riseIn 0.28s ease-out; }
        .topic-chip:hover { border-color: #C9A227; color: #1B2A4A; }
        .send-btn:hover:not(:disabled) { background: #24365e; }
        .send-btn:focus-visible, .topic-chip:focus-visible, .composer-input:focus-visible {
          outline: 2px solid #C9A227; outline-offset: 2px;
        }
        .dot { animation: bounce 1.1s infinite ease-in-out; }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }
        .chat-scroll::-webkit-scrollbar { width: 8px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #D9DEE7; border-radius: 8px; }
      `}</style>

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.badge}>
          <div style={styles.badgeStripe} />
          <div style={styles.badgeInner}>
            <span style={styles.badgeMark}>HR</span>
            <div>
              <div style={styles.wordmark}>HR Assistant</div>
              <div style={styles.tagline}>Policy, answered</div>
            </div>
          </div>
        </div>

        <div style={styles.sidebarSection}>
          <div style={styles.sidebarLabel}>Browse by section</div>
          <div style={styles.chipList}>
            {QUICK_TOPICS.map((t) => (
              <button
                key={t.label}
                className="topic-chip"
                style={styles.chip}
                onClick={() => sendMessage(`What is the ${t.label.toLowerCase()}?`)}
              >
                <span style={styles.chipSection}>{t.section}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.sidebarFoot}>
          Answers are generated from your organization's HR handbook only. When in doubt, confirm with your HR representative.
        </div>
      </aside>

      {/* Main chat panel */}
      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <div style={styles.headerTitle}>Ask HR Assistant</div>
            <div style={styles.headerSub}>Answers sourced directly from company policy documents</div>
          </div>
          {error && <div style={styles.errorPill}>Connection issue</div>}
        </header>

        <div className="chat-scroll" ref={scrollRef} style={styles.chatArea}>
          {messages.map((m, i) => (
            <div
              key={i}
              className="msg-in"
              style={{
                ...styles.row,
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.role === "bot" && <div style={styles.avatar}>HR</div>}

              <div style={m.role === "user" ? styles.userBubble : styles.botBubbleWrap}>
  {m.role === "bot" && <div style={styles.botTab} />}
  <div style={m.role === "user" ? {} : styles.botBubble}>
    <MessageText text={m.text} />
  </div>
</div>
              
            </div>
          ))}

          {loading && (
            <div className="msg-in" style={{ ...styles.row, justifyContent: "flex-start" }}>
              <div style={styles.avatar}>HR</div>
              <div style={styles.botBubbleWrap}>
                <div style={styles.botTab} />
                <div style={{ ...styles.botBubble, display: "flex", gap: 5, alignItems: "center" }}>
                  <span className="dot" style={styles.typingDot} />
                  <span className="dot" style={styles.typingDot} />
                  <span className="dot" style={styles.typingDot} />
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.composer}>
          <input
            className="composer-input"
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about leave, remote work, benefits…"
            disabled={loading}
          />
          <button
            type="submit"
            className="send-btn"
            style={{ ...styles.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1 }}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 size={16} /> : <Send size={16} />}
          </button>
        </form>
      </main>
    </div>
  );
}
export function MessageText({ text }: { text: string }) {
  const clean = text
    .replace(/\*/g, "•")
    .replace(/\n{2,}/g, "\n")
    .trim();

  return (
    <div style={{ textAlign: "left", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
      {clean}
    </div>
  );
}
// =====================================================
// STYLES — token system: ink navy / badge gold / paper grey-blue
// =====================================================
const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    height: "100vh",
    width: "100%",
    background: "#EEF0F4",
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: "#1B2A4A",
  },
  sidebar: {
    width: 260,
    minWidth: 220,
    background: "#1B2A4A",
    color: "#EEF0F4",
    display: "flex",
    flexDirection: "column",
    padding: "22px 18px",
  },
  badge: {
    background: "#233863",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 28,
  },
  badgeStripe: { height: 5, background: "#C9A227" },
  badgeInner: { display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 16px" },
  badgeMark: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    fontWeight: 500,
    background: "#C9A227",
    color: "#1B2A4A",
    borderRadius: 5,
    padding: "4px 6px",
  },
  wordmark: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19, lineHeight: 1.1 },
  tagline: { fontSize: 11.5, color: "#9AA8C4", marginTop: 2 },
  sidebarSection: { flex: 1 },
  sidebarLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#7C8BAE",
    marginBottom: 10,
  },
  chipList: { display: "flex", flexDirection: "column", gap: 8 },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#233863",
    border: "1px solid #33477A",
    color: "#D7DEEC",
    borderRadius: 8,
    padding: "9px 10px",
    fontSize: 13,
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color 0.15s, color 0.15s",
  },
  chipSection: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    color: "#C9A227",
    minWidth: 22,
  },
  sidebarFoot: {
    fontSize: 11.5,
    color: "#7C8BAE",
    lineHeight: 1.5,
    borderTop: "1px solid #33477A",
    paddingTop: 14,
  },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 28px",
    borderBottom: "1px solid #DDE2EA",
    background: "#FFFFFF",
  },
  headerTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 20, color: "#1B2A4A" },
  headerSub: { fontSize: 12.5, color: "#6B7590", marginTop: 2 },
  errorPill: {
    fontSize: 11.5,
    background: "#FBEAEA",
    color: "#A23B3B",
    padding: "5px 10px",
    borderRadius: 20,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  chatArea: { flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 16 },
  row: { display: "flex", gap: 10, alignItems: "flex-end" },
  avatar: {
    width: 30,
    height: 30,
    minWidth: 30,
    borderRadius: 8,
    background: "#1B2A4A",
    color: "#C9A227",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10.5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userBubble: {
    maxWidth: "62%",
    background: "#1B2A4A",
    color: "#F2F4F8",
    padding: "12px 16px",
    borderRadius: "14px 14px 3px 14px",
    fontSize: 14.5,
    textAlign: "left", 
  },
  botBubbleWrap: { maxWidth: "68%", position: "relative", display: "flex" },
  botTab: {
    width: 5,
    borderRadius: "6px 0 0 6px",
    background: "#C9A227",
    flexShrink: 0,
  },
  botBubble: {
    background: "#FFFFFF",
    border: "1px solid #E3E7EE",
    borderLeft: "none",
    padding: "13px 16px",
    borderRadius: "0 14px 14px 14px",
    fontSize: 14.5,
    color: "#293552",
    boxShadow: "0 1px 2px rgba(27,42,74,0.04)",
    textAlign:"left"
  },
  sourceRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingTop: 9,
    borderTop: "1px dashed #E3E7EE",
    color: "#8891A8",
  },
  sourceTag: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    background: "#F3F5F9",
    padding: "2px 6px",
    borderRadius: 4,
  },
  typingDot: { width: 6, height: 6, borderRadius: "50%", background: "#B9C0D2", display: "inline-block" },
  composer: {
    display: "flex",
    gap: 10,
    padding: "16px 28px 22px",
    borderTop: "1px solid #DDE2EA",
    background: "#FFFFFF",
  },
  input: {
    flex: 1,
    border: "1px solid #DADFE8",
    borderRadius: 10,
    padding: "12px 14px",
    fontSize: 14.5,
    fontFamily: "'IBM Plex Sans', sans-serif",
    background: "#F8F9FB",
    color: "#1B2A4A",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: "#1B2A4A",
    color: "#EEF0F4",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};