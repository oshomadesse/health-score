import type { HealthData, ScoreBreakdown } from './types';

export const calculateScore = (data: HealthData): ScoreBreakdown => {
    // 1. Sleep Score (40%)
    // Ideal: 7-9 hours, Deep sleep > 20%
    let sleepScore = 0;

    // Duration score (0-60)
    if (data.sleep.totalHours >= 7 && data.sleep.totalHours <= 9) {
        sleepScore += 60;
    } else if (data.sleep.totalHours >= 6) {
        sleepScore += 40;
    } else {
        sleepScore += Math.max(0, data.sleep.totalHours * 5);
    }

    // Deep sleep score (0-40)
    if (data.sleep.deepSleepPercentage >= 20) {
        sleepScore += 40;
    } else {
        sleepScore += data.sleep.deepSleepPercentage * 2;
    }

    // 2. Activity Score (30%)
    // Ideal: 8000+ steps
    let activityScore = Math.min(100, (data.activity.steps / 8000) * 100);

    // 3. Stress Score (20%)
    // Lower is better. 0-100 scale.
    // If stress is 20, score is 80.
    let stressScore = Math.max(0, 100 - data.stress.average);

    // 4. Heart Rate Score (10%)
    // Resting HR: 60-100 is normal, but lower end is better for athletes.
    // Let's say 50-70 is ideal (100 pts), > 70 degrades.
    let hrScore = 0;
    if (data.heartRate.resting >= 50 && data.heartRate.resting <= 70) {
        hrScore = 100;
    } else if (data.heartRate.resting < 50) {
        // Too low might be bad unless athlete, but for simplicity treat as good
        hrScore = 90;
    } else {
        // > 70
        hrScore = Math.max(0, 100 - (data.heartRate.resting - 70) * 2);
    }

    // 5. SpO2 Score (10%)
    // 95-100 is normal. < 90 is concerning.
    let spo2Score = 0;
    if (data.spo2.average >= 95) {
        spo2Score = 100;
    } else if (data.spo2.average >= 90) {
        spo2Score = 80 + (data.spo2.average - 90) * 4; // 90->80, 94->96
    } else {
        spo2Score = Math.max(0, data.spo2.average); // drastic drop
    }

    // Weighted Total
    // Sleep 35%, Activity 25%, Stress 20%, HR 10%, SpO2 10%
    const total =
        (sleepScore * 0.35) +
        (activityScore * 0.25) +
        (stressScore * 0.20) +
        (hrScore * 0.10) +
        (spo2Score * 0.10);

    return {
        total: Math.round(total),
        sleep: Math.round(sleepScore),
        activity: Math.round(activityScore),
        stress: Math.round(stressScore),
        heartRate: Math.round(hrScore),
        spo2: Math.round(spo2Score)
    };
};

export const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-accent-green';
    if (score >= 60) return 'text-primary';
    return 'text-accent-red';
};

export const getProgressColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#ff6900';
    return '#ef4444';
};
