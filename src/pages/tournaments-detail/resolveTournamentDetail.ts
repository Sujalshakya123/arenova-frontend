import type { Tournament } from "../organizer/organizerData";
import { getOrganizerTournament } from "../organizer/tournamentStore";
import { resolveGameIconByName, resolveTournamentDetailBanner } from "../../data/platformGames";
import { parseRsNumber } from "../organizer/tournamentFormUtils";
import {
  conductRules,
  gameplayRules,
  generalRules,
  scheduleStages,
  tournamentInfo as defaultTournamentInfo,
  type ScheduleStage,
  type TournamentDetailInfo,
} from "./tournamentData";
import {
  parseRegistrationMode,
  type RegistrationMode,
} from "../../utils/registrationMode";
import { resolveHostedBy } from "../../utils/resolveHostedBy";
import {
  resolvePrizeAwards,
  type PrizeAward,
} from "../../utils/bracketProgress";
import { isEntryFeeFundedPrizePool } from "../../config/prizePoolConfig";
import { formatRsNpr } from "../../utils/prizePoolEconomics";

export type ResolvedTournamentDetail = {
  id: string;
  registrationMode: RegistrationMode;
  info: TournamentDetailInfo;
  generalRules: string[];
  gameplayRules: string[];
  conductRules: string[];
  scheduleStages: ScheduleStage[];
  coverImage?: string;
  gameIcon?: string;
  hostedBy: string;
  hostedByPhotoUrl?: string;
  prizeAwards?: PrizeAward[];
};

const DEFAULT_ID = "default";

const parseEntryFeeNumber = parseRsNumber;

const formatShortDate = (isoDate?: string) => {
  if (!isoDate) return "TBD";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const buildDefaultStages = (startDate?: string, startTime?: string): ScheduleStage[] => {
  if (!startDate) return scheduleStages;
  const start = new Date(`${startDate}T${startTime || "16:00"}`);
  if (Number.isNaN(start.getTime())) return scheduleStages;

  const addDays = (days: number) => {
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const timeLabel = `${startTime || "16:00"} NPT`;

  return [
    { stage: "Group Stage - Round 1", date: addDays(0), time: timeLabel },
    { stage: "Quarter-Finals", date: addDays(3), time: timeLabel },
    { stage: "Semi-Finals", date: addDays(5), time: timeLabel },
    { stage: "Grand Finals", date: addDays(8), time: "18:00 NPT" },
  ];
};

export const fromOrganizerTournament = (tournament: Tournament): ResolvedTournamentDetail => {
  const page = tournament.publicPage || {};
  const totalSlots = tournament.playerCount || 32;
  const registered = tournament.registeredCount ?? 0;
  const remainingSlots = Math.max(totalSlots - registered, 0);
  const startsOn = formatShortDate(tournament.startDate);
  const endsOn = formatShortDate(page.endDate);
  const entryFee = parseEntryFeeNumber(tournament.entryFee);
  const dynamicPool =
    isEntryFeeFundedPrizePool() ||
    tournament.prizeFundingMode === "entry_fee_funded";
  const prizePool = (tournament.prizePool || "Rs. 0").replace("Rs.", "Rs");
  const prizePoolAtCapacity = dynamicPool
    ? formatRsNpr(tournament.prizePoolAtCapacityNpr ?? 0)
    : undefined;
  const format = tournament.format || (tournament.type === "team" ? "Squad" : "Solo");
  const dateRange =
    page.endDate && endsOn !== "TBD" ? `${startsOn} - ${endsOn}` : startsOn;
  const registrationDeadlineIso =
    page.registrationEnds?.trim() || tournament.startDate?.trim() || undefined;

  return {
    id: tournament.id,
    registrationMode: parseRegistrationMode(tournament.mode, format),
    info: {
      gameName: tournament.game.toUpperCase(),
      seriesBadge:
        page.seriesBadge || `${tournament.game.toUpperCase()} SERIES`,
      secondaryBadge:
        page.secondaryBadge || `${tournament.platform} · ${format}`,
      title: tournament.name,
      description:
        page.description ||
        `${tournament.name} is hosted on Arenova. Join with your ${
          tournament.type === "team" ? "team" : "profile"
        }, compete in ${format} format${
          dynamicPool
            ? " — prize pool grows with paid registrations (70% to winners)."
            : `, and fight for ${prizePool}.`
        }`,
      platform: tournament.platform || tournament.platforms?.[0] || "PC",
      format: format.includes(",") ? format : `Competitive, ${format}`,
      dates: dateRange,
      server: page.server || "Nepal",
      levelRestriction: page.levelRestriction || "N/A",
      entryFee,
      serviceFee: 50,
      totalSlots,
      remainingSlots,
      prizePool,
      prizeFirst: tournament.prizeFirst,
      prizeSecond: tournament.prizeSecond,
      prizeThird: tournament.prizeThird,
      prizeFundingMode: dynamicPool ? "entry_fee_funded" : "fixed",
      paidEntryCount: tournament.paidEntryCount,
      prizePoolAtCapacityNpr: tournament.prizePoolAtCapacityNpr,
      collectedTotalNpr: tournament.collectedTotalNpr,
      prizePoolAtCapacity,
      startsOn,
      registrationEnds: registrationDeadlineIso
        ? formatShortDate(registrationDeadlineIso)
        : "TBD",
      registrationOpen: tournament.registrationOpen !== false,
      registrationDeadlineIso,
      startDateIso: tournament.startDate?.trim() || undefined,
      eventCompleted: tournament.status === "completed",
    },
    generalRules:
      page.generalRules && page.generalRules.length
        ? page.generalRules
        : generalRules,
    gameplayRules:
      page.gameplayRules && page.gameplayRules.length
        ? page.gameplayRules
        : gameplayRules,
    conductRules:
      page.conductRules && page.conductRules.length
        ? page.conductRules
        : conductRules,
    scheduleStages:
      page.scheduleStages && page.scheduleStages.length
        ? page.scheduleStages
        : buildDefaultStages(tournament.startDate, tournament.startTime),
    gameIcon: resolveGameIconByName(tournament.game),
    coverImage: resolveTournamentDetailBanner({
      detailBannerUrl: tournament.detailBannerUrl,
      detailBannerKey: tournament.detailBannerKey,
      coverImageUrl: tournament.coverImageUrl,
      imageKey: tournament.imageKey,
      gameName: tournament.game,
    }),
    hostedBy: resolveHostedBy(page.hostedBy, tournament.organizerName),
    hostedByPhotoUrl: tournament.organizerPhotoUrl?.trim() || undefined,
    prizeAwards: resolvePrizeAwards(tournament),
  };
};

export const getDefaultTournamentDetail = (): ResolvedTournamentDetail => ({
  id: DEFAULT_ID,
  registrationMode: parseRegistrationMode(null, defaultTournamentInfo.format),
  info: defaultTournamentInfo,
  generalRules,
  gameplayRules,
  conductRules,
  scheduleStages,
  gameIcon: resolveGameIconByName(defaultTournamentInfo.gameName),
  hostedBy: "Arenova Esports",
});

export const findTournamentDetail = (
  id?: string | null,
): ResolvedTournamentDetail | null => {
  if (!id || id === DEFAULT_ID) return null;

  const organizer = getOrganizerTournament(id);
  if (organizer) return fromOrganizerTournament(organizer);

  return null;
};

/** Resolve detail data by id. Returns null when not found (no static demo fallback). */
export const resolveTournamentDetail = (
  id?: string | null,
): ResolvedTournamentDetail | null => {
  return findTournamentDetail(id);
};

export const detailSearch = (id?: string | null) =>
  id && id !== DEFAULT_ID ? `?id=${encodeURIComponent(id)}` : "";

export const tournamentDetailPath = (id?: string | null) =>
  `/tournaments-detail${detailSearch(id)}`;

export const tournamentDetailSubPath = (
  sub: "rules" | "schedule" | "register" | "chat",
  id?: string | null,
) => `/tournaments-detail/${sub}${detailSearch(id)}`;
