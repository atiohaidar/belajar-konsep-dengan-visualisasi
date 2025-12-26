"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowPathIcon, BookOpenIcon, HomeIcon } from "@heroicons/react/24/outline";

interface QuizResultScreenProps {
    score: number;
    totalQuestions: number;
    slug: string;
    onRetry: () => void;
}

export default function QuizResultScreen({ score, totalQuestions, slug, onRetry }: QuizResultScreenProps) {
    const percentage = (score / totalQuestions) * 100;

    const getScoreEmoji = (percentage: number) => {
        if (percentage >= 100) return "🏆";
        if (percentage >= 80) return "🌟";
        if (percentage >= 60) return "👍";
        if (percentage >= 40) return "📚";
        return "💪";
    };

    return (
        <motion.div
            className="bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center border border-slate-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="text-8xl mb-6 animate-bounce">{getScoreEmoji(percentage)}</div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Selesai!</h2>
            <p className="text-slate-400 mb-8 text-lg">
                Kamu menjawab <span className="text-white font-bold">{score}</span> dari {totalQuestions} pertanyaan dengan benar
            </p>

            {/* Score circle */}
            <div className="relative w-48 h-48 mx-auto mb-10">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-slate-700"
                    />
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${percentage * 5.5} 552`}
                        initial={{ strokeDasharray: "0 552" }}
                        animate={{ strokeDasharray: `${percentage * 5.5} 552` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-5xl font-bold text-white">{Math.round(percentage)}%</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href={`/viz/${slug}`}
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 group"
                >
                    <BookOpenIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Kembali ke Materi
                </Link>
                <motion.button
                    onClick={onRetry}
                    className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    Coba Lagi
                </motion.button>
            </div>

            <div className="mt-6">
                <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm flex items-center justify-center gap-1 transition-colors">
                    <HomeIcon className="w-4 h-4" /> Ke Beranda
                </Link>
            </div>
        </motion.div>
    );
}
