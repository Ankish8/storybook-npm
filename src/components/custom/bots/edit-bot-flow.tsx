import * as React from "react";
import { BotList } from "./bot-list";
import type { Bot, EditBotFlowProps } from "./types";

/**
 * Edit bot flow: bot list + config view when Edit is clicked.
 * Use when you want the "Edit Bot → Config" experience; parent supplies config via renderConfig.
 */
export function EditBotFlow({
  bots,
  title = "AI Bot",
  subtitle = "Create & manage AI bots",
  searchPlaceholder = "Search bot...",
  createCardLabel = "Create new bot",
  typeLabels,
  chatbotDisabled,
  voicebotDisabled,
  chatbotDisabledTooltip,
  voicebotDisabledTooltip,
  botNameMaxLength,
  onBotDelete,
  onCreateBotSubmit,
  onSearch,
  renderConfig,
  instructionText,
  className,
}: EditBotFlowProps) {
  const [view, setView] = React.useState<"list" | "config">("list");
  const [editingBot, setEditingBot] = React.useState<Bot | null>(null);

  const handleEdit = (botId: string) => {
    const bot = bots.find((b) => b.id === botId);
    if (bot) {
      setEditingBot(bot);
      setView("config");
    }
  };

  const handleBack = () => {
    setView("list");
    setEditingBot(null);
  };

  if (view === "config" && editingBot) {
    return <>{renderConfig(editingBot, handleBack)}</>;
  }

  return (
    <>
      {instructionText != null ? (
        <div className="flex flex-col gap-2 p-6 pb-0">{instructionText}</div>
      ) : null}
      <BotList
        bots={bots}
        title={title}
        subtitle={subtitle}
        searchPlaceholder={searchPlaceholder}
        createCardLabel={createCardLabel}
        typeLabels={typeLabels}
        chatbotDisabled={chatbotDisabled}
        voicebotDisabled={voicebotDisabled}
        chatbotDisabledTooltip={chatbotDisabledTooltip}
        voicebotDisabledTooltip={voicebotDisabledTooltip}
        botNameMaxLength={botNameMaxLength}
        onBotEdit={handleEdit}
        onBotDelete={onBotDelete}
        onCreateBotSubmit={onCreateBotSubmit}
        onSearch={onSearch}
        className={className}
      />
    </>
  );
}
