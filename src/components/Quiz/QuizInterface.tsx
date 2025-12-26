"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizQuestion, MultipleChoiceQuestion, PracticeQuestion } from "@/visualizations/types";
import { useProgress } from "@/lib/useProgress";
import Link from "next/link";
// Sub-components
import PracticeQuestionView from "./PracticeQuestionView";
import MultipleChoiceQuestionView from "./MultipleChoiceQuestionView";
import QuizResultScreen from "./QuizResultScreen";
import QuizProgressBar from "./QuizProgressBar";

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

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setIsComplete(false);
    };

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
                        {/* Progress Bar & Header Stats */}
                        <QuizProgressBar
                            current={currentQuestionIndex + 1}
                            total={questions.length}
                            score={score}
                        />

                        <div className="p-6 md:p-8">
                            {/* Question Title */}
                            <div className="mb-6">
                                <h2 className="text-xl md:text-2xl font-bold">
                                    {question.pertanyaan}
                                </h2>
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
                                    <MultipleChoiceQuestionView
                                        question={question as MultipleChoiceQuestion}
                                        selectedAnswer={selectedAnswer}
                                        showResult={showResult}
                                        onSelectAnswer={handleSelectAnswer}
                                    />
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
                    <QuizResultScreen
                        score={score}
                        totalQuestions={questions.length}
                        slug={slug}
                        onRetry={handleRetry}
                    />
                )}
            </div>
        </div>
    );
}
