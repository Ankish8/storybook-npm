import { useId, useState } from "react";
import { Panel } from "@/components/ui/v2/panel";
import { Input } from "@/components/ui/v2/input";
import { Button } from "@/components/ui/v2/button";
export default function Example() {
  const formId = useId();
  const [name, setName] = useState("Aditi Kumar");
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex h-80 w-full max-w-sm min-w-0">
      <Panel
        title="Edit contact"
        footer={
          <div className="grid w-full gap-3">
            <p
              role="status"
              className="m-0 text-xs text-v2-semantic-text-muted"
            >
              {saved ? `Saved ${name} locally` : "Unsaved local draft"}
            </p>
            <Button type="submit" size="sm" form={formId}>
              Save changes
            </Button>
          </div>
        }
      >
        <form
          id={formId}
          className="grid gap-3 p-4"
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(true);
          }}
        >
          <label
            htmlFor={`${formId}-name`}
            className="text-sm text-v2-semantic-text-secondary"
          >
            Name
          </label>
          <Input
            id={`${formId}-name`}
            name="name"
            required
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
          />
        </form>
      </Panel>
    </div>
  );
}
