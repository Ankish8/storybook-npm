import type { VideoMediaPayload } from "./types";

export function urlPathWithoutQuery(url: string): string {
  return url.trim().split(/[?#]/)[0];
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
  if (isVideoMedia(media.fileType, urlPathWithoutQuery(thumb))) {
    return false;
  }
  return true;
}
