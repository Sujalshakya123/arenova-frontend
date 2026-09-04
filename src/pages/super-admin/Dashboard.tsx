import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { FiPlus } from "react-icons/fi";
import CreateAnnouncementModal from "./components/CreateAnnouncementModal";
import { getApiErrorMessage } from "../../api/axios";
import {
  getAdminDashboardGrowth,
  getAdminDashboardStats,
  getAdminRecentActivity,
  type AdminActivityItem,
  type AdminDashboardStats,
  type AdminGrowthPoint,
} from "../../services/adminApi";

const buildLinePath = (
  values: number[],
  width: number,
  height: number,
  max: number,
) => {
  const step = width / (values.length - 1 || 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = height - (v / max) * (height - 20) - 10;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const buildAreaPath = (
  values: number[],
  width: number,
  height: number,
  max: number,
) => {
  const line = buildLinePath(values, width, height, max);
  return `${line} L ${width} ${height} L 0 ${height} Z`;
};

const formatAxisAmount = (amount: number) => {
  if (amount >= 1000) {
    return `Rs. ${Math.round(amount / 1000)}k`;
  }
  return `Rs. ${amount}`;
};

const GrowthChart = ({ data }: { data: AdminGrowthPoint[] }) => {
  const width = 560;
  const height = 168;
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const maxTournaments = Math.max(...data.map((d) => d.tournaments), 1);
  const chartMax = 100;
  const revenueValues = data.map((d) => (d.revenue / maxRevenue) * chartMax);
  const tournamentValues = data.map((d) => (d.tournaments / maxTournaments) * chartMax);
  const revenueArea = buildAreaPath(revenueValues, width, height, chartMax);
  const tournamentArea = buildAreaPath(tournamentValues, width, height, chartMax);
  const revenueLine = buildLinePath(revenueValues, width, height, chartMax);
  const tournamentLine = buildLinePath(tournamentValues, width, height, chartMax);
  const yAxisLabels = [1, 0.75, 0.5, 0.25, 0].map((ratio) =>
    formatAxisAmount(Math.round(maxRevenue * ratio)),
  );

  if (data.every((point) => point.revenue === 0 && point.tournaments === 0)) {
    return (
      <p className="text-sm text-gray-700 py-6 text-center">
        No revenue or tournament activity in this period yet.
      </p>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col justify-between text-xs text-gray-600 py-2 shrink-0">
        {yAxisLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[168px]">
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = height - (tick / chartMax) * (height - 20) - 10;
            return (
              <line
                key={tick}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            );
          })}
          <path d={revenueArea} fill="rgba(167,139,250,0.15)" />
          <path d={tournamentArea} fill="rgba(59,130,246,0.12)" />
          <path d={revenueLine} fill="none" stroke="#a78bfa" strokeWidth={2} />
          <path d={tournamentLine} fill="none" stroke="#3b82f6" strokeWidth={2} />
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-700">
          {data.map((d) => (
            <span key={d.label}>{d.label}</span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-xs">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-400" /> Revenue (Rs.)
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" /> Tournament volume
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Live data from completed payments and new tournaments.
        </p>
      </div>
    </div>
  );
};

const formatMetricValue = (id: string, stats: AdminDashboardStats) => {
  switch (id) {
    case "users":
      return stats.totalUsers.toLocaleString();
    case "organizers":
      return stats.totalOrganizers.toLocaleString();
    case "revenue":
      return stats.totalRevenue;
    case "commission":
      return stats.platformCommission ?? "—";
    case "settledRevenue":
      return stats.settledRevenue ?? "—";
    case "settledEarnings":
      return stats.settledPlatformEarnings ?? "—";
    case "tournaments":
      return stats.totalTournaments.toLocaleString();
    case "active":
      return stats.activeTournaments.toLocaleString();
    case "pending":
      return stats.pendingTournamentApprovals.toLocaleString();
    case "pendingOrganizers":
      return stats.pendingOrganizers.toLocaleString();
    default:
      return "0";
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<"30" | "90">("30");
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activity, setActivity] = useState<AdminActivityItem[]>([]);
  const [growthData, setGrowthData] = useState<AdminGrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [growthLoading, setGrowthLoading] = useState(true);
  const [growthError, setGrowthError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, activityRes] = await Promise.all([
          getAdminDashboardStats(),
          getAdminRecentActivity(),
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load dashboard."));
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    const loadGrowth = async () => {
      try {
        setGrowthLoading(true);
        setGrowthError(null);
        const response = await getAdminDashboardGrowth(range === "30" ? 30 : 90);
        setGrowthData(response.data ?? []);
      } catch (err) {
        setGrowthData([]);
        setGrowthError(
          getApiErrorMessage(err, "Could not load growth chart."),
        );
      } finally {
        setGrowthLoading(false);
      }
    };
    void loadGrowth();
  }, [range]);

  const metrics = useMemo(
    () => [
      { id: "users", label: "Total Users", highlight: false },
      { id: "organizers", label: "Total Organizers", highlight: false },
      {
        id: "revenue",
        label: "Player Payments Collected",
        highlight: false,
      },
      {
        id: "commission",
        label: "Estimated platform share (10%)",
        highlight: false,
      },
      {
        id: "settledRevenue",
        label: "Settled revenue",
        highlight: false,
      },
      {
        id: "settledEarnings",
        label: "Platform earnings (settled)",
        highlight: false,
      },
      { id: "tournaments", label: "Total Tournaments", highlight: false },
      { id: "active", label: "Active Tournaments", highlight: false },
      {
        id: "pending",
        label: "Pending Tournament Approvals",
        highlight: (stats?.pendingTournamentApprovals ?? 0) > 0,
        action: "Review tournaments",
        actionPath: "/super-admin/tournaments?status=Pending",
      },
      {
        id: "pendingOrganizers",
        label: "Pending Organizers",
        highlight: (stats?.pendingOrganizers ?? 0) > 0,
        action: "Review organizers",
        actionPath: "/super-admin/organizers?status=Pending",
      },
    ],
    [stats],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <p className="text-sm text-gray-700">
          Platform overview — live counts from your database.
        </p>
        <button
          type="button"
          onClick={() => setShowAnnouncement(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer"
        >
          <FiPlus size={14} />
          Create Announcement
        </button>
      </div>

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`bg-white border rounded-xl p-5 ${
              metric.highlight ? "border-amber-300 bg-amber-50/30" : "border-gray-200"
            }`}
          >
            <p className="text-sm text-gray-700">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {loading || !stats ? "—" : formatMetricValue(metric.id, stats)}
            </p>
            {metric.action &&
              ((metric.id === "pending" &&
                (stats?.pendingTournamentApprovals ?? 0) > 0) ||
                (metric.id === "pendingOrganizers" &&
                  (stats?.pendingOrganizers ?? 0) > 0)) && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "actionPath" in metric && metric.actionPath
                      ? metric.actionPath
                      : "/super-admin/tournaments?status=Pending",
                  )
                }
                className="text-xs font-medium text-amber-700 mt-2 cursor-pointer"
              >
                {metric.action}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="font-semibold text-gray-900">Growth Overview</h2>
              <p className="text-sm text-gray-700">Revenue and tournament volume</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(["30", "90"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 text-xs font-medium rounded-md cursor-pointer ${
                    range === r ? "bg-white shadow text-gray-900" : "text-gray-500"
                  }`}
                >
                  {r} Days
                </button>
              ))}
            </div>
          </div>
          {growthLoading ? (
            <p className="text-sm text-gray-700 py-6 text-center">Loading chart...</p>
          ) : growthError ? (
            <p className="text-sm text-red-600 py-6 text-center">{growthError}</p>
          ) : (
            <GrowthChart data={growthData} />
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 xl:max-h-[360px] flex flex-col min-h-0">
          <h2 className="font-semibold text-gray-900 mb-3 shrink-0">Recent Activity</h2>
          {loading ? (
            <p className="text-sm text-gray-700">Loading activity...</p>
          ) : activity.length === 0 ? (
            <p className="text-sm text-gray-700">No recent tournament activity yet.</p>
          ) : (
            <ul className="space-y-3 overflow-y-auto min-h-0 pr-1">
              {activity.map((item) => (
                <li key={item.id} className="text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <p className="text-gray-800 leading-snug">{item.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.time}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <CreateAnnouncementModal
        isOpen={showAnnouncement}
        onClose={() => setShowAnnouncement(false)}
      />
    </div>
  );
};

export default Dashboard;
