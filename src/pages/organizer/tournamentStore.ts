import { ensureDemoSeedVersion } from "../../data/demoSeed";
import type { Tournament } from "./organizerData";

const STORAGE_KEY = "arenova_organizer_tournaments";

/** Local cache of organizer tournaments (API is source of truth). No demo seed. */
export const loadOrganizerTournaments = (): Tournament[] => {
  ensureDemoSeedVersion();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Tournament[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const saveOrganizerTournaments = (tournaments: Tournament[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
};

export const getOrganizerTournament = (id?: string) => {
  if (!id) return undefined;
  return loadOrganizerTournaments().find((t) => t.id === id);
};

export const addOrganizerTournament = (tournament: Tournament) => {
  const next = [...loadOrganizerTournaments(), tournament];
  saveOrganizerTournaments(next);
  return tournament;
};

export const updateOrganizerTournament = (
  id: string,
  patch: Partial<Tournament>,
) => {
  const next = loadOrganizerTournaments().map((tournament) =>
    tournament.id === id ? { ...tournament, ...patch } : tournament,
  );
  saveOrganizerTournaments(next);
  return next.find((tournament) => tournament.id === id);
};

export const removeOrganizerTournament = (id: string) => {
  const next = loadOrganizerTournaments().filter((tournament) => tournament.id !== id);
  saveOrganizerTournaments(next);
};
