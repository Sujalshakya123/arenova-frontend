import { Link, useLocation, useParams } from "react-router";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import NotFound from "./NotFound";

type StaticPageContent = {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string }[];
};

const PAGES: Record<string, StaticPageContent> = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How Arenova collects and uses your information.",
    sections: [
      {
        heading: "Information we collect",
        body: "We collect account details you provide (such as username, email, and profile information), tournament registrations, and basic usage data needed to run the platform.",
      },
      {
        heading: "How we use your data",
        body: "Your information is used to create and manage accounts, run tournaments, process entry payments, send verification emails, and improve Arenova services.",
      },
      {
        heading: "Sharing",
        body: "We do not sell personal data. Limited information may be shared with payment providers (e.g. eSewa) or authentication providers (e.g. Google) only as needed to complete those services.",
      },
      {
        heading: "Contact",
        body: "For privacy questions, reach us through the Contact Us page. This page is a project documentation summary and may be updated as Arenova grows.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Rules for using the Arenova platform.",
    sections: [
      {
        heading: "Acceptance",
        body: "By creating an account or using Arenova, you agree to follow these terms and all tournament rules set by organizers and platform admins.",
      },
      {
        heading: "Accounts",
        body: "You are responsible for keeping your login details secure. Accounts may be suspended for abuse, cheating, or violating tournament / community rules.",
      },
      {
        heading: "Tournaments and content",
        body: "Organizers are responsible for the events they create. Players must follow registration requirements, match schedules, and fair-play expectations.",
      },
      {
        heading: "Changes",
        body: "Arenova may update these terms for academic or product improvements. Continued use of the platform means you accept the latest version.",
      },
    ],
  },
  payment: {
    title: "Payment Policy",
    subtitle: "How entry fees and payments work on Arenova.",
    sections: [
      {
        heading: "Entry fees",
        body: "Some tournaments require an entry fee set by the organizer. Free-to-play events do not charge registration fees.",
      },
      {
        heading: "Payment method",
        body: "Paid registrations are processed through eSewa. Always verify the amount and tournament details before paying.",
      },
      {
        heading: "Refunds",
        body: "Refund eligibility depends on the tournament rules and payment status. If a tournament is cancelled by the organizer or admin, contact support for guidance.",
      },
      {
        heading: "Prize payouts",
        body: "Prize amounts shown on Arenova are for tournament records and display. Real prize transfers are handled outside the automated payment flow unless otherwise stated.",
      },
    ],
  },
  about: {
    title: "About Us",
    subtitle: "Arenova — Nepal's competitive esports tournament platform.",
    sections: [
      {
        heading: "Our mission",
        body: "Arenova helps players discover tournaments, organize competitive events, and manage brackets, registrations, and communications in one place.",
      },
      {
        heading: "Who it's for",
        body: "Players join and compete. Organizers create projects and tournaments. Super admins oversee platform users, games, and published events.",
      },
      {
        heading: "Built for Nepal esports",
        body: "The platform is designed around local needs such as popular titles, eSewa payments, and organizer workflows suitable for campus and community competitions.",
      },
      {
        heading: "Get in touch",
        body: "Have questions or feedback? Visit the Contact Us page and send us a message.",
      },
    ],
  },
};

const pathToKey = (pathname: string): string | undefined => {
  const cleaned = pathname.replace(/\/+$/, "") || "/";
  if (cleaned === "/privacy") return "privacy";
  if (cleaned === "/terms") return "terms";
  if (cleaned === "/payment-policy") return "payment";
  if (cleaned === "/about") return "about";
  return undefined;
};

const StaticInfoPage = () => {
  const { pageKey } = useParams();
  const location = useLocation();
  const key = pageKey || pathToKey(location.pathname);
  const page = key ? PAGES[key] : undefined;

  if (!page) {
    return (
      <NotFound
        title="Page not found"
        description="This information page does not exist."
        backTo="/"
        backLabel="Back to home"
      />
    );
  }

  return (
    <>
      <div className="bg-[#0B0F1A] min-h-screen">
        <Navbar />
        <div className="px-4 sm:px-6 xl:px-[80px] py-10 xl:py-14">
          <div className="max-w-3xl mx-auto">
            <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Arenova
            </p>
            <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
              {page.title}
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mb-8">
              {page.subtitle}
            </p>

            <div className="space-y-6">
              {page.sections.map((section) => (
                <section
                  key={section.heading}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6"
                >
                  <h2 className="text-white font-semibold text-lg mb-2">
                    {section.heading}
                  </h2>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {section.body}
                  </p>
                </section>
              ))}
            </div>

            <p className="text-gray-500 text-xs mt-8">
              Need help?{" "}
              <Link to="/contacts" className="text-blue-400 hover:underline">
                Contact Us
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StaticInfoPage;
