import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerGetComponentMetadata } from "./tools/get-component-metadata.js";
import { registerGetComponentExamples } from "./tools/get-component-examples.js";
import { registerListDesignTokens } from "./tools/list-design-tokens.js";
import { registerGetComponentAccessibility } from "./tools/get-component-accessibility.js";
import { registerGetComponentSource } from "./tools/get-component-source.js";
import { registerGetInstallationInfo } from "./tools/get-installation-info.js";
import { registerInstallComponent } from "./tools/install-component.js";
import { registerInitProject } from "./tools/init-project.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "myoperator-mcp",
    version: "0.1.0",
  });

  // Component Discovery (like shadcn)
  registerListComponents(server);
  registerGetComponentMetadata(server);
  registerGetComponentExamples(server);
  registerGetComponentSource(server);

  // Installation (like shadcn)
  registerInitProject(server);
  registerInstallComponent(server);

  // Design System
  registerListDesignTokens(server);
  registerGetComponentAccessibility(server);
  registerGetInstallationInfo(server);

  return server;
}
