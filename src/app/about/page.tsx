"use client";

import Link from "next/link";
import React from "react";
import { BiBrush, BiCalendar, BiGroup } from "react-icons/bi";
import { GiTalk } from "react-icons/gi";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="flex flex-col min-h-[100vh] pt-14">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 container mx-auto max-w-screen-xl">
          <div className="container px-4 md:px-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                예술가를 위한 커뮤니티, Artscope입니다.
              </h1>
              <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400 pb-4">
                예술가들이 자신의 작품을 공유하고, 다른 예술가들과 소통하며,
                함께 프로젝트를 진행할 수 있는 공간을 제공합니다.
              </p>
              <Link href="/user/login" className="appearance-none">
                <Button color="primary">커뮤니티에 참여하기</Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-zinc-100 dark:bg-zinc-800">
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-4 text-center">
                <BiBrush className="h-8 w-8" />
                <h3 className="text-2xl font-bold">작품 공유</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  작품을 등록하고,
                  <br />
                  공유하고, 홍보하세요.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <BiGroup className="h-8 w-8" />
                <h3 className="text-2xl font-bold">아티스트 검색</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  관심 있는 아티스트를 검색하고,
                  <br /> 작품을 감상하세요.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <GiTalk className="h-8 w-8" />
                <h3 className="text-2xl font-bold">커뮤니티</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  다른 아티스트들과 기획자들과 소통하고,
                  <br /> 의견을 나누세요.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <BiCalendar className="h-8 w-8" />
                <h3 className="text-2xl font-bold">이벤트</h3>
                <p className="text-zinc-500 dark:text-zinc-400">
                  예술에 관련된 이벤트를 주최하고
                  <br />
                  검색하고 참여하세요.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
