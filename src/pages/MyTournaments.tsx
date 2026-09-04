import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import Profilesidebar from "../components/User/Profilesidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import tourhero from "../assets/download.jpg";
import type { MyTournamentStatus } from "../data/myTournamentsData";
import {
  tournamentDetailPath,
  tournamentDetailSubPath,
} from "./tournaments-detail/resolveTournamentDetail";
import { getApiErrorMessage } from "../api/axios";
import {
  getMyRegistrations,
  withdrawRegistration,
} from "../services/registrationApi";
import { redirectToEsewa, resumeEsewaPayment, getMyPaymentReceiptByRegistration } from "../services/paymentApi";
import type { PaymentReceipt } from "../services/paymentReceiptTypes";
import PaymentReceiptModal from "../components/PaymentReceiptModal";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import { mapRegistrationToMyTournament } from "../utils/registrationMappers";
import type { MyTournament } from "../data/myTournamentsData";
import { notifyRegistrationsUpdated, subscribeRegistrationsUpdated } from "../utils/registrationEvents";
import {
  needsPaymentResume,
  paymentStatusLabel,
  registrationStatusLabel,
} from "../utils/registrationWindow";
import {
  accountTabClass,
  myTournamentPaymentBadge,
  myTournamentRegistrationBadge,
  tournamentStatusBadge,
  userShell,
} from "../theme/userShellTheme";
const tabs: { id: MyTournamentStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ongoing", label: "Ongoing" },
  { id: "upcoming", label: "Upcoming" },
  { id: "history", label: "History" },
];

const MyTournaments = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MyTournamentStatus | "all">("all");
  const [items, setItems] = useState<MyTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null);
  const [payingId, setPayingId] = useState<number | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<PaymentReceipt | null>(null);
  const [pendingPayment, setPendingPayment] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [pendingWithdraw, setPendingWithdraw] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const openReceipt = async (registrationId?: number) => {
    if (!registrationId) return;
    setReceiptOpen(true);
    setReceipt(null);
    setReceiptError(null);
    setReceiptLoading(true);
    try {
      const response = await getMyPaymentReceiptByRegistration(registrationId);
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
        const response = await getMyRegistrations();
        setItems(response.data.map(mapRegistrationToMyTournament));
      } catch (err) {
        setItems([]);
        setError(getApiErrorMessage(err, "Could not load your tournaments."));
      } finally {
        setLoading(false);
      }
    };
    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, []);

  const counts = useMemo(
    () => ({
      all: items.length,
      ongoing: items.filter((t) => t.status === "ongoing").length,
      upcoming: items.filter((t) => t.status === "upcoming").length,
      history: items.filter((t) => t.status === "history").length,
    }),
    [items],
  );

  const filtered = useMemo(() => {
    if (activeTab === "all") return items;
    return items.filter((t) => t.status === activeTab);
  }, [activeTab, items]);

  const handleWithdraw = async (registrationId: number) => {
    try {
      setWithdrawingId(registrationId);
      await withdrawRegistration(registrationId);
      setItems((prev) => prev.filter((t) => t.registrationId !== registrationId));
      notifyRegistrationsUpdated();
      toast.success("Registration withdrawn.");
      setPendingWithdraw(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not withdraw registration."));
      setError(getApiErrorMessage(err, "Could not withdraw registration."));
    } finally {
      setWithdrawingId(null);
    }
  };

  const handleResumePayment = async (registrationId: number) => {
    try {
      setPayingId(registrationId);
      setError(null);
      const response = await resumeEsewaPayment(registrationId);
      setPendingPayment(null);
      redirectToEsewa(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not start eSewa payment."));
      setPayingId(null);
    }
  };

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
          className={userShell.pageAlt}
          filterLabel="Account menu"
        >
          <div className={userShell.contentAlt}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <NavLink to="/profile">
                  <IoMdArrowRoundBack size={24} className={userShell.iconBack} />
                </NavLink>
                <div>
                  <h1 className={userShell.h1}>
                    My Tournaments
                  </h1>
                  <p className={userShell.subtitle}>
                    Track ongoing matches, upcoming events, and past results.
                  </p>
                </div>
              </div>
              <Link
                to="/tournaments"
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Browse Tournaments
              </Link>
            </div>

            {error && (
              <p className="text-sm text-amber-600 mb-4 font-medium">{error}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className={userShell.cardPad4}>
                <p className={userShell.statLabel}>
                  Ongoing
                </p>
                <p className="text-2xl font-bold text-green-500 mt-1">
                  {counts.ongoing}
                </p>
              </div>
              <div className={userShell.cardPad4}>
                <p className={userShell.statLabel}>
                  Upcoming
                </p>
                <p className="text-2xl font-bold text-blue-500 mt-1">
                  {counts.upcoming}
                </p>
              </div>
              <div className={userShell.cardPad4}>
                <p className={userShell.statLabel}>
                  Completed
                </p>
                <p className={`${userShell.statValueSm} mt-1`}>
                  {counts.history}
                </p>
              </div>
            </div>

            <div className={`flex gap-6 ${userShell.tabBorder} mb-6`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={accountTabClass(activeTab === tab.id)}
                >
                  {tab.label}
                  <span className={`ml-2 text-sm ${userShell.muted}`}>
                    {counts[tab.id]}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className={`${userShell.cardOverflow} px-6 py-16 text-center`}>
                  <p className={userShell.bodySm}>Loading your tournaments...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className={`${userShell.cardOverflow} px-6 py-16 text-center`}>
                  <h3 className={userShell.h3}>
                    {activeTab === "all"
                      ? "You haven’t joined any tournaments"
                      : `No ${activeTab} tournaments`}
                  </h3>
                  <p className={`${userShell.bodySm} mt-2`}>
                    {activeTab === "all"
                      ? "Browse open events and register to see them here."
                      : "Switch tabs or browse new events to keep competing."}
                  </p>
                  <Link
                    to="/tournaments"
                    className="inline-block mt-4 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Browse Tournaments
                  </Link>
                </div>
              ) : (
                filtered.map((tournament) => (
                  <div
                    key={tournament.registrationId ?? tournament.id}
                    className={userShell.cardRow}
                  >
                    <img
                      src={tournament.image}
                      alt={tournament.name}
                      className="w-full sm:w-[200px] h-[140px] object-cover shrink-0"
                    />
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={tournamentStatusBadge(tournament.status)}>
                            {tournament.status}
                          </span>
                          {registrationStatusLabel(tournament.registrationStatus) ? (
                            <span
                              className={myTournamentRegistrationBadge(
                                tournament.registrationStatus,
                              )}
                            >
                              {registrationStatusLabel(tournament.registrationStatus)}
                            </span>
                          ) : null}
                          {paymentStatusLabel(tournament.paymentStatus) ? (
                            <span
                              className={myTournamentPaymentBadge(
                                tournament.paymentStatus,
                              )}
                            >
                              {paymentStatusLabel(tournament.paymentStatus)}
                            </span>
                          ) : null}
                          <span className={userShell.tournamentGameBadge}>
                            {tournament.game}
                          </span>
                        </div>
                        <h3 className={`${userShell.strongSm} text-base mb-2`}>
                          {tournament.name}
                        </h3>
                        <div className={`flex flex-wrap gap-4 ${userShell.body} mb-2`}>
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {tournament.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy size={13} />
                            {tournament.format}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={13} />
                            {tournament.team}
                          </span>
                        </div>

                        {tournament.status === "history" ? (
                          <div className="flex flex-wrap gap-4 text-sm mt-1">
                            <p>
                              <span className={userShell.muted}>Result: </span>
                              <span className={userShell.strong}>
                                {tournament.result}
                              </span>
                            </p>
                            {tournament.prize && (
                              <p>
                                <span className={userShell.muted}>Prize: </span>
                                <span className={userShell.strong}>
                                  {tournament.prize}
                                </span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className={`text-sm ${userShell.linkBold} mt-1 flex items-center gap-1`}>
                            <MapPin size={13} />
                            {tournament.nextMatch}
                          </p>
                        )}
                      </div>

                      <div className={userShell.tournamentActions}>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              tournamentDetailPath(
                                tournament.organizerTournamentId,
                              ),
                            )
                          }
                          className={userShell.tournamentBtnPrimary}
                        >
                          View Details
                        </button>
                        {tournament.status !== "history" &&
                          needsPaymentResume({
                            paymentStatus: tournament.paymentStatus,
                            entry: tournament.entry,
                          }) &&
                          tournament.registrationId && (
                          <button
                            type="button"
                            disabled={payingId === tournament.registrationId}
                            onClick={() => {
                              if (!tournament.registrationId) return;
                              setPendingPayment({
                                id: tournament.registrationId,
                                name: tournament.name,
                              });
                            }}
                            className={userShell.tournamentBtnSuccess}
                          >
                            {payingId === tournament.registrationId
                              ? "Redirecting..."
                              : "Complete payment"}
                          </button>
                        )}
                        {tournament.paymentStatus && tournament.registrationId ? (
                          <button
                            type="button"
                            onClick={() =>
                              void openReceipt(tournament.registrationId)
                            }
                            className={userShell.tournamentBtnSecondary}
                          >
                            View receipt
                          </button>
                        ) : null}
                        {tournament.status === "ongoing" && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                tournament.organizerTournamentId
                                  ? `/brackets/${tournament.organizerTournamentId}`
                                  : tournamentDetailSubPath("schedule"),
                              )
                            }
                            className={userShell.tournamentBtnSecondary}
                          >
                            View Match
                          </button>
                        )}
                        {tournament.status !== "history" && tournament.organizerTournamentId && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                tournamentDetailSubPath(
                                  "chat",
                                  tournament.organizerTournamentId,
                                ),
                              )
                            }
                            className={userShell.tournamentBtnAccent}
                          >
                            Tournament Chat
                          </button>
                        )}
                        {tournament.status !== "history" && tournament.registrationId && (
                          <button
                            type="button"
                            disabled={withdrawingId === tournament.registrationId}
                            onClick={() => {
                              if (!tournament.registrationId) return;
                              setPendingWithdraw({
                                id: tournament.registrationId,
                                name: tournament.name,
                              });
                            }}
                            className={userShell.tournamentBtnDanger}
                          >
                            {withdrawingId === tournament.registrationId
                              ? "Withdrawing..."
                              : "Withdraw"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </ResponsiveSidebarLayout>

        <Footer />
      </div>

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

      <ConfirmModal
        open={Boolean(pendingPayment)}
        title="Continue to eSewa?"
        message={
          pendingPayment
            ? `Complete payment for "${pendingPayment.name}" via eSewa?`
            : ""
        }
        confirmLabel="Continue"
        busy={payingId !== null}
        onConfirm={() => {
          if (pendingPayment) void handleResumePayment(pendingPayment.id);
        }}
        onCancel={() => {
          if (!payingId) setPendingPayment(null);
        }}
      />

      <ConfirmModal
        open={Boolean(pendingWithdraw)}
        title="Withdraw registration?"
        message={
          pendingWithdraw
            ? `Withdraw from "${pendingWithdraw.name}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Withdraw"
        danger
        busy={withdrawingId !== null}
        onConfirm={() => {
          if (pendingWithdraw) void handleWithdraw(pendingWithdraw.id);
        }}
        onCancel={() => {
          if (!withdrawingId) setPendingWithdraw(null);
        }}
      />
    </>
  );
};

export default MyTournaments;
