import type { ComponentMetadata } from "../types/index.js";

// Component source code for copy/paste
export const componentSourceCode: Record<string, string> = {
  button: `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#343E55] text-white hover:bg-[#343E55]/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-[#343E55] bg-transparent text-[#343E55] hover:bg-[#343E55] hover:text-white",
        secondary: "bg-[#343E55]/20 text-[#343E55] hover:bg-[#343E55]/30",
        ghost: "hover:bg-[#343E55]/10 hover:text-[#343E55]",
        link: "text-[#343E55] underline-offset-4 hover:underline",
      },
      size: {
        default: "py-2.5 px-4",
        sm: "py-2 px-3 text-xs",
        lg: "py-3 px-6",
        icon: "p-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon, rightIcon, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }`,

  badge: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        active: "bg-[#E5FFF5] text-[#00A651]",
        failed: "bg-[#FFECEC] text-[#FF3B3B]",
        disabled: "bg-[#F3F5F6] text-[#6B7280]",
        default: "bg-[#F3F5F6] text-[#333333]",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, className }), "gap-1")}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="[&_svg]:size-3">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="[&_svg]:size-3">{rightIcon}</span>}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }`,

  tag: `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const tagVariants = cva(
  "inline-flex items-center justify-center rounded text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F3F4F6] text-[#333333]",
        primary: "bg-[#343E55]/10 text-[#343E55]",
        secondary: "bg-[#E5E7EB] text-[#374151]",
        success: "bg-[#E5FFF5] text-[#00A651]",
        warning: "bg-[#FFF8E5] text-[#F59E0B]",
        error: "bg-[#FFECEC] text-[#FF3B3B]",
      },
      size: {
        default: "px-2 py-1",
        sm: "px-1.5 py-0.5 text-xs",
        lg: "px-3 py-1.5",
      },
      interactive: {
        true: "cursor-pointer hover:bg-[#E5E7EB] active:bg-[#D1D5DB]",
        false: "",
      },
      selected: {
        true: "ring-2 ring-[#343E55] ring-offset-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
      selected: false,
    },
  }
)

export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {
  label?: string
  interactive?: boolean
  selected?: boolean
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant, size, interactive, selected, label, children, ...props }, ref) => {
    return (
      <span
        className={cn(tagVariants({ variant, size, interactive, selected, className }))}
        ref={ref}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-selected={selected}
        {...props}
      >
        {label && <span className="font-semibold mr-1">{label}</span>}
        <span className="font-normal">{children}</span>
      </span>
    )
  }
)
Tag.displayName = "Tag"

export { Tag, tagVariants }`,
};

// Utility function source code
export const utilsSourceCode = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

// CSS styles
export const cssStyles = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`;

export const componentMetadata: Record<string, ComponentMetadata> = {
  button: {
    name: "Button",
    description:
      "A customizable button component with variants, sizes, and icons. Supports loading states and can render as a child element using Radix Slot.",
    dependencies: [
      "@radix-ui/react-slot",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "variant",
        type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        required: false,
        description: "The visual style of the button",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg" | "icon"',
        required: false,
        description: "The size of the button",
        defaultValue: "default",
      },
      {
        name: "asChild",
        type: "boolean",
        required: false,
        description: "Render as child element using Radix Slot",
        defaultValue: "false",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the left side of the button text",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the right side of the button text",
      },
      {
        name: "loading",
        type: "boolean",
        required: false,
        description: "Shows loading spinner and disables button",
        defaultValue: "false",
      },
      {
        name: "loadingText",
        type: "string",
        required: false,
        description: "Text shown during loading state",
      },
      {
        name: "disabled",
        type: "boolean",
        required: false,
        description: "Disables the button",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "variant",
        options: [
          "default",
          "destructive",
          "outline",
          "secondary",
          "ghost",
          "link",
        ],
        defaultValue: "default",
      },
      {
        name: "size",
        options: ["default", "sm", "lg", "icon"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Button",
        code: '<Button>Click me</Button>',
        description: "Simple button with default styling",
      },
      {
        title: "Button Variants",
        code: `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>`,
        description: "All available button variants",
      },
      {
        title: "Button with Icons",
        code: `import { Mail, ArrowRight } from "lucide-react"

<Button leftIcon={<Mail />}>Send Email</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>`,
        description: "Buttons with left or right icons",
      },
      {
        title: "Loading State",
        code: `<Button loading>Loading</Button>
<Button loading loadingText="Saving...">Save</Button>`,
        description: "Button with loading spinner",
      },
      {
        title: "Icon Only Button",
        code: `import { Plus } from "lucide-react"

<Button size="icon" aria-label="Add item">
  <Plus />
</Button>`,
        description: "Square icon-only button",
      },
    ],
  },

  badge: {
    name: "Badge",
    description:
      "A status badge component with active, failed, and disabled variants. Pill-shaped badges with different colors for different states.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "variant",
        type: '"active" | "failed" | "disabled" | "default"',
        required: false,
        description: "The visual style of the badge",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        required: false,
        description: "The size of the badge",
        defaultValue: "default",
      },
      {
        name: "leftIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the left side of the badge text",
      },
      {
        name: "rightIcon",
        type: "React.ReactNode",
        required: false,
        description: "Icon displayed on the right side of the badge text",
      },
    ],
    variants: [
      {
        name: "variant",
        options: ["active", "failed", "disabled", "default"],
        defaultValue: "default",
      },
      {
        name: "size",
        options: ["default", "sm", "lg"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Status Badges",
        code: `<Badge variant="active">Active</Badge>
<Badge variant="failed">Failed</Badge>
<Badge variant="disabled">Disabled</Badge>
<Badge variant="default">Default</Badge>`,
        description: "Badges for different status states",
      },
      {
        title: "Badge with Icons",
        code: `import { Check, X } from "lucide-react"

<Badge variant="active" leftIcon={<Check />}>Success</Badge>
<Badge variant="failed" leftIcon={<X />}>Error</Badge>`,
        description: "Badges with status icons",
      },
      {
        title: "Badge Sizes",
        code: `<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>`,
        description: "Different badge sizes",
      },
    ],
  },

  tag: {
    name: "Tag",
    description:
      "A tag component for event labels with optional bold label prefix. Rounded rectangle tags for categorization.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "variant",
        type: '"default" | "primary" | "secondary" | "success" | "warning" | "error"',
        required: false,
        description: "The visual style of the tag",
        defaultValue: "default",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        required: false,
        description: "The size of the tag",
        defaultValue: "default",
      },
      {
        name: "label",
        type: "string",
        required: false,
        description: "Bold label prefix displayed before the content",
      },
      {
        name: "interactive",
        type: "boolean",
        required: false,
        description: "Make the tag clickable with hover/active states",
        defaultValue: "false",
      },
      {
        name: "selected",
        type: "boolean",
        required: false,
        description: "Show selected state with ring outline",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "variant",
        options: ["default", "primary", "secondary", "success", "warning", "error"],
        defaultValue: "default",
      },
      {
        name: "size",
        options: ["default", "sm", "lg"],
        defaultValue: "default",
      },
    ],
    examples: [
      {
        title: "Basic Tags",
        code: `<Tag>After Call Event</Tag>
<Tag variant="primary">Primary</Tag>
<Tag variant="success">Success</Tag>`,
        description: "Simple tag labels",
      },
      {
        title: "Tag with Label Prefix",
        code: `<Tag label="In Call Event:">Start of call, Bridge, Call ended</Tag>
<Tag label="Category:">Marketing</Tag>`,
        description: "Tags with bold label prefix",
      },
      {
        title: "Interactive Tags",
        code: `<Tag interactive onClick={() => console.log('clicked')}>
  Clickable
</Tag>
<Tag interactive selected>Selected Tag</Tag>`,
        description: "Clickable and selectable tags",
      },
    ],
  },

  table: {
    name: "Table",
    description:
      "A composable table component with size variants, loading/empty states, sticky columns, and sorting support.",
    dependencies: ["class-variance-authority", "clsx", "tailwind-merge"],
    props: [
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        required: false,
        description: "The row height of the table",
        defaultValue: "md",
      },
      {
        name: "withoutBorder",
        type: "boolean",
        required: false,
        description: "Remove outer border from the table",
        defaultValue: "false",
      },
    ],
    variants: [
      {
        name: "size",
        options: ["sm", "md", "lg"],
        defaultValue: "md",
      },
    ],
    examples: [
      {
        title: "Basic Table",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell><Badge variant="active">Active</Badge></TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        description: "Simple table with header and body",
      },
      {
        title: "Table with Loading State",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableSkeleton rows={5} columns={2} />
  </TableBody>
</Table>`,
        description: "Table showing loading skeleton",
      },
      {
        title: "Table with Empty State",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableEmpty colSpan={2}>No results found</TableEmpty>
  </TableBody>
</Table>`,
        description: "Table showing empty state message",
      },
      {
        title: "Table with Sticky Column",
        code: `<Table>
  <TableHeader>
    <TableRow>
      <TableHead sticky>ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Description</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell sticky>001</TableCell>
      <TableCell>Item Name</TableCell>
      <TableCell>Long description text...</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
        description: "Table with sticky first column",
      },
    ],
  },

  "dropdown-menu": {
    name: "DropdownMenu",
    description:
      "A dropdown menu component for displaying actions and options. Built on Radix UI with full keyboard navigation support.",
    dependencies: [
      "@radix-ui/react-dropdown-menu",
      "clsx",
      "tailwind-merge",
      "lucide-react",
    ],
    props: [
      {
        name: "DropdownMenu",
        type: "Root component",
        required: true,
        description: "Wrapper component that manages dropdown state",
      },
      {
        name: "DropdownMenuTrigger",
        type: "Trigger component",
        required: true,
        description: "The button that opens the dropdown",
      },
      {
        name: "DropdownMenuContent",
        type: "Content component",
        required: true,
        description: "Container for menu items",
      },
      {
        name: "DropdownMenuItem",
        type: "Item component",
        required: false,
        description: "Individual menu item",
      },
      {
        name: "DropdownMenuCheckboxItem",
        type: "Checkbox item component",
        required: false,
        description: "Menu item with checkbox",
      },
      {
        name: "DropdownMenuRadioGroup",
        type: "Radio group component",
        required: false,
        description: "Group of radio menu items",
      },
      {
        name: "DropdownMenuSeparator",
        type: "Separator component",
        required: false,
        description: "Visual separator between items",
      },
    ],
    variants: [],
    examples: [
      {
        title: "Basic Dropdown",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: "Simple dropdown with menu items",
      },
      {
        title: "Dropdown with Checkbox Items",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuCheckboxItem checked={showStatus}>
      Show Status Bar
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem checked={showPanel}>
      Show Panel
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: "Dropdown with checkable items",
      },
      {
        title: "Dropdown with Submenu",
        code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>New File</DropdownMenuItem>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem>Email</DropdownMenuItem>
        <DropdownMenuItem>Slack</DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>`,
        description: "Nested dropdown with submenu",
      },
    ],
  },
};

export function getComponentNames(): string[] {
  return Object.keys(componentMetadata);
}

export function getComponent(name: string): ComponentMetadata | undefined {
  return componentMetadata[name.toLowerCase()];
}
