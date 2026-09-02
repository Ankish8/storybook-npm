---
name: setup
description: Get this machine ready for Merlin handoff work — connect Merlin and download the myOperator design system, in one step. Run it once after installing the plugin.
allowed-tools: ["Bash", "AskUserQuestion", "mcp__merlin", "mcp__plugin_myoperator_merlin"]
---

# Setting this machine up

Do the whole setup in one pass and report what happened. **Ask before downloading
anything**, and never leave the user guessing which half worked.

There are exactly two things to get right, and they are independent — if one fails,
finish the other and say so plainly.

---

## 1. Connect Merlin

The plugin ships Merlin's MCP server, so this usually needs no configuration at all —
the first tool call opens a browser to approve.

Call the `whoami` tool.

- **It answers** → report the workspace and `app_url` in one line. Say which Merlin
  they are connected to; somebody with access to more than one deployment must not have
  to guess.
- **It is missing, or fails to authorize** → tell them the first call opens a browser
  and ask them to approve it, then try once more. If it still fails, stop on this half
  and say what to check: they must be signed in to Merlin in that browser, on the same
  account.

**Do not offer a second way to connect.** The CLI login exists for a machine with no
browser, and offering it here turns one working path into a choice nobody asked for.

---

## 2. Download the design system

A screen built from a handoff compiles against the design system's own components, so
building needs a local copy of it. Auditing does not.

Resolve the CLI once — installed as a plugin there is no checkout to be "inside":

```bash
MERLIN="${CLAUDE_PLUGIN_ROOT:-.}/tools/merlin/merlin.mjs"
node "$MERLIN" workspace --status --json
```

- **Exit 0** → it is already set up. Report the path and the commit. If `installed` is
  false, run `node "$MERLIN" workspace` to repair it.
- **Exit 2** → there is none yet. **Ask first**, with AskUserQuestion:
  - question: "Download the myOperator design system? It's a one-time setup — about
    500 MB and a couple of minutes."
  - header: "Design system"
  - options:
    - `"Download it (Recommended)"` — "Needed to build screens. Lands in
      ~/.merlin/design-system; you never have to open it."
    - `"Skip for now"` — "/audit-screen works without it. /build-screen will offer
      again when you first run it."

  On the first option, run it **in the background** and stream progress — it clones and
  installs, which takes minutes on a cold cache:

  ```bash
  node "$MERLIN" workspace
  ```

  If it refuses, it names the reason — an old Node, no git, no disk space. **Relay that
  sentence and stop**; do not retry it or attempt to fix their machine.

---

## 3. Say where they stand

Finish with a short report, not a wall. Name the two halves and what each did, then the
one next thing to do:

- Both worked → `/build-screen <screen id>` builds a screen; `/audit-screen <screen id>`
  reviews one. Tell them ids come from Merlin's **Copy screen ID** menu.
- Connected, design system skipped or failed → `/audit-screen` works now; `/build-screen`
  will offer the download again.
- Not connected → nothing will work until that is fixed. Say what to check and stop.

Do not restate what they already saw scroll past, and do not congratulate them.
