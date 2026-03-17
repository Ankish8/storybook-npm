import * as React from "react";
import { cn } from "../../../lib/utils";
import { BotCard } from "./bot-card";
import { BotListHeader } from "./bot-list-header";
import { BotListSearch } from "./bot-list-search";
import { BotListCreateCard } from "./bot-list-create-card";
import { BotListGrid } from "./bot-list-grid";
import { CreateBotModal } from "./create-bot-modal";
import type { BotListProps } from "./types";

export const BotList = React.forwardRef<HTMLDivElement, BotListProps>(
  (
    {
      bots = [],
      typeLabels,
      onCreateBot,
      onCreateBotSubmit,
      onBotEdit,
      onBotPublish,
      onBotDelete,
      onSearch,
      title = "AI Bot",
      subtitle = "Create & manage AI bots",
      searchPlaceholder = "Search bot...",
      createCardLabel = "Create new bot",
      className,
      ...props
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
      <div
        ref={ref}
        className={cn("flex flex-col w-full min-w-0 max-w-full overflow-x-hidden box-border", className)}
        {...props}
      >
        {/* Page header: title, subtitle, and search */}
        <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5 sm:mb-6 min-w-0">
          <BotListHeader title={title} subtitle={subtitle} />
          <BotListSearch
            value={searchQuery}
            onSearch={handleSearch}
            placeholder={searchPlaceholder}
          />
        </div>

        {/* Bot grid: create card + bot cards */}
        <BotListGrid>
          <BotListCreateCard
            label={createCardLabel}
            onClick={() => {
              setCreateModalOpen(true);
              onCreateBot?.();
            }}
          />
          {bots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              typeLabels={typeLabels}
              onEdit={onBotEdit}
              onPublish={onBotPublish}
              onDelete={onBotDelete}
            />
          ))}
        </BotListGrid>

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
