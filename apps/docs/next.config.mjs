import path from "node:path";
import { fileURLToPath } from "node:url";
const appDir = path.dirname(fileURLToPath(import.meta.url));
export default {
  outputFileTracingRoot: path.resolve(appDir, "../.."),
  outputFileTracingIncludes: {
    "/api/source": ["../../src/components/ui/v2/*.tsx"],
  },
  devIndicators: false,
  env: {
    NEXT_PUBLIC_PREVIEW_ORIGIN: process.env.NEXT_PUBLIC_PREVIEW_ORIGIN || "",
  },
};
