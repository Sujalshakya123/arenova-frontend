import { NavLink, Outlet, useParams } from "react-router";

const FfaLayout = () => {
  const { tournamentId } = useParams();
  const base = `/organizer/tournaments/${tournamentId}/structure/ffa`;

  const tabs = [
    { label: "General", path: "general" },
    { label: "Advance", path: "advance" },
  ];

  return (
    <div>
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`${base}/${tab.path}`}
            className={({ isActive }) =>
              `pb-2 text-sm font-semibold border-b-2 -mb-px transition ${
                isActive
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-800"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default FfaLayout;
