import api from "../api/axios";

export type ApiNotificationType =
  | "ANNOUNCEMENT"
  | "BRACKET"
  | "REGISTRATION_APPROVED"
  | "REGISTRATION_REJECTED"
  | "REGISTRATION_PENDING";

export type ApiNotification = {
  id: number;
  source: "announcement" | "user";
  title?: string | null;
  message: string;
  type?: ApiNotificationType | null;
  eventId?: number | null;
  eventTitle?: string | null;
  tournamentName?: string | null;
  tournamentId?: string | null;
  createdAt?: string | null;
  unread?: boolean;
  favorite?: boolean;
  archived?: boolean;
};

export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  type?: "ANNOUNCEMENT" | "BRACKET";
};

export const notificationKey = (item: ApiNotification) =>
  `${item.source}-${item.id}`;

export const getMyNotifications = () =>
  api.get<ApiNotification[]>("/api/notifications/me");

export const updateNotificationState = (
  source: string,
  id: string | number,
  payload: Partial<
    Pick<ApiNotification, "unread" | "favorite" | "archived"> & { deleted?: boolean }
  >,
) => api.put<ApiNotification>(`/api/notifications/${source}/${id}/state`, payload);

export const createEventAnnouncement = (
  eventId: string | number,
  payload: CreateAnnouncementPayload,
) => api.post<ApiNotification>(`/api/events/${eventId}/announcements`, payload);
