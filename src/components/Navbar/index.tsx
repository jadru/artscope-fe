"use client";

import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/auth/use-profile";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/utils";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ProfileMenu } from "@/components/Navbar/ProfileMenu";

const NAV_ITEMS = [
  { href: "/gallery", label: "Discovery" },
  { href: "/artists", label: "Artists" },
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
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    return (
      <Link
        href={disabled ? "#" : href}
        className={cn(
          "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-gray-900 text-white shadow dark:bg-white/20 dark:text-white dark:shadow-[0_0_20px_rgba(180,139,255,0.6)]"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 text-gray-900 backdrop-blur dark:border-white/5 dark:bg-[#050307]/80 dark:text-white">
      <nav>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href={logoHref}
            prefetch={false}
            className="flex items-center space-x-2"
          >
            <h1 className="text-lg font-semibold tracking-[0.2em] text-gray-900 dark:text-white">
              ArtScopeKR
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 px-2 py-1 shadow-sm dark:border-white/10 dark:bg-white/5">
              {NAV_ITEMS.map((nav) => (
                <NavBarLinkItem key={nav.href} {...nav} />
              ))}
            </div>
            {isEditor && (
              <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/80 px-2 py-1 shadow-sm dark:border-white/10 dark:bg-white/5">
                {EDITOR_NAV_ITEMS.map((nav) => (
                  <NavBarLinkItem key={nav.href} {...nav} />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {!user ? (
              !isLoading ? (
                <>
                  <Link href="/user/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/user/signup">
                    <Button
                      size="sm"
                      className="bg-gray-900 text-white shadow-sm hover:bg-black dark:bg-gradient-to-r dark:from-[#8c4bff] dark:via-[#c778ff] dark:to-[#f0a1ff] dark:text-black dark:shadow-lg dark:shadow-purple-900/40"
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
                <ProfileMenu user={user} />
                {!isEditor && (
                  <Link href="/editor/new">
                    <Button
                      size="sm"
                      className="bg-gray-900 text-white hover:bg-black dark:bg-gradient-to-r dark:from-[#7144ff] dark:via-[#b568ff] dark:to-[#f07dff] dark:text-black dark:shadow-lg dark:shadow-purple-900/40"
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
