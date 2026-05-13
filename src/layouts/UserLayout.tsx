import Navbar from "../components/User/Navbar/Navbar";
import hero from "../assets/hero-banner.png";
import { CiTrophy } from "react-icons/ci";
import Footer from "../components/User/Navbar/Footer";
import { Outlet } from "react-router";

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
        <img src={hero} className="absolute h-screen w-full object-cover" />
        <div className="h-screen">
          <Navbar />
          <div className="relative text-white text-7xl h-[72%] ">
            <h2>NEPAL'S ESPORTS PLATFORM</h2>
          </div>
          <div className="relative backdrop-blur-sm w-full h-[18%]">
            <div className="relative text-white flex justify-between w-[60%] items-center m-auto backdrop-blur-sm p-10">
              {stats.map((stat) => (
                <div className="flex flex-col justify-center items-center  ">
                  {stat.icon}
                  <h2>{stat.value}</h2>
                  <h3>{stat.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen">
        <h2>HAHAHAHAHAH</h2>
      </div>
      <Outlet />
      <div>
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
