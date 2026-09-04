import { useEffect, type ReactNode } from "react";
import {
  FiCheck,
  FiCreditCard,
  FiFileText,
  FiHash,
  FiPrinter,
  FiShield,
  FiUser,
  FiX,
} from "react-icons/fi";
import { GiTrophyCup } from "react-icons/gi";
import logo from "../assets/Title_LOGO.png";
import type { PaymentReceipt } from "../services/paymentReceiptTypes";

type Props = {
  open: boolean;
  receipt: PaymentReceipt | null;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
};

const statusBadge = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "completed") {
    return {
      label: "PAID",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      showCheck: true,
    };
  }
  if (normalized === "pending") {
    return {
      label: "PENDING",
      className: "bg-amber-50 text-amber-700 border-amber-200",
      showCheck: false,
    };
  }
  return {
    label: normalized.toUpperCase(),
    className: "bg-rose-50 text-rose-700 border-rose-200",
    showCheck: false,
  };
};

const statusMessage = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "completed") return "Payment completed successfully.";
  if (normalized === "pending") return "Payment is pending confirmation.";
  return "Payment was not completed.";
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <span className="text-blue-600 mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-900 break-all">{value || "—"}</p>
    </div>
  </div>
);

const PaymentReceiptModal = ({
  open,
  receipt,
  loading = false,
  error = null,
  onClose,
}: Props) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const badge = receipt ? statusBadge(receipt.status) : null;
  const metaDate = receipt?.paidAt || receipt?.createdAt || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 print:bg-white print:static print:p-0">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-receipt-title"
        id="payment-receipt-print"
        className="flex w-full max-w-md rounded-2xl shadow-xl border border-gray-200 overflow-hidden bg-white print:shadow-none print:border-0 print:max-w-none"
      >
        <div className="w-1.5 shrink-0 bg-blue-600 print:bg-blue-600" aria-hidden />

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="relative px-5 pt-5 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer print:hidden"
              aria-label="Close"
            >
              <FiX size={18} />
            </button>

            <div className="flex items-start justify-between gap-3 pr-8">
              <img
                src={logo}
                alt="Arenova"
                className="h-8 w-auto object-contain"
              />
              {badge ? (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${badge.className}`}
                >
                  {badge.showCheck ? <FiCheck size={12} strokeWidth={3} /> : null}
                  {badge.label}
                </span>
              ) : null}
            </div>

            <h2
              id="payment-receipt-title"
              className="mt-4 text-xl font-bold text-gray-900"
            >
              Payment Receipt
            </h2>
            {receipt ? (
              <p className="mt-1 text-xs text-gray-500">
                #{receipt.id}
                {metaDate ? ` • ${metaDate}` : ""}
              </p>
            ) : null}
          </div>

          <div className="px-5 pb-4 flex-1">
            {loading ? (
              <p className="text-sm text-gray-600 py-10 text-center">
                Loading receipt...
              </p>
            ) : error ? (
              <p className="text-sm text-rose-600 py-10 text-center">{error}</p>
            ) : receipt ? (
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{receipt.amount}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {statusMessage(receipt.status)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-1 divide-y divide-gray-100">
                  <DetailItem
                    icon={<GiTrophyCup size={16} />}
                    label="Tournament"
                    value={receipt.tournament}
                  />
                  <DetailItem
                    icon={<FiUser size={16} />}
                    label="Player"
                    value={receipt.playerName}
                  />
                  <DetailItem
                    icon={<FiCreditCard size={16} />}
                    label="Method"
                    value={receipt.method}
                  />
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-1 divide-y divide-gray-100">
                  <DetailItem
                    icon={<FiHash size={16} />}
                    label="Transaction ID"
                    value={receipt.transactionUuid}
                  />
                  <DetailItem
                    icon={<FiFileText size={16} />}
                    label="eSewa Ref"
                    value={receipt.esewaRefId || "—"}
                  />
                </div>

                {receipt.email ? (
                  <p className="text-xs text-gray-500 px-1">
                    Receipt sent to {receipt.email}
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-gray-600 py-10 text-center">
                No receipt data.
              </p>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-600">
                <FiShield size={14} />
              </span>
              <span>Thank you for playing on Arenova.</span>
            </div>

            <div className="flex justify-end gap-2 print:hidden">
              {receipt && !loading && !error ? (
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <FiPrinter size={14} />
                  Print
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
