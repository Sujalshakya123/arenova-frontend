import { Outlet, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import tourhero from "../assets/download.jpg";
import TournamentTabs from "./tournaments-detail/components/TournamentTabs";
import TournamentSidebar from "./tournaments-detail/components/TournamentSidebar";
import { TournamentDetailProvider } from "./tournaments-detail/TournamentDetailContext";
import {
  findTournamentDetail,
  fromOrganizerTournament,
  type ResolvedTournamentDetail,
} from "./tournaments-detail/resolveTournamentDetail";
import NotFound from "./NotFound";
import { userShell } from "../theme/userShellTheme";
import {
  getEventById,
  mapApiEventToTournament,
} from "../services/eventApi";
import { addOrganizerTournament, getOrganizerTournament } from "./organizer/tournamentStore";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";

const TournamentsDetail = () => {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id");
  const [resolved, setResolved] = useState<ResolvedTournamentDetail | null>(
    () => (tournamentId ? findTournamentDetail(tournamentId) : null),
  );
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(!tournamentId);

  useEffect(() => {
    const load = async () => {
      if (!tournamentId) {
        setResolved(null);
        setNotFound(true);
        return;
      }

      const local = findTournamentDetail(tournamentId);
      if (local) {
        setResolved(local);
        setNotFound(false);
      }

      if (/^\d+$/.test(tournamentId)) {
        try {
          setLoading(true);
          const response = await getEventById(tournamentId);
          const mapped = mapApiEventToTournament(response.data);
          if (!getOrganizerTournament(mapped.id)) {
            addOrganizerTournament(mapped);
          }
          setResolved(fromOrganizerTournament(mapped));
          setNotFound(false);
        } catch {
          if (!local) setNotFound(true);
        } finally {
          setLoading(false);
        }
      } else if (!local) {
        setNotFound(true);
      }
    };
    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, [tournamentId]);

  if (!tournamentId || (notFound && !loading)) {
    return (
      <NotFound
        title="Tournament not found"
        description={
          tournamentId
            ? "This tournament does not exist or the link is invalid."
            : "Open a tournament from the browse page. A tournament id is required."
        }
        backTo="/tournaments"
        backLabel="Browse tournaments"
      />
    );
  }

  if (!resolved) {
    return (
      <div className={`${userShell.pagePlain} flex items-center justify-center`}>
        <p className={userShell.muted}>Loading tournament...</p>
      </div>
    );
  }

  return (
    <TournamentDetailProvider value={resolved}>
      <div className="relative">
        <img
          src={resolved.coverImage || tourhero}
          alt="Tournament Hero"
          className="w-full h-[280px] sm:h-[340px] xl:h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex flex-col">
          <Navbar />
          <div className="flex flex-col justify-center flex-1 px-4 sm:px-6 xl:px-[80px] pb-6 xl:pb-8">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-blue-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                {resolved.info.seriesBadge}
              </span>
              <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                {resolved.info.secondaryBadge}
              </span>
            </div>
            <h1 className="text-white font-bold text-2xl sm:text-3xl xl:text-4xl leading-tight mb-3 max-w-[700px]">
              {resolved.info.title}
            </h1>
            <p className="text-gray-300 text-sm max-w-[560px] leading-relaxed">
              {resolved.info.description}
            </p>
          </div>
        </div>
      </div>

      <div className={userShell.section}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 xl:px-[80px] py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 min-w-0 w-full">
              <TournamentTabs />
              <Outlet />
            </div>
            <TournamentSidebar />
          </div>
        </div>
      </div>

      <Footer />
    </TournamentDetailProvider>
  );
};

export default TournamentsDetail;
