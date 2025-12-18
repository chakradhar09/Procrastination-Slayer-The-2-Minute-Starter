const $ = (id) => document.getElementById(id);
const taskInput = $("taskInput");
const generateBtn = $("generateBtn");
const ruleOnlyBtn = $("ruleOnlyBtn");
const safeMode = $("safeMode");
const startBtn = $("startBtn");
const completeBtn = $("completeBtn");
const resetBtn = $("resetBtn");
const playBtn = $("playBtn");
const pauseBtn = $("pauseBtn");
const skipBtn = $("skipBtn");
const toggleNotifications = $("toggleNotifications");
const starterTimerEl = $("starterTimer");
const sprintTimerEl = $("sprintTimer");
const timerDisplay = $("timerDisplay");
const timerSub = $("timerSub");
const progressBar = $("progressBar");
const tickMarks = $("tickMarks");
const timerState = $("timerState");
const starterStep = $("starterStep");
const stepEls = [starterStep, $("step1"), $("step2"), $("step3")];
const quickStarterBtn = $("quickStarterBtn");
const badDayBtn = $("badDayBtn");
const modeTag = $("modeTag");
const levelTag = $("levelTag");
const streakTag = $("streakTag");
const distractionInput = $("distractionInput");
const distractionList = $("distractionList");
const addDistraction = $("addDistraction");
const clearDistractions = $("clearDistractions");
const badgeRack = $("badgeRack");
const badgesHint = $("badgesHint");
const historyList = $("historyList");
const clearHistory = $("clearHistory");
const toastEl = $("toast");
const startHero = $("startHero");
const resetHero = $("resetHero");

const STORAGE_KEY = "procrastination-slayer-v1";

const defaultState = {
  history: [],
  streak: { current: 0, lastCompletedDate: null },
  distractions: [],
  level: 1,
};

let appState = loadState();
let currentPlan = null;
let badDayMode = false;
let sprintLength = 10;
let intervalId = null;
let timerPhase = "starter";
let remainingSeconds = 120;
let notificationsEnabled = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    return { ...defaultState, ...JSON.parse(raw) };
  } catch (e) {
    console.warn("Failed to load state", e);
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function safeGuard(text) {
  const forbidden = [
    "ignore previous",
    "sudo",
    "rm -rf",
    "hack",
    "delete",
    "violent",
    "weapon",
    "bypass",
    "jailbreak",
    "prompt injection",
    "system prompt",
    "sex",
    "nsfw",
  ];
  const lowered = text.toLowerCase();
  const tooLong = text.length > 220;
  const hasForbidden = forbidden.some((f) => lowered.includes(f));
  const looksLikeCode = lowered.includes(";") && lowered.includes("{");
  return !text.trim() || tooLong || hasForbidden || looksLikeCode;
}

function ruleBasedPlan(task) {
  const lowered = task.toLowerCase();
  if (lowered.match(/study|learn|revise|read/)) {
    return {
      starter: "Open notes, name a section, and list 3 headings.",
      steps: [
        "Write 3 bullets of what you already know.",
        "Skim one page/slide and capture 3 key terms.",
        "Answer one easy check: define 1 concept.",
      ],
    };
  }
  if (lowered.match(/code|bug|fix|build|commit/)) {
    return {
      starter: "Open the repo, run it once, and note the failing area.",
      steps: [
        "Write a 3-bullet plan in TODO form.",
        "Add one log or test to see the current behavior.",
        "Make one small change and verify locally.",
      ],
    };
  }
  if (lowered.match(/assignment|report|essay|write/)) {
    return {
      starter: "Create the doc, add a title, and drop 3 outline bullets.",
      steps: [
        "Draft a rough intro sentence.",
        "Fill one outline bullet with 2 sentences.",
        "Add a source or citation placeholder.",
      ],
    };
  }
  if (lowered.match(/email|reach out|follow up/)) {
    return {
      starter: "Open your email and draft a 3-line skeleton: greet, ask, close.",
      steps: [
        "Fill in one specific ask or update.",
        "Attach or link the needed file/resource.",
        "Add a clear next step and send/save draft.",
      ],
    };
  }
  return {
    starter: "Write the tiniest next move you can finish in 2 minutes.",
    steps: [
      "Write 3 bullets for what success looks like.",
      "Do one tiny action that takes <5 min.",
      "Leave a note for future you on what's next.",
    ],
  };
}

function generatePlan(task, { allowLLM }) {
  if (safeMode.checked && safeGuard(task)) {
    toast("Guardrails blocked that. Keep it about a task.");
    return null;
  }
  const trimmed = task.trim();
  if (!trimmed) {
    toast("Describe the task first.");
    return null;
  }

  // Deterministic pseudo-LLM: we keep it narrow to next steps only.
  const plan = ruleBasedPlan(trimmed);
  if (allowLLM) {
    const verbs = ["Write", "Draft", "Sketch", "List", "Outline"];
    const nouns = ["bullets", "notes", "questions", "risks", "next moves"];
    const starter = `${verbs[trimmed.length % verbs.length]} 3 ${nouns[trimmed.length % nouns.length]} about the task, then take one screenshot/note.`;
    const extra = [
      "Clarify the goal in one crisp sentence.",
      "Timebox 5 minutes to make measurable micro-steps.",
      "Commit to the first micro-step and start the timer.",
    ];
    plan.starter = starter;
    plan.steps = badDayMode ? [extra[0]] : extra;
  } else if (badDayMode) {
    plan.steps = [plan.steps[0]];
  }

  currentPlan = {
    task: trimmed,
    starter: plan.starter,
    steps: plan.steps.slice(0, badDayMode ? 1 : 3),
    createdAt: new Date().toISOString(),
    sprintLength,
    mode: badDayMode ? "Bad Day" : "Normal",
  };

  timerPhase = "starter";
  remainingSeconds = 120;
  resetTimer();
  renderPlan();
  toast("Starter ready. Protect the first 2 minutes.");
  return currentPlan;
}

function renderPlan() {
  if (!currentPlan) return;
  const allSteps = [currentPlan.starter, ...currentPlan.steps];
  stepEls.forEach((el, idx) => {
    const text = allSteps[idx];
    const label = el.querySelector(".step-label");
    const body = el.querySelector(".step-text");
    label.textContent = idx === 0 ? "Starter (≤2 min)" : `Step ${idx}`;
    body.textContent = text || "Tiny step goes here.";
    body.classList.remove("muted");
  });
  modeTag.textContent = badDayMode ? "Bad Day mode" : "Normal mode";
  timerSub.textContent = "Starter phase";
  updateTimerDisplays();
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerDisplays() {
  const starterSeconds = 120;
  const sprintSeconds = sprintLength * 60;
  starterTimerEl.textContent = formatTime(starterSeconds);
  sprintTimerEl.textContent = formatTime(sprintSeconds);
  if (timerPhase === "starter") {
    timerDisplay.textContent = formatTime(remainingSeconds);
    timerSub.textContent = "Starter phase";
  } else if (timerPhase === "sprint") {
    timerDisplay.textContent = formatTime(remainingSeconds);
    timerSub.textContent = `${sprintLength} min sprint`;
  } else {
    timerDisplay.textContent = formatTime(starterSeconds);
    timerSub.textContent = "Starter phase";
  }
}

function updateProgress() {
  const total =
    timerPhase === "starter" ? 120 : sprintLength * 60 || 600;
  const done = total - remainingSeconds;
  const percent = Math.min(100, (done / total) * 100);
  progressBar.style.width = `${percent}%`;
}

function setTicks() {
  tickMarks.innerHTML = "";
  const marks = timerPhase === "starter" ? 2 : sprintLength / 5 + 1;
  for (let i = 0; i < marks; i++) {
    const span = document.createElement("span");
    span.textContent = "|";
    tickMarks.appendChild(span);
  }
}

function startTimer() {
  if (!currentPlan) {
    toast("Generate a starter first.");
    return;
  }
  clearInterval(intervalId);
  timerState.textContent = timerPhase === "starter" ? "Starter running" : "Sprint running";
  timerState.className = "pill tiny timer-state-running";
  intervalId = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      updateTimerDisplays();
      updateProgress();
      clearInterval(intervalId);
      if (timerPhase === "starter") {
        timerPhase = "sprint";
        remainingSeconds = sprintLength * 60;
        setTicks();
        toast("Starter done. Sprint unlocked.");
        if (notificationsEnabled) notifyUser("Starter finished. Begin the sprint.");
        startTimer();
      } else {
        timerState.textContent = "Timer done";
        timerState.className = "pill tiny timer-state-done";
        if (notificationsEnabled) notifyUser("Sprint finished. Wrap it up!");
      }
    } else {
      updateTimerDisplays();
      updateProgress();
    }
  }, 1000);
  setTicks();
}

function pauseTimer() {
  clearInterval(intervalId);
  timerState.textContent = "Paused";
  timerState.className = "pill tiny timer-state-paused";
}

function resetTimer() {
  clearInterval(intervalId);
  timerPhase = "starter";
  remainingSeconds = 120;
  timerState.textContent = "Idle";
  timerState.className = "pill tiny";
  updateTimerDisplays();
  updateProgress();
  setTicks();
}

function skipToSprint() {
  if (!currentPlan) {
    toast("Generate a starter first.");
    return;
  }
  timerPhase = "sprint";
  remainingSeconds = sprintLength * 60;
  startTimer();
}

function completeSession() {
  if (!currentPlan) {
    toast("Nothing to complete. Add a task first.");
    return;
  }
  const finished = {
    ...currentPlan,
    completedAt: new Date().toISOString(),
    status: "done",
  };
  appState.history.unshift(finished);
  updateStreak();
  updateLevel();
  unlockBadges(finished);
  saveState();
  renderHistory();
  renderBadges();
  toast("Logged. Streak updated!");
  resetTimer();
}

function updateStreak() {
  if (!appState.history.length && !appState.streak.lastCompletedDate) {
    appState.streak = { current: 0, lastCompletedDate: null };
    streakTag.textContent = "🔥 0-day streak";
    return;
  }
  const today = new Date().toDateString();
  const last = appState.streak.lastCompletedDate;
  if (!last) {
    appState.streak = { current: 1, lastCompletedDate: today };
  } else {
    const lastDate = new Date(last);
    const diff = Math.floor(
      (new Date(today) - new Date(lastDate.toDateString())) / (1000 * 60 * 60 * 24)
    );
    if (diff === 0) {
      // same day, keep streak count
      appState.streak.lastCompletedDate = today;
    } else if (diff === 1) {
      appState.streak.current += 1;
      appState.streak.lastCompletedDate = today;
    } else {
      appState.streak = { current: 1, lastCompletedDate: today };
    }
  }
  streakTag.textContent = `🔥 ${appState.streak.current}-day streak`;
}

function updateLevel() {
  const completed = appState.history.length;
  const level = 1 + Math.floor(completed / 4);
  appState.level = level;
  levelTag.textContent = `Lvl ${level}`;
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!appState.history.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No sessions yet. Start tiny!";
    historyList.appendChild(li);
    return;
  }
  appState.history.slice(0, 30).forEach((item) => {
    const li = document.createElement("li");
    const date = new Date(item.completedAt || item.createdAt).toLocaleString();
    li.innerHTML = `
      <span>${item.task}</span>
      <span class="muted">${item.mode} • ${item.sprintLength}m</span>
      <span class="muted">${date}</span>
      <span class="pill tiny subtle">${item.status || "incomplete"}</span>
    `;
    historyList.appendChild(li);
  });
}

function renderDistractions() {
  distractionList.innerHTML = "";
  if (!appState.distractions.length) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "Nothing parked. Stay in the pocket.";
    distractionList.appendChild(li);
    return;
  }
  appState.distractions.forEach((d, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${d}</span>
      <button aria-label="remove" data-idx="${idx}">✕</button>
    `;
    distractionList.appendChild(li);
  });
}

function renderBadges() {
  const badgeEls = badgeRack.querySelectorAll(".badge");
  badgeEls.forEach((el) => el.classList.add("locked"));

  const unlock = (index) => badgeEls[index]?.classList.replace("locked", "unlocked");
  if (appState.history.length >= 1) unlock(0);
  if (appState.streak.current >= 3) unlock(1);
  if (appState.history.some((h) => h.sprintLength >= 25)) unlock(2);
  if (appState.history.some((h) => h.mode === "Bad Day")) unlock(3);
}

function unlockBadges(finished) {
  renderBadges();
}

function setSprintLength(minutes) {
  sprintLength = minutes;
  sprintTimerEl.textContent = formatTime(minutes * 60);
  toast(`${minutes} min sprint selected`);
}

function toggleBadDay() {
  badDayMode = !badDayMode;
  badDayBtn.classList.toggle("primary", badDayMode);
  badDayBtn.setAttribute("aria-pressed", badDayMode ? "true" : "false");
  modeTag.textContent = badDayMode ? "Bad Day mode" : "Normal mode";
  toast(badDayMode ? "Bad Day mode: only one tiny step." : "Normal mode on.");
  if (currentPlan) {
    generatePlan(currentPlan.task, { allowLLM: false });
  }
}

function addDistractionItem() {
  const text = distractionInput.value.trim();
  if (!text) return;
  appState.distractions.unshift(text);
  distractionInput.value = "";
  saveState();
  renderDistractions();
}

function notifyUser(message) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("Procrastination Slayer", { body: message });
  }
}

function init() {
  renderHistory();
  renderDistractions();
  renderBadges();
  updateStreak();
  updateLevel();
  setTicks();
  updateTimerDisplays();
  updateProgress();

  generateBtn.addEventListener("click", () => generatePlan(taskInput.value, { allowLLM: true }));
  ruleOnlyBtn.addEventListener("click", () => generatePlan(taskInput.value, { allowLLM: false }));
  quickStarterBtn.addEventListener("click", () => {
    if (!taskInput.value.trim()) taskInput.value = "Study OS scheduling";
    generatePlan(taskInput.value, { allowLLM: true });
  });
  startBtn.addEventListener("click", startTimer);
  completeBtn.addEventListener("click", completeSession);
  resetBtn.addEventListener("click", resetTimer);
  playBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  skipBtn.addEventListener("click", skipToSprint);
  clearDistractions.addEventListener("click", () => {
    appState.distractions = [];
    saveState();
    renderDistractions();
  });
  addDistraction.addEventListener("click", addDistractionItem);
  distractionInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addDistractionItem();
  });
  badgeRack.addEventListener("click", () => {
    toast("Warm-up, Streaky, Deep Diver, Unflappable. Earn them by showing up.");
  });
  badgesHint.addEventListener("click", () => {
    toast("Complete starters, keep streaks, finish a 25 min sprint, use Bad Day mode.");
  });
  clearHistory.addEventListener("click", () => {
    appState.history = [];
    saveState();
    renderHistory();
    toast("History cleared.");
  });
  badDayBtn.addEventListener("click", toggleBadDay);
  startHero.addEventListener("click", startTimer);
  resetHero.addEventListener("click", resetTimer);
  toggleNotifications.addEventListener("click", () => {
    if (!("Notification" in window)) {
      toast("Notifications not supported.");
      return;
    }
    Notification.requestPermission().then((perm) => {
      notificationsEnabled = perm === "granted";
      toggleNotifications.textContent = notificationsEnabled ? "Reminders on" : "Enable reminders";
      toast(notificationsEnabled ? "Reminders on." : "Reminders off.");
    });
  });

  document.querySelectorAll("[data-sprint]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const minutes = Number(btn.dataset.sprint);
      setSprintLength(minutes);
      if (timerPhase === "sprint") {
        remainingSeconds = minutes * 60;
        updateTimerDisplays();
      }
    });
  });

  distractionList.addEventListener("click", (e) => {
    if (e.target.dataset.idx) {
      const idx = Number(e.target.dataset.idx);
      appState.distractions.splice(idx, 1);
      saveState();
      renderDistractions();
    }
  });
}

window.addEventListener("load", init);
