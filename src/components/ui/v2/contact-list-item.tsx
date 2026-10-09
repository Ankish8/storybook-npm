import * as React from "react";

import { cn } from "@/lib/utils";

import { Avatar } from "./avatar";

export interface ContactListItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onClick"
> {
  /** Contact name — displayed as primary text and used for Avatar initials */
  name: string;
  /** Secondary text below the name (e.g., phone number, email) */
  subtitle?: string;
  /** Content rendered at the right edge (e.g., channel badge, status text) */
  trailing?: React.ReactNode;
  /** Avatar image source — shows image instead of initials when provided */
  avatarSrc?: string;
  /** Whether this item is currently selected/active */
  isSelected?: boolean;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * ContactListItem displays a contact entry with avatar, name, optional subtitle,
 * and trailing content — used in contact directories, user lists, and search results.
 *
 * @example
 * ```tsx
 * <ContactListItem
 *   name="Aditi Kumar"
 *   subtitle="+91 98765 43210"
 *   trailing="MY01"
 *   onClick={() => selectContact("1")}
 * />
 * ```
 */
const ContactListItem = React.forwardRef(
  (
    {
      name,
      subtitle,
      trailing,
      avatarSrc,
      isSelected = false,
      onClick,
      onKeyDown,
      className,
      ...props
    }: ContactListItemProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={onClick}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!e.defaultPrevented && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:120ms] [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-offset-[3px] focus-visible:outline-semantic-primary font-[family-name:var(--font-v2,Inter,sans-serif)]",
          isSelected
            ? "bg-semantic-bg-ui"
            : "[@media(hover:hover)]:hover:bg-semantic-bg-ui active:bg-semantic-bg-ui",
          className
        )}
        {...props}
      >
        <Avatar name={name} src={avatarSrc} size="sm" />

        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-[var(--v2-text-primary,#484848)] leading-[1.4] tracking-[-0.01em] truncate">
              {name}
            </span>
            {subtitle && (
              <span className="text-xs leading-[1.4] tracking-[-0.01em] truncate text-[var(--v2-text-muted,#707070)]">
                {subtitle}
              </span>
            )}
          </div>
          {trailing && (
            <span className="text-xs font-normal leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-muted,#707070)] shrink-0 ml-2">
              {trailing}
            </span>
          )}
        </div>
      </div>
    );
  }
);
ContactListItem.displayName = "ContactListItem";

export { ContactListItem };
