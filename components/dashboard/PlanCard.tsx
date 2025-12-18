"use client";

type PlanCardProps = {
    plan: {
        starter: string;
        steps: string[];
    } | null;
    badDay: boolean;
    onStart: (mode: "starter" | "sprint") => void;
    onReset: () => void;
    onMarkDone: () => void;
    sprintLength: number;
    streak: number;
    historyCount: number;
};

export function PlanCard({
    plan,
    badDay,
    onStart,
    onReset,
    onMarkDone,
    sprintLength,
    streak,
    historyCount,
}: PlanCardProps) {
    return (
        <div className="glass-card p-8 flex flex-col gap-6 h-full border-border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-1">Your Mission</p>
                    <h3 className="text-2xl font-display font-bold text-text">
                        {plan ? "Ready to launch" : "Awaiting Mission"}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-neon-purple shadow-[0_0_10px_rgba(122,124,255,0.2)]">
                        {badDay ? "MODE: SURVIVAL" : "MODE: NORMAL"}
                    </div>
                </div>
            </div>

            <div className="flex-1 space-y-4">
                {/* Starter Step */}
                <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${plan ? 'bg-neon-teal/10 border-neon-teal/30' : 'bg-surface border-border'}`}>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-neon-teal">Starter (2m)</span>
                            {plan && <span className="text-xs text-neon-teal animate-pulse">● Active</span>}
                        </div>
                        <p className={`font-medium text-lg ${plan ? 'text-text' : 'text-text-muted italic'}`}>
                            {plan?.starter || "Generate a plan to see your tiny starter..."}
                        </p>
                    </div>
                    {plan && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-teal to-transparent opacity-50" />}
                </div>

                {/* Sprint Steps */}
                <div className="space-y-3 relative">
                    {!plan && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <p className="text-text-muted text-sm">Steps will materialize here</p>
                        </div>
                    )}

                    {(plan ? plan.steps : ["Placeholder 1", "Placeholder 2", "Placeholder 3"]).map((step, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-xl border transition-all duration-300 ${plan
                                ? 'bg-surface border-border hover:bg-surface-highlight'
                                : 'bg-surface-highlight/50 border-border blur-[2px] opacity-50'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-surface text-xs font-mono text-text-muted border border-border">
                                    {i + 1}
                                </div>
                                <p className="text-text/80 text-sm leading-relaxed">{step}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <button
                    onClick={() => onStart("starter")}
                    className="btn-primary flex-1"
                    disabled={!plan}
                >
                    Start Mission
                </button>
                <button className="btn-ghost px-4" onClick={() => onStart("sprint")} disabled={!plan}>
                    Skip to Sprint
                </button>
                <button className="btn-icon-only text-emerald-400 hover:bg-emerald-400/10" onClick={onMarkDone} disabled={!plan} title="Complete Mission">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <button className="btn-icon-only text-text-muted hover:text-text" onClick={onReset} title="Reset">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 bg-surface border border-border rounded-xl">
                <div className="text-center border-r border-border">
                    <div className="text-xs text-text-muted uppercase">Sprint</div>
                    <div className="font-mono font-bold text-text">{sprintLength}m</div>
                </div>
                <div className="text-center border-r border-border">
                    <div className="text-xs text-text-muted uppercase">Streak</div>
                    <div className="font-mono font-bold text-neon-teal">{streak}🔥</div>
                </div>
                <div className="text-center">
                    <div className="text-xs text-text-muted uppercase">Total</div>
                    <div className="font-mono font-bold text-text">{historyCount}</div>
                </div>
            </div>
        </div>
    );
}
