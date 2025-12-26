"use client";

import { motion } from "framer-motion";
import { useProgress, ProgressStats } from "@/lib/useProgress";
import { TrophyIcon, FireIcon, AcademicCapIcon, ChartBarIcon } from "@heroicons/react/24/solid";

interface ProgressSummaryProps {
    totalVisualizations: number;
}

export default function ProgressSummary({ totalVisualizations }: ProgressSummaryProps) {
    const { getStats, isLoaded, resetProgress } = useProgress();

    if (!isLoaded) {
        return (
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 animate-pulse">
                <div className="h-20 bg-slate-700/50 rounded" />
            </div>
        );
    }

    const stats = getStats();
    const hasProgress = stats.totalVisualized > 0 || stats.totalQuizCompleted > 0;

    if (!hasProgress) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur border border-slate-700/50 rounded-xl p-6"
            >
                <div className="flex items-center gap-4">
                    <div className="text-4xl">🚀</div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Mulai Belajar!</h3>
                        <p className="text-slate-400 text-sm">
                            Pilih visualisasi di bawah untuk memulai perjalanan belajarmu.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    const progressPercentage = Math.round((stats.totalVisualized / totalVisualizations) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur border border-slate-700/50 rounded-xl p-6"
        >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Progress Bar Section */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-blue-400" />
                            Progress Kamu
                        </h3>
                        <span className="text-sm text-slate-400">
                            {stats.totalVisualized}/{totalVisualizations} selesai
                        </span>
                    </div>
                    <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4 flex-wrap">
                    {/* Quiz Score */}
                    {stats.totalQuizCompleted > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                <AcademicCapIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">
                                    {stats.totalCorrect}/{stats.totalQuestions}
                                </div>
                                <div className="text-xs text-slate-400">Quiz ({stats.averageScore}%)</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Streak */}
                    {stats.streak > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-orange-500/30"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                                <FireIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-lg font-bold text-white">{stats.streak}</div>
                                <div className="text-xs text-slate-400">Hari Streak</div>
                            </div>
                        </motion.div>
                    )}

                    {/* Achievement indicator */}
                    {stats.averageScore >= 80 && stats.totalQuizCompleted >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-yellow-500/30"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center">
                                <TrophyIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-white">Pro!</div>
                                <div className="text-xs text-slate-400">Achiever</div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
