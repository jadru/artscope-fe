import React from "react";

import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col text-white/90">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
