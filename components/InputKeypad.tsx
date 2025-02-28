import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GridSize, SudokuVariant } from '@/types/game';
import { COLORS, EMOJIS, FLAGS } from '@/constants/game';
import { useTheme } from '@/hooks/useTheme';
import { Trash2 } from 'lucide-react-native';

interface InputKeypadProps {
  variant: SudokuVariant;
  size: GridSize;
  onValueSelect: (value: number) => void;
  onClearCell: () => void;
}

export default function InputKeypad({ variant, size, onValueSelect, onClearCell }: InputKeypadProps) {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const keypadWidth = Math.min(screenWidth - 32, 320); // Reduced width
  
  // Calculate rows and columns for the keypad
  const getKeypadLayout = () => {
    if (size <= 4) return { rows: 1, cols: size };
    if (size <= 6) return { rows: 2, cols: Math.ceil(size / 2) };
    return { rows: 3, cols: Math.ceil(size / 3) };
  };
  
  const { rows, cols } = getKeypadLayout();
  const buttonSize = Math.min(keypadWidth / cols, 40); // Limit max button size
  const buttonMargin = 4;
  
  const renderKeypadButton = (value: number) => {
    switch (variant) {
      case 'numerical':
        return (
          <Text
            style={[
              styles.buttonText,
              {
                color: theme.primaryColor,
                fontSize: buttonSize * 0.5,
              },
            ]}
          >
            {value}
          </Text>
        );
      case 'color':
        return (
          <View
            style={[
              styles.colorButton,
              {
                backgroundColor: COLORS[value - 1],
                width: buttonSize * 0.6,
                height: buttonSize * 0.6,
              },
            ]}
          />
        );
      case 'emoji':
        return (
          <Text
            style={[
              styles.emojiText,
              {
                fontSize: buttonSize * 0.5,
              },
            ]}
          >
            {EMOJIS[value - 1]}
          </Text>
        );
      case 'flag':
        return (
          <Text
            style={[
              styles.emojiText,
              {
                fontSize: buttonSize * 0.5,
              },
            ]}
          >
            {FLAGS[value - 1]}
          </Text>
        );
      default:
        return null;
    }
  };
  
  const buttons = [];
  for (let i = 1; i <= size; i++) {
    buttons.push(
      <TouchableOpacity
        key={i}
        style={[
          styles.button,
          {
            width: buttonSize,
            height: buttonSize,
            margin: buttonMargin,
            borderColor: theme.primaryColor,
          },
        ]}
        onPress={() => onValueSelect(i)}
        activeOpacity={0.7}
      >
        {renderKeypadButton(i)}
      </TouchableOpacity>
    );
  }
  
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.keypad,
          {
            width: keypadWidth + (buttonMargin * 2 * cols),
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          },
        ]}
      >
        {buttons}
      </View>
      
      {/* Delete button */}
      <TouchableOpacity
        style={[
          styles.deleteButton,
          {
            borderColor: theme.primaryColor,
            marginTop: 12,
          },
        ]}
        onPress={onClearCell}
        activeOpacity={0.7}
      >
        <Trash2 size={20} color={theme.primaryColor} />
        <Text style={[styles.deleteText, { color: theme.primaryColor }]}>Clear Cell</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  keypad: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  colorButton: {
    borderRadius: 4,
  },
  emojiText: {
    textAlign: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    gap: 8,
  },
  deleteText: {
    fontWeight: '500',
  },
});