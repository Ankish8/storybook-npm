import * as React from "react";

export interface ChatComposerReply {
  /** Name of the person being replied to */
  sender: string;
  /** The quoted message text */
  message: string;
  /** ID of the original message */
  messageId?: string;
}

export interface ChatComposerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "onKeyDown"> {
  /** Current message text value */
  value?: string;
  /** Called when message text changes */
  onChange?: (value: string) => void;
  /** Called when send button is clicked */
  onSend?: () => void;
  /** Textarea placeholder text. Defaults to "Type a message" */
  placeholder?: string;
  /** HTML id for the textarea — allows external label linking via htmlFor */
  textareaId?: string;
  /** aria-label for the textarea. Defaults to the placeholder value */
  textareaAriaLabel?: string;
  /** Whether the composer is disabled */
  disabled?: boolean;
  /**
   * Called on textarea keydown. Use for Enter-to-send, Escape to dismiss,
   * or arrow-key navigation in autocomplete/canned-message menus.
   */
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  /** Reply quote data — shows dismissible reply preview above textarea */
  reply?: ChatComposerReply;
  /** Called when the reply dismiss (X) button is clicked */
  onDismissReply?: () => void;
  /** Called when the reply quote is clicked (e.g., to scroll to original message) */
  onReplyClick?: () => void;
  /** Slot for attachment preview content (rendered above textarea) */
  attachment?: React.ReactNode;
  /** Slot for left action buttons (rendered to the left of textarea) */
  leftActions?: React.ReactNode;
  /** Slot for right action buttons (rendered inside textarea container, bottom-right) */
  rightActions?: React.ReactNode;
  /** Send button label. Defaults to "Send" */
  sendLabel?: string;
  /** Whether to show the send dropdown chevron. Defaults to false */
  showSendDropdown?: boolean;
  /** Whether the chat is expired (shows template prompt instead of composer) */
  expired?: boolean;
  /** Message shown in expired state. Defaults to "This chat has expired. Send a template to continue." */
  expiredMessage?: string;
  /** Called when "Select Template" button is clicked in expired state */
  onTemplateClick?: () => void;
}
