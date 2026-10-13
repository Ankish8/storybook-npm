import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  type HTMLMotionProps,
} from "motion/react";
import { createPortal } from "react-dom";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Search } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

import { cn } from "@/lib/utils";

export interface PhoneInputCountry {
  /** ISO 3166-1 alpha-2 country code. */
  iso: string;
  name: string;
  /** Calling code including the + prefix. */
  dialCode: string;
}

/** A small, editable country list, not a number-validation database. */
export const PHONE_INPUT_COUNTRIES: readonly PhoneInputCountry[] = [
  { iso: "AR", name: "Argentina", dialCode: "+54" },
  { iso: "AU", name: "Australia", dialCode: "+61" },
  { iso: "AT", name: "Austria", dialCode: "+43" },
  { iso: "BE", name: "Belgium", dialCode: "+32" },
  { iso: "BR", name: "Brazil", dialCode: "+55" },
  { iso: "CA", name: "Canada", dialCode: "+1" },
  { iso: "CL", name: "Chile", dialCode: "+56" },
  { iso: "CN", name: "China", dialCode: "+86" },
  { iso: "CO", name: "Colombia", dialCode: "+57" },
  { iso: "CZ", name: "Czechia", dialCode: "+420" },
  { iso: "DK", name: "Denmark", dialCode: "+45" },
  { iso: "EG", name: "Egypt", dialCode: "+20" },
  { iso: "FI", name: "Finland", dialCode: "+358" },
  { iso: "FR", name: "France", dialCode: "+33" },
  { iso: "DE", name: "Germany", dialCode: "+49" },
  { iso: "GR", name: "Greece", dialCode: "+30" },
  { iso: "HK", name: "Hong Kong", dialCode: "+852" },
  { iso: "IN", name: "India", dialCode: "+91" },
  { iso: "ID", name: "Indonesia", dialCode: "+62" },
  { iso: "IE", name: "Ireland", dialCode: "+353" },
  { iso: "IL", name: "Israel", dialCode: "+972" },
  { iso: "IT", name: "Italy", dialCode: "+39" },
  { iso: "JP", name: "Japan", dialCode: "+81" },
  { iso: "KE", name: "Kenya", dialCode: "+254" },
  { iso: "MX", name: "Mexico", dialCode: "+52" },
  { iso: "NL", name: "Netherlands", dialCode: "+31" },
  { iso: "NZ", name: "New Zealand", dialCode: "+64" },
  { iso: "NG", name: "Nigeria", dialCode: "+234" },
  { iso: "NO", name: "Norway", dialCode: "+47" },
  { iso: "PK", name: "Pakistan", dialCode: "+92" },
  { iso: "PE", name: "Peru", dialCode: "+51" },
  { iso: "PH", name: "Philippines", dialCode: "+63" },
  { iso: "PL", name: "Poland", dialCode: "+48" },
  { iso: "PT", name: "Portugal", dialCode: "+351" },
  { iso: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { iso: "SG", name: "Singapore", dialCode: "+65" },
  { iso: "ZA", name: "South Africa", dialCode: "+27" },
  { iso: "KR", name: "South Korea", dialCode: "+82" },
  { iso: "ES", name: "Spain", dialCode: "+34" },
  { iso: "SE", name: "Sweden", dialCode: "+46" },
  { iso: "CH", name: "Switzerland", dialCode: "+41" },
  { iso: "TW", name: "Taiwan", dialCode: "+886" },
  { iso: "TH", name: "Thailand", dialCode: "+66" },
  { iso: "TR", name: "Turkey", dialCode: "+90" },
  { iso: "UA", name: "Ukraine", dialCode: "+380" },
  { iso: "AE", name: "United Arab Emirates", dialCode: "+971" },
  { iso: "GB", name: "United Kingdom", dialCode: "+44" },
  { iso: "US", name: "United States", dialCode: "+1" },
  { iso: "VN", name: "Vietnam", dialCode: "+84" },
];

const DEFAULT_PREFERRED_COUNTRIES = ["IN", "US", "GB"] as const;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const reducedMotionServerSnapshot = () => true;
function reducedMotionSnapshot() {
  return Boolean(
    typeof window !== "undefined" &&
    window.matchMedia?.(reducedMotionQuery).matches
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

function PickerSurface({
  panelRef,
  ...props
}: HTMLMotionProps<"div"> & {
  panelRef: (node: HTMLDivElement | null) => void;
}) {
  const present = useIsPresent();
  const node = React.useRef<HTMLDivElement | null>(null);
  React.useLayoutEffect(() => {
    node.current?.toggleAttribute("inert", !present);
  }, [present]);
  return (
    <motion.div
      {...props}
      ref={(element) => {
        node.current = element;
        panelRef(element);
      }}
      style={{
        ...props.style,
        pointerEvents: present
          ? (props.style?.pointerEvents ?? "auto")
          : "none",
      }}
      aria-hidden={!present ? true : undefined}
    />
  );
}

function PhoneCountrySelector({
  countryIso,
  countryCode,
  countryFlag,
  showChevron,
  countries,
  preferredCountries,
  disabled,
  onCountryClick,
  onPick,
  inputRef,
}: {
  countryIso: string;
  countryCode: string;
  countryFlag?: React.ReactNode;
  showChevron: boolean;
  countries: readonly PhoneInputCountry[];
  preferredCountries: readonly string[];
  disabled?: boolean;
  onCountryClick?: () => void;
  onPick: (country: PhoneInputCountry) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIso, setActiveIso] = React.useState(countryIso);
  const [direction, setDirection] = React.useState(1);
  const trigger = React.useRef<HTMLButtonElement | null>(null);
  const search = React.useRef<HTMLInputElement>(null);
  const keyboardOpen = React.useRef(false);
  const scroller = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLDivElement>(null);
  const scrolling = React.useRef(false);
  const scrollEnd = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const pointer = React.useRef<{ x: number; y: number } | null>(null);
  const revealActive = React.useRef(false);
  const highlightTarget = React.useRef(0);
  const highlightAnimation = React.useRef<ReturnType<typeof animate> | null>(
    null
  );
  const highlightY = useMotionValue(0);
  const highlightHeight = useMotionValue(36);
  const id = React.useId();
  const reduced = useLiveReducedMotion();
  const ordered = React.useMemo(() => {
    const unique = Array.from(
      new Map(countries.map((country) => [country.iso, country])).values()
    );
    const preferred = preferredCountries.flatMap((iso) =>
      unique.filter((country) => country.iso === iso)
    );
    return [
      ...preferred,
      ...unique
        .filter((country) => !preferredCountries.includes(country.iso))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, [countries, preferredCountries]);
  function matches(country: PhoneInputCountry, value: string) {
    return `${country.name} ${country.iso} ${country.dialCode}`
      .toLocaleLowerCase()
      .includes(value.trim().toLocaleLowerCase());
  }
  const results = ordered.filter((country) => matches(country, query));
  const active =
    results.find((country) => country.iso === activeIso) ?? results[0];
  const current = countries.find((country) => country.iso === countryIso);
  const {
    refs: { floating: floatingRef, setReference, setFloating },
    floatingStyles,
    isPositioned,
  } = useFloating<HTMLButtonElement>({
    open: open && !disabled,
    placement: "bottom-start",
    strategy: "fixed",
    transform: false,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(({ placement, rects }) => ({
        mainAxis: placement.startsWith("top") ? 8 : -rects.reference.height - 3,
        crossAxis: -3,
      })),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      size({
        padding: 12,
        apply({ availableHeight, availableWidth, elements }) {
          const fieldWidth =
            elements.reference instanceof HTMLElement
              ? (elements.reference.parentElement?.getBoundingClientRect()
                  .width ?? 320)
              : 320;
          elements.floating.style.setProperty(
            "--phone-picker-width",
            `${Math.max(1, Math.min(340, fieldWidth, availableWidth))}px`
          );
          elements.floating.style.setProperty(
            "--phone-picker-height",
            `${Math.max(44, Math.min(340, availableHeight))}px`
          );
        },
      }),
    ],
  });

  function close(focus: "trigger" | "input" | "none" = "none") {
    setOpen(false);
    setQuery("");
    if (focus === "trigger") trigger.current?.focus({ preventScroll: true });
    if (focus === "input") inputRef.current?.focus({ preventScroll: true });
  }
  function show(initialQuery = "", last = false, fromKeyboard = false) {
    if (disabled) return;
    keyboardOpen.current = fromKeyboard;
    revealActive.current = true;
    pointer.current = null;
    setQuery(initialQuery);
    const filtered = ordered.filter((country) =>
      matches(country, initialQuery)
    );
    setActiveIso(
      (last
        ? filtered.at(-1)
        : (filtered.find((country) => country.iso === countryIso) ??
          filtered[0])
      )?.iso ?? ""
    );
    setOpen(true);
  }
  function pick(country: PhoneInputCountry) {
    setDirection(
      ordered.findIndex((entry) => entry.iso === country.iso) >=
        ordered.findIndex((entry) => entry.iso === countryIso)
        ? 1
        : -1
    );
    onPick(country);
    close("input");
  }

  // Keep a portaled list usable inside Radix dialogs without weakening the dialog's other focus boundaries.
  React.useLayoutEffect(() => {
    const node = floatingRef.current;
    if (open && disabled) {
      setOpen(false);
      setQuery("");
      return;
    }
    if (!open || disabled || !node) return;
    const stopScroll = (event: Event) => event.stopPropagation();
    const focusWithin = (event: Event) => {
      const { target, relatedTarget } = event as FocusEvent;
      if (
        (target instanceof Node && node.contains(target)) ||
        (relatedTarget instanceof Node && node.contains(relatedTarget))
      )
        event.stopPropagation();
    };
    const outsideLayer = (event: Event) => {
      const target = (event as CustomEvent<{ originalEvent?: Event }>).detail
        ?.originalEvent?.target;
      if (target instanceof Node && node.contains(target))
        event.preventDefault();
    };
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!node.contains(target) && !trigger.current?.contains(target)) {
        setOpen(false);
        setQuery("");
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      setQuery("");
      trigger.current?.focus({ preventScroll: true });
    };
    node.addEventListener("wheel", stopScroll, { passive: true });
    node.addEventListener("touchmove", stopScroll, { passive: true });
    document.addEventListener("focusin", focusWithin, true);
    document.addEventListener("focusout", focusWithin, true);
    document.addEventListener(
      "dismissableLayer.pointerDownOutside",
      outsideLayer,
      true
    );
    document.addEventListener("pointerdown", outside, true);
    window.addEventListener("keydown", escape, true);
    let focusFrame = 0;
    if (
      isPositioned &&
      (keyboardOpen.current || !window.matchMedia("(pointer: coarse)").matches)
    )
      focusFrame = window.requestAnimationFrame(() =>
        search.current?.focus({ preventScroll: true })
      );
    return () => {
      window.cancelAnimationFrame(focusFrame);
      node.removeEventListener("wheel", stopScroll);
      node.removeEventListener("touchmove", stopScroll);
      document.removeEventListener("focusin", focusWithin, true);
      document.removeEventListener("focusout", focusWithin, true);
      document.removeEventListener(
        "dismissableLayer.pointerDownOutside",
        outsideLayer,
        true
      );
      document.removeEventListener("pointerdown", outside, true);
      window.removeEventListener("keydown", escape, true);
    };
  }, [open, disabled, floatingRef, isPositioned]);

  const settleHighlight = React.useCallback(() => {
    highlightAnimation.current?.stop();
    highlightAnimation.current = null;
    if (highlightY.get() !== highlightTarget.current)
      highlightY.jump(highlightTarget.current);
  }, [highlightY]);

  const handleListScroll = React.useCallback(() => {
    scrolling.current = true;
    settleHighlight();
    window.clearTimeout(scrollEnd.current);
    scrollEnd.current = setTimeout(() => {
      scrolling.current = false;
    }, 140);
  }, [settleHighlight]);

  const revealOption = React.useCallback(
    (option: HTMLElement) => {
      const viewport = scroller.current;
      if (!viewport || !list.current) return false;
      const top = list.current.offsetTop + option.offsetTop;
      const bottom = top + option.offsetHeight;
      const next =
        top < viewport.scrollTop
          ? top
          : bottom > viewport.scrollTop + viewport.clientHeight
            ? bottom - viewport.clientHeight
            : viewport.scrollTop;
      if (next === viewport.scrollTop) return false;
      handleListScroll();
      viewport.scrollTop = next;
      return true;
    },
    [handleListScroll]
  );

  // The tile lives in list coordinates. Native scrolling moves it with its row,
  // rather than projecting a shared layoutId between changing scroll positions.
  React.useLayoutEffect(() => {
    if (!open || !active || !list.current) return;
    const option = document.getElementById(`${id}-${active.iso}`);
    if (!option) return;
    const top = option.offsetTop;
    const height = option.offsetHeight;
    const previous = highlightTarget.current;
    const changed = previous !== top;
    highlightTarget.current = top;
    highlightHeight.jump(height);
    let didReveal = false;
    if (revealActive.current) {
      didReveal = revealOption(option);
      revealActive.current = false;
    }
    highlightAnimation.current?.stop();
    highlightAnimation.current = null;
    if (reduced || scrolling.current || didReveal || !changed) {
      highlightY.jump(top);
    } else {
      highlightAnimation.current = animate(highlightY, top, {
        type: "spring",
        stiffness: 500,
        damping: 42,
      });
    }
  }, [
    open,
    active,
    query,
    id,
    reduced,
    highlightY,
    highlightHeight,
    revealOption,
  ]);

  React.useEffect(() => {
    if (!open) return;
    return () => {
      window.clearTimeout(scrollEnd.current);
      scrolling.current = false;
      pointer.current = null;
      highlightAnimation.current?.stop();
      highlightAnimation.current = null;
    };
  }, [open]);

  function handleSearchKey(event: React.KeyboardEvent<HTMLInputElement>) {
    const index = active ? results.indexOf(active) : -1;
    let next = index;
    switch (event.key) {
      case "ArrowDown":
        next = Math.min(results.length - 1, index + 1);
        break;
      case "ArrowUp":
        next = Math.max(0, index - 1);
        break;
      case "PageDown":
        next = Math.min(results.length - 1, index + 7);
        break;
      case "PageUp":
        next = Math.max(0, index - 7);
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = results.length - 1;
        break;
      case "Enter":
        event.preventDefault();
        if (active) pick(active);
        return;
      case "Tab":
        event.preventDefault();
        close(event.shiftKey ? "trigger" : "input");
        return;
      default:
        return;
    }
    event.preventDefault();
    // Explicit navigation reveals the row, even if Home/End keeps the same
    // active country after the user manually scrolled it out of view.
    const nextIso = results[next]?.iso ?? "";
    const option = document.getElementById(`${id}-${nextIso}`);
    if (option) revealOption(option);
    setActiveIso(nextIso);
  }

  return (
    <>
      <button
        ref={(node) => {
          trigger.current = node;
          setReference(node);
        }}
        type="button"
        disabled={disabled}
        data-testid="phone-input-country"
        aria-label={`Select country (${current?.name ?? countryIso} ${countryCode})`}
        aria-haspopup="listbox"
        aria-expanded={open && !disabled}
        aria-controls={open && !disabled ? `${id}-list` : undefined}
        className={cn(
          "my-[3px] ml-[3px] flex h-[calc(100%-6px)] shrink-0 items-center gap-1.5 overflow-hidden rounded-md border-0 bg-transparent pl-[9px] pr-3 text-left font-normal outline-none cursor-pointer transition-colors [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:bg-semantic-bg-ui active:enabled:bg-semantic-bg-ui focus-visible:bg-semantic-bg-ui focus-visible:outline focus-visible:[outline-width:2px] focus-visible:-outline-offset-4 focus-visible:outline-semantic-primary disabled:cursor-not-allowed motion-reduce:transition-none"
        )}
        onClick={(event) => {
          onCountryClick?.();
          if (open) close();
          else show("", false, event.detail === 0);
        }}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp"].includes(event.key)) {
            event.preventDefault();
            show("", event.key === "ArrowUp", true);
          } else if (
            event.key.length === 1 &&
            /[a-z+0-9]/i.test(event.key) &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.altKey
          ) {
            event.preventDefault();
            show(event.key, false, true);
          }
        }}
      >
        <span
          aria-hidden="true"
          className="relative flex items-center overflow-hidden"
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={`${countryIso}-${countryCode}`}
              initial={{ y: reduced ? 0 : direction * 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reduced ? 0 : -direction * 14, opacity: 0 }}
              transition={{
                duration: reduced ? 0 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-flex items-center gap-1.5"
            >
              {countryFlag ?? (
                <ReactCountryFlag
                  svg
                  countryCode={countryIso}
                  className="!w-5 !h-[15px] object-cover shrink-0"
                />
              )}
              <span className="text-sm font-medium tabular-nums tracking-[-0.01em] text-semantic-text-primary">
                {countryCode}
              </span>
            </motion.span>
          </AnimatePresence>
        </span>
        {showChevron && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "ml-0.5 size-4 text-semantic-text-muted transition-transform motion-reduce:transition-none",
              open && "rotate-180"
            )}
          />
        )}
      </button>
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && !disabled && (
              <PickerSurface
                panelRef={setFloating}
                data-phone-country-picker=""
                data-state="open"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
                transition={{
                  duration: reduced ? 0 : 0.16,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "pointer-events-auto z-[10050] flex flex-col overflow-hidden rounded-lg border border-solid border-semantic-border-layout bg-semantic-bg-primary font-[family-name:var(--font-v2,Inter,sans-serif)] text-sm font-normal text-semantic-text-primary shadow-[0_12px_32px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)] [width:var(--phone-picker-width,20rem)] [max-height:var(--phone-picker-height,340px)]"
                )}
                style={{
                  ...floatingStyles,
                  pointerEvents: "auto",
                  visibility: isPositioned ? undefined : "hidden",
                  transformOrigin: "top left",
                }}
              >
                <div className="flex h-11 shrink-0 items-center gap-2 border-b border-semantic-border-layout px-3">
                  <Search
                    aria-hidden="true"
                    className="size-4 shrink-0 text-semantic-text-muted"
                  />
                  <input
                    ref={search}
                    type="text"
                    role="combobox"
                    aria-label="Country or calling code"
                    aria-expanded="true"
                    aria-controls={`${id}-list`}
                    aria-activedescendant={
                      active ? `${id}-${active.iso}` : undefined
                    }
                    aria-autocomplete="list"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Country or code"
                    value={query}
                    onChange={(event) => {
                      revealActive.current = true;
                      setQuery(event.target.value);
                      setActiveIso(
                        ordered.find((country) =>
                          matches(country, event.target.value)
                        )?.iso ?? ""
                      );
                    }}
                    onKeyDown={handleSearchKey}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm text-semantic-text-primary outline-none placeholder:text-semantic-text-muted"
                  />
                  <button
                    type="button"
                    aria-label="Close country picker"
                    onClick={() => close("trigger")}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-semantic-text-muted hover:bg-semantic-bg-hover focus-visible:outline focus-visible:outline-semantic-primary"
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className="size-4 rotate-180"
                    />
                  </button>
                </div>
                <div
                  ref={scroller}
                  onScroll={handleListScroll}
                  onWheelCapture={(event) => {
                    if (event.deltaY !== 0) handleListScroll();
                  }}
                  onMouseLeave={() => {
                    pointer.current = null;
                  }}
                  className="relative min-h-0 overflow-y-auto overscroll-contain p-1 [scrollbar-width:thin]"
                >
                  <div
                    ref={list}
                    id={`${id}-list`}
                    role="listbox"
                    aria-label="Countries"
                    className="relative"
                  >
                    {active && (
                      <motion.div
                        aria-hidden="true"
                        data-phone-country-highlight=""
                        initial={false}
                        style={{ y: highlightY, height: highlightHeight }}
                        className="pointer-events-none absolute inset-x-0 top-0 rounded-md bg-semantic-bg-hover"
                      />
                    )}
                    {results.map((country, index) => (
                      <React.Fragment key={country.iso}>
                        {!query &&
                          ((index === 0 &&
                            preferredCountries.includes(country.iso)) ||
                            (preferredCountries.includes(
                              results[index - 1]?.iso
                            ) &&
                              !preferredCountries.includes(country.iso))) && (
                            <p
                              aria-hidden="true"
                              className="m-0 px-2.5 pb-1 pt-2 text-xs text-semantic-text-muted"
                            >
                              {preferredCountries.includes(country.iso)
                                ? "Suggested"
                                : "All countries"}
                            </p>
                          )}
                        <div
                          id={`${id}-${country.iso}`}
                          role="option"
                          aria-selected={country.iso === countryIso}
                          data-active={
                            country.iso === active?.iso ? "true" : undefined
                          }
                          onMouseMove={(event) => {
                            if (
                              !window.matchMedia(
                                "(hover: hover) and (pointer: fine)"
                              ).matches
                            )
                              return;
                            const previous = pointer.current;
                            pointer.current = {
                              x: event.clientX,
                              y: event.clientY,
                            };
                            if (
                              scrolling.current ||
                              (previous?.x === event.clientX &&
                                previous.y === event.clientY)
                            )
                              return;
                            setActiveIso(country.iso);
                          }}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => pick(country)}
                          className="relative flex min-h-9 cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-sm"
                        >
                          <ReactCountryFlag
                            svg
                            countryCode={country.iso}
                            aria-hidden="true"
                            className="relative !w-5 !h-[15px] shrink-0 object-cover"
                          />
                          <span className="relative min-w-0 flex-1 truncate">
                            {country.name}
                          </span>
                          <span className="relative shrink-0 text-xs tabular-nums text-semantic-text-muted">
                            {country.dialCode}
                          </span>
                          <Check
                            aria-hidden="true"
                            className={cn(
                              "relative size-3.5 shrink-0 text-semantic-text-primary",
                              country.iso !== countryIso && "invisible"
                            )}
                          />
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  {results.length === 0 && (
                    <p className="m-0 px-2.5 py-4 text-sm text-semantic-text-muted">
                      No countries found.
                    </p>
                  )}
                </div>
                <span role="status" aria-live="polite" className="sr-only">
                  {results.length}{" "}
                  {results.length === 1 ? "country" : "countries"} found.
                </span>
              </PickerSurface>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

/** Measures copy as it wraps or changes, so opening, replacement and closing all animate height. */
function FieldFeedback({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const content = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  const reduced = useLiveReducedMotion();
  React.useLayoutEffect(() => {
    const node = content.current;
    if (!node) return;
    const measure = () => setHeight(node.getBoundingClientRect().height);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [children]);
  return (
    <motion.div
      data-field-feedback=""
      initial={false}
      animate={{
        height: active ? (height ?? "auto") : 0,
        opacity: active ? 1 : 0,
      }}
      transition={
        reduced
          ? { duration: 0 }
          : {
              // Arc: the row opens its height on a critically damped spring while the opacity follows in 160ms.
              height: { type: "spring", visualDuration: 0.4, bounce: 0 },
              opacity: { duration: 0.16 },
            }
      }
      className="min-w-0 overflow-hidden"
    >
      <div ref={content} className={className}>
        {children}
      </div>
    </motion.div>
  );
}

const phoneInputContainerVariants = cva(
  "font-[family-name:var(--font-v2,Inter,sans-serif)] font-normal flex items-center border h-11 border-solid rounded-lg bg-semantic-bg-primary transition-[border-color,background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms]",
  {
    variants: {
      state: {
        default:
          "border-semantic-border-input [@media(hover:hover)_and_(pointer:fine)]:hover:border-semantic-primary focus-within:outline-none focus-within:shadow-none",
        empty:
          "border-semantic-border-input [@media(hover:hover)_and_(pointer:fine)]:hover:border-semantic-primary focus-within:outline-none focus-within:shadow-none",
        error:
          "border-semantic-error-primary focus-within:outline-none focus-within:shadow-none",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

/**
 * A phone number input with a country code prefix area.
 *
 * @example
 * ```tsx
 * <PhoneInput placeholder="Enter phone number" />
 * <PhoneInput countryIso="US" countryCode="+1" />
 * <PhoneInput phoneMaxNumber={10} />
 * <PhoneInput state="empty" />
 * <PhoneInput validation="Enter a valid phone number" />
 * <PhoneInput onCountryClick={() => openCountryPicker()} />
 * ```
 */
export interface PhoneInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof phoneInputContainerVariants> {
  /** Visual validation state of the phone input */
  state?: "default" | "empty" | "error";
  /** Validation message displayed below the input. Also applies error styling. */
  validation?: string;
  /** ISO 3166-1 alpha-2 country code used to render the SVG flag (e.g., "IN", "US"). Defaults to "IN" */
  countryIso?: string;
  /** Custom flag node rendered instead of the SVG flag (e.g., an emoji or custom icon) */
  countryFlag?: React.ReactNode;
  /** Country dial code. Legacy default is +91; picker mode derives it from the selected country unless overridden. */
  countryCode?: string;
  /** Whether to show the chevron dropdown indicator. Defaults to true */
  showChevron?: boolean;
  /** Handler called when the country code area is clicked */
  onCountryClick?: () => void;
  /** Additional className for the outer wrapper */
  wrapperClassName?: string;
  /** Maximum number of digits allowed in the phone number */
  phoneMaxNumber?: number;
  /** Opt in to the anchored, searchable country picker. Defaults to false so app-supplied choosers keep working. */
  countrySelector?: boolean;
  /** Choices for the built-in picker. Defaults to PHONE_INPUT_COUNTRIES. */
  countries?: readonly PhoneInputCountry[];
  /** ISO codes pinned ahead of the alphabetical list. */
  preferredCountries?: readonly string[];
  /** Initial country in uncontrolled picker mode. Defaults to IN. */
  defaultCountryIso?: string;
  /** Called on a country pick; number value and onChange are unchanged. */
  onCountryChange?: (country: PhoneInputCountry) => void;
}

const PhoneInput = React.forwardRef(
  (
    {
      className,
      state,
      validation,
      countryIso: controlledCountryIso,
      countryFlag,
      countryCode: controlledCountryCode,
      showChevron = true,
      onCountryClick,
      wrapperClassName,
      disabled,
      inputMode = "numeric",
      pattern = "[0-9]*",
      onBeforeInput,
      onChange,
      onKeyDown,
      maxLength,
      phoneMaxNumber,
      countrySelector = false,
      countries = PHONE_INPUT_COUNTRIES,
      preferredCountries = DEFAULT_PREFERRED_COUNTRIES,
      defaultCountryIso = "IN",
      onCountryChange,
      onPaste,
      readOnly,
      id,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      ...props
    }: PhoneInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const effectiveMaxLength = phoneMaxNumber ?? maxLength;
    const generatedId = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!, []);
    const [internalCountry, setInternalCountry] = React.useState(
      () =>
        countries.find((country) => country.iso === defaultCountryIso) ?? {
          iso: defaultCountryIso,
          name: defaultCountryIso,
          dialCode: "+91",
        }
    );
    const countryIso =
      controlledCountryIso ?? (countrySelector ? internalCountry.iso : "IN");
    const countryCode =
      controlledCountryCode ??
      (countrySelector
        ? (countries.find((country) => country.iso === countryIso)?.dialCode ??
          internalCountry.dialCode)
        : "+91");
    const inputId = id || generatedId;
    const validationId = `${inputId}-validation`;
    const countryDescriptionId = `${inputId}-country`;
    const derivedState =
      validation || ariaInvalid === true || ariaInvalid === "true"
        ? "error"
        : (state ?? "default");
    const describedBy = [
      ariaDescribedBy,
      validation ? validationId : undefined,
      countrySelector ? countryDescriptionId : undefined,
    ]
      .filter(Boolean)
      .join(" ");
    const CountryArea = onCountryClick ? "button" : "div";

    // Reveal the message only when it appears after the field did, never on first render.
    const hasMessage = Boolean(validation);
    const reducedMotion = useLiveReducedMotion();
    const copyMotion = {
      initial: reducedMotion
        ? (false as const)
        : { opacity: 0, y: "0.35em", filter: "blur(4px)" },
      animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      transition: {
        duration: reducedMotion ? 0 : 0.24,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.key.length !== 1
      ) {
        return;
      }

      if (/\D/.test(event.key)) {
        event.preventDefault();
      }
    };

    const handleBeforeInput: NonNullable<
      React.DOMAttributes<HTMLInputElement>["onBeforeInput"]
    > = (event) => {
      onBeforeInput?.(event);
      if (event.defaultPrevented) return;

      const inputEvent = event.nativeEvent as InputEvent;
      if (inputEvent.data && /\D/.test(inputEvent.data)) {
        event.preventDefault();
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const digitsOnlyValue = event.currentTarget.value.replace(/\D/g, "");
      const sanitizedValue =
        effectiveMaxLength != null
          ? digitsOnlyValue.slice(0, effectiveMaxLength)
          : digitsOnlyValue;

      if (event.currentTarget.value !== sanitizedValue) {
        event.currentTarget.value = sanitizedValue;
      }

      onChange?.(event);
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      onPaste?.(event);
      if (event.defaultPrevented || disabled || readOnly) return;
      const text = event.clipboardData.getData("text");
      if (!text) return;
      event.preventDefault();
      // The v1 field stores national digits. Keep explicit international paste rejected rather than truncating a calling code into the number.
      if (/^\s*\+/.test(text)) return;
      const digits = text.replace(/\D/g, "");
      if (!digits) return;
      const input = event.currentTarget;
      const start = input.selectionStart ?? input.value.length;
      const end = input.selectionEnd ?? start;
      const before = input.value.slice(0, start);
      const after = input.value.slice(end);
      const capacity =
        effectiveMaxLength == null
          ? digits.length
          : Math.max(0, effectiveMaxLength - before.length - after.length);
      const inserted = digits.slice(0, capacity);
      const next = before + inserted + after;
      if (next === input.value) return;
      // Ref-based native listeners can cancel editing too, before React's textInput compatibility event.
      if (
        !input.dispatchEvent(
          new InputEvent("beforeinput", {
            bubbles: true,
            cancelable: true,
            inputType: "insertFromPaste",
            data: inserted,
          })
        )
      )
        return;
      // React's before-input plugin observes textInput in supported browsers. A cancellable transaction keeps
      // onBeforeInput (including caller preventDefault) ahead of mutation, with React's usual event shape.
      if (
        !input.dispatchEvent(
          new InputEvent("textInput", {
            bubbles: true,
            cancelable: true,
            inputType: "insertFromPaste",
            data: inserted,
          })
        )
      )
        return;
      // Use the native setter so React observes a real input event and supplies its usual ChangeEvent to consumers.
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      setter?.call(input, next);
      input.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertFromPaste",
          data: inserted,
        })
      );
      const caret = before.length + inserted.length;
      input.setSelectionRange(caret, caret);
    };

    const phoneInput = (
      <div
        className={cn(
          phoneInputContainerVariants({
            state: derivedState,
          }),
          disabled &&
            "bg-semantic-bg-ui opacity-50 shadow-none focus-within:shadow-none cursor-not-allowed",
          disabled &&
            (derivedState === "error"
              ? "[@media(hover:hover)_and_(pointer:fine)]:hover:border-semantic-error-primary"
              : "[@media(hover:hover)_and_(pointer:fine)]:hover:border-semantic-border-input"),
          wrapperClassName
        )}
      >
        {countrySelector ? (
          <PhoneCountrySelector
            countryIso={countryIso}
            countryCode={countryCode}
            countryFlag={countryFlag}
            showChevron={showChevron}
            countries={countries}
            preferredCountries={preferredCountries}
            disabled={disabled || readOnly}
            onCountryClick={onCountryClick}
            inputRef={inputRef}
            onPick={(country) => {
              if (controlledCountryIso === undefined)
                setInternalCountry(country);
              onCountryChange?.(country);
            }}
          />
        ) : (
          <CountryArea
            {...(onCountryClick
              ? {
                  type: "button" as const,
                  disabled,
                  "aria-label": `Select country (${countryIso} ${countryCode})`,
                }
              : {})}
            className={cn(
              "flex h-full items-center gap-1.5 pl-3 pr-3 shrink-0",
              // Arc's trigger sits 3px inside the shell and fills on hover (same quiet fill as a keyboard-focused row).
              onCountryClick &&
                "my-[3px] ml-[3px] h-[calc(100%-6px)] rounded-[10px] border-0 bg-transparent pl-[9px] text-left font-normal outline-none cursor-pointer transition-[background-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition-duration:0.01ms] [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:bg-semantic-bg-ui active:enabled:bg-semantic-bg-ui focus-visible:bg-semantic-bg-ui focus-visible:outline focus-visible:[outline-width:2px] focus-visible:-outline-offset-4 focus-visible:outline-semantic-primary disabled:cursor-not-allowed"
            )}
            onClick={onCountryClick}
            data-testid="phone-input-country"
          >
            {countryFlag ?? (
              <ReactCountryFlag
                svg
                countryCode={countryIso}
                className="!w-5 !h-[15px] object-cover shrink-0"
                title={countryIso}
                aria-label={countryIso}
              />
            )}
            <span className="text-sm font-medium tabular-nums tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)]">
              {countryCode}
            </span>
            {showChevron && (
              <ChevronDown className="ml-0.5 size-4 text-[var(--v2-text-muted,#707070)]" />
            )}
          </CountryArea>
        )}
        <div className="w-px h-[22px] bg-semantic-border-layout shrink-0" />
        <input
          type="tel"
          id={inputId}
          ref={inputRef}
          disabled={disabled}
          readOnly={readOnly}
          inputMode={inputMode}
          pattern={pattern}
          maxLength={effectiveMaxLength}
          aria-invalid={ariaInvalid ?? derivedState === "error"}
          aria-describedby={describedBy || undefined}
          className={cn(
            "min-w-0 flex-1 h-full pl-3 pr-3 text-sm leading-[1.4] tabular-nums tracking-[-0.01em] text-[var(--v2-text-secondary,#5E5E5E)] placeholder:text-[var(--v2-text-placeholder,#707070)] outline-none bg-transparent disabled:cursor-not-allowed",
            className
          )}
          onBeforeInput={handleBeforeInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          {...props}
        />
      </div>
    );

    return (
      <div className="flex flex-col">
        {phoneInput}
        {countrySelector && (
          <span
            id={countryDescriptionId}
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            Country:{" "}
            {countries.find((country) => country.iso === countryIso)?.name ??
              countryIso}{" "}
            {countryCode}
          </span>
        )}
        <FieldFeedback active={hasMessage} className="grid pt-2">
          {validation && (
            <motion.p
              {...copyMotion}
              key={validation}
              id={validationId}
              aria-live="polite"
              className="m-0 min-h-0 overflow-hidden break-words text-xs leading-[1.4] tracking-[-0.16px] text-semantic-error-text"
            >
              {validation}
            </motion.p>
          )}
        </FieldFeedback>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput, phoneInputContainerVariants };
