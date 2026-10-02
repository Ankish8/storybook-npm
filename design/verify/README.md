# Verification kit for v2 components

Everything the v2 Button was verified with, so the next component can be verified the same way.
Run all commands from the repo root (`/Users/ankish/Downloads/Code/storybook-npm-v2`).

| Tool | Proves | Run |
| --- | --- | --- |
| `story-states.check.js` | Computed styles of every variant x state match the recorded spec (Button: 493 checks, 0 mismatches) | paste into the console on the `States` story iframe (see header in the file) |
| `dead-classes.mjs` | Every class in the shipped file generates CSS in an UNPREFIXED Tailwind build (no dead classes) | `node design/verify/dead-classes.mjs <file.tsx>` |
| the recipes below | v1 output unchanged, consumer install correct, tailwind-merge behaves in both versions | copy/paste |

## 1. Consumer simulation (what a real project receives)

```bash
cd packages/cli && npm run build && cd ../..          # rebuilds the CLI (also runs all validators)
S=$(mktemp -d) && cd "$S"
echo '{"name":"scratch","version":"0.0.0"}' > package.json
# prefixed project (like the web panel). For an unprefixed project use "prefix":"".
cat > components.json <<'EOF'
{"$schema":"https://myoperator.com/schema.json","style":"default","tailwind":{"config":"tailwind.config.js","css":"src/App.scss","baseColor":"slate","cssVariables":true,"prefix":"tw-"},"aliases":{"components":"@/components","utils":"@/lib/utils","ui":"@/components/ui"}}
EOF
node /Users/ankish/Downloads/Code/storybook-npm-v2/packages/cli/dist/index.js add v2-button button --yes --no-install --path src/components/ui
```

Expect: `src/components/ui/v2/button.tsx` (v2, **no `tw-`**, byte-identical to the source except
`@/lib/utils` -> `../../../lib/utils`) and `src/components/ui/button.tsx` (v1, prefixed). In a project
whose prefix is non-empty the CLI prints a yellow warning that v2 uses plain Tailwind classes.
Then `node design/verify/dead-classes.mjs "$S/src/components/ui/v2/button.tsx"` must report 0 dead.

## 2. Prove v1 output did not change (do this whenever you touch the generator, prefixer or components.yaml structure)

Create a TEMPORARY test `packages/cli/src/__tests__/zz-dump.test.ts` (delete it afterwards):

```ts
import { it } from "vitest";
import fs from "fs";
import { getRegistry } from "../utils/registry.js";
it("dump prefixed registry", async () => {
  fs.writeFileSync(process.env.DUMP_OUT as string, JSON.stringify(await getRegistry("tw-"), null, 1));
});
```

```bash
cd packages/cli
git stash -q   # or checkout a clean state; the point is a BEFORE dump from the code you are comparing against
npm run generate-registry && DUMP_OUT=/tmp/before.json npx vitest run src/__tests__/zz-dump.test.ts
git stash pop -q
npm run generate-registry && DUMP_OUT=/tmp/after.json npx vitest run src/__tests__/zz-dump.test.ts
node -e "
const a=require('/tmp/before.json'),b=require('/tmp/after.json');
const names=[...new Set([...Object.keys(a),...Object.keys(b)])];
const changed=names.filter(n=>JSON.stringify(a[n])!==JSON.stringify(b[n]));
console.log('compared',names.length,'| changed',changed);
"
```

Only `v2-*` entries may differ. (When this was done for the Button spike: 126 components compared,
0 v1 components changed, only `v2-button`.) Remember `packages/cli/src/utils/registry-*.ts` and
`registry.ts` are generated but TRACKED, so they show as modified after `generate-registry`.

## 3. tailwind-merge: Storybook and consumers use different majors

Root `package.json` has `tailwind-merge ^3.4.0`; consumers (CLI `components.yaml`, web panel 2.6.1) use `^2.6.0`.
A class list must survive BOTH. Test any risky combination (outline, ring, shadow, border, text-*):

```bash
mkdir -p /tmp/twm2 && cd /tmp/twm2 && npm i tailwind-merge@2.6.0 --silent
node -e "
const v2=require('/tmp/twm2/node_modules/tailwind-merge').twMerge;
const v3=require('/Users/ankish/Downloads/Code/storybook-npm-v2/node_modules/tailwind-merge').twMerge;
const s='focus-visible:outline focus-visible:outline-1';           // <- the string under test
console.log('2.6 keeps all:', v2(s)===s, '| 3.4 keeps all:', v3(s)===s);
"
```

(`focus-visible:outline focus-visible:outline-1` loses `outline` on 3.4, which is why the Button
uses `focus-visible:[outline-width:1px]`.) The test passes only when both say `true`.

## 4. Real Tailwind probe (does a class generate CSS under a prefix?)

```bash
cd /tmp && mkdir -p twprefix && cd twprefix
echo 'module.exports={prefix:"tw-",important:true,content:["./probe.html"],corePlugins:{preflight:false}}' > tailwind.config.cjs
echo '<div class="tw-[outline-style:solid] [outline-offset:3px] tw-flex"></div>' > probe.html
echo '@tailwind utilities;' > in.css
/Users/ankish/Downloads/Code/storybook-npm-v2/node_modules/.bin/tailwindcss -c tailwind.config.cjs -i in.css -o out.css && cat out.css
```

Result seen in this repo (Tailwind 3.4.18): `tw-[outline-style:solid]` produces NO css; `[outline-offset:3px]` does.
Arbitrary properties are never prefixed - which is the v1 prefixer bug described in `design/V2-HANDOFF.md`.


## A1 continuation checks

- `batch-one-states.check.js`: one read-only expectations table for Badge/Tag default variant x size and Input/Checkbox/Switch interactive state matrices; use their States iframe (static components: Variants and sizes).
- `npx tsc -p design/verify/tsconfig.api-parity.json --noEmit`: exact public type equality for the five A1 components, TagGroup and CheckedState.
- `node design/verify/consumer-install.mjs`: install all 56 completed v2 components and the v1 Button into two temporary consumer projects.
- `node design/verify/merge-majors.mjs <absolute-path-to-tailwind-merge-2.6>`: confirm risky utility combinations with both merge majors.
- Final evidence and remaining decisions: `design/V2-BATCH-1-VERIFICATION.md`.

## Completed-library verification

The final inventory and proof boundaries are in `design/V2-COMPLETION.md`. The shipped source and story config is `design/verify/tsconfig.all-stories.json`; it explicitly includes all 56 stories because the normal app config excludes stories. `final-source-proof.json` records the source comparison, `final-story-index.json` records all 56 Docs pages/747 stories/three guides, and `v1-metadata-proof.json`/`v1-output-proof.json` record unchanged v1 definitions.

Do not stash, reset, restore or replace user changes to run verification. Use an isolated temporary copy instead. The current workspace's pre-existing legacy IVR deletion remains untouched; `final-snapshot-context.json` identifies the single HEAD file overlaid only in the verification copy used for the production build. Generated registries can be copied back only after the current v2 source bytes match that copy and all build/consumer checks pass.

Native DOM events are not safe action-log payloads in every Storybook browser context. The final event review reports explain the small story-only adapters: real callbacks keep their API; named spies receive strings, serializable destination records or zero arguments. Interactive Usage state continues to share `useArgs`.
