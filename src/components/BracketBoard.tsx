import { useMemo, useState } from "react";
import type { BracketMatch, Tournament } from "../pages/organizer/organizerData";
import {
  bracketStageLabel,
  formatMatchSchedule,
  formatMatchScore,
  selectableParticipants,
  type MatchScores,
} from "../utils/bracketProgress";

const statusClass = {
  Upcoming: "bg-amber-50 text-amber-700",
  Live: "bg-rose-50 text-rose-600",
  Completed: "bg-emerald-50 text-emerald-700",
};

const MatchCard = ({
  match,
  index,
  isFfa,
  editable,
  onStartMatch,
  onScheduleChange,
  onRecordWinner,
}: {
  match: BracketMatch;
  index: number;
  isFfa: boolean;
  editable?: boolean;
  onStartMatch?: (matchId: string) => void;
  onScheduleChange?: (matchId: string, scheduledAt: string) => void;
  onRecordWinner?: (
    matchId: string,
    winner: string,
    scores?: MatchScores,
  ) => void;
}) => {
  const players =
    match.participants && match.participants.length > 0
      ? match.participants
      : [match.slotA, match.slotB].filter(Boolean);

  const options = selectableParticipants(match);
  const isDuelScores = !isFfa && options.length === 2;
  const [scoreA, setScoreA] = useState(
    match.scoreA != null ? String(match.scoreA) : "",
  );
  const [scoreB, setScoreB] = useState(
    match.scoreB != null ? String(match.scoreB) : "",
  );

  const canStart =
    editable && match.status === "Upcoming" && options.length >= 1;
  const canRecord =
    editable && match.status === "Live" && options.length >= 1;
  const scheduleLabel = formatMatchSchedule(match.scheduledAt);
  const scoreLabel = formatMatchScore(match);

  const buildScores = (): MatchScores | undefined => {
    if (!isDuelScores) return undefined;
    return {
      scoreA: scoreA === "" ? null : Number(scoreA),
      scoreB: scoreB === "" ? null : Number(scoreB),
    };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500">
          {isFfa ? `Lobby ${index + 1}` : `Match ${index + 1}`}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClass[match.status]}`}
        >
          {match.status}
        </span>
      </div>

      {(scheduleLabel || (editable && match.status !== "Completed")) && (
        <div className="px-3 py-2 border-b border-gray-100 bg-gray-50/60">
          {editable && match.status !== "Completed" ? (
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Match time
              </span>
              <input
                type="datetime-local"
                value={match.scheduledAt || ""}
                onChange={(e) =>
                  onScheduleChange?.(match.id, e.target.value)
                }
                className="mt-1 w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs text-gray-700 bg-white"
              />
            </label>
          ) : scheduleLabel ? (
            <p className="text-sm text-gray-600">
              Scheduled: <span className="font-medium text-gray-800">{scheduleLabel}</span>
            </p>
          ) : null}
        </div>
      )}

      <ul className="divide-y divide-gray-100">
        {players.map((player, i) => {
          const isWinner = match.winner === player;
          const sideScore =
            i === 0
              ? match.scoreA
              : i === 1
                ? match.scoreB
                : null;
          return (
            <li
              key={`${match.id}-${player}-${i}`}
              className={`px-3 py-2.5 text-sm font-medium flex items-center justify-between gap-2 ${
                isWinner ? "text-emerald-700 bg-emerald-50/60" : "text-gray-900"
              }`}
            >
              <span>{player}</span>
              <span className="flex items-center gap-2 shrink-0">
                {sideScore != null && (
                  <span className="text-xs font-semibold text-gray-500 tabular-nums">
                    {sideScore}
                  </span>
                )}
                {isWinner && (
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Winner
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {canStart && onStartMatch && (
        <div className="px-3 py-3 border-t border-gray-100 bg-gray-50/80">
          <button
            type="button"
            onClick={() => onStartMatch(match.id)}
            className="w-full px-3 py-2 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
          >
            Start match
          </button>
        </div>
      )}

      {canRecord && onRecordWinner && (
        <div className="px-3 py-3 border-t border-gray-100 bg-gray-50/80 space-y-3">
          {isDuelScores && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">
                Score
              </p>
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-xs text-gray-500 truncate block mb-1">
                    {options[0]}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={scoreA}
                    onChange={(e) => setScoreA(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-gray-500 truncate block mb-1">
                    {options[1]}
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={scoreB}
                    onChange={(e) => setScoreB(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm"
                  />
                </label>
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              Complete match — pick winner
            </p>
            <div className="flex flex-wrap gap-1.5">
              {options.map((player) => (
                <button
                  key={`${match.id}-pick-${player}`}
                  type="button"
                  onClick={() =>
                    onRecordWinner(match.id, player, buildScores())
                  }
                  className="px-2.5 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-800 cursor-pointer"
                >
                  {player} wins
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {match.status === "Completed" && match.winner && (
        <div className="px-3 py-2 border-t border-gray-100 text-xs text-emerald-700 font-medium">
          Winner: {match.winner}
          {scoreLabel ? ` · ${scoreLabel}` : ""}
        </div>
      )}
    </div>
  );
};

type BracketBoardProps = {
  tournament: Tournament;
  editable?: boolean;
  onStartMatch?: (matchId: string) => void;
  onScheduleChange?: (matchId: string, scheduledAt: string) => void;
  onRecordWinner?: (
    matchId: string,
    winner: string,
    scores?: MatchScores,
  ) => void;
};

const BracketBoard = ({
  tournament,
  editable,
  onStartMatch,
  onScheduleChange,
  onRecordWinner,
}: BracketBoardProps) => {
  const isFfa = tournament.matchType === "ffa";

  const rounds = useMemo(() => {
    const matches = tournament.bracket ?? [];
    const grouped = new Map<number, BracketMatch[]>();
    matches.forEach((match) => {
      const list = grouped.get(match.round) ?? [];
      list.push(match);
      grouped.set(match.round, list);
    });
    return [...grouped.entries()].sort((a, b) => a[0] - b[0]);
  }, [tournament.bracket]);

  if (!tournament.bracket?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-gray-700">No bracket yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Generate a bracket on the organizer Matches page, then announce it.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">Tournament bracket</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {bracketStageLabel(tournament.matchType, tournament.stageType)} ·{" "}
          {tournament.bracket.length} matches
        </p>
        {editable && (
          <p className="text-sm text-gray-500 mt-1">
            Set match time → Start match → enter score → pick winner to advance.
          </p>
        )}
      </div>
      <div className="overflow-x-auto p-5">
        <div className="flex gap-6 min-w-max">
          {rounds.map(([round, matches]) => (
            <div key={round} className="w-[280px] shrink-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
                {matches[0]?.roundLabel || `Round ${round}`}
              </p>
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    index={index}
                    isFfa={isFfa}
                    editable={editable}
                    onStartMatch={onStartMatch}
                    onScheduleChange={onScheduleChange}
                    onRecordWinner={onRecordWinner}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BracketBoard;
