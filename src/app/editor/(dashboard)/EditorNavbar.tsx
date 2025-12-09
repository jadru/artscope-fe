"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { PenSquare } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function EditorNavbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/editor") {
      return pathname === "/editor";
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="flex flex-none flex-row items-center gap-3 text-sm font-medium md:gap-5 lg:gap-6">
      <Link href="/">
        <span className="font-logo -tracking-[.05em] text-2xl font-black text-gray-900 dark:text-gray-50">
          ARTSCOPE
        </span>
      </Link>

      <Link
        className={`transition-colors ${
          isActive("/editor") && !isActive("/editor/settings")
            ? "font-semibold text-gray-900 dark:text-gray-50"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/editor"
      >
        아티클
      </Link>

      <Link
        className={`transition-colors ${
          isActive("/editor/settings")
            ? "font-semibold text-gray-900 dark:text-gray-50"
            : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        }`}
        href="/editor/settings"
      >
        설정
      </Link>

      <Link href="/editor/new">
        <Button
          variant="outline"
          className="gap-2 rounded-full border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
        >
          <PenSquare className="h-4 w-4" />
          새 아티클
        </Button>
      </Link>
    </nav>
  );
}
