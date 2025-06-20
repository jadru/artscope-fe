"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUser } from "@/states";
import Image from "next/image";

export default function Navbar() {
  const { isLogin, user } = useUser();
  return (
    <header className="flex h-20 w-screen shrink-0 items-center px-4 md:px-6 lg:px-8 sticky top-0 z-50 bg-background">
      <Link href="/" className="ml-6 md:mr-6 flex" prefetch={false}>
        <h1 className="text-2xl font-bold font-logo text-primary hover:text-blue-500">
          Artscope
        </h1>
      </Link>
      {!isLogin ? (
        <div className="ml-auto flex gap-2">
          <Link href="/user/login">
            <Button variant="outline">로그인</Button>
          </Link>
          <Link href="/user/signup">
            <Button>회원가입</Button>
          </Link>
        </div>
      ) : (
        <div className="ml-auto flex gap-2">
          <Link href={`/profile/${user?.username}`}>
            <Button variant="outline">내 프로필</Button>
          </Link>
          <Link href="/editor/dashboard">
            <Button>대시보드</Button>
          </Link>
        </div>
      )}
    </header>
  );
}
