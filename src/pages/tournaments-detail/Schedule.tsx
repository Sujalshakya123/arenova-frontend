import { CalendarClock } from "lucide-react";
import DetailBox from "./components/DetailBox";
import { useTournamentDetail } from "./TournamentDetailContext";
import { isUserShellDark, userShell } from "../../theme/userShellTheme";

const Schedule = () => {
  const { scheduleStages } = useTournamentDetail();
  const dark = isUserShellDark;

  return (
    <DetailBox
      title="Tournament Schedule"
      icon={
        <CalendarClock
          size={20}
          className={dark ? "text-gray-400" : "text-gray-600"}
        />
      }
    >
      <div className="relative pl-6">
        <div
          className={`absolute left-[7px] top-2 bottom-2 w-0.5 ${
            dark ? "bg-blue-500/30" : "bg-blue-200"
          }`}
        />
        {scheduleStages.map((item, index) => (
          <div
            key={item.stage}
            className={`relative flex gap-4 ${index !== scheduleStages.length - 1 ? "pb-5" : ""}`}
          >
            <div
              className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 ${
                dark ? "border-[#111827] ring-2 ring-blue-500/30" : "border-white ring-2 ring-blue-200"
              }`}
            />
            <div>
              <p className={userShell.strongSm}>{item.stage}</p>
              <p className={`${userShell.mutedXs} mt-0.5`}>
                {item.date} · {item.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </DetailBox>
  );
};

export default Schedule;
