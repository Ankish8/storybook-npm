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
