import React from 'react';
import { StyleSheet, Pressable, useColorScheme, SafeAreaView, Platform } from 'react-native';
import { useConfigStore, Language } from '../utils/state';
import { SymbolView } from 'expo-symbols';
import { View, Text } from '@/components/design/Themed';

const languages = {
    en: "English",
    de: "Deutsch",
    fr: "Français",
    it: "Italiano",
    jp: "日本語",
    zh: "中文"
};

export default function LanguageSettings() {
    const { language, setLanguage } = useConfigStore();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const handleLanguageChange = (code: Language) => {
        setLanguage(code);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.group}>
                    <View style={[styles.groupContainer, { backgroundColor: isDarkMode ? '#151515' : '#ffffff' }]}>
                        {Object.entries(languages).map(([code, name], index) => (
                            <React.Fragment key={code}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.languageRow,
                                        { opacity: pressed ? 0.6 : 1 }
                                    ]}
                                    onPress={() => handleLanguageChange(code as Language)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Text style={styles.languageText}>{name}</Text>
                                    <View style={styles.languageRight} pointerEvents="none">
                                        {language === code && (
                                            <SymbolView
                                                name="checkmark"
                                                tintColor='#007AFF'
                                                type="hierarchical"
                                                size={16}
                                            />
                                        )}
                                    </View>
                                </Pressable>

                                {index < Object.entries(languages).length - 1 && (
                                    <View style={[styles.separator, { backgroundColor: isDarkMode ? '#555555' : '#C6C6C8' }]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingTop: 20,
        backgroundColor: 'transparent',
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
    languageRow: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 44,
    },
    languageText: {
        fontSize: 17,
        fontWeight: '400',
    },
    languageRight: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        minWidth: 20,
        justifyContent: 'flex-end',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: 16,
    },
});