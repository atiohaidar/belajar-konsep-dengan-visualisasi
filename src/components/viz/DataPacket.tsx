"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DataPacketProps {
    visible: boolean;
    fromX: number;
    toX: number;
    fromY?: number;
    toY?: number;
    tipe?: "request" | "response" | "data";
    label?: string;
    className?: string;
}

const tipeStyles = {
    request: {
        bg: "from-orange-400 to-orange-500",
        icon: "📤",
        shadow: "shadow-orange-500/50"
    },
    response: {
        bg: "from-green-400 to-green-500",
        icon: "📥",
        shadow: "shadow-green-500/50"
    },
    data: {
        bg: "from-blue-400 to-blue-500",
        icon: "📦",
        shadow: "shadow-blue-500/50"
    }
};

export default function DataPacket({
    visible,
    fromX,
    toX,
    fromY = 0,
    toY = 0,
    tipe = "data",
    label,
    className = ""
}: DataPacketProps) {
    const style = tipeStyles[tipe];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={`absolute flex flex-col items-center ${className}`}
                    initial={{
                        x: fromX,
                        y: fromY,
                        opacity: 0,
                        scale: 0.3
                    }}
                    animate={{
                        x: toX,
                        y: toY,
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.3,
                        transition: { duration: 0.2 }
                    }}
                    transition={{
                        duration: 1.2,
                        type: "spring",
                        stiffness: 50,
                        damping: 12
                    }}
                >
                    {/* Paket utama */}
                    <motion.div
                        className={`
              relative px-3 py-2 rounded-lg
              bg-gradient-to-r ${style.bg}
              shadow-lg ${style.shadow}
              border border-white/20
              flex items-center gap-2
            `}
                        animate={{
                            y: [0, -3, 0],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <span className="text-lg">{style.icon}</span>
                        {label && (
                            <span className="text-xs font-medium text-white whitespace-nowrap">
                                {label}
                            </span>
                        )}

                        {/* Glowing trail effect */}
                        <motion.div
                            className={`absolute inset-0 rounded-lg bg-gradient-to-r ${style.bg} blur-md -z-10`}
                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
