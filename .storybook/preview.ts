import type { Preview } from "@storybook/react-vite";
import { createElement } from "react";
import { V2DocsContainer } from "../src/storybook/v2-docs";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/index.css";
import "../src/storybook/typography.css";
import "../src/storybook/design-tokens.css";
import "../src/storybook/v2-text-hierarchy.css";

const preview: Preview = {
  decorators: [
    (Story, context) =>
      context.title.startsWith("V2/")
        ? createElement(
            "div",
            { "data-v2-preview": "", style: { display: "contents" } },
            createElement(Story)
          )
        : createElement(Story),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      container: V2DocsContainer,
      story: {
        inline: true,
      },
    },
    designToken: {
      files: ["src/storybook/design-tokens.css"],
    },
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Introduction",
          "Getting Started",
          "CLI Reference",
          "MCP Server",
          "Foundations",
          ["Colors", "Typography", "Spacing", "Accessibility"],
          "Components",
          "Custom",
          "V2",
          "*",
        ],
      },
    },
  },
};

export default preview;
