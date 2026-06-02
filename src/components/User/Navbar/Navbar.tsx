import logo from "../../../assets/Logo.png";
import { NavLink, useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navLinks = [
    { id: 1, name: "Home", path: "/" },
    { id: 2, name: "Tournaments", path: "/tournaments" },
    { id: 3, name: "Games", path: "/games" },
    { id: 4, name: "Contacts", path: "/contacts" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-[80px] py-[20px] relative text-white backdrop-blur-sm h-[10%]">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="w-[48px] h-[48px]" />
        <h2 className="font-bold text-[22px]">ARENOVA</h2>
      </div>

      {/* Nav Links */}
      <div>
        <ul className="flex gap-[60px] font-semibold text-[18px]">
          {navLinks.map((link) => (
            <li key={link.id}>
              <NavLink
                to={link.path}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "hover:text-blue-400 transition"
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Auth Section */}
      <div className="flex gap-[20px] items-center">
        {isAuthenticated && user ? (
          // ✅ Logged in — show profile
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition"
            >
              <FaUserCircle size={32} />
              <span className="font-medium">{user?.sub}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-[180px] bg-white text-black rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-sm">{user?.sub}</p>
                </div>
                <NavLink
                  to="/profile"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 text-black transition"
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/my-tournaments"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 text-black transition"
                >
                  My Tournaments
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // ✅ Not logged in — show buttons
          <>
            <NavLink to="/sign-up">
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-lg text-white cursor-pointer font-medium">
                Sign Up
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className="border border-blue-700 hover:bg-blue-700 hover:text-white px-8 py-2 rounded-lg text-blue-500 cursor-pointer font-medium">
                Login
              </button>
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
