import * as React from "react";
import { X, Play, File } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { AttachmentPreviewProps } from "./types";

const AttachmentPreview = React.forwardRef(
  ({ className, file, onRemove, ...props }: AttachmentPreviewProps, ref: React.Ref<HTMLDivElement>) => {
    const url = React.useMemo(() => URL.createObjectURL(file), [file]);

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");

    React.useEffect(() => {
      return () => URL.revokeObjectURL(url);
    }, [url]);

    return (
      <div
        ref={ref}
        className={cn("relative border-b border-solid border-semantic-border-layout", className)}
        {...props}
      >
        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove attachment"
          className="absolute top-2 right-2 z-10 size-7 rounded-full bg-[#0a0d12]/60 flex items-center justify-center hover:bg-[#0a0d12]/80 transition-colors"
        >
          <X className="size-4 text-white" />
        </button>

        {isImage ? (
          <img
            src={url}
            alt={file.name}
            className="w-full object-cover max-h-[300px]"
          />
        ) : isVideo ? (
          <div
            className="relative bg-[#0a0d12]"
            style={{ aspectRatio: "16/10" }}
          >
            <video
              src={url}
              className="w-full h-full object-contain"
              controls
              playsInline
              preload="metadata"
            />
          </div>
        ) : isAudio ? (
          <div className="bg-semantic-bg-ui px-4 py-6 flex items-center gap-3">
            <div className="size-10 rounded-full bg-semantic-primary flex items-center justify-center shrink-0">
              <Play className="size-5 text-white fill-white ml-0.5" />
            </div>
            <div className="flex-1 h-1 bg-semantic-border-layout rounded-full">
              <div className="w-0 h-full bg-semantic-primary rounded-full" />
            </div>
            <span className="text-[12px] text-semantic-text-muted tabular-nums shrink-0">
              0:00
            </span>
          </div>
        ) : (
          <div
            className="bg-semantic-bg-ui flex flex-col items-center justify-center"
            style={{ aspectRatio: "16/10" }}
          >
            <div className="size-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-3">
              <File className="size-8 text-semantic-text-muted" />
            </div>
            <p className="m-0 text-[14px] font-semibold text-semantic-text-primary truncate max-w-[80%] px-4">
              {file.name}
            </p>
            <p className="m-0 text-[12px] text-semantic-text-muted mt-1">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        )}
      </div>
    );
  }
);
AttachmentPreview.displayName = "AttachmentPreview";

export { AttachmentPreview };
