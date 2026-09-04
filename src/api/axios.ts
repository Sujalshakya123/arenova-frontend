import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/resend-otp",
  "/auth/forgot-password",
];

const isPublicAuthRequest = (url?: string) =>
  Boolean(url && PUBLIC_AUTH_PATHS.some((path) => url.includes(path)));

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export const registerUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

api.interceptors.request.use((config) => {
  if (isPublicAuthRequest(config.url)) {
    return config;
  }

  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const url = error.config?.url ?? "";
      const status = error.response.status;
      // Session / account checks — force logout when token is no longer valid.
      if (url.includes("/auth/me") && (status === 401 || status === 403)) {
        unauthorizedHandler?.();
      }
    }
    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const requestUrl = error.config?.url ?? "";
    const responseUrl =
      typeof error.request?.responseURL === "string"
        ? error.request.responseURL
        : "";

    if (
      responseUrl.includes("accounts.google.com") ||
      responseUrl.includes("/oauth2/authorization/google")
    ) {
      return "Email login was redirected to Google. Update backend SecurityConfig so /auth/login returns JSON, not an OAuth redirect.";
    }

    if (!error.response) {
      if (isPublicAuthRequest(requestUrl)) {
        return "Cannot complete login. The backend redirected or blocked /auth/login. Check Spring Security and that the server is running.";
      }
      return "Cannot reach the server. Check your connection and try again.";
    }

    const data = error.response.data;
    const bodyMessage = (() => {
      if (typeof data === "string" && data.trim()) return data.trim();
      if (data && typeof data === "object") {
        const body = data as Record<string, unknown>;
        if (typeof body.message === "string" && body.message.trim()) {
          return body.message.trim();
        }
        if (typeof body.error === "string" && body.error.trim()) {
          return body.error.trim();
        }
      }
      return null;
    })();

    if (error.response.status === 401) {
      // Login / register / OTP: prefer server message (wrong password, etc.).
      if (isPublicAuthRequest(requestUrl)) {
        return bodyMessage || fallback || "Wrong email or password. Please try again.";
      }
      if (requestUrl.includes("/register") || requestUrl.includes("/registrations")) {
        return "Your session expired. Please log out, sign in again, then retry registration.";
      }
      return "Your session expired or you are not signed in. Log out, sign in again, then retry.";
    }

    if (error.response.status === 403) {
      return (
        bodyMessage ||
        fallback ||
        "You do not have permission to perform this action."
      );
    }

    if (error.response.status === 409) {
      if (bodyMessage) return bodyMessage;
      if (requestUrl.includes("/api/game")) {
        return "This game already exists. Edit the existing title instead of creating a duplicate.";
      }
      return "This action conflicted with existing data. Refresh and try again.";
    }

    if (error.response.status >= 500) {
      if (bodyMessage) return bodyMessage;
    }

    if (bodyMessage) return bodyMessage;
  }

  return fallback;
};

export default api;
