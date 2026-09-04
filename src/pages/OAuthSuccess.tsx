import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import api, { getApiErrorMessage } from "../api/axios";
import { resolvePostLoginPath } from "../auth/roles";

function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleOAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login", {
          replace: true,
          state: { oauthError: "Google sign-in failed. No token received." },
        });
        return;
      }

      try {
        const response = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data;
        login(token, {
          id: String(user.id),
          username: user.username,
          email: user.email,
          role: user.role,
          status: user.status,
        });

        setTimeout(() => {
          navigate(resolvePostLoginPath(user?.role, null, user?.status), {
            replace: true,
          });
        }, 100);
      } catch (err) {
        const message = getApiErrorMessage(
          err,
          "Google sign-in failed. Please try again.",
        );
        setError(message);
        window.setTimeout(() => {
          navigate("/login", {
            replace: true,
            state: { oauthError: message },
          });
        }, 1500);
      }
    };

    void handleOAuth();
  }, [login, navigate, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <p className={`text-sm ${error ? "text-red-600" : "text-gray-600"}`}>
        {error || "Signing you in with Google..."}
      </p>
    </div>
  );
}

export default OAuthSuccess;
