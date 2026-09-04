import { Link, useSearchParams } from "react-router";
import {
  Smartphone,
  Users,
  Calendar,
  Globe,
  TrendingUp,
  Trophy,
  Clock,
  ScrollText,
} from "lucide-react";
import DetailBox from "./components/DetailBox";
import { useTournamentDetail } from "./TournamentDetailContext";
import { tournamentDetailSubPath } from "./resolveTournamentDetail";
import { resolveGameIconByName } from "../../data/platformGames";
import {
  detailIconChipBg,
  isUserShellDark,
  userShell,
} from "../../theme/userShellTheme";

const Overview = () => {
  const { info, generalRules, scheduleStages, gameIcon } = useTournamentDetail();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const gameImage = gameIcon || resolveGameIconByName(info.gameName);
  const dark = isUserShellDark;

  const infoItems = [
    {
      label: "Game",
      value: info.gameName,
      icon: (
        <img
          src={gameImage}
          alt={info.gameName}
          className="w-8 h-8 rounded-lg object-cover"
        />
      ),
      iconBg: "bg-transparent p-0",
    },
    {
      label: "Platform",
      value: info.platform,
      icon: (
        <Smartphone
          size={18}
          className={dark ? "text-purple-400" : "text-purple-600"}
        />
      ),
      iconBg: detailIconChipBg("purple"),
    },
    {
      label: "Format",
      value: info.format,
      icon: (
        <Users
          size={18}
          className={dark ? "text-amber-400" : "text-amber-700"}
        />
      ),
      iconBg: detailIconChipBg("amber"),
    },
    {
      label: "Tournament Dates",
      value: info.dates,
      icon: (
        <Calendar
          size={18}
          className={dark ? "text-blue-400" : "text-blue-600"}
        />
      ),
      iconBg: detailIconChipBg("blue"),
    },
    {
      label: "Server",
      value: info.server,
      icon: (
        <Globe
          size={18}
          className={dark ? "text-purple-400" : "text-purple-600"}
        />
      ),
      iconBg: detailIconChipBg("purple"),
    },
    {
      label: "Level Restriction",
      value: info.levelRestriction,
      icon: (
        <TrendingUp
          size={18}
          className={dark ? "text-gray-400" : "text-gray-500"}
        />
      ),
      iconBg: detailIconChipBg("gray"),
    },
  ];

  const stats = [
    {
      label: "Prize Pool",
      value: info.prizePool,
      icon: (
        <Trophy
          size={18}
          className={dark ? "text-blue-400" : "text-blue-600"}
        />
      ),
    },
    {
      label: "Entry Fee",
      value:
        info.entryFee > 0 ? `Rs ${info.entryFee} / Team` : "Free To Play",
      icon: (
        <Users
          size={18}
          className={dark ? "text-blue-400" : "text-blue-600"}
        />
      ),
    },
    {
      label: "Slots Filled",
      value: `${info.totalSlots - info.remainingSlots} / ${info.totalSlots}`,
      icon: (
        <Users
          size={18}
          className={dark ? "text-blue-400" : "text-blue-600"}
        />
      ),
    },
    {
      label: "Starts On",
      value: info.startsOn,
      icon: (
        <Calendar
          size={18}
          className={dark ? "text-blue-400" : "text-blue-600"}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={userShell.detailStatCard}>
            <div className="flex items-center gap-2 mb-2">
              <div className={userShell.detailIconWrap}>{stat.icon}</div>
              <p className={userShell.statLabel}>{stat.label}</p>
            </div>
            <p className={userShell.strongSm}>{stat.value}</p>
          </div>
        ))}
      </div>

      <DetailBox title="Description">
        <p
          className={`${userShell.body} leading-relaxed mb-5 pb-5 border-b ${userShell.detailBorder}`}
        >
          {info.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 py-3 border-b ${userShell.detailBorderSubtle} last:border-0`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
              >
                {item.icon}
              </div>
              <div>
                <p className={userShell.statLabel}>{item.label}</p>
                <p className={userShell.strongSm}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </DetailBox>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={userShell.detailPanel}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock
                size={18}
                className={dark ? "text-gray-400" : "text-gray-600"}
              />
              <h3 className={userShell.h2Base}>Upcoming Stages</h3>
            </div>
            <Link
              to={tournamentDetailSubPath("schedule", id)}
              className={userShell.linkBold}
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {scheduleStages.slice(0, 3).map((stage) => (
              <div
                key={stage.stage}
                className={`flex items-center justify-between ${userShell.detailInset}`}
              >
                <p className={userShell.strongSm}>{stage.stage}</p>
                <p className={userShell.mutedXs}>
                  {stage.date} · {stage.time}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={userShell.detailPanel}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ScrollText
                size={18}
                className={dark ? "text-gray-400" : "text-gray-600"}
              />
              <h3 className={userShell.h2Base}>Key Rules</h3>
            </div>
            <Link
              to={tournamentDetailSubPath("rules", id)}
              className={userShell.linkBold}
            >
              View all
            </Link>
          </div>
          <ul className="space-y-2.5">
            {generalRules.slice(0, 4).map((rule) => (
              <li key={rule} className={`${userShell.body} flex gap-2`}>
                <span className="text-blue-400 shrink-0">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
