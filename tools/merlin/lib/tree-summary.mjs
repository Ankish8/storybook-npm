/*
 * tree.json → a readable outline.
 *
 * The measured tree is the geometry ground truth, and on a real screen it is several
 * hundred KB of nested JSON — too much to read directly and mostly noise (every
 * decorative vector, every hidden state). This prints the shape: what is nested in
 * what, how big it is, what it says, and which design-system component it is.
 */

const INDENT = "  ";

function box(node) {
  const b = node.absBox;
  if (!b) return "";
  return `[${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.w)}×${Math.round(b.h)}]`;
}

function componentOf(node) {
  const name = node.componentSetName || node.componentName;
  return name ? ` <${name}>` : "";
}

function textOf(node) {
  const characters = node.text?.characters?.trim();
  if (!characters) return "";
  const flat = characters.replace(/\s+/g, " ");
  return ` "${flat.length > 60 ? `${flat.slice(0, 57)}…` : flat}"`;
}

/**
 * @param root the hydrated tree's root node (payload.tree.root)
 * @param options.depth how deep to descend
 * @param options.maxLines a hard stop, so one call cannot flood the transcript
 */
export function summarizeTree(root, { depth = 4, maxLines = 400 } = {}) {
  const lines = [];
  let dropped = 0;

  const walk = (node, level) => {
    if (lines.length >= maxLines) {
      dropped += 1;
      return;
    }
    // Hidden layers are not part of the screen anyone sees; on real files they are
    // most of the tree (closed modals, inactive filter panels).
    if (node.visible === false) return;
    const label = node.inferredName ? `${node.inferredName} (${node.name})` : node.name;
    lines.push(`${INDENT.repeat(level)}${label || node.type} ${box(node)}${componentOf(node)}${textOf(node)}`);
    if (level >= depth) {
      const kids = (node.children ?? []).filter((child) => child.visible !== false).length;
      if (kids > 0) lines.push(`${INDENT.repeat(level + 1)}… ${kids} more inside`);
      return;
    }
    for (const child of node.children ?? []) walk(child, level + 1);
  };

  walk(root, 0);
  // Never truncate silently — a summary that stops early while looking complete is
  // how a whole region of a screen goes unbuilt.
  if (dropped > 0) lines.push(`… output capped at ${maxLines} lines; re-run with --max-lines to see more`);
  return lines.join("\n");
}
