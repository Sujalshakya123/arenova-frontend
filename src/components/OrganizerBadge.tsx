import { useState } from "react";

function getInitials(name: string): string {
  const parts = name.trim().split(/[\s-_]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

type OrganizerBadgeProps = {
  name: string;
  photoUrl?: string | null;
  className?: string;
  /** Tournament cards use a white body — default light for readable contrast. */
  surface?: "light" | "dark";
};

export default function OrganizerBadge({
  name,
  photoUrl,
  className = "mb-3",
  surface = "light",
}: OrganizerBadgeProps) {
  const trimmed = name.trim();
  const [photoFailed, setPhotoFailed] = useState(false);
  if (!trimmed) return <div className={className} />;

  const showPhoto = Boolean(photoUrl?.trim()) && !photoFailed;
  const onDark = surface === "dark";

  const pillClass = onDark
    ? "inline-flex items-center gap-1.5 max-w-full rounded-full bg-white/10 border border-white/15 px-2 py-1 text-xs font-semibold text-gray-100"
    : "inline-flex items-center gap-1.5 max-w-full rounded-full bg-gray-100 border border-gray-200 px-2 py-1 text-xs font-semibold text-gray-800";

  const initialsClass = onDark
    ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white"
    : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white";

  return (
    <div className={`inline-flex max-w-full ${className}`}>
      <span className={pillClass}>
        {showPhoto ? (
          <img
            src={photoUrl!.trim()}
            alt=""
            className="h-5 w-5 shrink-0 rounded-full object-cover"
            onError={() => setPhotoFailed(true)}
          />
        ) : (
          <span className={initialsClass} aria-hidden>
            {getInitials(trimmed)}
          </span>
        )}
        <span className="truncate">{trimmed}</span>
      </span>
    </div>
  );
}
