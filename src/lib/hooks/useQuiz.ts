"use client";

import { useState, useCallback } from "react";
import { MultipleChoiceQuestion } from "@/visualizations/types";

interface UseQuizOptions {
    questions: MultipleChoiceQuestion[];
    slug: string;
    onSaveScore: (slug: string, score: number, total: number) => void;
    onComplete: (score: number, total: number) => void;
}

interface UseQuizReturn {
    currentQuestion: number;
    selectedAnswer: number | null;
    showResult: boolean;
    score: number;
    isComplete: boolean;
    question: MultipleChoiceQuestion;
    isCorrect: boolean;
    finalScore: number;
    percentage: number;
    handleSelectAnswer: (index: number) => void;
    handleNext: () => void;
    resetQuiz: () => void;
}

export function useQuiz({ questions, slug, onSaveScore, onComplete }: UseQuizOptions): UseQuizReturn {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question?.jawabanBenar;
    const finalScore = score + (showResult && isCorrect ? 1 : 0);
    const percentage = (finalScore / questions.length) * 100;

    const handleSelectAnswer = useCallback((index: number) => {
        if (showResult) return;
        setSelectedAnswer(index);
        setShowResult(true);

        if (index === questions[currentQuestion].jawabanBenar) {
            setScore((prev) => prev + 1);
        }
    }, [showResult, currentQuestion, questions]);

    const handleNext = useCallback(() => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        } else {
            const computedFinalScore = score + (isCorrect ? 1 : 0);
            setIsComplete(true);
            onSaveScore(slug, computedFinalScore, questions.length);
            onComplete(computedFinalScore, questions.length);
        }
    }, [currentQuestion, questions.length, score, isCorrect, slug, onSaveScore, onComplete]);

    const resetQuiz = useCallback(() => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setIsComplete(false);
    }, []);

    return {
        currentQuestion,
        selectedAnswer,
        showResult,
        score,
        isComplete,
        question,
        isCorrect,
        finalScore,
        percentage,
        handleSelectAnswer,
        handleNext,
        resetQuiz,
    };
}

/**
 * Get emoji based on score percentage
 */
export function getScoreEmoji(percentage: number): string {
    if (percentage >= 100) return "🏆";
    if (percentage >= 80) return "🌟";
    if (percentage >= 60) return "👍";
    if (percentage >= 40) return "📚";
    return "💪";
}

/**
 * Get feedback message based on score percentage
 */
export function getScoreFeedback(percentage: number): string {
    if (percentage >= 80) {
        return "Luar biasa! Kamu sudah memahami konsep ini dengan baik! 🎉";
    }
    if (percentage >= 60) {
        return "Bagus! Coba tonton visualisasi lagi untuk pemahaman lebih baik.";
    }
    return "Jangan menyerah! Tonton ulang visualisasi dan coba quiz lagi.";
}
