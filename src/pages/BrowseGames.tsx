import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { usePlatformGames } from "../context/PlatformGamesContext";
import { gameDetailPath, resolveGameImage } from "../data/platformGames";

const BrowseGames = () => {
  const navigate = useNavigate();
  const { games } = usePlatformGames();

  return (
    <section className="bg-[#0B0F1A] px-4 sm:px-6 xl:px-[80px] pt-10 pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
        <div>
          <h2 className="text-white text-2xl font-bold">Browse Games</h2>
          <p className="text-gray-400 text-sm mt-1">
            Pick a game to see active and upcoming tournaments
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/games")}
          className="flex items-center gap-2 text-white text-sm cursor-pointer hover:text-blue-400 transition w-fit"
        >
          View all games <FaArrowRight size={14} />
        </button>
      </div>

      {games.length === 0 ? (
        <div className="bg-[#111827] border border-white/10 rounded-xl px-6 py-16 text-center">
          <h3 className="text-white text-lg font-semibold">No games found</h3>
          <p className="text-gray-400 text-sm mt-2">
            Games added by admins will appear here.
          </p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8 justify-items-center xl:justify-items-start">
        {games.map((game) => (
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
      )}
    </section>
  );
};

export default BrowseGames;
