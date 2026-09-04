export type RegistrationMode = "SOLO" | "DUO" | "SQUAD";

export const parseRegistrationMode = (
  mode?: string | null,
  format?: string | null,
): RegistrationMode => {
  const normalized = (mode || "").toUpperCase();
  if (normalized === "SOLO" || normalized === "DUO" || normalized === "SQUAD") {
    return normalized;
  }
  const f = (format || "").toLowerCase();
  if (f.includes("solo")) return "SOLO";
  if (f.includes("duo")) return "DUO";
  return "SQUAD";
};

/** Total players including captain / primary player. */
export const rosterPlayerCount = (mode: RegistrationMode): number => {
  if (mode === "SOLO") return 1;
  if (mode === "DUO") return 2;
  return 5;
};

/** Teammates beyond the captain (stored in roster). */
export const extraRosterSlots = (mode: RegistrationMode): number =>
  Math.max(rosterPlayerCount(mode) - 1, 0);

export const buildRosterFields = (mode: RegistrationMode) => {
  const count = extraRosterSlots(mode);
  return Array.from({ length: count }, (_, index) => ({
    label:
      mode === "DUO"
        ? "Partner Username"
        : `Player ${index + 2} Username`,
    value: "",
  }));
};

export const registrationStepLabels = (mode: RegistrationMode): string[] => {
  if (mode === "SOLO") {
    return ["Player Info", "Payment Method", "Confirmation"];
  }
  return ["Team Info", "Player Roster", "Payment Method", "Confirmation"];
};

export const modeRegistrationHint = (mode: RegistrationMode): string => {
  if (mode === "SOLO") return "Solo — register as yourself (1 player).";
  if (mode === "DUO") return "Duo — captain + 1 partner (2 players).";
  return "Squad — captain + 4 teammates (5 players).";
};
