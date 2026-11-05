"use client";

import Link from "next/link";

import { TERMS_OF_SERVICE_URL } from "@/constant/legal";

const footerLinks = [
  { label: "소개", href: "/about" },
  { label: "스토리", href: "/story" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: TERMS_OF_SERVICE_URL, external: true },
];

export default function MainFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <nav aria-label="사이트 정보" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="inline-flex min-h-6 items-center text-xs text-gray-500 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} ArtScope
        </p>
      </div>
    </footer>
  );
}
