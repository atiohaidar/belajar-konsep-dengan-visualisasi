"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { VisualizationProps } from "../types";
import SmartNumberInput from "@/components/Ui/SmartNumberInput";
import LineGraph from "@/components/viz/LineGraph";

export default function GerakParabolaVisualization({
    langkahAktif,
    sedangBerjalan,
}: VisualizationProps) {
    // Parameters
    const [v0, setV0] = useState(20); // m/s
    const [angle, setAngle] = useState(45); // degrees
    const [g, setG] = useState(10); // m/s²
    const [manualTime, setManualTime] = useState(0); // Manual time input

    // Animation State
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isSimulating, setIsSimulating] = useState(false);

    // Physics Constants derived from inputs
    const rad = (angle * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy0 = v0 * Math.sin(rad);

    // Time to reach ground (y=0) -> 0 = vy0*t - 0.5*g*t^2 -> t(vy0 - 0.5gt) = 0
    // t_total = 2*vy0 / g
    const totalTime = g > 0 ? (2 * vy0) / g : 0;

    // Max values for viewport scaling
    const maxDistance = vx * totalTime; // Range
    const maxHeight = (vy0 * vy0) / (2 * g); // H max

    // Current State based on animation OR manual time
    // If simulating, use animation progress. Otherwise use manual time.
    const currentTime = isSimulating ? totalTime * animationProgress : Math.min(manualTime, totalTime);
    const currentX = vx * currentTime;
    const currentY = Math.max(0, vy0 * currentTime - 0.5 * g * currentTime * currentTime);
    const currentVy = vy0 - g * currentTime;
    const currentV = Math.sqrt(vx * vx + currentVy * currentVy); // Resultant velocity

    // Viewport Calculations
    // We need a fixed aspect ratio or dynamic scaling.
    // Let's add some padding.
    // X axis: 0 to maxDistance (plus padding)
    // Y axis: 0 to maxHeight (plus padding)
    const paddingX = Math.max(maxDistance * 0.1, 5);
    const paddingY = Math.max(maxHeight * 0.2, 5);

    const viewMaxX = Math.max(maxDistance + paddingX, 20); // Min capture 20m width
    const viewMaxY = Math.max(maxHeight + paddingY, 10);   // Min capture 10m height

    // Helper to map values to percentage for CSS/SVG
    // For Y, we invert because SVG/CSS (0,0) is top-left, but we want bottom-left logic for physics
    const scaleX = (x: number) => (x / viewMaxX) * 100;
    const scaleY = (y: number) => 100 - (y / viewMaxY) * 100;

    // Animation Loop
    useEffect(() => {
        if (!isSimulating) return;

        // Duration depends on totalTime? Or fixed time?
        // Real-time might be too fast or too slow. Let's start with fixed user-friendly duration (e.g., 3s)
        // or proportional to totalTime if reasonable.
        // Let's use fixed 3s for consistency.
        const duration = 3000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setAnimationProgress(progress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation finished - set manualTime to totalTime so it stays at end position
                setManualTime(totalTime);
                setIsSimulating(false);
            }
        };

        requestAnimationFrame(animate);
    }, [isSimulating, totalTime]);

    const handleParamChange = (setter: (v: number) => void, val: number) => {
        setter(val);
        setAnimationProgress(0);
        setManualTime(0);
        setIsSimulating(false);
    };

    const handleTimeChange = (val: number) => {
        setManualTime(val);
        setAnimationProgress(val / totalTime);
        setIsSimulating(false);
    };

    const restartSimulation = () => {
        setAnimationProgress(0);
        setIsSimulating(true);
    };

    // Calculate Trajectory Path for SVG
    const trajectoryPath = useMemo(() => {
        const points = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * totalTime;
            const x = vx * t;
            const y = vy0 * t - 0.5 * g * t * t;
            points.push(`${scaleX(x)},${scaleY(y)}`);
        }
        return points.join(" ");
    }, [vx, vy0, g, totalTime, viewMaxX, viewMaxY]);

    // Generate data points for graphs (like GLBB)
    const ytDataPoints = useMemo(() => {
        const points: { x: number; y: number }[] = [];
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * totalTime;
            const y = vy0 * t - 0.5 * g * t * t;
            points.push({ x: t, y });
        }
        return points;
    }, [vy0, g, totalTime]);

    const vyDataPoints = useMemo(() => {
        const points: { x: number; y: number }[] = [];
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            const t = (i / steps) * totalTime;
            const vyT = vy0 - g * t;
            points.push({ x: t, y: vyT });
        }
        return points;
    }, [vy0, g, totalTime]);


    return (
        <div className="relative w-full h-full min-h-[400px] flex flex-col gap-6 p-4 overflow-y-auto">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-slate-900/50 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Top Layout: Formula & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 z-10 w-full max-w-6xl mx-auto">
                {/* Left: Formula Card */}
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700 h-full flex flex-col justify-center">
                    <h3 className="text-blue-400 font-bold mb-3 text-center lg:text-left">Rumus Gerak Parabola</h3>
                    <div className="flex flex-col gap-3 font-mono text-sm">
                        <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                            <span>
                                <span className="text-blue-400">vx</span> = <span className="text-green-400">v₀</span> cos <span className="text-yellow-400">θ</span>
                            </span>
                            <span className="text-slate-500 text-xs text-right group-hover:text-slate-300">= {v0} × cos({angle}°) = <span className="text-blue-400 font-bold">{vx.toFixed(2)} m/s</span></span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                            <span>
                                <span className="text-purple-400">vy₀</span> = <span className="text-green-400">v₀</span> sin <span className="text-yellow-400">θ</span>
                            </span>
                            <span className="text-slate-500 text-xs text-right group-hover:text-slate-300">= {v0} × sin({angle}°) = <span className="text-purple-400 font-bold">{vy0.toFixed(2)} m/s</span></span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                            <span>
                                <span className="text-orange-400">H<sub>max</sub></span> = <span className="text-purple-400">vy₀²</span> / 2<span className="text-red-400">g</span>
                            </span>
                            <span className="text-slate-500 text-xs text-right group-hover:text-slate-300">= ({vy0.toFixed(1)})² / 2({g}) = <span className="text-orange-400 font-bold">{maxHeight.toFixed(2)} m</span></span>
                        </div>
                        <div className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center group hover:bg-slate-900 transition-colors">
                            <span>
                                <span className="text-cyan-400">R</span> = <span className="text-blue-400">vx</span> × <span className="text-white">t<sub>total</sub></span>
                            </span>
                            <span className="text-slate-500 text-xs text-right group-hover:text-slate-300">= {vx.toFixed(2)} × {totalTime.toFixed(2)} = <span className="text-cyan-400 font-bold">{maxDistance.toFixed(2)} m</span></span>
                        </div>
                    </div>
                </div>

                {/* Right: Controls & Stats */}
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-5 border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-white font-bold">Parameter</h3>
                        <button
                            onClick={restartSimulation}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all transform active:scale-95 flex items-center gap-2
                                ${isSimulating
                                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20"
                                }`}
                            disabled={isSimulating}
                        >
                            {isSimulating ? "Simulasi Berjalan..." : "▶ Tembak!"}
                        </button>
                    </div>

                    <div className="space-y-4">
                        <SmartNumberInput
                            label="Kecepatan Awal (v₀)"
                            value={v0}
                            onChange={(v) => handleParamChange(setV0, v)}
                            min={1} max={100} step={1}
                            unit="m/s" color="green"
                            disabled={isSimulating}
                        />
                        <SmartNumberInput
                            label="Sudut Elevasi (θ)"
                            value={angle}
                            onChange={(v) => handleParamChange(setAngle, v)}
                            min={1} max={89} step={1}
                            unit="°" color="yellow"
                            disabled={isSimulating}
                        />
                        <SmartNumberInput
                            label="Gravitasi (g)"
                            value={g}
                            onChange={(v) => handleParamChange(setG, v)}
                            min={1} max={20} step={0.5}
                            unit="m/s²" color="purple"
                            disabled={isSimulating}
                        />
                    </div>
                </div>
            </div>

            {/* Main Simulation View */}
            <div className="w-full max-w-6xl mx-auto h-[350px] bg-gradient-to-b from-sky-900/30 to-slate-900 rounded-xl border-2 border-slate-600/50 relative overflow-hidden shadow-2xl">
                {/* Ruler Lines / Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                    {/* Horizontal Lines */}
                    {[0.25, 0.5, 0.75].map(p => (
                        <div key={p} className="absolute w-full border-t border-white left-0" style={{ top: `${(1 - p) * 100}%` }}>
                            <span className="text-[10px] text-white ml-1">{(viewMaxY * p).toFixed(0)}m</span>
                        </div>
                    ))}
                    {/* Vertical Lines */}
                    {[0.25, 0.5, 0.75].map(p => (
                        <div key={p} className="absolute h-full border-l border-white top-0" style={{ left: `${p * 100}%` }}>
                            <span className="text-[10px] text-white mt-1 ml-1">{(viewMaxX * p).toFixed(0)}m</span>
                        </div>
                    ))}
                </div>

                {/* Ground */}
                <div className="absolute bottom-0 w-full h-[2px] bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>

                {/* Cannon / Start Point */}
                <div
                    className="absolute bottom-0 left-0 w-8 h-8 flex items-center justify-center transform origin-bottom-left -translate-y-[50%]"
                    style={{
                        left: `${scaleX(0)}%`,
                        bottom: `${100 - scaleY(0)}%`,
                    }}
                >
                    <div
                        className="w-8 h-2 bg-slate-400 rounded-full origin-left"
                        style={{ transform: `rotate(-${angle}deg)` }}
                    ></div>
                    <div className="absolute w-4 h-4 rounded-full bg-slate-500 -left-2 bottom-[-6px]"></div>
                </div>

                {/* Trajectory Line (Static path) */}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                    <polyline
                        points={trajectoryPath}
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>

                {/* Projectile */}
                <div
                    className="absolute w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] z-20"
                    style={{
                        left: `calc(${scaleX(currentX)}% - 8px)`,
                        top: `calc(${scaleY(currentY)}% - 8px)`,
                    }}
                >
                    {/* Velocity Vector Arrow */}
                    <div
                        className="absolute top-1/2 left-1/2 h-[2px] bg-white origin-left opacity-70"
                        style={{
                            width: `${Math.min(currentV * 2, 40)}px`,
                            transform: `rotate(${Math.atan2(-currentVy, vx) * (180 / Math.PI)}deg)`
                        }}
                    >
                        <div className="absolute right-0 -top-[3px] w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent"></div>
                    </div>
                </div>
            </div>
            {/* Time Slider - untuk scrubbing setelah animasi */}
            <div className="w-full max-w-6xl mx-auto bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-slate-700">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-400 whitespace-nowrap">Waktu (t):</div>
                    <input
                        type="range"
                        min={0}
                        max={totalTime || 0.1}
                        step={0.01}
                        value={currentTime}
                        onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
                        disabled={isSimulating}
                        className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="text-lg font-mono font-bold text-purple-400 min-w-[80px] text-right">
                        {currentTime.toFixed(2)}s
                    </div>
                    <div className="text-xs text-slate-500">/ {totalTime.toFixed(2)}s</div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 text-center">
                    💡 Geser slider untuk melihat posisi pada waktu tertentu setelah animasi selesai
                </div>
            </div>
            {/* Graphs Section - Using LineGraph Component */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto">
                <LineGraph
                    title="Grafik Ketinggian vs Waktu (y-t)"
                    xLabel="t (s)"
                    yLabel="y (m)"
                    color="#A855F7"
                    dataPoints={ytDataPoints}
                    currentX={currentTime}
                    currentY={currentY}
                    xDomain={[0, Math.max(totalTime, 0.1)]}
                    graphHeight={180}
                />
                <LineGraph
                    title="Grafik Kecepatan Y vs Waktu (vy-t)"
                    xLabel="t (s)"
                    yLabel="vy (m/s)"
                    color="#22C55E"
                    dataPoints={vyDataPoints}
                    currentX={currentTime}
                    currentY={currentVy}
                    xDomain={[0, Math.max(totalTime, 0.1)]}
                    graphHeight={180}
                />
            </div>



            {/* Bottom: Real-time Stats with Formulas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-6xl mx-auto">
                {/* Position X Calculation */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Posisi Horizontal (x)</div>
                    <div className="font-mono text-sm text-slate-300 mb-1">x = vx · t</div>
                    <div className="font-mono text-lg text-white">= {vx.toFixed(2)} × {currentTime.toFixed(2)}</div>
                    <div className="font-mono text-2xl font-bold text-blue-400 mt-1">= {currentX.toFixed(2)} m</div>
                </div>

                {/* Position Y Calculation */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Posisi Vertikal (y)</div>
                    <div className="font-mono text-sm text-slate-300 mb-1">y = vy₀·t − ½·g·t²</div>
                    <div className="font-mono text-lg text-white">= ({vy0.toFixed(2)})({currentTime.toFixed(2)}) − ½({g})({currentTime.toFixed(2)})²</div>
                    <div className="font-mono text-2xl font-bold text-purple-400 mt-1">= {currentY.toFixed(2)} m</div>
                </div>

                {/* Velocity Y Calculation */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Kecepatan Vertikal (vy)</div>
                    <div className="font-mono text-sm text-slate-300 mb-1">vy = vy₀ − g·t</div>
                    <div className="font-mono text-lg text-white">= {vy0.toFixed(2)} − ({g})({currentTime.toFixed(2)})</div>
                    <div className="font-mono text-2xl font-bold text-green-400 mt-1">= {currentVy.toFixed(2)} m/s</div>
                </div>

                {/* Total Velocity Calculation */}
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Kecepatan Total (v)</div>
                    <div className="font-mono text-sm text-slate-300 mb-1">v = √(vx² + vy²)</div>
                    <div className="font-mono text-lg text-white">= √(({vx.toFixed(2)})² + ({currentVy.toFixed(2)})²)</div>
                    <div className="font-mono text-2xl font-bold text-orange-400 mt-1">= {currentV.toFixed(2)} m/s</div>
                </div>
            </div>
        </div>
    );
}
