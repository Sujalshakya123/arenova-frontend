import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FaHeadset } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useTournamentDetail } from "../TournamentDetailContext";
import { tournamentDetailSubPath } from "../resolveTournamentDetail";
import {
  fetchMyRegistrationForEvent,
  type RegistrationStatus,
} from "../../../services/registrationApi";
import { subscribeRegistrationsUpdated } from "../../../utils/registrationEvents";
import {
  getRegistrationWindowState,
  registrationStatusLabel,
} from "../../../utils/registrationWindow";
import {
  isUserShellDark,
  myTournamentRegistrationBadge,
  userShell,
} from "../../../theme/userShellTheme";

function getInitials(name: string): string {
  const parts = name.trim().split(/[\s-_]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

const TournamentSidebar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { isAuthenticated } = useAuth();
  const { info, hostedBy, hostedByPhotoUrl, prizeAwards } = useTournamentDetail();
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus | null>(null);
  const [registeredTeam, setRegisteredTeam] = useState<string | null>(null);
  const [checkingRegistration, setCheckingRegistration] = useState(false);
  const [hostedPhotoFailed, setHostedPhotoFailed] = useState(false);
  const dark = isUserShellDark;

  useEffect(() => {
    setHostedPhotoFailed(false);
  }, [hostedByPhotoUrl]);

  const registrationWindow = useMemo(
    () =>
      getRegistrationWindowState({
        registrationOpen: info.registrationOpen,
        registrationDeadlineIso: info.registrationDeadlineIso,
        startDateIso: info.startDateIso,
        eventCompleted: info.eventCompleted,
      }),
    [
      info.registrationOpen,
      info.registrationDeadlineIso,
      info.startDateIso,
      info.eventCompleted,
    ],
  );

  useEffect(() => {
    const load = async () => {
      if (!id || !/^\d+$/.test(id) || !isAuthenticated) {
        setRegistrationStatus(null);
        setRegisteredTeam(null);
        return;
      }

      try {
        setCheckingRegistration(true);
        const registration = await fetchMyRegistrationForEvent(id);
        setRegistrationStatus(registration?.status ?? null);
        setRegisteredTeam(registration?.teamName ?? null);
      } finally {
        setCheckingRegistration(false);
      }
    };

    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, [id, isAuthenticated]);

  const entryLabel =
    info.entryFee > 0 ? `Rs ${info.entryFee} / Team` : "Free To Play";

  const slotsFull = info.remainingSlots <= 0;
  const hasActiveRegistration =
    registrationStatus === "PENDING" || registrationStatus === "REGISTERED";
  const canRegister =
    registrationWindow.open && !slotsFull && !hasActiveRegistration;

  const statusLabel = registrationStatusLabel(registrationStatus);

  return (
    <aside className="w-full lg:w-[300px] shrink-0 lg:sticky lg:top-6">
      <div className={userShell.detailPanelLg}>
        <p className={`${userShell.statLabel} mb-1`}>
          {info.prizeFundingMode === "entry_fee_funded"
            ? "Current prize pool"
            : "Total Prize Pool"}
        </p>
        <p className={`${userShell.detailPrizeHighlight} mb-1`}>{info.prizePool}</p>
        {info.prizeFundingMode === "entry_fee_funded" && (
          <p className={`text-xs mb-4 ${userShell.muted}`}>
            {info.paidEntryCount ?? 0} paid{" "}
            {info.paidEntryCount === 1 ? "entry" : "entries"} · 70% of fees to
            winners
            {info.prizePoolAtCapacity &&
            info.prizePoolAtCapacity !== "Rs. 0" ? (
              <>
                {" "}
                · Up to {info.prizePoolAtCapacity} at full capacity
              </>
            ) : null}
          </p>
        )}
        {info.prizeFundingMode !== "entry_fee_funded" && (
          <div className="mb-4" />
        )}

        {(info.prizeFirst || info.prizeSecond || info.prizeThird) && (
          <div className={`space-y-2 mb-6 pb-4 border-b ${userShell.detailBorder}`}>
            {info.prizeFirst && (
              <div className="flex justify-between items-center text-sm">
                <span className={userShell.muted}>1st place</span>
                <span className={userShell.strongSm}>{info.prizeFirst}</span>
              </div>
            )}
            {info.prizeSecond && (
              <div className="flex justify-between items-center text-sm">
                <span className={userShell.muted}>2nd place</span>
                <span className={userShell.strongSm}>{info.prizeSecond}</span>
              </div>
            )}
            {info.prizeThird && (
              <div className="flex justify-between items-center text-sm">
                <span className={userShell.muted}>3rd place</span>
                <span className={userShell.strongSm}>{info.prizeThird}</span>
              </div>
            )}
          </div>
        )}

        {prizeAwards && prizeAwards.length > 0 && (
          <div className={`mb-6 pb-4 border-b ${userShell.detailBorder}`}>
            <p className={`${userShell.statLabel} mb-2`}>Prize results</p>
            <div className="space-y-2">
              {prizeAwards.map((award) => (
                <div
                  key={`${award.place}-${award.name}`}
                  className={userShell.detailAwardCard}
                >
                  <p
                    className={`text-xs font-semibold uppercase ${
                      dark ? "text-emerald-400" : "text-emerald-700"
                    }`}
                  >
                    {award.placeLabel} · {award.amount}
                  </p>
                  <p className={`${userShell.strongSm} mt-0.5`}>{award.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className={userShell.muted}>Entry Fee</span>
            <span className={userShell.strongSm}>{entryLabel}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={userShell.muted}>Remaining Slots</span>
            <span className={userShell.strongSm}>
              {info.remainingSlots} / {info.totalSlots}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={userShell.muted}>Registration Ends</span>
            <span className="text-sm font-semibold text-red-400">
              {info.registrationEnds}
            </span>
          </div>
        </div>

        {!registrationWindow.open && !hasActiveRegistration ? (
          <div className={`${userShell.detailAlertWarning} mb-3`}>
            <p className={userShell.detailAlertWarningTitle}>Registration closed</p>
            <p className={userShell.detailAlertWarningBody}>
              {registrationWindow.message}
            </p>
          </div>
        ) : null}

        {hasActiveRegistration ? (
          <div className="space-y-3">
            <div
              className={
                registrationStatus === "PENDING"
                  ? userShell.detailAlertPending
                  : userShell.detailAlertSuccess
              }
            >
              {statusLabel ? (
                <span
                  className={`inline-block mb-2 ${myTournamentRegistrationBadge(registrationStatus)}`}
                >
                  {statusLabel}
                </span>
              ) : null}
              <p
                className={`text-sm font-semibold ${
                  registrationStatus === "PENDING"
                    ? dark
                      ? "text-amber-400"
                      : "text-amber-800"
                    : dark
                      ? "text-emerald-400"
                      : "text-green-700"
                }`}
              >
                {registrationStatus === "PENDING"
                  ? "Registration submitted"
                  : "You're registered"}
              </p>
              {registeredTeam ? (
                <p
                  className={`text-xs mt-1 ${
                    registrationStatus === "PENDING"
                      ? dark
                        ? "text-amber-300/90"
                        : "text-amber-700"
                      : dark
                        ? "text-emerald-300/90"
                        : "text-green-600"
                  }`}
                >
                  Team: {registeredTeam}
                </p>
              ) : null}
              {registrationStatus === "PENDING" ? (
                <p
                  className={`text-xs mt-2 ${
                    dark ? "text-amber-300/80" : "text-amber-600"
                  }`}
                >
                  Waiting for organizer approval.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => navigate("/my-tournaments")}
              className={`w-full ${userShell.tournamentBtnSecondary}`}
            >
              View My Tournaments
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate(tournamentDetailSubPath("register", id))}
            disabled={checkingRegistration || !canRegister}
            className={`w-full ${userShell.tournamentBtnPrimary} disabled:opacity-50`}
          >
            {checkingRegistration
              ? "Checking…"
              : !registrationWindow.open
                ? "Registration Closed"
                : slotsFull
                  ? "Registration Full"
                  : "Register Now"}
          </button>
        )}

        <div className={`border-t ${userShell.detailBorder} mt-6 pt-5`}>
          <p className={`${userShell.statLabel} mb-3`}>Hosted By</p>
          <div className="flex items-center gap-3">
            {hostedByPhotoUrl && !hostedPhotoFailed ? (
              <img
                src={hostedByPhotoUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover shrink-0"
                onError={() => setHostedPhotoFailed(true)}
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-white">
                  {getInitials(hostedBy)}
                </span>
              </div>
            )}
            <div>
              <p className={userShell.strongSm}>{hostedBy}</p>
              <p className={userShell.mutedXs}>Official Organizer</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${userShell.detailSupportCard} mt-4`}>
        <FaHeadset
          size={22}
          className={`mx-auto mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}
        />
        <p className={`${userShell.body} mb-3`}>Need help with registration?</p>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              navigate("/login", {
                replace: false,
                state: { from: "/messages?room=support" },
              });
              return;
            }
            navigate("/messages?room=support");
          }}
          className={`w-full ${userShell.tournamentBtnSecondary}`}
        >
          Contact Support
        </button>
      </div>
    </aside>
  );
};

export default TournamentSidebar;
