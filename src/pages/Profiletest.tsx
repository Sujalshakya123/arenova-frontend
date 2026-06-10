import React, { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { FaDiscord, FaPlus, FaFacebook, FaCamera } from "react-icons/fa";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import tourhero from "../assets/download.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiPlusCircleBold } from "react-icons/pi";
import { NavLink } from "react-router";
import valo from "../assets/Game-icon/valorant-50.png";
import ff from "../assets/Game-icon/FF.png";
import Profilesidebar from "../components/User/Profilesidebar";

const ProfileTest = () => {
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);

  // ✅ Open crop modal after picking image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRawImage(reader.result as string);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Crop and save
  const handleCropDone = () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    setProfileImage(canvas.toDataURL("image/jpeg"));
    setShowCropModal(false);
    setRawImage(null);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setRawImage(null);
  };

  return (
    <>
      <div>
        <div className="bg-gradient-to-r from-black/75 via-black/40 to-transparent">
          <img
            src={tourhero}
            className="absolute h-[88px] w-full object-cover opacity-85"
          />
          <div className="relative flex flex-col">
            <Navbar />
          </div>
        </div>

        <div className="flex min-h-screen">
          <Profilesidebar />

          <div className="flex-1 bg-gray-100 px-6 py-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <NavLink to="/">
                <IoMdArrowRoundBack size={24} className="cursor-pointer" />
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
                <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-3">
                  {/* ✅ Avatar with camera hover */}
                  <div className="relative">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-3xl font-bold">
                        U
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 cursor-pointer transition">
                      <FaCamera size={18} className="text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-sm">Username</p>
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
                      maxLength={300}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                    />
                    <p className="text-xs text-gray-400 text-right">
                      {bio.length}/300
                    </p>
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
                      <img
                        src={valo}
                        alt="Valorant"
                        className="w-10 h-10 rounded-lg"
                      />
                      <p className="text-sm font-semibold text-gray-900">
                        Valorant
                      </p>
                    </div>
                    <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3">
                      <img
                        src={ff}
                        alt="Free Fire"
                        className="w-10 h-10 rounded-lg"
                      />
                      <p className="text-sm font-semibold text-gray-900">
                        FreeFire
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button className="flex items-center gap-1 text-gray-500 text-sm mt-4 hover:text-gray-700 cursor-pointer">
                      <PiPlusCircleBold size={16} /> Link New Account
                    </button>
                  </div>
                </div>

                {/* Social Connections */}
                <div className="bg-white rounded-xl p-6">
                  <h2 className="font-bold text-gray-900 text-base mb-4">
                    Social Connections
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FaDiscord size={20} className="text-indigo-500" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Discord
                          </p>
                          <p className="text-xs text-indigo-400">
                            sujaruu#1000
                          </p>
                        </div>
                      </div>
                      <button className="border border-gray-300 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                        Disconnect
                      </button>
                    </div>
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FaFacebook size={20} className="text-blue-500" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Facebook
                          </p>
                          <p className="text-xs text-gray-400">Not connected</p>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition">
                        Connect Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Crop Modal */}
        {showCropModal && rawImage && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[500px] flex flex-col gap-4">
              <h2 className="text-lg font-bold text-gray-900">
                Adjust Profile Photo
              </h2>
              <p className="text-sm text-gray-500">
                Drag to reposition and resize your photo.
              </p>
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <img
                    ref={imgRef}
                    src={rawImage}
                    alt="Crop preview"
                    className="max-h-[350px] object-contain"
                  />
                </ReactCrop>
              </div>
              <div className="flex justify-end gap-3 mt-2">
                <button
                  onClick={handleCropCancel}
                  className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCropDone}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-lg text-sm cursor-pointer transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default ProfileTest;
