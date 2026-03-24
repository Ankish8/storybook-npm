import * as React from "react"
import { Button } from "../../ui/button"
import { TextField } from "../../ui/text-field"
import { Checkbox } from "../../ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog"
import { useChatContext } from "../chat-provider"
import {
  Search,
  ArrowLeft,
  Users,
  Radio,
  Bot,
} from "lucide-react"

export interface ChatFilterPanelProps {
  onClose: () => void
  onApply: (assignees: Set<string>, channels: Set<string>) => void
}

const COLLAPSED_COUNT = 4

export function ChatFilterPanel({ onClose, onApply }: ChatFilterPanelProps) {
  const { assignees, channels } = useChatContext()

  const [filterSearch, setFilterSearch] = React.useState("")
  const [showAllBots, setShowAllBots] = React.useState(false)
  const [showAllAgents, setShowAllAgents] = React.useState(false)
  const [showDiscardDialog, setShowDiscardDialog] = React.useState(false)

  const initialAssignees = React.useRef(
    new Set(assignees.map((a) => a.id))
  )
  const initialChannels = React.useRef(
    new Set(channels.map((c) => c.id))
  )

  const [selectedAssignees, setSelectedAssignees] = React.useState<Set<string>>(
    () => new Set(assignees.map((a) => a.id))
  )
  const [selectedChannels, setSelectedChannels] = React.useState<Set<string>>(
    () => new Set(channels.map((c) => c.id))
  )

  const isDirty = () => {
    if (selectedAssignees.size !== initialAssignees.current.size) return true
    if (selectedChannels.size !== initialChannels.current.size) return true
    for (const id of selectedAssignees)
      if (!initialAssignees.current.has(id)) return true
    for (const id of selectedChannels)
      if (!initialChannels.current.has(id)) return true
    return false
  }

  const handleBack = () => {
    if (isDirty()) {
      setShowDiscardDialog(true)
    } else {
      onClose()
    }
  }

  const bots = assignees.filter((a) => a.type === "bot")
  const agents = assignees.filter((a) => a.type === "agent")
  const topLevel = assignees.filter(
    (a) => a.type === "all" || a.type === "unassigned"
  )

  const query = filterSearch.toLowerCase()
  const filteredBots = bots.filter((b) =>
    b.label.toLowerCase().includes(query)
  )
  const filteredAgents = agents.filter((a) =>
    a.label.toLowerCase().includes(query)
  )
  const filteredChannels = channels.filter(
    (c) =>
      c.name.toLowerCase().includes(query) || c.phone.includes(filterSearch)
  )

  const toggleAssignee = (id: string) => {
    setSelectedAssignees((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header — matches NewChat pattern */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-solid border-semantic-border-layout shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-[16px] font-semibold text-semantic-text-primary">
            Filters
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm"
          onClick={() => {
            setSelectedAssignees(new Set())
            setSelectedChannels(new Set())
          }}
        >
          Reset
        </Button>
      </div>

      {/* Search row */}
      <div
        role="search"
        aria-label="Search filters"
        className="flex items-center gap-2 px-3 py-2.5 border-b border-solid border-semantic-border-layout shrink-0"
      >
        <TextField
          placeholder="Search filters..."
          aria-label="Search filters"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          leftIcon={<Search className="size-4" />}
          wrapperClassName="flex-1 min-w-0"
          clearable
          onClear={() => setFilterSearch("")}
        />
      </div>

      {/* Scrollable filter sections */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {/* ── Assignment Section ── */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="size-4 text-semantic-text-muted" />
            <span className="text-[13px] font-semibold text-semantic-text-primary">
              Assignment
            </span>
            <span className="text-[12px] text-semantic-text-muted tabular-nums">
              {selectedAssignees.size}/{assignees.length}
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-semantic-error-primary hover:bg-semantic-error-surface hover:text-semantic-error-primary"
              onClick={() => setSelectedAssignees(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="border border-solid border-semantic-border-layout rounded-lg overflow-hidden">
            {topLevel.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors border-b border-solid border-semantic-border-layout"
              >
                <Checkbox
                  size="sm"
                  checked={selectedAssignees.has(item.id)}
                  onCheckedChange={() => toggleAssignee(item.id)}
                />
                <span className="text-[14px] text-semantic-text-primary">
                  {item.label}
                </span>
              </label>
            ))}

            {filteredBots.length > 0 &&
              (() => {
                const isSearching = filterSearch.trim().length > 0
                const visibleBots =
                  isSearching || showAllBots
                    ? filteredBots
                    : filteredBots.slice(0, COLLAPSED_COUNT)
                const hiddenCount = filteredBots.length - COLLAPSED_COUNT
                return (
                  <>
                    <div className="px-3 py-2 bg-semantic-bg-ui border-b border-solid border-semantic-border-layout">
                      <span className="text-[13px] font-semibold text-semantic-text-secondary">
                        Bots ({bots.length})
                      </span>
                    </div>
                    {visibleBots.map((bot) => (
                      <label
                        key={bot.id}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors border-b border-solid border-semantic-border-layout"
                      >
                        <Checkbox
                          size="sm"
                          checked={selectedAssignees.has(bot.id)}
                          onCheckedChange={() => toggleAssignee(bot.id)}
                        />
                        <span className="text-[14px] text-semantic-text-primary flex-1">
                          {bot.label}
                        </span>
                        <Bot className="size-4 text-semantic-text-muted" />
                      </label>
                    ))}
                    {!isSearching && hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllBots((p) => !p)}
                        className="w-full px-3 py-2 text-[13px] font-medium text-semantic-text-link hover:bg-semantic-bg-hover transition-colors text-left border-b border-solid border-semantic-border-layout"
                      >
                        {showAllBots
                          ? "Show less"
                          : `Show more (+${hiddenCount})`}
                      </button>
                    )}
                  </>
                )
              })()}

            {filteredAgents.length > 0 &&
              (() => {
                const isSearching = filterSearch.trim().length > 0
                const visibleAgents =
                  isSearching || showAllAgents
                    ? filteredAgents
                    : filteredAgents.slice(0, COLLAPSED_COUNT)
                const hiddenCount = filteredAgents.length - COLLAPSED_COUNT
                return (
                  <>
                    <div className="px-3 py-2 bg-semantic-bg-ui border-b border-solid border-semantic-border-layout">
                      <span className="text-[13px] font-semibold text-semantic-text-secondary">
                        Agents ({agents.length})
                      </span>
                    </div>
                    {visibleAgents.map((agent, i) => (
                      <label
                        key={agent.id}
                        className={`flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors ${
                          i < visibleAgents.length - 1 ||
                          (!isSearching && hiddenCount > 0)
                            ? "border-b border-solid border-semantic-border-layout"
                            : ""
                        }`}
                      >
                        <Checkbox
                          size="sm"
                          checked={selectedAssignees.has(agent.id)}
                          onCheckedChange={() => toggleAssignee(agent.id)}
                        />
                        <span className="text-[14px] text-semantic-text-primary">
                          {agent.label}
                        </span>
                      </label>
                    ))}
                    {!isSearching && hiddenCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllAgents((p) => !p)}
                        className="w-full px-3 py-2 text-[13px] font-medium text-semantic-text-link hover:bg-semantic-bg-hover transition-colors text-left"
                      >
                        {showAllAgents
                          ? "Show less"
                          : `Show more (+${hiddenCount})`}
                      </button>
                    )}
                  </>
                )
              })()}
          </div>
        </div>

        {/* ── Channels Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="size-4 text-semantic-text-muted" />
            <span className="text-[13px] font-semibold text-semantic-text-primary">
              Channels
            </span>
            <span className="text-[12px] text-semantic-text-muted tabular-nums">
              {selectedChannels.size}/{channels.length}
            </span>
            <span className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              className="text-sm text-semantic-error-primary hover:bg-semantic-error-surface hover:text-semantic-error-primary"
              onClick={() => setSelectedChannels(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="border border-solid border-semantic-border-layout rounded-lg overflow-hidden">
            {filteredChannels.map((ch, i) => (
              <label
                key={ch.id}
                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-semantic-bg-hover cursor-pointer transition-colors ${
                  i < filteredChannels.length - 1
                    ? "border-b border-solid border-semantic-border-layout"
                    : ""
                }`}
              >
                <Checkbox
                  size="sm"
                  checked={selectedChannels.has(ch.id)}
                  onCheckedChange={() => toggleChannel(ch.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] text-semantic-text-primary truncate">
                      {ch.name}
                    </span>
                    <span className="shrink-0 text-[12px] font-semibold text-semantic-text-muted bg-semantic-bg-hover px-1.5 py-0.5 rounded">
                      {ch.badge}
                    </span>
                  </div>
                  <span className="text-[13px] text-semantic-text-muted">
                    {ch.phone}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-solid border-semantic-border-layout px-4 py-3">
        <p className="m-0 text-[13px] text-semantic-text-muted mb-3 text-center">
          Maximum selections allowed per category: 50
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => onApply(selectedAssignees, selectedChannels)}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Discard unsaved filters confirmation */}
      {showDiscardDialog && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setShowDiscardDialog(false)
          }}
        >
          <DialogContent size="default" className="w-[400px] max-w-[90vw]">
            <DialogTitle>Discard filter changes?</DialogTitle>
            <DialogDescription>
              You have unsaved filter changes. Do you want to apply them or
              discard?
            </DialogDescription>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDiscardDialog(false)
                  onClose()
                }}
              >
                Discard
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowDiscardDialog(false)
                  onApply(selectedAssignees, selectedChannels)
                }}
              >
                Apply Filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

ChatFilterPanel.displayName = "ChatFilterPanel"
