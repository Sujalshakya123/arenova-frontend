import React from "react";
import {
  IoLogOutOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoTrophyOutline,
} from "react-icons/io5";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Profilesidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const content = [
    { name: "Profile", icon: <IoPersonOutline size={20} />, path: "/profile" },
    {
      name: "My Tournaments",
      icon: <IoTrophyOutline size={20} />,
      path: "/my-tournaments",
    },
    {
      name: "Security",
      icon: <IoShieldOutline size={20} />,
      path: "/changepass",
    },
  ];

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="bg-[#0B0F1A] w-[360px] min-h-screen">
          <div>
            <div className="px-[30px]">
              <h2 className="mt-10 mb-4 font-medium text-gray-300 flex items-center">
                Profile Menu
              </h2>
              <div>
                <ul className=" text-gray-600 font-semibold mt-4 flex flex-col gap-3 cursor-pointer">
                  {content.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold ${
                            isActive
                              ? "bg-[#1e2535] text-white"
                              : "text-gray-400 hover:text-white hover:bg-[#1e2535]"
                          }`
                        }
                      >
                        {item.icon}
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg transition font-semibold text-red-400 hover:text-white hover:bg-red-600 w-full text-left cursor-pointer"
                    >
                      <IoLogOutOutline size={20} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profilesidebar;
