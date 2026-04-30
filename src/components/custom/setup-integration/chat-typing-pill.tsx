import * as React from "react"
import { BouncingLoader } from "../../ui/bouncing-loader"

/**
 * Three-dot typing indicator in the same pill as chat messages in Setup Integration
 * (reuses {@link BouncingLoader} from UI components).
 */
function ChatTypingPill() {
  return (
    <div
      className="inline-flex min-w-[2.75rem] items-center justify-center rounded-full bg-semantic-bg-ui px-3.5 py-2.5"
      data-slot="chat-message-typing"
    >
      <BouncingLoader
        size={8}
        spacing={6}
        color="var(--semantic-text-placeholder)"
      />
    </div>
  )
}

export { ChatTypingPill }
