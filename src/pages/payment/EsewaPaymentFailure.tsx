import { Link } from "react-router";
import Navbar from "../../components/User/Navbar/Navbar";
import Footer from "../../components/User/Navbar/Footer";
import { userShell } from "../../theme/userShellTheme";

const EsewaPaymentFailure = () => {
  return (
    <div className={userShell.pageFlex}>
      <Navbar variant="solid" />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment failed</h1>
          <p className="text-sm text-gray-500">
            Your eSewa payment was cancelled or did not complete. Your
            registration is still pending — you can try paying again from a new
            registration after withdrawing, or contact support.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/my-tournaments"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              My Tournaments
            </Link>
            <Link
              to="/messages?room=support"
              className="text-sm text-gray-500 hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EsewaPaymentFailure;
