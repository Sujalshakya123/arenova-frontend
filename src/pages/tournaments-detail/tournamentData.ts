export type TournamentDetailInfo = {
  gameName: string;
  seriesBadge: string;
  secondaryBadge: string;
  title: string;
  description: string;
  platform: string;
  format: string;
  dates: string;
  server: string;
  levelRestriction: string;
  entryFee: number;
  serviceFee: number;
  totalSlots: number;
  remainingSlots: number;
  prizePool: string;
  prizeFirst?: string;
  prizeSecond?: string;
  prizeThird?: string;
  prizeFundingMode?: string;
  paidEntryCount?: number;
  prizePoolAtCapacityNpr?: number;
  collectedTotalNpr?: number;
  prizePoolAtCapacity?: string;
  startsOn: string;
  registrationEnds: string;
  registrationOpen?: boolean;
  /** ISO date e.g. 2026-09-05 — used for open/closed checks */
  registrationDeadlineIso?: string;
  /** Tournament start date (ISO) — fallback when registration deadline is unset */
  startDateIso?: string;
  eventCompleted?: boolean;
};

export type ScheduleStage = {
  stage: string;
  date: string;
  time: string;
};

export const tournamentInfo: TournamentDetailInfo = {
  gameName: "PUBG MOBILE",
  seriesBadge: "PUBG MOBILE PRO-SERIES",
  secondaryBadge: "Battle Royale · Squad",
  title: "PUBG Mobile Nepal Championship",
  description:
    "A premier PUBG MOBILE tournament bringing together the best battle royale teams from across Nepal. Drop in, outlast the competition, and fight for prize money, glory, and a chance to establish your dominance in the national esports scene.",
  platform: "Mobile",
  format: "Battle Royale, Squad",
  dates: "10 Aug 2026 - 18 Aug 2026",
  server: "Nepal",
  levelRestriction: "N/A",
  entryFee: 150,
  serviceFee: 50,
  totalSlots: 32,
  remainingSlots: 10,
  prizePool: "Rs 50,000",
  startsOn: "10 Aug 2026",
  registrationEnds: "8 Aug 2026",
};

export const generalRules = [
  "All participants must be 16 years of age or older.",
  "Teams must consist of exactly 4 players and 1 substitute.",
  "Registration closes 48 hours before the tournament start date.",
  "All team members must have verified Arenova accounts.",
  "Team captains are responsible for all team communications.",
];

export const gameplayRules = [
  "No third-party software or cheats allowed if found then instant disqualification.",
  "All matches must be played on the designated server region.",
  "Disconnection during a match: team may request a 10-minute pause once per map.",
  "Match results must be reported within 30 minutes of completion.",
  "Tournament admins' decisions on disputes are final.",
];

export const conductRules = [
  "Toxic behavior, harassment, or hate speech will not be tolerated.",
  "Stream sniping and ghosting are strictly prohibited.",
  "Teams must be ready 15 minutes before their scheduled match time.",
  "Failure to show up within 10 minutes results in a forfeit.",
];

export const scheduleStages: ScheduleStage[] = [
  {
    stage: "Group Stage - Round 1",
    date: "10 Aug 2026",
    time: "16:00 NPT",
  },
  {
    stage: "Quarter-Finals",
    date: "13 Aug 2026",
    time: "16:00 NPT",
  },
  {
    stage: "Semi-Finals",
    date: "15 Aug 2026",
    time: "16:00 NPT",
  },
  {
    stage: "Grand Finals",
    date: "18 Aug 2026",
    time: "18:00 NPT",
  },
];



export const tournamentTabs = [
  { label: "Overview", path: "/tournaments-detail" },
  { label: "Rules", path: "/tournaments-detail/rules" },
  { label: "Schedule", path: "/tournaments-detail/schedule" },
];
