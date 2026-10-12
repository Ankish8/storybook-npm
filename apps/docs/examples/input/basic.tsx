import { Input } from "@/components/ui/v2/input";

export default function Basic() {
  return (
    <div className="w-[360px] max-w-full">
      <Input placeholder="Enter your name" aria-label="Name" />
    </div>
  );
}
