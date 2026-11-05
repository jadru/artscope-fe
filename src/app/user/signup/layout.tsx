import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "회원가입 | 창의적인 예술가들의 아카이브 커뮤니티 Artscope" },
  description: "Artscope에 가입하고 나만의 포트폴리오를 만들어 보세요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
