#!/usr/bin/env node

// Test script to verify prefix functionality
import { prefixTailwindClasses } from './src/utils/registry.js';

// Test cases for prefix transformation
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
    name: 'Complex component code',
    input: `import { cn } from "@/lib/utils"

const Button = ({ className, children, ...props }) => (
  <button
    className={cn("bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded", className)}
    {...props}
  >
    {children}
  </button>
)`,
    prefix: 'tw-',
    expected: `import { cn } from "@/lib/utils"

const Button = ({ className, children, ...props }) => (
  <button
    className={cn("tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded", className)}
    {...props}
  >
    {children}
  </button>
)`
  },
  {
    name: 'No prefix',
    input: '"bg-blue-500 text-white"',
    prefix: '',
    expected: '"bg-blue-500 text-white"'
  }
];

console.log('Testing Tailwind prefix transformation...\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`);
  console.log(`Input: ${testCase.input.substring(0, 100)}${testCase.input.length > 100 ? '...' : ''}`);
  console.log(`Prefix: "${testCase.prefix}"`);
  
  const result = prefixTailwindClasses(testCase.input, testCase.prefix);
  const success = result === testCase.expected;
  
  if (success) {
    console.log('✅ PASS');
    passed++;
  } else {
    console.log('❌ FAIL');
    console.log(`Expected: ${testCase.expected.substring(0, 100)}${testCase.expected.length > 100 ? '...' : ''}`);
    console.log(`Got:      ${result.substring(0, 100)}${result.length > 100 ? '...' : ''}`);
    failed++;
  }
  console.log('---');
});

console.log(`\nTest Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed! Prefix functionality is working correctly.');
} else {
  console.log(`⚠️  ${failed} test(s) failed. Please check the prefix transformation logic.`);
  process.exit(1);
}