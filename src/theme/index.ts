// ─── Brand colors (from WOW Summer Camp brand board) ─────────────────────────
export const colors = {
  // Primary pink — hero CTA, primary actions, highlights
  primary:      '#F84D90',
  primaryDark:  '#C4296D',

  // Teal family
  teal:         '#00B7B7',   // primary teal — headers, badges, accents
  tealLight:    '#ADE8E8',   // soft teal — surfaces, chips, backgrounds
  tealDark:     '#006666',   // dark teal — deep text on teal, dark badges

  // Yellow
  yellow:       '#FFD972',   // warm camp yellow — accent, highlights

  // Blush
  blush:        '#FFD0E0',   // light pink — subtle backgrounds, surface tints

  // Surfaces & backgrounds
  background:   '#FFFFFF',
  cardBg:       '#FFFFFF',
  white:        '#FFFFFF',
  surface:      '#FFD0E0',   // blush — matches brand board

  // Text
  textDark:     '#006666',   // dark teal — on-brand dark text
  textMuted:    '#4A9B9B',   // mid teal for secondary text
  text:         '#F84D90',

  // Navigation
  tabBar:       '#FFFFFF',
  tabBarActive: '#F84D90',
  tabBarInactive: '#00B7B7',

  // Utility
  border:       '#ADE8E8',   // light teal border
  success:      '#00B7B7',
  error:        '#F84D90',

  // Legacy aliases kept so existing screens don't break
  accent:       '#FFD972',
  orange:       '#F84D90',
  skyBlue:      '#ADE8E8',
  lavender:     '#ADE8E8',
  softPink:     '#FFD0E0',
  peach:        '#FFD972',
  paleYellow:   '#FFD972',
  mint:         '#ADE8E8',
};

/**
 * Brand gradient — teal → yellow → pink (mirrors pennant / badge palette)
 */
export const tieDyeGradient = {
  colors: ['#00B7B7', '#FFD972', '#F84D90'] as const,
  start:  { x: 0, y: 0 },
  end:    { x: 1, y: 1 },
};

export const tieDyeMiniGradient = {
  colors: ['#ADE8E8', '#FFD972', '#FFD0E0'] as const,
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

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const shadow = {
  sm: {
    shadowColor: '#006666',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#006666',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#006666',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const fontFamily = {
  body:        'Raleway_400Regular',
  bodySemi:    'Raleway_600SemiBold',
  bodyBold:    'Raleway_700Bold',
  display:     'Corben_700Bold',
  subheading:  'Barlow_500Medium',
};

const theme = { colors, tieDyeGradient, tieDyeMiniGradient, spacing, radius, fontSize, fontWeight, fontFamily, shadow };
export default theme;
