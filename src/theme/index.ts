export const colors = {
  background: '#A8E0DC',
  primary: '#F03E8C',
  accent: '#FFE566',
  surface: '#F9C5D5',
  teal: '#4DBFBF',
  white: '#FFFFFF',
  text: '#F03E8C',
  textDark: '#C0236A',
  textOnPink: '#FFFFFF',
  border: '#4DBFBF',
  cardBg: '#FFFFFF',
  tabBar: '#FFFFFF',
  tabBarActive: '#F03E8C',
  tabBarInactive: '#B0B0B0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 34,
};

export const fontWeight = {
  regular: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '900' as const,
};

const theme = { colors, spacing, radius, fontSize, fontWeight };
export default theme;
