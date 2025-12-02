// IBJJF Point-Scoring Positions

export const POINT_POSITIONS = {
  // 4 Points - Dominant Positions
  MOUNT: { name: 'Mount', points: 4, category: 'dominant' },
  BACK_CONTROL: { name: 'Back Control', points: 4, category: 'dominant' },
  
  // 3 Points - Guard Pass
  GUARD_PASS: { name: 'Guard Pass', points: 3, category: 'pass' },
  
  // 2 Points - Control & Transitions
  KNEE_ON_BELLY: { name: 'Knee on Belly', points: 2, category: 'control' },
  TAKEDOWN: { name: 'Takedown', points: 2, category: 'takedown' },
  SWEEP: { name: 'Sweep', points: 2, category: 'sweep' }, // Reference only - tracked separately
} as const;

export type PositionType = keyof typeof POINT_POSITIONS;

// Position event - tracks a single position score
export interface PositionScore {
  position: PositionType;
  type: 'me' | 'opponent'; // Who scored
  timestamp?: string;
  notes?: string;
}

// Calculate total points from position scores
export const calculatePositionPoints = (positions: PositionScore[]) => {
  const myPoints = positions
    .filter(p => p.type === 'me')
    .reduce((sum, p) => sum + POINT_POSITIONS[p.position].points, 0);
  
  const opponentPoints = positions
    .filter(p => p.type === 'opponent')
    .reduce((sum, p) => sum + POINT_POSITIONS[p.position].points, 0);
  
  return { myPoints, opponentPoints };
};
