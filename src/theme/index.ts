// ─── Core brand ──────────────────────────────────────────────────────────────
export const colors = {
  // Primary brand (hot pink — unchanged)
  primary:      '#F03E8C',
  primaryDark:  '#C0236A',

  // Tie-dye pastel palette (extracted from counselor shirts)
  skyBlue:      '#A0D4F0',
  lavender:     '#B8A8E4',
  softPink:     '#F4B8D0',
  peach:        '#FFB894',
  paleYellow:   '#F4E494',
  mint:         '#B8E8D0',

  // Surfaces
  background:   '#FBF8FF',   // near-white with faint lavender warmth
  surface:      '#F9C5D5',   // soft pink (kept from v1)
  cardBg:       '#FFFFFF',
  white:        '#FFFFFF',

  // Text
  text:         '#F03E8C',
  textDark:     '#3D2645',   // deep plum — readable on pastels, on-brand
  textMuted:    '#8A7A94',

  // Accents
  teal:         '#4DBFBF',
  accent:       '#FFE566',
  orange:       '#FF7043',   // from the pen in the promo photo — great for CTAs

  // Navigation
  tabBar:       '#FFFFFF',
  tabBarActive: '#F03E8C',
  tabBarInactive: '#C4B0CC',

  // Utility
  border:       '#E8D8F0',
  success:      '#27AE60',
  error:        '#E74C3C',
};

/**
 * The 5-stop tie-dye gradient — diagonal top-left (blue) → bottom-right (yellow).
 * Mimics the pastel spiral on the counselor shirts.
 */
export const tieDyeGradient = {
  colors: ['#A0D4F0', '#B8A8E4', '#F4B8D0', '#FFB894', '#F4E494'] as const,
  start:  { x: 0, y: 0 },
  end:    { x: 1, y: 1 },
};

/**
 * A subtler 3-stop version for smaller elements (cards, badges, pills).
 */
export const tieDyeMiniGradient = {
  colors: ['#B8A8E4', '#F4B8D0', '#FFB894'] as const,
  start:  { x: 0, y: 0 },
  end:    { x: 1, y: 1 },
};

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

// ─── Border radius ────────────────────────────────────────────────────────────
export const radius = {
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  full: 999,
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const fontSize = {
  xs:  11,
  sm:  13,
  md:  16,
  lg:  20,
  xl:  26,
  xxl: 34,
};

export const fontWeight = {
  regular:  '400' as const,
  semibold: '600' as const,
  bold:     '700' as const,
  heavy:    '900' as const,
};

// ─── Shadows (iOS + Android) ──────────────────────────────────────────────────
export const shadow = {
  sm: {
    shadowColor: '#3D2645',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#3D2645',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#3D2645',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

const theme = { colors, tieDyeGradient, tieDyeMiniGradient, spacing, radius, fontSize, fontWeight, shadow };
export default theme;
