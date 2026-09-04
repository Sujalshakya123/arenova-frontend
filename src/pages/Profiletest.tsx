import React, { useEffect, useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { FaPlus, FaCamera, FaTimes } from "react-icons/fa";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import tourhero from "../assets/download.jpg";
import { IoMdArrowRoundBack } from "react-icons/io";
import { PiPlusCircleBold } from "react-icons/pi";
import { NavLink } from "react-router";
import valo from "../assets/Game-icon/valorant-50.png";
import ff from "../assets/Game-icon/FF.png";
import pubg from "../assets/Game-icon/pubg.png";
import mlbb from "../assets/Game-icon/mlbb.png";
import codm from "../assets/Game-icon/call-of-duty-m.png";
import r6 from "../assets/Game-icon/Rainbow-Six.png";
import Profilesidebar from "../components/User/Profilesidebar";
import ResponsiveSidebarLayout from "../components/ResponsiveSidebarLayout";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../api/axios";
import ConfirmModal from "../components/ConfirmModal";
import { userShell } from "../theme/userShellTheme";
import {
  dataUrlToFile,
  getUserById,
  updatePreferredGames,
  updateUserProfile,
  uploadProfilePhoto,
} from "../services/userApi";

type PreferredGame = {
  id: string;
  name: string;
  icon: string;
};

const availableGames: PreferredGame[] = [
  { id: "valorant", name: "Valorant", icon: valo },
  { id: "freefire", name: "FreeFire", icon: ff },
  { id: "pubg", name: "PUBG Mobile", icon: pubg },
  { id: "mlbb", name: "Mobile Legends", icon: mlbb },
  { id: "codm", name: "Call of Duty Mobile", icon: codm },
  { id: "r6", name: "Rainbow Six Siege", icon: r6 },
];

/** Game logos (e.g. FreeFire) are dark — always sit on a white tile. */
const gameIconTileClass =
  "w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden shrink-0";

const parsePreferredGames = (value?: string | null): PreferredGame[] => {
  if (!value?.trim()) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .map((id) => availableGames.find((game) => game.id === id))
    .filter((game): game is PreferredGame => Boolean(game));
};

const ProfileTest = () => {
  const { userDTO, profileImage, setProfileImage, updateUser } = useAuth();
  const [username, setUsername] = useState(userDTO?.username ?? "");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(userDTO?.email ?? "");
  const [bio, setBio] = useState("");
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [pendingDiscard, setPendingDiscard] = useState(false);
  const [pendingRemoveGameId, setPendingRemoveGameId] = useState<string | null>(null);
  const [preferredGames, setPreferredGames] = useState<PreferredGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const canSave =
    Boolean(userDTO?.id) && !userDTO!.id.includes("@") && !saving && !loading;

  useEffect(() => {
    const loadProfile = async () => {
      if (!userDTO?.id || userDTO.id.includes("@")) {
        setLoading(false);
        setError("Please log out and log in again so your profile can load.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getUserById(userDTO.id);
        const user = response.data;
        setUsername(user.username ?? "");
        setFullName(user.fullName ?? "");
        setEmail(user.email ?? "");
        setBio(user.bio ?? "");
        setPreferredGames(parsePreferredGames(user.preferredGames));
        if (user.profilePhotoUrl) {
          setProfileImage(user.profilePhotoUrl);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load profile."));
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [userDTO?.id, setProfileImage]);

  const selectableGames = availableGames.filter(
    (game) => !preferredGames.some((p) => p.id === game.id),
  );

  const handleAddGame = (game: PreferredGame) => {
    setPreferredGames((prev) => [...prev, game]);
    setShowAddGameModal(false);
  };

  const handleRemoveGame = (id: string) => {
    setPreferredGames((prev) => prev.filter((game) => game.id !== id));
  };

  const handleDiscard = () => {
    void (async () => {
      if (!userDTO?.id || userDTO.id.includes("@")) return;
      try {
        const response = await getUserById(userDTO.id);
        const user = response.data;
        setUsername(user.username ?? "");
        setEmail(user.email ?? "");
        setBio(user.bio ?? "");
        setFullName(user.fullName ?? "");
        setPreferredGames(parsePreferredGames(user.preferredGames));
        setMessage(null);
        setError(null);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not reload profile."));
      }
    })();
  };

  const handleSave = async () => {
    if (!canSave || !userDTO?.id) return;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      await updateUserProfile(userDTO.id, {
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        bio,
      });
      await updatePreferredGames(
        userDTO.id,
        preferredGames.map((game) => game.id),
      );

      updateUser({
        username: username.trim(),
        email: email.trim(),
      });
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save profile."));
    } finally {
      setSaving(false);
    }
  };

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
  const handleCropDone = async () => {
    if (!imgRef.current || !crop.width || !crop.height) return;
    if (!userDTO?.id || userDTO.id.includes("@")) {
      setError("Please log out and log in again before uploading a photo.");
      return;
    }

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

    const dataUrl = canvas.toDataURL("image/jpeg");
    setProfileImage(dataUrl);
    setShowCropModal(false);
    setRawImage(null);

    try {
      setUploadingPhoto(true);
      setError(null);
      const file = await dataUrlToFile(dataUrl, "profile.jpg");
      const response = await uploadProfilePhoto(userDTO.id, file);
      if (response.data.photoUrl) {
        setProfileImage(response.data.photoUrl);
      }
      setMessage("Profile photo updated.");
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not upload profile photo."));
    } finally {
      setUploadingPhoto(false);
    }
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

        <ResponsiveSidebarLayout
          sidebar={<Profilesidebar />}
          className={userShell.pageAlt}
          filterLabel="Account menu"
        >
          <div className={userShell.contentAlt}>
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
              <NavLink to="/">
                <IoMdArrowRoundBack size={24} className={userShell.iconBack} />
              </NavLink>
              <div>
                <h1 className={userShell.h1}>
                  Account Settings
                </h1>
                <p className={userShell.subtitle}>
                  Manage your professional athlete profile and display
                  preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:shrink-0">
                <button
                  type="button"
                  onClick={() => setPendingDiscard(true)}
                  disabled={loading || saving}
                  className={`${userShell.btnDiscard} disabled:opacity-60`}
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={() => void handleSave()}
                  disabled={!canSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {(error || message || uploadingPhoto || loading) && (
              <div className="mb-4 space-y-1">
                {loading && (
                  <p className={userShell.bodySm}>Loading profile...</p>
                )}
                {uploadingPhoto && (
                  <p className={userShell.bodySm}>Uploading photo...</p>
                )}
                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                {message && (
                  <p className="text-sm text-emerald-700 font-medium">{message}</p>
                )}
              </div>
            )}
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left Panel */}
              <div className="flex flex-col gap-4 w-full xl:w-[200px] shrink-0">
                <div className={`${userShell.cardPad4} flex flex-col items-center gap-3`}>
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
                    <p className={`${userShell.strong} text-sm`}>Username</p>
                  </div>
                  <label className={userShell.btnPhoto}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p className={`${userShell.bodySm} text-center`}>
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex-1 flex flex-col gap-4">
                {/* Personal Information */}
                <div className={userShell.cardPad6}>
                  <h2 className={`${userShell.h2Base} mb-4`}>
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className={userShell.label}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                        className={userShell.input}
                      />
                    </div>
                    <div>
                      <label className={userShell.label}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your legal name"
                        className={userShell.input}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className={userShell.label}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={userShell.input}
                    />
                  </div>
                  <div>
                    <label className={userShell.label}>
                      Bio
                    </label>
                    <textarea
                      placeholder="Brief description for your public profile..."
                      maxLength={300}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`${userShell.textarea} h-24`}
                    />
                    <p className={`${userShell.mutedXs} text-right`}>
                      {bio.length}/300
                    </p>
                  </div>
                </div>

                {/* Preferred Games */}
                <div className={userShell.cardPad6}>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className={userShell.h2Base}>
                        Preferred Games
                      </h2>
                      <p className={userShell.bodySm}>
                        Games you are currently active in.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddGameModal(true)}
                      className={`flex items-center gap-1 ${userShell.linkBold} hover:underline cursor-pointer`}
                    >
                      <FaPlus size={12} /> Add Game
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {preferredGames.length === 0 ? (
                      <p className={userShell.empty}>
                        No preferred games yet. Click Add Game to choose.
                      </p>
                    ) : (
                      preferredGames.map((game) => (
                        <div
                          key={game.id}
                          className={userShell.gameChip}
                        >
                          <div className={gameIconTileClass}>
                            <img
                              src={game.icon}
                              alt={game.name}
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                          <p className={`text-sm font-semibold ${userShell.strong} pr-4`}>
                            {game.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => setPendingRemoveGameId(game.id)}
                            aria-label={`Remove ${game.name}`}
                            className="absolute top-1.5 right-1.5 text-gray-300 hover:text-red-500 transition cursor-pointer"
                          >
                            <FaTimes size={11} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowAddGameModal(true)}
                      className={`flex items-center gap-1 ${userShell.muted} text-sm mt-4 hover:text-white cursor-pointer`}
                    >
                      <PiPlusCircleBold size={16} /> Add preferred game
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResponsiveSidebarLayout>

        {/* Add Preferred Game Modal */}
        {showAddGameModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div className={userShell.modalMd}>
              <div className="flex items-start justify-between mb-1">
                <h2 className={userShell.h2Lg}>Add Game</h2>
                <button
                  type="button"
                  onClick={() => setShowAddGameModal(false)}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                  aria-label="Close"
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <p className={`${userShell.bodySm} mb-5`}>
                Select a game to add to your preferred list.
              </p>

              {selectableGames.length === 0 ? (
                <p className={`${userShell.empty} text-center py-6`}>
                  You have already added all available games.
                </p>
              ) : (
                <ul className="space-y-2 max-h-[320px] overflow-y-auto">
                  {selectableGames.map((game) => (
                    <li key={game.id}>
                      <button
                        type="button"
                        onClick={() => handleAddGame(game)}
                        className={userShell.gamePick}
                      >
                        <div className={gameIconTileClass}>
                          <img
                            src={game.icon}
                            alt={game.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <span className={`text-sm font-semibold ${userShell.strong}`}>
                          {game.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-end mt-5">
                <button
                  type="button"
                  onClick={() => setShowAddGameModal(false)}
                  className={`px-4 py-2 text-sm ${userShell.muted} hover:text-white cursor-pointer`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ✅ Crop Modal */}
        {showCropModal && rawImage && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
            <div className={userShell.modalLg}>
              <h2 className={userShell.h2Lg}>
                Adjust Profile Photo
              </h2>
              <p className={userShell.bodySm}>
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
                  className={userShell.btnGhost}
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

      <ConfirmModal
        open={pendingDiscard}
        title="Discard changes?"
        message="Discard unsaved profile changes and reload from the server?"
        confirmLabel="Discard"
        danger
        onConfirm={() => {
          setPendingDiscard(false);
          handleDiscard();
        }}
        onCancel={() => setPendingDiscard(false)}
      />

      <ConfirmModal
        open={pendingRemoveGameId !== null}
        title="Remove game?"
        message="Remove this game from your preferred list? Save profile to apply."
        confirmLabel="Remove"
        danger
        onConfirm={() => {
          if (pendingRemoveGameId) {
            handleRemoveGame(pendingRemoveGameId);
          }
          setPendingRemoveGameId(null);
        }}
        onCancel={() => setPendingRemoveGameId(null)}
      />
    </>
  );
};

export default ProfileTest;
