function looksLikeTailwindClasses(str) {
  if (!str || !str.trim()) return false;
  const nonClassValues = [
    "button", "submit", "reset", "text", "email", "password", "number", "tel", "url", "search",
    "checkbox", "radio", "file", "hidden", "image", "color", "date", "time", "datetime-local",
    "default", "error", "warning", "success", "info", "primary", "secondary", "tertiary",
    "destructive", "outline", "ghost", "link", "dashed", "solid", "none",
    "open", "closed", "true", "false", "null", "undefined",
    "single", "multiple", "listbox", "combobox", "menu", "menuitem", "option", "switch",
    "small", "medium", "large", "sm", "md", "lg", "xl", "2xl",
    "top", "bottom", "left", "right", "center", "start", "end",
    "horizontal", "vertical", "both", "auto",
    "asc", "desc", "ascending", "descending",
  ];
  if (nonClassValues.includes(str.toLowerCase())) return false;
  if (/^[A-Z][a-zA-Z]*$/.test(str)) return false;
  if (str.startsWith("@") || str.startsWith(".") || str.startsWith("/") || str.includes("::")) return false;

  // Skip npm package names - but NOT if they look like Tailwind utility classes
  // Tailwind utilities typically have patterns like: prefix-value (text-xs, bg-blue, p-4)
  // NPM packages are typically longer and don't follow utility patterns
  const tailwindUtilityPrefixes = ["text", "bg", "p", "m", "px", "py", "mx", "my", "pt", "pb", "pl", "pr", "mt", "mb", "ml", "mr", "w", "h", "min", "max", "gap", "space", "border", "rounded", "shadow", "opacity", "font", "leading", "tracking", "z", "inset", "top", "bottom", "left", "right", "flex", "grid", "col", "row", "justify", "items", "content", "self", "place", "order", "float", "clear", "object", "overflow", "overscroll", "scroll", "list", "appearance", "cursor", "pointer", "resize", "select", "fill", "stroke", "table", "caption", "transition", "duration", "ease", "delay", "animate", "transform", "origin", "scale", "rotate", "translate", "skew", "accent", "caret", "outline", "ring", "blur", "brightness", "contrast", "grayscale", "hue", "invert", "saturate", "sepia", "backdrop", "divide", "sr", "not", "snap", "touch", "will", "aspect", "container", "columns", "break", "box", "isolation", "mix", "filter", "drop"];

  // Check if it looks like a Tailwind utility (prefix-value pattern)
  if (str.includes("-") && !str.includes(" ")) {
    const prefix = str.split("-")[0];
    if (tailwindUtilityPrefixes.includes(prefix)) {
      return true;  // This is a Tailwind class, not npm package
    }
  }

  if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(str) && !str.includes(" ")) return false;

  const words = str.split(/\s+/);
  return words.some(cls => {
    if (!cls) return false;
    if ((cls.startsWith("aria-") || cls.startsWith("data-")) && !cls.includes("[") && !cls.includes(":")) return false;
    const singleWordUtilities = /^(flex|grid|block|inline|contents|flow-root|hidden|invisible|visible|static|fixed|absolute|relative|sticky)$/;
    if (singleWordUtilities.test(cls)) return true;
    if (cls.includes("-")) return true;
    if (cls.includes("[") && cls.includes("]")) return true;
    if (cls.includes(":")) return true;
    return false;
  });
}
console.log("text-xs:", looksLikeTailwindClasses("text-xs"));
console.log("h-10 px-4:", looksLikeTailwindClasses("h-10 px-4"));
console.log("react-dom:", looksLikeTailwindClasses("react-dom"));
console.log("lucide-react:", looksLikeTailwindClasses("lucide-react"));
console.log("bg-red-500:", looksLikeTailwindClasses("bg-red-500"));
console.log("clsx:", looksLikeTailwindClasses("clsx"));
