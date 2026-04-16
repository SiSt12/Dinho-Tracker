import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { showAlert } from '../../src/utils/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuthStore } from '../../src/stores/authStore';

export default function RegisterScreen() {
  const { theme, isDark, setThemeMode } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const { signUp, loading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email.trim()) return showAlert(t('common.error'), t('auth.emailRequired'));
    if (password.length < 6) return showAlert(t('common.error'), t('auth.passwordMin'));
    if (password !== confirmPassword) return showAlert(t('common.error'), t('auth.passwordMatch'));

    try {
      await signUp(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.message === 'EMAIL_CONFIRMATION_SENT') {
        showAlert(t('common.success'), t('auth.confirmEmailSent'));
      } else {
        showAlert(t('common.error'), error.message);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Pressable style={styles.themeToggle} onPress={() => setThemeMode(isDark ? 'light' : 'dark')}>
        <MaterialCommunityIcons
          name={isDark ? 'moon-waning-crescent' : 'white-balance-sunny'}
          size={22}
          color={theme.textSecondary}
        />
      </Pressable>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Dinho<Text style={{ color: theme.primary }}>Tracker</Text>
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t('auth.registerSubtitle')}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{t('auth.email')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={t('auth.email')}
            placeholderTextColor={theme.textTertiary}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>{t('auth.password')}</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder={t('auth.password')}
            placeholderTextColor={theme.textTertiary}
          />

          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {t('auth.confirmPassword')}
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder={t('auth.confirmPassword')}
            placeholderTextColor={theme.textTertiary}
          />

          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryButtonText}>{t('auth.register')}</Text>
            )}
          </Pressable>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              {t('auth.hasAccount')}{' '}
            </Text>
            <Pressable onPress={() => router.back()}>
              <Text style={[styles.linkText, { color: theme.primary }]}>{t('auth.login')}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  form: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
