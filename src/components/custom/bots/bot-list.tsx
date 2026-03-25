import * as React from "react";
import { cn } from "../../../lib/utils";
import { BotCard } from "./bot-card";
import { BotListHeader } from "./bot-list-header";
import { BotListSearch } from "./bot-list-search";
import { BotListCreateCard } from "./bot-list-create-card";
import { BotListGrid } from "./bot-list-grid";
import { CreateBotModal } from "./create-bot-modal";
import type { BotListProps } from "./types";

export const BotList = React.forwardRef(
  (
    {
      bots = [],
      typeLabels,
      onCreateBot,
      onCreateBotSubmit,
      onBotEdit,
      onBotDelete,
      onSearch,
      title = "AI Bot",
      subtitle = "Create & manage AI bots",
      searchPlaceholder = "Search bot...",
      createCardLabel = "Create new bot",
      chatbotDisabled,
      voicebotDisabled,
      chatbotDisabledTooltip,
      voicebotDisabledTooltip,
      className,
      ...props
    }: BotListProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    const handleSearch = (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    };

    const handleCreateClick = () => {
      setCreateModalOpen(true);
      onCreateBot?.();
    };

    if (bots.length === 0) {
      return (
        <>
          <div
            ref={ref}
            className={cn(
              "flex flex-col w-full min-w-0 max-w-full overflow-x-hidden box-border",
              className
            )}
            {...props}
          >
            <BotListGrid>
              <BotListCreateCard
                label={createCardLabel}
                onClick={handleCreateClick}
              />
            </BotListGrid>
          </div>
          <CreateBotModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            chatbotDisabled={chatbotDisabled}
            voicebotDisabled={voicebotDisabled}
            chatbotDisabledTooltip={chatbotDisabledTooltip}
            voicebotDisabledTooltip={voicebotDisabledTooltip}
            onSubmit={(data) => {
              onCreateBotSubmit?.(data);
              setCreateModalOpen(false);
            }}
          />
        </>
      );
    }

    return (
      <>
        <div
          ref={ref}
          className={cn("flex flex-col w-full min-w-0 max-w-full overflow-x-hidden box-border", className)}
          {...props}
        >
          <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-solid border-semantic-border-layout sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pb-5 sm:mb-6 min-w-0">
            <BotListHeader title={title} subtitle={subtitle} />
            <BotListSearch
              value={searchQuery}
              onSearch={handleSearch}
              placeholder={searchPlaceholder}
            />
          </div>
          <BotListGrid>
            <BotListCreateCard label={createCardLabel} onClick={handleCreateClick} />
            {bots.map((bot) => (
              <BotCard
                key={bot.id}
                bot={bot}
                typeLabels={typeLabels}
                onEdit={onBotEdit}
                onDelete={onBotDelete}
              />
            ))}
          </BotListGrid>
        </div>
        <CreateBotModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          chatbotDisabled={chatbotDisabled}
          voicebotDisabled={voicebotDisabled}
          chatbotDisabledTooltip={chatbotDisabledTooltip}
          voicebotDisabledTooltip={voicebotDisabledTooltip}
          onSubmit={(data) => {
            onCreateBotSubmit?.(data);
            setCreateModalOpen(false);
          }}
        />
      </>
    );
  }
);

BotList.displayName = "BotList";
