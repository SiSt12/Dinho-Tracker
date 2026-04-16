import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useHabitStore } from '../../src/stores/habitStore';
import { useAuthStore } from '../../src/stores/authStore';
import { IconPicker } from '../../src/components/ui/IconPicker';
import { ColorPicker } from '../../src/components/ui/ColorPicker';
import { HabitColor, HabitFrequency } from '../../src/types';
import { showAlert } from '../../src/utils/alert';

export default function NewHabitScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addHabit = useHabitStore((s) => s.addHabit);
  const categories = useHabitStore((s) => s.categories);
  const habits = useHabitStore((s) => s.habits);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('pulse');
  const [color, setColor] = useState<HabitColor>('purple');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [targetDays, setTargetDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleTargetDay = (day: number) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert(t('common.error'), t('habits.nameRequired'));
      return;
    }
    if (!user) {
      showAlert(t('common.error'), 'Please log in to create habits');
      return;
    }

    setSubmitting(true);
    try {
      await addHabit({
        user_id: user.id,
        name: name.trim(),
        description: description.trim(),
        icon,
        color,
        category_id: categoryId,
        frequency,
        target_days: targetDays,
        archived: false,
        sort_order: habits.length,
      });
      router.back();
    } catch (error: any) {
      showAlert(t('common.error'), error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.innerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color={theme.textSecondary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>{t('habits.newHabit')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon Picker */}
        <IconPicker selected={icon} onSelect={setIcon} />

        {/* Name */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('habits.name')}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          value={name}
          onChangeText={setName}
          placeholder={t('habits.name')}
          placeholderTextColor={theme.textTertiary}
        />

        {/* Description */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('habits.description')}</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('habits.description')}
          placeholderTextColor={theme.textTertiary}
          multiline
          numberOfLines={3}
        />

        {/* Color Picker */}
        <Text style={[styles.label, { color: theme.textSecondary }]}>{t('habits.color')}</Text>
        <ColorPicker selected={color} onSelect={setColor} />

        {/* Advanced Options */}
        <Pressable
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={[styles.advancedText, { color: theme.textTertiary }]}>
            {t('habits.advancedOptions')}
          </Text>
          <MaterialCommunityIcons
            name={showAdvanced ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.textTertiary}
          />
        </Pressable>

        {showAdvanced && (
          <View style={styles.advancedSection}>
            {/* Frequency */}
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              {t('habits.frequency')}
            </Text>
            <View style={styles.frequencyRow}>
              {(['daily', 'weekly', 'custom'] as HabitFrequency[]).map((freq) => (
                <Pressable
                  key={freq}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: frequency === freq ? theme.primaryLight : theme.surfaceVariant,
                      borderColor: frequency === freq ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    style={{
                      color: frequency === freq ? theme.primary : theme.textSecondary,
                      fontWeight: '600',
                      fontSize: 13,
                    }}
                  >
                    {t(`habits.${freq}`)}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Target Days */}
            {frequency !== 'daily' && (
              <>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {t('habits.targetDays')}
                </Text>
                <View style={styles.daysRow}>
                  {[
                    { day: 0, label: t('days.sun') },
                    { day: 1, label: t('days.mon') },
                    { day: 2, label: t('days.tue') },
                    { day: 3, label: t('days.wed') },
                    { day: 4, label: t('days.thu') },
                    { day: 5, label: t('days.fri') },
                    { day: 6, label: t('days.sat') },
                  ].map(({ day, label }) => {
                    const isSelected = targetDays.includes(day);
                    return (
                      <Pressable
                        key={day}
                        style={[
                          styles.dayChip,
                          {
                            backgroundColor: isSelected ? theme.primaryLight : theme.surfaceVariant,
                            borderColor: isSelected ? theme.primary : theme.border,
                          },
                        ]}
                        onPress={() => toggleTargetDay(day)}
                      >
                        <Text
                          style={{
                            color: isSelected ? theme.primary : theme.textSecondary,
                            fontWeight: '600',
                            fontSize: 12,
                          }}
                        >
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            {/* Category */}
            {categories.length > 0 && (
              <>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {t('habits.category')}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Pressable
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: !categoryId ? theme.primaryLight : theme.surfaceVariant,
                        borderColor: !categoryId ? theme.primary : theme.border,
                      },
                    ]}
                    onPress={() => setCategoryId(null)}
                  >
                    <Text
                      style={{
                        color: !categoryId ? theme.primary : theme.textSecondary,
                        fontWeight: '600',
                        fontSize: 13,
                      }}
                    >
                      {t('categories.all')}
                    </Text>
                  </Pressable>
                  {categories.map((cat) => (
                    <Pressable
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: categoryId === cat.id ? theme.primaryLight : theme.surfaceVariant,
                          borderColor: categoryId === cat.id ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => setCategoryId(cat.id)}
                    >
                      <Text
                        style={{
                          color: categoryId === cat.id ? theme.primary : theme.textSecondary,
                          fontWeight: '600',
                          fontSize: 13,
                        }}
                      >
                        {cat.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomBar, { backgroundColor: theme.background }]}>
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: name.trim() ? theme.primary : theme.surfaceVariant },
          ]}
          onPress={handleSave}
          disabled={submitting || !name.trim()}
        >
          <Text
            style={[
              styles.saveText,
              { color: name.trim() ? '#FFFFFF' : theme.textTertiary },
            ]}
          >
            {t('common.save')}
          </Text>
        </Pressable>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 24,
    paddingVertical: 12,
  },
  advancedText: {
    fontSize: 13,
    fontWeight: '500',
  },
  advancedSection: {
    marginTop: 8,
  },
  frequencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dayChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 4,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
