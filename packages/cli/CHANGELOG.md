# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.52] - 2024-12-03

### Changed
- Updated Table component with sticky columns, sorting indicators, info tooltips, and skeleton/empty states
- Updated Tag component with 6 color variants (default, primary, secondary, success, warning, error)
- Updated Badge component with leftIcon/rightIcon support
- Updated Button ghost variant styling
- Fixed test assertions to match current component implementations

## [0.0.42] - 2024-11-21

### Fixed
- Fixed Tailwind v3 dependency to use explicit `tailwindcss@^3.4.0` to prevent v4 being pulled in
- Fixed content array in tailwind.config.js to include all src files (`./src/**/*.{js,ts,jsx,tsx}`)
- Fixed `tailwindVersion` variable bug where it was undefined when auto-detected

## [0.0.41] - 2024-11-21

### Added
- Auto-generate registry from source component files
- Added `npm run generate-registry` script for syncing CLI with source components
- Components are now read from `src/components/ui/` at build time

## [0.0.40] - 2024-11-21

### Added
- Added badge, tag, table, dropdown-menu components to registry

## [0.0.39] - 2024-11-21

### Added
- Auto-detect Tailwind version from package.json dependencies
- Skip version prompt when Tailwind is already installed

## [0.0.38] - 2024-11-21

### Fixed
- Fixed tailwindcss-animate pulling in Tailwind v4
- Added explicit `tailwindcss@3` and `autoprefixer` to v3 dependencies

## [0.0.37] - 2024-11-21

### Added
- Added Storybook URL (https://myoperator-ui.vercel.app) to "Next steps" output

## [0.0.36] - 2024-11-21

### Added
- Auto-detect CSS and tailwind config paths
- Reduced prompts to just Tailwind version question

## [0.0.35] - 2024-11-21

### Added
- Auto-detection for global CSS file path
- Auto-detection for tailwind config file path

## [0.0.34] - 2024-11-21

### Fixed
- Added CSS reset for Bootstrap button borders in `@layer components`

## [0.0.33] - 2024-11-21

### Changed
- Removed prefix option (components use unprefixed Tailwind classes)
- Added `corePlugins: { preflight: false }` for Bootstrap projects

## [0.0.32] - 2024-11-21

### Added
- Auto-install dependencies with `npm install`
- Simplified "Next steps" output

## [0.0.31] - 2024-11-21

### Fixed
- Fixed PostCSS config to use `tailwindcss` + `autoprefixer` for v3 projects
- Was incorrectly using `@tailwindcss/postcss` (v4 plugin)

## [0.0.30] - 2024-11-21

### Added
- Initial CLI release
- `init` command for project setup
- `add` command for adding components
- Support for Tailwind CSS v3 and v4
- Bootstrap compatibility mode
