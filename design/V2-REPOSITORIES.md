# Paired GitHub review snapshots — 2026-10-02

The user authorized committing and pushing the current UI work to separate review branches. Review ID and branch name: `codex/ui-v2-review-2026-10-02`.

| Repository | Visibility | Reviewed revision |
| --- | --- | --- |
| [storybook-npm](https://github.com/Ankish8/storybook-npm/tree/codex/ui-v2-review-2026-10-02) | Public, existing repository | Component/story source: [`f3cb1d3408e3504037618910c10cfeea5e7cd882`](https://github.com/Ankish8/storybook-npm/commit/f3cb1d3408e3504037618910c10cfeea5e7cd882); this coordination note follows it |
| [myoperator-web-ui](https://github.com/Ankish8/myoperator-web-ui/tree/codex/ui-v2-review-2026-10-02) | Private, created for this backup | [`176609246617ec84aa3a01cf62124884b8401ef8`](https://github.com/Ankish8/myoperator-web-ui/commit/176609246617ec84aa3a01cf62124884b8401ef8) |

The frontend revision includes the existing UI commit history through `f057a41125c82b9dcdc7dd7ec6fc8ae1f8b19f7a` plus its coordination note. Its React source tree is unchanged by the backup. The library component/story revision above contains the reviewed v2 work, the user's existing story/verification edits, all three authored v2 guides and the captured review evidence.

## Ownership and synchronization

- **Storybook** owns reusable components, tokens, stories, tests and CLI registry generation.
- **Frontend** owns product pages, sidebar/chat/bot UI, routing and app integration.
- Shared component changes start in the library; app integration is reviewed in the frontend repository using a recorded library revision.
- The current frontend snapshot contains an earlier in-place port of copied UI components. The library has the subsequent gray text and font-weight refinements. These review snapshots identify two independent code states; synchronization is an explicit integration step.
- v1 preserves `tw-` support. Library v2 is additive and unprefixed; the frontend currently uses a prefixed Tailwind build alongside Bootstrap.

Use the same review branch name to find this pair. Each repository has its own commits and merge process. Record the exact library revision consumed by an app change; later documentation-only commits need not change that code dependency.

## Verification and saved scope

The [text hierarchy review](V2-TEXT-HIERARCHY-REVIEW.md) records 56 components, the 772-story production build, browser coverage, 1,292 component tests, CLI checks and v1 preservation. All 121 reviewed build-source files matched the staged library source before the component commit.

The v2 guide pages were previously hidden by the broad `docs` ignore rule. The snapshot includes them and adds a scoped exception for authored `src/docs/v2/` content. Field review captures are stored in `design/review/text-hierarchy-fields/`, with the original evidence also preserved locally.

The Docker wrapper is a separate clean repository; the UI changes belong to the actual frontend Git worktree. GitHub frontend pushes use its new `github` remote; its original company GitLab `origin` remains configured.

Library `main` was `e98903e1c1d5a48e7b9e04e69d4ee827025182d6` before these review-branch pushes. Existing branches remain rollback points. Merges, package releases and deployments require their own authorization.
