import AsyncStorage from '@react-native-async-storage/async-storage'
import { ColorValue } from 'react-native';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getDeviceLanguage, Language } from '@/i18n/utils';

export type UserSettings = {
    version: number
    language: Language
    notificationsEnabled: boolean
    notificationHour: number
    notificationsPermission: boolean
    trialStartDate: Date | null
    setLanguage: (lang: Language) => void
    toggleNotificationsEnabled: () => void
    setNotificationHour: (hour: number) => void
    setTrialStartDate: (date: Date) => void
    clearTrialStartDate: () => void
}

export type DailyQuest = {
    uid: string
    streak: number
    longestStreak: number
    dailyDescription: string
    color: ColorValue
    completedDates: (Date | string)[]
    lastCompleted: Date | string | null
}

export type DailyQuestStore = {
    // total streak for if all quests were completed the day before on check
    streak: number
    longestStreak: number
    quests: DailyQuest[]
    selectedDate: Date;
    addQuest: (newQuest: DailyQuest) => void
    editQuest: (uid: string, description: string, color: ColorValue) => void
    toggleQuestCompletion: (uid: string, date: Date) => void
    deleteQuest: (uid: string) => void
    deleteAllQuest: () => void
    setStreak: (str: number) => void
    setSelectedDate: (date: Date) => void;
}

export const useDailyQuestStore = create<DailyQuestStore>()(
    persist(
        (set) => ({
            streak: 0,
            longestStreak: 0,
            quests: [],
            selectedDate: new Date(),
            addQuest: (newQuest: DailyQuest) => {
                set((state) => ({ quests: [...state.quests, newQuest] }))
            },
            editQuest: (uid: string, description: string, color: ColorValue) => {
                set((state) => ({
                    quests: state.quests.map((quest) =>
                        quest.uid === uid ? { ...quest, dailyDescription: description, color } : quest
                    ),
                }));
            },
            toggleQuestCompletion: (uid: string, date: Date) => {
                set((state) => {
                    const targetDate = new Date(date);
                    targetDate.setHours(0, 0, 0, 0);

                    const quests = state.quests.map((quest) => {
                        if (quest.uid === uid) {
                            const normalizedDates = quest.completedDates.map(d => {
                                const newDate = new Date(d);
                                newDate.setHours(0, 0, 0, 0);
                                return newDate;
                            });

                            const isCompleted = isCompletedOnDate(normalizedDates, targetDate);

                            let newCompletedDates;
                            if (isCompleted) {
                                newCompletedDates = normalizedDates.filter(
                                    (d) => d.getTime() !== targetDate.getTime()
                                );
                            } else {
                                newCompletedDates = [...normalizedDates, targetDate];
                            }

                            newCompletedDates.sort((a, b) => a.getTime() - b.getTime());

                            const newStreak = calculateStreak(newCompletedDates);
                            const newLongestStreak = Math.max(quest.longestStreak, newStreak);
                            const newLastCompleted = newCompletedDates.length > 0
                                ? newCompletedDates[newCompletedDates.length - 1]
                                : null;

                            return {
                                ...quest,
                                completedDates: newCompletedDates,
                                lastCompleted: newLastCompleted,
                                streak: newStreak,
                                longestStreak: newLongestStreak,
                            };
                        }
                        return quest;
                    });

                    const overallStreak = getOverallStreak(quests);
                    const newOverallLongestStreak = Math.max(state.longestStreak, overallStreak);

                    return {
                        quests,
                        streak: overallStreak,
                        longestStreak: newOverallLongestStreak,
                    };
                });
            },
            deleteQuest: (uid: string) => {
                set((state) => ({
                    quests: state.quests.filter((quest) => quest.uid !== uid),
                }));
            },
            deleteAllQuest: () => {
                set({ quests: [] });
            },
            setStreak: (str) => set({ streak: str }),
            setSelectedDate: (date: Date) => set({ selectedDate: date }),
        }),
        {
            name: 'daily-quests-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.quests = state.quests.map(quest => ({
                        ...quest,
                        completedDates: quest.completedDates.map(date =>
                            typeof date === 'string' ? new Date(date) : date
                        ),
                        lastCompleted: quest.lastCompleted
                            ? (typeof quest.lastCompleted === 'string'
                                ? new Date(quest.lastCompleted)
                                : quest.lastCompleted)
                            : null
                    }));
                    if (typeof state.selectedDate === 'string') {
                        state.selectedDate = new Date(state.selectedDate);
                    }

                    const today = new Date();
                    if (state.selectedDate.toDateString() !== today.toDateString()) {
                        state.selectedDate = today;
                    }
                }
            },
        }
    )
)

export const useConfigStore = create<UserSettings>()(
    persist(
        (set, get) => ({
            version: 0,
            language: getDeviceLanguage(),
            notificationsEnabled: false,
            notificationsPermission: false,
            notificationHour: 0,
            trialStartDate: null,
            setLanguage: (lang: Language) => set({ language: lang }),
            toggleNotificationsEnabled: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
            setNotificationHour: (hour: number) => set({ notificationHour: hour }),
            setTrialStartDate: (date: Date) => set({ trialStartDate: date }),
            clearTrialStartDate: () => set({ trialStartDate: null }),
        }),
        {
            name: 'user-settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    if (typeof state.trialStartDate === 'string') {
                        state.trialStartDate = new Date(state.trialStartDate);
                    }
                }
            }
        },
    )
)



export const isCompletedOnDate = (completedDates: (Date | string)[], date: Date): boolean => {
    const dateStr = date.toDateString();
    return completedDates.some((d) => {
        const dateObj = typeof d === 'string' ? new Date(d) : d;
        return dateObj instanceof Date && !isNaN(dateObj.getTime()) && dateObj.toDateString() === dateStr;
    });
};
const calculateStreak = (completedDates: Date[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates.map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestDate = sortedDates[0];
    latestDate.setHours(0, 0, 0, 0);

    if (latestDate.getTime() > today.getTime()) return 0;


    let streak = 1;
    let lastDate = new Date(latestDate);

    for (let i = 1; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        currentDate.setHours(0, 0, 0, 0);

        const expectedPreviousDay = new Date(lastDate);
        expectedPreviousDay.setDate(expectedPreviousDay.getDate() - 1);

        if (currentDate.getTime() === expectedPreviousDay.getTime()) {
            streak++;
            lastDate = currentDate;
        } else if (currentDate.getTime() < expectedPreviousDay.getTime()) {
            break;
        }
    }

    return streak;
};

export const getOverallStreak = (quests: DailyQuest[]): number => {
    if (quests.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!quests.every(q => isCompletedOnDate(q.completedDates, today))) {
        return 0;
    }

    let streak = 1;
    let previousDay = new Date(today);
    previousDay.setDate(previousDay.getDate() - 1);

    while (quests.every(q => isCompletedOnDate(q.completedDates, previousDay))) {
        streak++;
        previousDay.setDate(previousDay.getDate() - 1);
    }

    return streak;
};