import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useParams } from "react-router";
import type { Tournament } from "../organizerData";
import {
  addOrganizerTournament,
  getOrganizerTournament,
  updateOrganizerTournament,
} from "../tournamentStore";
import {
  getEventById,
  mapApiEventToTournament,
  updateEvent,
} from "../../../services/eventApi";
import { getApiErrorMessage } from "../../../api/axios";

const settingsTabs = [
  { label: "General", path: "settings/general" },
  { label: "Public page", path: "settings/public-page" },
  { label: "Appearance", path: "settings/appearance" },
  { label: "Discipline", path: "settings/discipline" },
  { label: "Registration", path: "settings/registration" },
  { label: "Participants", path: "settings/participants" },
];

export type TournamentOutletContext = {
  tournament: Tournament;
  updateTournament: (patch: Partial<Tournament>) => Promise<void>;
  saveError: string | null;
};

const TournamentLayout = () => {
  const { tournamentId } = useParams();
  const location = useLocation();
  const [tournament, setTournament] = useState(
    () => getOrganizerTournament(tournamentId),
  );
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!tournamentId) return;

      const local = getOrganizerTournament(tournamentId);
      if (local) setTournament(local);

      if (/^\d+$/.test(tournamentId)) {
        try {
          setLoading(true);
          const response = await getEventById(tournamentId);
          const mapped = mapApiEventToTournament(response.data);
          // API wins for public page content (rules/schedule now persisted)
          const merged = local
            ? {
                ...mapped,
                bracket: mapped.bracket?.length
                  ? mapped.bracket
                  : local.bracket,
                bracketGeneratedAt:
                  mapped.bracketGeneratedAt || local.bracketGeneratedAt,
                matchType: mapped.matchType || local.matchType,
                stageType: mapped.stageType || local.stageType,
                publicPage: {
                  ...local.publicPage,
                  ...mapped.publicPage,
                },
              }
            : mapped;
          if (local) {
            updateOrganizerTournament(tournamentId, merged);
          } else {
            addOrganizerTournament(merged);
          }
          setTournament(merged);
        } catch {
          // keep local / not found
        } finally {
          setLoading(false);
        }
      }
    };
    void load();
  }, [tournamentId]);

  const updateTournament = async (patch: Partial<Tournament>) => {
    if (!tournamentId) return;
    setSaveError(null);
    const next = updateOrganizerTournament(tournamentId, patch);
    if (next) setTournament(next);

    if (!/^\d+$/.test(tournamentId)) return;

    const body: Parameters<typeof updateEvent>[1] = {};
    if (patch.name !== undefined) body.title = patch.name;
    if (patch.game !== undefined) body.gameName = patch.game;
    if (patch.imageKey !== undefined) body.imageKey = patch.imageKey;
    if (patch.coverImageUrl !== undefined) {
      body.coverImageUrl = patch.coverImageUrl || "";
    }
    if (patch.detailBannerUrl !== undefined) {
      body.detailBannerUrl = patch.detailBannerUrl || "";
    }
    if (patch.detailBannerKey !== undefined) {
      body.detailBannerKey = patch.detailBannerKey || "";
    }
    if (patch.startDate !== undefined) body.startDate = patch.startDate;
    if (patch.startTime !== undefined) body.startTime = patch.startTime;
    if (patch.timezone !== undefined) body.timezone = patch.timezone;
    if (patch.prizePool !== undefined) body.prizePool = patch.prizePool;
    if (patch.prizeFirst !== undefined) {
      body.prizeFirst = patch.prizeFirst || "";
    }
    if (patch.prizeSecond !== undefined) {
      body.prizeSecond = patch.prizeSecond || "";
    }
    if (patch.prizeThird !== undefined) {
      body.prizeThird = patch.prizeThird || "";
    }
    if (patch.entryFee !== undefined) body.entry = patch.entryFee;
    if (patch.publicPage?.description !== undefined) {
      body.description = patch.publicPage.description;
    }
    if (patch.publicPage !== undefined) {
      const mergedPage = {
        ...(tournament?.publicPage || {}),
        ...patch.publicPage,
      };
      const {
        description: _description,
        registrationEnds: _registrationEnds,
        ...extras
      } = mergedPage;
      body.publicPageJson = JSON.stringify(extras);
    }
    if (patch.format !== undefined) {
      const f = patch.format.toLowerCase();
      body.mode = f === "solo" ? "SOLO" : f === "duo" ? "DUO" : "SQUAD";
    }
    if (patch.playerCount !== undefined) {
      body.maxCapacity = String(patch.playerCount);
    }
    if (patch.platforms !== undefined) {
      body.platforms = patch.platforms.join(",");
    }
    if (patch.matchType !== undefined) body.matchType = patch.matchType;
    if (patch.stageType !== undefined) body.stageType = patch.stageType;
    if (patch.bracket !== undefined) {
      body.bracketJson = JSON.stringify(patch.bracket);
    }
    if (patch.bracketGeneratedAt !== undefined) {
      body.bracketGeneratedAt = patch.bracketGeneratedAt;
    }
    if (patch.registrationOpen !== undefined) {
      body.registrationOpen = patch.registrationOpen;
    }
    if (patch.publicPage?.registrationEnds !== undefined) {
      body.registrationDeadline = patch.publicPage.registrationEnds || "";
    }

    try {
      await updateEvent(tournamentId, body);
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "Could not save changes to the server.",
      );
      setSaveError(message);
      throw new Error(message);
    }
  };

  const base = `/organizer/tournaments/${tournamentId}`;
  const isSettings = location.pathname.includes("/settings/");
  const isStructure = location.pathname.includes("/structure");
  const structureNav = [
    { label: "Match type", path: "structure" },
    { label: "Stage type", path: "structure/stage" },
  ];

  if (loading && !tournament) {
    return (
      <div className="p-8">
        <p className="text-sm text-gray-500">Loading tournament...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">Tournament not found</h1>
        <Link to="/organizer" className="text-sm text-blue-600 mt-2 inline-block">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <Link
          to={`/organizer/projects/${tournament.projectId}`}
          className="text-sm text-gray-500 hover:text-gray-800 mb-3 inline-block"
        >
          ← Back to project
        </Link>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
          Tournament
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">{tournament.name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {tournament.game} · {tournament.status}
        </p>

        {isSettings && (
          <nav className="flex flex-wrap gap-4 mt-6">
            {settingsTabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${base}/${tab.path}`}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-800"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        )}

        {isStructure && (
          <nav className="flex flex-wrap gap-4 mt-6">
            {structureNav.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${base}/${tab.path}`}
                end={tab.path === "structure"}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-800"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <div className="px-8 sm:px-10 py-8">
        {saveError && (
          <p className="mb-4 text-sm text-red-600 font-medium bg-red-50 border border-red-100 rounded-lg px-4 py-3">
            {saveError}
          </p>
        )}
        <Outlet
          context={
            { tournament, updateTournament, saveError } satisfies TournamentOutletContext
          }
        />
      </div>
    </div>
  );
};

export default TournamentLayout;
