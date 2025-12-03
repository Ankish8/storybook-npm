import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import { promisify } from "util";
import { getComponentNames } from "../../data/metadata.js";

const execAsync = promisify(exec);

export function registerInstallComponent(server: McpServer) {
  server.tool(
    "install-component",
    "Install a myOperator UI component using the CLI (runs: npx myoperator-ui add <component>)",
    {
      component: z
        .string()
        .describe("The name of the component to install (e.g., 'button', 'badge', 'table')"),
      cwd: z
        .string()
        .optional()
        .describe("Working directory to run the command in (defaults to current directory)"),
    },
    async ({ component, cwd }) => {
      const componentName = component.toLowerCase();
      const availableComponents = getComponentNames();

      if (!availableComponents.includes(componentName)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: Component "${component}" not found. Available components: ${availableComponents.join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      try {
        const command = `npx myoperator-ui add ${componentName}`;
        const options = cwd ? { cwd } : {};

        const { stdout, stderr } = await execAsync(command, options);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  success: true,
                  component: componentName,
                  command,
                  output: stdout || "Component installed successfully",
                  warnings: stderr || null,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  success: false,
                  component: componentName,
                  error: errorMessage,
                  suggestion: "Make sure you have initialized the project first with: npx myoperator-ui init",
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    }
  );
}
