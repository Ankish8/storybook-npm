/** Class-string CVA assertions are visual checks, just like toHaveClass(). */
export function isStyleAssertion(name, message) {
  if (
    /toHaveClass|toHaveStyle|Expected the element (not )?to have class|to match \/tw-|\.not\.toHaveClass/.test(
      message
    )
  )
    return true;
  return (
    /Variants returns correct classes\b/.test(name) &&
    /to contain ['"](?:bg|border|text)-semantic-[\w-]+['"]/.test(message)
  );
}
