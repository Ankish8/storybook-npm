import { FileUpload } from "@/components/ui/v2/file-upload";

export default function Compact() {
  return (
    <div className="w-[440px] max-w-full">
      <FileUpload
        label="Receipts"
        multiple
        compactAt={2}
        defaultItems={[
          {
            id: "1",
            name: "receipt-march.pdf",
            size: 180000,
            status: "uploaded",
          },
          {
            id: "2",
            name: "receipt-april.pdf",
            size: 210000,
            status: "uploaded",
          },
        ]}
        helperText="Drag a file over the bar to bring the prompt back."
      />
    </div>
  );
}
