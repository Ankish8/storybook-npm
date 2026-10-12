import { FileUpload } from "@/components/ui/v2/file-upload";

export default function ErrorState() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Contact list"
        accept=".csv"
        error="The selected file could not be read. Please choose another."
      />
    </div>
  );
}
