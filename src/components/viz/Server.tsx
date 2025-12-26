"use client";

import { motion } from "framer-motion";
import { glowPulse, pulse } from "@/lib/animations";

interface ServerProps {
    aktif?: boolean;
    label?: string;
    status?: "idle" | "processing" | "success" | "error";
    className?: string;
}

const statusColors = {
    idle: "from-slate-600 to-slate-700",
    processing: "from-blue-500 to-blue-600",
    success: "from-green-500 to-green-600",
    error: "from-red-500 to-red-600",
};

const statusGlow = {
    idle: "",
    processing: "shadow-blue-500/50",
    success: "shadow-green-500/50",
    error: "shadow-red-500/50",
};

export default function Server({
    aktif = false,
    label = "Server",
    status = "idle",
    className = ""
}: ServerProps) {
    return (
        <motion.div
            className={`flex flex-col items-center gap-2 ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className={`
          relative w-24 h-28 rounded-lg
          bg-gradient-to-b ${statusColors[status]}
          shadow-lg ${aktif ? `shadow-xl ${statusGlow[status]}` : ""}
          flex flex-col items-center justify-center
          border border-white/10
        `}
                animate={aktif ? glowPulse.animate : {}}
            >
                {/* Server lights */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <motion.div
                        className={`w-2 h-2 rounded-full ${status === "processing" ? "bg-blue-400" : "bg-green-400"}`}
                        animate={status === "processing" ? { opacity: [1, 0.3, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <motion.div
                        className="w-2 h-2 rounded-full bg-yellow-400"
                        animate={status === "processing" ? { opacity: [0.3, 1, 0.3] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    />
                </div>

                {/* Server rack lines */}
                <div className="w-16 space-y-2">
                    <div className="h-3 bg-slate-800/50 rounded border border-white/5" />
                    <div className="h-3 bg-slate-800/50 rounded border border-white/5" />
                    <div className="h-3 bg-slate-800/50 rounded border border-white/5" />
                </div>

                {/* Status indicator */}
                {status === "processing" && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    />
                )}
            </motion.div>

            <span className="text-sm font-medium text-slate-300">{label}</span>
        </motion.div>
    );
}
