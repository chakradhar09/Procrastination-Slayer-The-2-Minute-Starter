"use client";

import { useState } from "react";

type TaskInputProps = {
    task: string;
    setTask: (task: string) => void;
    onGenerate: (useLLM: boolean) => void;
    loading: boolean;
    status: string;
    userName: string;
    badDay: boolean;
    setBadDay: (v: boolean) => void;
    sprintLength: number;
    setSprintLength: (v: number) => void;
    onQuickFill: (text: string) => void;
};

export function TaskInput({
    task,
    setTask,
    onGenerate,
    loading,
    status,
    userName,
    badDay,
    setBadDay,
    sprintLength,
    setSprintLength,
    onQuickFill,
}: TaskInputProps) {
    return (
        <div className="glass-card p-8 border-glass-border shadow-glow relative overflow-hidden group">
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-neon-teal/20 to-neon-purple/20 blur-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-700" />

            <div className="relative z-10">
                <p className="uppercase text-xs font-bold text-neon-teal tracking-[0.25em] mb-2 animate-fade-in">
                    Procrastination Slayer
                </p>
                <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-text to-text-muted animate-fade-in animate-delay-100">
                    Start tiny. <br /> Win anyway.
                </h1>
                <p className="text-text-muted max-w-2xl mb-8 leading-relaxed animate-fade-in animate-delay-200">
                    Hi <span className="text-text font-semibold">{userName}</span>. Let's turn that scary task into a 2-minute starter, launch a sprint, and keep your streak alive.
                </p>

                <div className="space-y-4 animate-fade-in animate-delay-300">
                    <textarea
                        className="w-full text-lg shadow-inner bg-surface border-border focus:ring-brand-primary transition-colors"
                        rows={3}
                        placeholder="What's the one thing you're avoiding? (e.g. Study OS scheduling)"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            className="btn-primary flex-1 sm:flex-none flex items-center justify-center gap-2"
                            onClick={() => onGenerate(true)}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Thinking...
                                </span>
                            ) : (
                                <>
                                    <span>✨</span> Generate Plan
                                </>
                            )}
                        </button>

                        <button
                            className="btn-ghost"
                            onClick={() => onGenerate(false)}
                            disabled={loading}
                        >
                            Rule-based
                        </button>

                        <div className="w-px h-8 bg-border mx-2 hidden sm:block" />

                        <button
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${badDay
                                ? "bg-rose-500/10 border-rose-500/50 text-rose-500"
                                : "bg-surface border-border text-text-muted hover:text-text hover:bg-surface-highlight"
                                }`}
                            onClick={() => setBadDay(!badDay)}
                        >
                            {badDay ? "🚑 Bad Day Mode On" : "Bad Day Mode"}
                        </button>

                        <div className="flex bg-surface rounded-full p-1 border border-border">
                            {[10, 25].map((m) => (
                                <button
                                    key={m}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sprintLength === m
                                        ? "bg-brand-secondary text-white shadow-glow"
                                        : "text-text-muted hover:text-text"
                                        }`}
                                    onClick={() => setSprintLength(m)}
                                >
                                    {m}m
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-2">
                        <span className="text-xs font-medium text-text-muted py-1 uppercase tracking-wider">Try:</span>
                        {["Study OS scheduling", "Fix flaky test", "Write status email"].map((sample) => (
                            <button
                                key={sample}
                                className="text-xs px-3 py-1 rounded-full border border-border bg-surface text-text-muted hover:bg-surface-highlight hover:text-brand-primary hover:border-brand-primary transition-all"
                                onClick={() => onQuickFill(sample)}
                            >
                                {sample}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-neon-teal/80 h-6 pl-1 flex items-center gap-2">
                        {status && <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon-teal animate-pulse" />}
                        {status}
                    </p>
                </div>
            </div>
        </div>
    );
}
