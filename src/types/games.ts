export type SudokuDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuCell {
  row: number;
  col: number;
  value: number | null;
  solutionValue: number;
  isGiven: boolean;
  notes: number[];
  isError: boolean;
  isHint?: boolean;
}

export interface SudokuMoveRecord {
  row: number;
  col: number;
  previousValue: number | null;
  newValue: number | null;
  previousNotes: number[];
  newNotes: number[];
}

export interface SudokuStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeSeconds: Record<SudokuDifficulty, number | null>;
}

// Bagh-Chal (Nepali National Tigers & Goats Board Game)
export type BaghChalPiece = 'tiger' | 'goat' | null;
export type BaghChalTurn = 'goat' | 'tiger';
export type BaghChalPhase = 'placement' | 'movement';

export interface BaghChalPoint {
  row: number;
  col: number;
}

export interface BaghChalState {
  board: BaghChalPiece[][];
  turn: BaghChalTurn;
  phase: BaghChalPhase;
  goatsPlaced: number;
  goatsCaptured: number;
  selectedPoint: BaghChalPoint | null;
  validMoves: BaghChalPoint[];
  winner: 'goat' | 'tiger' | null;
  mode: 'vsComputer' | 'twoPlayer';
  moveHistory: string[];
}

export interface BrainRiddle {
  id: string;
  category: 'math' | 'logic' | 'pattern' | 'nepali';
  titleNe: string;
  titleEn: string;
  questionNe: string;
  questionEn: string;
  optionsNe: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationNe: string;
  explanationEn: string;
  difficulty: 'easy' | 'medium' | 'hard';
}
