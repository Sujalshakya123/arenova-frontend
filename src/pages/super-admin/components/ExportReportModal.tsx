import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiDownload, FiX } from "react-icons/fi";
import { downloadCsv } from "../../../utils/downloadCsv";
import { adminPayments, type AdminPayment } from "../adminData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  payments?: AdminPayment[];
};

const ranges = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"] as const;

const rangeDays = (range: (typeof ranges)[number]) => {
  if (range === "Last 7 Days") return 7;
  if (range === "Last 30 Days") return 30;
  if (range === "Last 90 Days") return 90;
  return 365;
};

const parsePaymentDate = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const filterByRange = (rows: AdminPayment[], range: (typeof ranges)[number]) => {
  const cutoff = Date.now() - rangeDays(range) * 24 * 60 * 60 * 1000;
  return rows.filter((row) => {
    const time = parsePaymentDate(row.date);
    return time == null || time >= cutoff;
  });
};

const ExportReportModal = ({ isOpen, onClose, payments = adminPayments }: Props) => {
  const [range, setRange] = useState<(typeof ranges)[number]>(ranges[1]);
  const [rangeOpen, setRangeOpen] = useState(false);
  const rangeRef = useRef<HTMLDivElement>(null);
  const [exportedCount, setExportedCount] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setExportedCount(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const onClickOutside = (e: MouseEvent) => {
      if (rangeRef.current && !rangeRef.current.contains(e.target as Node)) {
        setRangeOpen(false);
      }
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = () => {
    const rows = filterByRange(payments, range);
    downloadCsv(
      `arenova-payments-${range.replace(/\s+/g, "-").toLowerCase()}.csv`,
      ["Player", "Email", "Tournament", "Amount", "Method", "Date", "Status"],
      rows.map((p) => [
        p.name,
        p.email,
        p.tournament,
        p.amount,
        p.method,
        p.date,
        p.status,
      ]),
    );
    setExportedCount(rows.length);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Export Report</h2>
            <p className="text-sm text-gray-500 mt-1">
              Download payment and revenue data as CSV.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Format</label>
            <p className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700">
              CSV
            </p>
          </div>

          <div ref={rangeRef} className="relative">
            <label className="text-sm font-medium text-gray-700">Date range</label>
            <button
              type="button"
              onClick={() => setRangeOpen((v) => !v)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center justify-between cursor-pointer bg-white"
            >
              {range}
              <FiChevronDown size={16} className="text-gray-400" />
            </button>
            {rangeOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                {ranges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setRange(item);
                      setRangeOpen(false);
                      setExportedCount(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {exportedCount != null && (
          <p className="text-xs text-emerald-600 mt-4">
            Downloaded {exportedCount} payment{exportedCount === 1 ? "" : "s"} as CSV.
          </p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
          >
            <FiDownload size={14} />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportReportModal;
