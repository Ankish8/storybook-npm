const BLOB_URL_REVOKE_DELAY_MS = 60_000;

function urlPathWithoutQuery(url: string): string {
  return url.trim().split(/[?#]/)[0];
}

function filenameFromUrl(url: string): string {
  const path = urlPathWithoutQuery(url);
  const segment = path.split("/").filter(Boolean).pop();
  return segment || "download";
}

function isSameOriginUrl(url: string): boolean {
  try {
    return (
      new URL(url, window.location.href).origin === window.location.origin
    );
  } catch {
    return false;
  }
}

function triggerAnchorDownload(href: string, download: string): void {
  const link = document.createElement("a");
  link.href = href;
  link.download = download;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function scheduleBlobUrlRevoke(blobUrl: string): void {
  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, BLOB_URL_REVOKE_DELAY_MS);
}

/**
 * Triggers a browser download for a media URL. Uses fetch+blob for remote URLs when
 * possible; falls back to anchor download or opening in a new tab on failure.
 */
export async function downloadMediaFile(
  url: string,
  filename?: string
): Promise<void> {
  const trimmed = url.trim();
  if (!trimmed || trimmed === "#") {
    return;
  }

  const name = filename?.trim() || filenameFromUrl(trimmed);

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    triggerAnchorDownload(trimmed, name);
    return;
  }

  try {
    const response = await fetch(trimmed, {
      credentials: isSameOriginUrl(trimmed) ? "include" : "omit",
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    triggerAnchorDownload(blobUrl, name);
    scheduleBlobUrlRevoke(blobUrl);
  } catch {
    window.open(trimmed, "_blank", "noopener,noreferrer");
  }
}
