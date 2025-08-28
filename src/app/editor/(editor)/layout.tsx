"use client";

import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
