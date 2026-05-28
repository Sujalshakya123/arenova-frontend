import React from "react";
import Navbar from "../components/User/Navbar/Navbar";
import tourhero from "../assets/download.jpg";
import Sidebar from "../components/Sidebar";
import Footer from "../components/User/Navbar/Footer";
import { FaUsers } from "react-icons/fa";

import pubg from "../assets/Cards/PUBG.jpg";
import freefire from "../assets/Cards/FREEFIRE.jpg";
import mlbb from "../assets/Cards/MLBB.jpg";
import valorant from "../assets/Cards/VALORANT2.jpg";
import codm from "../assets/Cards//CODM.jpg";
import r6 from "../assets/Cards/RAINBOW SIX.jpg";

const Tournaments = () => {
  return (
    <>
      <div className="relative">
        <img
          src={tourhero}
          alt="Tournament Hero"
          className=" w-full h-[580px] object-cover opacity-80 "
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col z-10">
          <Navbar />
          <div className="flex flex-col justify-center items-center mt-[50px] px-[80px] text-center">
            <div className=" items-center mb-2">
              <span className="text-white font-semibold text-xm tracking-[6px] px-2 py-1 ">
                COMPETE · CONQUER · CLAIM
              </span>
            </div>

            <h2 className="text-white font-bold text-6xl leading-tight mb-4 max-w-[800px]">
              CREATE YOUR TEAM AND <br /> DOINATE THE ARENA
            </h2>

            <p className="text-white text-sm max-w-[520px] mb-8">
              Join competitive esports tournaments, create your squad, battle
              against players, and rise to the top with Arenova.
            </p>
          </div>
        </div>
      </div>

      <div className="flex bg-[#0B0F1A]">
        <Sidebar />

        <div className="flex-1 px-[80px]">
          <div className="justify-between items-center px-4 mt-8 mb-6">
            <h2 className="text-white text-2xl font-bold">
              Active Tournaments
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Secure your spot for next esports event.
            </p>
          </div>

          {/* Tournament Cards */}
          <div className="grid grid-cols-3 gap-8 mb-20 mt-8 px-4">
            {/* PUBG Mobile */}
            <div className="bg-[#111827] rounded-xl overflow-hidden  max-w-[400px]">
              <img
                src={pubg}
                alt="PUBG Mobile"
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-600  mb-2">
                  <span>29 April,2026 - 16:00 - Squad </span>
                  <span className="flex item-center gap-1">
                    <FaUsers size={18} /> 16/25
                  </span>
                </div>
                <h3 className="text-black font-semibold text-sm mb-3">
                  Nepal PUBG Pro League
                </h3>
                <div className="flex gap-26  mb-4">
                  <div>
                    <p className="text-gray-500 text-xm mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      RS. 20,000
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xm mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">RS. 150</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold   py-2 rounded-lg cursor-pointer transition">
                  Register
                </button>
              </div>
            </div>

            {/* Free Fire */}
            <div className="bg-[#111827] rounded-xl overflow-hidden  max-w-[400px]">
              <img
                src={freefire}
                alt="Free Fire"
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-600  mb-2">
                  <span>29 April,2026 - 16:00 - Squad </span>
                  <span className="flex item-center gap-1">
                    <FaUsers size={18} /> 6/12
                  </span>
                </div>
                <h3 className="text-black font-semibold text-sm mb-3">
                  FreeFire World Series - Nepal Qualifier
                </h3>
                <div className="flex gap-26  mb-4">
                  <div>
                    <p className="text-gray-500 text-xm mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      RS. 20,000
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xm mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">RS. 150</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold   py-2 rounded-lg cursor-pointer transition">
                  Register
                </button>
              </div>
            </div>

            {/* MLBB */}
            <div className="bg-[#111827] rounded-xl overflow-hidden  max-w-[400px]">
              <img
                src={mlbb}
                alt="MLBB"
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-600  mb-2">
                  <span>29 April,2026 - 16:00 - Squad </span>
                  <span className="flex item-center gap-1">
                    <FaUsers size={18} /> 6/15
                  </span>
                </div>
                <h3 className="text-black font-semibold text-sm mb-3">
                  MLBB Pro Series - Nepal Qualifier
                </h3>
                <div className="flex gap-26  mb-4">
                  <div>
                    <p className="text-gray-500 text-xm mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      RS. 20,000
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xm mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">RS. 150</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold   py-2 rounded-lg cursor-pointer transition">
                  Register
                </button>
              </div>
            </div>

            {/*  Valorant */}
            <div className="bg-[#111827] rounded-xl overflow-hidden  max-w-[400px]">
              <img
                src={valorant}
                alt="Valorant"
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-600  mb-2">
                  <span>29 April,2026 - 16:00 - Squad </span>
                  <span className="flex item-center gap-1">
                    <FaUsers size={18} /> 16/20
                  </span>
                </div>
                <h3 className="text-black font-semibold text-sm mb-3">
                  Valorant Champions Tour - Nepal Qualifier
                </h3>
                <div className="flex gap-26  mb-4">
                  <div>
                    <p className="text-gray-500 text-xm mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      RS. 20,000
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xm mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">RS. 150</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold   py-2 rounded-lg cursor-pointer transition">
                  Register
                </button>
              </div>
            </div>

            {/* CODM */}
            <div className="bg-[#111827] rounded-xl overflow-hidden  max-w-[400px]">
              <img
                src={codm}
                alt="CODM"
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-600  mb-2">
                  <span>29 April,2026 - 16:00 - Squad </span>
                  <span className="flex item-center gap-1">
                    <FaUsers size={18} /> 16/25
                  </span>
                </div>
                <h3 className="text-black font-semibold text-sm mb-3">
                  CODM Nepal Qualifier
                </h3>
                <div className="flex gap-26  mb-4">
                  <div>
                    <p className="text-gray-500 text-xm mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      RS. 20,000
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xm mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">RS. 150</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold   py-2 rounded-lg cursor-pointer transition">
                  Register
                </button>
              </div>
            </div>

            {/* R6 */}
            <div className="bg-[#111827] rounded-xl overflow-hidden  max-w-[400px]">
              <img
                src={r6}
                alt="RAINBOW SIX SIEGE"
                className="w-full h-[160px] object-cover"
              />
              <div className="bg-white px-3 pb-4 pt-3">
                <div className="flex justify-between items-center text-sm text-gray-600  mb-2">
                  <span>29 April,2026 - 16:00 - Squad </span>
                  <span className="flex item-center gap-1">
                    <FaUsers size={18} /> 16/25
                  </span>
                </div>
                <h3 className="text-black font-semibold text-sm mb-3">
                  Rainbow Six Siege Nepal Qualifier
                </h3>
                <div className="flex gap-26  mb-4">
                  <div>
                    <p className="text-gray-500 text-xm mb-1">PRIZE POOL</p>
                    <p className="text-black text-sm font-semibold">
                      RS. 20,000
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500 text-xm mb-1">ENTRY FEE</p>
                    <p className="text-black text-sm font-semibold">RS. 150</p>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold   py-2 rounded-lg cursor-pointer transition">
                  Register
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pb-10">
            <button className="w-8 h-8 rounded bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white transition">
              ‹
            </button>
            <button className="w-8 h-8 rounded bg-blue-600 text-white font-semibold">
              1
            </button>
            <button className="w-8 h-8 rounded bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white transition">
              2
            </button>
            <button className="w-8 h-8 rounded bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white transition">
              3
            </button>
            <button className="w-8 h-8 rounded bg-[#1e2535] text-gray-400 hover:bg-blue-600 hover:text-white transition">
              ›
            </button>
          </div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </>
  );
};

export default Tournaments;
