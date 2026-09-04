import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import Pagination from "../super-admin/components/Pagination";
import { PAGE_SIZE } from "../super-admin/adminData";
import { getApiErrorMessage } from "../../api/axios";
import {
  REPORTS_ENABLED,
  REPORTS_STATUS_FILTER_ENABLED,
} from "../../config/reportsConfig";
import {
  getOrganizerReports,
  type OrganizerReportRow,
  type OrganizerReportSummary,
} from "../../services/organizerReportApi";

const emptySummary: OrganizerReportSummary = {
  collectedAmount: "Rs. 0",
  commission: "Rs. 0",
  prize: "Rs. 0",
  sales: "Rs. 0",
};

const statusStyle: Record<string, string> = {
  Settled: "bg-emerald-50 text-emerald-700",
  Processing: "bg-amber-50 text-amber-700",
  Failed: "bg-rose-50 text-rose-700",
  "Not Settled": "bg-gray-100 text-gray-600",
  "No revenue": "bg-slate-100 text-slate-500",
};

const scopeOptions = [
  { value: "revenue" as const, label: "With revenue only" },
  { value: "all" as const, label: "All tournaments" },
];

const Reports = () => {
  const [scope, setScope] = useState<"revenue" | "all">("revenue");
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<
    "ALL" | "SETTLED" | "NOT_SETTLED" | "PROCESSING" | "FAILED" | "NO_REVENUE"
  >("ALL");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState<string | undefined>();
  const [appliedTo, setAppliedTo] = useState<string | undefined>();
  const [summary, setSummary] = useState<OrganizerReportSummary>(emptySummary);
  const [rows, setRows] = useState<OrganizerReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof OrganizerReportRow>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [totalTournaments, setTotalTournaments] = useState(0);
  const [tournamentsWithRevenue, setTournamentsWithRevenue] = useState(0);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrganizerReports({
        fromDate: appliedFrom,
        toDate: appliedTo,
        includeAll: scope === "all",
        settlementStatus: REPORTS_STATUS_FILTER_ENABLED
          ? settlementStatusFilter
          : undefined,
      });
      setSummary(response.data.summary);
      setRows(response.data.rows);
      setTotalTournaments(response.data.totalTournaments ?? response.data.rows.length);
      setTournamentsWithRevenue(
        response.data.tournamentsWithRevenue ??
          response.data.rows.filter((row) => row.settlementStatus !== "No revenue").length,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load reports."));
      setSummary(emptySummary);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [appliedFrom, appliedTo, scope, settlementStatusFilter]);

  useEffect(() => {
    if (!REPORTS_ENABLED) {
      setLoading(false);
      return;
    }
    void load();
  }, [load]);

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const left = String(a[sortKey] ?? "");
      const right = String(b[sortKey] ?? "");
      const cmp = left.localeCompare(right, undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedRows;
    return sortedRows.filter((row) => {
      const haystack = [
        row.tournament,
        row.date,
        row.collectedAmount,
        row.commission,
        row.prize,
        row.sales,
        row.settlementStatus,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [sortedRows, search]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const paged = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: keyof OrganizerReportRow) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleApply = () => {
    setAppliedFrom(fromDate || undefined);
    setAppliedTo(toDate || undefined);
    setPage(1);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    setSearch("");
    setSettlementStatusFilter("ALL");
    setAppliedFrom(undefined);
    setAppliedTo(undefined);
    setPage(1);
  };

  if (!REPORTS_ENABLED) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Reports are currently disabled.
      </div>
    );
  }

  const summaryCards = [
    { id: "collected", label: "Collected Amount", value: summary.collectedAmount },
    { id: "commission", label: "Commission", value: summary.commission },
    { id: "prize", label: "Prize", value: summary.prize },
    { id: "sales", label: "Sales", value: summary.sales },
  ];

  return (
    <div className="px-10 py-8 min-h-full space-y-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
          <BarChart3 size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-600 mt-1">
            Financial performance for your tournaments. Amounts are calculated from
            completed payments only.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Show
            </label>
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as "revenue" | "all");
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[180px]"
            >
              {scopeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
            />
          </div>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Apply Filter
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg"
          >
            Clear Filter
          </button>

          {REPORTS_STATUS_FILTER_ENABLED && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Settlement Status
              </label>
              <select
                value={settlementStatusFilter}
                onChange={(e) => {
                  setSettlementStatusFilter(
                    e.target.value as
                      | "ALL"
                      | "SETTLED"
                      | "NOT_SETTLED"
                      | "PROCESSING"
                      | "FAILED"
                      | "NO_REVENUE",
                  );
                  setPage(1);
                }}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[200px]"
              >
                <option value="ALL">All</option>
                <option value="SETTLED">Settled</option>
                <option value="NOT_SETTLED">Not Settled</option>
                <option value="PROCESSING">Processing</option>
                <option value="FAILED">Failed</option>
                <option value="NO_REVENUE">No revenue</option>
              </select>
            </div>
          )}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search tournament or status..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[260px]"
          />
        </div>
        <p className="text-xs text-gray-500">
          {scope === "all"
            ? `Showing ${rows.length} of ${totalTournaments} tournaments (${tournamentsWithRevenue} with revenue). Summary cards count revenue only.`
            : `Showing ${rows.length} tournament${rows.length === 1 ? "" : "s"} with completed payments.`}
        </p>
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div key={card.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-gray-600 mb-2">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[920px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <SortHeader label="Tournament" onClick={() => toggleSort("tournament")} />
              <SortHeader label="Date" onClick={() => toggleSort("date")} />
              <SortHeader label="Collected Amount" onClick={() => toggleSort("collectedAmount")} />
              <SortHeader label="Commission" onClick={() => toggleSort("commission")} />
              <SortHeader label="Prize" onClick={() => toggleSort("prize")} />
              <SortHeader label="Sales" onClick={() => toggleSort("sales")} />
              <SortHeader label="Status" onClick={() => toggleSort("settlementStatus")} />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-gray-500">
                  Loading reports...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-gray-500">
                  {scope === "all"
                    ? "No tournaments found."
                    : "No tournaments with completed payments for the selected period."}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={row.eventId}
                  className={`border-t border-gray-100 ${
                    row.settlementStatus === "No revenue" ? "bg-gray-50/60" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-medium text-gray-900">{row.tournament}</td>
                  <td className="px-5 py-4">{row.date}</td>
                  <td className="px-5 py-4 font-medium">{row.collectedAmount}</td>
                  <td className="px-5 py-4 text-emerald-700">{row.commission}</td>
                  <td className="px-5 py-4">{row.prize}</td>
                  <td className="px-5 py-4">{row.sales}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        statusStyle[row.settlementStatus] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {row.settlementStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

const SortHeader = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <th className="px-5 py-3 font-medium">
    <button type="button" onClick={onClick} className="hover:text-gray-900">
      {label}
    </button>
  </th>
);

export default Reports;
