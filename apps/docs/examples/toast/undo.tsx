import { useEffect, useState } from "react";
import { Toaster, ToastAction, toast } from "@/components/ui/v2/toast";
import { Input } from "@/components/ui/v2/input";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const [name, setName] = useState("Support");
  const [draft, setDraft] = useState("Customer success");
  useEffect(() => () => toast.dismiss(), []);
  function save() {
    const previous = name;
    setName(draft);
    toast.success({
      title: "Workspace renamed",
      description: `Now named ${draft}.`,
      action: (
        <ToastAction
          altText="Undo the workspace name change"
          onClick={() => setName(previous)}
        >
          Undo
        </ToastAction>
      ),
    });
  }
  return (
    <div className="grid w-full max-w-sm gap-3">
      <label
        htmlFor="toast-workspace-name"
        className="text-sm text-v2-semantic-text-secondary"
      >
        Workspace name
      </label>
      <Input
        id="toast-workspace-name"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button size="sm" onClick={save}>
        Save name locally
      </Button>
      <p className="m-0 text-xs text-v2-semantic-text-muted" role="status">
        Current workspace: {name}
      </p>
      <Toaster
        viewportProps={{
          className:
            "relative bottom-auto left-auto right-auto top-auto m-0 max-h-[none] w-full max-w-full p-0 sm:bottom-auto sm:right-auto sm:top-auto md:max-w-full",
        }}
      />
    </div>
  );
}
