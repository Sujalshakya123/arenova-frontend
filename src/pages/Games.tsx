import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/User/Navbar/Navbar";
import gamehero from "../assets/games-hero.jpg";
import { FiSearch } from "react-icons/fi";
import Footer from "../components/User/Navbar/Footer";
import Sidebar, { GAME_STATUS_FILTERS } from "../components/Sidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import { FaArrowRight } from "react-icons/fa";
import { usePlatformGames } from "../context/PlatformGamesContext";
import { gameDetailPath, resolveGameImage } from "../data/platformGames";

const PAGE_SIZE = 6;

const GAME_ALIASES: Record<string, string[]> = {
  "PUBG Mobile": ["pubg mobile", "pubg"],
  "Free Fire": ["free fire", "freefire"],
  Valorant: ["valorant"],
  MLBB: ["mlbb", "mobile legends"],
  CODM: ["codm", "call of duty mobile", "call of duty"],
  "Rainbow Six": ["rainbow six", "rainbow six siege"],
};

const Games = () => {
  const navigate = useNavigate();
  const { games } = usePlatformGames();
  const [query, setQuery] = useState("");
  const [activeGame, setActiveGame] = useState("All Games");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const gameOptions = useMemo(
    () => [{ name: "All Games" }, ...games.map((game) => ({ name: game.name }))],
    [games],
  );

  const filteredGames = useMemo(() => {
    const term = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesSearch = !term || game.name.toLowerCase().includes(term);
      const matchesStatus = status === "all" || game.status === status;
      if (!matchesSearch || !matchesStatus) return false;
      if (activeGame === "All Games") return true;
      if (game.name === activeGame) return true;
      const aliases = GAME_ALIASES[activeGame] ?? [activeGame.toLowerCase()];
      const name = game.name.toLowerCase();
      return aliases.some((alias) => name.includes(alias) || alias.includes(name));
    });
  }, [games, query, status, activeGame]);

  useEffect(() => {
    setPage(1);
  }, [query, activeGame, status]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedGames = filteredGames.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <>
      <div className="relative">
        <img
          src={gamehero}
          alt="Tournament Hero"
          className="w-full h-[420px] sm:h-[500px] xl:h-[580px] object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col z-10">
          <Navbar />
          <div className="flex flex-col justify-center items-center mt-8 sm:mt-[50px] px-4 sm:px-6 xl:px-[80px] text-center">
            <div className="items-center mb-2">
              <span className="text-white font-semibold text-xm tracking-[4px] sm:tracking-[6px] px-2 py-1">
                Explore Games
              </span>
            </div>

            <h2 className="text-white font-bold text-3xl sm:text-4xl xl:text-6xl leading-tight mb-4 max-w-[800px]">
              Browse Games
            </h2>

            <p className="text-white text-sm max-w-[520px] mb-8">
              Explore the games that power the esports world. From rising
              favorites to legendary titles, every game has a competitive scene
              waiting for you.
            </p>

            <form
              className="w-full max-w-[420px]"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
              }}
            >
              <div className="flex items-center rounded-full bg-[#2a2a2a] pl-5 pr-1.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)] focus-within:ring-2 focus-within:ring-blue-500/40 transition duration-200">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search games..."
                  className="flex-1 min-w-0 bg-transparent py-2.5 text-[15px] text-gray-200 placeholder:text-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold pl-4 pr-5 py-2.5 rounded-full cursor-pointer transition-colors duration-200"
                >
                  <FiSearch size={16} />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ResponsiveSidebarLayout
        sidebar={
          <Sidebar
            search={query}
            activeGame={activeGame}
            activeStatus={status}
            onSearchChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            onGameChange={(value) => {
              setActiveGame(value);
              setPage(1);
            }}
            onStatusChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            gameOptions={gameOptions}
            statusOptions={GAME_STATUS_FILTERS}
            statusLabel="Availability"
            searchPlaceholder="Search games..."
          />
        }
      >
        <div className="px-4 sm:px-6 xl:px-8 pb-12">
          <div className="max-w-[1060px] mx-auto">
            <div className="justify-between items-center mt-6 xl:mt-8 mb-6">
              <h2 className="text-white text-2xl font-bold">Games</h2>
              <p className="text-gray-400 text-sm mt-1">
                {filteredGames.length} title
                {filteredGames.length === 1 ? "" : "s"} match your filters
                {totalPages > 1 ? ` · Page ${currentPage} of ${totalPages}` : ""}.
              </p>
            </div>

            {filteredGames.length === 0 ? (
              <div className="bg-[#111827] border border-white/10 rounded-xl px-6 py-16 text-center mb-12">
                <h3 className="text-white text-lg font-semibold">
                  No games found
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  Try a different name, or switch All / Available / Coming soon.
                </p>
              </div>
            ) : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-[80px] mb-8 justify-items-center xl:justify-items-start">
              {pagedGames.map((game) => (
                <div
                  key={game.id}
                  className={`relative w-full max-w-[300px] h-[400px] rounded-xl overflow-hidden group ${
                    game.status === "available" ? "cursor-pointer" : "cursor-default"
                  }`}
                  onClick={() => {
                    if (game.status === "available") {
                      navigate(gameDetailPath(game.id));
                    }
                  }}
                >
                  <img
                    src={resolveGameImage(game)}
                    alt={game.name}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {game.status === "coming_soon" && (
                    <span className="absolute top-3 left-3 text-xs font-semibold uppercase px-2 py-1 rounded bg-black/70 text-white">
                      Coming Soon
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                    <p className="text-white text-sm font-semibold">{game.name}</p>
                    {game.status === "available" ? (
                      <span className="flex items-center gap-1 text-gray-200 text-sm mt-1 group-hover:text-white transition">
                        View Tournaments <FaArrowRight size={10} />
                      </span>
                    ) : (
                      <p className="text-gray-300 text-sm mt-1">Coming soon</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 mb-12 xl:mb-20 text-sm">
                <p className="text-gray-400">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}-
                  {Math.min(currentPage * PAGE_SIZE, filteredGames.length)} of{" "}
                  {filteredGames.length}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 disabled:opacity-40 cursor-pointer hover:bg-white/[0.06]"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => setPage(pageNumber)}
                        className={`min-w-9 h-9 px-2 rounded-lg text-sm font-medium cursor-pointer ${
                          pageNumber === currentPage
                            ? "bg-blue-600 text-white"
                            : "border border-white/10 text-gray-300 hover:bg-white/[0.06]"
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
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 disabled:opacity-40 cursor-pointer hover:bg-white/[0.06]"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            </>
            )}
          </div>
        </div>
      </ResponsiveSidebarLayout>

      <Footer />
    </>
  );
};

export default Games;
