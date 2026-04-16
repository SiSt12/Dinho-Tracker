import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { HABIT_COLORS } from '../../constants/habits';
import { HabitColor } from '../../types';

interface Props {
  selected: HabitColor;
  onSelect: (color: HabitColor) => void;
}

const colorKeys = Object.keys(HABIT_COLORS) as HabitColor[];

export function ColorPicker({ selected, onSelect }: Props) {
  return (
    <View style={styles.grid}>
      {colorKeys.map((key) => {
        const isSelected = selected === key;
        return (
          <Pressable
            key={key}
            style={[
              styles.swatch,
              { backgroundColor: HABIT_COLORS[key].base },
              isSelected && styles.selectedSwatch,
            ]}
            onPress={() => onSelect(key)}
          >
            {isSelected && (
              <View style={styles.innerDot} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSwatch: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  innerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
});
