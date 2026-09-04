import api from "../api/axios";
import type { AdminPaymentRecord } from "./adminApi";
import type { PaymentReceipt } from "./paymentReceiptTypes";

export type OrganizerPaymentMetrics = {
  totalRevenue: string;
  platformCommission: string;
  organizerShare: string;
  paidEntries: string;
};

export type OrganizerPaymentsOverview = {
  eventTitle: string;
  metrics: OrganizerPaymentMetrics;
  payments: AdminPaymentRecord[];
};

export const getOrganizerEventPayments = (eventId: string | number) =>
  api.get<OrganizerPaymentsOverview>(`/api/events/${eventId}/payments`);

export const getOrganizerEventPaymentReceipt = (
  eventId: string | number,
  paymentId: number,
) =>
  api.get<PaymentReceipt>(
    `/api/events/${eventId}/payments/${paymentId}/receipt`,
  );
