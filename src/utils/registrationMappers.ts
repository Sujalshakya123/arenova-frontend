import type { ApiEventRegistration } from "../services/registrationApi";
import type { MyTournament, MyTournamentStatus } from "../data/myTournamentsData";
import {
  resolveTournamentCover,
} from "../data/platformGames";
import { formatCardDateLine } from "../pages/organizer/tournamentFormUtils";

const modeLabel = (mode?: string | null) => {
  if (!mode) return "Squad";
  const m = mode.toUpperCase();
  if (m === "SOLO") return "Solo";
  if (m === "DUO") return "Duo";
  return "Squad";
};

export const mapRegistrationToMyTournament = (
  registration: ApiEventRegistration,
): MyTournament => {
  const eventStatus = (registration.eventStatus || "LIVE").toUpperCase();
  let status: MyTournamentStatus = "ongoing";
  if (eventStatus === "COMPLETED") status = "history";
  else if (eventStatus === "DRAFT") status = "upcoming";
  else status = "ongoing";

  const image = resolveTournamentCover({
    coverImageUrl: registration.coverImageUrl,
    imageKey: registration.imageKey,
    gameName: registration.gameName,
  });

  const date = formatCardDateLine(
    registration.startDate || "",
    registration.startTime || "16:00",
    modeLabel(registration.mode),
  );

  return {
    id: registration.id,
    registrationId: registration.id,
    eventId: String(registration.eventId),
    name: registration.eventTitle || "Tournament",
    game: registration.gameName || "Tournament",
    image,
    status,
    date,
    format: `${modeLabel(registration.mode)} · ${
      registration.mode === "SOLO" ? "Player" : "Team"
    }`,
    team: registration.teamName,
    registrationStatus: registration.status,
    paymentStatus: registration.paymentStatus ?? null,
    entry: registration.entry ?? null,
    nextMatch:
      status === "history"
        ? undefined
        : registration.paymentStatus === "INITIATED" ||
            registration.paymentStatus === "FAILED"
          ? `Payment ${registration.paymentStatus === "FAILED" ? "failed" : "pending"} — complete eSewa payment`
          : registration.status === "PENDING"
            ? `Pending approval — ${registration.teamName}`
            : `Registered as ${registration.teamName}`,
    result:
      status === "history"
        ? registration.tournamentWinner
          ? "Winner"
          : "Participated"
        : undefined,
    prize: registration.prizeEarned || undefined,
    organizerTournamentId: String(registration.eventId),
  };
};
