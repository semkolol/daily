import React from 'react';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/hooks/useColorScheme';
import { useClientOnlyValue } from '@/components/hooks/useClientOnlyValue';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from '@/i18n';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Daily',
          tabBarIcon: ({ color }) => <SymbolView name="scroll" tintColor={color} type="hierarchical" />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: t('tabs.progress'),
          tabBarIcon: ({ color }) => <SymbolView name="chart.bar" tintColor={color} type="hierarchical" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color }) => <SymbolView name="gearshape" tintColor={color} type="hierarchical" />,
        }}
      />
    </Tabs>
  );
}
