import React, { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-0 m-0 min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  );
}
