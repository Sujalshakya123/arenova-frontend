import { MdHourglassTop, MdCheckCircle, MdCancel, MdBlock } from "react-icons/md";
import { NavLink, useLocation } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { useEffect, useState } from "react";
import FormFirstAuthLayout from "../../components/auth/FormFirstAuthLayout";
import api, { getApiErrorMessage } from "../../api/axios";
import type { ApiUserStatus } from "../../services/userApi";

type OrganizerStatusResponse = {
  found: boolean;
  email?: string;
  status?: ApiUserStatus;
  message?: string;
};

type StatusKey = "pending" | "approved" | "rejected" | "suspended" | "unknown";

const resolveStatusKey = (status?: ApiUserStatus | null): StatusKey => {
  if (status === "ACTIVE") return "approved";
  if (status === "REJECTED") return "rejected";
  if (status === "SUSPENDED") return "suspended";
  if (status === "PENDING" || status === "INACTIVE") return "pending";
  return "unknown";
};

const statusMeta: Record<
  StatusKey,
  { label: string; badge: string; icon: typeof MdHourglassTop; title: string }
> = {
  pending: {
    label: "Pending approval",
    badge: "bg-amber-100 text-amber-800 border-amber-200",
    icon: MdHourglassTop,
    title: "Awaiting approval",
  },
  approved: {
    label: "Approved",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: MdCheckCircle,
    title: "Account approved",
  },
  rejected: {
    label: "Rejected",
    badge: "bg-rose-100 text-rose-800 border-rose-200",
    icon: MdCancel,
    title: "Registration rejected",
  },
  suspended: {
    label: "Suspended",
    badge: "bg-gray-100 text-gray-800 border-gray-200",
    icon: MdBlock,
    title: "Account suspended",
  },
  unknown: {
    label: "Unknown",
    badge: "bg-gray-100 text-gray-700 border-gray-200",
    icon: MdHourglassTop,
    title: "Registration status",
  },
};

const OrganizerPendingApproval = () => {
  const location = useLocation();
  const initialEmail =
    (location.state as { email?: string; status?: ApiUserStatus } | null)?.email?.trim() ??
    "";
  const initialStatus =
    (location.state as { status?: ApiUserStatus } | null)?.status ?? null;

  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(Boolean(initialEmail));
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OrganizerStatusResponse | null>(
    initialStatus
      ? {
          found: true,
          email: initialEmail,
          status: initialStatus,
        }
      : null,
  );

  const fetchStatus = async (targetEmail: string) => {
    const trimmed = targetEmail.trim();
    if (!trimmed) {
      setError("Enter your email to check your account status.");
      return;
    }

    setChecking(true);
    setError("");
    try {
      const response = await api.post<OrganizerStatusResponse>(
        "/auth/organizer-status",
        { email: trimmed },
      );
      setResult(response.data);
      setEmail(trimmed);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not load your account status."));
      setResult(null);
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialEmail) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setChecking(true);
      setError("");
      try {
        const response = await api.post<OrganizerStatusResponse>(
          "/auth/organizer-status",
          { email: initialEmail },
        );
        if (!cancelled) {
          setResult(response.data);
          setEmail(initialEmail);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Could not load your account status."));
          setResult(null);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [initialEmail]);

  const statusKey = result?.found
    ? resolveStatusKey(result.status)
    : "unknown";
  const meta = statusMeta[statusKey];
  const StatusIcon = meta.icon;

  return (
    <FormFirstAuthLayout>
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
          statusKey === "approved"
            ? "bg-emerald-100"
            : statusKey === "rejected"
              ? "bg-rose-100"
              : "bg-amber-100"
        }`}
      >
        <StatusIcon
          size={28}
          className={
            statusKey === "approved"
              ? "text-emerald-600"
              : statusKey === "rejected"
                ? "text-rose-600"
                : "text-amber-600"
          }
        />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">{meta.title}</h1>

      {result?.found && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Account status
          </p>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${meta.badge}`}
          >
            {meta.label}
          </span>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        {result?.found ? (
          <>
            {result.message ??
              "Your organizer registration status is shown below."}
            {result.email ? (
              <>
                {" "}
                Registered as{" "}
                <span className="font-semibold text-gray-800">{result.email}</span>.
              </>
            ) : null}
          </>
        ) : (
          <>
            Enter the email you used to register as an organizer to see your
            current approval status.
          </>
        )}
      </p>

      <form
        className="mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          void fetchStatus(email);
        }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={checking}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg text-sm cursor-pointer"
        >
          {checking ? "Checking..." : "Check status"}
        </button>
      </form>

      {loading && !result && !error && (
        <p className="text-sm text-gray-500 mb-4">Loading your account status...</p>
      )}

      {error && (
        <p className="text-sm text-red-600 font-medium mb-4">{error}</p>
      )}

      {!result?.found && result && !checking && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 mb-6">
          {result.message ?? "No organizer registration found for this email."}
        </div>
      )}

      {result?.found && statusKey === "pending" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-6">
          You will receive access once your account is approved. Try logging in
          again after approval.
        </div>
      )}

      {result?.found && statusKey === "approved" && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 mb-6">
          Your account is approved. You can log in and open the organizer
          dashboard now.
        </div>
      )}

      {result?.found && statusKey === "rejected" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 mb-6">
          Your registration was not approved. Please contact the administrator
          if you believe this is a mistake.
        </div>
      )}

      <NavLink
        to="/login"
        className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
      >
        <FaArrowLeft size={12} />
        Back to login
      </NavLink>
    </FormFirstAuthLayout>
  );
};

export default OrganizerPendingApproval;
