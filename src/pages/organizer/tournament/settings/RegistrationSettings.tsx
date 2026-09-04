import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import FormCard, { Field, inputClass } from "../../components/FormCard";
import type { TournamentOutletContext } from "../../components/TournamentLayout";
import { isPastIsoDate, localTodayIso } from "../../../../utils/dateGuards";

const RegistrationSettings = () => {
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const [open, setOpen] = useState(tournament.registrationOpen !== false);
  const [maxTeams, setMaxTeams] = useState(tournament.playerCount || 16);
  const [deadline, setDeadline] = useState(
    tournament.publicPage?.registrationEnds || "",
  );
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const today = localTodayIso();
  const existingDeadline = tournament.publicPage?.registrationEnds || "";
  const minDeadline =
    existingDeadline && existingDeadline < today ? existingDeadline : today;
  const maxDeadline =
    tournament.publicPage?.endDate && tournament.startDate
      ? tournament.publicPage.endDate < tournament.startDate
        ? tournament.publicPage.endDate
        : tournament.startDate
      : tournament.publicPage?.endDate || tournament.startDate || undefined;

  useEffect(() => {
    setOpen(tournament.registrationOpen !== false);
    setMaxTeams(tournament.playerCount || 16);
    setDeadline(tournament.publicPage?.registrationEnds || "");
  }, [tournament]);

  const handleSave = async () => {
    setSaveError(null);
    if (
      deadline &&
      isPastIsoDate(deadline) &&
      deadline !== existingDeadline
    ) {
      setSaveError("Registration deadline cannot be moved to a past date.");
      return;
    }
    if (deadline && tournament.startDate && deadline > tournament.startDate) {
      setSaveError("Registration must end on or before the tournament start date.");
      return;
    }
    if (
      deadline &&
      tournament.publicPage?.endDate &&
      deadline > tournament.publicPage.endDate
    ) {
      setSaveError("Registration must end on or before the tournament end date.");
      return;
    }
    try {
      await updateTournament({
        playerCount: maxTeams,
        registrationOpen: open,
        publicPage: {
          ...tournament.publicPage,
          registrationEnds: deadline || undefined,
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

  return (
    <FormCard
      title="Registration"
      description="Control how teams sign up for your tournament."
    >
      <label className="flex items-center gap-3 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={open}
          onChange={(e) => setOpen(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm font-medium text-gray-700">
          Registration open
        </span>
      </label>
      <Field label="Maximum teams / size">
        <input
          type="number"
          min={2}
          max={32}
          value={maxTeams}
          onChange={(e) => setMaxTeams(Number(e.target.value))}
          className={inputClass}
        />
      </Field>
      <Field label="Registration deadline">
        <input
          type="date"
          min={minDeadline}
          max={maxDeadline}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className={inputClass}
        />
      </Field>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          Save registration
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

export default RegistrationSettings;
