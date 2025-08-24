// utils/purchases.ts
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { useConfigStore } from './state';

const API_KEYS = {
    apple: 'appl_vqTpGFLXJibxmCDsspTnlXpumnW',
    google: 'goog_jlcbsTqYqHhYjYVfJkZdZUWjZqC',
};

const entitlementId = 'dailyOnce';

export const initPurchases = () => {
    if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: API_KEYS.apple });
    } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: API_KEYS.google });
    }

    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
        const proAccess = customerInfo.entitlements.active[entitlementId] !== undefined;
        if (proAccess) {
            const { trialStartDate, clearTrialStartDate } = useConfigStore.getState();
            if (trialStartDate) {
                clearTrialStartDate();
            }
            router.replace('/(tabs)');
        }
    });
};

export const hasProAccess = async (): Promise<boolean> => {
    try {
        const customerInfo = await Purchases.getCustomerInfo();
        return customerInfo.entitlements.active[entitlementId] !== undefined;
    } catch (e) {
        console.error('Error checking pro access:', e);
        return false;
    }
};

export const makePurchase = async (pack: PurchasesPackage) => {
    try {
        await Purchases.purchasePackage(pack);
    } catch (e) {
        if (!e.userCancelled) {
            console.error('Error making purchase:', e);
        }
    }
};

export const restorePurchase = async () => {
    try {
        await Purchases.restorePurchases();
    } catch (e) {
        console.error('Error restoring purchase:', e);
    }
}
