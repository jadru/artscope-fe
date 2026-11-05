import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "갤러리",
  description: "Artscope 아티스트들이 공유한 작품을 둘러보세요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
