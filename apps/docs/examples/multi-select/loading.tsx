import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/v2/multi-select";

const ALL = Array.from({ length: 36 }, (_, index) => ({
  value: `agent-${index + 1}`,
  label: `Agent ${index + 1}`,
}));

export default function Loading() {
  const [count, setCount] = useState(0);
  const [pending, setPending] = useState(true);

  // The first page "arrives" after a moment, like a request would.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(12);
      setPending(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const loadMore = () => {
    if (pending) return;
    setPending(true);
    setTimeout(() => {
      setCount((current) => Math.min(current + 12, ALL.length));
      setPending(false);
    }, 600);
  };

  return (
    <div className="w-[360px] max-w-full">
      <MultiSelect
        label="Agents"
        placeholder="Select agents"
        loading={pending && count === 0}
        options={ALL.slice(0, count)}
        hasMore={count < ALL.length}
        loadingMore={pending && count > 0}
        onScrollEnd={loadMore}
        helperText="Scroll to the end of the list to load the next 12."
      />
    </div>
  );
}
