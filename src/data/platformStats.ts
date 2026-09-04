import type { UserTournamentCard } from "./userTournaments";
import type { ApiPlatformStats } from "../services/eventApi";

/** Parse "16/25" → { filled: 16, total: 25 } */
const parseSlots = (slots: string) => {
  const [filled, total] = slots.split("/").map(Number);
  return { filled: isNaN(filled) ? 0 : filled, total: isNaN(total) ? 0 : total };
};

/** Parse "Rs. 50,000" → 50000 */
const parsePrize = (prize: string): number => {
  const cleaned = prize.replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
};

/** Format a rupee number back to a human-readable string */
const formatPrize = (amount: number): string => {
  if (amount >= 100_000) return `Rs. ${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `Rs. ${(amount / 1_000).toFixed(0)}k`;
  return `Rs. ${amount}`;
};

export type PlatformStats = {
  tournaments: number;
  players: number;
  liveTournaments: number;
  totalPrize: string;
};

export const emptyPlatformStats = (): PlatformStats => ({
  tournaments: 0,
  players: 0,
  liveTournaments: 0,
  totalPrize: "Rs. 0",
});

export const mapApiPlatformStats = (stats: ApiPlatformStats): PlatformStats => ({
  tournaments: stats.tournaments ?? 0,
  players: stats.players ?? 0,
  liveTournaments: stats.liveTournaments ?? 0,
  totalPrize: stats.totalPrize ?? "Rs. 0",
});

/** Card-based stats (legacy / non-homepage use). */
export const getPlatformStats = (
  tournaments: UserTournamentCard[],
): PlatformStats => {
  const totalTournaments = tournaments.length;

  const totalPlayers = tournaments.reduce((sum, t) => {
    return sum + parseSlots(t.slots).filled;
  }, 0);

  const liveTournaments = tournaments.filter((t) => t.status === "Live").length;

  const totalPrizeAmount = tournaments.reduce((sum, t) => {
    return sum + parsePrize(t.prizePool);
  }, 0);

  return {
    tournaments: totalTournaments,
    players: totalPlayers,
    liveTournaments,
    totalPrize: formatPrize(totalPrizeAmount),
  };
};
