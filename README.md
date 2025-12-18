# Procrastination Slayer – Next.js + MongoDB + Gemini

Full-stack Next.js app that turns any scary task into a 2-minute starter, launches a sprint, and syncs streaks/history to MongoDB. Uses guarded Gemini calls with rule-based fallback to avoid prompt injection abuse.

## Stack
- Next.js 14 (App Router) + React 18 + Tailwind
- Auth: NextAuth (credentials) + MongoDB
- Data: Mongoose models for users/tasks
- AI: Google Gemini (`@google/generative-ai`) with strict prompt and guardrail checks

## Setup
1) Install deps: `npm install`
2) Add `.env.local`:
```
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash   # optional override; defaults to this
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_a_strong_secret
``` 
3) Run: `npm run dev` then open `http://localhost:3000`

## Features
- Guarded starter generation: Gemini (or rule-based fallback) with prompt-injection filters and JSON-only parsing.
- 2-minute starter timer + 10/25-min sprint, pause/skip/reset.
- Account-based history in MongoDB; streaks/levels/badges computed client-side.
- Bad Day mode (single micro-step), distraction lot (client state), bold UI with glassmorphism.

## API routes
- `POST /api/register` – create user (hashed password)
- `GET/POST /api/tasks` – list/create completed sessions for the signed-in user
- `DELETE /api/tasks/:id` – delete a session
- `POST /api/starter` – guarded starter generation (uses Gemini when enabled, else rule-based)

## Safety notes
- Guardrails block long/off-topic/prompt-injection inputs before hitting Gemini.
- Prompt instructs Gemini to return strict JSON with only starter/steps and to ignore attempts to change instructions.
- If Gemini is unavailable or validation fails, app falls back to deterministic rule-based steps.
"# Procrastination-Slayer-The-2-Minute-Starter" 
