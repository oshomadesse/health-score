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
    stress: {
        average: number; // 0-100
    };
    heartRate: {
        resting: number; // bpm
    };
    spo2: {
        average: number; // percentage 0-100
    };
}

export interface ScoreBreakdown {
    total: number;
    sleep: number;
    activity: number;
    stress: number;
    heartRate: number;
    spo2: number;
}

export interface ScoreComponent {
    label: string;
    value: number; // 0-100
    weight: number; // 0-1
    score: number; // value * weight
    color: string;
}
