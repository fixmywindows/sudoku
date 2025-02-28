import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/game-store';
import { CATEGORIES, GRID_SIZES } from '@/constants/game';
import { formatTime } from '@/utils/sudoku';
import { SudokuVariant } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';

export default function LeaderboardScreen() {
  const { personalBests } = useGameStore();
  const [activeTab, setActiveTab] = useState<SudokuVariant>('numerical');
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.primaryColor }]}>Your Best Times</Text>
      
      <View style={styles.tabsContainer}>
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.tab,
              {
                backgroundColor: activeTab === category.id ? theme.primaryColor : 'transparent',
                borderColor: theme.primaryColor,
                borderWidth: activeTab !== category.id ? 1 : 0,
              },
            ]}
            onPress={() => setActiveTab(category.id as SudokuVariant)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === category.id ? '#FFFFFF' : theme.primaryColor,
                },
              ]}
            >
              {category.title.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GRID_SIZES.map((size) => {
          const bestTime = personalBests[activeTab][size];
          
          return (
            <View
              key={size}
              style={[
                styles.timeCard,
                {
                  borderColor: theme.primaryColor,
                  backgroundColor: theme.backgroundColor,
                  opacity: bestTime > 0 ? 1 : 0.5,
                },
              ]}
            >
              <Text style={[styles.sizeText, { color: theme.primaryColor }]}>
                {size}x{size} Sudoku
              </Text>
              
              <Text style={[styles.timeText, { color: theme.primaryColor }]}>
                {bestTime > 0 ? formatTime(bestTime) : 'No record yet'}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 80,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  timeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  sizeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
});