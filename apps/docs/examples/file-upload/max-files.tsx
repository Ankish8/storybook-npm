import { FileUpload } from "@/components/ui/v2/file-upload";

export default function MaxFiles() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Receipts"
        multiple
        maxFiles={3}
        note="Up to 3 receipts"
        helperText="Add a fourth file to see it refused."
      />
    </div>
  );
}
