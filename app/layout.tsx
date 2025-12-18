import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "../components/providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procrastination Slayer • 2-Minute Starter",
  description: "Turn scary tasks into tiny starters, run sprints, and keep streaks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <main className="max-w-7xl mx-auto px-5 py-10">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
