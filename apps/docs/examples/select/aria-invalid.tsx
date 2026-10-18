import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/v2/select";
export default function Invalid() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-2">
      <label
        htmlFor="invalid-select"
        className="text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Authentication
      </label>
      <Select>
        <SelectTrigger
          id="invalid-select"
          aria-invalid="true"
          aria-describedby="invalid-select-message"
        >
          <SelectValue placeholder="Select a method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic Auth</SelectItem>
          <SelectItem value="bearer">Bearer Token</SelectItem>
        </SelectContent>
      </Select>
      <p
        id="invalid-select-message"
        className="m-0 text-xs text-v2-semantic-error-text"
      >
        Choose an authentication method.
      </p>
    </div>
  );
}
