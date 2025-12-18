"use client";

import { useEffect, useState } from "react";

type TimerDisplayProps = {
    remaining: number;
    phase: "idle" | "starter" | "sprint";
    totalSeconds: number;
    onStart: (mode: "starter") => void;
    onPause: () => void;
    onReset: () => void;
};

export function TimerDisplay({
    remaining,
    phase,
    totalSeconds,
    onStart,
    onPause,
    onReset,
}: TimerDisplayProps) {
    const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

    function format(sec: number) {
        const m = String(Math.floor(sec / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${m}:${s}`;
    }

    return (
        <div className="glass-card p-8 flex flex-col justify-between border-border relative overflow-hidden h-full">
            {/* Background Progress Circle (Decorative) */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[20px] border-surface-highlight opacity-50 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-1">Focus Timer</p>
                    <div className="flex items-baseline gap-3">
                        <h3 className="text-6xl font-display font-bold text-text tabular-nums tracking-tighter">
                            {format(remaining)}
                        </h3>
                        <span className="text-xl text-text-muted font-medium">
                            {phase === "idle" ? "Ready" : phase === "starter" ? "Starter" : "Sprint"}
                        </span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-4xl font-bold text-text/10 font-display">
                        {Math.round(progress)}%
                    </div>
                </div>
            </div>

            <div className="relative py-8 z-10">
                {/* Progress Bar Container */}
                <div className="h-4 w-full bg-surface border border-border shadow-inner rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-neon-teal to-neon-purple transition-all duration-1000 ease-linear shadow-[0_0_20px_rgba(100,216,193,0.4)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {/* Phase Markers */}
                <div className="flex justify-between text-xs text-text-muted mt-2 font-mono uppercase">
                    <span>Start</span>
                    <span>Finish</span>
                </div>
            </div>

            <div className="flex gap-3 relative z-10">
                {phase === "idle" ? (
                    <button className="btn-primary w-full shadow-glow" onClick={() => onStart("starter")}>
                        Start Timer
                    </button>
                ) : (
                    <>
                        <button className="btn-ghost flex-1 border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10" onClick={onPause}>
                            Pause
                        </button>
                        <button className="btn-ghost flex-1" onClick={onReset}>
                            Reset
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
