"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

type GroupItemKey =
  | { id: string; value?: string }
  | { value: string; id?: string };
export type ButtonGroupItem = GroupItemKey & {
  label: string;
  icon?: React.ReactNode;
  /** Alternate labels to reserve space for, for example ["Share", "Copied"]. */
  reserve?: string[];
  iconOnly?: boolean;
  content?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  onSelect?: () => void;
};
export interface ButtonGroupMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: (event: Event) => void;
}
export interface ButtonGroupMenu {
  label: string;
  items: ButtonGroupMenuItem[];
}
export interface ButtonGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  items: ButtonGroupItem[];
  label?: string;
  menu?: ButtonGroupMenu;
  variant?: "outline" | "solid" | "default" | "primary" | "toggle";
  size?: "sm" | "default" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  collapseLabels?: boolean;
  disabled?: boolean;
  /** Compatibility with existing v2 single-choice groups. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  alignment?: "start" | "end";
  iconOnly?: boolean;
}
// Arc motion tokens: "morph" for width changes that follow new content,
// "snappy" for the travelling highlight, a softer settle for the press dip.
const morph = { type: "spring", visualDuration: 0.42, bounce: 0.16 } as const;
const spring = { type: "spring", visualDuration: 0.26, bounce: 0.12 } as const;
const press = { type: "spring", visualDuration: 0.3, bounce: 0.15 } as const;
const ease = [0.22, 1, 0.36, 1] as const;
const easeEnter = [0.16, 1, 0.3, 1] as const;
const chevronSpring =
  "[transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)]";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
function iconIdentity(icon: React.ReactNode) {
  if (!React.isValidElement(icon)) return "none";
  const type = icon.type as string | { displayName?: string; name?: string };
  return typeof type === "string"
    ? type
    : (type.displayName ?? type.name ?? "icon");
}
const itemKey = (item: ButtonGroupItem) => item.id ?? item.value!;
const segments = (node: HTMLElement) =>
  Array.from(
    node.querySelectorAll<HTMLElement>(":scope > [data-group-segment]")
  );

function SegmentLabel({
  item,
  compact,
  reduced,
  small,
}: {
  item: ButtonGroupItem;
  compact: boolean;
  reduced: boolean;
  small: boolean;
}) {
  const node = React.useRef<HTMLSpanElement>(null);
  const width = useMotionValue<number | "auto">("auto");
  const last = React.useRef("");
  const targetWidth = React.useRef(0);
  const key =
    item.content !== undefined
      ? "content"
      : `${item.label}:${iconIdentity(item.icon)}:${item.iconOnly}`;
  useIsomorphicLayoutEffect(() => {
    const content = node.current;
    if (!content || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      const next = content.getBoundingClientRect().width;
      if (!next || next === targetWidth.current) return;
      targetWidth.current = next;
      if (last.current && last.current !== key && !reduced)
        animate(width, next, morph);
      else width.jump(next);
      last.current = key;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    return () => observer.disconnect();
  }, [key, reduced, width, compact]);
  const hideLabel =
    (item.iconOnly && !!item.icon) ||
    (compact && !!item.icon && item.content === undefined);
  // Arc: 8px between icon and label, 6px in the small group, 1.75 strokes.
  const gap = small ? "gap-1.5" : "gap-2";
  const icon = item.icon && (
    <span
      className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:[stroke-width:1.75]"
      aria-hidden="true"
    >
      {item.icon}
    </span>
  );
  return (
    <motion.span
      aria-hidden="true"
      className="relative inline-flex min-w-0 items-center justify-center"
      style={{ width }}
    >
      <span
        ref={node}
        className="relative inline-grid shrink-0 items-center justify-items-center"
      >
        {item.content === undefined &&
          [...new Set([item.label, ...(item.reserve ?? [])])].map((text) => (
            <span
              key={text}
              className={cn(
                "invisible pointer-events-none col-start-1 row-start-1 inline-flex items-center whitespace-nowrap",
                gap
              )}
            >
              {icon}
              {!hideLabel && text}
            </span>
          ))}
        {item.content !== undefined && (
          <span
            className={cn(
              "invisible pointer-events-none col-start-1 row-start-1 inline-flex items-center whitespace-nowrap",
              gap
            )}
          >
            {icon}
            {item.content}
          </span>
        )}
        <AnimatePresence initial={false}>
          <motion.span
            key={key}
            className={cn(
              "absolute inset-0 inline-flex items-center justify-center whitespace-nowrap tabular-nums",
              gap
            )}
            initial={
              reduced
                ? { opacity: 0 }
                : { opacity: 0, y: 4, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduced
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -3,
                    filter: "blur(4px)",
                    transition: { duration: 0.16, ease },
                  }
            }
            transition={
              reduced ? { duration: 0.12 } : { duration: 0.24, ease: easeEnter }
            }
          >
            {icon}
            {item.content !== undefined
              ? item.content
              : !hideLabel && item.label}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
  );
}

/** Joined actions with a shared hover/focus highlight. Existing value-based groups retain selection behavior. */
const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      items,
      label,
      menu,
      variant = "outline",
      size = "default",
      orientation = "horizontal",
      collapseLabels = true,
      disabled = false,
      value,
      defaultValue,
      onValueChange,
      alignment = "start",
      iconOnly = false,
      className,
      "aria-label": ariaLabel,
      onPointerMove,
      onPointerLeave,
      onPointerDown,
      onFocus,
      onBlur,
      onKeyDown,
      ...props
    },
    forwardedRef
  ) => {
    const root = React.useRef<HTMLDivElement>(null);
    const menuKey = React.useId();
    const reduced = useReducedMotion() ?? false;
    const vertical = orientation === "vertical";
    const solid = variant === "solid" || variant === "primary";
    const selectionMode =
      value !== undefined ||
      defaultValue !== undefined ||
      !!onValueChange ||
      variant === "toggle" ||
      items.some((item) => item.id === undefined);
    const [local, setLocal] = React.useState(defaultValue);
    const selected = value === undefined ? local : value;
    const [hover, setHover] = React.useState<string | null>(null);
    const [focus, setFocus] = React.useState<string | null>(null);
    const [pressed, setPressed] = React.useState<string | null>(null);
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [compact, setCompact] = React.useState(false);
    const [announcement, setAnnouncement] = React.useState("");
    const hasMenu = !!menu?.items.length;
    const isMenuOpen = menuOpen && !disabled && hasMenu;
    if (menuOpen && (disabled || !hasMenu)) setMenuOpen(false);
    const active = disabled
      ? null
      : (hover ?? pressed ?? (isMenuOpen ? menuKey : null) ?? focus);
    const keys = [...items.map(itemKey), ...(hasMenu ? [menuKey] : [])];
    const keyList = keys.join("\u0000");
    const activeIndex = active === null ? -1 : keys.indexOf(active);
    const x = useMotionValue(0),
      y = useMotionValue(0),
      width = useMotionValue(0),
      height = useMotionValue(0),
      opacity = useMotionValue(0);
    const shown = React.useRef<string | null>(null);
    const disabledKey = `${disabled}:${items.map((item) => !!item.disabled).join()}`;
    useIsomorphicLayoutEffect(() => {
      const group = root.current;
      if (!group) return;
      const current = segments(group).find(
        (node) => node.dataset.groupSegment === active
      );
      if (
        !current ||
        (current.getAttribute("aria-disabled") === "true" && active !== focus)
      ) {
        animate(opacity, 0, { duration: 0.12 });
        shown.current = null;
        return;
      }
      let measured: number[] = [];
      const measure = (resizing = false) => {
        const box = current.getBoundingClientRect(),
          parent = group.getBoundingClientRect();
        const scale =
          group.offsetWidth && Math.abs(parent.width - group.offsetWidth) > 1
            ? parent.width / group.offsetWidth
            : 1;
        const target = [
          (box.left - parent.left) / scale -
            group.clientLeft +
            group.scrollLeft,
          (box.top - parent.top) / scale - group.clientTop + group.scrollTop,
          box.width / scale,
          box.height / scale,
        ];
        // Initial observer delivery must not cancel a travelling highlight.
        if (
          resizing &&
          target.every((v, index) => Math.abs(v - measured[index]) < 0.01)
        )
          return;
        measured = target;
        [x, y, width, height].forEach((v, index) => {
          if (reduced || !shown.current || resizing) v.jump(target[index]);
          else animate(v, target[index], spring);
        });
        animate(opacity, 1, { duration: 0.12 });
        shown.current = active;
      };
      measure();
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => measure(true));
      observer.observe(group);
      segments(group).forEach((node) => observer.observe(node));
      return () => observer.disconnect();
    }, [
      active,
      focus,
      disabledKey,
      keyList,
      reduced,
      x,
      y,
      width,
      height,
      opacity,
    ]);

    const expandedWidth = React.useRef(0);
    React.useEffect(() => {
      const group = root.current,
        parent = group?.parentElement;
      if (
        !group ||
        !parent ||
        vertical ||
        !collapseLabels ||
        iconOnly ||
        typeof ResizeObserver === "undefined"
      )
        return;
      const measure = () => {
        const css = getComputedStyle(parent);
        const available =
          parent.clientWidth -
          (parseFloat(css.paddingLeft) || 0) -
          (parseFloat(css.paddingRight) || 0);
        if (group.dataset.compact === "true") {
          if (available >= expandedWidth.current && expandedWidth.current > 0)
            setCompact(false);
        } else if (group.scrollWidth > group.clientWidth + 1) {
          expandedWidth.current = group.scrollWidth + 2;
          setCompact(true);
        }
      };
      const observer = new ResizeObserver(measure);
      observer.observe(group);
      observer.observe(parent);
      return () => observer.disconnect();
    }, [vertical, collapseLabels, iconOnly, keyList]);
    const collapsed = compact && collapseLabels && !vertical && !iconOnly;
    React.useEffect(() => {
      if (!pressed) return;
      const release = () => setPressed(null);
      window.addEventListener("pointerup", release);
      window.addEventListener("pointercancel", release);
      window.addEventListener("keyup", release);
      window.addEventListener("blur", release);
      return () => {
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        window.removeEventListener("keyup", release);
        window.removeEventListener("blur", release);
      };
    }, [pressed]);
    const activated = React.useRef({ key: "", time: 0 });
    const previousLabels = React.useRef(new Map<string, string>());
    React.useEffect(() => {
      const clicked = activated.current;
      const changed = items.find(
        (item) =>
          itemKey(item) === clicked.key &&
          previousLabels.current.has(clicked.key) &&
          previousLabels.current.get(clicked.key) !== item.label
      );
      if (changed && performance.now() - clicked.time < 1200)
        setAnnouncement(changed.label);
      previousLabels.current = new Map(
        items.map((item) => [itemKey(item), item.label])
      );
    }, [items]);
    const targetSegment = (target: EventTarget | null) => {
      const node =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-group-segment]")
          : null;
      return node?.parentElement === root.current ? node : null;
    };
    const availableKey = (target: EventTarget | null) => {
      const node = targetSegment(target);
      return !disabled &&
        node &&
        node.getAttribute("aria-disabled") !== "true" &&
        !(node as HTMLButtonElement).disabled
        ? node.dataset.groupSegment!
        : null;
    };
    const choose = (item: ButtonGroupItem) => {
      if (disabled || item.disabled) return;
      // Called only by the native click handlers below, never during render.
      // eslint-disable-next-line react-hooks/purity
      activated.current = { key: itemKey(item), time: performance.now() };
      setAnnouncement("");
      item.onSelect?.();
      if (selectionMode) {
        const next = item.value ?? item.id!;
        if (value === undefined) setLocal(next);
        onValueChange?.(next);
      }
    };
    // Arc geometry: md 42px segments with 14px padding, sm 34px with 12px,
    // chevron segment 6px narrower than the row height, dividers inset 11px
    // (9px sm, 10px vertical) and a letter-spacing of -0.01em.
    const segmentClasses = (
      index: number,
      onlyIcon: boolean,
      isSelected = false,
      isMenu = false
    ) =>
      cn(
        "relative z-10 m-0 inline-flex shrink-0 items-center justify-center whitespace-nowrap border-0 border-solid bg-transparent px-[14px] py-0 font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-medium leading-none tracking-[-0.01em] text-inherit no-underline outline-none focus:outline-none focus-visible:[outline-width:0px] cursor-pointer select-none [-webkit-tap-highlight-color:transparent] disabled:cursor-not-allowed aria-disabled:cursor-not-allowed hover:no-underline",
        size === "sm"
          ? "h-[34px] min-w-[34px] px-3"
          : size === "lg"
            ? "h-12 min-w-12"
            : "h-[42px] min-w-[42px]",
        onlyIcon &&
          (size === "sm"
            ? "w-[34px] px-0"
            : size === "lg"
              ? "w-12 px-0"
              : "w-[42px] px-0"),
        isMenu &&
          cn(
            "min-w-0 px-0 transition-colors [transition-duration:160ms] data-[state=open]:text-inherit",
            size === "sm"
              ? "w-[30px]"
              : size === "lg"
                ? "w-[42px]"
                : "w-[38px]",
            solid
              ? "text-[color-mix(in_oklab,var(--semantic-text-inverted,#fff)_72%,var(--semantic-primary))]"
              : "text-[var(--v2-text-secondary,#5E5E5E)]"
          ),
        vertical && "w-full justify-start",
        vertical && onlyIcon && "justify-center",
        index > 0 &&
          "before:pointer-events-none before:absolute before:content-[''] before:transition-opacity before:duration-150",
        index > 0 &&
          (solid
            ? "before:bg-semantic-text-inverted before:opacity-20"
            : "before:bg-semantic-border-layout before:opacity-100"),
        index > 0 &&
          (vertical
            ? "before:start-2.5 before:end-2.5 before:top-[-0.5px] before:h-px"
            : cn(
                "before:start-[-0.5px] before:w-px",
                size === "sm"
                  ? "before:top-[9px] before:bottom-[9px]"
                  : "before:top-[11px] before:bottom-[11px]"
              )),
        (activeIndex === index ||
          (activeIndex + 1 === index && activeIndex >= 0)) &&
          "before:opacity-0",
        isSelected &&
          (solid ? "bg-semantic-primary-hover" : "bg-semantic-bg-hover")
      );
    const group = (
      <div
        {...props}
        ref={(node) => {
          root.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        role="group"
        aria-label={label ?? ariaLabel ?? "Options"}
        aria-disabled={disabled || undefined}
        data-orientation={orientation}
        data-compact={collapsed}
        data-mode={selectionMode ? "selection" : "actions"}
        className={cn(
          "relative isolate inline-flex max-w-full items-stretch overflow-x-auto overscroll-x-contain rounded-lg border border-solid align-middle font-[family-name:var(--font-v2,Inter,sans-serif)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          solid
            ? "border-semantic-primary bg-semantic-primary text-semantic-text-inverted"
            : "border-semantic-border-layout bg-semantic-bg-primary text-[var(--v2-text-primary,#484848)]",
          vertical && "flex-col",
          alignment === "end" && "justify-end",
          disabled && "opacity-[0.52]",
          className
        )}
        onPointerMove={(event) => {
          onPointerMove?.(event);
          if (!event.defaultPrevented && event.pointerType !== "touch")
            setHover(availableKey(event.target));
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHover(null);
          setPressed(null);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (!event.defaultPrevented && event.button === 0) {
            setFocus(null);
            setPressed(availableKey(event.target));
          }
        }}
        onFocus={(event) => {
          onFocus?.(event);
          const node = targetSegment(event.target);
          if (node?.matches(":focus-visible"))
            setFocus(node.dataset.groupSegment!);
        }}
        onBlur={(event) => {
          onBlur?.(event);
          if (!root.current?.contains(event.relatedTarget as Node | null)) {
            setFocus(null);
            setPressed(null);
          }
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented || !root.current) return;
          const list = segments(root.current).filter(
            (node) => !(node as HTMLButtonElement).disabled
          );
          const index = list.indexOf(event.target as HTMLElement);
          if (index < 0) return;
          if (event.key === "Enter" || event.key === " ")
            setPressed(availableKey(event.target));
          const rtl = getComputedStyle(root.current).direction === "rtl";
          const next = vertical
            ? "ArrowDown"
            : rtl
              ? "ArrowLeft"
              : "ArrowRight";
          const prev = vertical ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
          const destination =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? list.length - 1
                : event.key === next
                  ? (index + 1) % list.length
                  : event.key === prev
                    ? (index + list.length - 1) % list.length
                    : -1;
          if (destination >= 0) {
            event.preventDefault();
            list[destination].focus();
            setFocus(list[destination].dataset.groupSegment!);
          }
        }}
      >
        <motion.span
          aria-hidden="true"
          data-group-highlight=""
          className="pointer-events-none absolute left-0 top-0 z-0"
          style={{ x, y, width, height, opacity }}
        >
          <span
            className={cn(
              "absolute inset-[3px] rounded transition-colors",
              pressed === active && pressed
                ? "[transition-duration:120ms]"
                : "[transition-duration:160ms]",
              solid
                ? pressed === active && pressed
                  ? "bg-semantic-text-inverted opacity-20"
                  : "bg-semantic-text-inverted opacity-10"
                : pressed === active && pressed
                  ? "bg-semantic-border-layout"
                  : "bg-semantic-bg-hover"
            )}
          />
        </motion.span>
        {items.map((item, index) => {
          const onlyIcon = !!(
            (iconOnly && item.icon) ||
            (item.iconOnly && item.icon) ||
            (collapsed && item.icon && item.content === undefined)
          );
          const off = disabled || item.disabled;
          const common = {
            "data-group-segment": itemKey(item),
            "aria-label": item.label,
            "aria-pressed": selectionMode
              ? selected === (item.value ?? item.id)
              : undefined,
            "aria-disabled": off || undefined,
            title:
              onlyIcon || iconOnly || item.iconOnly ? item.label : undefined,
            className: segmentClasses(
              index,
              onlyIcon,
              selectionMode && selected === (item.value ?? item.id)
            ),
          };
          const body = (
            <motion.span
              className={cn(
                "relative inline-flex items-center",
                item.disabled && !disabled && "opacity-40"
              )}
              animate={{
                scale:
                  !reduced && !off && pressed === itemKey(item)
                    ? onlyIcon
                      ? 0.9
                      : 0.97
                    : 1,
              }}
              transition={press}
            >
              <SegmentLabel
                item={{ ...item, iconOnly: iconOnly || item.iconOnly }}
                compact={collapsed}
                reduced={reduced}
                small={size === "sm"}
              />
            </motion.span>
          );
          return item.href && !off ? (
            <a
              key={itemKey(item)}
              {...common}
              href={item.href}
              onClick={() => choose(item)}
            >
              {body}
            </a>
          ) : (
            <button
              key={itemKey(item)}
              {...common}
              type="button"
              disabled={disabled || (selectionMode && item.disabled)}
              onClick={() => choose(item)}
            >
              {body}
            </button>
          );
        })}
        {hasMenu && (
          <DropdownMenuTrigger
            asChild
            className="focus-visible:outline-none focus-visible:[outline-width:0px]"
          >
            <button
              type="button"
              data-group-segment={menuKey}
              disabled={disabled}
              aria-label={menu!.label}
              title={menu!.label}
              className={segmentClasses(items.length, true, false, true)}
            >
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  "size-4 [stroke-width:1.75] transition-transform [transition-duration:580ms] motion-reduce:transition-none",
                  chevronSpring,
                  isMenuOpen && !reduced && "rotate-180"
                )}
              />
            </button>
          </DropdownMenuTrigger>
        )}
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {announcement}
        </span>
      </div>
    );
    if (!hasMenu) return group;
    return (
      <DropdownMenu
        modal={false}
        open={isMenuOpen}
        onOpenChange={(next) => setMenuOpen(!disabled && next)}
      >
        {group}
        <DropdownMenuContent
          align={vertical ? "start" : "end"}
          alignOffset={-1}
          sideOffset={6}
          collisionPadding={12}
          loop
          className="min-w-[min(13rem,var(--radix-dropdown-menu-content-available-width))]"
        >
          {menu!.items.map((item) => {
            const body = (
              <>
                {item.icon && (
                  <span
                    aria-hidden="true"
                    className="inline-flex size-4 shrink-0 [&_svg]:size-4 [&_svg]:[stroke-width:1.75]"
                  >
                    {item.icon}
                  </span>
                )}
                <span className="min-w-0 whitespace-normal break-words leading-[1.4]">
                  {item.label}
                </span>
              </>
            );
            return (
              <DropdownMenuItem
                key={item.id}
                disabled={disabled || item.disabled}
                destructive={item.destructive}
                asChild={!!item.href && !item.disabled && !disabled}
                onSelect={(event) => {
                  if (disabled || item.disabled) event.preventDefault();
                  else item.onSelect?.(event);
                }}
              >
                {item.href && !item.disabled && !disabled ? (
                  <a href={item.href}>{body}</a>
                ) : (
                  body
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";
export { ButtonGroup };
