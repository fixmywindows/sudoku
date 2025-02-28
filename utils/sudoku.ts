import { GridSize, SudokuCell } from "@/types/game";

// Generate a valid Sudoku solution
export function generateSudokuSolution(size: GridSize): number[][] {
  const grid: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
  
  // For 3x3, we can use a simple approach
  if (size === 3) {
    const possibleValues = [1, 2, 3];
    
    // Fill first row with random values
    const firstRow = [...possibleValues].sort(() => Math.random() - 0.5);
    grid[0] = firstRow;
    
    // Fill second row with shifted values
    grid[1] = [firstRow[1], firstRow[2], firstRow[0]];
    
    // Fill third row with shifted values
    grid[2] = [firstRow[2], firstRow[0], firstRow[1]];
    
    return grid;
  }
  
  // For larger grids, use backtracking
  if (solveSudoku(grid, size)) {
    return grid;
  }
  
  // Fallback if solving fails
  return generateSimpleSolution(size);
}

// Solve Sudoku using backtracking
function solveSudoku(grid: number[][], size: GridSize): boolean {
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === 0) {
        // Try placing each number
        const values = getShuffledValues(size);
        for (const num of values) {
          if (isValidPlacement(grid, row, col, num, size)) {
            grid[row][col] = num;
            
            if (solveSudoku(grid, size)) {
              return true;
            }
            
            grid[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found
      }
    }
  }
  return true; // All cells filled
}

// Check if placing a number is valid
function isValidPlacement(
  grid: number[][],
  row: number,
  col: number,
  num: number,
  size: GridSize
): boolean {
  // Check row
  for (let x = 0; x < size; x++) {
    if (grid[row][x] === num) return false;
  }
  
  // Check column
  for (let y = 0; y < size; y++) {
    if (grid[y][col] === num) return false;
  }
  
  // Check box
  let boxSize: [number, number];
  
  if (size === 4) boxSize = [2, 2];
  else if (size === 6) boxSize = [2, 3];
  else if (size === 9) boxSize = [3, 3];
  else boxSize = [1, size]; // No box constraints for other sizes
  
  const boxRowStart = Math.floor(row / boxSize[0]) * boxSize[0];
  const boxColStart = Math.floor(col / boxSize[1]) * boxSize[1];
  
  for (let r = 0; r < boxSize[0]; r++) {
    for (let c = 0; c < boxSize[1]; c++) {
      const checkRow = boxRowStart + r;
      const checkCol = boxColStart + c;
      if (checkRow < size && checkCol < size && grid[checkRow][checkCol] === num) {
        return false;
      }
    }
  }
  
  return true;
}

// Get shuffled array of possible values
function getShuffledValues(size: GridSize): number[] {
  const values = Array.from({ length: size }, (_, i) => i + 1);
  return values.sort(() => Math.random() - 0.5);
}

// Generate a simple solution for fallback
function generateSimpleSolution(size: GridSize): number[][] {
  const grid: number[][] = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
  
  // Fill with a pattern that ensures uniqueness in rows and columns
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      grid[i][j] = ((i * 1 + j * 1) % size) + 1;
    }
  }
  
  // Shuffle rows and columns to make it less predictable
  for (let i = 0; i < size; i++) {
    const swapWith = Math.floor(Math.random() * size);
    // Swap rows
    [grid[i], grid[swapWith]] = [grid[swapWith], grid[i]];
  }
  
  return grid;
}

// Create a puzzle by removing cells from the solution
export function createPuzzle(
  solution: number[][],
  difficulty: number = 0.4,
  size: GridSize
): SudokuCell[][] {
  const puzzle: SudokuCell[][] = solution.map(row =>
    row.map(value => ({ value, fixed: true }))
  );
  
  // Calculate how many cells to remove based on size and difficulty
  const totalCells = size * size;
  const cellsToRemove = Math.floor(totalCells * difficulty);
  
  // Create a list of all cell positions
  const positions: [number, number][] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle positions
  positions.sort(() => Math.random() - 0.5);
  
  // Remove cells
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = { value: null, fixed: false };
  }
  
  return puzzle;
}

// Check if the current grid matches the solution
export function checkSolution(
  grid: SudokuCell[][],
  solution: number[][]
): { isCorrect: boolean; incorrectCount: number } {
  let incorrectCount = 0;
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (cell.value !== null && cell.value !== solution[row][col]) {
        incorrectCount++;
      }
    }
  }
  
  return {
    isCorrect: incorrectCount === 0,
    incorrectCount,
  };
}

// Find incorrect cells in the current grid
export function findIncorrectCells(
  grid: SudokuCell[][],
  solution: number[][]
): { row: number; col: number }[] {
  const incorrectCells: { row: number; col: number }[] = [];
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = grid[row][col];
      if (!cell.fixed && cell.value !== null && cell.value !== solution[row][col]) {
        incorrectCells.push({ row, col });
      }
    }
  }
  
  return incorrectCells;
}

// Check if the puzzle is complete (all cells filled)
export function isPuzzleComplete(grid: SudokuCell[][]): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].value === null) {
        return false;
      }
    }
  }
  return true;
}

// Format time in MM:SS format
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}