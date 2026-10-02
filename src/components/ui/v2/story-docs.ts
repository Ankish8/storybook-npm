type Token = [label: string, variable: string, value: string, swatch?: string];
type Change = [aspect: string, v1: string, v2: string];

const neutralTokens: Token[] = [
  ["Heading and selected text", "--v2-text-primary", "#484848", "#484848"],
  ["Body and field values", "--v2-text-secondary", "#5E5E5E", "#5E5E5E"],
  ["Supporting text", "--v2-text-muted", "#707070", "#707070"],
  ["Placeholder text", "--v2-text-placeholder", "#707070", "#707070"],
];

function textTokens(tokens: Token[]): Token[] {
  const updated = tokens.map((token) => {
    const role = token[1].replace(/^--(?:semantic|v2)-text-/, "");
    const neutral = neutralTokens.find(
      (entry) => entry[1] === "--v2-text-" + role
    );
    return neutral ? ([token[0], ...neutral.slice(1)] as Token) : token;
  });
  return [
    ...updated,
    ...neutralTokens.filter(
      (token) => !updated.some((entry) => entry[1] === token[1])
    ),
  ];
}

const cell = (value: string) =>
  // Storybook parses Markdown inside HTML cells. A leading color hash must
  // remain text instead of becoming an ATX heading.
  '<td style="padding:12px 16px">' + value.replace(/^#/, "\\#") + "</td>";
const header = (labels: string[]) =>
  '<thead><tr style="background-color:#FAFAFA;border-bottom:2px solid #E9EAEB">' +
  labels
    .map(
      (label) =>
        '<th style="padding:12px 16px;text-align:left;font-weight:500">' +
        label +
        "</th>"
    )
    .join("") +
  "</tr></thead>";
const table = (labels: string[], rows: string[]) =>
  '<table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">' +
  header(labels) +
  "<tbody>" +
  rows.join("") +
  "</tbody></table>";

export function v2ComponentDocs({
  name,
  summary,
  changes,
  tokens,
  guidance = "",
  hasV1 = true,
  exportName,
}: {
  name: string;
  summary: string;
  changes: Change[];
  tokens: Token[];
  guidance?: string;
  hasV1?: boolean;
  exportName?: string;
}) {
  const component =
    exportName ||
    name
      .split("-")
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join("");
  return (
    summary +
    (hasV1
      ? " **v2 design** — existing v1 props remain available, so moving a screen starts with an import-path change."
      : " **v2 design** — a new component from the v2 Figma library.") +
    "\n\n```bash\nnpx myoperator-ui add v2-" +
    name +
    "\n```" +
    "\n\n## Import\n\n```tsx\nimport { " +
    component +
    ' } from "@/components/ui/v2/' +
    name +
    '"\n```' +
    "\n\n## Unprefixed Tailwind\n\nv1 components ship with a `tw-` class prefix for Bootstrap hosts. **v2 does not** — it installs exactly as written. Your project must build Tailwind **without** a prefix and define the semantic colors (`npx myoperator-ui init` with an empty prefix does both). v1 output is unchanged." +
    (hasV1
      ? "\n\n## What changes from v1\n\n"
      : "\n\n## Design specification\n\n") +
    table(
      hasV1 ? ["Aspect", "v1", "v2"] : ["Aspect", "v2"],
      changes.map(
        (row) =>
          '<tr style="border-bottom:1px solid #E9EAEB">' +
          (hasV1 ? row : [row[0], row[2]]).map(cell).join("") +
          "</tr>"
      )
    ) +
    "\n\n## Text hierarchy\n\nV2 uses neutral charcoal headings, medium gray body text and lighter supporting text. These v2-only variables replace the original Figma text colors following the October 2 visual refinement. Brand actions, status colors and v1 tokens retain their existing values. Each text utility includes a fallback, so the component works before these optional theme overrides are added.\n\n## Design Tokens\n\n" +
    table(
      ["Token", "CSS Variable", "Value", "Preview"],
      textTokens(tokens).map(
        ([label, variable, value, swatch]) =>
          '<tr style="border-bottom:1px solid #E9EAEB">' +
          cell(label) +
          cell(
            '<code style="background:#F5F5F5;padding:2px 6px;border-radius:4px;font-size:12px">' +
              variable +
              "</code>"
          ) +
          '<td style="padding:12px 16px;font-family:monospace;font-size:13px!important">' +
          "<span>" +
          value.replace(/^#/, "\\#") +
          "</span>" +
          "</td>" +
          cell(
            swatch
              ? '<div style="width:32px;height:32px;background:' +
                  swatch +
                  ';border-radius:6px;border:1px solid #E9EAEB"></div>'
              : "—"
          ) +
          "</tr>"
      )
    ) +
    (guidance ? "\n\n## Usage guidance\n\n" + guidance : "")
  );
}
