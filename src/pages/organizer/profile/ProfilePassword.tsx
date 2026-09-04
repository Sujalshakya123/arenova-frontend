import { useState } from "react";
import FormCard, { Field, inputClass } from "../components/FormCard";
import { useAuth } from "../../../context/AuthContext";
import { getApiErrorMessage } from "../../../api/axios";
import { changePassword } from "../../../services/userApi";
import { getPasswordPolicyError, PASSWORD_POLICY_MESSAGE } from "../../../utils/passwordPolicy";
import PasswordInput from "../../../components/PasswordInput";

const ProfilePassword = () => {
  const { userDTO } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!userDTO?.id || String(userDTO.id).includes("@")) {
      setError("Please log out and log in again so your account id can be loaded.");
      return;
    }
    if (!current.trim()) {
      setError("Current password is required.");
      return;
    }
    if (!next.trim()) {
      setError("New password is required.");
      return;
    }
    const passwordError = getPasswordPolicyError(next);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await changePassword(userDTO.id, current, next);
      setSuccess(
        typeof response.data === "string"
          ? response.data
          : "Password updated!",
      );
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not update password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormCard title="Password settings">
      <Field label="Current password">
        <PasswordInput
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="New password">
        <PasswordInput
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className={inputClass}
        />
        <p className="text-gray-500 text-xs mt-1">{PASSWORD_POLICY_MESSAGE}</p>
      </Field>
      <Field label="Confirm new password">
        <PasswordInput
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className={inputClass}
        />
      </Field>
      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={submitting}
        className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer"
      >
        {submitting ? "Updating..." : "Update password"}
      </button>

      {error && <p className="text-sm text-red-600 font-medium mt-3">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-700 font-medium mt-3">{success}</p>
      )}
    </FormCard>
  );
};

export default ProfilePassword;
