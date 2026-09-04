import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  Calendar,
  ChevronRight,
  Gamepad2,
  Trophy,
} from "lucide-react";
import { FaUsers } from "react-icons/fa";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import Profilesidebar from "../components/User/Profilesidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import tourhero from "../assets/download.jpg";
import { useAuth } from "../context/AuthContext";
import type { MyTournament } from "../data/myTournamentsData";
import type { UserTournamentCard } from "../data/userTournaments";
import {
  countUnread,
  loadNotificationsForUser,
  type NotificationItem,
} from "../data/notificationStore";
import { tournamentDetailPath } from "./tournaments-detail/resolveTournamentDetail";
import { getMyRegistrations } from "../services/registrationApi";
import { mapRegistrationToMyTournament } from "../utils/registrationMappers";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";
import { isCardRegistrationOpen } from "../utils/registrationWindow";
import { getPublicEvents, mapApiEventToCard } from "../services/eventApi";
import { getUserById } from "../services/userApi";
import { getApiErrorMessage } from "../api/axios";
import { toast } from "react-toastify";
import {
  matchesPreferredGames,
  parsePreferredGameIds,
  preferredIdToFilterLabel,
  tournamentsBrowsePath,
} from "../utils/tournamentGameMatch";
import { useMyRegisteredEventIds } from "../hooks/useMyRegisteredEventIds";
import OrganizerBadge from "../components/OrganizerBadge";
import { userShell } from "../theme/userShellTheme";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { userDTO, isAuthenticated } = useAuth();
  const registeredIds = useMyRegisteredEventIds();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>(
    [],
  );
  const [myTournaments, setMyTournaments] = useState<MyTournament[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [registrationsError, setRegistrationsError] = useState<string | null>(null);
  const [preferredGameIds, setPreferredGameIds] = useState<string[]>([]);
  const [apiCards, setApiCards] = useState<UserTournamentCard[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);

  const displayName =
    userDTO?.username?.trim() ||
    userDTO?.email?.split("@")[0] ||
    "Player";

  const numericUserId =
    userDTO?.id && !String(userDTO.id).includes("@") ? String(userDTO.id) : null;

  useEffect(() => {
    const refresh = async () => {
      const items = await loadNotificationsForUser(isAuthenticated);
      setUnreadCount(countUnread(items));
      setRecentNotifications(items.filter((item) => !item.archived).slice(0, 3));
    };
    void refresh();
    window.addEventListener("arenova-notifications-updated", refresh);
    return () => window.removeEventListener("arenova-notifications-updated", refresh);
  }, [isAuthenticated]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingRegistrations(true);
        setRegistrationsError(null);
        const response = await getMyRegistrations();
        setMyTournaments(response.data.map(mapRegistrationToMyTournament));
      } catch (err) {
        setMyTournaments([]);
        const message = getApiErrorMessage(err, "Could not load your tournaments.");
        setRegistrationsError(message);
        toast.error(message);
      } finally {
        setLoadingRegistrations(false);
      }
    };

    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!numericUserId) {
        setPreferredGameIds([]);
        return;
      }
      try {
        const response = await getUserById(numericUserId);
        setPreferredGameIds(parsePreferredGameIds(response.data.preferredGames));
      } catch {
        setPreferredGameIds([]);
      }
    };
    void loadProfile();
  }, [numericUserId]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingRecommended(true);
        setRecommendedError(null);
        const response = await getPublicEvents();
        setApiCards(response.data.map(mapApiEventToCard));
      } catch (err) {
        setApiCards([]);
        const message = getApiErrorMessage(err, "Could not load recommended tournaments.");
        setRecommendedError(message);
        toast.error(message);
      } finally {
        setLoadingRecommended(false);
      }
    };

    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, []);

  const stats = useMemo(() => {
    const ongoing = myTournaments.filter((t) => t.status === "ongoing");
    const upcoming = myTournaments.filter((t) => t.status === "upcoming");
    const completed = myTournaments.filter((t) => t.status === "history");
    const wins = completed.filter((t) => t.prize);
    const totalPrize = wins.reduce((sum, t) => {
      const amount = Number((t.prize || "").replace(/[^\d]/g, ""));
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return {
      ongoing: ongoing.length,
      upcoming: upcoming.length,
      completed: completed.length,
      wins: wins.length,
      unread: unreadCount,
      totalPrize,
      nextMatch: ongoing.find((t) => t.nextMatch)?.nextMatch,
      activeTournament: ongoing[0],
    };
  }, [myTournaments, unreadCount]);

  const recommended = useMemo(() => {
    const liveCards = apiCards.filter((card) => card.status !== "Completed");
    const filtered = liveCards.filter((card) =>
      matchesPreferredGames(card.game, preferredGameIds),
    );
    return filtered.slice(0, 3);
  }, [apiCards, preferredGameIds]);

  const preferredLabels = useMemo(
    () =>
      preferredGameIds
        .map((id) => preferredIdToFilterLabel(id))
        .filter((label): label is string => Boolean(label)),
    [preferredGameIds],
  );

  const browseAllPath =
    preferredGameIds.length === 1
      ? tournamentsBrowsePath({
          gameFilter: preferredIdToFilterLabel(preferredGameIds[0]) ?? undefined,
        })
      : "/tournaments";

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
            <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
              <div>
                <h1 className={userShell.h1}>
                  Welcome back, {displayName}
                </h1>
                <p className={userShell.subtitle}>
                  Your tournaments, matches, and alerts in one place.
                </p>
              </div>
              <Link
                to={browseAllPath}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Browse Tournaments
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              <div className={userShell.cardPad5}>
                <div className="flex items-center justify-between">
                  <p className={userShell.statLabel}>
                    Ongoing
                  </p>
                  <Trophy size={18} className="text-green-500" />
                </div>
                <p className={`${userShell.statValue} mt-2`}>
                  {stats.ongoing}
                </p>
                <p className={userShell.statHint}>Active tournaments</p>
              </div>

              <div className={userShell.cardPad5}>
                <div className="flex items-center justify-between">
                  <p className={userShell.statLabel}>
                    Upcoming
                  </p>
                  <Calendar size={18} className="text-blue-500" />
                </div>
                <p className={`${userShell.statValue} mt-2`}>
                  {stats.upcoming}
                </p>
                <p className={userShell.statHint}>Registered & waiting</p>
              </div>

              <div className={userShell.cardPad5}>
                <div className="flex items-center justify-between">
                  <p className={userShell.statLabel}>
                    Notifications
                  </p>
                  <Bell size={18} className="text-rose-500" />
                </div>
                <p className={`${userShell.statValue} mt-2`}>
                  {stats.unread}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/notifications")}
                  className={`text-xs ${userShell.link} mt-1 cursor-pointer`}
                >
                  View all
                </button>
              </div>

              <div className={userShell.cardPad5}>
                <div className="flex items-center justify-between">
                  <p className={userShell.statLabel}>
                    Prize earned
                  </p>
                  <Gamepad2 size={18} className="text-violet-500" />
                </div>
                <p className={`${userShell.statValue} mt-2`}>
                  Rs. {stats.totalPrize.toLocaleString("en-IN")}
                </p>
                <p className={userShell.statHint}>
                  From {stats.wins} tournament {stats.wins === 1 ? "win" : "wins"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className={`xl:col-span-2 ${userShell.cardOverflow}`}>
                <div className={userShell.cardHeader}>
                  <h2 className={userShell.h2}>Next match</h2>
                  <Link
                    to="/my-tournaments"
                    className={userShell.link}
                  >
                    My tournaments
                  </Link>
                </div>

                {loadingRegistrations ? (
                  <div className={`p-10 text-center ${userShell.empty}`}>
                    Loading your tournaments…
                  </div>
                ) : registrationsError ? (
                  <div className="p-10 text-center text-sm text-red-600">
                    {registrationsError}
                  </div>
                ) : stats.activeTournament ? (
                  <div className="p-5">
                    <div className="flex flex-wrap gap-4 items-start">
                      <img
                        src={stats.activeTournament.image}
                        alt={stats.activeTournament.name}
                        className="w-28 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-[200px]">
                        <p className="text-xs font-semibold uppercase text-green-600 mb-1">
                          Live now
                        </p>
                        <h3 className={userShell.h2Lg}>
                          {stats.activeTournament.name}
                        </h3>
                        <p className={`${userShell.bodySm} mt-1`}>
                          {stats.activeTournament.team} · {stats.activeTournament.format}
                        </p>
                        {stats.nextMatch && (
                          <p className={userShell.innerPanel}>
                            {stats.nextMatch}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {stats.activeTournament.organizerTournamentId && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/brackets/${stats.activeTournament!.organizerTournamentId}`,
                                )
                              }
                              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                            >
                              View bracket
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => navigate("/my-tournaments")}
                            className={userShell.btnOutline}
                          >
                            Match details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-10 text-center ${userShell.empty}`}>
                    No ongoing tournaments. Browse events to join your next match.
                  </div>
                )}
              </div>

              <div className={userShell.cardOverflow}>
                <div className={userShell.cardHeader}>
                  <h2 className={userShell.h2}>Recent alerts</h2>
                  <button
                    type="button"
                    onClick={() => navigate("/notifications")}
                    className={`${userShell.link} cursor-pointer`}
                  >
                    See all
                  </button>
                </div>
                <ul className={userShell.listDivide}>
                  {recentNotifications.length === 0 ? (
                    <li className={`px-5 py-8 text-center ${userShell.empty}`}>
                      No notifications yet.
                    </li>
                  ) : (
                    recentNotifications.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => navigate("/notifications")}
                          className={`w-full text-left px-5 py-3.5 transition cursor-pointer ${userShell.listRowHover}`}
                        >
                          <p className={`${userShell.strong} truncate`}>
                            {item.title || "Notification"}
                          </p>
                      <p className={`${userShell.bodySm} mt-0.5 line-clamp-2`}>
                            {item.message}
                          </p>
                          <p className={`${userShell.mutedXs} mt-1`}>
                            {item.time}
                          </p>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className={userShell.cardOverflow}>
              <div className={userShell.cardHeader}>
                <div>
                  <h2 className={userShell.h2}>Recommended for you</h2>
                  {preferredLabels.length > 0 ? (
                    <p className={`${userShell.bodySm} mt-0.5`}>
                      Based on your games: {preferredLabels.join(", ")}
                    </p>
                  ) : (
                    <p className={`${userShell.bodySm} mt-0.5`}>
                      Add preferred games in your profile for personalized picks.
                    </p>
                  )}
                </div>
                <Link
                  to={browseAllPath}
                  className={`${userShell.link} flex items-center gap-1 shrink-0`}
                >
                  View all <ChevronRight size={14} />
                </Link>
              </div>

              <div className="p-5">
                {loadingRecommended ? (
                  <p className={`${userShell.emptyCenter} py-10`}>
                    Loading tournaments…
                  </p>
                ) : recommendedError ? (
                  <p className="text-sm text-red-600 text-center py-10">
                    {recommendedError}
                  </p>
                ) : recommended.length === 0 ? (
                  <div className="text-center py-10">
                    <p className={userShell.strong}>
                      {preferredGameIds.length > 0
                        ? "No live tournaments for your preferred games right now."
                        : "No live tournaments available right now."}
                    </p>
                    <Link
                      to="/profile"
                      className={`${userShell.link} mt-2 inline-block`}
                    >
                      {preferredGameIds.length > 0
                        ? "Update preferred games"
                        : "Set preferred games in profile"}
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommended.map((tournament) => (
                      <article
                        key={tournament.id}
                        className="bg-[#111827] rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                      >
                        <img
                          src={tournament.image}
                          alt={tournament.alt}
                          className="w-full h-[160px] object-cover"
                        />
                        <div className="bg-white px-3 pb-4 pt-3">
                          <div className="flex justify-between items-center text-sm text-gray-800 mb-2">
                            <span className="truncate pr-2">{tournament.date}</span>
                            <span className="flex items-center gap-1 shrink-0">
                              <FaUsers size={16} /> {tournament.slots}
                            </span>
                          </div>
                          <h3 className="text-black font-semibold text-base mb-1 line-clamp-2">
                            {tournament.title}
                          </h3>
                          {tournament.organizerName ? (
                            <OrganizerBadge
                              name={tournament.organizerName}
                              photoUrl={tournament.organizerPhotoUrl}
                            />
                          ) : (
                            <div className="mb-3" />
                          )}
                          <div className="flex gap-8 mb-4">
                            <div>
                              <p className="text-gray-700 text-xs font-medium mb-1 uppercase">
                                Prize pool
                              </p>
                              <p className="text-black text-sm font-semibold">
                                {tournament.prizePool}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-700 text-xs font-medium mb-1 uppercase">
                                Entry fee
                              </p>
                              <p className="text-black text-sm font-semibold">
                                {tournament.entryFee}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(tournamentDetailPath(tournament.id))
                            }
                            className={`w-full text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer transition ${
                              registeredIds.has(tournament.id)
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : isCardRegistrationOpen(tournament)
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "bg-slate-500 hover:bg-slate-600"
                            }`}
                          >
                            {registeredIds.has(tournament.id)
                              ? "Registered"
                              : isCardRegistrationOpen(tournament)
                                ? "Register"
                                : "Registration Closed"}
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ResponsiveSidebarLayout>

        <Footer />
      </div>
    </>
  );
};

export default UserDashboard;
