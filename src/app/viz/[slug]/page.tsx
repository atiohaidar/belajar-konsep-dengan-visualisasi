"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { getVisualizationBySlug, getLazyComponent } from "@/visualizations/registry";
import PlaybackControls from "@/components/PlaybackControls";
import PageTransition from "@/components/PageTransition";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useProgress } from "@/lib/useProgress";
import {
    ArrowLeftIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
    AcademicCapIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from "@heroicons/react/24/solid";

export default function VisualizationPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const visualization = getVisualizationBySlug(slug);

    const [langkahAktif, setLangkahAktif] = useState(0);
    const [sedangBerjalan, setSedangBerjalan] = useState(false);
    const [hoveredStep, setHoveredStep] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasCompletedVisualization, setHasCompletedVisualization] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalLangkah = visualization?.config.langkahLangkah.length ?? 0;
    const langkahSekarang = visualization?.config.langkahLangkah[langkahAktif];
    const hasQuiz = (visualization?.config.quiz?.length ?? 0) > 0;

    const { markCompleted } = useProgress();

    // Detect when visualization is complete
    useEffect(() => {
        if (langkahAktif === totalLangkah - 1 && !sedangBerjalan) {
            setHasCompletedVisualization(true);
            markCompleted(slug);
        }
    }, [langkahAktif, totalLangkah, sedangBerjalan, slug, markCompleted]);

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

    // Fullscreen toggle
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    // Listen for fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            switch (e.code) {
                case "Space":
                    e.preventDefault();
                    if (sedangBerjalan) {
                        handlePause();
                    } else {
                        handlePlay();
                    }
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    setSedangBerjalan(false);
                    handleNext();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    setSedangBerjalan(false);
                    handlePrev();
                    break;
                case "KeyR":
                    e.preventDefault();
                    handleReset();
                    break;
                case "KeyF":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "KeyQ":
                    if (hasQuiz && hasCompletedVisualization) {
                        e.preventDefault();
                        router.push(`/quiz/${slug}`);
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    if (isFullscreen) {
                        document.exitFullscreen();
                    } else {
                        handlePause();
                    }
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [sedangBerjalan, handlePlay, handlePause, handleNext, handlePrev, handleReset, toggleFullscreen, isFullscreen, hasQuiz, hasCompletedVisualization, router, slug]);

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

    const { config } = visualization;
    const LazyComponent = getLazyComponent(slug);

    // Swipe handlers for mobile
    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        if (info.offset.x < -threshold && langkahAktif < totalLangkah - 1) {
            setSedangBerjalan(false);
            setLangkahAktif(prev => prev + 1);
        } else if (info.offset.x > threshold && langkahAktif > 0) {
            setSedangBerjalan(false);
            setLangkahAktif(prev => prev - 1);
        }
    };

    return (
        <PageTransition>
            <div ref={containerRef} className="h-screen flex flex-col overflow-hidden bg-slate-900" tabIndex={0}>
                {/* Header - Hidden in fullscreen mode */}
                <AnimatePresence>
                    {!isFullscreen && (
                        <motion.header
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="border-b border-slate-800 bg-slate-900/80 backdrop-blur shrink-0"
                        >
                            <div className="container mx-auto px-3 sm:px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-4">
                                    <Link
                                        href="/"
                                        className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                                    >
                                        <ArrowLeftIcon className="w-4 h-4 text-slate-400" />
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <span className="text-lg sm:text-xl">{config.icon}</span>
                                        <h1 className="text-sm sm:text-base font-semibold text-white truncate max-w-[120px] sm:max-w-none">
                                            {config.judul}
                                        </h1>
                                    </div>
                                </div>

                                {/* Step Dots in Navbar */}
                                <div className="flex items-center gap-1 relative">
                                    {config.langkahLangkah.map((step, index) => (
                                        <button
                                            key={step.id}
                                            onClick={() => {
                                                setSedangBerjalan(false);
                                                setLangkahAktif(index);
                                            }}
                                            onMouseEnter={() => setHoveredStep(index)}
                                            onMouseLeave={() => setHoveredStep(null)}
                                            className={`
                                                w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200
                                                ${index === langkahAktif
                                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                                                    : index < langkahAktif
                                                        ? "bg-blue-500/60 hover:bg-blue-500"
                                                        : "bg-slate-600 hover:bg-slate-500"
                                                }
                                            `}
                                            title={step.judul}
                                        />
                                    ))}
                                    {/* Tooltip for hovered step */}
                                    <AnimatePresence>
                                        {hoveredStep !== null && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-700 text-white text-[10px] rounded shadow-lg whitespace-nowrap z-50"
                                            >
                                                {config.langkahLangkah[hoveredStep]?.judul}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Quiz button */}
                                    {hasQuiz && (
                                        <Link
                                            href={hasCompletedVisualization ? `/quiz/${slug}` : "#"}
                                            className={`
                                                flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium
                                                transition-all duration-200
                                                ${hasCompletedVisualization
                                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                                                    : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
                                                }
                                            `}
                                            title={hasCompletedVisualization ? "Mulai Quiz (Q)" : "Selesaikan visualisasi dulu"}
                                            onClick={(e) => {
                                                if (!hasCompletedVisualization) e.preventDefault();
                                            }}
                                        >
                                            <AcademicCapIcon className="w-4 h-4" />
                                            <span className="hidden sm:inline">Quiz</span>
                                        </Link>
                                    )}

                                    {/* Fullscreen button */}
                                    <motion.button
                                        onClick={toggleFullscreen}
                                        className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Fullscreen (F)"
                                    >
                                        {isFullscreen ? (
                                            <ArrowsPointingInIcon className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <ArrowsPointingOutIcon className="w-4 h-4 text-slate-400" />
                                        )}
                                    </motion.button>

                                    {/* Keyboard shortcuts hint */}
                                    <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-500 ml-2">
                                        <span className="px-1.5 py-0.5 bg-slate-800 rounded">Space</span>
                                        <span>Play</span>
                                        <span className="px-1.5 py-0.5 bg-slate-800 rounded">←→</span>
                                        <span>Nav</span>
                                        <span className="px-1.5 py-0.5 bg-slate-800 rounded">F</span>
                                        <span>Full</span>
                                    </div>
                                </div>
                            </div>
                        </motion.header>
                    )}
                </AnimatePresence>

                {/* Floating exit fullscreen button (only visible in fullscreen) */}
                <AnimatePresence>
                    {isFullscreen && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={toggleFullscreen}
                            className="fixed top-4 right-4 z-50 p-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors group"
                            title="Keluar Fullscreen (Esc)"
                        >
                            <ArrowsPointingInIcon className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Main content */}
                <main className="flex-1 flex flex-col min-h-0 p-2 sm:p-4 gap-2 sm:gap-3">
                    {/* Visualization area - with swipe gesture for mobile */}
                    <motion.div
                        className="flex-1 min-h-0 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-2 sm:p-4 overflow-hidden relative"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        style={{ touchAction: "pan-y" }}
                    >
                        <ErrorBoundary>
                            <Suspense fallback={
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-slate-400 text-sm">Memuat visualisasi...</span>
                                    </div>
                                </div>
                            }>
                                {LazyComponent && (
                                    <LazyComponent
                                        langkahAktif={langkahAktif}
                                        sedangBerjalan={sedangBerjalan}
                                    />
                                )}
                            </Suspense>
                        </ErrorBoundary>

                        {/* Mobile swipe hints */}
                        <div className="absolute inset-y-0 left-0 w-8 flex items-center justify-center sm:hidden pointer-events-none">
                            <motion.div
                                animate={{ opacity: langkahAktif > 0 ? [0.3, 0.6, 0.3] : 0 }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ChevronLeftIcon className="w-5 h-5 text-slate-500" />
                            </motion.div>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-8 flex items-center justify-center sm:hidden pointer-events-none">
                            <motion.div
                                animate={{ opacity: langkahAktif < totalLangkah - 1 ? [0.3, 0.6, 0.3] : 0 }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <ChevronRightIcon className="w-5 h-5 text-slate-500" />
                            </motion.div>
                        </div>

                        {/* Completion celebration */}
                        <AnimatePresence>
                            {langkahAktif === totalLangkah - 1 && !sedangBerjalan && hasQuiz && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border border-purple-500/30 rounded-lg px-4 py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🎉</span>
                                        <span className="text-sm text-purple-300">
                                            Siap untuk quiz?
                                        </span>
                                        <Link
                                            href={`/quiz/${slug}`}
                                            className="px-2 py-1 bg-purple-500 rounded text-xs text-white font-medium hover:bg-purple-600 transition-colors"
                                        >
                                            Mulai
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Bottom section - Only show for multi-step visualizations */}
                    {totalLangkah > 1 && (
                        <div className="shrink-0 flex flex-col lg:flex-row gap-2 sm:gap-3">
                            {/* Step explanation */}
                            <div className="flex-1 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-3 sm:p-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={langkahAktif}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-start gap-2 sm:gap-3"
                                    >
                                        <span className="shrink-0 px-2 sm:px-2.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] sm:text-xs font-medium">
                                            {langkahAktif + 1}/{totalLangkah}
                                        </span>
                                        <div className="min-w-0">
                                            <h2 className="text-xs sm:text-sm font-semibold text-white mb-0.5 sm:mb-1">
                                                {langkahSekarang?.judul}
                                            </h2>
                                            <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                                                {langkahSekarang?.penjelasan}
                                            </p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Controls */}
                            <div className="shrink-0 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-xl p-2 sm:p-4 flex items-center justify-center">
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
                    )}


                </main>
            </div>
        </PageTransition>
    );
}

