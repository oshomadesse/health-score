import axios from 'axios';
import type { HealthData } from './types';

const GOOGLE_FIT_API_URL = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate';

export const fetchGoogleFitData = async (accessToken: string): Promise<Partial<HealthData>> => {
    // Get yesterday's start and end time in nanoseconds
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const startTimeMillis = yesterday.getTime();

    const yesterdayEnd = new Date(yesterday);
    yesterdayEnd.setHours(23, 59, 59, 999);
    const endTimeMillis = yesterdayEnd.getTime();

    const requestBody = {
        aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.calories.expended' },
            { dataTypeName: 'com.google.heart_rate.bpm' },
            { dataTypeName: 'com.google.sleep.segment' }
        ],
        bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
        startTimeMillis,
        endTimeMillis
    };

    try {
        const response = await axios.post(GOOGLE_FIT_API_URL, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        const bucket = response.data.bucket[0];
        if (!bucket) return {};

        const steps = getMetricValue(bucket, 'com.google.step_count.delta', 'intVal');
        const calories = getMetricValue(bucket, 'com.google.calories.expended', 'fpVal');
        const heartRate = getMetricValue(bucket, 'com.google.heart_rate.bpm', 'fpVal'); // Average
        const sleepData = processSleepData(bucket);

        return {
            activity: {
                steps: Math.round(steps),
                calories: Math.round(calories)
            },
            heartRate: {
                resting: Math.round(heartRate) || 60 // Default if missing
            },
            sleep: sleepData
        };

    } catch (error) {
        console.error('Error fetching Google Fit data:', error);
        throw error;
    }
};

const getMetricValue = (bucket: any, typeName: string, valType: 'intVal' | 'fpVal') => {
    const dataset = bucket.dataset.find((d: any) => d.dataSourceId.includes(typeName));
    if (!dataset || dataset.point.length === 0) return 0;

    // For steps and calories, sum all points (though bucketByTime usually gives one point)
    // For HR, we might want average.
    if (typeName === 'com.google.heart_rate.bpm') {
        // Simple average of the points in the bucket
        const points = dataset.point;
        const sum = points.reduce((acc: number, p: any) => acc + p.value[0].fpVal, 0);
        return sum / points.length;
    }

    return dataset.point.reduce((acc: number, p: any) => acc + (p.value[0][valType] || 0), 0);
};

const processSleepData = (bucket: any) => {
    // Sleep segments are a bit more complex. 
    // We need to look at com.google.sleep.segment
    // Value 1: Sleep (Generic), 2: Bedtime, 3: Awake, 4: Light, 5: Deep, 6: REM
    const dataset = bucket.dataset.find((d: any) => d.dataSourceId.includes('com.google.sleep.segment'));
    if (!dataset || dataset.point.length === 0) {
        return { totalHours: 0, deepSleepPercentage: 0, wakeCount: 0 };
    }

    let totalSleepMillis = 0;
    let deepSleepMillis = 0;
    let wakeCount = 0;

    dataset.point.forEach((p: any) => {
        const type = p.value[0].intVal;
        const duration = (parseInt(p.endTimeNanos) - parseInt(p.startTimeNanos)) / 1000000; // to millis

        if (type !== 3) { // Not awake
            totalSleepMillis += duration;
        }
        if (type === 5) { // Deep sleep
            deepSleepMillis += duration;
        }
        if (type === 3) { // Awake segment
            wakeCount++;
        }
    });

    const totalHours = Math.round((totalSleepMillis / (1000 * 60 * 60)) * 10) / 10;
    const deepSleepPercentage = totalSleepMillis > 0 ? Math.round((deepSleepMillis / totalSleepMillis) * 100) : 0;

    return {
        totalHours,
        deepSleepPercentage,
        wakeCount
    };
};
