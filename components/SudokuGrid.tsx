import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GridSize, SudokuCell, SudokuVariant } from '@/types/game';
import { COLORS, EMOJIS, FLAGS } from '@/constants/game';
import { useTheme } from '@/hooks/useTheme';

interface SudokuGridProps {
  grid: SudokuCell[][];
  variant: SudokuVariant;
  size: GridSize;
  selectedCell: { row: number; col: number } | null;
  onCellPress: (row: number, col: number) => void;
}

export default function SudokuGrid({
  grid,
  variant,
  size,
  selectedCell,
  onCellPress,
}: SudokuGridProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const gridSize = Math.min(screenWidth - 32, 360);
  const cellSize = gridSize / size;
  
  // Determine box dimensions based on grid size
  const getBoxDimensions = () => {
    if (size === 4) return [2, 2];
    if (size === 6) return [2, 3];
    if (size === 9) return [3, 3];
    return [1, 1]; // No inner boxes for other sizes
  };
  
  const [boxRows, boxCols] = getBoxDimensions();
  
  const renderCellContent = (cell: SudokuCell, row: number, col: number) => {
    if (cell.value === null) return null;
    
    switch (variant) {
      case 'numerical':
        return (
          <Text
            style={[
              styles.cellText,
              {
                fontSize: cellSize * 0.5,
                color: cell.fixed ? '#000000' : theme.primaryColor,
              },
            ]}
          >
            {cell.value}
          </Text>
        );
      case 'color':
        return (
          <View
            style={[
              styles.colorCell,
              {
                backgroundColor: COLORS[cell.value - 1],
                width: cellSize * 0.7,
                height: cellSize * 0.7,
              },
            ]}
          />
        );
      case 'emoji':
        return (
          <Text
            style={[
              styles.emojiText,
              {
                fontSize: cellSize * 0.5,
              },
            ]}
          >
            {EMOJIS[cell.value - 1]}
          </Text>
        );
      case 'flag':
        return (
          <Text
            style={[
              styles.emojiText,
              {
                fontSize: cellSize * 0.5,
              },
            ]}
          >
            {FLAGS[cell.value - 1]}
          </Text>
        );
      default:
        return null;
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          width: gridSize,
          height: gridSize,
          borderColor: theme.primaryColor,
        },
      ]}
    >
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => {
            const isSelected =
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
            const isInSameBox =
              selectedCell &&
              Math.floor(rowIndex / boxRows) === Math.floor(selectedCell.row / boxRows) &&
              Math.floor(colIndex / boxCols) === Math.floor(selectedCell.col / boxCols);
            const isInSameRow = selectedCell?.row === rowIndex;
            const isInSameCol = selectedCell?.col === colIndex;
            
            // Determine cell background color - using enhanced highlighting with more vibrant colors
            let backgroundColor = theme.backgroundColor;
            if (isSelected) {
              backgroundColor = 'rgba(96, 165, 250, 0.8)'; // More vibrant blue for selected cell
            } else if (isInSameBox && (boxRows > 1 || boxCols > 1)) {
              backgroundColor = 'rgba(96, 165, 250, 0.5)'; // More noticeable blue for same box
            } else if (isInSameRow || isInSameCol) {
              backgroundColor = 'rgba(96, 165, 250, 0.4)'; // More visible blue for same row/column
            }
            
            // For non-fixed cells
            if (!cell.fixed && !isSelected) {
              backgroundColor = theme.inputCellColor;
            }
            
            // For cells with errors
            if (cell.isError) {
              backgroundColor = '#FECACA';
            }