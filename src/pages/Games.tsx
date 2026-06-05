import React from "react";
import Navbar from "../components/User/Navbar/Navbar";
import gamehero from "../assets/games-hero.jpg";
import { FiSearch } from "react-icons/fi";
import Footer from "../components/User/Navbar/Footer";
import Sidebar from "../components/Sidebar";

import { FaArrowRight } from "react-icons/fa";
import pubg from "../assets/PUBG.png";
import freeFire from "../assets/FREEFIRE.png";
import mobileLegends from "../assets/MLBB.png";
import valorant from "../assets/VALORANT.png";
import r6 from "../assets/R6.png";
import callOfDuty from "../assets/CODM.png";

const Games = () => {
  return (
    <>
      <div className="relative">
        <img
          src={gamehero}
          alt="Tournament Hero"
          className=" w-full h-[580px] object-cover opacity-90 "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col z-10">
          <Navbar />
          <div className="flex flex-col justify-center items-center mt-[50px] px-[80px] text-center">
            <div className=" items-center mb-2">
              <span className="text-white font-semibold text-xm tracking-[6px] px-2 py-1 ">
                Explore Games
              </span>
            </div>

            <h2 className="text-white font-bold text-6xl leading-tight mb-4 max-w-[800px]">
              Browse Games
            </h2>

            <p className="text-white text-sm max-w-[520px] mb-8">
              Explore the games that power the esports world. From rising
              favorites to legendary titles, every game has a competitive scene
              waiting for you.
            </p>

            <div>
              <div className="mt-5 px-[30px]">
                <div className="flex items-center border border-gray-400 rounded-lg overflow-hidden w-[400px] px-2 py-1 gap-2">
                  <div className="flex items-center gap-2 flex-1 px-3 py-2">
                    <FiSearch size={18} className="text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search games..."
                      className="bg-transparent text-sm text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                    />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 transition cursor-pointer rounded-md">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex bg-[#0B0F1A]">
        <Sidebar />

        <div>
          <div className="justify-between items-center px-4 mt-8 mb-6">
            <h2 className="text-white text-2xl font-bold">Availabe Games</h2>
            <p className="text-gray-400 text-sm mt-1">
              Secure your spot for next esports event.
            </p>
          </div>

          {/* Game Cards */}
          <div className="grid grid-cols-3 gap-[80px] mb-20">
            {/* PUBG Mobile */}
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={pubg}
                alt="PUBG Mobile"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">PUBG Mobile</p>
                <button className="flex items-center gap-1 text-gray-300 text-xs mt-1 hover:text-white cursor-pointer transition">
                  View Tournaments <FaArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Free Fire */}
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={freeFire}
                alt="Free Fire"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">Free Fire</p>
                <button className="flex items-center gap-1 text-gray-300 text-xs mt-1 hover:text-white cursor-pointer transition">
                  View Tournaments <FaArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Mobile Legends */}
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={mobileLegends}
                alt="Mobile Legends: Bang Bang"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">
                  Mobile Legends: Bang Bang
                </p>
                <button className="flex items-center gap-1 text-gray-300 text-xs mt-1 hover:text-white cursor-pointer transition">
                  View Tournaments <FaArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Valorant */}
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={valorant}
                alt="Valorant"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">Valorant</p>
                <button className="flex items-center gap-1 text-gray-300 text-xs mt-1 hover:text-white cursor-pointer transition">
                  View Tournaments <FaArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Rainbow Six Siege */}
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={r6}
                alt="Rainbow Six Siege"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">
                  Rainbow Six Siege
                </p>
                <button className="flex items-center gap-1 text-gray-300 text-xs mt-1 hover:text-white cursor-pointer transition">
                  View Tournaments <FaArrowRight size={10} />
                </button>
              </div>
            </div>

            {/* Call of Duty */}
            <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden cursor-pointer group">
              <img
                src={callOfDuty}
                alt="Call of Duty"
                className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-4 py-3">
                <p className="text-white text-sm font-semibold">Call of Duty</p>
                <button className="flex items-center gap-1 text-gray-300 text-xs mt-1 hover:text-white cursor-pointer transition">
                  View Tournaments <FaArrowRight size={10} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default Games;
