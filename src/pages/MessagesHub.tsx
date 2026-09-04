import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Headphones, MessageSquare, Trophy } from "lucide-react";
import { toast } from "react-toastify";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import SupportChatPanel from "../components/SupportChatPanel";
import TournamentChatPanel from "../components/TournamentChatPanel";
import { getApiErrorMessage } from "../api/axios";
import { getChatRooms, type ChatRoom } from "../services/chatApi";
import { resolveGameIconByName } from "../data/platformGames";
import { tournamentDetailSubPath } from "./tournaments-detail/resolveTournamentDetail";
import {
  isUserShellDark,
  messagesRoomClass,
  userShell,
} from "../theme/userShellTheme";

const roomKey = (room: ChatRoom) => `${room.type}:${room.id}`;

const MessagesHub = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedParam = searchParams.get("room") || "support";

  const selectedRoom = useMemo(() => {
    if (selectedParam === "support" || selectedParam.startsWith("support")) {
      return rooms.find((r) => r.type === "SUPPORT") ?? null;
    }
    const eventMatch = selectedParam.match(/^(?:event:)?(\d+)$/);
    if (eventMatch) {
      return (
        rooms.find((r) => r.type === "EVENT" && r.id === eventMatch[1]) ?? null
      );
    }
    return rooms.find((r) => r.type === "SUPPORT") ?? null;
  }, [rooms, selectedParam]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await getChatRooms();
        setRooms(response.data);
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not load conversations."));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const selectRoom = (room: ChatRoom) => {
    if (room.type === "SUPPORT") {
      setSearchParams({ room: "support" });
    } else {
      setSearchParams({ room: `event:${room.id}` });
    }
  };

  const dark = isUserShellDark;

  const roomAvatar = (room: ChatRoom) => {
    if (room.type === "SUPPORT") {
      return (
        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Headphones size={18} />
        </div>
      );
    }
    const icon = room.avatarUrl || resolveGameIconByName(room.subtitle || room.imageKey || undefined);
    if (icon) {
      return (
        <img
          src={icon}
          alt=""
          className={`w-11 h-11 rounded-full object-cover shrink-0 ${dark ? "border border-white/10" : "border border-gray-200"}`}
        />
      );
    }
    return (
      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${dark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700"}`}>
        <Trophy size={18} />
      </div>
    );
  };

  return (
    <div className={userShell.pageFlex}>
      <Navbar variant={isUserShellDark ? "overlay" : "solid"} />
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 xl:px-[80px] py-6">
        <div className="mb-5">
          <h1 className={`${userShell.h1} flex items-center gap-2`}>
            <MessageSquare size={22} className="text-blue-500" />
            Messages
          </h1>
          <p className={userShell.subtitle}>
            Support and your registered tournament chats in one place.
          </p>
        </div>

        <div className={userShell.messagesShell}>
          {/* Left rail */}
          <aside className={userShell.messagesAside}>
            <div className={`px-4 py-3 border-b ${userShell.detailBorder}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${userShell.muted}`}>
                Conversations
              </p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <p className={`${userShell.empty} p-4`}>Loading...</p>
              ) : rooms.length === 0 ? (
                <p className={`${userShell.empty} p-4`}>No conversations yet.</p>
              ) : (
                rooms.map((room) => {
                  const active =
                    selectedRoom != null && roomKey(room) === roomKey(selectedRoom);
                  return (
                    <button
                      key={roomKey(room)}
                      type="button"
                      onClick={() => selectRoom(room)}
                      className={messagesRoomClass(active)}
                    >
                      {roomAvatar(room)}
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${userShell.strong} truncate`}>
                          {room.title}
                        </p>
                      <p className={`text-xs ${userShell.muted} truncate`}>
                          {room.lastMessage || room.subtitle || "—"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* Right pane */}
          <section className={userShell.messagesPanel}>
            {!selectedRoom ? (
              <div className="h-full min-h-[480px] flex flex-col items-center justify-center text-center px-6">
                <MessageSquare size={40} className="text-gray-500 mb-3" />
                <p className={userShell.strong}>
                  Select a conversation
                </p>
                <p className={`${userShell.bodySm} mt-1 max-w-sm`}>
                  Choose Support or a tournament room from the left.
                </p>
                <Link
                  to="/tournaments"
                  className={`mt-4 ${userShell.linkBold}`}
                >
                  Browse tournaments
                </Link>
              </div>
            ) : selectedRoom.type === "SUPPORT" ? (
              <SupportChatPanel className="max-h-[calc(100vh-220px)] min-h-[480px]" />
            ) : (
              <TournamentChatPanel
                eventId={selectedRoom.id}
                title={selectedRoom.title}
                requireRegistration
                onRegister={() =>
                  navigate(tournamentDetailSubPath("register", selectedRoom.id))
                }
                className="max-h-[calc(100vh-220px)] min-h-[480px]"
              />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MessagesHub;
