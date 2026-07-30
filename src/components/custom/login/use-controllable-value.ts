import * as React from "react";

/**
 * Supports both controlled and uncontrolled usage of a single value.
 *
 * When `controlled` is `undefined` the value is owned internally, so the field
 * is typeable without the host wiring a change handler. When `controlled` is
 * provided the host owns the value and this hook only forwards changes.
 *
 * @param controlled The value supplied by the host, or `undefined` to self-manage
 * @param fallback Initial value used while uncontrolled
 * @param onChange Called with the next value in both modes
 *
 * @example
 * ```tsx
 * const [value, setValue] = useControllableValue(props.password, "", props.onPasswordChange)
 * <input value={value} onChange={(e) => setValue(e.target.value)} />
 * ```
 */
export function useControllableValue<T>(
  controlled: T | undefined,
  fallback: T,
  onChange?: (value: T) => void
): [T, (next: T) => void] {
  const isControlled = controlled !== undefined;
  const [internal, setInternal] = React.useState<T>(fallback);

  const onChangeRef = React.useRef(onChange);
  React.useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const value = isControlled ? (controlled as T) : internal;

  const setValue = React.useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternal(next);
      }
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  return [value, setValue];
}
