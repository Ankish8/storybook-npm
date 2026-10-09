import Link from "next/link";
import { blocks, categories, entryHref, uiComponents } from "@docs/lib/catalog";
export default function Home() {
  return (
    <div className="arc-page">
      <article className="arc-article">
        <nav className="arc-breadcrumb" aria-label="Breadcrumb">
          <span>Library</span>
          <span>Components</span>
        </nav>
        <h1 className="arc-title">Components</h1>
        <p className="arc-description">
          A considered set of components for MyOperator. Explore their styles,
          states and real interactions.
        </p>
        <p className="docs-intro">
          {uiComponents.length} components · {blocks.length}{" "}
          {blocks.length === 1 ? "block" : "blocks"} · v2
        </p>
        {categories.map((group) => (
          <section key={group.id} id={group.id}>
            <h2 className="category-title">{group.title}</h2>
            <div className="component-grid">
              {uiComponents
                .filter((component) => component.category === group.id)
                .map((component) => (
                  <Link
                    key={component.slug}
                    className="component-card"
                    href={entryHref(component)}
                  >
                    <strong>{component.title}</strong>
                    <p>{component.description}</p>
                  </Link>
                ))}
            </div>
          </section>
        ))}
        {blocks.length > 0 && (
          <section id="blocks">
            <h2 className="category-title">Blocks</h2>
            <p className="docs-intro">
              Ready-made product UI built for a specific job. Install one and
              adapt it to your screen.
            </p>
            {categories
              .filter((group) =>
                blocks.some((block) => block.category === group.id)
              )
              .map((group) => (
                <div key={group.id}>
                  <h3 className="category-subtitle">{group.title}</h3>
                  <div className="component-grid">
                    {blocks
                      .filter((block) => block.category === group.id)
                      .map((block) => (
                        <Link
                          key={block.slug}
                          className="component-card"
                          href={entryHref(block)}
                        >
                          <strong>{block.title}</strong>
                          <p>{block.description}</p>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
          </section>
        )}
        <aside className="arc-toc" aria-label="On this page">
          <h2>On this page</h2>
          <nav>
            {categories
              .filter((group) =>
                uiComponents.some(
                  (component) => component.category === group.id
                )
              )
              .map((group) => (
                <a key={group.id} href={`#${group.id}`}>
                  {group.title}
                </a>
              ))}
            {blocks.length > 0 && <a href="#blocks">Blocks</a>}
          </nav>
        </aside>
      </article>
    </div>
  );
}
