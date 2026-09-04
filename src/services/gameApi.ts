import api from "../api/axios";
import {
  hydrateGame,
  type PlatformGame,
} from "../data/platformGames";

export type ApiGameStatus = "AVAILABLE" | "COMING_SOON";

export type ApiGame = {
  id: number;
  slug?: string | null;
  gname: string;
  genre?: string | null;
  description?: string | null;
  about?: string | null;
  partner?: string | null;
  developer?: string | null;
  releaseDate?: string | null;
  platforms?: string | null;
  bannerImageUrl?: string | null;
  iconImageUrl?: string | null;
  imageKey?: string | null;
  status?: ApiGameStatus | null;
};

export const getAllGames = () => api.get<ApiGame[]>("/api/game");

export const getGameByIdOrSlug = (id: string | number) =>
  api.get<ApiGame>(`/api/game/${id}`);

export const createGame = (game: Partial<ApiGame>) =>
  api.post<ApiGame>("/api/game", game);

export const updateGame = (id: number, game: Partial<ApiGame>) =>
  api.put<ApiGame>(`/api/game/${id}`, game);

export const deleteGame = (id: number) => api.delete(`/api/game/${id}`);

export const uploadGameBanner = (id: number, file: File) => {
  const form = new FormData();
  form.append("banner", file);
  return api.post<{ game: ApiGame }>(`/api/game/${id}/banner`, form);
};

export const uploadGameIcon = (id: number, file: File) => {
  const form = new FormData();
  form.append("icon", file);
  return api.post<{ game: ApiGame }>(`/api/game/${id}/icon`, form);
};

export const toApiStatus = (
  status: PlatformGame["status"],
): ApiGameStatus =>
  status === "coming_soon" ? "COMING_SOON" : "AVAILABLE";

export const fromApiStatus = (
  status?: ApiGameStatus | null,
): PlatformGame["status"] =>
  status === "COMING_SOON" ? "coming_soon" : "available";

export const mapApiGameToPlatform = (game: ApiGame): PlatformGame => {
  const slug =
    game.slug?.trim() ||
    game.gname
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") ||
    String(game.id);

  return hydrateGame({
    id: slug,
    dbId: game.id,
    name: game.gname,
    status: fromApiStatus(game.status),
    imageKey: game.imageKey || undefined,
    image: game.iconImageUrl || "",
    detail: {
      genre: game.genre || undefined,
      partner: game.partner || undefined,
      description: game.description || undefined,
      about: game.about || undefined,
      developer: game.developer || undefined,
      releaseDate: game.releaseDate || undefined,
      platforms: game.platforms || undefined,
      bannerImage: game.bannerImageUrl || undefined,
    },
  });
};

const isInlineImage = (url?: string | null) =>
  Boolean(url && (url.startsWith("data:") || url.startsWith("blob:")));

export const mapPlatformToApi = (game: PlatformGame): Partial<ApiGame> => ({
  slug: game.id,
  gname: game.name,
  genre: game.detail?.genre,
  description: game.detail?.description,
  about: game.detail?.about,
  partner: game.detail?.partner,
  developer: game.detail?.developer,
  releaseDate: game.detail?.releaseDate,
  platforms: game.detail?.platforms,
  bannerImageUrl: isInlineImage(game.detail?.bannerImage)
    ? undefined
    : game.detail?.bannerImage,
  iconImageUrl: isInlineImage(game.image) ? undefined : game.image,
  imageKey: game.imageKey,
  status: toApiStatus(game.status),
});
