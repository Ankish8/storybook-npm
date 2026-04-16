import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { BotIntegrations } from "../bot-integrations"
import type { IntegrationItem, IntegrationItemWithRequiredDescription } from "../types"

const onEditGoogle = vi.fn()
const onDeleteSlack = vi.fn()

const SIMPLE_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-1",
    label: "Google Sheets",
    icon: <span data-testid="icon-1">i</span>,
    onEdit: onEditGoogle,
    onDelete: vi.fn(),
  },
  {
    id: "int-2",
    label: "Slack",
    icon: <span data-testid="icon-2">i</span>,
    onEdit: vi.fn(),
    onDelete: onDeleteSlack,
  },
  {
    id: "int-3",
    label: "HubSpot CRM",
    icon: <span data-testid="icon-3">i</span>,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  },
]

const RICH_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-1",
    label: "Lead Capture Sheet",
    icon: (
      <img
        src="/icons/gsheets.png"
        alt="Google Sheets"
        data-testid="integration-icon"
      />
    ),
    description:
      "Log all incoming patient leads to the centralized Hospital Leads sheet.",
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  },
]

const REQUIRED_DESC_INTEGRATIONS: IntegrationItemWithRequiredDescription[] = [
  {
    id: "int-1",
    label: "Always described",
    icon: <span>icon</span>,
    description: "Required copy for this row.",
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  },
]

describe("BotIntegrations", () => {
  it("renders the title", () => {
    render(<BotIntegrations integrations={[]} />)
    expect(
      screen.getByRole("heading", { name: "Integrations" })
    ).toBeInTheDocument()
  })

  it("renders the add button", () => {
    render(<BotIntegrations integrations={[]} />)
    expect(
      screen.getByRole("button", { name: /add integration/i })
    ).toBeInTheDocument()
  })

  // ── Empty state ────────────────────────────────────────────────────────────

  it("shows empty state when integrations is empty", () => {
    render(<BotIntegrations integrations={[]} />)
    expect(screen.getByText("No integrations yet")).toBeInTheDocument()
    expect(
      screen.getByText(
        "Connect your bot to external apps so it can perform actions and sync data during conversations."
      )
    ).toBeInTheDocument()
  })

  it("renders custom empty state title and description", () => {
    render(
      <BotIntegrations
        integrations={[]}
        emptyStateTitle="Nothing here"
        emptyStateDescription="Add your first integration to get started."
      />
    )
    expect(screen.getByText("Nothing here")).toBeInTheDocument()
    expect(
      screen.getByText("Add your first integration to get started.")
    ).toBeInTheDocument()
  })

  it("renders custom empty state icon", () => {
    render(
      <BotIntegrations
        integrations={[]}
        emptyStateIcon={<span data-testid="custom-icon">icon</span>}
      />
    )
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
  })

  // ── With integrations (simple) ───────────────────────────────────────────

  it("renders integration items when provided", () => {
    render(<BotIntegrations integrations={SIMPLE_INTEGRATIONS} />)
    expect(screen.getByText("Google Sheets")).toBeInTheDocument()
    expect(screen.getByText("Slack")).toBeInTheDocument()
    expect(screen.getByText("HubSpot CRM")).toBeInTheDocument()
  })

  it("does not show empty state when integrations exist", () => {
    render(<BotIntegrations integrations={SIMPLE_INTEGRATIONS} />)
    expect(screen.queryByText("No integrations yet")).not.toBeInTheDocument()
  })

  // ── With integrations (rich) ─────────────────────────────────────────────

  it("renders integration icon when provided", () => {
    render(<BotIntegrations integrations={RICH_INTEGRATIONS} />)
    expect(screen.getByTestId("integration-icon")).toBeInTheDocument()
  })

  it("renders description when provided", () => {
    render(<BotIntegrations integrations={RICH_INTEGRATIONS} />)
    expect(
      screen.getByText(
        "Log all incoming patient leads to the centralized Hospital Leads sheet."
      )
    ).toBeInTheDocument()
  })

  it("does not set native title when label and description are not truncated", () => {
    render(<BotIntegrations integrations={RICH_INTEGRATIONS} />)
    const label = screen.getByText("Lead Capture Sheet")
    const desc = screen.getByText(
      "Log all incoming patient leads to the centralized Hospital Leads sheet."
    )
    // jsdom has no real layout; overflow checks treat text as not truncated
    expect(label).not.toHaveAttribute("title")
    expect(desc).not.toHaveAttribute("title")
  })

  it("accepts descriptionRequirement=\"required\" when every row includes description", () => {
    render(
      <BotIntegrations
        descriptionRequirement="required"
        integrations={REQUIRED_DESC_INTEGRATIONS}
      />
    )
    expect(screen.getByText("Required copy for this row.")).toBeInTheDocument()
  })

  // ── Callbacks ──────────────────────────────────────────────────────────────

  it("calls onAdd when add button is clicked", async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<BotIntegrations integrations={[]} onAdd={onAdd} />)
    const addBtn = screen.getByRole("button", { name: /add integration/i })
    await user.click(addBtn)
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it("calls the row onEdit handler when edit is clicked", async () => {
    const user = userEvent.setup()
    onEditGoogle.mockClear()
    render(<BotIntegrations integrations={SIMPLE_INTEGRATIONS} />)
    const editBtn = screen.getByLabelText("Edit Google Sheets")
    await user.click(editBtn)
    expect(onEditGoogle).toHaveBeenCalledTimes(1)
  })

  it("calls the row onDelete handler when delete is clicked", async () => {
    const user = userEvent.setup()
    onDeleteSlack.mockClear()
    render(<BotIntegrations integrations={SIMPLE_INTEGRATIONS} />)
    const deleteBtn = screen.getByLabelText("Delete Slack")
    await user.click(deleteBtn)
    expect(onDeleteSlack).toHaveBeenCalledTimes(1)
  })

  // ── className & ref ────────────────────────────────────────────────────────

  it("merges custom className", () => {
    const { container } = render(
      <BotIntegrations integrations={[]} className="my-custom-class" />
    )
    expect(container.firstChild).toHaveClass("my-custom-class")
  })

  it("forwards ref", () => {
    const ref = vi.fn()
    render(<BotIntegrations integrations={[]} ref={ref} />)
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })

  // ── Disabled ───────────────────────────────────────────────────────────────

  it("disables the add button when disabled", () => {
    render(<BotIntegrations integrations={[]} disabled />)
    const addBtn = screen.getByRole("button", { name: /add integration/i })
    expect(addBtn).toBeDisabled()
  })

  it("disables edit and delete buttons when disabled", () => {
    render(<BotIntegrations integrations={SIMPLE_INTEGRATIONS} disabled />)
    const editBtn = screen.getByLabelText("Edit Google Sheets")
    const deleteBtn = screen.getByLabelText("Delete Google Sheets")
    expect(editBtn).toBeDisabled()
    expect(deleteBtn).toBeDisabled()
  })

  // ── Tooltip ────────────────────────────────────────────────────────────────

  it("renders info icon always", () => {
    const { container } = render(<BotIntegrations integrations={[]} />)
    const infoIcons = container.querySelectorAll("svg.lucide-info")
    expect(infoIcons.length).toBeGreaterThanOrEqual(1)
  })
})
