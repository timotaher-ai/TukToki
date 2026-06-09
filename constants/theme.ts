// Powered by OnSpace.AI — Teek Touky Dark Theme (Premium Tuk-Tuk Edition)

export const Colors = {
  // Primary Brand — Golden Tuk-Tuk Yellow
  primary: '#E8A020',
  primaryDark: '#C47A10',
  primaryLight: '#F5C55A',
  primarySurface: 'rgba(232, 160, 32, 0.12)',
  primaryBorder: 'rgba(232, 160, 32, 0.25)',

  // Dark Background System
  background: '#0E0F14',
  surface: '#1A1B22',
  surfaceSecondary: '#23242E',
  surfaceElevated: '#2A2B38',
  card: '#1E1F28',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B4C4',
  textTertiary: '#6B7080',
  textInverse: '#0E0F14',
  textMuted: '#3D3F50',

  // Semantic Colors
  success: '#00C878',
  successSurface: 'rgba(0, 200, 120, 0.12)',
  warning: '#FF9C00',
  warningSurface: 'rgba(255, 156, 0, 0.12)',
  error: '#FF4B4B',
  errorSurface: 'rgba(255, 75, 75, 0.12)',
  info: '#3D9BFF',
  infoSurface: 'rgba(61, 155, 255, 0.12)',

  // UI Elements
  border: 'rgba(255, 255, 255, 0.07)',
  borderLight: 'rgba(255, 255, 255, 0.04)',
  borderGold: 'rgba(232, 160, 32, 0.30)',
  divider: 'rgba(255, 255, 255, 0.05)',
  overlay: 'rgba(0, 0, 0, 0.70)',
  overlayLight: 'rgba(0, 0, 0, 0.40)',

  // Tab Bar
  tabActive: '#E8A020',
  tabInactive: '#4A4D60',
  tabBackground: '#141520',
  tabBorder: 'rgba(255, 255, 255, 0.06)',

  // Map
  mapBackground: '#1A2035',
  mapLine: '#E8A020',

  // Special
  online: '#00C878',
  offline: '#4A4D60',
  pinned: '#E8A020',
};

export const Typography = {
  fontFamily: 'Cairo',
  fontFamilyEn: 'System',

  // Sizes (8-point scale based on 16)
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 19,
  xl: 22,
  xxl: 26,
  xxxl: 32,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,

  // Line Heights
  tight: 1.3,
  normal: 1.55,
  relaxed: 1.75,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 56,
};

export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  full: 999,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.32,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.40,
    shadowRadius: 24,
    elevation: 12,
  },
  golden: {
    shadowColor: '#E8A020',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
  goldenSm: {
    shadowColor: '#E8A020',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 4,
  },
};
