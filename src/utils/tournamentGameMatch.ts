import type { PlatformGame } from "../data/platformGames";
import type { TournamentStatus } from "../data/userTournaments";

/** Sidebar / browse filter labels on /tournaments */
export const GAME_FILTER_ALIASES: Record<string, string[]> = {
  "PUBG Mobile": ["pubg mobile", "pubg"],
  "Free Fire": ["free fire", "freefire"],
  Valorant: ["valorant"],
  MLBB: ["mlbb", "mobile legends", "mobile legends: bang bang"],
  CODM: ["codm", "call of duty mobile", "call of duty"],
  "Rainbow Six": ["rainbow six", "rainbow six siege", "r6"],
};

const PLATFORM_ID_TO_FILTER: Record<string, string> = {
  freefire: "Free Fire",
  "free-fire": "Free Fire",
  valorant: "Valorant",
  pubg: "PUBG Mobile",
  "pubg-mobile": "PUBG Mobile",
  mlbb: "MLBB",
  codm: "CODM",
  r6: "Rainbow Six",
  "rainbow-six": "Rainbow Six",
};

const compactGameId = (gameId: string) =>
  gameId
    .toLowerCase()
    .replace(/-\d{10,}$/, "")
    .replace(/_/g, "-");

export const platformGameToFilterLabel = (game: PlatformGame): string => {
  const key = compactGameId(game.imageKey || game.id);
  const compact = key.replace(/-/g, "");
  return (
    PLATFORM_ID_TO_FILTER[key] ??
    PLATFORM_ID_TO_FILTER[compact] ??
    PLATFORM_ID_TO_FILTER[compactGameId(game.id)] ??
    game.name
  );
};

export const platformGameIdToFilterLabel = (gameId: string): string | null => {
  const key = compactGameId(gameId);
  if (PLATFORM_ID_TO_FILTER[key]) return PLATFORM_ID_TO_FILTER[key];
  const compact = key.replace(/-/g, "");
  if (PLATFORM_ID_TO_FILTER[compact]) return PLATFORM_ID_TO_FILTER[compact];
  return null;
};

export const resolveTournamentGameFilter = (
  gameId: string | null | undefined,
  gameFilter: string | null | undefined,
  games: PlatformGame[],
): string => {
  if (gameFilter?.trim()) return gameFilter.trim();
  if (!gameId) return "All Games";

  const fromMap = platformGameIdToFilterLabel(gameId);
  if (fromMap) return fromMap;

  const normalized = compactGameId(gameId);
  const match = games.find((game) => {
    const ids = [game.id, game.imageKey].filter(Boolean).map((id) =>
      compactGameId(String(id)),
    );
    return ids.some(
      (id) =>
        id === normalized ||
        id.replace(/-/g, "") === normalized.replace(/-/g, ""),
    );
  });
  if (match) return platformGameToFilterLabel(match);

  return "All Games";
};

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "");

export const matchesGameFilter = (
  eventGameName: string | undefined | null,
  gameFilter: string,
): boolean => {
  if (gameFilter === "All Games") return true;
  const gameName = (eventGameName || "").trim();
  if (!gameName) return false;
  if (gameName === gameFilter) return true;

  const aliases = GAME_FILTER_ALIASES[gameFilter] ?? [gameFilter.toLowerCase()];
  const lower = gameName.toLowerCase();
  return aliases.some(
    (alias) => lower.includes(alias) || alias.includes(lower),
  );
};

export const matchesPlatformGame = (
  eventGameName: string | undefined | null,
  game: PlatformGame,
): boolean => matchesGameFilter(eventGameName, platformGameToFilterLabel(game));

export type GameDetailTab = "All Tournaments" | "Registration Open" | "Past Events";

export const filterCardsByGameDetailTab = <
  T extends { status: TournamentStatus },
>(
  cards: T[],
  tab: GameDetailTab,
): T[] => {
  if (tab === "Past Events") {
    return cards.filter((card) => card.status === "Completed");
  }
  if (tab === "Registration Open") {
    return cards.filter((card) => card.status !== "Completed");
  }
  return cards;
};

export type TournamentsBrowseTab = "all" | "open" | "past";

export const tournamentsBrowsePath = (opts?: {
  gameId?: string | null;
  gameFilter?: string | null;
  tab?: TournamentsBrowseTab;
}) => {
  const params = new URLSearchParams();
  if (opts?.gameId) params.set("game", opts.gameId);
  if (opts?.gameFilter) params.set("gameFilter", opts.gameFilter);
  if (opts?.tab && opts.tab !== "all") params.set("tab", opts.tab);
  const query = params.toString();
  return query ? `/tournaments?${query}` : "/tournaments";
};

export const gameDetailTabToBrowseTab = (
  tab: GameDetailTab,
): TournamentsBrowseTab => {
  if (tab === "Past Events") return "past";
  if (tab === "Registration Open") return "open";
  return "all";
};

export const filterCardsByBrowseTab = <
  T extends { status: TournamentStatus },
>(
  cards: T[],
  tab: TournamentsBrowseTab | null,
): T[] => {
  if (tab === "past") {
    return cards.filter((card) => card.status === "Completed");
  }
  if (tab === "open") {
    return cards.filter((card) => card.status !== "Completed");
  }
  return cards;
};

/** Match event game string to a platform slug id (e.g. freefire). */
export const eventGameMatchesPlatformId = (
  eventGameName: string | undefined | null,
  platformGameId: string,
): boolean => {
  const normalizedId = normalize(platformGameId);
  const eventNorm = normalize(eventGameName || "");
  if (!eventNorm) return false;
  if (eventNorm === normalizedId) return true;

  const filterLabel = platformGameIdToFilterLabel(platformGameId);
  if (filterLabel && matchesGameFilter(eventGameName, filterLabel)) {
    return true;
  }

  return (
    eventNorm.includes(normalizedId) || normalizedId.includes(eventNorm)
  );
};

/** Profile preferred-game ids (valorant, freefire, pubg, …) → browse filter labels */
const PREFERRED_ID_TO_FILTER: Record<string, string> = {
  valorant: "Valorant",
  freefire: "Free Fire",
  pubg: "PUBG Mobile",
  mlbb: "MLBB",
  codm: "CODM",
  r6: "Rainbow Six",
};

export const parsePreferredGameIds = (value?: string | null): string[] => {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
};

export const preferredIdToFilterLabel = (preferredId: string): string | null =>
  PREFERRED_ID_TO_FILTER[preferredId] ??
  platformGameIdToFilterLabel(preferredId);

export const matchesPreferredGames = (
  eventGameName: string | undefined | null,
  preferredIds: string[],
): boolean => {
  if (preferredIds.length === 0) return true;
  return preferredIds.some((id) => {
    const filter = preferredIdToFilterLabel(id);
    if (filter) return matchesGameFilter(eventGameName, filter);
    return eventGameMatchesPlatformId(eventGameName, id);
  });
};
