import { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import ExportReportModal from "./components/ExportReportModal";
import Pagination from "./components/Pagination";
import PaymentReceiptModal from "../../components/PaymentReceiptModal";
import {
  adminPaymentStatuses,
  PAGE_SIZE,
  type AdminPayment,
  type PaymentStatus,
} from "./adminData";
import { getApiErrorMessage } from "../../api/axios";
import {
  getAdminPaymentReceipt,
  getAdminPaymentsOverview,
  type AdminPaymentRecord,
} from "../../services/adminApi";
import type { PaymentReceipt } from "../../services/paymentReceiptTypes";
const statusStyle: Record<PaymentStatus, string> = {
  Completed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-rose-50 text-rose-700",
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

const mapPayment = (record: AdminPaymentRecord, index: number): AdminPayment => {
  const initials = record.playerName
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: record.id,
    name: record.playerName,
    email: record.email,
    initials: initials || "P",
    avatarColor: avatarColors[index % avatarColors.length],
    tournament: record.tournament,
    amount: record.amount,
    method: record.method,
    date: record.date,
    status: record.status,
  };
};

const Payments = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [page, setPage] = useState(1);
  const [showExport, setShowExport] = useState(false);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [metrics, setMetrics] = useState([
    { id: "revenue", label: "Total Revenue", value: "—" },
    { id: "commission", label: "Platform Commission", value: "—" },
    { id: "refunds", label: "Refunds", value: "—" },
    { id: "success", label: "Success Rate", value: "—" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);

  const openReceipt = async (paymentId: number) => {
    setReceiptOpen(true);
    setReceipt(null);
    setReceiptError(null);
    setReceiptLoading(true);
    try {
      const response = await getAdminPaymentReceipt(paymentId);
      setReceipt(response.data);
    } catch (err) {
      setReceiptError(getApiErrorMessage(err, "Could not load receipt."));
    } finally {
      setReceiptLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAdminPaymentsOverview();
        setPayments(response.data.payments.map(mapPayment));
        const m = response.data.metrics;
        setMetrics([
          { id: "revenue", label: "Total Revenue", value: m.totalRevenue },
          { id: "commission", label: "Platform Commission", value: m.platformCommission },
          { id: "refunds", label: "Failed payments", value: m.refunds },
          { id: "success", label: "Success Rate", value: m.successRate },
        ]);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load payments."));
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      payments.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.tournament.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All Status" || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [payments, search, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          Live eSewa payment records from tournament entry fees (10% platform commission on completed).
        </p>
        <button
          type="button"
          onClick={() => setShowExport(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
        >
          <FiDownload size={14} />
          Export report
        </button>
      </div>

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

      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search payments..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[220px]"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">Player</th>
              <th className="px-5 py-3 font-medium">Tournament</th>
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
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-700">
                  Loading payments...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-700">
                  No payments match this filter.
                </td>
              </tr>
            ) : (
              paged.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${p.avatarColor}`}
                      >
                        {p.initials}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{p.name}</p>
                        <p className="text-gray-700 text-sm">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{p.tournament}</td>
                  <td className="px-5 py-4 font-medium">{p.amount}</td>
                  <td className="px-5 py-4 text-gray-700">{p.method}</td>
                  <td className="px-5 py-4 text-gray-700">{p.date}</td>
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
                      className="text-sm font-medium text-blue-700 hover:underline cursor-pointer"
                    >
                      View receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ExportReportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        payments={filtered}
      />

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
export default Payments;
