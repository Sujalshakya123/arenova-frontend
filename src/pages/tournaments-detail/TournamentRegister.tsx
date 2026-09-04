import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FaUser, FaCheck } from "react-icons/fa";
import { Calendar } from "lucide-react";
import Navbar from "../../components/User/Navbar/Navbar";
import Footer from "../../components/User/Navbar/Footer";
import esewa from "../../assets/Payment/esewa.png";
import khalti from "../../assets/Payment/khalti.png";
import pubgCover from "../../assets/Cards/PUBG.jpg";
import {
  findTournamentDetail,
  fromOrganizerTournament,
  tournamentDetailPath,
  type ResolvedTournamentDetail,
} from "./resolveTournamentDetail";
import NotFound from "../NotFound";
import { hasValidAuthToken, useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../api/axios";
import ConfirmModal from "../../components/ConfirmModal";
import { getEventById, mapApiEventToTournament } from "../../services/eventApi";
import { registerForEvent, fetchMyRegistrationForEvent, type RegistrationStatus } from "../../services/registrationApi";
import { redirectToEsewa } from "../../services/paymentApi";
import { resolveTournamentCover } from "../../data/platformGames";
import { notifyRegistrationsUpdated } from "../../utils/registrationEvents";
import {
  getRegistrationWindowState,
  registrationStatusLabel,
} from "../../utils/registrationWindow";
import {
  isUserShellDark,
  myTournamentRegistrationBadge,
  userShell,
} from "../../theme/userShellTheme";
import {
  buildRosterFields,
  extraRosterSlots,
  modeRegistrationHint,
  registrationStepLabels,
  type RegistrationMode,
} from "../../utils/registrationMode";

type StepKey = "player" | "team" | "roster" | "payment" | "confirm";

const stepFlowForMode = (mode: RegistrationMode): StepKey[] => {
  if (mode === "SOLO") return ["player", "payment", "confirm"];
  return ["team", "roster", "payment", "confirm"];
};

const TournamentRegister = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userDTO, token } = useAuth();
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [detail, setDetail] = useState<ResolvedTournamentDetail | null>(() =>
    tournamentId ? findTournamentDetail(tournamentId) : null,
  );
  const [cardCover, setCardCover] = useState<string | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState<string | null>(null);
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [teamName, setTeamName] = useState("");
  const [teamTag, setTeamTag] = useState("");
  const [captainDiscord, setCaptainDiscord] = useState(userDTO?.username ?? "");
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti">(
    "esewa",
  );
  const [stepError, setStepError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const registrationMode = detail?.registrationMode ?? "SQUAD";
  const registrationWindow = detail
    ? getRegistrationWindowState({
        registrationOpen: detail.info.registrationOpen,
        registrationDeadlineIso: detail.info.registrationDeadlineIso,
        startDateIso: detail.info.startDateIso,
        eventCompleted: detail.info.eventCompleted,
      })
    : { open: true, message: null };
  const stepFlow = stepFlowForMode(registrationMode);
  const steps = registrationStepLabels(registrationMode);
  const [players, setPlayers] = useState(() =>
    buildRosterFields(registrationMode),
  );

  useEffect(() => {
    if (userDTO?.username && !captainDiscord) {
      setCaptainDiscord(userDTO.username);
    }
  }, [userDTO?.username, captainDiscord]);

  useEffect(() => {
    const load = async () => {
      if (!tournamentId) return;
      setCardCover(null);
      const local = findTournamentDetail(tournamentId);
      if (local) {
        setDetail(local);
      }
      if (!/^\d+$/.test(tournamentId)) return;

      try {
        setLoadingEvent(true);
        const response = await getEventById(tournamentId);
        const mapped = mapApiEventToTournament(response.data);
        setDetail(fromOrganizerTournament(mapped));
        setCardCover(mapped.image ?? null);
      } catch {
        if (!local) setDetail(null);
      } finally {
        setLoadingEvent(false);
      }
    };
    void load();
  }, [tournamentId]);

  useEffect(() => {
    const check = async () => {
      if (!tournamentId || !/^\d+$/.test(tournamentId) || !isAuthenticated) {
        setAlreadyRegistered(false);
        setRegisteredTeam(null);
        setRegistrationStatus(null);
        return;
      }
      const registration = await fetchMyRegistrationForEvent(tournamentId);
      setAlreadyRegistered(Boolean(registration));
      setRegisteredTeam(registration?.teamName ?? null);
      setRegistrationStatus(registration?.status ?? null);
    };
    void check();
  }, [tournamentId, isAuthenticated]);

  useEffect(() => {
    if (!detail) return;
    setPlayers(buildRosterFields(detail.registrationMode));
    setCurrentStep(0);
  }, [detail?.id, detail?.registrationMode]);

  const activeStepKey = stepFlow[currentStep] ?? "confirm";

  const handlePlayerChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index].value = value;
    setPlayers(updated);
  };

  const validateStep = (stepIndex: number) => {
    const stepKey = stepFlow[stepIndex];
    if (stepKey === "player") {
      if (!captainDiscord.trim()) {
        setStepError("Please enter your username.");
        return false;
      }
    }
    if (stepKey === "team") {
      if (!teamName.trim() || !captainDiscord.trim()) {
        setStepError("Please fill in team name and captain username.");
        return false;
      }
    }
    if (stepKey === "roster") {
      const emptyPlayer = players.find((p) => !p.value.trim());
      if (emptyPlayer) {
        setStepError("Please fill in all player usernames.");
        return false;
      }
    }
    setStepError("");
    return true;
  };

  const handleNext = () => {
    if (alreadyRegistered) return;
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepError("");
    if (currentStep === 0) {
      navigate(tournamentDetailPath(tournamentId));
      return;
    }
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (alreadyRegistered) return;
    if (!validateStep(currentStep)) return;

    if (!isAuthenticated || !hasValidAuthToken(token)) {
      setStepError("Your session expired. Please sign in again to register.");
      navigate("/login", {
        state: { from: `/tournaments-detail/register?id=${tournamentId ?? ""}` },
      });
      return;
    }

    if (!registrationWindow.open) {
      setStepError(registrationWindow.message ?? "Registration is closed.");
      return;
    }

    if (!tournamentId || !/^\d+$/.test(tournamentId)) {
      setStepError("This demo tournament cannot be registered via the server.");
      return;
    }

    try {
      setSubmitting(true);
      setStepError("");
      const response = await registerForEvent(tournamentId, {
        teamName:
          registrationMode === "SOLO"
            ? captainDiscord.trim()
            : teamName.trim(),
        teamTag:
          registrationMode === "SOLO"
            ? undefined
            : teamTag.trim() || undefined,
        captainUsername: captainDiscord.trim(),
        roster:
          extraRosterSlots(registrationMode) === 0
            ? []
            : players.map((p) => p.value.trim()),
        paymentMethod,
      });
      notifyRegistrationsUpdated();

      const esewaPayment = response.data.esewaPayment;
      if (esewaPayment && paymentMethod === "esewa") {
        redirectToEsewa(esewaPayment);
        return;
      }

      setSubmitted(true);
      window.setTimeout(() => navigate("/my-tournaments"), 1200);
    } catch (err) {
      setStepError(getApiErrorMessage(err, "Registration failed. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEvent && !detail) {
    return (
      <div className={`${userShell.sectionMin} flex items-center justify-center`}>
        <p className="text-sm text-gray-500">Loading tournament...</p>
      </div>
    );
  }

  if (tournamentId && !detail) {
    return (
      <NotFound
        title="Tournament not found"
        description="This tournament does not exist or the link is invalid."
        backTo="/tournaments"
        backLabel="Browse tournaments"
      />
    );
  }

  const info = detail?.info;
  const cover =
    cardCover ??
    resolveTournamentCover({ gameName: info?.gameName }) ??
    pubgCover;
  if (!info) {
    return (
      <NotFound
        title="Tournament not found"
        description="Open a tournament first, then register from its page."
        backTo="/tournaments"
        backLabel="Browse tournaments"
      />
    );
  }

  const total = info.entryFee;
  const dark = isUserShellDark;

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "upcoming";
  };

  return (
    <>
      <div className="bg-[#0B0F1A]">
        <Navbar />
      </div>

      <div className={userShell.sectionMin}>
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          {/* Progress Stepper */}
          <div className="flex items-center justify-center gap-0 mb-10">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isClickable = index < currentStep;

              return (
                <div key={step} className="flex items-center">
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => isClickable && setCurrentStep(index)}
                    className={`flex flex-col items-center ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                        status === "completed"
                          ? "bg-blue-600 text-white"
                          : status === "active"
                            ? "bg-blue-600 text-white"
                            : dark
                              ? "bg-white/10 text-gray-400"
                              : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {status === "completed" ? (
                        <FaCheck size={12} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span
                      className={`text-sm mt-1.5 whitespace-nowrap ${
                        status === "active"
                          ? dark
                            ? "text-blue-400 font-semibold"
                            : "text-blue-600 font-semibold"
                          : status === "completed"
                            ? dark
                              ? "text-blue-400"
                              : "text-blue-600"
                            : dark
                              ? "text-gray-500"
                              : "text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </button>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 sm:w-24 h-0.5 mx-2 mb-5 transition ${
                        index < currentStep
                          ? "bg-blue-600"
                          : dark
                            ? "bg-white/10"
                            : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {alreadyRegistered ? (
            <div
              className={`mb-6 text-sm ${
                registrationStatus === "PENDING"
                  ? userShell.detailAlertPending
                  : userShell.detailAlertSuccess
              }`}
            >
              {registrationStatusLabel(registrationStatus) ? (
                <span
                  className={`inline-block mr-2 ${myTournamentRegistrationBadge(registrationStatus)}`}
                >
                  {registrationStatusLabel(registrationStatus)}
                </span>
              ) : null}
              <span
                className={
                  registrationStatus === "PENDING"
                    ? dark
                      ? "text-amber-400"
                      : "text-amber-800"
                    : dark
                      ? "text-emerald-400"
                      : "text-green-800"
                }
              >
              {registrationStatus === "PENDING"
                ? "Registration submitted"
                : "You already have an active registration"}
              {registeredTeam ? ` as ${registeredTeam}` : ""}.{" "}
              {registrationStatus === "PENDING"
                ? "The organizer will approve or reject your entry."
                : null}{" "}
              <button
                type="button"
                onClick={() => navigate("/my-tournaments")}
                className={`font-semibold underline cursor-pointer ${
                  registrationStatus === "PENDING"
                    ? dark
                      ? "text-amber-300"
                      : "text-amber-700"
                    : dark
                      ? "text-emerald-300"
                      : "text-green-700"
                }`}
              >
                View My Tournaments
              </button>
              </span>
            </div>
          ) : !registrationWindow.open ? (
            <div className={`mb-6 text-sm ${userShell.detailAlertWarning}`}>
              <span className={userShell.detailAlertWarningTitle}>
                {registrationWindow.message}
              </span>
            </div>
          ) : null}

          <div className="flex gap-8 items-start">
            {/* Left — Form */}
            <div className="flex-1 flex flex-col gap-5">
              {/* Step: Player / Team details */}
              {(activeStepKey === "player" || activeStepKey === "team") && (
                <div className={userShell.detailPanelLg}>
                  <h3 className={`${userShell.h2Base} mb-1`}>
                    {registrationMode === "SOLO" ? "Player Details" : "Team Details"}
                  </h3>
                  <p className={`${userShell.body} mb-5`}>
                    {modeRegistrationHint(registrationMode)}
                  </p>
                  {registrationMode !== "SOLO" ? (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className={userShell.label}>
                          Team Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="e.g. Tactical Elites"
                          className={userShell.inputLg}
                        />
                      </div>
                      <div>
                        <label className={userShell.label}>
                          Team Tag
                        </label>
                        <input
                          type="text"
                          value={teamTag}
                          onChange={(e) => setTeamTag(e.target.value)}
                          placeholder="e.g. TE"
                          className={userShell.inputLg}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div>
                    <label className={userShell.label}>
                      {registrationMode === "SOLO"
                        ? "Your Username"
                        : "Captain's Username"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaUser
                        size={13}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={captainDiscord}
                        onChange={(e) => setCaptainDiscord(e.target.value)}
                        placeholder="Username#0000"
                        className={`${userShell.inputLg} pl-8`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step: Player Roster */}
              {activeStepKey === "roster" && (
                <div className={userShell.detailPanelLg}>
                  <h3 className={`${userShell.h2Base} mb-5`}>
                    Player Roster
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {players.map((player, index) => (
                      <div key={player.label}>
                        <label className={userShell.label}>
                          {player.label}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={player.value}
                          onChange={(e) =>
                            handlePlayerChange(index, e.target.value)
                          }
                          placeholder="Username#0000"
                          className={userShell.inputLg}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step: Payment Method */}
              {activeStepKey === "payment" && (
                <div className={userShell.detailPanelLg}>
                  <h3 className={`${userShell.h2Base} mb-5`}>
                    Select Payment Method
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("esewa")}
                      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition text-left ${
                        paymentMethod === "esewa"
                          ? dark
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-blue-500 bg-blue-50"
                          : dark
                            ? "border-white/15 hover:border-white/25"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={esewa}
                        alt="eSewa"
                        className="w-9 h-9 rounded-lg object-contain"
                      />
                      <div className="flex-1">
                        <p className={userShell.strongSm}>eSewa</p>
                        <p className={userShell.muted}>Fast & Secure Digital Wallet</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentMethod === "esewa"
                            ? "border-blue-500 bg-blue-500"
                            : dark
                              ? "border-white/25"
                              : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "esewa" && (
                          <FaCheck size={10} className="text-white" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("khalti")}
                      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition text-left ${
                        paymentMethod === "khalti"
                          ? dark
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-blue-500 bg-blue-50"
                          : dark
                            ? "border-white/15 hover:border-white/25"
                            : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={khalti}
                        alt="Khalti"
                        className="w-9 h-9 rounded-lg object-contain"
                      />
                      <div className="flex-1">
                        <p className={userShell.strongSm}>Khalti</p>
                        <p className={userShell.muted}>Pay via Khalti ID or Banking</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          paymentMethod === "khalti"
                            ? "border-blue-500 bg-blue-500"
                            : dark
                              ? "border-white/25"
                              : "border-gray-300"
                        }`}
                      >
                        {paymentMethod === "khalti" && (
                          <FaCheck size={10} className="text-white" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Confirmation */}
              {activeStepKey === "confirm" && (
                <div className={userShell.detailPanelLg}>
                  <h3 className={`${userShell.h2Base} mb-5`}>
                    Review & Confirm
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <p className={`${userShell.statLabel} mb-2`}>
                        {registrationMode === "SOLO" ? "Player Details" : "Team Details"}
                      </p>
                      <div className={userShell.innerPanelBox}>
                        {registrationMode !== "SOLO" ? (
                          <>
                            <div className="flex justify-between">
                              <span className={userShell.muted}>Team Name</span>
                              <span className={userShell.strongSm}>
                                {teamName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className={userShell.muted}>Team Tag</span>
                              <span className={userShell.strongSm}>
                                {teamTag || "—"}
                              </span>
                            </div>
                          </>
                        ) : null}
                        <div className="flex justify-between">
                          <span className={userShell.muted}>
                            {registrationMode === "SOLO" ? "Username" : "Captain"}
                          </span>
                          <span className={userShell.strongSm}>
                            {captainDiscord}
                          </span>
                        </div>
                      </div>
                    </div>

                    {players.length > 0 ? (
                      <div>
                        <p className={`${userShell.statLabel} mb-2`}>
                          Player Roster
                        </p>
                        <div className={userShell.innerPanelBox}>
                          {players.map((player) => (
                            <div
                              key={player.label}
                              className="flex justify-between"
                            >
                              <span className={userShell.muted}>{player.label}</span>
                              <span className={userShell.strongSm}>
                                {player.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <p className={`${userShell.statLabel} mb-2`}>
                        Payment Method
                      </p>
                      <div className={`${userShell.innerPanelBox} flex items-center gap-3`}>
                        <img
                          src={paymentMethod === "esewa" ? esewa : khalti}
                          alt={paymentMethod}
                          className="w-8 h-8 rounded-lg object-contain"
                        />
                        <span className={`${userShell.strongSm} capitalize`}>
                          {paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex flex-col gap-3 pt-2">
                {stepError && (
                  <p className="text-sm text-red-500">{stepError}</p>
                )}
                {submitted && (
                  <p className="text-sm text-emerald-600">
                    Registration submitted — awaiting organizer approval. Redirecting to My Tournaments...
                  </p>
                )}
                <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className={userShell.backLink}
                >
                  {currentStep === 0
                    ? "← Back to Tournament"
                    : "← Previous Step"}
                </button>
                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={alreadyRegistered || !registrationWindow.open}
                    className={`${userShell.tournamentBtnPrimary} px-8 py-3 rounded-xl disabled:opacity-50`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowRegisterConfirm(true)}
                    disabled={submitted || submitting || alreadyRegistered || !registrationWindow.open}
                    className={`${userShell.tournamentBtnPrimary} px-8 py-3 rounded-xl`}
                  >
                    {submitting
                      ? "Submitting..."
                      : submitted
                        ? "Registered"
                        : "Confirm Registration"}
                  </button>
                )}
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <aside className="w-[320px] shrink-0 sticky top-6">
              <div className={userShell.cardOverflow}>
                <img
                  src={cover}
                  alt={info.title}
                  className="w-full h-[140px] object-cover"
                />
                <div className="p-5">
                  <h4 className={`${userShell.strongSm} mb-3 leading-snug`}>
                    {info.title}
                  </h4>
                  <div className={`flex items-center gap-2 ${userShell.body} mb-2`}>
                    <Calendar size={14} className="text-gray-500" />
                    <span>Starts {info.startsOn}</span>
                  </div>
                  <p className={`text-xs font-semibold mb-1 ${dark ? "text-blue-400" : "text-blue-600"}`}>
                    {info.prizePool} Prize Pool · {info.totalSlots} Slots
                  </p>
                  <p className={`${userShell.body} mb-5`}>
                    {modeRegistrationHint(registrationMode)}
                  </p>

                  <div className={`border-t ${userShell.detailBorder} pt-4 space-y-2.5`}>
                    <div className="flex justify-between text-sm">
                      <span className={userShell.muted}>Entry Fee</span>
                      <span className={userShell.strong}>
                        {info.entryFee > 0
                          ? `Rs ${info.entryFee.toLocaleString()}`
                          : "Free"}
                      </span>
                    </div>

                    <div className={`flex justify-between text-sm pt-2 border-t ${userShell.detailBorder}`}>
                      <span className={userShell.strong}>Total</span>
                      <span className={`font-bold ${dark ? "text-blue-400" : "text-blue-600"}`}>
                        Rs {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showRegisterConfirm}
        title="Confirm registration?"
        message={
          paymentMethod === "esewa"
            ? `Submit your registration and continue to eSewa to pay Rs ${total.toLocaleString()}?`
            : "Submit your registration for this tournament?"
        }
        confirmLabel="Confirm"
        busy={submitting}
        onConfirm={() => {
          setShowRegisterConfirm(false);
          void handleSubmit();
        }}
        onCancel={() => {
          if (!submitting) setShowRegisterConfirm(false);
        }}
      />

      <Footer />
    </>
  );
};

export default TournamentRegister;
