import api from "../api/axios";
import type { ApiEvent } from "./eventApi";
import { formatCardDateLine } from "../pages/organizer/tournamentFormUtils";
import type { TournamentAdminStatus } from "../pages/super-admin/adminData";

export type AdminEventRow = {
  id: string;
  title: string;
  game: string;
  organizer: string;
  organizerInitial: string;
  organizerColor: string;
  prizePool: string;
  date: string;
  status: TournamentAdminStatus;
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
];

const organizerColor = (name: string) => {
  const index = name.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return avatarColors[index % avatarColors.length];
};

const organizerInitial = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
};

export const eventStatusToAdmin = (
  status?: ApiEvent["status"],
): TournamentAdminStatus => {
  const s = (status || "DRAFT").toUpperCase();
  if (s === "LIVE") return "Live";
  if (s === "COMPLETED") return "Completed";
  return "Pending";
};

export const mapApiEventToAdminRow = (event: ApiEvent): AdminEventRow => {
  const organizer = event.organizerName || "Organizer";
  const mode =
    event.mode === "SOLO" ? "Solo" : event.mode === "DUO" ? "Duo" : "Squad";
  return {
    id: String(event.id),
    title: event.title,
    game: event.gameName || "Tournament",
    organizer,
    organizerInitial: organizerInitial(organizer),
    organizerColor: organizerColor(organizer),
    prizePool: event.prizePool || "Rs. 0",
    date: formatCardDateLine(
      event.startDate || "",
      event.startTime || "16:00",
      mode,
    ),
    status: eventStatusToAdmin(event.status),
  };
};

export const getAdminEvents = (status?: ApiEvent["status"]) =>
  api.get<ApiEvent[]>("/api/admin/events", {
    params: status ? { status } : undefined,
  });

export const approveAdminEvent = (id: string | number) =>
  api.patch<ApiEvent>(`/api/admin/events/${id}/approve`);

export const rejectAdminEvent = (id: string | number) =>
  api.patch<ApiEvent>(`/api/admin/events/${id}/reject`);

export const completeAdminEvent = (id: string | number) =>
  api.patch<ApiEvent>(`/api/admin/events/${id}/complete`);
