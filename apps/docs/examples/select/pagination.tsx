import { useState } from "react";
import { SelectField } from "@/components/ui/v2/select";
const allOptions = Array.from({ length: 30 }, (_, index) => ({
  value: `agent-${index + 1}`,
  label: `Support agent ${index + 1}`,
}));
export default function Pagination() {
  const [count, setCount] = useState(12);
  const [loading, setLoading] = useState(false);
  return (
    <div className="w-[360px] max-w-full">
      <SelectField
        label="Agent"
        options={allOptions.slice(0, count)}
        loadingMore={loading}
        hasMore={count < allOptions.length}
        helperText="Scroll to the bottom to load the next local page."
        onScrollEnd={() => {
          if (loading || count >= allOptions.length) return;
          setLoading(true);
          window.setTimeout(() => {
            setCount((current) => Math.min(current + 6, allOptions.length));
            setLoading(false);
          }, 500);
        }}
      />
    </div>
  );
}
