"use client";

import { motion } from "framer-motion";
import { MultipleChoiceQuestion } from "@/visualizations/types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

interface MultipleChoiceQuestionViewProps {
    question: MultipleChoiceQuestion;
    selectedAnswer: number | null;
    showResult: boolean;
    onSelectAnswer: (index: number) => void;
}

export default function MultipleChoiceQuestionView({
    question,
    selectedAnswer,
    showResult,
    onSelectAnswer
}: MultipleChoiceQuestionViewProps) {
    return (
        <div className="space-y-3">
            {question.pilihan.map((pilihan, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = index === question.jawabanBenar;

                let bgColor = "bg-slate-700/50 hover:bg-slate-700";
                let borderColor = "border-slate-600";
                let textColor = "text-slate-100";

                if (showResult) {
                    if (isCorrectAnswer) {
                        bgColor = "bg-green-500/10";
                        borderColor = "border-green-500";
                        textColor = "text-green-100";
                    } else if (isSelected && !isCorrectAnswer) {
                        bgColor = "bg-red-500/10";
                        borderColor = "border-red-500";
                        textColor = "text-red-100";
                    }
                } else if (isSelected) {
                    bgColor = "bg-blue-500/20";
                    borderColor = "border-blue-500";
                }

                return (
                    <motion.button
                        key={index}
                        onClick={() => onSelectAnswer(index)}
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
                                w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors
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
                            <span className={`${textColor} font-medium`}>{pilihan}</span>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
