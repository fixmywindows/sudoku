import { CategoryCard, GridSize, PointsPackage, ThemeOption } from "@/types/game";

export const GRID_SIZES: GridSize[] = [3, 4, 5, 6, 7, 8, 9];

export const UNLOCK_POINTS: Record<GridSize, number> = {
  3: 0,
  4: 50,
  5: 100,
  6: 150,
  7: 200,
  8: 300,
  9: 500,
};

export const REWARD_POINTS: Record<GridSize, number> = {
  3: 10,
  4: 15,
  5: 20,
  6: 25,
  7: 30,
  8: 35,
  9: 40,
};

export const EMOJI_BONUS = 10;

export const TIP_COST = 30;

export const CATEGORIES: CategoryCard[] = [
  {
    id: 'numerical',
    title: 'Numerical Sudoku',
    icon: '123',
    description: 'Classic Sudoku with numbers',
    unlockPoints: UNLOCK_POINTS,
  },
  {
    id: 'color',
    title: 'Colour Sudoku',
    icon: '🎨',
    description: 'Sudoku with colors instead of numbers',
    unlockPoints: UNLOCK_POINTS,
  },
  {
    id: 'emoji',
    title: 'Emoji Sudoku',
    icon: '😀',
    description: 'Sudoku with emojis instead of numbers',
    unlockPoints: UNLOCK_POINTS,
  },
  {
    id: 'flag',
    title: 'Flags Sudoku',
    icon: '🏁',
    description: 'Sudoku with country flags',
    unlockPoints: UNLOCK_POINTS,
  },
];

export const COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6B7280', // Gray
];

export const EMOJIS = ['😀', '😍', '🚀', '🎮', '🎵', '🍕', '🐱', '🌈', '🏆'];

// Fixed flag emojis to ensure proper rendering
export const FLAGS = ['🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇬🇧', '🇯🇵', '🇺🇸', '🇨🇦', '🇦🇺'];

export const THEMES: ThemeOption[] = [
  {
    id: 'default',
    name: 'Default',
    price: 0,
    primaryColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    accentColor: '#60A5FA',
    inputCellColor: '#F0F9FF',
  },
  {
    id: 'dark',
    name: 'Dark',
    price: 400,
    primaryColor: '#60A5FA',
    backgroundColor: '#1E293B',
    accentColor: '#3B82F6',
    inputCellColor: '#334155',
    pattern: 'starry',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    price: 400,
    primaryColor: '#8B5CF6',
    backgroundColor: '#312E81',
    accentColor: '#A78BFA',
    inputCellColor: '#4C1D95',
    pattern: 'planetary',
  },
  {
    id: 'asia',
    name: 'Asia',
    price: 400,
    primaryColor: '#D97706',
    backgroundColor: '#FFFBEB',
    accentColor: '#F59E0B',
    inputCellColor: '#FEF3C7',
    pattern: 'bamboo',
  },
  {
    id: 'underwater',
    name: 'Underwater',
    price: 400,
    primaryColor: '#0891B2',
    backgroundColor: '#ECFEFF',
    accentColor: '#06B6D4',
    inputCellColor: '#CFFAFE',
    pattern: 'wave',
  },
];

export const POINTS_PACKAGES: PointsPackage[] = [
  {
    id: 'small',
    points: 100,
    price: '£0.99',
    priceValue: 0.99,
  },
  {
    id: 'medium',
    points: 300,
    price: '£1.99',
    priceValue: 1.99,
  },
  {
    id: 'large',
    points: 500,
    price: '£2.59',
    priceValue: 2.59,
  },
  {
    id: 'xlarge',
    points: 1000,
    price: '£4.99',
    priceValue: 4.99,
  },
];

export const NO_ADS_PRICE = '£2.99';