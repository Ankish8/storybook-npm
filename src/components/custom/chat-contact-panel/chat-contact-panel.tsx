import * as React from "react"
import { Check, ChevronDown, Info, Pencil, User } from "lucide-react"
import { Button } from "../../ui/button"
import { TextField } from "../../ui/text-field"
import { Switch } from "../../ui/switch"
import { Tag } from "../../ui/tag"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../ui/dropdown-menu"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion"
import { ConfirmationModal } from "../../ui/confirmation-modal"
import { Panel } from "../../ui/panel"
import { useChatContext } from "../chat-provider"
import type { ContactDetails } from "../chat-types"

/* ── ChatContactPanel ── */

export interface ChatContactPanelProps {
  /** Contact name to display (derived from selected chat by parent) */
  name: string
}

export function ChatContactPanel({ name }: ChatContactPanelProps) {
  const {
    showContactDetails,
    setShowContactDetails,
    selectedChatId,
    transport,
  } = useChatContext()

  const [isEditing, setIsEditing] = React.useState(false)
  const [marketingOptIn, setMarketingOptIn] = React.useState(true)
  const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false)
  const [contactDetails, setContactDetails] =
    React.useState<ContactDetails | null>(null)

  // Fetch contact details when panel opens
  React.useEffect(() => {
    if (!showContactDetails || !selectedChatId) return

    let cancelled = false

    async function loadDetails() {
      try {
        const details = await transport.fetchContactDetails(selectedChatId!)
        if (!cancelled) {
          setContactDetails(details)
          setMarketingOptIn(details.marketingOptIn ?? true)
        }
      } catch {
        // silently ignore — panel shows placeholder data
      }
    }

    loadDetails()
    return () => {
      cancelled = true
    }
  }, [showContactDetails, selectedChatId, transport])

  // Reset editing state when panel closes
  React.useEffect(() => {
    if (!showContactDetails) {
      setIsEditing(false)
    }
  }, [showContactDetails])

  const handleClose = React.useCallback(() => {
    setIsEditing(false)
    setShowContactDetails(false)
  }, [setShowContactDetails])

  const displayName = contactDetails?.name ?? name
  const phone = contactDetails?.phone ?? "98765 43210"
  const email = contactDetails?.email ?? "email@example.com"
  const source = contactDetails?.source ?? "Chat"
  const tags = contactDetails?.tags ?? ["VIP Customer", "Enterprise"]
  const location = contactDetails?.location ?? "XYZ, place"
  const secondaryPhone = contactDetails?.secondaryPhone
  const dob = contactDetails?.dob

  const editFooter = (
    <>
      <Button
        variant="outline"
        className="flex-1"
        onClick={() => setShowDiscardConfirm(true)}
      >
        Cancel
      </Button>
      <Button
        className="flex-1"
        leftIcon={<Check className="size-4" />}
        onClick={() => setIsEditing(false)}
      >
        Save Details
      </Button>
    </>
  )

  return (
    <>
      <Panel
        open={showContactDetails}
        title={isEditing ? "Edit Details" : "Contact Details"}
        onClose={handleClose}
        footer={isEditing ? editFooter : undefined}
      >
        {isEditing ? (
          /* ── Edit View ── */
          <div key="edit" className="animate-in fade-in duration-200 ease-out">
            {/* Name field */}
            <div className="px-4 py-4 border-b border-solid border-semantic-border-layout">
              <TextField
                label="Name"
                required
                defaultValue={displayName}
                leftIcon={<User className="size-[18px]" />}
                size="sm"
                autoFocus
              />
            </div>

            <Accordion
              type="multiple"
              defaultValue={["basic", "custom"]}
              variant="bordered"
              className="rounded-none border-x-0"
            >
              {/* Basic Information */}
              <AccordionItem value="basic">
                <AccordionTrigger>
                  <span className="text-sm font-semibold text-semantic-text-primary">
                    Basic Information
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    {/* Phone */}
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="edit-phone"
                        className="text-sm font-medium text-semantic-text-muted"
                      >
                        Phone
                        <span className="text-semantic-error-primary ml-0.5">
                          *
                        </span>
                      </label>
                      <div className="flex items-center border border-solid border-semantic-border-layout rounded bg-semantic-bg-ui opacity-60 cursor-not-allowed">
                        <div className="flex items-center gap-1.5 pl-3 pr-2 h-9 shrink-0">
                          <span className="text-sm">🇮🇳</span>
                          <span className="text-sm text-semantic-text-secondary">
                            +91
                          </span>
                        </div>
                        <div className="w-px h-5 bg-semantic-border-layout shrink-0" />
                        <input
                          id="edit-phone"
                          type="tel"
                          defaultValue={phone}
                          disabled
                          aria-required="true"
                          className="flex-1 h-9 px-3 text-sm text-semantic-text-primary placeholder:text-semantic-text-muted outline-none bg-transparent min-w-0"
                        />
                      </div>
                    </div>
                    <TextField
                      label="Email"
                      placeholder="Enter Email"
                      defaultValue={email !== "email@example.com" ? email : ""}
                      size="sm"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-semantic-text-muted">
                          Marketing Opt In
                        </span>
                        <Info className="size-3.5 text-semantic-text-muted shrink-0" />
                      </div>
                      <Switch
                        checked={marketingOptIn}
                        onCheckedChange={setMarketingOptIn}
                      />
                    </div>
                    <TextField
                      label="Source"
                      value={source}
                      disabled
                      size="sm"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Custom Fields */}
              <AccordionItem value="custom">
                <AccordionTrigger>
                  <span className="text-sm font-semibold text-semantic-text-primary">
                    Custom Fields
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-semantic-text-muted">
                        Tags
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <div className="flex gap-1.5 flex-1 min-w-0">
                              {tags.map((tag) => (
                                <Tag key={tag} variant="default" size="sm">
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                            <ChevronDown className="size-4 shrink-0" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="w-[--radix-dropdown-menu-trigger-width]"
                        >
                          <DropdownMenuItem>VIP Customer</DropdownMenuItem>
                          <DropdownMenuItem>Enterprise</DropdownMenuItem>
                          <DropdownMenuItem>New Lead</DropdownMenuItem>
                          <DropdownMenuItem>Support</DropdownMenuItem>
                          <DropdownMenuItem>Billing</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {[
                      {
                        label: "Location",
                        placeholder: "Enter Location",
                        defaultValue: location,
                      },
                      {
                        label: "Secondary Phone",
                        placeholder: "XXXXX XXXXX",
                        defaultValue: secondaryPhone,
                      },
                      {
                        label: "DOB",
                        placeholder: "DD / MM / YYYY",
                        defaultValue: dob,
                      },
                    ].map(({ label, placeholder, defaultValue }) => (
                      <TextField
                        key={label}
                        label={label}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        size="sm"
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ) : (
          /* ── View Mode (two-column layout) ── */
          <div key="view" className="animate-in fade-in duration-200 ease-out">
            {/* Name + Edit button */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-solid border-semantic-border-layout">
              <span className="text-base font-semibold text-semantic-text-primary">
                {displayName}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="size-4" />
              </Button>
            </div>

            {/* Basic Information */}
            <div className="px-4 pt-3 pb-2 border-t border-solid border-semantic-border-layout">
              <span className="text-[13px] font-semibold text-semantic-text-primary">
                Basic Information
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Phone
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  🇮🇳 +91 {phone}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Email
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  {email}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0 flex items-center gap-1">
                  Marketing Opt In
                  <Info className="size-3.5 text-semantic-text-muted shrink-0" />
                </span>
                <div className="flex-1">
                  <Switch
                    checked={marketingOptIn}
                    onCheckedChange={setMarketingOptIn}
                    size="sm"
                  />
                </div>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Source
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  {source}
                </span>
              </div>
            </div>

            {/* Custom Fields */}
            <div className="px-4 pt-3 pb-2 border-t border-solid border-semantic-border-layout">
              <span className="text-[13px] font-semibold text-semantic-text-primary">
                Custom Fields
              </span>
            </div>
            <div className="flex flex-col pb-2 border-b border-solid border-semantic-border-layout">
              <div className="flex items-start py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0 pt-0.5">
                  Tags
                </span>
                <div className="flex flex-wrap gap-1.5 flex-1">
                  {tags.map((tag) => (
                    <Tag key={tag} variant="default" size="sm">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Location
                </span>
                <span className="text-sm text-semantic-text-primary flex-1">
                  {location}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  Secondary Phone
                </span>
                <span
                  className={`text-sm flex-1 ${secondaryPhone ? "text-semantic-text-primary" : "text-semantic-text-placeholder"}`}
                >
                  {secondaryPhone || "XXXXX XXXXX"}
                </span>
              </div>
              <div className="flex items-center py-2.5 px-4">
                <span className="text-sm text-semantic-text-muted w-[120px] shrink-0">
                  DOB
                </span>
                <span
                  className={`text-sm flex-1 ${dob ? "text-semantic-text-primary" : "text-semantic-text-placeholder"}`}
                >
                  {dob || "DD / MM / YYYY"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Panel>
      <ConfirmationModal
        open={showDiscardConfirm}
        onOpenChange={setShowDiscardConfirm}
        title="Discard Changes?"
        description="Your unsaved edits will be lost."
        variant="destructive"
        confirmButtonText="Discard"
        onConfirm={() => {
          setIsEditing(false)
          setShowDiscardConfirm(false)
        }}
      />
    </>
  )
}
