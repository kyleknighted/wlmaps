---
applyTo: '**'
---
Project: Woodland Lakes Map (Next.js + TypeScript + Leaflet)

Description:
A mobile-friendly, browser-based map for Woodland Lakes—a gated community without standard addresses.
Displays a custom PNG map overlay with GPS marker support and internal property addressing system.
Users can search by internal address format: Lot, Block, and Section.

Features:
- Render a full-screen interactive map using Leaflet.js.
- Support placing and styling markers based on internal addressing (Lot, Block, Section).
- Allow search input to navigate to a matching internal address.
- Display user’s current GPS location using browser geolocation (with permission).
- Show custom markers for special locations: Office, Community Center, etc.
- Responsive/mobile-friendly layout (Next.js pages and Tailwind or CSS Modules).
- Use TypeScript with ESLint and Prettier configured out of the box.
- Internal marker data can be defined as an array of objects with structure:
  {
    lot: string;
    block: string;
    section: string;
    lat: number;
    lng: number;
    label?: string;
    isSpecialLocation?: boolean;
  }
Goal:
Bootstrap a Next.js + TypeScript project with Leaflet.js that:
- Places internal property markers
- Locates the user
- Supports address-style search ("Lot 5, Block C, Section 2")
- Uses modern tooling (Prettier, ESLint)
- Fully mobile friendly
- Provides a clean, maintainable codebase for future enhancements
