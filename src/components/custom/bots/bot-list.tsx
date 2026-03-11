import * as React from "react";
import { Plus, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import { BotCard } from "./bot-card";
import { CreateBotModal } from "./create-bot-modal";
import type { BotListProps } from "./types";

export const BotList = React.forwardRef<HTMLDivElement, BotListProps>(
  (
    {
      bots = [],
      onCreateBot,
      onCreateBotSubmit,
      onBotEdit,
      onBotPublish,
      onBotDelete,
      onSearch,
      title = "AI Bot",
      subtitle = "Create & manage AI bots",
      className,
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    const handleSearch = (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    };

    return (
      <div ref={ref} className={cn("flex flex-col w-full", className)}>
        {/* Page header */}
        <div className="flex flex-col gap-4 pb-5 mb-6 border-b border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="m-0 text-base font-semibold text-semantic-text-primary tracking-[0.064px]">
              {title}
            </h1>
            <p className="m-0 text-sm text-semantic-text-muted tracking-[0.035px]">
              {subtitle}
            </p>
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2 h-10 px-2.5 border border-semantic-border-input rounded bg-semantic-bg-primary hover:border-semantic-border-input-focus focus-within:border-semantic-border-input-focus focus-within:shadow-[0_0_0_1px_rgba(43,188,202,0.15)] w-full sm:w-auto">
            <Search className="size-[14px] text-semantic-text-muted shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search bot..."
              className="text-sm text-semantic-text-primary placeholder:text-semantic-text-muted bg-transparent outline-none w-full sm:w-[180px]"
            />
          </div>
        </div>

        {/* Bot grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {/* Create new bot card */}
          <button
            type="button"
            onClick={() => {
              setCreateModalOpen(true);
              onCreateBot?.();
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-3 p-2.5 rounded-[5px]",
              "bg-semantic-info-surface-subtle border border-dashed border-[var(--color-primary-100)]",
              "cursor-pointer hover:bg-semantic-bg-hover transition-colors min-h-[207px]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-semantic-border-focus"
            )}
          >
            <Plus className="size-4 text-semantic-text-secondary" />
            <span className="text-sm font-semibold text-semantic-text-secondary tracking-[0.014px]">
              Create new bot
            </span>
          </button>

          {/* Bot cards */}
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              onEdit={onBotEdit}
              onPublish={onBotPublish}
              onDelete={onBotDelete}
            />
          ))}
        </div>

        <CreateBotModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={(data) => {
            onCreateBotSubmit?.(data);
            setCreateModalOpen(false);
          }}
        />
      </div>
    );
  }
);

BotList.displayName = "BotList";
