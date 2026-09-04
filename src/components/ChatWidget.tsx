import { useLocation, useNavigate } from "react-router";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const HIDDEN_PATHS = ["/login", "/sign-up", "/otp", "/oauth-success"];

const isHiddenPath = (pathname: string) =>
  HIDDEN_PATHS.includes(pathname) ||
  pathname.startsWith("/super-admin") ||
  pathname.startsWith("/organizer") ||
  pathname.startsWith("/tournaments-detail/chat") ||
  pathname.startsWith("/messages");

/**
 * Floating entry to the Messages hub (Phase 2).
 * Fake local Support bot removed — real Support lives in /messages.
 */
const ChatWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isHiddenPath(location.pathname)) return null;

  const handleOpen = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/messages?room=support" },
        replace: false,
      });
      return;
    }
    navigate("/messages?room=support");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        type="button"
        onClick={handleOpen}
        className="group w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-[0_10px_28px_rgba(37,99,235,0.4)] cursor-pointer transition-all hover:scale-105 active:scale-95"
        aria-label="Open messages"
        title="Messages"
      >
        <MessageCircle size={22} />
      </button>
    </div>
  );
};

export default ChatWidget;
