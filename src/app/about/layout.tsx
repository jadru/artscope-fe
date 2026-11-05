import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
  description: "Artscope는 예술가들의 작품과 생각을 기록하고 공유하는 아카이브 커뮤니티입니다.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
