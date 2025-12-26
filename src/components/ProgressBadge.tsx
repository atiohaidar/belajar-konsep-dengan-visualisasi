"use client";

import { memo } from "react";
import { useProgress } from "@/lib/useProgress";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface ProgressBadgeProps {
    slug: string;
    hasQuiz: boolean;
}

function ProgressBadge({ slug, hasQuiz }: ProgressBadgeProps) {
    const { getProgress, isLoaded } = useProgress();

    if (!isLoaded) return null;

    const progress = getProgress(slug);

    if (!progress.completed) return null;

    return (
        <div className="absolute top-4 left-4 flex flex-col gap-1">
            {/* Completed badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 border border-green-500/40 rounded-full">
                <CheckCircleIcon className="w-3 h-3 text-green-400" />
                <span className="text-[10px] text-green-400 font-medium">Selesai</span>
            </div>

            {/* Quiz score badge */}
            {hasQuiz && progress.quizScore !== null && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded-full">
                    <span className="text-[10px] text-purple-400 font-medium">
                        Quiz: {progress.quizScore}/{progress.quizTotal}
                        {progress.quizScore === progress.quizTotal && " ⭐"}
                    </span>
                </div>
            )}
        </div>
    );
}

export default memo(ProgressBadge);
