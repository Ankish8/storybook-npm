#!/usr/bin/env node

/**
 * Pre-commit hook: ensure all <p> elements in component files have a margin
 * reset class (m-0, mb-0, or my-0).
 *
 * Why: Bootstrap sets `p { margin-bottom: 1rem }` globally. Our `tw-m-0`
 * compiles to `margin: 0 !important` in consumer apps, which overrides it.
 * Missing the reset causes layout gaps in Bootstrap-based host apps.
 *
 * Checks both:
 *   - Inline className strings:  <p className="text-sm m-0 ...">
 *   - CVA base strings:          cva("m-0 text-sm ...", { ... })
 *     where the cva result is used on a <p> element.
 *
 * Exit codes:
 *   0 - All <p> elements have a margin reset
 *   1 - One or more violations found
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// Margin reset classes that satisfy the Bootstrap compat requirement
const MARGIN_RESET_RE = /\bm-0\b|\bmb-0\b|\bmy-0\b/

// File globs to check (component source only, not stories or tests)
function collectComponentFiles() {
  const files = []

  // UI components
  const uiDir = path.join(ROOT, 'src/components/ui')
  for (const f of fs.readdirSync(uiDir)) {
    if (f.endsWith('.tsx') && !f.includes('.stories.') && !f.includes('.test.')) {
      files.push(path.join(uiDir, f))
    }
  }

  // Custom components (recursive)
  const customDir = path.join(ROOT, 'src/components/custom')
  function walkDir(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walkDir(full)
      } else if (
        entry.name.endsWith('.tsx') &&
        !entry.name.includes('.stories.') &&
        !entry.name.includes('.test.')
      ) {
        files.push(full)
      }
    }
  }
  walkDir(customDir)

  return files
}

/**
 * Check a single file for <p> elements that lack a margin reset.
 *
 * Strategy:
 * 1. For inline <p className="..."> — extract the className string and check it.
 * 2. For <p className={someVariant(...)}> — look up the CVA/cva() call whose
 *    result is assigned to that identifier and check the base class string.
 *
 * This is a regex-based heuristic, not a full AST parse. It catches the
 * common patterns used across this codebase.
 */
function checkFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf8')
  const rel = path.relative(ROOT, filePath)
  const violations = []

  const lines = src.split('\n')

  // --- Pass 1: Build a map of CVA variant identifiers → their base class string ---
  // Matches: const fooVariants = cva("base classes here", { ... })
  // or:      const fooVariants = cva('base classes here', { ... })
  const cvaBaseMap = {}
  const cvaRe = /const\s+(\w+)\s*=\s*cva\(\s*["'`]([^"'`]*)["'`]/g
  let m
  while ((m = cvaRe.exec(src)) !== null) {
    cvaBaseMap[m[1]] = m[2]
  }

  // --- Pass 2: Find <p ...> JSX elements ---
  // We scan line by line to give useful line numbers.
  // A <p> tag can have:
  //   a) className="literal string"
  //   b) className={'literal string'}
  //   c) className={cn("...", ...)}  — extract the first string arg
  //   d) className={someVariant({...})}  — look up CVA base
  //   e) no className at all  — always a violation

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Only process lines that open a <p element
    if (!/\bp\s+className|\bp\s+ref\b|\bp\s*>/.test(line) && !/<p\s/.test(line)) continue

    // Extract the className value from this line (or a few lines for multiline)
    // Collect up to 3 lines to handle multi-line JSX opens
    const chunk = lines.slice(i, Math.min(i + 3, lines.length)).join(' ')

    // Skip if this isn't actually a <p JSX element open
    if (!/<p[\s>]/.test(chunk)) continue

    // Extract className content
    const classNameMatch =
      chunk.match(/className=\{cn\(["'`]([^"'`]*)["'`]/) ||  // className={cn("..."
      chunk.match(/className=["'`]([^"'`]*)["'`]/) ||         // className="..."
      chunk.match(/className=\{["'`]([^"'`]*)["'`]\}/)        // className={'...'}

    if (classNameMatch) {
      const classes = classNameMatch[1]
      if (!MARGIN_RESET_RE.test(classes)) {
        violations.push({
          line: lineNum,
          message: `<p> element has className="${classes}" but is missing m-0 / mb-0 / my-0`,
        })
      }
      continue
    }

    // className={someVariant({...})} — look up the CVA base
    const variantMatch = chunk.match(/className=\{(\w+)\(/)
    if (variantMatch) {
      const variantName = variantMatch[1]
      if (cvaBaseMap[variantName] !== undefined) {
        if (!MARGIN_RESET_RE.test(cvaBaseMap[variantName])) {
          violations.push({
            line: lineNum,
            message: `<p> uses CVA variant "${variantName}" whose base classes "${cvaBaseMap[variantName]}" are missing m-0 / mb-0 / my-0`,
          })
        }
      }
      // If variantName isn't a CVA (e.g. it's a function), skip — can't statically check
      continue
    }

    // <p> with no className at all — definitely a violation
    if (/<p\s*>/.test(chunk) || /<p\s+ref=/.test(chunk)) {
      // Check if there's a className somewhere we missed
      if (!chunk.includes('className')) {
        violations.push({
          line: lineNum,
          message: `<p> element has no className — missing m-0 for Bootstrap compat`,
        })
      }
    }
  }

  return violations.map(v => ({ file: rel, ...v }))
}

// --- Main ---
const files = collectComponentFiles()
const allViolations = []

for (const file of files) {
  const v = checkFile(file)
  allViolations.push(...v)
}

if (allViolations.length === 0) {
  console.log('✓ Bootstrap compat check passed — all <p> elements have margin reset')
  process.exit(0)
}

console.error('\n✗ Bootstrap compat check FAILED\n')
console.error(
  'Bootstrap sets `p { margin-bottom: 1rem }` globally.\n' +
  'All <p> elements in component files must have m-0 (or mb-0/my-0) to prevent layout bleed.\n'
)

for (const v of allViolations) {
  console.error(`  ${v.file}:${v.line}`)
  console.error(`    ${v.message}\n`)
}

console.error(`${allViolations.length} violation(s) found.`)
console.error('Add m-0 to the <p> className (inline) or to the CVA base string.\n')
process.exit(1)
