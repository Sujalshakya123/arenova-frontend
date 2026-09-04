import { useState } from "react";
import FormCard, { Field, inputClass } from "../../components/FormCard";

const FfaGeneral = () => {
  const [stageName, setStageName] = useState("Main Bracket");
  const [size, setSize] = useState(16);

  return (
    <FormCard title="FFA Single Elimination — General">
      <Field label="Stage name">
        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Bracket size (teams)">
        <input
          type="number"
          min={4}
          step={4}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className={inputClass}
        />
      </Field>
      <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
        Save stage
      </button>
    </FormCard>
  );
};

export default FfaGeneral;
