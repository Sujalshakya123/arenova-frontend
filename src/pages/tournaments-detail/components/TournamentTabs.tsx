import { NavLink, useSearchParams } from "react-router";
import { detailTabClass, userShell } from "../../../theme/userShellTheme";
import { detailSearch } from "../resolveTournamentDetail";

const tabs = [
  { label: "Overview", path: "/tournaments-detail", end: true },
  { label: "Rules", path: "/tournaments-detail/rules", end: false },
  { label: "Schedule", path: "/tournaments-detail/schedule", end: false },
  { label: "Chat", path: "/tournaments-detail/chat", end: false, requiresId: true },
];

const TournamentTabs = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const search = detailSearch(id);

  return (
    <div className={`flex gap-6 ${userShell.tabBorder} mb-6 overflow-x-auto`}>
      {tabs
        .filter((tab) => !tab.requiresId || (id && /^\d+$/.test(id)))
        .map((tab) => (
          <NavLink
            key={tab.path}
            to={`${tab.path}${search}`}
            end={tab.end}
            className={({ isActive }) => detailTabClass(isActive)}
          >
            {tab.label}
          </NavLink>
        ))}
    </div>
  );
};

export default TournamentTabs;
