import React from "react";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";

import tourhero from "../assets/download.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router";
import valo from "../assets/Game-icon/valorant-50.png";
import ff from "../assets/Game-icon/FF.png";
import Profilesidebar from "../components/User/Profilesidebar";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div>
        <div className=" bg-gradient-to-r from-black/75 via-black/40 to-transparent">
          <img
            src={tourhero}
            className="absolute h-[88px] w-full object-cover opacity-85"
          />
          <div className="relative  flex flex-col">
            <Navbar />
          </div>
        </div>

        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Profilesidebar />

          <div className="flex-1 bg-gray-100 px-6 py-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <NavLink to="/">
                <div className="cursor-pointer">
                  <IoMdArrowRoundBack size={24} />
                </div>
              </NavLink>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Account Settings
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Manage your professional athlete profile and display
                  preferences.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition cursor-pointer">
                  Discard Changes
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="flex gap-6">
              {/* Left Panel */}
              <div className="flex flex-col gap-4 w-[200px]">
                {/* Avatar */}
                <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-3">
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-bold"></div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-sm">
                      {/* {username || "User"} */} Username
                    </p>
                  </div>
                  <label className="w-full text-center border border-gray-400 text-gray-700 text-xs font-medium py-1.5 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className="text-xs text-gray-400 text-center">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Personal Information */}
                <div className="bg-white rounded-xl p-6">
                  <h2 className="font-bold text-gray-900 text-base mb-4">
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Username
                      </label>
                      <input
                        type="text"
                        // value={username}
                        // onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your legal name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs text-gray-500 mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Bio
                    </label>
                    <textarea
                      placeholder="Brief description for your public profile..."
                      // value={bio}
                      // onChange={(e) => setBio(e.target.value)}
                      maxLength={300}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                    />
                  </div>
                </div>

                {/* Preferred Games */}
                <div className="bg-white rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="font-bold text-gray-900 text-base">
                        Preferred Games
                      </h2>
                      <p className="text-xs text-gray-500">
                        Games you are currently active in.
                      </p>
                    </div>
                    <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline cursor-pointer">
                      <FaPlus size={12} /> Add Game
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-3">
                      <div className=" flex items-center justify-center text-white text-xs font-bold"></div>
                      <img
                        src={valo}
                        alt="Valorant"
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Valorant
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center justify-center text-white text-xs font-bold">
                        <img
                          src={ff}
                          alt="Free Fire"
                          className="w-10 h-10 rounded-lg"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          FreeFire
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <p className="text-sm text-gray-400 mt-4">
                      Preferred games are managed from your live profile page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Profile;
