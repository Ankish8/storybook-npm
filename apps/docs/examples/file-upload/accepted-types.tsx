import { FileUpload } from "@/components/ui/v2/file-upload";

export default function AcceptedTypes() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Images and PDFs"
        accept="image/*,application/pdf"
        multiple
        helperText="Drag a file over the target: other types turn it red."
      />
    </div>
  );
}
