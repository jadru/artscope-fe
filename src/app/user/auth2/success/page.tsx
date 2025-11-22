"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { AiOutlineCoffee } from "react-icons/ai";
import { toast } from "react-toastify";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";

const RedirectOAuth2 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }

    const controller = new AbortController();

    const applyRefreshToken = async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: token,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("refresh failed");
        }

        router.refresh();
        router.push("/");
      } catch (error) {
        toast.error("로그인에 실패했습니다.");
        router.push("/");
      }
    };

    applyRefreshToken();

    return () => controller.abort();
  }, [router, token]);

  return (
    <>
      <Title title="로그인 성공" description="로그인이 완료되었습니다." />
      <AiOutlineCoffee size={60} className="drop-shadow-glow text-orange-800" />
      <Link className="my-8" href="/">
        <Button color="primary">홈으로 돌아가기</Button>
      </Link>
    </>
  );
};

export default RedirectOAuth2;
