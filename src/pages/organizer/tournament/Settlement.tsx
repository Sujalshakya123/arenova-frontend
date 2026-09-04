import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { TournamentOutletContext } from "../components/TournamentLayout";
import { SETTLEMENT_ENABLED } from "../../../config/settlementConfig";
import { PRIZE_SPLIT, PLACE_SPLIT } from "../../../config/prizePoolConfig";
import { getApiErrorMessage } from "../../../api/axios";
import {
  getEventSettlement,
  initiateEventSettlement,
  type SettlementRecord,
} from "../../../services/settlementApi";
import { formatRsNpr } from "../../../utils/prizePoolEconomics";

const statusLabel: Record<string, string> = {
  NOT_INITIATED: "Not initiated",
  PENDING_ADMIN_APPROVAL: "Pending admin approval",
  PROCESSING: "Pending admin approval",
  COMPLETED: "Settlement completed",
  REJECTED: "Rejected by admin",
  FAILED: "Failed",
};

const Settlement = () => {
  const { tournament } = useOutletContext<TournamentOutletContext>();
  const [settlement, setSettlement] = useState<SettlementRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const eventId = tournament.id;
  const apiReady = /^\d+$/.test(eventId);

  useEffect(() => {
    if (!SETTLEMENT_ENABLED || !apiReady) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEventSettlement(eventId);
        setSettlement(response.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load settlement."));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [eventId, apiReady]);

  const handleInitiate = async () => {
    if (!apiReady) return;
    try {
      setSubmitting(true);
      setError(null);
      const response = await initiateEventSettlement(eventId);
      setSettlement(response.data);
      setConfirmOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Settlement could not be processed."));
    } finally {
      setSubmitting(false);
    }
  };

  if (!SETTLEMENT_ENABLED) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Settlement is currently disabled.
      </div>
    );
  }

  if (!apiReady) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Save this tournament to the server before using settlement.
      </div>
    );
  }

  if (tournament.status !== "completed") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Settlement is available only after the tournament is marked{" "}
        <strong>completed</strong> (finish the bracket with a champion).
      </div>
    );
  }

  const completed = settlement?.status === "COMPLETED";
  const pendingApproval =
    settlement?.status === "PENDING_ADMIN_APPROVAL" ||
    settlement?.status === "PROCESSING";
  const rejected = settlement?.status === "REJECTED";
  const canInitiate = settlement?.canInitiate ?? false;

  const rows = settlement
    ? [
        {
          label: "Total revenue",
          pct: "100%",
          amount:
            settlement.totalRevenueDisplay ||
            formatRsNpr(settlement.totalRevenueNpr),
        },
        {
          label: "Super Admin / platform",
          pct: `${PRIZE_SPLIT.platform}%`,
          amount:
            settlement.platformAmountDisplay ||
            formatRsNpr(settlement.platformAmountNpr),
        },
        {
          label: "Organizer share",
          pct: `${PRIZE_SPLIT.organizer}%`,
          amount:
            settlement.organizerAmountDisplay ||
            formatRsNpr(settlement.organizerAmountNpr),
        },
        {
          label: "Player prize pool",
          pct: `${PRIZE_SPLIT.prize}%`,
          amount:
            settlement.prizePoolAmountDisplay ||
            formatRsNpr(settlement.prizePoolAmountNpr),
        },
        {
          label: "1st place",
          pct: `${PLACE_SPLIT.first}%`,
          amount:
            settlement.firstPlaceAmountDisplay ||
            formatRsNpr(settlement.firstPlaceAmountNpr),
          winner: settlement.firstPlaceWinnerName,
        },
        {
          label: "2nd place",
          pct: `${PLACE_SPLIT.second}%`,
          amount:
            settlement.secondPlaceAmountDisplay ||
            formatRsNpr(settlement.secondPlaceAmountNpr),
          winner: settlement.secondPlaceWinnerName,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Tournament settlement</h2>
          <p className="text-sm text-gray-500 mt-1">
            Final revenue split from completed entry-fee payments. Ledger only — no
            automatic bank transfer.
          </p>
        </div>
        {completed && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 text-sm font-semibold">
            <CheckCircle2 size={16} />
            Settlement completed
          </span>
        )}
        {pendingApproval && (
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 text-sm font-semibold">
            Pending Super Admin approval
          </span>
        )}
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-12">
          <Loader2 className="animate-spin" size={18} />
          Loading settlement...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <InfoCard label="Tournament" value={settlement?.eventTitle || tournament.name} />
            <InfoCard label="Tournament ID" value={eventId} />
            <InfoCard label="Game" value={settlement?.gameName || tournament.game} />
            <InfoCard
              label="Status"
              value={statusLabel[settlement?.status || "NOT_INITIATED"]}
            />
            <InfoCard
              label="Paid registrations"
              value={String(settlement?.paidEntryCount ?? 0)}
            />
            <InfoCard
              label="Registration fee"
              value={settlement?.entryFeeDisplay || tournament.entryFee || "—"}
            />
            {settlement?.approvedAt && (
              <InfoCard label="Approved at" value={settlement.approvedAt} />
            )}
            {settlement?.completedAt && completed && (
              <InfoCard label="Settled at" value={settlement.completedAt} />
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Revenue breakdown</h3>
              <p className="text-xs text-gray-500 mt-1">
                All percentages are of total revenue from completed payments.
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Item</th>
                  <th className="px-5 py-3 font-medium">Share</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Recipient</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-medium text-gray-900">{row.label}</td>
                    <td className="px-5 py-4 text-gray-600">{row.pct}</td>
                    <td className="px-5 py-4 font-semibold text-gray-900">{row.amount}</td>
                    <td className="px-5 py-4 text-gray-600">
                      {"winner" in row && row.winner ? row.winner : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {rejected && settlement?.failureReason && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
              <strong>Rejected:</strong> {settlement.failureReason}. You can submit
              again after fixing any issues.
            </p>
          )}

          {pendingApproval && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              Your settlement request was submitted. Super Admin must approve it
              before it is finalized.
            </p>
          )}

          {!completed && canInitiate && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
              >
                {submitting ? "Submitting..." : rejected ? "Resubmit settlement" : "Submit for admin approval"}
              </button>
              <Link
                to={`/organizer/tournaments/${eventId}/payments`}
                className="px-5 py-2.5 border border-gray-200 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
              >
                View payment records
              </Link>
            </div>
          )}

          {completed && (
            <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              This tournament has been settled. Amounts are locked for audit and cannot
              be initiated again.
            </p>
          )}
        </>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900">Submit settlement?</h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              This will send the settlement to Super Admin for approval. Amounts are
              locked at submission time. You cannot edit after submitting unless
              admin rejects the request.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleInitiate()}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Yes, submit for approval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    <p className="text-sm font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

export default Settlement;
