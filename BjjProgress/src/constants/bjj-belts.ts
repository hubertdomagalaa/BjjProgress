export const BELT_COLORS = {
  white: '#F5F5F5',
  blue: '#1E40AF',
  purple: '#7C3AED',
  brown: '#78350F',
  black: '#1F2937'
} as const;

export const BELT_NAMES = {
  white: 'White Belt',
  blue: 'Blue Belt',
  purple: 'Purple Belt',
  brown: 'Brown Belt',
  black: 'Black Belt'
} as const;

export const BELT_LEVELS: Array<keyof typeof BELT_COLORS> = [
  'white',
  'blue',
  'purple',
  'brown',
  'black'
];

export type BeltLevel = keyof typeof BELT_COLORS;
export type Stripes = 0 | 1 | 2 | 3 | 4;
