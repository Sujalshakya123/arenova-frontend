import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import ActionMenu from "./components/ActionMenu";
import ConfirmModal from "./components/ConfirmModal";
import Pagination from "./components/Pagination";
import { PAGE_SIZE, type OrganizerStatus } from "./adminData";
import { downloadCsv } from "../../utils/downloadCsv";
import { getApiErrorMessage } from "../../api/axios";
import {
  adminDeleteUser,
  adminUpdateUserStatus,
  getAdminOrganizers,
  type AdminOrganizer,
} from "../../services/adminApi";
import type { ApiUserStatus } from "../../services/userApi";

const statusStyle: Record<OrganizerStatus, string> = {
  Pending: "bg-amber-50 text-amber-700",
  Active: "bg-emerald-50 text-emerald-700",
  Flagged: "bg-rose-50 text-rose-600",
  Rejected: "bg-gray-100 text-gray-700",
};

const avatarColors = [
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-rose-100 text-rose-700",
  "bg-violet-100 text-violet-700",
];

/** Map backend UserStatus to organizer UI labels */
const toOrganizerStatus = (status?: ApiUserStatus | null): OrganizerStatus => {
  if (status === "PENDING" || status === "INACTIVE") return "Pending";
  if (status === "REJECTED") return "Rejected";
  if (status === "SUSPENDED") return "Flagged";
  return "Active";
};

const toApiStatus = (status: OrganizerStatus): ApiUserStatus => {
  if (status === "Pending") return "PENDING";
  if (status === "Rejected") return "REJECTED";
  if (status === "Flagged") return "SUSPENDED";
  return "ACTIVE";
};

const formatRegisteredAt = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

type AdminOrganizerRow = {
  id: number;
  name: string;
  email: string;
  tournaments: number;
  registeredAt: string;
  status: OrganizerStatus;
  initial: string;
  avatarColor: string;
};

const mapOrganizer = (user: AdminOrganizer, index: number): AdminOrganizerRow => {
  const name = user.fullName || user.username || user.email;
  return {
    id: user.id,
    name,
    email: user.email,
    tournaments: user.tournamentCount,
    registeredAt: formatRegisteredAt(user.registeredAt),
    status: toOrganizerStatus(user.status),
    initial: (name[0] ?? "O").toUpperCase(),
    avatarColor: avatarColors[index % avatarColors.length],
  };
};

const Organizers = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrganizerStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [organizers, setOrganizers] = useState<AdminOrganizerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<
    | { type: "status"; org: AdminOrganizerRow; status: OrganizerStatus }
    | { type: "remove"; org: AdminOrganizerRow }
    | null
  >(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const status = searchParams.get("status") as OrganizerStatus | null;
    if (status) setStatusFilter(status);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAdminOrganizers();
        setOrganizers(response.data.map(mapOrganizer));
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load organizers."));
        setOrganizers([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      organizers.filter((o) => {
        const matchesSearch =
          o.name.toLowerCase().includes(search.toLowerCase()) ||
          o.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [organizers, search, statusFilter],
  );

  const stats = useMemo(
    () => ({
      total: organizers.length,
      pending: organizers.filter((o) => o.status === "Pending").length,
      flagged: organizers.filter((o) => o.status === "Flagged").length,
    }),
    [organizers],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const closeConfirm = () => {
    if (busy) return;
    setPending(null);
  };

  const runPending = async () => {
    if (!pending) return;
    setBusy(true);
    setError(null);
    try {
      if (pending.type === "remove") {
        await adminDeleteUser(pending.org.id);
        setOrganizers((prev) => prev.filter((o) => o.id !== pending.org.id));
        toast.success(`${pending.org.name} was removed.`);
      } else {
        await adminUpdateUserStatus(pending.org.id, toApiStatus(pending.status));
        setOrganizers((prev) =>
          prev.map((o) =>
            o.id === pending.org.id ? { ...o, status: pending.status } : o,
          ),
        );
        toast.success(`${pending.org.name} is now ${pending.status.toLowerCase()}.`);
      }
      setPending(null);
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        pending.type === "remove"
          ? "Could not remove organizer."
          : "Could not update organizer status.",
      );
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  const confirmCopy = (() => {
    if (!pending) {
      return {
        title: "",
        message: "",
        confirmLabel: "Confirm",
        danger: false,
      };
    }
    if (pending.type === "remove") {
      return {
        title: "Remove organizer",
        message: `Remove organizer ${pending.org.name} permanently? This cannot be undone.`,
        confirmLabel: "Remove",
        danger: true,
      };
    }
    if (pending.status === "Flagged") {
      return {
        title: "Flag organizer",
        message: `Flag ${pending.org.name}? Their account will be suspended.`,
        confirmLabel: "Flag",
        danger: true,
      };
    }
    if (pending.status === "Rejected") {
      return {
        title: "Reject organizer",
        message: `Reject ${pending.org.name}'s registration? They will not be able to access the organizer dashboard.`,
        confirmLabel: "Reject",
        danger: true,
      };
    }
    if (pending.status === "Pending") {
      return {
        title: "Mark pending",
        message: `Mark ${pending.org.name} as pending?`,
        confirmLabel: "Mark pending",
        danger: false,
      };
    }
    return {
      title: pending.org.status === "Flagged" ? "Unflag organizer" : "Approve organizer",
      message:
        pending.org.status === "Flagged"
          ? `Unflag ${pending.org.name} and restore active access?`
          : `Approve ${pending.org.name} as an active organizer?`,
      confirmLabel: pending.org.status === "Flagged" ? "Unflag" : "Approve",
      danger: false,
    };
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-700">Approve and monitor tournament organizers</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              downloadCsv(
                "arenova-organizers.csv",
                ["Name", "Email", "Tournaments", "Status"],
                filtered.map((o) => [o.name, o.email, o.tournaments, o.status]),
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer"
          >
            <FiDownload size={14} />
            Export
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrganizerStatus | "All")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="All">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Rejected">Rejected</option>
            <option value="Flagged">Flagged</option>
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizers..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-700">Total organizers</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{loading ? "—" : stats.total}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-700">Pending approval</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{loading ? "—" : stats.pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-700">Flagged</p>
          <p className="text-2xl font-bold mt-1 text-gray-900">{loading ? "—" : stats.flagged}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">Organizer</th>
              <th className="px-5 py-3 font-medium">Registered</th>
              <th className="px-5 py-3 font-medium">Tournaments</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium w-12" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-600">
                  Loading organizers...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-600">
                  No organizers match this filter.
                </td>
              </tr>
            ) : (
              paged.map((org) => (
                <tr key={org.id} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${org.avatarColor}`}
                      >
                        {org.initial}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{org.name}</p>
                        <p className="text-gray-700 text-sm">{org.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{org.registeredAt}</td>
                  <td className="px-5 py-4">{org.tournaments}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[org.status]}`}
                    >
                      {org.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ActionMenu
                      items={[
                        ...(org.status === "Pending"
                          ? [
                              {
                                label: "Approve",
                                onClick: () =>
                                  setPending({
                                    type: "status",
                                    org,
                                    status: "Active",
                                  }),
                              },
                              {
                                label: "Reject",
                                tone: "danger" as const,
                                onClick: () =>
                                  setPending({
                                    type: "status",
                                    org,
                                    status: "Rejected",
                                  }),
                              },
                            ]
                          : [
                              {
                                label: "Approve",
                                onClick: () =>
                                  setPending({
                                    type: "status",
                                    org,
                                    status: "Active",
                                  }),
                              },
                            ]),
                        {
                          label: org.status === "Flagged" ? "Unflag" : "Flag",
                          onClick: () =>
                            setPending({
                              type: "status",
                              org,
                              status:
                                org.status === "Flagged" ? "Active" : "Flagged",
                            }),
                        },
                        {
                          label: "Remove",
                          tone: "danger",
                          onClick: () => setPending({ type: "remove", org }),
                        },
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
        open={Boolean(pending)}
        title={confirmCopy.title}
        message={confirmCopy.message}
        confirmLabel={confirmCopy.confirmLabel}
        danger={confirmCopy.danger}
        busy={busy}
        onCancel={closeConfirm}
        onConfirm={() => void runPending()}
      />
    </div>
  );
};

export default Organizers;
