import { useState } from "react";
import { Button } from "@/components/ui/v2/button";

export default function Loading() {
  const [saving, setSaving] = useState(false);

  return (
    <Button
      loading={saving}
      loadingText="Saving…"
      onClick={() => {
        setSaving(true);
        setTimeout(() => setSaving(false), 2000);
      }}
    >
      Save changes
    </Button>
  );
}
