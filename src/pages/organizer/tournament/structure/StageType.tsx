import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import singleElimination from "../../../../assets/StageType/icon_single_elimination.png";
import doubleElimination from "../../../../assets/StageType/icon_double_elimination.png";
import bracketGroups from "../../../../assets/StageType/icon_bracket_groups.png";
import customBracket from "../../../../assets/StageType/icon_custom_bracket.png";
import type { TournamentOutletContext } from "../../components/TournamentLayout";

const allStageOptions = [
  {
    id: "single-elimination",
    title: "Single Elimination",
    icon: singleElimination,
    description:
      "Bracket in which participants are eliminated after one loss.",
    forMatch: ["duel", "ffa"] as const,
  },
  {
    id: "double-elimination",
    title: "Double Elimination",
    icon: doubleElimination,
    description:
      "Bracket in which participants must lose twice to get eliminated.",
    forMatch: ["duel"] as const,
  },
  {
    id: "bracket-groups",
    title: "Bracket Groups",
    icon: bracketGroups,
    description:
      "Groups in which participants play in small single or double elimination brackets.",
    forMatch: ["duel"] as const,
  },
  {
    id: "custom-bracket",
    title: "Custom Bracket",
    icon: customBracket,
    description:
      "Bracket in which the participants' progression can be customized.",
    forMatch: ["duel", "ffa"] as const,
  },
];

const StageType = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const matchType = tournament.matchType || "duel";

  const stageOptions = useMemo(
    () =>
      allStageOptions.filter((option) =>
        option.forMatch.some((type) => type === matchType),
      ),
    [matchType],
  );

  const [selected, setSelected] = useState(
    tournament.stageType || stageOptions[0]?.id || "single-elimination",
  );
  const base = `/organizer/tournaments/${tournamentId}`;

  useEffect(() => {
    if (!stageOptions.some((o) => o.id === selected)) {
      setSelected(stageOptions[0]?.id || "single-elimination");
    }
  }, [stageOptions, selected]);

  const handleContinue = () => {
    updateTournament({ stageType: selected });
    // FFA bracket generation lives on Matches — skip unfinished FFA settings shells
    navigate(`${base}/matches`);
  };

  return (
    <div className="max-w-[960px]">
      <p className="text-sm text-[#9aa0ad] mb-1">Structure /</p>
      <h1 className="text-[28px] font-semibold text-[#2d3142] mb-2">
        Select a stage type
      </h1>
      <p className="text-sm text-[#8b93a8] mb-8">
        Options for{" "}
        <span className="font-medium text-[#2d3142]">
          {matchType === "ffa" ? "FFA" : "Duel"}
        </span>{" "}
        match type.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {stageOptions.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelected(option.id)}
              className={`flex flex-col items-start text-left bg-white rounded-md px-6 py-6 transition cursor-pointer border min-h-[200px] ${
                isSelected
                  ? "border-[#4ea8ff] shadow-[0_0_0_1px_#4ea8ff]"
                  : "border-[#e8eaef] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:border-[#c8cdd8]"
              }`}
            >
              <img
                src={option.icon}
                alt={option.title}
                className="w-[88px] h-[72px] object-contain mb-5"
              />
              <h2 className="text-[16px] font-semibold text-[#2d3142] mb-2">
                {option.title}
              </h2>
              <p className="text-sm text-[#8b93a8] leading-relaxed">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="inline-flex px-6 py-2.5 text-sm font-medium bg-[#4caf50] hover:bg-[#43a047] text-white rounded-md transition cursor-pointer"
      >
        Continue
      </button>
    </div>
  );
};

export default StageType;
