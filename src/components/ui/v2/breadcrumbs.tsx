import * as React from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}
export interface BreadcrumbsProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onClick"
> {
  items: BreadcrumbItem[];
  maxItems?: number;
  /** Optional per-label width in pixels. Full labels remain accessible. */
  maxItemWidth?: number;
  /** Decorative separator; defaults to a direction-aware chevron. */
  separator?: React.ReactNode;
  onNavigate?: (
    item: BreadcrumbItem,
    index: number,
    event: React.MouseEvent
  ) => void;
}
const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      maxItems = 4,
      maxItemWidth,
      separator,
      onNavigate,
      className,
      ...props
    },
    ref
  ) => {
    const [overflowOpen, setOverflowOpen] = React.useState(false);
    const [menuDirection, setMenuDirection] = React.useState<"ltr" | "rtl">(
      props.dir === "rtl" ? "rtl" : "ltr"
    );
    const listRef = React.useRef<HTMLOListElement>(null);
    const previousCount = React.useRef(items.length);
    React.useEffect(() => {
      const previous = previousCount.current;
      previousCount.current = items.length;
      if (
        items.length <= previous ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      )
        return;
      const animations: Animation[] = [];
      const offset =
        listRef.current && getComputedStyle(listRef.current).direction === "rtl"
          ? "translateX(8px)"
          : "translateX(-8px)";
      listRef.current
        ?.querySelectorAll<HTMLElement>("[data-breadcrumb-index]")
        .forEach((crumb) => {
          if (
            Number(crumb.dataset.breadcrumbIndex) < previous ||
            !crumb.animate
          )
            return;
          animations.push(
            crumb.animate(
              [
                {
                  opacity: 0,
                  transform: offset,
                  filter: "blur(2px)",
                },
                { opacity: 1, transform: "translateX(0)", filter: "blur(0)" },
              ],
              { duration: 240, easing: "cubic-bezier(0.16,1,0.3,1)" }
            )
          );
        });
      return () => animations.forEach((animation) => animation.cancel());
    }, [items.length]);
    const limit = Math.max(
      3,
      Math.floor(Number.isNaN(maxItems) ? 4 : maxItems)
    );
    const collapsed = items.length > limit;
    const hidden = collapsed ? items.slice(1, items.length - (limit - 2)) : [];
    const visible = collapsed
      ? [
          0,
          ...Array.from(
            { length: limit - 2 },
            (_, i) => items.length - (limit - 2) + i
          ),
        ]
      : items.map((_, i) => i);
    const labelWidth =
      maxItemWidth && Number.isFinite(maxItemWidth) && maxItemWidth > 0
        ? maxItemWidth
        : undefined;
    // Arc's crumb: 14/1.4 text with 4px/2px padding. Without an icon the crumb reserves the width of its
    // medium-weight label (the ::after copy), so becoming the current page never shifts the path.
    const labelClass = (item: BreadcrumbItem) =>
      cn(
        "inline-flex rounded-lg px-0.5 py-1 text-sm font-normal leading-[1.4] tracking-[-0.01em] text-[var(--v2-text-secondary,var(--semantic-text-secondary))] [&_svg]:size-[18px] [&_svg]:shrink-0",
        item.icon || labelWidth
          ? "items-center gap-2"
          : "flex-col after:invisible after:pointer-events-none after:block after:h-0 after:select-none after:overflow-hidden after:font-medium after:content-[attr(data-label)]"
      );
    const labelContent = (item: BreadcrumbItem) => (
      <>
        {item.icon}
        {labelWidth ? (
          <span
            className="block min-w-0 truncate"
            style={{ maxWidth: labelWidth }}
          >
            {item.label}
          </span>
        ) : (
          item.label
        )}
      </>
    );
    const separatorContent = separator ?? (
      <ChevronRight className="size-4 stroke-[1.75] text-[var(--color-neutral-300)] rtl:-scale-x-100" />
    );
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn(
          "max-w-full overflow-x-auto font-[family-name:var(--font-v2,Inter,sans-serif)]",
          className
        )}
        {...props}
      >
        <ol
          ref={listRef}
          className="m-0 flex w-max list-none items-center gap-1.5 p-0 [&>li]:shrink-0"
        >
          {visible.map((index, position) => (
            <React.Fragment key={index}>
              {position > 0 && <li aria-hidden="true">{separatorContent}</li>}
              {collapsed && position === 1 && (
                <>
                  <li>
                    <DropdownMenu
                      open={overflowOpen}
                      onOpenChange={(open) => {
                        // A portaled menu cannot inherit DOM direction. Read
                        // the path when opening so parent dir changes work too.
                        if (open && listRef.current) {
                          setMenuDirection(
                            getComputedStyle(listRef.current).direction ===
                              "rtl"
                              ? "rtl"
                              : "ltr"
                          );
                        }
                        setOverflowOpen(open);
                      }}
                      dir={menuDirection}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="link"
                          size="icon-sm"
                          aria-label="Show hidden pages"
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        aria-label="Hidden breadcrumb pages"
                      >
                        {hidden.map((item, i) => (
                          <DropdownMenuItem
                            key={i}
                            onClick={(event) => {
                              onNavigate?.(item, i + 1, event);
                              setOverflowOpen(false);
                            }}
                            asChild={!!item.href}
                          >
                            {item.href ? (
                              <a href={item.href}>
                                {item.icon}
                                {item.label}
                              </a>
                            ) : (
                              <span className="flex min-w-0 items-center gap-2">
                                {item.icon}
                                {item.label}
                              </span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                  <li aria-hidden="true">{separatorContent}</li>
                </>
              )}
              <li data-breadcrumb-index={index}>
                {index === items.length - 1 ? (
                  <span
                    aria-current="page"
                    data-label={items[index].label}
                    title={labelWidth ? items[index].label : undefined}
                    className={cn(
                      labelClass(items[index]),
                      "font-medium text-[var(--v2-text-primary,var(--semantic-text-primary))]"
                    )}
                  >
                    {labelContent(items[index])}
                  </span>
                ) : (
                  <a
                    href={items[index].href || "#"}
                    data-label={items[index].label}
                    title={labelWidth ? items[index].label : undefined}
                    className={cn(
                      labelClass(items[index]),
                      // Colour and a 45% underline fade in together on hover (hover-capable pointers only).
                      "underline decoration-transparent decoration-1 underline-offset-4 transition-[color,text-decoration-color] [transition-duration:160ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(hover:hover)_and_(pointer:fine)]:hover:text-[var(--v2-text-primary,var(--semantic-text-primary))] [@media(hover:hover)_and_(pointer:fine)]:hover:decoration-[color-mix(in_oklab,currentColor_45%,transparent)] focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-semantic-primary focus-visible:outline-offset-[-2px] focus-visible:decoration-current"
                    )}
                    onClick={(event) =>
                      onNavigate?.(items[index], index, event)
                    }
                  >
                    {labelContent(items[index])}
                  </a>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    );
  }
);
Breadcrumbs.displayName = "Breadcrumbs";
export { Breadcrumbs };
