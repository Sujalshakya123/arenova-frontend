import { useState } from "react";
import { useOutletContext } from "react-router";
import { Megaphone, Shuffle } from "lucide-react";
import type { TournamentOutletContext } from "../components/TournamentLayout";
import OrganizerAnnounceModal from "../components/OrganizerAnnounceModal";
import BracketBoard from "../../../components/BracketBoard";
import {
  generateBracket,
  seedNamesFromRegistrations,
} from "../generateBracket";
import { getEventRegistrations } from "../../../services/registrationApi";
import { getApiErrorMessage } from "../../../api/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../../components/ConfirmModal";
import {
  recordMatchWinner,
  startMatch,
  updateMatchSchedule,
  isTournamentComplete,
  type MatchScores,
} from "../../../utils/bracketProgress";

const MIN_APPROVED = 2;

const Matches = () => {
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const [announceOpen, setAnnounceOpen] = useState(false);
  const [announceType, setAnnounceType] = useState<"bracket" | "announcement">(
    "announcement",
  );
  const [generating, setGenerating] = useState(false);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [defaults, setDefaults] = useState({
    title: `Update: ${tournament.name}`,
    message: `Organizer announcement for ${tournament.name}.`,
  });

  const isLive = tournament.status === "live";
  const isFfa = tournament.matchType === "ffa";

  const handleGenerate = async () => {
    if (!isLive) {
      setGenerateError(
        "Bracket generation is available after platform admin approves this tournament.",
      );
      return;
    }

    setGenerating(true);
    setGenerateError(null);

    try {
      let seedNames: string[] | undefined;
      if (/^\d+$/.test(tournament.id)) {
        const response = await getEventRegistrations(tournament.id);
        seedNames = seedNamesFromRegistrations(response.data, tournament);
        if (!seedNames.length) {
          setGenerateError(
            "No approved participants yet. Approve registrations under Settings → Participants first.",
          );
          return;
        }
        if (seedNames.length < MIN_APPROVED) {
          setGenerateError(
            `At least ${MIN_APPROVED} approved participants are required to generate a bracket. You currently have ${seedNames.length}. Approve more under Settings → Participants.`,
          );
          return;
        }
      }

      const bracket = generateBracket(tournament, seedNames);
      if (!bracket.length) {
        setGenerateError(
          `Could not build a bracket with the current participants. Need at least ${MIN_APPROVED} approved teams.`,
        );
        return;
      }

      updateTournament({
        bracket,
        bracketGeneratedAt: new Date().toISOString(),
      });
      toast.success(
        tournament.bracket?.length
          ? "Bracket regenerated successfully."
          : "Bracket generated successfully.",
      );
      setDefaults({
        title: `Bracket released: ${tournament.name}`,
        message: `Bracket released for ${tournament.name}. Open this notification to view your bracket.`,
      });
      setAnnounceType("bracket");
      setAnnounceOpen(true);
    } catch (err) {
      setGenerateError(getApiErrorMessage(err, "Could not generate bracket."));
    } finally {
      setGenerating(false);
    }
  };

  const handleStartMatch = (matchId: string) => {
    if (!tournament.bracket?.length) return;
    updateTournament({ bracket: startMatch(tournament.bracket, matchId) });
  };

  const handleScheduleChange = (matchId: string, scheduledAt: string) => {
    if (!tournament.bracket?.length) return;
    updateTournament({
      bracket: updateMatchSchedule(tournament.bracket, matchId, scheduledAt),
    });
  };

  const handleRecordWinner = (
    matchId: string,
    winner: string,
    scores?: MatchScores,
  ) => {
    if (!tournament.bracket?.length) return;
    const next = recordMatchWinner(
      tournament.bracket,
      matchId,
      winner,
      isFfa,
      scores,
    );
    const patch: Parameters<typeof updateTournament>[0] = { bracket: next };
    if (isTournamentComplete(next)) {
      patch.status = "completed";
    }
    updateTournament(patch);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Matches & bracket</h2>
          <p className="text-sm text-gray-500 mt-1">
            Generate the bracket from your Structure settings (
            {isFfa ? "FFA" : "Duel"}
            {tournament.stageType
              ? ` · ${tournament.stageType.replace(/-/g, " ")}`
              : ""}
            ), start matches, enter scores, pick winners to advance teams, then
            announce updates for players.
            {tournament.status === "draft" && (
              <span className="block mt-1 text-amber-700">
                This tournament is pending admin approval — bracket generation unlocks when it goes live.
              </span>
            )}
            {tournament.status === "completed" && (
              <span className="block mt-1 text-emerald-700">
                Tournament complete — a champion has been decided from the bracket.
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setAnnounceType("announcement");
              setDefaults({
                title: `Update: ${tournament.name}`,
                message: `Organizer announcement for ${tournament.name}.`,
              });
              setAnnounceOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border cursor-pointer"
          >
            <Megaphone size={15} /> Announce
          </button>
          <button
            type="button"
            onClick={() => setShowGenerateConfirm(true)}
            disabled={!isLive || generating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white bg-[#4caf50] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shuffle size={15} />
            {generating
              ? "Generating..."
              : tournament.bracket?.length
                ? "Regenerate bracket"
                : "Generate bracket"}
          </button>
        </div>
      </div>

      {generateError && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {generateError}
        </p>
      )}

      <BracketBoard
        tournament={tournament}
        editable
        onStartMatch={handleStartMatch}
        onScheduleChange={handleScheduleChange}
        onRecordWinner={handleRecordWinner}
      />

      <OrganizerAnnounceModal
        isOpen={announceOpen}
        onClose={() => setAnnounceOpen(false)}
        tournamentName={tournament.name}
        tournamentId={tournament.id}
        type={announceType}
        defaultTitle={defaults.title}
        defaultMessage={defaults.message}
      />

      <ConfirmModal
        open={showGenerateConfirm}
        title={
          tournament.bracket?.length ? "Regenerate bracket?" : "Generate bracket?"
        }
        message={
          tournament.bracket?.length
            ? "Regenerating will replace the current bracket and match progress."
            : "Generate the bracket from approved participants?"
        }
        confirmLabel={tournament.bracket?.length ? "Regenerate" : "Generate"}
        busy={generating}
        onConfirm={() => {
          setShowGenerateConfirm(false);
          void handleGenerate();
        }}
        onCancel={() => {
          if (!generating) setShowGenerateConfirm(false);
        }}
      />
    </div>
  );
};

export default Matches;
