import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Navbar from "../components/User/Navbar/Navbar";
import tourhero from "../assets/download.jpg";
import Sidebar from "../components/Sidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import Footer from "../components/User/Navbar/Footer";
import { FaUsers } from "react-icons/fa";
import { usePlatformGames } from "../context/PlatformGamesContext";
import { type UserTournamentCard } from "../data/userTournaments";
import { tournamentDetailPath } from "./tournaments-detail/resolveTournamentDetail";
import { getPublicEvents, mapApiEventToCard } from "../services/eventApi";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";
import { isCardRegistrationOpen } from "../utils/registrationWindow";
import { useMyRegisteredEventIds } from "../hooks/useMyRegisteredEventIds";
import OrganizerBadge from "../components/OrganizerBadge";
import {
  filterCardsByBrowseTab,
  matchesGameFilter,
  resolveTournamentGameFilter,
  type TournamentsBrowseTab,
} from "../utils/tournamentGameMatch";

const PAGE_SIZE = 6;

const Tournaments = () => {
  const navigate = useNavigate();
  const { games } = usePlatformGames();
  const registeredIds = useMyRegisteredEventIds();
  const [searchParams] = useSearchParams();
  const gameParam = searchParams.get("game");
  const gameFilterParam = searchParams.get("gameFilter");
  const tabParam = searchParams.get("tab") as TournamentsBrowseTab | null;

  const [search, setSearch] = useState("");
  const [activeGame, setActiveGame] = useState(() =>
    resolveTournamentGameFilter(gameParam, gameFilterParam, games),
  );
  const [activeStatus, setActiveStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [apiCards, setApiCards] = useState<UserTournamentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setActiveGame(resolveTournamentGameFilter(gameParam, gameFilterParam, games));
  }, [gameParam, gameFilterParam, games]);

  useEffect(() => {
    if (tabParam === "open" || tabParam === "past") {
      setActiveStatus("ALL");
    }
  }, [tabParam]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await getPublicEvents();
        setApiCards(response.data.map(mapApiEventToCard));
      } catch {
        setApiCards([]);
        setLoadError("Could not load tournaments from server.");
      } finally {
        setLoading(false);
      }
    };
    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, []);

  const filteredTournaments = useMemo(() => {
    const term = search.trim().toLowerCase();
    const byTab = filterCardsByBrowseTab(apiCards, tabParam);

    return byTab.filter((tournament) => {
      const matchesSearch =
        !term ||
        tournament.title.toLowerCase().includes(term) ||
        tournament.game.toLowerCase().includes(term);
      const matchesStatus =
        activeStatus === "ALL" || tournament.status === activeStatus;
      return (
        matchesSearch &&
        matchesGameFilter(tournament.game, activeGame) &&
        matchesStatus
      );
    });
  }, [search, activeGame, activeStatus, apiCards, tabParam]);

  const totalPages = Math.max(1, Math.ceil(filteredTournaments.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedTournaments = filteredTournaments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, activeGame, activeStatus, tabParam]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <>
      <div className="relative">
        <img
          src={tourhero}
          alt="Tournament Hero"
          className="w-full h-[580px] object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col z-10">
          <Navbar />
          <div className="flex flex-col justify-center items-center mt-[50px] px-4 sm:px-[80px] text-center">
            <div className="items-center mb-2">
              <span className="text-white font-semibold text-xm tracking-[6px] px-2 py-1">
                COMPETE · CONQUER · CLAIM
              </span>
            </div>

            <h2 className="text-white font-bold text-3xl sm:text-6xl leading-tight mb-4 max-w-[800px]">
              CREATE YOUR TEAM AND <br className="hidden sm:block" /> DOMINATE
              THE ARENA
            </h2>

            <p className="text-white text-sm max-w-[520px] mb-8">
              Join competitive esports tournaments, create your squad, battle
              against players, and rise to the top with Arenova.
            </p>
          </div>
        </div>
      </div>

      <ResponsiveSidebarLayout
        sidebar={
          <Sidebar
            search={search}
            activeGame={activeGame}
            activeStatus={activeStatus}
            onSearchChange={setSearch}
            onGameChange={setActiveGame}
            onStatusChange={setActiveStatus}
            searchPlaceholder="Search tournaments..."
          />
        }
      >
        <div className="flex-1 px-4 sm:px-[80px]">
          <div className="justify-between items-center px-4 mt-8 mb-6">
            <h2 className="text-white text-2xl font-bold">Active Tournaments</h2>
            <p className="text-gray-400 text-sm mt-1">
              Secure your spot for next esports event.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-20 mt-8 px-4">
            {loading ? (
              <div className="col-span-full bg-[#111827] border border-white/10 rounded-xl px-6 py-16 text-center">
                <p className="text-gray-400 text-sm">Loading tournaments...</p>
              </div>
            ) : loadError ? (
              <div className="col-span-full bg-[#111827] border border-white/10 rounded-xl px-6 py-16 text-center">
                <h3 className="text-white text-lg font-semibold">
                  Could not load tournaments
                </h3>
                <p className="text-gray-400 text-sm mt-2">{loadError}</p>
              </div>
            ) : filteredTournaments.length === 0 ? (
              <div className="col-span-full bg-[#111827] border border-white/10 rounded-xl px-6 py-16 text-center">
                <h3 className="text-white text-lg font-semibold">
                  No tournaments yet
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  When organizers publish events, they will show up here.
                </p>
              </div>
            ) : (
              pagedTournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="bg-[#111827] rounded-xl overflow-hidden max-w-[400px]"
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
                    <button
                      type="button"
                      onClick={() =>
                        navigate(tournamentDetailPath(tournament.id))
                      }
                      className={`w-full text-white text-sm font-semibold py-2 rounded-lg cursor-pointer transition ${
                        registeredIds.has(tournament.id)
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : isCardRegistrationOpen(tournament)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-500 hover:bg-slate-600"
                      }`}
                    >
                      {registeredIds.has(tournament.id)
                        ? "Registered"
                        : isCardRegistrationOpen(tournament)
                          ? "Register"
                          : "Registration Closed"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!loading && !loadError && totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pb-10">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white transition disabled:opacity-40 disabled:hover:bg-[#1e2535] disabled:hover:text-gray-400 cursor-pointer"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`w-8 h-8 rounded font-semibold transition cursor-pointer ${
                      pageNumber === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="w-8 h-8 rounded bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white transition disabled:opacity-40 disabled:hover:bg-[#1e2535] disabled:hover:text-gray-400 cursor-pointer"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </ResponsiveSidebarLayout>

      <Footer />
    </>
  );
};

export default Tournaments;
