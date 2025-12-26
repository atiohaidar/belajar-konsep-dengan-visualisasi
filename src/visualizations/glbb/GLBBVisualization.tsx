"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisualizationProps } from "../types";

export default function GLBBVisualization({
    langkahAktif,
    sedangBerjalan,
}: VisualizationProps) {
    // Interactive parameters
    const [v0, setV0] = useState(10); // Kecepatan awal (m/s)
    const [a, setA] = useState(2);    // Percepatan (m/s²)
    const [t, setT] = useState(5);    // Waktu (s)

    // Animation state
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    // Calculated values
    const vAkhir = v0 + a * t;
    const jarak = v0 * t + 0.5 * a * t * t;

    // Current values during animation
    const currentT = t * animationProgress;
    const currentV = v0 + a * currentT;
    const currentS = v0 * currentT + 0.5 * a * currentT * currentT;

    // Car position (percentage of track)
    const maxDistance = Math.max(Math.abs(jarak), 100);
    const carPosition = Math.min(Math.max((currentS / maxDistance) * 80, 0), 85);

    // Start simulation when on step 3 or 4
    useEffect(() => {
        if ((langkahAktif === 3 || langkahAktif === 4) && sedangBerjalan) {
            setIsSimulating(true);
            setAnimationProgress(0);
        }
    }, [langkahAktif, sedangBerjalan]);

    // Animation loop
    useEffect(() => {
        if (!isSimulating) return;

        const duration = 3000; // 3 seconds for full animation
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setAnimationProgress(progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsSimulating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [isSimulating]);

    // Reset animation when parameters change
    const handleParameterChange = useCallback((setter: (val: number) => void, value: number) => {
        setter(value);
        setAnimationProgress(0);
        setIsSimulating(false);
    }, []);

    // Restart simulation
    const restartSimulation = () => {
        setAnimationProgress(0);
        setIsSimulating(true);
    };

    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col items-center justify-center gap-4 p-4">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Formula display (Step 1 & 2) */}
            <AnimatePresence>
                {(langkahAktif === 0 || langkahAktif === 1) && (
                    <motion.div
                        className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur rounded-xl p-4 border border-orange-500/30"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="text-center space-y-2">
                            <div className="text-lg font-bold text-orange-300">Rumus GLBB</div>
                            <div className="flex flex-wrap justify-center gap-4 text-sm font-mono">
                                <div className="bg-slate-800/50 px-3 py-2 rounded-lg">
                                    <span className="text-blue-400">v</span>
                                    <span className="text-slate-400"> = </span>
                                    <span className="text-green-400">v₀</span>
                                    <span className="text-slate-400"> + </span>
                                    <span className="text-purple-400">a</span>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-yellow-400">t</span>
                                </div>
                                <div className="bg-slate-800/50 px-3 py-2 rounded-lg">
                                    <span className="text-blue-400">s</span>
                                    <span className="text-slate-400"> = </span>
                                    <span className="text-green-400">v₀</span>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-yellow-400">t</span>
                                    <span className="text-slate-400"> + ½·</span>
                                    <span className="text-purple-400">a</span>
                                    <span className="text-slate-400">·</span>
                                    <span className="text-yellow-400">t²</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main visualization area */}
            <div className="relative w-full max-w-3xl mt-16">
                {/* Track/Road */}
                <div className="relative h-24 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg overflow-hidden border border-slate-600">
                    {/* Road markings */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-yellow-500/50 flex">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="flex-1 flex">
                                    <div className="w-1/2 h-full bg-yellow-400"></div>
                                    <div className="w-1/2 h-full bg-transparent"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Distance markers */}
                    <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-slate-400">
                        <span>0m</span>
                        <span>{Math.round(maxDistance / 4)}m</span>
                        <span>{Math.round(maxDistance / 2)}m</span>
                        <span>{Math.round(maxDistance * 3 / 4)}m</span>
                        <span>{Math.round(maxDistance)}m</span>
                    </div>

                    {/* Car */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2"
                        style={{ left: `${carPosition}%` }}
                        initial={{ left: "5%" }}
                        animate={{ left: `${Math.max(carPosition, 5)}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    >
                        <div className="relative">
                            {/* Car body */}
                            <div className="text-4xl transform -scale-x-100">🚗</div>
                            {/* Speed indicator */}
                            {(langkahAktif >= 3) && (
                                <motion.div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500/90 px-2 py-1 rounded text-xs font-mono text-white whitespace-nowrap"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {currentV.toFixed(1)} m/s
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Start flag */}
                    <div className="absolute left-2 top-2 text-xl">🏁</div>
                </div>

                {/* Controls Panel (Step 2+) */}
                <AnimatePresence>
                    {langkahAktif >= 2 && (
                        <motion.div
                            className="mt-6 bg-slate-800/90 backdrop-blur rounded-xl p-4 border border-slate-600"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* v0 slider */}
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between text-sm">
                                        <span className="text-green-400 font-medium">Kecepatan Awal (v₀)</span>
                                        <span className="font-mono text-white">{v0} m/s</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        value={v0}
                                        onChange={(e) => handleParameterChange(setV0, Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                </div>

                                {/* a slider */}
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between text-sm">
                                        <span className="text-purple-400 font-medium">Percepatan (a)</span>
                                        <span className="font-mono text-white">{a} m/s²</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="-5"
                                        max="10"
                                        value={a}
                                        onChange={(e) => handleParameterChange(setA, Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                </div>

                                {/* t slider */}
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between text-sm">
                                        <span className="text-yellow-400 font-medium">Waktu (t)</span>
                                        <span className="font-mono text-white">{t} s</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={t}
                                        onChange={(e) => handleParameterChange(setT, Number(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                </div>
                            </div>

                            {/* Play button */}
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={restartSimulation}
                                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    <span>▶</span>
                                    <span>Jalankan Simulasi</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Real-time calculations (Step 3+) */}
                <AnimatePresence>
                    {langkahAktif >= 3 && (
                        <motion.div
                            className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                        >
                            <div className="bg-green-500/20 backdrop-blur rounded-lg p-3 border border-green-500/30 text-center">
                                <div className="text-xs text-green-400">v₀ (awal)</div>
                                <div className="text-xl font-mono text-white">{v0} <span className="text-sm">m/s</span></div>
                            </div>
                            <div className="bg-blue-500/20 backdrop-blur rounded-lg p-3 border border-blue-500/30 text-center">
                                <div className="text-xs text-blue-400">v (sekarang)</div>
                                <div className="text-xl font-mono text-white">{currentV.toFixed(1)} <span className="text-sm">m/s</span></div>
                            </div>
                            <div className="bg-purple-500/20 backdrop-blur rounded-lg p-3 border border-purple-500/30 text-center">
                                <div className="text-xs text-purple-400">Jarak (s)</div>
                                <div className="text-xl font-mono text-white">{currentS.toFixed(1)} <span className="text-sm">m</span></div>
                            </div>
                            <div className="bg-yellow-500/20 backdrop-blur rounded-lg p-3 border border-yellow-500/30 text-center">
                                <div className="text-xs text-yellow-400">Waktu (t)</div>
                                <div className="text-xl font-mono text-white">{currentT.toFixed(1)} <span className="text-sm">s</span></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Final results (Step 4) */}
                <AnimatePresence>
                    {langkahAktif === 4 && animationProgress >= 1 && (
                        <motion.div
                            className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur rounded-xl p-4 border border-green-500/30"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="text-center space-y-2">
                                <div className="text-lg font-bold text-green-300 flex items-center justify-center gap-2">
                                    <span>✅</span>
                                    <span>Hasil Akhir</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 font-mono text-sm">
                                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                                        <span className="text-slate-400">v = {v0} + ({a})({t}) = </span>
                                        <span className="text-blue-400 font-bold">{vAkhir} m/s</span>
                                    </div>
                                    <div className="bg-slate-800/50 px-4 py-2 rounded-lg">
                                        <span className="text-slate-400">s = ({v0})({t}) + ½({a})({t})² = </span>
                                        <span className="text-purple-400 font-bold">{jarak.toFixed(1)} m</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Acceleration indicator */}
            <AnimatePresence>
                {langkahAktif >= 2 && (
                    <motion.div
                        className="absolute bottom-4 right-4 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {a > 0 && (
                            <div className="flex items-center gap-2 text-green-400">
                                <span>↗</span>
                                <span>Dipercepat</span>
                            </div>
                        )}
                        {a < 0 && (
                            <div className="flex items-center gap-2 text-red-400">
                                <span>↘</span>
                                <span>Diperlambat</span>
                            </div>
                        )}
                        {a === 0 && (
                            <div className="flex items-center gap-2 text-yellow-400">
                                <span>→</span>
                                <span>GLB (Konstan)</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
