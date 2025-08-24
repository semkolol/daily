import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Pressable, useColorScheme, SafeAreaView, Linking } from 'react-native';
import { Text, View } from '@/components/design/Themed';
import { SymbolView } from 'expo-symbols';
import { router, useLocalSearchParams } from 'expo-router';
import { useConfigStore } from '@/utils/state';
import { useTranslation } from '@/i18n';
import React, { useCallback, useEffect, useState } from 'react';
import { hasProAccess } from '@/utils/purchases';

const languages = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  jp: "日本語",
  zh: "中文"
};

const SettingsRow = ({ text, value, onPress, iconName = "chevron.forward" }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingRow, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <Text style={styles.settingText}>{text}</Text>
      <View style={styles.settingRight} pointerEvents="none">
        {value && <Text style={styles.settingValue}>{value}</Text>}
        <SymbolView name={iconName} tintColor="#C7C7CC" type="hierarchical" size={16} />
      </View>
    </Pressable>
  );
};

const SettingsGroup = ({ children, isDarkMode }) => {
  return (
    <View style={styles.group}>
      <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
        {React.Children.map(children, (child, index) => (
          <>
            {child}
            {index < React.Children.count(children) - 1 && (
              <View style={[styles.separator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />
            )}
          </>
        ))}
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { language, trialStartDate } = useConfigStore();
  const { t } = useTranslation();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const proAccess = await hasProAccess();
      setIsPro(proAccess);
    };
    checkAccess();
  }, []);

  const handleNavigation = useCallback((path: string) => {
    try {
      router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, []);

  const handleLink = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {trialStartDate && !isPro && (
          <SettingsGroup isDarkMode={isDarkMode}>
            <SettingsRow
              text={t('settings.unlockFullAccess')}
              onPress={() => handleNavigation('/paywall?from=settings')}
              iconName="lock.open.fill"
              value={undefined}
            />
          </SettingsGroup>
        )}
        <SettingsGroup isDarkMode={isDarkMode}>
          <SettingsRow
            text={t('settings.language')}
            value={languages[language || 'en']}
            onPress={() => handleNavigation('/language')}
          />
          <SettingsRow
            text={t('settings.reminderNotifications')}
            onPress={() => handleNavigation('/notificationSettings')}
            value={undefined}
          />
        </SettingsGroup>

        <SettingsGroup isDarkMode={isDarkMode}>
          <SettingsRow
            text={t('settings.tos')}
            onPress={() => handleLink('https://brodvey.de/tos')}
            iconName="arrow.up.right"
            value={undefined}
          />
          <SettingsRow
            text={t('settings.privacyPolicy')}
            onPress={() => handleLink('https://brodvey.de/pp')}
            iconName="arrow.up.right"
            value={undefined}
          />
        </SettingsGroup>
      </View>

      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
    backgroundColor: 'transparent'
  },
  group: {
    backgroundColor: 'transparent',
    marginBottom: 35,
    paddingHorizontal: 16,
  },
  groupContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  settingRow: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  settingText: {
    fontSize: 17,
    fontWeight: '400',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  settingValue: {
    fontSize: 17,
    color: '#8E8E93',
    marginRight: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 16,
  },
});