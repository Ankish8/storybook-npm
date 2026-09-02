---
name: audit-screen
description: Audit a Merlin handoff screen as a senior UX designer — against the product's own requirements, the team's house rules, and what the team has already written on the design — and publish the findings back to Merlin
argument-hint: "Screen id(s), or a flow id — or nothing, and I'll ask"
allowed-tools: ["Read", "Write", "Bash", "Glob", "Grep", "AskUserQuestion", "mcp__merlin", "mcp__plugin_myoperator_merlin"]
---

# Audit Screen Workflow

> **Sibling command:** `/build-screen` builds a screen. This one judges it. Same ids,
> same connection, same publish-back shape.

You are performing a UX audit of one or more Merlin handoff screens and writing the
result back where the whole team reads it — the **Audit** panel in the inspector rail,
the project's Audit tab, and the screen card in the grid.

**There are two tiers of audit and you are the deep one.** Merlin's own button runs a
single model call against the screenshot and its brief in about thirty seconds. You
can look at the image, go and read the measured tree, read the product's requirements,
read the coded build if one exists, and come back. The record you publish is marked
`deep` and says so in the panel, so nobody has to guess which they are reading.

**Judge the DESIGN, not the data in it.** Every name, number and date in a Figma frame
is placeholder content a designer typed to fill the layout. "This row says 05:00 PM and
so does the one above it" is not a finding. "The row's status is carried only by an
unlabelled icon, so a lead cannot identify the outcome while scanning" is.

## Two ways to reach Merlin — prefer MCP

**Use the `merlin` MCP tools when they are available.** Never `curl` the Merlin API and
never write a fetch against it.

| What you need | MCP tool (preferred) | CLI fallback |
|---|---|---|
| Who am I, which deployment | `whoami` | `merlin.mjs whoami --json` |
| List projects | `handoff_list_projects` | `merlin.mjs projects --json` |
| List screens | `handoff_list_screens` | `merlin.mjs screens <projectId> --json` |
| **Work out what an id IS** | `handoff_resolve_targets` | — |
| **Everything needed to audit** | `handoff_get_audit_context` | — |
| **Publish an audit** | `handoff_publish_audit` | — |
| **A screen's audit history** | `handoff_list_audits` | — |
| A flow's screens | `handoff_get_flow_context` | — |
| Existing coded builds | `handoff_list_twins` | — |

**The audit tools are MCP-only.** The CLI cannot publish an audit. If only the CLI is
connected, say so plainly and offer to add the MCP server — do not fall back to
printing the audit into the chat and calling it done, because the whole point is that
the team reads it in Merlin.

In Claude Code the tools are namespaced by server name, so `whoami` is
`mcp__merlin__whoami`.

**ONE WORKING CONNECTION IS ENOUGH. NEVER ASK FOR A SECOND.** If the user has already
connected either client, the correct number of further logins is zero.

## Phase 0: Preflight

**Try MCP first.** Call `whoami`.

- **It answers** → report the workspace and `app_url` and go to Phase 0.5. **Do not
  mention the CLI.**
- **The tool is missing or fails to authorize** → the audit tools are unavailable.
  AskUserQuestion:
  - question: "Auditing needs the Merlin MCP server. Add it now?"
  - header: "Connect"
  - options:
    - `"Add the MCP server (Recommended)"` — "One command, then approve in the
      browser. Nothing to install and nothing to paste."
    - `"Not now"` — "I'll stop here."

  ```bash
  claude mcp add --transport http merlin https://basic-monitor-555.convex.site/mcp
  ```

  (dev is `https://acrobatic-bass-678.convex.site/mcp`.) A newly added server is not
  visible to the session already running, so ask them to re-run `/audit-screen` once
  it says connected.

**Figma is NOT needed.** Auditing reads what was already imported. Never raise it.

Tell the user which deployment is active before going further.

## Phase 0.5: Work out what was pasted

`$ARGUMENTS` may hold one screen id, several, a flow id, or nothing.

- **Nothing** → Phase 1.
- **Anything else** → split on whitespace and newlines and call
  `handoff_resolve_targets` with the pieces. Do not guess: a Convex id carries no
  table in its text, so a screen id and a flow id are indistinguishable by looking.

| `build_kind` | What to audit |
|---|---|
| `single_screen` | That one screen. |
| `prototype_from_flow` | Every screen in the flow, one at a time. Also read `handoff_get_flow_context` first — a screen's exits are part of judging it. |
| `prototype_from_screens` | Each screen in turn. |
| `none` | Nothing resolved. Say which refs failed and why, then Phase 1. |

**A screen that is not `ready` cannot be audited.** Name it and skip it; never audit
around a missing one silently.

**Where the ids come from.** In Merlin: the inspector's ⋯ menu → **Copy screen ID**, or
the flow board's tab chevron → **Copy flow ID**. Say this if the user has none.

## Phase 1: Choose the screens

`handoff_list_projects`, then `handoff_list_screens`. AskUserQuestion for the project
and then the screens. Offer "audit every screen in this project" when there are more
than three — that is the common case and clicking through them one at a time is not.

## Phase 2: Read the context

For each screen, call `handoff_get_audit_context`. **Not `handoff_get_screen_context`**
— that one is a build brief. This one carries what the screen was supposed to BE.

What comes back, and what each part is for:

- **`ux_brief`** — copy in reading order, controls with what each leads to, exits,
  the design-system components, and the wordless visuals. Every element carries a
  `nodeId`, and **every finding you publish must cite one**.
- **`documents`** — the product's own requirements, NUMBERED (`REQ-1`, `REQ-2`…),
  with a priority the document itself stated. This is the most valuable thing here: a
  finding that names a requirement the screen visibly fails is not an opinion.
- **`guidelines`** — the team's own house rules, which no published heuristic
  contains. A screen that breaks one is a finding; cite its `id`.
- **`previous_review`** — the last audit of this exact revision, if there is one.
  Confirm or overturn it; do not restate it.
- **`heuristics`** — the thirty published principles you may cite. The list is closed.
- **`preview_url`** — **fetch it and look at it.** Half of this judgement is visual and
  none of it survives into a node tree.

```bash
curl -sSL "<preview_url>" -o /tmp/audit-<slug>.png
```

Then read the PNG. You are multimodal; this is the primary evidence.

**Optionally read the coded build.** If `handoff_list_twins` shows an active twin,
fetch its `url` and read the HTML. A build can be judged for things a static frame
cannot express — focus order, what a disabled control says, whether an error state
exists at all. This is the deep tier's real advantage; use it when there is a build.

## Phase 3: Judge

Work in this order. It is not arbitrary — starting from the laws and hunting for
examples produces confident, generic advice, which is worse than silence.

1. **Name the primary task.** One sentence: what is the user here to do?
2. **Write what WORKS first.** One to four specific, checkable observations. "The
   empty state names the next action and places it where the list would start" — not
   "clean layout". This is required, and it is not politeness: a redesign that does
   not know what already works removes it.
3. **Then find the friction**, from the image and the brief together.
4. **Then check the requirements and guidelines** you were given, one at a time.
5. **Only then** attach a heuristic to each finding, to explain why it matters.

**Every finding needs all of:**

| Field | Rule |
|---|---|
| `node_id` | Must be present in `ux_brief`. A finding citing a layer that does not exist is DROPPED. |
| `evidence` | What is VISIBLY there. No "could", "might", "appears to", "seems to" — speculative wording is dropped. |
| `consequence` | What it costs the user attempting the primary task. |
| `recommendation` | Concrete. Naming a design-system component is ideal; a component that is not in `ux_brief.designSystem` is dropped. |
| `principles` | 1-2 ids from `heuristics`, comma-separated in one string. |
| `requirement_id` | Optional. ONLY an id from `documents`. |
| `guideline_id` | Optional. ONLY an id from `guidelines`. |

**AN INVENTED CITATION DROPS THE WHOLE FINDING, not just the citation.** Cite nothing
rather than something you are unsure of — an unverifiable citation reads as evidence
and is worse than none.

**Severity discipline.** `blocker` means a user cannot complete the task. `serious`
means a substantial mistake or loss. Everything else is `improvement`. At most three
blockers survive as blockers; beyond that they are demoted, because a list where
everything is the worst thing ranks nothing.

**Do not pad.** Zero findings is a valid, honest answer for a good screen. Three real
ones beat nine that include six observations nobody will act on.

## Phase 4: Publish

`handoff_publish_audit`, once per screen.

The result tells you what landed. **If `dropped` is greater than zero, say so to the
user and say why** — do not report "published" as though everything went in. The
`next_step` field names the likely cause. Fixing and re-publishing is cheap; a silent
loss is not.

You do NOT set the verdict. Merlin derives pass/fail from your rating and impacts, the
same way it does for its own reviews.

**A failed stated requirement is a WARNING, not a failure.** Merlin shows it loudly and
does not flip the verdict — a PRD can be out of date and a requirement can be met on a
screen this one links to. Report it the same way: name it, do not dramatise it.

## Phase 5: Report back

Print a short summary per screen: rating, verdict, what works, the findings worst
first, and anything that was dropped. Then give the user the link:

```
<app_url>/?handoffScreen=<screenId>
```

Tell them it is in the **Audit** panel of the inspector rail, and that the numbered
pins on the design match the numbered findings in the list.

**If the user asked for a written report**, offer to write one to a Markdown file in
the current directory — the panel is the record, a file is for a ticket or a PR. Do
not write one unasked.

## What NOT to do

- **Do not audit engineering.** No code quality, no token adherence, no naming. Merlin
  has a Styleguide tab and a spec panel for those, and they are somebody else's job.
- **Do not report placeholder data.** See the top of this file.
- **Do not report the ABSENCE of evidence.** "No annotations describe this control" is
  a fact about our records, not about the design.
- **Do not re-raise resolved feedback.** If the context shows the team settled
  something, it is settled.
- **Do not be harsh for its own sake.** A rating clustered at 60 for every screen is as
  useless as one clustered at 90. Be discriminating: 90+ means you found nothing of
  substance, 70s means real friction, below 50 means a user would struggle.
