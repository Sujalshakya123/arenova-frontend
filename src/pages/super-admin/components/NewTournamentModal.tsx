import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import TournamentCreateForm, {
  type TournamentFormValues,
} from "../../organizer/components/TournamentCreateForm";
import { formatRsAmount } from "../../organizer/tournamentFormUtils";
import type { AdminTournament } from "../adminData";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tournament: AdminTournament) => void;
};

const formatDateLabel = (values: TournamentFormValues) => {
  if (!values.startDate) return "TBD";
  const date = new Date(`${values.startDate}T${values.startTime || "00:00"}`);
  if (Number.isNaN(date.getTime())) return values.startDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const NewTournamentModal = ({ isOpen, onClose, onCreate }: Props) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (values: TournamentFormValues) => {
    onCreate({
      id: Date.now(),
      name: values.name.trim(),
      game: values.discipline,
      organizer: "Arenova Admin",
      organizerInitial: "A",
      organizerColor: "bg-blue-100 text-blue-700",
      prizePool: formatRsAmount(values.prizePool),
      date: formatDateLabel(values),
      status: "Upcoming",
      entryFee: formatRsAmount(values.entryFee),
      slots: values.size ? `0/${values.size}` : "0/32",
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Create new tournament"
    >
      <div className="absolute inset-0 bg-[#0B0F1A]/35 backdrop-blur-[2px]" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[920px] max-h-[90vh] bg-white rounded-xl border border-gray-200 shadow-xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create new tournament</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Same form as organizer create — game, dates, prize pool, and entry fee.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition"
            aria-label="Close"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <TournamentCreateForm
            key={String(isOpen)}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default NewTournamentModal;
