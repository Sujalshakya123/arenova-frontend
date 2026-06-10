import React, { useState, useRef } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import esewa from "../../assets/Payment/esewa.png";
import khalti from "../../assets/Payment/khalti.png";
interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TournamentRegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [teamName, setTeamName] = useState("");
  const [teamTag, setTeamTag] = useState("");
  const [captainDiscord, setCaptainDiscord] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti">(
    "esewa",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [players, setPlayers] = useState([
    { label: "Player 2 Username", value: "" },
    { label: "Player 3 Username", value: "" },
    { label: "Player 4 Username", value: "" },
    { label: "Substitute #1 Username", value: "" },
  ]);

  const handlePlayerChange = (index: number, value: string) => {
    const updated = [...players];
    updated[index].value = value;
    setPlayers(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTeamLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!teamName || !captainDiscord || !contactEmail) {
      alert("Please fill in all required fields.");
      return;
    }
    alert(`Proceeding to payment via ${paymentMethod}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-100 rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Tournament Registration
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 cursor-pointer transition"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-4 pb-6">
          {/* Team Details */}
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Team Details
            </h3>

            {/* Team Name + Tag */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Team Name
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. TEAM BKT"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Team Tag
                </label>
                <input
                  type="text"
                  value={teamTag}
                  onChange={(e) => setTeamTag(e.target.value)}
                  placeholder="e.g. BKT"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Captain Discord */}
            <div className="mb-3">
              <label className="text-xs text-gray-500 mb-1 block">
                Captain's Username
              </label>
              <div className="relative">
                <FaUser
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={captainDiscord}
                  onChange={(e) => setCaptainDiscord(e.target.value)}
                  placeholder="Username#0000"
                  className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact Email */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Player Roster */}
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Player Roster
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {players.map((player, index) => (
                <div key={index}>
                  <label className="text-xs text-gray-500 mb-1 block">
                    {player.label}
                  </label>
                  <input
                    type="text"
                    value={player.value}
                    onChange={(e) => handlePlayerChange(index, e.target.value)}
                    placeholder="Username"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Team Logo */}
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Team Logo{" "}
              <span className="text-gray-400 text-sm font-normal">
                (optional)
              </span>
            </h3>
            {teamLogo ? (
              <div className="flex items-center gap-4">
                <img
                  src={teamLogo}
                  alt="Team Logo"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
                <button
                  onClick={() => setTeamLogo(null)}
                  className="text-sm text-red-500 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
              >
                <FaUpload size={20} className="text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 font-medium">
                  Browse Files
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Drag and drop or click to upload
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-5">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {/* eSewa */}
              <div
                onClick={() => setPaymentMethod("esewa")}
                className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition ${
                  paymentMethod === "esewa"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">
                  <img
                    src={esewa}
                    alt="eSewa"
                    className="w-9 h-9 rounded-lg object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">eSewa</p>
                  <p className="text-xs text-gray-400">
                    Fast & Secure Digital Wallet
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "esewa"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "esewa" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>

              {/* Khalti */}
              <div
                onClick={() => setPaymentMethod("khalti")}
                className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition ${
                  paymentMethod === "khalti"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-xs">
                  <img
                    src={khalti}
                    alt="Khalti"
                    className="w-9 h-9 rounded-lg object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Khalti</p>
                  <p className="text-xs text-gray-400">
                    Pay via Khalti ID or Banking
                  </p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "khalti"
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "khalti" && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-800 transition cursor-pointer"
            >
              ← Back to Tournament
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm cursor-pointer transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentRegisterModal;
