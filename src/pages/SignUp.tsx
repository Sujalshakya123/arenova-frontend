import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import { Link, NavLink, useNavigate } from "react-router";
import api, { getApiErrorMessage } from "../api/axios";
import { toast } from "react-toastify";
import { getPasswordPolicyError, PASSWORD_POLICY_MESSAGE } from "../utils/passwordPolicy";
import PasswordInput from "../components/PasswordInput";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  role: string;
};

type SelectOption = { value: string; label: string };

const GAME_OPTIONS: SelectOption[] = [
  { value: "pubg", label: "PUBG Mobile" },
  { value: "freefire", label: "Free Fire" },
  { value: "valorant", label: "Valorant" },
];

const ROLE_OPTIONS: SelectOption[] = [
  { value: "PLAYER", label: "Player" },
  { value: "ORGANIZER", label: "Organizer" },
];

const SmoothSelect = ({
  value,
  placeholder,
  options,
  open,
  onToggle,
  onSelect,
  menuRef,
  invalid,
}: {
  value: string;
  placeholder: string;
  options: SelectOption[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
  invalid?: boolean;
}) => {
  const selected = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full h-[42px] flex items-center justify-between border rounded-lg px-3 py-2 text-left cursor-pointer transition-all duration-200 ${
          open
            ? "border-blue-500 ring-2 ring-blue-500/30"
            : invalid
              ? "border-red-400"
              : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <span className={selected ? "text-gray-800" : "text-gray-400"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute z-20 left-0 right-0 mt-1.5 origin-top transition-all duration-200 ease-out ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        <ul className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden py-1">
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => onSelect(option.value)}
                className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 cursor-pointer ${
                  value === option.value
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SignUp = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [primaryGame, setPrimaryGame] = useState("");
  const [openMenu, setOpenMenu] = useState<"game" | "role" | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !gameRef.current?.contains(target) &&
        !roleRef.current?.contains(target)
      ) {
        setOpenMenu(null);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenu(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors((current) => {
      const next = { ...current };
      delete next[e.target.name];
      return next;
    });
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const nextErrors: Record<string, string> = {};
    if (!form.username.trim()) nextErrors.username = "Username is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.password) nextErrors.password = "Password is required.";
    else {
      const passwordError = getPasswordPolicyError(form.password);
      if (passwordError) nextErrors.password = passwordError;
    }
    if (form.role === "PLAYER" && !primaryGame) {
      nextErrors.primaryGame = "Select a primary game.";
    }
    if (!form.role) nextErrors.role = "Select a role.";
    if (!agreed) nextErrors.agreed = "Please agree to the terms to continue.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFormError("");

    try {
      await api.post("/auth/register", {
        ...form,
        primaryGame: form.role === "PLAYER" ? primaryGame : null,
      });
      toast.success("Account created! Check your email for the verification code.");
      navigate("/otp", { state: { email: form.email.trim() } });
    } catch (error) {
      setFormError(
        getApiErrorMessage(error, "Registration failed. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const inputClass = (hasError?: string) =>
    `w-full border rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-400 focus:ring-red-200"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AuthLeftPanel />

        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-1/2 bg-white flex items-center justify-center px-4 sm:px-6"
        >
          <div className="w-full max-w-[400px] py-8">
            <h2 className="font-bold text-2xl">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4">
              Start your professional journey today.
            </p>

            <div className="mb-4">
              <label className="font-semibold text-black mb-1 block">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className={inputClass(errors.username)}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="font-semibold text-black mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass(errors.email)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-1">
                Password
              </label>
              <PasswordInput
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={`w-full h-[42px] border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-400 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              {!errors.password && (
                <p className="text-gray-500 text-xs mt-1">{PASSWORD_POLICY_MESSAGE}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-1">Role</label>
              <SmoothSelect
                value={form.role}
                placeholder="Select Role"
                options={ROLE_OPTIONS}
                open={openMenu === "role"}
                invalid={Boolean(errors.role)}
                onToggle={() =>
                  setOpenMenu((current) => (current === "role" ? null : "role"))
                }
                onSelect={(value) => {
                  setForm((current) => ({ ...current, role: value }));
                  if (value !== "PLAYER") {
                    setPrimaryGame("");
                    setErrors((current) => {
                      const next = { ...current };
                      delete next.primaryGame;
                      return next;
                    });
                  }
                  setOpenMenu(null);
                  setErrors((current) => {
                    const next = { ...current };
                    delete next.role;
                    return next;
                  });
                }}
                menuRef={roleRef}
              />
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">{errors.role}</p>
              )}
            </div>

            {form.role === "PLAYER" && (
              <div className="mb-4">
                <label className="block font-semibold text-gray-700 mb-1">
                  Primary Game
                </label>
                <SmoothSelect
                  value={primaryGame}
                  placeholder="Select Game"
                  options={GAME_OPTIONS}
                  open={openMenu === "game"}
                  invalid={Boolean(errors.primaryGame)}
                  onToggle={() =>
                    setOpenMenu((current) => (current === "game" ? null : "game"))
                  }
                  onSelect={(value) => {
                    setPrimaryGame(value);
                    setOpenMenu(null);
                    setErrors((current) => {
                      const next = { ...current };
                      delete next.primaryGame;
                      return next;
                    });
                  }}
                  menuRef={gameRef}
                />
                {errors.primaryGame && (
                  <p className="text-red-500 text-xs mt-1">{errors.primaryGame}</p>
                )}
              </div>
            )}
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    setErrors((current) => {
                      const next = { ...current };
                      delete next.agreed;
                      return next;
                    });
                  }}
                  className="w-4 h-4"
                />
                <p className="text-sm text-gray-500">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
              {errors.agreed && (
                <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>
              )}
            </div>
            {formError && (
              <p className="text-red-500 text-sm mb-3">{formError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 rounded transition"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                <span className="text-blue-600 cursor-pointer font-medium">
                  Log in
                </span>
              </NavLink>
            </p>

            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-[1px] bg-gray-300" />
              <span className="font-medium text-gray-500 ">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-[1px] bg-gray-300" />
            </div>

            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={googleLogin}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-blue-50 transition"
              >
                <FcGoogle size={18} />
                Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
