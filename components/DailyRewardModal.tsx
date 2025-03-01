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
import { Calendar, Gift, AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface DailyRewardModalProps {
  visible: boolean;
  day: number;
  points: number;
  streakBroken: boolean;
  onClaim: () => void;
}

export default function DailyRewardModal({
  visible,
  day,
  points,
  streakBroken,
  onClaim,
}: DailyRewardModalProps) {
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
          {streakBroken ? (
            <View style={styles.iconContainer}>
              <AlertTriangle size={48} color="#F59E0B" />
            </View>
          ) : (
            <View style={styles.iconContainer}>
              <Gift size={48} color={theme.primaryColor} />
            </View>
          )}
          
          {streakBroken ? (
            <Text style={[styles.title, { color: theme.primaryColor }]}>
              Oh no! You missed your streak!
            </Text>
          ) : (
            <Text style={[styles.title, { color: theme.primaryColor }]}>
              Daily Reward!
            </Text>
          )}
          
          <View style={styles.rewardInfo}>
            <View style={[styles.dayBadge, { backgroundColor: theme.primaryColor }]}>
              <Calendar size={16} color="#FFFFFF" />
              <Text style={styles.dayText}>Day {day}</Text>
            </View>
            
            <View style={[styles.pointsBadge, { backgroundColor: theme.primaryColor }]}>
              <Text style={styles.pointsText}>+{points} Points</Text>
            </View>
          </View>
          
          {streakBroken ? (
            <Text style={[styles.message, { color: theme.primaryColor }]}>
              Your streak has been reset. Come back tomorrow to continue earning rewards!
            </Text>
          ) : (
            <Text style={[styles.message, { color: theme.primaryColor }]}>
              Come back tomorrow for more rewards! Complete a 7-day streak for maximum points.
            </Text>
          )}
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primaryColor }]}
            onPress={onClaim}
          >
            <Text style={styles.buttonText}>Claim Reward</Text>
          </TouchableOpacity>
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
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  rewardInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dayBadge: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  dayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  pointsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});