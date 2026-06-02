import React from "react";

import { useState } from "react";
import {
  FaUser,
  FaGamepad,
  FaPhone,
  FaFileAlt,
  FaTag,
  FaCamera,
  FaTrophy,
  FaEdit,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const tournamentHistory = [
    {
      id: 1,
      name: "Nepal PUBG Pro League",
      game: "PUBG Mobile",
      date: "29 April, 2026",
      result: "Top 5",
      prize: "Rs. 2,000",
    },
    {
      id: 2,
      name: "FreeFire World Series",
      game: "Free Fire",
      date: "15 March, 2026",
      result: "Winner",
      prize: "Rs. 20,000",
    },
    {
      id: 3,
      name: "Valorant Champions Tour",
      game: "Valorant",
      date: "1 Feb, 2026",
      result: "Top 10",
      prize: "Rs. 500",
    },
  ];

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="min-h-screen bg-[#0B0F1A] text-white px-[80px] py-10">
        {/* Header */}
        <div className="mb-2">
          <p className="text-yellow-400 text-xs tracking-widest uppercase">
            Account
          </p>
          <h1 className="text-3xl font-bold mt-1">Profile Settings</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your gaming identity, contact details, and how other players
            see you.
          </p>
        </div>
        <hr className="border-gray-700 mb-8" />

        {/* Tabs */}
        <div className="flex gap-6 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-semibold transition ${activeTab === "profile" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-semibold transition ${activeTab === "history" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
          >
            Tournament History
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 text-sm font-semibold transition ${activeTab === "security" ? "text-yellow-400 border-b-2 border-yellow-400" : "text-gray-400 hover:text-white"}`}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-6">
            {/* Avatar Card */}
            <div className="bg-[#111827] rounded-xl p-6 flex items-center gap-6">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={profileImage}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-yellow-500 flex items-center justify-center text-black text-3xl font-bold">
                    {user?.sub?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                {/* Camera overlay */}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 hover:opacity-100 cursor-pointer transition">
                  <FaCamera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div>
                {/* <p className="font-bold text-lg">{user?.name ?? user?.sub}</p> */}
                <p className="text-gray-400 text-sm">{user?.sub}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Click the avatar to change your profile picture
                </p>
              </div>
            </div>

            {/* Public Details */}
            <div className="bg-[#111827] rounded-xl p-6">
              <h2 className="font-semibold text-base mb-6">Public details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-2">
                    <FaUser size={12} /> Display Name
                  </label>
                  <input
                    type="text"
                    //   defaultValue={user?.name ?? ""}
                    placeholder="Your display name"
                    className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-2">
                    <FaTag size={12} /> Gaming Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ProPlayer#1234"
                    className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-2">
                    <FaGamepad size={12} /> Favorite Game
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PUBG Mobile"
                    className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-2">
                    <FaPhone size={12} /> Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+977 98XXXXXXXX"
                    className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-2">
                    <FaFileAlt size={12} /> Bio
                  </label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    maxLength={300}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none h-28"
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {bio.length}/300
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition cursor-pointer">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Tournament History Tab */}
        {activeTab === "history" && (
          <div className="bg-[#111827] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-xs uppercase">
                  <th className="text-left px-6 py-4">Tournament</th>
                  <th className="text-left px-6 py-4">Game</th>
                  <th className="text-left px-6 py-4">Date</th>
                  <th className="text-left px-6 py-4">Result</th>
                  <th className="text-left px-6 py-4">Prize</th>
                </tr>
              </thead>
              <tbody>
                {tournamentHistory.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-700 hover:bg-[#1e2535] transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-2">
                      <FaTrophy className="text-yellow-400" size={14} />{" "}
                      {t.name}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{t.game}</td>
                    <td className="px-6 py-4 text-gray-400">{t.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${t.result === "Winner" ? "bg-yellow-400 text-black" : "bg-gray-700 text-white"}`}
                      >
                        {t.result}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-green-400 font-semibold">
                      {t.prize}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="bg-[#111827] rounded-xl p-6 max-w-[500px]">
            <h2 className="font-semibold text-base mb-6">Change Password</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#1e2535] border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition cursor-pointer w-fit mt-2">
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
