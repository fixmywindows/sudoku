import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Trophy } from 'lucide-react-native';
import { formatTime } from '@/utils/sudoku';
import { useTheme } from '@/hooks/useTheme';

interface SuccessModalProps {
  visible: boolean;
  time: number;
  pointsEarned: number;
  isPersonalBest: boolean;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export default function SuccessModal({
  visible,
  time,
  pointsEarned,
  isPersonalBest,
  onPlayAgain,
  onBackToMenu,
}: SuccessModalProps) {
  const { theme } = useTheme();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      bounceAnim.setValue(0);
    }
  }, [visible, bounceAnim]);
  
  const animatedStyle = {
    transform: [
      {
        scale: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: bounceAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    }),
  };
  
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            animatedStyle,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          <View style={styles.trophyContainer}>
            <Trophy size={60} color={theme.primaryColor} />
          </View>
          
          <Text style={[styles.congratsText, { color: theme.primaryColor }]}>
            Congratulations!
          </Text>
          
          <Text style={[styles.timeText, { color: theme.primaryColor }]}>
            Puzzle Solved!
          </Text>
          
          <Text style={[styles.timeText, { color: theme.primaryColor }]}>
            Time: {formatTime(time)}
          </Text>
          
          {isPersonalBest && (
            <View style={[styles.bestTimeBadge, { backgroundColor: theme.primaryColor }]}>
              <Text style={styles.bestTimeText}>New Best Time!</Text>
            </View>
          )}
          
          <View style={[styles.pointsContainer, { backgroundColor: theme.primaryColor }]}>
            <Text style={styles.pointsText}>+{pointsEarned} Points</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primaryColor }]}
              onPress={onPlayAgain}
            >
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primaryColor }]}
              onPress={onBackToMenu}
            >
              <Text style={styles.buttonText}>Back to Menu</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trophyContainer: {
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  timeText: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  bestTimeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 8,
  },
  bestTimeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pointsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 16,
  },
  pointsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});