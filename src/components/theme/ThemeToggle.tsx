"use client";

import React from "react";
import { Monitor, Moon, SunMedium } from "lucide-react";

import { cn } from "@/utils";
import { useTheme } from "./theme-provider";

const OPTIONS = [
  { value: "light" as const, label: "Light", icon: SunMedium },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "auto" as const, label: "Auto", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/70 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur dark:border-white/15 dark:bg-white/10 dark:text-gray-200 md:flex"
      role="group"
      aria-label="테마 선택"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            type="button"
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2 dark:focus-visible:ring-white/60 dark:focus-visible:ring-offset-0",
              isActive
                ? "bg-white text-gray-900 shadow dark:bg-white/80 dark:text-black"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            )}
            aria-pressed={isActive}
            aria-label={`${label} 모드로 전환`}
            title={`${label} 모드`}
            onClick={() => setTheme(value)}
          >
            <Icon size={14} aria-hidden className="shrink-0" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
