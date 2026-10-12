import {
  FileUpload,
  type FileUploadHandler,
} from "@/components/ui/v2/file-upload";

// A stand-in for a real upload: the bar fills over a couple of seconds. Replace it with your own request.
const upload: FileUploadHandler = (_item, { onProgress, signal }) =>
  new Promise<void>((resolve) => {
    let percent = 0;
    const timer = window.setInterval(() => {
      percent += 6 + Math.random() * 8;
      onProgress(Math.min(100, percent));
      if (percent >= 100) {
        window.clearInterval(timer);
        resolve();
      }
    }, 240);
    signal.addEventListener("abort", () => window.clearInterval(timer));
  });

export default function Uploads() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Launch assets"
        multiple
        accept="image/*,.pdf,video/*"
        note="PDF, images or video up to 10 MB"
        helperText="Files upload as soon as you add them."
        onUpload={upload}
      />
    </div>
  );
}
