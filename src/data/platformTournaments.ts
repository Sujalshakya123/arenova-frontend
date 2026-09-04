import { resolveGameIconByName } from "./platformGames";
import {
  type TournamentStatus,
  type UserTournamentCard,
} from "./userTournaments";
import {
  type AdminTournament,
  type TournamentAdminStatus,
} from "../pages/super-admin/adminData";

export type PlatformTournament = {
  id: string;
  title: string;
  game: string;
  date: string;
  slots: string;
  prizePool: string;
  entryFee: string;
  status: TournamentAdminStatus;
  organizer: string;
  organizerInitial: string;
  organizerColor: string;
};

const STORAGE_KEY = "arenova_tournament_catalog_v1";

const hydrateImage = (game: string) => resolveGameIconByName(game);

export const toUserTournamentCard = (
  tournament: PlatformTournament,
): UserTournamentCard => ({
  id: tournament.id,
  image: hydrateImage(tournament.game),
  alt: tournament.game,
  title: tournament.title,
  game: tournament.game,
  date: tournament.date,
  slots: tournament.slots,
  prizePool: tournament.prizePool,
  entryFee: tournament.entryFee,
  status:
    tournament.status === "Pending"
      ? "Upcoming"
      : (tournament.status as TournamentStatus),
  organizerName: tournament.organizer || undefined,
});

export const toAdminTournament = (
  tournament: PlatformTournament,
): AdminTournament => ({
  id: Number.parseInt(tournament.id, 10) || Date.now(),
  name: tournament.title,
  prizePool: tournament.prizePool,
  game: tournament.game,
  organizer: tournament.organizer,
  organizerInitial: tournament.organizerInitial,
  organizerColor: tournament.organizerColor,
  date: tournament.date,
  status: tournament.status,
});

export const fromAdminTournament = (
  tournament: AdminTournament,
): PlatformTournament => ({
  id: String(tournament.id),
  title: tournament.name,
  game: tournament.game,
  date: tournament.date,
  slots: tournament.slots || "0/32",
  prizePool: tournament.prizePool,
  entryFee: tournament.entryFee || "Rs. 0",
  status: tournament.status,
  organizer: tournament.organizer,
  organizerInitial: tournament.organizerInitial,
  organizerColor: tournament.organizerColor,
});

const readStored = (): PlatformTournament[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlatformTournament[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item?.id && item?.title);
  } catch {
    return [];
  }
};

/** Cache-only. Never seeds hardcoded browse/admin demo tournaments. */
export const loadPlatformTournaments = (): PlatformTournament[] => readStored();

export const savePlatformTournaments = (tournaments: PlatformTournament[]) => {
  const json = JSON.stringify(tournaments);
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    try {
      sessionStorage.setItem(STORAGE_KEY, json);
    } catch {
      // quota
    }
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, json);
  } catch {
    // ignore
  }
};

export const getPublicTournaments = (
  tournaments: PlatformTournament[],
): UserTournamentCard[] =>
  tournaments
    .filter((item) => item.status !== "Pending")
    .map(toUserTournamentCard);
