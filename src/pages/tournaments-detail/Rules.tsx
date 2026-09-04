import { ScrollText } from "lucide-react";
import DetailBox from "./components/DetailBox";
import { useTournamentDetail } from "./TournamentDetailContext";
import { isUserShellDark, userShell } from "../../theme/userShellTheme";

const Rules = () => {
  const { generalRules, gameplayRules, conductRules } = useTournamentDetail();
  const dark = isUserShellDark;

  const ruleSections = [
    { title: "General Rules", rules: generalRules },
    { title: "Gameplay", rules: gameplayRules },
    { title: "Conduct", rules: conductRules },
  ];

  return (
    <DetailBox
      title="Tournament Rules"
      icon={
        <ScrollText
          size={20}
          className={dark ? "text-gray-400" : "text-gray-600"}
        />
      }
    >
      <div className="space-y-6">
        {ruleSections.map((section, index) => (
          <div
            key={section.title}
            className={index > 0 ? `pt-6 border-t ${userShell.detailBorder}` : ""}
          >
            <h3 className={`${userShell.h2Base} mb-3`}>{section.title}</h3>
            <ul className="space-y-2.5">
              {section.rules.map((rule) => (
                <li key={rule} className={`${userShell.body} flex gap-2.5`}>
                  <span className="text-blue-400 mt-1 shrink-0">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </DetailBox>
  );
};

export default Rules;
