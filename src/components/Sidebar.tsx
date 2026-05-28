import React from "react";
import { FiSearch } from "react-icons/fi";
import { SlidersHorizontal } from "lucide-react";

const Sidebar = () => {
  const games = [
    { name: "All Games" },
    { name: "PUBG " },
    { name: "Fire Fire" },
    { name: "Valorant" },
    { name: "MLBB" },
    { name: "CS 2" },
  ];

  const status = [{ name: "ALL" }, { name: "Upcoming" }, { name: "Completed" }];
  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="bg-[#0B0F1A] w-[360px] min-h-screen">
          <div className="mt-5 px-[30px] font-semibold text-gray-500 text-l">
            <button className="flex justify items-center gap-2 border-3 border-gray-500 w-[302px] h-[40px] px-2 rounded-lg">
              <FiSearch size={20} /> Search...
            </button>
          </div>

          {/* Sidebar content */}
          <div className="mt-6 px-[30px]">
            <h2 className="mb-2 font-medium text-gray-300">Game Title</h2>
            <div>
              <ul className=" text-gray-200 font-semibold mt-4 flex flex-col gap-3 cursor-pointer ">
                {games.map((item) => (
                  <li className="text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1e2535] rounded-lg mb-1 transition">
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="px-[30px]">
              <h2 className="mt-10 mb-2 font-medium text-gray-300 flex items-center gap-3">
                <SlidersHorizontal size={20} /> Status
              </h2>
              <div>
                <ul className=" text-gray-600 font-semibold mt-4 flex flex-col gap-3 cursor-pointer">
                  {status.map((item) => (
                    <li className="text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-[#1e2535] rounded-lg mb-1 transition">
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

export default Sidebar;
