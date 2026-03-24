import * as React from "react"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { TextField } from "../../ui/text-field"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu"
import { useChatContext } from "../chat-provider"
import type { ChannelItem } from "../chat-types"
import { ChevronDown, X } from "lucide-react"

export interface AddNewContactModalProps {
  /** The default channel to pre-select */
  defaultChannel: ChannelItem
  /** Called when the modal should close */
  onClose: () => void
}

/**
 * Modal dialog for adding a new contact. Shows a channel selector,
 * phone number input with country code prefix, and a name field.
 * Calls `createContact` from ChatContext when "Start Conversation" is clicked.
 */
function AddNewContactModal({
  defaultChannel,
  onClose,
}: AddNewContactModalProps) {
  const { channels, createContact } = useChatContext()
  const [phone, setPhone] = React.useState("")
  const [name, setName] = React.useState("")
  const [channel, setChannel] = React.useState(defaultChannel)

  const handleStartConversation = async () => {
    if (!phone.trim()) return
    await createContact({ name: name.trim(), phone: phone.trim(), channel: channel.id })
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent size="default" className="w-[480px] max-w-[90vw] p-0 gap-0" hideCloseButton>
        <DialogDescription className="sr-only">Add a new contact to start a conversation</DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <DialogTitle>Add New Contact</DialogTitle>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {channel.badge}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                {channels.map((ch) => (
                  <DropdownMenuItem
                    key={ch.id}
                    onSelect={() => setChannel(channels.find((c) => c.id === ch.id)!)}
                    description={ch.phone}
                    suffix={ch.badge}
                    className={cn(channel.id === ch.id && "bg-semantic-primary-surface text-semantic-primary font-medium")}
                  >
                    {ch.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="add-contact-phone" className="text-[14px] font-medium text-semantic-text-primary">
              Phone<span className="text-semantic-error-primary">*</span>
            </label>
            <div className="flex items-center border border-solid border-semantic-border-layout rounded focus-within:border-semantic-border-focus transition-colors">
              <div className="flex items-center gap-1.5 pl-3 pr-2 h-9 shrink-0">
                <span className="text-[14px]">🇮🇳</span>
                <span className="text-[14px] text-semantic-text-secondary">+91</span>
              </div>
              <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
              <input
                id="add-contact-phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                aria-required="true"
                className="flex-1 h-9 px-3 text-[14px] text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Save contact as */}
          <TextField
            label="Save contact as"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="sm"
          />

          {/* Start Conversation button */}
          <div className="flex justify-end pt-2">
            <Button onClick={handleStartConversation}>Start Conversation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
AddNewContactModal.displayName = "AddNewContactModal"

export { AddNewContactModal }
