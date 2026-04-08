import * as React from "react";
import { Pencil } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import type { BotHumanHandoverProps } from "./types";

const DEFAULT_LABEL = "Connect to a human if bot can not answer";

const BotHumanHandover = React.forwardRef<HTMLDivElement, BotHumanHandoverProps>(
  (
    {
      enabled = false,
      label = DEFAULT_LABEL,
      onToggle,
      onEdit,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-4 py-6 border-b border-solid border-semantic-border-layout",
          className
        )}
        {...props}
      >
        <h2 className="m-0 text-base font-semibold text-semantic-text-primary">
          Human Handover
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Switch
              checked={enabled}
              onCheckedChange={onToggle}
              disabled={disabled}
            />
            <span className="text-sm text-semantic-text-primary">{label}</span>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              aria-label="Edit handover settings"
            >
              <Pencil className="size-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);
BotHumanHandover.displayName = "BotHumanHandover";

export { BotHumanHandover };
