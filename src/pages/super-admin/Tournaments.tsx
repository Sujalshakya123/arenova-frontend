import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FiDownload } from "react-icons/fi";
import ActionMenu from "./components/ActionMenu";
import Pagination from "./components/Pagination";
import {
  adminTournamentStatuses,
  PAGE_SIZE,
  type TournamentAdminStatus,
} from "./adminData";
import { downloadCsv } from "../../utils/downloadCsv";
import { usePlatformGames } from "../../context/PlatformGamesContext";
import {
  approveAdminEvent,
  completeAdminEvent,
  getAdminEvents,
  mapApiEventToAdminRow,
  rejectAdminEvent,
  type AdminEventRow,
} from "../../services/adminEventApi";
import { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

const statusClass: Record<TournamentAdminStatus, string> = {
  Live: "bg-rose-50 text-rose-600",
  Pending: "bg-blue-50 text-blue-600",
  Completed: "bg-sky-50 text-sky-700",
  Upcoming: "bg-amber-50 text-amber-700",
};

const statusDot: Record<TournamentAdminStatus, string> = {
  Live: "bg-rose-500",
  Pending: "bg-blue-500",
  Completed: "bg-sky-500",
  Upcoming: "bg-amber-500",
};

const Tournaments = () => {
  const [searchParams] = useSearchParams();
  const { games } = usePlatformGames();
  const [tournaments, setTournaments] = useState<AdminEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("All Games");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pendingReject, setPendingReject] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [rejectBusy, setRejectBusy] = useState(false);
  const [pendingApprove, setPendingApprove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [pendingComplete, setPendingComplete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const loadTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminEvents();
      setTournaments(response.data.map(mapApiEventToAdminRow));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load tournaments."));
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTournaments();
  }, [loadTournaments]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status) setStatusFilter(status);
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      tournaments.filter((t) => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        const matchesGame = gameFilter === "All Games" || t.game === gameFilter;
        const matchesStatus = statusFilter === "All Status" || t.status === statusFilter;
        const matchesDate = !dateFilter || t.date.toLowerCase().includes(dateFilter.toLowerCase());
        return matchesSearch && matchesGame && matchesStatus && matchesDate;
      }),
    [tournaments, search, gameFilter, statusFilter, dateFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pendingCount = tournaments.filter((t) => t.status === "Pending").length;
  const gameOptions = ["All Games", ...games.map((game) => game.name)];

  const resetFilters = () => {
    setSearch("");
    setGameFilter("All Games");
    setStatusFilter("All Status");
    setDateFilter("");
    setPage(1);
  };

  const approveTournament = async (id: string) => {
    setActionBusy(true);
    try {
      const response = await approveAdminEvent(id);
      const row = mapApiEventToAdminRow(response.data);
      setTournaments((prev) => prev.map((t) => (t.id === id ? row : t)));
      if (statusFilter === "Pending") {
        setStatusFilter("All Status");
      }
      toast.success(`"${row.title}" approved.`);
      setPendingApprove(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Could not approve tournament.");
      setError(message);
      toast.error(message);
    } finally {
      setActionBusy(false);
    }
  };

  const rejectTournament = async (id: string, name: string) => {
    setRejectBusy(true);
    try {
      await rejectAdminEvent(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
      toast.success(`"${name}" rejected and removed.`);
      setPendingReject(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Could not reject tournament.");
      setError(message);
      toast.error(message);
    } finally {
      setRejectBusy(false);
    }
  };

  const completeTournament = async (id: string) => {
    setActionBusy(true);
    try {
      const response = await completeAdminEvent(id);
      const row = mapApiEventToAdminRow(response.data);
      setTournaments((prev) => prev.map((t) => (t.id === id ? row : t)));
      toast.success(`"${row.title}" marked completed.`);
      setPendingComplete(null);
    } catch (err) {
      const message = getApiErrorMessage(err, "Could not mark tournament completed.");
      setError(message);
      toast.error(message);
    } finally {
      setActionBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          {loading
            ? "Loading tournaments..."
            : `${tournaments.length} tournaments on the platform`}
          {!loading && pendingCount > 0 && (
            <span className="text-amber-600 font-medium">
              {" "}
              · {pendingCount} waiting for approval
            </span>
          )}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              downloadCsv(
                "arenova-tournaments.csv",
                ["Name", "Game", "Organizer", "Prize pool", "Date", "Status"],
                filtered.map((t) => [
                  t.title,
                  t.game,
                  t.organizer,
                  t.prizePool,
                  t.date,
                  t.status,
                ]),
              );
              toast.success(`Exported ${filtered.length} tournaments.`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer"
          >
            <FiDownload size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <select
          value={gameFilter}
          onChange={(e) => {
            setGameFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {gameOptions.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {adminTournamentStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by date..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search tournaments..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[200px]"
        />
        <button
          type="button"
          onClick={resetFilters}
          className="px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg bg-white cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">Tournament</th>
              <th className="px-5 py-3 font-medium">Game</th>
              <th className="px-5 py-3 font-medium">Organizer</th>
              <th className="px-5 py-3 font-medium">Prize pool</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium w-12" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-700">
                  Loading tournaments...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-sm text-gray-700">
                  No tournaments match this filter.
                </td>
              </tr>
            ) : (
              paged.map((t) => (
                <tr key={t.id} className="border-t border-gray-100">
                  <td className="px-5 py-4 font-medium text-gray-900">{t.title}</td>
                  <td className="px-5 py-4 text-gray-700">{t.game}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${t.organizerColor}`}
                      >
                        {t.organizerInitial}
                      </span>
                      <span className="text-gray-700">{t.organizer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{t.prizePool}</td>
                  <td className="px-5 py-4 text-gray-700">{t.date}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass[t.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[t.status]}`} />
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ActionMenu
                      items={[
                        ...(t.status === "Pending"
                          ? [
                              {
                                label: "Approve",
                                tone: "primary" as const,
                                onClick: () =>
                                  setPendingApprove({ id: t.id, name: t.title }),
                              },
                              {
                                label: "Reject",
                                tone: "danger" as const,
                                onClick: () =>
                                  setPendingReject({ id: t.id, name: t.title }),
                              },
                            ]
                          : []),
                        ...(t.status === "Live"
                          ? [
                              {
                                label: "Mark completed",
                                onClick: () =>
                                  setPendingComplete({ id: t.id, name: t.title }),
                              },
                            ]
                          : []),
                      ]}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <ConfirmModal
        open={Boolean(pendingApprove)}
        title="Approve tournament?"
        message={
          pendingApprove
            ? `Approve "${pendingApprove.name}"? Players will be able to register once it goes live.`
            : ""
        }
        confirmLabel="Approve"
        busy={actionBusy}
        onConfirm={() => {
          if (pendingApprove) void approveTournament(pendingApprove.id);
        }}
        onCancel={() => {
          if (!actionBusy) setPendingApprove(null);
        }}
      />

      <ConfirmModal
        open={Boolean(pendingComplete)}
        title="Mark tournament completed?"
        message={
          pendingComplete
            ? `Mark "${pendingComplete.name}" as completed? This usually means the event has finished.`
            : ""
        }
        confirmLabel="Mark completed"
        busy={actionBusy}
        onConfirm={() => {
          if (pendingComplete) void completeTournament(pendingComplete.id);
        }}
        onCancel={() => {
          if (!actionBusy) setPendingComplete(null);
        }}
      />

      <ConfirmModal
        open={Boolean(pendingReject)}
        title="Reject tournament?"
        message={
          pendingReject
            ? `Reject "${pendingReject.name}"? It will be removed from the platform.`
            : ""
        }
        confirmLabel="Reject"
        danger
        busy={rejectBusy}
        onConfirm={() => {
          if (pendingReject) {
            void rejectTournament(pendingReject.id, pendingReject.name);
          }
        }}
        onCancel={() => {
          if (!rejectBusy) setPendingReject(null);
        }}
      />
    </div>
  );
};

export default Tournaments;
