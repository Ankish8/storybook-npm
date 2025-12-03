import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  componentSourceCode,
  utilsSourceCode,
  cssStyles,
  getComponentNames,
} from "../../data/metadata.js";

export function registerGetComponentSource(server: McpServer) {
  server.tool(
    "get-component-source",
    "Get the full source code for a myOperator UI component (copy/paste ready)",
    {
      componentName: z
        .string()
        .describe(
          "The name of the component (e.g., 'button', 'badge', 'tag') or 'utils' for the cn() helper or 'css' for styles"
        ),
    },
    async ({ componentName }) => {
      const name = componentName.toLowerCase();

      // Handle special cases
      if (name === "utils" || name === "cn") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  file: "lib/utils.ts",
                  description: "Utility function for merging Tailwind classes",
                  dependencies: ["clsx", "tailwind-merge"],
                  installCommand: "npm install clsx tailwind-merge",
                  sourceCode: utilsSourceCode,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      if (name === "css" || name === "styles") {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  file: "index.css",
                  description: "CSS styles with Tailwind and design tokens",
                  dependencies: ["tailwindcss"],
                  sourceCode: cssStyles,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // Handle component source code
      const sourceCode = componentSourceCode[name];

      if (!sourceCode) {
        const availableComponents = [
          ...Object.keys(componentSourceCode),
          "utils",
          "css",
        ].join(", ");
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Source code for "${componentName}" not found. Available: ${availableComponents}`,
            },
          ],
          isError: true,
        };
      }

      // Get dependencies based on component
      const dependenciesMap: Record<string, string[]> = {
        button: [
          "@radix-ui/react-slot",
          "class-variance-authority",
          "clsx",
          "tailwind-merge",
          "lucide-react",
        ],
        badge: ["class-variance-authority", "clsx", "tailwind-merge"],
        tag: ["class-variance-authority", "clsx", "tailwind-merge"],
      };

      const dependencies = dependenciesMap[name] || [];

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                component: name,
                file: `components/ui/${name}.tsx`,
                dependencies,
                installCommand:
                  dependencies.length > 0
                    ? `npm install ${dependencies.join(" ")}`
                    : null,
                requiredFiles: [
                  {
                    path: "lib/utils.ts",
                    note: "Required for cn() function - use get-component-source with 'utils' to get this file",
                  },
                ],
                sourceCode,
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
