"use client";

import { motion } from "framer-motion";
import {
    PlayIcon,
    PauseIcon,
    BackwardIcon,
    ForwardIcon,
    ArrowPathIcon
} from "@heroicons/react/24/solid";

interface PlaybackControlsProps {
    sedangBerjalan: boolean;
    langkahAktif: number;
    totalLangkah: number;
    onPlay: () => void;
    onPause: () => void;
    onNext: () => void;
    onPrev: () => void;
    onReset: () => void;
}

export default function PlaybackControls({
    sedangBerjalan,
    langkahAktif,
    totalLangkah,
    onPlay,
    onPause,
    onNext,
    onPrev,
    onReset,
}: PlaybackControlsProps) {
    const buttonClass = `
    p-3 rounded-full
    bg-slate-700/50 hover:bg-slate-600/50
    border border-white/10 hover:border-white/20
    transition-all duration-200
    disabled:opacity-30 disabled:cursor-not-allowed
  `;

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Progress bar */}
            <div className="w-full max-w-md">
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${((langkahAktif + 1) / totalLangkah) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-400">
                    <span>Langkah {langkahAktif + 1}</span>
                    <span>dari {totalLangkah}</span>
                </div>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-3">
                {/* Reset */}
                <motion.button
                    className={buttonClass}
                    onClick={onReset}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Ulangi dari awal"
                >
                    <ArrowPathIcon className="w-5 h-5 text-slate-300" />
                </motion.button>

                {/* Previous */}
                <motion.button
                    className={buttonClass}
                    onClick={onPrev}
                    disabled={langkahAktif === 0}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Langkah sebelumnya"
                >
                    <BackwardIcon className="w-5 h-5 text-slate-300" />
                </motion.button>

                {/* Play/Pause */}
                <motion.button
                    className={`
            p-4 rounded-full
            bg-gradient-to-r from-blue-500 to-purple-500
            hover:from-blue-400 hover:to-purple-400
            shadow-lg shadow-blue-500/30
            transition-all duration-200
          `}
                    onClick={sedangBerjalan ? onPause : onPlay}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={sedangBerjalan ? "Jeda" : "Putar"}
                >
                    {sedangBerjalan ? (
                        <PauseIcon className="w-6 h-6 text-white" />
                    ) : (
                        <PlayIcon className="w-6 h-6 text-white" />
                    )}
                </motion.button>

                {/* Next */}
                <motion.button
                    className={buttonClass}
                    onClick={onNext}
                    disabled={langkahAktif === totalLangkah - 1}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Langkah selanjutnya"
                >
                    <ForwardIcon className="w-5 h-5 text-slate-300" />
                </motion.button>
            </div>
        </div>
    );
}
