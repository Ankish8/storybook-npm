import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const reducedMotionServerSnapshot = () => true;
function reducedMotionSnapshot() {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.(reducedMotionQuery)?.matches)
  );
}
function subscribeReducedMotion(listener: () => void) {
  const media = window.matchMedia?.(reducedMotionQuery);
  if (!media) return () => {};
  if (media.addEventListener) {
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }
  media.addListener(listener);
  return () => media.removeListener(listener);
}
function useLiveReducedMotion() {
  return React.useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    reducedMotionServerSnapshot
  );
}

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
  const trimmedName = name.trim();
  const parts = trimmedName.split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : trimmedName.slice(0, 2).toUpperCase();
}

const avatarVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-[family-name:var(--font-v2,Inter,sans-serif)] font-medium leading-[1.4] select-none shrink-0",
  {
    variants: {
      variant: {
        soft: "border border-solid border-v2-semantic-border-layout bg-v2-semantic-info-surface text-v2-semantic-text-muted",
        outline:
          "border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary text-v2-semantic-text-muted",
        filled:
          "border border-solid border-v2-semantic-primary bg-v2-semantic-primary text-v2-semantic-text-inverted",
      },
      // Keep the v1 footprints when a consumer changes only the import path.
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
  xs: "size-2 border border-solid",
  sm: "size-2.5 border-[1.5px] border-solid",
  md: "size-3 border-2 border-solid",
  lg: "size-3.5 border-2 border-solid",
  xl: "size-4 border-2 border-solid !bottom-1 !right-1",
} as const;

const statusColorMap = {
  online: "bg-v2-semantic-success-primary",
  offline: "bg-v2-semantic-text-muted",
  busy: "bg-v2-semantic-error-primary",
  away: "bg-v2-semantic-warning-primary",
} as const;

export interface AvatarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Name used to auto-generate initials and aria-label */
  name?: string;
  /** Image URL — shows custom content or initials while loading and if it fails */
  src?: string;
  /** Alt text for the image (defaults to name) */
  alt?: string;
  /** Override auto-generated initials (e.g., "AS") */
  initials?: string;
  /** Status dot shown at bottom-right and included in the default accessible name */
  status?: "online" | "offline" | "busy" | "away";
}

function AvatarPhoto({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}) {
  const image = React.useRef<HTMLImageElement>(null);
  const [state, setState] = React.useState<"loading" | "loaded" | "error">(
    "loading"
  );

  React.useLayoutEffect(() => {
    const node = image.current;
    if (node?.complete) {
      setState(node.naturalWidth > 0 ? "loaded" : "error");
    }
  }, []);

  if (state === "error") return <>{fallback}</>;

  return (
    <>
      {state === "loading" && fallback}
      <img
        ref={image}
        src={src}
        alt={alt}
        aria-hidden="true"
        decoding="async"
        data-loading={state === "loading" ? "" : undefined}
        className="pointer-events-none absolute inset-0 size-full rounded-full object-cover transition-[opacity,filter] duration-200 ease-out data-[loading]:opacity-0 data-[loading]:blur-[2px] data-[loading]:transition-none motion-reduce:transition-none motion-reduce:data-[loading]:blur-none"
        onLoad={() => setState("loaded")}
        onError={() => setState("error")}
      />
    </>
  );
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
    const reducedMotion = useLiveReducedMotion();
    const resolvedSize = size ?? "md";
    const displayInitials = initials ?? (name ? getInitials(name) : undefined);
    const identity =
      name?.trim() ||
      alt?.trim() ||
      displayInitials?.trim() ||
      (typeof children === "string" ? children.trim() : "") ||
      "Avatar";
    const fallback = children ? (
      children
    ) : displayInitials ? (
      <span aria-hidden="true">{displayInitials}</span>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, className }))}
        aria-label={identity}
        aria-description={status}
        role="img"
        {...props}
      >
        {src ? (
          <AvatarPhoto
            key={src}
            src={src}
            alt={alt ?? name ?? "Avatar"}
            fallback={fallback}
          />
        ) : (
          fallback
        )}

        <AnimatePresence initial={false}>
          {status && (
            <motion.span
              key={status}
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.85,
                transition: { duration: reducedMotion ? 0 : 0.12 },
              }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: 0.18, ease: [0.16, 1, 0.3, 1] }
              }
              className={cn(
                "absolute bottom-0 right-0 z-[2] rounded-full border-v2-semantic-bg-primary shadow-[0_0_0_1px_color-mix(in_srgb,var(--v2-semantic-border-layout,var(--semantic-border-layout))_70%,transparent)]",
                statusDotSizeMap[resolvedSize],
                statusColorMap[status]
              )}
              data-status={status}
            />
          )}
        </AnimatePresence>
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
 * Overlapping stack of avatars (-6px) separated by a 2px surface ring and an outer hairline.
 * With `max`, the avatars past the limit become a "+N" tile of the same size.
 * The ring colour follows the surface: on a tinted background override it with
 * `className="[&>*]:ring-v2-semantic-bg-ui"`.
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
    const count = visible.length + (hidden > 0 ? 1 : 0);
    const hiddenNames = items
      .slice(visible.length)
      .filter(isAvatar)
      .map(
        (child) =>
          child.props["aria-label"] ||
          child.props.name ||
          child.props.alt ||
          child.props.initials
      )
      .filter(Boolean)
      .join(", ");

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex items-center [&>*]:ring-2 [&>*]:ring-v2-semantic-bg-primary [&>*]:shadow-[0_0_0_3px_var(--v2-semantic-border-layout,var(--semantic-border-layout))]",
          "[&>*:not(:first-child)]:-ms-1.5",
          className
        )}
        {...props}
      >
        {visible.map((child, index) => {
          if (!isAvatar(child)) return child;
          const sized =
            size && child.props.size === undefined ? { size } : undefined;
          return React.cloneElement(child, {
            ...sized,
            style: {
              "--index": index,
              "--count": count,
              ...child.props.style,
            } as React.CSSProperties,
          });
        })}
        {hidden > 0 && (
          <Avatar
            size={tileSize}
            aria-label={`${hidden} more`}
            aria-description={hiddenNames || undefined}
            title={hiddenNames || undefined}
            style={
              {
                "--index": visible.length,
                "--count": count,
              } as React.CSSProperties
            }
            className="bg-v2-semantic-bg-ui text-v2-semantic-text-secondary tabular-nums"
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
