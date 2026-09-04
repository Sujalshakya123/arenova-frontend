import { Link, useOutletContext } from "react-router";
import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import type { OrganizerOutletContext } from "./components/OrganizerLayout";
import type { Project } from "./organizerData";
import { getApiErrorMessage } from "../../api/axios";
import { getMyProjects, mapApiProject } from "../../services/projectApi";
import { loadOrganizerProjects } from "./projectStore";

const ProjectsHome = () => {
  const { openCreateModal, projectsVersion } =
    useOutletContext<OrganizerOutletContext>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyProjects();
        setProjects(response.data.map(mapApiProject));
      } catch (err) {
        // Keep organizer usable if API is down
        setProjects(loadOrganizerProjects());
        setError(getApiErrorMessage(err, "Could not load projects from server."));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [projectsVersion]);

  return (
    <div className="px-10 py-8 min-h-full">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-[32px] font-normal text-[#2d3142]">Projects</h1>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-2 text-sm font-medium border border-[#4caf50] text-[#4caf50] bg-white hover:bg-[#f0faf0] rounded-md transition cursor-pointer"
        >
          Create project
        </button>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2 text-[#5c6378]">
          <Layers size={18} strokeWidth={1.75} />
          <span className="text-[15px] font-medium">Tournament</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-amber-600 mb-4 font-medium">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-[#9aa0ad]">Loading projects...</p>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-md border border-[#e5e7eb] px-6 py-16 text-center max-w-[520px]">
          <h2 className="text-lg font-semibold text-[#1f2233]">
            Create your first project
          </h2>
          <p className="text-sm text-[#9aa0ad] mt-2">
            Projects hold your tournaments. Start one to begin organizing.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-5 px-5 py-2 text-sm font-medium border border-[#4caf50] text-[#4caf50] bg-white hover:bg-[#f0faf0] rounded-md transition cursor-pointer"
          >
            Create project
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-5">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/organizer/projects/${project.id}`}
              className="bg-white rounded-md shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition w-[280px] px-6 py-5"
            >
              <h3 className="text-[15px] font-semibold text-[#1f2233] leading-snug">
                {project.name}
              </h3>
              <p className="text-sm text-[#9aa0ad] mt-2">
                {project.plan} · {project.tournamentCount} tournaments
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsHome;
