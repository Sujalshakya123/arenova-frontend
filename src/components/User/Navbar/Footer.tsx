import defaultLogo from "../../../assets/Test_LOGO.png";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router";
import { userShell } from "../../../theme/userShellTheme";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/sujaruu_",
    icon: FaInstagram,
    hoverClass:
      "hover:text-[#E4405F] hover:bg-[#E4405F]/15 hover:scale-110",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/sujal_shak35047",
    icon: FaXTwitter,
    hoverClass: "hover:text-white hover:bg-white/15 hover:scale-110",
  },
  {
    name: "Discord",
    href: "https://discord.gg/3dV9AxSwge",
    icon: FaDiscord,
    hoverClass:
      "hover:text-[#5865F2] hover:bg-[#5865F2]/15 hover:scale-110",
  },
];

type FooterProps = {
  /** Optional logo override (used for homepage logo tests). */
  logoSrc?: string;
};

const Footer = ({ logoSrc = defaultLogo }: FooterProps) => {
  return (
    <>
      <div>
        <footer className={`${userShell.footer} flex flex-col gap-10 xl:flex-row xl:justify-between px-4 sm:px-6 xl:px-[80px] py-10 xl:py-[40px] text-white`}>
          <div className="flex flex-col">
            <div className="flex items-center">
              <img src={logoSrc} alt="Logo" className="w-[48px] h-[48px]" />
              <h2 className="font-bold text-[20px]">ARENOVA</h2>
            </div>
            <p className="text-sm max-w-[220px] leading-relaxed mb-2">
              The ultimate competitive platform for gamers in Nepal. Providing
              professional infrastructure for the next generation of esports
              talent.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold">Quick Links</h2>
            <ul className="flex flex-col gap-1 text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="hover:text-white transition">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-white transition">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold">Legal</h2>
            <ul className="flex flex-col gap-1 text-gray-300">
              <li>
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/payment-policy" className="hover:text-white transition">
                  Payment Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold">About</h2>
            <ul className="flex flex-col gap-1 text-gray-300">
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="font-bold mb-2">Social Links</h2>
            <ul className="flex gap-4 mb-3">
              {socialLinks.map(({ name, href, icon: Icon, hoverClass }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className={`inline-flex items-center justify-center w-11 h-11 rounded-full text-gray-300 transition-all duration-200 ${hoverClass}`}
                  >
                    <Icon size={24} />
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-sm max-w-[220px] leading-relaxed text-gray-400">
              Stay updated with esports news and tournaments.
            </p>
          </div>
        </footer>
        <div className="bg-black justify-items-center px-4 sm:px-6 xl:px-[80px] py-6 xl:py-[30px] text-white text-center">
          <h2 className="text-gray-400 text-sm">
            © 2026 Arenova. All rights reserved. Building the future of esports
            in Nepal.
          </h2>
        </div>
      </div>
    </>
  );
};

export default Footer;
