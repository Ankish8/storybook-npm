import Link from "next/link";

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
            Use neutral charcoal for headings, medium gray for body text, and
            lighter gray for supporting details. Weight should communicate
            purpose, with medium labels and regular body text.
          </p>
          <div className="foundation-grid">
            {[
              ["Primary", "#484848", "Headings and selected text"],
              ["Secondary", "#5E5E5E", "Body and field values"],
              ["Muted", "#707070", "Hints and metadata"],
            ].map(([name, color, role]) => (
              <div className="foundation-swatch" key={name}>
                <div style={{ background: color }} />
                <p>
                  <strong>{name}</strong> · {color}
                  <br />
                  {role}
                </p>
              </div>
            ))}
          </div>
          <h2>Typography</h2>
          <p>
            V2 uses Inter. Ordinary titles, labels, and tabs use weight 500.
            Body text, descriptions, counts, and metadata use 400. Filled
            primary and status actions retain their deliberate emphasis.
          </p>
          <h2>Motion</h2>
          <p>
            Interactions should feel responsive and restrained. Press feedback
            is small, selections move smoothly, and overlays appear from their
            trigger. Reduced motion removes spatial movement while keeping
            useful feedback.
          </p>
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
