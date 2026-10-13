import { Tag } from "@/components/ui/v2/tag";

export default function Example() {
  return (
    <Tag
      onRemove={() => {}}
      removeDisabled
      removeAriaLabel="Remove required support filter"
    >
      Support · required
    </Tag>
  );
}
