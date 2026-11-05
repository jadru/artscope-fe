import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "스토리",
  description:
    "예술가(크리에이터)들의 작품과 생각을 포스팅하고 아카이브, 공유하는 커뮤니티 Artscope의 이야기입니다.",
};

// 사이트 소개(/about)와 메타 설명에 이미 쓰이고 있는 문구를 바탕으로 구성했다.
const values = [
  { title: "작품 공유", body: "작품을 등록하고, 공유하고, 홍보하세요." },
  { title: "아티스트 검색", body: "관심 있는 아티스트를 검색하고, 작품을 감상하세요." },
  { title: "커뮤니티", body: "다른 아티스트들과 기획자들과 소통하고, 의견을 나누세요." },
  { title: "이벤트", body: "예술에 관련된 이벤트를 주최하고 검색하고 참여하세요." },
];

export default function StoryPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
        Artscope 스토리
      </h1>
      <p className="mt-4 text-base leading-relaxed text-gray-600">
        Artscope는 창의적인 예술가들의 작품과 생각을 기록하고 공유하는 아카이브
        커뮤니티입니다. 예술가들이 자신의 작품을 공유하고, 다른 예술가들과
        소통하며, 함께 프로젝트를 진행할 수 있는 공간을 만들고 있어요.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <li key={value.title} className="rounded-lg bg-gray-50 p-5">
            <h2 className="text-base font-semibold text-gray-900">{value.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{value.body}</p>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-gray-600">
        더 자세한 이야기는 준비 중이에요. 그동안{" "}
        <Link href="/about" className="underline underline-offset-4 hover:text-gray-900">
          서비스 소개
        </Link>
        와{" "}
        <Link href="/gallery" className="underline underline-offset-4 hover:text-gray-900">
          갤러리
        </Link>
        를 둘러보세요.
      </p>
    </main>
  );
}
