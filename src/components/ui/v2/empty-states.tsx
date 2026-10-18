"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  EmptyState,
  type EmptyStateIllustration,
  type EmptyStateProps,
} from "./empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

export type EmptyStatesValue = EmptyStateIllustration;

/** Content overrides use the same slots as the standalone EmptyState. */
export type EmptyStatesView = Partial<
  Pick<EmptyStateProps, "title" | "description" | "icon" | "actions">
>;

export interface EmptyStatesProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue"
> {
  /** Controlled selected view. */
  value?: EmptyStatesValue;
  /** Initial view when uncontrolled. Defaults to "no-results". */
  defaultValue?: EmptyStatesValue;
  onValueChange?: (value: EmptyStatesValue) => void;
  /** Optional copy, icon and action slots for any of the four views. */
  states?: Partial<Record<EmptyStatesValue, EmptyStatesView>>;
  /** Wires the preset recovery buttons. Omitted handlers render no button. */
  onAction?: (
    value: EmptyStatesValue,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  size?: EmptyStateProps["size"];
  /** Accessible name for the tab rail. */
  tabListLabel?: string;
}

const VIEWS = [
  {
    value: "no-results",
    label: "No results",
    title: "No results found",
    description:
      "Try a different search or clear the filters to see more results.",
    action: "Clear filters",
  },
  {
    value: "offline",
    label: "Offline",
    title: "You're offline",
    description: "Check your connection, then try again.",
    action: "Reconnect",
  },
  {
    value: "caught-up",
    label: "Caught up",
    title: "You're all caught up",
    description: "New conversations will appear here when they arrive.",
    action: "Refresh",
  },
  {
    value: "not-found",
    label: "Not found",
    title: "Page not found",
    description: "This page may have moved or the link may be out of date.",
    action: "Go back",
  },
] as const;

const useBrowserLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/**
 * A compact, tabbed composition of the four EmptyState illustrations.
 * Recovery is owned by the consumer; selecting a tab only selects a view.
 *
 * @example
 * <EmptyStates defaultValue="offline" onAction={() => retryConnection()} />
 */
const EmptyStates = React.forwardRef<HTMLDivElement, EmptyStatesProps>(
  function EmptyStates(
    {
      value,
      defaultValue = "no-results",
      onValueChange,
      states,
      onAction,
      size = "default",
      tabListLabel = "Empty state",
      className,
      dir,
      onFocusCapture,
      onBlurCapture,
      ...props
    },
    ref
  ) {
    const [localValue, setLocalValue] = React.useState(defaultValue);
    const selected = value ?? localValue;
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const panelFocus = React.useRef<HTMLElement | null>(null);
    const composedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") {
          const cleanup = (
            ref as (node: HTMLDivElement | null) => void | (() => void)
          )(node);
          if (typeof cleanup === "function") {
            return () => {
              rootRef.current = null;
              cleanup();
            };
          }
        } else if (ref) ref.current = node;
      },
      [ref]
    );

    // An app may change a controlled view while its recovery button has focus.
    // Restore to the selected tab only if that focused panel was just hidden.
    useBrowserLayoutEffect(() => {
      const root = rootRef.current;
      const focused = panelFocus.current;
      if (!root || !focused) return;
      const active = root.ownerDocument.activeElement;
      const hidden = focused.closest('[data-slot="empty-states-panel"]');
      if (
        (!focused.isConnected ||
          hidden?.getAttribute("data-state") === "inactive") &&
        (active === focused || active === root.ownerDocument.body)
      ) {
        root
          .querySelector<HTMLButtonElement>(
            '[data-slot="empty-states-tab"][data-state="active"]'
          )
          ?.focus({ preventScroll: true });
      }
    }, [selected]);

    return (
      <div
        {...props}
        ref={composedRef}
        dir={dir}
        data-slot="empty-states"
        data-value={selected}
        className={cn(
          "w-full min-w-0 max-w-2xl rounded-2xl border border-solid border-v2-semantic-border-layout bg-v2-semantic-bg-primary p-4 font-[family-name:var(--font-v2,Inter,sans-serif)] text-v2-semantic-text-primary sm:p-6",
          className
        )}
        onFocusCapture={(event) => {
          panelFocus.current =
            event.target instanceof HTMLElement &&
            event.target.closest('[data-slot="empty-states-panel"]')
              ? event.target
              : null;
          onFocusCapture?.(event);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            panelFocus.current = null;
          }
          onBlurCapture?.(event);
        }}
      >
        <Tabs
          value={selected}
          dir={dir === "rtl" || dir === "ltr" ? dir : undefined}
          className="flex min-w-0 flex-col items-center"
          onValueChange={(next) => {
            const view = VIEWS.find((entry) => entry.value === next);
            if (!view) return;
            if (value === undefined) setLocalValue(view.value);
            onValueChange?.(view.value);
          }}
        >
          <TabsList
            variant="pill"
            aria-label={tabListLabel}
            className="w-full max-w-[460px] overflow-x-auto"
          >
            {VIEWS.map((view) => (
              <TabsTrigger
                key={view.value}
                value={view.value}
                data-slot="empty-states-tab"
                className="min-w-max flex-1 px-2 text-xs sm:px-3 sm:text-sm"
              >
                {view.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {VIEWS.map((view) => {
            const custom = states?.[view.value];
            const actions =
              custom?.actions !== undefined ? (
                custom.actions
              ) : onAction ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={(event) => onAction(view.value, event)}
                >
                  {view.action}
                </Button>
              ) : undefined;
            return (
              <TabsContent
                key={view.value}
                value={view.value}
                data-slot="empty-states-panel"
                className="mt-6 w-full min-w-0 focus-visible:outline focus-visible:[outline-width:2px] focus-visible:outline-offset-4 focus-visible:outline-[var(--v2-semantic-border-focus,var(--semantic-primary))]"
              >
                <EmptyState
                  illustration={view.value}
                  icon={custom?.icon}
                  title={
                    custom?.title === undefined ? view.title : custom.title
                  }
                  description={
                    custom?.description === undefined
                      ? view.description
                      : custom.description
                  }
                  actions={actions}
                  size={size}
                  className={cn(
                    "w-full min-w-0 px-0 py-4",
                    size === "sm" && "py-2"
                  )}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    );
  }
);
EmptyStates.displayName = "EmptyStates";

export { EmptyStates };
