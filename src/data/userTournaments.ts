export type TournamentStatus = "Upcoming" | "Live" | "Completed";

export type UserTournamentCard = {
  id: string;
  image: string;
  alt: string;
  title: string;
  game: string;
  date: string;
  slots: string;
  prizePool: string;
  entryFee: string;
  status: TournamentStatus;
  /** Display name of the hosting organizer when available from the API. */
  organizerName?: string;
  /** Organizer profile photo URL when available; badge falls back to initials. */
  organizerPhotoUrl?: string;
  registrationOpen?: boolean;
  registrationDeadlineIso?: string;
  startDateIso?: string;
};

/** Legacy local catalog — public pages load tournaments from the API. */
export const browseTournaments: UserTournamentCard[] = [];

export const featuredTournaments = browseTournaments;
