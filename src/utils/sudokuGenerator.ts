import { SudokuCell, SudokuDifficulty } from '../types/games';

// Base valid full 9x9 Sudoku boards
const SEED_SOLUTIONS: number[][][] = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
  [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 1, 5, 6, 4, 8, 9, 7],
    [5, 6, 4, 8, 9, 7, 2, 3, 1],
    [8, 9, 7, 2, 3, 1, 5, 6, 4],
    [3, 1, 2, 6, 4, 5, 9, 7, 8],
    [6, 4, 5, 9, 7, 8, 3, 1, 2],
    [9, 7, 8, 3, 1, 2, 6, 4, 5],
  ],
  [
    [8, 2, 7, 1, 5, 4, 3, 9, 6],
    [9, 6, 5, 3, 2, 7, 1, 4, 8],
    [3, 4, 1, 6, 8, 9, 7, 5, 2],
    [5, 9, 3, 4, 6, 8, 2, 7, 1],
    [4, 7, 2, 5, 1, 3, 6, 8, 9],
    [6, 1, 8, 9, 7, 2, 4, 3, 5],
    [7, 8, 6, 2, 3, 5, 9, 1, 4],
    [1, 5, 4, 7, 9, 6, 8, 2, 3],
    [2, 3, 9, 8, 4, 1, 5, 6, 7],
  ],
];

// Number of clues remaining per difficulty
const CLUES_BY_DIFFICULTY: Record<SudokuDifficulty, number> = {
  easy: 38,
  medium: 32,
  hard: 26,
  expert: 22,
};

/**
 * Apply isomorphic permutations to a Sudoku solution:
 * - Permute digits 1-9
 * - Permute rows within 3x3 bands
 * - Permute columns within 3x3 stacks
 * - Transpose / Rotate
 * This generates completely unique games without breaking Sudoku validity!
 */
function permuteBoard(base: number[][]): number[][] {
  const result = base.map((row) => [...row]);

  // 1. Permute numbers (1-9 shuffle)
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffledNums = [...nums].sort(() => Math.random() - 0.5);
  const map = new Map<number, number>();
  nums.forEach((n, i) => map.set(n, shuffledNums[i]));

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      result[r][c] = map.get(result[r][c])!;
    }
  }

  // 2. Swap rows within blocks of 3
  for (let b = 0; b < 3; b++) {
    const r1 = b * 3 + Math.floor(Math.random() * 3);
    const r2 = b * 3 + Math.floor(Math.random() * 3);
    if (r1 !== r2) {
      const temp = result[r1];
      result[r1] = result[r2];
      result[r2] = temp;
    }
  }

  // 3. Swap columns within blocks of 3
  for (let b = 0; b < 3; b++) {
    const c1 = b * 3 + Math.floor(Math.random() * 3);
    const c2 = b * 3 + Math.floor(Math.random() * 3);
    if (c1 !== c2) {
      for (let r = 0; r < 9; r++) {
        const temp = result[r][c1];
        result[r][c1] = result[r][c2];
        result[r][c2] = temp;
      }
    }
  }

  // 4. Random transposition (swap rows and columns)
  if (Math.random() > 0.5) {
    for (let r = 0; r < 9; r++) {
      for (let c = r + 1; c < 9; c++) {
        const temp = result[r][c];
        result[r][c] = result[c][r];
        result[c][r] = temp;
      }
    }
  }

  return result;
}

/**
 * Generate an interactive 9x9 Sudoku board based on difficulty
 */
export function generateSudokuBoard(difficulty: SudokuDifficulty): {
  board: SudokuCell[][];
  solution: number[][];
} {
  const seed = SEED_SOLUTIONS[Math.floor(Math.random() * SEED_SOLUTIONS.length)];
  const solution = permuteBoard(seed);

  // Determine how many cells to reveal
  const targetClues = CLUES_BY_DIFFICULTY[difficulty] || 32;
  const cellsToRemove = 81 - targetClues;

  // List of all coordinates
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }

  // Shuffle positions to remove symmetric or random cells
  positions.sort(() => Math.random() - 0.5);

  const initialValues: (number | null)[][] = solution.map((row) => [...row]);
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [r, c] = positions[i];
    initialValues[r][c] = null;
  }

  // Construct SudokuCell objects
  const board: SudokuCell[][] = [];
  for (let r = 0; r < 9; r++) {
    const row: SudokuCell[] = [];
    for (let c = 0; c < 9; c++) {
      const isGiven = initialValues[r][c] !== null;
      row.push({
        row: r,
        col: c,
        value: initialValues[r][c],
        solutionValue: solution[r][c],
        isGiven,
        notes: [],
        isError: false,
      });
    }
    board.push(row);
  }

  return { board, solution };
}

/**
 * Check if the number causes any conflicts in the row, col, or 3x3 block
 */
export function validateBoardErrors(board: SudokuCell[][]): SudokuCell[][] {
  if (!board || board.length < 9) return board || [];

  const newBoard = board.map((row) =>
    row ? row.map((cell) => ({
      ...cell,
      isError: false,
    })) : []
  );

  // Check rows
  for (let r = 0; r < 9; r++) {
    if (!newBoard[r]) continue;
    const counts = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const cell = newBoard[r][c];
      const val = cell ? cell.value : null;
      if (val !== null) {
        if (!counts.has(val)) counts.set(val, []);
        counts.get(val)!.push(c);
      }
    }
    counts.forEach((cols) => {
      if (cols.length > 1) {
        cols.forEach((c) => {
          if (newBoard[r]?.[c]) {
            newBoard[r][c].isError = true;
          }
        });
      }
    });
  }

  // Check columns
  for (let c = 0; c < 9; c++) {
    const counts = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const cell = newBoard[r]?.[c];
      const val = cell ? cell.value : null;
      if (val !== null) {
        if (!counts.has(val)) counts.set(val, []);
        counts.get(val)!.push(r);
      }
    }
    counts.forEach((rows) => {
      if (rows.length > 1) {
        rows.forEach((r) => {
          if (newBoard[r]?.[c]) {
            newBoard[r][c].isError = true;
          }
        });
      }
    });
  }

  // Check 3x3 subgrids
  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const counts = new Map<number, [number, number][]>();
      for (let r = br * 3; r < br * 3 + 3; r++) {
        for (let c = bc * 3; c < bc * 3 + 3; c++) {
          const cell = newBoard[r]?.[c];
          const val = cell ? cell.value : null;
          if (val !== null) {
            if (!counts.has(val)) counts.set(val, []);
            counts.get(val)!.push([r, c]);
          }
        }
      }
      counts.forEach((coords) => {
        if (coords.length > 1) {
          coords.forEach(([r, c]) => {
            if (newBoard[r]?.[c]) {
              newBoard[r][c].isError = true;
            }
          });
        }
      });
    }
  }

  return newBoard;
}

/**
 * Check if the board is completely and correctly filled
 */
export function checkWinCondition(board: SudokuCell[][]): boolean {
  if (!board || board.length < 9) return false;
  for (let r = 0; r < 9; r++) {
    if (!board[r] || board[r].length < 9) return false;
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (!cell || cell.value === null || cell.value !== cell.solutionValue || cell.isError) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Count frequencies of placed numbers (1-9) to know which are completed
 */
export function getNumberCounts(board: SudokuCell[][]): Record<number, number> {
  const counts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  if (!board || board.length < 9) return counts;

  for (let r = 0; r < 9; r++) {
    if (!board[r]) continue;
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      const val = cell ? cell.value : null;
      if (val !== null && val >= 1 && val <= 9) {
        counts[val]++;
      }
    }
  }

  return counts;
}

/**
 * Format seconds into mm:ss
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
