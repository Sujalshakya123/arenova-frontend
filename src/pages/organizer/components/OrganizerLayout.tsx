import { useEffect, useRef, useState, type FormEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router";
import {
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  LayoutDashboard,
  MessageCircle,
  Network,
  Scale,
  Settings,
  Trophy,
} from "lucide-react";
import logo from "../../../assets/Test_LOGO.png";
import PanelSidebarLayout from "../../../components/PanelSidebarLayout";
import { useAuth } from "../../../context/AuthContext";
import { getApiErrorMessage } from "../../../api/axios";
import { toast } from "react-toastify";
import {
  createProject,
  getMyProjectById,
  mapApiProject,
} from "../../../services/projectApi";
import { getUserById } from "../../../services/userApi";
import {
  addOrganizerProject,
  getOrganizerProject,
} from "../projectStore";
import { getOrganizerTournament } from "../tournamentStore";
import type { Project } from "../organizerData";
import { SETTLEMENT_ENABLED } from "../../../config/settlementConfig";
import { REPORTS_ENABLED } from "../../../config/reportsConfig";

export type OrganizerOutletContext = {
  openCreateModal: () => void;
  projectsVersion: number;
};

type TournamentNavItem = {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
};

const baseTournamentNav: TournamentNavItem[] = [
  { label: "Overview", path: "overview", icon: LayoutDashboard },
  { label: "Settings", path: "settings/general", icon: Settings },
  { label: "Structure", path: "structure", icon: Network },
  { label: "Matches", path: "matches", icon: Trophy },
];

const buildTournamentNav = (tournamentStatus?: string): TournamentNavItem[] => {
  const items: TournamentNavItem[] = [...baseTournamentNav];
  if (SETTLEMENT_ENABLED) {
    items.push({
      label: "Payments",
      path: "payments",
      icon: CircleDollarSign,
    });
    if (tournamentStatus === "completed") {
      items.push({
        label: "Settlement",
        path: "settlement",
        icon: Scale,
      });
    }
  }
  items.push({ label: "Chat", path: "chat", icon: MessageCircle });
  return items;
};

const OrganizerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { userDTO, profileImage, setProfileImage, logout } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectsVersion, setProjectsVersion] = useState(0);
  const [activeProject, setActiveProject] = useState<Project | undefined>();
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = userDTO?.username ?? "Organizer";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const inProject = Boolean(
    projectId && location.pathname.includes(`/projects/${projectId}`),
  );
  const tournamentIdMatch = location.pathname.match(
    /\/organizer\/tournaments\/([^/]+)/,
  );
  const activeTournamentId = tournamentIdMatch?.[1];
  const onTournamentChatPage = Boolean(
    activeTournamentId &&
      location.pathname.endsWith(`/organizer/tournaments/${activeTournamentId}/chat`),
  );

  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!userDTO?.id || String(userDTO.id).includes("@")) return;

      try {
        const response = await getUserById(userDTO.id);
        if (response.data.profilePhotoUrl) {
          setProfileImage(response.data.profilePhotoUrl);
        }
      } catch {
        // Sidebar can fall back to initials if profile photo fails to load.
      }
    };

    void loadProfilePhoto();
  }, [userDTO?.id, setProfileImage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadActiveProject = async () => {
      if (!projectId || !inProject) {
        setActiveProject(undefined);
        return;
      }

      if (/^\d+$/.test(projectId)) {
        try {
          const response = await getMyProjectById(projectId);
          setActiveProject(mapApiProject(response.data));
          return;
        } catch {
          // Fall through to local store for offline / demo ids
        }
      }

      setActiveProject(getOrganizerProject(projectId));
    };

    void loadActiveProject();
  }, [projectId, inProject, projectsVersion]);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/login");
  };

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || creating) return;

    setCreating(true);
    setCreateError(null);
    const name = projectName.trim();

    try {
      const response = await createProject(name);
      const created = mapApiProject(response.data);
      // Mirror locally so sidebar stays usable if a later GET fails
      addOrganizerProject(created);
      setProjectsVersion((v) => v + 1);
      setShowCreateModal(false);
      setProjectName("");
      setCreateError(null);
      toast.success(`Project "${created.name}" created.`);
      navigate(`/organizer/projects/${created.id}`);
    } catch (err) {
      setCreateError(
        getApiErrorMessage(err, "Could not create project. Check login and try again."),
      );
    } finally {
      setCreating(false);
    }
  };

  const projectBase = projectId ? `/organizer/projects/${projectId}` : "";
  const tournamentsActive = location.pathname.includes(
    `${projectBase}/tournaments`,
  );
  const activeTournament = activeTournamentId
    ? getOrganizerTournament(activeTournamentId)
    : undefined;
  const tournamentBase = activeTournamentId
    ? `/organizer/tournaments/${activeTournamentId}`
    : "";
  const isTournamentSettings = Boolean(
    activeTournamentId && location.pathname.includes("/settings/"),
  );
  const isTournamentStructure = Boolean(
    activeTournamentId && location.pathname.includes("/structure"),
  );

  const sidebar = (
    <aside className="w-[220px] shrink-0 bg-[#1a162e] text-white flex flex-col h-full min-h-screen lg:min-h-0">
        <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
          <img src={logo} alt="Arenova" className="w-10 h-10 object-contain shrink-0" />
          <span className="font-bold text-[17px] tracking-tight">Organizer</span>
        </div>

        {activeTournamentId ? (
          <div className="px-5 pb-5 border-b border-white/10 mb-4">
            <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
              {activeTournament?.name || "Tournament"}
            </p>
            <p className="text-xs text-[#8b93a8] mt-1">
              {activeTournament
                ? `${activeTournament.game} · ${activeTournament.status}`
                : "Managing tournament"}
            </p>
            {activeTournament?.projectId ? (
              <NavLink
                to={`/organizer/projects/${activeTournament.projectId}`}
                className="inline-block text-xs text-[#4ea8ff] hover:underline mt-2"
              >
                ← Back to project
              </NavLink>
            ) : (
              <NavLink
                to="/organizer"
                className="inline-block text-xs text-[#4ea8ff] hover:underline mt-2"
              >
                ← My Projects
              </NavLink>
            )}
          </div>
        ) : inProject && activeProject ? (
          <div className="px-5 pb-5 border-b border-white/10 mb-4">
            <p className="text-sm font-semibold text-white leading-snug">
              {activeProject.name}
            </p>
            <p className="text-xs text-[#8b93a8] mt-1">Platform: Tournament</p>
          </div>
        ) : null}

        <nav
          className={`px-5 flex-1 ${
            activeTournamentId ? "space-y-5 pt-1" : "space-y-3"
          }`}
        >
          {activeTournamentId && tournamentBase ? (
            buildTournamentNav(activeTournament?.status).map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={`${tournamentBase}/${item.path}`}
                  end={item.path === "structure" || item.path === "overview"}
                  className={({ isActive }) => {
                    const active =
                      isActive ||
                      (item.path === "settings/general" && isTournamentSettings) ||
                      (item.path === "structure" && isTournamentStructure);
                    return `flex items-center gap-3 text-sm font-medium py-1.5 transition ${
                      active
                        ? "text-[#4ea8ff]"
                        : "text-[#8b93a8] hover:text-white"
                    }`;
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })
          ) : inProject && projectId ? (
            <>
              <NavLink
                to={projectBase}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2.5 text-sm font-medium transition ${
                    isActive && !tournamentsActive
                      ? "text-[#4ea8ff]"
                      : "text-[#8b93a8] hover:text-white"
                  }`
                }
              >
                <LayoutDashboard size={16} />
                Overview
              </NavLink>
              <NavLink
                to={`${projectBase}/tournaments/new`}
                className={() =>
                  `flex items-center gap-2.5 text-sm font-medium transition ${
                    tournamentsActive
                      ? "text-[#4ea8ff]"
                      : "text-[#8b93a8] hover:text-white"
                  }`
                }
              >
                <Trophy size={16} />
                Tournaments
              </NavLink>
              {REPORTS_ENABLED && (
                <NavLink
                  to="/organizer/reports"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 text-sm font-medium transition ${
                      isActive
                        ? "text-[#4ea8ff]"
                        : "text-[#8b93a8] hover:text-white"
                    }`
                  }
                >
                  <BarChart3 size={16} />
                  Reports
                </NavLink>
              )}
            
              <NavLink
                to="/organizer/profile"
                className={({ isActive }) =>
                  `flex items-center gap-2.5 text-sm font-medium transition pt-2 ${
                    isActive
                      ? "text-[#4ea8ff]"
                      : "text-[#8b93a8] hover:text-white"
                  }`
                }
              >
                <Settings size={16} />
                Settings
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/organizer"
                end
                className={({ isActive }) =>
                  `block text-[15px] font-medium transition ${
                    isActive
                      ? "text-[#4ea8ff]"
                      : "text-[#8b93a8] hover:text-white"
                  }`
                }
              >
                My Projects
              </NavLink>
              {REPORTS_ENABLED && (
                <NavLink
                  to="/organizer/reports"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 text-sm font-medium transition ${
                      isActive
                        ? "text-[#4ea8ff]"
                        : "text-[#8b93a8] hover:text-white"
                    }`
                  }
                >
                  <BarChart3 size={16} />
                  Reports
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="px-5 pb-6 space-y-4">
          <div className="pt-2" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 w-full text-left cursor-pointer group"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-[#4ea8ff]/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#3d3570] text-white text-sm font-semibold flex items-center justify-center shrink-0 ring-2 ring-[#4ea8ff]/30">
                  {avatarInitial}
                </div>
              )}
              <span
                className={`flex-1 truncate text-sm font-medium transition ${
                  profileOpen
                    ? "text-[#4ea8ff]"
                    : "text-[#c8cdd8] group-hover:text-[#4ea8ff]"
                }`}
              >
                {displayName}
              </span>
              <ChevronDown
                size={14}
                className={`shrink-0 text-white transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <ul className="mt-3 ml-8 space-y-2.5">
                <li>
                  <NavLink
                    to="/organizer/profile"
                    onClick={() => setProfileOpen(false)}
                    className="text-sm text-white hover:text-[#4ea8ff] transition"
                  >
                    Account
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-sm text-white hover:text-[#4ea8ff] transition cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </aside>
  );

  return (
    <PanelSidebarLayout
      sidebar={sidebar}
      className="bg-[#f5f6f8]"
      drawerCloseClassName="text-white/80 hover:text-white hover:bg-white/10"
    >
      <main className="flex-1 min-w-0 overflow-auto relative">
        <Outlet
          context={{
            openCreateModal: () => {
              setCreateError(null);
              setShowCreateModal(true);
            },
            projectsVersion,
          }}
        />
        {!onTournamentChatPage && activeTournamentId && /^\d+$/.test(activeTournamentId) && (
          <button
            type="button"
            aria-label="Tournament chat"
            onClick={() =>
              navigate(`/organizer/tournaments/${activeTournamentId}/chat`)
            }
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#3d3570] hover:bg-[#4a4185] text-white flex items-center justify-center shadow-lg cursor-pointer transition z-40"
          >
            <MessageCircle size={22} />
          </button>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Create a project
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Give your project a name to get started.
            </p>
            {createError && (
              <p className="text-sm text-amber-600 mb-3 font-medium">
                {createError}
              </p>
            )}
            <form onSubmit={handleCreateProject}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Project name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. MLBB Nepal Qualifier"
                className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#4caf50] mb-5"
                autoFocus
                disabled={creating}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-sm font-medium border border-[#4caf50] text-[#4caf50] hover:bg-[#4caf50] hover:text-white rounded-md transition cursor-pointer disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PanelSidebarLayout>
  );
};

export default OrganizerLayout;
