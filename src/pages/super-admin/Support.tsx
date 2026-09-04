import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Send, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "../../api/axios";
import {
  getAdminSupportThreadMessages,
  getAdminSupportThreads,
  replyAdminSupportThread,
  type SupportThread,
} from "../../services/adminApi";
import type { ChatMessage } from "../../services/chatApi";

const formatTime = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminSupport = () => {
  const [threads, setThreads] = useState<SupportThread[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  const selectedThread =
    threads.find((t) => t.userId === selectedUserId) ?? null;

  const loadThreads = useCallback(async () => {
    try {
      setLoadingThreads(true);
      const response = await getAdminSupportThreads();
      setThreads(response.data);
      setSelectedUserId((prev) => {
        if (prev != null && response.data.some((t) => t.userId === prev)) {
          return prev;
        }
        return response.data[0]?.userId ?? null;
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not load support threads."));
    } finally {
      setLoadingThreads(false);
    }
  }, []);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (selectedUserId == null) {
      setMessages([]);
      return;
    }

    const load = async () => {
      try {
        setLoadingMessages(true);
        const response = await getAdminSupportThreadMessages(selectedUserId);
        setMessages(response.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not load conversation."));
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };

    void load();
  }, [selectedUserId]);

  useEffect(() => {
    const container = messagesRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Light poll so new player messages appear without refresh
  useEffect(() => {
    if (selectedUserId == null) return;

    const intervalId = window.setInterval(() => {
      void getAdminSupportThreadMessages(selectedUserId)
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

      void getAdminSupportThreads()
        .then((response) => setThreads(response.data))
        .catch(() => undefined);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [selectedUserId]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || selectedUserId == null || sending) return;

    setSending(true);
    try {
      const response = await replyAdminSupportThread(selectedUserId, {
        body: trimmed,
      });
      setMessages((prev) => {
        if (prev.some((m) => m.id === response.data.id)) return prev;
        return [...prev, response.data];
      });
      setInput("");
      void loadThreads();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not send reply."));
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

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-700">
        Reply to player Support chats. Messages appear in their Messages hub.
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row h-[min(560px,calc(100vh-220px))] max-h-[calc(100vh-220px)]">
        <aside className="w-full md:w-[300px] shrink-0 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col min-h-0 max-h-[38vh] md:max-h-none">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-700">
              Threads
            </p>
            <button
              type="button"
              onClick={() => void loadThreads()}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Refresh
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <p className="text-sm text-gray-600 p-4">Loading...</p>
            ) : threads.length === 0 ? (
              <p className="text-sm text-gray-600 p-4">
                No support conversations yet. They appear when a player messages
                Support.
              </p>
            ) : (
              threads.map((thread) => {
                const active = thread.userId === selectedUserId;
                return (
                  <button
                    key={thread.userId}
                    type="button"
                    onClick={() => setSelectedUserId(thread.userId)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition ${
                      active
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center shrink-0 mt-0.5">
                      <UserRound size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {thread.username}
                        </p>
                        <span className="text-xs text-gray-600 shrink-0">
                          {formatTime(thread.lastMessageAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">
                        {thread.email}
                      </p>
                      <p className="text-sm text-gray-700 truncate mt-0.5">
                        {thread.lastSenderType === "SUPPORT" ? "You: " : ""}
                        {thread.lastMessage || "—"}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#f7f8fb]">
          {!selectedThread ? (
            <div className="flex-1 flex items-center justify-center text-center px-6 py-10">
              <div>
                <Headphones size={36} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  Select a player thread
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100 bg-white">
                <p className="text-sm font-bold text-gray-900">
                  {selectedThread.username}
                </p>
                <p className="text-sm text-gray-700">{selectedThread.email}</p>
              </div>

              <div
                ref={messagesRef}
                className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-2"
              >
                {loadingMessages ? (
                  <p className="text-sm text-gray-600 text-center py-8">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-gray-600 text-center py-8">
                    No messages in this thread.
                  </p>
                ) : (
                  messages.map((message) => {
                    const isSupport = message.senderRole === "SUPPORT";
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSupport ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 ${
                            isSupport
                              ? "bg-blue-600 text-white rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                          }`}
                        >
                          <p
                            className={`text-[11px] font-semibold mb-1 ${
                              isSupport ? "text-blue-100" : "text-blue-600"
                            }`}
                          >
                            {isSupport ? "Arenova Support" : message.senderName}
                          </p>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.body}
                          </p>
                          <p
                            className={`text-[10px] mt-1 ${
                              isSupport ? "text-blue-100" : "text-gray-400"
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

              <div className="border-t border-gray-100 p-3 bg-white shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    placeholder="Reply as Arenova Support..."
                    className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 min-h-[52px] max-h-28"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={!input.trim() || sending}
                    className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer"
                    aria-label="Send reply"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminSupport;
