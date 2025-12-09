"use client";

import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="m-0 min-h-screen p-0">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
