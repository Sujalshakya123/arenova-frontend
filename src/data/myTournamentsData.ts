import valorant from "../assets/Cards/VALORANT2.jpg";
import pubg from "../assets/Cards/PUBG.jpg";
import freefire from "../assets/Cards/FREEFIRE.jpg";
import mlbb from "../assets/Cards/MLBB.jpg";

export type MyTournamentStatus = "ongoing" | "upcoming" | "history";

export type MyTournament = {
  id: number;
  registrationId?: number;
  eventId?: string;
  name: string;
  game: string;
  image: string;
  status: MyTournamentStatus;
  date: string;
  format: string;
  team: string;
  result?: string;
  prize?: string;
  nextMatch?: string;
  organizerTournamentId?: string;
  registrationStatus?: "PENDING" | "REGISTERED" | "REJECTED" | "WITHDRAWN";
  /** Backend PaymentStatus: INITIATED | COMPLETED | FAILED */
  paymentStatus?: string | null;
  entry?: string | null;
};

export const myTournaments: MyTournament[] = [
  {
    id: 1,
    name: "Nepal Valorant Cup",
    game: "Valorant",
    image: valorant,
    status: "ongoing",
    date: "29 Apr – 5 May 2026",
    format: "Squad · Bo3",
    team: "Team Nova",
    nextMatch: "Quarterfinal vs Team Alpha · Today 4:00 PM",
    organizerTournamentId: "tour-1",
  },
  {
    id: 2,
    name: "Arenova Open Series",
    game: "Valorant",
    image: valorant,
    status: "ongoing",
    date: "28 Apr – 10 May 2026",
    format: "Squad · Swiss",
    team: "Team Nova",
    nextMatch: "Round 3 vs Iron Wolves · Tomorrow 6:00 PM",
  },
  {
    id: 3,
    name: "PUBG Mobile Qualifiers",
    game: "PUBG Mobile",
    image: pubg,
    status: "upcoming",
    date: "12 May 2026 · 16:00",
    format: "Squad · FFA",
    team: "Squad X",
    nextMatch: "Group Stage opens in 5 days",
    organizerTournamentId: "tour-2",
  },
  {
    id: 4,
    name: "MLBB Nepal Qualifier",
    game: "Mobile Legends",
    image: mlbb,
    status: "upcoming",
    date: "18 May 2026 · 18:00",
    format: "5v5 · Single Elim",
    team: "Phoenix Five",
    nextMatch: "Check-in starts 17 May",
  },
  {
    id: 5,
    name: "FREEFIRE Asian Qualifiers",
    game: "Free Fire",
    image: freefire,
    status: "upcoming",
    date: "25 May 2026 · 15:00",
    format: "Squad · Groups",
    team: "Fire Squad",
    nextMatch: "Lobby code sent 1 hour before start",
    organizerTournamentId: "tour-3",
  },
  {
    id: 6,
    name: "Arenova Winter Cup 2025",
    game: "Valorant",
    image: valorant,
    status: "history",
    date: "10 – 18 Dec 2025",
    format: "Squad · Double Elim",
    team: "Team Nova",
    result: "2nd Place",
    prize: "Rs. 15,000",
  },
  {
    id: 7,
    name: "PUBG Nepal Open",
    game: "PUBG Mobile",
    image: pubg,
    status: "history",
    date: "2 – 8 Nov 2025",
    format: "Squad · FFA",
    team: "Squad X",
    result: "Top 8",
    prize: "Rs. 5,000",
  },
  {
    id: 8,
    name: "FreeFire Campus Clash",
    game: "Free Fire",
    image: freefire,
    status: "history",
    date: "15 – 20 Sep 2025",
    format: "Squad · Groups",
    team: "Fire Squad",
    result: "Champion",
    prize: "Rs. 25,000",
  },
];
