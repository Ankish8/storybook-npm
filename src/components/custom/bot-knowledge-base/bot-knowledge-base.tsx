import * as React from "react";
import { Plus, Info, Download, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import type {
  BotKnowledgeBaseProps,
  KnowledgeBaseFile,
  KnowledgeFileStatus,
} from "./types";

// ── Status badge config ─────────────────────────────────────────────────────

type BadgeVariant = "default" | "active" | "destructive";

interface StatusConfig {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const STATUS_CONFIG: Record<KnowledgeFileStatus, StatusConfig> = {
  training: {
    label: "Training",
    className: "bg-semantic-warning-surface text-semantic-warning-primary",
  },
  ready: { label: "Ready", variant: "active" },
  pending: { label: "Pending", variant: "default" },
  failed: { label: "Failed", variant: "destructive" },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: KnowledgeFileStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <Badge
      variant={config.variant}
      size="sm"
      className={cn("shrink-0", config.className)}
    >
      {config.label}
    </Badge>
  );
}

function FileRow({
  file,
  onDownload,
  onDelete,
  disabled,
}: {
  file: KnowledgeBaseFile;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-semantic-text-secondary truncate">
          {file.name}
        </span>
        <StatusBadge status={file.status} />
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        {onDownload && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDownload(file.id)}
            disabled={disabled}
            aria-label={`Download ${file.name}`}
          >
            <Download className="size-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(file.id)}
            disabled={disabled}
            aria-label={`Delete ${file.name}`}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

const BotKnowledgeBase = React.forwardRef<HTMLDivElement, BotKnowledgeBaseProps>(
  (
    {
      files,
      onAddFile,
      onDownloadFile,
      onDeleteFile,
      infoTooltip = "Upload files to give your bot reference material. The bot uses this information to answer queries more accurately.",
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border-b border-solid border-semantic-border-layout pb-4",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="m-0 text-base font-semibold text-semantic-text-primary">
              Knowledge base
            </h3>
            {infoTooltip ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info
                      className="size-3.5 text-semantic-text-muted shrink-0 cursor-pointer"
                      aria-label="Knowledge base information"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{infoTooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Info className="size-3.5 text-semantic-text-muted shrink-0" />
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onAddFile}
            disabled={disabled}
          >
            <Plus className="size-3.5" />
            Files
          </Button>
        </div>

        {/* File list */}
        {files.length === 0 ? (
          <p className="m-0 text-sm text-semantic-text-muted text-center py-4">
            No files added yet
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-semantic-border-layout">
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onDownload={onDownloadFile}
                onDelete={onDeleteFile}
                disabled={disabled}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
BotKnowledgeBase.displayName = "BotKnowledgeBase";

export { BotKnowledgeBase };
