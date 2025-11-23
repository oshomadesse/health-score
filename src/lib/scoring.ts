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

    // 2. Steps Score (30%)
    // 8000 steps = 100 pts
    const stepsScore = Math.min(100, (data.activity.steps / 8000) * 100);

    // 3. Calories Score (20%)
    // 300kcal (active) = 60pts, 500kcal = 100pts
    // Assuming this is "Active Calories" not total.
    const caloriesScore = Math.min(100, (data.activity.calories / 500) * 100);

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

    // Weighted Total
    // Sleep 40%, Steps 30%, Calories 20%, HR 10%
    const total =
        (sleepScore * 0.4) +
        (stepsScore * 0.3) +
        (caloriesScore * 0.2) +
        (hrScore * 0.1);

    return {
        total: Math.round(total),
        sleep: Math.round(sleepScore),
        steps: Math.round(stepsScore),
        calories: Math.round(caloriesScore),
        heartRate: Math.round(hrScore)
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
