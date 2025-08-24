import React, { useState, useEffect } from 'react';
import {
    TextInput,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    useColorScheme,
    View as RNView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Text, View } from '@/components/design/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { DailyQuest, useDailyQuestStore } from '@/utils/state';
import { SymbolView } from 'expo-symbols';
import { ColorValue } from 'react-native';
import { useTranslation } from '@/i18n';

type QuestModalProps = {
    visible: boolean;
    onClose: () => void;
    quest: DailyQuest | null;
};

const { width } = Dimensions.get('window');

const predefinedColors: ColorValue[] = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEEAD', // Yellow
    '#D4A5A5', // Pink
];

const QuestModal = ({ visible, onClose, quest }: QuestModalProps) => {
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState<ColorValue>(quest?.color || predefinedColors[0]);
    const [slideAnim] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));
    const { addQuest, editQuest, deleteQuest } = useDailyQuestStore();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const isEditing = !!quest;

    useEffect(() => {
        setDescription(quest ? quest.dailyDescription : '');
        setSelectedColor(quest?.color || predefinedColors[0]);
    }, [quest]);

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 1,
                    tension: 65,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleSave = () => {
        if (!description.trim()) return;

        if (quest) {
            editQuest(quest.uid, description.trim(), selectedColor);
        } else {
            const newQuest: DailyQuest = {
                uid: Date.now().toString(),
                dailyDescription: description.trim(),
                color: selectedColor,
                streak: 0,
                longestStreak: 0,
                completedDates: [],
                lastCompleted: null,
            };
            addQuest(newQuest);
        }
        onClose();
    };

    const handleDelete = () => {
        if (quest) {
            deleteQuest(quest.uid);
            onClose();
        }
    };

    const modalTransform = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    const modalScale = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.9, 1],
    });

    return (
        <Modal
            visible={visible}
            animationType="none"
            transparent
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Animated.View
                    style={[
                        styles.modalOverlay,
                        { opacity: fadeAnim, backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.6)' },
                    ]}
                >
                    <TouchableOpacity
                        style={styles.overlayTouchable}
                        activeOpacity={1}
                        onPress={onClose}
                    />

                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: modalTransform }, { scale: modalScale }],
                                backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
                            },
                        ]}
                    >
                        {/* Header */}
                        <View style={[styles.modalHeader, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fc' }]}>
                            <View style={styles.headerContent}>
                                <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)' }]}>
                                    {quest ? (
                                        <SymbolView name="pencil" tintColor="#667eea" type="hierarchical" size={24} />
                                    ) : (
                                        <SymbolView name="plus.circle" tintColor="#667eea" type="hierarchical" size={24} />
                                    )}
                                </View>
                                <View style={styles.titleContainer}>
                                    <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#2c3e50' }]}>
                                        {quest ? t('quests.editQuest') : t('quests.addQuest')}
                                    </Text>
                                    <Text style={[styles.modalSubtitle, { color: isDarkMode ? '#aaaaaa' : '#6c757d' }]}>
                                        {quest ? t('quests.editQuestSubtext') : t('quests.addQuestSubtext')}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={[styles.closeButton, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(108, 117, 125, 0.1)' }]}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <SymbolView name="xmark" tintColor={isDarkMode ? '#ffffff' : '#6c757d'} type="hierarchical" size={16} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Content */}
                        <View style={styles.modalContent}>
                            <Text style={[styles.inputLabel, { color: isDarkMode ? '#ffffff' : '#2c3e50' }]}>{t('quests.questDescription')}</Text>
                            <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fc', borderColor: isDarkMode ? '#444' : '#e9ecef' }]}>
                                <TextInput
                                    style={[styles.input, { color: isDarkMode ? '#ffffff' : '#2c3e50' }]}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder={t('quests.questDescriptionPlaceholder')}
                                    placeholderTextColor={isDarkMode ? '#666' : '#a0a0a0'}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                    autoFocus
                                />
                            </View>

                            <Text style={[styles.inputLabel, { color: isDarkMode ? '#ffffff' : '#2c3e50' }]}>{t('quests.color')}</Text>
                            <RNView style={styles.colorPicker}>
                                {predefinedColors.map((color) => (
                                    <TouchableOpacity
                                        key={color.toString()}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color },
                                            selectedColor === color && { borderWidth: 2, borderColor: isDarkMode ? '#ffffff' : '#212121' },

                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    />
                                ))}
                            </RNView>

                            {/* Tips */}
                            <View style={[styles.tipsContainer, { backgroundColor: isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)', borderLeftColor: '#667eea' }]}>
                                <Text style={[styles.tipsTitle, { color: isDarkMode ? '#ffffff' : '#667eea' }]}>💡 {t('quests.tipsHeadline')}:</Text>
                                <Text style={[styles.tipText, { color: isDarkMode ? '#aaaaaa' : '#6c757d' }]}>• {t('quests.tipsOne')}</Text>
                                <Text style={[styles.tipText, { color: isDarkMode ? '#aaaaaa' : '#6c757d' }]}>• {t('quests.tipsTwo')}</Text>
                                <Text style={[styles.tipText, { color: isDarkMode ? '#aaaaaa' : '#6c757d' }]}>• {t('quests.tipsThree')}</Text>
                            </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.modalActions}>
                            {isEditing && (
                                <TouchableOpacity
                                    style={[styles.deleteButton, { backgroundColor: isDarkMode ? '#FF3B30' : '#FF453A', borderColor: isDarkMode ? '#FF453A' : '#FF3B30' }]}
                                    onPress={handleDelete}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.deleteButtonText}>{t('quests.delete')}</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[styles.cancelButton, { backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fc', borderColor: isDarkMode ? '#444' : '#e9ecef' }]}
                                onPress={onClose}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.cancelButtonText, { color: isDarkMode ? '#ffffff' : '#6c757d' }]}>{t('quests.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, !description.trim() && styles.saveButtonDisabled]}
                                onPress={handleSave}
                                disabled={!description.trim()}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={description.trim() ? ['#667eea', '#764ba2'] : [isDarkMode ? '#444' : '#e9ecef', isDarkMode ? '#444' : '#e9ecef']}
                                    style={styles.saveButtonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <Text
                                        style={[styles.saveButtonText, !description.trim() && { color: isDarkMode ? '#666' : '#6c757d' }]}
                                    >
                                        {quest ? t('quests.save') : t('quests.addQuest')}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    overlayTouchable: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: Math.min(width - 40, 400),
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
    },
    modalHeader: {
        paddingTop: 24,
        paddingBottom: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    titleContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 24,
        backgroundColor: 'transparent',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    inputContainer: {
        borderRadius: 16,
        borderWidth: 2,
        marginBottom: 20,
    },
    input: {
        padding: 16,
        fontSize: 16,
        minHeight: 80,
        lineHeight: 22,
    },
    colorPicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    tipsContainer: {
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 2,
    },
    modalActions: {
        flexDirection: 'row',
        padding: 24,
        paddingTop: 0,
        backgroundColor: 'transparent',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        overflow: 'hidden',
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    deleteButton: {
        flex: 1,
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});

export default QuestModal;