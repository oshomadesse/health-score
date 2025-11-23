import { motion } from "framer-motion";
import { getProgressColor } from "../../lib/scoring";

interface ScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

export function ScoreGauge({ score, size = 200, strokeWidth = 15 }: ScoreGaugeProps) {
    const center = size / 2;
    const radius = center - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getProgressColor(score);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#334155"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset, stroke: color }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Score Text */}
            <div className="flex flex-col items-center z-10">
                <motion.span
                    className="text-6xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    {score}
                </motion.span>
                <span className="text-sm text-gray-400 uppercase tracking-wider mt-1">総合スコア</span>
            </div>

            {/* Glow Effect */}
            <div
                className="absolute inset-0 rounded-full opacity-20 blur-xl transition-colors duration-1000"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}
