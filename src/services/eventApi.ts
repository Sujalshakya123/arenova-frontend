import api from "../api/axios";
import type { Tournament } from "../pages/organizer/organizerData";
import {
  formatCardDateLine,
  formatEntryFee,
  formatRsAmount,
} from "../pages/organizer/tournamentFormUtils";
import {
  resolveImageKeyByName,
  resolveTournamentCover,
} from "../data/platformGames";
import type { UserTournamentCard, TournamentStatus } from "../data/userTournaments";
import { resolveHostedBy } from "../utils/resolveHostedBy";

import { isEntryFeeFundedPrizePool } from "../config/prizePoolConfig";

export type ApiEventEconomics = {
  prizeFundingMode?: string | null;
  collectedTotalNpr?: number | null;
  paidEntryCount?: number | null;
  prizePoolCurrentNpr?: number | null;
  prizePoolAtCapacityNpr?: number | null;
  organizerShareNpr?: number | null;
  platformShareNpr?: number | null;
  prizeFirstNpr?: number | null;
  prizeSecondNpr?: number | null;
  prizePoolDisplay?: string | null;
  prizeFirstDisplay?: string | null;
  prizeSecondDisplay?: string | null;
  prizePoolAtCapacityDisplay?: string | null;
};

export type ApiEvent = {
  id: number;
  title: string;
  minCapacity?: string | null;
  maxCapacity?: string | null;
  createdAt?: string | null;
  mode?: "SOLO" | "DUO" | "SQUAD" | null;
  prizePool?: string | null;
  prizeFirst?: string | null;
  prizeSecond?: string | null;
  prizeThird?: string | null;
  entry?: string | null;
  description?: string | null;
  projectId?: number | null;
  gameName?: string | null;
  imageKey?: string | null;
  coverImageUrl?: string | null;
  detailBannerUrl?: string | null;
  detailBannerKey?: string | null;
  platforms?: string | null;
  startDate?: string | null;
  startTime?: string | null;
  timezone?: string | null;
  status?: "DRAFT" | "LIVE" | "COMPLETED" | null;
  participantType?: string | null;
  registeredCount?: number | null;
  matchType?: string | null;
  stageType?: string | null;
  bracketJson?: string | null;
  bracketGeneratedAt?: string | null;
  registrationDeadline?: string | null;
  registrationOpen?: boolean | null;
  publicPageJson?: string | null;
  organizerName?: string | null;
  organizerEmail?: string | null;
  organizerPhotoUrl?: string | null;
  prizeFundingMode?: string | null;
  collectedTotalNpr?: number | null;
  paidEntryCount?: number | null;
  prizePoolCurrentNpr?: number | null;
  prizePoolAtCapacityNpr?: number | null;
  organizerShareNpr?: number | null;
  platformShareNpr?: number | null;
  economics?: ApiEventEconomics | null;
};

export type CreateEventPayload = {
  title: string;
  projectId: number;
  gameName?: string;
  imageKey?: string;
  coverImageUrl?: string;
  detailBannerUrl?: string;
  detailBannerKey?: string;
  platforms?: string;
  startDate?: string;
  startTime?: string;
  timezone?: string;
  mode?: "SOLO" | "DUO" | "SQUAD";
  maxCapacity?: string;
  minCapacity?: string;
  prizePool?: string;
  prizeFirst?: string;
  prizeSecond?: string;
  prizeThird?: string;
  entry?: string;
  description?: string;
  participantType?: string;
  status?: "DRAFT" | "LIVE" | "COMPLETED";
  matchType?: string;
  stageType?: string;
  bracketJson?: string;
  bracketGeneratedAt?: string;
  registrationDeadline?: string;
  registrationOpen?: boolean;
  publicPageJson?: string;
};

const modeToFormat = (mode?: string | null) => {
  if (!mode) return "Squad";
  const m = mode.toUpperCase();
  if (m === "SOLO") return "Solo";
  if (m === "DUO") return "Duo";
  return "Squad";
};

const formatToMode = (format?: string): "SOLO" | "DUO" | "SQUAD" => {
  const f = (format || "").toLowerCase();
  if (f === "solo") return "SOLO";
  if (f === "duo") return "DUO";
  return "SQUAD";
};

const statusToUi = (status?: string | null): Tournament["status"] => {
  const s = (status || "LIVE").toUpperCase();
  if (s === "COMPLETED") return "completed";
  if (s === "DRAFT") return "draft";
  return "live";
};

const statusToCard = (status?: string | null): TournamentStatus => {
  const s = (status || "LIVE").toUpperCase();
  if (s === "COMPLETED") return "Completed";
  if (s === "DRAFT") return "Upcoming";
  return "Live";
};

const parsePlatforms = (platforms?: string | null) =>
  (platforms || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

const parseBracketJson = (raw?: string | null) => {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Tournament["bracket"];
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

const parsePublicPageJson = (raw?: string | null) => {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as NonNullable<Tournament["publicPage"]>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

export const mapApiEventToTournament = (event: ApiEvent): Tournament => {
  const platforms = parsePlatforms(event.platforms);
  const imageKey = event.imageKey || resolveImageKeyByName(event.gameName || undefined);
  const pageExtras = parsePublicPageJson(event.publicPageJson);
  return {
    id: String(event.id),
    projectId: event.projectId != null ? String(event.projectId) : "",
    name: event.title,
    game: event.gameName || "Valorant",
    platform: platforms[0] || "PC",
    platforms,
    playerCount: Number(event.maxCapacity) || 16,
    registeredCount: event.registeredCount ?? 0,
    type: event.participantType === "players" ? "players" : "team",
    timezone: event.timezone || "(UTC+05:45) - Kathmandu - Nepal",
    status: statusToUi(event.status),
    startDate: event.startDate || undefined,
    startTime: event.startTime || undefined,
    format: modeToFormat(event.mode),
    mode: event.mode ?? formatToMode(modeToFormat(event.mode)),
    prizePool: event.prizePool || undefined,
    prizeFirst: event.prizeFirst || undefined,
    prizeSecond: event.prizeSecond || undefined,
    prizeThird: event.prizeThird || undefined,
    prizeFundingMode: event.prizeFundingMode || undefined,
    paidEntryCount: event.paidEntryCount ?? event.economics?.paidEntryCount ?? undefined,
    prizePoolAtCapacityNpr:
      event.prizePoolAtCapacityNpr ??
      event.economics?.prizePoolAtCapacityNpr ??
      undefined,
    collectedTotalNpr:
      event.collectedTotalNpr ?? event.economics?.collectedTotalNpr ?? undefined,
    organizerShareNpr:
      event.organizerShareNpr ?? event.economics?.organizerShareNpr ?? undefined,
    platformShareNpr:
      event.platformShareNpr ?? event.economics?.platformShareNpr ?? undefined,
    entryFee: event.entry || undefined,
    matchType: event.matchType || "duel",
    stageType: event.stageType || undefined,
    bracket: parseBracketJson(event.bracketJson),
    bracketGeneratedAt: event.bracketGeneratedAt || undefined,
    imageKey,
    coverImageUrl: event.coverImageUrl || undefined,
    detailBannerUrl: event.detailBannerUrl || undefined,
    detailBannerKey: event.detailBannerKey || imageKey,
    image: resolveTournamentCover({
      coverImageUrl: event.coverImageUrl,
      imageKey,
      gameName: event.gameName,
    }),
    organizerName: event.organizerName || undefined,
    organizerPhotoUrl: event.organizerPhotoUrl?.trim() || undefined,
    publicPage: {
      seriesBadge:
        pageExtras?.seriesBadge ||
        `${(event.gameName || "TOURNAMENT").toUpperCase()} SERIES`,
      secondaryBadge:
        pageExtras?.secondaryBadge ||
        `${platforms[0] || "PC"} · ${modeToFormat(event.mode)}`,
      description:
        event.description ||
        `${event.title} is hosted on Arenova.`,
      server: pageExtras?.server || "Nepal",
      levelRestriction: pageExtras?.levelRestriction || "N/A",
      endDate: pageExtras?.endDate,
      hostedBy: resolveHostedBy(pageExtras?.hostedBy, event.organizerName),
      registrationEnds: event.registrationDeadline || undefined,
      generalRules: pageExtras?.generalRules,
      gameplayRules: pageExtras?.gameplayRules,
      conductRules: pageExtras?.conductRules,
      scheduleStages: pageExtras?.scheduleStages,
    },
    registrationOpen: event.registrationOpen !== false,
  };
};

export const mapApiEventToCard = (event: ApiEvent): UserTournamentCard => {
  const imageKey = event.imageKey || resolveImageKeyByName(event.gameName || undefined);
  const max = Number(event.maxCapacity) || 16;
  const registered = event.registeredCount ?? 0;
  return {
    id: String(event.id),
    image: resolveTournamentCover({
      coverImageUrl: event.coverImageUrl,
      imageKey,
      gameName: event.gameName,
    }),
    alt: event.gameName || event.title,
    title: event.title,
    game: event.gameName || "Tournament",
    date: formatCardDateLine(
      event.startDate || "",
      event.startTime || "16:00",
      modeToFormat(event.mode),
    ),
    slots: `${registered}/${max}`,
    prizePool: event.prizePool || "Rs. 0",
    entryFee: event.entry || "Free To Play",
    status: statusToCard(event.status),
    organizerName: event.organizerName?.trim() || undefined,
    organizerPhotoUrl: event.organizerPhotoUrl?.trim() || undefined,
    registrationOpen: event.registrationOpen !== false,
    registrationDeadlineIso:
      event.registrationDeadline?.trim() || event.startDate?.trim() || undefined,
    startDateIso: event.startDate?.trim() || undefined,
  };
};

export const buildCreateEventPayload = (
  values: {
    name: string;
    discipline: string;
    platforms: string[];
    startDate: string;
    startTime: string;
    format: string;
    size: string;
    participantType: "players" | "team";
    prizePool: string;
    prizeFirst?: string;
    prizeSecond?: string;
    prizeThird?: string;
    entryFee: string;
    timezone: string;
  },
  projectId: number,
): CreateEventPayload => {
  const useDynamicPool = isEntryFeeFundedPrizePool();
  const imageKey = resolveImageKeyByName(values.discipline);
  const entry = formatEntryFee(values.entryFee);
  const maxCapacity = String(values.size || "16");
  return {
    title: values.name.trim(),
    projectId,
    gameName: values.discipline,
    imageKey,
    detailBannerKey: imageKey,
    platforms: values.platforms.join(","),
    startDate: values.startDate,
    startTime: values.startTime,
    timezone: values.timezone,
    mode: formatToMode(values.format),
    maxCapacity,
    minCapacity: "1",
    prizePool: useDynamicPool ? "Rs. 0" : formatRsAmount(values.prizePool),
    prizeFirst: useDynamicPool
      ? undefined
      : values.prizeFirst
        ? formatRsAmount(values.prizeFirst)
        : undefined,
    prizeSecond: useDynamicPool
      ? undefined
      : values.prizeSecond
        ? formatRsAmount(values.prizeSecond)
        : undefined,
    prizeThird: useDynamicPool
      ? undefined
      : values.prizeThird
        ? formatRsAmount(values.prizeThird)
        : undefined,
    entry,
    description: useDynamicPool
      ? `${values.name.trim()} is hosted on Arenova. Prize pool is 70% of paid entry fees (updates as teams register).`
      : `${values.name.trim()} is hosted on Arenova. Register and compete for ${formatRsAmount(values.prizePool)}.`,
    participantType: values.participantType,
    status: "DRAFT",
  };
};

export const getPublicEvents = () => api.get<ApiEvent[]>("/api/events/public");

export type ApiPlatformStats = {
  tournaments: number;
  players: number;
  liveTournaments: number;
  totalPrize: string;
};

export const getPublicPlatformStats = () =>
  api.get<ApiPlatformStats>("/api/events/public/stats");

export const getEventsByProject = (projectId: string | number) =>
  api.get<ApiEvent[]>("/api/events", { params: { projectId } });

export const getEventById = (id: string | number) =>
  api.get<ApiEvent>(`/api/events/${id}`);

export const createEvent = (payload: CreateEventPayload) =>
  api.post<ApiEvent>("/api/events", payload);

export const updateEvent = (id: string | number, payload: Partial<CreateEventPayload>) =>
  api.put<ApiEvent>(`/api/events/${id}`, payload);

export const uploadEventDetailBanner = (id: string | number, file: File) => {
  const form = new FormData();
  form.append("banner", file);
  return api.post<{ detailBannerUrl: string; event: ApiEvent }>(
    `/api/events/${id}/detail-banner`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
};

export const deleteEvent = (id: string | number) =>
  api.delete(`/api/events/${id}`);
