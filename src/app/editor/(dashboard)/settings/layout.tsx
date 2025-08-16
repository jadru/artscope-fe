"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    {
      category: "DEFAULT",
      items: [
        { href: "/editor/settings", label: "계정", icon: "👤" },
        { href: "/editor/settings/artist", label: "작가 정보", icon: "🎨" },
        { href: "/editor/settings/notification", label: "알림", icon: "🔔" },
      ],
    },
    {
      category: "TEAM",
      items: [{ href: "/editor/settings/team", label: "팀 관리", icon: "👥" }],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 사이드바 네비게이션 */}
          <nav className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">설정</h2>

              <div className="space-y-6">
                {navItems.map((section) => (
                  <div key={section.category}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                              ${
                                isActive
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }
                            `}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                            {isActive && (
                              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
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
