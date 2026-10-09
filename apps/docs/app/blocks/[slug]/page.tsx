import { notFound } from "next/navigation";
import { blocks, getComponent } from "@docs/lib/catalog";
import { EntryPage } from "@docs/components/entry-page";
export function generateStaticParams() {
  return blocks.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return { title: getComponent((await params).slug)?.title ?? "Block" };
}
export default async function BlockPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const block = getComponent((await params).slug);
  if (!block || block.kind !== "block") notFound();
  return <EntryPage entry={block} />;
}
