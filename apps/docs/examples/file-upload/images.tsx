import { FileUpload } from "@/components/ui/v2/file-upload";

export default function Images() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Product photos"
        accept="image/*"
        multiple
        helperText="Image files get a thumbnail; other types get an icon."
      />
    </div>
  );
}
