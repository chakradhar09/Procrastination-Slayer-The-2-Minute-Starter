"use client";

type HistoryLogProps = {
    history: any[];
};

export function HistoryLog({ history }: HistoryLogProps) {
    return (
        <div className="glass-card p-8 border-glass-border">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Logbook</p>
                    <h3 className="text-2xl font-display font-bold text-white">Recent Victories</h3>
                </div>
            </div>

            <div className="space-y-3">
                {history.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-gray-500 mb-2">No victories entered yet.</p>
                        <p className="text-neon-teal">Go seize the day!</p>
                    </div>
                )}
                {history.map((item) => (
                    <div
                        key={item._id || item.createdAt}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300"
                    >
                        <div className="mb-2 sm:mb-0">
                            <h4 className="font-semibold text-gray-200 group-hover:text-white transition-colors">{item.text}</h4>
                            <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                <span className={`px-2 py-0.5 rounded-full ${item.mode === "Bad Day" ? "bg-rose-500/10 text-rose-300" : "bg-neon-purple/10 text-neon-purple"}`}>
                                    {item.mode}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                    {item.sprintLength}m sprint
                                </span>
                                <span>
                                    {new Date(item.completedAt || item.createdAt || "").toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-emerald-400/10 border border-emerald-400/20">
                                {item.status || "Done"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {history.length > 5 && (
                <div className="mt-6 text-center">
                    <button className="text-xs text-gray-500 hover:text-white underline transition-colors">
                        View Full History
                    </button>
                </div>
            )}
        </div>
    );
}
