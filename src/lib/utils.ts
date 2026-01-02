import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveImageSrc(src: string): string {
  const id = extractDriveFileId(src);
  if (id) {
    return getDriveViewHref(id);
  }
  return src;
}

export function resolveDownloadHref(src: string): string {
  const id = extractDriveFileId(src);
  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return src;
}

export function getDriveViewHref(id: string): string {
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

export function getDriveThumbHref(id: string, size = 2000): string {
  // Thumbnail endpoint often works when view fails; size acts as max width
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}

export function resolveDriveThumb(src: string, size = 2000): string {
  const id = extractDriveFileId(src);
  return id ? getDriveThumbHref(id, size) : src;
}

function extractDriveFileId(input: string): string | null {
  const src = (input || "").trim();
  if (!/drive\.google\.com/i.test(src)) return null;
  const fromPath = src.match(/\/file\/d\/([^/]+)/i)?.[1];
  if (fromPath) return fromPath;
  const idParam = src.match(/[?&]id=([^&]+)/i)?.[1];
  return idParam ?? null;
}
