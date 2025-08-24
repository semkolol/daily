// i18n/jp.ts
export const jp = {
    tabs: {
        quests: "クエスト",
        settings: "設定",
        progress: "進捗"
    },

    quests: {
        completedToday: "今日完了",
        currentStreak: "現在の連続記録",
        longestStreak: "最長連続記録",
        startYourJourney: "旅を始めよう",
        createFirstQuest: "最初の日課クエストを作成して、持続的な良い習慣を築き始めましょう。",
        addQuest: "クエスト追加",
        addQuestSubtext: "新しい毎日のクエストを追加",
        editQuest: "クエスト編集",
        editQuestSubtext: "毎日のクエストを更新",
        questDescription: "クエストタイトル",
        questDescriptionPlaceholder: "例：水を8杯飲む、30分間運動する...",
        save: "保存",
        cancel: "キャンセル",
        delete: "削除",
        deleteConfirmTitle: "クエスト削除",
        deleteConfirmMessage: "このクエストを削除してもよろしいですか？この操作は元に戻せません。",
        completed: "完了",
        markComplete: "完了にする",
        totalContributions: "総貢献",
        lastCompleted: "最後に完了",
        color: "クエストの色",
        tipsHeadline: "成功のためのヒント",
        tipsOne: "具体的かつ測定可能であること",
        tipsTwo: "小さく始めて一貫性を築く",
        tipsThree: "毎日できることを選ぶ",
        today: "今日"
    },

    settings: {
        title: "設定",
        language: "言語",
        notifications: "通知",
        reminderNotifications: "リマインダー通知",
        notificationMessageTitle: "リマインダー",
        notificationMessage: "毎日のタスクを完了するのを忘れないでください！",
        tos: "利用規約",
        privacyPolicy: "プライバシーポリシー",
        unlockFullAccess: "フルアクセスをアンロック",
    },

    language: {
        title: "言語",
        english: "English",
        german: "Deutsch",
        french: "Français",
        italian: "Italiano",
        japanese: "日本語",
        chinese: "中文",
    },

    notifications: {
        title: "通知",
        reminderNotifications: "リマインダー通知",
        reminderTime: "リマインダー時刻",
        permissionRequired: "権限が必要です",
        permissionMessage: "リマインダーを受け取るには、デバイス設定で通知を有効にする必要があります。",
        infoMessage: "毎日のリマインダーは、クエストを継続し、持続的な習慣を築くのに役立ちます。",
        notificationTitle: "日課リマインダー",
        notificationBody: "日課クエストを完了することを忘れないでください！",
    },

    common: {
        ok: "OK",
        yes: "はい",
        no: "いいえ",
        done: "完了",
        close: "閉じる",
    },

    paywall: {
        title: "無料トライアルを開始",
        message: "7日間、全機能を無料でお楽しみください。",
        featureNoAds: "✓ 広告なし、サブスクリプションなし",
        featureOffline: "✓ 100%ローカル＆オフラインでアクセス可能",
        featureLifetime: "✓ ライフタイムアクセスのための1回限りの購入",
        trialInfo: "7日間無料、その後{price}で一回限り",
        disclaimerPrefix: "7日間のトライアル後、自動的に課金されることは",
        disclaimerBold: "ありません",
        disclaimerSuffix: "。アプリを引き続き使用するには、1回限りの支払いを行うよう求められます。",
        startTrialButton: "7日間の無料トライアルを開始",
        trialExpiredMessage: "アプリを購入して全機能のロックを解除し、永久に使用しましょう。",
        purchaseButton: "フルアクセスを購入 - {price}",
        restorePurchaseButton: "購入を復元",
        errorTitle: "エラーが発生しました",
        tryAgainButton: "再試行",
        errorNoProducts: "販売する商品が見つかりませんでした。",
        errorFetchOfferings: "オファーの取得中にエラーが発生しました。接続を確認するか、後で再試行してください。",
    }
} as const;