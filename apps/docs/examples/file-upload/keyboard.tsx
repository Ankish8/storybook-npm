import { FileUpload } from "@/components/ui/v2/file-upload";

const keys: Array<[string, string]> = [
  ["Enter or Space", "On the target, open the file picker"],
  [
    "Ctrl or ⌘ V",
    "Paste files from the clipboard while hovering or focused inside",
  ],
  [
    "ArrowUp / ArrowDown",
    "In the list, the same action (Retry or Remove) on the next row",
  ],
  ["Delete or Backspace", "In the list, remove the focused row"],
];

export default function Keyboard() {
  return (
    <div className="flex w-[440px] max-w-full flex-col gap-4">
      <FileUpload
        label="Attachments"
        multiple
        defaultItems={[
          { id: "1", name: "notes.txt", size: 1200, status: "uploaded" },
          { id: "2", name: "draft.pdf", size: 94000, status: "uploaded" },
        ]}
      />
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {keys.map(([key, action]) => (
          <div key={key} className="contents">
            <dt className="font-medium text-[var(--v2-text-primary)]">{key}</dt>
            <dd className="m-0 text-[var(--v2-text-muted)]">{action}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
