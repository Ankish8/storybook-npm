import { ActionButton } from "@/components/ui/v2/action-button";

export default function Disabled() {
  return (
    <ActionButton disabled label="Save changes" onAction={async () => {}} />
  );
}
