import { createContext, useContext } from "react";

export type Args = Record<string, any>;
export type PreviewContextValue = {
  args: Args;
  updateArgs: (patch: Args) => void;
  resetArgs: (names?: string[]) => void;
  context: any;
};
export const PreviewContext = createContext<PreviewContextValue | null>(null);
export function useArgs<T extends Args = Args>(): [
  T,
  (patch: Partial<T>) => void,
  (names?: string[]) => void,
] {
  const value = useContext(PreviewContext);
  if (!value)
    throw new Error("useArgs requires the isolated v2 preview provider.");
  return [value.args as T, value.updateArgs, value.resetArgs];
}
export function useStoryContext() {
  const value = useContext(PreviewContext);
  if (!value)
    throw new Error("Story context requires the isolated v2 preview provider.");
  return value.context;
}
