"use client";

import { useEffect, useState, useRef } from "react";

interface ProjectilePracticeVizProps {
    variables: { [key: string]: number };
    userAnswer: number | null;
    correctAnswer: number;
    caseType: 'projectile-max-height' | 'projectile-range';
    isRunning: boolean;
}

export default function ProjectilePracticeViz({
    variables,
    userAnswer,
    correctAnswer,
    caseType,
    isRunning
}: ProjectilePracticeVizProps) {
    const { v0, angle, g } = variables;
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Physics calculations
    const rad = (angle * Math.PI) / 180;
    const vx = v0 * Math.cos(rad);
    const vy0 = v0 * Math.sin(rad);
    const totalTime = g > 0 ? (2 * vy0) / g : 0;
    const maxHeight = (vy0 * vy0) / (2 * g);
    const maxRange = vx * totalTime;

    // Animation loop
    useEffect(() => {
        if (!isRunning) {
            setProgress(0);
            return;
        }

        let startTime: number;
        let animationFrame: number;
        const duration = 3000; // 3 seconds animation

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
    }, [isRunning]);

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

        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, "#1e3a5f");
        gradient.addColorStop(1, "#0f172a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw ground
        ctx.fillStyle = "#334155";
        ctx.fillRect(0, height - 40, width, 40);

        // Scale calculations
        const padding = 50;
        const viewMaxX = Math.max(maxRange, 20) * 1.2;
        const viewMaxY = Math.max(maxHeight, correctAnswer, userAnswer || 0, 10) * 1.5;

        const scaleX = (x: number) => (x / viewMaxX) * (width - padding * 2) + padding;
        const scaleY = (y: number) => height - 40 - (y / viewMaxY) * (height - 100);

        // Current physics state
        const currentTime = progress * totalTime;
        const currentX = vx * currentTime;
        const currentY = Math.max(0, vy0 * currentTime - 0.5 * g * currentTime * currentTime);

        // Draw trajectory (dotted line)
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let i = 0; i <= 50; i++) {
            const t = (i / 50) * totalTime;
            const x = vx * t;
            const y = Math.max(0, vy0 * t - 0.5 * g * t * t);
            if (i === 0) {
                ctx.moveTo(scaleX(x), scaleY(y));
            } else {
                ctx.lineTo(scaleX(x), scaleY(y));
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw max height line (correct answer)
        if (caseType === "projectile-max-height") {
            // Correct answer line
            ctx.strokeStyle = "#22c55e";
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.beginPath();
            ctx.moveTo(padding, scaleY(correctAnswer));
            ctx.lineTo(width - padding, scaleY(correctAnswer));
            ctx.stroke();
            ctx.setLineDash([]);

            // Label
            ctx.fillStyle = "#22c55e";
            ctx.font = "14px monospace";
            ctx.textAlign = "right";
            ctx.fillText(`Target: ${correctAnswer}m`, width - padding - 10, scaleY(correctAnswer) - 5);

            // User answer line
            if (userAnswer !== null) {
                const isCorrect = Math.abs(userAnswer - correctAnswer) <= 0.5;
                ctx.strokeStyle = isCorrect ? "#22c55e" : "#f59e0b";
                ctx.setLineDash([5, 3]);
                ctx.beginPath();
                ctx.moveTo(padding, scaleY(userAnswer));
                ctx.lineTo(width - padding, scaleY(userAnswer));
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.fillStyle = isCorrect ? "#22c55e" : "#f59e0b";
                ctx.fillText(`Kamu: ${userAnswer}m`, width - padding - 10, scaleY(userAnswer) + 15);
            }
        }

        // Draw projectile
        ctx.fillStyle = "#f97316";
        ctx.beginPath();
        ctx.arc(scaleX(currentX), scaleY(currentY), 10, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = "#f97316";
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw cannon
        ctx.fillStyle = "#64748b";
        ctx.save();
        ctx.translate(scaleX(0), scaleY(0));
        ctx.rotate(-rad);
        ctx.fillRect(0, -5, 30, 10);
        ctx.restore();

        // Cannon base
        ctx.beginPath();
        ctx.arc(scaleX(0), scaleY(0), 12, 0, Math.PI * 2);
        ctx.fillStyle = "#475569";
        ctx.fill();

        // Draw Info HUD
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.fillRect(10, 10, 160, 80);
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = "13px monospace";
        ctx.fillText(`v₀: ${v0} m/s`, 20, 30);
        ctx.fillText(`θ: ${angle}°`, 20, 45);
        ctx.fillText(`t: ${currentTime.toFixed(2)} s`, 20, 60);
        ctx.fillText(`y: ${currentY.toFixed(2)} m`, 20, 75);

    }, [progress, v0, angle, g, vx, vy0, totalTime, maxHeight, maxRange, userAnswer, correctAnswer, caseType]);

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
