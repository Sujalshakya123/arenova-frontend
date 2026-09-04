import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import Navbar from "../components/User/Navbar/Navbar";
import hero from "../assets/hero-banner.png";
import { FaArrowRight } from "react-icons/fa";
import { MdCurrencyRupee, MdGroups, MdLiveTv } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import Footer from "../components/User/Navbar/Footer";
import { Outlet, useNavigate } from "react-router";
import BrowseGames from "../pages/BrowseGames";
import FeaturedTournament from "../pages/FeaturedTournament";
import { getPublicPlatformStats } from "../services/eventApi";
import {
  emptyPlatformStats,
  mapApiPlatformStats,
  type PlatformStats,
} from "../data/platformStats";
import { subscribeRegistrationsUpdated } from "../utils/registrationEvents";

const formatStatValue = (
  value: number | string,
  loading: boolean,
  error: boolean,
  suffix = "",
) => {
  if (loading || error) return "—";
  if (typeof value === "number") {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K${suffix}`;
    return value > 0 ? `${value}${suffix}` : `${value}`;
  }
  return value;
};

type HeroStat = {
  id: number;
  icon: IconType;
  value: string;
  label: string;
  hint: string;
  iconWrap: string;
};

const UserLayout = () => {
  const navigate = useNavigate();
  const [platformStats, setPlatformStats] =
    useState<PlatformStats>(emptyPlatformStats);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setStatsLoading(true);
        setStatsError(false);
        const response = await getPublicPlatformStats();
        setPlatformStats(mapApiPlatformStats(response.data));
      } catch {
        setPlatformStats(emptyPlatformStats());
        setStatsError(true);
      } finally {
        setStatsLoading(false);
      }
    };
    void load();
    return subscribeRegistrationsUpdated(() => {
      void load();
    });
  }, []);

  const stats: HeroStat[] = [
    {
      id: 1,
      icon: GiTrophyCup,
      value: formatStatValue(
        platformStats.tournaments,
        statsLoading,
        statsError,
      ),
      label: "Tournaments",
      hint: "Live & upcoming",
      iconWrap: "bg-blue-500/20 text-blue-300 ring-blue-400/20",
    },
    {
      id: 2,
      icon: MdGroups,
      value: formatStatValue(platformStats.players, statsLoading, statsError),
      label: "Players",
      hint: "Across Nepal",
      iconWrap: "bg-emerald-500/20 text-emerald-300 ring-emerald-400/20",
    },
    {
      id: 3,
      icon: MdLiveTv,
      value: formatStatValue(
        platformStats.liveTournaments,
        statsLoading,
        statsError,
      ),
      label: "Live Tournaments",
      hint: "Running now",
      iconWrap: "bg-violet-500/20 text-violet-300 ring-violet-400/20",
    },
    {
      id: 4,
      icon: MdCurrencyRupee,
      value: statsLoading || statsError ? "—" : platformStats.totalPrize,
      label: "Prize Pool",
      hint: "Total rewards",
      iconWrap: "bg-amber-500/20 text-amber-300 ring-amber-400/20",
    },
  ];

  return (
    <>
      <div className="relative">
        <img
          src={hero}
          className="absolute inset-0 h-[min(92vh,920px)] w-full object-cover object-center"
          alt=""
        />
        <div className="absolute inset-0 h-[min(92vh,920px)] bg-gradient-to-r from-black/92 via-black/60 to-black/25" />
        <div className="absolute inset-0 h-[min(92vh,920px)] bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="relative flex min-h-[min(92vh,920px)] flex-col overflow-x-hidden">
          <Navbar />

          <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 xl:px-20">
            <div className="hero-fade-up mb-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/35 bg-slate-950/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100 backdrop-blur-sm">
                <span className="live-pulse-dot h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                Nepal&apos;s esports platform · Live now
              </span>
            </div>

            <h1 className="hero-fade-up hero-fade-up-delay-1 font-display mb-5 max-w-[720px] text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Where Nepal&apos;s gamers
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                compete to win.
              </span>
            </h1>

            <p className="hero-fade-up hero-fade-up-delay-2 mb-8 max-w-[540px] text-base leading-relaxed text-slate-300 sm:text-lg">
              Discover tournaments, build your dream squad, and compete against
              the strongest players in the nation&apos;s biggest esports battles.
            </p>

            <div className="hero-fade-up hero-fade-up-delay-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/tournaments")}
                className="group flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-500/40"
              >
                Explore Tournaments
                <FaArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
              <button
                type="button"
                onClick={() => navigate("/games")}
                className="cursor-pointer rounded-xl border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10"
              >
                Browse Games
              </button>
            </div>
          </div>

          <div className="hero-fade-up hero-fade-up-delay-4 w-full shrink-0 px-4 pb-8 pt-2 sm:px-6 xl:px-20">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.08]"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ${stat.iconWrap}`}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-2xl font-bold leading-none text-white">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-100">
                        {stat.label}
                      </p>
                      <p className="text-sm text-slate-300">{stat.hint}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {statsError && !statsLoading && (
              <p className="mt-3 text-center text-xs text-amber-200/90">
                Could not load live stats. Check that the backend is running.
              </p>
            )}
          </div>
        </div>
      </div>

      <BrowseGames />
      <FeaturedTournament />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
