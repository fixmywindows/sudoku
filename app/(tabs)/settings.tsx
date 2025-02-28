import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameStore } from '@/store/game-store';
import { THEMES } from '@/constants/game';
import { useTheme } from '@/hooks/useTheme';

export default function SettingsScreen() {
  const { setTheme, currentTheme, unlockedThemes, resetGame } = useGameStore();
  const { theme } = useTheme();
  
  const handleResetGame = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset all game data? This will remove all your progress, points, and purchases.',
      [
        { text: 'Cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetGame();
            Alert.alert('Reset Complete', 'All game data has been reset.');
          },
        },
      ]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.title, { color: theme.primaryColor }]}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primaryColor }]}>Theme</Text>
        
        <View style={styles.themesContainer}>
          {THEMES.map((themeOption) => {
            const isUnlocked = unlockedThemes.includes(themeOption.id);
            const isSelected = currentTheme === themeOption.id;
            
            return (
              <TouchableOpacity
                key={themeOption.id}
                style={[
                  styles.themeButton,
                  {
                    backgroundColor: themeOption.backgroundColor,
                    borderColor: isSelected ? themeOption.primaryColor : 'transparent',
                    borderWidth: isSelected ? 2 : 0,
                    opacity: isUnlocked ? 1 : 0.5,
                  },
                ]}
                onPress={() => isUnlocked && setTheme(themeOption.id)}
                disabled={!isUnlocked}
              >
                <Text
                  style={[
                    styles.themeButtonText,
                    {
                      color: themeOption.primaryColor,
                    },
                  ]}
                >
                  {themeOption.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.primaryColor }]}>Data Management</Text>
        
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: '#EF4444' }]}
          onPress={handleResetGame}
        >
          <Text style={styles.resetButtonText}>Reset All Game Data</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  themesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  themeButtonText: {
    fontWeight: 'bold',
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});