const prefix = 'tw-';
const classString = 'bg-[#343E55] text-white hover:bg-[#343E55]/90';

// Check if we'd skip this
if (classString.startsWith('@') || classString.startsWith('.') || classString.includes('::')) {
  console.log('SKIP: import path');
  process.exit(0);
}
if (/^(@[a-z0-9-]+\/)?[a-z][a-z0-9-]*$/.test(classString)) {
  console.log('SKIP: npm package');
  process.exit(0);
}
if (!classString.includes(' ') && !classString.includes('-') && !classString.includes(':') && !classString.includes('[')) {
  console.log('SKIP: simple identifier');
  process.exit(0);
}

// Prefix each class
const prefixedClasses = classString
  .split(' ')
  .map((cls) => {
    if (!cls) return cls;

    // Handle variant prefixes
    const variantMatch = cls.match(/^([a-z-]+:)+/);
    if (variantMatch) {
      const variants = variantMatch[0];
      const utility = cls.slice(variants.length);
      if (utility.startsWith('-')) {
        return `${variants}-${prefix}${utility.slice(1)}`;
      }
      return `${variants}${prefix}${utility}`;
    }

    // Handle negative values
    if (cls.startsWith('-')) {
      return `-${prefix}${cls.slice(1)}`;
    }

    // Handle arbitrary selectors
    if (cls.startsWith('[&')) {
      const closeBracket = cls.indexOf(']:');
      if (closeBracket !== -1) {
        const selector = cls.slice(0, closeBracket + 2);
        const utility = cls.slice(closeBracket + 2);
        return `${selector}${prefix}${utility}`;
      }
      return cls;
    }

    return `${prefix}${cls}`;
  })
  .join(' ');

console.log('Input:', classString);
console.log('Output:', prefixedClasses);
