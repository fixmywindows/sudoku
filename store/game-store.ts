import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GridSize, SudokuCell, SudokuVariant } from '@/types/game';
import { GRID_SIZES, REWARD_POINTS, THEMES, UNLOCK_POINTS, EMOJI_BONUS, TIP_COST } from '@/constants/game';
import { createPuzzle, generateSudokuSolution } from '@/utils/sudoku';

interface GameStore {
  // Game state
  currentGame: GameState | null;
  points: number;
  unlockedGridSizes: Record<SudokuVariant, GridSize[]>;
  personalBests: Record<SudokuVariant, Record<GridSize, number>>;
  currentTheme: string;
  unlockedThemes: string[];
  noAds: boolean;
  
  // Actions
  startGame: (variant: SudokuVariant, size: GridSize) => void;
  selectCell: (row: number, col: number) => void;
  setCellValue: (value: number) => void;
  clearCellValue: () => void;
  checkSolution: () => { isCorrect: boolean; incorrectCount: number };
  restartGame: () => void;
  completeGame: () => { pointsEarned: number; isPersonalBest: boolean; time: number } | null;
  updateTimer: () => void;
  useTip: () => { success: boolean; incorrectCells?: { row: number; col: number }[] };
  addPoints: (amount: number) => void;
  unlockGridSize: (variant: SudokuVariant, size: GridSize) => boolean;
  unlockTheme: (themeId: string) => boolean;
  purchaseNoAds: () => void;
  setTheme: (themeId: string) => void;
  resetGame: () => void;
}

const initialUnlockedGridSizes: Record<SudokuVariant, GridSize[]> = {
  numerical: [3],
  color: [3],
  emoji: [3],
  flag: [3],
};

const initialPersonalBests: Record<SudokuVariant, Record<GridSize, number>> = {
  numerical: Object.fromEntries(GRID_SIZES.map(size => [size, 0])) as Record<GridSize, number>,
  color: Object.fromEntries(GRID_SIZES.map(size => [size, 0])) as Record<GridSize, number>,
  emoji: Object.fromEntries(GRID_SIZES.map(size => [size, 0])) as Record<GridSize, number>,
  flag: Object.fromEntries(GRID_SIZES.map(size => [size, 0])) as Record<GridSize, number>,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      currentGame: null,
      points: 0,
      unlockedGridSizes: initialUnlockedGridSizes,
      personalBests: initialPersonalBests,
      currentTheme: 'default',
      unlockedThemes: ['default'],
      noAds: false,
      
      startGame: (variant, size) => {
        const solution = generateSudokuSolution(size);
        const difficulty = 0.4 + (size - 3) * 0.05; // Increase difficulty with size
        const grid = createPuzzle(solution, difficulty, size);
        
        set({
          currentGame: {
            variant,
            gridSize: size,
            grid,
            solution,
            selectedCell: null,
            timer: 0,
            isComplete: false,
            isPlaying: true,
          },
        });
      },
      
      selectCell: (row, col) => {
        const { currentGame } = get();
        if (!currentGame || !currentGame.isPlaying) return;
        
        set({
          currentGame: {
            ...currentGame,
            selectedCell: { row, col },
          },
        });
      },
      
      setCellValue: (value) => {
        const { currentGame } = get();
        if (
          !currentGame ||
          !currentGame.selectedCell ||
          !currentGame.isPlaying
        )
          return;
        
        const { row, col } = currentGame.selectedCell;
        const cell = currentGame.grid[row][col];
        
        if (cell.fixed) return;
        
        const newGrid = [...currentGame.grid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = {
          ...cell,
          value: cell.value === value ? null : value,
          isError: false,
        };
        
        set({
          currentGame: {
            ...currentGame,
            grid: newGrid,
          },
        });
      },
      
      clearCellValue: () => {
        const { currentGame } = get();
        if (
          !currentGame ||
          !currentGame.selectedCell ||
          !currentGame.isPlaying
        )
          return;
        
        const { row, col } = currentGame.selectedCell;
        const cell = currentGame.grid[row][col];
        
        if (cell.fixed) return;
        
        const newGrid = [...currentGame.grid];
        newGrid[row] = [...newGrid[row]];
        newGrid[row][col] = {
          ...cell,
          value: null,
          isError: false,
        };
        
        set({
          currentGame: {
            ...currentGame,
            grid: newGrid,
          },
        });
      },
      
      checkSolution: () => {
        const { currentGame } = get();
        if (!currentGame) return { isCorrect: false, incorrectCount: 0 };
        
        let incorrectCount = 0;
        
        for (let row = 0; row < currentGame.grid.length; row++) {
          for (let col = 0; col < currentGame.grid[row].length; col++) {
            const cell = currentGame.grid[row][col];
            if (cell.value !== null && cell.value !== currentGame.solution[row][col]) {
              incorrectCount++;
            }
          }
        }
        
        return {
          isCorrect: incorrectCount === 0,
          incorrectCount,
        };
      },
      
      restartGame: () => {
        const { currentGame } = get();
        if (!currentGame) return;
        
        const { variant, gridSize } = currentGame;
        get().startGame(variant, gridSize);
      },
      
      completeGame: () => {
        const { currentGame, personalBests } = get();
        if (!currentGame) return null;
        
        const { variant, gridSize, timer } = currentGame;
        let pointsEarned = REWARD_POINTS[gridSize];
        
        // Add bonus for emoji variant
        if (variant === 'emoji') {
          pointsEarned += EMOJI_BONUS;
        }
        
        // Check if it's a personal best
        const currentBest = personalBests[variant][gridSize];
        const isPersonalBest = currentBest === 0 || timer < currentBest;
        
        // Update personal best if needed
        if (isPersonalBest) {
          const newPersonalBests = { ...personalBests };
          newPersonalBests[variant][gridSize] = timer;
          set({ personalBests: newPersonalBests });
        }
        
        // Add points
        get().addPoints(pointsEarned);
        
        // Update game state
        set({
          currentGame: {
            ...currentGame,
            isComplete: true,
            isPlaying: false,
          },
        });
        
        return {
          pointsEarned,
          isPersonalBest,
          time: timer,
        };
      },
      
      updateTimer: () => {
        const { currentGame } = get();
        if (!currentGame || !currentGame.isPlaying || currentGame.isComplete) return;
        
        set({
          currentGame: {
            ...currentGame,
            timer: currentGame.timer + 1,
          },
        });
      },
      
      useTip: () => {
        const { currentGame, points } = get();
        if (!currentGame) return { success: false };
        
        // Check if user has enough points
        if (points < TIP_COST) {
          return { success: false };
        }
        
        // Find incorrect cells
        const incorrectCells: { row: number; col: number }[] = [];
        
        for (let row = 0; row < currentGame.grid.length; row++) {
          for (let col = 0; col < currentGame.grid[row].length; col++) {
            const cell = currentGame.grid[row][col];
            if (!cell.fixed && cell.value !== null && cell.value !== currentGame.solution[row][col]) {
              incorrectCells.push({ row, col });
            }
          }
        }
        
        // Mark incorrect cells
        if (incorrectCells.length > 0) {
          const newGrid = [...currentGame.grid];
          
          for (const { row, col } of incorrectCells) {
            newGrid[row] = [...newGrid[row]];
            newGrid[row][col] = {
              ...newGrid[row][col],
              isError: true,
            };
          }
          
          set({
            currentGame: {
              ...currentGame,
              grid: newGrid,
            },
            points: points - TIP_COST
          });
          
          return { success: true, incorrectCells };
        }
        
        // If no incorrect cells, still charge for the tip
        set({ points: points - TIP_COST });
        
        return { success: true, incorrectCells: [] };
      },
      
      addPoints: (amount) => {
        set({ points: get().points + amount });
      },
      
      unlockGridSize: (variant, size) => {
        const { points, unlockedGridSizes } = get();
        const cost = UNLOCK_POINTS[size];
        
        // Check if already unlocked
        if (unlockedGridSizes[variant].includes(size)) {
          return true;
        }
        
        // Check if user has enough points
        if (points >= cost) {
          const newUnlockedGridSizes = { ...unlockedGridSizes };
          newUnlockedGridSizes[variant] = [...newUnlockedGridSizes[variant], size];
          
          set({
            unlockedGridSizes: newUnlockedGridSizes,
            points: points - cost,
          });
          
          return true;
        }
        
        return false;
      },
      
      unlockTheme: (themeId) => {
        const { points, unlockedThemes } = get();
        const theme = THEMES.find(t => t.id === themeId);
        
        if (!theme) return false;
        
        // Check if already unlocked
        if (unlockedThemes.includes(themeId)) {
          return true;
        }
        
        // Check if user has enough points
        if (points >= theme.price) {
          set({
            unlockedThemes: [...unlockedThemes, themeId],
            points: points - theme.price,
          });
          
          return true;
        }
        
        return false;
      },
      
      purchaseNoAds: () => {
        set({ noAds: true });
      },
      
      setTheme: (themeId) => {
        const { unlockedThemes } = get();
        
        if (unlockedThemes.includes(themeId)) {
          set({ currentTheme: themeId });
        }
      },
      
      resetGame: () => {
        set({
          currentGame: null,
          points: 0,
          unlockedGridSizes: initialUnlockedGridSizes,
          personalBests: initialPersonalBests,
          currentTheme: 'default',
          unlockedThemes: ['default'],
          noAds: false,
        });
      },
    }),
    {
      name: 'sudoku-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        points: state.points,
        unlockedGridSizes: state.unlockedGridSizes,
        personalBests: state.personalBests,
        currentTheme: state.currentTheme,
        unlockedThemes: state.unlockedThemes,
        noAds: state.noAds,
      }),
    }
  )
);