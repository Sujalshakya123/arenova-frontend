import type { BracketMatch } from "../pages/organizer/organizerData";

const PLACEHOLDER = /^(TBD|BYE|—|Loser TBD|Winners Finalist|Losers Finalist)$/i;

/** True for the championship round only — not "Semifinal" / "Quarterfinal". */
export const isGrandFinalRound = (roundLabel?: string | null) => {
  if (!roundLabel) return false;
  const normalized = roundLabel.trim().toLowerCase();
  if (normalized.includes("semi") || normalized.includes("quarter")) {
    return false;
  }
  return (
    normalized === "final" ||
    normalized === "grand final" ||
    normalized.endsWith(" final") ||
    normalized.endsWith("· final")
  );
};

export const selectableParticipants = (match: BracketMatch): string[] => {
  const players =
    match.participants && match.participants.length > 0
      ? match.participants
      : [match.slotA, match.slotB];
  return [
    ...new Set(
      players.filter(
        (p) =>
          p &&
          !PLACEHOLDER.test(p) &&
          !/^Winner of Lobby \d+$/.test(p) &&
          !/^Loser of /.test(p),
      ),
    ),
  ];
};

const replacePlaceholder = (value: string, placeholder: string, winner: string) =>
  value === placeholder ? winner : value;

const advanceFfaWinner = (
  bracket: BracketMatch[],
  match: BracketMatch,
  winner: string,
): BracketMatch[] => {
  const parsed = match.id.match(/ffa-r(\d+)-m(\d+)/);
  if (!parsed) return bracket;

  const lobbyIndex = Number(parsed[2]);
  const placeholder = `Winner of Lobby ${lobbyIndex}`;

  return bracket.map((entry) => {
    if (entry.id === match.id) return entry;
    return {
      ...entry,
      slotA: replacePlaceholder(entry.slotA, placeholder, winner),
      slotB: replacePlaceholder(entry.slotB, placeholder, winner),
      participants: entry.participants?.map((p) =>
        replacePlaceholder(p, placeholder, winner),
      ),
    };
  });
};

const advanceDuelWinner = (
  bracket: BracketMatch[],
  match: BracketMatch,
  winner: string,
): BracketMatch[] => {
  const parsed = match.id.match(/^(w-)?r(\d+)-m(\d+)$/);
  if (!parsed) return bracket;

  const prefix = parsed[1] || "";
  const round = Number(parsed[2]);
  const matchIndex = Number(parsed[3]);
  const nextId = `${prefix}r${round + 1}-m${Math.floor((matchIndex - 1) / 2) + 1}`;
  const slotIsA = (matchIndex - 1) % 2 === 0;

  const nextMatch = bracket.find((entry) => entry.id === nextId);
  if (!nextMatch) return bracket;

  return bracket.map((entry) => {
    if (entry.id !== nextId) return entry;

    const slotA = slotIsA ? winner : entry.slotA;
    const slotB = slotIsA ? entry.slotB : winner;
    const participants =
      entry.participants && entry.participants.length >= 2
        ? entry.participants.map((p, index) =>
            (slotIsA && index === 0) || (!slotIsA && index === 1) ? winner : p,
          )
        : [slotA, slotB];

    return {
      ...entry,
      slotA: slotIsA && (entry.slotA === "TBD" || entry.slotA === "BYE") ? winner : slotA,
      slotB: !slotIsA && (entry.slotB === "TBD" || entry.slotB === "BYE") ? winner : slotB,
      participants,
    };
  });
};

export const startMatch = (
  bracket: BracketMatch[],
  matchId: string,
): BracketMatch[] =>
  bracket.map((entry) =>
    entry.id === matchId && entry.status === "Upcoming"
      ? { ...entry, status: "Live" as const }
      : entry,
  );

export const updateMatchSchedule = (
  bracket: BracketMatch[],
  matchId: string,
  scheduledAt: string,
): BracketMatch[] =>
  bracket.map((entry) =>
    entry.id === matchId
      ? { ...entry, scheduledAt: scheduledAt || undefined }
      : entry,
  );

export type MatchScores = {
  scoreA?: number | null;
  scoreB?: number | null;
};

export const recordMatchWinner = (
  bracket: BracketMatch[],
  matchId: string,
  winner: string,
  isFfa: boolean,
  scores?: MatchScores,
): BracketMatch[] => {
  const match = bracket.find((entry) => entry.id === matchId);
  if (!match) return bracket;
  if (match.status === "Completed") return bracket;

  const options = selectableParticipants(match);
  if (!options.includes(winner)) return bracket;

  let updated = bracket.map((entry) =>
    entry.id === matchId
      ? {
          ...entry,
          status: "Completed" as const,
          winner,
          scoreA: scores?.scoreA ?? entry.scoreA ?? null,
          scoreB: scores?.scoreB ?? entry.scoreB ?? null,
        }
      : entry,
  );

  const completed = updated.find((entry) => entry.id === matchId)!;
  updated = isFfa
    ? advanceFfaWinner(updated, completed, winner)
    : advanceDuelWinner(updated, completed, winner);

  return updated;
};

export const formatMatchScore = (match: BracketMatch): string | null => {
  if (match.scoreA == null && match.scoreB == null) return null;
  const a = match.scoreA ?? 0;
  const b = match.scoreB ?? 0;
  return `${a} – ${b}`;
};

export const formatMatchSchedule = (scheduledAt?: string): string | null => {
  if (!scheduledAt) return null;
  const date = new Date(scheduledAt);
  if (Number.isNaN(date.getTime())) return scheduledAt;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const bracketStageLabel = (matchType?: string, stageType?: string) => {
  if (matchType === "ffa") return "Free-for-all lobbies";
  if (stageType === "double-elimination") return "Double elimination";
  if (stageType === "round-robin") return "Round robin";
  return "Single elimination";
};

const isCompletedWithWinner = (match: BracketMatch) =>
  match.status === "Completed" && Boolean(match.winner?.trim());

/** Champion once the final round is fully decided. */
export const findChampion = (bracket: BracketMatch[]): string | null => {
  if (!bracket.length) return null;

  const labeledFinal = bracket.find(
    (match) =>
      isGrandFinalRound(match.roundLabel) && isCompletedWithWinner(match),
  );
  if (labeledFinal?.winner) return labeledFinal.winner;

  const maxRound = Math.max(...bracket.map((match) => match.round));
  const finalRound = bracket.filter((match) => match.round === maxRound);
  if (!finalRound.length) return null;
  if (!finalRound.every(isCompletedWithWinner)) return null;

  return finalRound[finalRound.length - 1]?.winner ?? null;
};

export const findRunnerUp = (bracket: BracketMatch[]): string | null => {
  const champion = findChampion(bracket);
  if (!champion) return null;

  const labeledFinal = bracket.find(
    (match) =>
      isGrandFinalRound(match.roundLabel) &&
      isCompletedWithWinner(match) &&
      match.winner === champion,
  );
  const maxRound = Math.max(...bracket.map((match) => match.round));
  const finalMatch =
    labeledFinal ||
    [...bracket]
      .reverse()
      .find(
        (match) =>
          match.round === maxRound &&
          isCompletedWithWinner(match) &&
          match.winner === champion,
      );

  if (!finalMatch) return null;

  const others = selectableParticipants(finalMatch).filter(
    (name) => name !== champion,
  );
  return others[0] ?? null;
};

export type PrizeAward = {
  place: 1 | 2 | 3;
  placeLabel: string;
  name: string;
  amount: string;
};

/** Map completed bracket places to configured prize amounts (1st/2nd; 3rd unused if no place). */
export const resolvePrizeAwards = (
  tournament: {
    status?: string;
    bracket?: BracketMatch[];
    prizePool?: string;
    prizeFirst?: string;
    prizeSecond?: string;
    prizeThird?: string;
  },
): PrizeAward[] => {
  if (tournament.status !== "completed" || !tournament.bracket?.length) {
    return [];
  }

  const champion = findChampion(tournament.bracket);
  const runnerUp = findRunnerUp(tournament.bracket);
  const awards: PrizeAward[] = [];

  const firstAmount =
    tournament.prizeFirst?.trim() || tournament.prizePool?.trim() || "";
  const secondAmount = tournament.prizeSecond?.trim() || "";

  if (champion && firstAmount) {
    awards.push({
      place: 1,
      placeLabel: "1st place",
      name: champion,
      amount: firstAmount,
    });
  }
  if (runnerUp && secondAmount) {
    awards.push({
      place: 2,
      placeLabel: "2nd place",
      name: runnerUp,
      amount: secondAmount,
    });
  }

  return awards;
};

export const isTournamentComplete = (bracket: BracketMatch[]): boolean =>
  findChampion(bracket) != null;
