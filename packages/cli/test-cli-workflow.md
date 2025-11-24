# CLI Workflow Test Instructions

## Test Scenario 1: Initialize with tw- prefix

1. Create a new test directory:
   ```bash
   mkdir test-tw-prefix
   cd test-tw-prefix
   npm init -y
   ```

2. Run init command (this would normally be):
   ```bash
   npx myoperator-ui init
   ```
   - Should detect no existing Tailwind config
   - Should prompt for Tailwind version (choose v3)
   - Should prompt for prefix (enter "tw-")
   - Should create components.json with prefix: "tw-"
   - Should show message: "Components will use prefix: 'tw-'"

3. Run add command:
   ```bash
   npx myoperator-ui add button
   ```
   - Should show message: "Applying Tailwind prefix: 'tw-'"
   - Generated button.tsx should have all classes prefixed with "tw-"
   - Example: "tw-bg-[#343E55] tw-text-white hover:tw-bg-[#343E55]/90"

## Test Scenario 2: Initialize with no prefix

1. Create another test directory:
   ```bash
   mkdir test-no-prefix
   cd test-no-prefix
   npm init -y
   ```

2. Run init command:
   - Should prompt for prefix (leave empty)
   - Should create components.json with prefix: ""
   - Should show message: "Components will use no prefix"

3. Run add command:
   - Should NOT show prefix message
   - Generated components should have normal Tailwind classes

## Test Scenario 3: Existing Tailwind config with prefix

1. Create test directory with existing config:
   ```bash
   mkdir test-existing-prefix
   cd test-existing-prefix
   npm init -y
   echo 'module.exports = { prefix: "ui-", content: ["./src/**/*.{js,ts,jsx,tsx}"] }' > tailwind.config.js
   ```

2. Run init command:
   - Should detect existing prefix "ui-"
   - Should show: "Tailwind prefix 'ui-' detected - components will use prefixed classes"
   - Should prompt: "Confirm Tailwind prefix (detected: 'ui-'):" with "ui-" as default
   - User can confirm or change the prefix

## Expected Results

- ✅ CLI prompts for prefix configuration during init
- ✅ Prefix is stored in components.json
- ✅ Add command reads prefix from config
- ✅ Components are correctly prefixed during installation
- ✅ Appropriate messages are shown to user
- ✅ Existing config detection works
- ✅ No prefix option works correctly

## Manual Testing Notes

Since the CLI needs to be built and published to test fully, the key verification points are:

1. **Config Management**: components.json correctly stores prefix
2. **Prefix Detection**: Existing Tailwind configs are parsed correctly  
3. **Component Transformation**: Registry function applies prefixes properly
4. **User Experience**: Clear prompts and feedback messages

All these have been verified in the code implementation and unit tests.