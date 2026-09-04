export type AppRole = "player" | "organizer" | "admin";

export type UserStatus =
  | "ACTIVE"
  | "PENDING"
  | "REJECTED"
  | "INACTIVE"
  | "SUSPENDED";

export const normalizeUserStatus = (
  status?: string | null,
): UserStatus | null => {
  if (!status) return null;
  const value = status.toUpperCase();
  if (
    value === "ACTIVE" ||
    value === "PENDING" ||
    value === "REJECTED" ||
    value === "INACTIVE" ||
    value === "SUSPENDED"
  ) {
    return value;
  }
  return null;
};

export const isActiveOrganizer = (user?: {
  role?: string | null;
  status?: string | null;
}) => {
  if (normalizeRole(user?.role) !== "organizer") return false;
  const status = normalizeUserStatus(user?.status) ?? "ACTIVE";
  return status === "ACTIVE";
};

export const normalizeRole = (role?: string | null): AppRole => {
  const value = (role ?? "").toUpperCase().replace(/^ROLE_/, "");

  if (
    value === "ADMIN" ||
    value === "SUPER_ADMIN" ||
    value === "SUPERADMIN"
  ) {
    return "admin";
  }

  if (value === "ORGANIZER") return "organizer";
  return "player";
};

export const getHomePath = (
  role?: string | null,
  status?: string | null,
) => {
  const normalized = normalizeRole(role);
  if (normalized === "admin") return "/super-admin";
  if (normalized === "organizer") {
    return isActiveOrganizer({ role, status })
      ? "/organizer"
      : "/organizer/pending-approval";
  }
  return "/";
};

export const isPathAllowedForRole = (
  path: string,
  role?: string | null,
  status?: string | null,
) => {
  const normalized = normalizeRole(role);

  if (path.startsWith("/super-admin")) return normalized === "admin";
  if (path === "/organizer/pending-approval") return normalized === "organizer";
  if (path.startsWith("/organizer")) {
    return normalized === "organizer" && isActiveOrganizer({ role, status });
  }

  const playerOnly = [
    "/dashboard",
    "/profile",
    "/my-tournaments",
    "/changepass",
  ];
  if (playerOnly.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return normalized === "player";
  }

  return true;
};

export const resolvePostLoginPath = (
  role?: string | null,
  from?: string | null,
  status?: string | null,
) => {
  const home = getHomePath(role, status);
  if (!from || from === "/login" || from === "/sign-up" || from === "/otp") {
    return home;
  }
  return isPathAllowedForRole(from, role, status) ? from : home;
};
