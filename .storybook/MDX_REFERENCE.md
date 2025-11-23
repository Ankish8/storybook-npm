# Storybook 10 MDX Reference

## IMPORTANT: Do not change these imports!

For MDX documentation files in this project, always use:

```javascript
import { Meta } from '@storybook/addon-docs/blocks';
import { Meta, Source } from '@storybook/addon-docs/blocks';
```

## Example MDX file structure:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Page Title" />

# Content here...
```

## DO NOT USE:
- `@storybook/blocks` (not installed, causes errors)
- `@storybook/addon-docs` (missing /blocks path)
- `export default { title: '...' }` (wrong format for this version)

## Why this matters:
Storybook 10 requires the `/blocks` subpath from `@storybook/addon-docs`.
The `Meta` component is exported from this path, not from the root package.

Last verified working: 2025-11-21
