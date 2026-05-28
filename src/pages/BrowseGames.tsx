import { FaArrowRight } from "react-icons/fa";
import pubg from "../assets/PUBG.png";
import freeFire from "../assets/FREEFIRE.png";
import mobileLegends from "../assets/MLBB.png";
import valorant from "../assets/VALORANT.png";
import r6 from "../assets/R6.png";
import callOfDuty from "../assets/CODM.png";

const BrowseGames = () => {
  return (
    <section className="bg-[#0B0F1A] px-[80px] py-10">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-white text-2xl font-bold">Browse Games</h2>
          <p className="text-gray-400 text-sm mt-1">
            Pick a game to see active and upcoming tournaments
          </p>
        </div>
        <button className="flex items-center gap-2 text-white text-sm cursor-pointer hover:text-blue-400 transition">
          View all games <FaArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-[80px] mb-20">
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
    </section>
  );
};

export default BrowseGames;
