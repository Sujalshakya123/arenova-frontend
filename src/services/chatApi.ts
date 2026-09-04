import api from "../api/axios";

export type ChatMessage = {
  id: number;
  eventId?: number | null;
  userId?: number | null;
  senderName: string;
  senderRole: string;
  organizer: boolean;
  body: string;
  sentAt: string;
};

export type SendChatMessagePayload = {
  body: string;
};

export type ChatRoom = {
  type: "SUPPORT" | "EVENT";
  id: string;
  title: string;
  subtitle?: string | null;
  avatarUrl?: string | null;
  imageKey?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
};

export const getChatRooms = () => api.get<ChatRoom[]>("/api/chat/rooms");

export const getSupportMessages = (limit = 50) =>
  api.get<ChatMessage[]>("/api/chat/support/messages", {
    params: { limit },
  });

export const sendSupportMessageRest = (payload: SendChatMessagePayload) =>
  api.post<ChatMessage[]>("/api/chat/support/messages", payload);

export const getChatMessages = (eventId: string | number, limit = 50) =>
  api.get<ChatMessage[]>(`/api/events/${eventId}/chat/messages`, {
    params: { limit },
  });

export const getChatParticipantCount = (eventId: string | number) =>
  api.get<{ count: number }>(`/api/events/${eventId}/chat/participants`);

export const sendChatMessageRest = (
  eventId: string | number,
  payload: SendChatMessagePayload,
) => api.post<ChatMessage>(`/api/events/${eventId}/chat/messages`, payload);

const API_ORIGIN =
  (api.defaults.baseURL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8080";

export const wsBrokerUrl = (token: string) => {
  const wsOrigin = API_ORIGIN.replace(/^http/i, "ws");
  return `${wsOrigin}/ws?token=${encodeURIComponent(token)}`;
};

export const WS_BASE_URL = `${API_ORIGIN}/ws`;

export const chatTopic = (eventId: string | number) =>
  `/topic/events/${eventId}/chat`;

export const supportChatTopic = (userId: string | number) =>
  `/topic/support/${userId}/chat`;

export const chatSendDestination = (eventId: string | number) =>
  `/app/events/${eventId}/chat`;
