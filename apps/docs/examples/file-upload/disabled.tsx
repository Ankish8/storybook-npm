import { FileUpload } from "@/components/ui/v2/file-upload";

export default function Disabled() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload label="Contact list" accept=".csv" disabled />
    </div>
  );
}
