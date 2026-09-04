import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FiCamera } from "react-icons/fi";
import FormCard, { Field, inputClass } from "../components/FormCard";
import { useAuth } from "../../../context/AuthContext";
import { getApiErrorMessage } from "../../../api/axios";
import {
  dataUrlToFile,
  getUserById,
  updateUserProfile,
  uploadProfilePhoto,
} from "../../../services/userApi";

const ProfileGeneral = () => {
  const { userDTO, profileImage, updateUser, setProfileImage } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userDTO?.username ?? "");
  const [org, setOrg] = useState("");
  const [pendingPhotoDataUrl, setPendingPhotoDataUrl] = useState<string | null>(null);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userDTO?.id || String(userDTO.id).includes("@")) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getUserById(userDTO.id);
        const user = response.data;
        setName(user.username ?? "");
        setOrg(user.fullName ?? "");
        if (user.profilePhotoUrl) {
          setProfileImage(user.profilePhotoUrl);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load profile."));
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [userDTO?.id, setProfileImage]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPendingPhotoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const nextName = name.trim();
    const nextOrg = org.trim();
    if (!userDTO?.id || String(userDTO.id).includes("@")) {
      setError("Please log out and log in again so your account id can be loaded.");
      return;
    }
    if (!nextName) {
      setError("Display name is required.");
      return;
    }

    try {
      setSubmitting(true);
      const updated = await updateUserProfile(userDTO.id, {
        username: nextName,
        fullName: nextOrg || undefined,
      });
      setOrg(updated.data.fullName ?? "");

      if (pendingPhotoFile) {
        const uploaded = await uploadProfilePhoto(userDTO.id, pendingPhotoFile);
        if (uploaded.data.photoUrl) {
          setProfileImage(uploaded.data.photoUrl);
        }
      } else if (pendingPhotoDataUrl) {
        const file = await dataUrlToFile(pendingPhotoDataUrl, "organizer-photo.jpg");
        const uploaded = await uploadProfilePhoto(userDTO.id, file);
        if (uploaded.data.photoUrl) {
          setProfileImage(uploaded.data.photoUrl);
        }
      }

      updateUser({ username: nextName });
      setSuccess("Saved!");
      setPendingPhotoDataUrl(null);
      setPendingPhotoFile(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save profile."));
    } finally {
      setSubmitting(false);
    }
  };

  const previewPhoto = pendingPhotoDataUrl ?? profileImage;
  const avatarInitial = (name.trim() || userDTO?.username || "O").charAt(0).toUpperCase();

  if (loading) {
    return (
      <FormCard title="General settings">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </FormCard>
    );
  }

  return (
    <FormCard title="General settings">
      <Field label="Profile picture">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-900 text-white flex items-center justify-center cursor-pointer shrink-0"
          >
            {previewPhoto ? (
              <img src={previewPhoto} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-semibold">{avatarInitial}</span>
            )}
            <span className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition">
              <FiCamera size={16} />
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
          <div>
            <p className="text-sm font-medium text-gray-900">Profile photo</p>
            <p className="text-xs text-gray-500">
              {pendingPhotoDataUrl
                ? "Preview — click Save profile to upload"
                : "Shown in the organizer sidebar"}
            </p>
          </div>
        </div>
      </Field>
      <Field label="Display name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Organization">
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          className={inputClass}
          placeholder="Optional organization name"
        />
      </Field>
      <button
        type="button"
        onClick={() => void handleSave()}
        disabled={submitting}
        className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg cursor-pointer"
      >
        {submitting ? "Saving..." : "Save profile"}
      </button>

      {error && <p className="text-sm text-red-600 font-medium mt-3">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-700 font-medium mt-3">{success}</p>
      )}
    </FormCard>
  );
};

export default ProfileGeneral;
