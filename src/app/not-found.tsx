"use client";

import Link from "next/link";
import * as React from "react";
import { RiAlarmWarningFill } from "react-icons/ri";

import { MainNavbar, MainFooter } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MainNavbar />
      <div className="flex flex-1 flex-col items-center justify-center text-center text-gray-900">
        <RiAlarmWarningFill size={60} className="animate-pulse text-red-500" />
        <h1 className="mt-8 text-4xl font-bold md:text-6xl">
          페이지를 찾을 수 없습니다
        </h1>
        <Link className="mb-8 mt-4" href="/">
          <Button className="rounded-full bg-gray-900 text-white hover:bg-gray-800">
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
      <MainFooter />
    </div>
  );
}
