import { ensureDemoSeedVersion } from "../../data/demoSeed";
import type { Project } from "./organizerData";

const STORAGE_KEY = "arenova_organizer_projects";

/** Local cache of organizer projects (API is source of truth). No demo seed. */
export const loadOrganizerProjects = (): Project[] => {
  ensureDemoSeedVersion();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as Project[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const saveOrganizerProjects = (projects: Project[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const getOrganizerProject = (id?: string) => {
  if (!id) return undefined;
  return loadOrganizerProjects().find((p) => p.id === id);
};

export const addOrganizerProject = (project: Project) => {
  const next = [...loadOrganizerProjects(), project];
  saveOrganizerProjects(next);
  return project;
};
