"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import { useProfile } from "@/auth/use-profile";

export default function LoginNeeded({ href }: { href: string }) {
  const { data: user } = useProfile();
  return !user ? (
    <Link href={href}>
      <Button color="primary" className="opacity-50 hover:opacity-100">
        로그인이 필요합니다.
      </Button>
    </Link>
  ) : (
    <></>
  );
}
