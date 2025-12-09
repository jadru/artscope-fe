import React from "react";

import { MainNavbar, MainFooter } from "@/components/layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-white">
      <MainNavbar />
      <div className="flex-1">{children}</div>
      <MainFooter />
    </div>
  );
}
