# Practice components

A sandbox for **learning to build components and Storybook stories** — separate from the
published `myoperator-ui` library.

These components are intentionally isolated:

- **Not** listed in `packages/cli/components.yaml`, so they never ship via the CLI.
- **Not** in `src/components/ui` or `src/components/custom`, so the pre-commit hooks
  (test-required, bootstrap-compat, api snapshot, registry generation) ignore them.
- **Still** picked up by Storybook via its `src/**/*.stories.tsx` glob and grouped under
  the **`Practice/`** section in the sidebar.

They do follow the house style so they're realistic practice: `cva` + `cn`, semantic color
tokens (no hardcoded hex), `forwardRef`, and `m-0` on every `<p>`.

## What's here

| Component              | Practicing…                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `Callout`              | `variant` selects, default icons, a dismissible state, boolean control |
| `StatCard`             | composition, conditional trend coloring, a comparison grid story   |
| `StarRating`           | React state, controlled vs uncontrolled, `onChange` actions, hover |

## View them

```bash
npm run storybook
```

Then open the **Practice** group in the sidebar. Try the **Controls** and **Actions** tabs.
