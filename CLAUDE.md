# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 website for Lune Labs, a software company specializing in artificial intelligence solutions. The project uses the App Router architecture with TypeScript, TailwindCSS v4, and modern React 19.

## Development Commands

- `bun dev` - Start development server with Turbopack (recommended)
- `bun build` - Build the application for production
- `bun start` - Start production server
- `bun run lint` - Run ESLint checks

Alternative package managers (npm, yarn, pnpm) are also supported as shown in README.md.

## Architecture & Structure

### App Router Structure
- Uses Next.js App Router (`src/app/` directory)
- `src/app/layout.tsx` - Root layout with Geist fonts and global styling
- `src/app/page.tsx` - Homepage with minimal "lune labs." heading
- `src/app/logo/page.tsx` - Empty file (untracked/uncommitted work)

### Styling
- TailwindCSS v4 with PostCSS configuration
- `src/app/globals.css` - Global styles with CSS custom properties
- Light/dark mode support via `prefers-color-scheme`
- Geist Sans and Geist Mono fonts from Google Fonts

### TypeScript Configuration
- Strict TypeScript settings enabled
- Path aliases: `@/*` maps to `./src/*`
- Next.js plugin for enhanced TypeScript support
- Target ES2017 with modern module resolution

### Linting
- ESLint with Next.js recommended configurations
- Extends `next/core-web-vitals` and `next/typescript`
- Uses flat config format with compatibility layer

## Key Dependencies
- **Next.js 15.4.6** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TailwindCSS v4** - Utility-first CSS framework
- **TypeScript 5** - Type safety and developer experience

## Development Notes
- Development server runs on http://localhost:3000
- Uses Turbopack for faster development builds
- Font optimization handled automatically by Next.js
- The project follows standard Next.js App Router patterns