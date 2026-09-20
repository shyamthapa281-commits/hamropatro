import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Undo2,
  Eraser,
  Pencil,
  Lightbulb,
  Play,
  Pause,
  Trophy,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { Language } from '../../types';
import { SudokuCell, SudokuDifficulty, SudokuMoveRecord } from '../../types/games';
import {
  generateSudokuBoard,
  validateBoardErrors,
  checkWinCondition,
  getNumberCounts,
  formatTime,
} from '../../utils/sudokuGenerator';
import { toNepaliDigits } from '../../utils/nepaliCalendar';

interface SudokuGameProps {
  lang: Language;
}

const DEVANAGARI_DIGITS: Record<number, string> = {
  1: '१',
  2: '२',
  3: '३',
  4: '४',
  5: '५',
  6: '६',
  7: '७',
  8: '८',
  9: '९',
};

export const SudokuGame: React.FC<SudokuGameProps> = ({ lang }) => {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('easy');
  const [board, setBoard] = useState<SudokuCell[][]>(() => generateSudokuBoard('easy').board);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>({ row: 0, col: 0 });
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [history, setHistory] = useState<SudokuMoveRecord[]>([]);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [maxMistakesEnabled, setMaxMistakesEnabled] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [useNepaliDigits, setUseNepaliDigits] = useState<boolean>(lang === 'ne');
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Initialize a fresh game
  const startNewGame = useCallback((diff: SudokuDifficulty = difficulty) => {
    const { board: newBoard } = generateSudokuBoard(diff);
    setBoard(newBoard);
    setSelectedCell({ row: 0, col: 0 });
    setHistory([]);
    setTimerSeconds(0);
    setIsPaused(false);
    setIsWon(false);
    setIsGameOver(false);
    setMistakes(0);
    setHintsUsed(0);
  }, [difficulty]);

  // Start on difficulty change (skip first mount since initialized in useState)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    startNewGame(difficulty);
  }, [difficulty, startNewGame]);

  // Timer loop
  useEffect(() => {
    if (!isPaused && !isWon && !isGameOver) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, isWon, isGameOver]);

  // Handle cell selection
  const handleSelectCell = (row: number, col: number) => {
    if (isPaused || isWon || isGameOver) return;
    setSelectedCell({ row, col });
  };

  // Place number or note
  const handleInputNumber = useCallback((num: number) => {
    if (!selectedCell || isPaused || isWon || isGameOver) return;
    const { row, col } = selectedCell;
    const targetCell = board[row]?.[col];
    if (!targetCell) return;

    // Cannot modify pre-filled clues
    if (targetCell.isGiven) return;

    if (isNotesMode) {
      // Toggle candidate note
      const currentNotes = [...targetCell.notes];
      const noteIndex = currentNotes.indexOf(num);
      let nextNotes: number[];
      if (noteIndex >= 0) {
        nextNotes = currentNotes.filter((n) => n !== num);
      } else {
        nextNotes = [...currentNotes, num].sort();
      }

      setHistory((prev) => [
        ...prev,
        {
          row,
          col,
          previousValue: targetCell.value,
          newValue: targetCell.value,
          previousNotes: targetCell.notes,
          newNotes: nextNotes,
        },
      ]);

      setBoard((prev) => {
        const next = prev.map((r, rIdx) =>
          r.map((c, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return { ...c, notes: nextNotes };
            }
            return c;
          })
        );
        return next;
      });
      return;
    }

    // Normal value input
    if (targetCell.value === num) {
      // Clicked same number again -> clear it
      return;
    }

    const prevValue = targetCell.value;
    const prevNotes = targetCell.notes;

    // Check if move is an error against solution
    const isError = num !== targetCell.solutionValue;
    if (isError) {
      setMistakes((m) => {
        const nextMistakes = m + 1;
        if (maxMistakesEnabled && nextMistakes >= 3) {
          setIsGameOver(true);
        }
        return nextMistakes;
      });
    }

    setHistory((prev) => [
      ...prev,
      {
        row,
        col,
        previousValue: prevValue,
        newValue: num,
        previousNotes: prevNotes,
        newNotes: [],
      },
    ]);

    setBoard((prev) => {
      let next = prev.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {
              ...c,
              value: num,
              notes: [],
              isHint: false,
            };
          }
          // Remove this number from notes in same row, column, and 3x3 block
          const inSameRow = rIdx === row;
          const inSameCol = cIdx === col;
          const inSameBlock =
            Math.floor(rIdx / 3) === Math.floor(row / 3) &&
            Math.floor(cIdx / 3) === Math.floor(col / 3);

          if ((inSameRow || inSameCol || inSameBlock) && c.notes.includes(num)) {
            return {
              ...c,
              notes: c.notes.filter((n) => n !== num),
            };
          }
          return c;
        })
      );

      next = validateBoardErrors(next);

      // Check win condition
      if (checkWinCondition(next)) {
        setIsWon(true);
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }

      return next;
    });
  }, [selectedCell, isPaused, isWon, isGameOver, board, isNotesMode, maxMistakesEnabled]);

  // Erase current cell
  const handleErase = useCallback(() => {
    if (!selectedCell || isPaused || isWon || isGameOver) return;
    const { row, col } = selectedCell;
    const cell = board[row]?.[col];
    if (!cell || cell.isGiven || (cell.value === null && cell.notes.length === 0)) return;

    setHistory((prev) => [
      ...prev,
      {
        row,
        col,
        previousValue: cell.value,
        newValue: null,
        previousNotes: cell.notes,
        newNotes: [],
      },
    ]);

    setBoard((prev) => {
      const next = prev.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return { ...c, value: null, notes: [], isError: false };
          }
          return c;
        })
      );
      return validateBoardErrors(next);
    });
  }, [selectedCell, isPaused, isWon, isGameOver, board]);

  // Undo last action
  const handleUndo = useCallback(() => {
    if (history.length === 0 || isPaused || isWon || isGameOver) return;
    const lastMove = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));

    setBoard((prev) => {
      const next = prev.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === lastMove.row && cIdx === lastMove.col) {
            return {
              ...c,
              value: lastMove.previousValue,
              notes: lastMove.previousNotes,
              isError: false,
            };
          }
          return c;
        })
      );
      return validateBoardErrors(next);
    });

    setSelectedCell({ row: lastMove.row, col: lastMove.col });
  }, [history, isPaused, isWon, isGameOver]);

  // Reveal Hint
  const handleHint = useCallback(() => {
    if (!selectedCell || isPaused || isWon || isGameOver) return;
    const { row, col } = selectedCell;
    const cell = board[row]?.[col];
    if (!cell || cell.isGiven || cell.value === cell.solutionValue) return;

    setHintsUsed((h) => h + 1);

    setBoard((prev) => {
      let next = prev.map((r, rIdx) =>
        r.map((c, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return {
              ...c,
              value: c.solutionValue,
              notes: [],
              isError: false,
              isHint: true,
            };
          }
          return c;
        })
      );
      next = validateBoardErrors(next);

      if (checkWinCondition(next)) {
        setIsWon(true);
        try {
          confetti({ particleCount: 100, spread: 60 });
        } catch {}
      }
      return next;
    });
  }, [selectedCell, isPaused, isWon, isGameOver, board]);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isWon || isGameOver) return;

      // Number keys 1-9
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        handleInputNumber(parseInt(e.key, 10));
        return;
      }

      // Delete / Backspace
      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleErase();
        return;
      }

      // Notes mode toggle: 'n' or 'N'
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsNotesMode((m) => !m);
        return;
      }

      // Hint: 'h' or 'H'
      if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleHint();
        return;
      }

      // Undo: 'u' or Ctrl+Z
      if (e.key.toLowerCase() === 'u' || (e.ctrlKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Arrow navigation
      if (selectedCell) {
        let { row, col } = selectedCell;
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          row = (row - 1 + 9) % 9;
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          row = (row + 1) % 9;
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          col = (col - 1 + 9) % 9;
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          col = (col + 1) % 9;
        }
        setSelectedCell({ row, col });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInputNumber, handleErase, handleHint, handleUndo, isPaused, isWon, isGameOver, selectedCell]);

  const numberCounts = getNumberCounts(board);
  const activeCellValue =
    selectedCell && board[selectedCell.row] && board[selectedCell.row][selectedCell.col]
      ? board[selectedCell.row][selectedCell.col].value
      : null;

  const renderDigit = (num: number) => {
    return useNepaliDigits ? DEVANAGARI_DIGITS[num] : num.toString();
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col space-y-4">
      {/* Top Header Controls Bar */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Difficulty Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
          {(['easy', 'medium', 'hard', 'expert'] as SudokuDifficulty[]).map((diff) => {
            const isActive = difficulty === diff;
            const diffLabels: Record<SudokuDifficulty, { ne: string; en: string }> = {
              easy: { ne: 'सजिलो', en: 'Easy' },
              medium: { ne: 'मध्यम', en: 'Medium' },
              hard: { ne: 'कठिन', en: 'Hard' },
              expert: { ne: 'विज्ञ', en: 'Expert' },
            };
            return (
              <button
                key={diff}
                onClick={() => {
                  setDifficulty(diff);
                  startNewGame(diff);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {lang === 'ne' ? diffLabels[diff].ne : diffLabels[diff].en}
              </button>
            );
          })}
        </div>

        {/* Timer, Mistakes, and Game Controls */}
        <div className="flex items-center gap-3">
          {/* Mistakes Counter */}
          <div className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-200">
            <span className="text-stone-400 font-normal">
              {lang === 'ne' ? 'गल्ती:' : 'Mistakes:'}
            </span>
            <span className={mistakes > 0 ? 'text-red-600 font-extrabold' : ''}>
              {lang === 'ne' ? toNepaliDigits(mistakes) : mistakes}
              {maxMistakesEnabled ? (lang === 'ne' ? '/३' : '/3') : ''}
            </span>
          </div>

          {/* Game Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-800 dark:text-stone-100">
            <span>
              {lang === 'ne' ? toNepaliDigits(formatTime(timerSeconds)) : formatTime(timerSeconds)}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              title={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Numeral System Toggle: Devanagari vs Western */}
          <button
            onClick={() => setUseNepaliDigits(!useNepaliDigits)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              useNepaliDigits
                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-2xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
            }`}
            title={lang === 'ne' ? 'अङ्क प्रणाली परिवर्तन (१-९ वा 1-9)' : 'Toggle Nepali (१-९) or Western (1-9) Digits'}
          >
            <Hash className="w-3.5 h-3.5 text-amber-600" />
            <span>{useNepaliDigits ? 'नेपाली अङ्क (१-९)' : 'Digits (1-9)'}</span>
          </button>

          {/* How to Play Dialog Toggle */}
          <button
            onClick={() => setShowHowToPlay(!showHowToPlay)}
            className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 rounded-xl transition-colors cursor-pointer"
            title={lang === 'ne' ? 'सुडोकू कसरी खेल्ने?' : 'How to Play Sudoku?'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* How to Play Collapsible Guide */}
      {showHowToPlay && (
        <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-3xl border border-amber-200 dark:border-amber-900 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
            <span className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              {lang === 'ne' ? 'सुडोकूका आधारभूत नियमहरू:' : 'Basic Rules of Sudoku:'}
            </span>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer text-[11px]"
            >
              ✕ {lang === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
            </button>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-stone-600 dark:text-stone-300">
            <li>
              {lang === 'ne'
                ? 'प्रत्येक ९ वटा पङ्क्ति (Row) मा १ देखि ९ सम्मका अङ्कहरू बिना दोहोर्याइ भर्नुपर्छ।'
                : 'Each of the 9 horizontal rows must contain numbers 1 to 9 without repetition.'}
            </li>
            <li>
              {lang === 'ne'
                ? 'प्रत्येक ९ वटा स्तम्भ (Column) मा १ देखि ९ सम्मका अङ्कहरू हुनुपर्छ।'
                : 'Each of the 9 vertical columns must contain numbers 1 to 9 without repetition.'}
            </li>
            <li>
              {lang === 'ne'
                ? 'प्रत्येक ३x३ को कोठा (Block) भित्र पनि १ देखि ९ सम्मका सबै अङ्कहरू समावेश हुनुपर्छ।'
                : 'Each 3x3 block bordered by thick lines must also contain digits 1 to 9.'}
            </li>
            <li>
              {lang === 'ne'
                ? 'कच्चा टिप्पणी (Pencil Notes) प्रयोग गरी सम्भावित अङ्कहरू टिपोट गर्न सक्नुहुन्छ।'
                : 'Use Notes mode (Pencil icon) to jot down candidate possibilities in empty cells.'}
            </li>
          </ul>
        </div>
      )}

      {/* Main Board & Action Bar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left/Center: 9x9 Sudoku Board */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative p-2.5 sm:p-3 bg-stone-900 dark:bg-stone-950 rounded-3xl shadow-xl border-4 border-stone-800 dark:border-stone-900 max-w-full">
            {/* Pause Overlay */}
            {isPaused && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-stone-900/80 rounded-3xl flex flex-col items-center justify-center text-white p-6">
                <Pause className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
                <h3 className="text-lg font-extrabold mb-1">
                  {lang === 'ne' ? 'खेल रोक्का गरिएको छ' : 'Game Paused'}
                </h3>
                <p className="text-xs text-stone-300 mb-4 text-center max-w-xs">
                  {lang === 'ne' ? 'आफ्नो गतिमा पुनः सुरु गर्न क्लिक गर्नुहोस्।' : 'Take your time. Click resume when ready.'}
                </p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{lang === 'ne' ? 'जारी राख्नुहोस्' : 'Resume Game'}</span>
                </button>
              </div>
            )}

            {/* Game Over Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-red-950/90 rounded-3xl flex flex-col items-center justify-center text-white p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mb-3 animate-bounce" />
                <h3 className="text-lg font-extrabold mb-1">
                  {lang === 'ne' ? 'खेल समाप्त (३ गल्ती)' : 'Game Over (3 Mistakes)'}
                </h3>
                <p className="text-xs text-red-200 mb-4 max-w-xs">
                  {lang === 'ne' ? 'चिन्ता नगर्नुहोस्, नयाँ खेल सुरु गरेर फेरि प्रयास गर्नुहोस्।' : 'Better luck next time! Try another round.'}
                </p>
                <button
                  onClick={() => startNewGame()}
                  className="px-6 py-2.5 bg-white text-stone-900 hover:bg-stone-100 font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-red-600" />
                  <span>{lang === 'ne' ? 'पुन: प्रयास गर्नुहोस्' : 'Play Again'}</span>
                </button>
              </div>
            )}

            {/* Win Overlay */}
            {isWon && (
              <div className="absolute inset-0 z-20 backdrop-blur-md bg-stone-950/85 rounded-3xl flex flex-col items-center justify-center text-white p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg mb-3 animate-bounce">
                  <Trophy className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-extrabold text-amber-300 mb-1">
                  {lang === 'ne' ? 'बधाई छ! तपाईंले जित्नुभयो!' : 'Congratulations! Puzzle Solved!'}
                </h3>
                <p className="text-xs text-stone-300 mb-2">
                  {lang === 'ne' ? `समय: ${toNepaliDigits(formatTime(timerSeconds))}` : `Time: ${formatTime(timerSeconds)}`} •{' '}
                  {lang === 'ne' ? `गल्ती: ${toNepaliDigits(mistakes)}` : `Mistakes: ${mistakes}`}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => startNewGame()}
                    className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-stone-900" />
                    <span>{lang === 'ne' ? 'अर्को खेल खेल्नुहोस्' : 'Play Next Board'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 9x9 Interactive Grid */}
            <div
              className="grid grid-cols-9 gap-[1px] bg-stone-400 dark:bg-stone-700 border-2 border-stone-800 dark:border-stone-700 select-none"
              style={{
                width: 'min(90vw, 460px)',
                height: 'min(90vw, 460px)',
              }}
            >
              {board.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
                  const isSameRow = selectedCell?.row === rIdx;
                  const isSameCol = selectedCell?.col === cIdx;
                  const isSameBlock =
                    selectedCell &&
                    Math.floor(selectedCell.row / 3) === Math.floor(rIdx / 3) &&
                    Math.floor(selectedCell.col / 3) === Math.floor(cIdx / 3);
                  const isHighlightedArea = (isSameRow || isSameCol || isSameBlock) && !isSelected;
                  const isSameNumber =
                    activeCellValue !== null &&
                    cell.value !== null &&
                    cell.value === activeCellValue &&
                    !isSelected;

                  // Thicker borders for 3x3 subgrids
                  const borderRight = (cIdx + 1) % 3 === 0 && cIdx !== 8 ? 'border-r-2 border-r-stone-900 dark:border-r-stone-950' : '';
                  const borderBottom = (rIdx + 1) % 3 === 0 && rIdx !== 8 ? 'border-b-2 border-b-stone-900 dark:border-b-stone-950' : '';

                  let cellBg = 'bg-white dark:bg-stone-900';
                  if (isSelected) {
                    cellBg = 'bg-blue-600 text-white font-extrabold ring-2 ring-blue-400 shadow-inner';
                  } else if (cell.isError) {
                    cellBg = 'bg-red-100 dark:bg-red-950/70 text-red-600 font-extrabold ring-1 ring-red-400';
                  } else if (isSameNumber) {
                    cellBg = 'bg-blue-100 dark:bg-blue-950/80 font-bold';
                  } else if (isHighlightedArea) {
                    cellBg = 'bg-stone-100/90 dark:bg-stone-800/80';
                  }

                  let textColor = 'text-stone-900 dark:text-stone-100';
                  if (isSelected) {
                    textColor = 'text-white';
                  } else if (cell.isError) {
                    textColor = 'text-red-600 dark:text-red-400';
                  } else if (cell.isGiven) {
                    textColor = 'text-stone-950 dark:text-white font-extrabold';
                  } else if (cell.isHint) {
                    textColor = 'text-amber-600 dark:text-amber-400 font-extrabold';
                  } else {
                    textColor = 'text-blue-700 dark:text-blue-300 font-bold';
                  }

                  return (
                    <button
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleSelectCell(rIdx, cIdx)}
                      className={`relative flex items-center justify-center transition-colors duration-75 cursor-pointer ${cellBg} ${borderRight} ${borderBottom}`}
                    >
                      {cell.value !== null ? (
                        <span className={`text-base sm:text-xl md:text-2xl ${textColor} select-none`}>
                          {renderDigit(cell.value)}
                        </span>
                      ) : cell.notes.length > 0 ? (
                        <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5 pointer-events-none">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <span
                              key={n}
                              className="text-[8px] sm:text-[10px] font-semibold text-stone-400 dark:text-stone-500 flex items-center justify-center leading-none"
                            >
                              {cell.notes.includes(n) ? renderDigit(n) : ''}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Number Pad */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Action Tools: Undo, Erase, Notes, Hint */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
              {lang === 'ne' ? 'साधनहरू' : 'Controls & Actions'}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {/* Undo */}
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="py-2.5 px-2 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 disabled:opacity-40 text-stone-700 dark:text-stone-200 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed text-xs font-bold"
                title={lang === 'ne' ? 'पूर्ववत (Undo)' : 'Undo (U)'}
              >
                <Undo2 className="w-4 h-4 text-stone-700 dark:text-stone-200" />
                <span className="text-[10px]">{lang === 'ne' ? 'पूर्ववत' : 'Undo'}</span>
              </button>

              {/* Erase */}
              <button
                onClick={handleErase}
                className="py-2.5 px-2 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer text-xs font-bold"
                title={lang === 'ne' ? 'मेटाउने (Erase)' : 'Erase (Del)'}
              >
                <Eraser className="w-4 h-4 text-red-500" />
                <span className="text-[10px]">{lang === 'ne' ? 'मेटाउने' : 'Erase'}</span>
              </button>

              {/* Pencil / Notes Mode */}
              <button
                onClick={() => setIsNotesMode(!isNotesMode)}
                className={`py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer text-xs font-bold border ${
                  isNotesMode
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                }`}
                title={lang === 'ne' ? 'कच्चा नोट प्रणाली (N)' : 'Notes Mode (N)'}
              >
                <Pencil className="w-4 h-4" />
                <span className="text-[10px]">
                  {lang === 'ne' ? (isNotesMode ? 'नोट सक्रिय' : 'नोट') : isNotesMode ? 'Notes ON' : 'Notes'}
                </span>
              </button>

              {/* Hint */}
              <button
                onClick={handleHint}
                className="py-2.5 px-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-200 flex flex-col items-center gap-1 transition-all active:scale-95 cursor-pointer text-xs font-bold border border-amber-200 dark:border-amber-900"
                title={lang === 'ne' ? 'संकेत (Hint)' : 'Hint (H)'}
              >
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-[10px]">
                  {lang === 'ne' ? 'संकेत' : 'Hint'} {hintsUsed > 0 ? `(${hintsUsed})` : ''}
                </span>
              </button>
            </div>
          </div>

          {/* Number Keypad (1 - 9) */}
          <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-2.5">
              <span>{lang === 'ne' ? 'अङ्कहरू छान्नुहोस्' : 'Number Pad'}</span>
              <span className="text-[10px] text-stone-400 font-normal">
                {lang === 'ne' ? 'वा किबोर्ड १-९ थिच्नुहोस्' : 'or press 1-9 on keyboard'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
                const count = numberCounts[num] || 0;
                const isCompleted = count >= 9;

                return (
                  <button
                    key={num}
                    onClick={() => handleInputNumber(num)}
                    disabled={isCompleted}
                    className={`py-3.5 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer border ${
                      isCompleted
                        ? 'bg-stone-100 dark:bg-stone-800/40 text-stone-400 dark:text-stone-600 border-transparent cursor-not-allowed opacity-40'
                        : 'bg-stone-50 dark:bg-stone-800 hover:bg-red-50 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 hover:text-red-700 border-stone-200 dark:border-stone-700 hover:border-red-300 shadow-2xs hover:shadow-sm'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl font-black">{renderDigit(num)}</span>
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 font-semibold">
                      {isCompleted
                        ? '✓'
                        : lang === 'ne'
                        ? `${toNepaliDigits(9 - count)} बाँकी`
                        : `${9 - count} left`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Restart & Difficulty Changer */}
          <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <button
              onClick={() => startNewGame(difficulty)}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-100 text-stone-700 dark:text-stone-200 text-xs font-bold border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'पुन: सुरु गर्नुहोस्' : 'Restart Board'}</span>
            </button>

            <button
              onClick={() => setMaxMistakesEnabled(!maxMistakesEnabled)}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                maxMistakesEnabled
                  ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700'
              }`}
              title={lang === 'ne' ? '३ गल्ती सीमा अन/अफ' : 'Toggle 3 Mistakes Limit'}
            >
              {maxMistakesEnabled
                ? lang === 'ne' ? '३ गल्ती सीमा: खुला' : '3-Mistakes Limit: ON'
                : lang === 'ne' ? 'असीमित अभ्यास' : 'Free Practice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
