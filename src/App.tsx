import { useState, useMemo } from 'react';
import { Activity, Moon, Heart, Brain, Zap } from 'lucide-react';
import type { HealthData } from './lib/types';
import { calculateScore } from './lib/scoring';
import { ScoreGauge } from './components/dashboard/ScoreGauge';
import { StatCard } from './components/dashboard/StatCard';
import { HealthInputForm } from './components/dashboard/HealthInputForm';

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
  stress: {
    average: 35
  },
  heartRate: {
    resting: 62
  },
  spo2: {
    average: 98
  }
};

function App() {
  const [data, setData] = useState<HealthData>(INITIAL_DATA);
  const score = useMemo(() => calculateScore(data), [data]);

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8 font-sans selection:bg-primary/30">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Zap className="text-primary w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Cyber<span className="text-primary">Health</span>
            </h1>
          </div>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Score & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Score Display */}
            <div className="bg-surface/30 backdrop-blur-md border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-around gap-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent-green opacity-50" />

              <div className="relative z-10">
                <ScoreGauge score={score.total} size={240} />
              </div>

              <div className="space-y-4 max-w-sm text-center md:text-left z-10">
                <h2 className="text-3xl font-bold">今日のコンディション</h2>
                <p className="text-gray-400 leading-relaxed">
                  しょーまの活力は<span className="text-white font-medium">最適</span>な状態です。
                  質の高い睡眠と適度な活動がスコアを押し上げています。
                  このリズムを維持しましょう！
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard
                title="睡眠の質"
                value={`${data.sleep.totalHours}時間`}
                unit={`(深い睡眠 ${data.sleep.deepSleepPercentage}%)`}
                icon={Moon}
                color="text-primary-cyan"
                score={score.sleep}
                delay={0.1}
              />
              <StatCard
                title="活動量"
                value={data.activity.steps}
                unit="歩"
                icon={Activity}
                color="text-primary"
                score={score.activity}
                delay={0.2}
              />
              <StatCard
                title="ストレスレベル"
                value={data.stress.average}
                unit="/ 100"
                icon={Brain}
                color="text-accent-red"
                score={score.stress}
                delay={0.3}
              />
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="安静時心拍数"
                  value={data.heartRate.resting}
                  unit="bpm"
                  icon={Heart}
                  color="text-accent-green"
                  score={score.heartRate}
                  delay={0.4}
                />
                <StatCard
                  title="血中酸素濃度"
                  value={data.spo2.average}
                  unit="%"
                  icon={Zap}
                  color="text-blue-400"
                  score={score.spo2}
                  delay={0.5}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-1">
            <HealthInputForm data={data} onChange={setData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
