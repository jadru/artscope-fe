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
          "px-3 py-2 text-sm font-light transition-colors duration-200",
          isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900",
          disabled && "pointer-events-none opacity-40 cursor-not-allowed"
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav>
        <div className="flex h-14 w-full items-center justify-between px-6">
          {/* 로고 섹션 */}
          <Link
            href="/"
            prefetch={false}
            className="flex items-center space-x-2"
          >
            <h1 className="text-xl font-light text-gray-900">Artscope</h1>
          </Link>

          {/* 네비게이션 링크들 */}
          {user && isEditor && (
            <div className="hidden md:flex items-center space-x-6">
              <NavBarLinkItem href="/editor">아티클</NavBarLinkItem>
              <NavBarLinkItem href="/editor/statistics" disabled>
                통계
              </NavBarLinkItem>
              <NavBarLinkItem href="/editor/settings">설정</NavBarLinkItem>
            </div>
          )}

          {/* 사용자 액션 섹션 */}
          <div className="flex items-center space-x-4">
            {!user ? (
              !isLoading ? (
                <>
                  <Link href="/user/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 font-light"
                    >
                      로그인
                    </Button>
                  </Link>
                  <Link href="/user/signup">
                    <Button
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800 text-white font-light"
                    >
                      회원가입
                    </Button>
                  </Link>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Skeleton className="w-16 h-8 rounded" />
                  <Skeleton className="w-20 h-8 rounded" />
                </div>
              )
            ) : (
              <>
                <Link href={`/profile/${user?.username}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 font-light"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-xs font-light text-gray-600">
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
                      className="bg-gray-900 hover:bg-gray-800 text-white font-light"
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
