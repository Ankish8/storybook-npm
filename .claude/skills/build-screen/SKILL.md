---
name: build-screen
description: Rebuild one Merlin handoff screen — or a whole flow, as one clickable prototype — from the real myOperator UI components, review it locally, and publish it back to Merlin as the Live view
argument-hint: "Figma URL, screen id(s), or a flow id — or nothing, and I'll ask"
allowed-tools: ["Read", "Write", "Edit", "Bash", "Glob", "Grep", "AskUserQuestion", "Skill", "mcp__merlin", "mcp__plugin_myoperator_merlin"]
---

# Build Screen Workflow

> **Cursor users:** use `/build-screen-cursor` for the Cursor-native version.

You are rebuilding Merlin's dev-handoff designs as working, responsive pages made from
this repo's real components, published back to Merlin where they appear behind the
**Live** toggle beside the Figma design.

**Two shapes, and the input decides which.**

- A **twin** is ONE screen. One file, one Live view on that screen.
- A **prototype** is a whole FLOW: every screen in ONE file with a hash router, so the
  connectors drawn on the Merlin flow board become real navigation — click "Create
  Campaign" and you land on the next screen. One file, one Live view on the board, and
  each member screen's own Live opens the prototype at that screen.

A prototype is the better artifact whenever more than one screen is in play, because a
static frame can never answer "what happens when I click this".

## Two ways to reach Merlin — prefer MCP

**Use the `merlin` MCP tools when they are available. Fall back to the CLI when they
are not.** Never `curl` the Merlin API and never write a fetch against it: both
clients own tokens, refresh, retries and error decoding, and a third would be a third
thing to keep correct.

| What you need | MCP tool (preferred) | CLI fallback |
|---|---|---|
| Who am I, which deployment, is Figma connected | `whoami` | `merlin.mjs whoami --json` |
| List projects | `handoff_list_projects` | `merlin.mjs projects --json` |
| Create a project | `handoff_create_project` | `merlin.mjs projects create "<name>" --json` |
| List screens | `handoff_list_screens` | `merlin.mjs screens <projectId> --json` |
| Import a Figma frame | `handoff_import_screen` | `merlin.mjs import <projectId> "<url>" --wait --json` |
| Poll an import | `handoff_get_screen` | `merlin.mjs status <screenId> --json` |
| The context pack | `handoff_get_screen_context` | `merlin.mjs context <screenId> --out <dir> --json` |
| Existing builds | `handoff_list_twins` | — |
| Publish a build | `handoff_start_twin_upload` → curl PUT → `handoff_finish_twin_upload` | `merlin.mjs push <screenId> <file> --json` |
| Publish inline content | `handoff_publish_twin` | — |
| Show an earlier build | `handoff_activate_twin` | — |
| **Work out what an id IS** | `handoff_resolve_targets` | — |
| **A flow as a build brief** | `handoff_get_flow_context` | — |
| **A flow's prototypes** | `handoff_list_prototypes` | — |
| **Publish a prototype** | `handoff_start_prototype_upload` → curl PUT → `handoff_finish_prototype_upload` | — |
| **Show an earlier prototype** | `handoff_activate_prototype` | — |

**The prototype tools are MCP-only.** The CLI can still build and publish a single
screen; it cannot yet publish a prototype. If the user asked for a flow and only the
CLI is connected, say so plainly and offer either MCP or one twin per screen — do not
silently build something smaller than what was asked for.

In Claude Code the tools are namespaced by the server name, so `whoami` is
`mcp__merlin__whoami`. If the server was added under a different name, the prefix
changes; the tool names after it do not.

**Two commands are LOCAL and stay on the CLI on either path** — they touch no API and
need no session: `scaffold` (copies the twin template) and `tree-summary` (parses a
file on disk).

**ONE WORKING CONNECTION IS ENOUGH. NEVER ASK FOR A SECOND.** Both paths are complete
on their own: whichever of the two answers first does the entire flow, publishing
included. The two clients hold separate tokens, so a machine connected to one is not
connected to the other — and that is precisely why you must not treat a connected CLI
as a reason to also set up MCP, or a connected MCP as a reason to log the CLI in. If
the user has already connected either one, the correct number of further logins is
zero. The only exception is stated at Phase 6, and it is narrow.

**Why MCP is preferred when neither is connected.** It needs no install and no key.
The CLI is the answer for a machine with no browser.

**Deployment.** Whichever client you use, `whoami` reports `app_url`. Say it out loud
in Phase 0 — the user must know which Merlin they are writing to before anything is
created there. MCP is pinned to whatever URL the server was added with; the CLI
defaults to production and takes `--api dev` / `--api prod`.

---

## Phase 0: Preflight

**Where the CLI is.** Installed as a plugin there is no checkout to be "inside", so
resolve it once and use `$MERLIN` everywhere below:

```bash
MERLIN="${CLAUDE_PLUGIN_ROOT:-.}/tools/merlin/merlin.mjs"
```

**Try MCP first.** Call the `whoami` tool.

- **It answers** → you are connected. Report the workspace and `app_url`, note
  `figma_connected`, and go to Phase 1. **Do not mention the CLI at all** — it is not
  needed and offering it reads as a second login the user must do.
- **The tool is missing, or it fails to authorize** → try the CLI. A registered-but-
  unauthorized MCP server is the same situation as no MCP server: fall through
  quietly rather than stopping to fix it.

  ```bash
  node "$MERLIN" whoami --json
  ```

  - **Exit 0** → connected; report the deployment and carry on. **Do not mention MCP**
    — a working CLI is a complete path, and suggesting MCP here is exactly the
    "connect a second time" trap this command exists to avoid.
  - **Exit 2** (`not_logged_in`) → neither client is connected. AskUserQuestion:
    - question: "This machine isn't connected to Merlin yet. How do you want to connect?"
    - header: "Connect"
    - options:
      - `"Add the MCP server (Recommended)"` — "One command, then approve in the
        browser. Nothing to install and nothing to paste."
      - `"Log in the CLI"` — "Opens the browser and connects the command-line tool."
      - `"Paste a setup key"` — "For a machine with no browser. Merlin → Settings →
        Connections → Command line → Generate key."

    **MCP:** give them the command and the URL for the deployment they want, then ask
    them to re-run `/build-screen` once it says connected — a newly added MCP server
    is not visible to the session that is already running.

    ```bash
    claude mcp add --transport http merlin https://basic-monitor-555.convex.site/mcp
    ```

    (dev is `https://acrobatic-bass-678.convex.site/mcp`.)

    **CLI browser login:** run it **in the background** — it blocks for up to five
    minutes waiting for the redirect. It opens the browser itself and prints the URL;
    relay that URL in case the browser did not come to the front, and tell the user to
    click **Approve** in Merlin. Then poll `whoami --json` until it lands.

    ```bash
    node "$MERLIN" login
    ```

    If it is still exit 2 after a couple of minutes, ask whether they approved, or
    offer the key instead. The consent screen needs them signed in to Merlin in that
    browser; if they see a login page, that is what it is asking for.

    **Setup key:** ask them to paste it, then
    `node "$MERLIN" login --key <key>`. The key carries the deployment
    and the client, so it needs no `--api` flag. It works ONCE — if it reports being
    already used, ask for a new one rather than retrying the same one.

  - **Exit 1** → show the error and stop; do not continue against a broken session.

- **Check the workspace.** A twin compiles against the design system's own `src/`,
  so building one needs a local copy of it. This is separate from being connected,
  and it is the only step `/audit-screen` does not need.

  ```bash
  node "$MERLIN" workspace --status --json
  ```

  - **Exit 0** → report the path and commit. If `installed` is false, run
    `node "$MERLIN" workspace` to repair it.
  - **Exit 2** → there is no workspace. AskUserQuestion:
    - question: "Building a screen needs a local copy of the myOperator design
      system. It's a one-time setup — about 500 MB, a couple of minutes."
    - header: "Set up"
    - options:
      - `"Set it up (Recommended)"` — "Downloads the design system and installs it
        once, at ~/.merlin/design-system. You never have to touch it again."
      - `"Audit this screen instead"` — "/audit-screen needs none of this and works
        right now."
      - `"Not now"` — "Stop here."

    On the first option run it **in the background** and stream progress; it clones
    and installs, which takes minutes on a cold cache:

    ```bash
    node "$MERLIN" workspace
    ```

    If it refuses, it names the reason — an old Node, no git, no disk. Relay that
    sentence rather than retrying.

  **Everything from here is relative to that workspace, not to the current
  directory.** Call its path `$WORKSPACE`; `scaffold` already writes into it.

**A dead CLI session reports as `not_logged_in` whatever the cause.** The catch-all in
`merlin.mjs` labels an expired grant and a failed refresh the same way as never having
logged in. If the user says they logged in recently and it still says this, the fix is
the same — log in again — but say that the session expired rather than implying they
never connected.

**Figma.** `whoami` also reports `figma_connected`. If it is false, say so NOW rather
than letting it surface at Phase 2: importing a new screen will fail without it, and
the fix is one click at Settings → Connections → Figma in the app (`app_url` in the
same output). Do **not** stop — building a twin for a screen someone else already
imported needs no Figma at all, which is the usual split between designer and
developer. Only steer away from the "import a new screen" option in Phase 2, and
offer it again once they say they have connected.

Tell the user which deployment is active before going further.

## Phase 0.5: Work out what was pasted

**If `$ARGUMENTS` is empty, skip to Phase 1 and ask.** Otherwise split it on
whitespace and newlines and call `handoff_resolve_targets` with the pieces.

**Do not try to tell a screen id from a flow id by looking.** A Merlin id is an opaque
Convex id and carries no type in its text; guessing would silently build the wrong
thing. The tool answers exactly, and `build_kind` is the decision:

| `build_kind` | What it means | Where to go |
|---|---|---|
| `single_screen` | One screen id | Phase 2, then build a TWIN |
| `prototype_from_flow` | A flow id — screens **and** their wiring | Phase 3F, then build a PROTOTYPE |
| `prototype_from_screens` | Several screen ids, no board between them | Phase 3F, PROTOTYPE with a switcher and **no** wiring |
| `none` | Nothing usable | Phase 1, and say what could not be placed |

A Figma URL still means "import this first" — go to Phase 2 and import it.

A ref that could not be placed comes back as `unknown` **with a reason**. Repeat the
reason to the user; do not drop it silently, and do not abandon the refs that did
resolve. Two good ids out of three is still a two-screen prototype.

**Where the ids come from, if the user asks.** In Merlin: a screen's `…` menu in the
inspector header, or select cards on the dashboard → `…` → *Copy N screen IDs*. A
flow id is on the flow board's own tab menu → *Copy flow ID*.

## Phase 1: Choose the project

Call `handoff_list_projects` (CLI: `projects --json`).

AskUserQuestion with one option per project (label = name, description =
`N screens · updated <relative>`), plus **"Create a new project"**. If the list is
longer than three, put the most recently updated first and leave the rest to "Other".

Creating: ask for the name, then `handoff_create_project` (CLI:
`projects create "<name>" --json`).

## Phase 2: Choose or import the screen

If `$ARGUMENTS` contains a figma.com URL, skip straight to importing it.

Call `handoff_list_screens` with the project id (CLI: `screens <projectId> --json`).

AskUserQuestion over the `ready` screens (label = `frame_name`, description =
`WxH · has a build / no build yet`), plus **"Import a new screen — I'll paste a Figma
link"**.

**Importing over MCP** returns immediately with `status: "importing"`; poll
`handoff_get_screen` until the status leaves that state. It normally takes 10–40
seconds — a Figma read plus two renders — so say what is happening rather than going
quiet. The tool is idempotent on its own arguments, so a retry after a timeout returns
the first import instead of starting a second.

**Importing over the CLI** blocks for you: `import <projectId> "<url>" --wait --json`.

Either way:

- `status: "failed"` → show `errorMessage` verbatim and offer: retry · different link ·
  stop. A missing Figma connection means the signed-in user has not connected Figma in
  Merlin's settings — say exactly that.
- If the chosen screen already has a build, say so: publishing adds a new version and
  becomes the one Live shows. `handoff_list_twins` shows what is already there, and
  `handoff_activate_twin` switches back to an earlier one without rebuilding.

## Phase 3: Read the context pack

Pick a slug from the frame name (kebab-case), then scaffold the workspace — this one
is local and is the same on both paths:

```bash
node "$MERLIN" scaffold <slug> --title "<frame name>" --json
```

**Over MCP**, call `handoff_get_screen_context`. It returns the brief inline (~15–30 kB)
and gives you `preview_url` and `tree_url`. Save the two assets next to the scaffold —
these are public R2 objects, not the Merlin API, so plain `curl` is right here:

```bash
curl -sSL "<preview_url>" -o twins/<slug>/context/preview.png
curl -sSL "<tree_url>"    -o twins/<slug>/context/tree.json
```

**Over the CLI**, one command writes all three files:

```bash
node "$MERLIN" context <screenId> --out twins/<slug>/context --json
```

Then, in this order:

1. **Read the brief** — `ux_brief.copy` (every string, in reading order),
   `ux_brief.controls`, `ux_brief.designSystem` (what the design system offers),
   `annotations`, `comments`, `flows`, `product_brief`. On the MCP path you already
   have it in the tool result; on the CLI path it is
   `twins/<slug>/context/context.json`.

   **THE ANNOTATIONS ARE THE BEHAVIOUR, and they are the half a picture cannot show.**
   A preview shows what a screen looks like at rest; an annotation is where a designer
   wrote what it DOES. Read them before you write any code, not after.

   Each one carries an `anchor` naming the element it is attached to:

   ```json
   { "type": "Behavior",
     "body": "Opens a dropdown with three options: All, Unread, Assigned.",
     "anchor": { "layer_name": "Filter", "text": "Filter by", "component": "Buttons",
                 "present": true } }
   ```

   `anchor.text` is the words ON the control, which is how you find it in the JSX you
   are about to write — match on that first, then `component`, then `layer_name`.

   - `present: false` means the layer was deleted since the note was written. The note
     still stands; you just cannot place it. Implement what it describes where it
     plainly belongs and SAY you had to guess.
   - `anchor: null` means it is about the whole screen.
   - **`attachments` are images of states this frame does not contain** — the dropdown
     open, the field in error, the loading skeleton. They are plain public URLs, so
     `curl` them into `twins/<slug>/context/` and LOOK at them; you are multimodal and
     this is the only evidence of those states that exists.
   - The `type` tells you what kind of thing it is: `Behavior` (what happens on
     interaction), `States` (hover, focus, disabled, loading, empty), `Validation`
     (rules and error copy), `Motion`, `API`, `Requirement`, `Accessibility`,
     `Content`. Build every one you can; where a note describes something you have
     deliberately not built, say which and why.
2. **Read `twins/<slug>/context/preview.png`** — you are multimodal; this is the visual
   ground truth and the only thing that shows colour, weight and rhythm.
3. **Summarise the geometry** — never read the raw tree first, it is hundreds of KB:
   ```bash
   node "$MERLIN" tree-summary twins/<slug>/context/tree.json --depth 5
   ```
   Go into `tree.json` only for a specific node you need an exact value for.

Write a short layout analysis before any code: the regions, the fixed vs fluid
columns, and where the design implies a breakpoint. Do not skip this — it is what
stops the build becoming a pile of divs that happens to look right at one width.

## Phase 3F: Read the flow (prototype path only)

Call `handoff_get_flow_context` with the flow id. It is deliberately small — the
flow's name, its screens with the `route` (#hash) each answers to, and the transitions
between them. It does **not** carry the per-screen briefs.

**If any screen is not `ready`, stop and say which.** A prototype missing a screen its
own wiring points at is a dead link found by whoever is demoing it, not by you. Offer
to build the rest, or to wait.

Scaffold ONE workspace for the whole flow, named after the flow:

```bash
node "$MERLIN" scaffold <flow-slug> --title "<flow name>" --json
```

Then, **per screen, one at a time**, exactly as Phase 3 does for a single screen:
`handoff_get_screen_context`, then `curl` its `preview_url` and `tree_url` into
`twins/<flow-slug>/context/<route>/`, then `tree-summary`. Read each preview image —
it is the visual ground truth. Do not fetch all the briefs first and then start
coding: five briefs is ~75 kB and you will have forgotten the first by the last.

Write a layout analysis per screen, and one paragraph on what the flow as a whole is
for, before any code.

## Phase 4: Build `twins/<slug>/src/App.tsx`

**Components**
- Use the REAL ones: `import { Button } from "@/components/ui/button"`. Per file,
  never from the `@` barrel — the barrel pulls the whole library into the bundle.
- Match design elements to components via `ux_brief.controls[].component` first, then
  the catalog in
  `$WORKSPACE/.claude/plugins/myoperator-design/skills/myoperator-design/references/component-catalog.md`.
- Read a component's source before using it. `EmptyState` takes `title` /
  `description` / `actions`, not children; `Button` has `variant` and `size` axes.
  Guessing an API produces a build that compiles and renders wrong.
- Only hand-roll layout wrappers (`div` with flex/grid). Never re-implement something
  the library already has.
- Tag every design-system usage: `data-component="Button"`. That is what lets Merlin
  name what someone is looking at.

**Copy**
- Verbatim from `ux_brief.copy`. Never paraphrase, never shorten, never invent
  placeholder text. The words are the designer's decision.

**Colour and spacing**
- Semantic token classes only (`bg-semantic-bg-primary`, `text-semantic-text-muted`).
  No hex, no arbitrary colour values.
- **Check what a token IS before using it — never infer from the name.** In this system
  `--semantic-bg-secondary` is `--color-primary-950`, i.e. near-black, not a light
  secondary surface; the light page background is `--semantic-bg-ui`. `$WORKSPACE/src/index.css`
  is the answer. This mistake renders as a black screen and is invisible in code review.

**Layout**
- Desktop matches the measured geometry — real widths from the tree (`lg:w-[496px]`)
  for fixed columns, flex/grid for the rest. No absolute positioning except for true
  overlays.
- Tablet and mobile are **derived**, because the design almost never has frames for
  them. Apply the house rules: a fixed icon rail becomes a bottom bar or a drawer;
  side-by-side panes become one pane with a switcher; tables become stacked cards;
  multi-column grids collapse. Say in a comment that they are derived.

**Behaviour**
- Implement the state the design shows plus its obvious neighbours: a selected tab is
  `useState`, not a hardcoded class. A twin exists to be clicked.
- `annotations` are behaviour notes — implement the trivial ones ("paginates at 25"),
  and leave a comment naming any you could not.
- `flows` are this screen's real transitions. Render them as inert controls with a
  comment naming the destination screen; a twin is one screen, not an app.
- Images and illustrations become neutral placeholder blocks or a lucide icon —
  asset export is not part of this workflow. Tell the user which ones you stubbed.

### Prototype path: one app, many screens

The workspace holds every screen and ONE router:

```
twins/<flow-slug>/src/
  screens/<route>.tsx     one component per screen, each built by the rules above
  flow.ts                 the transitions, copied from handoff_get_flow_context
  App.tsx                 the router
```

**The router is the hash, and nothing more.** `useState` seeded from
`location.hash.slice(1)`, a `hashchange` listener, and a fallback to the first route
when the hash names nothing. No router library: the whole point is one self-contained
file, and `history.pushState` does not survive an opaque-origin iframe.

**Wire the transitions from `source_layer_name`.** Each transition names the control
that causes it — the words ON the control ("Create Campaign"), which is how you find
it in the JSX you just wrote. Give that element an `onClick` that sets the hash.

**A transition you cannot place stays UNWIRED, and you say so.** Do not attach it to a
plausible-looking button instead: a prototype that navigates from the wrong control is
worse than one that does not navigate at all, because only the second is obvious. List
what you could not wire when you hand the build over.

**Every screen is reachable even with no wiring at all.** Render a small fixed screen
switcher — a row of route names, current one marked — so `prototype_from_screens` (no
board, no transitions) is still walkable, and so a half-wired flow is never a dead end.
Keep it out of the way; it is scaffolding, not part of the design.

**Each screen keeps its own real geometry.** Do not average the screens into one
layout: they are different pages, and the switcher is chrome around them, not a frame
they have to fit.

## Phase 5: Review locally

```bash
cd twins/<slug> && npx vite --host 127.0.0.1
```

Give the user the URL and ask them to check it at 375, 768 and 1440. Iterate on
feedback, editing only `twins/<slug>/src/`. This is the gate: nothing reaches Merlin
that the person who asked for it has not looked at.

## Phase 6: Build and publish

```bash
cd twins/<slug> && npx vite build
```

Report the size of `dist/index.html` (one self-contained file; ~350 kB is normal,
over 5 MB deserves a question).

**Over MCP — three steps, and the file never enters the conversation.** Do NOT read
the build and pass it as a tool argument: a bundled twin is 130-350 kB of minified
HTML on one line, relaying it is slow and expensive, and one wrong character corrupts
it.

```bash
wc -c < twins/<slug>/dist/index.html          # the size the first tool needs
```

1. `handoff_start_twin_upload` with `screen_id`, that `size_bytes`, a `label`, and the
   screen's `rev` as `built_from_rev` so staleness can be reported later. It returns a
   one-time upload URL.
2. Stream the file straight from disk — this PUT goes to R2, not to the Merlin API, so
   it carries no token and needs no session:

   ```bash
   curl -sS -X PUT --data-binary @twins/<slug>/dist/index.html \
     -H 'content-type: text/html; charset=utf-8' '<upload.url>'
   ```

3. `handoff_finish_twin_upload` with the `twin_id`. It verifies the object arrived, is
   `text/html` and within the limit, then makes it the active build.

`handoff_publish_twin` exists for content you are authoring inline — a placeholder, a
test page. It is the wrong tool for a bundler's output.

**Publishing a PROTOTYPE — the same three steps, different tools.**

```bash
wc -c < twins/<flow-slug>/dist/index.html
```

1. `handoff_start_prototype_upload` with `flow_id`, that `size_bytes`, a `label`, and
   `routes` — one `{screen_id, route}` per screen, and the `route` values MUST be the
   hashes your router actually answers to. They are what each screen's Live view deep-
   links to; a route the HTML has no component for is a link to nothing.
2. The same `curl -X PUT` to the returned URL.
3. `handoff_finish_prototype_upload` with the `prototype_id`.

Then tell the user where it landed: the flow board's **Live** button, and every member
screen's own Live toggle, which now opens the prototype at that screen. Expect a
prototype to be larger than a twin — the screens share the design system, so five
screens is roughly 600-800 kB against a 10 MB ceiling, not five times one screen.

**Over the CLI — one step**, which streams from disk the same way:

```bash
node "$MERLIN" push <screenId> twins/<slug>/dist/index.html --label "<slug> — <date>" --json
```

**Neither path needs the other.** If you got here over MCP, publish over MCP; if over
the CLI, publish over the CLI. The one narrow exception: `handoff_publish_twin`'s
inline limit is 2 MiB, but the upload path above has the same 10 MiB ceiling as the
CLI, so a build only forces a switch if it exceeds 10 MiB — which would be a broken
build worth questioning rather than publishing.

Print the returned URL, and tell the user it is now behind the **Live** toggle on that
screen in Merlin. Mention that `twins/` is gitignored local scratch — the uploaded
HTML is the artifact — and that re-running the build and publishing again creates a new
version, with `handoff_activate_twin` to switch back to an earlier one.
