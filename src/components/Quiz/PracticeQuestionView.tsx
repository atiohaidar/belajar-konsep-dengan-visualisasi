"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PracticeQuestion } from "@/visualizations/types";
import GLBBPracticeViz from "./GlbbPracticeViz";
import ProjectilePracticeViz from "./ProjectilePracticeViz";

interface PracticeQuestionProps {
    question: PracticeQuestion;
    onComplete: (isCorrect: boolean) => void;
    isCompleted: boolean;
}

export default function PracticeQuestionView({ question, onComplete, isCompleted }: PracticeQuestionProps) {
    const [userAnswer, setUserAnswer] = useState("");
    const [submittedAnswer, setSubmittedAnswer] = useState<number | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = parseFloat(userAnswer);
        if (isNaN(val)) return;

        setSubmittedAnswer(val);

        // Calculate correctness with tolerance
        const tolerance = question.tolerance || 0.5; // Default tolerance
        const isCorrect = Math.abs(val - question.correctAnswer) <= tolerance;

        onComplete(isCorrect);
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                {/* Visualization Area */}
                <div className="aspect-video bg-slate-800 rounded-lg overflow-hidden relative mb-6">
                    {question.case.startsWith("glbb") && (
                        <GLBBPracticeViz
                            variables={question.variables}
                            userAnswer={submittedAnswer}
                            correctAnswer={question.correctAnswer}
                            caseType={question.case as 'glbb-distance' | 'glbb-velocity'}
                            isRunning={isCompleted} // Run animation when submitted
                        />
                    )}
                    {question.case.startsWith("projectile") && (
                        <ProjectilePracticeViz
                            variables={question.variables}
                            userAnswer={submittedAnswer}
                            correctAnswer={question.correctAnswer}
                            caseType={question.case as 'projectile-max-height' | 'projectile-range'}
                            isRunning={isCompleted}
                        />
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm text-slate-400 mb-2">
                            Jawaban Kamu ({question.unit})
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            disabled={isCompleted}
                            placeholder="0.0"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono text-lg"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        disabled={!userAnswer || isCompleted}
                        className={`
                            px-6 py-3 rounded-lg font-bold transition-all
                            ${!userAnswer || isCompleted
                                ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                            }
                        `}
                        whileHover={(!userAnswer || isCompleted) ? {} : { scale: 1.05 }}
                        whileTap={(!userAnswer || isCompleted) ? {} : { scale: 0.95 }}
                    >
                        {isCompleted ? "Sudah Dijawab" : "Cek Jawaban"}
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
