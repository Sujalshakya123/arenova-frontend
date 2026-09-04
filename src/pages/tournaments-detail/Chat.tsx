import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useTournamentDetail } from "./TournamentDetailContext";
import {
  tournamentDetailPath,
  tournamentDetailSubPath,
} from "./resolveTournamentDetail";
import TournamentChatPanel from "../../components/TournamentChatPanel";
import { userShell } from "../../theme/userShellTheme";

const TournamentChat = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  const { isAuthenticated } = useAuth();
  const { info } = useTournamentDetail();

  const emptyShell = `${userShell.detailPanelLg} p-8 text-center`;

  if (!eventId || !/^\d+$/.test(eventId)) {
    return (
      <div className={emptyShell}>
        <p className={`${userShell.body} mb-4`}>
          Tournament chat is available for registered platform tournaments.
        </p>
        <Link to="/tournaments" className={userShell.linkBold}>
          Browse tournaments
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={emptyShell}>
        <p className={`${userShell.body} mb-4`}>
          Log in and register for this tournament to join the chat.
        </p>
        <button
          type="button"
          onClick={() =>
            navigate(
              `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`,
            )
          }
          className={userShell.tournamentBtnPrimary}
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <TournamentChatPanel
      eventId={eventId}
      title={info.title}
      onBack={() => navigate(tournamentDetailPath(eventId))}
      requireRegistration
      onRegister={() => navigate(tournamentDetailSubPath("register", eventId))}
    />
  );
};

export default TournamentChat;
