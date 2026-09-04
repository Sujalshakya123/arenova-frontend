import { useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Pagination from "./components/Pagination";
import { auditLogs, PAGE_SIZE } from "./adminData";
import { downloadCsv } from "../../utils/downloadCsv";

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      auditLogs.filter((log) => {
        const q = search.toLowerCase();
        return (
          log.actor.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.target.toLowerCase().includes(q)
        );
      }),
    [search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          Recent admin actions from the demo dataset.
        </p>
        <button
          type="button"
          onClick={() =>
            downloadCsv(
              "arenova-audit-logs.csv",
              ["Actor", "Action", "Target", "Time"],
              filtered.map((log) => [log.actor, log.action, log.target, log.time]),
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer"
        >
          <FiDownload size={14} />
          Export CSV
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search logs..."
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[220px]"
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">Actor</th>
              <th className="px-5 py-3 font-medium">Action</th>
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-5 py-16 text-center text-sm text-gray-700"
                >
                  No logs match this search.
                </td>
              </tr>
            ) : (
              paged.map((log) => (
                <tr key={log.id} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {log.actor}
                  </td>
                  <td className="px-5 py-4 text-gray-700">{log.action}</td>
                  <td className="px-5 py-4 text-gray-700">{log.target}</td>
                  <td className="px-5 py-4 text-gray-700">{log.time}</td>
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

export default AuditLogs;
