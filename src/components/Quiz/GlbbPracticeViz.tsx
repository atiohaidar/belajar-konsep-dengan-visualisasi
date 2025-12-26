"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface GLBBPracticeVizProps {
    variables: { [key: string]: number };
    userAnswer: number | null;
    correctAnswer: number;
    caseType: 'glbb-distance' | 'glbb-velocity';
    isRunning: boolean;
}

export default function GLBBPracticeViz({
    variables,
    userAnswer,
    correctAnswer,
    caseType,
    isRunning
}: GLBBPracticeVizProps) {
    const { v0, a, t } = variables;
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Animation loop
    useEffect(() => {
        if (!isRunning) {
            setProgress(0);
            return;
        }

        let startTime: number;
        let animationFrame: number;
        const duration = t * 1000; // time in ms

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const p = Math.min(elapsed / duration, 1);

            setProgress(p);

            if (p < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isRunning, t]);

    // Canvas drawing
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw ground
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, height - 40, width, 40);

        // Drawing helper
        const drawCar = (x: number, color: string = "#60A5FA") => {
            ctx.fillStyle = color;
            // Body
            ctx.fillRect(x, height - 70, 60, 30);
            // Cabin
            ctx.fillStyle = "#93C5FD";
            ctx.fillRect(x + 10, height - 85, 40, 15);
            // Wheels
            ctx.fillStyle = "#1E293B";
            ctx.beginPath();
            ctx.arc(x + 15, height - 40, 8, 0, Math.PI * 2);
            ctx.arc(x + 45, height - 40, 8, 0, Math.PI * 2);
            ctx.fill();
        };

        const drawFlag = (x: number, label: string, color: string) => {
            ctx.fillStyle = color;
            // Pole
            ctx.fillRect(x, height - 120, 2, 80);
            // Flag
            ctx.beginPath();
            ctx.moveTo(x, height - 120);
            ctx.lineTo(x + 30, height - 105);
            ctx.lineTo(x, height - 90);
            ctx.fill();

            // Label
            ctx.fillStyle = "white";
            ctx.font = "12px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(label, x, height - 130);
        };

        // Scale calculation
        // We need to fit the max distance (correct answer or user answer) into view
        // Max distance to show = max(correctAnswer, userAnswer || 0) * 1.2 padding
        const maxDist = Math.max(correctAnswer, userAnswer || 0, 10) * 1.5;
        const scaleX = (val: number) => (val / maxDist) * (width - 100) + 50; // 50px padding left

        // Current physics state
        const currentTime = progress * t;
        const currentDist = v0 * currentTime + 0.5 * a * currentTime * currentTime;
        const currentVel = v0 + a * currentTime;

        // Draw start line
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(scaleX(0), 50);
        ctx.lineTo(scaleX(0), height);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText("0m", scaleX(0), height - 20);

        // Draw Targets
        if (caseType === "glbb-distance") {
            // Correct Answer Target
            drawFlag(scaleX(correctAnswer), `Target: ${correctAnswer}m`, "#22c55e"); // Green

            // User Answer Marker (if exists)
            if (userAnswer !== null) {
                drawFlag(scaleX(userAnswer), `Kamu: ${userAnswer}m`, userAnswer === correctAnswer ? "#22c55e" : "#f59e0b"); // Orange if wrong
            }
        }

        // Draw Car
        drawCar(scaleX(currentDist) - 30); // Center car on point? No, maybe front/back. -30 to center 60px car.

        // Draw Info HUD
        ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
        ctx.fillRect(10, 10, 140, 60);
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = "14px monospace";
        ctx.fillText(`t: ${currentTime.toFixed(2)} s`, 20, 30);
        ctx.fillText(`v: ${currentVel.toFixed(2)} m/s`, 20, 45);
        ctx.fillText(`s: ${currentDist.toFixed(2)} m`, 20, 60);

    }, [progress, v0, a, t, userAnswer, correctAnswer, caseType]);

    return (
        <div className="w-full h-full bg-slate-800 relative">
            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                className="w-full h-full object-contain"
            />
            {!isRunning && userAnswer === null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white/80 font-medium p-4 bg-black/60 rounded-lg">
                        Masukkan jawaban untuk melihat simulasi
                    </p>
                </div>
            )}
        </div>
    );
}
