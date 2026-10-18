import { ThemeProvider } from "@docs/components/theme-provider";
import { themeBootstrap } from "@docs/lib/theme";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LibraryShell } from "@docs/components/library-shell";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { template: "%s · MyOperator UI", default: "MyOperator UI · v2" },
  description:
    "Explore the MyOperator v2 component library: live examples, controls, source code and design guidance.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          id="docs-theme"
          dangerouslySetInnerHTML={{ __html: themeBootstrap }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LibraryShell>{children}</LibraryShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
