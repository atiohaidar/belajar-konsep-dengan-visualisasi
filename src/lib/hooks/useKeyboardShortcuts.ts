"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { KEYBOARD_SHORTCUTS } from "@/lib/constants";

interface UseKeyboardShortcutsOptions {
    sedangBerjalan: boolean;
    isFullscreen: boolean;
    hasQuiz: boolean;
    hasCompletedVisualization: boolean;
    slug: string;
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onReset: () => void;
    onToggleFullscreen: () => void;
}

export function useKeyboardShortcuts({
    sedangBerjalan,
    isFullscreen,
    hasQuiz,
    hasCompletedVisualization,
    slug,
    onPlay,
    onPause,
    onNext,
    onPrev,
    onReset,
    onToggleFullscreen,
}: UseKeyboardShortcutsOptions): void {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.code) {
                case KEYBOARD_SHORTCUTS.PLAY_PAUSE:
                    e.preventDefault();
                    if (sedangBerjalan) {
                        onPause();
                    } else {
                        onPlay();
                    }
                    break;
                case KEYBOARD_SHORTCUTS.NEXT:
                    e.preventDefault();
                    onPause();
                    onNext();
                    break;
                case KEYBOARD_SHORTCUTS.PREV:
                    e.preventDefault();
                    onPause();
                    onPrev();
                    break;
                case KEYBOARD_SHORTCUTS.RESET:
                    e.preventDefault();
                    onReset();
                    break;
                case KEYBOARD_SHORTCUTS.FULLSCREEN:
                    e.preventDefault();
                    onToggleFullscreen();
                    break;
                case KEYBOARD_SHORTCUTS.QUIZ:
                    if (hasQuiz && hasCompletedVisualization) {
                        e.preventDefault();
                        router.push(`/quiz/${slug}`);
                    }
                    break;
                case KEYBOARD_SHORTCUTS.ESCAPE:
                    e.preventDefault();
                    if (isFullscreen) {
                        document.exitFullscreen();
                    } else {
                        onPause();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [
        sedangBerjalan,
        isFullscreen,
        hasQuiz,
        hasCompletedVisualization,
        slug,
        router,
        onPlay,
        onPause,
        onNext,
        onPrev,
        onReset,
        onToggleFullscreen,
    ]);
}
