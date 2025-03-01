import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useGameStore } from '@/store/game-store';
import { usePathname } from 'expo-router';

export default function BannerAd() {
  const { noAds } = useGameStore();
  const pathname = usePathname();
  
  // Don't show ads on the game screen or if ads are disabled
  if (pathname === '/game' || noAds) {
    return null;
  }
  
  // In a real app, this would be replaced with an actual AdMob banner
  if (Platform.OS === 'web') {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Banner Ad</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  text: {
    color: '#6B7280',
    fontSize: 12,
  },
});