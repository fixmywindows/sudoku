import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { THEMES } from '@/constants/game';
import { ThemeOption } from '@/types/game';

export function useTheme() {
  const { currentTheme, unlockedThemes } = useGameStore();
  const [theme, setTheme] = useState<ThemeOption>(THEMES[0]);
  
  useEffect(() => {
    const selectedTheme = THEMES.find(t => t.id === currentTheme);
    
    if (selectedTheme && unlockedThemes.includes(selectedTheme.id)) {
      setTheme(selectedTheme);
    } else {
      setTheme(THEMES[0]); // Default theme
    }
  }, [currentTheme, unlockedThemes]);
  
  return { theme };
}