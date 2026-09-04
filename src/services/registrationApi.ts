import api from "../api/axios";
import type { ApiEvent } from "./eventApi";
import type { EsewaPaymentInit } from "./paymentApi";

export type RegistrationStatus = "PENDING" | "REGISTERED" | "REJECTED" | "WITHDRAWN";

export type ApiEventRegistration = {
  id: number;
  eventId: number;
  userId?: number;
  teamName: string;
  teamTag?: string | null;
  captainUsername: string;
  roster: string[];
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  status: RegistrationStatus;
  registeredAt?: string | null;
  eventTitle?: string | null;
  gameName?: string | null;
  imageKey?: string | null;
  coverImageUrl?: string | null;
  startDate?: string | null;
  startTime?: string | null;
  eventStatus?: ApiEvent["status"];
  mode?: ApiEvent["mode"];
  prizePool?: string | null;
  entry?: string | null;
  maxCapacity?: string | null;
  registeredCount?: number | null;
  tournamentWinner?: boolean | null;
  prizeEarned?: string | null;
};

export type RegisterEventPayload = {
  teamName: string;
  teamTag?: string;
  captainUsername: string;
  roster: string[];
  paymentMethod?: string;
};

export type RegisterEventResponse = {
  registration: ApiEventRegistration;
  esewaPayment?: EsewaPaymentInit | null;
};

export const registerForEvent = (
  eventId: string | number,
  payload: RegisterEventPayload,
) => api.post<RegisterEventResponse>(`/api/events/${eventId}/register`, payload);

export const getMyRegistrations = () =>
  api.get<ApiEventRegistration[]>("/api/registrations/me");

export const getEventRegistrations = (eventId: string | number) =>
  api.get<ApiEventRegistration[]>(`/api/events/${eventId}/registrations`);

export const getMyRegistrationForEvent = (eventId: string | number) =>
  api.get<ApiEventRegistration>(`/api/events/${eventId}/my-registration`);

export const fetchMyRegistrationForEvent = async (
  eventId: string | number,
): Promise<ApiEventRegistration | null> => {
  try {
    const response = await getMyRegistrationForEvent(eventId);
    if (response.status === 204 || !response.data) return null;
    return response.data;
  } catch {
    return null;
  }
};

export const withdrawRegistration = (registrationId: string | number) =>
  api.delete(`/api/registrations/${registrationId}`);

export const approveRegistration = (registrationId: string | number) =>
  api.post<ApiEventRegistration>(`/api/registrations/${registrationId}/approve`);

export const rejectRegistration = (registrationId: string | number) =>
  api.post<ApiEventRegistration>(`/api/registrations/${registrationId}/reject`);
