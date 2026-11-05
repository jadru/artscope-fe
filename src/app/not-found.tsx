import type { Metadata } from "next";

import { MainNavbar, MainFooter } from "@/components/layout";
import NotFoundContent from "@/components/shared/NotFoundContent";
import { NOT_FOUND_META } from "@/lib/detail-load";

export const metadata: Metadata = {
  ...NOT_FOUND_META,
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
