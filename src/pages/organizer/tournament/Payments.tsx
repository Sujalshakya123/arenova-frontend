import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import PaymentReceiptModal from "../../../components/PaymentReceiptModal";
import type { TournamentOutletContext } from "../components/TournamentLayout";
import { getApiErrorMessage } from "../../../api/axios";
import {
  getOrganizerEventPaymentReceipt,
  getOrganizerEventPayments,
} from "../../../services/organizerPaymentApi";
import type { PaymentReceipt } from "../../../services/paymentReceiptTypes";
import { adminPaymentStatuses, type PaymentStatus } from "../../super-admin/adminData";

const statusStyle: Record<PaymentStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-rose-50 text-rose-700",
};

const TournamentPayments = () => {
  const { tournament } = useOutletContext<TournamentOutletContext>();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState([
    { id: "revenue", label: "Total revenue", value: "—" },
    { id: "commission", label: "Platform (10%)", value: "—" },
    { id: "organizer", label: "Your share (20%)", value: "—" },
    { id: "paid", label: "Paid entries", value: "—" },
  ]);
  const [payments, setPayments] = useState<
    Array<{
      id: number;
      name: string;
      email: string;
      amount: string;
      method: string;
      date: string;
      status: PaymentStatus;
    }>
  >([]);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  const eventId = tournament.id;
  const apiReady = /^\d+$/.test(eventId);

  useEffect(() => {
    if (!apiReady) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getOrganizerEventPayments(eventId);
        const m = response.data.metrics;
        setMetrics([
          { id: "revenue", label: "Total revenue", value: m.totalRevenue },
          { id: "commission", label: "Platform (10%)", value: m.platformCommission },
          { id: "organizer", label: "Your share (20%)", value: m.organizerShare },
          { id: "paid", label: "Paid entries", value: m.paidEntries },
        ]);
        setPayments(
          response.data.payments.map((p) => ({
            id: p.id,
            name: p.playerName,
            email: p.email,
            amount: p.amount,
            method: p.method,
            date: p.date,
            status: p.status as PaymentStatus,
          })),
        );
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load payments."));
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [eventId, apiReady]);

  const filtered = useMemo(
    () =>
      payments.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "All Status" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [payments, search, statusFilter],
  );

  const openReceipt = async (paymentId: number) => {
    setReceiptOpen(true);
    setReceipt(null);
    setReceiptError(null);
    setReceiptLoading(true);
    try {
      const response = await getOrganizerEventPaymentReceipt(eventId, paymentId);
      setReceipt(response.data);
    } catch (err) {
      setReceiptError(getApiErrorMessage(err, "Could not load receipt."));
    } finally {
      setReceiptLoading(false);
    }
  };

  if (!apiReady) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        Save this tournament to the server before viewing payments.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Payment records</h2>
        <p className="text-sm text-gray-500 mt-1">
          Entry-fee payments for <strong>{tournament.name}</strong> (completed
          registrations only count toward settlement).
        </p>
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "—" : metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {adminPaymentStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search player..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[220px]"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">Player</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Method</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-gray-500">
                  No payments yet.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-gray-500 text-xs">{p.email}</p>
                  </td>
                  <td className="px-5 py-4 font-medium">{p.amount}</td>
                  <td className="px-5 py-4 text-gray-600">{p.method}</td>
                  <td className="px-5 py-4 text-gray-600">{p.date}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => void openReceipt(p.id)}
                      className="text-sm font-medium text-blue-700 hover:underline"
                    >
                      View receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PaymentReceiptModal
        open={receiptOpen}
        receipt={receipt}
        loading={receiptLoading}
        error={receiptError}
        onClose={() => {
          setReceiptOpen(false);
          setReceipt(null);
          setReceiptError(null);
        }}
      />
    </div>
  );
};

export default TournamentPayments;
