import React from "react";

import Footer from "@/components/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-0 m-0 min-h-screen">
      {children}
      <Footer />
    </div>
  );
}
