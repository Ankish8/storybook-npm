import Link from "next/link";
import { MigrationSection } from "@docs/components/migration-comparison";

export const metadata = { title: "Foundations" };
export default function Foundations() {
  return (
    <div className="arc-page">
      <article className="arc-article">
        <nav className="arc-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Docs</Link>
          <span>Foundations</span>
        </nav>
        <h1 className="arc-title">Foundations</h1>
        <p className="arc-description">
          The shared visual language behind MyOperator v2.
        </p>
        <div className="documentation">
          <h2>Text hierarchy</h2>
          <p>
            Use the theme’s primary foreground for headings, secondary
            foreground for body text, and muted foreground for supporting
            details. Weight should communicate purpose, with medium labels and
            regular body text.
          </p>
          <div className="foundation-grid">
            {[
              ["Primary", "#484848", "#f2f2f3", "Headings and selected text"],
              ["Secondary", "#5E5E5E", "#d0d3d8", "Body and field values"],
              ["Muted", "#707070", "#a6adb8", "Hints and metadata"],
            ].map(([name, color, darkColor, role]) => (
              <div className="foundation-swatch" key={name}>
                <div
                  style={{ background: color }}
                  aria-label={`${name} light color`}
                />
                <div
                  style={{ background: darkColor }}
                  aria-label={`${name} dark color`}
                />
                <p>
                  <strong>{name}</strong> · Light {color} / Dark {darkColor}
                  <br />
                  {role}
                </p>
              </div>
            ))}
          </div>
          <h2 id="typography">Typography</h2>
          <p>
            V2 uses Timeless Sans with Inter and sans-serif fallbacks. Ordinary
            titles, labels, and tabs use weight 500. Body text, descriptions,
            counts, and metadata use 400. Filled primary and status actions
            retain their deliberate emphasis.
          </p>
          <h2 id="dark-mode">Light and dark mode</h2>
          <p>
            Use the sun and moon button to switch between light and dark. The
            choice is saved for future visits. Your first visit, or an existing
            System preference, follows your operating system. Examples and open
            v2 popups update without resetting their state. V1 comparisons
            retain their original light appearance.
          </p>
          <p>
            In your application, include the generated myOperator theme
            stylesheet and the v2 Tailwind color aliases from init. Add the{" "}
            <code>dark</code> class to <code>document.documentElement</code> to
            enable dark mode, and remove it for light mode. Set{" "}
            <code>color-scheme</code> to match for native controls. Keep the
            class on the document root so dropdowns, tooltips and modal portals
            inherit the same theme.
          </p>
          <pre>
            <code>{`// Light
document.documentElement.classList.remove("dark");
document.documentElement.style.colorScheme = "light";

// Dark
document.documentElement.classList.add("dark");
document.documentElement.style.colorScheme = "dark";`}</code>
          </pre>
          <p>
            V2 colors fall back to the existing semantic values in light mode.
            Dark colors use isolated <code>--v2-semantic-*</code> roles; v1
            theme values and component props are unchanged. After upgrading the
            CLI, rerun init to receive the updated theme and Tailwind aliases,
            then rebuild your stylesheet.
          </p>
          <h2>Motion</h2>
          <p>
            Interactions should feel responsive and restrained. Press feedback
            is small, selections move smoothly, and overlays appear from their
            trigger. Reduced motion removes spatial movement while keeping
            useful feedback.
          </p>
          <MigrationSection slug="typography" title="Typography" />
          <h2>Using the library</h2>
          <pre>
            <code>
              npx myoperator-ui init{"\n"}npx myoperator-ui add v2-button
            </code>
          </pre>
          <p>
            V2 installs without a Tailwind prefix. Existing v1 components keep
            their original prefixed distribution. See each component’s
            documentation for its imports and dependencies.
          </p>
          <h2>Explore real interactions</h2>
          <p>
            <Link className="docs-link" href="/components/tabs">
              Tabs
            </Link>{" "}
            for selection motion,{" "}
            <Link className="docs-link" href="/components/modal">
              Modal
            </Link>{" "}
            for overlays, and{" "}
            <Link className="docs-link" href="/components/input">
              Input
            </Link>{" "}
            for field states.
          </p>
        </div>
      </article>
    </div>
  );
}
