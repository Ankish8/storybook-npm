import * as React from "react"
import type { TemplateDef, VarMap, CardVarMap } from "../chat-types"
import { VarRow, VarSectionLabel } from "./template-helpers"

export function VariablesTab({
  template,
  varValues,
  setVarValues,
  cardVarValues,
  setCardVarValues,
}: {
  template: TemplateDef
  varValues: VarMap
  setVarValues: React.Dispatch<React.SetStateAction<VarMap>>
  cardVarValues: CardVarMap
  setCardVarValues: React.Dispatch<React.SetStateAction<CardVarMap>>
}) {
  const hasNoVars =
    template.bodyVariables.length === 0 &&
    (template.cards ?? []).every(
      (c) => c.bodyVariables.length === 0 && c.buttonVariables.length === 0,
    )

  if (hasNoVars) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="m-0 text-[14px] font-semibold text-semantic-text-secondary">
          No variables
        </p>
        <p className="m-0 text-[13px] text-semantic-text-muted">
          This template has no dynamic variables to fill in.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-3">
      {/* Top-level body variables */}
      {template.bodyVariables.length > 0 && (
        <>
          <VarSectionLabel>Body variables</VarSectionLabel>
          {template.bodyVariables.map((v) => (
            <VarRow
              key={v}
              varName={v}
              value={varValues[v] || ""}
              onChange={(e) =>
                setVarValues((p) => ({ ...p, [v]: e.target.value }))
              }
            />
          ))}
        </>
      )}

      {/* Per-card variables (carousel) */}
      {template.cards?.map((card) => (
        <div key={card.cardIndex}>
          <div className="flex items-center gap-3 mt-5 mb-1">
            <span className="text-[13px] font-semibold text-semantic-text-primary shrink-0">
              Card {card.cardIndex}
            </span>
            <div className="flex-1 h-px bg-semantic-border-layout" />
          </div>
          {card.bodyVariables.length > 0 && (
            <>
              <VarSectionLabel>Body variables</VarSectionLabel>
              {card.bodyVariables.map((v) => (
                <VarRow
                  key={v}
                  varName={v}
                  value={cardVarValues[card.cardIndex]?.body?.[v] || ""}
                  onChange={(e) =>
                    setCardVarValues((p) => ({
                      ...p,
                      [card.cardIndex]: {
                        body: {
                          ...(p[card.cardIndex]?.body || {}),
                          [v]: e.target.value,
                        },
                        button: p[card.cardIndex]?.button || {},
                      },
                    }))
                  }
                />
              ))}
            </>
          )}
          {card.buttonVariables.length > 0 && (
            <>
              <VarSectionLabel>Button variables</VarSectionLabel>
              {card.buttonVariables.map((v) => (
                <VarRow
                  key={v}
                  varName={v}
                  value={cardVarValues[card.cardIndex]?.button?.[v] || ""}
                  onChange={(e) =>
                    setCardVarValues((p) => ({
                      ...p,
                      [card.cardIndex]: {
                        body: p[card.cardIndex]?.body || {},
                        button: {
                          ...(p[card.cardIndex]?.button || {}),
                          [v]: e.target.value,
                        },
                      },
                    }))
                  }
                />
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  )
}
