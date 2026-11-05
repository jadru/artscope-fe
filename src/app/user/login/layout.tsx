import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "로그인 | 창의적인 예술가들의 아카이브 커뮤니티 Artscope" },
  description: "Artscope 계정으로 로그인하세요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
