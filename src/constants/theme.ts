// Retro orange theme inspired by Codecademy
export const lightTheme = {
  background: '#FFFBF5',
  surface: '#FFF7ED',
  surfaceVariant: '#FFF1E0',
  card: '#FFFFFF',
  cardBorder: '#FFE4C4',
  text: '#1A1A2E',
  textSecondary: '#5C5470',
  textTertiary: '#9E9AA7',
  primary: '#FF6B2B',
  primaryLight: '#FFF1E8',
  border: '#FFD4B8',
  success: '#2DC653',
  error: '#E63946',
  tabBar: '#FFFBF5',
  tabBarBorder: '#FFD4B8',
  statusBar: 'dark' as const,
};

export const darkTheme = {
  background: '#10100E',
  surface: '#1A1A2E',
  surfaceVariant: '#2A2A3E',
  card: '#1A1A2E',
  cardBorder: '#2A2A3E',
  text: '#FFF8F0',
  textSecondary: '#B8B0C8',
  textTertiary: '#6E6880',
  primary: '#FF8C42',
  primaryLight: '#331A00',
  border: '#2A2A3E',
  success: '#2DC653',
  error: '#E63946',
  tabBar: '#1A1A2E',
  tabBarBorder: '#2A2A3E',
  statusBar: 'light' as const,
};

export type Theme = typeof lightTheme;
