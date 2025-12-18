"use client";

import { useEffect, useMemo, useState } from "react";
import { TaskInput } from "./dashboard/TaskInput";
import { PlanCard } from "./dashboard/PlanCard";
import { TimerDisplay } from "./dashboard/TimerDisplay";
import { DistractionsLot } from "./dashboard/DistractionsLot";
import { Gamification } from "./dashboard/Gamification";
import { HistoryLog } from "./dashboard/HistoryLog";
import { ThemeToggle } from "./ThemeToggle";

type TaskRecord = {
  _id?: string;
  text: string;
  starter: string;
  steps: string[];
  sprintLength: number;
  mode: string;
  createdAt?: string;
  completedAt?: string;
  status?: string;
};

type StarterPlan = {
  starter: string;
  steps: string[];
};

export function Dashboard({
  initialTasks,
  userName,
}: {
  initialTasks: TaskRecord[];
  userName: string;
}) {
  const [task, setTask] = useState("");
  const [plan, setPlan] = useState<StarterPlan | null>(null);
  const [history, setHistory] = useState<TaskRecord[]>(initialTasks || []);
  const [badDay, setBadDay] = useState(false);
  const [sprintLength, setSprintLength] = useState(10);
  const [status, setStatus] = useState("Ready for a tiny win.");
  const [distractions, setDistractions] = useState<string[]>([]);
  const [distractionText, setDistractionText] = useState("");
  const [phase, setPhase] = useState<"idle" | "starter" | "sprint">("idle");
  const [remaining, setRemaining] = useState(120);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [starterCount, setStarterCount] = useState(0);

  const streak = useMemo(() => {
    if (!history.length) return 0;
    const dates = history.map((h) => new Date(h.completedAt || h.createdAt || 0));
    dates.sort((a, b) => b.getTime() - a.getTime());
    let s = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff =
        (dates[i - 1].setHours(0, 0, 0, 0) - dates[i].setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24);
      if (diff === 1) s += 1;
      else if (diff > 1) break;
    }
    return s;
  }, [history]);

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const totalSeconds = phase === "starter" ? 120 : phase === "sprint" ? sprintLength * 60 : 0;
  const progressPercent =
    phase === "idle"
      ? 0
      : Math.min(100, ((totalSeconds - remaining) / Math.max(1, totalSeconds)) * 100);

  function format(sec: number) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  async function generatePlan(useLLM: boolean) {
    if (!task.trim()) {
      setStatus("Describe the task first.");
      return;
    }
    setStatus("Thinking...");
    try {
      const res = await fetch("/api/starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, badDay, sprintLength, llm: useLLM }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Guardrails blocked that request.");
        return;
      }
      const safeSteps = (data.plan?.steps as string[]) || [];
      setPlan({
        starter: data.plan?.starter ?? "",
        steps: badDay ? safeSteps.slice(0, 1) : safeSteps.slice(0, 3),
      });
      setStatus(data.source?.includes("gemini") ? data.source : "Rule-based plan ready.");
      resetTimer();
    } catch (e) {
      setStatus("Error generating plan.");
    }
  }

  function startTimer(mode: "starter" | "sprint") {
    if (!plan) {
      setStatus("Generate a starter first.");
      return;
    }
    const startSeconds = mode === "starter" ? 120 : sprintLength * 60;
    if (intervalId) clearInterval(intervalId);
    setPhase(mode);
    setRemaining(startSeconds);
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          if (mode === "starter") {
            setStarterCount((c) => c + 1);
            startTimer("sprint");
          } else {
            setStatus("Sprint done! Log it.");
            setPhase("idle");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(id);
    setStatus(mode === "starter" ? "Starter running..." : `${sprintLength}m sprint running...`);
  }

  function pauseTimer() {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    setStatus("Paused.");
  }

  function resetTimer() {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    setPhase("idle");
    setRemaining(120);
  }

  async function markDone() {
    if (!plan) {
      setStatus("Nothing to log yet.");
      return;
    }
    const payload: TaskRecord = {
      text: task,
      starter: plan.starter,
      steps: plan.steps,
      sprintLength,
      mode: badDay ? "Bad Day" : "Normal",
      status: "done",
    };
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      setHistory((h) => [data.task, ...h]);
      setStatus("Logged and streak updated.");
      setPlan(null); // Clear the plan so UI resets
      setTask(""); // Optional: clear the input
      resetTimer();
    } else {
      const err = await res.json();
      setStatus(err.error || "Unable to save task.");
    }
  }

  function addDistraction(text: string) {
    if (!text.trim()) return;
    setDistractions((d) => [text.trim(), ...d]);
  }

  const quickFill = (sample: string) => {
    setTask(sample);
  };

  const currentPhaseLabel =
    phase === "starter" ? "Starter (2m)" : phase === "sprint" ? `${sprintLength}m sprint` : "Idle";

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header / Toggle */}
      <div className="flex justify-end mb-[-40px] relative z-20">
        <ThemeToggle />
      </div>

      {/* Top Row: Input + Plan */}
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <TaskInput
          task={task}
          setTask={setTask}
          onGenerate={generatePlan}
          loading={status === "Thinking..."}
          status={status}
          userName={userName}
          badDay={badDay}
          setBadDay={setBadDay}
          sprintLength={sprintLength}
          setSprintLength={setSprintLength}
          onQuickFill={quickFill}
        />

        <PlanCard
          plan={plan}
          badDay={badDay}
          onStart={startTimer}
          onMarkDone={markDone}
          onReset={resetTimer}
          sprintLength={sprintLength}
          streak={streak}
          historyCount={history.length}
        />
      </div>

      {/* Middle Row: Timer + Distractions + Gamification */}
      <div className="grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[0.8fr_1.2fr] gap-6">
        <TimerDisplay
          remaining={remaining}
          phase={phase}
          totalSeconds={totalSeconds}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
        />

        <div className="grid sm:grid-cols-2 gap-6 h-full">
          <DistractionsLot
            distractions={distractions}
            onAdd={addDistraction}
            onClear={() => setDistractions([])}
            onRemove={(i) => setDistractions(d => d.filter((_, idx) => idx !== i))}
          />
          <Gamification streak={streak} history={history} starterCount={starterCount} />
        </div>
      </div>

      {/* Bottom Row: History */}
      <HistoryLog history={history} />
    </div>
  );
}
