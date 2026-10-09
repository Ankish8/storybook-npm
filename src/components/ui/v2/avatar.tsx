import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  "relative inline-flex items-center justify-center rounded-full font-[family-name:var(--font-v2,Inter,sans-serif)] font-medium leading-[1.4] select-none shrink-0",
  {
    variants: {
      variant: {
        // Arc's avatar always carries a 1px border; filled hides it in its own colour.
        soft: "border border-solid border-semantic-border-layout bg-semantic-info-surface text-[var(--v2-text-muted,#707070)]",
        outline:
          "border border-solid border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-muted,#707070)]",
        filled:
          "border border-solid border-semantic-primary bg-semantic-primary text-semantic-text-inverted",
      },
      // Arc's scale: sm 28 / md 36 / lg 48 / xl 88 with 10 / 12 / 14 / 22px initials. xs (24) has no Arc counterpart.
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-7 text-[10px]",
        md: "size-9 text-xs",
        lg: "size-12 text-sm",
        xl: "size-[88px] text-[22px]",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "md",
    },
  }
);

// Arc's status dot: 8 / 10 / 12 / 14px with a 2px surface ring (1.5px at 8px) and a hairline outside it; the 88px
// avatar tucks it 4px in from the corner so it stays on the circle.
const statusDotSizeMap = {
  xs: "size-2 border-[1.5px] border-solid",
  sm: "size-2 border-[1.5px] border-solid",
  md: "size-2.5 border-2 border-solid",
  lg: "size-3 border-2 border-solid",
  xl: "size-3.5 border-2 border-solid !bottom-1 !right-1",
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
    const reducedMotion = useReducedMotion();
    const resolvedSize = size ?? "md";
    const displayInitials = initials ?? (name ? getInitials(name) : undefined);
    // A dead URL falls back exactly as if there were no src. Keyed by the failing URL so a new src gets a fresh
    // attempt, and nothing changes while the image loads (no fade or placeholder: avatars stay static).
    const [failedSrc, setFailedSrc] = React.useState<string | undefined>();
    const showImage = Boolean(src) && failedSrc !== src;
    // A photo that is already decoded shows at once. One still downloading waits invisible and soft, then fades in.
    const image = React.useRef<HTMLImageElement>(null);
    React.useLayoutEffect(() => {
      const node = image.current;
      if (node && !node.complete) node.dataset.loading = "";
    }, [src]);

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
            key={src}
            ref={image}
            src={src}
            alt={alt ?? name ?? "Avatar"}
            className="size-full rounded-full object-cover transition-[opacity,filter] [transition-duration:240ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] data-[loading]:opacity-0 data-[loading]:blur-[4px] data-[loading]:transition-none motion-reduce:transition-none motion-reduce:data-[loading]:blur-none"
            onLoad={(event) => {
              delete event.currentTarget.dataset.loading;
            }}
            onError={() => setFailedSrc(src)}
          />
        ) : children ? (
          children
        ) : displayInitials ? (
          // Initials that replace a dead photo fade in rather than pop.
          <motion.span
            aria-hidden="true"
            initial={src && !reducedMotion ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          >
            {displayInitials}
          </motion.span>
        ) : null}

        <AnimatePresence initial={false}>
          {status && (
            <motion.span
              key={status}
              aria-hidden="true"
              initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reducedMotion ? 1 : 0.6,
                transition: { duration: reducedMotion ? 0 : 0.16 },
              }}
              transition={
                reducedMotion
                  ? { duration: 0.12 }
                  : { type: "spring", visualDuration: 0.26, bounce: 0.12 }
              }
              className={cn(
                "absolute bottom-0 right-0 z-[2] rounded-full border-background shadow-[0_0_0_1px_color-mix(in_srgb,var(--semantic-border-layout)_70%,transparent)]",
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
 * Overlapping stack of avatars (-6px) separated by a 2px ring in the surface colour and a hairline outside it. Pointing
 * at the stack fans it out from the centre; the avatar under the pointer lifts 2px and its neighbours ease aside.
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
    const count = visible.length + (hidden > 0 ? 1 : 0);

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          "inline-flex items-center [&>*]:ring-2 [&>*]:ring-semantic-bg-primary [&>*]:shadow-[0_0_0_3px_var(--semantic-border-layout)]",
          // Arc overlaps every size by 6px.
          "[&>*:not(:first-child)]:-ms-1.5",
          // Hover motion (hover-capable pointers only; reduced motion keeps the stack still). Each child carries its
          // fan / aside / rise offsets as variables so one transform expresses all three, as in Arc.
          "[&>*]:[transform:translate(calc(var(--fan,0px)_+_var(--aside,0px)),var(--rise,0px))] [&>*]:[transition:transform_240ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[&>*]:!transform-none motion-reduce:[&>*]:!transition-none",
          "[@media(hover:hover)_and_(pointer:fine)]:[&:hover>*]:[--fan:calc((var(--index)_-_(var(--count)_-_1)_/_2)_*_4px)] [@media(hover:hover)_and_(pointer:fine)]:[&>*:hover]:z-[1] [@media(hover:hover)_and_(pointer:fine)]:[&>*:hover]:[--rise:-2px] [@media(hover:hover)_and_(pointer:fine)]:[&>*:hover~*]:[--aside:3px] [@media(hover:hover)_and_(pointer:fine)]:[&>*:has(~*:hover)]:[--aside:-3px]",
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
            style={
              {
                "--index": visible.length,
                "--count": count,
              } as React.CSSProperties
            }
            className="bg-semantic-bg-ui tabular-nums text-[var(--v2-text-secondary,#5E5E5E)]"
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
