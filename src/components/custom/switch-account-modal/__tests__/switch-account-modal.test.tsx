import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { SwitchAccountModal } from "../switch-account-modal"
import type { AffectedIntegration } from "../types"

const mockIntegrations: AffectedIntegration[] = [
  { id: "int_1", name: "Google Sheets – Sales Data" },
  { id: "int_2", name: "Google Sheets – Support Tickets" },
  { id: "int_3", name: "Google Sheets – Reporting Bot" },
]

describe("SwitchAccountModal", () => {
  const setup = (
    props: Partial<React.ComponentProps<typeof SwitchAccountModal>> = {}
  ) => {
    const onOpenChange = vi.fn()
    render(
      <SwitchAccountModal
        open
        onOpenChange={onOpenChange}
        accountId="acc_z2sitok"
        affectedIntegrations={mockIntegrations}
        {...props}
      />
    )
    return { onOpenChange }
  }

  it("renders title, description with account id, and action buttons", () => {
    setup()
    expect(screen.getByText("Switch Account?")).toBeInTheDocument()
    expect(
      screen.getByText(/You are switching to account acc_z2sitok/i)
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  })

  it("renders the info banner copy", () => {
    setup()
    expect(
      screen.getByText(/All the current integrations will be affected/i)
    ).toBeInTheDocument()
  })

  it("renders all affected integrations", () => {
    setup()
    expect(
      screen.getByText("Google Sheets – Sales Data")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Google Sheets – Support Tickets")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Google Sheets – Reporting Bot")
    ).toBeInTheDocument()
  })

  it("shows empty-state copy when affectedIntegrations is empty", () => {
    setup({ affectedIntegrations: [] })
    expect(
      screen.getByText("No integrations are currently affected.")
    ).toBeInTheDocument()
  })

  it("calls onCancel and onOpenChange(false) when Cancel is clicked", () => {
    const onCancel = vi.fn()
    const { onOpenChange } = setup({ onCancel })

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("calls onConfirm when Confirm is clicked", () => {
    const onConfirm = vi.fn()
    setup({ onConfirm })

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it("does NOT auto-close on Confirm (parent owns that)", () => {
    const onConfirm = vi.fn()
    const { onOpenChange } = setup({ onConfirm })

    fireEvent.click(screen.getByRole("button", { name: "Confirm" }))

    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("renders custom cancelLabel and confirmLabel", () => {
    setup({ cancelLabel: "Keep current", confirmLabel: "Switch anyway" })
    expect(
      screen.getByRole("button", { name: "Keep current" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Switch anyway" })
    ).toBeInTheDocument()
  })

  it("disables Cancel while isConfirming is true", () => {
    setup({ isConfirming: true })
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled()
  })

  it("calls onCancel and onOpenChange when the close (X) button is clicked", () => {
    const onCancel = vi.fn()
    const { onOpenChange } = setup({ onCancel })

    fireEvent.click(screen.getByRole("button", { name: "Close" }))

    expect(onCancel).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("applies custom className and additional HTML props", () => {
    setup({ className: "custom-switch-modal", "data-testid": "switch-modal" })

    const modal = screen.getByTestId("switch-modal")
    expect(modal).toHaveClass("custom-switch-modal")
  })

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <SwitchAccountModal
        ref={ref}
        open
        onOpenChange={vi.fn()}
        accountId="acc_z2sitok"
        affectedIntegrations={mockIntegrations}
      />
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("renders a custom icon when provided on an integration", () => {
    setup({
      affectedIntegrations: [
        {
          id: "int_custom",
          name: "Custom Integration",
          icon: <span data-testid="custom-icon">★</span>,
        },
      ],
    })
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
  })

  it("all <p> elements have m-0 class for Bootstrap compatibility", () => {
    const { container } = render(
      <SwitchAccountModal
        open
        onOpenChange={vi.fn()}
        accountId="acc_z2sitok"
        affectedIntegrations={mockIntegrations}
      />
    )
    // Note: container scope is the portal host, dialog renders to document.body.
    // Query against document to cover the DialogContent tree as well.
    const paragraphs = document.querySelectorAll("p")
    expect(paragraphs.length).toBeGreaterThan(0)
    paragraphs.forEach((p) => {
      const classList = p.className
      expect(
        classList.includes("m-0") ||
          classList.includes("mb-0") ||
          classList.includes("my-0")
      ).toBe(true)
    })
    void container
  })
})
