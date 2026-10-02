import * as React from "react";
import { Checkbox, type CheckboxProps } from "../components/ui/v2/checkbox";
import { Switch, type SwitchProps } from "../components/ui/v2/switch";
import { Input, type InputProps } from "../components/ui/v2/input";

/** Only a gallery's fixed comparison axes are removed from Controls. */
export function gallery(exclude: string[], description: string) {
  return {
    layout: "padded",
    controls: { exclude },
    docs: { description: { story: description } },
  };
}

/** Independent samples can be toggled without changing neighboring examples. */
export function PreviewCheckbox({
  checked = false,
  id,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const [selection, setSelection] = React.useState(checked);
  const generatedId = React.useId();
  return (
    <Checkbox
      {...props}
      id={id || generatedId}
      checked={selection}
      onCheckedChange={(next) => {
        setSelection(next);
        onCheckedChange?.(next);
      }}
    />
  );
}

export function PreviewSwitch({
  checked = false,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [selection, setSelection] = React.useState(checked);
  return (
    <Switch
      {...props}
      checked={selection}
      onCheckedChange={(next) => {
        setSelection(next);
        onCheckedChange?.(next);
      }}
    />
  );
}

/** Galleries have independent fields; their value control remounts each sample. */
export function PreviewInput({ value = "", onChange, ...props }: InputProps) {
  const [text, setText] = React.useState(value);
  return (
    <Input
      {...props}
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        onChange?.(event);
      }}
    />
  );
}
