import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send, Users } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import {
  fetchMyRegistrationForEvent,
  type RegistrationStatus,
} from "../services/registrationApi";
import {
  chatTopic,
  getChatMessages,
  getChatParticipantCount,
  sendChatMessageRest,
  type ChatMessage,
} from "../services/chatApi";
import { getApiErrorMessage } from "../api/axios";
import { useStompChat } from "../hooks/useStompChat";
import { isUserShellDark, userShell } from "../theme/userShellTheme";

const ACTIVE_REGISTRATION: RegistrationStatus[] = ["PENDING", "REGISTERED"];

const formatTime = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export type TournamentChatPanelProps = {
  eventId: string;
  title: string;
  onBack?: () => void;
  requireRegistration?: boolean;
  showRoomId?: boolean;
  registerPath?: string;
  onRegister?: () => void;
  className?: string;
};

const TournamentChatPanel = ({
  eventId,
  title,
  onBack,
  requireRegistration = true,
  showRoomId = false,
  onRegister,
  className = "",
}: TournamentChatPanelProps) => {
  const { userDTO, isAuthenticated } = useAuth();
  const dark = isUserShellDark;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [participantCount, setParticipantCount] = useState<number | null>(null);
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const canUseChat = useMemo(() => {
    if (!eventId || !/^\d+$/.test(eventId)) return false;
    if (!isAuthenticated) return false;
    if (!requireRegistration) return true;
    return (
      registrationStatus !== null &&
      ACTIVE_REGISTRATION.includes(registrationStatus)
    );
  }, [eventId, isAuthenticated, requireRegistration, registrationStatus]);

  const appendMessage = useCallback((message: ChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
  }, []);

  const { connected, connectError } = useStompChat({
    topic: canUseChat ? chatTopic(eventId) : null,
    enabled: canUseChat,
    onMessage: appendMessage,
  });

  useEffect(() => {
    if (!canUseChat || connected) return;

    const poll = async () => {
      try {
        const response = await getChatMessages(eventId);
        setMessages((prev) => {
          if (response.data.length === prev.length) {
            const same = response.data.every(
              (msg, index) => msg.id === prev[index]?.id,
            );
            if (same) return prev;
          }
          return response.data;
        });
      } catch {
        // ignore polling errors
      }
    };

    const intervalId = window.setInterval(() => {
      void poll();
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, [canUseChat, connected, eventId]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const load = async () => {
      if (!eventId || !/^\d+$/.test(eventId)) {
        setLoading(false);
        setAccessDenied(true);
        return;
      }

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        if (requireRegistration) {
          const registration = await fetchMyRegistrationForEvent(eventId);
          const status = registration?.status ?? null;
          setRegistrationStatus(status);

          const active =
            status !== null && ACTIVE_REGISTRATION.includes(status);
          if (!active) {
            setAccessDenied(true);
            setMessages([]);
            return;
          }
        }

        setAccessDenied(false);
        const [historyRes, participantsRes] = await Promise.all([
          getChatMessages(eventId),
          getChatParticipantCount(eventId),
        ]);
        setMessages(historyRes.data);
        setParticipantCount(participantsRes.data.count);
      } catch (error) {
        setAccessDenied(true);
        toast.error(getApiErrorMessage(error, "Could not load tournament chat."));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [eventId, isAuthenticated, requireRegistration]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !canUseChat || sending) return;

    setSending(true);
    try {
      const response = await sendChatMessageRest(eventId, { body: trimmed });
      appendMessage(response.data);
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
        <p className={userShell.muted}>Loading tournament chat...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className={`${userShell.detailPanelLg} p-8 text-center ${className}`}>
        <p className={`${userShell.body} mb-4`}>
          {requireRegistration
            ? "Register for this tournament to join the chat room."
            : "You do not have access to this tournament chat."}
        </p>
        {requireRegistration && onRegister && (
          <button
            type="button"
            onClick={onRegister}
            className={userShell.tournamentBtnPrimary}
          >
            Register now
          </button>
        )}
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
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className={`p-2 rounded-lg shrink-0 ${dark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-200/70 text-gray-600"}`}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="min-w-0">
            <h2 className={`${userShell.strongSm} truncate`}>Tournament Chat</h2>
            <p className={`${userShell.mutedXs} truncate`}>{title}</p>
            {showRoomId && (
              <p className={`${userShell.mutedXs} mt-0.5 font-mono`}>
                Room ID: {eventId}
              </p>
            )}
          </div>
        </div>
        <div className={`flex items-center gap-2 ${userShell.mutedXs} shrink-0`}>
          <Users size={14} />
          <span>{participantCount ?? "—"} participants</span>
          <span
            className={`ml-2 inline-block h-2 w-2 rounded-full ${
              connected ? "bg-green-500" : "bg-amber-400"
            }`}
            title={connected ? "Live" : connectError || "Connecting..."}
          />
        </div>
        </div>
      </div>

      <div
        ref={messagesRef}
        className={`flex-1 overflow-y-auto px-4 py-4 space-y-3 ${userShell.messagesPanel}`}
      >
        {messages.length === 0 ? (
          <p className={`${userShell.emptyCenter} py-8`}>
            No messages yet. Say hello to participants.
          </p>
        ) : (
          messages.map((message) => {
            const isMine =
              userDTO?.id != null &&
              String(userDTO.id) === String(message.userId);
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
                    <p className={`text-xs font-semibold mb-1 ${dark ? "text-blue-400" : "text-blue-600"}`}>
                      {message.organizer ? "Organizer · " : ""}
                      {message.senderName}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.body}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isMine ? "text-blue-100" : dark ? "text-gray-500" : "text-gray-500"
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

      <div className={`border-t ${userShell.detailBorder} p-3 ${dark ? "bg-[#111827]" : "bg-white"}`}>
        {connectError && (
          <p className="text-xs text-amber-400 mb-2">{connectError}</p>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
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

export default TournamentChatPanel;
