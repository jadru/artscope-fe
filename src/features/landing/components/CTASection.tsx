"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
          당신의 예술 세계를 시작하세요
        </h2>

        <div className="mt-8">
          <Link href="/user/signup">
            <Button className="h-12 rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-800">
              가입하기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
