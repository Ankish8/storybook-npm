import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTokensByCategory, getCategories } from "../../data/tokens.js";

export function registerListDesignTokens(server: McpServer) {
  server.tool(
    "list-design-tokens",
    "List design tokens (colors, spacing, radius, typography) from the myOperator UI design system",
    {
      category: z
        .enum(["colors", "spacing", "radius", "typography"])
        .optional()
        .describe("Filter tokens by category (optional)"),
    },
    async ({ category }) => {
      const tokens = getTokensByCategory(category);
      const categories = getCategories();

      const result = {
        totalTokens: tokens.length,
        availableCategories: categories,
        selectedCategory: category || "all",
        tokens: tokens.map((token) => ({
          name: token.name,
          value: token.value,
          category: token.category,
          cssVariable: token.cssVariable,
          description: token.description,
        })),
        usage: {
          cssVariables:
            "Use CSS variables like: color: hsl(var(--primary));",
          hardcodedColors:
            "For Bootstrap compatibility, some colors are hardcoded (e.g., bg-[#343E55])",
          tailwindClasses:
            "Components use Tailwind classes with these token values",
        },
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
