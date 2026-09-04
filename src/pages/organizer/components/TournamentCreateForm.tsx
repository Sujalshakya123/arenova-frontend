import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, HelpCircle, User } from "lucide-react";
import { timezones } from "../organizerData";
import { usePlatformGames } from "../../../context/PlatformGamesContext";
import { resolveGameImage } from "../../../data/platformGames";
import { isPastIsoDate, localTodayIso } from "../../../utils/dateGuards";
import { isEntryFeeFundedPrizePool, PRIZE_SPLIT } from "../../../config/prizePoolConfig";
import {
  calculatePreviewEconomics,
  formatRsNpr,
} from "../../../utils/prizePoolEconomics";
import { parseRsNumber } from "../tournamentFormUtils";

const platformOptions = ["PC", "Mobile", "Playstation 4", "+ Others"];
const formatOptions = ["Solo", "Duo", "Squad"];

const inputClass =
  "w-full bg-[#f3f4f6] border border-[#e5e7eb] rounded-md px-3 py-2.5 text-sm text-[#2d3142] placeholder:text-[#6b7280] focus:outline-none focus:border-[#4ea8ff] focus:bg-white";

const labelClass = "text-sm font-medium text-[#374151]";
const hintClass = "text-xs text-[#4b5563]";

export type TournamentFormValues = {
  name: string;
  discipline: string;
  platforms: string[];
  startDate: string;
  startTime: string;
  format: string;
  size: string;
  participantType: "players" | "team";
  prizePool: string;
  prizeFirst?: string;
  prizeSecond?: string;
  prizeThird?: string;
  entryFee: string;
  timezone: string;
};

type Props = {
  onSubmit: (values: TournamentFormValues) => void | Promise<void>;
  submitLabel?: string;
  submitting?: boolean;
  onCancel?: () => void;
};

const TournamentCreateForm = ({
  onSubmit,
  submitLabel = "Create",
  submitting = false,
  onCancel,
}: Props) => {
  const { games: platformGames } = usePlatformGames();
  const availableGames = platformGames.filter((game) => game.status === "available");
  // Create-form discipline strip: only games live on the platform
  const disciplines = availableGames.map((game) => ({
    id: game.id,
    name: game.name,
    image: resolveGameImage(game),
  }));
  const searchRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [disciplineSearch, setDisciplineSearch] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [size, setSize] = useState("");
  const [participantType, setParticipantType] = useState<"players" | "team">(
    "players",
  );
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [format, setFormat] = useState("Squad");
  const [prizePool, setPrizePool] = useState("");
  const [prizeFirst, setPrizeFirst] = useState("");
  const [prizeSecond, setPrizeSecond] = useState("");
  const [prizeThird, setPrizeThird] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [timezone, setTimezone] = useState(timezones[0]);
  const [disciplineError, setDisciplineError] = useState("");
  const [dateError, setDateError] = useState("");
  const [prizeTouched, setPrizeTouched] = useState(false);
  const minStartDate = localTodayIso();
  const dynamicPrizePool = isEntryFeeFundedPrizePool();
  const previewEconomics = useMemo(() => {
    if (!dynamicPrizePool) return null;
    const fee = parseRsNumber(entryFee);
    const slots = Number(size) || 0;
    if (fee <= 0 || slots <= 0) return null;
    return calculatePreviewEconomics({ entryFeeNpr: fee, maxSlots: slots });
  }, [dynamicPrizePool, entryFee, size]);

  const filteredDisciplines = disciplines.filter((d) =>
    d.name.toLowerCase().includes(disciplineSearch.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePlatform = (p: string) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const selectDiscipline = (game: {
    id: string;
    name: string;
    image: string;
  }) => {
    setSelectedDiscipline(game);
    setDisciplineSearch(game.name);
    setSearchOpen(false);
    setDisciplineError("");
  };

  const syncPrizePoolFromSplit = (
    first: string,
    second: string,
    third: string,
  ) => {
    const total =
      (Number(first) || 0) + (Number(second) || 0) + (Number(third) || 0);
    if (total > 0 && !prizeTouched) {
      setPrizePool(String(total));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDiscipline) {
      setDisciplineError("Please select a discipline.");
      return;
    }
    if (!startDate || isPastIsoDate(startDate)) {
      setDateError("Start date cannot be before today.");
      return;
    }
    setDisciplineError("");
    setDateError("");
    onSubmit({
      name,
      discipline: selectedDiscipline.name,
      platforms,
      startDate,
      startTime,
      format,
      size,
      participantType,
      prizePool: dynamicPrizePool ? "0" : prizePool,
      prizeFirst: prizeFirst || undefined,
      prizeSecond: prizeSecond || undefined,
      prizeThird: prizeThird || undefined,
      entryFee,
      timezone,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-8">
        <label className={`block ${labelClass} mb-2`}>
          Tournament name (maximum 30 characters)
        </label>
        <input
          type="text"
          maxLength={30}
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="mb-8">
        <label className={`block ${labelClass} mb-3`}>Discipline</label>
        {disciplines.length === 0 ? (
          <p className={`${hintClass} text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2`}>
            No games are live yet. Ask a platform admin to mark a game as available
            before creating a tournament.
          </p>
        ) : (
        <>
        <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
          {disciplines.map((game) => (
            <button
              key={game.id}
              type="button"
              onClick={() => selectDiscipline(game)}
              title={game.name}
              className={`shrink-0 flex flex-col items-center gap-1.5 w-[72px] cursor-pointer transition ${
                selectedDiscipline?.id === game.id
                  ? "opacity-100"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <span
                className={`w-[64px] h-[64px] rounded-lg overflow-hidden border-2 ${
                  selectedDiscipline?.id === game.id
                    ? "border-[#4ea8ff]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover"
                />
              </span>
              <span className="text-[11px] text-[#374151] text-center leading-tight line-clamp-2 w-full">
                {game.name}
              </span>
            </button>
          ))}
        </div>

        <div className="relative" ref={searchRef}>
          <input
            type="text"
            value={disciplineSearch}
            onChange={(e) => {
              setDisciplineSearch(e.target.value);
              setSearchOpen(true);
              if (!e.target.value) setSelectedDiscipline(null);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search a discipline"
            className={`${inputClass} pr-10`}
          />
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#374151] pointer-events-none"
          />
          {searchOpen && filteredDisciplines.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-[#e5e7eb] rounded-md shadow-lg max-h-48 overflow-auto">
              {filteredDisciplines.map((game) => (
                <li key={game.id}>
                  <button
                    type="button"
                    onClick={() => selectDiscipline(game)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[#f5f6f8] cursor-pointer text-left text-[#2d3142]"
                  >
                    <img
                      src={game.image}
                      alt=""
                      className="w-7 h-7 rounded object-cover"
                    />
                    {game.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {disciplineError && (
          <p className="text-sm text-red-500 mt-2">{disciplineError}</p>
        )}
        </>
        )}
      </div>

      <div className="mb-8">
        <label className={`block ${labelClass} mb-3`}>Platform(s)</label>
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={`px-4 py-2 rounded-md text-sm transition cursor-pointer border ${
                platforms.includes(p)
                  ? "bg-[#4ea8ff] text-white border-[#4ea8ff]"
                  : "bg-[#f3f4f6] text-[#374151] border-[#e5e7eb] hover:border-[#c8cdd8]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div>
          <label className={`block ${labelClass} mb-2`}>Start date</label>
          <input
            type="date"
            required
            min={minStartDate}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setDateError("");
            }}
            className={inputClass}
          />
          {dateError && (
            <p className="text-xs text-rose-600 mt-1">{dateError}</p>
          )}
        </div>
        <div>
          <label className={`block ${labelClass} mb-2`}>Start time</label>
          <input
            type="time"
            required
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={`block ${labelClass} mb-2`}>Format</label>
          <div className="flex flex-wrap gap-2">
            {formatOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormat(option)}
                className={`px-4 py-2 rounded-md text-sm transition cursor-pointer border ${
                  format === option
                    ? "bg-[#4ea8ff] text-white border-[#4ea8ff]"
                    : "bg-[#f3f4f6] text-[#374151] border-[#e5e7eb] hover:border-[#c8cdd8]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-16 mb-8">
        <div>
          <label className={`flex items-center gap-1.5 ${labelClass} mb-2`}>
            Size
            <HelpCircle size={13} className="text-[#6b7280]" />
            <User size={13} className="text-[#6b7280]" />
            <span className={hintClass}>(max 32)</span>
          </label>
          <input
            type="number"
            min={1}
            max={32}
            required
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="25"
            className="w-[88px] bg-[#f3f4f6] border border-[#e5e7eb] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#4ea8ff] focus:bg-white"
          />
        </div>
        <div>
          <label className={`block ${labelClass} mb-3`}>Participants</label>
          <div className="flex items-center gap-6">
            {(["players", "team"] as const).map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer text-sm text-[#374151]"
              >
                <input
                  type="radio"
                  name="participants"
                  checked={participantType === type}
                  onChange={() => setParticipantType(type)}
                  className="w-4 h-4 accent-[#4ea8ff]"
                />
                {type === "team" ? "Teams" : "Players"}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {!dynamicPrizePool && (
          <div>
            <label className={`block ${labelClass} mb-2`}>
              Prize pool (Rs.)
            </label>
            <input
              type="number"
              min={0}
              required
              value={prizePool}
              onChange={(e) => {
                setPrizeTouched(true);
                setPrizePool(e.target.value);
              }}
              placeholder="20000"
              className={inputClass}
            />
          </div>
        )}
        <div className={dynamicPrizePool ? "sm:col-span-2" : ""}>
          <label className={`block ${labelClass} mb-2`}>
            Entry fee (Rs.)
          </label>
          <input
            type="number"
            min={0}
            required
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            placeholder="150"
            className={inputClass}
          />
          <p className={`${hintClass} mt-1.5`}>
            {dynamicPrizePool
              ? `Prize pool is ${PRIZE_SPLIT.prize}% of paid entry fees (70% players / 20% organizer / 10% platform).`
              : "Use 0 for free-to-play tournaments."}
          </p>
        </div>
      </div>

      {dynamicPrizePool && previewEconomics && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-sm font-semibold text-emerald-900 mb-2">
            Prize pool preview (if all slots pay)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-emerald-950">
            <p>
              Prize pool ({PRIZE_SPLIT.prize}%):{" "}
              <strong>{formatRsNpr(previewEconomics.prizePoolAtCapacityNpr)}</strong>
            </p>
            <p>
              1st / 2nd:{" "}
              <strong>
                {formatRsNpr(previewEconomics.prizeFirstNpr)} /{" "}
                {formatRsNpr(previewEconomics.prizeSecondNpr)}
              </strong>
            </p>
            <p>
              Organizer ({PRIZE_SPLIT.organizer}%):{" "}
              <strong>{formatRsNpr(previewEconomics.organizerShareNpr)}</strong>
            </p>
            <p>
              Platform ({PRIZE_SPLIT.platform}%):{" "}
              <strong>{formatRsNpr(previewEconomics.platformShareNpr)}</strong>
            </p>
          </div>
          <p className={`${hintClass} mt-2 text-emerald-800`}>
            Live pool updates as teams pay. With fewer teams, amounts scale down.
          </p>
        </div>
      )}

      {!dynamicPrizePool && (
      <div className="mb-8">
        <label className={`block ${labelClass} mb-2`}>
          Prize split (optional)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className={`block ${hintClass} mb-1`}>1st place</label>
            <input
              type="number"
              min={0}
              value={prizeFirst}
              onChange={(e) => {
                const next = e.target.value;
                setPrizeFirst(next);
                syncPrizePoolFromSplit(next, prizeSecond, prizeThird);
              }}
              placeholder="10000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block ${hintClass} mb-1`}>2nd place</label>
            <input
              type="number"
              min={0}
              value={prizeSecond}
              onChange={(e) => {
                const next = e.target.value;
                setPrizeSecond(next);
                syncPrizePoolFromSplit(prizeFirst, next, prizeThird);
              }}
              placeholder="6000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={`block ${hintClass} mb-1`}>3rd place</label>
            <input
              type="number"
              min={0}
              value={prizeThird}
              onChange={(e) => {
                const next = e.target.value;
                setPrizeThird(next);
                syncPrizePoolFromSplit(prizeFirst, prizeSecond, next);
              }}
              placeholder="4000"
              className={inputClass}
            />
          </div>
        </div>
        <p className={`${hintClass} mt-1.5`}>
          Filling place amounts auto-fills total prize pool until you edit the total yourself.
        </p>
      </div>
      )}

      <div className="mb-8">
        <label className={`flex items-center gap-1.5 ${labelClass} mb-2`}>
          Timezone
          <HelpCircle size={13} className="text-[#6b7280]" />
        </label>
        <div className="relative">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className={`${inputClass} appearance-none cursor-pointer pr-10`}
          >
            {timezones.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#374151] pointer-events-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-sm font-medium border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 cursor-pointer transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-10 py-2.5 text-sm font-medium bg-[#4caf50] hover:bg-[#43a047] text-white rounded-md transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default TournamentCreateForm;
