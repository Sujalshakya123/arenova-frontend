import api from "../api/axios";

export type OrganizerReportSummary = {
  collectedAmount: string;
  commission: string;
  prize: string;
  sales: string;
};

export type OrganizerReportRow = {
  eventId: number;
  tournament: string;
  date: string;
  collectedAmount: string;
  commission: string;
  prize: string;
  sales: string;
  settlementStatus: string;
};

export type OrganizerReportScope = "revenue" | "all";

export type OrganizerReportsOverview = {
  summary: OrganizerReportSummary;
  rows: OrganizerReportRow[];
  fromDate?: string | null;
  toDate?: string | null;
  includeAllTournaments?: boolean;
  totalTournaments?: number;
  tournamentsWithRevenue?: number;
};

export const getOrganizerReports = (params?: {
  fromDate?: string;
  toDate?: string;
  includeAll?: boolean;
  settlementStatus?: string;
}) => api.get<OrganizerReportsOverview>("/api/organizer/reports", { params });
