import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { FiArrowLeft, FiCamera, FiCheck, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../api/axios";
import {
  changePassword,
  updateUserProfile,
  uploadProfilePhoto,
} from "../../services/userApi";
import { getPasswordPolicyError, PASSWORD_POLICY_MESSAGE } from "../../utils/passwordPolicy";
import PasswordInput from "../../components/PasswordInput";

const Settings = () => {
  const navigate = useNavigate();
  const { userDTO, profileImage, setProfileImage, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(userDTO?.username ?? "");
  const [email, setEmail] = useState(userDTO?.email ?? "");
  const [savedProfile, setSavedProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleProfileSave = async (e: FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setSavedProfile(false);

    if (!userDTO?.id || String(userDTO.id).includes("@")) {
      setProfileError("Please log out and log in again so your account id can be loaded.");
      return;
    }

    try {
      setProfileSaving(true);
      await updateUserProfile(userDTO.id, {
        username: username.trim(),
        email: email.trim(),
      });
      if (pendingPhoto) {
        const uploaded = await uploadProfilePhoto(userDTO.id, pendingPhoto);
        if (uploaded.data.photoUrl) {
          setProfileImage(uploaded.data.photoUrl);
        }
      }
      updateUser({ username: username.trim(), email: email.trim() });
      setPendingPhoto(null);
      setSavedProfile(true);
      window.setTimeout(() => setSavedProfile(false), 2000);
    } catch (err) {
      setProfileError(getApiErrorMessage(err, "Could not save profile."));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setSavedPassword(false);

    if (!userDTO?.id || String(userDTO.id).includes("@")) {
      setPasswordError("Please log out and log in again so your account id can be loaded.");
      return;
    }
    if (!currentPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }
    const passwordError = getPasswordPolicyError(newPassword);
    if (passwordError) {
      setPasswordError(passwordError);
      return;
    }

    try {
      setPasswordSaving(true);
      await changePassword(userDTO.id, currentPassword, newPassword);
      setSavedPassword(true);
      setCurrentPassword("");
      setNewPassword("");
      window.setTimeout(() => setSavedPassword(false), 2000);
    } catch (err) {
      setPasswordError(getApiErrorMessage(err, "Could not update password."));
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingPhoto(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-800 cursor-pointer"
      >
        <FiArrowLeft size={16} />
        Back
      </button>

      <p className="text-sm text-gray-700">Manage your super admin profile and account</p>

      <form
        onSubmit={(e) => void handleProfileSave(e)}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-5"
      >
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <FiUser size={16} />
          Profile
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-900 text-white flex items-center justify-center cursor-pointer"
          >
            {profileImage ? (
              <img src={profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold">
                {userDTO?.username?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
            )}
            <span className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
              <FiCamera size={16} />
            </span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleImageChange} />
          <div>
            <p className="text-sm font-medium text-gray-900">Profile photo</p>
            <p className="text-sm text-gray-700">Shown in the admin header</p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        {profileError && <p className="text-sm text-rose-600">{profileError}</p>}
        <button
          type="submit"
          disabled={profileSaving}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer disabled:opacity-60"
        >
          {savedProfile ? <FiCheck size={14} /> : null}
          {profileSaving ? "Saving..." : "Save changes"}
        </button>
      </form>

      <form
        onSubmit={(e) => void handlePasswordSave(e)}
        className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
      >
        <div className="flex items-center gap-2 text-gray-900 font-semibold">
          <FiLock size={16} />
          Change password
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Current password</label>
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">New password</label>
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-gray-500 text-xs mt-1">{PASSWORD_POLICY_MESSAGE}</p>
        </div>
        {passwordError && <p className="text-sm text-rose-600">{passwordError}</p>}
        <button
          type="submit"
          disabled={passwordSaving}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer disabled:opacity-60"
        >
          {savedPassword ? <FiCheck size={14} /> : null}
          {passwordSaving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
