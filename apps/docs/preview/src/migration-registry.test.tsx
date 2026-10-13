import { expect, test } from "vitest";
import { components } from "../../lib/catalog";
import {
  auditedMigrationDocs,
  migrationComparisons,
  earlierV2Comparisons,
} from "../../lib/migration-comparisons";
import { v1, v2, earlier, refreshed } from "virtual:docs-legacy-stories";
import { prepareStory, serializable } from "./model.mjs";
import { rewriteLegacyStory } from "../legacy-stories.mjs";

test("every catalog entry has audited migration notes and real legacy examples, or an explicit v2-only entry", async () => {
  expect(Object.keys(migrationComparisons).sort()).toEqual(
    components.map((entry) => entry.slug).sort()
  );
  const seen = new Set<string>();
  for (const entry of components) {
    const migration = migrationComparisons[entry.slug];
    expect(migration.notes.length, entry.slug).toBeGreaterThan(0);
    for (const counterpart of migration.counterparts) {
      const key = `${counterpart.slug}/${counterpart.story}`;
      if (seen.has(key)) continue;
      seen.add(key);
      expect(v1[counterpart.slug], key).toBeTypeOf("function");
      expect(v2[counterpart.slug], key).toBeTypeOf("function");
      const [before, after] = await Promise.all([
        v1[counterpart.slug](),
        v2[counterpart.slug](),
      ]);
      const original = prepareStory(
        before,
        counterpart.story,
        counterpart.slug
      );
      const replay = prepareStory(after, counterpart.story, counterpart.slug);
      expect(
        replay.entries.map((story) => story.id),
        key
      ).toEqual(original.entries.map((story) => story.id));
      expect(serializable(replay.initialArgs), key).toEqual(
        serializable(original.initialArgs)
      );
      // The default component and callbacks come from the original source; only its UI imports change.
      expect(replay.title, key).toEqual(original.title);
    }
  }
  expect(Object.keys(v1)).toHaveLength(46); // 45 legacy UI files and the real custom Login OTP.
  expect(Object.keys(v2).sort()).toEqual(Object.keys(v1).sort());
});

test("comparison rewriting remaps real imports including merged owners, without rewriting quoted docs", () => {
  const source =
    'import { SelectField } from "./select-field";\nconst docs = `import { SelectField } from "./select-field"`;\nexport { Button } from "./button";';
  const result = rewriteLegacyStory(
    source,
    "/repo/src/components/ui/select-field.stories.tsx",
    "/repo",
    { "select-field": "select" }
  );
  expect(result).toContain('from "/repo/src/components/ui/v2/select.tsx"');
  expect(result).toContain('from "/repo/src/components/ui/v2/button.tsx"');
  expect(result).toContain('`import { SelectField } from "./select-field"`');
});

test("every Earlier v2 entry loads a real immutable snapshot and replays its same example with current imports", async () => {
  // The production registry must not emit remapped loaders for unrelated saved examples.
  expect(Object.keys(earlier).sort()).toEqual(
    Object.keys(earlierV2Comparisons).sort()
  );
  expect(Object.keys(refreshed).sort()).toEqual(Object.keys(earlier).sort());
  for (const [slug, choice] of Object.entries(earlierV2Comparisons)) {
    expect(migrationComparisons[slug].counterparts).toHaveLength(0);
    const [before, after] = await Promise.all([
      earlier[slug](),
      refreshed[slug](),
    ]);
    const original = prepareStory(before, choice.story, slug);
    const replay = prepareStory(after, choice.story, slug);
    expect(
      replay.entries.map((story) => story.id),
      slug
    ).toEqual(original.entries.map((story) => story.id));
    expect(serializable(replay.initialArgs), slug).toEqual(
      serializable(original.initialArgs)
    );
  }
  expect(earlierV2Comparisons["metric-card"]).toBeUndefined();
  expect(earlierV2Comparisons["empty-states"]).toBeUndefined();
});

test("audit replaces unsupported comparison rows and generic import-only claims while retaining other documentation", () => {
  const original =
    "Summary **v2 design** — existing v1 props remain available, so moving a screen starts with an import-path change.\n\n## Import\n\nimport x\n\n## What changes from v1\n\nwrong dimensions\n\n## Design Tokens\n\nkeep me";
  const result = auditedMigrationDocs(original, migrationComparisons.input);
  expect(result.full).not.toContain("wrong dimensions");
  expect(result.full).not.toContain("moving a screen starts with");
  expect(result.full).toContain("42px field becomes a 44px");
  expect(result.full).toContain("## Design Tokens\n\nkeep me");
  expect(result.full.match(/## What changes from v1/g)).toHaveLength(1);
  expect(
    auditedMigrationDocs("New component", migrationComparisons["metric-card"])
      .full
  ).toContain("new v2 component");
});
