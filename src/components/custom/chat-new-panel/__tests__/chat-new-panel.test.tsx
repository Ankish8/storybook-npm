import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ChatNewPanel } from "../chat-new-panel"

const { mockUseChatContext } = vi.hoisted(() => ({
  mockUseChatContext: vi.fn(),
}))

vi.mock("../../chat-provider", () => ({
  useChatContext: () => mockUseChatContext(),
}))

const channels = Array.from({ length: 8 }, (_, index) => ({
  id: `channel-${index + 1}`,
  name: `Channel ${index + 1}`,
  phone: `+91 120438508${index}`,
  badge: index === 0 ? "MY03" : "HE03",
}))

describe("ChatNewPanel", () => {
  beforeEach(() => {
    mockUseChatContext.mockReturnValue({
      channels,
      contacts: [],
    })
  })

  it("keeps the channel selector list height capped and scrollable", async () => {
    const user = userEvent.setup()
    render(<ChatNewPanel onBack={vi.fn()} onOpenAddContact={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: /MY03/i }))

    const firstChannel = await screen.findByText("Channel 1")
    const scrollContainer = firstChannel.closest("div[class*='max-h-']")

    expect(scrollContainer).toHaveClass(
      "max-h-[260px]",
      "overflow-y-auto",
      "overscroll-contain"
    )
  })
})
