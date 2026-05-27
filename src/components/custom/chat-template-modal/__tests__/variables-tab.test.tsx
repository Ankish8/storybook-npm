import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import type { CardVarMap, TemplateDef, VarMap } from "../../chat-types"
import { VariablesTab } from "../variables-tab"

const template: TemplateDef = {
  id: "suv-plan",
  name: "SUV Plan",
  category: "marketing",
  type: "text",
  body: "Hi {{name}}",
  bodyVariables: ["{{name}}"],
}

function VariablesTabHarness() {
  const [showVariables, setShowVariables] = React.useState(true)
  const [varValues, setVarValues] = React.useState<VarMap>({})
  const [varErrors, setVarErrors] = React.useState<Record<string, boolean>>({})
  const [cardVarValues, setCardVarValues] = React.useState<CardVarMap>({})
  const [cardVarErrors, setCardVarErrors] = React.useState<
    Record<
      number,
      { body: Record<string, boolean>; button: Record<string, boolean> }
    >
  >({})

  return (
    <div>
      <button
        type="button"
        onClick={() => setShowVariables((current) => !current)}
      >
        Switch tabs
      </button>
      {showVariables ? (
        <VariablesTab
          template={template}
          varValues={varValues}
          setVarValues={setVarValues}
          varErrors={varErrors}
          setVarErrors={setVarErrors}
          cardVarValues={cardVarValues}
          setCardVarValues={setCardVarValues}
          cardVarErrors={cardVarErrors}
          setCardVarErrors={setCardVarErrors}
        />
      ) : (
        <div>Media tab</div>
      )}
    </div>
  )
}

describe("VariablesTab", () => {
  it("keeps blank-field validation across tab switches and clears it while typing", async () => {
    const user = userEvent.setup()
    render(<VariablesTabHarness />)

    const input = screen.getByPlaceholderText("Enter value")

    await user.click(input)
    await user.tab()

    expect(screen.getByText("This field is required.")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Switch tabs" }))
    expect(screen.getByText("Media tab")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Switch tabs" }))
    expect(screen.getByText("This field is required.")).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText("Enter value"), "A")
    expect(screen.queryByText("This field is required.")).not.toBeInTheDocument()

    const updatedInput = screen.getByPlaceholderText("Enter value")
    await user.clear(updatedInput)
    await user.click(updatedInput)
    await user.tab()

    expect(screen.getByText("This field is required.")).toBeInTheDocument()
  })
})
