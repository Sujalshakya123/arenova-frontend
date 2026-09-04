/** Check whether player registration is still allowed for an event. */
export const getRegistrationWindowState = (options: {
  registrationOpen?: boolean | null;
  registrationDeadlineIso?: string | null;
  /** Used when no explicit registration deadline is stored (closes at end of start day). */
  startDateIso?: string | null;
  eventCompleted?: boolean;
}) => {
  if (options.eventCompleted) {
    return {
      open: false,
      message: "This tournament has ended.",
    };
  }

  if (options.registrationOpen === false) {
    return {
      open: false,
      message: "Registration is closed for this tournament.",
    };
  }

  const effectiveDeadline =
    options.registrationDeadlineIso?.trim() || options.startDateIso?.trim();
  if (effectiveDeadline) {
    const deadline = new Date(`${effectiveDeadline}T23:59:59`);
    if (!Number.isNaN(deadline.getTime()) && Date.now() > deadline.getTime()) {
      return {
        open: false,
        message: "Registration deadline has passed.",
      };
    }
  }

  return { open: true, message: null as string | null };
};

export const isCardRegistrationOpen = (card: {
  registrationOpen?: boolean | null;
  registrationDeadlineIso?: string | null;
  startDateIso?: string | null;
  status?: string | null;
}) =>
  getRegistrationWindowState({
    registrationOpen: card.registrationOpen,
    registrationDeadlineIso: card.registrationDeadlineIso,
    startDateIso: card.startDateIso,
    eventCompleted: card.status === "Completed",
  }).open;

export const registrationStatusLabel = (status?: string | null) => {
  if (status === "PENDING") return "Pending approval";
  if (status === "REGISTERED") return "Confirmed";
  if (status === "REJECTED") return "Rejected";
  return null;
};

export const registrationStatusClass = (status?: string | null) => {
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "REGISTERED") return "bg-green-100 text-green-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-600";
};

export const paymentStatusLabel = (status?: string | null) => {
  const s = status?.toUpperCase();
  if (s === "COMPLETED") return "Paid";
  if (s === "INITIATED") return "Payment pending";
  if (s === "FAILED") return "Payment failed";
  return null;
};

export const paymentStatusClass = (status?: string | null) => {
  const s = status?.toUpperCase();
  if (s === "COMPLETED") return "bg-emerald-100 text-emerald-800";
  if (s === "INITIATED") return "bg-sky-100 text-sky-700";
  if (s === "FAILED") return "bg-rose-100 text-rose-700";
  return "bg-gray-100 text-gray-600";
};

/** Parses "Rs. 150" / "150" / "Free" into NPR amount (0 if free). */
export const parseEntryFeeNpr = (entry?: string | null) => {
  if (!entry || !entry.trim()) return 0;
  const trimmed = entry.trim();
  if (trimmed.toLowerCase().includes("free")) return 0;
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  const value = Number.parseInt(digits, 10);
  return Number.isFinite(value) ? value : 0;
};

export const canApproveWithPayment = (options: {
  registrationStatus?: string | null;
  paymentStatus?: string | null;
  entry?: string | null;
}) => {
  if (options.registrationStatus !== "PENDING") return false;
  if (parseEntryFeeNpr(options.entry) <= 0) return true;
  return options.paymentStatus?.toUpperCase() === "COMPLETED";
};

export const needsPaymentResume = (options: {
  paymentStatus?: string | null;
  entry?: string | null;
}) => {
  if (parseEntryFeeNpr(options.entry) <= 0) return false;
  return options.paymentStatus?.toUpperCase() !== "COMPLETED";
};
