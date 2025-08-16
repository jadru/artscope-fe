"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/auth/use-profile";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar({ isEditor }: { isEditor?: boolean }) {
  const { data: user, isLoading } = useProfile();
  const pathname = usePathname();

  const NavBarLinkItem = ({
    href,
    children,
    disabled,
  }: {
    href: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={disabled ? "#" : href}
        className={cn(
          "px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
          "hover:text-gray-900 hover:bg-gray-50",
          isActive ? "text-gray-900 bg-gray-50" : "text-gray-600",
          disabled && "pointer-events-none opacity-40 cursor-not-allowed"
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="relative">
        {/* 배경 */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border-b border-gray-100" />

        <div className="relative flex h-14 w-full items-center justify-between px-4 md:px-6">
          {/* 로고 섹션 */}
          <Link
            href="/"
            prefetch={false}
            className="group relative flex items-center space-x-2 transition-transform duration-200 hover:scale-105"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-200" />
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                <h1 className="text-2xl font-bold tracking-tight">Artscope</h1>
              </div>
            </div>
          </Link>

          {/* 네비게이션 링크들 */}
          {user && isEditor && (
            <div className="hidden md:flex items-center space-x-1">
              <NavBarLinkItem href="/editor">아티클</NavBarLinkItem>
              <NavBarLinkItem href="/editor/statistics" disabled>
                통계
              </NavBarLinkItem>
              <NavBarLinkItem href="/editor/settings">설정</NavBarLinkItem>
            </div>
          )}

          {/* 사용자 액션 섹션 */}
          <div className="flex items-center space-x-2">
            {!user ? (
              !isLoading ? (
                <>
                  <Link href="/user/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/user/signup">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      회원가입
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Skeleton className="w-16 h-8 rounded-md" />
                  <Skeleton className="w-20 h-8 rounded-md" />
                </div>
              )
            ) : (
              <>
                <Link href={`/profile/${user?.username}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-medium text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden sm:inline">내 프로필</span>
                    </div>
                  </Button>
                </Link>
                {!isEditor && (
                  <Link href="/editor">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      대시보드
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
