import { FileUpload } from "@/components/ui/v2/file-upload";

export default function DropLabel() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Documents"
        multiple
        dropLabel="Release to add"
        note="PDF or Word, up to 5 MB"
        accept=".pdf,.doc,.docx"
        maxSize={5 * 1024 * 1024}
      />
    </div>
  );
}
