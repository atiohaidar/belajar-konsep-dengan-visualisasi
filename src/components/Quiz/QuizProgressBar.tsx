"use client";

import { motion } from "framer-motion";

interface QuizProgressBarProps {
    current: number;
    total: number;
    score: number;
}

export default function QuizProgressBar({ current, total, score }: QuizProgressBarProps) {
    return (
        <div className="bg-slate-800 rounded-t-2xl overflow-hidden border-b border-slate-700">
            {/* Progress Bar */}
            <div className="bg-slate-700 h-2">
                <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(current / total) * 100}%` }}
                />
            </div>

            {/* Header Text */}
            <div className="px-6 py-4 md:px-8 flex justify-between items-center bg-slate-800">
                <div>
                    <span className="text-blue-400 text-sm font-medium mb-1 block">
                        PERTANYAAN {current} DARI {total}
                    </span>
                </div>
                <div className="bg-slate-700 px-3 py-1 rounded-full text-sm font-mono text-white">
                    Skor: {score}
                </div>
            </div>
        </div>
    );
}
