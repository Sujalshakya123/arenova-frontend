import { ensureDemoSeedVersion } from "./demoSeed";

export type AnnouncementType = "bracket" | "announcement";

export type PlayerAnnouncement = {
  id: string;
  title: string;
  message: string;
  tournamentName?: string;
  tournamentId?: string;
  type?: AnnouncementType;
  createdAt: string;
};

const STORAGE_KEY = "arenova_player_announcements";

export const loadPlayerAnnouncements = (): PlayerAnnouncement[] => {
  ensureDemoSeedVersion();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlayerAnnouncement[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const addPlayerAnnouncement = (
  announcement: Omit<PlayerAnnouncement, "id" | "createdAt">,
) => {
  const next: PlayerAnnouncement = {
    ...announcement,
    id: `ann-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([next, ...loadPlayerAnnouncements()]),
  );
  return next;
};
