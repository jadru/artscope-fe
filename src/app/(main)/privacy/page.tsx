import type { Metadata } from "next";
import Link from "next/link";

import {
  PRIVACY_CONSENT_URL,
  PRIVACY_POLICY_URL,
  TERMS_OF_SERVICE_URL,
} from "@/constant/legal";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "Artscope 개인정보처리방침과 이용약관 안내입니다.",
};

const documents = [
  {
    title: "개인정보처리방침",
    description: "Artscope가 수집하는 개인정보 항목, 이용 목적, 보관 기간과 이용자의 권리를 안내합니다.",
    href: PRIVACY_POLICY_URL,
  },
  {
    title: "개인정보 수집·이용 동의",
    description: "회원가입 시 동의하는 개인정보 수집·이용 내용입니다.",
    href: PRIVACY_CONSENT_URL,
  },
  {
    title: "이용약관",
    description: "Artscope 서비스 이용에 관한 약관입니다.",
    href: TERMS_OF_SERVICE_URL,
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-20">
      <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
        개인정보처리방침
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
        Artscope의 개인정보처리방침 전문은 개인정보 처리방침 관리 서비스(plip)에
        게시되어 있습니다. 아래 링크에서 최신 전문을 확인하실 수 있어요.
      </p>

      <ul className="mt-8 space-y-3">
        {documents.map((doc) => (
          <li key={doc.title}>
            <a
              href={doc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="text-base font-medium text-gray-900">
                  {doc.title}
                </span>
                <span aria-hidden="true" className="text-gray-400">
                  ↗
                </span>
              </span>
              <span className="mt-1 block text-sm text-gray-600">
                {doc.description}
              </span>
              <span className="sr-only">(새 창에서 열림)</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-gray-600">
        <Link href="/" className="underline underline-offset-4 hover:text-gray-900">
          홈으로 돌아가기
        </Link>
      </p>
    </main>
  );
}
