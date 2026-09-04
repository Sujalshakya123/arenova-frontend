import { Link, useNavigate, useOutletContext } from "react-router";
import type { TournamentOutletContext } from "../components/TournamentLayout";
import TournamentChatPanel from "../../../components/TournamentChatPanel";

const OrganizerTournamentChat = () => {
  const navigate = useNavigate();
  const { tournament } = useOutletContext<TournamentOutletContext>();

  if (!/^\d+$/.test(tournament.id)) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-600">
          Tournament chat is available after the tournament is saved to the platform.
        </p>
        <Link
          to={`/organizer/tournaments/${tournament.id}/overview`}
          className="text-sm font-semibold text-blue-600 hover:underline mt-3 inline-block"
        >
          Back to overview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Tournament chat</h2>
        <p className="text-sm text-gray-500 mt-1">
          Communicate with registered players. The room is keyed to this
          tournament&apos;s event ID — share it with your team if needed.
        </p>
      </div>
      <TournamentChatPanel
        eventId={tournament.id}
        title={tournament.name}
        onBack={() => navigate(`/organizer/tournaments/${tournament.id}/overview`)}
        requireRegistration={false}
        showRoomId
        className="max-h-[calc(100vh-220px)]"
      />
    </div>
  );
};

export default OrganizerTournamentChat;
