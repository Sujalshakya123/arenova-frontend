import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import Pagination from "./components/Pagination";
import { PAGE_SIZE } from "./adminData";
import { getApiErrorMessage } from "../../api/axios";
import { REPORTS_ENABLED } from "../../config/reportsConfig";
import {
  SUPER_ADMIN_SETTLEMENT_WINNER_NAMES_ENABLED,
} from "../../config/reportsConfig";
import {
  approveAdminSettlement,
  getAdminSettlementsOverview,
  rejectAdminSettlement,
  type AdminSettlementOrganizerOption,
  type AdminSettlementRecord,
  type AdminSettlementTypeFilter,
} from "../../services/adminApi";

const statusStyle: Record<string, string> = {
  SETTLED: "bg-emerald-50 text-emerald-700",
  PROCESSING: "bg-amber-50 text-amber-700",
  FAILED: "bg-rose-50 text-rose-700",
  "NOT SETTLED": "bg-gray-100 text-gray-600",
  Completed: "bg-emerald-50 text-emerald-700",
  "Pending approval": "bg-amber-50 text-amber-700",
  Rejected: "bg-rose-50 text-rose-700",
  Failed: "bg-rose-50 text-rose-700",
  "Not initiated": "bg-gray-100 text-gray-600",
};

const typeOptions: { value: AdminSettlementTypeFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "SETTLED", label: "Settled" },
  { value: "NOT_SETTLED", label: "Not Settled" },
];

const Settlements = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AdminSettlementTypeFilter>("ALL");
  const [organizerFilter, setOrganizerFilter] = useState("");
  const [organizers, setOrganizers] = useState<AdminSettlementOrganizerOption[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [settlements, setSettlements] = useState<AdminSettlementRecord[]>([]);
  const [selected, setSelected] = useState<AdminSettlementRecord | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [metrics, setMetrics] = useState([
    { id: "pending", label: "Pending approval", value: "—" },
    { id: "count", label: "Approved settlements", value: "—" },
    { id: "revenue", label: "Total revenue settled", value: "—" },
    { id: "platform", label: "Platform earnings (10%)", value: "—" },
  ]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminSettlementsOverview(
        REPORTS_ENABLED
          ? {
              type: typeFilter,
              organizerId: organizerFilter ? Number(organizerFilter) : undefined,
            }
          : undefined,
      );
      setSettlements(response.data.settlements);
      setOrganizers(response.data.organizers ?? []);
      const m = response.data.metrics;
      setMetrics([
        { id: "pending", label: "Pending approval", value: String(m.pendingApprovals) },
        { id: "count", label: "Approved settlements", value: String(m.settledTournaments) },
        { id: "revenue", label: "Total revenue settled", value: m.totalRevenue },
        { id: "platform", label: "Platform earnings (10%)", value: m.platformCommission },
      ]);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load settlements."));
      setSettlements([]);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, organizerFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return settlements;

    // Only search visible table columns — not email (e.g. luhupo.com makes "p" match every row).
    return settlements.filter((row) => {
      const haystack = [row.tournament, row.gameName, row.organizerName, row.status]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [settlements, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const enhancedView = REPORTS_ENABLED;

  const handleApprove = async (row: AdminSettlementRecord) => {
    if (!row.id) return;
    try {
      setActing(true);
      setActionError(null);
      await approveAdminSettlement(row.id);
      setSelected(null);
      setRejectReason("");
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not approve settlement."));
    } finally {
      setActing(false);
    }
  };

  const handleReject = async (row: AdminSettlementRecord) => {
    if (!row.id) return;
    try {
      setActing(true);
      setActionError(null);
      await rejectAdminSettlement(row.id, rejectReason.trim() || undefined);
      setSelected(null);
      setRejectReason("");
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, "Could not reject settlement."));
    } finally {
      setActing(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-700">
        {enhancedView
          ? "View and filter tournament settlement records across all organizers."
          : "Review organizer settlement requests. Approve to finalize the revenue split."}
      </p>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-700 mb-3">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "—" : metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {enhancedView && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as AdminSettlementTypeFilter);
                  setPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[160px]"
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Organizer
              </label>
              <select
                value={organizerFilter}
                onChange={(e) => {
                  setOrganizerFilter(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[220px]"
              >
                <option value="">All Organizers</option>
                {organizers.map((organizer) => (
                  <option key={organizer.id} value={organizer.id}>
                    {organizer.tournamentCount != null
                      ? `${organizer.name} (${organizer.tournamentCount} tournaments)`
                      : organizer.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className={enhancedView ? "self-end" : ""}>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search tournament, game, organizer, or status..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[260px]"
          />
          {search.trim() && (
            <p className="text-xs text-gray-500 mt-1">
              Showing {filtered.length} of {settlements.length} records
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[1200px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">Tournament</th>
              <th className="px-5 py-3 font-medium">Organizer</th>
              {enhancedView && (
                <th className="px-5 py-3 font-medium">Registered Players</th>
              )}
              <th className="px-5 py-3 font-medium">Total Revenue</th>
              <th className="px-5 py-3 font-medium">Commission</th>
              <th className="px-5 py-3 font-medium">Organizer Share</th>
              {enhancedView && (
                <>
                  <th className="px-5 py-3 font-medium">Prize Pool</th>
                  <th className="px-5 py-3 font-medium">1st Place</th>
                  <th className="px-5 py-3 font-medium">2nd Place</th>
                </>
              )}
              <th className="px-5 py-3 font-medium">Status</th>
              {enhancedView && (
                <th className="px-5 py-3 font-medium">Settlement Date</th>
              )}
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={enhancedView ? 12 : 7} className="px-5 py-16 text-center text-gray-500">
                  Loading settlements...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={enhancedView ? 12 : 7} className="px-5 py-16 text-center text-gray-500">
                  No settlement records found.
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr key={row.id ?? `event-${row.eventId}`} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{row.tournament}</p>
                    <p className="text-xs text-gray-500">{row.gameName || "—"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{row.organizerName}</p>
                    <p className="text-xs text-gray-500">{row.organizerEmail}</p>
                  </td>
                  {enhancedView && (
                    <td className="px-5 py-4">
                      {row.registeredPlayerCount ?? row.paidEntryCount}
                    </td>
                  )}
                  <td className="px-5 py-4 font-medium">{row.totalRevenue}</td>
                  <td className="px-5 py-4 text-emerald-700 font-medium">
                    {row.platformShare}
                  </td>
                  <td className="px-5 py-4">{row.organizerShare}</td>
                  {enhancedView && (
                    <>
                      <td className="px-5 py-4">{row.prizePool}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{row.firstPlacePrize}</span>
                          {SUPER_ADMIN_SETTLEMENT_WINNER_NAMES_ENABLED && (
                            <span className="text-xs text-gray-500 mt-0.5">
                              {row.firstPlaceWinner || "—"}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">{row.secondPlacePrize}</span>
                          {SUPER_ADMIN_SETTLEMENT_WINNER_NAMES_ENABLED && (
                            <span className="text-xs text-gray-500 mt-0.5">
                              {row.secondPlaceWinner || "—"}
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusStyle[row.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  {enhancedView && (
                    <td className="px-5 py-4">
                      {row.settlementDate || row.completedAt || "—"}
                    </td>
                  )}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        title="Review"
                        onClick={() => {
                          setSelected(row);
                          setActionError(null);
                          setRejectReason("");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Eye size={13} />
                        Review
                      </button>
                      {row.canApprove && row.id && (
                        <>
                          <button
                            type="button"
                            title="Approve"
                            onClick={() => void handleApprove(row)}
                            disabled={acting}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={13} />
                            Approve
                          </button>
                          <button
                            type="button"
                            title="Reject"
                            onClick={() => {
                              setSelected(row);
                              setActionError(null);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                          >
                            <XCircle size={13} />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900">Review settlement</h3>
            <p className="text-sm text-gray-500 mt-1">{selected.tournament}</p>

            {actionError && (
              <p className="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
                {actionError}
              </p>
            )}

            <dl className="mt-5 space-y-3 text-sm">
              <DetailRow label="Organizer" value={selected.organizerName} />
              <DetailRow label="Email" value={selected.organizerEmail} />
              <DetailRow
                label="Registered players"
                value={String(selected.registeredPlayerCount ?? selected.paidEntryCount)}
              />
              <DetailRow label="Paid entries" value={String(selected.paidEntryCount)} />
              <DetailRow label="Entry fee" value={selected.entryFee || "—"} />
              <DetailRow label="Total revenue" value={selected.totalRevenue} />
              <DetailRow label="Platform share (10%)" value={selected.platformShare} />
              <DetailRow label="Organizer share (20%)" value={selected.organizerShare} />
              <DetailRow label="Prize pool (70%)" value={selected.prizePool} />
              <DetailRow
                label="1st place (40%)"
                value={`${selected.firstPlacePrize} — ${selected.firstPlaceWinner || "—"}`}
              />
              <DetailRow
                label="2nd place (30%)"
                value={`${selected.secondPlacePrize} — ${selected.secondPlaceWinner || "—"}`}
              />
              <DetailRow label="Submitted" value={selected.initiatedAt} />
              <DetailRow
                label="Settlement date"
                value={selected.settlementDate || selected.completedAt || "—"}
              />
              <DetailRow label="Status" value={selected.status} />
              {selected.failureReason && (
                <DetailRow label="Rejection reason" value={selected.failureReason} />
              )}
            </dl>

            {selected.canApprove && selected.id && (
              <div className="mt-5">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Rejection reason (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why this settlement is rejected..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setRejectReason("");
                  setActionError(null);
                }}
                className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg"
                disabled={acting}
              >
                Close
              </button>
              {selected.canApprove && selected.id && (
                <>
                  <button
                    type="button"
                    onClick={() => void handleReject(selected)}
                    disabled={acting}
                    className="px-4 py-2 text-sm font-semibold text-rose-700 border border-rose-200 rounded-lg disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleApprove(selected)}
                    disabled={acting}
                    className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg disabled:opacity-50"
                  >
                    {acting ? "Saving..." : "Approve & complete"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
    <dt className="text-gray-500">{label}</dt>
    <dd className="font-medium text-gray-900 text-right">{value}</dd>
  </div>
);

export default Settlements;
