import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerGetInstallationInfo(server: McpServer) {
  server.tool(
    "get-installation-info",
    "Get installation instructions and npm package info for myOperator UI",
    {},
    async () => {
      const installationInfo = {
        packageName: "myoperator-ui",
        npmUrl: "https://www.npmjs.com/package/myoperator-ui",
        description: "CLI for adding myOperator UI components to your project",

        quickStart: {
          step1: "npx myoperator-ui init",
          step2: "npx myoperator-ui add button",
          description: "Initialize project and add components via CLI",
        },

        manualInstallation: {
          description: "If you prefer to manually add components:",
          steps: [
            {
              step: 1,
              title: "Install dependencies",
              command: "npm install class-variance-authority clsx tailwind-merge",
            },
            {
              step: 2,
              title: "Create utils file",
              path: "lib/utils.ts",
              note: "Use get-component-source with 'utils' to get the code",
            },
            {
              step: 3,
              title: "Add CSS styles",
              path: "index.css or globals.css",
              note: "Use get-component-source with 'css' to get the styles",
            },
            {
              step: 4,
              title: "Copy component",
              path: "components/ui/[component].tsx",
              note: "Use get-component-source with component name to get the code",
            },
          ],
        },

        peerDependencies: {
          react: "^18.0.0",
          "react-dom": "^18.0.0",
          tailwindcss: "^3.4.0",
        },

        optionalDependencies: {
          "@radix-ui/react-slot": "For Button asChild prop",
          "@radix-ui/react-dropdown-menu": "For DropdownMenu component",
          "lucide-react": "For icons",
        },

        tailwindConfig: {
          note: "Add these to your tailwind.config.js",
          content: ["./components/**/*.{ts,tsx}"],
          plugins: ["tailwindcss-animate"],
        },

        repository: "https://github.com/Ankish8/storybook-npm",
        documentation: "https://storybook-npm.vercel.app",
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(installationInfo, null, 2),
          },
        ],
      };
    }
  );
}
