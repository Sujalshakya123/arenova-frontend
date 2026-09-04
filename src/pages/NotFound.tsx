import { Link } from "react-router";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";

type Props = {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
};

const NotFound = ({
  title = "Page not found",
  description = "The page you are looking for does not exist or the link is incorrect.",
  backTo = "/",
  backLabel = "Back to home",
}: Props) => (
  <div className="min-h-screen flex flex-col bg-[#0B0F1A]">
    <Navbar />
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center bg-white rounded-2xl px-8 py-12">
        <p className="text-sm font-semibold text-blue-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-3 leading-relaxed">{description}</p>
        <Link
          to={backTo}
          className="inline-flex mt-8 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          {backLabel}
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;
