import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { composeStories } from "@storybook/react";

import * as stories from "../login.stories";

const composed = composeStories(stories);

/**
 * Renders every story through Storybook's own machinery. This catches story-level
 * runtime faults that `tsc` and ESLint cannot see — notably calling a Storybook
 * preview hook (`useArgs`) outside a story function or decorator, which throws
 * "Storybook preview hooks can only be called inside decorators and story
 * functions" only once the story is actually rendered.
 */
describe("login stories", () => {
  it("exposes every documented story", () => {
    expect(Object.keys(composed).length).toBeGreaterThan(15);
  });

  it.each(Object.keys(composed))("renders %s without throwing", (name) => {
    const Story = composed[name as keyof typeof composed];
    expect(() => {
      const { unmount } = render(<Story />);
      unmount();
    }).not.toThrow();
  });

  /**
   * The composite stories render the step forms directly instead of through
   * `Login`, so seeding a field by passing the arg straight to `mobileNumber`
   * puts it in controlled mode with no change handler — the field then looks
   * prefilled but silently rejects typing. Each must own its value in state.
   */
  describe.each([
    ["AllSteps", stories.AllSteps.args?.mobileNumber],
    ["AllErrorStates", stories.AllErrorStates.args?.mobileNumber],
  ] as const)("%s prefilled fields stay editable", (name, seeded) => {
    it("seeds the mobile number from args", () => {
      const Story = composed[name];
      const { getAllByDisplayValue } = render(<Story />);
      expect(getAllByDisplayValue(String(seeded)).length).toBeGreaterThan(0);
    });

    it("accepts typing over the seeded value", async () => {
      const Story = composed[name];
      const { getAllByDisplayValue } = render(<Story />);
      const field = getAllByDisplayValue(String(seeded))[0] as HTMLInputElement;

      await userEvent.clear(field);
      await userEvent.type(field, "1234567890");

      expect(field.value).toBe("1234567890");
    });
  });
});
