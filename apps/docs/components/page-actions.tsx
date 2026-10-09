"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function PageActions({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
}) {
  const [copied, setCopied] = useState<"command" | "page" | null>(null);
  const [error, setError] = useState("");
  const command = `npx myoperator-ui add v2-${slug}`;
  async function copy(mode: "command" | "page") {
    try {
      let text = command;
      if (mode === "page") {
        const response = await fetch(
          `/api/source?slug=${encodeURIComponent(slug)}&mode=component`
        );
        if (!response.ok) throw new Error("Source unavailable");
        const data = await response.json();
        text =
          `# ${title}\n\n${description}\n\n## Installation\n\n${command}\n\n## Source\n\n` +
          data.source;
      }
      await navigator.clipboard.writeText(text);
      setCopied(mode);
      setError("");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setError("Could not copy. Please try again.");
    }
  }
  return (
    <>
      <div className="arc-page-actions">
        <div className="arc-install-command">
          <span aria-hidden="true">$</span>
          <code>{command}</code>
          <button
            aria-label="Copy install command"
            onClick={() => copy("command")}
          >
            {copied === "command" ? <Check /> : <Copy />}
          </button>
        </div>
        <button className="arc-copy-page" onClick={() => copy("page")}>
          {copied === "page" ? <Check /> : <Copy />}
          {copied === "page" ? "Copied" : "Copy page"}
        </button>
      </div>
      {error && (
        <p role="status" className="control-error">
          {error}
        </p>
      )}
    </>
  );
}
