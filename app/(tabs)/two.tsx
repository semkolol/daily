import { Animated, ColorValue, Dimensions, FlatList, LayoutAnimation, StyleSheet } from 'react-native';
import { Text } from '@/components/design/Themed';
import { ContributionGraph } from "react-native-chart-kit";
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { DailyQuest, useDailyQuestStore } from '@/utils/state';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from '@/i18n';

export default function TabTwoScreen() {
  const { quests } = useDailyQuestStore();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const fadeAnim = new Animated.Value(0);

  useFocusEffect(
    useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim])
  );

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [quests]);

  const chartConfig: AbstractChartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 2,
    color: (opacity = 1) => isDarkMode ? `rgba(225, 255, 225, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
  };

  const getQuestChartConfig = (questColor: ColorValue): AbstractChartConfig => ({
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    decimalPlaces: 2,
    color: (opacity = 1) => `${questColor.toString()}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
  });

  // chart dimensions
  const width = Dimensions.get("window").width;
  const numDays = 114;
  const endDate = new Date();
  const handleToolTip: any = {};

  const totalDates = useMemo(() => {
    return quests.flatMap((quest: DailyQuest) =>
      quest.completedDates
        .map((date) => {
          // normalize to Date object
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          // check if it's a valid date
          if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            return null;
          }
          return {
            date: dateObj.toISOString().split("T")[0], // YYYY-MM-DD format
            count: 1,
          };
        })
        .filter(Boolean) // remove null entries
    );
  }, [quests]);

  const getQuestDates = useCallback((quest: DailyQuest) => {
    return quest.completedDates
      .map((date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
          return null;
        }
        return {
          date: dateObj.toISOString().split("T")[0], // YYYY-MM-DD format
          count: 1,
        };
      })
      .filter(Boolean); // remove null entries
  }, []);

  return (
    <Animated.View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' }]}>
      {/* Total Contributions Chart */}
      <Text style={styles.title}>{t('quests.totalContributions')}</Text>
      <ContributionGraph
        values={totalDates}
        endDate={endDate}
        numDays={numDays}
        width={width}
        height={220}
        chartConfig={chartConfig}
        tooltipDataAttrs={handleToolTip}
      />

      {/* Individual Quest Charts */}
      <Animated.View style={[styles.container, { opacity: fadeAnim, flex: 1 }]}>
        <FlatList
          data={quests}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Animated.View
              style={[{
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                }],
              }, styles.container]}
            >
              <Text style={styles.title}>{item.dailyDescription}</Text>
              <ContributionGraph
                values={getQuestDates(item)}
                endDate={endDate}
                numDays={numDays}
                width={width}
                height={220}
                chartConfig={getQuestChartConfig(item.color)}
                tooltipDataAttrs={handleToolTip}
              />
            </Animated.View>
          )}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  list: {
    paddingBottom: 100,
  },
});