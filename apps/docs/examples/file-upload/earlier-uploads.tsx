import { FileUpload } from "@/components/ui/v2/file-upload";

export default function EarlierUploads() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Launch assets"
        multiple
        defaultItems={[
          {
            id: "1",
            name: "brand-guidelines.pdf",
            size: 2400000,
            status: "uploaded",
          },
          { id: "2", name: "q3-report.xlsx", size: 640000, status: "uploaded" },
          {
            id: "3",
            name: "launch-video.mov",
            size: 8600000,
            status: "failed",
            error: "Connection lost",
          },
        ]}
        onUpload={async () => {}}
      />
    </div>
  );
}
