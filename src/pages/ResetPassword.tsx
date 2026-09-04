import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import api, { getApiErrorMessage } from "../api/axios";
import { getPasswordPolicyError, PASSWORD_POLICY_MESSAGE } from "../utils/passwordPolicy";
import FormFirstAuthLayout from "../components/auth/FormFirstAuthLayout";
import PasswordInput from "../components/PasswordInput";

const OTP_LENGTH = 6;

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(6, local.length));
  return `${visible}${local.length > 6 ? "****" : "***"}@${domain}`;
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email =
    (location.state as { email?: string } | null)?.email?.trim() ?? "";

  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const otp = digits.join("");

  const updateDigit = (index: number, value: string) => {
    const next = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const copy = [...current];
      copy[index] = next;
      return copy;
    });
    setError("");
    if (next && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? ""));
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (otp.length !== OTP_LENGTH) {
      setError("Enter the full 6-digit code.");
      return;
    }
    const passwordError = getPasswordPolicyError(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/forgot-password/reset", {
        email,
        otp,
        newPassword,
      });
      setSuccess("Password updated. Redirecting to login...");
      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Could not reset password. Try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setError("");
    setSuccess("");
    try {
      const response = await api.post<{ message?: string }>(
        "/auth/forgot-password/resend",
        { email },
      );
      setSuccess(response.data?.message || "A new code was sent to your email.");
      setDigits(Array.from({ length: OTP_LENGTH }, () => ""));
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not resend the code. Try again."));
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <FormFirstAuthLayout>
      <form onSubmit={handleSubmit}>
        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
          <MdEmail size={28} className="text-blue-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset your password
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-gray-800">{maskEmail(email)}</span>
          , then choose a new password.
        </p>

        <div className="flex gap-3 mb-5">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => updateDigit(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          ))}
        </div>

        <div className="mb-3">
          <label className="font-semibold text-black mb-1 block text-sm">
            New password
          </label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            placeholder="8-16 chars with uppercase, number, symbol"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
          <p className="text-gray-500 text-xs mt-1">{PASSWORD_POLICY_MESSAGE}</p>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-black mb-1 block text-sm">
            Confirm password
          </label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            placeholder="Re-enter new password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-700 font-medium mb-4">{success}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg mb-6 cursor-pointer transition"
        >
          {submitting ? "Updating..." : "Update password"}
        </button>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">Didn&apos;t receive the code?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-blue-600 font-medium underline underline-offset-2 disabled:opacity-60 cursor-pointer"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>

        <NavLink to="/login">
          <span className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
            <FaArrowLeft /> Back to login
          </span>
        </NavLink>
      </form>
    </FormFirstAuthLayout>
  );
};

export default ResetPassword;
