import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Extracts initials from a name string.
 * For two+ words, takes first letter of first and last word.
 * For single words, takes first two characters.
 *
 * @example
 * getInitials("Ankish Sachdeva") // "AS"
 * getInitials("John") // "JO"
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-semibold select-none shrink-0 overflow-hidden",
  {
    variants: {
      variant: {
        soft: "bg-semantic-bg-grey text-semantic-text-muted",
        filled: "bg-semantic-primary text-semantic-text-inverted",
      },
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        md: "size-10 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

const statusDotSizeMap = {
  xs: "size-2 border",
  sm: "size-2.5 border-[1.5px]",
  md: "size-3 border-2",
  lg: "size-3.5 border-2",
  xl: "size-4 border-2",
} as const;

const statusColorMap = {
  online: "bg-semantic-success-primary",
  offline: "bg-semantic-bg-grey",
  busy: "bg-semantic-error-primary",
  away: "bg-semantic-warning-primary",
} as const;

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Name used to auto-generate initials and aria-label */
  name?: string;
  /** Image URL — renders an <img> instead of initials */
  src?: string;
  /** Alt text for the image (defaults to name) */
  alt?: string;
  /** Override auto-generated initials (e.g., "AS") */
  initials?: string;
  /** Status indicator dot shown at bottom-right */
  status?: "online" | "offline" | "busy" | "away";
}

/**
 * Avatar component for displaying user identity via image or initials.
 *
 * @example
 * ```tsx
 * <Avatar name="Ankish Sachdeva" />
 * <Avatar name="John Doe" size="lg" variant="filled" />
 * <Avatar src="/photo.jpg" alt="Profile" status="online" />
 * <Avatar initials="AS" size="xs" />
 * ```
 */
const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      variant,
      size,
      name,
      src,
      alt,
      initials,
      status,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedSize = size ?? "md";
    const displayInitials = initials ?? (name ? getInitials(name) : undefined);

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, className }))}
        aria-label={name}
        role="img"
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? name ?? "Avatar"}
            className="size-full object-cover"
          />
        ) : children ? (
          children
        ) : displayInitials ? (
          <span aria-hidden="true">{displayInitials}</span>
        ) : null}

        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-background",
              statusDotSizeMap[resolvedSize],
              statusColorMap[status]
            )}
            data-status={status}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants, getInitials };
