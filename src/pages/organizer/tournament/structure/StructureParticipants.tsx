import FormCard, { Field, inputClass } from "../../components/FormCard";

const StructureParticipants = () => {
  return (
    <FormCard
      title="Structure participants"
      description="Set how many teams participate and what players are visible."
    >
      <Field label="Number of teams">
        <input type="number" defaultValue={16} min={2} className={inputClass} />
      </Field>
      <Field label="Players to display per team">
        <input type="number" defaultValue={5} min={1} className={inputClass} />
      </Field>
      <label className="flex items-center gap-3 mb-5 cursor-pointer">
        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
        <span className="text-sm text-gray-700">
          Show player names on bracket
        </span>
      </label>
      <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer">
        Save participants
      </button>
    </FormCard>
  );
};

export default StructureParticipants;
