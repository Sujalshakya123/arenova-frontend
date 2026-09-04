import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router";
import { ExternalLink } from "lucide-react";
import FormCard, { Field, inputClass } from "../../components/FormCard";
import type { TournamentOutletContext } from "../../components/TournamentLayout";
import type { TournamentPublicPage } from "../../organizerData";
import { tournamentDetailPath } from "../../../tournaments-detail/resolveTournamentDetail";
import {
  formatEntryFee,
  formatRsAmount,
  parseRsNumber,
} from "../../tournamentFormUtils";
import { useAuth } from "../../../../context/AuthContext";
import { getUserById } from "../../../../services/userApi";
import { resolveHostedBy } from "../../../../utils/resolveHostedBy";
import { isPastIsoDate, localTodayIso } from "../../../../utils/dateGuards";

const linesToList = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const listToLines = (list?: string[]) => (list && list.length ? list.join("\n") : "");

const stagesToText = (stages?: TournamentPublicPage["scheduleStages"]) =>
  stages && stages.length
    ? stages.map((s) => `${s.stage} | ${s.date} | ${s.time}`).join("\n")
    : "";

const textToStages = (text: string) =>
  linesToList(text).map((line) => {
    const [stage = "Stage", date = "TBD", time = "16:00 NPT"] = line
      .split("|")
      .map((part) => part.trim());
    return { stage, date, time };
  });

const PublicPageSettings = () => {
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const { userDTO } = useAuth();
  const page = tournament.publicPage || {};
  const defaultHostedBy = resolveHostedBy(
    page.hostedBy,
    tournament.organizerName,
  );

  const [seriesBadge, setSeriesBadge] = useState(
    page.seriesBadge || `${tournament.game.toUpperCase()} SERIES`,
  );
  const [secondaryBadge, setSecondaryBadge] = useState(
    page.secondaryBadge ||
      `${tournament.platform} · ${tournament.format || "Squad"}`,
  );
  const [description, setDescription] = useState(
    page.description ||
      `${tournament.name} is hosted on Arenova. Register your squad and compete for ${tournament.prizePool || "prizes"}.`,
  );
  const [server, setServer] = useState(page.server || "Nepal");
  const [levelRestriction, setLevelRestriction] = useState(
    page.levelRestriction || "N/A",
  );
  const [endDate, setEndDate] = useState(page.endDate || "");
  const [registrationEnds, setRegistrationEnds] = useState(
    page.registrationEnds || "",
  );
  const [hostedBy, setHostedBy] = useState(defaultHostedBy);
  const [prizePool, setPrizePool] = useState(
    String(parseRsNumber(tournament.prizePool) || ""),
  );
  const [prizeFirst, setPrizeFirst] = useState(
    String(parseRsNumber(tournament.prizeFirst) || ""),
  );
  const [prizeSecond, setPrizeSecond] = useState(
    String(parseRsNumber(tournament.prizeSecond) || ""),
  );
  const [prizeThird, setPrizeThird] = useState(
    String(parseRsNumber(tournament.prizeThird) || ""),
  );
  const [entryFee, setEntryFee] = useState(
    String(parseRsNumber(tournament.entryFee) || "0"),
  );
  const [generalRulesText, setGeneralRulesText] = useState(
    listToLines(page.generalRules),
  );
  const [gameplayRulesText, setGameplayRulesText] = useState(
    listToLines(page.gameplayRules),
  );
  const [conductRulesText, setConductRulesText] = useState(
    listToLines(page.conductRules),
  );
  const [scheduleText, setScheduleText] = useState(
    stagesToText(page.scheduleStages),
  );
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganizerName = async () => {
      if (!userDTO?.id || String(userDTO.id).includes("@")) return;
      try {
        const response = await getUserById(userDTO.id);
        const profileName =
          response.data.fullName?.trim() ||
          response.data.username?.trim() ||
          undefined;
        if (!profileName) return;
        setHostedBy((current) =>
          resolveHostedBy(current, profileName),
        );
      } catch {
        // Keep tournament/API defaults if profile load fails.
      }
    };

    void loadOrganizerName();
  }, [userDTO?.id]);

  useEffect(() => {
    const next = tournament.publicPage || {};
    setSeriesBadge(next.seriesBadge || `${tournament.game.toUpperCase()} SERIES`);
    setSecondaryBadge(
      next.secondaryBadge ||
        `${tournament.platform} · ${tournament.format || "Squad"}`,
    );
    setDescription(
      next.description ||
        `${tournament.name} is hosted on Arenova. Register your squad and compete for ${tournament.prizePool || "prizes"}.`,
    );
    setServer(next.server || "Nepal");
    setLevelRestriction(next.levelRestriction || "N/A");
    setEndDate(next.endDate || "");
    setRegistrationEnds(next.registrationEnds || "");
    setHostedBy(resolveHostedBy(next.hostedBy, tournament.organizerName));
    setPrizePool(String(parseRsNumber(tournament.prizePool) || ""));
    setPrizeFirst(String(parseRsNumber(tournament.prizeFirst) || ""));
    setPrizeSecond(String(parseRsNumber(tournament.prizeSecond) || ""));
    setPrizeThird(String(parseRsNumber(tournament.prizeThird) || ""));
    setEntryFee(String(parseRsNumber(tournament.entryFee) || "0"));
    setGeneralRulesText(listToLines(next.generalRules));
    setGameplayRulesText(listToLines(next.gameplayRules));
    setConductRulesText(listToLines(next.conductRules));
    setScheduleText(stagesToText(next.scheduleStages));
  }, [tournament]);

  const today = localTodayIso();
  const existingEndDate = page.endDate || "";
  const existingRegistrationEnds = page.registrationEnds || "";
  const minEndFloor =
    existingEndDate && existingEndDate < today ? existingEndDate : today;
  const minEndDate =
    tournament.startDate && tournament.startDate > minEndFloor
      ? tournament.startDate
      : minEndFloor;
  const minRegistrationEnds =
    existingRegistrationEnds && existingRegistrationEnds < today
      ? existingRegistrationEnds
      : today;
  const maxRegistrationEnds =
    endDate && tournament.startDate
      ? endDate < tournament.startDate
        ? endDate
        : tournament.startDate
      : endDate || tournament.startDate || undefined;

  const handleSave = async () => {
    setSaveError(null);
    if (
      endDate &&
      isPastIsoDate(endDate) &&
      endDate !== existingEndDate
    ) {
      setSaveError("End date cannot be moved to a past date.");
      return;
    }
    if (
      registrationEnds &&
      isPastIsoDate(registrationEnds) &&
      registrationEnds !== existingRegistrationEnds
    ) {
      setSaveError("Registration end date cannot be moved to a past date.");
      return;
    }
    if (endDate && tournament.startDate && endDate < tournament.startDate) {
      setSaveError("End date cannot be before the tournament start date.");
      return;
    }
    if (
      registrationEnds &&
      tournament.startDate &&
      registrationEnds > tournament.startDate
    ) {
      setSaveError("Registration must end on or before the tournament start date.");
      return;
    }
    if (registrationEnds && endDate && registrationEnds > endDate) {
      setSaveError("Registration must end on or before the tournament end date.");
      return;
    }
    const publicPage: TournamentPublicPage = {
      seriesBadge: seriesBadge.trim(),
      secondaryBadge: secondaryBadge.trim(),
      description: description.trim(),
      server: server.trim(),
      levelRestriction: levelRestriction.trim(),
      endDate: endDate || undefined,
      registrationEnds: registrationEnds || undefined,
      hostedBy: hostedBy.trim(),
      generalRules: linesToList(generalRulesText),
      gameplayRules: linesToList(gameplayRulesText),
      conductRules: linesToList(conductRulesText),
      scheduleStages: textToStages(scheduleText),
    };

    try {
      await updateTournament({
        prizePool: formatRsAmount(prizePool || "0"),
        prizeFirst: prizeFirst ? formatRsAmount(prizeFirst) : "",
        prizeSecond: prizeSecond ? formatRsAmount(prizeSecond) : "",
        prizeThird: prizeThird ? formatRsAmount(prizeThird) : "",
        entryFee: formatEntryFee(entryFee || "0"),
        publicPage,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Could not save changes.",
      );
    }
  };

  const previewPath = tournamentDetailPath(tournament.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Public page</h2>
          <p className="text-sm text-gray-500 mt-1">
            Content shown on the player tournament detail page. Later this maps
            directly to your tournament API.
          </p>
        </div>
        <Link
          to={previewPath}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
        >
          Preview public page <ExternalLink size={14} />
        </Link>
      </div>

      <FormCard
        title="Hero & description"
        description="Badges, title context, and about text on the detail page."
      >
        <Field label="Series badge">
          <input
            type="text"
            value={seriesBadge}
            onChange={(e) => setSeriesBadge(e.target.value)}
            className={inputClass}
            placeholder="PUBG MOBILE PRO-SERIES"
          />
        </Field>
        <Field label="Secondary badge">
          <input
            type="text"
            value={secondaryBadge}
            onChange={(e) => setSecondaryBadge(e.target.value)}
            className={inputClass}
            placeholder="Battle Royale · Squad"
          />
        </Field>
        <Field label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="Hosted by">
          <input
            type="text"
            value={hostedBy}
            onChange={(e) => setHostedBy(e.target.value)}
            className={inputClass}
            placeholder="Your organization name"
          />
        </Field>
      </FormCard>

      <FormCard
        title="Info cards"
        description="Stats shown in overview and the registration sidebar."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prize pool (Rs.)">
            <input
              type="number"
              min={0}
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Entry fee (Rs.)">
            <input
              type="number"
              min={0}
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="1st place (Rs.)">
            <input
              type="number"
              min={0}
              value={prizeFirst}
              onChange={(e) => setPrizeFirst(e.target.value)}
              className={inputClass}
              placeholder="Optional"
            />
          </Field>
          <Field label="2nd place (Rs.)">
            <input
              type="number"
              min={0}
              value={prizeSecond}
              onChange={(e) => setPrizeSecond(e.target.value)}
              className={inputClass}
              placeholder="Optional"
            />
          </Field>
          <Field label="3rd place (Rs.)">
            <input
              type="number"
              min={0}
              value={prizeThird}
              onChange={(e) => setPrizeThird(e.target.value)}
              className={inputClass}
              placeholder="Optional"
            />
          </Field>
          <Field label="Server">
            <input
              type="text"
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Level restriction">
            <input
              type="text"
              value={levelRestriction}
              onChange={(e) => setLevelRestriction(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              min={minEndDate}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Registration ends">
            <input
              type="date"
              min={minRegistrationEnds}
              max={maxRegistrationEnds}
              value={registrationEnds}
              onChange={(e) => setRegistrationEnds(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </FormCard>

      <FormCard
        title="Rules"
        description="One rule per line. Empty sections keep the default Arenova rules."
      >
        <Field label="General rules">
          <textarea
            value={generalRulesText}
            onChange={(e) => setGeneralRulesText(e.target.value)}
            rows={4}
            placeholder="All participants must be 16 years of age or older."
            className={inputClass}
          />
        </Field>
        <Field label="Gameplay rules">
          <textarea
            value={gameplayRulesText}
            onChange={(e) => setGameplayRulesText(e.target.value)}
            rows={4}
            className={inputClass}
          />
        </Field>
        <Field label="Conduct rules">
          <textarea
            value={conductRulesText}
            onChange={(e) => setConductRulesText(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
      </FormCard>

      <FormCard
        title="Schedule"
        description="One stage per line as: Stage name | Date | Time"
      >
        <Field label="Stages">
          <textarea
            value={scheduleText}
            onChange={(e) => setScheduleText(e.target.value)}
            rows={5}
            placeholder={"Group Stage - Round 1 | 10 Aug 2026 | 16:00 NPT\nQuarter-Finals | 13 Aug 2026 | 16:00 NPT"}
            className={inputClass}
          />
        </Field>
      </FormCard>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          Save public page
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium">Saved</span>
        )}
        {saveError && (
          <span className="text-sm text-red-600 font-medium">{saveError}</span>
        )}
      </div>
    </div>
  );
};

export default PublicPageSettings;
