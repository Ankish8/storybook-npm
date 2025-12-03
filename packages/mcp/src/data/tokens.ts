import type { DesignToken } from "../types/index.js";

export const designTokens: DesignToken[] = [
  // Primary Colors
  {
    name: "Primary",
    value: "#343E55",
    category: "colors",
    description: "Primary brand color used for buttons, links, and emphasis",
  },
  {
    name: "Primary Hover",
    value: "#343E55/90",
    category: "colors",
    description: "Primary color at 90% opacity for hover states",
  },

  // Status Colors
  {
    name: "Active/Success",
    value: "#00A651",
    category: "colors",
    description: "Green color for active/success states",
  },
  {
    name: "Active Background",
    value: "#E5FFF5",
    category: "colors",
    description: "Light green background for active badges",
  },
  {
    name: "Failed/Error",
    value: "#FF3B3B",
    category: "colors",
    description: "Red color for failed/error states",
  },
  {
    name: "Failed Background",
    value: "#FFECEC",
    category: "colors",
    description: "Light red background for failed badges",
  },
  {
    name: "Warning",
    value: "#F59E0B",
    category: "colors",
    description: "Amber color for warning states",
  },
  {
    name: "Warning Background",
    value: "#FFF8E5",
    category: "colors",
    description: "Light amber background for warnings",
  },

  // Neutral Colors
  {
    name: "Text Primary",
    value: "#333333",
    category: "colors",
    description: "Primary text color",
  },
  {
    name: "Text Secondary",
    value: "#6B7280",
    category: "colors",
    description: "Secondary/muted text color",
  },
  {
    name: "Text Tertiary",
    value: "#9CA3AF",
    category: "colors",
    description: "Tertiary text color for hints",
  },
  {
    name: "Border",
    value: "#E5E7EB",
    category: "colors",
    description: "Default border color",
  },
  {
    name: "Background Muted",
    value: "#F3F4F6",
    category: "colors",
    description: "Muted background for tags, disabled states",
  },
  {
    name: "Background Hover",
    value: "#F9FAFB",
    category: "colors",
    description: "Hover background for table rows, menu items",
  },
  {
    name: "Background Highlight",
    value: "#EBF5FF",
    category: "colors",
    description: "Blue highlight background for selected rows",
  },

  // CSS Variables
  {
    name: "background",
    value: "0 0% 100%",
    category: "colors",
    cssVariable: "--background",
    description: "HSL value for page background",
  },
  {
    name: "foreground",
    value: "222.2 84% 4.9%",
    category: "colors",
    cssVariable: "--foreground",
    description: "HSL value for default text",
  },
  {
    name: "primary",
    value: "222.2 47.4% 11.2%",
    category: "colors",
    cssVariable: "--primary",
    description: "HSL value for primary color",
  },
  {
    name: "secondary",
    value: "210 40% 96.1%",
    category: "colors",
    cssVariable: "--secondary",
    description: "HSL value for secondary color",
  },
  {
    name: "destructive",
    value: "0 84.2% 60.2%",
    category: "colors",
    cssVariable: "--destructive",
    description: "HSL value for destructive actions",
  },
  {
    name: "muted",
    value: "210 40% 96.1%",
    category: "colors",
    cssVariable: "--muted",
    description: "HSL value for muted elements",
  },
  {
    name: "accent",
    value: "210 40% 96.1%",
    category: "colors",
    cssVariable: "--accent",
    description: "HSL value for accents",
  },
  {
    name: "border",
    value: "214.3 31.8% 91.4%",
    category: "colors",
    cssVariable: "--border",
    description: "HSL value for borders",
  },
  {
    name: "ring",
    value: "222.2 84% 4.9%",
    category: "colors",
    cssVariable: "--ring",
    description: "HSL value for focus rings",
  },

  // Spacing
  {
    name: "Spacing XS",
    value: "0.5rem (8px)",
    category: "spacing",
    description: "Extra small spacing",
  },
  {
    name: "Spacing SM",
    value: "0.75rem (12px)",
    category: "spacing",
    description: "Small spacing",
  },
  {
    name: "Spacing MD",
    value: "1rem (16px)",
    category: "spacing",
    description: "Medium spacing (default)",
  },
  {
    name: "Spacing LG",
    value: "1.5rem (24px)",
    category: "spacing",
    description: "Large spacing",
  },
  {
    name: "Spacing XL",
    value: "2rem (32px)",
    category: "spacing",
    description: "Extra large spacing",
  },

  // Button Padding
  {
    name: "Button SM Padding",
    value: "py-2 px-3 (8px 12px)",
    category: "spacing",
    description: "Small button padding",
  },
  {
    name: "Button Default Padding",
    value: "py-2.5 px-4 (10px 16px)",
    category: "spacing",
    description: "Default button padding",
  },
  {
    name: "Button LG Padding",
    value: "py-3 px-6 (12px 24px)",
    category: "spacing",
    description: "Large button padding",
  },

  // Border Radius
  {
    name: "Radius",
    value: "0.5rem (8px)",
    category: "radius",
    cssVariable: "--radius",
    description: "Default border radius",
  },
  {
    name: "Radius SM",
    value: "0.25rem (4px)",
    category: "radius",
    description: "Small border radius (buttons)",
  },
  {
    name: "Radius MD",
    value: "0.375rem (6px)",
    category: "radius",
    description: "Medium border radius",
  },
  {
    name: "Radius LG",
    value: "0.5rem (8px)",
    category: "radius",
    description: "Large border radius (cards, tables)",
  },
  {
    name: "Radius Full",
    value: "9999px",
    category: "radius",
    description: "Full/pill border radius (badges)",
  },

  // Typography
  {
    name: "Text XS",
    value: "0.75rem (12px)",
    category: "typography",
    description: "Extra small text size",
  },
  {
    name: "Text SM",
    value: "0.875rem (14px)",
    category: "typography",
    description: "Small text size (default for components)",
  },
  {
    name: "Text Base",
    value: "1rem (16px)",
    category: "typography",
    description: "Base text size",
  },
  {
    name: "Font Normal",
    value: "400",
    category: "typography",
    description: "Normal font weight",
  },
  {
    name: "Font Medium",
    value: "500",
    category: "typography",
    description: "Medium font weight (buttons)",
  },
  {
    name: "Font Semibold",
    value: "600",
    category: "typography",
    description: "Semibold font weight (badges, labels)",
  },
];

export function getTokensByCategory(
  category?: string
): DesignToken[] {
  if (!category) {
    return designTokens;
  }
  return designTokens.filter((token) => token.category === category);
}

export function getCategories(): string[] {
  return [...new Set(designTokens.map((token) => token.category))];
}
