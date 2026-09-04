import type { TournamentFormValues } from "./components/TournamentCreateForm";
import type { Tournament } from "./organizerData";
import {
  resolveImageKeyByName,
  resolveTournamentCover,
} from "../../data/platformGames";

export const formatRsAmount = (value: string | number): string => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "Rs. 0";
  return `Rs. ${num.toLocaleString("en-IN")}`;
};

export const formatEntryFee = (value: string | number): string => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "Free To Play";
  return formatRsAmount(num);
};

/** Parse stored fee/prize strings like "Rs. 250" or "Rs. 20,000" into a number. */
export const parseRsNumber = (value?: string | number) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  if (/free/i.test(String(value))) return 0;

  const cleaned = String(value)
    .replace(/rs\.?/gi, "")
    .replace(/npr\.?/gi, "")
    .replace(/,/g, "")
    .trim();

  const match = cleaned.match(/\d+(?:\.\d+)?/);
  if (!match) return 0;
  const num = Number(match[0]);
  return Number.isFinite(num) ? num : 0;
};

export const formatCardDateLine = (
  startDate: string,
  startTime: string,
  format: string,
): string => {
  if (!startDate) return "TBD";
  const date = new Date(`${startDate}T${startTime || "00:00"}`);
  if (Number.isNaN(date.getTime())) return startDate;
  const datePart = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${datePart} - ${startTime || "00:00"} - ${format}`;
};

export const buildOrganizerTournament = (
  values: TournamentFormValues,
  options: { id: string; projectId: string; status?: Tournament["status"] },
): Tournament => {
  const imageKey = resolveImageKeyByName(values.discipline);
  const image = resolveTournamentCover({
    imageKey,
    gameName: values.discipline,
  });
  return {
    id: options.id,
    projectId: options.projectId,
    name: values.name.trim() || "Untitled tournament",
    game: values.discipline,
    platform: values.platforms[0] || "PC",
    platforms: values.platforms,
    playerCount: Number(values.size),
    type: values.participantType,
    timezone: values.timezone,
    status: options.status ?? "draft",
    startDate: values.startDate,
    startTime: values.startTime,
    format: values.format,
    prizePool: formatRsAmount(values.prizePool),
    prizeFirst: values.prizeFirst ? formatRsAmount(values.prizeFirst) : undefined,
    prizeSecond: values.prizeSecond ? formatRsAmount(values.prizeSecond) : undefined,
    prizeThird: values.prizeThird ? formatRsAmount(values.prizeThird) : undefined,
    entryFee: formatEntryFee(values.entryFee),
    matchType: "ffa",
    imageKey,
    image,
    detailBannerKey: imageKey,
    publicPage: {
      seriesBadge: `${values.discipline.toUpperCase()} SERIES`,
      secondaryBadge: `${values.platforms[0] || "PC"} · ${values.format}`,
      description: `${values.name.trim()} is hosted on Arenova. Register and compete for ${formatRsAmount(values.prizePool)}.`,
      server: "Nepal",
      levelRestriction: "N/A",
      hostedBy: "Tournament Organizer",
    },
  };
};
