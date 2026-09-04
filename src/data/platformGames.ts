import pubg from "../assets/PUBG.png";
import freeFire from "../assets/FREEFIRE.png";
import mobileLegends from "../assets/MLBB.png";
import valorant from "../assets/VALORANT.png";
import r6 from "../assets/R6.png";
import codm from "../assets/CODM.png";
import dota2 from "../assets/DOTA2.png";
import valorantBanner from "../assets/Valo-banner.png";
import pubgBanner from "../assets/Cards/PUBG.jpg";
import freeFireBanner from "../assets/Cards/FREEFIRE.jpg";
import mlbbBanner from "../assets/Cards/MLBB.jpg";
import codmBanner from "../assets/Cards/CODM.jpg";
import r6Banner from "../assets/Cards/RAINBOW SIX.jpg";

/** Detail fields shown on /games-detail — maps cleanly to a future games API. */
export type PlatformGameDetail = {
  genre?: string;
  partner?: string;
  description?: string;
  about?: string;
  developer?: string;
  releaseDate?: string;
  platforms?: string;
  bannerImage?: string;
};

export type PlatformGame = {
  id: string;
  /** Backend numeric id when loaded/saved via API */
  dbId?: number;
  name: string;
  image: string;
  imageKey?: string;
  status: "available" | "coming_soon";
  detail?: PlatformGameDetail;
};

export const GAME_COVERS = [
  { key: "valorant", label: "Valorant", src: valorant },
  { key: "pubg", label: "PUBG Mobile", src: pubg },
  { key: "freefire", label: "Free Fire", src: freeFire },
  { key: "mlbb", label: "Mobile Legends", src: mobileLegends },
  { key: "codm", label: "Call of Duty Mobile", src: codm },
  { key: "r6", label: "Rainbow Six", src: r6 },
  { key: "dota2", label: "DOTA2", src: dota2 },
];

export const GAME_BANNERS = [
  { key: "valorant", label: "Valorant", src: valorantBanner },
  { key: "pubg", label: "PUBG Mobile", src: pubgBanner },
  { key: "freefire", label: "Free Fire", src: freeFireBanner },
  { key: "mlbb", label: "Mobile Legends", src: mlbbBanner },
  { key: "codm", label: "Call of Duty Mobile", src: codmBanner },
  { key: "r6", label: "Rainbow Six", src: r6Banner },
  { key: "dota2", label: "DOTA2", src: dota2 },
];

const STORAGE_KEY = "arenova_platform_games";
const CUSTOM_GAMES_KEY = "arenova_custom_games";
const CATALOG_KEY = "arenova_game_catalog_v1";
const GAMES_EVENT = "arenova-games-updated";

const inferCoverKey = (name?: string) => {
  const key = (name || "").toLowerCase().replace(/\s+/g, "");
  if (!key) return undefined;
  if (key.includes("dota")) return "dota2";
  if (key.includes("valorant")) return "valorant";
  if (key.includes("pubg")) return "pubg";
  if (key.includes("freefire") || key.includes("free fire")) return "freefire";
  if (key.includes("mlbb") || key.includes("mobilelegends")) return "mlbb";
  if (key.includes("cod") || key.includes("callofduty")) return "codm";
  if (key.includes("rainbow") || key.includes("r6")) return "r6";
  return GAME_COVERS.find(
    (cover) =>
      key.includes(cover.key) ||
      cover.label.toLowerCase().replace(/\s+/g, "").includes(key),
  )?.key;
};

export const resolveImageKeyByName = (name?: string) =>
  inferCoverKey(name) ?? "valorant";

export const hydrateGame = (game: PlatformGame): PlatformGame => {
  const imageKey = game.imageKey || inferCoverKey(game.name);
  const cover = GAME_COVERS.find((item) => item.key === imageKey);
  const banner = GAME_BANNERS.find((item) => item.key === imageKey);
  return {
    ...game,
    imageKey,
    image: game.image && !game.image.startsWith("data:")
      ? game.image
      : cover?.src ?? game.image ?? valorant,
    detail: {
      ...game.detail,
      bannerImage:
        game.detail?.bannerImage && !game.detail.bannerImage.startsWith("data:")
          ? game.detail.bannerImage
          : banner?.src ?? cover?.src ?? game.detail?.bannerImage,
    },
  };
};

type StoredGame = {
  id: string;
  dbId?: number;
  name: string;
  status: PlatformGame["status"];
  imageKey?: string;
  detail?: PlatformGameDetail;
};

const toStored = (game: PlatformGame): StoredGame => ({
  id: game.id,
  dbId: game.dbId,
  name: game.name,
  status: game.status,
  imageKey: game.imageKey || inferCoverKey(game.name),
  detail: {
    genre: game.detail?.genre,
    partner: game.detail?.partner,
    description: game.detail?.description,
    about: game.detail?.about,
    developer: game.detail?.developer,
    releaseDate: game.detail?.releaseDate,
    platforms: game.detail?.platforms,
    bannerImage: game.detail?.bannerImage,
  },
});

const notifyGamesChanged = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAMES_EVENT));
};

const parseStoredList = (raw: string | null): StoredGame[] => {
  if (!raw || raw.length > 200_000) return [];
  try {
    const parsed = JSON.parse(raw) as StoredGame[] | PlatformGame[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.id && item?.name);
  } catch {
    return [];
  }
};

const readBucket = (...keys: string[]): StoredGame[] => {
  if (typeof window === "undefined") return [];
  const byId = new Map<string, StoredGame>();
  const stores: Storage[] = [window.localStorage];
  try {
    stores.push(window.sessionStorage);
  } catch {
    // private mode
  }

  for (const store of stores) {
    for (const key of keys) {
      parseStoredList(store.getItem(key)).forEach((item) => {
        byId.set(item.id, item);
      });
    }
  }
  return [...byId.values()];
};

const storedToGame = (item: StoredGame): PlatformGame =>
  hydrateGame({
    id: item.id,
    dbId: item.dbId,
    name: item.name,
    status: item.status === "coming_soon" ? "coming_soon" : "available",
    imageKey: item.imageKey,
    image: "",
    detail: item.detail,
  });

export const loadPlatformGames = (): PlatformGame[] => {
  const catalog = readBucket(CATALOG_KEY);
  if (catalog.length > 0) return catalog.map(storedToGame);

  // Custom titles only — never auto-merge baked-in demo defaults into the UI.
  return readBucket(CUSTOM_GAMES_KEY, STORAGE_KEY)
    .filter((item) => !defaultGames.some((d) => d.id === item.id))
    .map(storedToGame);
};

const writeJson = (store: Storage, key: string, value: string) => {
  try {
    store.setItem(key, value);
  } catch {
    try {
      store.removeItem(key);
      store.setItem(key, value);
    } catch {
      // quota
    }
  }
};

export const savePlatformGames = (games: PlatformGame[]) => {
  const stored = games.map(hydrateGame).map(toStored);
  const json = JSON.stringify(stored);
  writeJson(localStorage, CATALOG_KEY, json);
  try {
    sessionStorage.setItem(CATALOG_KEY, json);
  } catch {
    // ignore
  }
  notifyGamesChanged();
};

const defaultGames: PlatformGame[] = [
  {
    id: "valorant",
    name: "Valorant",
    image: valorant,
    imageKey: "valorant",
    status: "available",
    detail: {
      genre: "TACTICAL SHOOTER",
      partner: "Official League Partner",
      description:
        "A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities. Outplay, outthink, and outshoot your opponents in high-stakes competitive matches.",
      about:
        "Valorant is a free-to-play first-person tactical hero shooter developed by Riot Games. Teams of five agents battle in round-based matches, combining precise aim with strategic ability usage to secure objectives and eliminate opponents.",
      developer: "Riot Games",
      releaseDate: "June 2, 2020",
      platforms: "Windows",
      bannerImage: valorantBanner,
    },
  },
  {
    id: "pubg-mobile",
    name: "PUBG Mobile",
    image: pubg,
    imageKey: "pubg",
    status: "available",
    detail: {
      genre: "BATTLE ROYALE",
      partner: "Official League Partner",
      description:
        "Drop into intense battle royale fights on mobile. Loot, rotate, and outlast squads for chicken dinner in competitive Arenova events.",
      about:
        "PUBG Mobile is a free-to-play battle royale where up to 100 players fight to be the last team standing across large maps with realistic gunplay.",
      developer: "Tencent / Krafton",
      releaseDate: "March 19, 2018",
      platforms: "Mobile",
      bannerImage: pubgBanner,
    },
  },
  {
    id: "free-fire",
    name: "Free Fire",
    image: freeFire,
    imageKey: "freefire",
    status: "available",
    detail: {
      genre: "BATTLE ROYALE",
      partner: "Community Series",
      description:
        "Fast-paced battle royale built for mobile. Short matches, sharp rotations, and high-intensity squad fights.",
      about:
        "Garena Free Fire is a lightweight battle royale popular across South Asia, featuring character abilities and quick match cycles.",
      developer: "Garena",
      releaseDate: "December 4, 2017",
      platforms: "Mobile",
      bannerImage: freeFireBanner,
    },
  },
  {
    id: "mlbb",
    name: "Mobile Legends",
    image: mobileLegends,
    imageKey: "mlbb",
    status: "available",
    detail: {
      genre: "MOBA",
      partner: "Official League Partner",
      description:
        "5v5 MOBA action on mobile. Draft smart, rotate together, and take objectives in competitive Arenova brackets.",
      about:
        "Mobile Legends: Bang Bang is a free-to-play 5v5 MOBA with short matches and a large hero roster for ranked and tournament play.",
      developer: "Moonton",
      releaseDate: "July 14, 2016",
      platforms: "Mobile",
      bannerImage: mlbbBanner,
    },
  },
  {
    id: "codm",
    name: "Call of Duty Mobile",
    image: codm,
    imageKey: "codm",
    status: "coming_soon",
    detail: {
      genre: "FPS",
      partner: "Coming Soon",
      description:
        "Multiplayer FPS modes from the Call of Duty franchise, optimized for mobile competition.",
      about:
        "Call of Duty: Mobile brings multiplayer and battle royale experiences from the COD series to mobile devices.",
      developer: "TiMi Studio Group",
      releaseDate: "October 1, 2019",
      platforms: "Mobile",
      bannerImage: codmBanner,
    },
  },
  {
    id: "r6",
    name: "Rainbow Six",
    image: r6,
    imageKey: "r6",
    status: "coming_soon",
    detail: {
      genre: "TACTICAL SHOOTER",
      partner: "Coming Soon",
      description:
        "Tactical 5v5 attacker vs defender gameplay with operators, utility, and precise aim.",
      about:
        "Tom Clancy's Rainbow Six Siege is a tactical shooter focused on destruction, operators, and objective-based rounds.",
      developer: "Ubisoft",
      releaseDate: "December 1, 2015",
      platforms: "PC / Console",
      bannerImage: r6Banner,
    },
  },
];

export const resolveGameImage = (game: PlatformGame) => {
  if (game.image) return game.image;
  const cover = GAME_COVERS.find((c) => c.key === game.imageKey);
  return cover?.src ?? valorant;
};

export const resolveGameBanner = (game: PlatformGame) => {
  if (game.detail?.bannerImage) return game.detail.bannerImage;
  const banner = GAME_BANNERS.find((b) => b.key === game.imageKey);
  if (banner) return banner.src;
  return resolveGameImage(game);
};

/** Resolve a game icon/cover by display name (e.g. "PUBG MOBILE", "Valorant"). */
export const resolveGameIconByName = (gameName?: string) => {
  const key = (gameName || "").toLowerCase();
  if (!key) return valorant;

  const match = GAME_COVERS.find((cover) => {
    const label = cover.label.toLowerCase();
    return (
      key.includes(cover.key) ||
      key.includes(label) ||
      label.includes(key) ||
      (cover.key === "pubg" && key.includes("pubg")) ||
      (cover.key === "freefire" &&
        (key.includes("free fire") || key.includes("freefire"))) ||
      (cover.key === "mlbb" &&
        (key.includes("mobile legends") || key.includes("mlbb"))) ||
      (cover.key === "codm" &&
        (key.includes("call of duty") || key.includes("codm"))) ||
      (cover.key === "r6" && (key.includes("rainbow") || key.includes("r6"))) ||
      (cover.key === "valorant" && key.includes("valorant")) ||
      (cover.key === "dota2" &&
        (key.includes("dota") || key.includes("dota 2") || key.includes("dota2")))
    );
  });

  return match?.src ?? valorant;
};

/** Cards banner (or cover) by game display name. */
export const resolveGameBannerByName = (gameName?: string) => {
  const key = resolveImageKeyByName(gameName);
  const banner = GAME_BANNERS.find((b) => b.key === key);
  if (banner) return banner.src;
  return resolveGameIconByName(gameName);
};

/** Prefer custom cover URL, then imageKey banner, then name-based banner. */
export const resolveTournamentCover = (opts: {
  coverImageUrl?: string | null;
  imageKey?: string | null;
  gameName?: string | null;
}) => {
  if (opts.coverImageUrl) return opts.coverImageUrl;
  if (opts.imageKey) {
    const banner = GAME_BANNERS.find((b) => b.key === opts.imageKey);
    if (banner) return banner.src;
  }
  return resolveGameBannerByName(opts.gameName || undefined);
};

/** Detail-page hero: custom upload → detail key → card cover. */
export const resolveTournamentDetailBanner = (opts: {
  detailBannerUrl?: string | null;
  detailBannerKey?: string | null;
  coverImageUrl?: string | null;
  imageKey?: string | null;
  gameName?: string | null;
}) => {
  if (opts.detailBannerUrl) return opts.detailBannerUrl;
  if (opts.detailBannerKey) {
    const banner = GAME_BANNERS.find((b) => b.key === opts.detailBannerKey);
    if (banner) return banner.src;
  }
  return resolveTournamentCover({
    coverImageUrl: opts.coverImageUrl,
    imageKey: opts.imageKey,
    gameName: opts.gameName,
  });
};

export const subscribePlatformGames = (onChange: () => void) => {
  if (typeof window === "undefined") return () => undefined;

  const handler = () => onChange();
  window.addEventListener(GAMES_EVENT, handler);
  window.addEventListener("storage", handler);
  window.addEventListener("focus", handler);
  return () => {
    window.removeEventListener(GAMES_EVENT, handler);
    window.removeEventListener("storage", handler);
    window.removeEventListener("focus", handler);
  };
};

export const getPlatformGameById = (id?: string | null) => {
  if (!id) return undefined;
  return loadPlatformGames().find((g) => g.id === id);
};

export const getAvailableGames = () =>
  loadPlatformGames().filter((g) => g.status === "available");

export const getComingSoonGames = () =>
  loadPlatformGames().filter((g) => g.status === "coming_soon");

export const getAllDisplayGames = () => loadPlatformGames();

export const gameDetailPath = (id?: string | null) =>
  id ? `/games-detail?id=${encodeURIComponent(id)}` : "/games-detail";
