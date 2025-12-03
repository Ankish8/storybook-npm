export interface ComponentMetadata {
  name: string;
  description: string;
  dependencies: string[];
  props: PropDefinition[];
  variants: VariantDefinition[];
  examples: CodeExample[];
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

export interface VariantDefinition {
  name: string;
  options: string[];
  defaultValue: string;
}

export interface CodeExample {
  title: string;
  code: string;
  description?: string;
}

export interface DesignToken {
  name: string;
  value: string;
  category: "colors" | "spacing" | "radius" | "typography";
  cssVariable?: string;
  description?: string;
}

export interface AccessibilityGuideline {
  component: string;
  guidelines: {
    category: string;
    items: string[];
  }[];
  ariaAttributes: {
    attribute: string;
    usage: string;
  }[];
  keyboardSupport: {
    key: string;
    action: string;
  }[];
}

export interface ToolResponse {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}
