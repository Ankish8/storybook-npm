// Simple test for prefix functionality using the actual registry function
// We'll simulate the function here since TypeScript imports don't work directly in Node

function prefixTailwindClasses(content, prefix) {
  if (!prefix) return content

  // For Tailwind v3, use prefix as-is
  const cleanPrefix = prefix

  // Process content within double-quoted strings that look like CSS classes
  return content.replace(/"([^"]+)"/g, (match, classString) => {
    // Skip import paths (start with @ or . or contain ::)
    if (classString.startsWith('@') || classString.startsWith('.') || classString.includes('::')) {
      return match
    }

    // Skip npm package names (lowercase letters, numbers, hyphens, and @ scopes)
    if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(classString)) {
      return match
    }

    // Skip simple identifiers (no spaces, hyphens, colons, or brackets - not Tailwind classes)
    if (!classString.includes(' ') && !classString.includes('-') && !classString.includes(':') && !classString.includes('[')) {
      return match
    }

    // Prefix each class
    const prefixedClasses = classString
      .split(' ')
      .map((cls) => {
        if (!cls) return cls

        // Handle variant prefixes like hover:, focus:, sm:, etc.
        const variantMatch = cls.match(/^([a-z-]+:)+/)
        if (variantMatch) {
          const variants = variantMatch[0]
          const utility = cls.slice(variants.length)
          // Prefix the utility part, keep variants as-is
          if (utility.startsWith('-')) {
            return `${variants}-${cleanPrefix}${utility.slice(1)}`
          }
          return `${variants}${cleanPrefix}${utility}`
        }

        // Handle negative values like -mt-4
        if (cls.startsWith('-')) {
          return `-${cleanPrefix}${cls.slice(1)}`
        }

        // Handle arbitrary selector values like [&_svg]:pointer-events-none
        if (cls.startsWith('[&')) {
          const closeBracket = cls.indexOf(']:')
          if (closeBracket !== -1) {
            const selector = cls.slice(0, closeBracket + 2)
            const utility = cls.slice(closeBracket + 2)
            return `${selector}${cleanPrefix}${utility}`
          }
          return cls
        }

        // Regular class (including arbitrary values like bg-[#343E55])
        return `${cleanPrefix}${cls}`
      })
      .join(' ')

    return `"${prefixedClasses}"`
  })
}

// Test cases
const testCases = [
  {
    name: 'Basic classes',
    input: '"bg-blue-500 text-white p-4"',
    prefix: 'tw-',
    expected: '"tw-bg-blue-500 tw-text-white tw-p-4"'
  },
  {
    name: 'Hover states',
    input: '"hover:bg-blue-600 focus:ring-2"',
    prefix: 'tw-',
    expected: '"hover:tw-bg-blue-600 focus:tw-ring-2"'
  },
  {
    name: 'Negative values',
    input: '"-mt-4 -ml-2"',
    prefix: 'tw-',
    expected: '"-tw-mt-4 -tw-ml-2"'
  },
  {
    name: 'Arbitrary values',
    input: '"bg-[#343E55] text-[14px]"',
    prefix: 'tw-',
    expected: '"tw-bg-[#343E55] tw-text-[14px]"'
  },
  {
    name: 'Import paths (should not change)',
    input: 'import { cn } from "@/lib/utils"',
    prefix: 'tw-',
    expected: 'import { cn } from "@/lib/utils"'
  },
  {
    name: 'Package names (should not change)',
    input: 'import { Button } from "react"',
    prefix: 'tw-',
    expected: 'import { Button } from "react"'
  },
  {
    name: 'No prefix',
    input: '"bg-blue-500 text-white"',
    prefix: '',
    expected: '"bg-blue-500 text-white"'
  }
]

console.log('🧪 Testing Tailwind prefix transformation...\n')

let passed = 0
let failed = 0

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`)
  
  const result = prefixTailwindClasses(testCase.input, testCase.prefix)
  const success = result === testCase.expected
  
  if (success) {
    console.log('✅ PASS')
    passed++
  } else {
    console.log('❌ FAIL')
    console.log(`  Input:    ${testCase.input}`)
    console.log(`  Expected: ${testCase.expected}`)
    console.log(`  Got:      ${result}`)
    failed++
  }
  console.log('')
})

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`)

if (failed === 0) {
  console.log('🎉 All tests passed! Prefix functionality is working correctly.')
} else {
  console.log(`⚠️  ${failed} test(s) failed.`)
  process.exit(1)
}