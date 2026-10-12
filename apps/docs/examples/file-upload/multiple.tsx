import { FileUpload } from "@/components/ui/v2/file-upload";

export default function Multiple() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Attachments"
        multiple
        accept="image/*,.pdf"
        helperText="Choose images or PDF documents."
      />
    </div>
  );
}
