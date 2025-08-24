// i18n/zh.ts
export const zh = {
    tabs: {
        quests: "任务",
        settings: "设置",
        progress: "进步"
    },

    quests: {
        completedToday: "今日完成",
        currentStreak: "当前连续记录",
        longestStreak: "最长连续记录",
        startYourJourney: "开始你的旅程",
        createFirstQuest: "创建你的第一个日常任务，开始建立持久的积极习惯。",
        addQuest: "添加任务",
        addQuestSubtext: "添加新的每日任务",
        editQuest: "编辑任务",
        editQuestSubtext: "更新你的每日任务",
        questDescription: "任务标题",
        questDescriptionPlaceholder: "例如，喝8杯水，锻炼30分钟...",
        save: "保存",
        cancel: "取消",
        delete: "删除",
        deleteConfirmTitle: "删除任务",
        deleteConfirmMessage: "确定要删除这个任务吗？此操作无法撤销。",
        completed: "已完成",
        markComplete: "标记完成",
        totalContributions: "总贡献",
        lastCompleted: "最后完成",
        color: "任务颜色",
        tipsHeadline: "成功的建议",
        tipsOne: "要具体且可衡量",
        tipsTwo: "从小开始，建立一致性",
        tipsThree: "选择你每天都能做的事情",
        today: "今天"
    },

    settings: {
        title: "设置",
        language: "语言",
        notifications: "通知",
        reminderNotifications: "提醒通知",
        notificationMessageTitle: "提醒",
        notificationMessage: "别忘了完成你的每日任务！",
        tos: "服务条款",
        privacyPolicy: "隐私政策",
        unlockFullAccess: "解锁完整访问权限",
    },

    language: {
        title: "语言",
        english: "English",
        german: "Deutsch",
        french: "Français",
        italian: "Italiano",
        japanese: "日本語",
        chinese: "中文",
    },

    notifications: {
        title: "通知",
        reminderNotifications: "提醒通知",
        reminderTime: "提醒时间",
        permissionRequired: "需要权限",
        permissionMessage: "你需要在设备设置中启用通知才能接收提醒。",
        infoMessage: "每日提醒帮助你保持任务的连续性，建立持久的习惯。",
        notificationTitle: "每日提醒",
        notificationBody: "别忘了完成你的日常任务！",
    },

    common: {
        ok: "确定",
        yes: "是",
        no: "否",
        done: "完成",
        close: "关闭",
    },

    paywall: {
        title: "开始免费试用",
        message: "免费享受7天完整访问权限。",
        featureNoAds: "✓ 无广告，无订阅",
        featureOffline: "✓ 100%本地和离线访问",
        featureLifetime: "✓ 一次性购买，终身访问",
        trialInfo: "7天免费，之后{price}一次",
        disclaimerPrefix: "7天试用期后，您将",
        disclaimerBold: "不会",
        disclaimerSuffix: "被自动收费。您将被要求进行一次性付款以继续使用该应用程序。",
        startTrialButton: "开始7天免费试用",
        trialExpiredMessage: "购买应用程序以解锁所有功能并永久使用。",
        purchaseButton: "购买完整访问权限 - {price}",
        restorePurchaseButton: "恢复购买",
        errorTitle: "发生错误",
        tryAgainButton: "再试一次",
        errorNoProducts: "找不到任何可供销售的产品。",
        errorFetchOfferings: "获取产品时出错。请检查您的网络连接或稍后重试。",
    }
} as const;