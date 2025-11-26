import type { HealthData } from './types';

const API_URL = 'https://health-score-api.oshomadesse.workers.dev';

export const fetchLatestHealthData = async (): Promise<Partial<HealthData> | null> => {
    try {
        const response = await fetch(`${API_URL}/api/health/latest`);

        if (!response.ok) {
            if (response.status === 404) {
                // No data available yet
                return null;
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch health data:', error);
        return null;
    }
};
