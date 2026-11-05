import type { Metadata } from "next";

import { MainNavbar, MainFooter } from "@/components/layout";
import NotFoundContent from "@/components/shared/NotFoundContent";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MainNavbar />
      <NotFoundContent />
      <MainFooter />
    </div>
  );
}
