"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion } from "@/visualizations/types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useProgress } from "@/lib/useProgress";

interface QuizModeProps {
    questions: QuizQuestion[];
    slug: string;
    onComplete: (score: number, total: number) => void;
    onClose: () => void;
}

export default function QuizMode({ questions, slug, onComplete, onClose }: QuizModeProps) {
    const { saveQuizScore } = useProgress();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question?.jawabanBenar;

    const handleSelectAnswer = (index: number) => {
        if (showResult) return;
        setSelectedAnswer(index);
        setShowResult(true);

        if (index === question.jawabanBenar) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            const finalScore = score + (isCorrect ? 1 : 0);
            setIsComplete(true);
            saveQuizScore(slug, finalScore, questions.length);
            onComplete(finalScore, questions.length);
        }
    };

    const getScoreEmoji = (percentage: number) => {
        if (percentage >= 100) return "🏆";
        if (percentage >= 80) return "🌟";
        if (percentage >= 60) return "👍";
        if (percentage >= 40) return "📚";
        return "💪";
    };

    const finalScore = score + (isCorrect ? 1 : 0);
    const percentage = (finalScore / questions.length) * 100;

    return (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
                className="w-full max-w-2xl max-h-[90vh] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                {!isComplete ? (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🧠</span>
                                    <h2 className="text-lg font-bold text-white">Quiz Mode</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-white/80 text-sm">
                                        Pertanyaan {currentQuestion + 1} dari {questions.length}
                                    </span>
                                    <button
                                        onClick={onClose}
                                        className="text-white/60 hover:text-white transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question - scrollable area */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestion}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <h3 className="text-xl font-medium text-white mb-6">
                                        {question.pertanyaan}
                                    </h3>

                                    {/* Options */}
                                    <div className="space-y-3">
                                        {question.pilihan.map((pilihan, index) => {
                                            const isSelected = selectedAnswer === index;
                                            const isCorrectAnswer = index === question.jawabanBenar;

                                            let bgColor = "bg-slate-700/50 hover:bg-slate-700";
                                            let borderColor = "border-slate-600";

                                            if (showResult) {
                                                if (isCorrectAnswer) {
                                                    bgColor = "bg-green-500/20";
                                                    borderColor = "border-green-500";
                                                } else if (isSelected && !isCorrectAnswer) {
                                                    bgColor = "bg-red-500/20";
                                                    borderColor = "border-red-500";
                                                }
                                            } else if (isSelected) {
                                                bgColor = "bg-blue-500/20";
                                                borderColor = "border-blue-500";
                                            }

                                            return (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => handleSelectAnswer(index)}
                                                    disabled={showResult}
                                                    className={`
                                                        w-full p-4 rounded-xl border-2 text-left
                                                        transition-all duration-200
                                                        ${bgColor} ${borderColor}
                                                        ${!showResult && "cursor-pointer"}
                                                    `}
                                                    whileHover={!showResult ? { scale: 1.02 } : {}}
                                                    whileTap={!showResult ? { scale: 0.98 } : {}}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`
                                                            w-8 h-8 rounded-full flex items-center justify-center
                                                            ${showResult && isCorrectAnswer
                                                                ? "bg-green-500 text-white"
                                                                : showResult && isSelected && !isCorrectAnswer
                                                                    ? "bg-red-500 text-white"
                                                                    : "bg-slate-600 text-slate-300"
                                                            }
                                                        `}>
                                                            {showResult && isCorrectAnswer ? (
                                                                <CheckCircleIcon className="w-5 h-5" />
                                                            ) : showResult && isSelected && !isCorrectAnswer ? (
                                                                <XCircleIcon className="w-5 h-5" />
                                                            ) : (
                                                                String.fromCharCode(65 + index)
                                                            )}
                                                        </span>
                                                        <span className="text-white">{pilihan}</span>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    <AnimatePresence>
                                        {showResult && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`
                                                    mt-6 p-4 rounded-xl border
                                                    ${isCorrect
                                                        ? "bg-green-500/10 border-green-500/30"
                                                        : "bg-orange-500/10 border-orange-500/30"
                                                    }
                                                `}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="text-2xl">
                                                        {isCorrect ? "✅" : "💡"}
                                                    </span>
                                                    <div>
                                                        <p className={`font-medium mb-1 ${isCorrect ? "text-green-400" : "text-orange-400"}`}>
                                                            {isCorrect ? "Benar!" : "Hampir tepat!"}
                                                        </p>
                                                        <p className="text-slate-300 text-sm">
                                                            {question.penjelasan}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-700 flex justify-between items-center">
                            <div className="text-slate-400 text-sm">
                                Skor: {score}/{currentQuestion}
                            </div>
                            {showResult && (
                                <motion.button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {currentQuestion < questions.length - 1 ? "Lanjut →" : "Lihat Hasil"}
                                </motion.button>
                            )}
                        </div>
                    </>
                ) : (
                    /* Results Screen */
                    <motion.div
                        className="p-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="text-6xl mb-4">{getScoreEmoji(percentage)}</div>
                        <h2 className="text-2xl font-bold text-white mb-2">Quiz Selesai!</h2>
                        <p className="text-slate-400 mb-6">
                            Kamu menjawab {finalScore} dari {questions.length} pertanyaan dengan benar
                        </p>

                        {/* Score circle */}
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-slate-700"
                                />
                                <motion.circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${percentage * 3.52} 352`}
                                    initial={{ strokeDasharray: "0 352" }}
                                    animate={{ strokeDasharray: `${percentage * 3.52} 352` }}
                                    transition={{ duration: 1, delay: 0.2 }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">{Math.round(percentage)}%</span>
                            </div>
                        </div>

                        <p className="text-slate-400 mb-6">
                            {percentage >= 80
                                ? "Luar biasa! Kamu sudah memahami konsep ini dengan baik! 🎉"
                                : percentage >= 60
                                    ? "Bagus! Coba tonton visualisasi lagi untuk pemahaman lebih baik."
                                    : "Jangan menyerah! Tonton ulang visualisasi dan coba quiz lagi."}
                        </p>

                        <div className="flex gap-3 justify-center">
                            <motion.button
                                onClick={onClose}
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Tutup
                            </motion.button>
                            <motion.button
                                onClick={() => {
                                    setCurrentQuestion(0);
                                    setSelectedAnswer(null);
                                    setShowResult(false);
                                    setScore(0);
                                    setIsComplete(false);
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Coba Lagi
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
