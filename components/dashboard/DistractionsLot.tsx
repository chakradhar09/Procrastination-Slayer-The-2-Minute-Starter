"use client";

import { useState } from "react";

type DistractionsLotProps = {
    distractions: string[];
    onAdd: (text: string) => void;
    onClear: () => void;
    onRemove: (index: number) => void;
};

export function DistractionsLot({ distractions, onAdd, onClear, onRemove }: DistractionsLotProps) {
    const [input, setInput] = useState("");

    return (
        <div className="glass-card p-6 border-border h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-1">Distraction Lot</p>
                    <h3 className="text-lg font-semibold text-text">Park it, stay in flow</h3>
                </div>
                <button onClick={onClear} className="text-xs text-text-muted hover:text-text transition-colors">
                    Clear All
                </button>
            </div>

            <div className="flex gap-2 mb-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && input.trim()) {
                            onAdd(input);
                            setInput("");
                        }
                    }}
                    placeholder="Idea, itch, or thought..."
                    className="flex-1 bg-surface border-border rounded-lg text-sm"
                />
                <button
                    onClick={() => {
                        if (input.trim()) {
                            onAdd(input);
                            setInput("");
                        }
                    }}
                    className="p-2 aspect-square rounded-lg bg-surface hover:bg-surface-highlight text-text hover:text-neon-purple transition-all border border-border"
                >
                    +
                </button>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar flex-1">
                {distractions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-20 text-text-muted text-sm italic border-2 border-dashed border-border rounded-lg">
                        <p>No distractions yet.</p>
                        <p>Stay focused!</p>
                    </div>
                )}
                {distractions.map((d, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-text-muted transition-all animate-fade-in">
                        <span className="text-sm text-text truncate">{d}</span>
                        <button
                            onClick={() => onRemove(i)}
                            className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-rose-400 px-2 transition-all"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
