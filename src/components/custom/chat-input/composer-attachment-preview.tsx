import * as React from "react"
import { X, Play, File } from "lucide-react"
import { ConfirmationModal } from "../../ui/confirmation-modal"

export interface ComposerAttachmentPreviewProps {
  /** The file to preview before sending */
  file: File
  /** Called when the user confirms removal of the attachment */
  onRemove: () => void
}

/**
 * ComposerAttachmentPreview shows a preview of an attached file (image, video,
 * audio, or document) inside the chat composer. Includes a remove button that
 * triggers a confirmation modal before actually discarding the attachment.
 */
function ComposerAttachmentPreview({ file, onRemove }: ComposerAttachmentPreviewProps) {
  const url = React.useMemo(() => URL.createObjectURL(file), [file])
  const isImage = file.type.startsWith("image/")
  const isVideo = file.type.startsWith("video/")
  const isAudio = file.type.startsWith("audio/")
  const [showConfirm, setShowConfirm] = React.useState(false)

  React.useEffect(() => {
    return () => URL.revokeObjectURL(url)
  }, [url])

  return (
    <div className="relative border-b border-solid border-semantic-border-layout">
      <button
        aria-label="Remove attachment"
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 z-10 size-7 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <X className="size-4 text-white" />
      </button>
      <ConfirmationModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Remove attachment?"
        description={`"${file.name}" will be removed from this message.`}
        variant="destructive"
        confirmButtonText="Remove"
        onConfirm={() => {
          onRemove()
          setShowConfirm(false)
        }}
      />
      {isImage ? (
        <div className="h-[200px] bg-semantic-bg-ui">
          <img src={url} alt={file.name} className="w-full h-full object-cover" />
        </div>
      ) : isVideo ? (
        <div className="relative bg-black h-[200px]">
          <video src={url} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[56px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Play className="size-7 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      ) : isAudio ? (
        <div className="bg-semantic-bg-ui px-4 py-6 flex items-center gap-3 h-[80px]">
          <div className="size-10 rounded-full bg-semantic-primary flex items-center justify-center shrink-0">
            <Play className="size-5 text-white fill-white ml-0.5" />
          </div>
          <div className="flex-1 h-1 bg-semantic-border-layout rounded-full">
            <div className="w-0 h-full bg-semantic-primary rounded-full" />
          </div>
          <span className="text-[12px] text-semantic-text-muted tabular-nums shrink-0">0:00</span>
        </div>
      ) : (
        /* PDF / other document preview */
        <div className="bg-semantic-bg-ui flex flex-col items-center justify-center h-[200px]">
          <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
            <File className="size-8 text-semantic-text-muted" />
          </div>
          <p className="text-[14px] font-semibold text-semantic-text-primary truncate max-w-[80%] px-4 m-0">{file.name}</p>
          <p className="text-[12px] text-semantic-text-muted mt-1 m-0">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
        </div>
      )}
    </div>
  )
}

export { ComposerAttachmentPreview }
