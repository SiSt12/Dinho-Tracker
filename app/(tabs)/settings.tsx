import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuthStore } from '../../src/stores/authStore';
import i18n from '../../src/i18n';

export default function SettingsScreen() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const themeOptions = [
    { key: 'light' as const, label: t('settings.themeLight'), icon: 'white-balance-sunny' },
    { key: 'dark' as const, label: t('settings.themeDark'), icon: 'moon-waning-crescent' },
    { key: 'system' as const, label: t('settings.themeSystem'), icon: 'cellphone' },
  ];

  const languageOptions = [
    { key: 'en', label: 'English' },
    { key: 'pt-BR', label: 'Português (BR)' },
  ];

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.innerContainer}>
      <ScrollView>
        <View style={styles.titleRow}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textSecondary} />
          </Pressable>
          <Text style={[styles.screenTitle, { color: theme.text }]}>{t('settings.title')}</Text>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.account')}
          </Text>
          {user ? (
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
              <Text style={[styles.email, { color: theme.text }]}>{user.email}</Text>
              <Pressable style={styles.logoutBtn} onPress={handleSignOut}>
                <Text style={[styles.logoutText, { color: theme.error }]}>{t('auth.logout')}</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={[styles.loginCta, { color: theme.primary }]}>{t('auth.login')}</Text>
            </Pressable>
          )}
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.theme')}
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {themeOptions.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.optionRow,
                  themeMode === opt.key && { backgroundColor: theme.primaryLight },
                ]}
                onPress={() => setThemeMode(opt.key)}
              >
                <MaterialCommunityIcons
                  name={opt.icon as any}
                  size={20}
                  color={themeMode === opt.key ? theme.primary : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.optionText,
                    { color: themeMode === opt.key ? theme.primary : theme.text },
                  ]}
                >
                  {opt.label}
                </Text>
                {themeMode === opt.key && (
                  <MaterialCommunityIcons name="check" size={18} color={theme.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.language')}
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            {languageOptions.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.optionRow,
                  i18n.language === opt.key && { backgroundColor: theme.primaryLight },
                ]}
                onPress={() => i18n.changeLanguage(opt.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: i18n.language === opt.key ? theme.primary : theme.text },
                  ]}
                >
                  {opt.label}
                </Text>
                {i18n.language === opt.key && (
                  <MaterialCommunityIcons name="check" size={18} color={theme.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
            {t('settings.about')}
          </Text>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={styles.optionRow}>
              <Text style={[styles.optionText, { color: theme.text }]}>
                {t('settings.version')}
              </Text>
              <Text style={[styles.versionText, { color: theme.textTertiary }]}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  screenTitle: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingLeft: 4,
  },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  email: {
    fontSize: 15,
    fontWeight: '500',
    padding: 16,
  },
  logoutBtn: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  loginCta: {
    fontSize: 15,
    fontWeight: '600',
    padding: 16,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 14,
  },
});
