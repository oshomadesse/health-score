import { useState, useMemo, useEffect } from 'react';
import { Activity, Moon, Flame, Heart, RefreshCw } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import type { HealthData } from './lib/types';
import { calculateScore } from './lib/scoring';
import { getConditionMessage } from './lib/messages';
import { ScoreGauge } from './components/dashboard/ScoreGauge';
import { StatCard } from './components/dashboard/StatCard';
import { fetchGoogleFitData } from './lib/googleFit';
import { cn } from './lib/utils';

// Initial data (fallback)
const INITIAL_DATA: HealthData = {
  sleep: {
    totalHours: 7.5,
    deepSleepPercentage: 25,
    wakeCount: 1
  },
  activity: {
    steps: 8500,
    calories: 450
  },
  heartRate: {
    resting: 62
  }
};

function App() {
  const [data, setData] = useState<HealthData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const score = useMemo(() => calculateScore(data), [data]);
  const message = useMemo(() => getConditionMessage(score.total), [score.total]);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const fitData = await fetchGoogleFitData(tokenResponse.access_token);
        setData(prev => ({
          ...prev,
          ...fitData
        }));
        setLastSync(new Date().toLocaleString('ja-JP'));
        localStorage.setItem('google_access_token', tokenResponse.access_token);
      } catch (error) {
        console.error('Failed to fetch Fit data', error);
        alert('データの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    },
    scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.heart_rate.read',
  });

  // Auto-fetch on load if token exists (simple attempt)
  useEffect(() => {
    const token = localStorage.getItem('google_access_token');
    if (token) {
      setIsLoading(true);
      fetchGoogleFitData(token)
        .then(fitData => {
          setData(prev => ({ ...prev, ...fitData }));
          setLastSync(new Date().toLocaleString('ja-JP'));
        })
        .catch(() => {
          // Token likely expired, ignore and let user click sync
          localStorage.removeItem('google_access_token');
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex justify-center items-start">
      <div className="max-w-sm w-full space-y-6 py-4">
        {/* Header */}
        <header className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">
              本日のヘルススコア
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, '0')}/{String(new Date().getDate()).padStart(2, '0')}({new Date().toLocaleDateString('ja-JP', { weekday: 'short' })})
              {lastSync && ` • 更新: ${lastSync.split(' ')[1]}`}
            </p>
          </div>
          <button
            onClick={() => login()}
            disabled={isLoading}
            className="p-2 rounded-full bg-surface hover:bg-surface/80 transition-colors disabled:opacity-50 flex-shrink-0"
            title="Google Fitと同期"
          >
            <RefreshCw className={cn("w-5 h-5 text-primary", isLoading && "animate-spin")} />
          </button>
        </header>

        {/* Score Gauge */}
        <div className="flex justify-center py-2">
          <ScoreGauge score={score.total} />
        </div>

        {/* Condition Message */}
        <div className="bg-surface rounded-2xl p-5 text-center border border-white/5">
          <h2 className="text-lg font-bold mb-2" style={{ color: score.total >= 80 ? '#10b981' : score.total >= 60 ? '#f59e0b' : '#ef4444' }}>
            {message.title}
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {message.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            title="睡眠"
            value={`${data.sleep.totalHours}`}
            unit="時間"
            icon={Moon}
            score={score.sleep}
            subValue={`深い睡眠 ${data.sleep.deepSleepPercentage}%`}
            color="text-indigo-400"
          />
          <StatCard
            title="歩数"
            value={data.activity.steps.toLocaleString()}
            unit="歩"
            icon={Activity}
            score={score.steps}
            color="text-emerald-400"
          />
          <StatCard
            title="消費カロリー"
            value={data.activity.calories.toLocaleString()}
            unit="kcal"
            icon={Flame}
            score={score.calories}
            color="text-orange-400"
          />
          <StatCard
            title="心拍数"
            value={`${data.heartRate.resting}`}
            unit="bpm"
            icon={Heart}
            score={score.heartRate}
            subValue="安静時"
            color="text-rose-400"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
