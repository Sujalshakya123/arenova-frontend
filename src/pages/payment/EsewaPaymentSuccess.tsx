import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import Navbar from "../../components/User/Navbar/Navbar";
import Footer from "../../components/User/Navbar/Footer";
import { getApiErrorMessage } from "../../api/axios";
import { verifyEsewaPayment } from "../../services/paymentApi";
import { notifyRegistrationsUpdated } from "../../utils/registrationEvents";
import { userShell } from "../../theme/userShellTheme";

const EsewaPaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Verifying your eSewa payment...");
  const [registrationId, setRegistrationId] = useState<number | null>(null);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      setStatus("error");
      setMessage("Missing payment data from eSewa.");
      return;
    }

    const run = async () => {
      try {
        const response = await verifyEsewaPayment(data);
        setStatus("ok");
        setMessage(response.data.message || "Payment verified successfully.");
        if (response.data.registrationId) {
          setRegistrationId(response.data.registrationId);
        }
        notifyRegistrationsUpdated();
        window.setTimeout(() => navigate("/my-tournaments"), 2500);
      } catch (error) {
        setStatus("error");
        setMessage(getApiErrorMessage(error, "Could not verify eSewa payment."));
      }
    };

    void run();
  }, [navigate, searchParams]);

  return (
    <div className={userShell.pageFlex}>
      <Navbar variant="solid" />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">eSewa Payment</h1>
          <p
            className={`text-sm ${
              status === "error"
                ? "text-rose-600"
                : status === "ok"
                  ? "text-emerald-600"
                  : "text-gray-500"
            }`}
          >
            {message}
          </p>
          {status === "ok" && registrationId ? (
            <p className="text-xs text-gray-500 mt-3">
              You can open your receipt from My Tournaments.
            </p>
          ) : null}
          {status === "error" && (
            <Link
              to="/my-tournaments"
              className="inline-block mt-6 text-sm font-semibold text-blue-600 hover:underline"
            >
              Go to My Tournaments
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EsewaPaymentSuccess;
