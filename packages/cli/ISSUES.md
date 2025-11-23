# Known Issues & Fixes

## Issue Report - Tushar Khandelwal

### Date: 2024-11-21

---

## Issues Reported

### 1. Badge component missing `tw-` prefix in classes

**Problem:** When installing badge component, the Tailwind classes don't have `tw-` prefix.

**Expected:** If using a prefix, classes should be like `tw-inline-flex`, `tw-bg-[#E5FFF5]`

**Actual:** Classes are unprefixed: `inline-flex`, `bg-[#E5FFF5]`

**Root Cause:** The CLI removed prefix support in v0.0.33 because:
- Components use hardcoded unprefixed classes
- Prefix would require transforming all class strings
- Was causing mismatch issues

**Resolution:**
- Currently, components use unprefixed Tailwind classes
- If prefix is needed, it requires:
  1. Adding prefix transformation in `registry.ts`
  2. Re-enabling prefix prompt in `init.ts`
  3. Testing all components with prefixed output

---

### 2. Package creates `index.css` file by default

**Problem:** The CLI auto-creates an `index.css` file that wasn't needed.

**Expected:** Should detect existing CSS file and use it, not create a new one.

**Actual:** Creates `src/index.css` with Tailwind directives and CSS variables.

**Root Cause:** The init command creates CSS if:
- No CSS file is detected at common paths
- Or user approves updating existing CSS

**Resolution:**
- CLI auto-detects CSS at these paths:
  - `src/index.css`
  - `src/styles/globals.css`
  - `src/styles/index.css`
  - `src/app/globals.css`
  - `app/globals.css`
  - `styles/globals.css`
- If found, it updates existing file (prepends for Bootstrap, replaces for standalone)
- Consider adding `--no-css` flag to skip CSS modification

---

### 3. Installation process changed

**Problem:** The installation process has changed from previous versions.

**Changes Made:**
- v0.0.32: Auto-installs dependencies (no manual npm install needed)
- v0.0.35: Auto-detects paths (fewer prompts)
- v0.0.39: Auto-detects Tailwind version
- v0.0.41: Auto-generates registry from source
- v0.0.42: Fixed Tailwind v3 dependency, broader content array

**Current Flow:**
1. Run `npx myoperator-ui@latest init`
2. Only prompted for Tailwind version if not auto-detected
3. Dependencies auto-installed
4. Files auto-created/updated:
   - `components.json`
   - `src/lib/utils.ts`
   - `src/components/ui/` directory
   - CSS file (updated with variables)
   - `tailwind.config.js` (for v3)
   - `postcss.config.js`

---

## Action Items

- [ ] Consider adding `--no-css` flag to skip CSS file creation
- [ ] Consider adding `--no-tailwind-config` flag to skip config creation
- [ ] Document the new streamlined installation process
- [ ] Consider re-adding prefix support with proper class transformation

---

## Version History

See [CHANGELOG.md](./CHANGELOG.md) for full version history.
