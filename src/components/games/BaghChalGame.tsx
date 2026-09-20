import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Bot,
  Info,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Language } from '../../types';
import {
  BaghChalPiece,
  BaghChalPoint,
  BaghChalTurn,
  BaghChalPhase,
} from '../../types/games';
import { toNepaliDigits } from '../../utils/nepaliCalendar';

interface BaghChalGameProps {
  lang: Language;
}

// 5x5 board adjacency list (horizontal, vertical, diagonal lines)
const ADJACENCY: Record<string, [number, number][]> = {};

function initAdjacency() {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const key = `${r},${c}`;
      const neighbors: [number, number][] = [];

      // Orthogonal directions (up, down, left, right)
      const orthDirs = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ];
      for (const [dr, dc] of orthDirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
          neighbors.push([nr, nc]);
        }
      }

      // Diagonal connections only exist on vertices where (r + c) % 2 === 0
      if ((r + c) % 2 === 0) {
        const diagDirs = [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ];
        for (const [dr, dc] of diagDirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
            neighbors.push([nr, nc]);
          }
        }
      }

      ADJACENCY[key] = neighbors;
    }
  }
}

initAdjacency();

export const BaghChalGame: React.FC<BaghChalGameProps> = ({ lang }) => {
  // Board: 5x5 array
  const [board, setBoard] = useState<BaghChalPiece[][]>(() => {
    const b: BaghChalPiece[][] = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null));
    // Tigers start at the four corners
    b[0][0] = 'tiger';
    b[0][4] = 'tiger';
    b[4][0] = 'tiger';
    b[4][4] = 'tiger';
    return b;
  });

  const [turn, setTurn] = useState<BaghChalTurn>('goat'); // Goats place first
  const [phase, setPhase] = useState<BaghChalPhase>('placement');
  const [goatsPlaced, setGoatsPlaced] = useState<number>(0); // Total placed (up to 20)
  const [goatsCaptured, setGoatsCaptured] = useState<number>(0); // Up to 5
  const [selectedPoint, setSelectedPoint] = useState<BaghChalPoint | null>(null);
  const [validMoves, setValidMoves] = useState<BaghChalPoint[]>([]);
  const [winner, setWinner] = useState<'goat' | 'tiger' | null>(null);
  const [mode, setMode] = useState<'vsComputer' | 'twoPlayer'>('vsComputer');
  const [playerRole, setPlayerRole] = useState<'goat' | 'tiger'>('goat');
  const [showRules, setShowRules] = useState<boolean>(false);

  // Reset Game
  const resetGame = useCallback(() => {
    const b: BaghChalPiece[][] = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null));
    b[0][0] = 'tiger';
    b[0][4] = 'tiger';
    b[4][0] = 'tiger';
    b[4][4] = 'tiger';
    setBoard(b);
    setTurn('goat');
    setPhase('placement');
    setGoatsPlaced(0);
    setGoatsCaptured(0);
    setSelectedPoint(null);
    setValidMoves([]);
    setWinner(null);
  }, []);

  // Calculate valid moves for a Tiger at (r, c)
  const getTigerMoves = useCallback((r: number, c: number, currentBoard: BaghChalPiece[][]) => {
    const moves: BaghChalPoint[] = [];
    const key = `${r},${c}`;
    const neighbors = ADJACENCY[key] || [];

    for (const [nr, nc] of neighbors) {
      // 1. Simple step into vacant adjacent point
      if (currentBoard[nr][nc] === null) {
        moves.push({ row: nr, col: nc });
      } else if (currentBoard[nr][nc] === 'goat') {
        // 2. Jump capture over goat
        const dr = nr - r;
        const dc = nc - c;
        const jumpR = nr + dr;
        const jumpC = nc + dc;

        if (
          jumpR >= 0 &&
          jumpR < 5 &&
          jumpC >= 0 &&
          jumpC < 5 &&
          currentBoard[jumpR][jumpC] === null
        ) {
          // Check if jump direction continues on a valid line
          const midKey = `${nr},${nc}`;
          const midNeighbors = ADJACENCY[midKey] || [];
          const canReach = midNeighbors.some(([mr, mc]) => mr === jumpR && mc === jumpC);
          if (canReach) {
            moves.push({ row: jumpR, col: jumpC });
          }
        }
      }
    }
    return moves;
  }, []);

  // Calculate valid moves for a Goat at (r, c)
  const getGoatMoves = useCallback((r: number, c: number, currentBoard: BaghChalPiece[][]) => {
    const moves: BaghChalPoint[] = [];
    const key = `${r},${c}`;
    const neighbors = ADJACENCY[key] || [];

    for (const [nr, nc] of neighbors) {
      if (currentBoard[nr][nc] === null) {
        moves.push({ row: nr, col: nc });
      }
    }
    return moves;
  }, []);

  // Check if all Tigers are trapped (Goats win)
  const areTigersTrapped = useCallback((currentBoard: BaghChalPiece[][]) => {
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (currentBoard[r][c] === 'tiger') {
          const moves = getTigerMoves(r, c, currentBoard);
          if (moves.length > 0) return false;
        }
      }
    }
    return true;
  }, [getTigerMoves]);

  // Handle click on a point
  const handlePointClick = (row: number, col: number) => {
    if (winner) return;

    // In vs Computer mode, ignore clicks during computer turn
    if (mode === 'vsComputer' && turn !== playerRole) {
      return;
    }

    const clickedPiece = board[row][col];

    // GOAT TURN
    if (turn === 'goat') {
      if (phase === 'placement') {
        // Placing a goat on an empty intersection
        if (clickedPiece === null) {
          const newBoard = board.map((r) => [...r]);
          newBoard[row][col] = 'goat';
          const newPlaced = goatsPlaced + 1;
          setBoard(newBoard);
          setGoatsPlaced(newPlaced);

          if (newPlaced >= 20) {
            setPhase('movement');
          }

          // Check if tigers trapped
          if (areTigersTrapped(newBoard)) {
            setWinner('goat');
            try {
              confetti({ particleCount: 100, spread: 60 });
            } catch {}
            return;
          }

          setTurn('tiger');
          setSelectedPoint(null);
          setValidMoves([]);
        }
      } else {
        // Movement phase for goats
        if (selectedPoint) {
          // Check if clicking a valid destination
          const isTargetValid = validMoves.some((m) => m.row === row && m.col === col);
          if (isTargetValid) {
            const newBoard = board.map((r) => [...r]);
            newBoard[selectedPoint.row][selectedPoint.col] = null;
            newBoard[row][col] = 'goat';
            setBoard(newBoard);
            setSelectedPoint(null);
            setValidMoves([]);

            // Check if tigers trapped
            if (areTigersTrapped(newBoard)) {
              setWinner('goat');
              try {
                confetti({ particleCount: 100, spread: 60 });
              } catch {}
              return;
            }

            setTurn('tiger');
            return;
          }
        }

        // Select own goat
        if (clickedPiece === 'goat') {
          setSelectedPoint({ row, col });
          setValidMoves(getGoatMoves(row, col, board));
        } else {
          setSelectedPoint(null);
          setValidMoves([]);
        }
      }
    } else {
      // TIGER TURN
      if (selectedPoint) {
        const isTargetValid = validMoves.some((m) => m.row === row && m.col === col);
        if (isTargetValid) {
          const newBoard = board.map((r) => [...r]);
          const fromR = selectedPoint.row;
          const fromC = selectedPoint.col;

          newBoard[fromR][fromC] = null;
          newBoard[row][col] = 'tiger';

          // Check if this was a jump capture over a goat
          let captured = false;
          if (Math.abs(row - fromR) === 2 || Math.abs(col - fromC) === 2) {
            const midR = (fromR + row) / 2;
            const midC = (fromC + col) / 2;
            if (newBoard[midR][midC] === 'goat') {
              newBoard[midR][midC] = null;
              captured = true;
            }
          }

          setBoard(newBoard);
          setSelectedPoint(null);
          setValidMoves([]);

          const nextCaptured = captured ? goatsCaptured + 1 : goatsCaptured;
          if (captured) {
            setGoatsCaptured(nextCaptured);
          }

          // Check if tigers win
          if (nextCaptured >= 5) {
            setWinner('tiger');
            try {
              confetti({ particleCount: 100, spread: 60 });
            } catch {}
            return;
          }

          // Check if remaining tigers trapped
          if (areTigersTrapped(newBoard)) {
            setWinner('goat');
            return;
          }

          setTurn('goat');
          return;
        }
      }

      // Select tiger
      if (clickedPiece === 'tiger') {
        setSelectedPoint({ row, col });
        setValidMoves(getTigerMoves(row, col, board));
      } else {
        setSelectedPoint(null);
        setValidMoves([]);
      }
    }
  };

  // AI Logic for Computer Turn
  useEffect(() => {
    if (mode !== 'vsComputer' || winner || turn === playerRole) return;

    const timer = setTimeout(() => {
      // COMPUTER IS TIGER
      if (turn === 'tiger') {
        const allTigerMoves: { from: BaghChalPoint; to: BaghChalPoint; isCapture: boolean }[] = [];

        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            if (board[r][c] === 'tiger') {
              const moves = getTigerMoves(r, c, board);
              for (const m of moves) {
                const isCapture = Math.abs(m.row - r) === 2 || Math.abs(m.col - c) === 2;
                allTigerMoves.push({ from: { row: r, col: c }, to: m, isCapture });
              }
            }
          }
        }

        if (allTigerMoves.length === 0) {
          setWinner('goat');
          return;
        }

        // Prioritize capturing goats!
        const captureMoves = allTigerMoves.filter((m) => m.isCapture);
        const chosenMove =
          captureMoves.length > 0
            ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
            : allTigerMoves[Math.floor(Math.random() * allTigerMoves.length)];

        const newBoard = board.map((r) => [...r]);
        newBoard[chosenMove.from.row][chosenMove.from.col] = null;
        newBoard[chosenMove.to.row][chosenMove.to.col] = 'tiger';

        let nextCaptured = goatsCaptured;
        if (chosenMove.isCapture) {
          const midR = (chosenMove.from.row + chosenMove.to.row) / 2;
          const midC = (chosenMove.from.col + chosenMove.to.col) / 2;
          newBoard[midR][midC] = null;
          nextCaptured += 1;
          setGoatsCaptured(nextCaptured);
        }

        setBoard(newBoard);

        if (nextCaptured >= 5) {
          setWinner('tiger');
          return;
        }

        if (areTigersTrapped(newBoard)) {
          setWinner('goat');
          return;
        }

        setTurn('goat');
      } else {
        // COMPUTER IS GOAT
        if (phase === 'placement') {
          // Find safe empty spots
          const emptyPoints: BaghChalPoint[] = [];
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
              if (board[r][c] === null) emptyPoints.push({ row: r, col: c });
            }
          }

          if (emptyPoints.length > 0) {
            const chosen = emptyPoints[Math.floor(Math.random() * emptyPoints.length)];
            const newBoard = board.map((r) => [...r]);
            newBoard[chosen.row][chosen.col] = 'goat';
            const newPlaced = goatsPlaced + 1;
            setBoard(newBoard);
            setGoatsPlaced(newPlaced);
            if (newPlaced >= 20) setPhase('movement');

            if (areTigersTrapped(newBoard)) {
              setWinner('goat');
              return;
            }

            setTurn('tiger');
          }
        } else {
          // Goat movement
          const allGoatMoves: { from: BaghChalPoint; to: BaghChalPoint }[] = [];
          for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
              if (board[r][c] === 'goat') {
                const moves = getGoatMoves(r, c, board);
                for (const m of moves) {
                  allGoatMoves.push({ from: { row: r, col: c }, to: m });
                }
              }
            }
          }

          if (allGoatMoves.length > 0) {
            const chosen = allGoatMoves[Math.floor(Math.random() * allGoatMoves.length)];
            const newBoard = board.map((r) => [...r]);
            newBoard[chosen.from.row][chosen.from.col] = null;
            newBoard[chosen.to.row][chosen.to.col] = 'goat';
            setBoard(newBoard);

            if (areTigersTrapped(newBoard)) {
              setWinner('goat');
              return;
            }

            setTurn('tiger');
          }
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [mode, winner, turn, playerRole, board, phase, goatsPlaced, goatsCaptured, getTigerMoves, getGoatMoves, areTigersTrapped]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col space-y-4">
      {/* Top Header & Mode Toggle */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-stone-900 dark:text-white flex items-center gap-2">
            <span>🐅 🐐</span>
            <span>{lang === 'ne' ? 'नेपाली परम्परागत बाघचाल (Bagh-Chal)' : 'Traditional Nepali Bagh-Chal'}</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'ne'
              ? '४ बाघ विरुद्ध २० बाख्राको रणनीतिक बुद्धिचाल खेल'
              : 'Ancient Nepali board game: 4 Tigers vs 20 Goats'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Game Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setMode('vsComputer');
                resetGame();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'vsComputer'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? 'रोबोट विरुद्ध' : 'vs AI'}</span>
            </button>
            <button
              onClick={() => {
                setMode('twoPlayer');
                resetGame();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === 'twoPlayer'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{lang === 'ne' ? '२ खेलाडी' : '2 Players'}</span>
            </button>
          </div>

          {/* Rules Toggle */}
          <button
            onClick={() => setShowRules(!showRules)}
            className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 rounded-xl cursor-pointer"
            title={lang === 'ne' ? 'बाघचालका नियमहरू' : 'Bagh-Chal Rules'}
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={resetGame}
            className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300 rounded-xl cursor-pointer"
            title={lang === 'ne' ? 'नयाँ खेल' : 'Reset Game'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules Collapsible */}
      {showRules && (
        <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-3xl border border-amber-200 dark:border-amber-900 text-xs text-stone-700 dark:text-stone-300 space-y-2">
          <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-600" />
            <span>{lang === 'ne' ? 'बाघचाल खेलका नियमहरू:' : 'How to Play Bagh-Chal:'}</span>
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {lang === 'ne'
                ? 'बाख्राको पालो पहिला हुन्छ। सुरुमा २० वटा बाख्राहरू खाली ठाउँमा पालैपालो राखिन्छ।'
                : 'Goats move first. Initially, 20 goats are placed one by one on vacant intersections.'}
            </li>
            <li>
              {lang === 'ne'
                ? 'बाघले खाली ठाउँमा हिँड्न सक्छ वा बाख्रालाई नाघेर (Jump गरेर) खान सक्छ।'
                : 'Tigers can move to adjacent empty vertices or capture goats by jumping over them.'}
            </li>
            <li>
              {lang === 'ne'
                ? 'बाघले ५ वटा बाख्रा खाएमा बाघको जित हुन्छ।'
                : 'Tigers win if they capture 5 goats.'}
            </li>
            <li>
              {lang === 'ne'
                ? 'चारै वटा बाघलाई चारैतिरबाट घेरेर चल्न नसक्ने बनाएमा बाख्राको जित हुन्छ।'
                : 'Goats win if they trap and immobilize all 4 tigers so they cannot move.'}
            </li>
          </ul>
        </div>
      )}

      {/* Score & Turn Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center text-xl shadow-xs">
            🐅
          </div>
          <div>
            <div className="text-[11px] text-stone-400 font-bold uppercase">
              {lang === 'ne' ? 'बाघ (Tigers)' : 'Tigers'}
            </div>
            <div className="text-xs font-extrabold text-stone-900 dark:text-white">
              {lang === 'ne' ? '४ बाघ खेलमा' : '4 in play'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center text-xl shadow-xs">
            🐐
          </div>
          <div>
            <div className="text-[11px] text-stone-400 font-bold uppercase">
              {lang === 'ne' ? 'बाख्रा राखिएको' : 'Goats Placed'}
            </div>
            <div className="text-xs font-extrabold text-stone-900 dark:text-white">
              {lang === 'ne' ? `${toNepaliDigits(goatsPlaced)}/२०` : `${goatsPlaced}/20`}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center text-xl shadow-xs">
            🥩
          </div>
          <div>
            <div className="text-[11px] text-stone-400 font-bold uppercase">
              {lang === 'ne' ? 'बाघले खाएको' : 'Goats Captured'}
            </div>
            <div className="text-xs font-extrabold text-red-600">
              {lang === 'ne' ? `${toNepaliDigits(goatsCaptured)}/५` : `${goatsCaptured}/5`}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
            ⚡
          </div>
          <div>
            <div className="text-[11px] text-stone-400 font-bold uppercase">
              {lang === 'ne' ? 'हालको पालो' : 'Current Turn'}
            </div>
            <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span>{turn === 'goat' ? '🐐 ' : '🐅 '}</span>
              <span>
                {turn === 'goat'
                  ? lang === 'ne'
                    ? phase === 'placement'
                      ? 'बाख्रा राख्ने'
                      : 'बाख्रा हिँड्ने'
                    : phase === 'placement'
                    ? 'Place Goat'
                    : 'Move Goat'
                  : lang === 'ne'
                  ? 'बाघको पालो'
                  : "Tiger's Turn"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col items-center justify-center relative">
        {/* Win Banner */}
        {winner && (
          <div className="absolute inset-4 z-20 backdrop-blur-md bg-stone-950/85 rounded-3xl flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg mb-3 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-amber-300 mb-1">
              {winner === 'goat'
                ? lang === 'ne'
                  ? '🎉 बाख्राले बाघलाई घेरेर जित्यो!'
                  : '🎉 Goats Trapped the Tigers and Won!'
                : lang === 'ne'
                ? '🐅 बाघले ५ बाख्रा खाएर जित्यो!'
                : '🐅 Tigers Captured 5 Goats and Won!'}
            </h3>
            <button
              onClick={resetGame}
              className="mt-4 px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-stone-900" />
              <span>{lang === 'ne' ? 'पुन: नयाँ खेल सुरु गर्नुहोस्' : 'Play Again'}</span>
            </button>
          </div>
        )}

        {/* 5x5 SVG Line Grid Board */}
        <div
          className="relative select-none"
          style={{
            width: 'min(85vw, 420px)',
            height: 'min(85vw, 420px)',
          }}
        >
          {/* Authentic Bagh-Chal Canvas SVG Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-800 dark:stroke-amber-600/70" strokeWidth="3">
            {/* Outer Box */}
            <rect x="5%" y="5%" width="90%" height="90%" fill="none" strokeWidth="4" />

            {/* Horizontal Grid Lines */}
            <line x1="5%" y1="27.5%" x2="95%" y2="27.5%" />
            <line x1="5%" y1="50%" x2="95%" y2="50%" />
            <line x1="5%" y1="72.5%" x2="95%" y2="72.5%" />

            {/* Vertical Grid Lines */}
            <line x1="27.5%" y1="5%" x2="27.5%" y2="95%" />
            <line x1="50%" y1="5%" x2="50%" y2="95%" />
            <line x1="72.5%" y1="5%" x2="72.5%" y2="95%" />

            {/* Large Diagonal Lines from corners */}
            <line x1="5%" y1="5%" x2="95%" y2="95%" />
            <line x1="95%" y1="5%" x2="5%" y2="95%" />

            {/* Diamond Rhombus connecting midpoints */}
            <polygon points="50%,5% 95%,50% 50%,95% 5%,50%" fill="none" strokeWidth="3" />

            {/* Corner Triangular Diagonal Lines */}
            <line x1="27.5%" y1="5%" x2="5%" y2="27.5%" />
            <line x1="72.5%" y1="5%" x2="95%" y2="27.5%" />
            <line x1="5%" y1="72.5%" x2="27.5%" y2="95%" />
            <line x1="95%" y1="72.5%" x2="72.5%" y2="95%" />
          </svg>

          {/* 5x5 Intersection Points & Pieces */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
            {board.map((row, rIdx) =>
              row.map((piece, cIdx) => {
                const isSelected = selectedPoint?.row === rIdx && selectedPoint?.col === cIdx;
                const isValidMove = validMoves.some((m) => m.row === rIdx && m.col === cIdx);

                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    onClick={() => handlePointClick(rIdx, cIdx)}
                    className="relative flex items-center justify-center cursor-pointer group"
                  >
                    {/* Intersection Point Circle */}
                    <div
                      className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isValidMove
                          ? 'w-6 h-6 bg-emerald-500 border-white shadow-lg animate-pulse ring-4 ring-emerald-300'
                          : 'bg-stone-300 dark:bg-stone-700 border-stone-500 dark:border-stone-500 group-hover:scale-125'
                      }`}
                    />

                    {/* Pieces (Tiger or Goat) */}
                    {piece === 'tiger' && (
                      <div
                        className={`absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-2xl sm:text-3xl shadow-lg transition-transform cursor-pointer select-none ${
                          isSelected
                            ? 'bg-amber-400 ring-4 ring-orange-500 scale-110 shadow-xl'
                            : 'bg-orange-500 hover:scale-105 active:scale-95'
                        }`}
                      >
                        🐅
                      </div>
                    )}

                    {piece === 'goat' && (
                      <div
                        className={`absolute w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xl sm:text-2xl shadow-md transition-transform cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-300 ring-4 ring-blue-600 scale-110'
                            : 'bg-white border-2 border-blue-600 hover:scale-105 active:scale-95'
                        }`}
                      >
                        🐐
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
