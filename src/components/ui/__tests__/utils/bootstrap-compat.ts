/**
 * Bootstrap compatibility test utilities.
 *
 * Bootstrap sets `p { margin-bottom: 1rem }` globally. Our `tw-m-0` compiles
 * to `margin: 0 !important` in consumer apps and overrides it. Missing the
 * reset causes layout gaps (16px extra space) in the host app.
 *
 * Usage in component tests:
 *
 *   import { assertNoBootstrapMarginBleed } from './utils/bootstrap-compat'
 *
 *   it('has Bootstrap margin reset on all <p> elements', () => {
 *     const { container } = render(<MyComponent />)
 *     assertNoBootstrapMarginBleed(container)
 *   })
 */

/** Classes that satisfy the Bootstrap margin-reset requirement. */
const MARGIN_RESET_RE = /\bm-0\b|\bmb-0\b|\bmy-0\b/

/**
 * Asserts that every `<p>` element within `container` has a margin-reset
 * class (`m-0`, `mb-0`, or `my-0`).
 *
 * Throws a descriptive error for the first violation found.
 */
export function assertNoBootstrapMarginBleed(container: HTMLElement): void {
  const paragraphs = container.querySelectorAll('p')

  paragraphs.forEach((p, index) => {
    const classes = p.className ?? ''
    if (!MARGIN_RESET_RE.test(classes)) {
      throw new Error(
        `Bootstrap margin bleed detected on <p> #${index + 1}.\n` +
        `  className: "${classes || '(none)'}"\n` +
        `  Bootstrap sets p { margin-bottom: 1rem }. Add m-0 (or mb-0/my-0) to this element.\n` +
        `  In production the tw-m-0 prefix compiles to margin: 0 !important, overriding Bootstrap.`
      )
    }
  })
}
