"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getVisualizationBySlug } from "@/visualizations/registry";
import PlaybackControls from "@/components/PlaybackControls";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function VisualizationPage() {
    const params = useParams();
    const slug = params.slug as string;

    const visualization = getVisualizationBySlug(slug);

    const [langkahAktif, setLangkahAktif] = useState(0);
    const [sedangBerjalan, setSedangBerjalan] = useState(false);

    const totalLangkah = visualization?.config.langkahLangkah.length ?? 0;
    const langkahSekarang = visualization?.config.langkahLangkah[langkahAktif];

    // Auto-play logic
    useEffect(() => {
        if (!sedangBerjalan || !visualization) return;

        const durasi = langkahSekarang?.durasi ?? 2000;

        const timer = setTimeout(() => {
            if (langkahAktif < totalLangkah - 1) {
                setLangkahAktif((prev) => prev + 1);
            } else {
                setSedangBerjalan(false);
            }
        }, durasi);

        return () => clearTimeout(timer);
    }, [sedangBerjalan, langkahAktif, totalLangkah, langkahSekarang?.durasi, visualization]);

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

    // 404 handling
    if (!visualization) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                    <p className="text-slate-400 mb-8">Visualisasi tidak ditemukan</p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    const { config, Component } = visualization;

    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Compact Header */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur shrink-0">
                <div className="container mx-auto px-4 py-2 flex items-center gap-4">
                    <Link
                        href="/"
                        className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 text-slate-400" />
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-xl">{config.icon}</span>
                        <h1 className="text-base font-semibold text-white">{config.judul}</h1>
                    </div>
                </div>
            </header>

            {/* Main content - fills remaining space */}
            <main className="flex-1 flex flex-col min-h-0 p-4 gap-3">
                {/* Visualization area - takes available space */}
                <div className="flex-1 min-h-0 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-4 overflow-hidden">
                    <Component
                        langkahAktif={langkahAktif}
                        sedangBerjalan={sedangBerjalan}
                    />
                </div>

                {/* Bottom section - fixed height */}
                <div className="shrink-0 flex flex-col lg:flex-row gap-3">
                    {/* Step explanation - left side on large screens */}
                    <div className="flex-1 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={langkahAktif}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-start gap-3"
                            >
                                <span className="shrink-0 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                                    {langkahAktif + 1}/{totalLangkah}
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-sm font-semibold text-white mb-1">
                                        {langkahSekarang?.judul}
                                    </h2>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        {langkahSekarang?.penjelasan}
                                    </p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Controls - right side on large screens */}
                    <div className="shrink-0 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-4 flex flex-col items-center justify-center">
                        <PlaybackControls
                            sedangBerjalan={sedangBerjalan}
                            langkahAktif={langkahAktif}
                            totalLangkah={totalLangkah}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onNext={handleNext}
                            onPrev={handlePrev}
                            onReset={handleReset}
                        />
                    </div>
                </div>

                {/* Step indicators - compact row */}
                <div className="shrink-0 flex justify-center gap-1.5 flex-wrap">
                    {config.langkahLangkah.map((step, index) => (
                        <button
                            key={step.id}
                            onClick={() => {
                                setSedangBerjalan(false);
                                setLangkahAktif(index);
                            }}
                            className={`
                                px-2 py-0.5 rounded-full text-xs transition-all
                                ${index === langkahAktif
                                    ? "bg-blue-500 text-white"
                                    : index < langkahAktif
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-slate-700/50 text-slate-400 hover:bg-slate-700"
                                }
                            `}
                            title={step.judul}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}

