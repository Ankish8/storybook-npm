import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  components,
  entryHref,
  getComponent,
  type ComponentEntry,
} from "@docs/lib/catalog";
import { ComponentPlayground } from "@docs/components/component-playground";
import { ExamplesSection } from "@docs/components/examples-section";
import { loadExamples } from "@docs/lib/examples";
import { PageActions } from "@docs/components/page-actions";

/** The documentation page for one catalog entry. Components and blocks share it; only the framing differs. */
export async function EntryPage({ entry }: { entry: ComponentEntry }) {
  const isBlock = entry.kind === "block";
  const examples = await loadExamples(entry.slug);
  const related = (
    entry.related
      ? entry.related.map(getComponent)
      : components.filter(
          (item) => item.category === entry.category && item.slug !== entry.slug
        )
  )
    .filter((item): item is ComponentEntry => Boolean(item))
    .slice(0, 4);
  return (
    <div className="arc-page">
      <article className="arc-article">
        <nav className="arc-breadcrumb" aria-label="Breadcrumb">
          <Link href={isBlock ? "/#blocks" : "/"}>
            {isBlock ? "Blocks" : "Components"}
          </Link>
          <ChevronRight aria-hidden="true" />
          <span>{entry.title}</span>
        </nav>
        {isBlock && (
          <p className="arc-kind">
            <span className="arc-kind-badge">Block</span>
            Ready-made product UI. Install it and adapt it to your screen.
          </p>
        )}
        <h1 className="arc-title">{entry.title}</h1>
        <p className="arc-description">{entry.description}</p>
        <PageActions
          slug={entry.slug}
          title={entry.title}
          description={entry.description}
        />
        <ComponentPlayground
          key={entry.slug}
          slug={entry.slug}
          title={entry.title}
          anatomy={Boolean(examples?.anatomy)}
          examples={examples?.examples.map(({ id, title }) => ({ id, title }))}
        >
          {examples && (
            <ExamplesSection
              slug={entry.slug}
              title={entry.title}
              anatomy={examples.anatomy}
              examples={examples.examples}
            />
          )}
        </ComponentPlayground>
        <section className="arc-related" id="related">
          <h2>Related components</h2>
          <div className="arc-related-grid">
            {related.map((item) => (
              <Link
                key={item.slug}
                className="component-card"
                href={entryHref(item)}
              >
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
