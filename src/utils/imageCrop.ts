import type { PixelCrop } from "react-image-crop";

/** Matches game/tournament detail hero (~full width × 340px on desktop). */
export const DETAIL_BANNER_ASPECT = 4;
export const DETAIL_BANNER_OUTPUT_WIDTH = 1920;
export const DETAIL_BANNER_OUTPUT_HEIGHT = 480;

export async function dataUrlToFile(dataUrl: string, filename: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export function cropImageToDataUrl(
  image: HTMLImageElement,
  crop: PixelCrop,
  outputWidth = DETAIL_BANNER_OUTPUT_WIDTH,
  outputHeight = DETAIL_BANNER_OUTPUT_HEIGHT,
) {
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

export async function cropImageToFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  filename = "banner.jpg",
) {
  const dataUrl = cropImageToDataUrl(image, crop);
  if (!dataUrl) throw new Error("Could not crop image.");
  return dataUrlToFile(dataUrl, filename);
}
