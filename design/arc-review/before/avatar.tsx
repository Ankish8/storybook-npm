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
  "relative inline-flex items-center justify-center rounded-full font-[family-name:var(--font-v2,Inter,sans-serif)] font-medium select-none shrink-0",
  {
    variants: {
      variant: {
        soft: "bg-semantic-info-surface text-[var(--v2-text-muted,#707070)]",
        outline:
          "border border-solid border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-muted,#707070)]",
        filled: "bg-semantic-primary text-semantic-text-inverted",
      },
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-[30px] text-xs",
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
  xs: "size-2 border border-solid",
  sm: "size-2.5 border-[1.5px] border-solid",
  md: "size-3 border-2 border-solid",
  lg: "size-3.5 border-2 border-solid",
  xl: "size-4 border-2 border-solid",
} as const;

const statusColorMap = {
  online: "bg-semantic-success-primary",
  offline: "bg-semantic-bg-grey",
  busy: "bg-semantic-error-primary",
  away: "bg-semantic-warning-primary",
} as const;

export interface AvatarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
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
const Avatar = React.forwardRef(
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
    }: AvatarProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const resolvedSize = size ?? "md";
    const displayInitials = initials ?? (name ? getInitials(name) : undefined);
    // A dead URL falls back exactly as if there were no src. Keyed by the failing URL so a new src gets a fresh
    // attempt, and nothing changes while the image loads (no fade or placeholder: avatars stay static).
    const [failedSrc, setFailedSrc] = React.useState<string | undefined>();
    const showImage = Boolean(src) && failedSrc !== src;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, className }))}
        aria-label={name}
        role="img"
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt ?? name ?? "Avatar"}
            className="size-full rounded-full object-cover"
            onError={() => setFailedSrc(src)}
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

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show at most this many avatars; the rest collapse into one "+N" tile. Omit to show all. */
  max?: number;
  /** Size of the "+N" tile, and of any child Avatar that does not set its own size */
  size?: AvatarProps["size"];
}

/**
 * Overlapping stack of avatars (-8px) separated by a 2px ring in the surface colour.
 * With `max`, the avatars past the limit become a "+N" tile of the same size.
 * The ring colour follows the surface: on a tinted background override it with
 * `className="[&>*]:ring-semantic-bg-ui"`.
 *
 * @example
 * ```tsx
 * <AvatarGroup max={3} size="sm">
 *   <Avatar name="Aditi Kumar" />
 *   <Avatar name="Ravi Shah" />
 *   <Avatar name="Meera Iyer" />
 *   <Avatar name="Karan Mehta" />
 * </AvatarGroup>
 * ```
 */
const AvatarGroup = React.forwardRef(
  (
    { className, max, size, children, ...props }: AvatarGroupProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const items = React.Children.toArray(children);
    const limit =
      max !== undefined && Number.isFinite(max)
        ? Math.max(0, Math.floor(max))
        : items.length;
    const visible = items.slice(0, limit);
    const hidden = items.length - visible.length;
    const isAvatar = (
      child: React.ReactNode
    ): child is React.ReactElement<AvatarProps> =>
      React.isValidElement(child) && child.type === Avatar;
    // The tile must match the avatars beside it: explicit group size, else the first avatar's own size.
    const tileSize = size ?? items.find(isAvatar)?.props.size ?? "md";

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex items-center [&>*]:ring-2 [&>*]:ring-semantic-bg-primary",
          // 8px swallows the initials of 24px/30px avatars, so the small sizes overlap by 4px.
          tileSize === "xs" || tileSize === "sm"
            ? "[&>*:not(:first-child)]:-ms-1"
            : "[&>*:not(:first-child)]:-ms-2",
          className
        )}
        {...props}
      >
        {visible.map((child) =>
          size && isAvatar(child) && child.props.size === undefined
            ? React.cloneElement(child, { size })
            : child
        )}
        {hidden > 0 && (
          <Avatar
            size={tileSize}
            aria-label={`${hidden} more`}
            className="bg-semantic-bg-ui text-[var(--v2-text-secondary,#5E5E5E)]"
          >
            +{hidden}
          </Avatar>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarGroup, avatarVariants, getInitials };
