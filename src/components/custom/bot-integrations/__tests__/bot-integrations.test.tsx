import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { BotIntegrations } from "../bot-integrations"
import type { IntegrationItem } from "../types"

const SIMPLE_INTEGRATIONS: IntegrationItem[] = [
  { id: "int-1", name: "Google Sheets" },
  { id: "int-2", name: "Slack" },
  { id: "int-3", name: "HubSpot CRM" },
]

const RICH_INTEGRATIONS: IntegrationItem[] = [
  {
    id: "int-1",
    name: "Lead Capture Sheet",
    icon: <img src="/icons/gsheets.png" alt="Google Sheets" data-testid="integration-icon" />,
    status: "Connected",
    statusVariant: "active",
    subtitle: "Google Sheets • 1 tool configured",
    description: "Log all incoming patient leads to the centralized Hospital Leads sheet.",
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
      screen.getByRole("button", { name: /integrations/i })
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

  it("renders status badge when provided", () => {
    render(<BotIntegrations integrations={RICH_INTEGRATIONS} />)
    expect(screen.getByText("Connected")).toBeInTheDocument()
  })

  it("renders subtitle when provided", () => {
    render(<BotIntegrations integrations={RICH_INTEGRATIONS} />)
    expect(
      screen.getByText("Google Sheets • 1 tool configured")
    ).toBeInTheDocument()
  })

  it("renders description when provided", () => {
    render(<BotIntegrations integrations={RICH_INTEGRATIONS} />)
    expect(
      screen.getByText(
        "Log all incoming patient leads to the centralized Hospital Leads sheet."
      )
    ).toBeInTheDocument()
  })

  // ── Callbacks ──────────────────────────────────────────────────────────────

  it("calls onAdd when add button is clicked", async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<BotIntegrations integrations={[]} onAdd={onAdd} />)
    const addBtn = screen.getByRole("button", { name: /integrations/i })
    await user.click(addBtn)
    expect(onAdd).toHaveBeenCalledTimes(1)
  })

  it("calls onConfigure with integration id", async () => {
    const user = userEvent.setup()
    const onConfigure = vi.fn()
    render(
      <BotIntegrations
        integrations={SIMPLE_INTEGRATIONS}
        onConfigure={onConfigure}
      />
    )
    const configBtns = screen.getAllByRole("button", { name: "Configure" })
    await user.click(configBtns[0])
    expect(onConfigure).toHaveBeenCalledWith("int-1")
  })

  it("renders custom configure label", () => {
    render(
      <BotIntegrations
        integrations={SIMPLE_INTEGRATIONS}
        onConfigure={vi.fn()}
        configureLabel="Setup"
      />
    )
    expect(screen.getAllByRole("button", { name: "Setup" })).toHaveLength(3)
  })

  it("calls onEdit with integration id", async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(
      <BotIntegrations integrations={SIMPLE_INTEGRATIONS} onEdit={onEdit} />
    )
    const editBtn = screen.getByLabelText("Edit Google Sheets")
    await user.click(editBtn)
    expect(onEdit).toHaveBeenCalledWith("int-1")
  })

  it("calls onDelete with integration id", async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(
      <BotIntegrations
        integrations={SIMPLE_INTEGRATIONS}
        onDelete={onDelete}
      />
    )
    const deleteBtn = screen.getByLabelText("Delete Slack")
    await user.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledWith("int-2")
  })

  it("hides edit buttons when onEdit is not provided", () => {
    render(
      <BotIntegrations
        integrations={SIMPLE_INTEGRATIONS}
        onDelete={vi.fn()}
      />
    )
    expect(screen.queryByLabelText("Edit Google Sheets")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Delete Google Sheets")).toBeInTheDocument()
  })

  it("hides delete buttons when onDelete is not provided", () => {
    render(
      <BotIntegrations
        integrations={SIMPLE_INTEGRATIONS}
        onEdit={vi.fn()}
      />
    )
    expect(
      screen.queryByLabelText("Delete Google Sheets")
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText("Edit Google Sheets")).toBeInTheDocument()
  })

  it("hides configure button when onConfigure is not provided", () => {
    render(
      <BotIntegrations integrations={SIMPLE_INTEGRATIONS} onEdit={vi.fn()} />
    )
    expect(screen.queryByRole("button", { name: "Configure" })).not.toBeInTheDocument()
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
    const addBtn = screen.getByRole("button", { name: /integrations/i })
    expect(addBtn).toBeDisabled()
  })

  it("disables edit, delete, and configure buttons when disabled", () => {
    render(
      <BotIntegrations
        integrations={SIMPLE_INTEGRATIONS}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onConfigure={vi.fn()}
        disabled
      />
    )
    const editBtn = screen.getByLabelText("Edit Google Sheets")
    const deleteBtn = screen.getByLabelText("Delete Google Sheets")
    const configBtn = screen.getAllByRole("button", { name: "Configure" })[0]
    expect(editBtn).toBeDisabled()
    expect(deleteBtn).toBeDisabled()
    expect(configBtn).toBeDisabled()
  })

  // ── Tooltip ────────────────────────────────────────────────────────────────

  it("renders info icon always", () => {
    const { container } = render(<BotIntegrations integrations={[]} />)
    const infoIcons = container.querySelectorAll("svg.lucide-info")
    expect(infoIcons.length).toBeGreaterThanOrEqual(1)
  })
})
