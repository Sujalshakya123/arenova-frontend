import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { MdEmail } from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import api, { getApiErrorMessage } from "../api/axios";
import { toast } from "react-toastify";
import { getHomePath } from "../auth/roles";
import FormFirstAuthLayout from "../components/auth/FormFirstAuthLayout";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  role: string;
  status?: string;
};

type VerifyResponse = {
  token?: string | null;
  pendingApproval?: boolean;
  message?: string;
  userDTO: AuthUser;
};

const OTP_LENGTH = 6;

const maskEmail = (email: string) => {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(6, local.length));
  return `${visible}${local.length > 6 ? "****" : "***"}@${domain}`;
};

const Otppage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const email =
    (location.state as { email?: string } | null)?.email?.trim() ?? "";

  const [digits, setDigits] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) {
      navigate("/sign-up", { replace: true });
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

    setDigits(
      Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? ""),
    );
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    setError("");
  };

  const handleVerify = async () => {
    if (verifying) return;
    if (otp.length !== OTP_LENGTH) {
      setError("Enter the full 6-digit code.");
      return;
    }

    setVerifying(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post<VerifyResponse>("/auth/verify", {
        email,
        otp,
      });

      const user = response.data.userDTO;

      if (response.data.pendingApproval) {
        toast.success(
          response.data.message ??
            "Registration successful. Awaiting Super Admin approval.",
        );
        navigate("/organizer/pending-approval", {
          replace: true,
          state: { email: user.email, status: user.status },
        });
        return;
      }

      if (!response.data.token) {
        setError("Verification succeeded but no session was issued. Please log in.");
        return;
      }

      login(response.data.token, {
        id: String(user.id),
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });

      toast.success("Email verified! Welcome to Arenova.");
      navigate(getHomePath(user.role, user.status), { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err, "Verification failed. Please try again."));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post<string>("/auth/resend-otp", { email });
      setSuccess(
        typeof response.data === "string"
          ? response.data
          : "A new verification code was sent to your email.",
      );
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
      <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
        <MdEmail size={28} className="text-blue-500" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h1>
      <p className="text-sm text-gray-500 mb-6">
        We&apos;ve sent a 6-digit verification code to{" "}
        <span className="font-semibold text-gray-800">{maskEmail(email)}</span>.
        Please enter it below:
      </p>

      <div className="flex gap-3 mb-6">
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

      {error && (
        <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
      )}
      {success && (
        <p className="text-sm text-emerald-700 font-medium mb-4">{success}</p>
      )}

      <button
        type="button"
        onClick={handleVerify}
        disabled={verifying}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mb-6 cursor-pointer transition"
      >
        {verifying ? "Verifying..." : "Verify & Continue"}
        {!verifying && <span>→</span>}
      </button>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Didn&apos;t receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="text-sm text-blue-600 font-medium underline underline-offset-2 disabled:opacity-60 cursor-pointer"
        >
          {resending ? "Sending..." : "Resend verification code"}
        </button>
      </div>

      <NavLink
        to="/login"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        <span className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer">
          <FaArrowLeft /> Back to login
        </span>
      </NavLink>
    </FormFirstAuthLayout>
  );
};

export default Otppage;
