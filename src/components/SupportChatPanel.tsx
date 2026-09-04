import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  getSupportMessages,
  sendSupportMessageRest,
  supportChatTopic,
  type ChatMessage,
} from "../services/chatApi";
import { getApiErrorMessage } from "../api/axios";
import { useStompChat } from "../hooks/useStompChat";
import { isUserShellDark, userShell } from "../theme/userShellTheme";

const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

type SupportChatPanelProps = {
  className?: string;
};

const SupportChatPanel = ({ className = "" }: SupportChatPanelProps) => {
  const { userDTO, isAuthenticated } = useAuth();
  const dark = isUserShellDark;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const topic =
    isAuthenticated && userDTO?.id != null
      ? supportChatTopic(userDTO.id)
      : null;

  const { connected, connectError } = useStompChat({
    topic,
    enabled: Boolean(topic),
    onMessage: appendMessage,
  });

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const response = await getSupportMessages();
        setMessages(response.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not load support chat."));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || connected) return;

    const intervalId = window.setInterval(() => {
      void getSupportMessages()
        .then((response) => {
          setMessages((prev) => {
            if (response.data.length === prev.length) {
              const same = response.data.every(
                (msg, index) => msg.id === prev[index]?.id,
              );
              if (same) return prev;
            }
            return response.data;
          });
        })
        .catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [isAuthenticated, connected]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const response = await sendSupportMessageRest({ body: trimmed });
      response.data.forEach(appendMessage);
      setInput("");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send message."));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  if (loading) {
    return (
      <div className={`${userShell.detailPanelLg} p-8 text-center ${className}`}>
        <p className={userShell.muted}>Loading support chat...</p>
      </div>
    );
  }

  return (
    <div
      className={`${userShell.cardOverflow} flex flex-col min-h-[520px] max-h-[70vh] ${className}`}
    >
      <div className={userShell.cardHeaderMuted}>
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Headphones size={16} />
            </div>
            <div className="min-w-0">
              <h2 className={`${userShell.strongSm} truncate`}>Arenova Support</h2>
              <p className={`${userShell.mutedXs} truncate`}>
                Typically replies in a few minutes
              </p>
            </div>
          </div>
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              connected ? "bg-green-500" : "bg-amber-400"
            }`}
            title={connected ? "Live" : connectError || "Connecting..."}
          />
        </div>
      </div>

      <div
        ref={messagesRef}
        className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 ${userShell.messagesPanel}`}
      >
        {messages.length === 0 ? (
          <p className={`${userShell.emptyCenter} py-8`}>
            Ask about registration, payments, or match schedules. Our support team
            will reply here.
          </p>
        ) : (
          messages.map((message) => {
            const isMine =
              message.senderRole !== "SUPPORT" &&
              userDTO?.id != null &&
              String(userDTO.id) === String(message.userId);
            const isSupport = message.senderRole === "SUPPORT";
            return (
              <div
                key={message.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? "bg-blue-600 text-white rounded-br-md"
                      : dark
                        ? "bg-white/5 border border-white/10 text-gray-200 rounded-bl-md"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                  }`}
                >
                  {!isMine && (
                    <p
                      className={`text-xs font-semibold mb-1 ${dark ? "text-blue-400" : "text-blue-600"}`}
                    >
                      {isSupport ? "Arenova Support" : message.senderName}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.body}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isMine ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.sentAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        className={`border-t ${userShell.detailBorder} p-3 ${dark ? "bg-[#111827]" : "bg-white"}`}
      >
        {connectError && (
          <p className="text-xs text-amber-400 mb-2">{connectError}</p>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Write a message..."
            className={`${userShell.textarea} rounded-xl min-h-[44px] max-h-28`}
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={!input.trim() || sending}
            className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChatPanel;
