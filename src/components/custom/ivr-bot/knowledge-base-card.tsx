import * as React from "react";
import { Download, Trash2, Plus, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { BOT_KNOWLEDGE_STATUS } from "./types";
import type { KnowledgeBaseFile, KnowledgeFileStatus } from "./types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KnowledgeBaseCardProps {
  /** List of knowledge base files */
  files: KnowledgeBaseFile[];
  /** Called when user clicks the "+ Files" button */
  onAdd?: () => void;
  /**
   * Called when user clicks the download button on a file.
   * When omitted, the download button is **not rendered**.
   */
  onDownload?: (id: string) => void;
  /**
   * Called when user clicks the delete button on a file.
   * When omitted, the delete button is **not rendered**.
   */
  onDelete?: (id: string) => void;
  /** Hover text shown on the info icon next to the "Knowledge Base" title */
  infoTooltip?: string;
  /** Disables the "+ Files" button and other form-level interactions (view mode) */
  disabled?: boolean;
  /** Independently disables the download button (e.g. user lacks download permission) */
  downloadDisabled?: boolean;
  /** Independently disables the delete button (e.g. user lacks delete permission) */
  deleteDisabled?: boolean;
  /** Additional className */
  className?: string;
}

// ─── Status config ──────────────────────────────────────────────────────────

type BadgeVariant = "default" | "active" | "destructive";
const STATUS_CONFIG: Record<KnowledgeFileStatus, { label: string; variant: BadgeVariant }> = {
  [BOT_KNOWLEDGE_STATUS.PENDING]:    { label: "Pending",    variant: "default"      },
  [BOT_KNOWLEDGE_STATUS.READY]:      { label: "Ready",      variant: "active"       },
  [BOT_KNOWLEDGE_STATUS.PROCESSING]: { label: "Processing", variant: "active"       },
  [BOT_KNOWLEDGE_STATUS.FAILED]:     { label: "Failed",     variant: "destructive"  },
};

// ─── Component ──────────────────────────────────────────────────────────────

const KnowledgeBaseCard = React.forwardRef(
  (
    {
      files,
      onAdd,
      onDownload,
      onDelete,
      infoTooltip,
      disabled,
      downloadDisabled,
      deleteDisabled,
      className,
    }: KnowledgeBaseCardProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-semantic-bg-primary border border-semantic-border-layout rounded-lg overflow-hidden",
          className
        )}
      >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-semantic-border-layout sm:px-6">
            <div className="flex items-center gap-1.5">
              <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
                Knowledge Base
              </h2>
              {infoTooltip ? (
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-semantic-text-muted shrink-0 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>{infoTooltip}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Info className="size-3.5 text-semantic-text-muted shrink-0" />
              )}
            </div>
            <button
              type="button"
              onClick={() => onAdd?.()}
              disabled={disabled}
              className={cn("inline-flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-semibold text-semantic-text-secondary bg-semantic-primary-surface hover:bg-semantic-bg-hover transition-colors", disabled && "opacity-50 cursor-not-allowed")}
            >
              <Plus className="size-3.5" />
              Files
            </button>
          </div>
          {/* File list */}
          <div className="px-4 sm:px-6">
            {files.length === 0 ? (
              <p className="m-0 text-sm text-semantic-text-muted text-center py-5">
                No files added yet. Click &ldquo;+ Files&rdquo; to upload.
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-semantic-border-layout">
                {files.map((file) => {
                  const status = STATUS_CONFIG[file.status] ?? STATUS_CONFIG[BOT_KNOWLEDGE_STATUS.PENDING];
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-semantic-text-primary truncate">
                          File {file.name}
                        </span>
                        <Badge
                          variant={status.variant}
                          size="sm"
                          className="px-3 font-normal shrink-0 whitespace-nowrap"
                        >
                          {status.label}
                        </Badge>
                      </div>
                      {(onDownload || onDelete) && (
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {onDownload && (
                            <button
                              type="button"
                              onClick={() => onDownload(file.id)}
                              disabled={downloadDisabled}
                              className={cn("p-2 rounded text-semantic-text-muted hover:text-semantic-text-primary hover:bg-semantic-bg-hover transition-colors", downloadDisabled && "opacity-50 cursor-not-allowed")}
                              aria-label="Download file"
                            >
                              <Download className="size-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              type="button"
                              onClick={() => onDelete(file.id)}
                              disabled={deleteDisabled}
                              className={cn("p-2 rounded text-semantic-text-muted hover:text-semantic-error-primary hover:bg-semantic-error-surface transition-colors", deleteDisabled && "opacity-50 cursor-not-allowed")}
                              aria-label="Delete file"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
      </div>
    );
  }
);
KnowledgeBaseCard.displayName = "KnowledgeBaseCard";

export { KnowledgeBaseCard };
