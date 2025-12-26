"use client";

import { motion } from "framer-motion";
import { glowPulse } from "@/lib/animations";

interface ClientProps {
    aktif?: boolean;
    label?: string;
    status?: "idle" | "sending" | "waiting" | "receiving";
    className?: string;
}

const statusColors = {
    idle: "from-slate-700 to-slate-800",
    sending: "from-orange-500 to-orange-600",
    waiting: "from-yellow-500 to-yellow-600",
    receiving: "from-green-500 to-green-600",
};

export default function Client({
    aktif = false,
    label = "Browser",
    status = "idle",
    className = ""
}: ClientProps) {
    return (
        <motion.div
            className={`flex flex-col items-center gap-2 ${className}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className={`
          relative w-28 h-24 rounded-lg
          bg-gradient-to-b ${statusColors[status]}
          shadow-lg ${aktif ? "shadow-xl shadow-blue-500/30" : ""}
          border border-white/10 overflow-hidden
        `}
                animate={aktif ? glowPulse.animate : {}}
            >
                {/* Browser top bar */}
                <div className="h-5 bg-slate-900/50 flex items-center px-2 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <div className="flex-1 ml-2 h-2.5 bg-slate-700/50 rounded text-[6px] text-slate-400 flex items-center px-1">
                        🔒 https://
                    </div>
                </div>

                {/* Browser content area */}
                <div className="p-2 space-y-1">
                    <div className="h-2 bg-slate-600/30 rounded w-full" />
                    <div className="h-2 bg-slate-600/30 rounded w-3/4" />
                    <div className="h-2 bg-slate-600/30 rounded w-1/2" />
                </div>

                {/* Status animation */}
                {status === "sending" && (
                    <motion.div
                        className="absolute bottom-1 right-1 text-xs"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        📤
                    </motion.div>
                )}
                {status === "waiting" && (
                    <motion.div
                        className="absolute bottom-1 right-1 text-xs"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        ⏳
                    </motion.div>
                )}
                {status === "receiving" && (
                    <motion.div
                        className="absolute bottom-1 right-1 text-xs"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        📥
                    </motion.div>
                )}
            </motion.div>

            <span className="text-sm font-medium text-slate-300">{label}</span>
        </motion.div>
    );
}
