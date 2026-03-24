import * as React from "react"
import type { CannedMessage } from "../chat-types"

export interface CannedMessagesDropdownProps {
  /** The search query (text after the "/" trigger) */
  query: string
  /** Index of the keyboard-highlighted item (-1 = none) */
  activeIndex: number
  /** Called when the user selects a canned message (click or Enter) */
  onSelect: (body: string) => void
  /** The list of canned messages to filter and display */
  cannedMessages: CannedMessage[]
}

/**
 * Highlights the first occurrence of `query` within `text` using a bold span.
 */
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <strong className="font-semibold text-semantic-text-primary">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}

/**
 * CannedMessagesDropdown renders a floating list of canned message suggestions
 * above the chat composer. It filters messages by shortcut/body matching and
 * supports keyboard navigation (highlighted via `activeIndex`).
 *
 * Shown when the composer text starts with "/".
 */
function CannedMessagesDropdown({
  query,
  activeIndex,
  onSelect,
  cannedMessages,
}: CannedMessagesDropdownProps) {
  const filtered = React.useMemo(
    () =>
      cannedMessages.filter(
        (cm) =>
          cm.shortcut.toLowerCase().includes(query.toLowerCase()) ||
          cm.body.toLowerCase().includes(query.toLowerCase())
      ),
    [cannedMessages, query]
  )

  if (filtered.length === 0) {
    return (
      <div className="absolute bottom-full left-4 right-4 mb-1 bg-semantic-bg-primary rounded-lg shadow-[0px_4px_16px_0px_rgba(10,13,18,0.15)] border border-solid border-semantic-border-layout overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out">
        <div className="px-4 py-3 text-[13px] text-semantic-text-muted text-center">
          No canned messages found
        </div>
      </div>
    )
  }

  return (
    <div
      id="canned-listbox"
      role="listbox"
      aria-label="Canned messages"
      className="absolute bottom-full left-4 right-4 mb-1 bg-semantic-bg-primary rounded-lg shadow-[0px_4px_16px_0px_rgba(10,13,18,0.15)] border border-solid border-semantic-border-layout overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2 duration-150 ease-out"
    >
      {filtered.map((cm, i) => (
        <button
          type="button"
          role="option"
          id={`canned-${cm.id}`}
          aria-selected={activeIndex === i}
          key={cm.id}
          className={`px-4 py-3 hover:bg-semantic-bg-ui cursor-pointer transition-colors text-left w-full ${activeIndex === i ? "bg-semantic-bg-ui" : ""} ${i < filtered.length - 1 ? "border-b border-solid border-semantic-border-layout" : ""}`}
          onClick={() => onSelect(cm.body)}
        >
          <p className="text-[13px] font-semibold text-semantic-text-primary m-0">
            {highlightMatch(cm.shortcut, query)}
          </p>
          <p className="text-[13px] text-semantic-text-muted truncate m-0 mt-0.5">
            {highlightMatch(cm.body, query)}
          </p>
        </button>
      ))}
    </div>
  )
}

export { CannedMessagesDropdown, highlightMatch }
