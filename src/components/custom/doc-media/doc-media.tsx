import * as React from "react";
import { cn } from "../../../lib/utils";
import { File, FileSpreadsheet, ArrowDownToLine } from "lucide-react";
import type { DocMediaProps } from "./types";

const DocMedia = React.forwardRef(
  (
    {
      className,
      variant = "preview",
      thumbnailUrl,
      filename,
      fileType,
      pageCount,
      fileSize,
      caption,
      onDownload,
      ...props
    }: DocMediaProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (variant === "preview") {
      return (
        <div
          ref={ref}
          className={cn("relative rounded-t overflow-hidden", className)}
          {...props}
        >
          <img
            src={thumbnailUrl}
            alt={filename || "Document preview"}
            className="w-full object-cover"
            style={{ aspectRatio: "442/308" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d222f] via-[#1d222f]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <p className="m-0 text-[14px] font-semibold text-white truncate">
              {filename || "Document"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <File className="size-3.5 text-white/80" />
              <span className="text-[12px] text-white/80">
                {[
                  fileType,
                  pageCount && `${pageCount} pages`,
                  fileSize,
                ]
                  .filter(Boolean)
                  .join("  \u00B7  ")}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (variant === "download") {
      return (
        <div
          ref={ref}
          className={cn("relative rounded-t overflow-hidden", className)}
          {...props}
        >
          <img
            src={thumbnailUrl}
            alt={caption || filename || "Document"}
            className="w-full object-cover"
            style={{ aspectRatio: "442/308" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d222f] via-[#1d222f]/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
            <p className="m-0 text-[14px] font-semibold text-white truncate">
              {filename || "Document"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <File className="size-3.5 text-white/80" />
              <span className="text-[12px] text-white/80">
                {[
                  fileType,
                  pageCount && `${pageCount} pages`,
                  fileSize,
                ]
                  .filter(Boolean)
                  .join("  \u00B7  ")}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // variant === "file"
    const isSpreadsheet = fileType === "XLS" || fileType === "XLSX";
    const accent = isSpreadsheet ? "#217346" : "#535862";
    const accentLight = isSpreadsheet ? "#dcfae6" : "#e9eaeb";
    const label = fileType || "FILE";

    return (
      <div
        ref={ref}
        className={cn(
          "mx-2.5 mt-2.5 rounded overflow-hidden border border-semantic-border-layout",
          className
        )}
        {...props}
      >
        <div
          className="bg-semantic-bg-ui flex items-center justify-center w-full"
          style={{ padding: "36px 0" }}
        >
          <div className="flex flex-col items-center">
            <div
              className="rounded-2xl flex items-center justify-center"
              style={{ width: 72, height: 72, backgroundColor: accentLight }}
            >
              <FileSpreadsheet
                style={{ width: 32, height: 32, color: accent }}
              />
            </div>
            <div
              className="mt-2.5 rounded-full px-3 py-0.5"
              style={{ backgroundColor: accent }}
            >
              <span className="text-[11px] font-bold text-white tracking-wide">
                {label}
              </span>
            </div>
          </div>
        </div>
        <div
          className="bg-muted flex items-center gap-2"
          style={{ padding: "12px 16px" }}
        >
          <span className="text-[14px] font-semibold text-semantic-text-primary truncate flex-1 tracking-[0.1px]">
            {filename || "File"}
          </span>
          <button
            type="button"
            onClick={onDownload}
            className="shrink-0 size-8 rounded-full flex items-center justify-center hover:bg-semantic-bg-hover transition-colors"
            aria-label="Download"
          >
            <ArrowDownToLine className="size-[18px] text-semantic-text-secondary" />
          </button>
        </div>
      </div>
    );
  }
);
DocMedia.displayName = "DocMedia";

export { DocMedia };
