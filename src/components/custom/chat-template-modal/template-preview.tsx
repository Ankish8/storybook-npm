import * as React from "react"
import {
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Reply,
} from "lucide-react"
import type { TemplateDef, VarMap } from "../chat-types"
import { resolveVars, DeliveryRow } from "./template-helpers"

/* ── TemplatePreviewEmpty ── */
export function TemplatePreviewEmpty({
  illustrationSrc,
}: {
  illustrationSrc?: string
}) {
  return (
    <div className="flex flex-col items-center gap-5 pt-20 pb-8 px-6">
      {illustrationSrc ? (
        <img src={illustrationSrc} alt="" className="size-[140px]" />
      ) : (
        <div className="size-[140px] rounded-2xl bg-semantic-bg-ui flex items-center justify-center">
          <FileSpreadsheet className="size-16 text-semantic-text-muted" />
        </div>
      )}
      <p className="m-0 text-[18px] font-semibold text-semantic-text-primary">
        No template selected
      </p>
    </div>
  )
}

/* ── TemplateCarouselPreview ── */
export function TemplateCarouselPreview({
  template,
  varValues,
}: {
  template: TemplateDef
  varValues: VarMap
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(
    (template.cards?.length || 0) > 1,
  )

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }

  const scroll =
    (dir: "left" | "right") => (e: React.MouseEvent) => {
      e.stopPropagation()
      scrollRef.current?.scrollBy({
        left: dir === "right" ? 272 : -272,
        behavior: "smooth",
      })
      setTimeout(updateScrollState, 350)
    }

  return (
    <div className="bg-semantic-info-surface border border-solid border-semantic-border-layout rounded overflow-hidden w-full max-w-[360px]">
      {/* Body text */}
      <div className="px-3 pt-3">
        <p className="text-[14px] leading-5 text-semantic-text-primary m-0">
          {resolveVars(template.body, varValues)}
        </p>
      </div>

      {/* Cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-3 overflow-x-auto px-3 pt-2 pb-3"
          style={{ scrollbarWidth: "none" }}
        >
          {(template.cards || []).map((card, i) => {
            const imgUrl = template.cardImages?.[i]
            return (
              <div
                key={card.cardIndex}
                className="shrink-0 bg-white rounded border border-solid border-semantic-border-layout overflow-hidden shadow-[0px_1px_3px_0px_rgba(10,13,18,0.08)]"
                style={{ width: 260 }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={`Card ${card.cardIndex}`}
                    className="w-full object-cover"
                    style={{ height: 200 }}
                  />
                ) : (
                  <div
                    className="w-full bg-semantic-bg-ui flex items-center justify-center"
                    style={{ height: 200 }}
                  >
                    <FileSpreadsheet className="size-10 text-semantic-text-muted" />
                  </div>
                )}
                <div className="px-3 pt-2.5 pb-2">
                  <p className="text-[14px] font-semibold text-semantic-text-primary m-0">
                    {card.bodyVariables.length > 0
                      ? resolveVars(card.bodyVariables[0], varValues)
                      : `Card ${card.cardIndex}`}
                  </p>
                  {card.bodyVariables.slice(1).map((v) => (
                    <p
                      key={v}
                      className="text-[13px] text-semantic-text-muted m-0 mt-0.5"
                    >
                      {resolveVars(v, varValues)}
                    </p>
                  ))}
                </div>
                {card.buttonVariables.map((v, j) => (
                  <button
                    key={j}
                    className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                    style={{ height: 40 }}
                  >
                    <ExternalLink className="size-4" />
                    {resolveVars(v, varValues) || "View details"}
                  </button>
                ))}
                {card.buttonVariables.length === 0 && (
                  <button
                    className="flex items-center justify-center gap-2 w-full border-t border-solid border-semantic-border-layout text-[13px] font-semibold text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors"
                    style={{ height: 40 }}
                  >
                    <Reply className="size-4" />
                    Interested
                  </button>
                )}
              </div>
            )
          })}
        </div>
        {canScrollLeft && (
          <button
            aria-label="Scroll template preview left"
            onClick={scroll("left")}
            className="absolute left-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronLeft className="size-4 text-semantic-text-primary" />
          </button>
        )}
        {canScrollRight && (
          <button
            aria-label="Scroll template preview right"
            onClick={scroll("right")}
            className="absolute right-2 top-[calc(50%-12px)] size-7 rounded-full bg-white shadow-[0px_2px_6px_0px_rgba(10,13,18,0.12)] flex items-center justify-center hover:bg-semantic-bg-hover transition-colors"
          >
            <ChevronRight className="size-4 text-semantic-text-primary" />
          </button>
        )}
      </div>

      {/* Footer + delivery */}
      <div className="px-3 pb-2">
        {template.footer && (
          <p className="text-[12px] text-semantic-text-muted m-0 mb-1">
            {template.footer}
          </p>
        )}
        <DeliveryRow />
      </div>
    </div>
  )
}

/* ── TemplatePreviewBubble ── */
export function TemplatePreviewBubble({
  template,
  varValues,
}: {
  template: TemplateDef
  varValues: VarMap
}) {
  if (template.type === "text") {
    return (
      <div className="bg-semantic-info-surface rounded-lg px-3 pt-3 pb-2 max-w-[280px] w-full">
        <p className="m-0 text-[14px] leading-[1.4] text-semantic-text-primary">
          {resolveVars(template.body, varValues)}
        </p>
        {template.button && (
          <div className="border-t border-solid border-semantic-border-layout mt-2 pt-2 flex items-center justify-center gap-1.5 text-semantic-text-primary text-[13px] font-semibold">
            <Reply className="size-3.5" />
            {template.button}
          </div>
        )}
        <DeliveryRow />
      </div>
    )
  }

  if (template.type === "image") {
    return (
      <div className="bg-semantic-info-surface rounded-lg overflow-hidden max-w-[280px] w-full">
        <img
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=560&h=320&fit=crop"
          alt="Template image"
          className="w-full h-[160px] object-cover"
        />
        <div className="px-3 pt-2.5 pb-2">
          <p className="m-0 text-[14px] leading-[1.4] text-semantic-text-primary">
            {resolveVars(template.body, varValues)}
          </p>
          {template.button && (
            <div className="border-t border-solid border-semantic-border-layout mt-2 pt-2 flex items-center justify-center gap-1.5 text-semantic-text-primary text-[13px] font-semibold">
              <Reply className="size-3.5" />
              {template.button}
            </div>
          )}
          <DeliveryRow />
        </div>
      </div>
    )
  }

  if (template.type === "carousel") {
    return (
      <TemplateCarouselPreview template={template} varValues={varValues} />
    )
  }

  return null
}
