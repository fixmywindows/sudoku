import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Coins, ShoppingCart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/game-store';
import { CATEGORIES } from '@/constants/game';
import CategoryCard from '@/components/CategoryCard';
import CustomAlert from '@/components/CustomAlert';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const router = useRouter();
  const { points } = useGameStore();
  const { theme } = useTheme();
  const [pointsAlertVisible, setPointsAlertVisible] = useState(false);
  
  const handlePointsPress = () => {
    setPointsAlertVisible(true);
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
        <Text style={[styles.title, { color: theme.primaryColor }]}>
          Choose Your Sudoku
        </Text>
        
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
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