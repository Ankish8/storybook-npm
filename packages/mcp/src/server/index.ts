import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerGetComponentMetadata } from "./tools/get-component-metadata.js";
import { registerInstallComponent } from "./tools/install-component.js";
import { registerInitProject } from "./tools/init-project.js";
import { registerGetComponentSource } from "./tools/get-component-source.js";
import { registerGetComponentExamples } from "./tools/get-component-examples.js";
import { registerGetComponentAccessibility } from "./tools/get-component-accessibility.js";
import { registerListDesignTokens } from "./tools/list-design-tokens.js";
import { registerGetInstallationInfo } from "./tools/get-installation-info.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "myoperator-mcp",
    version: "0.2.2",
  });

  // Component Discovery
  registerListComponents(server);             // Browse available components
  registerGetComponentMetadata(server);       // Get component details, props, examples
  registerGetComponentSource(server);         // Get full source code for copy/paste
  registerGetComponentExamples(server);       // Get code examples
  registerGetComponentAccessibility(server);  // Get accessibility guidelines

  // Design System
  registerListDesignTokens(server);           // List design tokens (colors, spacing, etc.)

  // Installation
  registerInitProject(server);                // Initialize project
  registerInstallComponent(server);           // Install components (supports natural language!)
  registerGetInstallationInfo(server);        // Get installation instructions

  return server;
}
