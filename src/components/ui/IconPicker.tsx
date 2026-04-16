import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { HABIT_ICONS } from '../../constants/habits';

interface Props {
  selected: string;
  onSelect: (icon: string) => void;
}

export function IconPicker({ selected, onSelect }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.selectedPreview}>
        <View style={[styles.previewCircle, { borderColor: theme.border }]}>
          <MaterialCommunityIcons
            name={(selected as any) || 'pulse'}
            size={40}
            color={theme.text}
          />
        </View>
      </View>
      <View style={styles.grid}>
        {HABIT_ICONS.map((icon) => (
          <Pressable
            key={icon}
            style={[
              styles.iconButton,
              selected === icon && { backgroundColor: theme.primaryLight },
            ]}
            onPress={() => onSelect(icon)}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={22}
              color={selected === icon ? theme.primary : theme.textSecondary}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  selectedPreview: {
    alignItems: 'center',
    marginBottom: 8,
  },
  previewCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
