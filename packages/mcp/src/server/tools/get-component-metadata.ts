import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponent, getComponentNames } from "../../data/metadata.js";

export function registerGetComponentMetadata(server: McpServer) {
  server.tool(
    "get-component-metadata",
    "Get detailed metadata for a myOperator UI component including props, variants, and dependencies",
    {
      componentName: z
        .string()
        .describe("The name of the component (e.g., 'button', 'badge', 'table')"),
    },
    async ({ componentName }) => {
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

      const metadata = {
        name: component.name,
        description: component.description,
        dependencies: component.dependencies,
        props: component.props,
        variants: component.variants,
        import: `import { ${component.name} } from "@/components/ui/${componentName}"`,
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(metadata, null, 2),
          },
        ],
      };
    }
  );
}
