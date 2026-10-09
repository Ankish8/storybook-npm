import * as React from "react";
import { useStoryContext } from "./preview-api";

export function createStoryRenderer(prepared: any) {
  const render =
    prepared.story.render ||
    (typeof prepared.story === "function"
      ? prepared.story
      : prepared.meta.render);
  let Story: React.ComponentType<{ overrides?: any }> = function StoryRender({
    overrides,
  }) {
    const context = useStoryContext();
    const effective = overrides
      ? {
          ...context,
          ...overrides,
          args: { ...context.args, ...overrides.args },
        }
      : context;
    return render
      ? render(effective.args, effective)
      : React.createElement(prepared.meta.component, effective.args);
  };
  for (const decorator of prepared.decorators) {
    const Previous = Story;
    const Overrides = React.createContext<any>(undefined);
    // Stable decorator child identity keeps focused fields mounted during useArgs updates.
    const Inner = (update: any = {}) => {
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
