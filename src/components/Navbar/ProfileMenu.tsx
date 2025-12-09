"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ProfileMenuProps {
  user: {
    username: string;
    name?: string;
    email?: string;
    profileImage?: string;
  };
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const router = useRouter();

  const handleSignOut = () => {
    router.push("/user/signout");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          aria-label="프로필 메뉴"
        >
          {user.profileImage ? (
            <div className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image
                src={user.profileImage}
                alt={user.name || user.username}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <span className="text-sm font-semibold">
              {user.username?.charAt(0).toUpperCase()}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        {/* User Info Section */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={user.name || user.username}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                  {user.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {user.name || user.username}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                @{user.username}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* Menu Items */}
        <div className="p-1">
          {/* Profile */}
          <Link href={`/profile/${user.username}`}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 text-left font-medium text-gray-700 dark:text-gray-300">
                내 프로필
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </Link>

          {/* My Articles */}
          <Link href="/editor">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 text-left font-medium text-gray-700 dark:text-gray-300">
                내 아티클
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </Link>

          {/* Settings */}
          <Link href="/user/settings">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
              <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 text-left font-medium text-gray-700 dark:text-gray-300">
                설정
              </span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
          </Link>
        </div>

        <Separator className="bg-gray-100 dark:bg-gray-800" />

        {/* Sign Out */}
        <div className="p-1">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-950"
          >
            <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="flex-1 text-left font-medium text-red-600 dark:text-red-400">
              로그아웃
            </span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
