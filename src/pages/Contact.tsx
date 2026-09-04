import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import gamehero from "../assets/games-hero.jpg";
import Navbar from "../components/User/Navbar/Navbar";
import Footer from "../components/User/Navbar/Footer";
import { MdEmail } from "react-icons/md";
import { FaDiscord, FaMapMarkerAlt } from "react-icons/fa";
import { getApiErrorMessage } from "../api/axios";
import { submitContact } from "../services/contactApi";
import { isUserShellDark, userShell } from "../theme/userShellTheme";

const subjectOptions = [
  "Tournament Inquiry",
  "Technical Support",
  "Account Issue",
  "General Question",
  "Other",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Tournament Inquiry");
  const [message, setMessage] = useState("");
  const [subjectOpen, setSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        subjectRef.current &&
        !subjectRef.current.contains(e.target as Node)
      ) {
        setSubjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!emailPattern.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      await submitContact({
        name: fullName.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
      setSuccess("Message sent! We'll get back to you soon.");
      setFullName("");
      setEmail("");
      setSubject("Tournament Inquiry");
      setMessage("");
      setSubjectOpen(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send message. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={userShell.contactPage}>
      <div className="bg-gradient-to-r from-black/75 via-black/40 to-transparent">
        <img
          src={gamehero}
          alt=""
          className="absolute h-[88px] w-full object-cover opacity-85"
        />
        <div className="relative flex flex-col">
          <Navbar />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="mb-10">
          <p
            className={`text-xs font-bold tracking-widest uppercase mb-2 ${userShell.link}`}
          >
            Contact
          </p>
          <h1
            className={`text-3xl sm:text-4xl font-bold mb-3 ${isUserShellDark ? "text-white" : "text-gray-900"}`}
          >
            Get in touch
          </h1>
          <p className={`${userShell.subtitle} max-w-lg`}>
            Questions about hosting a tournament, partnerships, or platform
            support  we&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <div className={userShell.contactCard}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className={userShell.label}>Username</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className={userShell.inputLg}
                />
              </div>
              <div>
                <label className={userShell.label}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={userShell.inputLg}
                />
              </div>
            </div>

            <div className="mb-5" ref={subjectRef}>
              <label className={userShell.label}>Subject</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSubjectOpen((open) => !open)}
                  className={`${userShell.selectTrigger} ${
                    subjectOpen ? userShell.selectTriggerOpen : ""
                  }`}
                >
                  <span>{subject}</span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      subjectOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute z-20 left-0 right-0 mt-2 origin-top transition-all duration-200 ${
                    subjectOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                  }`}
                >
                  <ul className={userShell.selectMenu}>
                    {subjectOptions.map((option) => (
                      <li key={option} className="w-full">
                        <button
                          type="button"
                          onClick={() => {
                            setSubject(option);
                            setSubjectOpen(false);
                          }}
                          className={
                            subject === option
                              ? userShell.selectOptionActive
                              : userShell.selectOption
                          }
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={userShell.label}>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us a bit more..."
                rows={6}
                className={`${userShell.textarea} rounded-xl`}
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 font-medium mb-3">{error}</p>
            )}
            {success && (
              <p className="text-sm text-emerald-400 font-medium mb-3">
                {success}
              </p>
            )}

            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-xl text-sm cursor-pointer transition"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="mailto:sujaruu10@gmail.com"
              className={userShell.contactTile}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
                <MdEmail size={20} className="text-blue-400" />
              </div>
              <div>
                <p className={userShell.contactTileLabel}>Email</p>
                <p className={userShell.contactTileValue}>sujaruu10@gmail.com</p>
              </div>
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className={userShell.contactTile}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
                <FaDiscord size={20} className="text-blue-400" />
              </div>
              <div>
                <p className={userShell.contactTileLabel}>Discord</p>
                <p className={userShell.contactTileValue}>Join our server</p>
              </div>
            </a>

            <div className={userShell.contactTile}>
              <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt size={20} className="text-blue-400" />
              </div>
              <div>
                <p className={userShell.contactTileLabel}>Office</p>
                <p className={userShell.contactTileValue}>Bhaktapur, Nepal</p>
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
