import { useState } from "react";
import FormCard, { Field, inputClass, selectClass } from "../../components/FormCard";

const FfaAdvance = () => {
  const [advanceRule, setAdvanceRule] = useState("winner");
  const [matchesPerRound, setMatchesPerRound] = useState(4);

  return (
    <FormCard title="FFA Single Elimination — Advance">
      <Field label="Advance rule">
        <select
          value={advanceRule}
          onChange={(e) => setAdvanceRule(e.target.value)}
          className={selectClass}
        >
          <option value="winner">Winner advances</option>
          <option value="top2">Top 2 advance</option>
          <option value="points">Points based</option>
        </select>
      </Field>
      <Field label="Matches per round">
        <input
          type="number"
          min={1}
          value={matchesPerRound}
          onChange={(e) => setMatchesPerRound(Number(e.target.value))}
          className={inputClass}
        />
      </Field>
      <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
        Save advance rules
      </button>
    </FormCard>
  );
};

export default FfaAdvance;
