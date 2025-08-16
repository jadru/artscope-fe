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
          "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
          "hover:bg-gray-100 hover:text-gray-900",
          "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-gray-100/50 before:to-gray-200/50 before:opacity-0 before:transition-opacity before:duration-200",
          "hover:before:opacity-100",
          isActive ? "text-gray-900 bg-gray-100 shadow-sm" : "text-gray-600",
          disabled && "pointer-events-none opacity-40 cursor-not-allowed"
        )}
      >
        {children}
        {isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <nav className="relative">
        {/* 배경 */}
        <div className="absolute inset-0 bg-background/95 backdrop-blur-xl border-b border-gray-200" />

        <div className="relative flex h-16 w-full items-center justify-between px-4 md:px-8">
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
          <div className="flex items-center space-x-3">
            {!user ? (
              !isLoading ? (
                <>
                  <Link href="/user/login">
                    <Button
                      variant="outline"
                      className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all duration-200"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/user/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                      회원가입
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex space-x-3">
                  <Skeleton className="w-20 h-9 rounded-lg" />
                  <Skeleton className="w-24 h-9 rounded-lg" />
                </div>
              )
            ) : (
              <>
                <Link href={`/profile/${user?.username}`}>
                  <Button
                    variant="outline"
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <span>내 프로필</span>
                    </div>
                  </Button>
                </Link>
                {!isEditor && (
                  <Link href="/editor">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
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
