"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { VisualizationProps } from "../types";
import SmartNumberInput from "@/components/Ui/SmartNumberInput";
import LineGraph from "@/components/viz/LineGraph";

export default function GLBBVisualization({
    langkahAktif,
    sedangBerjalan,
}: VisualizationProps) {
    const [calcMode, setCalcMode] = useState<"standard" | "target_s">("standard");
    const [v0, setV0] = useState(10);
    const [a, setA] = useState(2);
    const [t, setT] = useState(5);
    const [targetS, setTargetS] = useState(100);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    let computedT = t;
    let computedS = 0;
    let solvedTCandidate = 0;

    if (calcMode === "standard") {
        computedT = t;
        computedS = v0 * t + 0.5 * a * t * t;
    } else {
        computedS = targetS;
        if (Math.abs(a) < 0.01) {
            solvedTCandidate = v0 !== 0 ? targetS / v0 : 0;
        } else {
            const det = v0 * v0 - 4 * (0.5 * a) * (-targetS);
            if (det < 0) {
                solvedTCandidate = 0;
            } else {
                const sqrtDet = Math.sqrt(det);
                const t1 = (-v0 + sqrtDet) / a;
                const t2 = (-v0 - sqrtDet) / a;
                if (t1 >= 0 && t2 >= 0) solvedTCandidate = Math.min(t1, t2);
                else if (t1 >= 0) solvedTCandidate = t1;
                else if (t2 >= 0) solvedTCandidate = t2;
                else solvedTCandidate = 0;
            }
        }
        computedT = solvedTCandidate;
    }

    const finalT = computedT;
    const vAkhir = v0 + a * finalT;
    const jarak = computedS;

    const currentT = t * animationProgress;
    const currentV = v0 + a * currentT;
    const currentS = v0 * currentT + 0.5 * a * currentT * currentT;

    let minS = 0;
    let maxS = 0;
    const sFinal = v0 * t + 0.5 * a * t * t;
    minS = Math.min(minS, sFinal);
    maxS = Math.max(maxS, sFinal);

    if (a !== 0) {
        const tTurn = -v0 / a;
        if (tTurn > 0 && tTurn < t) {
            const sTurn = v0 * tTurn + 0.5 * a * tTurn * tTurn;
            minS = Math.min(minS, sTurn);
            maxS = Math.max(maxS, sTurn);
        }
    }

    const padding = Math.max((maxS - minS) * 0.1, 10);
    const viewMin = Math.min(minS, 0) - (minS < 0 ? padding : 0);
    const viewMax = Math.max(maxS, 100) + padding;
    const viewSpan = viewMax - viewMin;

    const mapToPct = (val: number) => {
        const rawPct = (val - viewMin) / viewSpan;
        return 5 + rawPct * 90;
    };

    const carPosition = mapToPct(currentS);
    const startPosition = mapToPct(0);

    const markers = [
        Math.round(viewMin),
        Math.round(viewMin + viewSpan * 0.25),
        Math.round(viewMin + viewSpan * 0.5),
        Math.round(viewMin + viewSpan * 0.75),
        Math.round(viewMax)
    ];

    useEffect(() => {
        if (!isSimulating) return;
        const duration = 3000;
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

    const handleParameterChange = useCallback((setter: (val: number) => void, value: number) => {
        setter(value);
        setAnimationProgress(0);
        setIsSimulating(false);
    }, []);

    const restartSimulation = () => {
        setAnimationProgress(0);
        setIsSimulating(true);
    };

    // Generate data points for graphs
    const vtDataPoints = [
        { x: 0, y: v0 },
        { x: finalT, y: vAkhir }
    ];

    const stDataPoints = [...Array(41)].map((_, i) => {
        const r = i / 40;
        const ti = finalT * r;
        const si = v0 * ti + 0.5 * a * ti * ti;
        return { x: ti, y: si };
    });

    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col gap-6 p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-900/50 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "50px 50px"
                }}
            />

            {/* Top Layout: Formula & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 z-10 w-full max-w-5xl mx-auto">
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700 h-full flex flex-col justify-center">
                    <h3 className="text-orange-400 font-bold mb-3 text-center lg:text-left">Rumus GLBB</h3>
                    <div className="flex flex-col gap-3 font-mono text-sm sm:text-base">
                        <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                            <span>
                                <span className="text-blue-400">v</span> = <span className="text-green-400">v₀</span> + <span className="text-purple-400">a</span><span className="text-yellow-400">t</span>
                            </span>
                            <span className="text-slate-500 text-xs text-right group-hover:text-slate-300">= {v0} + ({a})({t}) = <span className="text-blue-400 font-bold">{vAkhir.toFixed(2)} m/s</span></span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                            <span>
                                <span className="text-blue-400">s</span> = <span className="text-green-400">v₀</span><span className="text-yellow-400">t</span> + ½<span className="text-purple-400">a</span><span className="text-yellow-400">t²</span>
                            </span>
                            <span className="text-slate-500 text-xs text-right group-hover:text-slate-300">= {v0}({t}) + ½({a})({t})² = <span className="text-blue-400 font-bold">{jarak.toFixed(2)} m</span></span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold">Parameter</h3>
                            <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700/50">
                                <button
                                    onClick={() => { setCalcMode("standard"); setAnimationProgress(0); setIsSimulating(false); }}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${calcMode === "standard" ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    Input Waktu (t)
                                </button>
                                <button
                                    onClick={() => { setCalcMode("target_s"); setAnimationProgress(0); setIsSimulating(false); }}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${calcMode === "target_s" ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                    Input Jarak (s)
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={restartSimulation}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all transform active:scale-95 flex items-center gap-2 ${isSimulating || (calcMode === 'target_s' && finalT <= 0.01) ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20"}`}
                            disabled={isSimulating || (calcMode === 'target_s' && finalT <= 0.01)}
                        >
                            {isSimulating ? "Simulasi Berjalan..." : "▶ Jalankan"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <SmartNumberInput label="Kecepatan Awal (v₀)" value={v0} onChange={(val) => handleParameterChange(setV0, val)} min={0} max={50} step={1} unit="m/s" color="green" disabled={isSimulating} />
                        <SmartNumberInput label="Percepatan (a)" value={a} onChange={(val) => handleParameterChange(setA, val)} min={-10} max={10} step={0.5} unit="m/s²" color="purple" disabled={isSimulating} />
                        {calcMode === "standard" ? (
                            <SmartNumberInput label="Waktu Tempuh (t)" value={t} onChange={(val) => handleParameterChange(setT, val)} min={0.1} max={20} step={0.5} unit="s" color="yellow" disabled={isSimulating} />
                        ) : (
                            <div className="space-y-2">
                                <SmartNumberInput label="Target Jarak (s)" value={targetS} onChange={(val) => handleParameterChange(setTargetS, val)} min={-500} max={1000} step={10} unit="m" color="blue" disabled={isSimulating} />
                                {finalT > 0 ? (
                                    <div className="text-xs text-center p-2 bg-blue-500/10 border border-blue-500/30 rounded text-blue-300">
                                        Waktu dibutuhkan: <span className="font-bold text-white">{finalT.toFixed(2)}s</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-center p-2 bg-red-500/10 border border-red-500/30 rounded text-red-300">
                                        Target tidak dapat dicapai dengan parameter ini.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Middle: Visualization Track */}
            <div className="w-full max-w-5xl mx-auto mt-2">
                <div className="relative h-32 bg-gradient-to-b from-slate-700 to-slate-800 rounded-xl overflow-hidden border-2 border-slate-600/50 shadow-2xl">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-2 bg-yellow-500/40 flex">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="flex-1 flex">
                                    <div className="w-1/2 h-full bg-yellow-400"></div>
                                    <div className="w-1/2 h-full bg-transparent"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 h-4 text-xs font-mono text-slate-400 pointer-events-none">
                        {markers.map((m, i) => (
                            <span key={i} className="absolute transform -translate-x-1/2 transition-all duration-300" style={{ left: `${mapToPct(m)}%` }}>{m}m</span>
                        ))}
                    </div>
                    <motion.div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ left: `${carPosition}%` }} animate={{ left: `${carPosition}%` }} transition={isSimulating ? { ease: "linear", duration: 0.1 } : { type: "spring", stiffness: 100 }}>
                        <div className="relative group cursor-pointer">
                            <div className="text-5xl transform -scale-x-100 filter drop-shadow-lg transition-transform group-hover:scale-110">🚗</div>
                            <motion.div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-600 px-2 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap shadow-xl">
                                v: {currentV.toFixed(1)} m/s
                            </motion.div>
                        </div>
                    </motion.div>
                    <div className="absolute top-4 text-2xl filter drop-shadow transition-all duration-300" style={{ left: `${startPosition}%` }} title="Titik Awal (0m)">🏁</div>
                </div>
            </div>

            {/* Graphs Section - Using LineGraph Component */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto mt-4">
                <LineGraph
                    title="Grafik Kecepatan vs Waktu (v-t)"
                    xLabel="t (s)"
                    yLabel="v (m/s)"
                    color="#3B82F6"
                    dataPoints={vtDataPoints}
                    currentX={currentT}
                    currentY={currentV}
                    xDomain={[0, Math.max(finalT, 1)]}
                    graphHeight={180}
                />
                <LineGraph
                    title="Grafik Jarak vs Waktu (s-t)"
                    xLabel="t (s)"
                    yLabel="s (m)"
                    color="#A855F7"
                    dataPoints={stDataPoints}
                    currentX={currentT}
                    currentY={currentS}
                    xDomain={[0, Math.max(finalT, 1)]}
                    graphHeight={180}
                />
            </div>

            {/* Bottom: Real-time Stats with Formulas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl mx-auto">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Kecepatan Sesaat (v<sub>t</sub>)</div>
                    <div className="font-mono text-sm text-slate-300 mb-1">v<sub>t</sub> = v₀ + a·t</div>
                    <div className="font-mono text-lg text-white">= {v0} + ({a})({currentT.toFixed(2)})</div>
                    <div className="font-mono text-2xl font-bold text-blue-400 mt-1">= {currentV.toFixed(2)} m/s</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Jarak Tempuh (s)</div>
                    <div className="font-mono text-sm text-slate-300 mb-1">s = v₀·t + ½·a·t²</div>
                    <div className="font-mono text-lg text-white">= ({v0})({currentT.toFixed(2)}) + ½({a})({currentT.toFixed(2)})²</div>
                    <div className="font-mono text-2xl font-bold text-purple-400 mt-1">= {currentS.toFixed(2)} m</div>
                </div>
            </div>
        </div>
    );
}
