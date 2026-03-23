import * as React from "react";

import { cn } from "@/lib/utils";

import { Avatar } from "./avatar";

export interface ContactListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
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
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors",
          isSelected
            ? "bg-semantic-bg-ui"
            : "hover:bg-semantic-bg-hover",
          className
        )}
        {...props}
      >
        <Avatar name={name} src={avatarSrc} size="sm" />

        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-semantic-text-primary leading-5 truncate">
              {name}
            </span>
            {subtitle && (
              <span className="text-xs text-semantic-text-muted">
                {subtitle}
              </span>
            )}
          </div>
          {trailing && (
            <span className="text-xs font-medium text-semantic-text-muted shrink-0 ml-2">
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
