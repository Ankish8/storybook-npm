import { ActionButton } from "@/components/ui/v2/action-button";

const save = () => new Promise((resolve) => setTimeout(resolve, 1200));

export default function Basic() {
  return <ActionButton label="Save changes" onAction={save} />;
}
