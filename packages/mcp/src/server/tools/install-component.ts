import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import { promisify } from "util";
import { getComponentNames, componentMetadata } from "../../data/metadata.js";

const execAsync = promisify(exec);

// Natural language patterns to component mappings
const componentPatterns: Record<string, string[]> = {
  // Form-related patterns
  "login form": ["text-field", "button", "checkbox"],
  "signup form": ["text-field", "button", "checkbox"],
  "registration form": ["text-field", "button", "checkbox", "select-field"],
  "contact form": ["text-field", "button"],
  "search form": ["input", "button"],
  "settings form": ["text-field", "toggle", "select-field", "button"],

  // Input patterns
  "form input": ["text-field"],
  "text input": ["input", "text-field"],
  "email input": ["text-field"],
  "password input": ["text-field"],
  "search input": ["input"],
  "form fields": ["text-field", "select-field", "checkbox"],

  // Selection patterns
  "dropdown": ["select", "select-field", "dropdown-menu"],
  "select": ["select", "select-field"],
  "multi select": ["multi-select"],
  "multiselect": ["multi-select"],
  "tags input": ["multi-select"],
  "checkbox group": ["checkbox"],
  "toggle switch": ["toggle"],
  "switch": ["toggle"],

  // Layout patterns
  "accordion": ["collapsible"],
  "collapsible section": ["collapsible"],
  "expandable": ["collapsible"],
  "faq section": ["collapsible"],

  // Data display patterns
  "data table": ["table"],
  "list table": ["table"],
  "user table": ["table", "badge"],
  "status badge": ["badge"],
  "status indicator": ["badge"],
  "tag": ["tag"],
  "label": ["tag", "badge"],

  // Action patterns
  "action button": ["button"],
  "submit button": ["button"],
  "menu": ["dropdown-menu"],
  "context menu": ["dropdown-menu"],
  "actions menu": ["dropdown-menu"],
};

// Keywords to single component mappings
const keywordMappings: Record<string, string> = {
  button: "button",
  btn: "button",
  badge: "badge",
  tag: "tag",
  table: "table",
  dropdown: "dropdown-menu",
  menu: "dropdown-menu",
  input: "input",
  textfield: "text-field",
  "text-field": "text-field",
  select: "select",
  selectfield: "select-field",
  "select-field": "select-field",
  multiselect: "multi-select",
  "multi-select": "multi-select",
  checkbox: "checkbox",
  toggle: "toggle",
  switch: "toggle",
  collapsible: "collapsible",
  accordion: "collapsible",
};

function parseNaturalLanguage(prompt: string): string[] {
  const normalizedPrompt = prompt.toLowerCase().trim();
  const availableComponents = getComponentNames();
  const result = new Set<string>();

  // Check for direct component name matches first
  for (const component of availableComponents) {
    if (normalizedPrompt.includes(component)) {
      result.add(component);
    }
  }

  // Check keyword mappings
  for (const [keyword, component] of Object.entries(keywordMappings)) {
    if (normalizedPrompt.includes(keyword) && availableComponents.includes(component)) {
      result.add(component);
    }
  }

  // Check pattern matches for natural language phrases
  for (const [pattern, components] of Object.entries(componentPatterns)) {
    if (normalizedPrompt.includes(pattern)) {
      for (const component of components) {
        if (availableComponents.includes(component)) {
          result.add(component);
        }
      }
    }
  }

  // Handle comma/and separated lists: "button, input, and select"
  const listMatch = normalizedPrompt.match(/(?:add|install|get|need|want|use)\s+(.+)/i);
  if (listMatch) {
    const items = listMatch[1]
      .split(/[,\s]+(?:and\s+)?/)
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    for (const item of items) {
      // Direct match
      if (availableComponents.includes(item)) {
        result.add(item);
      }
      // Keyword match
      if (keywordMappings[item] && availableComponents.includes(keywordMappings[item])) {
        result.add(keywordMappings[item]);
      }
    }
  }

  return Array.from(result);
}

function getComponentSuggestions(prompt: string): string {
  const normalizedPrompt = prompt.toLowerCase();
  const suggestions: string[] = [];

  // Suggest based on context
  if (normalizedPrompt.includes("form")) {
    suggestions.push("For forms, try: text-field, button, checkbox, select-field, toggle");
  }
  if (normalizedPrompt.includes("table") || normalizedPrompt.includes("data")) {
    suggestions.push("For data display, try: table, badge, tag");
  }
  if (normalizedPrompt.includes("menu") || normalizedPrompt.includes("action")) {
    suggestions.push("For menus/actions, try: dropdown-menu, button");
  }
  if (normalizedPrompt.includes("select") || normalizedPrompt.includes("choose")) {
    suggestions.push("For selection, try: select, select-field, multi-select, checkbox");
  }

  if (suggestions.length === 0) {
    suggestions.push(`Available components: ${getComponentNames().join(", ")}`);
  }

  return suggestions.join("\n");
}

export function registerInstallComponent(server: McpServer) {
  server.tool(
    "install-component",
    `Install myOperator UI components using natural language or component names.

Examples:
- "add button" - installs button component
- "add a login form" - installs text-field, button, checkbox
- "install button, input, and select" - installs multiple components
- "I need a data table with status badges" - installs table and badge

Runs: npx myoperator-ui add <component>`,
    {
      prompt: z
        .string()
        .describe("Natural language description or component name(s) to install. Examples: 'button', 'add a login form', 'table and badge'"),
      cwd: z
        .string()
        .optional()
        .describe("Working directory to run the command in (defaults to current directory)"),
    },
    async ({ prompt, cwd }) => {
      const components = parseNaturalLanguage(prompt);

      if (components.length === 0) {
        const suggestions = getComponentSuggestions(prompt);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  success: false,
                  error: `Could not identify components from: "${prompt}"`,
                  suggestions,
                  availableComponents: getComponentNames(),
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }

      const results: Array<{
        component: string;
        success: boolean;
        output?: string;
        error?: string;
      }> = [];

      for (const component of components) {
        try {
          const command = `npx myoperator-ui add ${component}`;
          const options = cwd ? { cwd } : {};

          const { stdout, stderr } = await execAsync(command, options);

          results.push({
            component,
            success: true,
            output: stdout || "Installed successfully",
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          results.push({
            component,
            success: false,
            error: errorMessage,
          });
        }
      }

      const allSuccess = results.every(r => r.success);
      const successCount = results.filter(r => r.success).length;

      // Get usage examples for installed components
      const usageExamples = components
        .filter(c => results.find(r => r.component === c && r.success))
        .map(c => {
          const meta = componentMetadata[c];
          if (meta && meta.examples && meta.examples[0]) {
            return `// ${meta.name}\n${meta.examples[0].code}`;
          }
          return null;
        })
        .filter(Boolean);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                success: allSuccess,
                message: allSuccess
                  ? `Successfully installed ${successCount} component(s): ${components.join(", ")}`
                  : `Installed ${successCount}/${components.length} components`,
                interpretedAs: components,
                originalPrompt: prompt,
                results,
                usageExamples: usageExamples.length > 0 ? usageExamples : undefined,
                nextSteps: allSuccess
                  ? [
                      `Import components: import { ${components.map(c => {
                        const meta = componentMetadata[c];
                        return meta?.name || c.charAt(0).toUpperCase() + c.slice(1);
                      }).join(", ")} } from "@/components/ui/${components.length === 1 ? components[0] : "..."}"`,
                    ]
                  : ["Make sure you have initialized the project: npx myoperator-ui init"],
              },
              null,
              2
            ),
          },
        ],
        isError: !allSuccess,
      };
    }
  );
}
