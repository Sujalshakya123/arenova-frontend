import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadPlatformGames,
  savePlatformGames,
  type PlatformGame,
} from "../data/platformGames";
import {
  loadPlatformTournaments,
  savePlatformTournaments,
  type PlatformTournament,
} from "../data/platformTournaments";
import { getAllGames, mapApiGameToPlatform } from "../services/gameApi";

type PlatformGamesContextValue = {
  games: PlatformGame[];
  setGames: (next: PlatformGame[]) => void;
  refreshGames: () => Promise<void>;
  gamesFromApi: boolean;
  tournaments: PlatformTournament[];
  setTournaments: (next: PlatformTournament[]) => void;
};

const PlatformGamesContext = createContext<PlatformGamesContextValue | null>(
  null,
);

export const PlatformGamesProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGamesState] = useState(loadPlatformGames);
  const [gamesFromApi, setGamesFromApi] = useState(false);
  const [tournaments, setTournamentsState] = useState(loadPlatformTournaments);

  const setGames = useCallback((next: PlatformGame[]) => {
    savePlatformGames(next);
    setGamesState(next);
  }, []);

  const setTournaments = useCallback((next: PlatformTournament[]) => {
    savePlatformTournaments(next);
    setTournamentsState(next);
  }, []);

  const refreshGames = useCallback(async () => {
    try {
      const response = await getAllGames();
      if (Array.isArray(response.data) && response.data.length > 0) {
        const mapped = response.data.map(mapApiGameToPlatform);
        setGames(mapped);
        setGamesFromApi(true);
        return;
      }
      // Empty API catalog: show empty UI (no baked-in demo games).
      setGames([]);
      setGamesFromApi(true);
    } catch {
      // API down: keep whatever is already in local cache.
      setGamesFromApi(false);
    }
  }, [setGames]);

  useEffect(() => {
    void refreshGames();
  }, [refreshGames]);

  const value = useMemo(
    () => ({
      games,
      setGames,
      refreshGames,
      gamesFromApi,
      tournaments,
      setTournaments,
    }),
    [games, setGames, refreshGames, gamesFromApi, tournaments, setTournaments],
  );

  return (
    <PlatformGamesContext.Provider value={value}>
      {children}
    </PlatformGamesContext.Provider>
  );
};

export const usePlatformGames = () => {
  const ctx = useContext(PlatformGamesContext);
  if (!ctx) {
    throw new Error("usePlatformGames must be used inside PlatformGamesProvider");
  }
  return ctx;
};
