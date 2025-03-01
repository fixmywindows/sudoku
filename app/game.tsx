import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
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
import { useAdStore } from '@/store/ad-store';
import TipModal from '@/components/TipModal';

export default function GameScreen() {
  const params = useLocalSearchParams<{ variant: string; size: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { showInterstitial, completedGamesCount } = useAdStore();
  
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
  const [pointsModalVisible, setPointsModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [completionData, setCompletionData] = useState<{
    pointsEarned: number;
    isPersonalBest: boolean;
    time: number;
  } | null>(null);
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(false);
  const [pointsAlertVisible, setPointsAlertVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  
  // Start a new game when the screen loads
  useEffect(() => {
    startGame(variant, size);
  }, [variant, size]);
  
  // Use the timer hook
  useTimer(currentGame?.isPlaying || false);
  
  // Automatically check for completion whenever the grid changes
  useEffect(() => {
    if (currentGame && currentGame.isPlaying && !isCheckingCompletion) {
      // Check if the puzzle is complete
      if (isPuzzleComplete(currentGame.grid)) {
        setIsCheckingCompletion(true);
        
        // Add a slight delay before showing completion results
        setTimeout(() => {
          checkCompletion();
        }, 1000);
      }
    }
  }, [currentGame?.grid]);
  
  // Handle cell selection
  const handleCellPress = (row: number, col: number) => {
    selectCell(row, col);
  };
  
  // Check if the puzzle is complete and handle the result
  const checkCompletion = () => {
    if (!currentGame || !currentGame.isPlaying) {
      setIsCheckingCompletion(false);
      return;
    }
    
    // Check if the solution is correct
    const { isCorrect, incorrectCount } = checkGameSolution();
    
    if (isCorrect) {
      // Puzzle completed successfully
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      const result = completeGame();
      if (result) {
        setCompletionData(result);
        
        // Show interstitial ad every 7 completed games
        if (completedGamesCount % 7 === 0) {
          showInterstitial();
        }
        
        // First show points earned modal
        setPointsModalVisible(true);
      }
    } else {
      // Puzzle has errors
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      
      const itemName = 
        variant === 'numerical' ? 'numbers' : 
        variant === 'color' ? 'colours' : 
        variant === 'emoji' ? 'emojis' : 'flags';
      
      setAlertMessage(
        `There ${incorrectCount === 1 ? 'is' : 'are'} ${incorrectCount} incorrect ${itemName}. Please check your answers and fix the mistakes. You can use the Tip feature to highlight errors.`
      );
      setAlertVisible(true);
    }
    
    setIsCheckingCompletion(false);
  };
  
  // Handle value input
  const handleValueSelect = (value: number) => {
    setCellValue(value);
    
    // Check for completion after setting a value
    // This is needed to detect completion immediately
    if (currentGame && currentGame.isPlaying) {
      // We need to simulate the updated grid to check if it would be complete
      const updatedGrid = [...currentGame.grid];
      if (currentGame.selectedCell) {
        const { row, col } = currentGame.selectedCell;
        const cell = currentGame.grid[row][col];
        
        if (!cell.fixed) {
          // Create a copy of the grid with the new value
          updatedGrid[row] = [...updatedGrid[row]];
          updatedGrid[row][col] = {
            ...cell,
            value: cell.value === value ? null : value,
          };
          
          // Check if this update would complete the puzzle
          if (isPuzzleComplete(updatedGrid) && !isCheckingCompletion) {
            setIsCheckingCompletion(true);
            setTimeout(() => {
              checkCompletion();
            }, 1000);
          }
        }
      }
    }
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
    // Show tip modal instead of directly using tip
    setTipModalVisible(true);
  };
  
  // Handle tip from modal
  const handleUseTip = (usePoints: boolean) => {
    setTipModalVisible(false);
    
    const result = useTip(usePoints);
    
    if (!result.success) {
      setAlertMessage('You need 30 points to use a tip.');
      setAlertVisible(true);
      return;
    }
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
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
  
  // Handle points info
  const handlePointsInfo = () => {
    setPointsAlertVisible(true);
  };
  
  // Handle points modal close
  const handlePointsModalClose = () => {
    setPointsModalVisible(false);
    setSuccessModalVisible(true);
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
          onPointsPress={handlePointsInfo}
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
          <>
            {/* First modal: Points earned */}
            <CustomAlert
              visible={pointsModalVisible}
              title="Congratulations!"
              message={`You completed the puzzle in ${completionData.time} seconds! You earned ${completionData.pointsEarned} points. Your total is now ${points} points.${completionData.isPersonalBest ? ' This is your new personal best!' : ''}`}
              type="success"
              onClose={handlePointsModalClose}
            />
            
            {/* Second modal: Play again or back to menu */}
            <SuccessModal
              visible={successModalVisible}
              time={completionData.time}
              pointsEarned={completionData.pointsEarned}
              isPersonalBest={completionData.isPersonalBest}
              onPlayAgain={handlePlayAgain}
              onBackToMenu={handleBackToMenu}
            />
          </>
        )}
        
        <CustomAlert
          visible={alertVisible}
          title={alertMessage.includes('incorrect') ? 'Check Your Answers' : 'Tip'}
          message={alertMessage}
          type={alertMessage.includes('incorrect') ? 'warning' : 'info'}
          onClose={handleCloseAlert}
        />
        
        <CustomAlert
          visible={pointsAlertVisible}
          title="Your Points"
          message={`You have ${points} points! Earn more by completing Sudoku puzzles or buy them in the Shop.`}
          type="info"
          onClose={() => setPointsAlertVisible(false)}
        />
        
        <TipModal
          visible={tipModalVisible}
          points={points}
          onUseTip={handleUseTip}
          onCancel={() => setTipModalVisible(false)}
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