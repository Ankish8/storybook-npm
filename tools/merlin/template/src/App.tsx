/*
 * Replaced by `/build-screen` with the rebuilt screen.
 *
 * Rules that survive the replacement:
 *   - import components per file from "@/components/ui/…" or "@/components/custom/…",
 *     never from the "@" barrel (it drags the whole library into the bundle)
 *   - copy text verbatim from the context pack; never paraphrase a designer's words
 *   - style with semantic token classes (bg-semantic-*), never raw hex
 *   - tag each design-system component with data-component="<Name>"
 */
export default function App() {
  return (
    <main className="p-10">
      <p className="text-semantic-text-secondary">
        Empty twin. Run <code>/build-screen</code> to fill this in.
      </p>
    </main>
  );
}
