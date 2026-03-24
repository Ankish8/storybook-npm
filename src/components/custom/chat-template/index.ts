// ── Orchestrator ──
export { ChatApp } from "./chat-app"
export type { ChatAppProps } from "./chat-app"

// ── Helpers ──
export { highlightMatch, getInitials, resolveVars } from "./helpers"

// ── Re-exports for convenience ──
// Consumers can import everything from "chat-template" as a single entry point

// Foundation
export { ChatProvider, useChatContext } from "../chat-provider"
export type { ChatContextValue } from "../chat-provider/types"
export { MockTransport } from "../chat-transport"
export type { ChatTransport } from "../chat-transport/types"

// Types
export type {
  Tab,
  TabDef,
  AssigneeItem,
  ChannelItem,
  ChatItem,
  ChatMessage,
  Contact,
  ContactDetails,
  TemplateDef,
  TemplateCategory,
  TemplateType,
  CannedMessage,
  ChatFilters,
  SendMessagePayload,
  TemplateSendPayload,
  VarMap,
  CardVarMap,
  MediaPayload,
  SentByType,
} from "../chat-types"

// UI Modules (for advanced customization)
export { ChatSidebar } from "../chat-sidebar"
export { ChatFilterPanel } from "../chat-filter-panel"
export { ChatNewPanel, AddNewContactModal } from "../chat-new-panel"
export { ChatMessageList } from "../chat-message-list"
export type { ReplyToPayload } from "../chat-message-list"
export { ChatHeader, AssignmentDropdown, ResolveButton } from "../chat-header"
export { ChatInput, ComposerAttachmentPreview } from "../chat-input"
export { ChatTemplateModal } from "../chat-template-modal"
export { ChatContactPanel } from "../chat-contact-panel"
