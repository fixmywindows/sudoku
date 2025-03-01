import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useGameStore } from '@/store/game-store';
import { useAdStore } from '@/store/ad-store';
import { Video } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface RewardedAdButtonProps {
  onPress: () => void;
}

export default function RewardedAdButton({ onPress }: RewardedAdButtonProps) {
  const { noAds } = useGameStore();
  const { showRewarded } = useAdStore();
  const { theme } = useTheme();
  
  // Don't show the button if ads are disabled
  if (noAds || Platform.OS === 'web') {
    return null;
  }
  
  const handlePress = async () => {
    const success = await showRewarded();
    if (success) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.primaryColor }]}
      onPress={handlePress}
    >
      <Video size={16} color="#FFFFFF" />
      <Text style={styles.text}>Watch Ad for Free Tip</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    gap: 8,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});