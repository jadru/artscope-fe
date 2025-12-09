"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";

import { useProfile } from "@/auth/use-profile";
import { cn } from "@/utils";

const NAV_ITEMS = [
  { href: "/gallery", label: "Discovery" },
  { href: "/artists", label: "Artists" },
];

export default function MainNavbar() {
  const pathname = usePathname();
  const { data: user } = useProfile();

  // Check if we're on landing page (show simplified navbar)
  const isLandingPage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href={user ? "/gallery" : "/"}
          className="text-lg font-semibold text-gray-900"
        >
          ArtScope
        </Link>

        {/* Center Navigation - hide on landing page */}
        {!isLandingPage && (
          <div className="hidden items-center gap-1 rounded-full border border-gray-200 bg-white px-1 py-1 sm:flex">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-900"
            aria-label="검색"
          >
            <Search className="h-5 w-5" />
          </button>

          {user ? (
            <Link
              href={`/profile/${user.username}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-900 hover:bg-gray-200"
              aria-label="내 프로필"
            >
              {user.username?.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link
              href="/user/login"
              className="p-2 text-gray-500 hover:text-gray-900"
              aria-label="로그인"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
