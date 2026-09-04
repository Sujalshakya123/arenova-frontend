import { useState, type FormEvent } from "react";
import { NavLink, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import api, { getApiErrorMessage } from "../api/axios";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Email is required.");
      return;
    }
    if (!emailPattern.test(trimmed)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setEmailError("");
    setFormError("");

    try {
      await api.post("/auth/forgot-password", { email: trimmed });
      navigate("/reset-password", { state: { email: trimmed } });
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, "Could not send reset code. Try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AuthLeftPanel />

      <form
        onSubmit={handleSubmit}
        className="w-full lg:w-1/2 bg-white flex items-center justify-center px-4 sm:px-6"
      >
        <div className="w-full max-w-[400px] py-8">
          <h2 className="font-bold text-2xl">Forgot password</h2>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Enter your account email and we&apos;ll send a 6-digit reset code.
          </p>

          <div className="mb-4">
            <label className="font-semibold text-black mb-1 block">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setFormError("");
              }}
              className={`w-full border rounded-lg px-3 py-2 outline-none focus:border-blue-500 ${
                emailError ? "border-red-400" : "border-gray-300"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1">{emailError}</p>
            )}
          </div>

          {formError && (
            <p className="text-red-500 text-sm mb-3">{formError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 rounded transition"
          >
            {submitting ? "Sending..." : "Send reset code"}
          </button>

          <NavLink to="/login" className="inline-block mt-8">
            <span className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
              <FaArrowLeft /> Back to login
            </span>
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
