import { FileUpload } from "@/components/ui/v2/file-upload";

export default function Paste() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Screenshots"
        accept="image/*"
        multiple
        helperText="Copy an image, hover this area and press Ctrl or ⌘ V."
      />
    </div>
  );
}
