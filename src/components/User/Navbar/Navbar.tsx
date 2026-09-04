import defaultLogo from "../../../assets/Test_LOGO.png";
import { NavLink, useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { Bell, Menu, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { normalizeRole } from "../../../auth/roles";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  countUnread,
  loadNotificationsForUser,
  markNotificationRead,
  type NotificationItem,
} from "../../../data/notificationStore";

const PREVIEW_LIMIT = 4;

type NavbarProps = {
  /** overlay = white text for dark heroes (default). solid = dark text on light bar. */
  variant?: "overlay" | "solid";
  /** Optional logo override (used for homepage logo tests). */
  logoSrc?: string;
};

const Navbar = ({ variant = "overlay", logoSrc = defaultLogo }: NavbarProps) => {
  const solid = variant === "solid";
  const { userDTO, isAuthenticated, logout, profileImage } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [previewItems, setPreviewItems] = useState<NotificationItem[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const displayName =
    userDTO?.username?.trim() ||
    userDTO?.email?.split("@")[0] ||
    "User";

  const navLinks = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "Tournaments", path: "/tournaments" },
    { id: 3, name: "Games", path: "/games" },
    { id: 4, name: "Contacts", path: "/contacts" },
    ...(normalizeRole(userDTO?.role) === "admin"
      ? [{ id: 5, name: "Admin", path: "/super-admin" }]
      : normalizeRole(userDTO?.role) === "organizer"
        ? [{ id: 5, name: "Organizer", path: "/organizer" }]
        : []),
  ];

  useEffect(() => {
    const refreshUnread = async () => {
      const items = await loadNotificationsForUser(isAuthenticated);
      setUnreadCount(countUnread(items));
      setPreviewItems(items.filter((item) => !item.archived).slice(0, PREVIEW_LIMIT));
    };
    void refreshUnread();
    window.addEventListener("arenova-notifications-updated", refreshUnread);
    window.addEventListener("storage", refreshUnread);
    return () => {
      window.removeEventListener("arenova-notifications-updated", refreshUnread);
      window.removeEventListener("storage", refreshUnread);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        notifRef.current?.contains(target)
      ) {
        return;
      }
      setDropdownOpen(false);
      setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const openNotifications = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    setNotifOpen((open) => {
      if (!open) {
        void loadNotificationsForUser(isAuthenticated).then((items) => {
          setPreviewItems(items.filter((item) => !item.archived).slice(0, PREVIEW_LIMIT));
        });
      }
      return !open;
    });
  };

  const handlePreviewClick = (item: NotificationItem) => {
    if (item.unread) void markNotificationRead(item.id);
    setPreviewItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
    );
    setUnreadCount((count) => Math.max(0, count - (item.unread ? 1 : 0)));
  };

  const goToAllNotifications = () => {
    setNotifOpen(false);
    navigate("/notifications");
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? solid
        ? "text-blue-600 border-b-2 border-blue-600 pb-1"
        : "text-blue-400 border-b-2 border-blue-400 pb-1"
      : solid
        ? "text-gray-700 hover:text-blue-600 transition"
        : "hover:text-blue-400 transition";

  const iconBtnClass = solid
    ? "relative p-1.5 text-gray-700 hover:text-blue-600 transition cursor-pointer"
    : "relative p-1.5 text-white/90 hover:text-blue-400 transition cursor-pointer";

  const menuBtnClass = solid
    ? "sm:hidden p-2 text-gray-700 hover:text-blue-600 cursor-pointer"
    : "sm:hidden p-2 text-white/90 hover:text-blue-400 cursor-pointer";

  const signUpBtnClass = solid
    ? "rounded-xl bg-blue-600 px-5 sm:px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 hover:shadow-blue-500/35 cursor-pointer"
    : "rounded-xl bg-blue-600 px-5 sm:px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-500/40 cursor-pointer";

  const loginBtnClass = solid
    ? "rounded-xl border border-gray-300 bg-white px-5 sm:px-7 py-2.5 text-sm font-semibold text-gray-700 shadow-lg shadow-blue-500/15 transition hover:border-gray-400 hover:bg-gray-50 hover:shadow-blue-500/25 cursor-pointer"
    : "rounded-xl border border-white/30 bg-white/5 px-5 sm:px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-400/25 backdrop-blur-sm transition hover:border-cyan-300/50 hover:bg-white/10 hover:shadow-cyan-300/40 cursor-pointer";

  const mobileSignUpBtnClass =
    "w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 hover:shadow-blue-500/40 cursor-pointer";

  const mobileLoginBtnClass =
    "w-full rounded-xl border border-white/30 bg-white/5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-400/25 backdrop-blur-sm transition hover:border-cyan-300/50 hover:bg-white/10 hover:shadow-cyan-300/40 cursor-pointer";

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 text-base font-semibold border-b border-white/10 ${
      isActive ? "text-blue-400" : "text-white hover:text-blue-400"
    }`;

  const mobileMenu =
    mobileOpen &&
    createPortal(
      <>
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 bg-black/60 z-[200] xl:hidden cursor-default"
          onClick={closeMobile}
        />
        <div className="fixed inset-y-0 right-0 w-[min(320px,100vw)] bg-[#0B0F1A] z-[210] xl:hidden flex flex-col shadow-2xl border-l border-white/10">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <span className="font-semibold text-white">Menu</span>
            <button
              type="button"
              onClick={closeMobile}
              className="p-2 text-white/80 hover:text-white cursor-pointer"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="mb-6">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <NavLink to={link.path} className={mobileNavLinkClass} onClick={closeMobile}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {isAuthenticated && userDTO ? (
              <div className="space-y-1 border-t border-white/10 pt-4">
                <div className="flex items-center gap-3 mb-4 px-1">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={40} />
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{displayName}</p>
                    <p className="text-sm text-gray-500 truncate">{userDTO.email}</p>
                  </div>
                </div>
                {[
                  { to: "/dashboard", label: "Dashboard" },
                  { to: "/profile", label: "My Profile" },
                  { to: "/notifications", label: "Notifications" },
                  { to: "/my-tournaments", label: "My Tournaments" },
                ].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMobile}
                    className="block py-2.5 text-sm text-gray-300 hover:text-blue-400"
                  >
                    {item.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left py-2.5 text-sm text-red-400 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                <NavLink to="/login" onClick={closeMobile}>
                  <button type="button" className={mobileLoginBtnClass}>
                    Login
                  </button>
                </NavLink>
                <NavLink to="/sign-up" onClick={closeMobile}>
                  <button type="button" className={mobileSignUpBtnClass}>
                    Sign Up
                  </button>
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </>,
      document.body,
    );

  return (
    <nav
      className={`flex shrink-0 justify-between items-center px-4 sm:px-6 xl:px-[80px] py-4 xl:py-[20px] relative gap-3 ${
        solid
          ? "text-gray-900 bg-white border-b border-gray-200 shadow-sm"
          : "text-white backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center min-w-0">
        <img
          src={logoSrc}
          alt="Arenova logo"
          className="w-10 h-10 xl:w-[48px] xl:h-[48px] object-contain shrink-0"
        />
        <h2
          className={`font-bold text-lg xl:text-[22px] truncate ${
            solid ? "text-gray-900" : ""
          }`}
        >
          ARENOVA
        </h2>
      </div>

      <div className="hidden xl:block">
        <ul className="flex gap-[60px] font-semibold text-[18px]">
          {navLinks.map((link) => (
            <li key={link.id}>
              <NavLink to={link.path} className={navLinkClass}>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2 sm:gap-4 items-center shrink-0">
        {isAuthenticated && userDTO ? (
          <>
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={openNotifications}
                className={iconBtnClass}
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                <Bell size={22} strokeWidth={1.75} />
                {unreadCount > 0 && (
                  <span
                    className={`absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ${
                      solid ? "ring-white" : "ring-[#0B0F1A]/40"
                    }`}
                  />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-[min(320px,calc(100vw-2rem))] bg-white text-gray-900 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-sm">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-xs font-semibold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <ul className="max-h-[280px] overflow-y-auto">
                    {previewItems.length === 0 ? (
                      <li className="px-4 py-8 text-center text-sm text-gray-400">
                        No notifications yet.
                      </li>
                    ) : (
                      previewItems.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handlePreviewClick(item)}
                            className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer ${
                              item.unread ? "bg-blue-50/40" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {item.unread && (
                                <span className="mt-1.5 w-2 h-2 shrink-0 rounded-full bg-blue-500" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.title || "Notification"}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {item.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {item.time}
                                </p>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>

                  <div className="p-3 border-t border-gray-100 bg-gray-50">
                    <button
                      type="button"
                      onClick={goToAllNotifications}
                      className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    >
                      Show all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(false);
                  setDropdownOpen(!dropdownOpen);
                }}
                className={`flex items-center gap-2.5 cursor-pointer transition ${
                  solid ? "hover:text-blue-600 text-gray-800" : "hover:text-blue-400"
                }`}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className={`w-8 h-8 rounded-full object-cover border-2 ${
                      solid ? "border-gray-200" : "border-white/40"
                    }`}
                  />
                ) : (
                  <FaUserCircle size={32} className={solid ? "text-gray-600" : undefined} />
                )}
                <span className="font-medium text-[15px] hidden lg:inline">
                  {displayName}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-[200px] bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-sm text-gray-900">{displayName}</p>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{userDTO.email}</p>
                  </div>
                  <NavLink
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-black transition"
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-black transition"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/notifications"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-black transition"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs font-semibold bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                  <NavLink
                    to="/my-tournaments"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 text-black transition"
                  >
                    My Tournaments
                  </NavLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setNotifOpen(false);
                setMobileOpen(true);
              }}
              className={menuBtnClass}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </>
        ) : (
          <>
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <NavLink to="/login">
                <button type="button" className={loginBtnClass}>
                  Login
                </button>
              </NavLink>
              <NavLink to="/sign-up">
                <button type="button" className={signUpBtnClass}>
                  Sign Up
                </button>
              </NavLink>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={menuBtnClass}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </>
        )}
      </div>

      {mobileMenu}
    </nav>
  );
};

export default Navbar;
