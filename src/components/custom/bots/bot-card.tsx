import * as React from "react";
import { MessageSquare, Phone } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import { BotListAction } from "./bot-list-action";
import type { Bot, BotCardProps, BotType } from "./types";

const DEFAULT_TYPE_LABELS: Record<BotType, string> = {
  chatbot: "Chatbot",
  voicebot: "Voicebot",
};

function getTypeLabel(
  bot: Bot,
  typeLabels?: Partial<Record<BotType, string>>
): string {
  if (bot.typeLabel) return bot.typeLabel;
  const custom = typeLabels?.[bot.type];
  if (custom) return custom;
  return DEFAULT_TYPE_LABELS[bot.type];
}

/**
 * Single card component for both Chatbot and Voicebot.
 * All displayed data (icon, badge, name, count, last published) comes from the `bot` prop.
 * Set bot.type to "chatbot" or "voicebot"; no separate card components needed.
 */
export const BotCard = React.forwardRef<HTMLDivElement, BotCardProps>(
  ({ bot, typeLabels, onEdit, onDelete, className, ...props }, ref) => {
    const typeLabel = getTypeLabel(bot, typeLabels);
    const isChatbot = bot.type === "chatbot";

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (onEdit && !(e.target as HTMLElement).closest("[data-bot-card-action]")) {
        onEdit(bot.id);
      }
    };

    const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onEdit && !(e.target as HTMLElement).closest("[data-bot-card-action]")) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onEdit(bot.id);
        }
      }
    };

    return (
      <div
        ref={ref}
        role={onEdit ? "button" : undefined}
        tabIndex={onEdit ? 0 : undefined}
        aria-label={onEdit ? `Edit ${bot.name}` : undefined}
        onClick={onEdit ? handleCardClick : undefined}
        onKeyDown={onEdit ? handleCardKeyDown : undefined}
        className={cn(
          "relative bg-semantic-bg-primary border border-semantic-border-layout rounded-[5px] min-w-0 max-w-full overflow-hidden flex flex-col",
          "shadow-[0px_4px_15.1px_0px_rgba(0,0,0,0.06)] p-3 sm:p-4 md:p-5",
          onEdit && "cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Top row: icon + badge + menu */}
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4 min-w-0">
          <div className="flex items-center justify-center size-8 sm:size-[38px] rounded-full bg-semantic-info-surface shrink-0">
            {isChatbot ? (
              <MessageSquare className="size-4 sm:size-5 text-semantic-text-secondary" />
            ) : (
              <Phone className="size-4 sm:size-5 text-semantic-text-secondary" />
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink-0">
            <Badge variant="outline" className="text-xs font-normal shrink-0">
              {typeLabel}
            </Badge>

            <span data-bot-card-action className="inline-flex" onClick={(e) => e.stopPropagation()}>
              <BotListAction
                align="end"
                onEdit={() => onEdit?.(bot.id)}
                onDelete={() => onDelete?.(bot.id)}
              />
            </span>
          </div>
        </div>

        {/* Bot name */}
        <h3 className="m-0 text-sm sm:text-base font-normal text-semantic-text-primary truncate mb-1 min-w-0">
          {bot.name}
        </h3>

        {/* Conversations count */}
        <p className="m-0 text-xs sm:text-sm text-semantic-text-muted mb-3 sm:mb-4">
          {bot.conversationCount.toLocaleString()} Conversations
        </p>

        {/* Divider */}
        <div className="border-t border-semantic-border-layout mb-2 sm:mb-3 mt-auto" />

        {/* Last published */}
        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
          {bot.status === "draft" ? (
            <p className="m-0 text-xs font-normal text-semantic-text-secondary uppercase tracking-[0.048px] flex items-center justify-start gap-5">
              Last Published
              <span className="text-xs font-normal text-semantic-error-primary flex items-center gap-1.5 shrink-0">
                <span className="size-1.5 rounded-full bg-semantic-error-primary shrink-0" aria-hidden />
                Unpublished changes
              </span>
            </p>
          ) : (
            <span className="text-xs font-normal text-semantic-text-secondary uppercase tracking-[0.048px]">
              Last Published
            </span>
          )}
          {bot.lastPublishedBy && bot.lastPublishedDate ? (
            <p className="m-0 text-xs sm:text-sm text-semantic-text-muted truncate">
              {bot.lastPublishedBy} | {bot.lastPublishedDate}
            </p>
          ) : bot.status !== "draft" ? (
            <p className="m-0 text-xs sm:text-sm text-semantic-text-muted">—</p>
          ) : null}
        </div>
      </div>
    );
  }
);

BotCard.displayName = "BotCard";
