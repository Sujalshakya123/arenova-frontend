import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import BracketBoard from "../components/BracketBoard";
import tourhero from "../assets/download.jpg";
import {
  addOrganizerTournament,
  getOrganizerTournament,
  updateOrganizerTournament,
} from "./organizer/tournamentStore";
import type { Tournament } from "./organizer/organizerData";
import NotFound from "./NotFound";
import { getEventById, mapApiEventToTournament } from "../services/eventApi";
import { userShell } from "../theme/userShellTheme";

const TournamentBracket = () => {
  const { tournamentId } = useParams();
  const [apiTournament, setApiTournament] = useState<Tournament | undefined>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!tournamentId) {
        setApiTournament(undefined);
        setNotFound(true);
        return;
      }
      if (!/^\d+$/.test(tournamentId)) {
        setApiTournament(getOrganizerTournament(tournamentId));
        setNotFound(!getOrganizerTournament(tournamentId));
        return;
      }
      try {
        setLoading(true);
        const response = await getEventById(tournamentId);
        const mapped = mapApiEventToTournament(response.data);
        if (getOrganizerTournament(mapped.id)) {
          updateOrganizerTournament(mapped.id, mapped);
        } else {
          addOrganizerTournament(mapped);
        }
        setApiTournament(mapped);
        setNotFound(false);
      } catch {
        if (!getOrganizerTournament(tournamentId)) setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [tournamentId]);

  const tournament =
    apiTournament ||
    (tournamentId ? getOrganizerTournament(tournamentId) : undefined);

  if (!tournamentId || (notFound && !loading)) {
    return (
      <NotFound
        title="Bracket not found"
        description="Open a bracket from a tournament page. A valid tournament id is required."
        backTo="/tournaments"
        backLabel="Browse tournaments"
      />
    );
  }

  return (
    <>
      <div className="relative">
        <img
          src={tourhero}
          alt=""
          className="absolute inset-0 w-full h-[88px] object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative">
          <Navbar />
        </div>
      </div>

      <div className={userShell.page}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <Link
            to={`/tournaments-detail?id=${tournamentId}`}
            className={userShell.backLink}
          >
            <ArrowLeft size={16} />
            Back to tournament
          </Link>

          <div className="mb-6">
            <h1 className={userShell.h1}>
              {loading && !tournament
                ? "Loading bracket..."
                : tournament?.name || "Tournament bracket"}
            </h1>
            <p className={userShell.subtitle}>
              {tournament
                ? `${tournament.game} · ${
                    tournament.matchType === "ffa" ? "FFA" : "Duel"
                  }${
                    tournament.stageType
                      ? ` · ${tournament.stageType.replace(/-/g, " ")}`
                      : ""
                  } · ${tournament.status}`
                : "Bracket released by the organizer"}
            </p>
          </div>

          {!tournament || !tournament.bracket?.length ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-xl px-6 py-16 text-center text-sm text-gray-500">
              No bracket available yet. Wait for the organizer to generate and
              announce it.
            </div>
          ) : (
            <BracketBoard tournament={tournament} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TournamentBracket;
