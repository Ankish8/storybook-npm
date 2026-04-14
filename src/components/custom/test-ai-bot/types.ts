import type { ReactNode } from "react";

import type { ButtonProps } from "../../ui/button";
import type { DialogContentProps } from "../../ui/dialog";

/** Button props for the primary CTA; `children` is supplied via `buttonLabel`. */
export type TestAIBotButtonProps = Omit<ButtonProps, "children">;

export interface TestAIBotProps {
  /** When omitted, the dialog stays closed until `open` is set to `true`. */
  open?: boolean;
  /** Called when the open state changes (overlay, Escape, or close control) */
  onOpenChange?: (open: boolean) => void;
  /** Called when the dialog closes (fires with `onOpenChange(false)`) */
  onClose?: () => void;
  /** Modal heading */
  title: ReactNode;
  /** Supporting text below the title */
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  /** QR code image URL */
  qrSrc: string;
  qrAlt?: string;
  qrClassName?: string;
  qrContainerClassName?: string;
  /** Primary action label */
  buttonLabel: ReactNode;
  /**
   * Props forwarded to `Button`. Defaults to solid primary (`variant="default"`, `size="default"`) with a
   * white inner stroke and dark outer outline (matches the Test AI bot primary CTA). Other `variant`
   * values skip that treatment.
   */
  buttonProps?: TestAIBotButtonProps;
  /** Passed to `DialogContent` */
  size?: DialogContentProps["size"];
  hideCloseButton?: boolean;
}
