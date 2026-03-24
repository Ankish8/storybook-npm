import * as React from "react"
import { FileSpreadsheet, X, Send, Eye } from "lucide-react"
import type {
  TemplateDef,
  TemplateCategory,
  VarMap,
  CardVarMap,
} from "../chat-types"
import { useChatContext } from "../chat-provider"
import { Button } from "../../ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../../ui/dialog"
import { SelectField } from "../../ui/select-field"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { ConfirmationModal } from "../../ui/confirmation-modal"
import { TemplatePreviewEmpty, TemplatePreviewBubble } from "./template-preview"
import { VariablesTab } from "./variables-tab"
import { MediaTab } from "./media-tab"

const templateCategoryOptions: { id: TemplateCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marketing", label: "Marketing" },
  { id: "utility", label: "Utility" },
  { id: "authentication", label: "Authentication" },
]

export interface ChatTemplateModalProps {
  /** Optional illustration image source for the empty preview state */
  illustrationSrc?: string
  /** Optional callback when "Create new" template link is clicked */
  onCreateNew?: () => void
}

export function ChatTemplateModal({
  illustrationSrc,
  onCreateNew,
}: ChatTemplateModalProps) {
  const { templates, sendTemplate, setShowTemplateModal } = useChatContext()

  const [selectedCategory, setSelectedCategory] =
    React.useState<TemplateCategory>("all")
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<TemplateDef | null>(null)
  const [activeTab, setActiveTab] = React.useState<"variables" | "media">(
    "variables",
  )
  const [tabSlideDir, setTabSlideDir] = React.useState<"left" | "right">(
    "right",
  )
  const [varValues, setVarValues] = React.useState<VarMap>({})
  const [cardVarValues, setCardVarValues] = React.useState<CardVarMap>({})
  const [uploadedMedia, setUploadedMedia] = React.useState<
    Record<number, File | null>
  >({})
  const [mediaDeleteIndex, setMediaDeleteIndex] = React.useState<number | null>(
    null,
  )

  const handleSelectTemplate = (t: TemplateDef) => {
    setSelectedTemplate(t)
    setVarValues({})
    setCardVarValues({})
    setUploadedMedia({})
    setActiveTab("variables")
  }

  const handleClose = () => setShowTemplateModal(false)

  const handleSend = () => {
    if (selectedTemplate) {
      sendTemplate(selectedTemplate.id, varValues, cardVarValues)
    }
    handleClose()
  }

  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) handleClose()
        }}
      >
        <DialogContent
          size="xl"
          className="max-w-[1100px] h-[88vh] max-h-[800px] p-0 gap-0 flex flex-col"
          hideCloseButton
        >
          <DialogDescription className="sr-only">
            Select from pre-approved message templates
          </DialogDescription>

          {/* ── Header: title + close ── */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-solid border-semantic-border-layout shrink-0">
            <div>
              <DialogTitle>Select Template</DialogTitle>
              <p className="text-[13px] text-semantic-text-muted mt-0.5 m-0">
                Select from pre-approved message templates
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="size-[18px]" />
            </Button>
          </div>

          {/* ── Body: LEFT (selectors + variables) | RIGHT (preview) ── */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* ── Left column ── */}
            <div className="flex-[1.25] border-r border-solid border-semantic-border-layout flex flex-col min-h-0">
              {/* Selectors section */}
              <div className="px-5 pt-5 pb-4 border-b border-solid border-semantic-border-layout shrink-0">
                <div className="flex items-start gap-3">
                  {/* Category */}
                  <div className="w-[160px] shrink-0">
                    <SelectField
                      label="Category"
                      options={templateCategoryOptions.map((c) => ({
                        value: c.id,
                        label: c.label,
                      }))}
                      value={selectedCategory}
                      onValueChange={(v) => {
                        setSelectedCategory(v as TemplateCategory)
                        setSelectedTemplate(null)
                      }}
                    />
                  </div>

                  {/* Template selector */}
                  <div className="flex-1 min-w-0">
                    <SelectField
                      label="Template"
                      required
                      searchable
                      searchPlaceholder="Search templates..."
                      placeholder="Select a template"
                      options={templates
                        .filter(
                          (t) =>
                            selectedCategory === "all" ||
                            t.category === selectedCategory,
                        )
                        .map((t) => ({ value: t.id, label: t.name }))}
                      value={selectedTemplate?.id ?? ""}
                      onValueChange={(id) => {
                        const t = templates.find((tmpl) => tmpl.id === id)
                        if (t) handleSelectTemplate(t)
                      }}
                    />
                  </div>
                </div>
                <p className="m-0 text-[13px] text-semantic-text-muted mt-2">
                  Template not found?{" "}
                  <button
                    type="button"
                    className="text-semantic-text-link underline font-medium hover:text-semantic-text-link bg-transparent border-none p-0 cursor-pointer text-[13px]"
                    onClick={onCreateNew}
                  >
                    Create new
                  </button>
                </p>
              </div>

              {/* Variables / Media section */}
              {selectedTemplate ? (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={(v) => {
                      const tab = v as "variables" | "media"
                      setTabSlideDir(tab === "media" ? "right" : "left")
                      setActiveTab(tab)
                    }}
                  >
                    <TabsList className="shrink-0 px-5">
                      <TabsTrigger value="variables">
                        Template variables
                      </TabsTrigger>
                      <TabsTrigger value="media">Media</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <div
                    key={activeTab}
                    className={`animate-in ${tabSlideDir === "right" ? "slide-in-from-right-3" : "slide-in-from-left-3"} fade-in duration-200 ease-out flex flex-col flex-1 min-h-0 overflow-hidden`}
                  >
                    {activeTab === "variables" ? (
                      <VariablesTab
                        template={selectedTemplate}
                        varValues={varValues}
                        setVarValues={setVarValues}
                        cardVarValues={cardVarValues}
                        setCardVarValues={setCardVarValues}
                      />
                    ) : (
                      <MediaTab
                        template={selectedTemplate}
                        uploadedMedia={uploadedMedia}
                        setUploadedMedia={setUploadedMedia}
                        onDeleteMedia={(cardIndex) =>
                          setMediaDeleteIndex(cardIndex)
                        }
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="size-14 rounded-xl bg-semantic-bg-ui flex items-center justify-center">
                    <FileSpreadsheet className="size-7 text-semantic-text-muted" />
                  </div>
                  <div>
                    <p className="m-0 text-[14px] font-semibold text-semantic-text-secondary">
                      No template selected
                    </p>
                    <p className="m-0 text-[13px] text-semantic-text-muted mt-0.5">
                      Choose a template above to map variables
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column: preview + send button ── */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="px-5 pt-5 pb-3 shrink-0 border-b border-solid border-semantic-border-layout flex items-center gap-2">
                <Eye className="size-[14px] text-semantic-text-secondary" />
                <p className="m-0 text-[12px] font-semibold tracking-wide uppercase text-semantic-text-secondary">
                  Preview
                </p>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 bg-semantic-bg-ui">
                {selectedTemplate ? (
                  <div className="w-full flex flex-col items-end">
                    <TemplatePreviewBubble
                      template={selectedTemplate}
                      varValues={varValues}
                    />
                  </div>
                ) : (
                  <TemplatePreviewEmpty illustrationSrc={illustrationSrc} />
                )}
              </div>
              <div className="px-5 py-4 shrink-0 border-t-2 border-solid border-semantic-border-layout bg-white shadow-[0_-4px_12px_0_rgba(10,13,18,0.06)]">
                <Button
                  onClick={handleSend}
                  disabled={!selectedTemplate}
                  className="w-full gap-2"
                >
                  Send Template
                  <Send className="size-[16px]" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmationModal
        open={mediaDeleteIndex !== null}
        onOpenChange={(open) => {
          if (!open) setMediaDeleteIndex(null)
        }}
        title="Remove uploaded media?"
        description="This media file will be removed from the template."
        variant="destructive"
        confirmButtonText="Remove"
        onConfirm={() => {
          if (mediaDeleteIndex !== null) {
            setUploadedMedia((p) => ({ ...p, [mediaDeleteIndex]: null }))
          }
          setMediaDeleteIndex(null)
        }}
      />
    </>
  )
}
