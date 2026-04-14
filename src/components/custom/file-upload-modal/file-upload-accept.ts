/**
 * Parses a comma-separated HTML accept string (e.g. ".doc,.docx,.pdf")
 * into normalized lowercase extensions without the leading dot.
 */
export function parseAcceptedExtensions(accept: string): string[] {
  return accept
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .map((part) => (part.startsWith(".") ? part.slice(1) : part))
    .filter(Boolean);
}

/**
 * Returns true if the file name’s extension is in the accept list.
 * Drag-and-drop bypasses the file input’s `accept` attribute, so callers
 * should validate with this before uploading.
 */
export function isFileExtensionAllowed(fileName: string, accept: string): boolean {
  const allowed = parseAcceptedExtensions(accept);
  if (allowed.length === 0) {
    return false;
  }
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot < 1 || lastDot === fileName.length - 1) {
    return false;
  }
  const ext = fileName.slice(lastDot + 1).toLowerCase();
  return allowed.includes(ext);
}
