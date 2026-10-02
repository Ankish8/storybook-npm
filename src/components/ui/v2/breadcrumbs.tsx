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
  onNavigate?: (
    item: BreadcrumbItem,
    index: number,
    event: React.MouseEvent
  ) => void;
}
const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, maxItems = 4, onNavigate, className, ...props }, ref) => {
    const [overflowOpen, setOverflowOpen] = React.useState(false);
    const limit = Math.max(3, Math.floor(maxItems));
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
    const labelClass =
      "inline-flex min-h-[34px] items-center gap-2 rounded-lg p-2 text-sm font-normal leading-[18px] text-[var(--v2-text-secondary,#5E5E5E)] [&_svg]:size-[18px]";
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
        <ol className="m-0 flex w-max list-none items-center gap-0.5 p-0">
          {visible.map((index, position) => (
            <React.Fragment key={index}>
              {position > 0 && (
                <li aria-hidden="true">
                  <ChevronRight className="size-3 text-[var(--v2-text-muted,#707070)]" />
                </li>
              )}
              {collapsed && position === 1 && (
                <>
                  <li>
                    <DropdownMenu
                      open={overflowOpen}
                      onOpenChange={setOverflowOpen}
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
                      <DropdownMenuContent aria-label="Hidden breadcrumb pages">
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
                              <a href={item.href}>{item.label}</a>
                            ) : (
                              <span>{item.label}</span>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="size-3 text-[var(--v2-text-muted,#707070)]" />
                  </li>
                </>
              )}
              <li>
                {index === items.length - 1 ? (
                  <span
                    aria-current="page"
                    className={cn(
                      labelClass,
                      "text-[var(--v2-text-primary,#484848)]"
                    )}
                  >
                    {items[index].icon}
                    {items[index].label}
                  </span>
                ) : (
                  <a
                    href={items[index].href || "#"}
                    className={cn(
                      labelClass,
                      "hover:bg-semantic-bg-ui hover:underline focus-visible:outline focus-visible:[outline-width:1px] focus-visible:outline-semantic-primary focus-visible:outline-offset-[-2px]"
                    )}
                    onClick={(event) =>
                      onNavigate?.(items[index], index, event)
                    }
                  >
                    {items[index].icon}
                    {items[index].label}
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
