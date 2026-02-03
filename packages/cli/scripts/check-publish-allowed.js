#!/usr/bin/env node

/**
 * Pre-publish hook that blocks direct `npm publish`.
 * Only allows publishing when MYOPERATOR_PUBLISH_ALLOWED=1 is set.
 *
 * This ensures all publishes go through /publish-cli or /publish-all commands,
 * which enforce proper testing, version bumping, and release management.
 */

const isAllowed = process.env.MYOPERATOR_PUBLISH_ALLOWED === '1'

if (!isAllowed) {
  console.error(`
╔══════════════════════════════════════════════════════════════════╗
║                    ⛔ PUBLISH BLOCKED ⛔                         ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  Direct 'npm publish' is not allowed.                            ║
║                                                                  ║
║  Use one of these commands instead:                              ║
║                                                                  ║
║    /publish-cli   - Publish CLI package only                     ║
║    /publish-all   - Full publish workflow (CLI + MCP + git)      ║
║                                                                  ║
║  These commands ensure:                                          ║
║    ✓ Proper version management (beta vs latest)                  ║
║    ✓ All validations pass                                        ║
║    ✓ Correct git commits                                         ║
║    ✓ Team notification                                           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)
  process.exit(1)
}

console.log('✓ Publish authorized via /publish-cli or /publish-all')
