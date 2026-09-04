import api from "../api/axios";
import type { ApiUserStatus } from "./userApi";
import type { ChatMessage } from "./chatApi";
import type { PaymentReceipt } from "./paymentReceiptTypes";

export type AdminDashboardStats = {
  totalUsers: number;
  totalOrganizers: number;
  totalTournaments: number;
  activeTournaments: number;
  pendingTournamentApprovals: number;
  pendingOrganizers: number;
  /** Gross completed player payments (GMV). */
  totalRevenue: string;
  /** Estimated platform share = 10% of all completed payments (includes unsettled). */
  platformCommission?: string;
  /** Revenue from approved settlements only. */
  settledRevenue?: string;
  /** Platform earnings from approved settlements only. */
  settledPlatformEarnings?: string;
};

export type AdminActivityItem = {
  id: number;
  text: string;
  time: string;
};

export type AdminGrowthPoint = {
  label: string;
  revenue: number;
  tournaments: number;
};

export type AdminOrganizer = {
  id: number;
  username?: string | null;
  fullName?: string | null;
  email: string;
  status?: ApiUserStatus | null;
  tournamentCount: number;
  registeredAt?: string | null;
};

export type AdminPlayer = {
  id: number;
  username?: string | null;
  fullName?: string | null;
  email: string;
  status?: ApiUserStatus | null;
  tournamentsJoined: number;
};

export const getAdminDashboardStats = () =>
  api.get<AdminDashboardStats>("/api/admin/dashboard/stats");

export const getAdminRecentActivity = () =>
  api.get<AdminActivityItem[]>("/api/admin/dashboard/activity");

export const getAdminDashboardGrowth = (days: 30 | 90) =>
  api.get<AdminGrowthPoint[]>("/api/admin/dashboard/growth", { params: { days } });

export const getAdminOrganizers = () =>
  api.get<AdminOrganizer[]>("/api/admin/organizers");

export const getAdminPlayers = () =>
  api.get<AdminPlayer[]>("/api/admin/players");

export const adminUpdateUserStatus = (
  id: string | number,
  status: ApiUserStatus,
) => api.put(`/api/admin/users/${id}/status`, { status });

export const adminDeleteUser = (id: string | number) =>
  api.delete(`/api/admin/users/${id}`);

export type AdminPaymentStatus = "Completed" | "Pending" | "Failed";

export type AdminPaymentRecord = {
  id: number;
  playerName: string;
  email: string;
  tournament: string;
  amount: string;
  method: string;
  date: string;
  status: AdminPaymentStatus;
};

export type AdminPaymentMetrics = {
  totalRevenue: string;
  platformCommission: string;
  refunds: string;
  successRate: string;
};

export type AdminPaymentsOverview = {
  metrics: AdminPaymentMetrics;
  payments: AdminPaymentRecord[];
};

export const getAdminPaymentsOverview = () =>
  api.get<AdminPaymentsOverview>("/api/admin/payments");

export const getAdminPaymentReceipt = (paymentId: string | number) =>
  api.get<PaymentReceipt>(`/api/admin/payments/${paymentId}`);

export type AdminSettlementRecord = {
  id?: number | null;
  eventId: number;
  organizerId?: number;
  tournament: string;
  gameName?: string;
  organizerName: string;
  organizerEmail: string;
  paidEntryCount: number;
  registeredPlayerCount?: number;
  entryFee?: string;
  totalRevenue: string;
  platformShare: string;
  organizerShare: string;
  prizePool: string;
  firstPlacePrize: string;
  secondPlacePrize: string;
  firstPlaceWinner?: string;
  secondPlaceWinner?: string;
  status: string;
  initiatedAt: string;
  completedAt: string;
  settlementDate?: string;
  failureReason?: string;
  canApprove: boolean;
};

export type AdminSettlementOrganizerOption = {
  id: number;
  name: string;
  email: string;
  tournamentCount?: number;
};

export type AdminSettlementMetrics = {
  settledTournaments: number;
  pendingApprovals: number;
  totalRevenue: string;
  platformCommission: string;
  organizerPayouts: string;
  playerPrizePool: string;
};

export type AdminSettlementsOverview = {
  metrics: AdminSettlementMetrics;
  settlements: AdminSettlementRecord[];
  organizers?: AdminSettlementOrganizerOption[];
};

export type AdminSettlementTypeFilter = "ALL" | "SETTLED" | "NOT_SETTLED";

export const getAdminSettlementsOverview = (params?: {
  type?: AdminSettlementTypeFilter;
  organizerId?: number;
}) => api.get<AdminSettlementsOverview>("/api/admin/settlements", { params });

export const approveAdminSettlement = (settlementId: number) =>
  api.patch<AdminSettlementRecord>(`/api/admin/settlements/${settlementId}/approve`);

export const rejectAdminSettlement = (settlementId: number, reason?: string) =>
  api.patch<AdminSettlementRecord>(`/api/admin/settlements/${settlementId}/reject`, {
    reason,
  });

export type PlatformAnnouncementAudience =
  | "All Users"
  | "Players Only"
  | "Organizers Only";

export const createPlatformAnnouncement = (payload: {
  title: string;
  message: string;
  audience: PlatformAnnouncementAudience;
}) =>
  api.post<{
    success: boolean;
    message: string;
    recipientCount: number;
    audience: string;
  }>("/api/admin/announcements", payload);

export type SupportThread = {
  userId: number;
  username: string;
  email: string;
  lastMessage?: string | null;
  lastSenderType?: string | null;
  lastMessageAt?: string | null;
  messageCount: number;
};

export const getAdminSupportThreads = () =>
  api.get<SupportThread[]>("/api/admin/support/threads");

export const getAdminSupportThreadMessages = (
  userId: string | number,
  limit = 100,
) =>
  api.get<ChatMessage[]>(`/api/admin/support/threads/${userId}/messages`, {
    params: { limit },
  });

export const replyAdminSupportThread = (
  userId: string | number,
  payload: { body: string },
) =>
  api.post<ChatMessage>(`/api/admin/support/threads/${userId}/messages`, payload);
