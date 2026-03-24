import * as React from "react"

/**
 * Highlight a substring match within text.
 * Used for search result highlighting in chat list and contacts.
 */
export function highlightMatch(
  text: string,
  query: string
): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return React.createElement(
    React.Fragment,
    null,
    text.slice(0, idx),
    React.createElement(
      "strong",
      { className: "font-semibold text-semantic-text-primary" },
      text.slice(idx, idx + query.length)
    ),
    text.slice(idx + query.length)
  )
}

/**
 * Extract initials from a name string.
 * "Alex Smith" → "AS", "Jane" → "JA"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Replace `{{variable}}` placeholders in text with provided values.
 * Matched variables are rendered as highlighted spans.
 */
export function resolveVars(
  text: string,
  vars: Record<string, string>
): React.ReactNode {
  const parts = text.split(/(\{\{[^}]+\}\})/g)
  return parts.map((part, i) =>
    /^\{\{[^}]+\}\}$/.test(part)
      ? React.createElement(
          "span",
          { key: i, className: "text-semantic-text-link font-medium" },
          vars[part] || part
        )
      : part
  )
}
