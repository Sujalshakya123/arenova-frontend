import {
  getMyNotifications,
  notificationKey,
  updateNotificationState as updateNotificationStateApi,
  type ApiNotification,
} from "../services/notificationApi";

export type NotificationItem = {
  id: string | number;
  source?: "announcement" | "user";
  title?: string;
  message: string;
  time: string;
  unread: boolean;
  favorite: boolean;
  archived: boolean;
  tournamentId?: string;
  tournamentName?: string;
  type?: "bracket" | "announcement";
};

export const formatNotificationTime = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just Now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
};

const mapApiNotification = (item: ApiNotification): NotificationItem => {
  const id = notificationKey(item);
  const bracketType =
    item.type === "BRACKET" ? ("bracket" as const) : ("announcement" as const);
  return {
    id,
    source: item.source,
    title: item.title || undefined,
    message: item.message,
    time: item.createdAt ? formatNotificationTime(item.createdAt) : "Just Now",
    unread: item.unread ?? true,
    favorite: item.favorite ?? false,
    archived: item.archived ?? false,
    tournamentId: item.tournamentId || undefined,
    tournamentName: item.tournamentName || item.eventTitle || undefined,
    type: item.type === "BRACKET" ? "bracket" : bracketType,
  };
};

export const fetchApiNotifications = async (): Promise<NotificationItem[]> => {
  const response = await getMyNotifications();
  return (response.data ?? []).map(mapApiNotification);
};

export const loadNotificationsForUser = async (
  isAuthenticated: boolean,
): Promise<NotificationItem[]> => {
  if (!isAuthenticated) {
    return [];
  }
  try {
    return await fetchApiNotifications();
  } catch {
    return [];
  }
};

export const countUnread = (items: NotificationItem[]) =>
  items.filter((item) => item.unread && !item.archived).length;

export const notifyNotificationChange = () => {
  window.dispatchEvent(new Event("arenova-notifications-updated"));
};

const parseNotificationKey = (id: string | number) => {
  const raw = String(id);
  const dash = raw.indexOf("-");
  if (dash <= 0) {
    return null;
  }
  const source = raw.slice(0, dash);
  const numericId = raw.slice(dash + 1);
  if (!numericId || Number.isNaN(Number(numericId))) {
    return null;
  }
  if (source !== "announcement" && source !== "user") {
    return null;
  }
  return { source, numericId };
};

export const markNotificationRead = async (id: string | number) => {
  const parsed = parseNotificationKey(id);
  if (!parsed) {
    notifyNotificationChange();
    return;
  }

  try {
    await updateNotificationStateApi(parsed.source, parsed.numericId, {
      unread: false,
    });
    notifyNotificationChange();
  } catch (error) {
    notifyNotificationChange();
    throw error;
  }
};

export const updateNotificationState = async (
  id: string | number,
  patch: Partial<Pick<NotificationItem, "unread" | "favorite" | "archived">>,
) => {
  const parsed = parseNotificationKey(id);
  if (!parsed) {
    notifyNotificationChange();
    return;
  }

  try {
    await updateNotificationStateApi(parsed.source, parsed.numericId, patch);
    notifyNotificationChange();
  } catch (error) {
    notifyNotificationChange();
    throw error;
  }
};

export const archiveNotification = async (id: string | number) => {
  await updateNotificationState(id, { archived: true });
};

export const deleteNotification = async (id: string | number) => {
  const parsed = parseNotificationKey(id);
  if (!parsed) {
    notifyNotificationChange();
    return;
  }

  try {
    await updateNotificationStateApi(parsed.source, parsed.numericId, {
      deleted: true,
    });
    notifyNotificationChange();
  } catch (error) {
    notifyNotificationChange();
    throw error;
  }
};
