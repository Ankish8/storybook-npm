/** Truncates a string to at most `maxLength` characters (Unicode code units). */
export function clampToMaxLength(value: string, maxLength: number): string {
  if (maxLength < 0) return String(value);
  return String(value).slice(0, maxLength);
}

