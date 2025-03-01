import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw, Lightbulb, Coins } from 'lucide-react-native';
import { formatTime } from '@/utils/sudoku';
import { useTheme } from '@/hooks/useTheme';
import { TIP_COST } from '@/constants/game';

interface GameHeaderProps {
  timer: number;
  points: number;
  onRestart: () => void;
  onTip: () => void;
  onPointsPress: () => void;
}

export default function GameHeader({ timer, points, onRestart, onTip, onPointsPress }: GameHeaderProps) {
  const router = useRouter();
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.iconButton, { borderColor: theme.primaryColor }]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color={theme.primaryColor} />
        </TouchableOpacity>
        
        <View style={styles.timerContainer}>
          <Text style={[styles.timerText, { color: theme.primaryColor }]}>
            {formatTime(timer)}
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.iconButton, { borderColor: theme.primaryColor }]}
          onPress={onRestart}
        >
          <RefreshCw size={20} color={theme.primaryColor} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.tipButton, { backgroundColor: theme.primaryColor }]}
          onPress={onTip}
        >
          <Lightbulb size={16} color="#FFFFFF" />
          <Text style={styles.tipText}>Tip ({TIP_COST} pts)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.pointsContainer, { backgroundColor: theme.primaryColor }]}
          onPress={onPointsPress}
        >
          <Coins size={16} color="#FFFFFF" />
          <Text style={styles.pointsText}>Points: {points}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  tipText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  pointsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});