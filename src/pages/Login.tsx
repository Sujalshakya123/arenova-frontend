import React, { useEffect, useState } from "react";

import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";

import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import { NavLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import api, { getApiErrorMessage } from "../api/axios";
import { toast } from "react-toastify";
import { resolvePostLoginPath } from "../auth/roles";
import PasswordInput from "../components/PasswordInput";

type LoginForm = {
  email: string;
  password: string;
};

type User = {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  status?: string;
};

type LoginResponse = {
  token: string;
  userDTO: User;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

const REMEMBER_EMAIL_KEY = "arenova_remember_email";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rememberedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
  const [form, setForm] = useState<LoginForm>({
    email: rememberedEmail,
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    const oauthError = (location.state as { oauthError?: string } | null)
      ?.oauthError;
    const params = new URLSearchParams(location.search);
    const queryError = params.get("error");

    if (oauthError) {
      setFormError(oauthError);
      navigate(location.pathname, { replace: true, state: {} });
      return;
    }

    if (queryError) {
      setFormError(queryError);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, location.search, location.pathname, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors((current) => ({ ...current, [e.target.name]: undefined }));
    setFormError("");
  };

  const validate = () => {
    const next: FieldErrors = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!emailPattern.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setFormError("");

    try {
      const response = await api.post<LoginResponse>("/auth/login", form);

      const user = response.data.userDTO;
      login(response.data.token, {
        id: String(user.id),
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });

      if (rememberMe) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, form.email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }

      toast.success("Login Successful!", {
        autoClose: 2000,
      });

      const from =
        (location.state as { from?: string } | null)?.from ?? null;
      navigate(resolvePostLoginPath(user.role, from, user.status), {
        replace: true,
      });
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          "Wrong email or password. Please try again.",
        ),
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
            <h2 className="font-bold text-2xl">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1 mb-4 ">
              Please enter your credentials to access your account.
            </p>

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
              <div className="flex justify-between items-center">
                <label className="font-semibold text-black mb-1 block">
                  Password
                </label>
                <NavLink
                  to="/forgot-password"
                  className="font-semibold text-blue-600 cursor-pointer hover:underline"
                >
                  Forgot Password?
                </NavLink>
              </div>
              <PasswordInput
                placeholder="Enter your password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className={inputClass(errors.password)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mb-5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4"
              />
              <p className="text-sm text-gray-500">Remember me</p>
            </div>
            {formError && (
              <p className="text-red-500 text-sm mb-3">{formError}</p>
            )}
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2 rounded transition flex items-center justify-center gap-2"
              >
                {submitting ? "Logging in..." : "Login"} <FiLogIn />
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <NavLink
                to="/sign-up"
                className="font-semibold text-blue-600 cursor-pointer hover:underline"
              >
                <span className="text-blue-600 cursor-pointer font-semibold hover:underline">
                  Sign up for free
                </span>
              </NavLink>
            </p>

            <div className="flex items-center gap-3 my-5 mt-6 mb-8">
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

export default Login;
