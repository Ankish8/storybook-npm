import { useState } from "react";
import { FileUpload } from "@/components/ui/v2/file-upload";

export default function Controlled() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex w-[440px] max-w-full flex-col gap-3">
      <FileUpload
        label="Attachments"
        multiple
        value={files}
        onFilesChange={setFiles}
      />
      <p className="m-0 text-sm text-[var(--v2-text-muted)]">
        {files.length
          ? `${files.length} selected: ${files.map((file) => file.name).join(", ")}`
          : "Nothing selected yet."}
      </p>
    </div>
  );
}
