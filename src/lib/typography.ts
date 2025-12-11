/**
 * Design System Typography Tokens
 *
 * This file defines all typography tokens used in the myOperator UI design system.
 * Typography is organized into:
 * - Font Family: The primary typeface (Source Sans Pro)
 * - Font Weights: Available weight variants
 * - Type Styles: Pre-defined text styles for different use cases
 *
 * Usage:
 * - Use semantic type styles (headline, body, title, label, display) for consistency
 * - All components inherit Source Sans Pro via global CSS
 */

// =============================================================================
// FONT FAMILY
// =============================================================================

export const fontFamily = {
  base: "'Source Sans Pro', sans-serif",
} as const

// =============================================================================
// FONT WEIGHTS
// =============================================================================

export const fontWeight = {
  regular: 400,
  semibold: 600,
} as const

// =============================================================================
// TYPE STYLES
// =============================================================================

/**
 * Headline Styles
 * Used for page titles, section headers, and prominent headings
 * Font: Source Sans Pro SemiBold
 */
export const headline = {
  small: {
    fontFamily: fontFamily.base,
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-headline-small',
  },
  medium: {
    fontFamily: fontFamily.base,
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-headline-medium',
  },
  large: {
    fontFamily: fontFamily.base,
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-headline-large',
  },
} as const

/**
 * Body Styles
 * Used for paragraphs, descriptions, and general content
 * Font: Source Sans Pro Regular
 */
export const body = {
  small: {
    fontFamily: fontFamily.base,
    fontSize: '12px',
    lineHeight: 'normal',
    fontWeight: fontWeight.regular,
    cssClass: 'text-body-small',
  },
  medium: {
    fontFamily: fontFamily.base,
    fontSize: '14px',
    lineHeight: 'normal',
    fontWeight: fontWeight.regular,
    cssClass: 'text-body-medium',
  },
  large: {
    fontFamily: fontFamily.base,
    fontSize: '16px',
    lineHeight: 'normal',
    fontWeight: fontWeight.regular,
    cssClass: 'text-body-large',
  },
} as const

/**
 * Title Styles
 * Used for card titles, dialog headers, and component headings
 * Font: Source Sans Pro SemiBold
 */
export const title = {
  small: {
    fontFamily: fontFamily.base,
    fontSize: '14px',
    lineHeight: 'normal',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-title-small',
  },
  medium: {
    fontFamily: fontFamily.base,
    fontSize: '16px',
    lineHeight: 'normal',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-title-medium',
  },
  large: {
    fontFamily: fontFamily.base,
    fontSize: '18px',
    lineHeight: 'normal',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-title-large',
  },
} as const

/**
 * Label Styles
 * Used for form labels, buttons, badges, and small UI elements
 * Font: Source Sans Pro SemiBold
 */
export const label = {
  small: {
    fontFamily: fontFamily.base,
    fontSize: '10px',
    lineHeight: 'normal',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-label-small',
  },
  medium: {
    fontFamily: fontFamily.base,
    fontSize: '12px',
    lineHeight: 'normal',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-label-medium',
  },
  large: {
    fontFamily: fontFamily.base,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: fontWeight.semibold,
    cssClass: 'text-label-large',
  },
} as const

/**
 * Display Styles
 * Used for hero sections, large promotional text, and marketing content
 * Font: Source Sans Pro Regular
 */
export const display = {
  small: {
    fontFamily: fontFamily.base,
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: fontWeight.regular,
    cssClass: 'text-display-small',
  },
  medium: {
    fontFamily: fontFamily.base,
    fontSize: '45px',
    lineHeight: '52px',
    fontWeight: fontWeight.regular,
    cssClass: 'text-display-medium',
  },
  large: {
    fontFamily: fontFamily.base,
    fontSize: '57px',
    lineHeight: '64px',
    fontWeight: fontWeight.regular,
    cssClass: 'text-display-large',
  },
} as const

// =============================================================================
// EXPORTS
// =============================================================================

/**
 * All typography styles grouped by category
 */
export const typeStyles = {
  headline,
  body,
  title,
  label,
  display,
} as const

/**
 * Complete typography system
 */
export const typography = {
  fontFamily,
  fontWeight,
  styles: typeStyles,
} as const

export default typography
