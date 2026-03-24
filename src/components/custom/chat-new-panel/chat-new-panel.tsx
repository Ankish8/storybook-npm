import * as React from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { TextField } from "../../ui/text-field"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu"
import { Avatar } from "../../ui/avatar"
import { useChatContext } from "../chat-provider"
import { ArrowLeft, ChevronDown, Search, UserPlus } from "lucide-react"

/* ── Helpers ── */

/**
 * Highlights the first occurrence of `query` within `text` by wrapping it
 * in a <strong> tag. Returns the original text if no match is found.
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

/* ── Component ── */

export interface ChatNewPanelProps {
  /** Called when the user clicks the back button */
  onBack: () => void
  /** Called when the user wants to open the "Add new contact" modal */
  onOpenAddContact: () => void
}

/**
 * Panel that displays a searchable contact list for starting a new chat.
 * Includes a header with back navigation and channel selector, a search bar
 * with an "Add new contact" button, and a scrollable contact list with
 * search-match highlighting.
 *
 * Data (contacts, channels) is read from `useChatContext()`.
 */
function ChatNewPanel({ onBack, onOpenAddContact }: ChatNewPanelProps) {
  const { contacts, channels } = useChatContext()
  const [contactSearch, setContactSearch] = React.useState("")
  const [selectedChannel, setSelectedChannel] = React.useState(channels[0])

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch)
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-solid border-semantic-border-layout shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-[16px] font-semibold text-semantic-text-primary">New Chat</span>
        </div>

        {/* Channel selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedChannel.badge}
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px]">
            {channels.map((ch) => (
              <DropdownMenuItem
                key={ch.id}
                onSelect={() => setSelectedChannel(channels.find((c) => c.id === ch.id)!)}
                description={ch.phone}
                suffix={ch.badge}
                className={cn(selectedChannel.id === ch.id && "bg-semantic-primary-surface text-semantic-primary font-medium")}
              >
                {ch.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search row */}
      <div role="search" aria-label="Search contacts" className="flex items-center gap-2 px-3 py-2.5 border-b border-solid border-semantic-border-layout shrink-0">
        <TextField
          placeholder="Search contacts"
          aria-label="Search contacts"
          value={contactSearch}
          onChange={(e) => setContactSearch(e.target.value)}
          leftIcon={<Search className="size-4" />}
          wrapperClassName="flex-1 min-w-0"
          size="default"
          clearable={!!contactSearch}
          onClear={() => setContactSearch("")}
        />
        <Button variant="outline" size="icon-lg" onClick={onOpenAddContact} className="shrink-0" aria-label="Add new contact">
          <UserPlus className="size-4" />
        </Button>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[13px] text-semantic-text-muted">
            No contacts found
          </div>
        ) : (
          filtered.map((contact, i) => (
            <button
              type="button"
              key={contact.id}
              className={cn(
                "flex items-center gap-3 px-3 py-3 hover:bg-semantic-bg-hover cursor-pointer transition-colors text-left w-full",
                i < filtered.length - 1 && "border-b border-solid border-semantic-border-layout"
              )}
            >
              <Avatar name={contact.name} size="sm" />
              {/* Info */}
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-medium text-semantic-text-primary leading-5 truncate">
                    {contactSearch ? highlightMatch(contact.name, contactSearch) : contact.name}
                  </span>
                  <span className="text-[12px] text-semantic-text-muted">
                    {contactSearch ? highlightMatch(contact.phone, contactSearch) : contact.phone}
                  </span>
                </div>
                {contact.channel && (
                  <span className="text-[12px] font-medium text-semantic-text-muted shrink-0 ml-2">
                    {contact.channel}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
ChatNewPanel.displayName = "ChatNewPanel"

export { ChatNewPanel }
