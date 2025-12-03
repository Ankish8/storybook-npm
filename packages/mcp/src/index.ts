#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server/index.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // Log to stderr so it doesn't interfere with MCP protocol on stdout
  console.error("myOperator MCP server running");
}

main().catch((error) => {
  console.error("Failed to start MCP server:", error);
  process.exit(1);
});
