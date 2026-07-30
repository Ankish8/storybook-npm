import * as React from "react";

import { cn } from "../../../lib/utils";
import { loginIllustrationDataUri } from "./login-illustration";
import type { AuthLayoutProps } from "./types";

/**
 * Two-pane authentication shell: product logo top-left, form card on the left,
 * marketing illustration and copy on the right.
 *
 * Collapses to a single centred column below the `lg` breakpoint, where the
 * marketing panel is hidden.
 *
 * @example
 * ```tsx
 * <AuthLayout logoSrc="/logo.svg" illustration={<img src="/hero.png" alt="" />}>
 *   <LoginForm />
 * </AuthLayout>
 * ```
 */
const AuthLayout = React.forwardRef<HTMLDivElement, AuthLayoutProps>(
  (
    {
      className,
      logoSrc,
      logoAlt = "MyOperator",
      logo,
      illustration,
      illustrationSrc,
      illustrationAlt = "",
      marketingTitle = "Continue managing conversations efficiently",
      marketingDescription = "Access a unified workspace for customer engagement and support.",
      hideMarketingPanel = false,
      children,
      cardClassName,
      marketingPanelClassName,
      ...props
    },
    ref
  ) => {
    const logoNode =
      logo ??
      (logoSrc ? (
        <img
          src={logoSrc}
          alt={logoAlt}
          className="h-12 w-auto max-w-[194px] object-contain"
        />
      ) : null);

    // `illustrationSrc === null` opts out; `undefined` falls back to the bundled art.
    const resolvedIllustrationSrc =
      illustrationSrc === undefined ? loginIllustrationDataUri : illustrationSrc;

    const illustrationNode =
      illustration ??
      (resolvedIllustrationSrc ? (
        <img
          src={resolvedIllustrationSrc}
          alt={illustrationAlt}
          width={1126}
          height={670}
          className="h-auto w-full max-w-100 object-contain"
        />
      ) : null);

    const showMarketingPanel = !hideMarketingPanel;

    return (
      // No padding or gap on the grid itself: each half must bleed to the screen
      // edge so the marketing panel's background fills its exact 50%. Padding
      // lives inside each half instead.
      <div
        ref={ref}
        className={cn(
          "grid min-h-screen w-full grid-cols-1 bg-semantic-bg-primary",
          showMarketingPanel && "lg:grid-cols-2",
          className
        )}
        {...props}
      >
        {/* Figma: the form column is inset 120px from the page edge and the card
            stretches to fill it (576px at the 1440px reference width). */}
        <div className="flex min-w-0 flex-col bg-semantic-bg-subtle px-6 py-8 sm:px-10 lg:px-12 xl:pl-[120px] xl:pr-6">
          {logoNode ? (
            <div className="flex shrink-0 items-center">{logoNode}</div>
          ) : null}
          <div className="flex flex-1 items-center justify-center py-8">
            <div
              className={cn(
                "flex w-full max-w-[576px] flex-col items-center gap-6 rounded-3xl border border-solid border-semantic-border-layout bg-semantic-bg-primary px-6 py-6 shadow-[1px_1px_40px_0px_rgba(160,160,160,0.1)] sm:px-12",
                cardClassName
              )}
            >
              {children}
            </div>
          </div>
        </div>

        {showMarketingPanel && (
          <div
            className={cn(
              "hidden min-w-0 flex-col items-center justify-center gap-8 bg-semantic-bg-canvas px-8 py-12 lg:flex xl:px-12",
              marketingPanelClassName
            )}
          >
            {illustrationNode ? (
              <div className="flex w-full max-w-100 items-center justify-center">
                {illustrationNode}
              </div>
            ) : null}
            <div className="flex w-full max-w-[563px] flex-col gap-2 text-center">
              {marketingTitle ? (
                <p className="m-0 text-2xl font-semibold leading-8 text-semantic-text-primary xl:text-[28px] xl:leading-9">
                  {marketingTitle}
                </p>
              ) : null}
              {marketingDescription ? (
                <p className="m-0 text-base text-semantic-text-muted">
                  {marketingDescription}
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  }
);
AuthLayout.displayName = "AuthLayout";

export { AuthLayout };
