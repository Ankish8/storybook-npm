import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import type { TestAIBotProps } from "./types";

const TestAIBot: React.FC<TestAIBotProps> = ({
  open,
  onOpenChange,
  onClose,
  title,
  description,
  className,
  titleClassName,
  descriptionClassName,
  qrSrc,
  qrAlt = "QR code",
  qrClassName,
  qrContainerClassName,
  buttonLabel,
  buttonProps,
  size = "lg",
  hideCloseButton,
}) => {
  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next);
    if (!next) onClose?.();
  };

  const {
    className: buttonClassName,
    variant: buttonVariant = "default",
    size: buttonSize = "default",
    ...restButtonProps
  } = buttonProps ?? {};

  const isSolidPrimary =
    buttonVariant === "default" || buttonVariant === "primary";

  return (
    <Dialog open={open ?? false} onOpenChange={handleOpenChange}>
      <DialogContent
        size={size}
        hideCloseButton={hideCloseButton}
        className={cn("gap-0 overflow-hidden p-0 sm:max-w-[560px]", className)}
      >
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-stretch sm:gap-8">
          <div className="flex shrink-0 justify-center sm:justify-start">
            <div
              className={cn(
                "inline-flex rounded border border-solid border-semantic-border-layout bg-semantic-bg-primary p-3",
                qrContainerClassName
              )}
            >
              <img
                src={qrSrc}
                alt={qrAlt}
                className={cn(
                  "size-[min(200px,55vw)] aspect-square object-contain",
                  qrClassName
                )}
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <DialogHeader className="space-y-1.5 p-0 text-left">
              <DialogTitle
                className={cn(
                  "text-lg font-semibold text-semantic-text-primary",
                  titleClassName
                )}
              >
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription
                  className={cn(
                    "text-sm text-semantic-text-muted",
                    descriptionClassName
                  )}
                >
                  {description}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">
                  {typeof title === "string" ? title : "Test AI bot"}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="mt-auto flex flex-col gap-2 sm:pt-0">
              <Button
                variant={buttonVariant}
                size={buttonSize}
                className={cn(
                  "w-full",
                  isSolidPrimary &&
                    "border-2 border-semantic-bg-primary outline outline-2 outline-offset-2 outline-[var(--semantic-primary)]",
                  buttonClassName
                )}
                {...restButtonProps}
              >
                {buttonLabel}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
TestAIBot.displayName = "TestAIBot";

export { TestAIBot };
