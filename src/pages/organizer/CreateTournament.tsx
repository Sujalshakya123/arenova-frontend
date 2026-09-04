import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import TournamentCreateForm, {
  type TournamentFormValues,
} from "./components/TournamentCreateForm";
import { addOrganizerTournament } from "./tournamentStore";
import {
  buildCreateEventPayload,
  createEvent,
  mapApiEventToTournament,
} from "../../services/eventApi";
import { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";

const CreateTournament = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: TournamentFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    if (!projectId || !/^\d+$/.test(projectId)) {
      setError("Invalid project. Open a real project from your organizer dashboard.");
      setSubmitting(false);
      return;
    }

    try {
      const payload = buildCreateEventPayload(values, Number(projectId));
      const response = await createEvent(payload);
      const created = mapApiEventToTournament(response.data);
      addOrganizerTournament(created);
      toast.success("Tournament created successfully.");
      navigate(`/organizer/tournaments/${created.id}/overview`);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Could not create tournament on the server. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="px-8 py-10 min-h-full">
      <h1 className="text-center text-[22px] font-normal text-[#2d3142] mb-8">
        Create new tournament
      </h1>

      {error && (
        <p className="text-center text-sm text-red-600 mb-4 font-medium">
          {error}
        </p>
      )}

      <div className="max-w-[960px] mx-auto bg-white rounded-md shadow-[0_1px_6px_rgba(0,0,0,0.08)] px-10 py-8">
        <TournamentCreateForm
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/organizer/projects/${projectId}`)}
        />
      </div>
    </div>
  );
};

export default CreateTournament;
