/**
 * Phaser Design Tokens — mirrors Tailwind config for Ronin visual consistency.
 *
 * Usage:  import { COLORS, STROKE, RADIUS, EASE, FONT, getDPR } from './phaserDesignTokens.js'
 */

// ─── Color Palette ──────────────────────────────────────────────────────────

/** Core brand colors (match tailwind.config.js ronin.*) */
export const COLORS = {
  // Brand
  VOID: 0x050505,
  NAV_FROM: 0x2a0b0f,
  NAV_TO: 0x3d1015,
  CRIMSON: 0xf33232,
  CORAL: 0xf36e6e,
  GOLD: 0xc8a423,
  ORANGE: 0xf38b1f,
  CREAM: 0xf7f7f7,
  MUTED: 0xbfbfbf,

  // Surfaces
  BG_DEEP: 0x08080a,
  BG_PRIMARY: 0x0c0c0e,
  BG_CARD: 0x141420,
  BG_CARD_TOP: 0x1e2a3a,
  BG_CARD_MID: 0x131826,
  BG_CARD_BOT: 0x0b1220,
  BG_PANEL: 0x1c1917,
  BG_OVERLAY: 0x1a1210,

  // Accents
  TEAL: 0x2dd4bf,
  TEAL_DIM: 0x1a8a7a,
  EMERALD: 0x34d399,
  EMERALD_DARK: 0x15803d,
  EMERALD_LIGHT: 0x86efac,
  ROSE: 0xf43f5e,
  ROSE_DIM: 0xe11d48,
  ROSE_LIGHT: 0xfecaca,
  SKY: 0x38bdf8,
  SKY_DEEP: 0x172554,
  AMBER: 0xfbbf24,
  AMBER_BORDER: 0xf59e0b,
  AMBER_LIGHT: 0xfde68a,
  RED_DARK: 0xdc2626,
  RED_FILL: 0x450a0a,

  // Neutrals (Zinc scale)
  ZINC_950: 0x09090b,
  ZINC_900: 0x18181b,
  ZINC_800: 0x27272a,
  ZINC_700: 0x3f3f46,
  ZINC_600: 0x52525b,
  ZINC_500: 0x71717a,
  ZINC_400: 0xa1a1aa,
  ZINC_300: 0xd4d4d8,
  ZINC_200: 0xe4e4e7,
  ZINC_100: 0xf4f4f5,
  ZINC_50: 0xfafafa,

  // Combat
  ARENA_UPPER: 0x16110e,
  ARENA_LOWER: 0x0c0a08,
  ARENA_RING: 0x2a1f18,
  RONIN_GLOW: 0xffffff,
  BOSS_GLOW: 0x881144,
  SLASH_RONIN: 0x6ee7b7,
  SLASH_RONIN_CORE: 0xe8fff4,
  SLASH_BOSS: 0xff1744,
  SLASH_BOSS_CORE: 0xffcdd2,
  WIND: 0xf5f5f5,
}

// ─── CSS Color Strings ──────────────────────────────────────────────────────

export const CSS = {
  SLATE_400: '#94a3b8',
  SLATE_50: '#f8fafc',
  AMBER_200: '#fde68a',
  SKY_200: '#bae6fd',
  CREAM: '#F7F7F7',
  MUTED: '#BFBFBF',
  STONE_300: '#d6d3d1',
  STONE_400: '#a8a29e',
  ZINC_400: '#a3a3a3',
  ZINC_300: '#d4d4d8',
  ZINC_200: '#e4e4e7',
  ZINC_100: '#f4f4f5',
  ZINC_50: '#fafafa',
  RED_100: '#fef2f2',
  RED_200: '#fecaca',
  RED_400: '#f87171',
  GREEN_300: '#86efac',
  GREEN_700: '#15803d',
  EMERALD_300: '#6ee7b7',
  AMBER_100: '#fef3c7',
  AMBER_200_HEX: '#fde68a',
  YELLOW_200: '#fef08a',
  WHITE: '#ffffff',
  NEAR_WHITE: '#fafafa',
  DARK: '#171717',
  HINT: '#c8c8c8',
}

// ─── Stroke Widths ──────────────────────────────────────────────────────────

export const STROKE = {
  HAIRLINE: 1,
  THIN: 1.5,
  MED: 2.5,
  BOLD: 3.5,
  HEAVY: 4.5,
}

// ─── Border Radius ──────────────────────────────────────────────────────────

export const RADIUS = {
  SM: 8,
  MD: 14,
  LG: 20,
  PILL: 999,
}

// ─── Animation Easing ───────────────────────────────────────────────────────

export const EASE = {
  SMOOTH: 'Cubic.out',
  SMOOTH_IN: 'Cubic.in',
  SMOOTH_INOUT: 'Cubic.InOut',
  SNAP: 'Expo.out',
  BOUNCE: 'Back.easeOut',
  GENTLE: 'Sine.inOut',
  QUAD: 'Quad.out',
  QUAD_INOUT: 'Quad.inOut',
}

// ─── Glow Intensity ─────────────────────────────────────────────────────────

export const GLOW = {
  SUBTLE: { outer: 1, quality: 2, intensity: 0.08 },
  MEDIUM: { outer: 3, quality: 4, intensity: 0.11 },
  STRONG: { outer: 5, quality: 6, intensity: 0.18 },
}

// ─── Typography ─────────────────────────────────────────────────────────────

export const FONT = {
  DISPLAY: '"Orbitron", system-ui, sans-serif',
  BODY: '"Outfit", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  MONO: '"Consolas", "Monaco", "Fira Code", monospace',
}

// ─── Depth Layers ───────────────────────────────────────────────────────────

export const DEPTH = {
  BG: 0,
  BG_OVERLAY: 1,
  GRAPH: 10,
  GRAPH_ARROWS: 9,
  GRAPH_CARDS: 10,
  GRAPH_DRAG: 18,
  GRAPH_GUIDE: 18,
  UI: 40,
  PANEL: 60,
  SLASH: 520,
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Clamped devicePixelRatio for Phaser text resolution. */
export function getDPR(max = 3) {
  if (typeof window === 'undefined') return 1.5
  return Math.min(max, Math.max(1, window.devicePixelRatio || 1.25))
}

/** Returns true when running inside a mobile-like viewport. */
export function isMobileViewport(w, h) {
  return h < 360 || w < 700
}

/** Returns a scale factor clamped for mobile layouts. */
export function mobileScale(w, h) {
  if (!isMobileViewport(w, h)) return 1.0
  return Math.max(0.68, Math.min(w / 720, h / 380))
}
