"use client";

import { motion } from "framer-motion";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

interface SmartNumberInputProps {
    label: string;
    value: number;
    onChange: (val: number) => void;
    min: number;
    max: number;
    step?: number;
    unit: string;
    color: "blue" | "green" | "purple" | "yellow" | "red";
    disabled?: boolean;
}

const colorMap = {
    blue: "text-blue-400 accent-blue-500 border-blue-500/30 focus:border-blue-500",
    green: "text-green-400 accent-green-500 border-green-500/30 focus:border-green-500",
    purple: "text-purple-400 accent-purple-500 border-purple-500/30 focus:border-purple-500",
    yellow: "text-yellow-400 accent-yellow-500 border-yellow-500/30 focus:border-yellow-500",
    red: "text-red-400 accent-red-500 border-red-500/30 focus:border-red-500",
};

export default function SmartNumberInput({
    label,
    value,
    onChange,
    min,
    max,
    step = 1,
    unit,
    color,
    disabled = false
}: SmartNumberInputProps) {
    const handleStep = (direction: -1 | 1) => {
        const newValue = Math.min(Math.max(value + step * direction, min), max);
        onChange(Number(newValue.toFixed(2)));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseFloat(e.target.value);
        if (isNaN(val)) return; // Allow typing
        // Don't clamp immediately while typing to allow backspacing, but maybe on blur?
        // For simple controlled input, let's just pass it and let parent handle or clamp on blur.
        // For now, simple clamp to avoid breaking visuals too much
        onChange(val);
    };

    const handleBlur = () => {
        let clamped = Math.min(Math.max(value, min), max);
        onChange(Number(clamped.toFixed(2)));
    };

    return (
        <div className={`space-y-2 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
            <div className="flex justify-between items-center">
                <label className={`text-xs font-bold uppercase tracking-wider ${colorMap[color].split(" ")[0]}`}>
                    {label}
                </label>
            </div>

            <div className="flex items-center gap-3">
                {/* Decrement Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStep(-1)}
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                >
                    <MinusIcon className="w-4 h-4" />
                </motion.button>

                {/* Slider */}
                <div className="flex-1 relative group">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer ${colorMap[color].split(" ")[1]}`}
                    />
                </div>

                {/* Increment Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStep(1)}
                    className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                </motion.button>

                {/* Manual Input */}
                <div className="relative w-24">
                    <input
                        type="number"
                        value={value}
                        onChange={handleTextChange}
                        onBlur={handleBlur}
                        step={step}
                        className={`
                            w-full bg-slate-900/50 border rounded-lg px-2 py-1.5 text-right font-mono text-sm text-white
                            focus:outline-none focus:ring-1 focus:ring-opacity-50
                            ${colorMap[color].split(" ").slice(2).join(" ")}
                        `}
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none mr-1">

                    </span>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none">
                        {unit}
                    </span>
                </div>
            </div>
        </div>
    );
}
