import { useEffect, useRef, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import BannerCropModal from "../../../components/BannerCropModal";
import {
  GAME_BANNERS,
  GAME_COVERS,
  type PlatformGame,
  type PlatformGameDetail,
} from "../../../data/platformGames";

type Props = {
  game: PlatformGame | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    game: PlatformGame,
    files?: { banner?: File; cover?: File },
  ) => void | Promise<void>;
  saving?: boolean;
  error?: string | null;
};

const emptyDetail = (): PlatformGameDetail => ({
  genre: "",
  partner: "Official League Partner",
  description: "",
  about: "",
  developer: "",
  releaseDate: "",
  platforms: "",
});

const GameModal = ({ game, isOpen, onClose, onSave, saving, error: externalError }: Props) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<PlatformGame["status"]>("available");
  const [imageKey, setImageKey] = useState(GAME_COVERS[0].key);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedBanner, setUploadedBanner] = useState<string | null>(null);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [pendingBannerFile, setPendingBannerFile] = useState<File | null>(null);
  const [detail, setDetail] = useState<PlatformGameDetail>(emptyDetail());
  const [error, setError] = useState("");
  const [bannerCropSrc, setBannerCropSrc] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(game?.name ?? "");
    setStatus(game?.status ?? "available");
    setImageKey(game?.imageKey ?? GAME_COVERS[0].key);
    setUploadedImage(game?.image && !game.imageKey ? game.image : null);
    setUploadedBanner(
      game?.detail?.bannerImage &&
        !GAME_BANNERS.some((b) => b.src === game.detail?.bannerImage)
        ? game.detail.bannerImage
        : null,
    );
    setDetail({
      ...emptyDetail(),
      ...game?.detail,
    });
    setPendingCoverFile(null);
    setPendingBannerFile(null);
    setBannerCropSrc(null);
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
  }, [isOpen, game, onClose]);

  if (!isOpen) return null;

  const selectedCover =
    GAME_COVERS.find((c) => c.key === imageKey) ?? GAME_COVERS[0];
  const selectedBanner =
    GAME_BANNERS.find((b) => b.key === imageKey) ?? GAME_BANNERS[0];
  const previewImage = uploadedImage ?? selectedCover.src;
  const previewBanner = uploadedBanner ?? detail.bannerImage ?? selectedBanner.src;

  const handleFile = (file?: File, kind: "cover" | "banner" = "cover") => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (kind === "banner") {
        setBannerCropSrc(reader.result as string);
      } else {
        setUploadedImage(reader.result as string);
        setPendingCoverFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerCropConfirm = (file: File, previewDataUrl: string) => {
    setUploadedBanner(previewDataUrl);
    setPendingBannerFile(file);
    setBannerCropSrc(null);
    if (bannerRef.current) bannerRef.current.value = "";
  };

  const handleBannerCropCancel = () => {
    setBannerCropSrc(null);
    if (bannerRef.current) bannerRef.current.value = "";
  };

  const patchDetail = (patch: Partial<PlatformGameDetail>) =>
    setDetail((prev) => ({ ...prev, ...patch }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Game name is required.");
      return;
    }
    if (!detail.genre?.trim() || !detail.partner?.trim()) {
      setError("Genre and partner label are required for the game detail page.");
      return;
    }

    const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
    const id = game?.id ?? slug;
    const looksLikeDota = /dota/i.test(name);

    onSave(
      {
        id,
        name: name.trim(),
        image: previewImage,
        imageKey: uploadedImage
          ? looksLikeDota
            ? "dota2"
            : undefined
          : looksLikeDota
            ? "dota2"
            : selectedCover.key,
        status,
        detail: {
          genre: detail.genre.trim().toUpperCase(),
          partner: detail.partner.trim(),
          description: detail.description?.trim() || "",
          about: detail.about?.trim() || detail.description?.trim() || "",
          developer: detail.developer?.trim() || "—",
          releaseDate: detail.releaseDate?.trim() || "—",
          platforms: detail.platforms?.trim() || "—",
          bannerImage: pendingBannerFile ? undefined : previewBanner,
        },
      },
      {
        banner: pendingBannerFile ?? undefined,
        cover: pendingCoverFile ?? undefined,
      },
    );
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {game ? "Edit game" : "Add game"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Syncs to /games and game detail pages.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1 cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        {(error || externalError) && (
          <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">
            {error || externalError}
          </p>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700">Game name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Valorant"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Genre (1st badge)
            </label>
            <input
              value={detail.genre}
              onChange={(e) => patchDetail({ genre: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="TACTICAL SHOOTER"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Partner label (2nd)
            </label>
            <input
              value={detail.partner}
              onChange={(e) => patchDetail({ partner: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Official League Partner"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Hero description
          </label>
          <textarea
            value={detail.description}
            onChange={(e) => patchDetail({ description: e.target.value })}
            rows={3}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Short pitch shown on the game detail hero"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">About text</label>
          <textarea
            value={detail.about}
            onChange={(e) => patchDetail({ about: e.target.value })}
            rows={3}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Longer about text for the sidebar card"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Developer</label>
            <input
              value={detail.developer}
              onChange={(e) => patchDetail({ developer: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Riot Games"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Release date
            </label>
            <input
              value={detail.releaseDate}
              onChange={(e) => patchDetail({ releaseDate: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="June 2, 2020"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Platforms</label>
            <input
              value={detail.platforms}
              onChange={(e) => patchDetail({ platforms: e.target.value })}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              placeholder="Windows / Mobile"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Cover art</label>
          <div className="mt-2 flex gap-4">
            <div className="w-[100px] h-[130px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img
                src={previewImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <FiUpload size={14} />
                Upload cover
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0], "cover")}
              />
              <div className="grid grid-cols-3 gap-2">
                {GAME_COVERS.map((cover) => (
                  <button
                    key={cover.key}
                    type="button"
                    onClick={() => {
                      setImageKey(cover.key);
                      setUploadedImage(null);
                      setPendingCoverFile(null);
                      if (!uploadedBanner && !pendingBannerFile) {
                        const banner = GAME_BANNERS.find((b) => b.key === cover.key);
                        if (banner) patchDetail({ bannerImage: banner.src });
                      }
                    }}
                    className={`rounded-md overflow-hidden border-2 cursor-pointer ${
                      !uploadedImage && imageKey === cover.key
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={cover.src}
                      alt={cover.label}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Detail page banner
          </label>
          <div className="mt-2 flex gap-4 items-start">
            <div className="w-[240px] h-[60px] rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img
                src={previewBanner}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => bannerRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <FiUpload size={14} />
                Upload banner
              </button>
              <p className="text-xs text-gray-500 max-w-[220px]">
                Crop to 4:1 after upload so the detail hero matches the live page.
              </p>
            </div>
            <input
              ref={bannerRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                handleFile(e.target.files?.[0], "banner");
                e.target.value = "";
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as PlatformGame["status"])
            }
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="available">Available</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg cursor-pointer disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save game"}
          </button>
        </div>
      </form>

      <BannerCropModal
        open={Boolean(bannerCropSrc)}
        imageSrc={bannerCropSrc ?? ""}
        title={name.trim() || "Game detail banner"}
        onConfirm={handleBannerCropConfirm}
        onCancel={handleBannerCropCancel}
      />
    </div>
  );
};

export default GameModal;
