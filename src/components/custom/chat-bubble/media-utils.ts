/**
 * Detects video attachments from MIME type or URL extension.
 */
export function isVideoMedia(
  mediaType?: "image" | "video",
  contentType?: string,
  mediaUrl?: string
): boolean {
  if (mediaType === "video") {
    return true;
  }

  if (contentType?.startsWith("video/")) {
    return true;
  }

  if (mediaUrl) {
    const lowerUrl = mediaUrl.toLowerCase();
    return lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".3gp");
  }

  return false;
}
