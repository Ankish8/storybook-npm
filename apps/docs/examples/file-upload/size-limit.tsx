import { useState } from "react";
import { FileUpload } from "@/components/ui/v2/file-upload";

export default function SizeLimit() {
  const [reason, setReason] = useState("");

  return (
    <div className="flex w-[440px] max-w-full flex-col gap-3">
      <FileUpload
        label="Cover image"
        accept="image/*"
        maxSize={1024 * 1024}
        note="Images up to 1 MB"
        onReject={(message) => setReason(message)}
        onFilesChange={() => setReason("")}
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        {reason
          ? `onReject: ${reason}`
          : "Choose a file over 1 MB to see the refusal."}
      </p>
    </div>
  );
}
