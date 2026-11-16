import { describe, it, expect } from 'vitest'
import { MYOPERATOR_THEME_CSS, getTailwindConfig } from '../commands/init'

describe('theme typeface (Source Sans Pro)', () => {
  it('declares the base font token', () => {
    expect(MYOPERATOR_THEME_CSS).toContain("--font-family-base: 'Source Sans Pro', sans-serif;")
  })

  it('loads Source Sans Pro 400 and 600', () => {
    expect(MYOPERATOR_THEME_CSS).toMatch(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Source\+Sans\+Pro:wght@400;600/)
  })

  it('applies the font to tw- elements, unlayered, skipping font-mono', () => {
    expect(MYOPERATOR_THEME_CSS).toMatch(
      /\[class\*="tw-"\]:not\(\[class\*="font-mono"\]\)\s*{\s*font-family: var\(--font-family-base\);/
    )
    // A layered rule loses to unlayered "button { font-family: inherit }" resets
    expect(MYOPERATOR_THEME_CSS).not.toMatch(/@layer\s+[\w-]+\s*{/)
  })

  it('never falls back to Open Sans', () => {
    expect(MYOPERATOR_THEME_CSS).not.toMatch(/open\s*sans/i)
  })

  it('maps tailwind font-sans to the token', () => {
    expect(getTailwindConfig('tw-', true)).toContain('var(--font-family-base)')
  })
})
