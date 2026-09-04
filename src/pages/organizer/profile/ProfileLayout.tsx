import { NavLink, Outlet } from "react-router";

const profileTabs = [
  { label: "General", path: "/organizer/profile" },
  { label: "Email", path: "/organizer/profile/email" },
  { label: "Password", path: "/organizer/profile/password" },
];

const ProfileLayout = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Organizer profile
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage your organizer account settings.
      </p>

      <div className="flex gap-6 mb-8 border-b border-gray-200">
        {profileTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === "/organizer/profile"}
            className={({ isActive }) =>
              `pb-3 text-sm font-semibold border-b-2 -mb-px transition ${
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

export default ProfileLayout;
