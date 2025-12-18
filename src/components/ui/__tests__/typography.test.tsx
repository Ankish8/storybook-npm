import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Typography,
  mapTagName,
  mapClassName,
  mapColorClassName,
  mapAlignClassName,
} from "../typography";
import type { Kind, Variant, Color, Align } from "../typography";

describe("Typography", () => {
  // ==========================================================================
  // BASIC RENDERING
  // ==========================================================================

  it("renders children correctly", () => {
    render(<Typography>Test Content</Typography>);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies default kind (body) and variant (medium)", () => {
    render(<Typography data-testid="typography">Default Text</Typography>);
    const element = screen.getByTestId("typography");
    expect(element.tagName.toLowerCase()).toBe("span");
    expect(element).toHaveClass("text-sm");
    expect(element).toHaveClass("leading-[18px]");
    expect(element).toHaveClass("font-normal");
  });

  it("applies margin reset", () => {
    render(<Typography data-testid="typography">Text</Typography>);
    expect(screen.getByTestId("typography")).toHaveClass("m-0");
  });

  // ==========================================================================
  // KIND-VARIANT COMBINATIONS - TAGS
  // ==========================================================================

  describe("HTML Tag Mapping", () => {
    const tagTestCases: Array<[Kind, Variant, string]> = [
      ["display", "large", "h4"],
      ["display", "medium", "h4"],
      ["display", "small", "h4"],
      ["headline", "large", "h1"],
      ["headline", "medium", "h2"],
      ["headline", "small", "h3"],
      ["title", "large", "h5"],
      ["title", "medium", "h5"],
      ["title", "small", "h5"],
      ["label", "large", "label"],
      ["label", "medium", "label"],
      ["label", "small", "label"],
      ["body", "large", "span"],
      ["body", "medium", "span"],
      ["body", "small", "span"],
    ];

    it.each(tagTestCases)(
      "renders %s-%s as <%s>",
      (kind, variant, expectedTag) => {
        render(
          <Typography kind={kind} variant={variant} data-testid="typography">
            Test
          </Typography>
        );
        expect(screen.getByTestId("typography").tagName.toLowerCase()).toBe(
          expectedTag
        );
      }
    );
  });

  // ==========================================================================
  // KIND-VARIANT COMBINATIONS - CLASSES
  // ==========================================================================

  describe("Typography Classes", () => {
    const classTestCases: Array<[Kind, Variant, string[]]> = [
      ["display", "large", ["text-[57px]", "leading-[64px]", "font-normal"]],
      ["display", "medium", ["text-[45px]", "leading-[52px]", "font-normal"]],
      ["display", "small", ["text-[36px]", "leading-[44px]", "font-normal"]],
      ["headline", "large", ["text-[32px]", "leading-[40px]", "font-semibold"]],
      [
        "headline",
        "medium",
        ["text-[28px]", "leading-[36px]", "font-semibold"],
      ],
      ["headline", "small", ["text-[24px]", "leading-[32px]", "font-semibold"]],
      ["title", "large", ["text-lg", "leading-[22px]", "font-semibold"]],
      ["title", "medium", ["text-base", "leading-5", "font-semibold"]],
      ["title", "small", ["text-sm", "leading-[18px]", "font-semibold"]],
      ["label", "large", ["text-sm", "leading-5", "font-semibold"]],
      ["label", "medium", ["text-xs", "leading-4", "font-semibold"]],
      ["label", "small", ["text-[10px]", "leading-[14px]", "font-semibold"]],
      ["body", "large", ["text-base", "leading-5", "font-normal"]],
      ["body", "medium", ["text-sm", "leading-[18px]", "font-normal"]],
      ["body", "small", ["text-xs", "leading-4", "font-normal"]],
    ];

    it.each(classTestCases)(
      "applies correct classes for %s-%s",
      (kind, variant, expectedClasses) => {
        render(
          <Typography kind={kind} variant={variant} data-testid="typography">
            Test
          </Typography>
        );
        const element = screen.getByTestId("typography");
        expectedClasses.forEach((cls) => {
          expect(element).toHaveClass(cls);
        });
      }
    );
  });

  // ==========================================================================
  // COLOR PROP
  // ==========================================================================

  describe("Color Prop", () => {
    const colorTestCases: Array<[Color, string]> = [
      ["primary", "text-[#181D27]"],
      ["secondary", "text-[#343E55]"],
      ["muted", "text-[#717680]"],
      ["placeholder", "text-[#A2A6B1]"],
      ["link", "text-[#4275D6]"],
      ["inverted", "text-white"],
      ["error", "text-[#F04438]"],
      ["success", "text-[#17B26A]"],
    ];

    it.each(colorTestCases)(
      "applies %s color class",
      (color, expectedClass) => {
        render(
          <Typography color={color} data-testid="typography">
            Test
          </Typography>
        );
        expect(screen.getByTestId("typography")).toHaveClass(expectedClass);
      }
    );

    it("does not apply color class when color is not specified", () => {
      render(<Typography data-testid="typography">Test</Typography>);
      const element = screen.getByTestId("typography");
      Object.values(mapColorClassName).forEach((colorClass) => {
        expect(element).not.toHaveClass(colorClass);
      });
    });
  });

  // ==========================================================================
  // ALIGN PROP
  // ==========================================================================

  describe("Align Prop", () => {
    const alignTestCases: Array<[Align, string]> = [
      ["left", "text-left"],
      ["center", "text-center"],
      ["right", "text-right"],
    ];

    it.each(alignTestCases)(
      "applies %s alignment class",
      (align, expectedClass) => {
        render(
          <Typography align={align} data-testid="typography">
            Test
          </Typography>
        );
        expect(screen.getByTestId("typography")).toHaveClass(expectedClass);
      }
    );

    it("does not apply alignment class when align is not specified", () => {
      render(<Typography data-testid="typography">Test</Typography>);
      const element = screen.getByTestId("typography");
      Object.values(mapAlignClassName).forEach((alignClass) => {
        expect(element).not.toHaveClass(alignClass);
      });
    });
  });

  // ==========================================================================
  // TRUNCATE PROP
  // ==========================================================================

  describe("Truncate Prop", () => {
    it("applies truncate class when truncate is true", () => {
      render(
        <Typography truncate data-testid="typography">
          Very long text that should be truncated
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveClass("truncate");
    });

    it("does not apply truncate class by default", () => {
      render(<Typography data-testid="typography">Text</Typography>);
      expect(screen.getByTestId("typography")).not.toHaveClass("truncate");
    });

    it("does not apply truncate class when truncate is false", () => {
      render(
        <Typography truncate={false} data-testid="typography">
          Text
        </Typography>
      );
      expect(screen.getByTestId("typography")).not.toHaveClass("truncate");
    });
  });

  // ==========================================================================
  // CUSTOM TAG OVERRIDE
  // ==========================================================================

  describe("Custom Tag Override", () => {
    it("overrides default tag with custom tag", () => {
      render(
        <Typography
          kind="body"
          variant="medium"
          tag="p"
          data-testid="typography"
        >
          Paragraph text
        </Typography>
      );
      expect(screen.getByTestId("typography").tagName.toLowerCase()).toBe("p");
    });

    it("can render as div", () => {
      render(
        <Typography tag="div" data-testid="typography">
          Div content
        </Typography>
      );
      expect(screen.getByTestId("typography").tagName.toLowerCase()).toBe(
        "div"
      );
    });

    it("can render as strong", () => {
      render(
        <Typography tag="strong" data-testid="typography">
          Strong text
        </Typography>
      );
      expect(screen.getByTestId("typography").tagName.toLowerCase()).toBe(
        "strong"
      );
    });
  });

  // ==========================================================================
  // LABEL HTMLFOR
  // ==========================================================================

  describe("Label htmlFor", () => {
    it("applies htmlFor attribute on label elements", () => {
      render(
        <Typography
          kind="label"
          variant="medium"
          htmlFor="email-input"
          data-testid="typography"
        >
          Email
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveAttribute(
        "for",
        "email-input"
      );
    });

    it("does not apply htmlFor on non-label elements", () => {
      render(
        <Typography kind="body" htmlFor="email-input" data-testid="typography">
          Body text
        </Typography>
      );
      expect(screen.getByTestId("typography")).not.toHaveAttribute("for");
    });

    it("applies htmlFor when tag is overridden to label", () => {
      render(
        <Typography tag="label" htmlFor="custom-input" data-testid="typography">
          Custom Label
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveAttribute(
        "for",
        "custom-input"
      );
    });
  });

  // ==========================================================================
  // CLASSNAME MERGING
  // ==========================================================================

  describe("ClassName Merging", () => {
    it("merges custom className with default classes", () => {
      render(
        <Typography
          className="custom-class another-class"
          data-testid="typography"
        >
          Test
        </Typography>
      );
      const element = screen.getByTestId("typography");
      expect(element).toHaveClass("custom-class");
      expect(element).toHaveClass("another-class");
      expect(element).toHaveClass("m-0");
      expect(element).toHaveClass("text-sm");
    });

    it("allows custom className to override default classes via cn()", () => {
      render(
        <Typography className="text-lg" data-testid="typography">
          Test
        </Typography>
      );
      // cn() should handle class merging - custom class takes precedence
      expect(screen.getByTestId("typography")).toHaveClass("text-lg");
    });
  });

  // ==========================================================================
  // REF FORWARDING
  // ==========================================================================

  describe("Ref Forwarding", () => {
    it("forwards ref to span element by default", () => {
      const ref = { current: null };
      render(<Typography ref={ref}>Test</Typography>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it("forwards ref to heading elements", () => {
      const ref = { current: null };
      render(
        <Typography kind="headline" variant="large" ref={ref}>
          Heading
        </Typography>
      );
      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it("forwards ref to label elements", () => {
      const ref = { current: null };
      render(
        <Typography kind="label" ref={ref}>
          Label
        </Typography>
      );
      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });

    it("forwards ref to custom tag elements", () => {
      const ref = { current: null };
      render(
        <Typography tag="p" ref={ref}>
          Paragraph
        </Typography>
      );
      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  // ==========================================================================
  // PROP SPREADING
  // ==========================================================================

  describe("Prop Spreading", () => {
    it("spreads id prop", () => {
      render(
        <Typography id="unique-id" data-testid="typography">
          Test
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveAttribute(
        "id",
        "unique-id"
      );
    });

    it("spreads title prop", () => {
      render(
        <Typography title="Tooltip text" data-testid="typography">
          Test
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveAttribute(
        "title",
        "Tooltip text"
      );
    });

    it("spreads data-* attributes", () => {
      render(
        <Typography data-testid="typography" data-custom="value">
          Test
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveAttribute(
        "data-custom",
        "value"
      );
    });

    it("spreads aria-* attributes", () => {
      render(
        <Typography aria-label="Accessible text" data-testid="typography">
          Test
        </Typography>
      );
      expect(screen.getByTestId("typography")).toHaveAttribute(
        "aria-label",
        "Accessible text"
      );
    });
  });

  // ==========================================================================
  // MAPPINGS EXPORTS
  // ==========================================================================

  describe("Exported Mappings", () => {
    it("exports mapTagName with all 15 kind-variant combinations", () => {
      expect(Object.keys(mapTagName)).toHaveLength(15);
    });

    it("exports mapClassName with all 15 kind-variant combinations", () => {
      expect(Object.keys(mapClassName)).toHaveLength(15);
    });

    it("exports mapColorClassName with all 8 colors", () => {
      expect(Object.keys(mapColorClassName)).toHaveLength(8);
    });

    it("exports mapAlignClassName with all 3 alignments", () => {
      expect(Object.keys(mapAlignClassName)).toHaveLength(3);
    });
  });

  // ==========================================================================
  // COMBINED PROPS
  // ==========================================================================

  describe("Combined Props", () => {
    it("renders with all props combined", () => {
      render(
        <Typography
          kind="title"
          variant="large"
          color="error"
          align="center"
          truncate
          className="extra-class"
          id="combined-id"
          data-testid="typography"
        >
          Combined Test
        </Typography>
      );
      const element = screen.getByTestId("typography");

      // Tag
      expect(element.tagName.toLowerCase()).toBe("h5");

      // Kind-variant classes
      expect(element).toHaveClass("text-lg");
      expect(element).toHaveClass("leading-[22px]");
      expect(element).toHaveClass("font-semibold");

      // Color
      expect(element).toHaveClass("text-[#F04438]");

      // Align
      expect(element).toHaveClass("text-center");

      // Truncate
      expect(element).toHaveClass("truncate");

      // Custom class
      expect(element).toHaveClass("extra-class");

      // ID
      expect(element).toHaveAttribute("id", "combined-id");

      // Margin reset
      expect(element).toHaveClass("m-0");
    });
  });
});
