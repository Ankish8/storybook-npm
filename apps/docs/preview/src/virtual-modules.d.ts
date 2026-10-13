declare module "virtual:docs-legacy-stories" {
  export const v1: Record<string, () => Promise<Record<string, unknown>>>;
  export const v2: Record<string, () => Promise<Record<string, unknown>>>;
  export const earlier: Record<string, () => Promise<Record<string, unknown>>>;
  export const refreshed: Record<
    string,
    () => Promise<Record<string, unknown>>
  >;
}
declare module "virtual:docs-legacy-preview.css";
