import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { ViewMode } from '../../types';

interface Props {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeSelector({ current, onChange }: Props) {
  const { theme } = useTheme();

  const modes: { mode: ViewMode; icon: string }[] = [
    { mode: 'weekly', icon: 'view-sequential' },
    { mode: 'grid', icon: 'view-grid' },
    { mode: 'list', icon: 'format-list-checks' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surfaceVariant, borderColor: theme.border }]}>
      {modes.map(({ mode, icon }) => {
        const isActive = current === mode;
        return (
          <Pressable
            key={mode}
            style={[
              styles.button,
              isActive && { backgroundColor: theme.card },
            ]}
            onPress={() => onChange(mode)}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={20}
              color={isActive ? theme.primary : theme.textTertiary}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 2,
    padding: 3,
    gap: 2,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
