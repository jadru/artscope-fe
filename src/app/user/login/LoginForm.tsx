import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { loginInputs, loginSchema } from "@/app/user/login/loginSchema";

import { loginResponseType } from "@/types/auth";
import { useProfile } from "@/auth/use-profile";

export default function LoginForm({ redirect }: { redirect: string | null }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { refetch } = useProfile();
  const router = useRouter();

  const onSubmit: SubmitHandler<loginInputs> = async (loginData) =>
    !isSubmitting &&
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
    }).then(async (res) => {
      const data: { username: string } = await res.json();
      if (res.status === 200 && data.username) {
        refetch();
        if (redirect) {
          router.replace(decodeURIComponent(redirect));
          router.refresh();
        } else {
          router.replace("/");
          router.refresh();
        }
      } else {
        toast.error("로그인에 실패했습니다.");
      }
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="아이디"
          autoComplete="username"
          formNoValidate={!!errors.username}
          {...register("username")}
        />
        <Input
          placeholder="비밀번호"
          type="password"
          autoComplete="current-password"
          formNoValidate={!!errors.password}
          {...register("password")}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "로그인 중..." : "로그인"}
      </Button>
    </form>
  );
}
