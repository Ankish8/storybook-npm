import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponent, getComponentNames } from "../../data/metadata.js";

export function registerGetComponentExamples(server: McpServer) {
  server.tool(
    "get-component-examples",
    "Get React code examples for a myOperator UI component",
    {
      componentName: z
        .string()
        .describe("The name of the component (e.g., 'button', 'badge', 'table')"),
      exampleType: z
        .string()
        .optional()
        .describe("Filter examples by type/title (optional)"),
    },
    async ({ componentName, exampleType }) => {
      const component = getComponent(componentName);

      if (!component) {
        const availableComponents = getComponentNames().join(", ");
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Component "${componentName}" not found. Available components: ${availableComponents}`,
            },
          ],
          isError: true,
        };
      }

      let examples = component.examples;

      // Filter by example type if provided
      if (exampleType) {
        examples = examples.filter((example) =>
          example.title.toLowerCase().includes(exampleType.toLowerCase())
        );
      }

      if (examples.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No examples found${exampleType ? ` matching "${exampleType}"` : ""} for component "${componentName}"`,
            },
          ],
        };
      }

      const result = {
        component: component.name,
        import: `import { ${component.name} } from "@/components/ui/${componentName}"`,
        examplesCount: examples.length,
        examples: examples.map((example) => ({
          title: example.title,
          description: example.description,
          code: example.code,
        })),
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
