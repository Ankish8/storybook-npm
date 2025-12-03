import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export function registerInitProject(server: McpServer) {
  server.tool(
    "init-project",
    "Initialize a project for myOperator UI components (runs: npx myoperator-ui init)",
    {
      cwd: z
        .string()
        .optional()
        .describe("Working directory to run the command in (defaults to current directory)"),
    },
    async ({ cwd }) => {
      try {
        const command = "npx myoperator-ui init";
        const options = cwd ? { cwd } : {};

        const { stdout, stderr } = await execAsync(command, options);

        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  success: true,
                  command,
                  output: stdout || "Project initialized successfully",
                  warnings: stderr || null,
                  nextSteps: [
                    "Run 'install-component' to add components",
                    "Or use: npx myoperator-ui add button",
                  ],
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
                  error: errorMessage,
                  suggestion: "Make sure you're in a project directory with package.json and tailwind configured",
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
