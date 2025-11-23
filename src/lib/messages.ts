export const getConditionMessage = (score: number): { title: string; description: string; highlight: string } => {
    if (score >= 90) {
        return {
            title: "神レベルのコンディション",
            description: "信じられないほどの活力です！今日は何をやっても上手くいくでしょう。新しいことに挑戦する絶好のチャンスです。",
            highlight: "神"
        };
    } else if (score >= 80) {
        return {
            title: "絶好調！",
            description: "しょーまの活力は最高潮です。質の高い睡眠と適度な活動がスコアを押し上げています。このリズムを維持しましょう！",
            highlight: "最高"
        };
    } else if (score >= 70) {
        return {
            title: "かなり良い調子",
            description: "心身ともに充実しています。集中力が高まっているので、重要なタスクを片付けるのに適しています。",
            highlight: "充実"
        };
    } else if (score >= 60) {
        return {
            title: "良好なコンディション",
            description: "安定した状態です。少しの運動やリラックスでさらにスコアアップが狙えます。",
            highlight: "良好"
        };
    } else if (score >= 50) {
        return {
            title: "平均的な状態",
            description: "可もなく不可もなく、フラットな状態です。無理せずマイペースに過ごすのが吉です。",
            highlight: "普通"
        };
    } else if (score >= 40) {
        return {
            title: "あと一歩",
            description: "少し疲れが溜まっているかもしれません。早めの休息や軽いストレッチを取り入れてみましょう。",
            highlight: "注意"
        };
    } else if (score >= 30) {
        return {
            title: "お疲れ気味です",
            description: "疲労の色が見えます。今日は早めに仕事を切り上げて、ゆっくりお風呂に浸かりましょう。",
            highlight: "疲労"
        };
    } else if (score >= 20) {
        return {
            title: "休息を優先してください",
            description: "エネルギーが枯渇しつつあります。パフォーマンスが低下しているので、無理は禁物です。",
            highlight: "休息"
        };
    } else if (score >= 10) {
        return {
            title: "限界が近いです",
            description: "心身ともに悲鳴を上げています。今すぐ休むことを強く推奨します。",
            highlight: "警告"
        };
    } else {
        return {
            title: "緊急チャージが必要",
            description: "バッテリー切れです。今日は何もせず、ひたすら眠ることを許してください。",
            highlight: "緊急"
        };
    }
};
