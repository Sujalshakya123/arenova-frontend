import { useEffect, useState, type FormEvent } from "react";
import { FiX } from "react-icons/fi";
import ConfirmModal from "../../../components/ConfirmModal";
import { getApiErrorMessage } from "../../../api/axios";
import { notifyNotificationChange } from "../../../data/notificationStore";
import {
  addPlayerAnnouncement,
  type AnnouncementType,
} from "../../../data/announcementStore";
import { createEventAnnouncement } from "../../../services/notificationApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tournamentName: string;
  tournamentId: string;
  type?: AnnouncementType;
  defaultTitle?: string;
  defaultMessage?: string;
};

const OrganizerAnnounceModal = ({
  isOpen,
  onClose,
  tournamentName,
  tournamentId,
  type = "announcement",
  defaultTitle = "",
  defaultMessage = "",
}: Props) => {
  const [title, setTitle] = useState(defaultTitle);
  const [message, setMessage] = useState(defaultMessage);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSendConfirm, setShowSendConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTitle(defaultTitle);
    setMessage(defaultMessage);
    setSent(false);
    setError("");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, defaultTitle, defaultMessage, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      setError("");

      if (/^\d+$/.test(tournamentId)) {
        await createEventAnnouncement(tournamentId, {
          title: title.trim(),
          message: message.trim(),
          type: type === "bracket" ? "BRACKET" : "ANNOUNCEMENT",
        });
      } else {
        addPlayerAnnouncement({
          title: title.trim(),
          message: message.trim(),
          tournamentName,
          tournamentId,
          type,
        });
      }

      notifyNotificationChange();
      setSent(true);
      setShowSendConfirm(false);
      window.setTimeout(onClose, 800);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send announcement."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#0B0F1A]/40" />
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          setShowSendConfirm(true);
        }}
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Announce to players
            </h2>
            <p className="text-sm text-gray-500">
              Registered players (pending or confirmed) will see this in Notifications
              {type === "bracket" ? " and can open the bracket." : "."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 cursor-pointer">
            <FiX size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Message"
            className="w-full border rounded-lg px-3 py-2.5 text-sm"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {sent && <p className="text-sm text-emerald-600">Sent to players.</p>}
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#4caf50] rounded-lg cursor-pointer disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send announcement"}
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showSendConfirm}
        title="Send announcement?"
        message={`Send this update to registered players in ${tournamentName}?`}
        confirmLabel="Send"
        busy={submitting}
        onConfirm={() => void handleSubmit()}
        onCancel={() => {
          if (!submitting) setShowSendConfirm(false);
        }}
      />
    </div>
  );
};

export default OrganizerAnnounceModal;
