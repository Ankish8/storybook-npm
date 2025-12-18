import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tag, TagGroup } from "../tag";

describe("Tag", () => {
  it("renders children correctly", () => {
    render(<Tag>Test Tag</Tag>);
    expect(screen.getByText("Test Tag")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Tag data-testid="tag">Default</Tag>);
    const tag = screen.getByTestId("tag");
    expect(tag).toHaveClass("bg-[#F5F5F5]");
    expect(tag).toHaveClass("text-[#181D27]");
  });

  it.each([
    ["default", "bg-[#F5F5F5]", "text-[#181D27]"],
    ["primary", "bg-[#F5F5F5]", "text-[#181D27]"],
    ["accent", "bg-[#EBECEE]", "text-[#343E55]"],
    ["secondary", "bg-[#E9EAEB]", "text-[#414651]"],
    ["success", "bg-[#ECFDF3]", "text-[#17B26A]"],
    ["warning", "bg-[#FFFAEB]", "text-[#F79009]"],
    ["error", "bg-[#FEF3F2]", "text-[#F04438]"],
    ["destructive", "bg-[#FEF3F2]", "text-[#F04438]"],
  ] as const)("renders %s variant", (variant, bgClass, textClass) => {
    render(
      <Tag variant={variant} data-testid="tag">
        Test
      </Tag>
    );
    const tag = screen.getByTestId("tag");
    expect(tag).toHaveClass(bgClass);
    expect(tag).toHaveClass(textClass);
  });

  it.each([
    ["default", "px-2", "py-1"],
    ["sm", "px-1.5", "py-0.5"],
    ["lg", "px-3", "py-1.5"],
  ] as const)("renders %s size", (size, paddingX, paddingY) => {
    render(
      <Tag size={size} data-testid="tag">
        Test
      </Tag>
    );
    const tag = screen.getByTestId("tag");
    expect(tag).toHaveClass(paddingX);
    expect(tag).toHaveClass(paddingY);
  });

  it("renders sm size with smaller text", () => {
    render(
      <Tag size="sm" data-testid="tag">
        Small
      </Tag>
    );
    expect(screen.getByTestId("tag")).toHaveClass("text-xs");
  });
});

describe("Tag with label", () => {
  it("renders label prefix", () => {
    render(<Tag label="Event:">Call Started</Tag>);
    expect(screen.getByText("Event:")).toBeInTheDocument();
    expect(screen.getByText("Call Started")).toBeInTheDocument();
  });

  it("renders label with semibold font", () => {
    render(<Tag label="Type:">Value</Tag>);
    const label = screen.getByText("Type:");
    expect(label).toHaveClass("font-semibold");
  });

  it("renders children with normal font", () => {
    render(<Tag label="Label:">Content</Tag>);
    const content = screen.getByText("Content");
    expect(content).toHaveClass("font-normal");
  });
});

describe("Tag custom styling", () => {
  it("applies custom className", () => {
    render(
      <Tag className="custom-class" data-testid="tag">
        Custom
      </Tag>
    );
    expect(screen.getByTestId("tag")).toHaveClass("custom-class");
  });

  it("preserves base classes with custom className", () => {
    render(
      <Tag className="custom-class" data-testid="tag">
        Custom
      </Tag>
    );
    const tag = screen.getByTestId("tag");
    expect(tag).toHaveClass("inline-flex");
    expect(tag).toHaveClass("custom-class");
  });
});

describe("Tag ref forwarding", () => {
  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Tag ref={ref}>Test</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

describe("Tag accessibility", () => {
  it("renders as span by default", () => {
    render(<Tag data-testid="tag">Span Tag</Tag>);
    expect(screen.getByTestId("tag").tagName).toBe("SPAN");
  });

  it("supports aria attributes", () => {
    render(
      <Tag aria-label="Custom label" data-testid="tag">
        Tag
      </Tag>
    );
    expect(screen.getByTestId("tag")).toHaveAttribute(
      "aria-label",
      "Custom label"
    );
  });
});

describe("TagGroup", () => {
  it("renders all tags when count is less than or equal to maxVisible", () => {
    render(
      <TagGroup
        tags={[{ value: "Tag 1" }, { value: "Tag 2" }]}
        maxVisible={2}
      />
    );
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("shows overflow indicator when tags exceed maxVisible", () => {
    render(
      <TagGroup
        tags={[
          { value: "Tag 1" },
          { value: "Tag 2" },
          { value: "Tag 3" },
          { value: "Tag 4" },
        ]}
        maxVisible={2}
      />
    );
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
    expect(screen.getByText("+2 more")).toBeInTheDocument();
    expect(screen.queryByText("Tag 3")).not.toBeInTheDocument();
    expect(screen.queryByText("Tag 4")).not.toBeInTheDocument();
  });

  it("renders tags with labels", () => {
    render(
      <TagGroup
        tags={[{ label: "Event:", value: "Call Started" }]}
        maxVisible={2}
      />
    );
    expect(screen.getByText("Event:")).toBeInTheDocument();
    expect(screen.getByText("Call Started")).toBeInTheDocument();
  });

  it("defaults maxVisible to 2", () => {
    render(
      <TagGroup
        tags={[{ value: "Tag 1" }, { value: "Tag 2" }, { value: "Tag 3" }]}
      />
    );
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
    expect(screen.getByText("+1 more")).toBeInTheDocument();
  });

  it("renders single tag without overflow", () => {
    render(
      <TagGroup
        tags={[{ label: "IVR Event:", value: "Menu selection" }]}
        maxVisible={2}
      />
    );
    expect(screen.getByText("IVR Event:")).toBeInTheDocument();
    expect(screen.getByText("Menu selection")).toBeInTheDocument();
    expect(screen.queryByText(/more/)).not.toBeInTheDocument();
  });

  it("applies custom className to container", () => {
    render(
      <TagGroup
        tags={[{ value: "Tag" }]}
        className="custom-class"
        data-testid="tag-group"
      />
    );
    // The container div should have the class
    const container = screen.getByText("Tag").parentElement?.parentElement;
    expect(container).toHaveClass("custom-class");
  });
});
