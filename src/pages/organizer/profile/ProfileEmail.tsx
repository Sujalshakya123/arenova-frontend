import { useState } from "react";
import FormCard, { Field, inputClass } from "../components/FormCard";
import { useAuth } from "../../../context/AuthContext";
import { getApiErrorMessage } from "../../../api/axios";
import { updateUserProfile } from "../../../services/userApi";

const ProfileEmail = () => {
  const { userDTO, updateUser } = useAuth();
  const [email, setEmail] = useState(userDTO?.email ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const nextEmail = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail);
    if (!userDTO?.id || String(userDTO.id).includes("@")) {
      setError("Please log out and log in again so your account id can be loaded.");
      return;
    }
    if (!ok) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      await updateUserProfile(userDTO.id, { email: nextEmail });
      updateUser({ email: nextEmail });
      setSuccess("Saved!");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save email."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormCard title="Email settings">
      <Field label="Email address">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </Field>
      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={submitting}
        className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer"
      >
        {submitting ? "Saving..." : "Save email settings"}
      </button>

      {error && <p className="text-sm text-red-600 font-medium mt-3">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-700 font-medium mt-3">{success}</p>
      )}
    </FormCard>
  );
};

export default ProfileEmail;
