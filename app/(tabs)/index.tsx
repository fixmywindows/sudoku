import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Coins, ShoppingCart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/game-store';
import { CATEGORIES } from '@/constants/game';
import CategoryCard from '@/components/CategoryCard';
import CustomAlert from '@/components/CustomAlert';
import { useTheme } from '@/hooks/useTheme';
import { AdMobRewarded } from 'expo-ads-admob';

export default function HomeScreen() {
  const router = useRouter();
  const { points, unlockedGridSizes, unlockGridSize } = useGameStore();
  const { theme } = useTheme();
  const [pointsAlertVisible, setPointsAlertVisible] = useState(false);

  const handlePointsPress = () => {
    setPointsAlertVisible(true);
  };

  const handleUnlockLevel = async (size: number) => {
    if (unlockedGridSizes.numerical.includes(size as GridSize)) {
      return;
    }

    Alert.alert(
      'Unlock Level',
      `Do you want to unlock ${size}x${size} Sudoku for points?`,
      [
        { text: 'Cancel' },
        {
          text: 'Use Points',
          onPress: () => {
            const success = unlockGridSize('numerical', size as GridSize);
            if (success) {
              Alert.alert('Level Unlocked', `${size}x${size} Sudoku is now available!`);
            } else {
              Alert.alert('Not Enough Points', `You need more points to unlock this level.`);
            }
          },
        },
        {
          text: 'Watch Ad',
          onPress: async () => {
            await AdMobRewarded.setAdUnitID('your-rewarded-ad-unit-id');
            await AdMobRewarded.requestAdAsync();
            await AdMobRewarded.showAdAsync();
            unlockGridSize('numerical', size as GridSize);
            Alert.alert('Level Unlocked', `${size}x${size} Sudoku is now available!`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>  
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.pointsButton, { backgroundColor: theme.primaryColor }]}
          onPress={handlePointsPress}
        >
          <Coins size={18} color="#FFFFFF" />
          <Text style={styles.pointsText}>Points: {points}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.shopButton, { backgroundColor: theme.primaryColor }]}
          onPress={() => router.push('/shop')}
        >
          <ShoppingCart size={18} color="#FFFFFF" />
          <Text style={styles.shopText}>Shop</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.primaryColor }]}>Choose Your Sudoku</Text>
        
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => handleUnlockLevel(category.size as GridSize)}
            disabled={unlockedGridSizes.numerical.includes(category.size as GridSize)}
          >
            <CategoryCard key={category.id} category={category} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <CustomAlert
        visible={pointsAlertVisible}
        title="Your Points"
        message={`You have ${points} points! Earn more by completing Sudoku puzzles or buy them in the Shop.`}
        type="info"
        onClose={() => setPointsAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pointsButton: {
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
  shopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  shopText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
});
