import api from "../api/axios";

export type ApiUserStatus =
  | "ACTIVE"
  | "PENDING"
  | "REJECTED"
  | "INACTIVE"
  | "SUSPENDED";

export type ApiUser = {
  id: number;
  username: string;
  fullName?: string | null;
  contact?: string | null;
  email: string;
  role: string;
  authProvider?: string;
  profilePhotoUrl?: string | null;
  status?: ApiUserStatus | null;
  bio?: string | null;
  preferredGames?: string | null;
};

export const changePassword = (
  id: string | number,
  currentPassword: string,
  newPassword: string,
) =>
  api.put<string>(`/api/users/${id}/password`, {
    currentPassword,
    newPassword,
  });

export const getUserById = (id: string | number) =>
  api.get<ApiUser>(`/api/users/${id}`);

export const getUsersByRole = (role: "PLAYER" | "ORGANIZER" | "ADMIN") =>
  api.get<ApiUser[]>(`/api/users`, { params: { role } });

export const updateUserProfile = (
  id: string | number,
  data: Partial<Pick<ApiUser, "username" | "fullName" | "email" | "contact" | "bio">>,
) => api.put<ApiUser>(`/api/users/${id}`, data);

export const updatePreferredGames = (
  id: string | number,
  preferredGames: string[],
) =>
  api.put<ApiUser>(`/api/users/${id}/preferred-games`, {
    preferredGames,
  });

export const updateUserStatus = (
  id: string | number,
  status: ApiUserStatus,
) => api.put<ApiUser>(`/api/users/${id}/status`, { status });

export const deleteUser = (id: string | number) =>
  api.delete(`/api/users/${id}`);

export const uploadProfilePhoto = (id: string | number, file: File) => {
  const formData = new FormData();
  formData.append("photo", file);
  return api.post<{ photoUrl: string }>(`/api/users/${id}/upload-photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const dataUrlToFile = async (dataUrl: string, filename: string) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
};
