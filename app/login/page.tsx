"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (mode === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign up failed");
        setLoading(false);
        return;
      }
    }
    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid credentials");
    } else {
      router.push(callbackUrl as any);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-teal/20 rounded-full blur-[100px] -translate-y-1/2 -z-10 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] -z-10 animate-float" />

      <div className="glass-card p-10 w-full max-w-md border-glass-border relative z-10">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-neon-teal font-bold mb-2">Procrastination Slayer</p>
          <h1 className="text-4xl font-display font-bold mb-2 text-text">{mode === "login" ? "Welcome back" : "Join the club"}</h1>
          <p className="text-text-muted">Guarded 2-minute starters + streaks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1">
              <input
                required
                placeholder="Name"
                className="w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

          )}
          <div className="space-y-1">
            <input
              required
              type="email"
              placeholder="Email"
              className="w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <input
              required
              type="password"
              placeholder="Password (min 6 chars)"
              className="w-full"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg text-center">{error}</p>}

          <button
            type="submit"
            className="btn-primary w-full py-4 text-base shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            className="text-sm text-text-muted hover:text-text transition-colors underline decoration-text-muted/20 hover:decoration-text"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
          >
            {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
