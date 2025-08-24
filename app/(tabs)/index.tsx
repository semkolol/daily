import { useCallback, useEffect, useState, useRef } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, StatusBar, Animated, LayoutAnimation, Platform, UIManager, AppState, AppStateStatus } from 'react-native';
import { Text, View } from '@/components/design/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import QuestItem from '@/components/quests/QuestItem';
import { DailyQuest, useDailyQuestStore, isCompletedOnDate } from '@/utils/state';
import QuestModal from '@/components/quests/QuestModal';
import { useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from '@/i18n';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) UIManager.setLayoutAnimationEnabledExperimental(true);


export default function TabOneScreen() {
  const { quests, streak, longestStreak, selectedDate, setSelectedDate } = useDailyQuestStore();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState<DailyQuest | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        const today = new Date();
        const store = useDailyQuestStore.getState();
        if (store.selectedDate.toDateString() !== today.toDateString()) {
          store.setSelectedDate(new Date());
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!hasAnimated || fadeAnim.value === 0) {
        fadeAnim.setValue(0); // Reset to 0 before animating



        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start(() => {
          setHasAnimated(true);
        });
      }
    }, [fadeAnim, hasAnimated])
  );

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [quests]);

  const openAddModal = () => {
    setSelectedQuest(null);
    setModalVisible(true);
  };

  const openEditModal = (quest: DailyQuest) => {
    setSelectedQuest(quest);
    setModalVisible(true);
  };

  const completedOnSelectedDate = quests.filter(quest =>
    isCompletedOnDate(quest.completedDates, selectedDate)
  ).length;

  const changeDate = (amount: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
        <View style={styles.dateSelector}>
          <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateButton}>
            <SymbolView name="chevron.left" tintColor={isDarkMode ? 'white' : 'black'} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: isDarkMode ? 'white' : 'black' }]}>
            {isToday() ? t('quests.today') : selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateButton} disabled={isToday()}>
            <SymbolView name="chevron.right" tintColor={isToday() ? (isDarkMode ? '#555' : '#ccc') : (isDarkMode ? 'white' : 'black')} />
          </TouchableOpacity>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={styles.streakIcon}>✅</Text>
            <Text style={[styles.statsNumber, { color: isDarkMode ? '#ffffff' : '#000000' }]}>{`${completedOnSelectedDate}/${quests.length}`}</Text>
            <Text style={[styles.statsLabel, { color: isDarkMode ? '#aaaaaa' : '#666666' }]}>{t('quests.completedToday')}</Text>
          </View>
          <View style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={styles.streakIcon}>🔥</Text>
            <Text style={[styles.statsNumber, { color: isDarkMode ? '#ffffff' : '#000000' }]}>
              {streak}
            </Text>
            <Text style={[styles.statsLabel, { color: isDarkMode ? '#aaaaaa' : '#666666' }]}>{t('quests.currentStreak')}</Text>
          </View>
          <View style={[styles.statsCard, { backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }]}>
            <Text style={styles.streakIcon}>🏆</Text>
            <Text style={[styles.statsNumber, { color: isDarkMode ? '#ffffff' : '#000000' }]}>{longestStreak}</Text>
            <Text style={[styles.statsLabel, { color: isDarkMode ? '#aaaaaa' : '#666666' }]}>{t('quests.longestStreak')}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.content}>
        {quests.length === 0 ? (
          <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
            <Animated.View
              style={{
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              }}
            >
              <SymbolView name="trophy.fill" tintColor={isDarkMode ? '#444' : '#ddd'} type="hierarchical" size={64} style={styles.emptyIcon} />
            </Animated.View>
            <Text style={[styles.emptyTitle, { color: isDarkMode ? '#ffffff' : '#333' }]}>{t('quests.startYourJourney')}</Text>
            <Text style={[styles.emptyText, { color: isDarkMode ? '#aaaaaa' : '#666' }]}>
              {t('quests.createFirstQuest')}
            </Text>
          </Animated.View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <FlatList
              data={quests}
              keyExtractor={(item) => item.uid}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    }],
                  }}
                >
                  <QuestItem quest={item} onEdit={() => openEditModal(item)} selectedDate={selectedDate} />
                </Animated.View>
              )}
            />
          </Animated.View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.addButton, { shadowColor: isDarkMode ? '#000' : '#667eea' }]}
        onPress={openAddModal}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isDarkMode ? ['#ffffff', '#a0a0a0'] : ['#515151', '#000']}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SymbolView name="plus" tintColor={isDarkMode ? "black" : "white"} type="hierarchical" />
        </LinearGradient>
      </TouchableOpacity>

      <QuestModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        quest={selectedQuest}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  dateButton: {
    padding: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'transparent',
  },
  statsCard: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statsLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    borderRadius: 30,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 18,
  },
});