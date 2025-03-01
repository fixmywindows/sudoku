import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react-native';
import { useGameStore } from '@/store/game-store';
import { CategoryCard as CategoryCardType, GridSize } from '@/types/game';
import { GRID_SIZES, REWARD_POINTS } from '@/constants/game';
import { useTheme } from '@/hooks/useTheme';

interface CategoryCardProps {
  category: CategoryCardType;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];
  const router = useRouter();
  const { theme } = useTheme();
  
  const { unlockedGridSizes, unlockGridSize, points } = useGameStore();
  
  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    setExpanded(!expanded);
  };
  
  const handleSizeSelect = (size: GridSize) => {
    const isUnlocked = unlockedGridSizes[category.id].includes(size);
    
    if (isUnlocked) {
      router.push({
        pathname: '/game',
        params: { variant: category.id, size },
      });
    } else {
      // Try to unlock
      const unlocked = unlockGridSize(category.id, size);
      if (unlocked) {
        router.push({
          pathname: '/game',
          params: { variant: category.id, size },
        });
      }
    }
  };
  
  const maxHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500], // Increased height to accommodate all grid sizes with more padding
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderColor: theme.primaryColor,
          backgroundColor: theme.backgroundColor,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.header, { borderBottomColor: expanded ? theme.primaryColor : 'transparent' }]}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.primaryColor }]}>{category.title}</Text>
          {expanded ? (
            <ChevronUp size={24} color={theme.primaryColor} />
          ) : (
            <ChevronDown size={24} color={theme.primaryColor} />
          )}
        </View>
        
        <View style={styles.previewContainer}>
          <SampleGrid variant={category.id} theme={theme} />
        </View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.sizesContainer, { maxHeight }]}>
        {GRID_SIZES.map((size) => {
          const isUnlocked = unlockedGridSizes[category.id].includes(size);
          const unlockCost = category.unlockPoints[size];
          const rewardPoints = REWARD_POINTS[size] + (category.id === 'emoji' ? 10 : 0);
          const canAffordUnlock = points >= unlockCost;
          
          return (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeItem,
                {
                  opacity: isUnlocked || canAffordUnlock ? 1 : 0.7,
                  borderBottomColor: theme.id !== 'default' ? `${theme.primaryColor}20` : '#E2E8F0',
                  paddingVertical: 16, // Increased padding for better spacing
                },
              ]}
              onPress={() => handleSizeSelect(size)}
              activeOpacity={0.7}
            >
              <View style={styles.sizeInfo}>
                <Text
                  style={[
                    styles.sizeText,
                    {
                      color: isUnlocked ? theme.primaryColor : canAffordUnlock ? '#64748B' : '#94A3B8',
                    },
                  ]}
                >
                  {size}x{size} Sudoku
                </Text>
              </View>
              
              <View style={styles.rightContainer}>
                {isUnlocked && (
                  <View style={[styles.pointsBadge, { backgroundColor: theme.primaryColor }]}>
                    <Text style={styles.pointsBadgeText}>earn {rewardPoints} pts</Text>
                  </View>
                )}
                
                {!isUnlocked && (
                  <View style={styles.lockContainer}>
                    <Lock 
                      size={16} 
                      color={canAffordUnlock ? theme.primaryColor : '#94A3B8'} 
                    />
                    <View 
                      style={[
                        styles.costBadge, 
                        canAffordUnlock 
                          ? { 
                              backgroundColor: 'transparent',
                              borderWidth: 1,
                              borderColor: theme.primaryColor
                            } 
                          : { backgroundColor: '#94A3B8' }
                      ]}
                    >
                      <Text 
                        style={[
                          styles.costBadgeText,
                          { color: canAffordUnlock ? theme.primaryColor : '#FFFFFF' }
                        ]}
                      >
                        {unlockCost} pts
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}

function SampleGrid({ variant, theme }: { variant: string; theme: any }) {
  const { COLORS, EMOJIS, FLAGS } = require('@/constants/game');
  
  // Fixed grid layout for sample display
  const renderContent = () => {
    switch (variant) {
      case 'numerical':
        return (
          <View style={styles.sampleGridWrapper}>
            <View style={[styles.sampleGrid, { borderColor: theme.primaryColor }]}>
              {[1, 2, 3].map((row) => (
                <View key={`row-${row}`} style={styles.sampleRow}>
                  {[1, 2, 3].map((col) => {
                    const value = (row - 1) * 3 + col;
                    return (
                      <View 
                        key={`cell-${row}-${col}`} 
                        style={[
                          styles.sampleCell, 
                          { borderColor: theme.primaryColor }
                        ]}
                      >
                        <Text style={[styles.sampleNumber, { color: theme.primaryColor }]}>
                          {value}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        );
      case 'color':
        return (
          <View style={styles.sampleGridWrapper}>
            <View style={[styles.sampleGrid, { borderColor: theme.primaryColor }]}>
              {[0, 1, 2].map((row) => (
                <View key={`row-${row}`} style={styles.sampleRow}>
                  {[0, 1, 2].map((col) => {
                    const index = row * 3 + col;
                    return (
                      <View
                        key={`cell-${row}-${col}`}
                        style={[
                          styles.sampleCell, 
                          { 
                            borderColor: theme.primaryColor,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }
                        ]}
                      >
                        <View 
                          style={[
                            styles.colorSample, 
                            { backgroundColor: COLORS[index % COLORS.length] }
                          ]} 
                        />
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        );
      case 'emoji':
        return (
          <View style={styles.sampleGridWrapper}>
            <View style={[styles.sampleGrid, { borderColor: theme.primaryColor }]}>
              {[0, 1, 2].map((row) => (
                <View key={`row-${row}`} style={styles.sampleRow}>
                  {[0, 1, 2].map((col) => {
                    const index = row * 3 + col;
                    return (
                      <View 
                        key={`cell-${row}-${col}`} 
                        style={[
                          styles.sampleCell, 
                          { borderColor: theme.primaryColor }
                        ]}
                      >
                        <Text style={styles.sampleEmoji}>
                          {EMOJIS[index % EMOJIS.length]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        );
      case 'flag':
        return (
          <View style={styles.sampleGridWrapper}>
            <View style={[styles.sampleGrid, { borderColor: theme.primaryColor }]}>
              {[0, 1, 2].map((row) => (
                <View key={`row-${row}`} style={styles.sampleRow}>
                  {[0, 1, 2].map((col) => {
                    const index = row * 3 + col;
                    return (
                      <View 
                        key={`cell-${row}-${col}`} 
                        style={[
                          styles.sampleCell, 
                          { borderColor: theme.primaryColor }
                        ]}
                      >
                        <Text style={styles.sampleEmoji}>
                          {FLAGS[index % FLAGS.length]}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };
  
  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    alignItems: 'center',
  },
  sampleGridWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  sampleGrid: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sampleRow: {
    flexDirection: 'row',
    height: 40,
  },
  sampleCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  sampleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sampleEmoji: {
    fontSize: 20,
  },
  colorSample: {
    width: 30,
    height: 30,
    borderRadius: 4,
  },
  sizesContainer: {
    overflow: 'hidden',
  },
  sizeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20, // Increased padding for better spacing
    borderBottomWidth: 1,
  },
  sizeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 16,
  },
  pointsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  costBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});