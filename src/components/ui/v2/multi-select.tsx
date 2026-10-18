import * as React from "react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown, CircleAlert, Loader2, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * Single selectable row (similar to legacy OptionType — different name).
 * Selection state is driven by `value` / `onValueChange`, not by a prop.
 */
export interface MultiSelectChoice {
  value: string;
  label: string;
  /** Secondary line (e.g. “Assigned to …”) — alias of `secondaryText` on `MultiSelectOption` */
  caption?: string;
  /** Disabled row — alias of `disabled` */
  isDisabled?: boolean;
  /** Tooltip on disabled row — alias of `disabledTooltip` */
  overlayMsg?: string;
  isDeleted?: boolean;
  isLast?: boolean;
}

/**
 * Grouped options (similar to legacy GroupBase — different name).
 */
export interface MultiSelectGroupedSection<
  T extends MultiSelectChoice = MultiSelectChoice,
> {
  readonly label?: string;
  readonly options: readonly T[];
}

/** Flat list or grouped sections */
export type MultiSelectOptionInput =
  | MultiSelectOption[]
  | readonly MultiSelectGroupedSection[];

/**
 * Normalized option: supports both `caption` / `isDisabled` / `overlayMsg` and
 * `secondaryText` / `disabled` / `disabledTooltip`.
 */
export interface MultiSelectOption extends MultiSelectChoice {
  secondaryText?: string;
  disabled?: boolean;
  disabledTooltip?: string;
  group?: string;
}

/**
 * Use when typing **object literals** for fixtures, stories, or tests so TypeScript applies
 * [excess property checking](https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks)
 * (catches typos like `captoin` and mistaken duplicate keys).
 *
 * This omits `secondaryText`; use `caption` for the secondary line — runtime code still accepts
 * both via {@link normalizeMultiSelectOption}. Widen to {@link MultiSelectOption} where a
 * consumer expects both aliases.
 */
export type MultiSelectOptionAuthoring = Omit<
  MultiSelectOption,
  "secondaryText"
>;

function isGroupedSections(
  input: MultiSelectOptionInput
): input is readonly MultiSelectGroupedSection[] {
  if (!Array.isArray(input) || input.length === 0) return false;
  return input.every(
    (item) =>
      item !== null &&
      typeof item === "object" &&
      "options" in item &&
      Array.isArray((item as MultiSelectGroupedSection).options)
  );
}

export function normalizeMultiSelectOption(
  o: MultiSelectOption | MultiSelectChoice
): MultiSelectOption {
  const merged = { ...(o as MultiSelectOption) };
  merged.disabled = merged.disabled ?? merged.isDisabled ?? false;
  merged.secondaryText = merged.secondaryText ?? merged.caption;
  merged.disabledTooltip = merged.disabledTooltip ?? merged.overlayMsg;
  return merged;
}

export function flattenMultiSelectOptions(
  input: MultiSelectOptionInput
): MultiSelectOption[] {
  if (!input?.length) return [];
  if (isGroupedSections(input)) {
    const out: MultiSelectOption[] = [];
    for (const section of input) {
      const groupLabel = section.label ?? "";
      for (const raw of section.options) {
        const n = normalizeMultiSelectOption(raw as MultiSelectOption);
        out.push({
          ...n,
          group: n.group ?? groupLabel,
        });
      }
    }
    return out;
  }
  return (input as MultiSelectOption[]).map(normalizeMultiSelectOption);
}

/**
 * The corner of the panel that touches the trigger, from the placement
 * floating-ui actually used. `flip` can put the panel above the trigger or
 * right-aligned; growing it from a fixed top-left would then look like it
 * detaches from the field.
 */
function panelTransformOrigin(placement: Placement): string {
  const [side, align] = placement.split("-");
  if (side === "top" || side === "bottom") {
    const x = align === "end" ? "right" : align === "start" ? "left" : "center";
    return `${side === "top" ? "bottom" : "top"} ${x}`;
  }
  const y = align === "end" ? "bottom" : align === "start" ? "top" : "center";
  return `${y} ${side === "left" ? "right" : "left"}`;
}

/**
 * Arc's chevron turns on a 580ms spring that settles with a hint of life; the
 * sampled curve is Arc's own `--ease-spring`. Wrapped in `cn(...)` so the CLI
 * prefixer transforms the literal.
 */
const chevronSpringClassName = cn(
  "[stroke-width:1.75] [transition-property:transform,color] [transition-duration:580ms] [transition-timing-function:linear(0,0.0258,0.09,0.1763,0.2732,0.3724,0.4683,0.5573,0.6376,0.7082,0.7689,0.8202,0.8628,0.8976,0.9256,0.9476,0.9648,0.9778,0.9875,0.9945,0.9994,1.0026,1.0047,1.0058,1.0062,1.0062,1.0059,1.0055,1.0049,1.0043,1.0036,1.0031,1.0025,1.002,1.0016,1.0013,1)] motion-reduce:transition-none"
);

/**
 * The check Arc draws left to right when a row is picked. `pathLength` makes
 * the dash arithmetic independent of the path, and `@starting-style` gives the
 * freshly mounted path its retracted look to transition from.
 */
function RowCheck() {
  return (
    <svg
      className="size-4 shrink-0 text-[var(--v2-selection-accent,var(--semantic-primary))]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M4 12.5 9 17.5 20 6.5"
        pathLength={1}
        className="[stroke-dasharray:1] [stroke-dashoffset:0] [transition:stroke-dashoffset_240ms_cubic-bezier(0.16,1,0.3,1),opacity_120ms_cubic-bezier(0.22,1,0.36,1)] [@starting-style]:[stroke-dashoffset:1] [@starting-style]:opacity-0 motion-reduce:[transition:opacity_120ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[@starting-style]:[stroke-dashoffset:0]"
      />
    </svg>
  );
}

/** Menu never renders narrower than this, even off a tiny trigger. */
const MENU_MIN_WIDTH = 180;
/** Floor for the flip/shrink height so the list is never collapsed to nothing. */
const MENU_MIN_HEIGHT = 120;

/**
 * Distance from the bottom of the option list, in px, at which `onScrollEnd`
 * fires. Roughly one option row, so the next page starts loading just before
 * the user actually hits the end.
 */
const SCROLL_END_THRESHOLD_PX = 48;

/**
 * How long to wait after a page lands before re-measuring the list. React has
 * committed the new rows by the time the effect runs, but the browser has not
 * necessarily laid them out, so `scrollHeight` can still read the pre-growth
 * value. One frame is usually enough; 50ms is a cheap margin.
 */
const POST_FETCH_MEASURE_DELAY_MS = 50;

/** Rows the keyboard can land on: every option that is not disabled, select-all included. */
const ENABLED_OPTION_SELECTOR =
  '[role="option"]:not([aria-disabled="true"]):not(:disabled)';

/** Keyboard stops of the open menu, in order: the search field, then each enabled row. */
function menuFocusTargets(menu: HTMLElement): HTMLElement[] {
  return Array.from(
    menu.querySelectorAll<HTMLElement>(
      `[data-multi-select-search], ${ENABLED_OPTION_SELECTOR}`
    )
  );
}

function focusMenuTarget(target: HTMLElement | undefined) {
  if (!target) return;
  // The panel is fixed and portaled, so only the list itself needs to scroll.
  target.focus({ preventScroll: true });
  target.scrollIntoView?.({ block: "nearest" });
}

/**
 * Moves focus into the open menu. With a search field that is where typing
 * belongs, so it wins; otherwise the first picked row (or the first row) is the
 * sensible place to start, and ArrowUp starts from the end. A pointer open only
 * focuses the search field, and not on touch, where it would raise the keyboard.
 */
function focusInMenu(menu: HTMLElement, where: "first" | "last" | "pointer") {
  const search = menu.querySelector<HTMLElement>("[data-multi-select-search]");
  if (where === "pointer") {
    if (search && prefersFinePointer()) focusMenuTarget(search);
    return;
  }
  const targets = menuFocusTargets(menu);
  if (where === "last") {
    focusMenuTarget(targets[targets.length - 1]);
    return;
  }
  focusMenuTarget(
    search ??
      menu.querySelector<HTMLElement>(
        `${ENABLED_OPTION_SELECTOR}[aria-selected="true"]`
      ) ??
      targets[0]
  );
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)")?.matches === true
  );
}

/** A touch keyboard covering half the screen is not what someone opening a list wants. */
function prefersFinePointer(): boolean {
  return (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function" ||
    window.matchMedia("(pointer: fine)")?.matches !== false
  );
}

/**
 * Chip surface. The enter transition is separate so the leaving copy (which is
 * already on screen) does not replay it. Wrapped in `cn(...)` so the CLI
 * prefixer transforms the literals.
 */
const CHIP_BASE_CLASSNAME = cn(
  "inline-flex min-w-0 max-w-[9rem] items-center gap-1 rounded-lg bg-v2-semantic-bg-ui px-2 py-1 text-xs font-normal leading-[1.4] text-[var(--v2-text-primary,#484848)] ring-1 ring-inset ring-v2-semantic-border-layout group-aria-expanded/ms:bg-v2-semantic-bg-primary [@media(hover:hover)]:group-[:hover:not(:disabled)]/ms:bg-v2-semantic-bg-primary"
);
const CHIP_ENTER_CLASSNAME = cn(
  "[transition:opacity_160ms_cubic-bezier(0.16,1,0.3,1),transform_260ms_cubic-bezier(0.16,1,0.3,1),filter_240ms_cubic-bezier(0.16,1,0.3,1),background-color_160ms_cubic-bezier(0.22,1,0.36,1)] [@starting-style]:scale-90 [@starting-style]:opacity-0 [@starting-style]:blur-[4px] motion-reduce:[@starting-style]:scale-100 motion-reduce:[@starting-style]:blur-0"
);
/** 16px plate (12px icon + 2px padding) with a 24px hit area; `-m-0.5` cancels the padding. */
const CHIP_REMOVE_CLASSNAME = cn(
  "relative -m-0.5 shrink-0 cursor-pointer rounded-sm p-0.5 transition-colors duration-150 before:absolute before:-inset-1 before:content-[''] focus:outline-none"
);

/** A chip that has just been removed, kept on screen for the moment it takes to close. */
interface ChipGhostData {
  id: number;
  label: string;
  width: number;
  index: number;
}

/**
 * The leaving half of a chip: a hollow copy that closes its width, fades and
 * shrinks, then lets go. The real chip is gone from the DOM the instant the
 * value changes, so assistive tech, tests and focus never see this one.
 */
function ChipGhost({
  ghost,
  onDone,
}: {
  ghost: ChipGhostData;
  onDone: (id: number) => void;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof node.animate !== "function") {
      onDone(ghost.id);
      return;
    }
    const animation = node.animate(
      [
        {
          width: `${ghost.width}px`,
          marginRight: "0px",
          opacity: 1,
          transform: "scale(1)",
          filter: "blur(0px)",
        },
        {
          width: "0px",
          marginRight: "-5px",
          opacity: 0,
          transform: "scale(0.9)",
          filter: "blur(3px)",
        },
      ],
      {
        duration: 200,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      }
    );
    animation.onfinish = () => onDone(ghost.id);
    return () => animation.cancel();
  }, [ghost.id, ghost.width, onDone]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-chip-ghost=""
      className={cn(CHIP_BASE_CLASSNAME, "pointer-events-none overflow-hidden")}
      style={{ width: ghost.width }}
    >
      <span className="min-w-0 truncate">{ghost.label}</span>
      <span className={CHIP_REMOVE_CLASSNAME}>
        <X className="size-3" />
      </span>
    </span>
  );
}

/**
 * The "+N" count. A larger number rises into place and a smaller one drops in,
 * so the change reads as counting rather than blinking.
 */
function OverflowCount({ value }: { value: number }) {
  const [shown, setShown] = React.useState({ value, direction: 1 });
  if (shown.value !== value) {
    setShown({ value, direction: value > shown.value ? 1 : -1 });
  }
  return (
    <span
      key={value}
      className={cn(
        "inline-block motion-safe:animate-in motion-safe:fade-in-0 motion-safe:[animation-duration:200ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)]",
        shown.direction > 0
          ? "motion-safe:slide-in-from-bottom-1"
          : "motion-safe:slide-in-from-top-1"
      )}
    >
      {value}
    </span>
  );
}

/**
 * MultiSelect trigger variants matching TextField styling
 */
const multiSelectTriggerVariants = cva(
  "group/ms flex min-h-11 w-full items-center justify-between rounded-lg bg-v2-semantic-bg-primary py-[5px] pl-3 pr-[11px] font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal text-sm leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] dark:focus-visible:[outline:2px_solid_var(--v2-semantic-border-focus)] dark:focus-visible:outline-offset-2 transition-[border-color,box-shadow,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] disabled:cursor-not-allowed disabled:bg-v2-semantic-bg-ui disabled:border-v2-semantic-border-layout disabled:opacity-50 disabled:shadow-none",
  {
    variants: {
      state: {
        default:
          // Focus moves into the search field or a row while the panel is open, so
          // `focus:` alone drops the primary border. `aria-expanded` keeps it, and the
          // extra `hover` selector outranks the grey hover border (0,4,0 vs 0,3,0).
          // Arc also tints the field on hover, press and while open (its muted surface).
          "border border-solid border-v2-semantic-border-input focus:outline-none enabled:hover:border-[var(--v2-semantic-border-primary,var(--color-primary-100,#C0C3CA))] [@media(hover:hover)]:enabled:hover:bg-v2-semantic-bg-ui enabled:active:bg-v2-semantic-bg-ui focus:shadow-none aria-expanded:border-[var(--v2-semantic-border-focus,var(--semantic-primary))] aria-expanded:bg-v2-semantic-bg-ui aria-expanded:shadow-none enabled:aria-expanded:hover:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]",
        error:
          "border border-solid border-v2-semantic-error-primary shadow-[var(--v2-shadow-error,0_0_4px_0_rgba(240,68,56,0.4))] focus:outline-none ",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

export interface MultiSelectProps extends VariantProps<
  typeof multiSelectTriggerVariants
> {
  /** Label text displayed above the select */
  label?: string;
  /** Shows red asterisk next to label when true */
  required?: boolean;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Error message - shows error state with red styling */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /**
   * Called once when the option list is scrolled to within
   * `SCROLL_END_THRESHOLD_PX` of its bottom. Use it to fetch the next page of
   * server-side options. Fires at most once per scroll gesture — it re-arms
   * only after the user scrolls back away from the bottom, so a single
   * trackpad flick (which keeps emitting scroll events while it decelerates)
   * cannot fan out into several requests.
   */
  onScrollEnd?: () => void;
  /**
   * Whether the server has more pages. When false, `onScrollEnd` is never
   * called.
   * @default false
   */
  hasMore?: boolean;
  /**
   * Whether a page fetch is in flight. Renders a loading row at the bottom of
   * the list and suppresses further `onScrollEnd` calls.
   * @default false
   */
  loadingMore?: boolean;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Currently selected values (controlled) */
  value?: string[];
  /** Default values (uncontrolled) */
  defaultValue?: string[];
  /** Callback when values change */
  onValueChange?: (value: string[]) => void;
  /** Flat options or grouped sections (`MultiSelectGroupedSection[]`) */
  options: MultiSelectOptionInput;
  /**
   * When false (default), a trigger that still has focus ignores Escape and the
   * list closes on outside click. Escape always closes the list once focus is
   * inside it (after ArrowDown, a search or a row), and returns focus to the
   * trigger. Set true to close from the trigger on Escape as well.
   */
  closeOnEscape?: boolean;
  /**
   * Show at most this many chips in the trigger, then a "+N" count (hover it to
   * read the rest). The trigger stays one line instead of growing a row per few
   * chips. Omit to show every chip and let them wrap (the default).
   */
  maxVisible?: number;
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /**
   * Controlled search value. Pair with `onSearchQueryChange` when filtering
   * happens server-side (e.g. alongside `onScrollEnd` pagination, where each
   * page only has a slice of the full result set — client-side filtering
   * would search just that slice and show false "No results found" states).
   * When provided, the component stops managing its own search state and
   * stops filtering `options` itself; the caller is expected to pass already
   * filtered `options` for the current `searchQuery`.
   */
  searchQuery?: string;
  /** Fires on every search input change. Required to pair with `searchQuery`. */
  onSearchQueryChange?: (query: string) => void;
  /**
   * When set, the trigger shows a single compact summary (e.g. "3 lines
   * selected") instead of one chip per selection; hovering it reveals the full
   * list of selected labels in a tooltip. Receives the selected count.
   */
  summaryLabel?: (count: number) => string;
  /**
   * When set, pins a select-all row at the top of the list with this label
   * (e.g. "All lines"). Toggles every non-disabled option; respects
   * `maxSelections`. Omit to hide the row entirely.
   */
  selectAllLabel?: string;
  /** Maximum selections allowed */
  maxSelections?: number;
  /**
   * When `maxSelections` is set, a footer shows the count (e.g. "3 / 5 selected").
   * Set to false to hide that footer while still enforcing the limit.
   * @default true
   */
  showSelectionFooter?: boolean;
  /** Additional class for wrapper */
  wrapperClassName?: string;
  /** Additional class for trigger */
  triggerClassName?: string;
  /** Additional class for label */
  labelClassName?: string;
  /** ID for the select */
  id?: string;
  /** Name attribute for form submission */
  name?: string;
  /**
   * simple: checkmark on the right (default).
   * detailed: checkbox + primary + optional secondary text (Figma / WhatsApp-style rows).
   */
  optionVariant?: "simple" | "detailed";
  /** When true, selected options appear first with a divider before the rest */
  separateSelectedWithDivider?: boolean;
  /** Show the clear-all control in the trigger (hidden in compact / Figma-style triggers) */
  showClearAll?: boolean;
  /** Vertical rule before the chevron (Figma-style trigger) */
  showSeparatorBeforeChevron?: boolean;
  /**
   * Element the dropdown is portaled into. Defaults to `document.body` so the
   * menu escapes `overflow` and `transform` ancestors (a Radix DialogContent is
   * both, and a transformed ancestor would clip a `position: fixed` menu).
   */
  menuContainer?: HTMLElement | null;
  /**
   * Truncate long labels in the dropdown list to a single line with an ellipsis
   * instead of wrapping them. Selected chips in the trigger always truncate —
   * this only controls the option rows.
   * @default false for `simple`, true for `detailed` (single-line row design)
   */
  truncateOptionText?: boolean;
}

/**
 * A multi-select component with tags, search, and validation states.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Skills"
 *   placeholder="Select skills"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'vue', label: 'Vue' },
 *     { value: 'angular', label: 'Angular' },
 *   ]}
 *   onValueChange={(values) => console.log(values)}
 * />
 * ```
 */
const MultiSelect = React.forwardRef(
  (
    {
      label,
      required,
      helperText,
      error,
      disabled,
      loading,
      onScrollEnd,
      hasMore = false,
      loadingMore = false,
      placeholder = "Select options",
      value,
      defaultValue = [],
      onValueChange,
      options,
      searchable,
      searchPlaceholder = "Search...",
      searchQuery: searchQueryProp,
      onSearchQueryChange,
      selectAllLabel,
      summaryLabel,
      maxSelections,
      showSelectionFooter = true,
      wrapperClassName,
      triggerClassName,
      labelClassName,
      state,
      id,
      name,
      optionVariant = "simple",
      separateSelectedWithDivider = false,
      showClearAll = true,
      menuContainer,
      truncateOptionText,
      showSeparatorBeforeChevron = false,
      closeOnEscape = false,
      maxVisible,
    }: MultiSelectProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    // Internal state for selected values (uncontrolled mode)
    const [internalValue, setInternalValue] =
      React.useState<string[]>(defaultValue);
    // Dropdown open state
    const [isOpen, setIsOpen] = React.useState(false);
    // Selecting moves no focus, so say what changed for assistive tech.
    const [announcement, setAnnouncement] = React.useState("");
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current =
            node;
        }
      },
      [ref]
    );
    /** Where focus lands once a keyboard-opened menu has been positioned (it is hidden until then). */
    const pendingFocusRef = React.useRef<"first" | "last" | "pointer" | null>(
      null
    );
    /** The row that had focus when it was toggled, so a re-sorted list can give it back. */
    const focusValueRef = React.useRef<string | null>(null);
    const typeaheadRef = React.useRef({ buffer: "", timer: 0 });
    // Search query — controlled when the caller passes `searchQuery` (server-side
    // filtering), uncontrolled otherwise.
    const [internalSearchQuery, setInternalSearchQuery] = React.useState("");
    const isSearchControlled = searchQueryProp !== undefined;
    const searchQuery = isSearchControlled
      ? searchQueryProp
      : internalSearchQuery;
    const updateSearchQuery = React.useCallback(
      (next: string) => {
        if (!isSearchControlled) {
          setInternalSearchQuery(next);
        }
        onSearchQueryChange?.(next);
      },
      [isSearchControlled, onSearchQueryChange]
    );

    // `detailed` rows are a single-line design, so they truncate unless the
    // caller opts out; `simple` rows wrap the full label unless asked not to.
    const truncateOptions = truncateOptionText ?? optionVariant === "detailed";

    // Container ref for click outside detection
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    /** Where the dropdown gets portaled; body unless the caller overrides. */
    const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
      null
    );

    React.useEffect(() => {
      if (!isOpen || typeof document === "undefined") return;
      setPortalTarget(menuContainer ?? document.body);
    }, [isOpen, menuContainer]);

    const { refs, floatingStyles, isPositioned, placement } = useFloating({
      open: isOpen,
      placement: "bottom-start",
      strategy: "fixed",
      transform: false,
      middleware: [
        offset(8),
        flip({ padding: 8 }),
        shift({ padding: 8 }),
        size({
          padding: 8,
          apply({ rects, elements, availableHeight, availableWidth }) {
            // Match the trigger, but never render an unreadably narrow menu on a
            // small trigger, and never spill past the viewport on a small screen.
            const width = Math.min(
              Math.max(rects.reference.width, MENU_MIN_WIDTH),
              availableWidth
            );
            elements.floating.style.width = `${width}px`;
            // Let the option list shrink instead of overflowing a short viewport.
            elements.floating.style.setProperty(
              "--multi-select-available-height",
              `${Math.max(availableHeight, MENU_MIN_HEIGHT)}px`
            );
          },
        }),
      ],
      whileElementsMounted: (reference, floating, update) =>
        autoUpdate(reference, floating, update, { animationFrame: true }),
    });

    const setAnchorRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        refs.setReference(node);
      },
      [refs]
    );

    /** The last mounted menu, kept so closing can hand a copy to the exit animation. */
    const menuNodeRef = React.useRef<HTMLDivElement | null>(null);
    const setDropdownRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (node) menuNodeRef.current = node;
        refs.setFloating(node);
      },
      [refs]
    );

    /**
     * Radix Dialog / Drawer wrap their content in `react-remove-scroll`, which
     * listens for `wheel` / `touchmove` on `document` (bubble phase) and calls
     * `preventDefault()` for anything outside the locked subtree — our
     * body-portaled menu counts as outside, so its list would not scroll.
     * Stopping propagation at the menu keeps that document listener from ever
     * seeing the event, leaving the browser's native scrolling intact.
     * Clicks are handled separately: the dialog sets `pointer-events: none` on
     * `<body>`, which the menu overrides with `pointer-events: auto`.
     */
    React.useEffect(() => {
      const node = refs.floating.current;
      if (!isOpen || !node) return;

      const stop = (event: Event) => event.stopPropagation();
      node.addEventListener("wheel", stop, { passive: false });
      node.addEventListener("touchmove", stop, { passive: false });

      /**
       * The dialog also traps focus. Radix `FocusScope` registers TWO bubble
       * listeners on `document` and either one is enough to make the search
       * input untypable:
       * - `focusin` — target outside the dialog, so focus is pulled back.
       * - `focusout` — fired on the element focus is LEAVING (inside the
       *     dialog) with `relatedTarget` = our input; since that is outside, it
       *     restores the previously focused element.
       * The `focusout` one never travels through the menu, so a listener on the
       * menu node cannot see it. Intercepting in the CAPTURE phase on
       * `document` does: capture at `document` runs before the bubble listeners
       * on the same node, so stopping propagation there means FocusScope never
       * runs — but only for focus events that involve the menu. Every other
       * focus event in the app is untouched.
       */
      const stopMenuFocusEvent = (event: Event) => {
        const { target, relatedTarget } = event as FocusEvent;
        const touchesMenu =
          (target instanceof Node && node.contains(target)) ||
          (relatedTarget instanceof Node && node.contains(relatedTarget));
        if (touchesMenu) event.stopPropagation();
      };
      document.addEventListener("focusin", stopMenuFocusEvent, true);
      document.addEventListener("focusout", stopMenuFocusEvent, true);

      return () => {
        node.removeEventListener("wheel", stop);
        node.removeEventListener("touchmove", stop);
        document.removeEventListener("focusin", stopMenuFocusEvent, true);
        document.removeEventListener("focusout", stopMenuFocusEvent, true);
      };
    }, [isOpen, portalTarget, refs.floating]);

    /** The scrollable option list; also read by the no-scrollbar fallback. */
    const listRef = React.useRef<HTMLDivElement | null>(null);
    /**
     * True once `onScrollEnd` has fired for the current visit to the bottom.
     * Cleared when the user scrolls back out of the threshold zone, or when a
     * landed page pushes the bottom back out of reach, so trackpad inertia —
     * which keeps firing `scroll` for hundreds of ms after the finger lifts —
     * cannot re-trigger the callback.
     */
    const isLatchedRef = React.useRef(false);
    /** Previous `loadingMore`, so the re-measure knows a page just landed. */
    const wasLoadingMoreRef = React.useRef(false);
    /** Pending `requestAnimationFrame` id for the coalesced scroll handler. */
    const scrollFrameRef = React.useRef<number | null>(null);
    /**
     * `onScrollEnd` read from a timer rather than from the closure, so an
     * inline arrow from the consumer cannot restart the post-fetch timer on
     * every render.
     */
    const onScrollEndRef = React.useRef(onScrollEnd);
    React.useEffect(() => {
      onScrollEndRef.current = onScrollEnd;
    }, [onScrollEnd]);

    /** Distance in px from the current scroll position to the list bottom. */
    const distanceToBottom = () => {
      const node = listRef.current;
      if (!node) return null;
      return node.scrollHeight - node.scrollTop - node.clientHeight;
    };

    /**
     * Deliberately a plain function, not a `useCallback` — it must read the
     * current `hasMore` / `loadingMore` on every scroll event, and a memoised
     * handler would need a props ref (writing refs during render is banned).
     */
    const maybeLoadMore = () => {
      const distance = distanceToBottom();
      if (distance === null) return;

      if (distance >= SCROLL_END_THRESHOLD_PX) {
        // Only an explicit scroll away from the boundary re-arms the latch.
        isLatchedRef.current = false;
        return;
      }
      if (isLatchedRef.current || !hasMore || loadingMore || !onScrollEnd)
        return;

      isLatchedRef.current = true;
      onScrollEnd();
    };

    /**
     * `scroll` fires far more often than the browser paints, so a fast flick
     * delivers a burst of events whose geometry is mid-flight. Coalescing to
     * one `requestAnimationFrame` per burst measures once per frame, after
     * layout has settled, and still sees the final resting position.
     */
    const handleListScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = null;
        maybeLoadMore();
      });
    };

    // A closed menu or a new search starts from a clean latch.
    React.useEffect(() => {
      isLatchedRef.current = false;
    }, [isOpen, searchQuery]);

    React.useEffect(
      () => () => {
        if (scrollFrameRef.current !== null) {
          cancelAnimationFrame(scrollFrameRef.current);
        }
      },
      []
    );

    /**
     * Re-measure once a page has landed. Content growth emits no `scroll`
     * event, so without this the latch set on the way down would never clear
     * and pagination would stall permanently after a fast flick to the bottom.
     * It also covers the case where the page does not make the list taller
     * than its max-height (few results, or a short viewport), where no further
     * `scroll` event would ever fire either.
     *
     * The latch is cleared only once the bottom is genuinely out of reach —
     * while the user is still pinned at distance ~0, it stays armed and the
     * next page is chained explicitly, so inertia cannot fan out into
     * duplicate requests.
     */
    React.useEffect(() => {
      const pageJustLanded = wasLoadingMoreRef.current && !loadingMore;
      wasLoadingMoreRef.current = loadingMore;
      if (!isOpen || loadingMore) return;

      const timeoutId = window.setTimeout(() => {
        const distance = distanceToBottom();
        if (distance === null) return;

        if (distance >= SCROLL_END_THRESHOLD_PX) {
          isLatchedRef.current = false;
          return;
        }
        if (!hasMore || !onScrollEndRef.current) return;
        // Still latched and nothing landed: the scroll handler's request is
        // in flight (or the consumer never set `loadingMore`) — don't refire.
        if (isLatchedRef.current && !pageJustLanded) return;

        isLatchedRef.current = true;
        onScrollEndRef.current();
      }, POST_FETCH_MEASURE_DELAY_MS);

      return () => window.clearTimeout(timeoutId);
    }, [isOpen, portalTarget, hasMore, loadingMore, options.length]);

    const flatOptions = React.useMemo(
      () => flattenMultiSelectOptions(options),
      [options]
    );

    // Determine if controlled
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : internalValue;

    // Select-all: values eligible for select-all exclude disabled options
    const selectableValues = React.useMemo(
      () => flatOptions.filter((o) => !o.disabled).map((o) => o.value),
      [flatOptions]
    );
    const allSelected =
      selectableValues.length > 0 &&
      selectableValues.every((v) => selectedValues.includes(v));
    const someSelected = selectedValues.length > 0 && !allSelected;

    const toggleSelectAll = () => {
      const newValues = allSelected
        ? []
        : maxSelections
          ? selectableValues.slice(0, maxSelections)
          : selectableValues;
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
      setAnnouncement(
        newValues.length === 0
          ? "Selection cleared."
          : `${newValues.length} selected.`
      );
    };

    // Derive state from props
    const derivedState = error ? "error" : (state ?? "default");

    // Generate unique IDs for accessibility
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const listboxId = `${selectId}-listbox`;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;

    // Filter options by search query. Skipped when `searchQuery` is
    // controlled — the caller owns filtering then (typically server-side, so
    // `options` is already the filtered slice for the current query).
    const filteredOptions = React.useMemo(() => {
      if (isSearchControlled) return flatOptions;
      if (!searchable || !searchQuery.trim()) return flatOptions;
      const q = searchQuery.toLowerCase();
      return flatOptions.filter((option) => {
        const secondary = option.secondaryText ?? "";
        return (
          option.label.toLowerCase().includes(q) ||
          secondary.toLowerCase().includes(q) ||
          (option.group?.toLowerCase().includes(q) ?? false)
        );
      });
    }, [flatOptions, searchable, searchQuery, isSearchControlled]);

    type DisplayItem =
      | { type: "option"; option: MultiSelectOption }
      | { type: "divider" }
      | { type: "header"; label: string };

    const hasGroupedOptions = flatOptions.some(
      (o) => o.group !== undefined && o.group !== ""
    );

    const displayItems = React.useMemo((): DisplayItem[] => {
      const filtered = filteredOptions;

      if (separateSelectedWithDivider) {
        const selected = filtered.filter((o) =>
          selectedValues.includes(o.value)
        );
        const unselected = filtered.filter(
          (o) => !selectedValues.includes(o.value)
        );
        const items: DisplayItem[] = selected.map((o) => ({
          type: "option",
          option: o,
        }));
        if (selected.length > 0 && unselected.length > 0) {
          items.push({ type: "divider" });
        }
        items.push(
          ...unselected.map((o) => ({ type: "option" as const, option: o }))
        );
        return items;
      }

      if (hasGroupedOptions) {
        const order: string[] = [];
        const byGroup = new Map<string, MultiSelectOption[]>();
        for (const o of filtered) {
          const g = o.group ?? "";
          if (!byGroup.has(g)) {
            byGroup.set(g, []);
            order.push(g);
          }
          byGroup.get(g)!.push(o);
        }
        const items: DisplayItem[] = [];
        for (const g of order) {
          if (items.length > 0) items.push({ type: "divider" });
          if (g) {
            items.push({ type: "header", label: g });
          }
          for (const o of byGroup.get(g)!) {
            items.push({ type: "option", option: o });
          }
        }
        return items;
      }

      return filtered.map((o) => ({ type: "option" as const, option: o }));
    }, [
      filteredOptions,
      hasGroupedOptions,
      separateSelectedWithDivider,
      selectedValues,
    ]);

    // Selected values paired with their labels. A value without a matching option
    // (not loaded yet) has nothing to show, and pairing keeps the rest aligned.
    const selectedChips = React.useMemo(
      () =>
        selectedValues.flatMap((v) => {
          const found = flatOptions.find((o) => o.value === v);
          return found ? [{ value: v, label: found.label }] : [];
        }),
      [selectedValues, flatOptions]
    );
    const selectedLabels = selectedChips.map((chip) => chip.label);
    const visibleCount =
      maxVisible !== undefined && maxVisible > 0 ? maxVisible : undefined;
    const shownChips = React.useMemo(
      () =>
        visibleCount ? selectedChips.slice(0, visibleCount) : selectedChips,
      [selectedChips, visibleCount]
    );
    const hiddenChips = visibleCount ? selectedChips.slice(visibleCount) : [];
    // Only the helper or error describes the field, exactly as in v1. The picks are
    // read as the trigger's own text (the sr-only list below), the way a select's value is.
    const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

    const commitValues = (newValues: string[]) => {
      if (!isControlled) {
        setInternalValue(newValues);
      }
      onValueChange?.(newValues);
    };

    // Handle toggle selection
    const toggleOption = (optionValue: string) => {
      const wasSelected = selectedValues.includes(optionValue);
      const newValues = wasSelected
        ? selectedValues.filter((v) => v !== optionValue)
        : maxSelections && selectedValues.length >= maxSelections
          ? selectedValues
          : [...selectedValues, optionValue];

      const menu = refs.floating.current;
      focusValueRef.current =
        menu && menu.contains(document.activeElement) ? optionValue : null;

      commitValues(newValues);
      if (newValues !== selectedValues) {
        const name =
          flatOptions.find((o) => o.value === optionValue)?.label ??
          optionValue;
        setAnnouncement(
          `${name} ${wasSelected ? "removed" : "selected"}. ${newValues.length} selected.`
        );
      }
    };

    const removeByValue = (valueToRemove: string) => {
      if (disabled || loading) return;
      const newValues = selectedValues.filter((v) => v !== valueToRemove);
      commitValues(newValues);
      const name =
        flatOptions.find((o) => o.value === valueToRemove)?.label ??
        valueToRemove;
      setAnnouncement(`${name} removed. ${newValues.length} selected.`);
    };

    // Handle remove tag
    const removeValue = (valueToRemove: string, e: React.MouseEvent) => {
      e.stopPropagation();
      removeByValue(valueToRemove);
    };

    // Handle clear all
    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled || loading) return;
      commitValues([]);
      setAnnouncement("Selection cleared.");
    };

    // A re-sorted list (selected rows first) moves DOM nodes, and a moved node loses
    // focus. Hand it back to the row that had it so the next arrow key still works.
    React.useLayoutEffect(() => {
      const wanted = focusValueRef.current;
      focusValueRef.current = null;
      const menu = refs.floating.current;
      if (
        !wanted ||
        !isOpen ||
        !menu ||
        menu.contains(document.activeElement)
      ) {
        return;
      }
      const row = Array.from(
        menu.querySelectorAll<HTMLElement>(ENABLED_OPTION_SELECTOR)
      ).find((node) => node.dataset.value === wanted);
      focusMenuTarget(row);
    }, [selectedValues, isOpen, refs.floating]);

    // The chips that leave get a hollow copy that closes its width, so neighbours
    // slide over instead of jumping. Widths are read after every render because the
    // chip is already gone by the time anyone asks.
    const [ghosts, setGhosts] = React.useState<ChipGhostData[]>([]);
    const ghostIdRef = React.useRef(0);
    const chipElsRef = React.useRef(new Map<string, HTMLElement>());
    const chipMetaRef = React.useRef(
      new Map<string, { label: string; width: number; index: number }>()
    );
    const dropGhost = React.useCallback(
      (id: number) =>
        setGhosts((current) => current.filter((ghost) => ghost.id !== id)),
      []
    );
    React.useLayoutEffect(() => {
      const previous = chipMetaRef.current;
      const next = new Map<
        string,
        { label: string; width: number; index: number }
      >();
      if (!summaryLabel) {
        shownChips.forEach((chip, index) => {
          next.set(chip.value, {
            label: chip.label,
            width:
              chipElsRef.current.get(chip.value)?.getBoundingClientRect()
                .width ?? 0,
            index,
          });
        });
      }
      chipMetaRef.current = next;
      if (prefersReducedMotion()) return;
      const leaving: ChipGhostData[] = [];
      previous.forEach((meta, chipValue) => {
        // Only a chip that was on screen and is really gone gets a ghost.
        if (next.has(chipValue) || selectedValues.includes(chipValue)) return;
        if (meta.width === 0) return;
        leaving.push({ id: ++ghostIdRef.current, ...meta });
      });
      if (leaving.length > 0) setGhosts((current) => [...current, ...leaving]);
    }, [shownChips, selectedValues, summaryLabel]);

    const openMenu = (where: "first" | "last" | "pointer") => {
      if (disabled || loading) return;
      pendingFocusRef.current = where;
      setIsOpen(true);
    };

    const closeMenu = React.useCallback(
      (restoreFocus: boolean) => {
        setIsOpen(false);
        updateSearchQuery("");
        if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
      },
      [updateSearchQuery]
    );

    const focusMenu = (where: "first" | "last" | "pointer") => {
      const menu = refs.floating.current;
      if (menu) focusInMenu(menu, where);
    };

    // The menu is hidden until floating-ui has placed it, and a hidden element
    // cannot take focus, so the move waits for the first positioned render.
    React.useEffect(() => {
      const menu = refs.floating.current;
      if (!isOpen || !isPositioned || !menu) return;
      const where = pendingFocusRef.current;
      if (where === null) return;
      pendingFocusRef.current = null;
      focusInMenu(menu, where);
    }, [isOpen, isPositioned, refs.floating]);

    // Escape closes the list whenever focus is inside it (or on the trigger with
    // `closeOnEscape`). It listens on window, in the capture phase: a surrounding
    // Radix dialog listens on document, and would otherwise close with the menu.
    React.useEffect(() => {
      if (!isOpen) return;
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key !== "Escape") return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        const inMenu = Boolean(refs.floating.current?.contains(target));
        const onTrigger = triggerRef.current === target;
        if (!inMenu && !(onTrigger && closeOnEscape)) return;
        event.stopPropagation();
        closeMenu(inMenu);
      };
      window.addEventListener("keydown", handleEscape, true);
      return () => window.removeEventListener("keydown", handleEscape, true);
    }, [isOpen, closeOnEscape, closeMenu, refs.floating]);

    // Closing unmounts the menu at once, so a copy of it leaves instead: it fades
    // and drifts back toward the trigger, then removes itself. Skipped without the
    // Web Animations API or under reduced motion.
    React.useEffect(() => {
      if (isOpen) return;
      const node = menuNodeRef.current;
      if (!node) return;
      menuNodeRef.current = null;
      const host = portalTarget;
      if (
        !host ||
        typeof node.animate !== "function" ||
        prefersReducedMotion()
      ) {
        return;
      }
      const ghost = node.cloneNode(true) as HTMLElement;
      ghost.removeAttribute("id");
      ghost.removeAttribute("role");
      ghost.removeAttribute("aria-multiselectable");
      ghost.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      ghost.setAttribute("aria-hidden", "true");
      ghost.setAttribute("inert", "");
      // `!important`: the panel's own entry animation is declared that way, and
      // replaying it on the copy would fade it in instead of out.
      ghost.style.setProperty("animation", "none", "important");
      ghost.style.pointerEvents = "none";
      const side = node.dataset.side;
      const drift =
        side === "top"
          ? "translateY(4px)"
          : side === "left"
            ? "translateX(4px)"
            : side === "right"
              ? "translateX(-4px)"
              : "translateY(-4px)";
      host.appendChild(ghost);
      const remove = () => ghost.remove();
      const animation = ghost.animate(
        [
          { opacity: 1, transform: "none" },
          { opacity: 0, transform: `${drift} scale(0.98)` },
        ],
        {
          // Ease-in: an exit should linger a moment, then go, rather than vanish up front.
          duration: 140,
          easing: "cubic-bezier(0.4, 0, 1, 1)",
          fill: "forwards",
        }
      );
      animation.onfinish = remove;
      animation.oncancel = remove;
      window.setTimeout(remove, 400);
    }, [isOpen, portalTarget]);

    // Close dropdown when clicking outside (defer so opening click does not close immediately)
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
          containerRef.current?.contains(target) ||
          refs.floating.current?.contains(target)
        ) {
          return;
        }
        setIsOpen(false);
        updateSearchQuery("");
      };

      const timeoutId = window.setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, refs.floating, updateSearchQuery]);

    // Trigger keys: ArrowDown / ArrowUp open the list and move into it, Enter and
    // Space toggle it, Backspace / Delete drop the last pick (as a tag field does).
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || loading || e.target !== e.currentTarget) return;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowUp": {
          e.preventDefault();
          const where = e.key === "ArrowDown" ? "first" : "last";
          if (isOpen) focusMenu(where);
          else openMenu(where);
          break;
        }
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen) closeMenu(false);
          else openMenu("first");
          break;
        case "Backspace":
        case "Delete": {
          const last = selectedValues[selectedValues.length - 1];
          if (last === undefined) break;
          e.preventDefault();
          removeByValue(last);
          break;
        }
      }
    };

    const handleTriggerClick = () => {
      if (disabled || loading) return;
      if (isOpen) setIsOpen(false);
      else openMenu("pointer");
    };

    // Keys once focus is inside the menu. Rows are roving stops (tabIndex -1): arrows
    // walk the search field and the enabled rows, Tab closes and moves on from the
    // trigger, and typing jumps to a row (or into the search field).
    const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const menu = e.currentTarget;
      const target = e.target as HTMLElement;
      const inSearch = target.hasAttribute("data-multi-select-search");

      if (e.key === "Tab") {
        // Stop it reaching a surrounding focus trap, then let the browser's own Tab
        // run from the trigger so focus carries on to the next field.
        e.stopPropagation();
        closeMenu(true);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        typeaheadRef.current.buffer = "";
        const targets = menuFocusTargets(menu);
        if (targets.length === 0) return;
        const step = e.key === "ArrowDown" ? 1 : -1;
        const index = targets.indexOf(target);
        const next =
          index === -1
            ? step > 0
              ? 0
              : targets.length - 1
            : (index + step + targets.length) % targets.length;
        focusMenuTarget(targets[next]);
        return;
      }
      if (inSearch) return;
      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        e.stopPropagation();
        typeaheadRef.current.buffer = "";
        const rows = menuFocusTargets(menu).filter(
          (node) => !node.hasAttribute("data-multi-select-search")
        );
        focusMenuTarget(e.key === "Home" ? rows[0] : rows[rows.length - 1]);
        return;
      }
      if (e.key.length !== 1 || e.key === " " || e.ctrlKey || e.metaKey) return;
      const search = menu.querySelector<HTMLElement>(
        "[data-multi-select-search]"
      );
      if (search) {
        // The keystroke follows focus, so it lands in the field as typed.
        search.focus({ preventScroll: true });
        return;
      }
      // No search field: jump to the next row that starts with what was typed.
      const typeahead = typeaheadRef.current;
      window.clearTimeout(typeahead.timer);
      typeahead.buffer += e.key.toLowerCase();
      typeahead.timer = window.setTimeout(() => {
        typeahead.buffer = "";
      }, 500);
      const rows = menuFocusTargets(menu);
      const from = Math.max(rows.indexOf(target), 0);
      const ordered = [...rows.slice(from + 1), ...rows.slice(0, from + 1)];
      const match = ordered.find((row) =>
        (row.textContent ?? "")
          .trim()
          .toLowerCase()
          .startsWith(typeahead.buffer)
      );
      if (match) {
        e.preventDefault();
        focusMenuTarget(match);
      }
    };

    /** Live chips, with a ghost of each removed one held in the slot it left. */
    const renderChips = () => {
      const nodes: React.ReactNode[] = shownChips.map((chip) => (
        <span
          key={chip.value}
          ref={(node) => {
            if (node) chipElsRef.current.set(chip.value, node);
            else chipElsRef.current.delete(chip.value);
          }}
          // Keyed chips stay mounted across renders, so only a newly added chip plays
          // its entry (Arc: grows in from .9 through a soft blur); existing ones do
          // not re-animate.
          className={cn(
            CHIP_BASE_CLASSNAME,
            CHIP_ENTER_CLASSNAME,
            visibleCount && "shrink"
          )}
        >
          <span
            className="min-w-0 truncate"
            title={typeof chip.label === "string" ? chip.label : undefined}
          >
            {chip.label}
          </span>
          <span
            // Pointer-only: Backspace on the trigger and the rows in the list cover
            // the keyboard, and a button inside the trigger button cannot be reached.
            role="button"
            tabIndex={-1}
            aria-disabled={disabled || loading || undefined}
            onClick={(e) => removeValue(chip.value, e)}
            className={cn(
              CHIP_REMOVE_CLASSNAME,
              !(disabled || loading) &&
                "[@media(hover:hover)]:hover:bg-v2-semantic-bg-grey"
            )}
            aria-label={`Remove ${chip.label}`}
          >
            <X className="size-3" />
          </span>
        </span>
      ));
      [...ghosts]
        .sort((a, b) => a.index - b.index)
        .forEach((ghost) => {
          nodes.splice(
            Math.min(ghost.index, nodes.length),
            0,
            <ChipGhost
              key={`ghost-${ghost.id}`}
              ghost={ghost}
              onDone={dropGhost}
            />
          );
        });
      return nodes;
    };

    return (
      <div
        ref={containerRef}
        className={cn(
          "font-[family-name:var(--font-v2,Inter,sans-serif)] flex min-w-0 flex-col gap-2",
          wrapperClassName
        )}
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "font-[family-name:var(--font-v2,Inter,sans-serif)] leading-[1.4] tracking-[-0.16px] break-words text-sm font-medium text-[var(--v2-text-primary,#484848)]",
              labelClassName
            )}
          >
            {label}
            {required && (
              <span className="text-v2-semantic-error-primary ml-0.5">*</span>
            )}
          </label>
        )}

        {/* Anchor for floating menu (portaled to body to escape overflow:hidden scroll areas). */}
        <div
          ref={setAnchorRef}
          className="relative w-full min-w-0 flex flex-col gap-2"
        >
          {/* Trigger. The clear button sits beside it, not inside: a button in a button
              cannot be reached by keyboard or assistive tech. */}
          <div className="relative w-full min-w-0">
            <button
              ref={setTriggerRef}
              id={selectId}
              type="button"
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-controls={listboxId}
              aria-invalid={!!error}
              aria-describedby={ariaDescribedBy}
              disabled={disabled || loading}
              onClick={handleTriggerClick}
              onKeyDown={handleKeyDown}
              // Space activates a button on keyup, and some browsers ignore a keydown
              // preventDefault: without this the list would open and shut in one press.
              onKeyUp={(e) => {
                if (e.key === " " && e.target === e.currentTarget) {
                  e.preventDefault();
                }
              }}
              className={cn(
                multiSelectTriggerVariants({ state: derivedState }),
                "text-left gap-2",
                triggerClassName
              )}
            >
              {selectedChips.length > 0 && (
                <span className="sr-only">
                  Selected: {selectedLabels.join(", ")}
                </span>
              )}
              <div
                // Chips are for the eye; the sr-only list above says the same in words.
                aria-hidden={
                  selectedChips.length > 0 && !summaryLabel ? true : undefined
                }
                className={cn(
                  "min-w-0 flex-1 flex items-center gap-x-[5px] gap-y-1 min-h-[26px]",
                  // A chip cap keeps one line: chips shrink and truncate instead of wrapping.
                  visibleCount ? "flex-nowrap overflow-hidden" : "flex-wrap"
                )}
              >
                {selectedChips.length === 0 ? (
                  ghosts.length === 0 && (
                    <span className="text-sm text-[var(--v2-text-placeholder,#707070)]">
                      {placeholder}
                    </span>
                  )
                ) : summaryLabel ? (
                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="min-w-0 truncate text-sm text-[var(--v2-text-primary,#484848)]">
                          {summaryLabel(selectedValues.length)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-0.5">
                          {selectedChips.map((chip) => (
                            <span key={chip.value}>{chip.label}</span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
                {!summaryLabel && (
                  <TooltipProvider delayDuration={200}>
                    {renderChips()}
                    {hiddenChips.length > 0 && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span
                            data-overflow-count=""
                            className={cn(
                              CHIP_BASE_CLASSNAME,
                              "shrink-0 gap-0 tabular-nums"
                            )}
                          >
                            +<OverflowCount value={hiddenChips.length} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="flex flex-col gap-0.5">
                            {hiddenChips.map((chip) => (
                              <span key={chip.value}>{chip.label}</span>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {showClearAll && selectedValues.length > 0 && (
                  // Holds the room the clear button (outside the trigger) sits in.
                  <span aria-hidden="true" className="w-[22px] shrink-0" />
                )}
                {showSeparatorBeforeChevron && (
                  <div
                    className="w-px h-5 self-center border-l border-solid border-v2-semantic-border-layout shrink-0"
                    aria-hidden
                  />
                )}
                {loading ? (
                  <Loader2 className="size-4 animate-spin motion-reduce:[animation-duration:2s] text-[var(--v2-text-muted,#707070)]" />
                ) : (
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-[var(--v2-text-muted,#707070)]",
                      chevronSpringClassName,
                      isOpen && "rotate-180"
                    )}
                  />
                )}
              </div>
            </button>
            {showClearAll && selectedValues.length > 0 && (
              <button
                type="button"
                aria-label="Clear all"
                aria-disabled={disabled || loading || undefined}
                tabIndex={disabled || loading ? -1 : 0}
                onClick={clearAll}
                // Arc: a 22px plate around a 14px icon. It pops in from .6 scale
                // through a 2px blur and dips to .96 while pressed. Icon colour
                // comes from the button so hover can darken it. It sits 36px from
                // the edge (11px padding + 1px border + 16px chevron + 8px gap),
                // 45px with the separator.
                className={cn(
                  "absolute top-1/2 inline-flex size-[22px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-[var(--v2-text-muted,#707070)] [transition:opacity_160ms_cubic-bezier(0.16,1,0.3,1),transform_260ms_cubic-bezier(0.16,1,0.3,1),filter_160ms_cubic-bezier(0.16,1,0.3,1),background-color_160ms_cubic-bezier(0.22,1,0.36,1),color_160ms_cubic-bezier(0.22,1,0.36,1)] [@starting-style]:scale-[0.6] [@starting-style]:opacity-0 [@starting-style]:blur-[2px] motion-reduce:[@starting-style]:scale-100 motion-reduce:[@starting-style]:blur-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-v2-semantic-border-accent",
                  showSeparatorBeforeChevron ? "right-[45px]" : "right-9",
                  !(disabled || loading) &&
                    "[@media(hover:hover)]:hover:bg-v2-semantic-bg-ui [@media(hover:hover)]:hover:text-[var(--v2-text-primary,#484848)] active:scale-[0.96] motion-reduce:active:scale-100"
                )}
              >
                <X className="size-3.5 [stroke-width:1.75]" />
              </button>
            )}
          </div>

          {/* Helper / error sits between trigger and dropdown (normal flow), matching Figma.
              Always mounted so the row can open and close its height; the -mt-2 cancels the
              column gap while it is empty. */}
          <div
            data-field-feedback=""
            className={cn(
              "grid [transition:grid-template-rows_220ms_cubic-bezier(0.22,1,0.36,1),margin-top_220ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              error || helperText ? "grid-rows-[1fr]" : "-mt-2 grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              {(error || helperText) && (
                <div className="flex justify-between items-start gap-2">
                  {error ? (
                    <div
                      id={errorId}
                      role="alert"
                      className="flex items-center gap-1.5 min-w-0 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-0.5 [animation-duration:150ms] ease-out motion-reduce:animate-[v2-fade-in_150ms_ease-out]"
                    >
                      <CircleAlert
                        className="size-3.5 shrink-0 text-v2-semantic-error-primary"
                        aria-hidden
                      />
                      <span className="min-w-0 break-words text-xs leading-[1.4] text-v2-semantic-error-text">
                        {error}
                      </span>
                    </div>
                  ) : helperText ? (
                    <span
                      id={helperId}
                      className="min-w-0 break-words text-xs leading-[1.4] text-[var(--v2-text-muted,#707070)]"
                    >
                      {helperText}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {isOpen &&
            portalTarget &&
            createPortal(
              <TooltipProvider delayDuration={200}>
                <div
                  ref={setDropdownRef}
                  id={listboxId}
                  role="listbox"
                  aria-label={label || placeholder}
                  aria-multiselectable="true"
                  data-side={placement.split("-")[0]}
                  data-align={placement.split("-")[1] ?? "center"}
                  className="rounded-lg bg-v2-semantic-bg-primary border border-solid border-v2-semantic-border-layout shadow-[var(--v2-shadow-popover,0_20px_48px_rgba(0,0,0,0.105),0_3px_10px_rgba(0,0,0,0.045))] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-[0.97] data-[side=bottom]:slide-in-from-top-[6px] data-[side=top]:slide-in-from-bottom-[6px] data-[side=left]:slide-in-from-right-[6px] data-[side=right]:slide-in-from-left-[6px] motion-safe:[animation-duration:260ms] [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-[v2-fade-in_120ms_ease-out]"
                  style={{
                    ...floatingStyles,
                    transformOrigin: panelTransformOrigin(placement),
                    zIndex: 10050,
                    // Radix Dialog sets `pointer-events: none` on <body> while
                    // open; without this the menu swallows nothing and clicks die.
                    pointerEvents: "auto",
                    visibility: isPositioned ? undefined : "hidden",
                  }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={handleMenuKeyDown}
                >
                  {/* Search input */}
                  {searchable && (
                    <div className="border-b border-solid border-v2-semantic-border-layout p-2">
                      <div className="flex h-11 items-center gap-2 rounded-lg border border-solid border-v2-semantic-border-input bg-v2-semantic-bg-primary px-3 focus-within:border-[var(--v2-semantic-border-focus,var(--semantic-primary))]">
                        <Search
                          aria-hidden="true"
                          className="size-4 shrink-0 text-[var(--v2-text-muted,#707070)]"
                        />
                        <input
                          type="text"
                          data-multi-select-search=""
                          placeholder={searchPlaceholder}
                          aria-label={searchPlaceholder}
                          value={searchQuery}
                          onChange={(event) =>
                            updateSearchQuery(event.target.value)
                          }
                          className="h-full min-w-0 w-full border-0 bg-transparent p-0 text-sm leading-[1.4] text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)] focus:outline-none focus:shadow-none"
                          onClick={(event) => event.stopPropagation()}
                        />
                      </div>
                    </div>
                  )}

                  {/* Select all */}
                  {selectAllLabel && (
                    <div
                      role="option"
                      aria-selected={allSelected}
                      tabIndex={-1}
                      onClick={toggleSelectAll}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSelectAll();
                        }
                      }}
                      className="flex w-full cursor-pointer select-none items-center gap-2 border-b border-solid border-v2-semantic-border-layout px-3 py-2 text-sm text-[var(--v2-text-secondary,#5E5E5E)] outline-none hover:bg-v2-semantic-bg-ui focus-visible:bg-v2-semantic-bg-ui focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-v2-semantic-border-accent"
                    >
                      <Checkbox
                        checked={
                          allSelected
                            ? true
                            : someSelected
                              ? "indeterminate"
                              : false
                        }
                        size="sm"
                        className="pointer-events-none shrink-0"
                        aria-hidden
                        tabIndex={-1}
                      />
                      <span className="min-w-0 flex-1 truncate text-left">
                        {selectAllLabel}
                      </span>
                    </div>
                  )}

                  {/* Options */}
                  <div
                    ref={listRef}
                    onScroll={handleListScroll}
                    className="overflow-auto overscroll-contain p-[5px]"
                    style={{
                      maxHeight:
                        "min(15rem, var(--multi-select-available-height, 15rem))",
                    }}
                  >
                    {filteredOptions.length === 0 && !loadingMore ? (
                      <div className="py-6 text-center text-sm text-[var(--v2-text-muted,#707070)]">
                        No results found
                      </div>
                    ) : (
                      displayItems.map((item, itemIndex) => {
                        if (item.type === "divider") {
                          return (
                            <div
                              key={`divider-${itemIndex}`}
                              role="separator"
                              className="my-1 h-px bg-v2-semantic-border-layout"
                            />
                          );
                        }
                        if (item.type === "header") {
                          return (
                            <div
                              key={`header-${item.label}-${itemIndex}`}
                              className="px-[11px] pb-1.5 pt-2.5 text-xs font-semibold leading-4 text-[var(--v2-text-muted,#707070)]"
                            >
                              {item.label}
                            </div>
                          );
                        }

                        const option = item.option;
                        const isSelected = selectedValues.includes(
                          option.value
                        );
                        const isMaxedOut =
                          !isSelected &&
                          maxSelections !== undefined &&
                          maxSelections > 0 &&
                          selectedValues.length >= maxSelections;
                        const isDisabled =
                          Boolean(option.disabled) || isMaxedOut;
                        const secondaryLine =
                          option.secondaryText ?? option.caption;

                        const rowClass = cn(
                          // Rows are real Tab stops, so the focus-visible pseudo-class separates a keyboard
                          // highlight (ring) from a mouse hover (fill only). 4px radius = panel
                          // 8px minus its 4px list padding. Arc: 38px rows whose highlight follows
                          // quickly (80ms) and whose selection shows as the check, never as weight.
                          "relative flex min-h-[38px] w-full min-w-0 cursor-pointer select-none items-center rounded-sm text-left leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] outline-none transition-[background-color,color] [transition-duration:80ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-v2-semantic-border-accent",
                          optionVariant === "detailed"
                            ? "gap-2 px-2 py-2 text-sm"
                            : "gap-3 px-[11px] py-2 text-sm",
                          isSelected && "text-[var(--v2-text-primary,#484848)]",
                          "hover:bg-v2-semantic-bg-ui focus:bg-v2-semantic-bg-ui",
                          isDisabled && "opacity-50 cursor-not-allowed",
                          option.isDeleted && "line-through opacity-70"
                        );

                        const simpleRow = (
                          <button
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            data-value={option.value}
                            tabIndex={-1}
                            disabled={isDisabled}
                            onClick={() =>
                              !isDisabled && toggleOption(option.value)
                            }
                            className={rowClass}
                          >
                            <span
                              title={
                                truncateOptions &&
                                typeof option.label === "string"
                                  ? option.label
                                  : undefined
                              }
                              className={cn(
                                "min-w-0 flex-1 text-left",
                                truncateOptions
                                  ? "truncate"
                                  : "whitespace-normal break-words"
                              )}
                            >
                              {option.label}
                            </span>
                            {isSelected && <RowCheck />}
                          </button>
                        );

                        const detailedRow = (
                          <div
                            role="option"
                            tabIndex={-1}
                            data-value={option.value}
                            aria-selected={isSelected}
                            aria-disabled={isDisabled}
                            data-disabled={isDisabled ? "" : undefined}
                            onClick={() =>
                              !isDisabled && toggleOption(option.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                if (!isDisabled) toggleOption(option.value);
                              }
                            }}
                            className={rowClass}
                          >
                            <Checkbox
                              checked={isSelected}
                              disabled={isDisabled}
                              size="sm"
                              className="pointer-events-none shrink-0"
                              aria-hidden
                              tabIndex={-1}
                            />
                            <span
                              title={
                                typeof option.label === "string"
                                  ? option.label
                                  : undefined
                              }
                              className={cn(
                                "min-w-0 flex-1 text-left",
                                truncateOptions
                                  ? "truncate"
                                  : "whitespace-normal break-words"
                              )}
                            >
                              {option.label}
                            </span>
                            {secondaryLine ? (
                              <span className="shrink-0 max-w-[55%] truncate text-right text-sm text-[var(--v2-text-muted,#707070)]">
                                {secondaryLine}
                              </span>
                            ) : null}
                          </div>
                        );

                        const overlayCopy =
                          option.disabledTooltip ?? option.overlayMsg;

                        const withDisabledTooltip = (
                          node: React.ReactElement
                        ) =>
                          isDisabled && overlayCopy ? (
                            <Tooltip key={option.value}>
                              <TooltipTrigger asChild>
                                <span className="block w-full cursor-default">
                                  {node}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="max-w-sm bg-v2-semantic-primary text-v2-semantic-text-inverted border-v2-semantic-primary border-solid"
                              >
                                {overlayCopy}
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <React.Fragment key={option.value}>
                              {node}
                            </React.Fragment>
                          );

                        if (optionVariant === "detailed") {
                          return withDisabledTooltip(detailedRow);
                        }

                        return withDisabledTooltip(simpleRow);
                      })
                    )}

                    {loadingMore ? (
                      <div
                        role="status"
                        aria-live="polite"
                        className="flex items-center justify-center gap-2 py-3 text-sm text-[var(--v2-text-muted,#707070)]"
                      >
                        <Loader2 className="size-4 animate-spin motion-reduce:[animation-duration:2s]" />
                        <span>Loading more...</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Footer with count */}
                  {maxSelections && showSelectionFooter ? (
                    <div className="p-2 border-t border-solid border-v2-semantic-border-layout text-sm text-[var(--v2-text-muted,#707070)]">
                      {selectedValues.length} / {maxSelections} selected
                    </div>
                  ) : null}
                </div>
              </TooltipProvider>,
              portalTarget
            )}
        </div>

        {/* Says what a selection did; selecting moves no focus. */}
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          {announcement}
        </span>

        {/* Hidden input for form submission */}
        {name &&
          selectedValues.map((v) => (
            <input key={v} type="hidden" name={name} value={v} />
          ))}
      </div>
    );
  }
);
MultiSelect.displayName = "MultiSelect";

export { MultiSelect, multiSelectTriggerVariants };
