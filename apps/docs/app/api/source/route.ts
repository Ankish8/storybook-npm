import { readFile, realpath } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { getComponent } from "@docs/lib/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Both supported launch locations are local to this checkout: apps/docs or root.
async function sourceDirectory(): Promise<string | undefined> {
  for (const root of [resolve(process.cwd(), "../.."), process.cwd()]) {
    try {
      return await realpath(join(root, "src/components/ui/v2"));
    } catch {
      // Try the other supported launch location without exposing host paths.
    }
  }
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const slug = params.get("slug") ?? "";
  const mode = params.get("mode") ?? "component";

  if (!getComponent(slug)) {
    return Response.json({ error: "Unknown component." }, { status: 404 });
  }
  if (mode !== "component" && mode !== "story") {
    return Response.json(
      { error: "Use component or story mode." },
      { status: 400 }
    );
  }

  const directory = await sourceDirectory();
  if (!directory) {
    return Response.json({ error: "Source is unavailable." }, { status: 503 });
  }
  const file = `${slug}${mode === "story" ? ".stories" : ""}.tsx`;

  try {
    const path = await realpath(join(directory, file));
    // Reject an out-of-directory symlink even for a known catalog entry.
    if (dirname(path) !== directory) {
      return Response.json(
        { error: "Source is unavailable." },
        { status: 404 }
      );
    }
    const source = await readFile(path, "utf8");
    return Response.json(
      { slug, mode, filename: `src/components/ui/v2/${file}`, source },
      { headers: { "Cache-Control": "no-cache" } }
    );
  } catch {
    return Response.json({ error: "Source is unavailable." }, { status: 404 });
  }
}
