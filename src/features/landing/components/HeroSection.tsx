"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  artistCount: number;
  artworkCount: number;
}

export default function HeroSection({
  artistCount,
  artworkCount,
}: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatter = new Intl.NumberFormat("ko-KR");

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          예술의 순간을
          <br />
          기록하고 &nbsp;나누세요
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/user/signup">
            <Button className="h-12 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-800">
              무료로 포트폴리오 만들기
            </Button>
          </Link>
          <Link href="/gallery">
            <Button
              variant="outline"
              className="h-12 rounded-full border-gray-300 px-8 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              갤러리 둘러보기
            </Button>
          </Link>
        </div>

        {mounted && artistCount > 0 && artworkCount > 0 && (
          <p className="mt-10 text-sm text-gray-500">
            현재 {formatter.format(artistCount)}명의 예술가가{" "}
            {formatter.format(artworkCount)}개의 작품을 기록하고 있어요.
          </p>
        )}
      </div>
    </section>
  );
}
