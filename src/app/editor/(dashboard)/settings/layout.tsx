"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { User, Palette, Bell, Users } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      category: "개인 설정",
      items: [
        {
          href: "/editor/settings",
          label: "계정",
          icon: User,
        },
        {
          href: "/editor/settings/artist",
          label: "작가 정보",
          icon: Palette,
        },
        {
          href: "/editor/settings/notification",
          label: "알림",
          icon: Bell,
        },
      ],
    },
    {
      category: "팀 설정",
      items: [
        {
          href: "/editor/settings/team",
          label: "팀 관리",
          icon: Users,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* 사이드바 네비게이션 */}
          <nav className="w-64 flex-shrink-0">
            <div className="sticky top-8 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#1A1A1A]">
              <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
                설정
              </h2>

              <div className="space-y-6">
                {navItems.map((section) => (
                  <div key={section.category}>
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {section.category}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </nav>

          {/* 메인 콘텐츠 */}
          <div className="flex-1 space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
