import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Bot, User } from "lucide-react";
import type { ChatMessage } from "../../types";
import { generateAssistantReply } from "./assistantEngine";
import type {
  AttendanceSummary,
  LeaveBalance,
  LeaveRequest,
  Announcement,
} from "../../types";

const SUGGESTIONS = [
  "What's my leave balance?",
  "Show my attendance this month",
  "Any pending leave requests?",
  "Latest announcements",
];

export function ChatAssistant({
  userName,
  attendanceSummary,
  leaveBalances,
  leaveRequests,
  announcements,
}: {
  userName: string;
  attendanceSummary: AttendanceSummary | null;
  leaveBalances: LeaveBalance[] | null;
  leaveRequests: LeaveRequest[] | null;
  announcements: Announcement[] | null;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      content: `Hi ${userName.split(" ")[0]}! I'm your HR assistant. Ask me about your attendance, leave balance, or company announcements.`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = {
        id: `m-${Date.now()}`,
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setTyping(true);

      // Simulate assistant "thinking" latency for a more natural feel.
      setTimeout(
        () => {
          const reply = generateAssistantReply(trimmed, {
            attendanceSummary,
            leaveBalances,
            leaveRequests,
            announcements,
            userName,
          });
          setMessages((prev) => [
            ...prev,
            {
              id: `m-${Date.now()}-a`,
              role: "assistant",
              content: reply,
              timestamp: Date.now(),
            },
          ]);
          setTyping(false);
        },
        550 + Math.random() * 400,
      );
    },
    [attendanceSummary, leaveBalances, leaveRequests, announcements, userName],
  );

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-linear-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-600/30 flex items-center justify-center text-white"
        aria-label="Open AI assistant"
      >
        <span className="absolute inset-0 rounded-full animate-pulse-ring" />
        {open ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-9rem))] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-4 py-3.5 bg-linear-to-r from-indigo-600 to-violet-600 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  RPS Assistant
                </p>
                <p className="text-[11px] opacity-80 leading-tight">
                  Always online
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {messages.length < 3 && (
              <div className="px-3.5 pb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 p-3 border-t border-slate-200 dark:border-slate-800"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about leave, attendance..."
                className="flex-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
