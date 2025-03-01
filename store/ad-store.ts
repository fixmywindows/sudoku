import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { useGameStore } from './game-store';

interface AdStore {
  completedGamesCount: number;
  usedRewardedAd: boolean;
  
  // Actions
  incrementCompletedGames: () => void;
  showInterstitial: () => void;
  showRewarded: () => Promise<boolean>;
  setUsedRewardedAd: (used: boolean) => void;
}

export const useAdStore = create<AdStore>()(
  persist(
    (set, get) => ({
      completedGamesCount: 0,
      usedRewardedAd: false,
      
      incrementCompletedGames: () => {
        set({ completedGamesCount: get().completedGamesCount + 1 });
      },
      
      showInterstitial: () => {
        // Check if ads are disabled
        if (useGameStore.getState().noAds) {
          return;
        }
        
        // In a real app, this would show an interstitial ad
        if (Platform.OS !== 'web') {
          console.log('Showing interstitial ad');
          // AdMob implementation would go here
        }
        
        // Increment completed games count
        set({ completedGamesCount: get().completedGamesCount + 1 });
      },
      
      showRewarded: async () => {
        // Check if ads are disabled
        if (useGameStore.getState().noAds) {
          return false;
        }
        
        // In a real app, this would show a rewarded ad
        if (Platform.OS !== 'web') {
          console.log('Showing rewarded ad');
          // AdMob implementation would go here
          
          // Simulate ad completion
          return new Promise((resolve) => {
            setTimeout(() => {
              set({ usedRewardedAd: true });
              resolve(true);
            }, 1000);
          });
        }
        
        return false;
      },
      
      setUsedRewardedAd: (used) => {
        set({ usedRewardedAd: used });
      },
    }),
    {
      name: 'sudoku-ad-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        completedGamesCount: state.completedGamesCount,
      }),
    }
  )
);