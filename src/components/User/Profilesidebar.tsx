import React from "react";
import {
  IoLogOutOutline,
  IoPersonOutline,
  IoShieldOutline,
  IoTrophyOutline,
} from "react-icons/io5";

const Profilesidebar = () => {
  const content = [
    { name: "Profile", icon: <IoPersonOutline size={20} /> },
    { name: "My Tournaments", icon: <IoTrophyOutline size={20} /> },
    { name: "Security", icon: <IoShieldOutline size={20} /> },
    { name: "Logout", icon: <IoLogOutOutline size={20} /> },
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
                    <li className="flex items-center gap-2 text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1e2535] rounded-lg mb-1 transition">
                      {item.icon}
                      {item.name}
                    </li>
                  ))}
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
