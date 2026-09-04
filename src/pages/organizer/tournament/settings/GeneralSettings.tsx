import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { ExternalLink } from "lucide-react";
import { toast } from "react-toastify";
import FormCard, { Field, inputClass } from "../../components/FormCard";
import ConfirmModal from "../../../../components/ConfirmModal";
import type { TournamentOutletContext } from "../../components/TournamentLayout";
import { tournamentDetailPath } from "../../../tournaments-detail/resolveTournamentDetail";
import { isPastIsoDate, localTodayIso } from "../../../../utils/dateGuards";
import { deleteEvent } from "../../../../services/eventApi";
import { getApiErrorMessage } from "../../../../api/axios";
import { removeOrganizerTournament } from "../../tournamentStore";

const GeneralSettings = () => {
  const navigate = useNavigate();
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const [name, setName] = useState(tournament.name);
  const [description, setDescription] = useState(
    tournament.publicPage?.description ||
      "Official competitive tournament hosted on Arenova.",
  );
  const [startDate, setStartDate] = useState(tournament.startDate || "");
  const [startTime, setStartTime] = useState(tournament.startTime || "");
  const [format, setFormat] = useState(tournament.format || "Squad");
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const today = localTodayIso();
  // Keep existing past start dates editable, but never allow picking an earlier past day.
  const minStartDate =
    tournament.startDate && tournament.startDate < today
      ? tournament.startDate
      : today;

  useEffect(() => {
    setName(tournament.name);
    setDescription(
      tournament.publicPage?.description ||
        "Official competitive tournament hosted on Arenova.",
    );
    setStartDate(tournament.startDate || "");
    setStartTime(tournament.startTime || "");
    setFormat(tournament.format || "Squad");
  }, [tournament]);

  const handleSave = async () => {
    setSaveError(null);
    if (
      startDate &&
      isPastIsoDate(startDate) &&
      startDate !== (tournament.startDate || "")
    ) {
      setSaveError("Start date cannot be moved to a past date.");
      return;
    }
    try {
      await updateTournament({
        name: name.trim() || tournament.name,
        startDate: startDate || undefined,
        startTime: startTime || undefined,
        format,
        publicPage: {
          ...tournament.publicPage,
          description: description.trim(),
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (/^\d+$/.test(tournament.id)) {
        await deleteEvent(tournament.id);
      }
      removeOrganizerTournament(tournament.id);
      toast.success(`Tournament "${tournament.name}" was deleted.`);
      navigate(`/organizer/projects/${tournament.projectId}`);
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Could not delete this tournament. Please try again."),
      );
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
    <FormCard
      title="General"
      description="Basic tournament information. For the full player detail page, also use Public page."
    >
      <Field label="Tournament name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Start date">
          <input
            type="date"
            min={minStartDate}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Start time">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Format">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className={inputClass}
          >
            <option value="Solo">Solo</option>
            <option value="Duo">Duo</option>
            <option value="Squad">Squad</option>
          </select>
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          Save changes
        </button>
        <Link
          to={tournamentDetailPath(tournament.id)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
        >
          Preview detail page <ExternalLink size={13} />
        </Link>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium">Saved</span>
        )}
        {saveError && (
          <span className="text-sm text-red-600 font-medium">{saveError}</span>
        )}
      </div>
    </FormCard>

    <FormCard
      title="Delete tournament"
      description="Remove this tournament from your project and the public site."
    >
      <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">
        Deleting is permanent. All registrations, bracket data, and chat history for
        this tournament will be removed and cannot be recovered.
      </div>
      <button
        type="button"
        onClick={() => setShowDeleteConfirm(true)}
        disabled={deleting}
        className="mt-4 px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Delete tournament
      </button>
    </FormCard>

    <ConfirmModal
      open={showDeleteConfirm}
      title="Delete this tournament?"
      message={`Are you sure you want to delete "${tournament.name}"? This will permanently remove the tournament, all player registrations, bracket progress, and related data. This action cannot be undone.`}
      confirmLabel="Delete tournament"
      cancelLabel="Keep tournament"
      danger
      busy={deleting}
      onConfirm={() => void handleDelete()}
      onCancel={() => {
        if (!deleting) setShowDeleteConfirm(false);
      }}
    />
    </>
  );
};

export default GeneralSettings;
