import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PhoneInput } from "../phone-input";

describe("PhoneInput", () => {
  it("renders with default country flag and code", () => {
    render(<PhoneInput />);
    expect(screen.getByText("🇮🇳")).toBeInTheDocument();
    expect(screen.getByText("+91")).toBeInTheDocument();
  });

  it("renders custom countryFlag and countryCode", () => {
    render(<PhoneInput countryFlag="🇺🇸" countryCode="+1" />);
    expect(screen.getByText("🇺🇸")).toBeInTheDocument();
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("forwards ref to the input element", () => {
    const ref = { current: null };
    render(<PhoneInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current!.type).toBe("tel");
  });

  it("fires onChange handler", () => {
    const handleChange = vi.fn();
    render(<PhoneInput onChange={handleChange} data-testid="phone" />);
    fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "9876543210" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("fires onCountryClick when clicking country area", () => {
    const handleCountryClick = vi.fn();
    render(<PhoneInput onCountryClick={handleCountryClick} />);
    fireEvent.click(screen.getByTestId("phone-input-country"));
    expect(handleCountryClick).toHaveBeenCalledTimes(1);
  });

  it("applies opacity-60 when disabled", () => {
    render(<PhoneInput disabled data-testid="phone" />);
    const wrapper = screen.getByTestId("phone").closest("div[class*='flex items-center border']");
    expect(wrapper).toHaveClass("opacity-60");
  });

  it("disables the input when disabled prop is set", () => {
    render(<PhoneInput disabled data-testid="phone" />);
    expect(screen.getByTestId("phone")).toBeDisabled();
  });

  it("applies wrapperClassName to the outer wrapper", () => {
    render(<PhoneInput wrapperClassName="custom-wrapper" data-testid="phone" />);
    // The immediate parent is the wrapper with flex items-center
    const outerWrapper = screen.getByTestId("phone-input-country").parentElement;
    expect(outerWrapper).toHaveClass("custom-wrapper");
  });

  it("applies className to the input element", () => {
    render(<PhoneInput className="custom-input" data-testid="phone" />);
    expect(screen.getByTestId("phone")).toHaveClass("custom-input");
  });

  it("spreads data-testid to the input", () => {
    render(<PhoneInput data-testid="my-phone-input" />);
    const input = screen.getByTestId("my-phone-input");
    expect(input.tagName).toBe("INPUT");
  });

  it("hides chevron when showChevron is false", () => {
    const { container } = render(<PhoneInput showChevron={false} />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeInTheDocument();
  });

  it("shows chevron by default", () => {
    const { container } = render(<PhoneInput />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders placeholder text", () => {
    render(<PhoneInput placeholder="Enter phone number" />);
    expect(screen.getByPlaceholderText("Enter phone number")).toBeInTheDocument();
  });

  it("always sets type to tel", () => {
    render(<PhoneInput data-testid="phone" />);
    expect(screen.getByTestId("phone")).toHaveAttribute("type", "tel");
  });

  it("renders with controlled value", () => {
    render(
      <PhoneInput value="9876543210" onChange={() => {}} data-testid="phone" />
    );
    expect(screen.getByTestId("phone")).toHaveValue("9876543210");
  });
});
