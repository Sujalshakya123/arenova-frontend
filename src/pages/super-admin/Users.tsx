import { useEffect, useMemo, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { toast } from "react-toastify";
import ActionMenu from "./components/ActionMenu";
import ConfirmModal from "./components/ConfirmModal";
import Pagination from "./components/Pagination";
import { PAGE_SIZE, type AdminUser, type AdminUserStatus } from "./adminData";
import { downloadCsv } from "../../utils/downloadCsv";
import { getApiErrorMessage } from "../../api/axios";
import {
  adminDeleteUser,
  adminUpdateUserStatus,
  getAdminPlayers,
  type AdminPlayer,
} from "../../services/adminApi";
import type { ApiUserStatus } from "../../services/userApi";

const statusStyle: Record<AdminUserStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-600",
  Suspended: "bg-rose-50 text-rose-600",
};

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
];

const toAdminStatus = (status?: ApiUserStatus | null): AdminUserStatus => {
  if (status === "INACTIVE") return "Inactive";
  if (status === "SUSPENDED") return "Suspended";
  return "Active";
};

const toApiStatus = (status: AdminUserStatus): ApiUserStatus => {
  if (status === "Inactive") return "INACTIVE";
  if (status === "Suspended") return "SUSPENDED";
  return "ACTIVE";
};

const mapUser = (user: AdminPlayer, index: number): AdminUser => {
  const name = user.fullName || user.username || user.email;
  const initials = name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return {
    id: user.id,
    name,
    email: user.email,
    tournamentsJoined: user.tournamentsJoined,
    status: toAdminStatus(user.status),
    initials: initials || "U",
    avatarColor: avatarColors[index % avatarColors.length],
  };
};

type PendingAction =
  | { type: "suspend" | "unsuspend" | "delete"; user: AdminUser }
  | null;

const Users = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [busy, setBusy] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminPlayers();
      setUsers(response.data.map(mapUser));
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load users."));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const closeConfirm = () => {
    if (busy) return;
    setPending(null);
  };

  const runPending = async () => {
    if (!pending) return;
    const { type, user } = pending;
    setBusy(true);
    setError(null);
    try {
      if (type === "delete") {
        await adminDeleteUser(user.id);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success(`${user.name} was deleted.`);
      } else {
        const nextStatus: AdminUserStatus =
          type === "suspend" ? "Suspended" : "Active";
        await adminUpdateUserStatus(user.id, toApiStatus(nextStatus));
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u)),
        );
        toast.success(
          type === "suspend"
            ? `${user.name} has been suspended.`
            : `${user.name} has been unsuspended.`,
        );
      }
      setPending(null);
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        type === "delete"
          ? "Could not delete user."
          : "Could not update user status.",
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
    if (pending.type === "delete") {
      return {
        title: "Delete user",
        message: `Delete ${pending.user.name} permanently? This cannot be undone.`,
        confirmLabel: "Delete",
        danger: true,
      };
    }
    if (pending.type === "suspend") {
      return {
        title: "Suspend user",
        message: `Suspend ${pending.user.name}? They will not be able to sign in.`,
        confirmLabel: "Suspend",
        danger: true,
      };
    }
    return {
      title: "Unsuspend user",
      message: `Unsuspend ${pending.user.name}? They will be able to sign in again.`,
      confirmLabel: "Unsuspend",
      danger: false,
    };
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-gray-700">
          {loading
            ? "Loading players..."
            : `${users.length.toLocaleString()} registered players`}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              downloadCsv(
                "arenova-users.csv",
                ["Name", "Email", "Tournaments joined", "Status"],
                filtered.map((u) => [u.name, u.email, u.tournamentsJoined, u.status]),
              );
              toast.success(`Exported ${filtered.length} players.`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer"
          >
            <FiDownload size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as AdminUserStatus | "All");
            setPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search users..."
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white min-w-[220px]"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-gray-50 text-left text-gray-700">
            <tr>
              <th className="px-5 py-3 font-medium">User</th>
              <th className="px-5 py-3 font-medium">Tournaments joined</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium w-12" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-sm text-gray-600">
                  Loading users...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-sm text-gray-600">
                  No users match this filter.
                </td>
              </tr>
            ) : (
              paged.map((user) => (
                <tr key={user.id} className="border-t border-gray-100">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold ${user.avatarColor}`}
                      >
                        {user.initials}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-700 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{user.tournamentsJoined}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[user.status]}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <ActionMenu
                      items={[
                        {
                          label: user.status === "Suspended" ? "Unsuspend" : "Suspend",
                          onClick: () =>
                            setPending({
                              type:
                                user.status === "Suspended"
                                  ? "unsuspend"
                                  : "suspend",
                              user,
                            }),
                        },
                        {
                          label: "Delete",
                          tone: "danger",
                          onClick: () => setPending({ type: "delete", user }),
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

export default Users;
