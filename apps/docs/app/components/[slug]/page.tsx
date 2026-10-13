import { docsPath } from "@docs/lib/paths";
import { notFound, permanentRedirect } from "next/navigation";
import { components, entryHref, getComponent } from "@docs/lib/catalog";
import { EntryPage } from "@docs/components/entry-page";
export function generateStaticParams() {
  return components.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return { title: getComponent((await params).slug)?.title ?? "Component" };
}
export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const component = getComponent((await params).slug);
  if (!component) notFound();
  if (component.slug === "typography")
    permanentRedirect(docsPath("/foundations#typography"));
  if (component.aliasOf) permanentRedirect(docsPath(entryHref(component)));
  // A block moved out of Components keeps working at its old address.
  if (component.kind === "block")
    permanentRedirect(docsPath(entryHref(component)));
  return <EntryPage entry={component} />;
}
