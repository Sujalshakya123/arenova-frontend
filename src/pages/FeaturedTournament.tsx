import { useEffect, useState } from "react";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router";
import { type UserTournamentCard } from "../data/userTournaments";
import {
  tournamentDetailPath,
  tournamentDetailSubPath,
} from "./tournaments-detail/resolveTournamentDetail";
import { getPublicEvents, mapApiEventToCard } from "../services/eventApi";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";
import { isCardRegistrationOpen } from "../utils/registrationWindow";
import { useMyRegisteredEventIds } from "../hooks/useMyRegisteredEventIds";
import OrganizerBadge from "../components/OrganizerBadge";

const FeaturedTournament = () => {
  const navigate = useNavigate();
  const registeredIds = useMyRegisteredEventIds();
  const [cards, setCards] = useState<UserTournamentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await getPublicEvents();
        setCards(response.data.map(mapApiEventToCard).slice(0, 4));
      } catch {
        setCards([]);
        setLoadError("Could not load featured tournaments.");
      } finally {
        setLoading(false);
      }
    };
    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, []);

  return (
    <section className="bg-[#0B0F1A] px-4 sm:px-6 xl:px-[80px] pt-10 pb-10 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h2 className="text-white text-2xl font-bold">Featured Tournaments</h2>
          <p className="text-gray-400 text-sm mt-1">
            Hand-picked competitive events from verified organizers.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/tournaments")}
          className="flex items-center gap-2 text-white text-sm cursor-pointer hover:text-blue-400 transition w-fit"
        >
          View all matches <FaArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 mb-10 mt-8">
        {loading ? (
          <p className="text-gray-400 text-sm col-span-full">Loading tournaments...</p>
        ) : loadError ? (
          <div className="col-span-full bg-[#111827] border border-amber-500/30 rounded-xl px-6 py-12 text-center">
            <h3 className="text-white text-lg font-semibold">Could not load</h3>
            <p className="text-amber-300/90 text-sm mt-2">{loadError}</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="col-span-full bg-[#111827] border border-white/10 rounded-xl px-6 py-12 text-center">
            <h3 className="text-white text-lg font-semibold">No tournaments yet</h3>
            <p className="text-gray-400 text-sm mt-2">
              Published organizer tournaments will appear here.
            </p>
          </div>
        ) : (
          cards.map((tournament) => {
            const alreadyRegistered = registeredIds.has(tournament.id);
            const registrationOpen = isCardRegistrationOpen(tournament);
            return (
            <div
              key={tournament.id}
              className="bg-[#111827] rounded-xl overflow-hidden"
            >
              <img
                src={tournament.image}
                alt={tournament.alt}
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
                  <span>{tournament.date}</span>
                  <span className="flex items-center gap-1">
                    <FaUsers size={18} /> {tournament.slots}
                  </span>
                </div>
                <h3 className="text-black font-semibold text-base mb-1">
                  {tournament.title}
                </h3>
                {tournament.organizerName ? (
                  <OrganizerBadge
                    name={tournament.organizerName}
                    photoUrl={tournament.organizerPhotoUrl}
                  />
                ) : (
                  <div className="mb-3" />
                )}
                <div className="flex gap-26 mb-4">
                  <div>
                    <p className="text-gray-700 text-xs font-medium mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      {tournament.prizePool}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-xs font-medium mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">
                      {tournament.entryFee}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {!alreadyRegistered && registrationOpen && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(tournamentDetailSubPath("register", tournament.id))
                      }
                      className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg cursor-pointer transition"
                    >
                      Register
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(tournamentDetailPath(tournament.id))}
                    className={`${
                      alreadyRegistered || !registrationOpen ? "w-full" : "w-1/2"
                    } ${
                      alreadyRegistered
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-slate-700 hover:bg-blue-700"
                    } text-white text-sm font-semibold py-2 rounded-lg cursor-pointer transition`}
                  >
                    {alreadyRegistered
                      ? "Registered"
                      : !registrationOpen
                        ? "Registration Closed"
                        : "View Details"}
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default FeaturedTournament;
