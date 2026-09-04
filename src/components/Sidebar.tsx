import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";

export const FILTER_GAMES = [
  { name: "All Games" },
  { name: "PUBG Mobile" },
  { name: "Free Fire" },
  { name: "Valorant" },
  { name: "MLBB" },
  { name: "CODM" },
  { name: "Rainbow Six" },
] as const;

export const FILTER_STATUSES = [
  { name: "All", value: "ALL" },
  { name: "Upcoming", value: "Upcoming" },
  { name: "Live", value: "Live" },
  { name: "Completed", value: "Completed" },
] as const;

export const GAME_STATUS_FILTERS = [
  { name: "All", value: "all" },
  { name: "Available", value: "available" },
  { name: "Coming Soon", value: "coming_soon" },
] as const;

export type FilterStatusOption = { name: string; value: string };

type Props = {
  search?: string;
  activeGame?: string;
  activeStatus?: string;
  onSearchChange?: (value: string) => void;
  onGameChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  showStatus?: boolean;
  showGames?: boolean;
  gameOptions?: { name: string }[];
  statusOptions?: readonly FilterStatusOption[];
  statusLabel?: string;
  searchPlaceholder?: string;
};

const Sidebar = ({
  search: searchProp,
  activeGame: gameProp,
  activeStatus: statusProp,
  onSearchChange,
  onGameChange,
  onStatusChange,
  showStatus = true,
  showGames = true,
  gameOptions,
  statusOptions = FILTER_STATUSES,
  statusLabel = "Status",
  searchPlaceholder = "Search...",
}: Props) => {
  const [searchLocal, setSearchLocal] = useState("");
  const [gameLocal, setGameLocal] = useState("All Games");
  const [statusLocal, setStatusLocal] = useState("ALL");

  const search = searchProp ?? searchLocal;
  const activeGame = gameProp ?? gameLocal;
  const activeStatus = statusProp ?? statusLocal;

  const setSearch = (value: string) => {
    onSearchChange?.(value);
    if (searchProp === undefined) setSearchLocal(value);
  };

  const setGame = (value: string) => {
    onGameChange?.(value);
    if (gameProp === undefined) setGameLocal(value);
  };

  const setStatus = (value: string) => {
    onStatusChange?.(value);
    if (statusProp === undefined) setStatusLocal(value);
  };

  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 bg-[#0B0F1A] border-r border-white/5 flex flex-col">
      <div className="px-5 pt-7 pb-4">
        <div className="flex items-center gap-2 mb-5">
          <div>
            <p className="text-white text-sm font-semibold leading-tight">
              Filters
            </p>
            <p className="text-gray-400 text-xs">Browse & refine</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 focus-within:border-blue-500/50 focus-within:bg-white/[0.06] transition">
          <FiSearch size={16} className="text-gray-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-transparent text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-7">
        {showGames && (
        <div>
          <h2 className="px-2 mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-300">
            Game Title
          </h2>
          <ul className="flex flex-col gap-1">
            { (gameOptions ?? FILTER_GAMES).map((item) => {
              const isActive = activeGame === item.name;
              return (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => setGame(item.name)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        )}

        {showStatus && (
          <div>
            <h2 className="px-2 mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-300 flex items-center gap-2">
              <SlidersHorizontal size={12} />
              {statusLabel}
            </h2>
            <ul className="flex flex-col gap-1">
              {statusOptions.map((item) => {
                const isActive = activeStatus === item.value;
                return (
                  <li key={item.value}>
                    <button
                      type="button"
                      onClick={() => setStatus(item.value)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
