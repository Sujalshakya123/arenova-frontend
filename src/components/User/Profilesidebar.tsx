import {
  IoGridOutline,
  IoLogOutOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    icon: IoGridOutline,
    path: "/dashboard",
  },
  {
    name: "Profile",
    icon: IoPersonOutline,
    path: "/profile",
  },
  {
    name: "Notifications",
    icon: IoNotificationsOutline,
    path: "/notifications",
  },
  {
    name: "My Tournaments",
    icon: IoTrophyOutline,
    path: "/my-tournaments",
  },
  {
    name: "Security",
    icon: IoShieldOutline,
    path: "/changepass",
  },
];

const Profilesidebar = () => {
  const { logout, userDTO, profileImage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = userDTO?.username || "Player";
  const displayEmail = userDTO?.email || "Sign in to sync your account";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 bg-[#0B0F1A] border-r border-white/5 flex flex-col">
      {/* User card */}
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
          {profileImage ? (
            <img
              src={profileImage}
              alt={displayName}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/40"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg ring-2 ring-blue-500/40">
              {initial}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">
              {displayName}
            </p>
            <p className="text-gray-500 text-sm truncate">{displayEmail}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
          Account
        </p>
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition ${
                          isActive
                            ? "bg-white/15"
                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                        }`}
                      >
                        <Icon size={17} />
                      </span>
                      {item.name}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-white hover:bg-red-600/90 transition-all duration-200 cursor-pointer"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10">
            <IoLogOutOutline size={17} />
          </span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Profilesidebar;
