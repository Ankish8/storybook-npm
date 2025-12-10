/**
 * Design System Color Tokens
 *
 * This file defines all color tokens used in the myOperator UI design system.
 * Colors are organized into:
 * - Primitive Colors: Raw color values organized by hue and shade
 * - Semantic Colors: Purpose-driven colors that reference primitives
 *
 * Usage:
 * - Components should use semantic colors whenever possible
 * - Use primitive colors only when semantic colors don't fit the use case
 */

// =============================================================================
// PRIMITIVE COLORS
// =============================================================================

/**
 * Base colors - Black and White
 */
export const base = {
  white: '#FFFFFF',
  black: '#000000',
} as const

/**
 * Neutral (Gray) - Foundation of the color system
 * Used for text, form fields, backgrounds, dividers
 */
export const neutral = {
  25: '#FDFDFD',
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E9EAEB',
  300: '#D5D7DA',
  400: '#A4A7AE',
  500: '#717680',
  600: '#535862',
  700: '#414651',
  800: '#252B37',
  900: '#181D27',
  950: '#0A0D12',
} as const

/**
 * Primary (Blue Gray) - Main interactive color
 * Used for buttons, links, inputs, and primary UI elements
 */
export const primary = {
  25: '#F9FAFB',
  50: '#EBECEE',
  100: '#C0C3CA',
  200: '#A2A6B1',
  300: '#777E8D',
  400: '#5D6577',
  500: '#343E55',
  600: '#2F384D',
  700: '#252C3C',
  800: '#1D222F',
  900: '#161A24',
  950: '#0C0F12',
} as const

/**
 * Secondary (Turquoise) - Brand accent color
 * Used for brand emphasis, accents, and secondary actions
 */
export const secondary = {
  25: '#F6FCFD',
  50: '#EAF8FA',
  100: '#BDEAEF',
  200: '#9DE0E7',
  300: '#71D2DB',
  400: '#55C9D5',
  500: '#2BBCCA',
  600: '#27ABB8',
  700: '#1F858F',
  800: '#18676F',
  900: '#124F55',
  950: '#0F3D3D',
} as const

/**
 * Error (Red) - Destructive actions and error states
 */
export const error = {
  25: '#FFFBFA',
  50: '#FEF3F2',
  100: '#FEE4E2',
  200: '#FECDCA',
  300: '#FDA29B',
  400: '#F97066',
  500: '#F04438',
  600: '#D92D20',
  700: '#B42318',
  800: '#912018',
  900: '#7A271A',
  950: '#55160C',
} as const

/**
 * Warning (Amber/Orange) - Caution and alert states
 */
export const warning = {
  25: '#FFFCF5',
  50: '#FFFAEB',
  100: '#FEF0C7',
  200: '#FEDF89',
  300: '#FEC84B',
  400: '#FDB022',
  500: '#F79009',
  600: '#DC6803',
  700: '#B54708',
  800: '#93370D',
  900: '#7A2E0E',
  950: '#4E1D09',
} as const

/**
 * Success (Green) - Positive actions and success states
 */
export const success = {
  25: '#F6FEF9',
  50: '#ECFDF3',
  100: '#DCFAE6',
  200: '#ABEFC6',
  300: '#75E0A7',
  400: '#47CD89',
  500: '#17B26A',
  600: '#079455',
  700: '#067647',
  800: '#085D3A',
  900: '#074D31',
  950: '#053321',
} as const

/**
 * Info (Blue) - Informational states and links
 */
export const info = {
  25: '#F6F8FD',
  50: '#ECF1FB',
  100: '#C4D4F2',
  200: '#A8C0EC',
  300: '#80A3E4',
  400: '#6891DE',
  500: '#4275D6',
  600: '#3C6AC3',
  700: '#2F5398',
  800: '#244076',
  900: '#1C315A',
  950: '#182A44',
} as const

// =============================================================================
// SEMANTIC COLORS
// =============================================================================

/**
 * Primary Semantic Colors
 * Main UI interaction colors derived from Blue Gray palette
 */
export const semanticPrimary = {
  color: primary[500],           // #343E55 - Main interactive elements
  hover: primary[600],           // #2F384D - Hover state
  selected: primary[300],        // #777E8D - Selected state
  selectedHover: primary[400],   // #5D6577 - Selected + hover
  highlighted: primary[700],     // #252C3C - Highlighted/active
  surface: primary[50],          // #EBECEE - Light surface/background
} as const

/**
 * Brand Semantic Colors
 * Brand identity colors derived from Turquoise palette
 */
export const semanticBrand = {
  color: secondary[500],         // #2BBCCA - Brand primary
  hover: secondary[700],         // #1F858F - Brand hover
  selected: secondary[300],      // #71D2DB - Brand selected
  selectedHover: secondary[600], // #27ABB8 - Brand selected + hover
  highlighted: secondary[600],   // #27ABB8 - Brand highlighted
  surface: secondary[50],        // #EAF8FA - Brand surface
} as const

/**
 * Background Semantic Colors
 */
export const semanticBackground = {
  primary: base.white,           // #FFFFFF - Main background
  secondary: primary[950],       // #0C0F12 - Dark/inverted background
  ui: neutral[100],              // #F5F5F5 - UI element backgrounds
  grey: neutral[200],            // #E9EAEB - Grey backgrounds
  greyHover: neutral[400],       // #A4A7AE - Grey hover state
  inverted: base.black,          // #000000 - Inverted background
  hover: neutral[300],           // #D5D7DA - Primary hover background
} as const

/**
 * Text Semantic Colors
 */
export const semanticText = {
  primary: neutral[900],         // #181D27 - Primary text
  secondary: primary[500],       // #343E55 - Secondary text
  placeholder: primary[200],     // #A2A6B1 - Placeholder text
  link: info[500],               // #4275D6 - Link text
  inverted: base.white,          // #FFFFFF - Inverted text (on dark bg)
  muted: neutral[500],           // #717680 - Muted/helper text
} as const

/**
 * Border Semantic Colors
 */
export const semanticBorder = {
  primary: primary[500],         // #343E55 - Primary borders
  secondary: primary[300],       // #777E8D - Secondary borders
  accent: secondary[600],        // #27ABB8 - Accent borders
  layout: neutral[200],          // #E9EAEB - Layout dividers
  input: neutral[200],           // #E9EAEB - Input borders (default)
  inputFocus: secondary[500],    // #2BBCCA - Input borders (focus)
} as const

/**
 * Info State Semantic Colors
 */
export const semanticInfo = {
  primary: info[500],            // #4275D6 - Info primary
  secondary: info[50],           // #ECF1FB - Info surface
  text: info[700],               // #2F5398 - Info text
  border: info[200],             // #A8C0EC - Info border
  hover: info[600],              // #3C6AC3 - Info hover
  selected: info[300],           // #80A3E4 - Info selected
  selectedHover: info[400],      // #6891DE - Info selected + hover
} as const

/**
 * Disabled State Semantic Colors
 */
export const semanticDisabled = {
  primary: primary[200],         // #A2A6B1 - Disabled primary
  secondary: primary[50],        // #EBECEE - Disabled surface
  text: neutral[500],            // #717680 - Disabled text
  border: neutral[300],          // #D5D7DA - Disabled border
} as const

/**
 * Error State Semantic Colors
 */
export const semanticError = {
  primary: error[500],           // #F04438 - Error primary
  surface: error[50],            // #FEF3F2 - Error surface
  text: error[700],              // #B42318 - Error text
  border: error[300],            // #FDA29B - Error border
  hover: error[600],             // #D92D20 - Error hover
} as const

/**
 * Warning State Semantic Colors
 */
export const semanticWarning = {
  primary: warning[500],         // #F79009 - Warning primary
  surface: warning[50],          // #FFFAEB - Warning surface
  text: warning[700],            // #B54708 - Warning text
  border: warning[300],          // #FEC84B - Warning border
  hover: warning[600],           // #DC6803 - Warning hover
} as const

/**
 * Success State Semantic Colors
 */
export const semanticSuccess = {
  primary: success[500],         // #17B26A - Success primary
  surface: success[50],          // #ECFDF3 - Success surface
  text: success[700],            // #067647 - Success text
  border: success[300],          // #75E0A7 - Success border
  hover: success[600],           // #079455 - Success hover
} as const

// =============================================================================
// CONTENT COLORS (for status indicators, timeline bars, etc.)
// =============================================================================

export const content = {
  grassGreen: { default: '#00A651', hover: '#008F45', selected: '#B8E6CF' },
  doneGreen: { default: '#00D647', hover: '#00B83C', selected: '#B8F5CF' },
  brightGreen: { default: '#9CD326', hover: '#85B320', selected: '#E5F5B8' },
  saladish: { default: '#CAB641', hover: '#AD9B37', selected: '#F0E8B8' },
  eggYolk: { default: '#FFCB00', hover: '#D9AD00', selected: '#FFF0B8' },
  workingOrange: { default: '#FDAB3D', hover: '#D89233', selected: '#FEE5C0' },
  darkOrange: { default: '#FF6D3B', hover: '#D95C32', selected: '#FFD6C9' },
  peach: { default: '#FFB8B8', hover: '#D99C9C', selected: '#FFE8E8' },
  sunset: { default: '#FF7575', hover: '#D96363', selected: '#FFD6D6' },
  stuckRed: { default: '#E2445C', hover: '#C13A4E', selected: '#F5C4CC' },
} as const

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * All primitive color palettes
 */
export const primitives = {
  base,
  neutral,
  primary,
  secondary,
  error,
  warning,
  success,
  info,
} as const

/**
 * All semantic color tokens
 */
export const semantic = {
  primary: semanticPrimary,
  brand: semanticBrand,
  background: semanticBackground,
  text: semanticText,
  border: semanticBorder,
  info: semanticInfo,
  disabled: semanticDisabled,
  error: semanticError,
  warning: semanticWarning,
  success: semanticSuccess,
} as const

/**
 * Complete color system
 */
export const colors = {
  primitives,
  semantic,
  content,
} as const

export default colors
