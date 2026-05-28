import Navbar from "../components/User/Navbar/Navbar";
import hero from "../assets/hero-banner.png";
import sechero from "../assets/hero sec tournaments.jpg";
import { FaArrowRight } from "react-icons/fa";
import { CiTrophy } from "react-icons/ci";
import Footer from "../components/User/Navbar/Footer";
import { Outlet } from "react-router";
import BrowseGames from "../pages/BrowseGames";
import FeaturedTournament from "../pages/FeaturedTournament";

const UserLayout = () => {
  const stats = [
    { id: 1, icon: <CiTrophy size={40} />, value: "50+", label: "Tournaments" },
    { id: 2, icon: <CiTrophy size={40} />, value: "1000+", label: "Players" },
    { id: 3, icon: <CiTrophy size={40} />, value: "5", label: "Live Matches" },
    {
      id: 4,
      icon: <CiTrophy size={40} />,
      value: "Rs 50,000",
      label: "Prizes Distribution",
    },
  ];

  return (
    <>
      <div>
        <img
          src={hero}
          className="absolute h-screen w-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="relative h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col justify-center px-[80px] -mt-30">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-white text-xs tracking-widest border border-blue-700 px-2 py-1 rounded-full">
                NEPAL'S ESPORTS PLATFORM · LIVE NOW
              </span>
            </div>

            <h1 className="text-white text-6xl font-bold leading-tight mb-4 drop-shadow-indigo-950">
              Where Nepal's gamers
              <br />
              <span className="text-cyan-400">compete to win.</span>
            </h1>

            <p
              className="text-white
             text-base max-w-[520px] mb-8 font-medium drop-shadow-indigo-950"
            >
              Discover tournaments, build your dream squad, and compete against
              the strongest players in the nation's biggest esports battles.
            </p>

            <button className="flex items-center text-white bg-blue-700 hover:bg-blue-800 gap-2 font-bold px-4 py-3 rounded w-fit transition cursor-pointer">
              Explore Tournaments <FaArrowRight size={14} />
            </button>

            <div className="flex items-center gap-6 mt-6 text-gray-300 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> Free
                to join
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />{" "}
                Verified organizers
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />{" "}
                Instant payouts
              </span>
            </div>
          </div>
          {/* Stats Bar */}
          <div className="backdrop-blur-sm w-full">
            <div className="text-white flex justify-between w-[60%] items-center m-auto p-10">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="flex flex-col justify-center items-center"
                >
                  {stat.icon}
                  <h2>{stat.value}</h2>
                  <h3>{stat.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div>
          <div>
            <BrowseGames />
          </div>
        </div>
      </div>
      <div>
        <div>
          <FeaturedTournament />
        </div>
      </div>
      <Outlet />
      <div>
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
