#!/bin/bash

# Validate CSS Variables Script
# Checks component files for hardcoded colors and ensures CSS variables are used
# Exit 0 = success (validation passed)
# Exit 1 = failure (hardcoded colors found)

# Get the file path from the tool use (passed as argument or from LAST_TOOL_FILE env var)
FILE_PATH="${1:-$LAST_TOOL_FILE}"

# Only validate component files
if [[ ! "$FILE_PATH" =~ src/components/ ]] || [[ "$FILE_PATH" =~ \.test\. ]] || [[ "$FILE_PATH" =~ \.stories\. ]]; then
  exit 0  # Skip validation for non-component files
fi

# Check if file exists
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0  # File doesn't exist yet, skip
fi

echo "🔍 Validating CSS variables in: $FILE_PATH"

# Track if we found any issues
ISSUES_FOUND=0

# Check for hardcoded hex colors (e.g., #343E55, #FFF)
HEX_COLORS=$(grep -n "#[0-9A-Fa-f]\{3,6\}" "$FILE_PATH" | grep -v "^[[:space:]]*\/\/" | grep -v "^[[:space:]]*\*")
if [[ -n "$HEX_COLORS" ]]; then
  echo ""
  echo "❌ Found hardcoded hex colors:"
  echo "$HEX_COLORS"
  echo ""
  echo "💡 Fix: Replace with CSS variables"
  echo "   Example: bg-[#343E55] → bg-primary"
  ISSUES_FOUND=1
fi

# Check for rgb/rgba/hsl/hsla values
RGB_COLORS=$(grep -n -E "(rgb|hsl)a?\(" "$FILE_PATH" | grep -v "^[[:space:]]*\/\/" | grep -v "^[[:space:]]*\*")
if [[ -n "$RGB_COLORS" ]]; then
  echo ""
  echo "❌ Found RGB/HSL color values:"
  echo "$RGB_COLORS"
  echo ""
  echo "💡 Fix: Replace with CSS variables"
  echo "   Example: bg-[rgb(52,62,85)] → bg-primary"
  ISSUES_FOUND=1
fi

# Check for hardcoded Tailwind color scales (bg-gray-50, text-red-500, etc.)
TAILWIND_COLORS=$(grep -n -E "bg-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}" "$FILE_PATH" | grep -v "^[[:space:]]*\/\/" | grep -v "^[[:space:]]*\*")
if [[ -n "$TAILWIND_COLORS" ]]; then
  echo ""
  echo "❌ Found hardcoded Tailwind color scales:"
  echo "$TAILWIND_COLORS"
  echo ""
  echo "💡 Fix: Replace with semantic CSS variables"
  echo "   Example: bg-gray-50 → bg-muted"
  echo "            text-red-500 → text-destructive"
  ISSUES_FOUND=1
fi

# Check for hardcoded color names (but allow 'white' and 'black' as they might be intentional)
COLOR_NAMES=$(grep -n -E "(^|[^a-zA-Z])(red|blue|green|yellow|purple|pink|orange|gray|grey)([^a-zA-Z]|$)" "$FILE_PATH" | grep className | grep -v "^[[:space:]]*\/\/" | grep -v "^[[:space:]]*\*")
if [[ -n "$COLOR_NAMES" ]]; then
  echo ""
  echo "⚠️  Warning: Found color names in className (review manually):"
  echo "$COLOR_NAMES"
  echo ""
  echo "💡 If these are colors, replace with CSS variables"
  # Don't fail for this, just warn
fi

# If issues were found, provide summary and exit with error
if [[ $ISSUES_FOUND -eq 1 ]]; then
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "❌ Design System Validation Failed"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Component uses hardcoded colors instead of CSS variables."
  echo ""
  echo "Common CSS Variable Mappings:"
  echo ""
  echo "Backgrounds:"
  echo "  #FFFFFF, white → bg-background"
  echo "  #343E55 → bg-primary"
  echo "  #F3F4F6 → bg-muted"
  echo "  #EF4444 → bg-destructive"
  echo ""
  echo "Text:"
  echo "  #000000, black → text-foreground"
  echo "  #333333 → text-foreground"
  echo "  #666666 → text-muted-foreground"
  echo ""
  echo "Borders:"
  echo "  #E4E4E4 → border-semantic-border-layout"
  echo "  #D1D5DB → border-input"
  echo ""
  echo "Please update the component to use semantic CSS variables."
  echo ""
  exit 1
fi

echo "✅ CSS variable validation passed"
exit 0
