import { Textarea } from "@/components/ui/v2/textarea";
export default function Sizes() {
  return (
    <div className="flex w-[380px] max-w-full flex-col gap-5">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Textarea
          key={size}
          size={size}
          rows={3}
          label={
            size === "sm" ? "Compact" : size === "lg" ? "Large" : "Default"
          }
          placeholder="Write a note…"
        />
      ))}
    </div>
  );
}
