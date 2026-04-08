import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tag, TagGroup } from "../tag";

describe("Tag", () => {
  it("renders children correctly", () => {
    render(<Tag>Test Tag</Tag>);
    expect(screen.getByText("Test Tag")).toBeInTheDocument();
  });

  it("applies default variant classes", () => {
    render(<Tag data-testid="tag">Default</Tag>);
    const tag = screen.getByTestId("tag");
    expect(tag).toHaveClass("bg-semantic-bg-ui");
    expect(tag).toHaveClass("text-semantic-text-primary");
  });

  it.each([
    ["default", "bg-semantic-bg-ui", "text-semantic-text-primary"],
    ["primary", "bg-semantic-bg-ui", "text-semantic-text-primary"],
    ["accent", "bg-semantic-primary-surface", "text-semantic-text-secondary"],
    ["secondary", "bg-semantic-bg-grey", "text-[var(--color-neutral-700)]"],
    ["success", "bg-semantic-success-surface", "text-semantic-success-primary"],
    ["warning", "bg-semantic-warning-surface", "text-semantic-warning-primary"],
    ["error", "bg-semantic-error-surface", "text-semantic-error-primary"],
    ["destructive", "bg-semantic-error-surface", "text-semantic-error-primary"],
    ["info", "bg-semantic-info-surface", "text-semantic-text-primary"],
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

describe("Tag onRemove", () => {
  it("renders dismiss button when onRemove is provided", () => {
    render(
      <Tag onRemove={vi.fn()} data-testid="tag">
        Removable
      </Tag>
    );
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("does not render dismiss button when onRemove is absent", () => {
    render(<Tag data-testid="tag">Static</Tag>);
    expect(screen.queryByRole("button", { name: "Remove" })).not.toBeInTheDocument();
  });

  it("calls onRemove when dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const handleRemove = vi.fn();
    render(<Tag onRemove={handleRemove}>Removable</Tag>);
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("disables dismiss button when removeDisabled is true", () => {
    render(
      <Tag onRemove={vi.fn()} removeDisabled>
        Disabled
      </Tag>
    );
    expect(screen.getByRole("button", { name: "Remove" })).toBeDisabled();
  });

  it("uses custom removeAriaLabel", () => {
    render(
      <Tag onRemove={vi.fn()} removeAriaLabel="Remove +91 123">
        +91 123
      </Tag>
    );
    expect(screen.getByRole("button", { name: "Remove +91 123" })).toBeInTheDocument();
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
