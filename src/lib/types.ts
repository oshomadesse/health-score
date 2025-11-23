export interface HealthData {
    sleep: {
        totalHours: number; // e.g. 7.5
        deepSleepPercentage: number; // e.g. 25 (percent)
        wakeCount: number;
    };
    activity: {
        steps: number;
        calories: number;
    };
    heartRate: {
        resting: number; // bpm
    };
}

export interface ScoreBreakdown {
    total: number;
    sleep: number;
    steps: number;
    calories: number;
    heartRate: number;
}

export interface ScoreComponent {
    label: string;
    value: number; // 0-100
    weight: number; // 0-1
    score: number; // value * weight
    color: string;
}
