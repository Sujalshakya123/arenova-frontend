import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router";
import FormCard, { Field, inputClass } from "../../components/FormCard";
import type { TournamentOutletContext } from "../../components/TournamentLayout";
import { usePlatformGames } from "../../../../context/PlatformGamesContext";
import { resolveGameIconByName } from "../../../../data/platformGames";

const DisciplineSettings = () => {
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const [game, setGame] = useState(tournament.game);
  const [ruleset, setRuleset] = useState(
    tournament.publicPage?.secondaryBadge ||
      `${tournament.format || "Squad"} · Competitive`,
  );
  const { games: platformGames } = usePlatformGames();
  const gameNames = useMemo(() => {
    const names = new Set(
      platformGames
        .filter((item) => item.status === "available")
        .map((item) => item.name),
    );
    if (tournament.game) {
      names.add(tournament.game);
    }
    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [platformGames, tournament.game]);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    setGame(tournament.game);
    setRuleset(
      tournament.publicPage?.secondaryBadge ||
        `${tournament.format || "Squad"} · Competitive`,
    );
  }, [tournament]);

  const handleSave = async () => {
    setSaveError(null);
    try {
      await updateTournament({
        game,
        publicPage: {
          ...tournament.publicPage,
          secondaryBadge: ruleset.trim() || tournament.publicPage?.secondaryBadge,
          seriesBadge:
            tournament.publicPage?.seriesBadge || `${game.toUpperCase()} SERIES`,
        },
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save changes.",
      );
    }
  };

  const previewIcon = resolveGameIconByName(game);

  return (
    <FormCard
      title="Discipline"
      description="Game shown on the player detail page (including the Game icon)."
    >
      <Field label="Discipline / Game">
        <select
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className={inputClass}
        >
          {gameNames.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <img
          src={previewIcon}
          alt={game}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Game icon preview
          </p>
          <p className="text-sm font-bold text-gray-900">{game}</p>
        </div>
      </div>

      <Field label="Ruleset / secondary badge">
        <input
          type="text"
          value={ruleset}
          onChange={(e) => setRuleset(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Match format notes">
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Map veto, overtime rules..."
          className={inputClass}
        />
      </Field>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          Save discipline
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium">Saved</span>
        )}
        {saveError && (
          <span className="text-sm text-red-600 font-medium">{saveError}</span>
        )}
      </div>
    </FormCard>
  );
};

export default DisciplineSettings;
