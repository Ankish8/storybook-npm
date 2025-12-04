import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerGetComponentMetadata } from "./tools/get-component-metadata.js";
import { registerInstallComponent } from "./tools/install-component.js";
import { registerInitProject } from "./tools/init-project.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "myoperator-mcp",
    version: "0.2.0",
  });

  // Component Discovery (like shadcn)
  registerListComponents(server);        // Browse available components
  registerGetComponentMetadata(server);  // Get component details, props, examples

  // Installation with Natural Language (like shadcn)
  registerInitProject(server);           // Initialize project
  registerInstallComponent(server);      // Install components (supports natural language!)

  return server;
}
