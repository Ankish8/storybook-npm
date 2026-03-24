import { useState } from "react"
import { Search, ChevronDown, Bot, Users } from "lucide-react"
import { Button } from "../../ui/button"
import { Avatar } from "../../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../../ui/dropdown-menu"
import { useChatContext } from "../chat-provider"

export interface AssignmentDropdownProps {
  defaultAgent?: string
}

function AssignmentDropdown({ defaultAgent }: AssignmentDropdownProps) {
  const { assignees, assignChat } = useChatContext()

  // Resolve agent name to assignee id
  const resolvedDefault = defaultAgent
    ? assignees.find((a) => a.label === defaultAgent)?.id || "unassigned"
    : "unassigned"
  const [value, setValue] = useState(resolvedDefault)
  const [searchQuery, setSearchQuery] = useState("")

  const bots = assignees.filter((a) => a.type === "bot")
  const agents = assignees.filter((a) => a.type === "agent")

  const q = searchQuery.toLowerCase()
  const filteredBots = bots.filter((b) => b.label.toLowerCase().includes(q))
  const filteredAgents = agents.filter((a) =>
    a.label.toLowerCase().includes(q)
  )

  const handleValueChange = (newValue: string) => {
    setValue(newValue)
    assignChat(newValue)
  }

  return (
    <DropdownMenu onOpenChange={() => setSearchQuery("")}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="truncate">
            {value === "unassigned"
              ? "Unassigned"
              : assignees.find((a) => a.id === value)?.label || value}
          </span>
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 border-b border-solid border-semantic-border-layout"
          onClick={(e) => e.stopPropagation()}
        >
          <Search className="size-4 text-semantic-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search agents"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-7 text-sm bg-transparent placeholder:text-semantic-text-muted focus:outline-none"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={handleValueChange}
          className="max-h-[240px] overflow-y-auto"
        >
          {/* Unassigned */}
          <DropdownMenuRadioItem
            value="unassigned"
            disabled={value !== "unassigned"}
          >
            Unassigned
          </DropdownMenuRadioItem>

          {/* Bots */}
          {filteredBots.length > 0 && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1.5">
                <Bot className="size-3.5" />
                Bots
              </DropdownMenuLabel>
              {filteredBots.map((bot) => (
                <DropdownMenuRadioItem key={bot.id} value={bot.id}>
                  <div className="flex items-center gap-2">
                    <div className="size-5 rounded-full bg-semantic-bg-ui flex items-center justify-center shrink-0">
                      <Bot className="size-3 text-semantic-text-muted" />
                    </div>
                    {bot.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuGroup>
          )}

          {/* Agents */}
          {filteredAgents.length > 0 && (
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                Agents
              </DropdownMenuLabel>
              {filteredAgents.map((agent) => (
                <DropdownMenuRadioItem key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-2">
                    <Avatar name={agent.label} size="xs" />
                    {agent.label}
                  </div>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuGroup>
          )}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
AssignmentDropdown.displayName = "AssignmentDropdown"

export { AssignmentDropdown }
