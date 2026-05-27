import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { TemplateDef } from "../../chat-types";
import { TemplatePreviewBubble } from "../template-preview";

function getParagraphByText(text: string) {
  return screen.getByText((_, element) => {
    return element?.tagName === "P" && element.textContent === text;
  });
}

describe("TemplatePreviewBubble", () => {
  it("wraps long unspaced variable values inside text previews", () => {
    const template: TemplateDef = {
      id: "long-variable",
      name: "Long Variable",
      category: "marketing",
      type: "text",
      body: "Hi {{name}}",
      bodyVariables: ["name"],
    };
    const longValue =
      "hkjghfjdhjfgklhjoihulyktjdrseawrsdtjfkyglihuojjpiulytdrse";

    render(
      <TemplatePreviewBubble
        template={template}
        varValues={{ "{{name}}": longValue }}
      />
    );

    const message = getParagraphByText(`Hi ${longValue}`);
    expect(message).toHaveClass("min-w-0", "max-w-full", "break-words");
  });

  it("wraps long unspaced variable values inside image previews", () => {
    const template: TemplateDef = {
      id: "image-long-variable",
      name: "Image Long Variable",
      category: "marketing",
      type: "image",
      body: "Have a look at {{name}}",
      bodyVariables: ["name"],
    };
    const longValue =
      "sdfgfdsdfgfdasasdfgfdsdfgfdsdfgfdsdfgfdsdfgfsdfgfffgghgf";

    render(
      <TemplatePreviewBubble
        template={template}
        varValues={{ "{{name}}": longValue }}
      />
    );

    const message = getParagraphByText(`Have a look at ${longValue}`);
    expect(message).toHaveClass("min-w-0", "max-w-full", "break-words");
  });
});
