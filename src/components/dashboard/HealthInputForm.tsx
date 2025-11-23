import type { HealthData } from "../../lib/types";

interface HealthInputFormProps {
    data: HealthData;
    onChange: (data: HealthData) => void;
}

export function HealthInputForm({ data, onChange }: HealthInputFormProps) {
    const handleChange = (section: keyof HealthData, field: string, value: number) => {
        onChange({
            ...data,
            [section]: {
                ...data[section],
                [field]: value
            }
        });
    };

    return (
        <div className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-2xl p-6 space-y-8">
            <h3 className="text-xl font-bold text-white mb-4">シミュレーション設定</h3>

            {/* Sleep Section */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-primary-cyan uppercase tracking-wider">睡眠</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">睡眠時間</span>
                        <span className="text-white font-mono">{data.sleep.totalHours}時間</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="12" step="0.5"
                        value={data.sleep.totalHours}
                        onChange={(e) => handleChange('sleep', 'totalHours', parseFloat(e.target.value))}
                        className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-primary-cyan"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">深い睡眠の割合</span>
                        <span className="text-white font-mono">{data.sleep.deepSleepPercentage}%</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="100" step="1"
                        value={data.sleep.deepSleepPercentage}
                        onChange={(e) => handleChange('sleep', 'deepSleepPercentage', parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-primary-cyan"
                    />
                </div>
            </div>

            {/* Activity Section */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-primary uppercase tracking-wider">活動量</h4>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">歩数</span>
                        <span className="text-white font-mono">{data.activity.steps.toLocaleString()} 歩</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="20000" step="100"
                        value={data.activity.steps}
                        onChange={(e) => handleChange('activity', 'steps', parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">消費カロリー</span>
                        <span className="text-white font-mono">{data.activity.calories} kcal</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="1000" step="10"
                        value={data.activity.calories}
                        onChange={(e) => handleChange('activity', 'calories', parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-accent-red"
                    />
                </div>
            </div>

            {/* Heart Rate Section */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium text-accent-green uppercase tracking-wider">心拍数</h4>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">安静時心拍数</span>
                        <span className="text-white font-mono">{data.heartRate.resting} bpm</span>
                    </div>
                    <input
                        type="range"
                        min="40" max="120" step="1"
                        value={data.heartRate.resting}
                        onChange={(e) => handleChange('heartRate', 'resting', parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-accent-green"
                    />
                </div>
            </div>
        </div>
    );
}
