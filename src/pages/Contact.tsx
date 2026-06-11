import React, { useState } from "react";
import gamehero from "../assets/games-hero.jpg";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import { MdEmail } from "react-icons/md";
import { FaDiscord, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!fullName || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }
    alert("Message sent!");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Hero */}
      <div className="bg-gradient-to-r from-black/75 via-black/40 to-transparent">
        <img
          src={gamehero}
          className="absolute h-[88px] w-full object-cover opacity-85"
        />
        <div className="relative flex flex-col">
          <Navbar />
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <p className="text-black text-s font-bold tracking-widest uppercase mb-2">
            Contact
          </p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Get in touch
          </h1>
          <p className="text-gray-500 text-sm max-w-lg">
            Questions about hosting a tournament, partnerships, or platform
            support, we'd love to hear from you.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Left — Form */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">
                  Username
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="mb-5">
              <label className="text-xs text-gray-500 mb-1.5 block">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option>Tournament Inquiry</option>
                <option>Technical Support</option>
                <option>Account Issue</option>
                <option>General Question</option>
                <option>Other</option>
              </select>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="text-xs text-gray-500 mb-1.5 block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us a bit more..."
                rows={6}
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm cursor-pointer transition"
            >
              Send message
            </button>
          </div>

          {/* Right — Contact Info */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-4 hover:border-blue-400 transition cursor-pointer">
              <MdEmail size={20} className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                  Email
                </p>
                <p className="text-sm font-semibold text-black">
                  arenovaofc@gmail.com
                </p>
              </div>
            </div>

            {/* Discord */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-4 hover:border-blue-400 transition cursor-pointer">
              <FaDiscord size={20} className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                  Discord
                </p>
                <p className="text-sm font-semibold text-black">
                  Join our server
                </p>
              </div>
            </div>

            {/* Office */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-5 flex items-center gap-4 hover:border-blue-400 transition cursor-pointer">
              <FaMapMarkerAlt size={20} className="text-blue-500" />
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">
                  Office
                </p>
                <p className="text-sm font-semibold text-black">
                  Bhaktapur, Nepal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
