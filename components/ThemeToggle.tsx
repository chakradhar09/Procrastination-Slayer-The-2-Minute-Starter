"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("dark");

    useEffect(() => {
        // Check initial preference or local storage
        if (
            localStorage.theme === "light" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: light)").matches)
        ) {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light");
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="bg-surface glass-card border border-border p-2 rounded-full transition-all duration-300 hover:shadow-glow group"
            aria-label="Toggle Theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <div className="relative w-12 h-6 bg-black/10 dark:bg-black/40 rounded-full dark:border dark:border-white/10 border border-black/5 shadow-inner transition-colors">
                <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center
            ${theme === "dark" ? "translate-x-6 bg-slate-800 text-white" : "translate-x-0 bg-white text-yellow-500"}
          `}
                >
                    {theme === "dark" ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2" />
                            <path d="M12 20v2" />
                            <path d="m4.93 4.93 1.41 1.41" />
                            <path d="m17.66 17.66 1.41 1.41" />
                            <path d="M2 12h2" />
                            <path d="M20 12h2" />
                            <path d="m6.34 17.66-1.41 1.41" />
                            <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
}
