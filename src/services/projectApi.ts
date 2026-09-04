import api from "../api/axios";
import type { Project } from "../pages/organizer/organizerData";

export type ApiProject = {
  id: number;
  name: string;
  plan?: string | null;
  tournamentCount?: number | null;
  updatedAt?: string | null;
  organizerId?: number | null;
};

const formatUpdatedAt = (value?: string | null) => {
  if (!value) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const mapApiProject = (project: ApiProject): Project => ({
  id: String(project.id),
  name: project.name,
  plan: project.plan || "Free",
  tournamentCount: project.tournamentCount ?? 0,
  updatedAt: formatUpdatedAt(project.updatedAt),
});

export const getMyProjects = () => api.get<ApiProject[]>("/api/projects");

export const getMyProjectById = (id: string | number) =>
  api.get<ApiProject>(`/api/projects/${id}`);

export const createProject = (name: string, plan = "Free") =>
  api.post<ApiProject>("/api/projects", { name, plan });

export const updateProject = (
  id: string | number,
  data: { name?: string; plan?: string },
) => api.put<ApiProject>(`/api/projects/${id}`, data);

export const deleteProject = (id: string | number) =>
  api.delete(`/api/projects/${id}`);
