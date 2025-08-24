// app/paywall.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, SafeAreaView, ActivityIndicator, TouchableOpacity, Image, Linking } from 'react-native';
import { makePurchase, restorePurchase, hasProAccess } from '@/utils/purchases';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useConfigStore } from '@/utils/state';
import { router, useLocalSearchParams } from 'expo-router';
import { Text, useThemeColor, View } from '@/components/design/Themed';
import { useTranslation, t as translate } from '@/i18n';

const CustomButton = ({ title, onPress, style, textStyle, disabled }: { title: string, onPress: () => void, style?: any, textStyle?: any, disabled?: boolean }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} disabled={disabled}>
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
);

const LegalLinks = () => (
    <View style={styles.legalLinksContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://brodvey.de/pp')}>
            <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={{ width: 20 }} />
        <TouchableOpacity onPress={() => Linking.openURL('https://brodvey.de/tos')}>
            <Text style={styles.legalLink}>Terms of Service</Text>
        </TouchableOpacity>
    </View>
);

export default function PaywallScreen() {
    const { t } = useTranslation();
    const { trialStartDate, setTrialStartDate } = useConfigStore();
    const [offering, setOffering] = useState<PurchasesPackage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);

    const buttonBackgroundColor = useThemeColor({ light: '#000', dark: '#fff' }, 'background');
    const buttonPrimaryTextColor = useThemeColor({ light: '#fff', dark: '#000' }, 'text');
    const buttonTextColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');

    const params = useLocalSearchParams();
    const fromSettings = params.from === 'settings';

    const getOfferings = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current && offerings.current.availablePackages.length > 0) {
                setOffering(offerings.current.availablePackages[0]);
            } else {
                setError(translate('paywall.errorNoProducts'));
            }
        } catch (e) {
            console.error('Error getting offerings:', e);
            setError(translate('paywall.errorFetchOfferings'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const checkAccess = async () => {
            const proAccess = await hasProAccess();
            if (proAccess) {
                router.replace('/(tabs)');
                return;
            }

            if (trialStartDate && !fromSettings) {
                const trialEndDate = new Date(new Date(trialStartDate).setDate(new Date(trialStartDate).getDate() + 7));
                if (new Date() < trialEndDate) {
                    router.replace('/(tabs)');
                } else {
                    setShowPaywall(true);
                    getOfferings();
                }
            } else if (trialStartDate && fromSettings) {
                setShowPaywall(true);
                getOfferings();
            } else {
                setShowPaywall(true);
                setIsLoading(false);
            }
        };

        checkAccess();
    }, [trialStartDate, getOfferings, fromSettings]);

    const handleStartTrial = () => {
        setTrialStartDate(new Date());
    };

    const handleMakePurchase = async () => {
        if (!offering) return;
        setIsPurchasing(true);
        await makePurchase(offering);
    };

    const handleRestorePurchase = async () => {
        setIsPurchasing(true);
        await restorePurchase();
    };

    if (!showPaywall || (isLoading && !error)) {
        return (
            <SafeAreaView style={[styles.container]}>
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    // Pre-Trial View
    if (!trialStartDate) {
        return (
            <SafeAreaView style={[styles.container]}>
                <View style={[styles.content, { backgroundColor: 'transparent' }]}>
                    <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                    <Text style={[styles.title]}>{t('paywall.title')}</Text>
                    <Text style={[styles.message]}>
                        {t('paywall.message')}
                    </Text>
                    <View style={[styles.featureList, { backgroundColor: 'transparent' }]}>
                        <Text style={[styles.featureText]}>{t('paywall.featureNoAds')}</Text>
                        <Text style={[styles.featureText]}>{t('paywall.featureOffline')}</Text>
                        <Text style={[styles.featureText]}>{t('paywall.featureLifetime')}</Text>
                    </View>
                    {offering && (
                        <Text style={[styles.trialInfo]}>
                            {t('paywall.trialInfo').replace('{price}', offering.product.priceString)}
                        </Text>
                    )}
                    <CustomButton
                        title={t('paywall.startTrialButton')}
                        onPress={handleStartTrial}
                        style={{ backgroundColor: buttonBackgroundColor }}
                        textStyle={{ color: buttonPrimaryTextColor }}
                    />
                    <CustomButton
                        title={t('paywall.restorePurchaseButton')}
                        onPress={handleRestorePurchase}
                        disabled={isPurchasing}
                        style={{ backgroundColor: 'transparent', borderColor: buttonTextColor, borderWidth: 1, opacity: isPurchasing ? 0.7 : 1 }}
                    />
                    <Text style={[styles.disclaimer]}>
                        {t('paywall.disclaimerPrefix')}
                        <Text style={{ fontWeight: 'bold' }}>{t('paywall.disclaimerBold')}</Text>
                        {t('paywall.disclaimerSuffix')}
                    </Text>
                    <LegalLinks />
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container]}>
                <View style={[styles.content, { backgroundColor: 'transparent' }]}>
                    <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                    <Text style={[styles.title]}>{t('paywall.errorTitle')}</Text>
                    <Text style={[styles.message]}>{error}</Text>
                    <CustomButton
                        title={t('paywall.tryAgainButton')}
                        onPress={getOfferings}
                        style={{ backgroundColor: buttonBackgroundColor }}
                        textStyle={{ color: buttonTextColor }}
                    />
                    <CustomButton
                        title={t('paywall.restorePurchaseButton')}
                        onPress={handleRestorePurchase}
                        style={{ backgroundColor: 'transparent', borderWidth: 1 }}
                    />
                    <LegalLinks />
                </View>
            </SafeAreaView>
        );
    }

    if (!offering) {
        return (
            <SafeAreaView style={[styles.container]}>
                <View style={[styles.content, { backgroundColor: 'transparent' }]}>
                    <Text style={[styles.title]}>{t('paywall.errorTitle')}</Text>
                    <Text style={[styles.message]}>{t('paywall.errorNoProducts')}</Text>
                    <CustomButton title={t('paywall.tryAgainButton')} onPress={getOfferings} />
                    <LegalLinks />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={[styles.container]}>
            <View style={[styles.content, { backgroundColor: 'transparent' }]}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                <Text style={[styles.title]}>{t('settings.unlockFullAccess')}</Text>
                <Text style={[styles.message]}>
                    {t('paywall.trialExpiredMessage')}
                </Text>
                <View style={[styles.featureList, { backgroundColor: 'transparent' }]}>
                    <Text style={[styles.featureText]}>{t('paywall.featureNoAds')}</Text>
                    <Text style={[styles.featureText]}>{t('paywall.featureOffline')}</Text>
                    <Text style={[styles.featureText]}>{t('paywall.featureLifetime')}</Text>
                </View>
                <CustomButton
                    title={isPurchasing ? "Purchasing..." : t('paywall.purchaseButton').replace('{price}', offering.product.priceString)}
                    onPress={handleMakePurchase}
                    disabled={isPurchasing}
                    style={{ backgroundColor: buttonBackgroundColor, opacity: isPurchasing ? 0.7 : 1 }}
                    textStyle={{ color: buttonPrimaryTextColor }}
                />
                <CustomButton
                    title={t('paywall.restorePurchaseButton')}
                    onPress={handleRestorePurchase}
                    disabled={isPurchasing}
                    style={{ backgroundColor: 'transparent', borderColor: buttonTextColor, borderWidth: 1, opacity: isPurchasing ? 0.7 : 1 }}
                />
                <LegalLinks />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 40,
        resizeMode: 'contain',
        borderRadius: 20
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    message: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    trialInfo: {
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
        lineHeight: 24,
    },
    featureList: {
        marginBottom: 30,
        alignItems: 'flex-start',
    },
    featureText: {
        fontSize: 17,
        marginBottom: 12,
    },
    disclaimer: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    legalLinksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
        backgroundColor: 'transparent',
    },
    legalLink: {
        fontSize: 12,
        color: 'grey',
        textDecorationLine: 'underline',
    },
});
