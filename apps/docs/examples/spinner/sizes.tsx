import { Spinner } from "@/components/ui/v2/spinner";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Spinner key={size} size={size} aria-label={`${size} loading`} />
      ))}
    </div>
  );
}
