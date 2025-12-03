import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  getAccessibilityGuideline,
  getComponentsWithGuidelines,
} from "../../data/accessibility.js";

export function registerGetComponentAccessibility(server: McpServer) {
  server.tool(
    "get-component-accessibility",
    "Get accessibility guidelines and requirements for a myOperator UI component",
    {
      componentName: z
        .string()
        .describe("The name of the component (e.g., 'button', 'badge', 'table')"),
    },
    async ({ componentName }) => {
      const guideline = getAccessibilityGuideline(componentName);

      if (!guideline) {
        const availableComponents = getComponentsWithGuidelines().join(", ");
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Accessibility guidelines for "${componentName}" not found. Available components: ${availableComponents}`,
            },
          ],
          isError: true,
        };
      }

      const result = {
        component: guideline.component,
        guidelines: guideline.guidelines,
        ariaAttributes: guideline.ariaAttributes,
        keyboardSupport: guideline.keyboardSupport,
        wcagCompliance: {
          colorContrast: "All components meet WCAG 2.1 AA color contrast requirements",
          focusVisible: "Keyboard focus is visible on all interactive elements",
          semanticHTML: "Native HTML elements used where appropriate",
        },
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
