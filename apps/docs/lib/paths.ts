/** Prefix plain asset, fetch and iframe URLs; Next navigation handles its own basePath. */
export function docsPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_DOCS_BASE_PATH || "";
  return `${base}${path}`;
}
