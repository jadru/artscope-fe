import { Metadata } from "next";
import React from "react";

import { MainNavbar, MainFooter } from "@/components/layout";

export const metadata: Metadata = {
  title: "회원 정보 관리",
  description: "회원 정보 관리 페이지입니다.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MainNavbar />
      <div className="mx-auto my-12 flex min-h-[calc(100vh-10rem)] w-full max-w-md flex-col items-stretch justify-center gap-2 p-4 pb-3">
        {children}
      </div>
      <MainFooter />
    </div>
  );
}
