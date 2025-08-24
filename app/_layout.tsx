import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/hooks/useColorScheme';
import { useDailyQuestStore, isCompletedOnDate, useConfigStore } from '@/utils/state';
import { initPurchases, hasProAccess } from '@/utils/purchases';

import { useTranslation } from '../i18n';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const TRIAL_DURATION_DAYS = 7;

export default function RootLayout() {
  const { setStreak } = useDailyQuestStore();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      initPurchases();
      checkProStatus();
      SplashScreen.hideAsync();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { quests } = useDailyQuestStore.getState();

      const allCompletedToday = quests.every(q => isCompletedOnDate(q.completedDates, today));
      if (!allCompletedToday) {
        setStreak(0);
      }
    }
  }, [loaded]);

  const checkProStatus = async () => {
    const proAccess = await hasProAccess();
    if (!proAccess) {
      router.replace('/paywall');
    }
  };

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{
          presentation: 'modal',
          headerTitle: t('settings.title'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="language" options={{
          presentation: 'modal',
          headerTitle: t('settings.language'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="notificationSettings" options={{
          presentation: 'modal',
          headerTitle: t('settings.notifications'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="paywall" options={{
          presentation: 'modal',
          headerShown: false,
        }}
        />
      </Stack>
    </ThemeProvider>
  );
}
