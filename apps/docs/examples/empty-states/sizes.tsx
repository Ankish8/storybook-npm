import { EmptyStates } from "@/components/ui/v2/empty-states";

export default function Example() {
  return (
    <div className="grid w-full max-w-lg gap-5">
      <EmptyStates defaultValue="caught-up" />
      <EmptyStates defaultValue="caught-up" size="sm" />
    </div>
  );
}
