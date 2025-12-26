"use client";

import { useState, useEffect, useCallback } from "react";
import * as storage from "./storage";

// Types
export interface VisualizationProgress {
    completed: boolean;
    quizScore: number | null;
    quizTotal: number | null;
    completedAt: string | null;
    attempts: number;
}

export interface ProgressData {
    [slug: string]: VisualizationProgress;
}

export interface ProgressStats {
    totalVisualized: number;
    totalQuizCompleted: number;
    totalCorrect: number;
    totalQuestions: number;
    averageScore: number;
    streak: number;
    lastActivityDate: string | null;
}

const STORAGE_KEY = "viz-progress";
const STREAK_KEY = "viz-streak";

// Helper: Get today's date string
const getTodayString = () => new Date().toISOString().split("T")[0];

// Default empty progress
const defaultProgress: VisualizationProgress = {
    completed: false,
    quizScore: null,
    quizTotal: null,
    completedAt: null,
    attempts: 0,
};

/**
 * Hook untuk manage progress visualisasi di localStorage
 */
export function useProgress() {
    const [progress, setProgress] = useState<ProgressData>({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from storage on mount
    useEffect(() => {
        const stored = storage.getJSON<ProgressData>(STORAGE_KEY, {});
        setProgress(stored);
        setIsLoaded(true);
    }, []);

    // Save to storage whenever progress changes
    useEffect(() => {
        if (isLoaded) {
            storage.setJSON(STORAGE_KEY, progress);
        }
    }, [progress, isLoaded]);

    // Mark visualization as completed
    const markCompleted = useCallback((slug: string) => {
        setProgress((prev) => ({
            ...prev,
            [slug]: {
                ...defaultProgress,
                ...prev[slug],
                completed: true,
                completedAt: prev[slug]?.completedAt || new Date().toISOString(),
            },
        }));
        updateStreak();
    }, []);

    // Save quiz score
    const saveQuizScore = useCallback((slug: string, score: number, total: number) => {
        setProgress((prev) => {
            const existing = prev[slug] || defaultProgress;
            const isNewBest = existing.quizScore === null || score > existing.quizScore;

            return {
                ...prev,
                [slug]: {
                    ...existing,
                    completed: true,
                    quizScore: isNewBest ? score : existing.quizScore,
                    quizTotal: total,
                    completedAt: existing.completedAt || new Date().toISOString(),
                    attempts: existing.attempts + 1,
                },
            };
        });
        updateStreak();
    }, []);

    // Update streak
    const updateStreak = useCallback(() => {
        const streakData = storage.getJSON<{ lastDate: string; count: number } | null>(STREAK_KEY, null);
        const today = getTodayString();

        if (streakData) {
            const { lastDate, count } = streakData;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split("T")[0];

            if (lastDate === today) {
                // Already counted today
                return;
            } else if (lastDate === yesterdayString) {
                // Continue streak
                storage.setJSON(STREAK_KEY, { lastDate: today, count: count + 1 });
            } else {
                // Streak broken, start new
                storage.setJSON(STREAK_KEY, { lastDate: today, count: 1 });
            }
        } else {
            // First time
            storage.setJSON(STREAK_KEY, { lastDate: today, count: 1 });
        }
    }, []);

    // Get progress for a specific visualization
    const getProgress = useCallback(
        (slug: string): VisualizationProgress => {
            return progress[slug] || defaultProgress;
        },
        [progress]
    );

    // Calculate overall stats
    const getStats = useCallback((): ProgressStats => {
        const entries = Object.values(progress);
        const completedViz = entries.filter((p) => p.completed);
        const quizCompleted = entries.filter((p) => p.quizScore !== null);

        const totalCorrect = quizCompleted.reduce((sum, p) => sum + (p.quizScore || 0), 0);
        const totalQuestions = quizCompleted.reduce((sum, p) => sum + (p.quizTotal || 0), 0);

        let streak = 0;
        let lastActivityDate: string | null = null;

        const streakData = storage.getJSON<{ lastDate: string; count: number } | null>(STREAK_KEY, null);
        if (streakData) {
            const { lastDate, count } = streakData;
            const today = getTodayString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split("T")[0];

            // Streak is valid if last activity was today or yesterday
            if (lastDate === today || lastDate === yesterdayString) {
                streak = count;
            }
            lastActivityDate = lastDate;
        }

        return {
            totalVisualized: completedViz.length,
            totalQuizCompleted: quizCompleted.length,
            totalCorrect,
            totalQuestions,
            averageScore: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
            streak,
            lastActivityDate,
        };
    }, [progress]);

    // Reset all progress
    const resetProgress = useCallback(() => {
        setProgress({});
        storage.removeItem(STREAK_KEY);
    }, []);

    return {
        progress,
        isLoaded,
        getProgress,
        getStats,
        markCompleted,
        saveQuizScore,
        resetProgress,
    };
}
