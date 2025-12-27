"use client";

import { useState, useEffect, useCallback, RefObject } from "react";

interface UseFullscreenReturn {
    isFullscreen: boolean;
    toggleFullscreen: () => void;
}

export function useFullscreen(containerRef: RefObject<HTMLElement | null>): UseFullscreenReturn {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, [containerRef]);

    // Listen for fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    return {
        isFullscreen,
        toggleFullscreen,
    };
}
