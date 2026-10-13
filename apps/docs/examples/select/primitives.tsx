import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/v2/select";
export default function Primitives() {
  return (
    <div className="flex w-[360px] max-w-full flex-col gap-2">
      <label
        htmlFor="select-primitive"
        className="text-sm font-medium text-[var(--v2-text-primary)]"
      >
        Routing
      </label>
      <Select defaultValue="support">
        <SelectTrigger id="select-primitive">
          <SelectValue placeholder="Select a team" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Teams</SelectLabel>
            <SelectItem value="support">Support</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Other</SelectLabel>
            <SelectItem value="everyone">Everyone</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
