import { createContext, useContext } from "react";
import type { ComponentType, ElementType, ReactNode } from "react";

export type Args = Record<string, unknown>;
export type StoryParameters = Record<string, unknown> & {
  layout?: string;
  docs?: { description?: { component?: string; story?: string } };
};
export type StoryContext = Record<string, unknown> & {
  args: Args;
  initialArgs?: Args;
  parameters?: StoryParameters;
};
export type StoryContextOverrides = Partial<StoryContext>;
export type StoryRender = (args: Args, context: StoryContext) => ReactNode;
export type StoryDefinition = {
  render?: StoryRender;
  name?: string;
  storyName?: string;
  parameters?: StoryParameters;
  tags?: string[];
  play?: unknown;
};
export type PreviewStory = StoryDefinition | (StoryRender & StoryDefinition);
export type StoryDecorator = (
  Story: ComponentType<StoryContextOverrides>,
  context: StoryContext
) => ReactNode;
export type StoryMetadata = StoryDefinition & { component?: ElementType };
export type PreparedStory = {
  component: string;
  id: string;
  title: string;
  meta: StoryMetadata;
  story: PreviewStory;
  entries: { id: string; name: string; story: PreviewStory }[];
  parameters: StoryParameters;
  argTypes: Record<string, unknown>;
  initialArgs: Args;
  decorators: StoryDecorator[];
};
export type PreviewContextValue = {
  args: Args;
  updateArgs: (patch: Args) => void;
  resetArgs: (names?: string[]) => void;
  context: StoryContext;
};
export const PreviewContext = createContext<PreviewContextValue | null>(null);
export function useArgs<T extends object = Args>(): [
  T,
  (patch: Partial<T>) => void,
  (names?: string[]) => void,
] {
  const value = useContext(PreviewContext);
  if (!value)
    throw new Error("useArgs requires the isolated v2 preview provider.");
  // Story authors choose the args shape; keep the provider's stable updater identity.
  return [
    value.args as T,
    value.updateArgs as (patch: Partial<T>) => void,
    value.resetArgs,
  ];
}
export function useStoryContext() {
  const value = useContext(PreviewContext);
  if (!value)
    throw new Error("Story context requires the isolated v2 preview provider.");
  return value.context;
}
