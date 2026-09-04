import { Fragment, useEffect, useState } from "react";

import { useOutletContext } from "react-router";

import { ChevronDown } from "lucide-react";

import FormCard from "../../components/FormCard";

import type { TournamentOutletContext } from "../../components/TournamentLayout";

import { getApiErrorMessage } from "../../../../api/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../../../components/ConfirmModal";

import {

  approveRegistration,

  getEventRegistrations,

  rejectRegistration,

  type ApiEventRegistration,

} from "../../../../services/registrationApi";

import {
  notifyRegistrationsUpdated,
  subscribeRegistrationsUpdated,
} from "../../../../utils/registrationEvents";
import {
  canApproveWithPayment,
  paymentStatusClass,
  paymentStatusLabel,
} from "../../../../utils/registrationWindow";



const playerCount = (registration: ApiEventRegistration) =>

  1 + (registration.roster?.length ?? 0);



const statusLabel = (registration: ApiEventRegistration) => {

  if (registration.status === "REGISTERED") return "Confirmed";

  if (registration.status === "PENDING") return "Pending";

  if (registration.status === "REJECTED") return "Rejected";

  return "Withdrawn";

};



const statusClass = (registration: ApiEventRegistration) => {

  if (registration.status === "REGISTERED") {

    return "bg-green-100 text-green-700";

  }

  if (registration.status === "PENDING") {

    return "bg-amber-100 text-amber-700";

  }

  if (registration.status === "REJECTED") {

    return "bg-red-100 text-red-700";

  }

  return "bg-gray-100 text-gray-600";

};



const teamMembers = (registration: ApiEventRegistration) => {

  const isSolo = registration.mode === "SOLO";

  return [

    {

      role: isSolo ? "Player" : "Captain",

      username: registration.captainUsername,

    },

    ...(registration.roster ?? []).map((username, index) => ({

      role: isSolo ? `Player ${index + 2}` : `Player ${index + 2}`,

      username,

    })),

  ];

};



const ParticipantsSettings = () => {

  const { tournament } = useOutletContext<TournamentOutletContext>();

  const [participants, setParticipants] = useState<ApiEventRegistration[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  const [actionId, setActionId] = useState<number | null>(null);
  const [pendingApproveId, setPendingApproveId] = useState<number | null>(null);
  const [pendingRejectId, setPendingRejectId] = useState<number | null>(null);



  const load = async () => {

    if (!/^\d+$/.test(tournament.id)) {

      setParticipants([]);

      setError(null);

      return;

    }



    try {

      setLoading(true);

      setError(null);

      const response = await getEventRegistrations(tournament.id);

      setParticipants(response.data);

      setExpandedTeamId(null);

    } catch (err) {

      setParticipants([]);

      setError(getApiErrorMessage(err, "Could not load registered teams."));

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    void load();

    return subscribeRegistrationsUpdated(() => {

      void load();

    });

  }, [tournament.id]);



  const handleApprove = async (registrationId: number) => {

    try {

      setActionId(registrationId);

      await approveRegistration(registrationId);

      notifyRegistrationsUpdated();

      await load();

      toast.success("Registration approved.");
      setPendingApproveId(null);

    } catch (err) {

      setError(getApiErrorMessage(err, "Could not approve registration."));
      toast.error(getApiErrorMessage(err, "Could not approve registration."));

    } finally {

      setActionId(null);

    }

  };



  const handleReject = async (registrationId: number) => {

    try {

      setActionId(registrationId);

      await rejectRegistration(registrationId);

      notifyRegistrationsUpdated();

      await load();

      toast.success("Registration rejected.");

      setPendingRejectId(null);

    } catch (err) {

      setError(getApiErrorMessage(err, "Could not reject registration."));
      toast.error(getApiErrorMessage(err, "Could not reject registration."));

    } finally {

      setActionId(null);

    }

  };



  const isDbTournament = /^\d+$/.test(tournament.id);



  return (

    <>

    <FormCard

      title="Participants"

      description="Review registrations and approve or reject pending teams."

    >

      {!isDbTournament ? (

        <p className="text-sm text-gray-500">

          Save this tournament to the server first — registered teams appear

          here once players sign up.

        </p>

      ) : loading ? (

        <p className="text-sm text-gray-500">Loading registered teams…</p>

      ) : error ? (

        <p className="text-sm text-red-600">{error}</p>

      ) : participants.length === 0 ? (

        <p className="text-sm text-gray-500">No teams registered yet.</p>

      ) : (

        <div className="border border-gray-200 rounded-lg overflow-hidden">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-left">

              <tr>

                <th className="px-4 py-3 font-semibold text-gray-600">Team</th>

                <th className="px-4 py-3 font-semibold text-gray-600">

                  Players

                </th>

                <th className="px-4 py-3 font-semibold text-gray-600">

                  Status

                </th>

                <th className="px-4 py-3 font-semibold text-gray-600">

                  Payment

                </th>

                <th className="px-4 py-3 font-semibold text-gray-600">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {participants.map((p) => {

                const label = statusLabel(p);

                const expanded = expandedTeamId === p.id;

                const members = teamMembers(p);

                const busy = actionId === p.id;

                const allowApprove = canApproveWithPayment({
                  registrationStatus: p.status,
                  paymentStatus: p.paymentStatus,
                  entry: p.entry ?? tournament.entryFee,
                });

                const unpaidBlocked =
                  p.status === "PENDING" &&
                  !allowApprove;



                return (

                  <Fragment key={p.id}>

                    <tr className="hover:bg-gray-50">

                      <td className="px-4 py-3">

                        <button

                          type="button"

                          onClick={() =>

                            setExpandedTeamId(expanded ? null : p.id)

                          }

                          className="flex items-start gap-2 text-left group"

                          aria-expanded={expanded}

                        >

                          <ChevronDown

                            size={16}

                            className={`mt-0.5 shrink-0 text-gray-400 transition-transform group-hover:text-gray-600 ${

                              expanded ? "rotate-180" : ""

                            }`}

                          />

                          <span>

                            <span className="font-medium text-gray-900 group-hover:text-blue-600">

                              {p.teamName}

                            </span>

                            {p.teamTag ? (

                              <span className="block text-xs text-gray-500 mt-0.5">

                                Tag: {p.teamTag}

                              </span>

                            ) : null}

                          </span>

                        </button>

                      </td>

                      <td className="px-4 py-3 text-gray-600">

                        {playerCount(p)}

                      </td>

                      <td className="px-4 py-3">

                        <span

                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusClass(p)}`}

                        >

                          {label}

                        </span>

                      </td>

                      <td className="px-4 py-3">

                        {paymentStatusLabel(p.paymentStatus) ? (

                          <span

                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paymentStatusClass(p.paymentStatus)}`}

                          >

                            {paymentStatusLabel(p.paymentStatus)}

                          </span>

                        ) : (

                          <span className="text-xs text-gray-400">—</span>

                        )}

                      </td>

                      <td className="px-4 py-3">

                        {p.status === "PENDING" ? (

                          <div className="flex flex-col gap-1 items-start">

                            <div className="flex gap-2">

                              <button

                                type="button"

                                disabled={busy || unpaidBlocked}

                                title={
                                  unpaidBlocked
                                    ? "Entry fee must be paid before approval"
                                    : undefined
                                }

                                onClick={() => setPendingApproveId(p.id)}

                                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 cursor-pointer"

                              >

                                Approve

                              </button>

                              <button

                                type="button"

                                disabled={busy}

                                onClick={() => setPendingRejectId(p.id)}

                                className="text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 cursor-pointer"

                              >

                                Reject

                              </button>

                            </div>

                            {unpaidBlocked ? (

                              <span className="text-[11px] text-amber-700">

                                Waiting for payment

                              </span>

                            ) : null}

                          </div>

                        ) : (

                          <span className="text-xs text-gray-400">—</span>

                        )}

                      </td>

                    </tr>

                    {expanded ? (

                      <tr>

                        <td colSpan={5} className="px-4 py-3 bg-gray-50">

                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">

                            Team roster

                          </p>

                          <ul className="grid gap-2 sm:grid-cols-2">

                            {members.map((member) => (

                              <li

                                key={`${member.role}-${member.username}`}

                                className="flex items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2"

                              >

                                <span className="text-xs font-medium text-gray-500">

                                  {member.role}

                                </span>

                                <span className="text-sm font-medium text-gray-900">

                                  {member.username}

                                </span>

                              </li>

                            ))}

                          </ul>

                        </td>

                      </tr>

                    ) : null}

                  </Fragment>

                );

              })}

            </tbody>

          </table>

        </div>

      )}

    </FormCard>

    <ConfirmModal
      open={pendingApproveId !== null}
      title="Approve registration?"
      message="Approve this team? They will be confirmed for the tournament."
      confirmLabel="Approve"
      busy={actionId !== null}
      onConfirm={() => {
        if (pendingApproveId !== null) void handleApprove(pendingApproveId);
      }}
      onCancel={() => {
        if (!actionId) setPendingApproveId(null);
      }}
    />

    <ConfirmModal
      open={pendingRejectId !== null}
      title="Reject registration?"
      message="Reject this team? They will need to register again if they want to join."
      confirmLabel="Reject"
      danger
      busy={actionId !== null}
      onConfirm={() => {
        if (pendingRejectId !== null) void handleReject(pendingRejectId);
      }}
      onCancel={() => {
        if (!actionId) setPendingRejectId(null);
      }}
    />

    </>

  );

};



export default ParticipantsSettings;


