import React from "react";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import pubg from "../assets/Cards/PUBG.jpg";
import freefire from "../assets/Cards/FREEFIRE.jpg";
import mlbb from "../assets/Cards/MLBB.jpg";
import valorant from "../assets/Cards/VALORANT2.jpg";
import codm from "../assets/Cards//CODM.jpg";
import r6 from "../assets/Cards/RAINBOW SIX.jpg";

const FeaturedTournament = () => {
  return (
    <>
      <section className="bg-[#0B0F1A] px-[80px] py-10">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-white text-2xl font-bold">
              Featured Tournaments
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Hand-picked competitive events from verified organizers.
            </p>
          </div>
          <button className="flex items-center gap-2 text-white text-sm cursor-pointer hover:text-blue-400 transition">
            View all match <FaArrowRight size={14} />
          </button>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-4 gap-[80px] mb-20 mt-18">
          {/* PUBG Mobile */}
          <div className="bg-[#111827] rounded-xl overflow-hidden">
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
                  <p className="text-black text-sm font-semibold">RS. 20,000</p>
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
          <div className="bg-[#111827] rounded-xl overflow-hidden">
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
                  <p className="text-black text-sm font-semibold">RS. 20,000</p>
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
          <div className="bg-[#111827] rounded-xl overflow-hidden">
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
                  <p className="text-black text-sm font-semibold">RS. 20,000</p>
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
          <div className="bg-[#111827] rounded-xl overflow-hidden">
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
                  <p className="text-black text-sm font-semibold">RS. 20,000</p>
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
          <div className="bg-[#111827] rounded-xl overflow-hidden">
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
                  <p className="text-black text-sm font-semibold">RS. 20,000</p>
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
          <div className="bg-[#111827] rounded-xl overflow-hidden">
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
                  <p className="text-black text-sm font-semibold">RS. 20,000</p>
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
      </section>
    </>
  );
};

export default FeaturedTournament;
