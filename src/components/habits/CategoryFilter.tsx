import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Category } from '../../types';

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({ categories, selectedId, onSelect }: Props) {
  const { theme } = useTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categories.map((cat) => {
        const isSelected = selectedId === cat.id;
        return (
          <Pressable
            key={cat.id}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? theme.primaryLight : theme.surfaceVariant,
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}
            onPress={() => onSelect(isSelected ? null : cat.id)}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? theme.primary : theme.textSecondary },
              ]}
            >
              {cat.icon ? `${cat.icon} ` : ''}
              {cat.name}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
