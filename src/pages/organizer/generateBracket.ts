import type { BracketMatch, Tournament } from "./organizerData";
import type { ApiEventRegistration } from "../../services/registrationApi";

const namedSeeds = [
  "Team Alpha",
  "Team Nova",
  "Phoenix Five",
  "Iron Wolves",
  "Kathmandu Kings",
  "Lalitpur Legends",
  "Pokhara Storm",
  "Bhaktapur Blaze",
];

export const participantNames = (tournament: Tournament) => {
  const count = Math.max(2, tournament.playerCount || 8);
  return Array.from({ length: count }, (_, i) => {
    if (tournament.type === "team") {
      return namedSeeds[i] || `Team ${i + 1}`;
    }
    return `Player ${i + 1}`;
  });
};

/** Approved registrations only — used when generating brackets for live events. */
export const seedNamesFromRegistrations = (
  registrations: ApiEventRegistration[],
  tournament: Tournament,
): string[] => {
  const approved = registrations.filter((r) => r.status === "REGISTERED");
  if (!approved.length) return [];

  return approved.map((r) => {
    if (tournament.type === "team") {
      return r.teamTag ? `${r.teamName} [${r.teamTag}]` : r.teamName;
    }
    return r.captainUsername || r.teamName || "Player";
  });
};

export const generateBracket = (
  tournament: Tournament,
  seedNames?: string[],
): BracketMatch[] => {
  const names =
    seedNames?.length ? seedNames : participantNames(tournament);
  if (tournament.matchType === "ffa") return generateFfaBracket(names);

  // Duel stages: double-elim uses winners + losers style labels for MVP;
  // other duel stages use classic single-elim until dedicated generators land.
  if (tournament.stageType === "double-elimination") {
    return generateDoubleElimBracket(names);
  }
  return generateSingleElimBracket(names);
};

const nextPowerOfTwo = (n: number) =>
  2 ** Math.ceil(Math.log2(Math.max(n, 2)));

const roundLabel = (bracketSize: number, round: number) => {
  const remaining = bracketSize / 2 ** (round - 1);
  if (remaining <= 2) return "Final";
  if (remaining <= 4) return "Semifinal";
  if (remaining <= 8) return "Quarterfinal";
  return `Round of ${remaining}`;
};

const generateSingleElimBracket = (names: string[]): BracketMatch[] => {
  const size = nextPowerOfTwo(names.length);
  const seeded = [...names];
  while (seeded.length < size) seeded.push("BYE");

  const matches: BracketMatch[] = [];
  let remaining = size;
  let round = 1;

  while (remaining >= 2) {
    const isFirst = round === 1;
    const matchCount = remaining / 2;
    for (let i = 0; i < matchCount; i++) {
      matches.push({
        id: `r${round}-m${i + 1}`,
        round,
        roundLabel: roundLabel(size, round),
        slotA: isFirst ? seeded[i * 2] : "TBD",
        slotB: isFirst ? seeded[i * 2 + 1] : "TBD",
        participants: isFirst
          ? [seeded[i * 2], seeded[i * 2 + 1]]
          : ["TBD", "TBD"],
        status: "Upcoming",
      });
    }
    remaining /= 2;
    round += 1;
  }

  return matches;
};

/** Lightweight double-elim: winners bracket + a losers consolation round. */
const generateDoubleElimBracket = (names: string[]): BracketMatch[] => {
  const winners = generateSingleElimBracket(names).map((match) => ({
    ...match,
    id: `w-${match.id}`,
    roundLabel: `Winners · ${match.roundLabel}`,
  }));

  const size = nextPowerOfTwo(names.length);
  const losersCount = Math.max(1, size / 2);
  const losers: BracketMatch[] = [];
  for (let i = 0; i < losersCount / 2; i++) {
    losers.push({
      id: `l-r1-m${i + 1}`,
      round: 100 + i,
      roundLabel: "Losers · Round 1",
      slotA: "Loser TBD",
      slotB: "Loser TBD",
      participants: ["Loser TBD", "Loser TBD"],
      status: "Upcoming",
    });
  }
  losers.push({
    id: "gf-1",
    round: 200,
    roundLabel: "Grand Final",
    slotA: "Winners Finalist",
    slotB: "Losers Finalist",
    participants: ["Winners Finalist", "Losers Finalist"],
    status: "Upcoming",
  });

  return [...winners, ...losers];
};

const generateFfaBracket = (names: string[]): BracketMatch[] => {
  if (names.length < 2) return [];

  const perMatch = 4;
  const matches: BracketMatch[] = [];
  let remaining = [...names];
  let round = 1;

  while (remaining.length > 1) {
    const groups = Math.max(1, Math.ceil(remaining.length / perMatch));
    const nextRemaining: string[] = [];
    const isFinal = remaining.length <= perMatch;

    for (let i = 0; i < groups; i++) {
      const group = remaining.slice(i * perMatch, (i + 1) * perMatch);
      matches.push({
        id: `ffa-r${round}-m${i + 1}`,
        round,
        roundLabel: isFinal ? "Final" : `FFA Round ${round}`,
        slotA: group[0] || "TBD",
        slotB: group[1] || "TBD",
        participants: group.length ? group : ["TBD"],
        status: "Upcoming",
      });
      nextRemaining.push(`Winner of Lobby ${i + 1}`);
    }

    remaining = nextRemaining.length === 1 ? [] : nextRemaining;
    round += 1;
    if (round > 6) break;
  }

  return matches;
};
