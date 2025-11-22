"use client";

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/auth/use-profile";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/gallery", label: "Discovery" },
  { href: "/list", label: "AI Curator" },
];
const EDITOR_NAV_ITEMS = [
  { href: "/editor", label: "아티클" },
  { href: "/editor/statistics", label: "통계", disabled: true },
  { href: "/editor/settings", label: "설정" },
];

export default function Navbar({ isEditor }: { isEditor?: boolean }) {
  const { data: user, isLoading } = useProfile();
  const pathname = usePathname();
  const logoHref = user ? "/gallery" : "/";

  const NavBarLinkItem = ({
    href,
    label,
    disabled,
  }: {
    href: string;
    label: string;
    disabled?: boolean;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={disabled ? "#" : href}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-white/20 text-white shadow-[0_0_20px_rgba(180,139,255,0.6)]"
            : "text-gray-300 hover:text-white",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050307]/80 backdrop-blur-2xl">
      <nav>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={logoHref}
            prefetch={false}
            className="flex items-center space-x-2"
          >
            <h1 className="text-lg font-semibold tracking-[0.2em] text-white">
              ArtScopeKR
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
              {NAV_ITEMS.map((nav) => (
                <NavBarLinkItem key={nav.href} {...nav} />
              ))}
            </div>
            {isEditor && (
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1">
                {EDITOR_NAV_ITEMS.map((nav) => (
                  <NavBarLinkItem key={nav.href} {...nav} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!user ? (
              !isLoading ? (
                <>
                  <Link href="/user/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-300 hover:text-white"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/user/signup">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#8c4bff] via-[#c778ff] to-[#f0a1ff] text-black font-medium shadow-lg shadow-purple-900/40"
                    >
                      회원가입
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Skeleton className="w-16 h-8 rounded-full" />
                  <Skeleton className="w-20 h-8 rounded-full" />
                </div>
              )
            ) : (
              <>
                <Link href={`/profile/${user?.username}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
                    aria-label="내 프로필"
                  >
                    <span className="text-sm font-semibold">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </Button>
                </Link>
                {!isEditor && (
                  <Link href="/editor/new">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#7144ff] via-[#b568ff] to-[#f07dff] text-black font-semibold shadow-lg shadow-purple-900/40"
                    >
                      작품 업로드
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
