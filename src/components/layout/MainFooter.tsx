"use client";

import Link from "next/link";

const footerLinks = [
  { label: "정보", href: "/about" },
  { label: "로보트", href: "/robots.txt" },
  { label: "권한", href: "/privacy" },
  { label: "이야기", href: "/story" },
];

export default function MainFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white px-4 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <nav className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ArtScope
        </p>
      </div>
    </footer>
  );
}
