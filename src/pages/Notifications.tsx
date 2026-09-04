import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  Bell,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import Profilesidebar from "../components/User/Profilesidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import tourhero from "../assets/download.jpg";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import { getApiErrorMessage } from "../api/axios";
import { toast } from "react-toastify";
import {
  loadNotificationsForUser,
  markNotificationRead,
  archiveNotification,
  deleteNotification,
  updateNotificationState,
  type NotificationItem,
} from "../data/notificationStore";
import {
  notificationBadgeClass,
  notificationListRowClass,
  notificationTabClass,
  userShell,
} from "../theme/userShellTheme";

type NotificationTab = "all" | "archive" | "favorite";

const Notifications = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<NotificationItem | null>(null);
  const [pendingTrashAction, setPendingTrashAction] =
    useState<NotificationItem | null>(null);

  useEffect(() => {
    const refresh = async () => {
      setNotifications(await loadNotificationsForUser(isAuthenticated));
    };
    void refresh();
    window.addEventListener("arenova-notifications-updated", refresh);
    return () => window.removeEventListener("arenova-notifications-updated", refresh);
  }, [isAuthenticated]);

  const counts = useMemo(() => {
    return {
      all: notifications.filter((n) => !n.archived).length,
      archive: notifications.filter((n) => n.archived).length,
      favorite: notifications.filter((n) => n.favorite).length,
    };
  }, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((item) => {
      const matchesTab =
        activeTab === "all"
          ? !item.archived
          : activeTab === "archive"
            ? item.archived
            : item.favorite;
      const haystack =
        `${item.title || ""} ${item.message} ${item.tournamentName || ""}`.toLowerCase();
      return matchesTab && haystack.includes(search.toLowerCase());
    });
  }, [notifications, activeTab, search]);

  const openItem = (item: NotificationItem) => {
    void markNotificationRead(item.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
    );
    setSelected(item);
  };

  const canViewBracket =
    !!selected &&
    (selected.type === "bracket" ||
      !!selected.tournamentId ||
      /bracket/i.test(`${selected.title || ""} ${selected.message}`));

  return (
    <>
      <div>
        <div className="bg-gradient-to-r from-black/75 via-black/40 to-transparent">
          <img
            src={tourhero}
            alt=""
            className="absolute h-[88px] w-full object-cover opacity-85"
          />
          <div className="relative flex flex-col">
            <Navbar />
          </div>
        </div>

        <ResponsiveSidebarLayout
          sidebar={<Profilesidebar />}
          className={userShell.page}
          filterLabel="Account menu"
        >
          <div className={userShell.content}>
            <div className="flex items-center gap-4 mb-6">
              <NavLink to="/profile">
                <IoMdArrowRoundBack size={24} className={userShell.iconBack} />
              </NavLink>
              <div>
                <h1 className={userShell.h1}>
                  Notifications
                </h1>
                <p className={userShell.subtitle}>
                  Open messages and view brackets released by organizers.
                </p>
              </div>
            </div>

            <div className={userShell.cardOverflow}>
              <div className={userShell.cardHeaderMuted}>
                <div className={userShell.cardHeaderTitle}>
                  <Bell size={18} /> List Notification
                </div>
                <MoreHorizontal size={20} className={userShell.muted} />
              </div>

              <div className={`flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-b ${userShell.tabBorder}`}>
                <p className={`text-sm font-semibold ${userShell.strong}`}>
                  {filtered.length} Notification
                  {filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="relative w-full max-w-[280px]">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search notifications"
                    className={userShell.inputSearch}
                  />
                </div>
              </div>

              <div className={`flex gap-8 px-5 ${userShell.tabBorder}`}>
                {(
                  [
                    ["all", "All", counts.all],
                    ["archive", "Archive", counts.archive],
                    ["favorite", "Favorite", counts.favorite],
                  ] as const
                ).map(([id, label, count]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={notificationTabClass(activeTab === id)}
                  >
                    {label}
                    <span className={notificationBadgeClass(activeTab === id)}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>

              <ul>
                {filtered.length === 0 ? (
                  <li className="px-5 py-12 text-center">
                    <p className={userShell.strong}>
                      {search
                        ? "No notifications match your search"
                        : activeTab === "archive"
                          ? "No archived notifications"
                          : activeTab === "favorite"
                            ? "No favorite notifications"
                            : "No notifications yet"}
                    </p>
                    <p className={`${userShell.bodySm} mt-1`}>
                      {search
                        ? "Try a different keyword."
                        : activeTab === "archive"
                          ? "Archived items will appear here."
                          : activeTab === "favorite"
                            ? "Star a notification to save it here."
                            : "Updates about matches and registrations will show up here."}
                    </p>
                  </li>
                ) : (
                  filtered.map((item, index) => (
                    <li
                      key={item.id}
                      onClick={() => openItem(item)}
                      className={notificationListRowClass(index)}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.unread ? "bg-[#7dcc6c]" : "bg-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextFavorite = !item.favorite;
                          void updateNotificationState(item.id, {
                            favorite: nextFavorite,
                          })
                            .then(() => {
                              setNotifications((prev) =>
                                prev.map((n) =>
                                  n.id === item.id
                                    ? { ...n, favorite: nextFavorite }
                                    : n,
                                ),
                              );
                            })
                            .catch((error) => {
                              toast.error(
                                getApiErrorMessage(
                                  error,
                                  "Could not update notification.",
                                ),
                              );
                            });
                        }}
                        className="cursor-pointer"
                      >
                        <Star
                          size={16}
                          className={
                            item.favorite
                              ? "fill-gray-800 text-gray-800"
                              : "text-gray-400"
                          }
                        />
                      </button>
                      <Trophy size={15} className="text-gray-400 shrink-0" />

                      <p className={`flex-1 min-w-0 text-sm ${userShell.body} truncate`}>
                        {item.message}
                      </p>

                      {item.type === "bracket" && (
                        <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 shrink-0">
                          Bracket
                        </span>
                      )}

                      <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                        {item.time}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingTrashAction(item);
                        }}
                        className="w-8 h-8 rounded-full bg-[#f4a89a] text-white flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </ResponsiveSidebarLayout>
        <Footer />
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-[#0B0F1A]/40" />
          <div
            onClick={(e) => e.stopPropagation()}
            className={userShell.modal}
          >
            <div className="flex items-start justify-between gap-3 px-6 pt-5 pb-2">
              <div>
                <p className={`text-sm uppercase tracking-wide ${userShell.muted} mb-1`}>
                  {selected.type === "bracket"
                    ? "Bracket update"
                    : "Notification"}
                </p>
                <h2 className={userShell.h2Lg}>
                  {selected.title || "Message"}
                </h2>
                {selected.tournamentName && (
                  <p className={`${userShell.bodySm} mt-1`}>
                    {selected.tournamentName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className={`${userShell.body} leading-relaxed whitespace-pre-wrap`}>
                {selected.message}
              </p>
              <p className={`${userShell.mutedXs} mt-4`}>{selected.time}</p>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-5 pt-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm cursor-pointer"
              >
                Close
              </button>
              {canViewBracket && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      selected.tournamentId
                        ? `/brackets/${selected.tournamentId}`
                        : "/brackets",
                    )
                  }
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
                >
                  View bracket
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={Boolean(pendingTrashAction)}
        title={
          pendingTrashAction?.archived
            ? "Delete notification?"
            : "Archive notification?"
        }
        message={
          pendingTrashAction?.archived
            ? "This will permanently remove the notification."
            : "Move this notification to archive?"
        }
        confirmLabel={pendingTrashAction?.archived ? "Delete" : "Archive"}
        danger
        onConfirm={() => {
          if (!pendingTrashAction) return;
          const item = pendingTrashAction;
          const isDelete = item.archived;
          setPendingTrashAction(null);

          const action = isDelete
            ? deleteNotification(item.id)
            : archiveNotification(item.id);

          void action
            .then(() => {
              setNotifications((prev) =>
                isDelete
                  ? prev.filter((n) => n.id !== item.id)
                  : prev.map((n) =>
                      n.id === item.id ? { ...n, archived: true } : n,
                    ),
              );
              if (selected?.id === item.id) setSelected(null);
            })
            .catch((error) => {
              toast.error(
                getApiErrorMessage(
                  error,
                  isDelete
                    ? "Could not delete notification."
                    : "Could not archive notification.",
                ),
              );
            });
        }}
        onCancel={() => setPendingTrashAction(null)}
      />
    </>
  );
};

export default Notifications;
