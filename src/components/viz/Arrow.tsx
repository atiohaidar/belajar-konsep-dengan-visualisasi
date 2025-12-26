"use client";

import { motion } from "framer-motion";

interface ArrowProps {
    direction?: "left" | "right" | "bidirectional";
    aktif?: boolean;
    label?: string;
    className?: string;
}

export default function Arrow({
    direction = "right",
    aktif = false,
    label,
    className = ""
}: ArrowProps) {
    return (
        <div className={`relative flex flex-col items-center gap-1 ${className}`}>
            {label && (
                <span className="text-xs text-slate-400 mb-1">{label}</span>
            )}

            <div className="relative w-32 h-8 flex items-center justify-center">
                {/* Line */}
                <motion.div
                    className={`
            absolute h-0.5 rounded-full
            ${aktif ? "bg-blue-400" : "bg-slate-600"}
          `}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                />

                {/* Animated flow (untuk panah aktif) */}
                {aktif && (
                    <motion.div
                        className="absolute h-0.5 w-8 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"
                        animate={{
                            x: direction === "left" ? [50, -50] : [-50, 50]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                )}

                {/* Arrowhead(s) */}
                {(direction === "right" || direction === "bidirectional") && (
                    <motion.div
                        className={`
              absolute right-0 w-0 h-0
              border-t-[6px] border-t-transparent
              border-b-[6px] border-b-transparent
              border-l-[10px] ${aktif ? "border-l-blue-400" : "border-l-slate-600"}
            `}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    />
                )}

                {(direction === "left" || direction === "bidirectional") && (
                    <motion.div
                        className={`
              absolute left-0 w-0 h-0
              border-t-[6px] border-t-transparent
              border-b-[6px] border-b-transparent
              border-r-[10px] ${aktif ? "border-r-blue-400" : "border-r-slate-600"}
            `}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    />
                )}
            </div>
        </div>
    );
}
