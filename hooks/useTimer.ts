import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/game-store';

export function useTimer(isPlaying: boolean) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { updateTimer } = useGameStore();
  
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        updateTimer();
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, updateTimer]);
}