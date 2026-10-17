import { categories, visibleEntries, entryHref } from "@docs/lib/catalog";

const pages = [
  {
    title: "Overview",
    url: "/",
    description:
      "The myOperator v2 component library: installation, foundations and component documentation.",
    breadcrumbs: ["myOperator UI"],
  },
  {
    title: "Foundations",
    url: "/foundations",
    description:
      "Design tokens for neutral text, semantic colors, Timeless Sans typography with Inter fallback, spacing, radius, shadows, focus and reduced motion.",
    breadcrumbs: ["myOperator UI"],
  },
  ...visibleEntries.map((component) => ({
    title: component.title,
    url: entryHref(component),
    description: component.description,
    breadcrumbs: [
      ...(component.kind === "block" ? ["Blocks"] : []),
      categories.find((category) => category.id === component.category)!.title,
    ],
  })),
];

export async function GET(request: Request) {
  const query =
    new URL(request.url).searchParams.get("query")?.trim().toLowerCase() ?? "";
  const terms = query.split(/\s+/).filter(Boolean);
  const results = terms.length
    ? pages
        .filter((page) =>
          terms.every((term) =>
            `${page.title} ${page.description} ${page.breadcrumbs.join(" ")}`
              .toLowerCase()
              .includes(term)
          )
        )
        .map((page) => ({
          ...page,
          id: page.url,
          type: "page",
          content: page.title,
        }))
    : [];
  return Response.json(results);
}
