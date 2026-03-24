import * as React from "react"
import { Trash2, Upload } from "lucide-react"
import type { TemplateDef } from "../chat-types"
import { Button } from "../../ui/button"

export function MediaTab({
  template,
  uploadedMedia,
  setUploadedMedia,
  onDeleteMedia,
}: {
  template: TemplateDef
  uploadedMedia: Record<number, File | null>
  setUploadedMedia: React.Dispatch<
    React.SetStateAction<Record<number, File | null>>
  >
  onDeleteMedia: (cardIndex: number) => void
}) {
  const cards = template.cards || [
    { cardIndex: 1, bodyVariables: [], buttonVariables: [] },
  ]

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {cards.map((card) => (
        <div key={card.cardIndex} className="mb-5">
          {template.type === "carousel" && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[13px] font-semibold text-semantic-text-primary shrink-0">
                Card {card.cardIndex}
              </span>
              <div className="flex-1 h-px bg-semantic-border-layout" />
            </div>
          )}
          {uploadedMedia[card.cardIndex] ? (
            <div className="flex items-center gap-3 px-3 py-2.5 border border-solid border-semantic-border-layout rounded">
              <div className="size-10 shrink-0 rounded overflow-hidden bg-semantic-bg-ui flex items-center justify-center">
                <img
                  src={URL.createObjectURL(uploadedMedia[card.cardIndex]!)}
                  alt=""
                  className="size-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="m-0 text-[13px] font-semibold text-semantic-text-primary truncate">
                  {uploadedMedia[card.cardIndex]!.name}
                </p>
                <p className="m-0 text-[12px] text-semantic-text-muted">
                  {(
                    uploadedMedia[card.cardIndex]!.size /
                    (1024 * 1024)
                  ).toFixed(1)}{" "}
                  MB size
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDeleteMedia(card.cardIndex)}
                className="shrink-0 hover:bg-semantic-error-surface text-semantic-error-primary"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center gap-2 px-4 py-5 border border-dashed border-semantic-border-layout rounded cursor-pointer hover:bg-semantic-bg-hover transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                aria-label={`Upload media for card ${card.cardIndex}`}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file)
                    setUploadedMedia((p) => ({
                      ...p,
                      [card.cardIndex]: file,
                    }))
                }}
              />
              <div className="flex items-center gap-2 text-[14px] font-semibold text-semantic-text-primary">
                <Upload className="size-4" />
                Upload from device
              </div>
              <p className="m-0 text-[13px] text-semantic-text-muted">
                or drag and drop file here
              </p>
              <p className="m-0 text-[11px] text-semantic-text-muted">
                Supported file types: JPG/PNG with 5 MB size
              </p>
            </label>
          )}
        </div>
      ))}
    </div>
  )
}
