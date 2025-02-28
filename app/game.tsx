import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useGameStore } from '@/store/game-store';
import { GridSize, SudokuVariant } from '@/types/game';
import { checkSolution, isPuzzleComplete } from '@/utils/sudoku';
import SudokuGrid from '@/components/SudokuGrid';
import InputKeypad from '@/components/InputKeypad';
import GameHeader from '@/components/GameHeader';
import SuccessModal from '@/components/SuccessModal';
import CustomAlert from '@/components/CustomAlert';
import { useTimer } from '@/hooks/useTimer';
import { useTheme } from '@/hooks/useTheme';

export default function GameScreen() {
  const params = useLocalSearchParams<{ variant: string; size: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  
  const variant = (params.variant || 'numerical') as SudokuVariant;
  const size = parseInt(params.size || '3', 10) as GridSize;
  
  const {
    currentGame,
    startGame,
    selectCell,
    setCellValue,
    clearCellValue,
    checkSolution: checkGameSolution,
    restartGame,
    completeGame,
    useTip,
    points,
  } = useGameStore();
  
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [completionData, setCompletionData] = useState<{
    pointsEarned: number;
    isPersonalBest: boolean;
    time: number;
  } | null>(null);
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(false);
  
  // Start a new game when the screen loads
  useEffect(() => {
    startGame(variant, size);
  }, [variant, size]);
  
  // Use the timer hook
  useTimer(currentGame?.isPlaying || false);
  
  // Automatically check for completion whenever the grid changes
  useEffect(() => {
    if (currentGame && currentGame.isPlaying && !isCheckingCompletion) {
      checkCompletion();
    }
  }, [currentGame?.grid]);
  
  // Handle cell selection
  const handleCellPress = (row: number, col: number) => {
    selectCell(row, col);
  };
  
  // Check if the puzzle is complete and handle the result
  const checkCompletion = () => {
    if (!currentGame || isCheckingCompletion || !currentGame.isPlaying) return;
    
    // Check if all cells are filled
    if (isPuzzleComplete(currentGame.grid)) {
      setIsCheckingCompletion(true);
      
      // Check if the solution is correct
      const { isCorrect, incorrectCount } = checkGameSolution();
      
      if (isCorrect) {
        // Puzzle completed successfully
        const result = completeGame();
        if (result) {
          setCompletionData(result);
          // Show success modal with a slight delay for better UX
          setTimeout(() => {
            setSuccessModalVisible(true);
            setIsCheckingCompletion(false);
          }, 300);
        } else {
          setIsCheckingCompletion(false);
        }
      } else {
        // Puzzle has errors
        const itemName = 
          variant === 'numerical' ? 'numbers' : 
          variant === 'color' ? 'colours' : 
          variant === 'emoji' ? 'emojis' : 'flags';
        
        setAlertMessage(
          `There ${incorrectCount === 1 ? 'is' : 'are'} ${incorrectCount} incorrect ${itemName}. Please check your answers and fix the mistakes. You can use the Tip feature to highlight errors.`
        );
        setAlertVisible(true);
        setIsCheckingCompletion(false);
      }
    }
  };
  
  // Handle value input
  const handleValueSelect = (value: number) => {
    setCellValue(value);
    // Note: We don't need to manually check completion here anymore
    // as the useEffect will handle it when the grid changes
  };
  
  // Handle clear cell
  const handleClearCell = () => {
    clearCellValue();
  };
  
  // Handle restart
  const handleRestart = () => {
    restartGame();
  };
  
  // Handle tip
  const handleTip = () => {
    const result = useTip();
    
    if (!result.success) {
      setAlertMessage('You need 30 points to use a tip.');
      setAlertVisible(true);
      return;
    }
    
    if (result.incorrectCells && result.incorrectCells.length === 0) {
      setAlertMessage('Everything is correct so far!');
      setAlertVisible(true);
    } else if (result.incorrectCells) {
      const itemName = 
        variant === 'numerical' ? 'numbers' : 
        variant === 'color' ? 'colours' : 
        variant === 'emoji' ? 'emojis' : 'flags';
      
      setAlertMessage(
        `${result.incorrectCells.length} ${itemName} ${result.incorrectCells.length === 1 ? 'is' : 'are'} in the wrong place.`
      );
      setAlertVisible(true);
    }
  };
  
  // Handle play again
  const handlePlayAgain = () => {
    setSuccessModalVisible(false);
    restartGame();
  };
  
  // Handle back to menu
  const handleBackToMenu = () => {
    setSuccessModalVisible(false);
    router.back();
  };
  
  // Close alert handler
  const handleCloseAlert = () => {
    setAlertVisible(false);
  };
  
  if (!currentGame) {
    return null;
  }
  
  return (
    <>
      {/* Hide the header */}
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <StatusBar style={theme.id === 'default' ? 'dark' : 'light'} />
        
        <GameHeader
          timer={currentGame.timer}
          points={points}
          onRestart={handleRestart}
          onTip={handleTip}
        />
        
        <View style={styles.gameContainer}>
          <SudokuGrid
            grid={currentGame.grid}
            variant={variant}
            size={size}
            selectedCell={currentGame.selectedCell}
            onCellPress={handleCellPress}
          />
          
          <InputKeypad
            variant={variant}
            size={size}
            onValueSelect={handleValueSelect}
            onClearCell={handleClearCell}
          />
        </View>
        
        {completionData && (
          <SuccessModal
            visible={successModalVisible}
            time={completionData.time}
            pointsEarned={completionData.pointsEarned}
            isPersonalBest={completionData.isPersonalBest}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
          />
        )}
        
        <CustomAlert
          visible={alertVisible}
          title={alertMessage.includes('incorrect') ? 'Check Your Answers' : 'Tip'}
          message={alertMessage}
          type={alertMessage.includes('incorrect') ? 'warning' : 'info'}
          onClose={handleCloseAlert}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    paddingTop: 10, // Add padding to prevent overlap with header
  },
});