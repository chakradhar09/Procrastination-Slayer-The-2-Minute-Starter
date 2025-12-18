"use client";

type BadgeProps = {
    unlocked: boolean;
    title: string;
    desc: string;
    icon: string;
};

function Badge({ unlocked, title, desc, icon }: BadgeProps) {
    return (
        <div className={`p-4 rounded-2xl border transition-all duration-500 group relative overflow-hidden ${unlocked
            ? "bg-gradient-to-br from-neon-teal/10 to-transparent border-neon-teal/30 shadow-[0_0_15px_rgba(100,216,193,0.1)]"
            : "bg-white/5 border-white/5 opacity-50 grayscale"
            }`}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{icon}</span>
                {unlocked && <span className="text-[10px] font-bold uppercase tracking-wider text-neon-teal bg-neon-teal/10 px-2 py-0.5 rounded-full">Unlocked</span>}
            </div>
            <h4 className={`font-bold mb-1 ${unlocked ? "text-white" : "text-gray-400"}`}>{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

type GamificationProps = {
    streak: number;
    history: any[];
    starterCount?: number;
};

export function Gamification({ streak, history, starterCount = 0 }: GamificationProps) {
    return (
        <div className="glass-card p-6 border-border">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold mb-1">Achievements</p>
                    <h3 className="text-lg font-semibold text-text">Trophies & Badges</h3>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Badge
                    unlocked={history.length >= 1 || starterCount >= 1}
                    title="First Step"
                    desc="Complete your first starter"
                    icon="🌱"
                />
                <Badge
                    unlocked={streak >= 3}
                    title="On Fire"
                    desc="Maintain a 3-day streak"
                    icon="🔥"
                />
                <Badge
                    unlocked={history.some((h) => h.sprintLength >= 25)}
                    title="Deep Work"
                    desc="Finish a 25m sprint"
                    icon="🌊"
                />
                <Badge
                    unlocked={history.some((h) => h.mode === "Bad Day")}
                    title="Survivor"
                    desc="Complete a Bad Day task"
                    icon="🛡️"
                />
            </div>
        </div>
    );
}
