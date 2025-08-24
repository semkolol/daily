import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Easing, useColorScheme, ColorValue } from 'react-native';
import { Text, View } from '@/components/design/Themed';
import { DailyQuest, useDailyQuestStore, isCompletedOnDate } from '@/utils/state';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import { useTranslation } from '@/i18n';
import { hexToRGBA } from '@/utils/utils';

type QuestItemProps = { quest: DailyQuest; onEdit: () => void; selectedDate: Date };

const QuestItem = ({ quest, onEdit, selectedDate }: QuestItemProps) => {
    const { toggleQuestCompletion } = useDailyQuestStore();
    const { t } = useTranslation();

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [scaleAnim] = useState(new Animated.Value(1));
    const [completedAnim] = useState(new Animated.Value(0));

    const isCompletedOnSelectedDate = isCompletedOnDate(quest.completedDates, selectedDate);

    useEffect(() => {
        Animated.timing(completedAnim, {
            toValue: isCompletedOnSelectedDate ? 1 : 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isCompletedOnSelectedDate]);

    const handleCompletePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
        toggleQuestCompletion(quest.uid, selectedDate);
    };

    const getStreakColor = (streak: number): ColorValue[] => {
        if (streak >= 30) return ['#FF6B35', '#FF8E3C']; // Fire red to orange
        if (streak >= 14) return ['#FF8E3C', '#FFB627']; // Orange to yellow
        if (streak >= 7) return ['#FFB627', '#8AC926']; // Yellow to green
        if (streak >= 3) return ['#8AC926', '#28a745']; // Green shades
        return ['#6C757D', '#495057']; // Gray shades
    };

    const backgroundColor = completedAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [isDarkMode ? hexToRGBA(quest.color.toString(), 0.2) : hexToRGBA(quest.color.toString(), 0.1), isDarkMode ? '#2a3a2a' : '#f8fff8'],
    });

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <Animated.View style={[styles.card, { backgroundColor, borderColor: isDarkMode ? '#444' : '#e9ecef', }]}>
                {/* Left content */}
                <View style={styles.leftContent}>
                    <Text style={[
                        styles.description,
                        isCompletedOnSelectedDate && styles.completedText,
                        { color: isDarkMode ? '#ffffff' : '#000000' }
                    ]}>
                        {quest.dailyDescription}
                    </Text>

                    <Text style={[styles.dateText, { color: isDarkMode ? '#aaaaaa' : '#6c757d' }]}>
                        {t('quests.lastCompleted')}: {quest.lastCompleted
                            ? new Date(quest.lastCompleted).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })
                            : 'Never'
                        }
                    </Text>

                    {/* Streak badges */}
                    <View style={styles.streakContainer}>
                        <LinearGradient
                            colors={getStreakColor(quest.streak)}
                            style={styles.streakBadge}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.streakIcon}>🔥</Text>
                            <Text style={styles.streakText}>{quest.streak}</Text>
                        </LinearGradient>

                        <View style={[styles.bestStreakBadge, { backgroundColor: isDarkMode ? '#2c2c2c' : '#fff3cd' }]}>
                            <Text style={styles.bestStreakIcon}>🏆</Text>
                            <Text style={[styles.bestStreakText, { color: isDarkMode ? '#ffffff' : '#856404' }]}>
                                {quest.longestStreak}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Right actions */}
                <View style={styles.rightContent}>
                    <TouchableOpacity
                        onPress={handleCompletePress}
                        style={[
                            styles.actionButton,
                            styles.completeButton,
                            isCompletedOnSelectedDate && styles.completedButton
                        ]}
                        activeOpacity={0.7}
                    >
                        {isCompletedOnSelectedDate ? (
                            <LinearGradient
                                colors={['#28a745', '#20c997']}
                                style={styles.buttonGradient}
                            >
                                <SymbolView name="checkmark" tintColor="white" type="hierarchical" size={20} />
                            </LinearGradient>
                        ) : (
                            <View style={[styles.incompleteButton, { borderColor: isDarkMode ? '#444' : '#6c757d' }]}>
                                <SymbolView name="checkmark" tintColor={isDarkMode ? '#ffffff' : '#6c757d'} type="hierarchical" size={20} />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onEdit}
                        style={[styles.actionButton, styles.editButton, { borderColor: isDarkMode ? '#444' : '#6c757d' }]}
                        activeOpacity={0.7}
                    >
                        <SymbolView name="pencil" tintColor={isDarkMode ? '#ffffff' : '#6c757d'} type="hierarchical" size={18} />
                    </TouchableOpacity>
                </View>

                {/* Completion indicator line */}
                {isCompletedOnSelectedDate && (
                    <View style={[styles.completionIndicator, { backgroundColor: isDarkMode ? '#28a745' : '#28a745' }]} />
                )}
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    leftContent: {
        flex: 1,
        paddingRight: 15,
        backgroundColor: 'transparent',
    },
    rightContent: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        gap: 12,
    },
    description: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        lineHeight: 24,
    },
    completedText: {
        color: '#27ae60',
    },
    dateText: {
        fontSize: 14,
        marginBottom: 12,
        fontWeight: '500',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    streakIcon: {
        fontSize: 14,
    },
    streakText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    bestStreakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    bestStreakIcon: {
        fontSize: 14,
    },
    bestStreakText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completeButton: {
        marginBottom: 4,
    },
    completedButton: {
        shadowColor: '#28a745',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    incompleteButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: 'transparent'
    },
    editButton: {
        borderWidth: 1,
    },
    completionIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
    },
});

export default QuestItem;