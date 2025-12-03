import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { componentMetadata, getComponentNames } from "../../data/metadata.js";

export function registerListComponents(server: McpServer) {
  server.tool(
    "list-components",
    "List all available myOperator UI components with their descriptions",
    {},
    async () => {
      const components = getComponentNames().map((name) => ({
        name: componentMetadata[name].name,
        id: name,
        description: componentMetadata[name].description,
        dependencyCount: componentMetadata[name].dependencies.length,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                totalComponents: components.length,
                components,
                usage:
                  "Use get-component-metadata with the component id to get detailed information",
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );
}
