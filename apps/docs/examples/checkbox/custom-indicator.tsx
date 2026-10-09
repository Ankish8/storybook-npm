import { Checkbox } from "@/components/ui/v2/checkbox";

function Heart() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-full w-full p-0.5"
      fill="currentColor"
    >
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}

export default function CustomIndicator() {
  return (
    <Checkbox defaultChecked>
      <Checkbox.Content>
        <Checkbox.Control>
          <Checkbox.Indicator>
            <Heart />
          </Checkbox.Indicator>
        </Checkbox.Control>
        Favourite
      </Checkbox.Content>
    </Checkbox>
  );
}
