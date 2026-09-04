export type Project = {
  id: string;
  name: string;
  plan: string;
  tournamentCount: number;
  updatedAt: string;
};

export type BracketMatch = {
  id: string;
  round: number;
  roundLabel: string;
  slotA: string;
  slotB: string;
  participants?: string[];
  status: "Upcoming" | "Live" | "Completed";
  winner?: string;
  /** Duel score for slotA / first participant */
  scoreA?: number | null;
  /** Duel score for slotB / second participant */
  scoreB?: number | null;
  /** Optional scheduled start (datetime-local value, e.g. 2026-08-25T16:00) */
  scheduledAt?: string;
};

/** Fields shown on the user tournament detail page. Ready to map 1:1 to a future API DTO. */
export type TournamentPublicPage = {
  seriesBadge?: string;
  secondaryBadge?: string;
  description?: string;
  server?: string;
  levelRestriction?: string;
  endDate?: string;
  registrationEnds?: string;
  hostedBy?: string;
  generalRules?: string[];
  gameplayRules?: string[];
  conductRules?: string[];
  scheduleStages?: Array<{
    stage: string;
    date: string;
    time: string;
  }>;
};

export type Tournament = {
  id: string;
  projectId: string;
  name: string;
  game: string;
  platform: string;
  platforms?: string[];
  playerCount: number;
  registeredCount?: number;
  type: "players" | "team";
  timezone: string;
  status: "draft" | "live" | "completed";
  startDate?: string;
  startTime?: string;
  format?: string;
  mode?: "SOLO" | "DUO" | "SQUAD";
  prizePool?: string;
  prizeFirst?: string;
  prizeSecond?: string;
  prizeThird?: string;
  entryFee?: string;
  prizeFundingMode?: string;
  paidEntryCount?: number;
  collectedTotalNpr?: number;
  prizePoolAtCapacityNpr?: number;
  organizerShareNpr?: number;
  platformShareNpr?: number;
  matchType?: string;
  stageType?: string;
  bracket?: BracketMatch[];
  bracketGeneratedAt?: string;
  /** Public card/detail cover (resolved URL) */
  image?: string;
  /** GAME_BANNERS key e.g. freefire, pubg */
  imageKey?: string;
  /** Optional uploaded/override cover URL stored in DB */
  coverImageUrl?: string;
  /** Wide hero for detail page (custom upload or key-resolved) */
  detailBannerUrl?: string;
  detailBannerKey?: string;
  /** Public detail content for /tournaments-detail?id=... */
  publicPage?: TournamentPublicPage;
  /** Organizer display name from API (fullName, username, or email) */
  organizerName?: string;
  /** Organizer profile photo URL from API when set */
  organizerPhotoUrl?: string;
  /** When false, players cannot register even if tournament is live */
  registrationOpen?: boolean;
};

export const games = [
  "Valorant",
  "PUBG Mobile",
  "Free Fire",
  "Mobile Legends",
  "CS2",
  "Rainbow Six Siege",
];

export const platforms = ["PC", "Mobile", "Console", "Cross-platform"];

export const timezones = [
  "(UTC+05:45) - Kathmandu - Nepal",
  "(UTC+05:30) - Kolkata - India",
  "(UTC+00:00) - UTC",
  "(UTC-05:00) - New York - USA",
  "(UTC+00:00) - London - UK",
  "(UTC-11:00) - Niue - Niue",
  "(UTC+08:00) - Singapore - Singapore",
  "(UTC+09:00) - Tokyo - Japan",
];

export const matchTypes = [
  {
    id: "duel",
    title: "Duel",
    description: "Head-to-head matches between two opponents.",
  },
  {
    id: "ffa",
    title: "Free For All",
    description: "Multiple participants compete in the same match.",
  },
];

export const stageTypes = [
  {
    id: "single-elimination",
    title: "Single Elimination",
    description: "Lose once and you're out of the bracket.",
  },
  {
    id: "double-elimination",
    title: "Double Elimination",
    description: "Teams get a second chance through a losers bracket.",
  },
  {
    id: "round-robin",
    title: "Round Robin",
    description: "Every participant plays against all others.",
  },
];

export const initialProjects: Project[] = [
  {
    id: "proj-1",
    name: "MLBB Nepal Qualifier",
    plan: "Free",
    tournamentCount: 2,
    updatedAt: "Jul 5, 2026",
  },
  {
    id: "proj-2",
    name: "FREEFIRE Asian Qualifiers",
    plan: "Free",
    tournamentCount: 1,
    updatedAt: "Jun 28, 2026",
  },
];

export const initialTournaments: Tournament[] = [
  {
    id: "tour-1",
    projectId: "proj-1",
    name: "Valorant Champions Cup",
    game: "Valorant",
    platform: "PC",
    platforms: ["PC"],
    playerCount: 16,
    type: "team",
    timezone: "(UTC+05:45) - Kathmandu - Nepal",
    status: "live",
    startDate: "2026-04-29",
    startTime: "16:00",
    format: "Squad",
    prizePool: "Rs. 50,000",
    entryFee: "Rs. 150",
    matchType: "duel",
    stageType: "single-elimination",
  },
  {
    id: "tour-2",
    projectId: "proj-1",
    name: "PUBG Mobile Qualifiers",
    game: "PUBG Mobile",
    platform: "Mobile",
    platforms: ["Mobile"],
    playerCount: 32,
    type: "team",
    timezone: "(UTC+05:45) - Kathmandu - Nepal",
    status: "draft",
    startDate: "2026-05-12",
    startTime: "16:00",
    format: "Squad",
    prizePool: "Rs. 25,000",
    entryFee: "Rs. 150",
    matchType: "ffa",
    stageType: "single-elimination",
  },
  {
    id: "tour-3",
    projectId: "proj-2",
    name: "Free Fire Asian Qualifiers",
    game: "Free Fire",
    platform: "Mobile",
    platforms: ["Mobile"],
    playerCount: 12,
    type: "team",
    timezone: "(UTC+05:45) - Kathmandu - Nepal",
    status: "draft",
    startDate: "2026-05-25",
    startTime: "15:00",
    format: "Squad",
    prizePool: "Rs. 20,000",
    entryFee: "Rs. 100",
    matchType: "ffa",
  },
];

export const runningMatches = [
  {
    id: "m-1",
    round: "Quarterfinal",
    teams: "Team Alpha vs Team Nova",
    status: "Live",
    game: "Valorant",
  },
  {
    id: "m-2",
    round: "Semifinal",
    teams: "Phoenix Five vs Iron Wolves",
    status: "Upcoming",
    game: "Valorant",
  },
  {
    id: "m-3",
    round: "Group Stage",
    teams: "Kathmandu Kings vs Lalitpur Legends",
    status: "Live",
    game: "PUBG Mobile",
  },
  {
    id: "m-4",
    round: "Group Stage",
    teams: "Pokhara Storm vs Bhaktapur Blaze",
    status: "Upcoming",
    game: "PUBG Mobile",
  },
];
