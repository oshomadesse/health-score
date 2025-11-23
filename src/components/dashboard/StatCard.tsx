import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    color: string; // Tailwind text color class e.g. "text-blue-500"
    score?: number; // 0-100 score for this metric to show a mini bar
    subValue?: string;
    delay?: number;
}

export function StatCard({ title, value, unit, icon: Icon, color, score, subValue, delay = 0 }: StatCardProps) {
    return (
        <motion.div
            className="bg-surface/50 backdrop-blur-lg border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:bg-surface/70 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            <div className="flex justify-between items-start mb-3">
                <div className={cn("p-2 rounded-lg bg-white/5", color)}>
                    <Icon size={20} />
                </div>
                {score !== undefined && (
                    <div className="text-xs font-mono text-gray-500">
                        {score}
                    </div>
                )}
            </div>

            <div>
                <h3 className="text-gray-400 text-xs font-medium mb-1">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-white">{value}</span>
                    {unit && <span className="text-xs text-gray-500">{unit}</span>}
                </div>
                {subValue && (
                    <p className="text-xs text-gray-500 mt-0.5">{subValue}</p>
                )}
            </div>

            {score !== undefined && (
                <div className="mt-3 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className={cn("h-full rounded-full", color.replace('text-', 'bg-'))}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: delay + 0.2, duration: 1 }}
                    />
                </div>
            )}
        </motion.div>
    );
}
