import { useState } from "react";
import {
  FileUpload,
  type FileUploadItem,
} from "@/components/ui/v2/file-upload";

export default function Cancel() {
  const [log, setLog] = useState("");

  function upload(
    item: FileUploadItem,
    {
      onProgress,
      signal,
    }: { onProgress: (percent: number) => void; signal: AbortSignal }
  ) {
    return new Promise<void>((resolve) => {
      let percent = 0;
      const timer = window.setInterval(() => {
        percent += 3;
        onProgress(Math.min(100, percent));
        if (percent >= 100) {
          window.clearInterval(timer);
          resolve();
        }
      }, 240);
      // Removing the row aborts the signal: stop the work here.
      signal.addEventListener("abort", () => {
        window.clearInterval(timer);
        setLog(`${item.name} cancelled at ${Math.round(percent)}%`);
      });
    });
  }

  return (
    <div className="flex w-[440px] max-w-full flex-col gap-3">
      <FileUpload label="Large files" multiple onUpload={upload} />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        {log || "Add a file, then press its x while it uploads."}
      </p>
    </div>
  );
}
