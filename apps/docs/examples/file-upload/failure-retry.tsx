import {
  FileUpload,
  type FileUploadItem,
} from "@/components/ui/v2/file-upload";

const refused = new Set<string>();

// The first attempt at any file whose name contains "fail" is refused halfway, so Retry has something to do.
function upload(
  { id, name }: FileUploadItem,
  {
    onProgress,
    signal,
  }: { onProgress: (percent: number) => void; signal: AbortSignal }
) {
  return new Promise<void>((resolve, reject) => {
    const failing = name.toLowerCase().includes("fail") && !refused.has(id);
    refused.add(id);
    let percent = 0;
    const timer = window.setInterval(() => {
      percent += 8 + Math.random() * 8;
      if (failing && percent > 55) {
        window.clearInterval(timer);
        // Whatever message you reject with is shown on the row.
        reject(new Error("Connection lost"));
        return;
      }
      onProgress(Math.min(100, percent));
      if (percent >= 100) {
        window.clearInterval(timer);
        resolve();
      }
    }, 240);
    signal.addEventListener("abort", () => window.clearInterval(timer));
  });
}

export default function FailureRetry() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Reports"
        multiple
        helperText="Add a file named fail-demo.pdf, then press Retry."
        onUpload={upload}
      />
    </div>
  );
}
