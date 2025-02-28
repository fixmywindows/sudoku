export type SudokuVariant = 'numerical' | 'color' | 'emoji' | 'flag';
export type GridSize = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SudokuCell {
  value: number | null;
  fixed: boolean;
  isError?: boolean;
  notes?: number[];
}

export interface GameState {
  variant: SudokuVariant;
  gridSize: GridSize;
  grid: SudokuCell[][];
  solution: number[][];
  selectedCell: { row: number; col: number } | null;
  timer: number;
  isComplete: boolean;
  isPlaying: boolean;
}

export interface CategoryCard {
  id: SudokuVariant;
  title: string;
  icon: string;
  description: string;
  unlockPoints: Record<GridSize, number>;
}

export interface ThemeOption {
  id: string;
  name: string;
  price: number;
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
  inputCellColor: string;
  pattern?: string;
}

export interface PointsPackage {
  id: string;
  points: number;
  price: string;
  priceValue: number;
}