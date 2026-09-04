import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  DETAIL_BANNER_ASPECT,
  DETAIL_BANNER_OUTPUT_HEIGHT,
  DETAIL_BANNER_OUTPUT_WIDTH,
  cropImageToDataUrl,
  cropImageToFile,
} from "../utils/imageCrop";

type Props = {
  open: boolean;
  imageSrc: string;
  title?: string;
  onConfirm: (file: File, previewDataUrl: string) => void;
  onCancel: () => void;
};

const defaultCrop = (): Crop => ({
  unit: "%",
  width: 90,
  height: 90 / DETAIL_BANNER_ASPECT,
  x: 5,
  y: 5,
});

const DetailHeroPreview = ({
  previewSrc,
  title,
}: {
  previewSrc: string | null;
  title: string;
}) => (
  <div className="space-y-2">
    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
      Detail page preview
    </p>
    <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
      {previewSrc ? (
        <img
          src={previewSrc}
          alt=""
          className="w-full h-[100px] object-cover object-center"
        />
      ) : (
        <div className="w-full h-[100px] bg-gray-800" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
      <div
        className="absolute inset-y-0 left-0 w-[42%] border-r border-dashed border-white/35 bg-black/15 pointer-events-none"
        aria-hidden
      />
      <div className="absolute inset-0 flex flex-col justify-end px-3 pb-3 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-blue-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
            GENRE
          </span>
          <span className="text-gray-300 text-[9px]">Partner label</span>
        </div>
        <p className="text-white font-bold text-sm leading-tight truncate">
          {title}
        </p>
        <p className="text-gray-300 text-[10px] line-clamp-2 mt-0.5 max-w-[55%]">
          Hero description appears in this left area.
        </p>
      </div>
    </div>
    <p className="text-xs text-gray-500 leading-relaxed">
      Dashed zone is where title and description sit. Place the main subject on
      the right.
    </p>
  </div>
);

const BannerCropModal = ({
  open,
  imageSrc,
  title = "Crop detail banner",
  onConfirm,
  onCancel,
}: Props) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>(defaultCrop());
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCrop(defaultCrop());
    setCompletedCrop(null);
    setPreviewSrc(null);
    setApplying(false);
  }, [open, imageSrc]);

  const updatePreview = useCallback((pixelCrop: PixelCrop | null) => {
    if (!imgRef.current || !pixelCrop?.width || !pixelCrop?.height) {
      setPreviewSrc(null);
      return;
    }
    const dataUrl = cropImageToDataUrl(imgRef.current, pixelCrop, 640, 160);
    setPreviewSrc(dataUrl);
  }, []);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      const next = centerCrop(
        makeAspectCrop(
          { unit: "%", width: 90 },
          DETAIL_BANNER_ASPECT,
          width,
          height,
        ),
        width,
        height,
      );
      setCrop(next);
      const pixel = convertToPixelCrop(next, width, height);
      setCompletedCrop(pixel);
      updatePreview(pixel);
    },
    [updatePreview],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !applying) onCancel();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, applying, onCancel]);

  const handleApply = async () => {
    if (!imgRef.current) return;

    const pixelCrop =
      completedCrop ??
      (crop.width && crop.height
        ? convertToPixelCrop(
            crop,
            imgRef.current.width,
            imgRef.current.height,
          )
        : null);

    if (!pixelCrop?.width || !pixelCrop?.height) return;

    try {
      setApplying(true);
      const file = await cropImageToFile(imgRef.current, pixelCrop);
      const preview = cropImageToDataUrl(imgRef.current, pixelCrop, 640, 160);
      onConfirm(file, preview ?? file.name);
    } finally {
      setApplying(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70" onClick={applying ? undefined : onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 max-h-[92vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Crop to{" "}
          <span className="font-medium text-gray-700">
            {DETAIL_BANNER_OUTPUT_WIDTH}×{DETAIL_BANNER_OUTPUT_HEIGHT}
          </span>{ " "}
          (4:1). This matches the wide hero on game and tournament detail pages.
        </p>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-5">
          <div className="flex justify-center bg-gray-50 rounded-lg p-3 border border-gray-100">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => {
                setCompletedCrop(c);
                updatePreview(c);
              }}
              aspect={DETAIL_BANNER_ASPECT}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Banner crop"
                onLoad={onImageLoad}
                className="max-h-[320px] object-contain"
              />
            </ReactCrop>
          </div>

          <DetailHeroPreview previewSrc={previewSrc} title={title} />
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            disabled={applying}
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-100 cursor-pointer transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleApply()}
            disabled={applying || !crop.width}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg text-sm cursor-pointer transition disabled:opacity-60"
          >
            {applying ? "Applying..." : "Apply crop"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BannerCropModal;
