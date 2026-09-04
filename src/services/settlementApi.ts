import api from "../api/axios";

export type SettlementStatus =
  | "NOT_INITIATED"
  | "PENDING_ADMIN_APPROVAL"
  | "PROCESSING"
  | "COMPLETED"
  | "REJECTED"
  | "FAILED";

export type SettlementRecord = {
  id?: number;
  eventId: number;
  eventTitle: string;
  gameName?: string;
  status: SettlementStatus;
  totalRevenueNpr: number;
  paidEntryCount: number;
  entryFeeDisplay?: string;
  platformAmountNpr: number;
  organizerAmountNpr: number;
  prizePoolAmountNpr: number;
  firstPlaceAmountNpr: number;
  secondPlaceAmountNpr: number;
  totalRevenueDisplay?: string;
  platformAmountDisplay?: string;
  organizerAmountDisplay?: string;
  prizePoolAmountDisplay?: string;
  firstPlaceAmountDisplay?: string;
  secondPlaceAmountDisplay?: string;
  firstPlaceWinnerName?: string;
  secondPlaceWinnerName?: string;
  firstPlaceRegistrationId?: number;
  secondPlaceRegistrationId?: number;
  initiatedAt?: string;
  completedAt?: string;
  approvedAt?: string;
  failureReason?: string;
  settlementEnabled: boolean;
  canInitiate: boolean;
};

export const getEventSettlement = (eventId: string | number) =>
  api.get<SettlementRecord>(`/api/events/${eventId}/settlement`);

export const initiateEventSettlement = (eventId: string | number) =>
  api.post<SettlementRecord>(`/api/events/${eventId}/settlement`);
