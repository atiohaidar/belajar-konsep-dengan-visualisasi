"use client";

import { useState, useEffect, useCallback } from "react";
import { VisualizationConfig } from "@/visualizations/types";
import { ANIMATION_DURATIONS } from "@/lib/constants";

interface UseVisualizationOptions {
    config: VisualizationConfig;
    onComplete?: (slug: string) => void;
}

interface UseVisualizationReturn {
    langkahAktif: number;
    sedangBerjalan: boolean;
    totalLangkah: number;
    langkahSekarang: VisualizationConfig["langkahLangkah"][0] | undefined;
    hasCompletedVisualization: boolean;
    handlePlay: () => void;
    handlePause: () => void;
    handleNext: () => void;
    handlePrev: () => void;
    handleReset: () => void;
    setLangkahAktif: (index: number) => void;
    setSedangBerjalan: (running: boolean) => void;
}

export function useVisualization({ config, onComplete }: UseVisualizationOptions): UseVisualizationReturn {
    const [langkahAktif, setLangkahAktif] = useState(0);
    const [sedangBerjalan, setSedangBerjalan] = useState(false);
    const [hasCompletedVisualization, setHasCompletedVisualization] = useState(false);

    const totalLangkah = config.langkahLangkah.length;
    const langkahSekarang = config.langkahLangkah[langkahAktif];

    // Detect when visualization is complete
    useEffect(() => {
        if (langkahAktif === totalLangkah - 1 && !sedangBerjalan) {
            setHasCompletedVisualization(true);
            onComplete?.(config.slug);
        }
    }, [langkahAktif, totalLangkah, sedangBerjalan, config.slug, onComplete]);

    // Auto-play logic
    useEffect(() => {
        if (!sedangBerjalan) return;

        const durasi = langkahSekarang?.durasi ?? ANIMATION_DURATIONS.DEFAULT_STEP;

        const timer = setTimeout(() => {
            if (langkahAktif < totalLangkah - 1) {
                setLangkahAktif((prev) => prev + 1);
            } else {
                setSedangBerjalan(false);
            }
        }, durasi);

        return () => clearTimeout(timer);
    }, [sedangBerjalan, langkahAktif, totalLangkah, langkahSekarang?.durasi]);

    const handlePlay = useCallback(() => {
        if (langkahAktif === totalLangkah - 1) {
            setLangkahAktif(0);
        }
        setSedangBerjalan(true);
    }, [langkahAktif, totalLangkah]);

    const handlePause = useCallback(() => {
        setSedangBerjalan(false);
    }, []);

    const handleNext = useCallback(() => {
        if (langkahAktif < totalLangkah - 1) {
            setLangkahAktif((prev) => prev + 1);
        }
    }, [langkahAktif, totalLangkah]);

    const handlePrev = useCallback(() => {
        if (langkahAktif > 0) {
            setLangkahAktif((prev) => prev - 1);
        }
    }, [langkahAktif]);

    const handleReset = useCallback(() => {
        setSedangBerjalan(false);
        setLangkahAktif(0);
    }, []);

    const setStep = useCallback((index: number) => {
        setSedangBerjalan(false);
        setLangkahAktif(index);
    }, []);

    return {
        langkahAktif,
        sedangBerjalan,
        totalLangkah,
        langkahSekarang,
        hasCompletedVisualization,
        handlePlay,
        handlePause,
        handleNext,
        handlePrev,
        handleReset,
        setLangkahAktif: setStep,
        setSedangBerjalan,
    };
}
