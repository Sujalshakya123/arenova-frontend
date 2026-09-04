import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import duelIcon from "../../../../assets/StageType/icon_duel.png";
import ffaIcon from "../../../../assets/StageType/icon_ffa.png";
import type { TournamentOutletContext } from "../../components/TournamentLayout";

const matchOptions = [
  {
    id: "duel",
    title: "Duel",
    icon: duelIcon,
    description:
      "Matches involving two participants (either two players or two teams) require a structure using duel-based stages such as single or double elimination, gauntlet, round-robin or swiss system.",
  },
  {
    id: "ffa",
    title: "FFA",
    icon: ffaIcon,
    description:
      "Matches involving more than two participants, usually called Free-For-All (FFA) matches require a structure using stages specifically designed for FFA.",
  },
];

const MatchType = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const [selected, setSelected] = useState(tournament.matchType || "duel");
  const base = `/organizer/tournaments/${tournamentId}`;

  return (
    <div className="max-w-[900px]">
      <p className="text-sm text-[#9aa0ad] mb-1">Structure /</p>
      <h1 className="text-[28px] font-semibold text-[#2d3142] mb-8">
        Select a match type
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {matchOptions.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={`flex items-start gap-5 text-left bg-white rounded-md px-6 py-6 transition cursor-pointer border ${
                isSelected
                  ? "border-[#7eb8e8] shadow-[0_0_0_1px_#7eb8e8]"
                  : "border-[#e8eaef] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:border-[#c8cdd8]"
              }`}
            >
              <img
                src={option.icon}
                alt={option.title}
                className="w-16 h-16 object-contain shrink-0 mt-1"
              />
              <div className="min-w-0">
                <h2 className="text-[18px] font-semibold text-[#2d3142] mb-2">
                  {option.title}
                </h2>
                <p className="text-sm text-[#8b93a8] leading-relaxed">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          updateTournament({ matchType: selected });
          navigate(`${base}/structure/stage`);
        }}
        className="inline-flex px-6 py-2.5 text-sm font-medium bg-[#4caf50] hover:bg-[#43a047] text-white rounded-md transition cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
};

export default MatchType;
