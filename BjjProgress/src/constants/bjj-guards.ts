// BJJ Guard Positions - for sweep tracking

// Guards you can sweep FROM (bottom positions)
export const BOTTOM_GUARDS = [
  'Closed Guard',
  'Open Guard',
  'Half Guard',
  'Deep Half Guard',
  'X Guard',
  'Single Leg X',
  'De La Riva',
  'Reverse De La Riva',
  'Spider Guard',
  'Lasso Guard',
  'Butterfly Guard',
  '50/50',
  'K Guard',
  'Worm Guard',
  'Lapel Guard',
  'Rubber Guard',
  'Other Guard'
] as const;

// Positions opponent can sweep you FROM (when you're on top)
export const TOP_POSITIONS = [
  'In Their Closed Guard',
  'In Their Open Guard',
  'In Their Half Guard',
  'In Their Deep Half',
  'Side Control',
  'Mount',
  'Back Control',
  'Knee on Belly',
  'Turtle Position',
  'Standing',
  'Other Position'
] as const;

export type BottomGuard = typeof BOTTOM_GUARDS[number];
export type TopPosition = typeof TOP_POSITIONS[number];
export type GuardPosition = BottomGuard | TopPosition;

// Sweep event - tracks a single sweep
export interface Sweep {
  guard: GuardPosition;  // Which guard/position
  type: 'given' | 'received';  // Who swept whom
  timestamp?: string;  // When it happened (optional)
  notes?: string;  // Quick note (optional)
}

// Points awarded for sweeps
export const SWEEP_POINTS = 2;
