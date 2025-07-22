# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that simulates mobile device safe area insets for web development. It's built with TypeScript and WXT framework, migrated from a previous Vite-based implementation.

## Development Commands

### Essential Commands
- `npm run dev` - Development mode with WXT hot reloading
- `npm run dev:fast` - Single development build without watching
- `npm run build` - Production build with type checking
- `npm run build:zip` - Production build + create Chrome Web Store zip package
- `npm run type-check` - Run TypeScript type checking with WXT
- `npm run lint` - Run ESLint code linting (src + entrypoints)
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run validate` - Run type-check + lint + test in sequence

### Testing Commands
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report

### Package Management
- `npm run package` - Create distribution zip package with WXT
- `npm run clean` - Remove .output directory with WXT clean
- `npm run clean-packages` - Remove packages directory

## Architecture

### Chrome Extension Structure (WXT)
- **Background Script** (`entrypoints/background.ts`) - WXT-managed service worker handling extension lifecycle, storage, and tab communication
- **Content Script** (`entrypoints/content.ts`) - WXT-managed content script injected into web pages to apply safe area simulation
- **Popup** (`entrypoints/popup/`) - WXT-managed popup UI with HTML, CSS, and TypeScript for device selection and configuration
- **Shared Modules** (`src/shared/`) - Reusable utilities and device configurations
- **Legacy Scripts** (`src/`) - Original TypeScript files for phone mockup components

### Key Components
- **SafeAreaInjector** - Main content script class that manages CSS injection, debug overlays, and SPA route detection
- **HardwareRegionsRenderer** (`src/hardware-renderer.ts`) - Advanced hardware regions renderer for realistic device simulation (Dynamic Island, notches, navigation bars)
- **PhoneFrameSimple** (`src/phone-frame-simple.ts`) - Visual device frame overlay system  
- **PhoneMockup** (`src/phone-mockup.ts`) - Popup preview component showing device mockups
- **Shared Utilities** (`src/shared/utils.ts`) - Common functions for CSS generation, messaging, and validation
- **Device Database** (`src/shared/devices.ts`) - Centralized device configuration with 30+ device specifications and detailed hardware regions

### Build System
- **WXT Framework** - Modern web extension development framework with built-in TypeScript support
- **Vite Integration** - Leverages Vite for bundling and development experience
- **ES Module Support** - Proper module imports/exports with code splitting
- **Development Mode** - Hot reloading, source maps, automatic reload on file changes
- **Production Mode** - Optimization, tree-shaking, automatic manifest generation

### Modern Architecture Benefits
- **Code Splitting** - Proper module separation for better maintainability
- **Tree Shaking** - Unused code elimination for smaller bundle sizes
- **Type Safety** - Full TypeScript integration with proper imports
- **Code Reusability** - Shared utilities prevent code duplication

## TypeScript Configuration

- Strict mode enabled with comprehensive type checking
- Chrome extension types included
- Path aliases: `@/*` maps to `src/*`, `@types/*` maps to `types/*`
- ES2020 target with DOM libraries

## Testing Setup

- **Vitest** with jsdom environment
- Global test setup in `tests/setup.ts`
- Coverage reporting configured
- Mock implementations for Chrome APIs in `tests/mocks/`

## File Organization

- `entrypoints/` - WXT entrypoints (background, content, popup)
- `src/` - TypeScript source code and shared utilities
- `types/` - TypeScript type definitions
- `tests/` - Unit tests and mocks
- `.output/` - WXT build output (Chrome extension)
- `packages/` - Distribution packages
- `scripts/` - Build and packaging scripts
- `wxt.config.ts` - WXT framework configuration

## Development Workflow

1. Use `npm run dev` for continuous development with WXT hot reloading
2. Chrome extension is automatically reloaded with WXT development mode
3. Load unpacked extension from `.output/chrome-mv3` directory
4. All changes should pass `npm run validate` before committing
5. Use `npm run build:zip` for Chrome Web Store distribution packages

## Important Notes

- This extension requires Manifest V3 compatibility
- WXT framework handles manifest generation and Chrome extension build process automatically
- Content script includes sophisticated SPA framework detection and overlay recreation
- Device configurations include both safe area insets and visual appearance data
- **Hardware Regions Feature**: Realistic rendering of device hardware elements including:
  - Dynamic Island (iPhone 14 Pro series)
  - Traditional notches (iPhone X/XS/XR/11/12/13 series)  
  - Punch holes (Samsung Galaxy S21/S22)
  - Status bar elements with signal indicators and battery
  - Home indicators and navigation bars
  - Camera cutouts with detailed sensor representations
- Hardware regions can be toggled on/off via popup control (⚙️ button)
- WXT provides built-in TypeScript support, hot reloading, and development server
- Import paths in entrypoints use relative paths to access src/ directory