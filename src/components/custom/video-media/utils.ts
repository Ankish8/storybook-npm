import type { VideoMediaPayload } from "./types";

export function urlPathWithoutQuery(url: string): string {
  return url.trim().split(/[?#]/)[0];
}

const SAFARI_MEDIA_FRAGMENT = "#t=0.001";

export function appendSafariMediaFragment(url: string): string {
  const trimmed = url.trim();
  if (!trimmed || /#t=/i.test(trimmed)) {
    return trimmed;
  }

  const hashIndex = trimmed.indexOf("#");
  const base = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
  return `${base}${SAFARI_MEDIA_FRAGMENT}`;
}

export function resolveVideoMimeType(
  url: string,
  fileType?: string
): string | undefined {
  const mime = fileType?.trim();
  if (mime) {
    return mime;
  }

  const path = urlPathWithoutQuery(url).toLowerCase();
  if (path.endsWith(".mp4") || path.endsWith(".3gp")) {
    return "video/mp4";
  }
  if (path.endsWith(".webm")) {
    return "video/webm";
  }
  if (path.endsWith(".mov")) {
    return "video/quicktime";
  }

  return undefined;
}

function isVideoMedia(contentType?: string, mediaUrl?: string): boolean {
  if (contentType?.startsWith("video/")) {
    return true;
  }

  if (!mediaUrl) {
    return false;
  }

  const lowerUrl = mediaUrl.toLowerCase();
  return (
    lowerUrl.endsWith(".mp4") ||
    lowerUrl.endsWith(".3gp") ||
    lowerUrl.endsWith(".webm") ||
    lowerUrl.endsWith(".mov")
  );
}

export function hasDisplayableVideoThumbnail(
  media: Pick<VideoMediaPayload, "url" | "thumbnailUrl" | "fileType">
): boolean {
  const thumb = media.thumbnailUrl?.trim();
  if (!thumb) return false;
  if (thumb === media.url?.trim()) return false;
  if (isVideoMedia(undefined, urlPathWithoutQuery(thumb))) {
    return false;
  }
  return true;
}
