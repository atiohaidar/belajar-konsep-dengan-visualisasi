"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion, MultipleChoiceQuestion, PracticeQuestion } from "@/visualizations/types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useProgress } from "@/lib/useProgress";
import Link from "next/link";
// Component for practice questions
import PracticeQuestionView from "./PracticeQuestionView";

interface QuizInterfaceProps {
    questions: QuizQuestion[];
    slug: string;
    title: string;
}

export default function QuizInterface({ questions, slug, title }: QuizInterfaceProps) {
    const { saveQuizScore } = useProgress();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [practiceCorrect, setPracticeCorrect] = useState(false);

    const question = questions[currentQuestionIndex];

    // Determine if current answer is correct based on question type
    const isCorrect = question.type === 'practice'
        ? practiceCorrect
        : selectedAnswer === (question as MultipleChoiceQuestion).jawabanBenar;

    const handleSelectAnswer = (index: number) => {
        if (showResult || question.type === 'practice') return;
        setSelectedAnswer(index);
        setShowResult(true);

        if (index === (question as MultipleChoiceQuestion).jawabanBenar) {
            setScore((prev) => prev + 1);
        }
    };

    const handlePracticeComplete = (correct: boolean) => {
        setPracticeCorrect(correct);
        setShowResult(true);
        if (correct) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setPracticeCorrect(false);
            setShowResult(false);
        } else {
            const finalScore = score; // Score already updated
            setIsComplete(true);
            saveQuizScore(slug, finalScore, questions.length);
        }
    };

    const getScoreEmoji = (percentage: number) => {
        if (percentage >= 100) return "🏆";
        if (percentage >= 80) return "🌟";
        if (percentage >= 60) return "👍";
        if (percentage >= 40) return "📚";
        return "💪";
    };

    const percentage = (score / questions.length) * 100;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href={`/viz/${slug}`}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        ← Kembali ke Visualisasi
                    </Link>
                    <div className="text-slate-400">
                        Quiz: <span className="text-white font-medium">{title}</span>
                    </div>
                </div>

                {!isComplete ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700"
                    >
                        {/* Progress Bar */}
                        <div className="bg-slate-700 h-2">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="text-blue-400 text-sm font-medium mb-1 block">
                                        PERTANYAAN {currentQuestionIndex + 1} DARI {questions.length}
                                    </span>
                                    <h2 className="text-xl md:text-2xl font-bold">
                                        {question.pertanyaan}
                                    </h2>
                                </div>
                                <div className="bg-slate-700 px-3 py-1 rounded-full text-sm font-mono">
                                    Skor: {score}
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="mb-8">
                                {question.type === 'practice' ? (
                                    <PracticeQuestionView
                                        question={question as PracticeQuestion}
                                        onComplete={handlePracticeComplete}
                                        isCompleted={showResult}
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {(question as MultipleChoiceQuestion).pilihan.map((pilihan, index) => {
                                            const isSelected = selectedAnswer === index;
                                            const isCorrectAnswer = index === (question as MultipleChoiceQuestion).jawabanBenar;

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
                                                    whileHover={!showResult ? { scale: 1.01 } : {}}
                                                    whileTap={!showResult ? { scale: 0.99 } : {}}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`
                                                            w-8 h-8 rounded-full flex items-center justify-center shrink-0
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
                                                        <span className="text-slate-100">{pilihan}</span>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Explanation & Next Button */}
                            <AnimatePresence>
                                {showResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border-t border-slate-700 pt-6"
                                    >
                                        <div className={`
                                            p-4 rounded-xl border mb-6
                                            ${isCorrect
                                                ? "bg-green-500/10 border-green-500/30"
                                                : "bg-orange-500/10 border-orange-500/30"
                                            }
                                        `}>
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl mt-1">
                                                    {isCorrect ? "✅" : "💡"}
                                                </span>
                                                <div>
                                                    <p className={`font-bold mb-1 ${isCorrect ? "text-green-400" : "text-orange-400"}`}>
                                                        {isCorrect ? "Jawaban Benar!" : "Belum Tepat"}
                                                    </p>
                                                    <p className="text-slate-300 leading-relaxed">
                                                        {question.penjelasan}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <motion.button
                                                onClick={handleNext}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold shadow-lg hover:shadow-blue-500/25"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {currentQuestionIndex < questions.length - 1 ? "Pertanyaan Selanjutnya →" : "Lihat Hasil Akhir"}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                ) : (
                    /* Results Screen */
                    <motion.div
                        className="bg-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="text-8xl mb-6">{getScoreEmoji(percentage)}</div>
                        <h2 className="text-3xl font-bold text-white mb-2">Quiz Selesai!</h2>
                        <p className="text-slate-400 mb-8 text-lg">
                            Kamu menjawab <span className="text-white font-bold">{score}</span> dari {questions.length} pertanyaan dengan benar
                        </p>

                        {/* Score circle */}
                        <div className="relative w-40 h-40 mx-auto mb-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="none"
                                    className="text-slate-700"
                                />
                                <motion.circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="url(#gradient)"
                                    strokeWidth="12"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeDasharray={`${percentage * 4.4} 440`}
                                    initial={{ strokeDasharray: "0 440" }}
                                    animate={{ strokeDasharray: `${percentage * 4.4} 440` }}
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
                                <span className="text-4xl font-bold text-white">{Math.round(percentage)}%</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Link
                                href={`/viz/${slug}`}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
                            >
                                Kembali ke Materi
                            </Link>
                            <motion.button
                                onClick={() => {
                                    setCurrentQuestionIndex(0);
                                    setSelectedAnswer(null);
                                    setShowResult(false);
                                    setScore(0);
                                    setIsComplete(false);
                                }}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium shadow-lg hover:shadow-purple-500/25"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Coba Lagi
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
