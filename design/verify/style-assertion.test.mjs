import { test } from "node:test";
import assert from "node:assert/strict";
import { isStyleAssertion } from "./style-assertion.mjs";

test("recognizes existing DOM class assertions", () => {
  assert.equal(
    isStyleAssertion("Badge classes", "expect(element).toHaveClass('h-6')"),
    true
  );
});
test("recognizes semantic class strings returned by CVA", () => {
  for (const variant of ["success", "error", "warning", "info"]) {
    assert.equal(
      isStyleAssertion(
        `toast :: Toast toastVariants returns correct classes for ${variant} variant`,
        `expected 'group relative ...' to contain 'bg-semantic-${variant}-surface'`
      ),
      true
    );
  }
});
test("keeps ordinary text assertions as behavior failures", () => {
  assert.equal(
    isStyleAssertion(
      "Toast renders a description",
      "expected text to contain 'bg-semantic-info-surface'"
    ),
    false
  );
});
test("does not classify CVA export or callback failures as style", () => {
  assert.equal(
    isStyleAssertion(
      "Toast toastVariants returns correct classes",
      "toastVariants is not a function"
    ),
    false
  );
  assert.equal(
    isStyleAssertion(
      "Toast action calls a callback",
      "expected spy to be called once"
    ),
    false
  );
});
test("keeps role, visibility and disabled contracts as behavior", () => {
  for (const message of [
    "expect(element).toBeDisabled()",
    "expect(element).not.toBeInTheDocument()",
    "Unable to find role=alert",
  ]) {
    assert.equal(isStyleAssertion("Component behavior", message), false);
  }
});

const presenceMessage =
  "expect(received).toBeInTheDocument()\nreceived value must be an HTMLElement";
const classPresenceSource = (
  selector,
  extra = "",
  target = "container.querySelector"
) => `
describe("A suite", () => {
  describe("Nested suite", () => {
    it("checks a container", () => {
      const { container } = render(<Field leftIcon={<span>L</span>} />);
      const inputContainer = ${target}(${JSON.stringify(selector)});
      expect(inputContainer).toBeInTheDocument();
      ${extra}
    });
  });
});`;
const classifySource = (source, message = presenceMessage) =>
  isStyleAssertion("arbitrary name", message, {
    source,
    fullName: "A suite Nested suite checks a container",
  });

test("recognizes only AST-verified semantic class presence checks", () => {
  for (const selector of [
    ".border-semantic-error-primary",
    ".border-semantic-border-input",
    ".border-v2-semantic-border-input",
    ".bg-semantic-bg-primary",
  ]) {
    assert.equal(classifySource(classPresenceSource(selector)), true, selector);
  }
  assert.equal(
    isStyleAssertion("A style-like test title", presenceMessage),
    false
  );
});

test("does not hide id, role, text, attribute or structural selector failures", () => {
  for (const selector of [
    "#border-semantic-error-primary",
    '[data-testid="border-semantic-error-primary"]',
    '[role="alert"]',
    "input.border-semantic-border-input",
    ".border-semantic-border-input input",
    ".border-semantic-border-input .child",
    ".border-semantic-border-input, .other",
    ".custom-class",
  ]) {
    assert.equal(
      classifySource(classPresenceSource(selector)),
      false,
      selector
    );
  }
  for (const query of [
    "screen.getByRole",
    "screen.getByText",
    "screen.getByTestId",
  ]) {
    assert.equal(
      classifySource(
        classPresenceSource(".border-semantic-error-primary", "", query)
      ),
      false,
      query
    );
  }
});

test("does not hide compound behavior, callback, ref or interaction checks", () => {
  for (const extra of [
    "expect(onChange).toHaveBeenCalledOnce();",
    "expect(ref.current).toBe(inputContainer);",
    "expect(inputContainer).toHaveAttribute('aria-invalid', 'true');",
    "expect(screen.getByRole('textbox')).toBeInTheDocument();",
    "fireEvent.click(inputContainer);",
  ]) {
    assert.equal(
      classifySource(
        classPresenceSource(".border-semantic-error-primary", extra)
      ),
      false,
      extra
    );
  }
  const source = classPresenceSource(".border-semantic-error-primary");
  assert.equal(
    classifySource(source, "ReferenceError: container is not defined"),
    false
  );
  assert.equal(
    classifySource(
      source.replace("expect(inputContainer)", "expect(otherElement)")
    ),
    false
  );
  assert.equal(
    classifySource(
      source.replace("expect(inputContainer).", "expect(inputContainer).not.")
    ),
    false
  );
  assert.equal(
    classifySource(
      source.replace("container.querySelector", "container.querySelectorAll")
    ),
    false
  );
  assert.equal(
    classifySource(source.replace("render(<Field", "someOtherFunction(<Field")),
    false
  );
});
