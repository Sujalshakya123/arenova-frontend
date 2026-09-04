import type { ElementType } from "react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  FiAward,
  FiBriefcase,
  FiCreditCard,
  FiGrid,
  FiHeadphones,
  FiLogOut,
  FiMonitor,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import titleLogo from "../../../assets/Title_LOGO.png";
import PanelSidebarLayout from "../../../components/PanelSidebarLayout";
import { useAuth } from "../../../context/AuthContext";
import {
  adminBottomNav,
  adminNav,
  adminPageTitles,
} from "../adminData";

const iconMap: Record<string, ElementType> = {
  Dashboard: FiGrid,
  Users: FiUsers,
  Organizers: FiBriefcase,
  Tournaments: FiAward,
  Payments: FiCreditCard,
  Games: FiMonitor,
  Support: FiHeadphones,
  Settings: FiSettings,
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userDTO, profileImage, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const pageTitle =
    adminPageTitles[location.pathname] ??
    (location.pathname.startsWith("/super-admin/settings")
      ? "Settings"
      : "Super Admin");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const sidebar = (
    <aside className="w-[260px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-full min-h-screen lg:min-h-0">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 overflow-hidden shrink-0">
          <img
            src={titleLogo}
            alt="Arenova"
            className="h-8 w-auto max-w-none object-left"
          />
        </div>
        <span className="font-bold text-[17px] tracking-tight text-gray-900">
          Super Admin
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {adminNav.map((item) => {
          const Icon = iconMap[item.label] ?? FiGrid;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/super-admin"}
              className={navLinkClass}
              onClick={() => setProfileOpen(false)}
            >
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {adminBottomNav.map((item) => {
          const Icon = iconMap[item.label] ?? FiSettings;
          return (
            <NavLink key={item.path} to={item.path} className={navLinkClass}>
              <Icon size={17} />
              {item.label}
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <FiLogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <PanelSidebarLayout sidebar={sidebar} className="bg-[#f5f6f8]">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
            <p className="text-sm text-gray-700 mt-0.5">
              Nepal esports platform administration
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/games")}
              className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg cursor-pointer"
            >
              View public site
            </button>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-semibold flex items-center justify-center overflow-hidden">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userDTO?.username?.charAt(0)?.toUpperCase() ?? "A"
                  )}
                </span>
                <span className="text-[15px] font-medium text-gray-800 hidden sm:block">
                  {userDTO?.username ?? "Admin"}
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/super-admin/settings");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 cursor-pointer"
                  >
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <Outlet />
      </main>
    </PanelSidebarLayout>
  );
};

export default AdminLayout;
