export const en = {
    // Navigation & Tabs
    tabs: {
        quests: "Quests",
        settings: "Settings",
        progress: "Progress"
    },

    // Quest Screen
    quests: {
        completedToday: "Completed Today",
        currentStreak: "Current Streak",
        longestStreak: "Longest Streak",
        startYourJourney: "Start Your Journey",
        createFirstQuest: "Create your first daily quest and begin building positive habits that last.",
        addQuest: "Add Quest",
        addQuestSubtext: "Add a new daily quest",
        editQuest: "Edit Quest",
        editQuestSubtext: "Update your daily quest",
        questDescription: "Quest Description",
        questDescriptionPlaceholder: "e.g., Drink 8 glasses of water, Exercise for 30 minutes...",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        deleteConfirmTitle: "Delete Quest",
        deleteConfirmMessage: "Are you sure you want to delete this quest? This action cannot be undone.",
        completed: "Completed",
        markComplete: "Mark Complete",
        totalContributions: "Total Activity",
        lastCompleted: "Last completed",
        color: "Quest Color",
        tipsHeadline: "Tips for success",
        tipsOne: "Be specific and measurable",
        tipsTwo: "Start small and build consistency",
        tipsThree: "Choose something you can do daily",
        today: "Today"
    },

    // Settings Screen
    settings: {
        title: "Settings",
        language: "Language",
        notifications: "Notifications",
        reminderNotifications: "Reminder Notifications",
        notificationMessageTitle: "Reminder",
        notificationMessage: "Don't forget to complete your daily tasks!",
        tos: "Terms of Service",
        privacyPolicy: "Privacy Policy",
        unlockFullAccess: "Unlock Full Access",
    },

    // Language Settings
    language: {
        title: "Language",
        english: "English",
        german: "Deutsch",
        french: "Français",
        italian: "Italiano",
        japanese: "日本語",
        chinese: "中文",
    },

    // Notification Settings
    notifications: {
        title: "Notifications",
        reminderNotifications: "Reminder Notifications",
        reminderTime: "Reminder Time",
        permissionRequired: "Permission Required",
        permissionMessage: "You need to enable notifications in your device settings to receive reminders.",
        infoMessage: "Daily reminders help you stay consistent with your quests and build lasting habits.",
        notificationTitle: "Daily Reminder",
        notificationBody: "Don't forget to complete your daily quests!",
    },

    // Common
    common: {
        ok: "OK",
        yes: "Yes",
        no: "No",
        done: "Done",
        close: "Close",
    },

    paywall: {
        title: "Start Your Free Trial",
        message: "Enjoy 7 days of full access for free.",
        featureNoAds: "✓ No Ads, No Subscriptions",
        featureOffline: "✓ 100% Local & Offline Accessible",
        featureLifetime: "✓ One-Time Purchase for Lifetime Access",
        trialInfo: "7 days free, then {price} once",
        disclaimerPrefix: "After the 7-day trial, you will ",
        disclaimerBold: "not",
        disclaimerSuffix: " be charged automatically. You will be asked to make a one-time payment to continue using the app.",
        startTrialButton: "Start 7-Day Free Trial",
        trialExpiredMessage: "Purchase the app to unlock all features and use it forever.",
        purchaseButton: "Purchase Full Access - {price} once",
        restorePurchaseButton: "Restore Purchase",
        errorTitle: "An Error Occurred",
        tryAgainButton: "Try Again",
        errorNoProducts: "Couldn't find any products.",
        errorFetchOfferings: "Error fetching offerings. Please check your connection or try again later.",
    }
} as const;
