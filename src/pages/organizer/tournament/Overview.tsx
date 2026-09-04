import { Link, useOutletContext } from "react-router";
import { ExternalLink, Scale } from "lucide-react";
import type { TournamentOutletContext } from "../components/TournamentLayout";
import { tournamentDetailPath } from "../../tournaments-detail/resolveTournamentDetail";
import { resolvePrizeAwards } from "../../../utils/bracketProgress";
import { isEntryFeeFundedPrizePool, PRIZE_SPLIT } from "../../../config/prizePoolConfig";
import { SETTLEMENT_ENABLED } from "../../../config/settlementConfig";
import { formatRsNpr } from "../../../utils/prizePoolEconomics";

const TournamentOverview = () => {
  const { tournament } = useOutletContext<TournamentOutletContext>();
  const prizeAwards = resolvePrizeAwards(tournament);
  const dynamicPool =
    isEntryFeeFundedPrizePool() ||
    tournament.prizeFundingMode === "entry_fee_funded";

  const stats = [
    { label: "Game", value: tournament.game },
    { label: "Platform", value: tournament.platform },
    { label: "Format", value: tournament.format || tournament.type },
    {
      label: "Capacity",
      value: `${tournament.playerCount} ${
        tournament.type === "team" ? "teams" : "players"
      }`,
    },
    {
      label: dynamicPool ? "Prize pool (live)" : "Prize pool",
      value: tournament.prizePool || "—",
    },
    ...(dynamicPool
      ? [
          {
            label: "Paid entries",
            value: String(tournament.paidEntryCount ?? 0),
          },
          {
            label: "At full capacity",
            value: formatRsNpr(tournament.prizePoolAtCapacityNpr ?? 0),
          },
          {
            label: "Your share (20%)",
            value: formatRsNpr(tournament.organizerShareNpr ?? 0),
          },
          { label: "1st place", value: tournament.prizeFirst || "—" },
          { label: "2nd place", value: tournament.prizeSecond || "—" },
        ]
      : [
          { label: "1st place", value: tournament.prizeFirst || "—" },
          { label: "2nd place", value: tournament.prizeSecond || "—" },
          { label: "3rd place", value: tournament.prizeThird || "—" },
        ]),
    { label: "Entry fee", value: tournament.entryFee || "—" },
    { label: "Time zone", value: tournament.timezone },
    { label: "Status", value: tournament.status },
  ];

  return (
    <div className="space-y-6">
      {dynamicPool && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
          <strong>Entry-fee-funded prizes.</strong> {PRIZE_SPLIT.prize}% of paid
          entry fees goes to winners, {PRIZE_SPLIT.organizer}% to you,{" "}
          {PRIZE_SPLIT.platform}% to the platform. Pool updates as teams pay.
        </div>
      )}

      {tournament.status === "completed" && SETTLEMENT_ENABLED && /^\d+$/.test(tournament.id) && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-violet-900">
            <strong>Tournament completed.</strong> Submit settlement for Super Admin
            approval to finalize revenue (10% platform, 20% organizer, 70% prizes).
          </div>
          <Link
            to={`/organizer/tournaments/${tournament.id}/settlement`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            <Scale size={16} />
            Initiate settlement
          </Link>
        </div>
      )}

      {tournament.status === "draft" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <strong>Pending admin approval.</strong> This tournament is not public yet.
          Platform admin must approve it before players can register and you can generate brackets.
        </div>
      )}

      {prizeAwards.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <h3 className="text-sm font-bold text-emerald-900 mb-3">
            Prize results (from bracket)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prizeAwards.map((award) => (
              <div
                key={`${award.place}-${award.name}`}
                className="bg-white border border-emerald-100 rounded-lg px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {award.placeLabel}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-1">{award.name}</p>
                <p className="text-sm text-gray-600 mt-0.5">{award.amount}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-800 mt-3">
            With 2 teams, only 1st and 2nd are assigned. 3rd stays unused if empty.
            This does not transfer money automatically — it records who earned which place prize.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Tournament overview</h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit public detail content under Settings → Public page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/organizer/tournaments/${tournament.id}/settings/public-page`}
            className="px-4 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Edit public page
          </Link>
          <Link
            to={`/organizer/tournaments/${tournament.id}/chat`}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-lg ${
              /^\d+$/.test(tournament.id)
                ? "border-blue-200 text-blue-700 hover:bg-blue-50"
                : "border-gray-200 text-gray-400 pointer-events-none"
            }`}
            aria-disabled={!/^\d+$/.test(tournament.id)}
          >
            Tournament chat
          </Link>
          <Link
            to={tournamentDetailPath(tournament.id)}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
              tournament.status === "draft"
                ? "bg-gray-200 text-gray-500 pointer-events-none"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={tournament.status === "draft"}
            title={
              tournament.status === "draft"
                ? "Available after admin approval"
                : undefined
            }
          >
            Preview detail page <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {stat.label}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1 capitalize">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 mb-2">Next steps</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          1) Fill <strong>Settings → Public page</strong> (description, rules,
          schedule). 2) Set Structure / Matches for the bracket. 3) Preview the
          player detail page anytime with the button above.
        </p>
      </div>
    </div>
  );
};

export default TournamentOverview;
