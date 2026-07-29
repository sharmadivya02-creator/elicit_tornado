# ELICIT'26 — MUJ ACM Student Chapter

A retro pixel-art space-themed interactive website for the **ELICIT'26** tech fest hosted by Manipal University Jaipur ACM Student Chapter.

## Tech Stack

- **Next.js 16** (App Router with Turbopack dev compiler)
- **React 19.2** + **TypeScript 5.8**
- **Tailwind CSS v4.3** + `@tailwindcss/postcss`
- **motion v12.4** — animations
- **Lucide React v1** — icons
- **Web Audio API** — chiptune sound effects

## Features

- Gamified explorer system with XP, levels, star coins, and achievements
- 7 missions tied to exploring different sections
- Interactive Quiz Nexus
- Arcade flight simulator mini-game
- Chiptune sound effects and background music (Web Audio API)
- 20+ hand-drawn SVG pixel art components
- CRT scanline overlay and retro neon aesthetics
- Fully responsive design

## Getting Started

### Prerequisites

- Node.js 20.9+ (Next.js 16 runtime constraint)
- npm

### Install

```bash
npm install
```

### Development (using Turbopack)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (running on Turbopack).

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Entry point (renders App)
│   └── globals.css      # Global styles, fonts, animations
├── components/          # React components
│   ├── Header.tsx       # Navigation bar with HUD
│   ├── Footer.tsx       # Footer with social links
│   ├── HomeView.tsx     # Landing page
│   ├── AboutView.tsx    # About ACM chapter
│   ├── EventsView.tsx   # Events + Quiz Nexus
│   ├── GalleryView.tsx  # Photo gallery with filters
│   ├── SponsorsView.tsx # Sponsor tiers
│   ├── TeamView.tsx     # Team members
│   ├── ContactView.tsx  # Contact form
│   ├── ProfileView.tsx  # Explorer profile modal
│   ├── FlightSimulator.tsx  # Arcade mini-game
│   ├── PixelArtwork.tsx     # SVG pixel art library
│   └── *Background.tsx      # Animated backgrounds
├── utils/
│   └── sound.ts         # Web Audio API synthesizer
├── types.ts             # TypeScript interfaces
├── data.ts              # Static data (missions, events, etc.)
└── App.tsx              # Main application component
```
