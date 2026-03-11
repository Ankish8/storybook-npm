import * as React from "react";
import { MessageSquare, Phone, MoreVertical, Pencil, Play, Trash2 } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { Badge } from "../../ui/badge";
import type { BotCardProps, BotType } from "./types";

const BOT_TYPE_LABELS: Record<BotType, string> = {
  chatbot: "Chatbot",
  voicebot: "Voicebot",
};

export const BotCard = React.forwardRef<HTMLDivElement, BotCardProps>(
  ({ bot, onEdit, onPublish, onDelete, className }, ref) => {
    const isChatbot = bot.type === "chatbot";

    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-semantic-bg-primary border border-semantic-border-layout rounded-[5px]",
          "shadow-[0px_4px_15.1px_0px_rgba(0,0,0,0.06)] p-5 flex flex-col",
          className
        )}
      >
        {/* Top row: icon + badge + menu */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center justify-center size-[38px] rounded-full bg-semantic-info-surface shrink-0">
            {isChatbot ? (
              <MessageSquare className="size-5 text-semantic-text-secondary" />
            ) : (
              <Phone className="size-5 text-semantic-text-secondary" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {BOT_TYPE_LABELS[bot.type]}
            </Badge>

            {/* Three-dot dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded hover:bg-semantic-bg-hover text-semantic-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
                  aria-label="More options"
                >
                  <MoreVertical className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer"
                  onClick={() => onEdit?.(bot.id)}
                >
                  <Pencil className="size-4 text-semantic-text-muted shrink-0" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer"
                  onClick={() => onPublish?.(bot.id)}
                >
                  <Play className="size-4 text-semantic-text-muted shrink-0" />
                  <span>Publish</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer text-semantic-error-primary focus:text-semantic-error-primary focus:bg-semantic-error-surface"
                  onClick={() => onDelete?.(bot.id)}
                >
                  <Trash2 className="size-4 shrink-0" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bot name */}
        <h3 className="m-0 text-base font-normal text-semantic-text-primary truncate mb-1">
          {bot.name}
        </h3>

        {/* Conversations count */}
        <p className="m-0 text-sm text-semantic-text-muted mb-4">
          {bot.conversationCount.toLocaleString()} Conversations
        </p>

        {/* Divider */}
        <div className="border-t border-semantic-border-layout mb-3 mt-auto" />

        {/* Last published */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal text-semantic-text-secondary uppercase tracking-[0.048px]">
            Last Published
          </span>
          {bot.lastPublishedBy && bot.lastPublishedDate ? (
            <p className="m-0 text-sm text-semantic-text-muted">
              {bot.lastPublishedBy} | {bot.lastPublishedDate}
            </p>
          ) : (
            <p className="m-0 text-sm text-semantic-text-muted">—</p>
          )}
        </div>
      </div>
    );
  }
);

BotCard.displayName = "BotCard";
