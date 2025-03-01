import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SudokuType = "numerical" | "colour" | "emoji" | "flags";
type GridSize = 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Cell = number | string;
type Grid = Cell[][];

interface GameState {
  type: SudokuType;
  size: GridSize;
  grid: Grid;
  initialGrid: Grid;
  solvedGrid: Grid;
  points: number;
  unlockedLevels: Record<SudokuType, GridSize[]>;
  gameWon: boolean;
  mistakes: number;
  gameTime: number; // Seconds
  personalBest: Record<GridSize, number>;
  lastLogin: string | null;
  streakDay: number;
  setTypeAndSize: (type: SudokuType, size: GridSize) => void;
  setNumber: (row: number, col: number, value: Cell) => void;
  checkGame: () => void;
  resetGame: () => void;
  addPoints: (amount: number) => void;
  unlockLevel: (type: SudokuType, size: GridSize) => boolean;
  useHint: () => void;
  updateTime: () => void;
  claimDailyReward: () => void;
}

const unlockCosts: Record<GridSize, number> = { 3: 0, 4: 10, 5: 20, 6: 30, 7: 40, 8: 50, 9: 60 };
const pointRewards: Record<GridSize, number> = { 3: 10, 4: 15, 5: 20, 6: 25, 7: 30, 8: 35, 9: 40 };

function generateSudoku(type: SudokuType, size: GridSize) {
  // Placeholder—assuming Rork updated this
  const grid = Array(size).fill(null).map(() => Array(size).fill(type === "numerical" ? 0 : ""));
  const solved = Array(size).fill(null).map(() => Array(size).fill(type === "numerical" ? 1 : "placeholder"));
  return { grid, solved }; // Replace with actual generation logic
}

export const useGameStore = create<GameState>((set, get) => {
  const { grid, solved } = generateSudoku("numerical", 3);
  return {
    type: "numerical",
    size: 3,
    grid,
    initialGrid: grid.map(row => [...row]),
    solvedGrid: solved,
    points: 0,
    unlockedLevels: { numerical: [3], colour: [3], emoji: [3], flags: [3] },
    gameWon: false,
    mistakes: 0,
    gameTime: 0,
    personalBest: { 3: Infinity, 4: Infinity, 5: Infinity, 6: Infinity, 7: Infinity, 8: Infinity, 9: Infinity },
    lastLogin: null,
    streakDay: 0,
    setTypeAndSize: (type, size) => {
      const { grid, solved } = generateSudoku(type, size);
      set({ type, size, grid, initialGrid: grid.map(row => [...row]), solvedGrid: solved, gameWon: false, gameTime: 0, mistakes: 0 });
    },
    setNumber: (row, col, value) => set((state) => {
      const newGrid = state.grid.map(r => [...r]);
      if (state.initialGrid[row][col] === (state.type === "numerical" ? 0 : "")) {
        newGrid[row][col] = value;
        if (value !== state.solvedGrid[row][col]) {
          return { grid: newGrid, mistakes: state.mistakes + 1 };
        }
      }
      return { grid: newGrid };
    }),
    checkGame: () => set((state) => {
      const isWon = state.grid.every((row, i) => row.every((cell, j) => cell === state.solvedGrid[i][j]));
      if (isWon) {
        const reward = pointRewards[state.size] + (state.gameTime < state.personalBest[state.size] ? 10 : 0);
        set(state => ({
          points: state.points + reward,
          personalBest: { ...state.personalBest, [state.size]: Math.min(state.gameTime, state.personalBest[state.size]) },
        }));
      }
      return { gameWon: isWon };
    }),
    resetGame: () => set(state => {
      const { grid, solved } = generateSudoku(state.type, state.size);
      return { grid, initialGrid: grid.map(row => [...row]), solvedGrid: solved, gameWon: false, gameTime: 0, mistakes: 0 };
    }),
    addPoints: (amount) => set(state => ({ points: state.points + amount })),
    unlockLevel: (type, size) => {
      const cost = unlockCosts[size];
      const state = get();
      if (state.points >= cost && !state.unlockedLevels[type].includes(size)) {
        set({
          unlockedLevels: { ...state.unlockedLevels, [type]: [...state.unlockedLevels[type], size] },
          points: state.points - cost,
        });
        return true;
      }
      return false;
    },
    useHint: () => set(state => {
      if (state.points >= 30) {
        // Placeholder hint logic—e.g., reveal a cell
        return { points: state.points - 30 };
      }
      return state;
    }),
    updateTime: () => set(state => ({ gameTime: state.gameTime + 1 })),
    claimDailyReward: () => {
      const today = new Date().toISOString().split("T")[0];
      const state = get();
      if (state.lastLogin !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        const missed = state.lastLogin && state.lastLogin !== yesterday;
        const newStreak = missed ? 1 : Math.min(state.streakDay + 1, 7);
        const points = newStreak === 7 ? 80 : newStreak * 10;
        set({
          lastLogin: today,
          streakDay: newStreak,
          points: state.points + points,
        });
        alert(missed ? "Oh no! Your streak reset—back to Day 1!" : `Day ${newStreak} Reward: +${points} points!`);
      }
    },
  };
});