import * as React from "react";
import {
  useStoryContext,
  type PreparedStory,
  type StoryContextOverrides,
} from "./preview-api";

export function createStoryRenderer(
  prepared: Pick<PreparedStory, "story" | "meta" | "decorators">
) {
  const render =
    prepared.story.render ||
    (typeof prepared.story === "function"
      ? prepared.story
      : prepared.meta.render);
  let Story: React.ComponentType<{ overrides?: StoryContextOverrides }> =
    function StoryRender({ overrides }) {
      const context = useStoryContext();
      const effective = overrides
        ? {
            ...context,
            ...overrides,
            args: { ...context.args, ...overrides.args },
          }
        : context;
      if (render) return render(effective.args, effective);
      if (!prepared.meta.component)
        throw new Error("Story requires a render function or component.");
      return React.createElement(prepared.meta.component, effective.args);
    };
  for (const decorator of prepared.decorators) {
    const Previous = Story;
    const Overrides = React.createContext<StoryContextOverrides | undefined>(
      undefined
    );
    // Stable decorator child identity keeps focused fields mounted during useArgs updates.
    const Inner = (update: StoryContextOverrides = {}) => {
      const inherited = React.useContext(Overrides);
      return <Previous overrides={{ ...inherited, ...update }} />;
    };
    Story = function StoryDecorator({ overrides }) {
      const base = useStoryContext();
      const context = overrides
        ? { ...base, ...overrides, args: { ...base.args, ...overrides.args } }
        : base;
      return (
        <Overrides.Provider value={overrides}>
          {decorator(Inner, context)}
        </Overrides.Provider>
      );
    };
  }
  return Story;
}
