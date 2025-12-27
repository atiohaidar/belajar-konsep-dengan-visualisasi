"use client";

import { motion } from "framer-motion";

interface LineGraphProps {
    title: string;
    dataPoints: { x: number; y: number }[];
    xLabel: string;
    yLabel: string;
    color: string;
    currentX?: number;
    currentY?: number;
    yDomain?: [number, number];
    xDomain?: [number, number];
    graphHeight?: number;
}

export default function LineGraph({
    title,
    dataPoints,
    xLabel,
    yLabel,
    color,
    currentX,
    currentY,
    yDomain,
    xDomain,
    graphHeight = 120,
}: LineGraphProps) {
    const xValues = dataPoints.map(p => p.x);
    const yValues = dataPoints.map(p => p.y);

    const xMinDefault = xValues.length > 0 ? Math.min(...xValues) : 0;
    const xMaxDefault = xValues.length > 0 ? Math.max(...xValues) : 10;
    const yMinDefault = yValues.length > 0 ? Math.min(...yValues) : 0;
    const yMaxDefault = yValues.length > 0 ? Math.max(...yValues) : 10;

    const xMin = xDomain ? xDomain[0] : xMinDefault;
    const xMax = xDomain ? xDomain[1] : xMaxDefault;
    const yMin = yDomain ? yDomain[0] : yMinDefault;
    const yMax = yDomain ? yDomain[1] : yMaxDefault;

    const xRange = Math.abs(xMax - xMin) < 1e-6 ? 1 : (xMax - xMin);
    const yRange = Math.abs(yMax - yMin) < 1e-6 ? 1 : (yMax - yMin);

    const computedYMin = yMin - yRange * 0.1;
    const computedYMax = yMax + yRange * 0.1;
    const computedYRange = computedYMax - computedYMin;

    const mapX = (x: number) => ((x - xMin) / xRange) * 100;
    const mapY = (y: number) => 100 - ((y - computedYMin) / computedYRange) * 100;

    const visiblePoints = currentX !== undefined
        ? dataPoints.filter(p => p.x <= currentX)
        : dataPoints;

    const pathD = visiblePoints.length > 0
        ? `M ${mapX(visiblePoints[0].x)} ${mapY(visiblePoints[0].y)} ` +
        visiblePoints.slice(1).map(p => `L ${mapX(p.x)} ${mapY(p.y)}`).join(' ')
        : '';

    let finalPathD = pathD;
    if (currentX !== undefined && currentY !== undefined && visiblePoints.length > 0) {
        const lastVisibleX = visiblePoints[visiblePoints.length - 1].x;
        if (currentX > lastVisibleX) {
            finalPathD += ` L ${mapX(currentX)} ${mapY(currentY)}`;
        }
    }

    const markerXPct = currentX !== undefined ? mapX(currentX) : 0;
    const markerYPct = currentY !== undefined ? mapY(currentY) : 0;

    return (
        <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3 border border-slate-700">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="text-xs font-bold" style={{ color }}>{title}</div>
                <div className="text-[10px] text-slate-500">
                    Max: {yMax.toFixed(1)} / Min: {yMin.toFixed(1)}
                </div>
            </div>

            {/* Graph Container */}
            <div className="flex">
                {/* Y Axis Label (rotated, left side) */}
                <div className="flex items-center justify-center text-[9px] text-slate-400" style={{ width: '14px', height: graphHeight }}>
                    <span className="-rotate-90 whitespace-nowrap">{yLabel}</span>
                </div>

                {/* Y Axis Values */}
                <div className="flex flex-col justify-between text-[9px] text-slate-400 pr-1" style={{ width: '28px', height: graphHeight }}>
                    <span className="text-right leading-none">{computedYMax.toFixed(0)}</span>
                    <span className="text-right leading-none">{((computedYMin + computedYMax) / 2).toFixed(0)}</span>
                    <span className="text-right leading-none">{computedYMin.toFixed(0)}</span>
                </div>

                {/* Graph Area */}
                <div className="flex-1 flex flex-col">
                    <div className="relative" style={{ height: graphHeight }}>
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(y => (
                                <line key={`h-${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                            ))}
                            {[0, 25, 50, 75, 100].map(x => (
                                <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#334155" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                            ))}

                            {/* Zero Line */}
                            {(() => {
                                const zeroY = mapY(0);
                                if (zeroY >= 0 && zeroY <= 100) {
                                    return <line x1="0" y1={zeroY} x2="100" y2={zeroY} stroke="#64748b" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
                                }
                                return null;
                            })()}

                            {/* Data Line */}
                            {finalPathD && (
                                <path
                                    d={finalPathD}
                                    fill="none"
                                    stroke={color}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                />
                            )}
                        </svg>

                        {/* HTML Marker Overlay */}
                        {currentX !== undefined && currentY !== undefined && (
                            <div
                                className="absolute w-2 h-2 rounded-full bg-white border-2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    left: `${markerXPct}%`,
                                    top: `${markerYPct}%`,
                                    borderColor: color,
                                    boxShadow: `0 0 6px ${color}`
                                }}
                            />
                        )}
                    </div>

                    {/* X Axis Values */}
                    <div className="flex justify-between text-[9px] text-slate-400 pt-1">
                        <span>{xMin.toFixed(1)}</span>
                        <span>{((xMin + xMax) / 2).toFixed(1)}</span>
                        <span>{xMax.toFixed(1)}</span>
                    </div>

                    {/* X Axis Label (centered at bottom) */}
                    <div className="text-center text-[9px] text-slate-400 mt-1">
                        {xLabel}
                    </div>
                </div>
            </div>
        </div>
    );
}
