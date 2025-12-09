import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { BiPalette, BiPen, BiUser } from "react-icons/bi";

import { MainNavbar, MainFooter } from "@/components/layout";
import Title from "@/components/shared/Title";

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
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-screen-xl flex-col items-stretch gap-2 p-2 pb-3 md:flex-row md:p-4">
        <div className="flex flex-row gap-1 p-2 md:h-full md:w-1/4 md:flex-col">
          <UserSettingNavigation />
        </div>
        <div className="flex flex-col gap-2 p-3 md:w-3/4">
          <Title
            title="회원 정보"
            description="회원 정보를 변경할 수 있습니다."
          />
          {children}
        </div>
      </div>
      <MainFooter />
    </div>
  );
}

const UserSettingNavigation = () => (
  <>
    <Link
      href="/user/settings"
      className="flex gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
    >
      <BiUser size={20} />
      계정 관리
    </Link>
    <Link
      href="/user/settings/profile"
      className="flex gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
    >
      <BiPalette size={20} />
      프로필 관리
    </Link>
    <Link
      href="#"
      className="flex gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-gray-100"
    >
      <BiPen size={20} />
      컨텐츠 관리
    </Link>
  </>
);
