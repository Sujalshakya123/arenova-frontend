import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import ConfirmModal from "../../../components/ConfirmModal";
import { getApiErrorMessage } from "../../../api/axios";
import {
  createPlatformAnnouncement,
  type PlatformAnnouncementAudience,
} from "../../../services/adminApi";
import { notifyNotificationChange } from "../../../data/notificationStore";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const audiences: PlatformAnnouncementAudience[] = [
  "All Users",
  "Organizers Only",
  "Players Only",
];

const CreateAnnouncementModal = ({ isOpen, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<PlatformAnnouncementAudience>(audiences[0]);
  const [audienceOpen, setAudienceOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);
  const audienceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (audienceOpen) {
          setAudienceOpen(false);
          return;
        }
        onClose();
      }
    };

    const onClickOutside = (e: MouseEvent) => {
      if (audienceRef.current && !audienceRef.current.contains(e.target as Node)) {
        setAudienceOpen(false);
      }
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen, onClose, audienceOpen]);

  if (!isOpen) return null;

  const handlePublish = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      const response = await createPlatformAnnouncement({
        title: title.trim(),
        message: message.trim(),
        audience,
      });
      notifyNotificationChange();
      setSuccess(
        `Published to ${response.data.recipientCount} recipient${
          response.data.recipientCount === 1 ? "" : "s"
        }.`,
      );
      setTitle("");
      setMessage("");
      setAudience(audiences[0]);
      window.setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 900);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not publish announcement."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Create Announcement</h2>
            <p className="text-sm text-gray-500 mt-1">
              Send a platform-wide message to users or organizers.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Dashain Cup registration opens"
            />
          </div>

          <div ref={audienceRef} className="relative">
            <label className="text-sm font-medium text-gray-700">Audience</label>
            <button
              type="button"
              onClick={() => setAudienceOpen((v) => !v)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm flex items-center justify-between cursor-pointer bg-white"
            >
              {audience}
              <FiChevronDown size={16} className="text-gray-400" />
            </button>
            {audienceOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                {audiences.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setAudience(item);
                      setAudienceOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder="Write your announcement..."
            />
          </div>
        </div>

        {error && <p className="text-sm text-rose-600 mt-4">{error}</p>}
        {success && <p className="text-sm text-emerald-600 mt-4">{success}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm cursor-pointer">
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => setShowPublishConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>

      <ConfirmModal
        open={showPublishConfirm}
        title="Publish announcement?"
        message={`Send this announcement to ${audience}?`}
        confirmLabel="Publish"
        busy={submitting}
        onConfirm={() => {
          setShowPublishConfirm(false);
          void handlePublish();
        }}
        onCancel={() => {
          if (!submitting) setShowPublishConfirm(false);
        }}
      />
    </div>
  );
};

export default CreateAnnouncementModal;
