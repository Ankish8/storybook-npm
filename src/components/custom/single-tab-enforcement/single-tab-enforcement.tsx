import * as React from "react";

import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../ui/dialog";
import { Typography } from "../../ui/typography";

export interface SingleTabEnforcementProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Card title (header row, or dialog title when `openModalOnAction`) */
  title?: string;
  /** Supporting copy (body row, or dialog description when `openModalOnAction`) */
  description?: string;
  /** Primary action label (single trigger when `openModalOnAction`; inline or dialog confirm otherwise) */
  actionLabel?: string;
  /**
   * When `true`, renders only a single trigger `Button`; the notice opens in a `Dialog` whose body matches
   * the inline notice card (three rows, dividers, centered footer). Confirming runs `onUseHereClick`.
   * When `false`, renders the inline notice card; the footer button calls `onUseHereClick` directly.
   */
  openModalOnAction?: boolean;
  /** Optional: notified when the dialog opens or closes (`openModalOnAction` only). */
  onModalOpenChange?: (open: boolean) => void;
  /** Called when the user chooses to use the session in this tab */
  onUseHereClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const defaultTitle = "Session active in another tab";
const defaultDescription =
  "The chat is open in another tab. Switch to that tab to continue the conversation.";
const defaultActionLabel = "Use here";

const cardShell = cn(
  "w-full max-w-md overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary shadow-sm"
);

type NoticeSectionsProps = {
  titleId: string;
  title: string;
  description: string;
  footer: React.ReactNode;
};

function NoticeSections({ titleId, title, description, footer }: NoticeSectionsProps) {
  return (
    <>
      <div className="border-b border-solid border-semantic-border-layout px-4 py-4">
        <Typography
          id={titleId}
          kind="title"
          variant="medium"
          color="primary"
          tag="h2"
          align="left"
        >
          {title}
        </Typography>
      </div>
      <div className="border-b border-solid border-semantic-border-layout px-4 py-4">
        <Typography
          kind="body"
          variant="medium"
          color="muted"
          tag="p"
          align="left"
          className="text-left"
        >
          {description}
        </Typography>
      </div>
      <div className="flex justify-center px-4 py-4">{footer}</div>
    </>
  );
}

/**
 * Centered notice card for single-tab chat enforcement — composes `Typography` and `Button`.
 * Optional: single trigger + `Dialog` via `openModalOnAction` (dialog content matches the notice card layout).
 */
const SingleTabEnforcement = React.forwardRef<
  HTMLDivElement,
  SingleTabEnforcementProps
>(
  (
    {
      title = defaultTitle,
      description = defaultDescription,
      actionLabel = defaultActionLabel,
      openModalOnAction = false,
      onModalOpenChange,
      onUseHereClick,
      className,
      ...props
    },
    ref
  ) => {
    const titleId = React.useId();
    const [modalOpen, setModalOpen] = React.useState(false);
    const skipModalOpenSyncRef = React.useRef(true);

    React.useEffect(() => {
      if (skipModalOpenSyncRef.current) {
        skipModalOpenSyncRef.current = false;
        return;
      }
      onModalOpenChange?.(modalOpen);
    }, [modalOpen, onModalOpenChange]);

    const handleInlineClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onUseHereClick?.(event);
    };

    const handleOpenModal = () => {
      setModalOpen(true);
    };

    const handleModalConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
      onUseHereClick?.(event);
      setModalOpen(false);
    };

    if (openModalOnAction) {
      return (
        <>
          <div
            ref={ref}
            role="region"
            aria-label={title}
            className={cn(className)}
            {...props}
          >
            <Button type="button" variant="default" onClick={handleOpenModal}>
              {actionLabel}
            </Button>
          </div>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent
              size="sm"
              className={cn(cardShell, "gap-0 p-0")}
              hideCloseButton={false}
            >
              <div className="border-b border-solid border-semantic-border-layout px-4 py-4">
                <DialogTitle className="m-0 text-left text-base font-semibold leading-5 text-semantic-text-primary">
                  {title}
                </DialogTitle>
              </div>
              <div className="border-b border-solid border-semantic-border-layout px-4 py-4">
                <DialogDescription className="m-0 text-left text-sm leading-[18px] text-semantic-text-muted">
                  {description}
                </DialogDescription>
              </div>
              <div className="flex justify-center px-4 py-4">
                <Button type="button" variant="default" onClick={handleModalConfirm}>
                  {actionLabel}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-labelledby={titleId}
        className={cn(cardShell, className)}
        {...props}
      >
        <NoticeSections
          titleId={titleId}
          title={title}
          description={description}
          footer={
            <Button type="button" variant="default" onClick={handleInlineClick}>
              {actionLabel}
            </Button>
          }
        />
      </div>
    );
  }
);
SingleTabEnforcement.displayName = "SingleTabEnforcement";

export { SingleTabEnforcement };
