import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Layers, Plus } from "lucide-react";
import type { Project, Tournament } from "./organizerData";
import { loadOrganizerTournaments } from "./tournamentStore";
import { getApiErrorMessage } from "../../api/axios";
import { getMyProjectById, mapApiProject } from "../../services/projectApi";
import {
  getEventsByProject,
  mapApiEventToTournament,
} from "../../services/eventApi";
import { getOrganizerProject } from "./projectStore";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<Project | undefined>();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!projectId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (/^\d+$/.test(projectId)) {
          const [projectRes, eventsRes] = await Promise.all([
            getMyProjectById(projectId),
            getEventsByProject(projectId),
          ]);
          setProject(mapApiProject(projectRes.data));
          const fromApi = eventsRes.data.map(mapApiEventToTournament);
          // Merge any local-only tournaments for this project
          const localOnly = loadOrganizerTournaments().filter(
            (t) =>
              t.projectId === projectId &&
              !fromApi.some((api) => api.id === t.id),
          );
          setTournaments([...fromApi, ...localOnly]);
        } else {
          setProject(getOrganizerProject(projectId));
          setTournaments(
            loadOrganizerTournaments().filter((t) => t.projectId === projectId),
          );
        }
      } catch (err) {
        setProject(getOrganizerProject(projectId));
        setTournaments(
          loadOrganizerTournaments().filter((t) => t.projectId === projectId),
        );
        setError(
          getApiErrorMessage(err, "Could not load project tournaments from server."),
        );
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="px-10 py-8">
        <p className="text-sm text-gray-500">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="px-10 py-8">
        <p className="text-sm text-gray-500">Project not found.</p>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
        <Link to="/organizer" className="text-sm text-blue-600 mt-2 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 min-h-full">
      <Link
        to="/organizer"
        className="inline-flex items-center gap-2 text-sm text-[#5c6378] hover:text-[#2d3142] mb-6"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      {error && (
        <p className="text-sm text-amber-600 mb-4 font-medium">{error}</p>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-normal text-[#2d3142]">{project.name}</h1>
          <p className="text-sm text-[#9aa0ad] mt-1">{project.plan}</p>
        </div>
        <Link
          to={`/organizer/projects/${projectId}/tournaments/new`}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium border border-[#4caf50] text-[#4caf50] bg-white hover:bg-[#f0faf0] rounded-md transition"
        >
          <Plus size={16} />
          Create tournament
        </Link>
      </div>

      <div className="flex items-center gap-2 text-[#5c6378] mb-5">
        <Layers size={18} strokeWidth={1.75} />
        <span className="text-[15px] font-medium">Tournaments</span>
      </div>

      {tournaments.length === 0 ? (
        <p className="text-sm text-[#9aa0ad]">
          No tournaments yet. Create your first tournament to get started.
        </p>
      ) : (
        <div className="flex flex-wrap gap-5">
          {tournaments.map((tournament) => (
            <Link
              key={tournament.id}
              to={`/organizer/tournaments/${tournament.id}/overview`}
              className="bg-white rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition w-[280px] overflow-hidden"
            >
              {tournament.image && (
                <img
                  src={tournament.image}
                  alt={tournament.game}
                  className="w-full h-[100px] object-cover"
                />
              )}
              <div className="px-6 py-5">
                <h3 className="text-[15px] font-semibold text-[#1f2233]">
                  {tournament.name}
                </h3>
                <p className="text-sm text-[#9aa0ad] mt-2">
                  {tournament.game} · {tournament.status}
                </p>
                {tournament.prizePool && (
                  <p className="text-xs text-[#5c6378] mt-2">{tournament.prizePool}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
