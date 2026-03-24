import * as React from "react";
import { cn } from "../../../lib/utils";
import { BotListCreateCard } from "./bot-list-create-card";
import { BotListGrid } from "./bot-list-grid";
import { CreateBotModal } from "./create-bot-modal";
import type { CreateBotFlowProps } from "./types";

/**
 * Create bot flow: "Create new bot" card + Create Bot modal. No header (title/subtitle/search).
 * Use when you want the create-bot experience without the list header.
 */
export const CreateBotFlow = React.forwardRef(
  (
    {
      createCardLabel = "Create new bot",
      onSubmit,
      className,
      ...props
    }: CreateBotFlowProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const [modalOpen, setModalOpen] = React.useState(false);

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
              onClick={() => setModalOpen(true)}
            />
          </BotListGrid>
        </div>
        <CreateBotModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onSubmit={(data) => {
            onSubmit?.(data);
            setModalOpen(false);
          }}
        />
      </>
    );
  }
);

CreateBotFlow.displayName = "CreateBotFlow";
