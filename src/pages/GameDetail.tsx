import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Building2, Calendar, ChevronLeft, ChevronRight, Monitor } from "lucide-react";
import { FaUsers } from "react-icons/fa";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import { usePlatformGames } from "../context/PlatformGamesContext";
import { resolveGameBanner, resolveGameImage } from "../data/platformGames";
import type { UserTournamentCard } from "../data/userTournaments";
import { getPublicEvents, mapApiEventToCard } from "../services/eventApi";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";
import { isCardRegistrationOpen } from "../utils/registrationWindow";
import {
  filterCardsByGameDetailTab,
  gameDetailTabToBrowseTab,
  matchesPlatformGame,
  platformGameToFilterLabel,
  tournamentsBrowsePath,
  type GameDetailTab,
} from "../utils/tournamentGameMatch";
import { detailTabClass, userShell } from "../theme/userShellTheme";
import { gameInfo as fallbackGameInfo, tournamentTabs } from "./game-detail/gameData";
import { tournamentDetailPath } from "./tournaments-detail/resolveTournamentDetail";
import NotFound from "./NotFound";
import { useMyRegisteredEventIds } from "../hooks/useMyRegisteredEventIds";
import OrganizerBadge from "../components/OrganizerBadge";

const SLIDE_SIZE = 3;

const GameDetail = () => {
  const navigate = useNavigate();
  const { games } = usePlatformGames();
  const registeredIds = useMyRegisteredEventIds();
  const [searchParams] = useSearchParams();
  const requestedId = searchParams.get("id");
  const gameId = requestedId;
  const [activeTab, setActiveTab] = useState<GameDetailTab>("All Tournaments");
  const [slide, setSlide] = useState(0);
  const [apiCards, setApiCards] = useState<UserTournamentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const resolvedGame = gameId
    ? games.find((game) => game.id === gameId)
    : undefined;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await getPublicEvents();
        if (!cancelled) {
          setApiCards(response.data.map(mapApiEventToCard));
        }
      } catch {
        if (!cancelled) {
          setApiCards([]);
          setLoadError("Could not load tournaments from server.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    const unsubscribe = subscribeRegistrationsUpdated(() => {
      void load();
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const gameTournaments = useMemo(() => {
    if (!resolvedGame) return [];
    return apiCards.filter((card) => matchesPlatformGame(card.game, resolvedGame));
  }, [apiCards, resolvedGame]);

  const tournaments = useMemo(
    () => filterCardsByGameDetailTab(gameTournaments, activeTab),
    [gameTournaments, activeTab],
  );

  const totalSlides = Math.max(1, Math.ceil(tournaments.length / SLIDE_SIZE));
  const currentSlide = Math.min(slide, totalSlides - 1);
  const visibleTournaments = tournaments.slice(
    currentSlide * SLIDE_SIZE,
    currentSlide * SLIDE_SIZE + SLIDE_SIZE,
  );

  useEffect(() => {
    setSlide(0);
  }, [activeTab, gameId]);

  useEffect(() => {
    if (slide > totalSlides - 1) setSlide(Math.max(0, totalSlides - 1));
  }, [slide, totalSlides]);

  const browsePath = tournamentsBrowsePath({
    gameId: resolvedGame?.id,
    gameFilter: resolvedGame
      ? platformGameToFilterLabel(resolvedGame)
      : undefined,
    tab: gameDetailTabToBrowseTab(activeTab),
  });

  if (!requestedId || !resolvedGame) {
    return (
      <NotFound
        title="Game not found"
        description="This game is not on the platform or the link is invalid."
        backTo="/games"
        backLabel="Browse games"
      />
    );
  }

  const game = resolvedGame;

  if (game.status === "coming_soon") {
    return (
      <>
        <div className="relative min-h-[50vh] bg-[#0B0F1A]">
          <Navbar />
          <div className="px-4 sm:px-6 xl:px-[80px] py-20 text-center">
            <span className="inline-block text-xs font-semibold uppercase px-2 py-1 rounded bg-white/10 text-white mb-4">
              Coming Soon
            </span>
            <h1 className="text-white text-3xl font-bold">{game.name}</h1>
            <p className="text-gray-400 text-sm mt-3 max-w-md mx-auto">
              This game is not live on Arenova yet. Tournaments will appear here once
              a platform admin activates the game.
            </p>
            <button
              type="button"
              onClick={() => navigate("/games")}
              className="mt-8 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              Browse available games
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const info = {
    name: game.name,
    genre: game.detail?.genre ?? fallbackGameInfo.genre,
    partner: game.detail?.partner ?? fallbackGameInfo.partner,
    description: game.detail?.description ?? fallbackGameInfo.description,
    about: game.detail?.about ?? fallbackGameInfo.about,
    developer: game.detail?.developer ?? fallbackGameInfo.developer,
    releaseDate: game.detail?.releaseDate ?? fallbackGameInfo.releaseDate,
    platforms: game.detail?.platforms ?? fallbackGameInfo.platforms,
  };

  const banner = resolveGameBanner(game);
  const icon = resolveGameImage(game);

  return (
    <>
      <div className="relative">
        <img
          src={banner}
          alt={info.name}
          className="w-full h-[280px] sm:h-[340px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
        <div className="absolute inset-0 flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col justify-end px-4 sm:px-6 xl:px-[80px] pb-8 xl:pb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                {info.genre}
              </span>
              <span className="text-gray-300 text-xs font-medium">
                {info.partner}
              </span>
            </div>
            <h1 className="text-white font-bold text-3xl sm:text-4xl xl:text-5xl mb-3">{info.name}</h1>
            <p className="text-gray-300 text-sm max-w-[520px] leading-relaxed mb-6">
              {info.description}
            </p>
            <button
              type="button"
              onClick={() => navigate(browsePath)}
              className="inline-flex w-fit px-4 py-2 rounded-md text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer mb-4"
            >
              View Tournaments
            </button>
          </div>
        </div>
      </div>

      <div className={userShell.section}>
        <div className="px-4 sm:px-6 xl:px-[80px] py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            <div className="flex-[2] min-w-0 space-y-8 w-full">
              <section>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className={userShell.h3}>Active Tournaments</h2>
                    <p className={userShell.subtitle}>
                      Currently live or upcoming events for {info.name}.
                    </p>
                  </div>
                  <Link to={browsePath} className={userShell.linkBold}>
                    View all →
                  </Link>
                </div>

                <div
                  className={`flex gap-4 sm:gap-6 ${userShell.tabBorder} mb-6 overflow-x-auto`}
                >
                  {tournamentTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab as GameDetailTab)}
                      className={detailTabClass(activeTab === tab)}
                    >
                      {tab}
                      {tab === "Registration Open" && (
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <p className={`${userShell.muted} py-8`}>Loading tournaments...</p>
                ) : loadError ? (
                  <p className="text-sm text-amber-400 py-8">{loadError}</p>
                ) : tournaments.length === 0 ? (
                  <p className={`${userShell.muted} py-8`}>
                    {gameTournaments.length === 0
                      ? `No tournaments listed for ${info.name} yet.`
                      : `No ${activeTab === "Past Events" ? "past" : activeTab === "Registration Open" ? "open registration" : ""} tournaments for ${info.name}.`}
                  </p>
                ) : (
                  <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 justify-items-center sm:justify-items-start">
                      {visibleTournaments.map((tournament) => (
                        <div
                          key={tournament.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 w-full max-w-[320px]"
                        >
                          <img
                            src={tournament.image}
                            alt={tournament.title}
                            className="w-full h-[140px] object-cover"
                          />
                          <div className="px-3 pb-4 pt-3">
                            <div className="flex justify-between items-center text-xs text-gray-800 mb-2 gap-2">
                              <span className="truncate">{tournament.date}</span>
                              <span className="flex items-center gap-1 shrink-0">
                                <FaUsers size={14} /> {tournament.slots}
                              </span>
                            </div>
                            <h3 className="text-black font-semibold text-base mb-1 line-clamp-2">
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
                            <div className="flex gap-8 mb-4">
                              <div>
                                <p className="text-gray-700 text-xs font-medium mb-1">
                                  PRIZE POOL
                                </p>
                                <p className="text-black text-sm font-semibold">
                                  {tournament.prizePool}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-700 text-xs font-medium mb-1">
                                  ENTRY FEE
                                </p>
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
                      ))}
                    </div>

                    {totalSlides > 1 && (
                      <div className="flex items-center justify-center gap-3 mt-6">
                        <button
                          type="button"
                          aria-label="Previous tournaments"
                          disabled={currentSlide <= 0}
                          onClick={() =>
                            setSlide((s) => Math.max(0, s - 1))
                          }
                          className={userShell.carouselBtn}
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: totalSlides }, (_, i) => (
                            <button
                              key={i}
                              type="button"
                              aria-label={`Go to slide ${i + 1}`}
                              onClick={() => setSlide(i)}
                              className={`h-2 rounded-full transition cursor-pointer ${
                                i === currentSlide
                                  ? userShell.carouselDotActive
                                  : userShell.carouselDot
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          type="button"
                          aria-label="Next tournaments"
                          disabled={currentSlide >= totalSlides - 1}
                          onClick={() =>
                            setSlide((s) =>
                              Math.min(totalSlides - 1, s + 1),
                            )
                          }
                          className={userShell.carouselBtn}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>

            <aside className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-6">
              <div className={userShell.detailPanel}>
                <h3 className={`${userShell.h2Base} mb-3`}>About {info.name}</h3>
                <p className={`${userShell.body} leading-relaxed mb-5`}>
                  {info.about}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className={userShell.detailIconWrapLg}>
                      <Building2
                        size={14}
                        className="text-gray-400"
                      />
                    </div>
                    <div>
                      <p className={userShell.muted}>Developer</p>
                      <p className={userShell.strongSm}>{info.developer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className={userShell.detailIconWrapLg}>
                      <Calendar size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className={userShell.muted}>Release Date</p>
                      <p className={userShell.strongSm}>{info.releaseDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className={userShell.detailIconWrapLg}>
                      <Monitor size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className={userShell.muted}>Platforms</p>
                      <p className={userShell.strongSm}>{info.platforms}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`mt-5 pt-4 border-t ${userShell.detailBorder} flex items-center gap-3`}
                >
                  <img
                    src={icon}
                    alt={info.name}
                    className="w-10 h-10 rounded-lg object-cover bg-white"
                  />
                  <p className={userShell.strongSm}>{info.name}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GameDetail;
