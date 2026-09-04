import { useEffect, useMemo, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { useOutletContext } from "react-router";
import BannerCropModal from "../../../../components/BannerCropModal";
import FormCard, { Field, inputClass } from "../../components/FormCard";
import type { TournamentOutletContext } from "../../components/TournamentLayout";
import {
  GAME_BANNERS,
  resolveTournamentCover,
  resolveTournamentDetailBanner,
} from "../../../../data/platformGames";
import {
  mapApiEventToTournament,
  uploadEventDetailBanner,
} from "../../../../services/eventApi";
import { getApiErrorMessage } from "../../../../api/axios";

const AppearanceSettings = () => {
  const { tournament, updateTournament } =
    useOutletContext<TournamentOutletContext>();
  const [banner, setBanner] = useState("#1e3a5f");
  const [accent, setAccent] = useState("#2563eb");
  const [cardKey, setCardKey] = useState(tournament.imageKey || "valorant");
  const [detailKey, setDetailKey] = useState(
    tournament.detailBannerKey || tournament.imageKey || "valorant",
  );
  const [detailUploadPreview, setDetailUploadPreview] = useState<string | null>(
    tournament.detailBannerUrl || null,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [bannerCropSrc, setBannerCropSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCardKey(tournament.imageKey || "valorant");
    setDetailKey(tournament.detailBannerKey || tournament.imageKey || "valorant");
    setDetailUploadPreview(tournament.detailBannerUrl || null);
  }, [
    tournament.id,
    tournament.imageKey,
    tournament.detailBannerKey,
    tournament.detailBannerUrl,
  ]);

  const cardPreview = useMemo(
    () =>
      resolveTournamentCover({
        imageKey: cardKey,
        gameName: tournament.game,
      }),
    [cardKey, tournament.game],
  );

  const detailPreview = useMemo(
    () =>
      resolveTournamentDetailBanner({
        detailBannerUrl: detailUploadPreview,
        detailBannerKey: detailKey,
        imageKey: cardKey,
        gameName: tournament.game,
      }),
    [detailUploadPreview, detailKey, cardKey, tournament.game],
  );

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);

    // Local / demo tournaments: preview only via object URL
    if (!/^\d+$/.test(tournament.id)) {
      const url = URL.createObjectURL(file);
      setDetailUploadPreview(url);
      updateTournament({
        detailBannerUrl: url,
        detailBannerKey: undefined,
      });
      return;
    }

    try {
      setUploading(true);
      const response = await uploadEventDetailBanner(tournament.id, file);
      const url = response.data.detailBannerUrl;
      const mapped = mapApiEventToTournament(response.data.event);
      setDetailUploadPreview(url);
      updateTournament({
        detailBannerUrl: url,
        detailBannerKey: mapped.detailBannerKey,
        image: mapped.image,
      });
    } catch (err) {
      setUploadError(getApiErrorMessage(err, "Banner upload failed."));
    } finally {
      setUploading(false);
    }
  };

  const handleBannerFilePick = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => setBannerCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleBannerCropConfirm = (file: File, previewDataUrl: string) => {
    setBannerCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setDetailUploadPreview(previewDataUrl);
    void handleUpload(file);
  };

  const handleBannerCropCancel = () => {
    setBannerCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    const image = resolveTournamentCover({
      imageKey: cardKey,
      gameName: tournament.game,
    });
    const hasCustomUpload = Boolean(
      detailUploadPreview &&
        (detailUploadPreview.startsWith("http://") ||
          detailUploadPreview.startsWith("https://") ||
          detailUploadPreview.startsWith("blob:")),
    );
    updateTournament({
      imageKey: cardKey,
      coverImageUrl: "",
      image,
      detailBannerKey: detailKey,
      detailBannerUrl: hasCustomUpload ? detailUploadPreview! : "",
    })
      .then(() => {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
      })
      .catch((err: unknown) => {
        setUploadError(
          err instanceof Error ? err.message : "Could not save appearance.",
        );
      });
  };

  return (
    <>
    <FormCard
      title="Appearance"
      description="Card cover is for browse cards. Detail banner is the wide hero on the tournament page."
    >
      <Field label="Tournament card cover (browse cards)">
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 max-w-md">
          <img
            src={cardPreview}
            alt="Card preview"
            className="w-full h-[140px] object-cover"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {GAME_BANNERS.map((item) => (
            <button
              key={`card-${item.key}`}
              type="button"
              onClick={() => setCardKey(item.key)}
              className={`shrink-0 w-[96px] rounded overflow-hidden border-2 transition cursor-pointer ${
                cardKey === item.key
                  ? "border-[#4ea8ff]"
                  : "border-transparent opacity-90 hover:opacity-100"
              }`}
              title={item.label}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-[56px] object-cover"
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          Uses images from Cards (e.g. Free Fire card art).
        </p>
      </Field>

      <Field label="Detail page banner (custom hero)">
        <div className="mb-3 rounded-lg overflow-hidden border border-gray-200 max-w-full aspect-[4/1]">
          <img
            src={detailPreview}
            alt="Detail banner preview"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {GAME_BANNERS.map((item) => (
            <button
              key={`detail-${item.key}`}
              type="button"
              onClick={() => {
                setDetailKey(item.key);
                setDetailUploadPreview(null);
              }}
              className={`shrink-0 w-[96px] rounded overflow-hidden border-2 transition cursor-pointer ${
                !detailUploadPreview && detailKey === item.key
                  ? "border-[#4ea8ff]"
                  : "border-transparent opacity-90 hover:opacity-100"
              }`}
              title={item.label}
            >
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-[56px] object-cover"
              />
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 disabled:opacity-60"
          >
            <FiUpload size={14} />
            Upload banner
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={(e) => {
              handleBannerFilePick(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-gray-500 max-w-md leading-relaxed">
            Pick a preset above, or upload your own — you&apos;ll crop to 4:1
            before it uploads. Does not change the browse card cover.
          </p>
        </div>
        {uploading && (
          <p className="text-xs text-gray-500 mt-2">Uploading banner...</p>
        )}
        {uploadError && (
          <p className="text-sm text-red-600 mt-2 font-medium">{uploadError}</p>
        )}
      </Field>

      <Field label="Banner color">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className={inputClass}
          />
        </div>
      </Field>
      <Field label="Accent color">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            className={inputClass}
          />
        </div>
      </Field>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
        >
          Save appearance
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-medium">Saved</span>
        )}
      </div>
    </FormCard>

    <BannerCropModal
      open={Boolean(bannerCropSrc)}
      imageSrc={bannerCropSrc ?? ""}
      title={tournament.name || tournament.game || "Tournament detail banner"}
      onConfirm={handleBannerCropConfirm}
      onCancel={handleBannerCropCancel}
    />
    </>
  );
};

export default AppearanceSettings;
