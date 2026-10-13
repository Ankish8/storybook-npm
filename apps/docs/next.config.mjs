import path from "node:path";
import { fileURLToPath } from "node:url";
const appDir = path.dirname(fileURLToPath(import.meta.url));
export default {
  basePath: process.env.NEXT_PUBLIC_DOCS_BASE_PATH || "",
  outputFileTracingRoot: path.resolve(appDir, "../.."),
  outputFileTracingIncludes: {
    "/api/source": ["../../src/components/ui/v2/*.tsx"],
  },
  devIndicators: false,
  env: {
    NEXT_PUBLIC_DOCS_BASE_PATH: process.env.NEXT_PUBLIC_DOCS_BASE_PATH || "",
    NEXT_PUBLIC_PREVIEW_ORIGIN: process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || "",
  },
};
